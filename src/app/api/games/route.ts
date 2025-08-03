import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { roomCode, gameMasterId, settings } = await request.json();

    if (!roomCode || !gameMasterId) {
      return NextResponse.json(
        { error: "Room code and game master ID are required" },
        { status: 400 }
      );
    }

    // Check if game already exists
    const existingGame = await gameService.getGameByRoomCode(roomCode);
    if (existingGame) {
      return NextResponse.json(
        { error: "Game with this room code already exists" },
        { status: 409 }
      );
    }

    // Create game
    const game = await gameService.createGame(roomCode, gameMasterId);

    // Create game settings if provided
    if (settings) {
      await gameService.upsertGameSettings(game.id, {
        minPlayers: settings.minPlayers,
        maxPlayers: settings.maxPlayers,
        enableLovers: settings.enableLovers,
        enableVoyante: settings.enableVoyante,
        enableChasseur: settings.enableChasseur,
        enableSorciere: settings.enableSorciere,
        enablePetiteFille: settings.enablePetiteFille,
        enableCapitaine: settings.enableCapitaine,
        enableVoleur: settings.enableVoleur,
        roles: settings.roles,
        roleCounts: settings.roleCounts,
      });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error creating game:", error);
    return NextResponse.json(
      { error: "Failed to create game" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const roomCode = searchParams.get("roomCode");

    if (!roomCode) {
      return NextResponse.json(
        { error: "Room code is required" },
        { status: 400 }
      );
    }

    const game = await gameService.getGameByRoomCode(roomCode);

    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json(game);
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}
