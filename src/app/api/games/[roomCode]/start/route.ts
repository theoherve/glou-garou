import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const { roomCode } = await params;
    const { gameMasterId } = await request.json();

    if (!gameMasterId) {
      return NextResponse.json(
        { error: "Game master ID is required" },
        { status: 400 }
      );
    }

    // Vérifier que le jeu existe et que l'utilisateur est le maître de jeu
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id, game_master_id, status")
      .eq("room_code", roomCode)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    if (game.game_master_id !== gameMasterId) {
      return NextResponse.json(
        { error: "Only the game master can start the game" },
        { status: 403 }
      );
    }

    if (game.status !== "waiting") {
      return NextResponse.json(
        { error: "Game is already in progress or finished" },
        { status: 400 }
      );
    }

    // Vérifier qu'il y a assez de joueurs
    const { data: players, error: playersError } = await supabase
      .from("players")
      .select("id")
      .eq("game_id", game.id);

    if (playersError) {
      console.error("Error fetching players:", playersError);
      return NextResponse.json(
        { error: "Failed to fetch players" },
        { status: 500 }
      );
    }

    if (players.length < 3) {
      return NextResponse.json(
        { error: "Need at least 3 players to start the game" },
        { status: 400 }
      );
    }

    // Démarrer le jeu
    const { data: updatedGame, error: updateError } = await supabase
      .from("games")
      .update({
        status: "in_progress",
        phase: "preparation",
        started_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq("id", game.id)
      .select()
      .single();

    if (updateError) {
      console.error("Error starting game:", updateError);
      return NextResponse.json(
        { error: "Failed to start game" },
        { status: 500 }
      );
    }

    // Créer une action de type "game_start"
    await supabase.from("game_actions").insert({
      game_id: game.id,
      player_id: gameMasterId,
      action_type: "game_start",
      target_id: null,
      action_data: { phase: "preparation" },
    });

    return NextResponse.json({
      success: true,
      game: updatedGame,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error starting game:", error);
    return NextResponse.json(
      { error: "Failed to start game" },
      { status: 500 }
    );
  }
}
