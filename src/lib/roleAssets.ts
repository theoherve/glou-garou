import { Role } from "@/types/game";

export interface RoleAssets {
  displayName: string;
  illustrationSrc: string; // under /public/illustrations
  cardSrc: string; // under /public/cards
}

// Mapping provided by product specs
const mappedRoleAssets: Partial<Record<Role, RoleAssets>> = {
  "petite-fille": {
    displayName: "Camel Bent",
    illustrationSrc: "/illustrations/camel-bent.png",
    cardSrc: "/cards/camel-bent.png",
  },
  cupidon: {
    displayName: "Cupid'eau",
    illustrationSrc: "/illustrations/cupid-eau.png",
    cardSrc: "/cards/cupid-eau.png",
  },
  "loup-garou": {
    displayName: "Glou Garou",
    illustrationSrc: "/illustrations/glou-garou.png",
    cardSrc: "/cards/glou-garou.png",
  },
  chasseur: {
    displayName: "Grand Cru-Badour",
    illustrationSrc: "/illustrations/grand-cru-badour.png",
    cardSrc: "/cards/grand-cru-badour.png",
  },
  sorciere: {
    displayName: "Sucière",
    illustrationSrc: "/illustrations/suciere.png",
    cardSrc: "/cards/suciere.png",
  },
  villageois: {
    displayName: "La Véritable Villageoise",
    illustrationSrc: "/illustrations/veritable-villageoise.png",
    cardSrc: "/cards/veritable-villageoise.png",
  },
  voyante: {
    displayName: "Vodyante",
    illustrationSrc: "/illustrations/vodyante.png",
    cardSrc: "/cards/vodyante.png",
  },
};

const defaultAssets: RoleAssets = {
  displayName: "Rôle",
  illustrationSrc: "/illustrations/veritable-villageoise.png",
  cardSrc: "/cards/veritable-villageoise.png",
};

export const getRoleAssets = (role: Role): RoleAssets => {
  return mappedRoleAssets[role] ?? defaultAssets;
};
