import { Role } from "@/types/game";

export interface RoleData {
  id: Role;
  name: string;
  description: string;
  nightAction?: string;
  team: "village" | "loup-garou" | "special";
  isActive: boolean;
  maxCount?: number;
  minPlayers?: number;
}

export const ROLES: Record<Role, RoleData> = {
  "loup-garou": {
    id: "loup-garou",
    name: "Loup-Garou",
    description:
      "Vous devez éliminer tous les villageois. Chaque nuit, vous vous réveillez avec vos complices pour choisir une victime.",
    nightAction: "Choisir une victime à éliminer",
    team: "loup-garou",
    isActive: true,
    maxCount: 4,
    minPlayers: 8,
  },
  villageois: {
    id: "villageois",
    name: "Villageois",
    description:
      "Vous devez identifier et éliminer tous les loups-garous. Vous n'avez pas de pouvoir spécial.",
    team: "village",
    isActive: false,
    maxCount: undefined,
    minPlayers: 8,
  },
  voyante: {
    id: "voyante",
    name: "Voyante",
    description:
      "Chaque nuit, vous pouvez découvrir l'identité d'un joueur de votre choix.",
    nightAction: "Découvrir l'identité d'un joueur",
    team: "village",
    isActive: true,
    maxCount: 1,
    minPlayers: 8,
  },
  chasseur: {
    id: "chasseur",
    name: "Chasseur",
    description:
      "Quand vous mourrez, vous pouvez immédiatement éliminer un autre joueur.",
    team: "village",
    isActive: false,
    maxCount: 1,
    minPlayers: 8,
  },
  cupidon: {
    id: "cupidon",
    name: "Cupidon",
    description:
      "La première nuit, vous désignez deux joueurs qui tomberont amoureux. Si l'un meurt, l'autre meurt aussi.",
    nightAction: "Désigner deux amoureux",
    team: "village",
    isActive: true,
    maxCount: 1,
    minPlayers: 8,
  },
  sorciere: {
    id: "sorciere",
    name: "Sorcière",
    description:
      "Vous avez deux potions : une pour sauver une victime, une pour éliminer un joueur.",
    nightAction: "Utiliser une potion",
    team: "village",
    isActive: true,
    maxCount: 1,
    minPlayers: 8,
  },
  "petite-fille": {
    id: "petite-fille",
    name: "Petite Fille",
    description:
      "Vous pouvez espionner les loups-garous pendant qu'ils choisissent leur victime.",
    team: "village",
    isActive: false,
    maxCount: 1,
    minPlayers: 8,
  },
  capitaine: {
    id: "capitaine",
    name: "Capitaine",
    description: "Votre vote compte double lors des éliminations.",
    team: "village",
    isActive: false,
    maxCount: 1,
    minPlayers: 8,
  },
  voleur: {
    id: "voleur",
    name: "Voleur",
    description:
      "La première nuit, vous pouvez échanger votre rôle avec celui d'un autre joueur.",
    nightAction: "Échanger votre rôle",
    team: "village",
    isActive: true,
    maxCount: 1,
    minPlayers: 8,
  },
};

export const getRoleData = (role: Role): RoleData => {
  return ROLES[role];
};

export const getAllRoles = (): RoleData[] => {
  return Object.values(ROLES);
};

export const getVillageRoles = (): RoleData[] => {
  return getAllRoles().filter((role) => role.team === "village");
};

export const getLoupGarouRoles = (): RoleData[] => {
  return getAllRoles().filter((role) => role.team === "loup-garou");
};

export const getActiveRoles = (): RoleData[] => {
  return getAllRoles().filter((role) => role.isActive);
};

export const getDefaultRoles = (playerCount: number): Role[] => {
  if (playerCount < 8) return ["loup-garou", "villageois"];
  if (playerCount < 10)
    return [
      "loup-garou",
      "loup-garou",
      "villageois",
      "villageois",
      "villageois",
      "villageois",
      "villageois",
      "voyante",
    ];

  return [
    "loup-garou",
    "loup-garou",
    "villageois",
    "villageois",
    "villageois",
    "villageois",
    "villageois",
    "villageois",
    "voyante",
    "sorciere",
  ];
};

export const getDefaultRoleCounts = (
  playerCount: number
): Record<Role, number> => {
  const counts: Record<Role, number> = {
    "loup-garou": 0,
    villageois: 0,
    voyante: 0,
    chasseur: 0,
    cupidon: 0,
    sorciere: 0,
    "petite-fille": 0,
    capitaine: 0,
    voleur: 0,
  };

  if (playerCount < 8) {
    counts["loup-garou"] = 1;
    counts["villageois"] = playerCount - 1;
  } else if (playerCount < 10) {
    counts["loup-garou"] = 2;
    counts["villageois"] = playerCount - 3;
    counts["voyante"] = 1;
  } else if (playerCount < 12) {
    counts["loup-garou"] = 2;
    counts["villageois"] = playerCount - 4;
    counts["voyante"] = 1;
    counts["sorciere"] = 1;
  } else if (playerCount < 15) {
    counts["loup-garou"] = 3;
    counts["villageois"] = playerCount - 6;
    counts["voyante"] = 1;
    counts["sorciere"] = 1;
    counts["cupidon"] = 1;
  } else {
    counts["loup-garou"] = 4;
    counts["villageois"] = playerCount - 8;
    counts["voyante"] = 1;
    counts["sorciere"] = 1;
    counts["cupidon"] = 1;
    counts["voleur"] = 1;
  }

  return counts;
};

export const getTotalRoleCount = (roleCounts: Record<Role, number>): number => {
  return Object.values(roleCounts).reduce((sum, count) => sum + count, 0);
};

export const validateRoleCounts = (
  roleCounts: Record<Role, number>,
  playerCount: number
): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  const total = getTotalRoleCount(roleCounts);

  if (total !== playerCount) {
    errors.push(
      `Le nombre total de rôles (${total}) doit être égal au nombre de joueurs (${playerCount})`
    );
  }

  if (roleCounts["loup-garou"] < 1) {
    errors.push("Il doit y avoir au moins 1 loup-garou");
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
