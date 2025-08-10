import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Missing Supabase environment variables. Please check your .env.local file and ensure NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY are set."
  );
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
});

// Types pour les tables de jeu
export interface GameRow {
  id: string;
  room_code: string;
  phase: string;
  game_master_id: string;
  current_night: number;
  game_settings: any;
  created_at: string;
  updated_at: string;
}

export interface PlayerRow {
  id: string;
  game_id: string;
  name: string;
  role: string;
  status: string;
  is_game_master: boolean;
  is_lover: boolean;
  lover_id?: string;
  has_used_ability: boolean;
  vote_target?: string;
  created_at: string;
  updated_at: string;
}

export interface GameActionRow {
  id: string;
  game_id: string;
  player_id: string;
  action_type: string;
  target_id?: string;
  action_data?: any;
  created_at: string;
}
