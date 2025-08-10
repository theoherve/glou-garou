import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST() {
  try {
    // Vérifier que Supabase est configuré
    if (
      !process.env.NEXT_PUBLIC_SUPABASE_URL ||
      !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Variables d'environnement Supabase manquantes",
        },
        { status: 500 }
      );
    }

    // Vérifier si les tables existent déjà
    const { data: gamesTable, error: gamesError } = await supabase
      .from("games")
      .select("id")
      .limit(1);

    if (
      gamesError &&
      !gamesError.message.includes('relation "games" does not exist')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Erreur lors de la vérification de la table games: ${gamesError.message}`,
        },
        { status: 500 }
      );
    }

    const { data: playersTable, error: playersError } = await supabase
      .from("players")
      .select("id")
      .limit(1);

    if (
      playersError &&
      !playersError.message.includes('relation "players" does not exist')
    ) {
      return NextResponse.json(
        {
          success: false,
          error: `Erreur lors de la vérification de la table players: ${playersError.message}`,
        },
        { status: 500 }
      );
    }

    // Si les tables existent déjà, retourner un succès
    if (gamesTable !== null && playersTable !== null) {
      return NextResponse.json({
        success: true,
        message: "Les tables existent déjà",
        timestamp: new Date().toISOString(),
        tables: {
          games: "exists",
          players: "exists",
        },
      });
    }

    // Si on arrive ici, les tables n'existent pas et nous ne pouvons pas les créer
    // car l'utilisateur n'a pas les permissions nécessaires
    return NextResponse.json(
      {
        success: false,
        error:
          "Les tables n'existent pas et ne peuvent pas être créées via l'API publique. Veuillez les créer manuellement dans votre dashboard Supabase.",
        timestamp: new Date().toISOString(),
        tables: {
          games: gamesTable === null ? "missing" : "exists",
          players: playersTable === null ? "missing" : "exists",
        },
      },
      { status: 400 }
    );
  } catch (error) {
    console.error("Erreur création tables:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        timestamp: new Date().toISOString(),
      },
      { status: 500 }
    );
  }
}
