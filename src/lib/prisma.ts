// Server-side only Prisma client
const createPrismaClient = () => {
  try {
    // Only import Prisma on the server side
    if (typeof window === 'undefined') {
      const { PrismaClient } = require("@prisma/client");
      return new PrismaClient({
        log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
      });
    }
  } catch (error) {
    console.error("Failed to create PrismaClient:", error);
  }
  
  // Return null for client-side or if Prisma is not available
  return null;
};

declare global {
  var prisma: any;
}

export const prisma = globalThis.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production" && prisma) {
  globalThis.prisma = prisma;
}

// Helper function to ensure Prisma is available
const ensurePrisma = () => {
  if (!prisma) {
    throw new Error("Prisma client not available");
  }
  return prisma;
};

// Game service functions using Prisma
export const gameService = {
  // Create a new game
  async createGame(roomCode: string, gameMasterId: string) {
    const client = ensurePrisma();
    return await client.game.create({
      data: {
        roomCode,
        gameMasterId,
        phase: "waiting",
      },
    });
  },

  // Get game by room code
  async getGameByRoomCode(roomCode: string) {
    const client = ensurePrisma();
    return await client.game.findUnique({
      where: { roomCode },
    });
  },

  // Update game phase
  async updateGamePhase(gameId: string, phase: string) {
    const client = ensurePrisma();
    return await client.game.update({
      where: { id: gameId },
      data: { phase },
    });
  },

  // Update current night
  async updateCurrentNight(gameId: string, currentNight: number) {
    const client = ensurePrisma();
    return await client.game.update({
      where: { id: gameId },
      data: { currentNight },
    });
  },

  // Get all players in a game
  async getGamePlayers(gameId: string) {
    const client = ensurePrisma();
    return await client.player.findMany({
      where: { gameId },
      orderBy: { createdAt: "asc" },
    });
  },

  // Add player to game
  async addPlayer(
    gameId: string,
    playerData: {
      name: string;
      role: string;
      status: string;
      isGameMaster: boolean;
      isLover: boolean;
      hasUsedAbility: boolean;
    }
  ) {
    const client = ensurePrisma();
    return await client.player.create({
      data: {
        ...playerData,
        gameId,
      },
    });
  },

  // Update player
  async updatePlayer(playerId: string, updates: any) {
    const client = ensurePrisma();
    return await client.player.update({
      where: { id: playerId },
      data: updates,
    });
  },

  // Get game settings
  async getGameSettings(gameId: string) {
    const client = ensurePrisma();
    return await client.gameSettings.findUnique({
      where: { gameId },
    });
  },

  // Create or update game settings
  async upsertGameSettings(
    gameId: string,
    settings: {
      minPlayers: number;
      maxPlayers: number;
      enableLovers: boolean;
      enableVoyante: boolean;
      enableChasseur: boolean;
      enableSorciere: boolean;
      enablePetiteFille: boolean;
      enableCapitaine: boolean;
      enableVoleur: boolean;
      roles: string[];
      roleCounts: Record<string, number>;
    }
  ) {
    const client = ensurePrisma();
    return await client.gameSettings.upsert({
      where: { gameId },
      update: settings,
      create: {
        ...settings,
        gameId,
      },
    });
  },

  // Record game action
  async recordGameAction(
    gameId: string,
    action: {
      type: string;
      playerId: string;
      targetId?: string;
      data?: any;
    }
  ) {
    const client = ensurePrisma();
    return await client.gameAction.create({
      data: {
        ...action,
        gameId,
      },
    });
  },

  // Get game with all related data
  async getGameWithDetails(roomCode: string) {
    const client = ensurePrisma();
    return await client.game.findUnique({
      where: { roomCode },
      include: {
        players: true,
        gameSettings: true,
        gameActions: {
          orderBy: { createdAt: "desc" },
          take: 50, // Last 50 actions
        },
      },
    });
  },
};
