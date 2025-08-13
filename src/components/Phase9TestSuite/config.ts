// Configuration de la Phase 9 - Suite de Tests

export const PHASE9_CONFIG = {
  // Configuration générale
  general: {
    name: 'Phase 9 - Tests et Debug',
    version: '1.0.0',
    description: 'Suite complète de tests et de gestion d\'erreurs pour le jeu Glou-Garou',
    author: 'Assistant IA',
    lastUpdated: '2024-12-19'
  },

  // Configuration des tests
  tests: {
    // Tests de bout en bout
    endToEnd: {
      enabled: true,
      autoRun: false,
      timeout: 30000, // 30 secondes
      retryAttempts: 3,
      suites: [
        'connection',
        'game-flow',
        'gameplay',
        'synchronization',
        'ui-ux'
      ]
    },

    // Tests multi-joueurs
    multiPlayer: {
      enabled: true,
      maxSimulatedPlayers: 12,
      defaultSimulationSpeed: 1000, // 1 seconde
      availableSpeeds: [500, 1000, 2000, 5000],
      autoAdvance: false,
      roles: [
        'villageois',
        'loup-garou',
        'voyante',
        'sorcière',
        'chasseur',
        'cupidon',
        'petite-fille',
        'grand-mère'
      ]
    },

    // Tests de connexion
    connection: {
      enabled: true,
      testInterval: 1000, // 1 seconde
      disconnectionDuration: 5000, // 5 secondes
      maxHistoryEntries: 100,
      networkTests: [
        'basic-connection',
        'realtime-sync',
        'disconnection-handling',
        'reconnection-recovery',
        'state-sync',
        'conflict-resolution',
        'network-stability',
        'data-integrity'
      ]
    },

    // Gestionnaire d'erreurs
    errorHandler: {
      enabled: true,
      maxLogs: 1000,
      autoResolve: false,
      autoResolveDelay: 5000, // 5 secondes
      levels: ['error', 'warning', 'info', 'debug'],
      categories: [
        'api',
        'realtime',
        'game',
        'ui',
        'network',
        'database',
        'validation'
      ],
      exportFormats: ['json', 'csv', 'txt']
    }
  },

  // Configuration de l'interface
  ui: {
    // Composants
    components: {
      collapsible: true,
      animations: true,
      responsive: true,
      darkMode: true
    },

    // Thème
    theme: {
      primaryColor: '#ff3333',
      secondaryColor: '#ff9933',
      successColor: '#00cc00',
      errorColor: '#ff3333',
      warningColor: '#ffcc00',
      infoColor: '#0099ff'
    },

    // Animations
    animations: {
      duration: 300,
      easing: 'ease-in-out',
      staggerDelay: 100
    }
  },

  // Configuration des métriques
  metrics: {
    // Collecte
    collection: {
      enabled: true,
      interval: 1000, // 1 seconde
      maxDataPoints: 1000
    },

    // Affichage
    display: {
      realTime: true,
      history: true,
      charts: true,
      export: true
    },

    // Alertes
    alerts: {
      enabled: true,
      thresholds: {
        errorRate: 0.1, // 10%
        latency: 1000, // 1 seconde
        memoryUsage: 0.8, // 80%
        cpuUsage: 0.8 // 80%
      }
    }
  },

  // Configuration des exports
  export: {
    // Formats supportés
    formats: ['json', 'csv', 'txt', 'html'],
    
    // Données incluses
    data: {
      testResults: true,
      errorLogs: true,
      metrics: true,
      configuration: true,
      metadata: true
    },

    // Nommage des fichiers
    naming: {
      prefix: 'phase9',
      includeTimestamp: true,
      includeVersion: true,
      format: 'phase9-{type}-{timestamp}-v{version}.{extension}'
    }
  },

  // Configuration de la performance
  performance: {
    // Limites
    limits: {
      maxConcurrentTests: 5,
      maxLogEntries: 10000,
      maxHistoryEntries: 1000,
      maxSimulatedPlayers: 20
    },

    // Optimisations
    optimizations: {
      lazyLoading: true,
      debouncing: true,
      throttling: true,
      cleanup: true
    },

    // Monitoring
    monitoring: {
      memoryUsage: true,
      cpuUsage: true,
      networkLatency: true,
      renderPerformance: true
    }
  },

  // Configuration de la sécurité
  security: {
    // Validation
    validation: {
      inputSanitization: true,
      outputEncoding: true,
      sqlInjection: true,
      xssProtection: true
    },

    // Permissions
    permissions: {
      readLogs: true,
      writeLogs: true,
      runTests: true,
      exportData: true,
      modifyConfig: false
    },

    // Audit
    audit: {
      enabled: true,
      logActions: true,
      trackChanges: true,
      retentionPeriod: 30 // jours
    }
  },

  // Configuration du développement
  development: {
    // Mode debug
    debug: {
      enabled: false,
      verbose: false,
      showTimestamps: true,
      logToConsole: true
    },

    // Tests de développement
    devTests: {
      enabled: true,
      mockData: true,
      simulateErrors: false,
      performanceProfiling: false
    },

    // Outils de développement
    devTools: {
      reactDevTools: true,
      performanceMonitor: true,
      errorBoundary: true,
      hotReload: true
    }
  }
} as const;

