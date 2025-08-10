-- =====================================================
-- Script de création des tables pour Glou-Garou
-- Version optimisée avec gestion d'erreurs
-- =====================================================
-- 1. Création des tables dans l'ordre (dépendances respectées)
-- =====================================================
-- Table games (pas de dépendances)
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
-- Table players (dépend de games)
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
-- Table game_actions (dépend de games et players)
CREATE TABLE IF NOT EXISTS game_actions (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
    player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
    action_type TEXT NOT NULL,
    target_id UUID REFERENCES players(id),
    action_data JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
-- 2. Création des index pour les performances
-- =====================================================
CREATE INDEX IF NOT EXISTS idx_games_room_code ON games(room_code);
CREATE INDEX IF NOT EXISTS idx_players_game_id ON players(game_id);
CREATE INDEX IF NOT EXISTS idx_game_actions_game_id ON game_actions(game_id);
CREATE INDEX IF NOT EXISTS idx_game_actions_player_id ON game_actions(player_id);
-- 3. Activation de RLS (Row Level Security)
-- =====================================================
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_actions ENABLE ROW LEVEL SECURITY;
-- 4. Création des politiques RLS
-- =====================================================
-- Politique pour les jeux - permettre toutes les opérations
DROP POLICY IF EXISTS "Allow all operations on games" ON games;
CREATE POLICY "Allow all operations on games" ON games FOR ALL USING (true);
-- Politique pour les joueurs - permettre toutes les opérations
DROP POLICY IF EXISTS "Allow all operations on players" ON players;
CREATE POLICY "Allow all operations on players" ON players FOR ALL USING (true);
-- Politique pour les actions de jeu - permettre toutes les opérations
DROP POLICY IF EXISTS "Allow all operations on game_actions" ON game_actions;
CREATE POLICY "Allow all operations on game_actions" ON game_actions FOR ALL USING (true);
-- 5. Création de la fonction de mise à jour automatique
-- =====================================================
CREATE OR REPLACE FUNCTION update_updated_at_column() RETURNS TRIGGER AS $$ BEGIN NEW.updated_at = NOW();
RETURN NEW;
END;
$$ language 'plpgsql';
-- 6. Création des triggers pour updated_at
-- =====================================================
DROP TRIGGER IF EXISTS update_games_updated_at ON games;
CREATE TRIGGER update_games_updated_at BEFORE
UPDATE ON games FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
DROP TRIGGER IF EXISTS update_players_updated_at ON players;
CREATE TRIGGER update_players_updated_at BEFORE
UPDATE ON players FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
-- 7. Activation de Realtime pour toutes les tables
-- =====================================================
DO $$ BEGIN -- Ajouter la table games à la publication realtime
BEGIN ALTER PUBLICATION supabase_realtime
ADD TABLE games;
RAISE NOTICE 'Table games ajoutée à realtime';
EXCEPTION
WHEN duplicate_object THEN RAISE NOTICE 'Table games déjà dans realtime';
WHEN OTHERS THEN RAISE NOTICE 'Erreur lors de l''ajout de games à realtime: %',
SQLERRM;
END;
-- Ajouter la table players à la publication realtime
BEGIN ALTER PUBLICATION supabase_realtime
ADD TABLE players;
RAISE NOTICE 'Table players ajoutée à realtime';
EXCEPTION
WHEN duplicate_object THEN RAISE NOTICE 'Table players déjà dans realtime';
WHEN OTHERS THEN RAISE NOTICE 'Erreur lors de l''ajout de players à realtime: %',
SQLERRM;
END;
-- Ajouter la table game_actions à la publication realtime
BEGIN ALTER PUBLICATION supabase_realtime
ADD TABLE game_actions;
RAISE NOTICE 'Table game_actions ajoutée à realtime';
EXCEPTION
WHEN duplicate_object THEN RAISE NOTICE 'Table game_actions déjà dans realtime';
WHEN OTHERS THEN RAISE NOTICE 'Erreur lors de l''ajout de game_actions à realtime: %',
SQLERRM;
END;
END $$;
-- 8. Vérification finale
-- =====================================================
DO $$ BEGIN RAISE NOTICE '=== VÉRIFICATION DES TABLES ===';
RAISE NOTICE 'Table games: %',
(
    SELECT COUNT(*)
    FROM games
);
RAISE NOTICE 'Table players: %',
(
    SELECT COUNT(*)
    FROM players
);
RAISE NOTICE 'Table game_actions: %',
(
    SELECT COUNT(*)
    FROM game_actions
);
RAISE NOTICE '=== SCRIPT TERMINÉ AVEC SUCCÈS ===';
END $$;