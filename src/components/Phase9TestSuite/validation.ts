// Validation de la Phase 9 - Suite de Tests

import { PHASE9_CONFIG, Phase9Config, TestSuite } from "./config";

/**
 * Interface pour les résultats de validation
 */
export interface ValidationResult {
  isValid: boolean;
  errors: string[];
  warnings: string[];
  success: string[];
}

/**
 * Interface pour les métriques de validation
 */
export interface ValidationMetrics {
  totalChecks: number;
  passedChecks: number;
  failedChecks: number;
  warnings: number;
  successRate: number;
  duration: number;
}

/**
 * Valide la configuration complète de la Phase 9
 */
const validatePhase9Config = (): ValidationResult => {
  const startTime = performance.now();
  const errors: string[] = [];
  const warnings: string[] = [];
  const success: string[] = [];

  try {
    // Validation de la structure générale
    if (!PHASE9_CONFIG.general) {
      errors.push("Configuration générale manquante");
    } else {
      if (PHASE9_CONFIG.general.name) success.push("Nom de la phase configuré");
      if (PHASE9_CONFIG.general.version) success.push("Version configurée");
      if (PHASE9_CONFIG.general.description)
        success.push("Description configurée");
    }

    // Validation des tests
    if (!PHASE9_CONFIG.tests) {
      errors.push("Configuration des tests manquante");
    } else {
      // Tests de bout en bout
      if (PHASE9_CONFIG.tests.endToEnd) {
        if (PHASE9_CONFIG.tests.endToEnd.enabled)
          success.push("Tests de bout en bout activés");
        if (PHASE9_CONFIG.tests.endToEnd.timeout > 0)
          success.push("Timeout des tests configuré");
        if (PHASE9_CONFIG.tests.endToEnd.retryAttempts >= 0)
          success.push("Tentatives de retry configurées");
      } else {
        errors.push("Configuration des tests de bout en bout manquante");
      }

      // Tests multi-joueurs
      if (PHASE9_CONFIG.tests.multiPlayer) {
        if (PHASE9_CONFIG.tests.multiPlayer.enabled)
          success.push("Tests multi-joueurs activés");
        if (PHASE9_CONFIG.tests.multiPlayer.maxSimulatedPlayers > 0) {
          success.push("Limite de joueurs simulés configurée");
        }
        if (PHASE9_CONFIG.tests.multiPlayer.roles.length > 0) {
          success.push("Rôles de test configurés");
        }
      } else {
        errors.push("Configuration des tests multi-joueurs manquante");
      }

      // Tests de connexion
      if (PHASE9_CONFIG.tests.connection) {
        if (PHASE9_CONFIG.tests.connection.enabled)
          success.push("Tests de connexion activés");
        if (PHASE9_CONFIG.tests.connection.testInterval > 0) {
          success.push("Intervalle de test configuré");
        }
        if (PHASE9_CONFIG.tests.connection.networkTests.length > 0) {
          success.push("Tests réseau configurés");
        }
      } else {
        errors.push("Configuration des tests de connexion manquante");
      }

      // Gestionnaire d'erreurs
      if (PHASE9_CONFIG.tests.errorHandler) {
        if (PHASE9_CONFIG.tests.errorHandler.enabled)
          success.push("Gestionnaire d'erreurs activé");
        if (PHASE9_CONFIG.tests.errorHandler.maxLogs > 0) {
          success.push("Limite de logs configurée");
        }
        if (PHASE9_CONFIG.tests.errorHandler.levels.length > 0) {
          success.push("Niveaux d'erreur configurés");
        }
        if (PHASE9_CONFIG.tests.errorHandler.categories.length > 0) {
          success.push("Catégories d'erreur configurées");
        }
      } else {
        errors.push("Configuration du gestionnaire d'erreurs manquante");
      }
    }

    // Validation de l'interface utilisateur
    if (PHASE9_CONFIG.ui) {
      if (PHASE9_CONFIG.ui.components.animations)
        success.push("Animations activées");
      if (PHASE9_CONFIG.ui.components.responsive)
        success.push("Design responsive activé");
      if (PHASE9_CONFIG.ui.components.darkMode)
        success.push("Mode sombre activé");
    } else {
      warnings.push("Configuration UI manquante");
    }

    // Validation des métriques
    if (PHASE9_CONFIG.metrics) {
      if (PHASE9_CONFIG.metrics.collection.enabled)
        success.push("Collecte de métriques activée");
      if (PHASE9_CONFIG.metrics.display.realTime)
        success.push("Affichage temps réel activé");
      if (PHASE9_CONFIG.metrics.alerts.enabled)
        success.push("Système d'alertes activé");
    } else {
      warnings.push("Configuration des métriques manquante");
    }

    // Validation des exports
    if (PHASE9_CONFIG.export) {
      if (PHASE9_CONFIG.export.formats.length > 0)
        success.push("Formats d'export configurés");
      if (PHASE9_CONFIG.export.data.testResults)
        success.push("Export des résultats activé");
      if (PHASE9_CONFIG.export.data.errorLogs)
        success.push("Export des logs activé");
    } else {
      warnings.push("Configuration des exports manquante");
    }

    // Validation de la performance
    if (PHASE9_CONFIG.performance) {
      if (PHASE9_CONFIG.performance.limits.maxConcurrentTests > 0) {
        success.push("Limite de tests concurrents configurée");
      }
      if (PHASE9_CONFIG.performance.optimizations.lazyLoading) {
        success.push("Lazy loading activé");
      }
      if (PHASE9_CONFIG.performance.monitoring.memoryUsage) {
        success.push("Monitoring mémoire activé");
      }
    } else {
      warnings.push("Configuration de performance manquante");
    }

    // Validation de la sécurité
    if (PHASE9_CONFIG.security) {
      if (PHASE9_CONFIG.security.validation.inputSanitization) {
        success.push("Sanitisation des entrées activée");
      }
      if (PHASE9_CONFIG.security.validation.xssProtection) {
        success.push("Protection XSS activée");
      }
      if (PHASE9_CONFIG.security.audit.enabled) {
        success.push("Audit activé");
      }
    } else {
      warnings.push("Configuration de sécurité manquante");
    }

    // Validation du développement
    if (PHASE9_CONFIG.development) {
      if (PHASE9_CONFIG.development.devTests.enabled) {
        success.push("Tests de développement activés");
      }
      if (PHASE9_CONFIG.development.devTools.reactDevTools) {
        success.push("React DevTools activés");
      }
    } else {
      warnings.push("Configuration de développement manquante");
    }

    // Vérifications de cohérence
    if (PHASE9_CONFIG.tests?.multiPlayer?.maxSimulatedPlayers > 50) {
      warnings.push("Nombre de joueurs simulés élevé (>50)");
    }

    if (PHASE9_CONFIG.tests?.errorHandler?.maxLogs > 100000) {
      warnings.push("Limite de logs très élevée (>100000)");
    }

    if (PHASE9_CONFIG.performance?.limits?.maxConcurrentTests > 10) {
      warnings.push("Nombre de tests concurrents élevé (>10)");
    }
  } catch (error) {
    errors.push(
      `Erreur lors de la validation : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }

  const duration = performance.now() - startTime;
  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    success,
  };
};

/**
 * Valide un composant spécifique de la Phase 9
 */
const validateComponent = (componentName: TestSuite): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const success: string[] = [];

  try {
    const componentConfig = PHASE9_CONFIG.tests[componentName];

    if (!componentConfig) {
      errors.push(`Configuration du composant ${componentName} manquante`);
      return { isValid: false, errors, warnings, success };
    }

    if (componentConfig.enabled) {
      success.push(`Composant ${componentName} activé`);
    } else {
      warnings.push(`Composant ${componentName} désactivé`);
    }

    // Validation spécifique par composant
    switch (componentName) {
      case "endToEnd": {
        const endToEndConfig =
          componentConfig as typeof PHASE9_CONFIG.tests.endToEnd;
        if (endToEndConfig.timeout && endToEndConfig.timeout > 0) {
          success.push("Timeout configuré pour les tests de bout en bout");
        }
        if (endToEndConfig.retryAttempts && endToEndConfig.retryAttempts >= 0) {
          success.push("Tentatives de retry configurées");
        }
        break;
      }

      case "multiPlayer": {
        const multiPlayerConfig =
          componentConfig as typeof PHASE9_CONFIG.tests.multiPlayer;
        if (
          multiPlayerConfig.maxSimulatedPlayers &&
          multiPlayerConfig.maxSimulatedPlayers > 0
        ) {
          success.push("Limite de joueurs simulés configurée");
        }
        if (multiPlayerConfig.roles && multiPlayerConfig.roles.length > 0) {
          success.push("Rôles de test configurés");
        }
        break;
      }

      case "connection": {
        const connectionConfig =
          componentConfig as typeof PHASE9_CONFIG.tests.connection;
        if (
          connectionConfig.testInterval &&
          connectionConfig.testInterval > 0
        ) {
          success.push("Intervalle de test configuré");
        }
        if (
          connectionConfig.networkTests &&
          connectionConfig.networkTests.length > 0
        ) {
          success.push("Tests réseau configurés");
        }
        break;
      }

      case "errorHandler": {
        const errorHandlerConfig =
          componentConfig as typeof PHASE9_CONFIG.tests.errorHandler;
        if (errorHandlerConfig.maxLogs && errorHandlerConfig.maxLogs > 0) {
          success.push("Limite de logs configurée");
        }
        if (errorHandlerConfig.levels && errorHandlerConfig.levels.length > 0) {
          success.push("Niveaux d'erreur configurés");
        }
        if (
          errorHandlerConfig.categories &&
          errorHandlerConfig.categories.length > 0
        ) {
          success.push("Catégories d'erreur configurées");
        }
        break;
      }
    }
  } catch (error) {
    errors.push(
      `Erreur lors de la validation du composant ${componentName} : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    success,
  };
};

/**
 * Valide la configuration par environnement
 */
const validateEnvironmentConfig = (): ValidationResult => {
  const errors: string[] = [];
  const warnings: string[] = [];
  const success: string[] = [];

  try {
    const env = process.env.NODE_ENV || "development";
    success.push(`Environnement détecté : ${env}`);

    // Validation spécifique par environnement
    switch (env) {
      case "production":
        if (PHASE9_CONFIG.development.debug.enabled) {
          warnings.push("Mode debug activé en production");
        }
        if (PHASE9_CONFIG.development.devTests.enabled) {
          warnings.push("Tests de développement activés en production");
        }
        success.push("Configuration production validée");
        break;

      case "test":
        if (!PHASE9_CONFIG.tests.endToEnd.autoRun) {
          warnings.push(
            "Auto-run des tests désactivé en environnement de test"
          );
        }
        success.push("Configuration test validée");
        break;

      default: // development
        if (!PHASE9_CONFIG.development.debug.enabled) {
          warnings.push("Mode debug désactivé en développement");
        }
        success.push("Configuration développement validée");
        break;
    }
  } catch (error) {
    errors.push(
      `Erreur lors de la validation de l'environnement : ${
        error instanceof Error ? error.message : "Erreur inconnue"
      }`
    );
  }

  const isValid = errors.length === 0;

  return {
    isValid,
    errors,
    warnings,
    success,
  };
};

/**
 * Calcule les métriques de validation
 */
const calculateValidationMetrics = (
  results: ValidationResult[]
): ValidationMetrics => {
  const totalChecks = results.length;
  const passedChecks = results.filter((r) => r.isValid).length;
  const failedChecks = results.filter((r) => !r.isValid).length;
  const warnings = results.reduce((sum, r) => sum + r.warnings.length, 0);
  const successRate = totalChecks > 0 ? (passedChecks / totalChecks) * 100 : 0;

  return {
    totalChecks,
    passedChecks,
    failedChecks,
    warnings,
    successRate,
    duration: 0, // Sera calculé lors de l'exécution
  };
};

/**
 * Validation complète de la Phase 9
 */
const validatePhase9Complete = (): ValidationResult => {
  const startTime = performance.now();

  // Validation de la configuration générale
  const configValidation = validatePhase9Config();

  // Validation de l'environnement
  const envValidation = validateEnvironmentConfig();

  // Validation de chaque composant
  const componentValidations = Object.keys(PHASE9_CONFIG.tests).map((key) =>
    validateComponent(key as TestSuite)
  );

  // Agrégation des résultats
  const allResults = [configValidation, envValidation, ...componentValidations];
  const allErrors = allResults.flatMap((r) => r.errors);
  const allWarnings = allResults.flatMap((r) => r.warnings);
  const allSuccess = allResults.flatMap((r) => r.success);

  const duration = performance.now() - startTime;
  const isValid = allErrors.length === 0;

  return {
    isValid,
    errors: allErrors,
    warnings: allWarnings,
    success: allSuccess,
  };
};

/**
 * Génère un rapport de validation
 */
const generateValidationReport = (): string => {
  const validation = validatePhase9Complete();
  const metrics = calculateValidationMetrics([validation]);

  let report = `# 🧪 Rapport de Validation - Phase 9\n\n`;
  report += `**Date** : ${new Date().toLocaleString()}\n`;
  report += `**Statut** : ${validation.isValid ? "✅ VALIDÉ" : "❌ ÉCHEC"}\n`;
  report += `**Durée** : ${metrics.duration.toFixed(2)}ms\n\n`;

  report += `## 📊 Métriques\n\n`;
  report += `- **Total des vérifications** : ${metrics.totalChecks}\n`;
  report += `- **Vérifications réussies** : ${metrics.passedChecks}\n`;
  report += `- **Vérifications échouées** : ${metrics.failedChecks}\n`;
  report += `- **Avertissements** : ${metrics.warnings}\n`;
  report += `- **Taux de succès** : ${metrics.successRate.toFixed(1)}%\n\n`;

  if (validation.errors.length > 0) {
    report += `## ❌ Erreurs\n\n`;
    validation.errors.forEach((error) => {
      report += `- ${error}\n`;
    });
    report += `\n`;
  }

  if (validation.warnings.length > 0) {
    report += `## ⚠️ Avertissements\n\n`;
    validation.warnings.forEach((warning) => {
      report += `- ${warning}\n`;
    });
    report += `\n`;
  }

  if (validation.success.length > 0) {
    report += `## ✅ Succès\n\n`;
    validation.success.forEach((success) => {
      report += `- ${success}\n`;
    });
    report += `\n`;
  }

  report += `## 🎯 Recommandations\n\n`;

  if (validation.isValid) {
    report += `🎉 **Toutes les validations sont passées avec succès !**\n`;
    report += `La Phase 9 est prête pour la production.\n`;
  } else {
    report += `🔧 **Des corrections sont nécessaires :**\n`;
    report += `1. Corriger toutes les erreurs listées ci-dessus\n`;
    report += `2. Examiner les avertissements et les traiter si nécessaire\n`;
    report += `3. Relancer la validation après correction\n`;
  }

  return report;
};

// Export des fonctions de validation
export {
  validatePhase9Config,
  validateComponent,
  validateEnvironmentConfig,
  validatePhase9Complete,
  calculateValidationMetrics,
  generateValidationReport,
};
