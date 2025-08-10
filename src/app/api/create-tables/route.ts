import { NextResponse } from "next/server";

export async function POST() {
  try {
    const supabaseUrl = process.env.GLOU_GAROU_SUPABASE_URL;
    const supabaseKey = process.env.GLOU_GAROU_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Variables d'environnement manquantes",
        },
        { status: 500 }
      );
    }

    // Créer la table games
    const createGamesResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `
          CREATE TABLE IF NOT EXISTS games (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            room_code TEXT UNIQUE NOT NULL,
            phase TEXT NOT NULL DEFAULT 'waiting',
            game_master_id TEXT NOT NULL,
            current_night INTEGER NOT NULL DEFAULT 0,
            game_settings JSONB NOT NULL DEFAULT '{}',
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
        }),
      }
    );

    if (!createGamesResponse.ok) {
      const errorText = await createGamesResponse.text();
      return NextResponse.json(
        {
          success: false,
          error: `Erreur création table games: ${errorText}`,
        },
        { status: 500 }
      );
    }

    // Créer la table players
    const createPlayersResponse = await fetch(
      `${supabaseUrl}/rest/v1/rpc/exec_sql`,
      {
        method: "POST",
        headers: {
          apikey: supabaseKey,
          Authorization: `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          sql: `
          CREATE TABLE IF NOT EXISTS players (
            id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
            game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
            name TEXT NOT NULL,
            role TEXT NOT NULL DEFAULT 'villager',
            status TEXT NOT NULL DEFAULT 'alive',
            is_game_master BOOLEAN NOT NULL DEFAULT FALSE,
            is_lover BOOLEAN NOT NULL DEFAULT FALSE,
            lover_id UUID REFERENCES players(id),
            has_used_ability BOOLEAN NOT NULL DEFAULT FALSE,
            vote_target UUID REFERENCES players(id),
            created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
            updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
          );
        `,
        }),
      }
    );

    if (!createPlayersResponse.ok) {
      const errorText = await createPlayersResponse.text();
      return NextResponse.json(
        {
          success: false,
          error: `Erreur création table players: ${errorText}`,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Tables créées avec succès via API REST",
      timestamp: new Date().toISOString(),
    });
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
