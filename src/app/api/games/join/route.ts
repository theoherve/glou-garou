import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/lib/prisma";

export async function POST(request: NextRequest) {
  try {
    const { roomCode, playerName } = await request.json();

    if (!roomCode || !playerName) {
      return NextResponse.json(
        { error: "Room code and player name are required" },
        { status: 400 }
      );
    }

    // Get game by room code
    const game = await gameService.getGameByRoomCode(roomCode);
    if (!game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Add player to game
    const player = await gameService.addPlayer(game.id, {
      name: playerName,
      role: "villageois", // Will be assigned when game starts
      status: "alive",
      isGameMaster: false,
      isLover: false,
      hasUsedAbility: false,
    });

    return NextResponse.json({
      success: true,
      player,
      game: {
        id: game.id,
        roomCode: game.roomCode,
        phase: game.phase,
      },
    });
  } catch (error) {
    console.error("Error joining game:", error);
    return NextResponse.json({ error: "Failed to join game" }, { status: 500 });
  }
}
