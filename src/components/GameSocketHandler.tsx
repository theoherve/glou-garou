"use client";

import { useEffect } from 'react';
import { useSocket } from '@/hooks/useSocket';
import { useGameStore } from '@/store/gameStore';

interface GameSocketHandlerProps {
  roomCode: string;
}

export const GameSocketHandler = ({ roomCode }: GameSocketHandlerProps) => {
  const { socket, joinGame, leaveGame, updateGameState } = useSocket();
  const { currentGame, setCurrentGame, updatePlayer } = useGameStore();

  useEffect(() => {
    if (!socket) return;

    // Join the game room
    joinGame(roomCode);

    // Listen for game state updates
    socket.on('gameStateUpdated', (gameState) => {
      setCurrentGame(gameState);
    });

    // Listen for player actions
    socket.on('playerActionReceived', (action) => {
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
    });

    // Listen for night actions
    socket.on('nightActionReceived', ({ playerId, action }) => {
      console.log('Night action received:', { playerId, action });
      // Handle night phase actions (werewolf kills, seer visions, etc.)
    });

    // Listen for votes
    socket.on('voteReceived', ({ voterId, targetId }) => {
      console.log('Vote received:', { voterId, targetId });
      updatePlayer(voterId, { voteTarget: targetId });
    });

    // Listen for phase changes
    socket.on('phaseChanged', ({ phase }) => {
      console.log('Phase changed:', phase);
      if (currentGame) {
        setCurrentGame({ ...currentGame, phase });
      }
    });

    // Listen for player elimination
    socket.on('playerEliminated', ({ playerId }) => {
      console.log('Player eliminated:', playerId);
      updatePlayer(playerId, { status: 'eliminated' });
    });

    // Listen for role reveals
    socket.on('roleRevealed', ({ playerId, role }) => {
      console.log('Role revealed:', { playerId, role });
      updatePlayer(playerId, { role });
    });

    // Listen for player join/leave
    socket.on('playerJoined', ({ socketId }) => {
      console.log('Player joined:', socketId);
    });

    socket.on('playerLeft', ({ socketId }) => {
      console.log('Player left:', socketId);
    });

    // Cleanup on unmount
    return () => {
      leaveGame(roomCode);
      socket.off('gameStateUpdated');
      socket.off('playerActionReceived');
      socket.off('nightActionReceived');
      socket.off('voteReceived');
      socket.off('phaseChanged');
      socket.off('playerEliminated');
      socket.off('roleRevealed');
      socket.off('playerJoined');
      socket.off('playerLeft');
    };
  }, [socket, roomCode, joinGame, leaveGame, setCurrentGame, updatePlayer, currentGame]);

  // Send game state updates to other players
  useEffect(() => {
    if (currentGame && socket) {
      updateGameState(roomCode, currentGame);
    }
  }, [currentGame, socket, roomCode, updateGameState]);

  return null; // This component doesn't render anything
}; 