"use client";

import { useEffect } from 'react';
import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';

interface GameSocketHandlerProps {
  roomCode: string;
}

export const GameSocketHandler = ({ roomCode }: GameSocketHandlerProps) => {
  const { isConnected, sendPlayerAction, sendVote, sendPhaseChange } = useRealtime();
  const { currentGame, setCurrentGame, updatePlayer } = useGameStore();

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
      
      // Gérer différents types d'actions
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

    // Nettoyage lors du démontage
    return () => {
      window.removeEventListener('gameStateUpdated', handleGameStateUpdated as EventListener);
      window.removeEventListener('playerActionReceived', handlePlayerActionReceived as EventListener);
      window.removeEventListener('phaseChanged', handlePhaseChanged as EventListener);
      window.removeEventListener('voteReceived', handleVoteReceived as EventListener);
      window.removeEventListener('playerEliminated', handlePlayerEliminated as EventListener);
      window.removeEventListener('roleRevealed', handleRoleRevealed as EventListener);
    };
  }, [isConnected, currentGame, setCurrentGame, updatePlayer]);

  // Ce composant ne rend rien, il gère seulement les événements
  return null;
}; 