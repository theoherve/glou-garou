"use client";

import { useEffect, useRef, useCallback, useState } from "react";
import { supabase } from "@/lib/supabase";
import {
  RealtimeChannel,
  RealtimeChannelSendResponse,
} from "@supabase/supabase-js";

interface UseSupabaseRealtimeReturn {
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
  joinGame: (roomCode: string) => Promise<void>;
  leaveGame: (roomCode: string) => Promise<void>;
  updateGameState: (
    roomCode: string,
    gameState: any
  ) => Promise<RealtimeChannelSendResponse | null>;
  sendPlayerAction: (
    roomCode: string,
    action: any
  ) => Promise<RealtimeChannelSendResponse | null>;
  sendNightAction: (
    roomCode: string,
    playerId: string,
    action: any
  ) => Promise<RealtimeChannelSendResponse | null>;
  sendVote: (
    roomCode: string,
    voterId: string,
    targetId: string
  ) => Promise<RealtimeChannelSendResponse | null>;
  sendPhaseChange: (
    roomCode: string,
    phase: string,
    currentNight?: number
  ) => Promise<RealtimeChannelSendResponse | null>;
  eliminatePlayer: (
    roomCode: string,
    playerId: string
  ) => Promise<RealtimeChannelSendResponse | null>;
  revealRole: (
    roomCode: string,
    playerId: string,
    role: string
  ) => Promise<RealtimeChannelSendResponse | null>;
  getConnectedPlayers: () => any[];
}

