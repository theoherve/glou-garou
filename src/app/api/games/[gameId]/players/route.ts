import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  try {
    const players = await gameService.getGamePlayers(gameId);
    return NextResponse.json(players);
  } catch (error) {
    console.error("Error fetching players:", error);
    return NextResponse.json(
      { error: "Failed to fetch players" },
      { status: 500 }
    );
  }
}

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ gameId: string }> }
) {
  const { gameId } = await params;
  try {
    const playerData = await request.json();

    if (!playerData.name || !playerData.role) {
      return NextResponse.json(
        { error: "Player name and role are required" },
        { status: 400 }
      );
    }

    const player = await gameService.addPlayer(gameId, {
      name: playerData.name,
      role: playerData.role,
      status: "alive",
      isGameMaster: playerData.isGameMaster || false,
      isLover: false,
      hasUsedAbility: false,
    });

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error adding player:", error);
    return NextResponse.json(
      { error: "Failed to add player" },
      { status: 500 }
    );
  }
}
