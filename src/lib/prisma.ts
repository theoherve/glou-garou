import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

// Game service functions using Prisma
export const gameService = {
  // Create a new game
  async createGame(roomCode: string, gameMasterId: string) {
    return await prisma.game.create({
      data: {
        roomCode,
        gameMasterId,
        phase: "waiting",
      },
    });
  },

  // Get game by room code
  async getGameByRoomCode(roomCode: string) {
    return await prisma.game.findUnique({
      where: { roomCode },
    });
  },

  // Update game phase
  async updateGamePhase(gameId: string, phase: string) {
    return await prisma.game.update({
      where: { id: gameId },
      data: { phase },
    });
  },

  // Update current night
  async updateCurrentNight(gameId: string, currentNight: number) {
    return await prisma.game.update({
      where: { id: gameId },
      data: { currentNight },
    });
  },

  // Get all players in a game
  async getGamePlayers(gameId: string) {
    return await prisma.player.findMany({
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
    return await prisma.player.create({
      data: {
        ...playerData,
        gameId,
      },
    });
  },

  // Update player
  async updatePlayer(playerId: string, updates: any) {
    return await prisma.player.update({
      where: { id: playerId },
      data: updates,
    });
  },

  // Get game settings
  async getGameSettings(gameId: string) {
    return await prisma.gameSettings.findUnique({
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
    return await prisma.gameSettings.upsert({
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
    return await prisma.gameAction.create({
      data: {
        ...action,
        gameId,
      },
    });
  },

  // Get game with all related data
  async getGameWithDetails(roomCode: string) {
    return await prisma.game.findUnique({
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
