import { create } from "zustand";
import {
  Game,
  Player,
  GameState,
  GamePhase,
  GameSettings,
  Role,
  PlayerStatus,
  PhaseStep,
  PendingNightState,
  ShotType,
} from "@/types/game";
import { gameApi, playerApi, gameActionApi } from "@/lib/gameApi";

interface GameStore extends GameState {
  // Actions
  setCurrentGame: (game: Game | null) => void;
  setCurrentPlayer: (player: Player | null) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;

  // Game actions
  createGame: (
    roomCode: string,
    gameMasterId: string,
    settings: GameSettings
  ) => Promise<void>;
  joinGame: (roomCode: string, playerName: string) => Promise<void>;
  startGame: () => Promise<void>;
  vote: (playerId: string, targetId: string) => Promise<void>;
  useAbility: (
    playerId: string,
    targetId?: string,
    data?: Record<string, unknown>
  ) => Promise<void>;
  eliminatePlayer: (playerId: string) => Promise<void>;
  nextPhase: () => Promise<void>;
  revealRole: (playerId: string, targetId: string) => Promise<void>;

  // Utility actions
  resetGame: () => void;
  updatePlayer: (playerId: string, updates: Partial<Player>) => void;

  // Phase 7: Synchronisation robuste
  syncGameState: (gameData: Game) => void;
  syncPlayerState: (playerData: Player) => void;
  resolveStateConflict: (localState: Game, remoteState: Game) => Game;
  updateGamePhase: (phase: GamePhase, data?: Record<string, unknown>) => void;
  updatePhaseStep: (phaseStep: PhaseStep) => void;
  setPendingNightState: (updates: Partial<PendingNightState>) => void;
  buildShotPlan: () => void;
  applyVillageoiseSwap: () => void;
  updatePlayerStatus: (
    playerId: string,
    status: PlayerStatus,
    data?: Record<string, unknown>
  ) => void;
  getGameStateSnapshot: () => Game | null;
  restoreGameState: (snapshot: Game) => void;
}

