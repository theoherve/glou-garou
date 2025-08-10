import { NextResponse } from "next/server";
import {
  testPostgresConnection,
  checkTables,
  createTablesIfNotExist,
} from "@/lib/postgres";

export async function GET() {
  try {
    // Test 1: Connexion PostgreSQL
    const connectionTest = await testPostgresConnection();

    if (!connectionTest.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Erreur de connexion PostgreSQL",
          details: connectionTest.error,
        },
        { status: 500 }
      );
    }

    // Test 2: Vérifier les tables
    const tablesCheck = await checkTables();

    // Test 3: Créer les tables si elles n'existent pas
    let tablesCreated = null;
    if (tablesCheck.success && tablesCheck.tables.length < 3) {
      tablesCreated = await createTablesIfNotExist();
    }

    return NextResponse.json({
      success: true,
      message: "Tests PostgreSQL réussis",
      connection: connectionTest.data,
      tables: tablesCheck.success ? tablesCheck.tables : [],
      tablesCreated: tablesCreated,
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    console.error("Erreur API test-postgres:", error);

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
