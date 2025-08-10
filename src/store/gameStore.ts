import { create } from "zustand";
import {
  Game,
  Player,
  GameState,
  GamePhase,
  GameSettings,
  Role,
  PlayerStatus,
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
        throw new Error("Game not found");
      }

      // Join game via Supabase API
      const newPlayer = await playerApi.joinGame(game.id, playerName);
      set({ currentPlayer: newPlayer, isLoading: false });
    } catch (error) {
      set({ error: "Failed to join game", isLoading: false });
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
}));
