import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ roomCode: string }> }
) {
  try {
    const { roomCode } = await params;
    const { players } = await request.json();

    if (!players || !Array.isArray(players)) {
      return NextResponse.json(
        { error: "Données des joueurs invalides" },
        { status: 400 }
      );
    }

    console.log(`🔄 Mise à jour des joueurs pour la salle: ${roomCode}`);
    console.log(`📝 Nombre de joueurs à mettre à jour: ${players.length}`);

    // Récupérer d'abord le jeu pour vérifier qu'il existe
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("id, phase")
      .eq("room_code", roomCode)
      .single();

    if (gameError || !gameData) {
      console.error("❌ Jeu non trouvé:", gameError);
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    // Vérifier que le jeu est en phase 'waiting'
    if (gameData.phase !== "waiting") {
      console.error("❌ Le jeu n'est pas en phase d'attente");
      return NextResponse.json(
        { error: "Le jeu n'est pas en phase d'attente" },
        { status: 400 }
      );
    }

    // Mettre à jour chaque joueur avec son nouveau rôle
    const updatePromises = players.map(async (player) => {
      const { error } = await supabase
        .from("players")
        .update({
          role: player.role,
          updated_at: new Date().toISOString(),
        })
        .eq("id", player.id);

      if (error) {
        console.error(
          `❌ Erreur lors de la mise à jour du joueur ${player.id}:`,
          error
        );
        throw error;
      }

      console.log(
        `✅ Joueur ${player.name} mis à jour avec le rôle: ${player.role}`
      );
      return player;
    });

    // Attendre que toutes les mises à jour soient terminées
    await Promise.all(updatePromises);

    // Mettre à jour la phase du jeu vers 'preparation'
    const { error: phaseError } = await supabase
      .from("games")
      .update({
        phase: "preparation",
        updated_at: new Date().toISOString(),
      })
      .eq("id", gameData.id);

    if (phaseError) {
      console.error(
        "❌ Erreur lors de la mise à jour de la phase:",
        phaseError
      );
      return NextResponse.json(
        { error: "Erreur lors de la mise à jour de la phase" },
        { status: 500 }
      );
    }

    console.log("✅ Phase du jeu mise à jour vers: preparation");

    // Récupérer les joueurs mis à jour pour confirmation
    const { data: updatedPlayers, error: fetchError } = await supabase
      .from("players")
      .select("*")
      .eq("game_id", gameData.id)
      .order("name");

    if (fetchError) {
      console.error(
        "❌ Erreur lors de la récupération des joueurs mis à jour:",
        fetchError
      );
      return NextResponse.json(
        { error: "Erreur lors de la récupération des joueurs" },
        { status: 500 }
      );
    }

    console.log("🎉 Mise à jour des joueurs terminée avec succès !");
    console.log(
      "📊 Rôles attribués:",
      updatedPlayers?.map((p) => `${p.name}: ${p.role}`)
    );

    return NextResponse.json({
      success: true,
      message: "Joueurs mis à jour avec succès",
      gamePhase: "preparation",
      players: updatedPlayers,
    });
  } catch (error) {
    console.error("❌ Erreur lors de la mise à jour des joueurs:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
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

    console.log(`📋 Récupération des joueurs pour la salle: ${roomCode}`);

    // Récupérer le jeu et ses joueurs
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select(
        `
        id,
        room_code,
        phase,
        players (*)
      `
      )
      .eq("room_code", roomCode)
      .single();

    if (gameError || !gameData) {
      console.error("❌ Jeu non trouvé:", gameError);
      return NextResponse.json({ error: "Jeu non trouvé" }, { status: 404 });
    }

    console.log(`✅ ${gameData.players?.length || 0} joueurs récupérés`);

    return NextResponse.json({
      success: true,
      game: gameData,
      players: gameData.players || [],
    });
  } catch (error) {
    console.error("❌ Erreur lors de la récupération des joueurs:", error);
    return NextResponse.json(
      { error: "Erreur interne du serveur" },
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
