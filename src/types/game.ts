export type Role =
  | "loup-garou"
  | "villageois"
  | "voyante"
  | "chasseur"
  | "cupidon"
  | "sorciere"
  | "petite-fille"
  | "capitaine"
  | "voleur";

export type GamePhase =
  | "waiting"
  | "preparation"
  | "night"
  | "day"
  | "voting"
  | "ended";

export type PlayerStatus = "alive" | "dead" | "eliminated";

// Sub-steps to strictly follow the custom trame
export type PhaseStep =
  | "wolves"
  | "camel-bent"
  | "cupid-eau"
  | "suciere"
  | "veritable-villageoise"
  | "night-complete"
  | "shots-reveal"
  | "victim-detection-15s"
  | "last-sip-or-instant-death"
  | "discussion"
  | "vote";

export type ShotType =
  | "water"
  | "alcohol"
  | "magical"
  | "empty"
  | "alcohol-suciere";

export interface VillageoiseSwap {
  mode: "self" | "others";
  aId: string;
  bId?: string;
}

export interface PendingNightState {
  wolvesTargetId?: string;
  camelBentGuessId?: string;
  cupidProtectId?: string;
  suciereDecision?: "save" | "kill" | "none";
  suciereKillTargetId?: string;
  villageoiseSwap?: VillageoiseSwap | null;
  pendingResurrectionId?: string; // scheduled revive at start of next night
}

export interface Player {
  id: string;
  name: string;
  role: Role;
  status: PlayerStatus;
  isGameMaster: boolean;
  isLover?: boolean;
  loverId?: string;
  hasUsedAbility?: boolean;
  voteTarget?: string;
}

export interface Game {
  id: string;
  roomCode: string;
  phase: GamePhase;
  phaseStep?: PhaseStep; // sub-phase to follow the trame precisely
  players: Player[];
  gameMasterId: string;
  currentNight: number;
  eliminatedPlayers: string[];
  gameSettings: GameSettings;
  // Night orchestration
  pendingNightState?: PendingNightState;
  shotPlan?: Record<string, ShotType>; // playerId -> shot
  createdAt: Date;
  updatedAt: Date;
}

export interface GameSettings {
  roles: Role[];
  minPlayers: number;
  maxPlayers: number;
  roleCounts: Record<Role, number>;
  enableLovers: boolean;
  enableVoyante: boolean;
  enableChasseur: boolean;
  enableSorciere: boolean;
  enablePetiteFille: boolean;
  enableCapitaine: boolean;
  enableVoleur: boolean;
}

export interface GameAction {
  type: "vote" | "useAbility" | "revealRole" | "eliminatePlayer";
  playerId: string;
  targetId?: string;
  data?: Record<string, unknown>;
}

export interface GameState {
  currentGame: Game | null;
  currentPlayer: Player | null;
  isLoading: boolean;
  error: string | null;
}
