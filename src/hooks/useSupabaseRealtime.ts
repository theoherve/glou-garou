"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import { RealtimeChannel } from "@supabase/supabase-js";

interface UseSupabaseRealtimeReturn {
  isConnected: boolean;
  joinGame: (roomCode: string) => void;
  leaveGame: (roomCode: string) => void;
  updateGameState: (roomCode: string, gameState: any) => void;
  sendPlayerAction: (roomCode: string, action: any) => void;
  sendNightAction: (roomCode: string, playerId: string, action: any) => void;
  sendVote: (roomCode: string, voterId: string, targetId: string) => void;
  sendPhaseChange: (roomCode: string, phase: string) => void;
  eliminatePlayer: (roomCode: string, playerId: string) => void;
  revealRole: (roomCode: string, playerId: string, role: string) => void;
}

export const useSupabaseRealtime = (): UseSupabaseRealtimeReturn => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  const joinGame = useCallback(async (roomCode: string) => {
    if (channelRef.current) {
      await channelRef.current.unsubscribe();
    }

    // Créer un canal pour ce jeu
    const channel = supabase.channel(`game:${roomCode}`, {
      config: {
        presence: {
          key: roomCode,
        },
      },
    });

    // Écouter les changements de présence (joueurs qui rejoignent/quittent)
    channel
      .on("presence", { event: "sync" }, () => {
        console.log("Presence sync");
      })
      .on("presence", { event: "join" }, ({ key, newPresences }) => {
        console.log("Player joined:", newPresences);
      })
      .on("presence", { event: "leave" }, ({ key, leftPresences }) => {
        console.log("Player left:", leftPresences);
      })
      .on("broadcast", { event: "gameStateUpdated" }, (payload) => {
        console.log("Game state updated:", payload);
        // Émettre un événement personnalisé pour le composant
        window.dispatchEvent(
          new CustomEvent("gameStateUpdated", { detail: payload.payload })
        );
      })
      .on("broadcast", { event: "playerAction" }, (payload) => {
        console.log("Player action received:", payload);
        window.dispatchEvent(
          new CustomEvent("playerActionReceived", { detail: payload.payload })
        );
      })
      .on("broadcast", { event: "nightAction" }, (payload) => {
        console.log("Night action received:", payload);
        window.dispatchEvent(
          new CustomEvent("nightActionReceived", { detail: payload.payload })
        );
      })
      .on("broadcast", { event: "vote" }, (payload) => {
        console.log("Vote received:", payload);
        window.dispatchEvent(
          new CustomEvent("voteReceived", { detail: payload.payload })
        );
      })
      .on("broadcast", { event: "phaseChange" }, (payload) => {
        console.log("Phase changed:", payload);
        window.dispatchEvent(
          new CustomEvent("phaseChanged", { detail: payload.payload })
        );
      })
      .on("broadcast", { event: "playerEliminated" }, (payload) => {
        console.log("Player eliminated:", payload);
        window.dispatchEvent(
          new CustomEvent("playerEliminated", { detail: payload.payload })
        );
      })
      .on("broadcast", { event: "roleRevealed" }, (payload) => {
        console.log("Role revealed:", payload);
        window.dispatchEvent(
          new CustomEvent("roleRevealed", { detail: payload.payload })
        );
      });

    // S'abonner au canal
    const status = await channel.subscribe((status) => {
      console.log("Channel status:", status);
      setIsConnected(status === "SUBSCRIBED");
    });

    channelRef.current = channel;
  }, []);

  const leaveGame = useCallback(async (roomCode: string) => {
    if (channelRef.current) {
      await channelRef.current.unsubscribe();
      channelRef.current = null;
      setIsConnected(false);
    }
  }, []);

  const updateGameState = useCallback(
    async (roomCode: string, gameState: any) => {
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "gameStateUpdated",
          payload: { roomCode, gameState },
        });
      }
    },
    []
  );

  const sendPlayerAction = useCallback(
    async (roomCode: string, action: any) => {
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "playerAction",
          payload: { roomCode, action },
        });
      }
    },
    []
  );

  const sendNightAction = useCallback(
    async (roomCode: string, playerId: string, action: any) => {
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "nightAction",
          payload: { roomCode, playerId, action },
        });
      }
    },
    []
  );

  const sendVote = useCallback(
    async (roomCode: string, voterId: string, targetId: string) => {
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "vote",
          payload: { roomCode, voterId, targetId },
        });
      }
    },
    []
  );

  const sendPhaseChange = useCallback(
    async (roomCode: string, phase: string) => {
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "phaseChange",
          payload: { roomCode, phase },
        });
      }
    },
    []
  );

  const eliminatePlayer = useCallback(
    async (roomCode: string, playerId: string) => {
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "playerEliminated",
          payload: { roomCode, playerId },
        });
      }
    },
    []
  );

  const revealRole = useCallback(
    async (roomCode: string, playerId: string, role: string) => {
      if (channelRef.current) {
        await channelRef.current.send({
          type: "broadcast",
          event: "roleRevealed",
          payload: { roomCode, playerId, role },
        });
      }
    },
    []
  );

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (channelRef.current) {
        channelRef.current.unsubscribe();
      }
    };
  }, []);

  return {
    isConnected,
    joinGame,
    leaveGame,
    updateGameState,
    sendPlayerAction,
    sendNightAction,
    sendVote,
    sendPhaseChange,
    eliminatePlayer,
    revealRole,
  };
};
