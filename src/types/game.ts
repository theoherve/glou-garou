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
  players: Player[];
  gameMasterId: string;
  currentNight: number;
  eliminatedPlayers: string[];
  gameSettings: GameSettings;
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
