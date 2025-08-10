import { NextResponse } from "next/server";
import { Pool } from "pg";

export async function GET() {
  try {
    // Essayer avec l'URL directe (sans pooler)
    const directUrl = process.env.GLOU_GAROU_POSTGRES_URL?.replace(
      "pooler",
      "db"
    ).replace("6543", "5432");

    if (!directUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "URL PostgreSQL directe non trouvée",
        },
        { status: 500 }
      );
    }

    const pool = new Pool({
      connectionString: directUrl,
      ssl: {
        rejectUnauthorized: false,
      },
    });

    const client = await pool.connect();
    const result = await client.query(
      "SELECT NOW() as current_time, version() as version"
    );
    client.release();
    await pool.end();

    return NextResponse.json({
      success: true,
      message: "Connexion PostgreSQL directe réussie",
      data: result.rows[0],
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur PostgreSQL direct:", error);

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
