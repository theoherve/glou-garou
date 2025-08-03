import { NextRequest, NextResponse } from "next/server";
import { gameService } from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  try {
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
