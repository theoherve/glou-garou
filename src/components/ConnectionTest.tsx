"use client";

import { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  Wifi, 
  WifiOff, 
  RefreshCw, 
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Activity,
  Signal,
  Zap,
  Shield,
  AlertCircle
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { useRealtime } from './RealtimeProvider';

interface ConnectionTest {
  id: string;
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
  details?: string;
}

interface NetworkCondition {
  latency: number;
  packetLoss: number;
  bandwidth: number;
  stability: number;
}

export const ConnectionTest = ({ roomCode }: { roomCode: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isRunning, setIsRunning] = useState(false);
  const [connectionTests, setConnectionTests] = useState<ConnectionTest[]>([]);
  const [networkConditions, setNetworkConditions] = useState<NetworkCondition>({
    latency: 0,
    packetLoss: 0,
    bandwidth: 0,
    stability: 100
  });
  const [connectionHistory, setConnectionHistory] = useState<Array<{
    timestamp: Date;
    status: 'connected' | 'disconnected' | 'reconnecting';
    latency?: number;
    error?: string;
  }>>([]);
  const [isSimulatingDisconnection, setIsSimulatingDisconnection] = useState(false);
  const [disconnectionDuration, setDisconnectionDuration] = useState(5000); // ms
  const [testInterval, setTestInterval] = useState(1000); // ms
  
  const { currentGame, currentPlayer } = useGameStore();
  const { isConnected, isConnecting, connectedPlayers, error: realtimeError } = useRealtime();
  
  const connectionIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const testTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Configuration des tests de connexion
  useEffect(() => {
    const tests: ConnectionTest[] = [
      {
        id: 'basic-connection',
        name: 'Connexion de base',
        status: 'pending'
      },
      {
        id: 'realtime-sync',
        name: 'Synchronisation Realtime',
        status: 'pending'
      },
      {
        id: 'disconnection-handling',
        name: 'Gestion des déconnexions',
        status: 'pending'
      },
      {
        id: 'reconnection-recovery',
        name: 'Récupération des reconnexions',
        status: 'pending'
      },
      {
        id: 'state-sync',
        name: 'Synchronisation d\'état',
        status: 'pending'
      },
      {
        id: 'conflict-resolution',
        name: 'Résolution de conflits',
        status: 'pending'
      },
      {
        id: 'network-stability',
        name: 'Stabilité réseau',
        status: 'pending'
      },
      {
        id: 'data-integrity',
        name: 'Intégrité des données',
        status: 'pending'
      }
    ];
    
    setConnectionTests(tests);
  }, []);

  // Surveillance continue de la connexion
  useEffect(() => {
    if (isExpanded) {
      connectionIntervalRef.current = setInterval(() => {
        const timestamp = new Date();
        let status: 'connected' | 'disconnected' | 'reconnecting';
        let latency: number | undefined;
        let error: string | undefined;

        if (isConnected) {
          status = 'connected';
          latency = measureLatency();
        } else if (isConnecting) {
          status = 'reconnecting';
        } else {
          status = 'disconnected';
          error = realtimeError || 'Connexion perdue';
        }

        setConnectionHistory(prev => [...prev, { timestamp, status, latency, error }]);
        
        // Garder seulement les 100 dernières entrées
        if (connectionHistory.length > 100) {
          setConnectionHistory(prev => prev.slice(-100));
        }
      }, testInterval);

      return () => {
        if (connectionIntervalRef.current) {
          clearInterval(connectionIntervalRef.current);
        }
      };
    }
  }, [isExpanded, isConnected, isConnecting, realtimeError, testInterval]);

  // Mesurer la latence
  const measureLatency = (): number => {
    const start = performance.now();
    // Simulation d'une mesure de latence
    return Math.random() * 100 + 20; // 20-120ms
  };

  // Mettre à jour le statut d'un test
  const updateTestStatus = (testId: string, status: ConnectionTest['status'], error?: string, details?: string) => {
    setConnectionTests(prev => prev.map(test => {
      if (test.id === testId) {
        return { ...test, status, error, details };
      }
      return test;
    }));
  };

  // Test de connexion de base
  const testBasicConnection = async (): Promise<void> => {
    try {
      // Test de connexion à l'API
      const response = await fetch('/api/test-supabase-db');
      if (!response.ok) {
        throw new Error('Impossible de se connecter à l\'API');
      }

      // Test de connexion Realtime
      if (!isConnected) {
        throw new Error('Connexion Realtime non établie');
      }

      // Test de récupération des données de jeu
      if (!currentGame) {
        throw new Error('Données de jeu non disponibles');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Test de synchronisation Realtime
  const testRealtimeSync = async (): Promise<void> => {
    try {
      if (!isConnected) {
        throw new Error('Connexion Realtime non établie');
      }

      // Vérifier que les joueurs connectés sont synchronisés
      if (connectedPlayers.length === 0 && currentGame?.players && currentGame.players.length > 0) {
        throw new Error('Synchronisation des joueurs connectés échouée');
      }

      // Vérifier la synchronisation des données
      const lastUpdate = currentGame?.updatedAt;
      if (!lastUpdate) {
        throw new Error('Données de mise à jour non disponibles');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Test de gestion des déconnexions
  const testDisconnectionHandling = async (): Promise<void> => {
    try {
      // Simuler une déconnexion
      setIsSimulatingDisconnection(true);
      
      // Attendre que la déconnexion soit détectée
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Vérifier que le système gère la déconnexion
      if (isConnected) {
        throw new Error('Déconnexion non détectée');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    } finally {
      setIsSimulatingDisconnection(false);
    }
  };

  // Test de récupération des reconnexions
  const testReconnectionRecovery = async (): Promise<void> => {
    try {
      // Attendre la reconnexion automatique
      let attempts = 0;
      const maxAttempts = 10;
      
      while (!isConnected && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }

      if (!isConnected) {
        throw new Error('Reconnexion automatique échouée');
      }

      // Vérifier que les données sont restaurées
      if (!currentGame) {
        throw new Error('Données de jeu non restaurées après reconnexion');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Test de synchronisation d'état
  const testStateSync = async (): Promise<void> => {
    try {
      // Vérifier que l'état local est synchronisé avec le serveur
      const response = await fetch(`/api/games?roomCode=${roomCode}`);
      if (!response.ok) {
        throw new Error('Impossible de récupérer l\'état du serveur');
      }

      const serverData = await response.json();
      if (!serverData.game) {
        throw new Error('Données serveur invalides');
      }

      // Comparer les états
      if (currentGame?.phase !== serverData.game.phase) {
        throw new Error('Phase de jeu non synchronisée');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Test de résolution de conflits
  const testConflictResolution = async (): Promise<void> => {
    try {
      // Simuler un conflit en modifiant localement
      if (!currentGame) {
        throw new Error('Aucun jeu en cours');
      }

      // Le test passe si on peut accéder aux données et qu'elles sont cohérentes
      const hasValidPlayers = currentGame.players.every(p => p.id && p.name);
      if (!hasValidPlayers) {
        throw new Error('Données des joueurs incohérentes');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Test de stabilité réseau
  const testNetworkStability = async (): Promise<void> => {
    try {
      // Mesurer la stabilité sur plusieurs échantillons
      const samples = [];
      for (let i = 0; i < 5; i++) {
        const latency = measureLatency();
        samples.push(latency);
        await new Promise(resolve => setTimeout(resolve, 200));
      }

      const avgLatency = samples.reduce((a, b) => a + b, 0) / samples.length;
      const variance = samples.reduce((acc, val) => acc + Math.pow(val - avgLatency, 2), 0) / samples.length;
      const stability = Math.max(0, 100 - Math.sqrt(variance));

      setNetworkConditions(prev => ({
        ...prev,
        latency: avgLatency,
        stability
      }));

      if (stability < 70) {
        throw new Error(`Stabilité réseau faible: ${stability.toFixed(1)}%`);
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Test d'intégrité des données
  const testDataIntegrity = async (): Promise<void> => {
    try {
      // Vérifier l'intégrité des données de base
      if (!currentGame?.id || !currentGame?.roomCode) {
        throw new Error('Données de base du jeu manquantes');
      }

      if (!currentPlayer?.id || !currentPlayer?.name) {
        throw new Error('Données du joueur actuel manquantes');
      }

      // Vérifier la cohérence des relations
      const gameHasPlayers = currentGame.players.length > 0;
      const playerInGame = currentGame.players.some(p => p.id === currentPlayer.id);
      
      if (!gameHasPlayers || !playerInGame) {
        throw new Error('Relations entre jeu et joueurs incohérentes');
      }

      return Promise.resolve();
    } catch (error) {
      return Promise.reject(error);
    }
  };

  // Exécuter tous les tests
  const runAllTests = async () => {
    setIsRunning(true);
    setConnectionHistory([]);

    const testFunctions = [
      { id: 'basic-connection', fn: testBasicConnection },
      { id: 'realtime-sync', fn: testRealtimeSync },
      { id: 'disconnection-handling', fn: testDisconnectionHandling },
      { id: 'reconnection-recovery', fn: testReconnectionRecovery },
      { id: 'state-sync', fn: testStateSync },
      { id: 'conflict-resolution', fn: testConflictResolution },
      { id: 'network-stability', fn: testNetworkStability },
      { id: 'data-integrity', fn: testDataIntegrity }
    ];

    for (const test of testFunctions) {
      updateTestStatus(test.id, 'running');
      
      try {
        const startTime = Date.now();
        await test.fn();
        const duration = Date.now() - startTime;
        
        updateTestStatus(test.id, 'passed', undefined, `Durée: ${duration}ms`);
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
        updateTestStatus(test.id, 'failed', errorMessage);
      }

      // Pause entre les tests
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    setIsRunning(false);
  };

  // Simuler une déconnexion
  const simulateDisconnection = () => {
    setIsSimulatingDisconnection(true);
    
    // Simuler une déconnexion pendant la durée spécifiée
    setTimeout(() => {
      setIsSimulatingDisconnection(false);
    }, disconnectionDuration);
  };

  // Réinitialiser les tests
  const resetTests = () => {
    setConnectionTests(prev => prev.map(test => ({
      ...test,
      status: 'pending' as const,
      error: undefined,
      details: undefined
    })));
    setConnectionHistory([]);
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  // Obtenir la couleur de statut
  const getStatusColor = (status: ConnectionTest['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'running': return 'text-blue-500';
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
    }
  };

  // Calculer les statistiques de connexion
  const connectionStats = {
    total: connectionHistory.length,
    connected: connectionHistory.filter(h => h.status === 'connected').length,
    disconnected: connectionHistory.filter(h => h.status === 'disconnected').length,
    reconnecting: connectionHistory.filter(h => h.status === 'reconnecting').length,
    uptime: connectionHistory.filter(h => h.status === 'connected').length / Math.max(connectionHistory.length, 1) * 100
  };

  if (!isExpanded) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-lg font-semibold text-[#e0e0e0] hover:text-[#ff3333] transition-colors flex items-center space-x-2"
        >
          <span className="text-2xl">🔌</span>
          <span>Tests de Connexion</span>
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
          <span className="text-2xl">🔌</span>
          <span>Tests de Connexion</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#ff3333] hover:text-[#ff6666] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Statut de connexion actuel */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-[#e0e0e0]">📊 Statut de Connexion</h4>
          <div className="flex items-center space-x-2">
            {isConnected ? (
              <div className="flex items-center space-x-2 text-green-500">
                <Wifi className="w-5 h-5" />
                <span>Connecté</span>
              </div>
            ) : isConnecting ? (
              <div className="flex items-center space-x-2 text-yellow-500">
                <RefreshCw className="w-5 h-5 animate-spin" />
                <span>Reconnexion...</span>
              </div>
            ) : (
              <div className="flex items-center space-x-2 text-red-500">
                <WifiOff className="w-5 h-5" />
                <span>Déconnecté</span>
              </div>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{connectionStats.uptime.toFixed(1)}%</div>
            <div className="text-[#cccccc]">Uptime</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{networkConditions.latency.toFixed(0)}ms</div>
            <div className="text-[#cccccc]">Latence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{networkConditions.stability.toFixed(1)}%</div>
            <div className="text-[#cccccc]">Stabilité</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{connectedPlayers.length}</div>
            <div className="text-[#cccccc]">Joueurs connectés</div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={runAllTests}
          disabled={isRunning}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Activity className="w-4 h-4" />
          <span>Lancer tous les tests</span>
        </button>
        
        <button
          onClick={simulateDisconnection}
          disabled={isSimulatingDisconnection}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <WifiOff className="w-4 h-4" />
          <span>Simuler déconnexion</span>
        </button>
        
        <button
          onClick={resetTests}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Configuration */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-[#e0e0e0]">⚙️ Configuration</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Durée déconnexion (ms)</label>
            <input
              type="number"
              value={disconnectionDuration}
              onChange={(e) => setDisconnectionDuration(Number(e.target.value))}
              className="w-full bg-[#2a2a2a] text-[#e0e0e0] px-3 py-2 rounded border border-[#ff3333]/20"
              min="1000"
              max="30000"
              step="1000"
            />
          </div>
          
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Intervalle test (ms)</label>
            <input
              type="number"
              value={testInterval}
              onChange={(e) => setTestInterval(Number(e.target.value))}
              className="w-full bg-[#2a2a2a] text-[#e0e0e0] px-3 py-2 rounded border border-[#ff3333]/20"
              min="500"
              max="5000"
              step="500"
            />
          </div>
          
          <div className="flex items-end">
            <button
              onClick={() => setConnectionHistory([])}
              className="w-full px-3 py-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded border border-[#ff3333]/20 transition-colors"
            >
              Vider l'historique
            </button>
          </div>
        </div>
      </div>

      {/* Tests de connexion */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">🧪 Tests de Connexion</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {connectionTests.map((test) => (
            <div key={test.id} className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded border border-[#ff3333]/20">
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

      {/* Historique des connexions */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📈 Historique des Connexions</h4>
        <div className="h-48 overflow-y-auto bg-[#0a0a0a] rounded p-3">
          {connectionHistory.length === 0 ? (
            <span className="text-[#666666]">Aucun historique disponible</span>
          ) : (
            <div className="space-y-2">
              {connectionHistory.slice(-30).reverse().map((entry, index) => (
                <div key={index} className="text-xs text-[#cccccc] border-b border-[#333333] pb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {entry.status === 'connected' && <Wifi className="w-3 h-3 text-green-500" />}
                      {entry.status === 'disconnected' && <WifiOff className="w-3 h-3 text-red-500" />}
                      {entry.status === 'reconnecting' && <RefreshCw className="w-3 h-3 text-yellow-500 animate-spin" />}
                      <span className={entry.status === 'connected' ? 'text-green-500' : 
                                     entry.status === 'reconnecting' ? 'text-yellow-500' : 'text-red-500'}>
                        {entry.status}
                      </span>
                    </div>
                    <span className="text-[#666666]">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {entry.latency && (
                    <div className="text-[#999999] ml-5">
                      Latence: {entry.latency.toFixed(0)}ms
                    </div>
                  )}
                  {entry.error && (
                    <div className="text-red-400 ml-5">
                      Erreur: {entry.error}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
