import { NextResponse } from "next/server";

export async function GET() {
  try {
    // Test simple sans Supabase d'abord
    return NextResponse.json({
      success: true,
      message: "API fonctionne",
      timestamp: new Date().toISOString(),
      env: {
        hasSupabaseUrl: !!process.env.GLOU_GAROU_SUPABASE_URL,
        hasSupabaseKey: !!process.env.GLOU_GAROU_SUPABASE_ANON_KEY,
        url: process.env.GLOU_GAROU_SUPABASE_URL?.substring(0, 20) + "...",
      },
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