// Types de configuration
export type Phase9Config = typeof PHASE9_CONFIG;
export type TestSuite = keyof typeof PHASE9_CONFIG.tests;
export type ErrorLevel = typeof PHASE9_CONFIG.tests.errorHandler.levels[number];
export type ErrorCategory = typeof PHASE9_CONFIG.tests.errorHandler.categories[number];

// Utilitaires de configuration
export const getConfig = <K extends keyof Phase9Config>(key: K): Phase9Config[K] => {
  return PHASE9_CONFIG[key];
};

export const isTestEnabled = (testName: TestSuite): boolean => {
  return PHASE9_CONFIG.tests[testName].enabled;
};

export const getTestConfig = <T extends TestSuite>(testName: T) => {
  return PHASE9_CONFIG.tests[testName];
};

export const isFeatureEnabled = (feature: string): boolean => {
  // Vérifier si une fonctionnalité est activée
  switch (feature) {
    case 'animations':
      return PHASE9_CONFIG.ui.components.animations;
    case 'responsive':
      return PHASE9_CONFIG.ui.components.responsive;
    case 'darkMode':
      return PHASE9_CONFIG.ui.components.darkMode;
    case 'metrics':
      return PHASE9_CONFIG.metrics.collection.enabled;
    case 'alerts':
      return PHASE9_CONFIG.metrics.alerts.enabled;
    case 'export':
      return PHASE9_CONFIG.export.data.testResults;
    default:
      return false;
  }
};

// Configuration par environnement
export const getEnvironmentConfig = () => {
  const env = process.env.NODE_ENV || 'development';
  
  switch (env) {
    case 'production':
      return {
        ...PHASE9_CONFIG,
        development: {
          ...PHASE9_CONFIG.development,
          debug: { ...PHASE9_CONFIG.development.debug, enabled: false },
          devTests: { ...PHASE9_CONFIG.development.devTests, enabled: false }
        }
      };
    
    case 'test':
      return {
        ...PHASE9_CONFIG,
        tests: {
          ...PHASE9_CONFIG.tests,
          endToEnd: { ...PHASE9_CONFIG.tests.endToEnd, autoRun: true },
          multiPlayer: { ...PHASE9_CONFIG.tests.multiPlayer, autoAdvance: true }
        }
      };
    
    default: // development
      return PHASE9_CONFIG;
  }
};

// Validation de la configuration
export const validateConfig = (): boolean => {
  try {
    // Vérifier que la configuration est valide
    const config = getEnvironmentConfig();
    
    // Vérifications de base
    if (!config.tests || !config.ui || !config.metrics) {
      return false;
    }
    
    // Vérifier les valeurs critiques
    if (config.tests.multiPlayer.maxSimulatedPlayers > 50) {
      return false;
    }
    
    if (config.tests.errorHandler.maxLogs > 100000) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Erreur de validation de la configuration:', error);
    return false;
  }
};

// Configuration par défaut pour les tests
export const DEFAULT_TEST_CONFIG = {
  timeout: 10000,
  retryAttempts: 2,
  autoRun: false,
  verbose: false
} as const;

// Configuration par défaut pour les composants
export const DEFAULT_COMPONENT_CONFIG = {
  collapsible: true,
  showStatus: true,
  showMetrics: true,
  showHistory: true
} as const;
