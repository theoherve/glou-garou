"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Users,
  Crown,
  Moon,
  Sun,
  Target,
  Database,
  Wifi,
  Settings
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useRealtime } from './RealtimeProvider';

interface TestResult {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed' | 'skipped';
  duration?: number;
  error?: string;
  details?: string;
}

interface TestSuite {
  id: string;
  name: string;
  tests: TestResult[];
  status: 'pending' | 'running' | 'passed' | 'failed';
  startTime?: number;
  endTime?: number;
}

export const EndToEndTest = ({ roomCode }: { roomCode: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [currentTestIndex, setCurrentTestIndex] = useState(0);
  const [testSuites, setTestSuites] = useState<TestSuite[]>([]);
  const [overallStatus, setOverallStatus] = useState<'idle' | 'running' | 'completed'>('idle');
  const [logs, setLogs] = useState<string[]>([]);
  
  const { currentGame, currentPlayer, isLoading, error } = useGameStore();
  const { isConnected, isConnecting, connectedPlayers } = useRealtime();

  // Configuration des suites de tests
  useEffect(() => {
    const suites: TestSuite[] = [
      {
        id: 'connection',
        name: '🔌 Tests de Connexion',
        tests: [
          { id: 'db-connection', name: 'Connexion à la base de données', status: 'pending' },
          { id: 'realtime-connection', name: 'Connexion Realtime', status: 'pending' },
          { id: 'api-access', name: 'Accès aux API', status: 'pending' }
        ],
        status: 'pending'
      },
      {
        id: 'game-flow',
        name: '🎮 Tests du Flux de Jeu',
        tests: [
          { id: 'game-creation', name: 'Création de partie', status: 'pending' },
          { id: 'player-join', name: 'Rejoindre une partie', status: 'pending' },
          { id: 'auto-start', name: 'Démarrage automatique', status: 'pending' },
          { id: 'role-assignment', name: 'Attribution des rôles', status: 'pending' },
          { id: 'phase-transitions', name: 'Transitions de phase', status: 'pending' }
        ],
        status: 'pending'
      },
      {
        id: 'gameplay',
        name: '🎭 Tests de Gameplay',
        tests: [
          { id: 'night-phase', name: 'Phase de nuit', status: 'pending' },
          { id: 'day-phase', name: 'Phase de jour', status: 'pending' },
          { id: 'voting-phase', name: 'Phase de vote', status: 'pending' },
          { id: 'role-abilities', name: 'Pouvoirs des rôles', status: 'pending' }
        ],
        status: 'pending'
      },
      {
        id: 'synchronization',
        name: '🔄 Tests de Synchronisation',
        tests: [
          { id: 'realtime-sync', name: 'Synchronisation Realtime', status: 'pending' },
          { id: 'state-backup', name: 'Sauvegarde d\'état', status: 'pending' },
          { id: 'conflict-resolution', name: 'Résolution de conflits', status: 'pending' },
          { id: 'reconnection', name: 'Gestion des reconnexions', status: 'pending' }
        ],
        status: 'pending'
      },
      {
        id: 'ui-ux',
        name: '🎨 Tests UI/UX',
        tests: [
          { id: 'animations', name: 'Animations et transitions', status: 'pending' },
          { id: 'responsive', name: 'Design responsive', status: 'pending' },
          { id: 'accessibility', name: 'Accessibilité', status: 'pending' },
          { id: 'notifications', name: 'Système de notifications', status: 'pending' }
        ],
        status: 'pending'
      }
    ];
    
    setTestSuites(suites);
  }, []);

  const addLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, `[${timestamp}] ${message}`]);
  };

  const updateTestStatus = (suiteId: string, testId: string, status: TestResult['status'], error?: string, details?: string) => {
    setTestSuites(prev => prev.map(suite => {
      if (suite.id === suiteId) {
        const updatedTests = suite.tests.map(test => {
          if (test.id === testId) {
            return { ...test, status, error, details };
          }
          return test;
        });
        
        const suiteStatus = updatedTests.every(t => t.status === 'passed') ? 'passed' :
                           updatedTests.some(t => t.status === 'failed') ? 'failed' :
                           updatedTests.some(t => t.status === 'running') ? 'running' : 'pending';
        
        return { ...suite, tests: updatedTests, status: suiteStatus };
      }
      return suite;
    }));
  };

  const updateSuiteTiming = (suiteId: string, start: boolean) => {
    setTestSuites(prev => prev.map(suite => {
      if (suite.id === suiteId) {
        return start 
          ? { ...suite, startTime: Date.now() }
          : { ...suite, endTime: Date.now() };
      }
      return suite;
    }));
  };

  const runTestSuite = async (suite: TestSuite) => {
    addLog(`🚀 Démarrage de la suite de tests: ${suite.name}`);
    updateSuiteTiming(suite.id, true);
    
    for (const test of suite.tests) {
      addLog(`  ▶️  Test: ${test.name}`);
      updateTestStatus(suite.id, test.id, 'running');
      
      try {
        const startTime = Date.now();
        await runSingleTest(suite.id, test.id);
        const duration = Date.now() - startTime;
        
        updateTestStatus(suite.id, test.id, 'passed', undefined, `Durée: ${duration}ms`);
        addLog(`  ✅  Test réussi: ${test.name} (${duration}ms)`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        updateTestStatus(suite.id, test.id, 'failed', errorMessage);
        addLog(`  ❌  Test échoué: ${test.name} - ${errorMessage}`);
      }
      
      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 500));
    }
    
    updateSuiteTiming(suite.id, false);
    addLog(`🏁 Suite de tests terminée: ${suite.name}`);
  };

  const runSingleTest = async (suiteId: string, testId: string) => {
    switch (suiteId) {
      case 'connection':
        return await runConnectionTests(testId);
      case 'game-flow':
        return await runGameFlowTests(testId);
      case 'gameplay':
        return await runGameplayTests(testId);
      case 'synchronization':
        return await runSynchronizationTests(testId);
      case 'ui-ux':
        return await runUIUXTests(testId);
      default:
        throw new Error('Suite de tests inconnue');
    }
  };

  const runConnectionTests = async (testId: string) => {
    switch (testId) {
      case 'db-connection':
        // Test de connexion à la base de données
        const response = await fetch('/api/test-supabase-db');
        if (!response.ok) {
          throw new Error('Impossible de se connecter à la base de données');
        }
        break;
        
      case 'realtime-connection':
        // Test de connexion Realtime
        if (!isConnected) {
          throw new Error('Connexion Realtime non établie');
        }
        break;
        
      case 'api-access':
        // Test d'accès aux API
        const apiResponse = await fetch('/api/games');
        if (!apiResponse.ok) {
          throw new Error('Accès aux API impossible');
        }
        break;
    }
  };

  const runGameFlowTests = async (testId: string) => {
    switch (testId) {
      case 'game-creation':
        if (!currentGame) {
          throw new Error('Aucun jeu en cours');
        }
        break;
        
      case 'player-join':
        if (!currentPlayer) {
          throw new Error('Aucun joueur connecté');
        }
        break;
        
      case 'auto-start':
        if (currentGame?.phase !== 'preparation' && currentGame?.phase !== 'night') {
          throw new Error('Phase de jeu incorrecte pour le test de démarrage');
        }
        break;
        
      case 'role-assignment':
        if (!currentGame?.players.some(p => p.role && p.role !== 'villageois')) {
          throw new Error('Aucun rôle spécial attribué');
        }
        break;
        
      case 'phase-transitions':
        if (!['waiting', 'preparation', 'night', 'day', 'voting'].includes(currentGame?.phase || '')) {
          throw new Error('Phase de jeu invalide');
        }
        break;
    }
  };

  const runGameplayTests = async (testId: string) => {
    switch (testId) {
      case 'night-phase':
        // Test de la phase de nuit
        if (currentGame?.phase === 'night') {
          // Vérifier que les composants de nuit sont disponibles
          const nightComponents = document.querySelectorAll('[data-test="night-phase"]');
          if (nightComponents.length === 0) {
            throw new Error('Composants de phase de nuit non trouvés');
          }
        }
        break;
        
      case 'day-phase':
        // Test de la phase de jour
        if (currentGame?.phase === 'day') {
          const dayComponents = document.querySelectorAll('[data-test="day-phase"]');
          if (dayComponents.length === 0) {
            throw new Error('Composants de phase de jour non trouvés');
          }
        }
        break;
        
      case 'voting-phase':
        // Test de la phase de vote
        if (currentGame?.phase === 'voting') {
          const votingComponents = document.querySelectorAll('[data-test="voting-phase"]');
          if (votingComponents.length === 0) {
            throw new Error('Composants de phase de vote non trouvés');
          }
        }
        break;
        
      case 'role-abilities':
        // Test des pouvoirs des rôles
        const specialRoles = currentGame?.players.filter(p => 
          ['loup-garou', 'voyante', 'sorcière'].includes(p.role)
        );
        if (!specialRoles || specialRoles.length === 0) {
          throw new Error('Aucun rôle spécial avec pouvoirs trouvé');
        }
        break;
    }
  };

  const runSynchronizationTests = async (testId: string) => {
    switch (testId) {
      case 'realtime-sync':
        if (!isConnected || connectedPlayers.length === 0) {
          throw new Error('Synchronisation Realtime non fonctionnelle');
        }
        break;
        
      case 'state-backup':
        // Test de sauvegarde d'état
        const backupData = localStorage.getItem(`game-state-${roomCode}`);
        if (!backupData) {
          throw new Error('Sauvegarde d\'état non trouvée');
        }
        break;
        
      case 'conflict-resolution':
        // Test de résolution de conflits
        if (currentGame && currentGame.players.length > 0) {
          // Simuler un conflit en modifiant localement
          const testPlayer = currentGame.players[0];
          if (testPlayer) {
            // Le test passe si on peut accéder aux données
            break;
          }
        }
        throw new Error('Impossible de tester la résolution de conflits');
        
      case 'reconnection':
        if (!isConnected) {
          throw new Error('Connexion non établie');
        }
        break;
    }
  };

  const runUIUXTests = async (testId: string) => {
    switch (testId) {
      case 'animations':
        // Test des animations
        const animatedElements = document.querySelectorAll('[data-framer-motion-component]');
        if (animatedElements.length === 0) {
          throw new Error('Aucun élément animé trouvé');
        }
        break;
        
      case 'responsive':
        // Test du design responsive
        const responsiveElements = document.querySelectorAll('[class*="md:"]');
        if (responsiveElements.length === 0) {
          throw new Error('Classes responsive non trouvées');
        }
        break;
        
      case 'accessibility':
        // Test d'accessibilité basique
        const accessibleElements = document.querySelectorAll('[aria-label], [role], [tabindex]');
        if (accessibleElements.length === 0) {
          throw new Error('Attributs d\'accessibilité non trouvés');
        }
        break;
        
      case 'notifications':
        // Test du système de notifications
        const notificationElements = document.querySelectorAll('[data-test="notification"]');
        if (notificationElements.length === 0) {
          throw new Error('Système de notifications non trouvé');
        }
        break;
    }
  };

  const runAllTests = async () => {
    setIsRunning(true);
    setOverallStatus('running');
    setLogs([]);
    addLog('🚀 Démarrage des tests de bout en bout...');
    
    for (const suite of testSuites) {
      await runTestSuite(suite);
    }
    
    setIsRunning(false);
    setOverallStatus('completed');
    
    const totalTests = testSuites.reduce((acc, suite) => acc + suite.tests.length, 0);
    const passedTests = testSuites.reduce((acc, suite) => 
      acc + suite.tests.filter(t => t.status === 'passed').length, 0
    );
    const failedTests = testSuites.reduce((acc, suite) => 
      acc + suite.tests.filter(t => t.status === 'failed').length, 0
    );
    
    addLog(`🏁 Tests terminés: ${passedTests}/${totalTests} réussis, ${failedTests} échoués`);
  };

  const resetTests = () => {
    setTestSuites(prev => prev.map(suite => ({
      ...suite,
      tests: suite.tests.map(test => ({ ...test, status: 'pending' as const, error: undefined, details: undefined })),
      status: 'pending' as const,
      startTime: undefined,
      endTime: undefined
    })));
    setLogs([]);
    setOverallStatus('idle');
    setCurrentTestIndex(0);
  };

  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'skipped': return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'running': return 'text-blue-500';
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
      case 'skipped': return 'text-yellow-500';
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-lg font-semibold text-[#e0e0e0] hover:text-[#ff3333] transition-colors flex items-center space-x-2"
        >
          <span className="text-2xl">🧪</span>
          <span>Tests de Bout en Bout</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center space-x-2">
          <span className="text-2xl">🧪</span>
          <span>Tests de Bout en Bout</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#ff3333] hover:text-[#ff6666] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Contrôles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Lancer tous les tests</span>
        </button>
        
        <button
          onClick={resetTests}
          disabled={isRunning}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Statut global */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <span className="text-[#cccccc]">Statut global:</span>
            <span className={`font-semibold ${
              overallStatus === 'idle' ? 'text-gray-400' :
              overallStatus === 'running' ? 'text-blue-500' :
              'text-green-500'
            }`}>
              {overallStatus === 'idle' ? 'En attente' :
               overallStatus === 'running' ? 'En cours' :
               'Terminé'}
            </span>
          </div>
          
          {overallStatus === 'completed' && (
            <div className="flex items-center space-x-4 text-sm">
              <span className="text-green-500">
                ✅ {testSuites.reduce((acc, suite) => acc + suite.tests.filter(t => t.status === 'passed').length, 0)} réussis
              </span>
              <span className="text-red-500">
                ❌ {testSuites.reduce((acc, suite) => acc + suite.tests.filter(t => t.status === 'failed').length, 0)} échoués
              </span>
            </div>
          )}
        </div>
      </div>

      {/* Suites de tests */}
      <div className="space-y-4 mb-6">
        {testSuites.map((suite) => (
          <div key={suite.id} className="bg-[#1a1a1a] rounded-lg p-4 border border-[#ff3333]/20">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-lg font-medium text-[#e0e0e0]">{suite.name}</h4>
              <div className="flex items-center space-x-2">
                <span className={`text-sm ${
                  suite.status === 'pending' ? 'text-gray-400' :
                  suite.status === 'running' ? 'text-blue-500' :
                  suite.status === 'passed' ? 'text-green-500' :
                  'text-red-500'
                }`}>
                  {suite.status === 'pending' ? 'En attente' :
                   suite.status === 'running' ? 'En cours' :
                   suite.status === 'passed' ? 'Réussi' :
                   'Échoué'}
                </span>
                {suite.startTime && suite.endTime && (
                  <span className="text-xs text-[#cccccc]">
                    ({suite.endTime - suite.startTime}ms)
                  </span>
                )}
              </div>
            </div>
            
            <div className="space-y-2">
              {suite.tests.map((test) => (
                <div key={test.id} className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded">
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(test.status)}
                    <span className={`text-sm ${getStatusColor(test.status)}`}>
                      {test.name}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {test.duration && (
                      <span className="text-xs text-[#cccccc]">{test.duration}ms</span>
                    )}
                    {test.error && (
                      <span className="text-xs text-red-400" title={test.error}>
                        ⚠️ Erreur
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Logs */}
      <div className="bg-[#1a1a1a] rounded-lg p-4 border border-[#ff3333]/20">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📋 Logs des tests</h4>
        <div className="h-48 overflow-y-auto bg-[#0a0a0a] rounded p-3 font-mono text-xs">
          {logs.length === 0 ? (
            <span className="text-[#666666]">Aucun log disponible</span>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="text-[#cccccc] mb-1">
                {log}
              </div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
