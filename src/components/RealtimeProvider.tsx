"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode, useRef } from 'react';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useGameStore } from '@/store/gameStore';

interface RealtimeContextType {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectedPlayers: any[];
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  reconnectAttempts: number;
  maxReconnectAttempts: number;
  joinGame: (roomCode: string) => Promise<void>;
  leaveGame: (roomCode: string) => Promise<void>;
  sendPlayerAction: (action: any) => Promise<any>;
  sendVote: (voterId: string, targetId: string) => Promise<any>;
  sendPhaseChange: (phase: string) => Promise<any>;
  sendNightAction: (playerId: string, action: any) => Promise<any>;
  eliminatePlayer: (playerId: string) => Promise<any>;
  revealRole: (playerId: string, role: string) => Promise<any>;
  forceReconnect: () => Promise<void>;
  getConnectionStats: () => {
    latency: number;
    packetLoss: number;
    uptime: number;
  };
}

const RealtimeContext = createContext<RealtimeContextType | undefined>(undefined);

interface RealtimeProviderProps {
  children: ReactNode;
  roomCode?: string;
}

export const RealtimeProvider: React.FC<RealtimeProviderProps> = ({ 
  children, 
  roomCode 
}) => {
  const { currentGame, currentPlayer, setCurrentGame, updatePlayer, syncGameState, syncPlayerState } = useGameStore();
  const {
    isConnected,
    isConnecting,
    error,
    joinGame: realtimeJoinGame,
    leaveGame: realtimeLeaveGame,
    sendPlayerAction: realtimeSendPlayerAction,
    sendVote: realtimeSendVote,
    sendPhaseChange: realtimeSendPhaseChange,
    sendNightAction: realtimeSendNightAction,
    eliminatePlayer: realtimeEliminatePlayer,
    revealRole: realtimeRevealRole,
    getConnectedPlayers,
  } = useSupabaseRealtime(currentPlayer?.id);

  const [connectedPlayers, setConnectedPlayers] = useState<any[]>([]);
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('excellent');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);
  
  // Références pour la gestion des métriques de connexion
  const connectionStartTime = useRef<Date>(new Date());
  const lastPingTime = useRef<Date>(new Date());
  const pingLatencies = useRef<number[]>([]);
  const failedPings = useRef<number>(0);
  const totalPings = useRef<number>(0);

  // Fonction pour mesurer la latence
  const measureLatency = async (): Promise<number> => {
    const start = Date.now();
    try {
      // Envoyer un ping simple via l'API
      const response = await fetch(`/api/games/${roomCode}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'ping',
          playerId: currentPlayer?.id || 'system',
          targetId: null,
          actionData: { timestamp: start },
        }),
      });
      
      if (response.ok) {
        const latency = Date.now() - start;
        pingLatencies.current.push(latency);
        
        // Garder seulement les 10 dernières mesures
        if (pingLatencies.current.length > 10) {
          pingLatencies.current.shift();
        }
        
        totalPings.current++;
        lastPingTime.current = new Date();
        return latency;
      } else {
        failedPings.current++;
        totalPings.current++;
        throw new Error('Ping failed');
      }
    } catch (error) {
      failedPings.current++;
      totalPings.current++;
      return -1;
    }
  };

  // Fonction pour évaluer la qualité de la connexion
  const evaluateConnectionQuality = (latency: number) => {
    if (latency === -1) {
      setConnectionQuality('disconnected');
      return;
    }
    
    if (latency < 50) {
      setConnectionQuality('excellent');
    } else if (latency < 150) {
      setConnectionQuality('good');
    } else {
      setConnectionQuality('poor');
    }
  };

  // Fonction pour forcer une reconnexion
  const forceReconnect = async () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    setReconnectAttempts(prev => prev + 1);
    console.log(`🔄 Reconnexion forcée ${reconnectAttempts + 1}/${maxReconnectAttempts}`);

    try {
      // Se déconnecter d'abord
      if (roomCode) {
        await realtimeLeaveGame(roomCode);
      }
      
      // Attendre un court délai
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Tenter de se reconnecter
      if (roomCode) {
        await realtimeJoinGame(roomCode);
      }
    } catch (error) {
      console.error('Erreur lors de la reconnexion forcée:', error);
    }
  };

  // Fonction pour obtenir les statistiques de connexion
  const getConnectionStats = () => {
    const now = new Date();
    const uptime = now.getTime() - connectionStartTime.current.getTime();
    
    const avgLatency = pingLatencies.current.length > 0 
      ? pingLatencies.current.reduce((a, b) => a + b, 0) / pingLatencies.current.length 
      : 0;
    
    const packetLoss = totalPings.current > 0 
      ? (failedPings.current / totalPings.current) * 100 
      : 0;
    
    return {
      latency: Math.round(avgLatency),
      packetLoss: Math.round(packetLoss * 100) / 100,
      uptime: Math.round(uptime / 1000),
    };
  };

  // Rejoindre automatiquement le jeu quand le roomCode change
  useEffect(() => {
    if (roomCode && !isConnected && !isConnecting) {
      realtimeJoinGame(roomCode);
    }
  }, [roomCode, isConnected, isConnecting, realtimeJoinGame]);

  // Mettre à jour la liste des joueurs connectés
  useEffect(() => {
    const updateConnectedPlayers = () => {
      const players = getConnectedPlayers();
      setConnectedPlayers(players);
    };

    updateConnectedPlayers();
    const interval = setInterval(updateConnectedPlayers, 5000); // Mise à jour toutes les 5 secondes

    return () => clearInterval(interval);
  }, [getConnectedPlayers]);

  // Mesurer la latence périodiquement
  useEffect(() => {
    if (isConnected && roomCode) {
      const latencyInterval = setInterval(async () => {
        const latency = await measureLatency();
        evaluateConnectionQuality(latency);
      }, 10000); // Mesurer toutes les 10 secondes

      return () => clearInterval(latencyInterval);
    }
  }, [isConnected, roomCode]);

  // Gérer les tentatives de reconnexion automatique
  useEffect(() => {
    if (!isConnected && !isConnecting && reconnectAttempts < maxReconnectAttempts) {
      const reconnectTimer = setTimeout(() => {
        forceReconnect();
      }, 5000 * (reconnectAttempts + 1)); // Délai exponentiel

      return () => clearTimeout(reconnectTimer);
    }
  }, [isConnected, isConnecting, reconnectAttempts, maxReconnectAttempts]);

  // Écouter les événements de mise à jour du jeu
  useEffect(() => {
    if (!isConnected) return;

    const handleGameStateUpdated = (event: CustomEvent) => {
      const { gameState } = event.detail;
      if (gameState && currentGame?.id === gameState.id) {
        // Utiliser la nouvelle fonction de synchronisation
        syncGameState(gameState);
      }
    };

    const handlePlayerActionReceived = (event: CustomEvent) => {
      const action = event.detail;
      console.log('Player action received:', action);
      
      switch (action.type) {
        case 'vote':
          updatePlayer(action.playerId, { voteTarget: action.targetId });
          break;
        case 'useAbility':
          updatePlayer(action.playerId, { hasUsedAbility: true });
          break;
        case 'eliminatePlayer':
          updatePlayer(action.playerId, { status: 'eliminated' });
          break;
        case 'roleRevealed':
          updatePlayer(action.playerId, { role: action.role });
          break;
        case 'ping':
          // Répondre au ping pour mesurer la latence
          console.log('🏓 Ping reçu, latence mesurée');
          break;
        default:
          console.log('Unknown action type:', action.type);
      }
    };

    const handlePhaseChanged = (event: CustomEvent) => {
      const { phase } = event.detail;
      console.log('Phase changed:', phase);
      if (currentGame) {
        setCurrentGame({ ...currentGame, phase });
      }
    };

    const handleVoteReceived = (event: CustomEvent) => {
      const { voterId, targetId } = event.detail;
      console.log('Vote received:', { voterId, targetId });
      updatePlayer(voterId, { voteTarget: targetId });
    };

    const handlePlayerEliminated = (event: CustomEvent) => {
      const { playerId } = event.detail;
      console.log('Player eliminated:', playerId);
      updatePlayer(playerId, { status: 'eliminated' });
    };

    const handleRoleRevealed = (event: CustomEvent) => {
      const { playerId, role } = event.detail;
      console.log('Role revealed:', { playerId, role });
      updatePlayer(playerId, { role });
    };

    // Ajouter les écouteurs d'événements
    window.addEventListener('gameStateUpdated', handleGameStateUpdated as EventListener);
    window.addEventListener('playerActionReceived', handlePlayerActionReceived as EventListener);
    window.addEventListener('phaseChanged', handlePhaseChanged as EventListener);
    window.addEventListener('voteReceived', handleVoteReceived as EventListener);
    window.addEventListener('playerEliminated', handlePlayerEliminated as EventListener);
    window.addEventListener('roleRevealed', handleRoleRevealed as EventListener);

    return () => {
      window.removeEventListener('gameStateUpdated', handleGameStateUpdated as EventListener);
      window.removeEventListener('playerActionReceived', handlePlayerActionReceived as EventListener);
      window.removeEventListener('phaseChanged', handlePhaseChanged as EventListener);
      window.removeEventListener('voteReceived', handleVoteReceived as EventListener);
      window.removeEventListener('playerEliminated', handlePlayerEliminated as EventListener);
      window.removeEventListener('roleRevealed', handleRoleRevealed as EventListener);
    };
  }, [isConnected, currentGame, setCurrentGame, updatePlayer, syncGameState]);

  // Réinitialiser les tentatives de reconnexion quand la connexion est rétablie
  useEffect(() => {
    if (isConnected && reconnectAttempts > 0) {
      setReconnectAttempts(0);
      connectionStartTime.current = new Date();
      console.log('✅ Connexion rétablie, compteurs réinitialisés');
    }
  }, [isConnected, reconnectAttempts]);

  // Fonctions wrapper qui incluent le roomCode automatiquement
  const joinGame = async (gameRoomCode: string) => {
    await realtimeJoinGame(gameRoomCode);
  };

  const leaveGame = async (gameRoomCode: string) => {
    await realtimeLeaveGame(gameRoomCode);
  };

  const sendPlayerAction = async (action: any) => {
    if (!roomCode) throw new Error('No room code available');
    return realtimeSendPlayerAction(roomCode, action);
  };

  const sendVote = async (voterId: string, targetId: string) => {
    if (!roomCode) throw new Error('No room code available');
    return realtimeSendVote(roomCode, voterId, targetId);
  };

  const sendPhaseChange = async (phase: string) => {
    if (!roomCode) throw new Error('No room code available');
    return realtimeSendPhaseChange(roomCode, phase);
  };

  const sendNightAction = async (playerId: string, action: any) => {
    if (!roomCode) throw new Error('No room code available');
    return realtimeSendNightAction(roomCode, playerId, action);
  };

  const eliminatePlayer = async (playerId: string) => {
    if (!roomCode) throw new Error('No room code available');
    return realtimeEliminatePlayer(roomCode, playerId);
  };

  const revealRole = async (playerId: string, role: string) => {
    if (!roomCode) throw new Error('No room code available');
    return realtimeRevealRole(roomCode, playerId, role);
  };

  const contextValue: RealtimeContextType = {
    isConnected,
    isConnecting,
    error,
    connectedPlayers,
    connectionQuality,
    reconnectAttempts,
    maxReconnectAttempts,
    joinGame,
    leaveGame,
    sendPlayerAction,
    sendVote,
    sendPhaseChange,
    sendNightAction,
    eliminatePlayer,
    revealRole,
    forceReconnect,
    getConnectionStats,
  };

  return (
    <RealtimeContext.Provider value={contextValue}>
      {children}
    </RealtimeContext.Provider>
  );
};

export const useRealtime = (): RealtimeContextType => {
  const context = useContext(RealtimeContext);
  if (context === undefined) {
    throw new Error('useRealtime must be used within a RealtimeProvider');
  }
  return context;
};
