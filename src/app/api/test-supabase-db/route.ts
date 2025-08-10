import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export async function GET() {
  try {
    // Créer un client Supabase côté serveur
    const supabaseUrl = process.env.GLOU_GAROU_SUPABASE_URL;
    const supabaseKey = process.env.GLOU_GAROU_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Variables d'environnement manquantes",
          env: {
            hasUrl: !!supabaseUrl,
            hasKey: !!supabaseKey,
          },
        },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseKey);

    // Test de connexion
    const { data, error } = await supabase
      .from("games")
      .select("count")
      .limit(1);

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
          code: error.code,
          details: error.details,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Connexion Supabase réussie côté serveur",
      data: data,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur API test-supabase-db:", error);

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