export const useSupabaseRealtime = (
  currentPlayerId?: string
): UseSupabaseRealtimeReturn => {
  const channelRef = useRef<RealtimeChannel | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connectedPlayers, setConnectedPlayers] = useState<any[]>([]);

  const joinGame = useCallback(
    async (roomCode: string) => {
      if (isConnecting || isConnected) return;

      setIsConnecting(true);
      setError(null);

      try {
        console.log(
          "🔄 Tentative de connexion au canal Realtime:",
          `game:${roomCode}`
        );

        const channel = supabase.channel(`game:${roomCode}`);

        // Écouter les messages de présence
        channel.on("presence", { event: "sync" }, () => {
          console.log("✅ Présence synchronisée");
          const presenceState = channel.presenceState();
          const players = Object.values(presenceState).flat();
          setConnectedPlayers(players);
        });

        // Écouter les messages broadcast
        channel.on("broadcast", { event: "*" }, (payload) => {
          console.log("📡 Message broadcast reçu:", payload);
        });

        // Écouter les changements de présence
        channel.on("presence", { event: "join" }, ({ key, newPresences }) => {
          console.log("👋 Joueur rejoint:", newPresences);
          setConnectedPlayers((prev) => [...prev, ...newPresences]);
        });

        channel.on("presence", { event: "leave" }, ({ key, leftPresences }) => {
          console.log("👋 Joueur quitte:", leftPresences);
          setConnectedPlayers((prev) =>
            prev.filter(
              (p) => !leftPresences.some((lp) => lp.user_id === p.user_id)
            )
          );
        });

        // Écouter les événements système
        channel.on("system", { event: "*" }, (payload) => {
          console.log("🔧 Événement système:", payload);
        });

        console.log("📡 S'abonnement au canal...");

        // S'abonner au canal
        await channel.subscribe();

        console.log("✅ Abonnement réussi, attente de la connexion...");

        // Attendre que la connexion soit établie
        await new Promise((resolve, reject) => {
          const timeout = setTimeout(() => {
            console.log("⏰ Timeout de connexion atteint");
            reject(new Error("Connection timeout"));
          }, 10000); // Augmenté à 10 secondes

          // Vérifier périodiquement l'état de la connexion
          const checkConnection = () => {
            console.log("🔍 Vérification de l'état de la connexion...");

            // Vérifier si le canal est connecté
            if (channel.state === "joined") {
              console.log("✅ Canal connecté avec succès (état: joined)");
              clearTimeout(timeout);
              resolve(true);
              return;
            }

            // Vérifier si le canal est en cours de connexion
            if (channel.state === "joining") {
              console.log("⏳ Canal en cours de connexion (état: joining)");
              // Continuer à vérifier
              setTimeout(checkConnection, 500);
              return;
            }

            // Vérifier si le canal a une erreur
            if (channel.state === "errored") {
              console.log("❌ Canal en erreur (état: errored)");
              clearTimeout(timeout);
              reject(new Error("Canal en erreur"));
              return;
            }

            console.log(`🔄 État actuel du canal: ${channel.state}`);
            // Continuer à vérifier
            setTimeout(checkConnection, 500);
          };

          // Démarrer la vérification après un court délai
          setTimeout(checkConnection, 100);
        });

        setIsConnected(true);
        setIsConnecting(false);
        console.log("🎉 Connexion Realtime établie avec succès!");

        // Écouter les erreurs de connexion
        channel.on("system", { event: "error" }, (error) => {
          console.error("❌ Erreur de canal:", error);
          setError("Erreur de connexion au canal");
        });

        // Écouter la déconnexion
        channel.on("system", { event: "leave" }, () => {
          console.log("🔌 Déconnecté du canal");
          setIsConnected(false);
          setError("Déconnecté du canal");
        });

        channelRef.current = channel;

        // Rejoindre la présence avec les informations du joueur
        console.log("👤 Rejoindre la présence...");
        await channel.track({
          user_id: currentPlayerId || `player-${Date.now()}`,
          room_code: roomCode,
          joined_at: new Date().toISOString(),
        });

        console.log("✅ Présence rejointe avec succès");
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        console.error("❌ Erreur lors de la connexion au jeu:", err);
        setError(`Failed to join game: ${errorMessage}`);
        setIsConnecting(false);

        // Nettoyer le canal en cas d'erreur
        if (channelRef.current) {
          try {
            await channelRef.current.unsubscribe();
          } catch (cleanupError) {
            console.error("Erreur lors du nettoyage:", cleanupError);
          }
          channelRef.current = null;
        }
      }
    },
    [currentPlayerId, isConnected, isConnecting]
  );

  const leaveGame = useCallback(async (roomCode: string) => {
    try {
      if (channelRef.current) {
        // Arrêter de tracker la présence
        await channelRef.current.untrack();

        // Se désabonner du canal
        await channelRef.current.unsubscribe();
        channelRef.current = null;
      }

      setIsConnected(false);
      setIsConnecting(false);
      setError(null);
      setConnectedPlayers([]);
    } catch (err) {
      console.error("Error leaving game:", err);
    }
  }, []);

  const sendMessage = useCallback(
    async (
      event: string,
      payload: any
    ): Promise<RealtimeChannelSendResponse | null> => {
      if (!channelRef.current || !isConnected) {
        setError("Not connected to game channel");
        return null;
      }

      try {
        const response = await channelRef.current.send({
          type: "broadcast",
          event,
          payload,
        });

        if (response === "error") {
          setError("Failed to send message");
          return null;
        }

        return response;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error";
        setError(`Failed to send message: ${errorMessage}`);
        return null;
      }
    },
    [isConnected]
  );

  const updateGameState = useCallback(
    async (roomCode: string, gameState: any) => {
      return sendMessage("gameStateUpdated", { roomCode, gameState });
    },
    [sendMessage]
  );

  const sendPlayerAction = useCallback(
    async (roomCode: string, action: any) => {
      try {
        // Enregistrer l'action dans la base de données
        const response = await fetch(`/api/games/${roomCode}/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actionType: action.type,
            playerId: action.playerId,
            targetId: action.targetId,
            actionData: action.data,
          }),
        });

        if (!response.ok) {
          console.error("Failed to save action to database");
        }
      } catch (error) {
        console.error("Error saving action to database:", error);
      }

      return sendMessage("playerAction", { roomCode, action });
    },
    [sendMessage]
  );

  const sendNightAction = useCallback(
    async (roomCode: string, playerId: string, action: any) => {
      return sendMessage("nightAction", { roomCode, playerId, action });
    },
    [sendMessage]
  );

  const sendVote = useCallback(
    async (roomCode: string, voterId: string, targetId: string) => {
      try {
        // Enregistrer le vote dans la base de données
        const response = await fetch(`/api/games/${roomCode}/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actionType: "vote",
            playerId: voterId,
            targetId: targetId,
            actionData: null,
          }),
        });

        if (!response.ok) {
          console.error("Failed to save vote to database");
        }
      } catch (error) {
        console.error("Error saving vote to database:", error);
      }

      return sendMessage("vote", { roomCode, voterId, targetId });
    },
    [sendMessage]
  );

  const sendPhaseChange = useCallback(
    async (roomCode: string, phase: string, currentNight?: number) => {
      try {
        // Enregistrer le changement de phase dans la base de données
        const response = await fetch(`/api/games/${roomCode}/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actionType: "phase_change",
            playerId: "system", // Action système
            targetId: null,
            actionData: { phase, current_night: currentNight },
          }),
        });

        if (!response.ok) {
          console.error("Failed to save phase change to database");
        }
      } catch (error) {
        console.error("Error saving phase change to database:", error);
      }

      return sendMessage("phaseChange", { roomCode, phase, currentNight });
    },
    [sendMessage]
  );

  const eliminatePlayer = useCallback(
    async (roomCode: string, playerId: string) => {
      try {
        // Enregistrer l'élimination dans la base de données
        const response = await fetch(`/api/games/${roomCode}/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actionType: "player_elimination",
            playerId: "system", // Action système
            targetId: playerId,
            actionData: null,
          }),
        });

        if (!response.ok) {
          console.error("Failed to save player elimination to database");
        }
      } catch (error) {
        console.error("Error saving player elimination to database:", error);
      }

      return sendMessage("playerEliminated", { roomCode, playerId });
    },
    [sendMessage]
  );

  const revealRole = useCallback(
    async (roomCode: string, playerId: string, role: string) => {
      try {
        // Enregistrer la révélation de rôle dans la base de données
        const response = await fetch(`/api/games/${roomCode}/actions`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            actionType: "role_reveal",
            playerId: "system", // Action système
            targetId: playerId,
            actionData: { role },
          }),
        });

        if (!response.ok) {
          console.error("Failed to save role reveal to database");
        }
      } catch (error) {
        console.error("Error saving role reveal to database:", error);
      }

      return sendMessage("roleRevealed", { roomCode, playerId, role });
    },
    [sendMessage]
  );

  const getConnectedPlayers = useCallback(() => {
    return connectedPlayers;
  }, [connectedPlayers]);

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
    isConnecting,
    error,
    joinGame,
    leaveGame,
    updateGameState,
    sendPlayerAction,
    sendNightAction,
    sendVote,
    sendPhaseChange,
    eliminatePlayer,
    revealRole,
    getConnectedPlayers,
  };
};
