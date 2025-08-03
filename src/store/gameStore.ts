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
import { gameService } from "@/lib/prisma";

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
      // Create game in database
      const dbGame = await gameService.createGame(roomCode, gameMasterId);

      // Create game settings
      await gameService.upsertGameSettings(dbGame.id, {
        maxPlayers: settings.maxPlayers,
        enableLovers: settings.enableLovers,
        enableVoyante: settings.enableVoyante,
        enableChasseur: settings.enableChasseur,
        enableSorciere: settings.enableSorciere,
        enablePetiteFille: settings.enablePetiteFille,
        enableCapitaine: settings.enableCapitaine,
        enableVoleur: settings.enableVoleur,
        roles: settings.roles,
      });

      // Convert to local Game type
      const newGame: Game = {
        id: dbGame.id,
        roomCode: dbGame.roomCode,
        phase: dbGame.phase as GamePhase,
        players: [],
        gameMasterId: dbGame.gameMasterId,
        currentNight: dbGame.currentNight,
        eliminatedPlayers: [],
        gameSettings: settings,
        createdAt: new Date(dbGame.createdAt),
        updatedAt: new Date(dbGame.updatedAt),
      };

      set({ currentGame: newGame, isLoading: false });
    } catch (error) {
      set({ error: "Failed to create game", isLoading: false });
    }
  },

  joinGame: async (roomCode, playerName) => {
    set({ isLoading: true, error: null });
    try {
      // Get game by room code
      const game = await gameService.getGameByRoomCode(roomCode);
      if (!game) {
        throw new Error("Game not found");
      }

      // Add player to game
      const dbPlayer = await gameService.addPlayer(game.id, {
        name: playerName,
        role: "villageois", // Will be assigned when game starts
        status: "alive",
        isGameMaster: false,
        isLover: false,
        hasUsedAbility: false,
      });

      // Convert to local Player type
      const newPlayer: Player = {
        id: dbPlayer.id,
        name: dbPlayer.name,
        role: dbPlayer.role as Role,
        status: dbPlayer.status as PlayerStatus,
        isGameMaster: dbPlayer.isGameMaster,
        isLover: dbPlayer.isLover,
        loverId: dbPlayer.loverId || undefined,
        hasUsedAbility: dbPlayer.hasUsedAbility,
        voteTarget: dbPlayer.voteTarget || undefined,
      };

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
      // TODO: Implement API call to start game
      const updatedGame = {
        ...currentGame,
        phase: "preparation" as GamePhase,
        updatedAt: new Date(),
      };
      set({ currentGame: updatedGame, isLoading: false });
    } catch (error) {
      set({ error: "Failed to start game", isLoading: false });
    }
  },

  vote: async (playerId, targetId) => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to vote
      const updatedPlayers = currentGame.players.map((player) =>
        player.id === playerId ? { ...player, voteTarget: targetId } : player
      );
      const updatedGame = {
        ...currentGame,
        players: updatedPlayers,
        updatedAt: new Date(),
      };
      set({ currentGame: updatedGame, isLoading: false });
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
      // TODO: Implement API call to eliminate player
      const updatedPlayers = currentGame.players.map((player) =>
        player.id === playerId
          ? { ...player, status: "eliminated" as const }
          : player
      );
      const updatedGame = {
        ...currentGame,
        players: updatedPlayers,
        eliminatedPlayers: [...currentGame.eliminatedPlayers, playerId],
        updatedAt: new Date(),
      };
      set({ currentGame: updatedGame, isLoading: false });
    } catch (error) {
      set({ error: "Failed to eliminate player", isLoading: false });
    }
  },

  nextPhase: async () => {
    const { currentGame } = get();
    if (!currentGame) return;

    set({ isLoading: true, error: null });
    try {
      // TODO: Implement API call to next phase
      const phaseOrder: GamePhase[] = [
        "waiting",
        "preparation",
        "night",
        "day",
        "voting",
      ];
      const currentIndex = phaseOrder.indexOf(currentGame.phase);
      const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];

      const updatedGame = {
        ...currentGame,
        phase: nextPhase,
        currentNight:
          nextPhase === "night"
            ? currentGame.currentNight + 1
            : currentGame.currentNight,
        updatedAt: new Date(),
      };
      set({ currentGame: updatedGame, isLoading: false });
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
