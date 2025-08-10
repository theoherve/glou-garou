"use client";

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useGameStore } from '@/store/gameStore';

interface RealtimeContextType {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  connectedPlayers: any[];
  joinGame: (roomCode: string) => Promise<void>;
  leaveGame: (roomCode: string) => Promise<void>;
  sendPlayerAction: (action: any) => Promise<any>;
  sendVote: (voterId: string, targetId: string) => Promise<any>;
  sendPhaseChange: (phase: string) => Promise<any>;
  sendNightAction: (playerId: string, action: any) => Promise<any>;
  eliminatePlayer: (playerId: string) => Promise<any>;
  revealRole: (playerId: string, role: string) => Promise<any>;
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
  const { currentGame, currentPlayer, setCurrentGame, updatePlayer } = useGameStore();
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

  // Écouter les événements de mise à jour du jeu
  useEffect(() => {
    if (!isConnected) return;

    const handleGameStateUpdated = (event: CustomEvent) => {
      const { gameState } = event.detail;
      if (gameState && currentGame?.id === gameState.id) {
        setCurrentGame(gameState);
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
  }, [isConnected, currentGame, setCurrentGame, updatePlayer]);

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
    joinGame,
    leaveGame,
    sendPlayerAction,
    sendVote,
    sendPhaseChange,
    sendNightAction,
    eliminatePlayer,
    revealRole,
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
