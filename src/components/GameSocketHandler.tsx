"use client";

import { useEffect } from 'react';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { useGameStore } from '@/store/gameStore';

interface GameSocketHandlerProps {
  roomCode: string;
}

export const GameSocketHandler = ({ roomCode }: GameSocketHandlerProps) => {
  const { isConnected, joinGame, leaveGame, updateGameState } = useSupabaseRealtime();
  const { currentGame, setCurrentGame, updatePlayer } = useGameStore();

  useEffect(() => {
    if (!isConnected) return;

    // Join the game room
    joinGame(roomCode);

    // Listen for game state updates
    const handleGameStateUpdated = (event: CustomEvent) => {
      setCurrentGame(event.detail.gameState);
    };

    // Listen for player actions
    const handlePlayerActionReceived = (event: CustomEvent) => {
      const action = event.detail;
      console.log('Player action received:', action);
      // Handle different action types
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
        default:
          console.log('Unknown action type:', action.type);
      }
    };

    // Listen for night actions
    const handleNightActionReceived = (event: CustomEvent) => {
      const { playerId, action } = event.detail;
      console.log('Night action received:', { playerId, action });
      // Handle night phase actions (werewolf kills, seer visions, etc.)
    };

    // Listen for votes
    const handleVoteReceived = (event: CustomEvent) => {
      const { voterId, targetId } = event.detail;
      console.log('Vote received:', { voterId, targetId });
      updatePlayer(voterId, { voteTarget: targetId });
    };

    // Listen for phase changes
    const handlePhaseChanged = (event: CustomEvent) => {
      const { phase } = event.detail;
      console.log('Phase changed:', phase);
      if (currentGame) {
        setCurrentGame({ ...currentGame, phase });
      }
    };

    // Listen for player elimination
    const handlePlayerEliminated = (event: CustomEvent) => {
      const { playerId } = event.detail;
      console.log('Player eliminated:', playerId);
      updatePlayer(playerId, { status: 'eliminated' });
    };

    // Listen for role reveals
    const handleRoleRevealed = (event: CustomEvent) => {
      const { playerId, role } = event.detail;
      console.log('Role revealed:', { playerId, role });
      updatePlayer(playerId, { role });
    };

    // Add event listeners
    window.addEventListener('gameStateUpdated', handleGameStateUpdated as EventListener);
    window.addEventListener('playerActionReceived', handlePlayerActionReceived as EventListener);
    window.addEventListener('nightActionReceived', handleNightActionReceived as EventListener);
    window.addEventListener('voteReceived', handleVoteReceived as EventListener);
    window.addEventListener('phaseChanged', handlePhaseChanged as EventListener);
    window.addEventListener('playerEliminated', handlePlayerEliminated as EventListener);
    window.addEventListener('roleRevealed', handleRoleRevealed as EventListener);

    // Cleanup on unmount
    return () => {
      leaveGame(roomCode);
      window.removeEventListener('gameStateUpdated', handleGameStateUpdated as EventListener);
      window.removeEventListener('playerActionReceived', handlePlayerActionReceived as EventListener);
      window.removeEventListener('nightActionReceived', handleNightActionReceived as EventListener);
      window.removeEventListener('voteReceived', handleVoteReceived as EventListener);
      window.removeEventListener('phaseChanged', handlePhaseChanged as EventListener);
      window.removeEventListener('playerEliminated', handlePlayerEliminated as EventListener);
      window.removeEventListener('roleRevealed', handleRoleRevealed as EventListener);
    };
  }, [isConnected, roomCode, joinGame, leaveGame, setCurrentGame, updatePlayer, currentGame]);

  // Send game state updates to other players
  useEffect(() => {
    if (currentGame && isConnected) {
      updateGameState(roomCode, currentGame);
    }
  }, [currentGame, isConnected, roomCode, updateGameState]);

  return null; // This component doesn't render anything
}; 