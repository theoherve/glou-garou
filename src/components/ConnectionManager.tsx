"use client";

import { useEffect, useRef, useState } from 'react';
import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';
import { supabase } from '@/lib/supabase';

interface ConnectionManagerProps {
  roomCode: string;
}

interface PlayerConnectionStatus {
  playerId: string;
  playerName: string;
  isOnline: boolean;
  lastSeen: Date;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
}

export const ConnectionManager = ({ roomCode }: ConnectionManagerProps) => {
  const { isConnected, isConnecting, error, connectedPlayers } = useRealtime();
  const { currentGame, currentPlayer, updatePlayerStatus } = useGameStore();
  
  const [playerConnections, setPlayerConnections] = useState<PlayerConnectionStatus[]>([]);
  const [showConnectionPanel, setShowConnectionPanel] = useState(false);
  
  // Références pour la gestion des timeouts
  const heartbeatRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const reconnectRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastActivityRef = useRef<Date>(new Date());
  
  // État de la connexion
  const [connectionQuality, setConnectionQuality] = useState<'excellent' | 'good' | 'poor' | 'disconnected'>('excellent');
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const [maxReconnectAttempts] = useState(5);

  // Fonction pour vérifier la qualité de la connexion
  const checkConnectionQuality = () => {
    if (!isConnected) {
      setConnectionQuality('disconnected');
      return;
    }

    // Simuler une vérification de latence
    const latency = Math.random() * 100; // Simulation
    
    if (latency < 30) {
      setConnectionQuality('excellent');
    } else if (latency < 70) {
      setConnectionQuality('good');
    } else {
      setConnectionQuality('poor');
    }
  };

  // Fonction pour envoyer un heartbeat
  const sendHeartbeat = async () => {
    if (!isConnected || !currentPlayer) return;

    try {
      // Mettre à jour le timestamp de dernière activité
      lastActivityRef.current = new Date();
      
      // Envoyer un heartbeat via l'API
      await fetch(`/api/games/${roomCode}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'heartbeat',
          playerId: currentPlayer.id,
          targetId: null,
          actionData: { timestamp: lastActivityRef.current.toISOString() },
        }),
      });

      console.log('💓 Heartbeat envoyé');
    } catch (error) {
      console.warn('Erreur lors de l\'envoi du heartbeat:', error);
    }
  };

  // Fonction pour tenter une reconnexion
  const attemptReconnection = async () => {
    if (reconnectAttempts >= maxReconnectAttempts) {
      console.error('Nombre maximum de tentatives de reconnexion atteint');
      return;
    }

    setReconnectAttempts(prev => prev + 1);
    console.log(`🔄 Tentative de reconnexion ${reconnectAttempts + 1}/${maxReconnectAttempts}`);

    try {
      // Attendre un délai exponentiel
      const delay = Math.min(1000 * Math.pow(2, reconnectAttempts), 30000);
      await new Promise(resolve => setTimeout(resolve, delay));

      // Tenter de rejoindre le jeu
      if (currentPlayer) {
        // Forcer une reconnexion via le hook Realtime
        window.location.reload(); // Solution simple pour forcer la reconnexion
      }
    } catch (error) {
      console.error('Erreur lors de la reconnexion:', error);
    }
  };

  // Fonction pour détecter les joueurs déconnectés
  const detectDisconnectedPlayers = () => {
    if (!currentGame) return;

    const now = new Date();
    const disconnectedThreshold = 2 * 60 * 1000; // 2 minutes

    const updatedConnections = currentGame.players.map(player => {
      const connection = playerConnections.find(c => c.playerId === player.id);
      
      if (!connection) {
        // Nouveau joueur, marquer comme connecté
        return {
          playerId: player.id,
          playerName: player.name,
          isOnline: true,
          lastSeen: now,
          connectionQuality: 'excellent' as const,
        };
      }

      // Vérifier si le joueur est déconnecté
      const timeSinceLastSeen = now.getTime() - connection.lastSeen.getTime();
      const isDisconnected = timeSinceLastSeen > disconnectedThreshold;

      if (isDisconnected && connection.isOnline) {
        console.log(`🔌 Joueur déconnecté détecté: ${player.name}`);
        
        // Mettre à jour le statut du joueur dans le store
        updatePlayerStatus(player.id, 'alive', { 
          // Ajouter un flag pour indiquer la déconnexion
          isDisconnected: true 
        });
      }

      return {
        ...connection,
        isOnline: !isDisconnected,
        connectionQuality: isDisconnected ? 'disconnected' : connection.connectionQuality,
      };
    });

    setPlayerConnections(updatedConnections);
  };

  // Démarrer le système de heartbeat
  useEffect(() => {
    if (isConnected && currentPlayer) {
      // Envoyer un heartbeat toutes les 30 secondes
      heartbeatRef.current = setInterval(sendHeartbeat, 30000);
      
      // Vérifier la qualité de la connexion toutes les 10 secondes
      const qualityCheckInterval = setInterval(checkConnectionQuality, 10000);
      
      return () => {
        if (heartbeatRef.current) {
          clearInterval(heartbeatRef.current);
        }
        clearInterval(qualityCheckInterval);
      };
    }
  }, [isConnected, currentPlayer, roomCode]);

  // Gérer les tentatives de reconnexion
  useEffect(() => {
    if (!isConnected && !isConnecting && reconnectAttempts < maxReconnectAttempts) {
      reconnectRef.current = setTimeout(attemptReconnection, 5000);
    }

    return () => {
      if (reconnectRef.current) {
        clearTimeout(reconnectRef.current);
      }
    };
  }, [isConnected, isConnecting, reconnectAttempts, maxReconnectAttempts]);

  // Détecter les joueurs déconnectés
  useEffect(() => {
    const disconnectCheckInterval = setInterval(detectDisconnectedPlayers, 30000);
    
    return () => {
      clearInterval(disconnectCheckInterval);
    };
  }, [currentGame, playerConnections]);

  // Mettre à jour la liste des connexions quand les joueurs connectés changent
  useEffect(() => {
    if (currentGame && connectedPlayers.length > 0) {
      const now = new Date();
      const updatedConnections = currentGame.players.map(player => {
        const isConnected = connectedPlayers.some(cp => cp.user_id === player.id);
        const existingConnection = playerConnections.find(c => c.playerId === player.id);
        
        return {
          playerId: player.id,
          playerName: player.name,
          isOnline: isConnected,
          lastSeen: isConnected ? now : (existingConnection?.lastSeen || now),
          connectionQuality: isConnected ? 'excellent' as const : 'disconnected' as const,
        };
      });
      
      setPlayerConnections(updatedConnections);
    }
  }, [connectedPlayers, currentGame]);

  // Gérer la visibilité de la page (détecter quand l'utilisateur revient)
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (!document.hidden && !isConnected) {
        console.log('👁️ Page redevenue visible, vérifier la connexion');
        // Vérifier si on peut se reconnecter
        if (reconnectAttempts < maxReconnectAttempts) {
          attemptReconnection();
        }
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [isConnected, reconnectAttempts, maxReconnectAttempts]);

  // Composant invisible qui gère la connectivité
  return null;
};