export const useGameStore = create<GameStore>((set, get) => ({
  currentGame: null,
  currentPlayer: null,
  isLoading: false,
  error: null,

  setCurrentGame: (game) => set({ currentGame: game }),
  setCurrentPlayer: (player) => set({ currentPlayer: player }),
  setLoading: (loading) => set({ isLoading: loading }),
  setError: (error) => set({ error }),

  createGame: async (roomCode, gameMasterId, settings) => {
    set({ isLoading: true, error: null });
    try {
      // Create game via Supabase API
      const newGame = await gameApi.createGame(
        roomCode,
        gameMasterId,
        settings
      );

      // Créer le joueur maître de jeu
      const gameMasterPlayer = await playerApi.joinGame(
        newGame.id,
        "Game Master" // Nom temporaire, sera mis à jour plus tard
      );

      // Mettre à jour le joueur pour le marquer comme maître de jeu
      await playerApi.updatePlayer(gameMasterPlayer.id, {
        isGameMaster: true,
        role: "villageois", // Rôle par défaut pour le maître de jeu
      });

      // Créer un objet Player complet pour le maître de jeu
      const updatedGameMaster: Player = {
        ...gameMasterPlayer,
        isGameMaster: true,
        role: "villageois",
      };

      // Mettre à jour le jeu avec le joueur maître
      const gameWithMaster = {
        ...newGame,
        players: [updatedGameMaster],
      };

      set({
        currentGame: gameWithMaster,
        currentPlayer: updatedGameMaster,
        isLoading: false,
      });

      console.log("Jeu créé avec succès:", gameWithMaster);
      console.log("Joueur maître créé:", updatedGameMaster);
    } catch (error) {
      console.error("Erreur dans createGame store:", error);
      set({ error: "Failed to create game", isLoading: false });
      throw error; // Re-lancer l'erreur pour la gestion dans le composant
    }
  },

  joinGame: async (roomCode, playerName) => {
    set({ isLoading: true, error: null });
    try {
      // Get game by room code first
      const game = await gameApi.getGameByRoomCode(roomCode);
      if (!game) {
        throw new Error("Code de salle invalide - Partie non trouvée");
      }

      // Vérifier que la partie n'est pas déjà commencée
      if (game.phase !== "waiting") {
        throw new Error(
          "Cette partie a déjà commencé - Impossible de rejoindre"
        );
      }

      // Vérifier que la partie n'est pas pleine (limite à 12 joueurs par défaut)
      const maxPlayers = game.gameSettings?.maxPlayers || 12;
      if (game.players.length >= maxPlayers) {
        throw new Error(
          `Cette partie est pleine (${game.players.length}/${maxPlayers} joueurs) - Impossible de rejoindre`
        );
      }

      // Vérifier que le nom n'est pas déjà pris dans cette partie
      const existingPlayer = game.players.find(
        (p) => p.name.toLowerCase() === playerName.toLowerCase()
      );
      if (existingPlayer) {
        throw new Error(
          "Ce nom est déjà pris dans cette partie - Choisissez un autre nom"
        );
      }

      // Join game via Supabase API
      const newPlayer = await playerApi.joinGame(game.id, playerName);

      // Mettre à jour le store avec le jeu et le joueur
      set({
        currentGame: game,
        currentPlayer: newPlayer,
        isLoading: false,
      });

      // Rediriger vers la page du jeu
      if (typeof window !== "undefined") {
        window.location.href = `/game/${roomCode}`;
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Erreur lors de la connexion à la partie";
      set({ error: errorMessage, isLoading: false });
      throw error; // Re-lancer l'erreur pour la gestion dans le composant
    }
  },

  startGame: async () => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // L'état sera mis à jour via DatabaseSync après la réponse de l'API
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to start game", isLoading: false });
    }
  },

  vote: async (playerId, targetId) => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // L'état sera mis à jour via DatabaseSync après la réponse de l'API
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to vote", isLoading: false });
    }
  },

  useAbility: async (playerId, targetId, data) => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to use ability
      const updatedPlayers = currentGame.players.map((player) =>
        player.id === playerId ? { ...player, hasUsedAbility: true } : player
      );
      const updatedGame = {
        ...currentGame,
        players: updatedPlayers,
        updatedAt: new Date(),
      };
      set({ currentGame: updatedGame, isLoading: false });
    } catch (error) {
      set({ error: "Failed to use ability", isLoading: false });
    }
  },

  eliminatePlayer: async (playerId) => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // L'état sera mis à jour via DatabaseSync après la réponse de l'API
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to eliminate player", isLoading: false });
    }
  },

  nextPhase: async () => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // L'état sera mis à jour via DatabaseSync après la réponse de l'API
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to advance phase", isLoading: false });
    }
  },

  revealRole: async (playerId, targetId) => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to reveal role
      // This is mainly for the game master to show roles to other players
      set({ isLoading: false });
    } catch (error) {
      set({ error: "Failed to reveal role", isLoading: false });
    }
  },

  resetGame: () => {
    set({
      currentGame: null,
      currentPlayer: null,
      isLoading: false,
      error: null,
    });
  },

  updatePlayer: (playerId, updates) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedPlayers = currentGame.players.map((player) =>
      player.id === playerId ? { ...player, ...updates } : player
    );
    const updatedGame = {
      ...currentGame,
      players: updatedPlayers,
      updatedAt: new Date(),
    };
    set({ currentGame: updatedGame });
  },

  // Phase 7: Nouvelles fonctions de synchronisation
  syncGameState: (gameData: Game) => {
    const { currentGame } = get();

    if (!currentGame) {
      // Premier chargement
      set({ currentGame: gameData });
      return;
    }

    // Vérifier si les données distantes sont plus récentes
    const localUpdatedAt = new Date(currentGame.updatedAt).getTime();
    const remoteUpdatedAt = new Date(gameData.updatedAt).getTime();

    if (remoteUpdatedAt > localUpdatedAt) {
      // Les données distantes sont plus récentes, synchroniser
      set({ currentGame: gameData });
      console.log("🔄 Synchronisation du jeu avec les données distantes");
    } else if (remoteUpdatedAt < localUpdatedAt) {
      // Les données locales sont plus récentes, résoudre le conflit
      const resolvedState = get().resolveStateConflict(currentGame, gameData);
      set({ currentGame: resolvedState });
      console.log("⚖️ Conflit d'état résolu en faveur des données locales");
    }
  },

  syncPlayerState: (playerData: Player) => {
    const { currentGame, currentPlayer } = get();

    if (!currentGame) return;

    // Mettre à jour le joueur dans la liste des joueurs du jeu
    const updatedPlayers = currentGame.players.map((player) =>
      player.id === playerData.id ? playerData : player
    );

    const updatedGame = {
      ...currentGame,
      players: updatedPlayers,
      updatedAt: new Date(),
    };

    set({ currentGame: updatedGame });

    // Mettre à jour le joueur actuel si c'est lui
    if (currentPlayer && currentPlayer.id === playerData.id) {
      set({ currentPlayer: playerData });
    }
  },

  resolveStateConflict: (localState: Game, remoteState: Game): Game => {
    // Stratégie de résolution : priorité aux actions locales
    // mais préserver les données critiques du serveur
    return {
      ...localState,
      // Préserver l'ID et les métadonnées du serveur
      id: remoteState.id,
      roomCode: remoteState.roomCode,
      createdAt: remoteState.createdAt,
      // Utiliser la phase la plus récente
      phase:
        localState.updatedAt > remoteState.updatedAt
          ? localState.phase
          : remoteState.phase,
      // Fusionner les joueurs en priorisant les données locales
      players: localState.players.map((localPlayer) => {
        const remotePlayer = remoteState.players.find(
          (p) => p.id === localPlayer.id
        );
        if (remotePlayer) {
          // Fusionner en priorisant les données locales
          return {
            ...remotePlayer,
            ...localPlayer,
            // Préserver les données critiques du serveur
            id: remotePlayer.id,
          };
        }
        return localPlayer;
      }),
      // Utiliser les paramètres de jeu du serveur
      gameSettings: remoteState.gameSettings,
      gameMasterId: remoteState.gameMasterId,
      // Utiliser la nuit la plus récente
      currentNight: Math.max(localState.currentNight, remoteState.currentNight),
      // Fusionner les joueurs éliminés
      eliminatedPlayers: [
        ...new Set([
          ...localState.eliminatedPlayers,
          ...remoteState.eliminatedPlayers,
        ]),
      ],
      updatedAt: new Date(),
    };
  },

  updateGamePhase: (phase: GamePhase, data?: Record<string, unknown>) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedGame = {
      ...currentGame,
      phase,
      ...(data?.currentNight
        ? { currentNight: data.currentNight as number }
        : {}),
      updatedAt: new Date(),
    };

    set({ currentGame: updatedGame });
    console.log(`🔄 Phase de jeu mise à jour: ${phase}`);
  },

  updatePhaseStep: (phaseStep: PhaseStep) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedGame = {
      ...currentGame,
      phaseStep,
      updatedAt: new Date(),
    } as Game;

    set({ currentGame: updatedGame });
    console.log(`➡️ Sous-phase mise à jour: ${phaseStep}`);
  },

  setPendingNightState: (updates: Partial<PendingNightState>) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const merged: PendingNightState = {
      ...(currentGame.pendingNightState || {}),
      ...updates,
    };

    const updatedGame: Game = {
      ...currentGame,
      pendingNightState: merged,
      updatedAt: new Date(),
    };

    set({ currentGame: updatedGame });
    console.log("🌙 État de nuit mis à jour", merged);
  },

  buildShotPlan: () => {
    const { currentGame } = get();
    if (!currentGame) return;

    const pending = currentGame.pendingNightState || {};
    const plan: Record<string, ShotType> = {};

    // Base: water for everyone
    for (const p of currentGame.players) {
      plan[p.id] = "water";
    }

    // Wolves victim gets alcohol
    if (pending.wolvesTargetId) {
      plan[pending.wolvesTargetId] = "alcohol";
    }

    // Cupid'Eau protection overrides wolves alcohol with magical
    if (
      pending.cupidProtectId &&
      pending.wolvesTargetId &&
      pending.cupidProtectId === pending.wolvesTargetId
    ) {
      plan[pending.wolvesTargetId] = "magical";
    }

    // Sucière decisions
    if (pending.suciereDecision === "save" && pending.wolvesTargetId) {
      plan[pending.wolvesTargetId] = "empty"; // empty glass shown to saved victim
    }
    if (pending.suciereDecision === "kill" && pending.suciereKillTargetId) {
      plan[pending.suciereKillTargetId] = "alcohol-suciere";
    }

    const updatedGame: Game = {
      ...currentGame,
      shotPlan: plan,
      updatedAt: new Date(),
    };

    set({ currentGame: updatedGame });
    console.log("🥃 Plan des shots construit", plan);
  },

  applyVillageoiseSwap: () => {
    const { currentGame } = get();
    if (!currentGame) return;

    const swap = currentGame.pendingNightState?.villageoiseSwap;
    if (!swap) return;

    const players = [...currentGame.players];
    const findIndexById = (id: string) => players.findIndex((p) => p.id === id);

    if (swap.mode === "self" && swap.bId) {
      const idxA = findIndexById(swap.aId);
      const idxB = findIndexById(swap.bId);
      if (idxA >= 0 && idxB >= 0) {
        const roleA = players[idxA].role;
        players[idxA] = { ...players[idxA], role: players[idxB].role };
        players[idxB] = { ...players[idxB], role: roleA };
      }
    } else if (swap.mode === "others" && swap.bId) {
      const idxA = findIndexById(swap.aId);
      const idxB = findIndexById(swap.bId);
      if (idxA >= 0 && idxB >= 0) {
        const roleA = players[idxA].role;
        players[idxA] = { ...players[idxA], role: players[idxB].role };
        players[idxB] = { ...players[idxB], role: roleA };
      }
    }

    const updatedGame: Game = {
      ...currentGame,
      players,
      pendingNightState: {
        ...(currentGame.pendingNightState || {}),
        villageoiseSwap: null,
      },
      updatedAt: new Date(),
    };

    set({ currentGame: updatedGame });
    console.log("🔁 Échange de rôles appliqué (Véritable Villageoise)");
  },

  updatePlayerStatus: (
    playerId: string,
    status: PlayerStatus,
    data?: Record<string, unknown>
  ) => {
    const { currentGame } = get();
    if (!currentGame) return;

    const updatedPlayers = currentGame.players.map((player) =>
      player.id === playerId
        ? {
            ...player,
            status,
            ...(data?.hasUsedAbility
              ? { hasUsedAbility: data.hasUsedAbility as boolean }
              : {}),
            ...(data?.voteTarget
              ? { voteTarget: data.voteTarget as string }
              : {}),
            ...(data?.role ? { role: data.role as Role } : {}),
          }
        : player
    );

    const updatedGame = {
      ...currentGame,
      players: updatedPlayers,
      updatedAt: new Date(),
    };

    set({ currentGame: updatedGame });
    console.log(`👤 Statut du joueur ${playerId} mis à jour: ${status}`);
  },

  getGameStateSnapshot: () => {
    const { currentGame } = get();
    return currentGame ? { ...currentGame } : null;
  },

  restoreGameState: (snapshot: Game) => {
    set({ currentGame: snapshot });
    console.log("💾 État de jeu restauré depuis le snapshot");
  },
}));
