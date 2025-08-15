import { Pool } from "pg";

const postgresUrl = process.env.GLOU_GAROU_POSTGRES_URL_NON_POOLING;

if (!postgresUrl) {
  throw new Error("GLOU_GAROU_POSTGRES_URL_NON_POOLING is required");
}

// Créer un pool de connexions PostgreSQL
export const postgresPool = new Pool({
  connectionString: postgresUrl,
  ssl:
    process.env.NODE_ENV === "production"
      ? {
          rejectUnauthorized: true,
        }
      : {
          rejectUnauthorized: false,
        },
});

// Fonction pour tester la connexion
export const testPostgresConnection = async () => {
  try {
    const client = await postgresPool.connect();
    const result = await client.query(
      "SELECT NOW() as current_time, version() as version"
    );
    client.release();
    return {
      success: true,
      data: result.rows[0],
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Fonction pour vérifier si les tables existent
export const checkTables = async () => {
  try {
    const client = await postgresPool.connect();

    // Vérifier si les tables existent
    const tablesQuery = `
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      AND table_name IN ('games', 'players', 'game_actions')
      ORDER BY table_name;
    `;

    const result = await client.query(tablesQuery);
    client.release();

    return {
      success: true,
      tables: result.rows.map((row) => row.table_name),
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};

// Fonction pour créer les tables si elles n'existent pas
export const createTablesIfNotExist = async () => {
  try {
    const client = await postgresPool.connect();

    // Créer la table games
    await client.query(`
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
    `);

    // Créer la table players
    await client.query(`
      CREATE TABLE IF NOT EXISTS players (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        name TEXT NOT NULL,
        role TEXT NOT NULL DEFAULT 'villageois',
        status TEXT NOT NULL DEFAULT 'alive',
        is_game_master BOOLEAN NOT NULL DEFAULT FALSE,
        is_lover BOOLEAN NOT NULL DEFAULT FALSE,
        lover_id UUID REFERENCES players(id),
        has_used_ability BOOLEAN NOT NULL DEFAULT FALSE,
        vote_target UUID REFERENCES players(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Créer la table game_actions
    await client.query(`
      CREATE TABLE IF NOT EXISTS game_actions (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
        player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
        action_type TEXT NOT NULL,
        target_id UUID REFERENCES players(id),
        action_data JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
      );
    `);

    // Créer les index
    await client.query(`
      CREATE INDEX IF NOT EXISTS idx_games_room_code ON games(room_code);
      CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);
      CREATE INDEX IF NOT EXISTS idx_game_actions_game_id ON game_actions(game_id);
      CREATE INDEX IF NOT EXISTS idx_game_actions_player_id ON game_actions(player_id);
    `);

    client.release();

    return {
      success: true,
      message: "Tables créées avec succès",
    };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    };
  }
};
