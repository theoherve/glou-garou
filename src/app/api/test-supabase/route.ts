import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  try {
    // Vérifier les variables d'environnement
    const hasSupabaseUrl = !!process.env.NEXT_PUBLIC_SUPABASE_URL;
    const hasSupabaseKey = !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!hasSupabaseUrl || !hasSupabaseKey) {
      return NextResponse.json(
        {
          success: false,
          error: "Variables d'environnement Supabase manquantes",
          env: {
            hasSupabaseUrl,
            hasSupabaseKey,
          },
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }

    // Tester la connexion Supabase
    const { data: testData, error: testError } = await supabase
      .from("games")
      .select("count")
      .limit(1);

    if (testError) {
      // Si l'erreur indique que la table n'existe pas, c'est normal
      if (testError.message.includes('relation "games" does not exist')) {
        return NextResponse.json({
          success: true,
          message:
            "Connexion Supabase OK, mais table 'games' n'existe pas encore",
          timestamp: new Date().toISOString(),
          env: {
            hasSupabaseUrl,
            hasSupabaseKey,
            url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "...",
          },
          tableStatus: "missing",
        });
      }

      return NextResponse.json(
        {
          success: false,
          error: `Erreur de connexion Supabase: ${testError.message}`,
          timestamp: new Date().toISOString(),
          env: {
            hasSupabaseUrl,
            hasSupabaseKey,
            url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "...",
          },
        },
        { status: 500 }
      );
    }

    // Si on arrive ici, la table existe et la connexion fonctionne
    return NextResponse.json({
      success: true,
      message: "Connexion Supabase OK, table 'games' existe",
      timestamp: new Date().toISOString(),
      env: {
        hasSupabaseUrl,
        hasSupabaseKey,
        url: process.env.NEXT_PUBLIC_SUPABASE_URL?.substring(0, 20) + "...",
      },
      tableStatus: "exists",
    });
  } catch (error) {
    console.error("Erreur API test-supabase:", error);

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
