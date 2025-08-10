import { NextResponse } from "next/server";

export async function GET() {
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

    // Test simple avec l'API REST Supabase
    const response = await fetch(`${supabaseUrl}/rest/v1/games?select=count`, {
      method: "GET",
      headers: {
        apikey: supabaseKey,
        Authorization: `Bearer ${supabaseKey}`,
        "Content-Type": "application/json",
      },
    });

    if (response.ok) {
      const data = await response.json();
      return NextResponse.json({
        success: true,
        message: "API REST Supabase fonctionne",
        data: data,
        timestamp: new Date().toISOString(),
      });
    } else {
      const errorText = await response.text();
      return NextResponse.json(
        {
          success: false,
          error: `HTTP ${response.status}: ${errorText}`,
          status: response.status,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur API REST Supabase:", error);

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
