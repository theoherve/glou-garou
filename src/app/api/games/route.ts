import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(request: NextRequest) {
  try {
    const { action, roomCode, playerName, gameMasterId, settings } =
      await request.json();

    if (action === "create") {
      // Créer un nouveau jeu
      if (!roomCode || !gameMasterId || !settings) {
        return NextResponse.json(
          { error: "Room code, game master ID, and settings are required" },
          { status: 400 }
        );
      }

      // Vérifier que le code de salle n'existe pas déjà
      const { data: existingGame } = await supabase
        .from("games")
        .select("id")
        .eq("room_code", roomCode)
        .single();

      if (existingGame) {
        return NextResponse.json(
          { error: "Room code already exists" },
          { status: 409 }
        );
      }

      // Créer le jeu
      const { data: game, error: gameError } = await supabase
        .from("games")
        .insert({
          room_code: roomCode,
          game_master_id: gameMasterId,
          phase: "waiting",
          current_night: 0,
          game_settings: settings,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (gameError) {
        console.error("Error creating game:", gameError);
        return NextResponse.json(
          { error: "Failed to create game" },
          { status: 500 }
        );
      }

      // Créer le joueur maître de jeu
      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({
          game_id: game.id,
          name: "Game Master",
          role: "villageois", // Rôle par défaut pour le maître de jeu
          is_game_master: true,
          status: "alive",
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (playerError) {
        console.error("Error creating game master player:", playerError);
        return NextResponse.json(
          { error: "Failed to create game master player" },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        game,
        player,
        timestamp: new Date().toISOString(),
      });
    } else if (action === "join") {
      // Rejoindre un jeu existant
      if (!roomCode || !playerName) {
        return NextResponse.json(
          { error: "Room code and player name are required" },
          { status: 400 }
        );
      }

      // Vérifier que le jeu existe et est en attente
      const { data: game, error: gameError } = await supabase
        .from("games")
        .select("id, phase, game_settings")
        .eq("room_code", roomCode)
        .single();

      if (gameError || !game) {
        return NextResponse.json({ error: "Game not found" }, { status: 404 });
      }

      if (game.phase !== "waiting") {
        return NextResponse.json(
          { error: "Game is already in progress or finished" },
          { status: 400 }
        );
      }

      // Vérifier le nombre maximum de joueurs
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

      const maxPlayers = game.game_settings?.maxPlayers || 10;
      if (players.length >= maxPlayers) {
        return NextResponse.json({ error: "Game is full" }, { status: 400 });
      }

      // Créer le joueur
      const { data: player, error: playerError } = await supabase
        .from("players")
        .insert({
          game_id: game.id,
          name: playerName,
          role: "unknown",
          is_game_master: false,
          status: "alive",
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

      return NextResponse.json({
        success: true,
        game,
        player,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        { error: "Invalid action. Use 'create' or 'join'" },
        { status: 400 }
      );
    }
  } catch (error) {
    console.error("Error processing game action:", error);
    return NextResponse.json(
      { error: "Failed to process game action" },
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

    // Récupérer les informations du jeu
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select(
        `
        *,
        players (*)
      `
      )
      .eq("room_code", roomCode)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      game,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching game:", error);
    return NextResponse.json(
      { error: "Failed to fetch game" },
      { status: 500 }
    );
  }
}
