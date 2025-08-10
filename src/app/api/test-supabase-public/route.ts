import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test avec une URL Supabase publique
    const response = await fetch("https://supabase.com");

    if (response.ok) {
      return NextResponse.json({
        success: true,
        message: "Connexion internet OK",
        status: response.status,
        timestamp: new Date().toISOString(),
      });
    } else {
      return NextResponse.json(
        {
          success: false,
          error: `HTTP ${response.status}`,
          timestamp: new Date().toISOString(),
        },
        { status: 500 }
      );
    }
  } catch (error) {
    console.error("Erreur test public:", error);

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
