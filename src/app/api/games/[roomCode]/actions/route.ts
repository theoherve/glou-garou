import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const { roomCode } = await params;
    const { actionType, playerId, targetId, actionData } = await request.json();

    if (!actionType || !playerId) {
      return NextResponse.json(
        { error: "Action type and player ID are required" },
        { status: 400 }
      );
    }

    // Vérifier que le jeu existe
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id")
      .eq("room_code", roomCode)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Vérifier que le joueur existe
    const { data: player, error: playerError } = await supabase
      .from("players")
      .select("id, game_id")
      .eq("id", playerId)
      .single();

    if (playerError || !player) {
      return NextResponse.json({ error: "Player not found" }, { status: 404 });
    }

    if (player.game_id !== game.id) {
      return NextResponse.json(
        { error: "Player not in this game" },
        { status: 403 }
      );
    }

    // Créer l'action de jeu
    const { data: action, error: actionError } = await supabase
      .from("game_actions")
      .insert({
        game_id: game.id,
        player_id: playerId,
        action_type: actionType,
        target_id: targetId,
        action_data: actionData,
      })
      .select()
      .single();

    if (actionError) {
      console.error("Error creating game action:", actionError);
      return NextResponse.json(
        { error: "Failed to create game action" },
        { status: 500 }
      );
    }

    // Mettre à jour les données du jeu selon le type d'action
    switch (actionType) {
      case "vote":
        if (targetId) {
          await supabase
            .from("players")
            .update({ vote_target: targetId })
            .eq("id", playerId);
        }
        break;

      case "ability_use":
        await supabase
          .from("players")
          .update({ has_used_ability: true })
          .eq("id", playerId);
        break;

      case "phase_change":
        if (actionData?.phase) {
          await supabase
            .from("games")
            .update({
              phase: actionData.phase,
              current_night: actionData.current_night || 0,
              updated_at: new Date().toISOString(),
            })
            .eq("id", game.id);
        }
        break;

      case "player_elimination":
        if (targetId) {
          await supabase
            .from("players")
            .update({
              status: "eliminated",
              updated_at: new Date().toISOString(),
            })
            .eq("id", targetId);
        }
        break;

      case "role_reveal":
        if (targetId && actionData?.role) {
          await supabase
            .from("players")
            .update({
              role: actionData.role,
              updated_at: new Date().toISOString(),
            })
            .eq("id", targetId);
        }
        break;
    }

    return NextResponse.json({
      success: true,
      action,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error processing game action:", error);
    return NextResponse.json(
      { error: "Failed to process game action" },
      { status: 500 }
    );
  }
}

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const { roomCode } = await params;
    const { searchParams } = new URL(request.url);
    const actionType = searchParams.get("actionType");
    const playerId = searchParams.get("playerId");

    // Vérifier que le jeu existe
    const { data: game, error: gameError } = await supabase
      .from("games")
      .select("id")
      .eq("room_code", roomCode)
      .single();

    if (gameError || !game) {
      return NextResponse.json({ error: "Game not found" }, { status: 404 });
    }

    // Construire la requête
    let query = supabase
      .from("game_actions")
      .select("*")
      .eq("game_id", game.id);

    if (actionType) {
      query = query.eq("action_type", actionType);
    }

    if (playerId) {
      query = query.eq("player_id", playerId);
    }

    const { data: actions, error: actionsError } = await query.order(
      "created_at",
      { ascending: false }
    );

    if (actionsError) {
      console.error("Error fetching game actions:", actionsError);
      return NextResponse.json(
        { error: "Failed to fetch game actions" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      actions,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Error fetching game actions:", error);
    return NextResponse.json(
      { error: "Failed to fetch game actions" },
      { status: 500 }
    );
  }
}
