"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { io, Socket } from "socket.io-client";

interface UseSocketReturn {
  socket: Socket | null;
  joinGame: (roomCode: string) => void;
  leaveGame: (roomCode: string) => void;
  updateGameState: (roomCode: string, gameState: any) => void;
  sendPlayerAction: (roomCode: string, action: any) => void;
  sendNightAction: (roomCode: string, playerId: string, action: any) => void;
  sendVote: (roomCode: string, voterId: string, targetId: string) => void;
  sendPhaseChange: (roomCode: string, phase: string) => void;
  eliminatePlayer: (roomCode: string, playerId: string) => void;
  revealRole: (roomCode: string, playerId: string, role: string) => void;
  isConnected: boolean;
}

export const useSocket = (): UseSocketReturn => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Initialize socket connection
    const socket = io(
      process.env.NEXT_PUBLIC_SOCKET_URL || "http://localhost:3001"
    );
    socketRef.current = socket;

    // Connection event handlers
    socket.on("connect", () => {
      console.log("Connected to Socket.io server");
      setIsConnected(true);
    });

    socket.on("disconnect", () => {
      console.log("Disconnected from Socket.io server");
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      socket.disconnect();
    };
  }, []);

  const joinGame = useCallback((roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("joinGame", roomCode);
    }
  }, []);

  const leaveGame = useCallback((roomCode: string) => {
    if (socketRef.current) {
      socketRef.current.emit("leaveGame", roomCode);
    }
  }, []);

  const updateGameState = useCallback((roomCode: string, gameState: any) => {
    if (socketRef.current) {
      socketRef.current.emit("updateGameState", { roomCode, gameState });
    }
  }, []);

  const sendPlayerAction = useCallback((roomCode: string, action: any) => {
    if (socketRef.current) {
      socketRef.current.emit("playerAction", { roomCode, action });
    }
  }, []);

  const sendNightAction = useCallback(
    (roomCode: string, playerId: string, action: any) => {
      if (socketRef.current) {
        socketRef.current.emit("nightAction", { roomCode, playerId, action });
      }
    },
    []
  );

  const sendVote = useCallback(
    (roomCode: string, voterId: string, targetId: string) => {
      if (socketRef.current) {
        socketRef.current.emit("vote", { roomCode, voterId, targetId });
      }
    },
    []
  );

  const sendPhaseChange = useCallback((roomCode: string, phase: string) => {
    if (socketRef.current) {
      socketRef.current.emit("phaseChange", { roomCode, phase });
    }
  }, []);

  const eliminatePlayer = useCallback((roomCode: string, playerId: string) => {
    if (socketRef.current) {
      socketRef.current.emit("eliminatePlayer", { roomCode, playerId });
    }
  }, []);

  const revealRole = useCallback(
    (roomCode: string, playerId: string, role: string) => {
      if (socketRef.current) {
        socketRef.current.emit("revealRole", { roomCode, playerId, role });
      }
    },
    []
  );

  return {
    socket: socketRef.current,
    joinGame,
    leaveGame,
    updateGameState,
    sendPlayerAction,
    sendNightAction,
    sendVote,
    sendPhaseChange,
    eliminatePlayer,
    revealRole,
    isConnected,
  };
};
