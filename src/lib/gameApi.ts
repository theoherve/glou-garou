import { supabase } from "./supabase";
import { GameRow, PlayerRow, GameActionRow } from "./supabase";
import {
  Game,
  Player,
  GameSettings,
  GamePhase,
  Role,
  PlayerStatus,
} from "@/types/game";

// Fonctions pour les jeux
export const gameApi = {
  async createGame(
    roomCode: string,
    gameMasterId: string,
    settings: GameSettings
  ): Promise<Game> {
    console.log("gameApi.createGame appelé avec:", {
      roomCode,
      gameMasterId,
      settings,
    });

    try {
      const { data, error } = await supabase
        .from("games")
        .insert({
          room_code: roomCode,
          game_master_id: gameMasterId,
          phase: "waiting",
          current_night: 0,
          game_settings: settings,
        })
        .select()
        .single();

      if (error) {
        console.error("Erreur Supabase lors de la création du jeu:", error);
        throw new Error(`Erreur Supabase: ${error.message}`);
      }

      console.log("Jeu créé avec succès dans Supabase:", data);

      return {
        id: data.id,
        roomCode: data.room_code,
        phase: data.phase as GamePhase,
        players: [],
        gameMasterId: data.game_master_id,
        currentNight: data.current_night,
        eliminatedPlayers: [],
        gameSettings: data.game_settings,
        createdAt: new Date(data.created_at),
        updatedAt: new Date(data.updated_at),
      };
    } catch (error) {
      console.error("Erreur dans createGame:", error);
      throw error;
    }
  },

  async getGameByRoomCode(roomCode: string): Promise<Game | null> {
    const { data: gameData, error: gameError } = await supabase
      .from("games")
      .select("*")
      .eq("room_code", roomCode)
      .single();

    if (gameError) return null;

    const { data: playersData, error: playersError } = await supabase
      .from("players")
      .select("*")
      .eq("game_id", gameData.id);

    if (playersError) throw playersError;

    const players: Player[] = playersData.map((p: PlayerRow) => ({
      id: p.id,
      name: p.name,
      role: p.role as Role,
      status: p.status as PlayerStatus,
      isGameMaster: p.is_game_master,
      isLover: p.is_lover,
      loverId: p.lover_id || undefined,
      hasUsedAbility: p.has_used_ability,
      voteTarget: p.vote_target || undefined,
    }));

    return {
      id: gameData.id,
      roomCode: gameData.room_code,
      phase: gameData.phase as GamePhase,
      players,
      gameMasterId: gameData.game_master_id,
      currentNight: gameData.current_night,
      eliminatedPlayers: players
        .filter((p) => p.status === "eliminated")
        .map((p) => p.id),
      gameSettings: gameData.game_settings,
      createdAt: new Date(gameData.created_at),
      updatedAt: new Date(gameData.updated_at),
    };
  },

  async updateGamePhase(gameId: string, phase: GamePhase): Promise<void> {
    const { error } = await supabase
      .from("games")
      .update({ phase, updated_at: new Date().toISOString() })
      .eq("id", gameId);

    if (error) throw error;
  },

  async updateGameNight(gameId: string, currentNight: number): Promise<void> {
    const { error } = await supabase
      .from("games")
      .update({
        current_night: currentNight,
        updated_at: new Date().toISOString(),
      })
      .eq("id", gameId);

    if (error) throw error;
  },
};

// Fonctions pour les joueurs
export const playerApi = {
  async joinGame(gameId: string, playerName: string): Promise<Player> {
    const { data, error } = await supabase
      .from("players")
      .insert({
        game_id: gameId,
        name: playerName,
        role: "villager",
        status: "alive",
        is_game_master: false,
        is_lover: false,
        has_used_ability: false,
      })
      .select()
      .single();

    if (error) throw error;

    return {
      id: data.id,
      name: data.name,
      role: data.role as Role,
      status: data.status as PlayerStatus,
      isGameMaster: data.is_game_master,
      isLover: data.is_lover,
      loverId: data.lover_id || undefined,
      hasUsedAbility: data.has_used_ability,
      voteTarget: data.vote_target || undefined,
    };
  },

  async updatePlayer(
    playerId: string,
    updates: Partial<Player>
  ): Promise<void> {
    const updateData: any = { updated_at: new Date().toISOString() };

    if (updates.role !== undefined) updateData.role = updates.role;
    if (updates.status !== undefined) updateData.status = updates.status;
    if (updates.isGameMaster !== undefined)
      updateData.is_game_master = updates.isGameMaster;
    if (updates.isLover !== undefined) updateData.is_lover = updates.isLover;
    if (updates.loverId !== undefined) updateData.lover_id = updates.loverId;
    if (updates.hasUsedAbility !== undefined)
      updateData.has_used_ability = updates.hasUsedAbility;
    if (updates.voteTarget !== undefined)
      updateData.vote_target = updates.voteTarget;

    const { error } = await supabase
      .from("players")
      .update(updateData)
      .eq("id", playerId);

    if (error) throw error;
  },

  async getPlayersByGameId(gameId: string): Promise<Player[]> {
    const { data, error } = await supabase
      .from("players")
      .select("*")
      .eq("game_id", gameId);

    if (error) throw error;

    return data.map((p: PlayerRow) => ({
      id: p.id,
      name: p.name,
      role: p.role as Role,
      status: p.status as PlayerStatus,
      isGameMaster: p.is_game_master,
      isLover: p.is_lover,
      loverId: p.lover_id || undefined,
      hasUsedAbility: p.has_used_ability,
      voteTarget: p.vote_target || undefined,
    }));
  },
};

// Fonctions pour les actions de jeu
export const gameActionApi = {
  async recordAction(
    gameId: string,
    playerId: string,
    actionType: string,
    targetId?: string,
    actionData?: any
  ): Promise<void> {
    const { error } = await supabase.from("game_actions").insert({
      game_id: gameId,
      player_id: playerId,
      action_type: actionType,
      target_id: targetId,
      action_data: actionData,
    });

    if (error) throw error;
  },

  async getActionsByGameId(gameId: string): Promise<GameActionRow[]> {
    const { data, error } = await supabase
      .from("game_actions")
      .select("*")
      .eq("game_id", gameId)
      .order("created_at", { ascending: true });

    if (error) throw error;
    return data;
  },
};
