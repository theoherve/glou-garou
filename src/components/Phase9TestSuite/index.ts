// Phase 9 - Suite de Tests Complète
// Export de tous les composants de test et de gestion d'erreurs

export { Phase9TestSuite } from "../Phase9TestSuite";
export { Phase9Demo } from "../Phase9Demo";
export { Phase9QuickDemo } from "../Phase9QuickDemo";
export { EndToEndTest } from "../EndToEndTest";
export { MultiPlayerTest } from "../MultiPlayerTest";
export { ConnectionTest } from "../ConnectionTest";
export { ErrorHandler } from "../ErrorHandler";

// Export de la configuration
export * from "./config";

// Export de la validation
export * from "./validation";

// Types et interfaces
export interface TestResult {
  id: string;
  name: string;
  status: "pending" | "running" | "passed" | "failed";
  duration?: number;
  error?: string;
  details?: string;
}

export interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
  status: "pending" | "running" | "passed" | "failed";
  startTime?: number;
  endTime?: number;
}

export interface ErrorLog {
  id: string;
  timestamp: Date;
  level: "error" | "warning" | "info" | "debug";
  category:
    | "api"
    | "realtime"
    | "game"
    | "ui"
    | "network"
    | "database"
    | "validation";
  message: string;
  details?: string;
  stack?: string;
  context?: Record<string, any>;
  resolved: boolean;
  userAction?: string;
}

export interface SimulatedPlayer {
  id: string;
  name: string;
  role: string;
  status: "alive" | "dead" | "eliminated";
  isGameMaster: boolean;
  isConnected: boolean;
  lastAction?: string;
  voteTarget?: string;
}

export interface SimulatedAction {
  id: string;
  playerId: string;
  action: string;
  targetId?: string;
  timestamp: Date;
  phase: string;
}

export interface NetworkCondition {
  latency: number;
  packetLoss: number;
  bandwidth: number;
  stability: number;
}

// Configuration par défaut
export const DEFAULT_TEST_CONFIG = {
  maxLogs: 1000,
  autoResolve: false,
  simulationSpeed: 1000,
  testInterval: 1000,
  disconnectionDuration: 5000,
};

// Constantes
export const ERROR_LEVELS = {
  error: { color: "text-red-500", bgColor: "bg-red-500/10" },
  warning: { color: "text-yellow-500", bgColor: "bg-yellow-500/10" },
  info: { color: "text-blue-500", bgColor: "bg-blue-500/10" },
  debug: { color: "text-gray-500", bgColor: "bg-gray-500/10" },
} as const;

export const ERROR_CATEGORIES = {
  api: { color: "text-purple-500", icon: "🌐" },
  realtime: { color: "text-green-500", icon: "⚡" },
  game: { color: "text-blue-500", icon: "🎮" },
  ui: { color: "text-yellow-500", icon: "🎨" },
  network: { color: "text-red-500", icon: "📡" },
  database: { color: "text-orange-500", icon: "🗄️" },
  validation: { color: "text-pink-500", icon: "✅" },
} as const;

export const AVAILABLE_ROLES = [
  "villageois",
  "loup-garou",
  "voyante",
  "sorcière",
  "chasseur",
  "cupidon",
  "petite-fille",
  "grand-mère",
] as const;

// Utilitaires
export const createTestId = (prefix: string) =>
  `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

export const formatDuration = (ms: number) => {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
  return `${(ms / 60000).toFixed(1)}m`;
};

export const calculateSuccessRate = (results: TestResult[]) => {
  if (results.length === 0) return 0;
  const passed = results.filter((r) => r.status === "passed").length;
  return (passed / results.length) * 100;
};

// Hooks personnalisés (pour utilisation future)
export const useTestResults = () => {
  // Hook pour gérer les résultats de tests
  // À implémenter selon les besoins
};

export const useErrorLogs = () => {
  // Hook pour gérer les logs d'erreurs
  // À implémenter selon les besoins
};

// Configuration des tests
export const TEST_SUITES_CONFIG = [
  {
    id: "connection",
    name: "🔌 Tests de Connexion",
    description: "Validation des connexions et de la synchronisation",
    tests: [
      { id: "db-connection", name: "Connexion à la base de données" },
      { id: "realtime-connection", name: "Connexion Realtime" },
      { id: "api-access", name: "Accès aux API" },
    ],
  },
  {
    id: "game-flow",
    name: "🎮 Tests du Flux de Jeu",
    description: "Validation du déroulement complet du jeu",
    tests: [
      { id: "game-creation", name: "Création de partie" },
      { id: "player-join", name: "Rejoindre une partie" },
      { id: "auto-start", name: "Démarrage automatique" },
      { id: "role-assignment", name: "Attribution des rôles" },
      { id: "phase-transitions", name: "Transitions de phase" },
    ],
  },
  {
    id: "gameplay",
    name: "🎭 Tests de Gameplay",
    description: "Validation des mécaniques de jeu",
    tests: [
      { id: "night-phase", name: "Phase de nuit" },
      { id: "day-phase", name: "Phase de jour" },
      { id: "voting-phase", name: "Phase de vote" },
      { id: "role-abilities", name: "Pouvoirs des rôles" },
    ],
  },
  {
    id: "synchronization",
    name: "🔄 Tests de Synchronisation",
    description: "Validation de la synchronisation et de la robustesse",
    tests: [
      { id: "realtime-sync", name: "Synchronisation Realtime" },
      { id: "state-backup", name: "Sauvegarde d'état" },
      { id: "conflict-resolution", name: "Résolution de conflits" },
      { id: "reconnection", name: "Gestion des reconnexions" },
    ],
  },
  {
    id: "ui-ux",
    name: "🎨 Tests UI/UX",
    description: "Validation de l'interface et de l'expérience utilisateur",
    tests: [
      { id: "animations", name: "Animations et transitions" },
      { id: "responsive", name: "Design responsive" },
      { id: "accessibility", name: "Accessibilité" },
      { id: "notifications", name: "Système de notifications" },
    ],
  },
] as const;
