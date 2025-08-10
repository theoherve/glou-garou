import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  try {
    // Get game by room code first
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id")
      .eq("room_code", roomCode)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Get all players in the game
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("*")
      .eq("game_id", game.id)
      .order("created_at", { ascending: true });

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return NextResponse.json(
        { error: "Failed to fetch players" },
        { status: 500 }
      );
    }

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
  { params }: { params: Promise<{ roomCode: string }> }
) {
  const { roomCode } = await params;
  try {
    const playerData = await request.json();

    if (!playerData.name || !playerData.role) {
      return NextResponse.json(
        { error: "Player name and role are required" },
        { status: 400 }
      );
    }

    // Get game by room code first
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id")
      .eq("room_code", roomCode)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Create the player
    const { data: player, error: playerError } = await supabase
      .from("players")
      .insert({
        game_id: game.id,
        name: playerData.name,
        role: playerData.role,
        status: "alive",
        is_game_master: playerData.isGameMaster || false,
        is_lover: false,
        has_used_ability: false,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (playerError) {
      console.error("Error creating player:", playerError);
      return NextResponse.json(
        { error: "Failed to create player" },
        { status: 500 }
      );
    }

    return NextResponse.json(player);
  } catch (error) {
    console.error("Error adding player:", error);
    return NextResponse.json(
      { error: "Failed to add player" },
      { status: 500 }
    );
  }
}
