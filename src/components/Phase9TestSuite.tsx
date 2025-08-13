"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  CheckCircle, 
  XCircle, 
  Clock,
  Activity,
  BarChart3,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Download,
  Upload,
  Eye,
  EyeOff
} from 'lucide-react';
import { EndToEndTest } from './EndToEndTest';
import { MultiPlayerTest } from './MultiPlayerTest';
import { ConnectionTest } from './ConnectionTest';
import { ErrorHandler } from './ErrorHandler';

interface TestSuiteStatus {
  endToEnd: 'pending' | 'running' | 'completed' | 'failed';
  multiPlayer: 'pending' | 'running' | 'completed' | 'failed';
  connection: 'pending' | 'running' | 'completed' | 'failed';
  errorHandler: 'pending' | 'running' | 'completed' | 'failed';
}

interface TestResult {
  name: string;
  status: 'pending' | 'running' | 'passed' | 'failed';
  duration?: number;
  error?: string;
}

export const Phase9TestSuite = ({ roomCode }: { roomCode: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [activeTests, setActiveTests] = useState<string[]>([]);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const [isRunningAll, setIsRunningAll] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [autoExport, setAutoExport] = useState(false);
  const [testHistory, setTestHistory] = useState<Array<{
    timestamp: Date;
    testName: string;
    status: 'started' | 'completed' | 'failed';
    duration?: number;
    error?: string;
  }>>([]);

  // Configuration des tests
  const testSuites = [
    {
      id: 'endToEnd',
      name: 'Tests de Bout en Bout',
      description: 'Test complet du flux de création → attente → début → jeu',
      component: EndToEndTest,
      icon: '🧪'
    },
    {
      id: 'multiPlayer',
      name: 'Test Multi-Joueurs',
      description: 'Test avec plusieurs joueurs et simulation des interactions',
      component: MultiPlayerTest,
      icon: '👥'
    },
    {
      id: 'connection',
      name: 'Tests de Connexion',
      description: 'Test des déconnexions/reconnexions et stabilité réseau',
      component: ConnectionTest,
      icon: '🔌'
    },
    {
      id: 'errorHandler',
      name: 'Gestionnaire d\'Erreurs',
      description: 'Logs détaillés et gestion gracieuse des erreurs',
      component: ErrorHandler,
      icon: '🚨'
    }
  ];

  // Démarrer un test spécifique
  const startTest = (testId: string) => {
    setActiveTests(prev => [...prev, testId]);
    setTestResults(prev => prev.map(result => 
      result.name === testId ? { ...result, status: 'running' as const } : result
    ));
    
    addTestHistory(testId, 'started');
  };

  // Arrêter un test spécifique
  const stopTest = (testId: string) => {
    setActiveTests(prev => prev.filter(id => id !== testId));
    setTestResults(prev => prev.map(result => 
      result.name === testId ? { ...result, status: 'pending' as const } : result
    ));
  };

  // Démarrer tous les tests
  const startAllTests = async () => {
    setIsRunningAll(true);
    
    for (const suite of testSuites) {
      await startTest(suite.id);
      
      // Simuler l'exécution du test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Marquer le test comme terminé
      const success = Math.random() > 0.3; // 70% de succès
      const duration = Math.random() * 3000 + 1000; // 1-4 secondes
      
      if (success) {
        completeTest(suite.id, duration);
      } else {
        failTest(suite.id, duration, 'Erreur simulée pour le test');
      }
    }
    
    setIsRunningAll(false);
  };

  // Arrêter tous les tests
  const stopAllTests = () => {
    setIsRunningAll(false);
    setActiveTests([]);
    setTestResults(prev => prev.map(result => ({ ...result, status: 'pending' as const })));
  };

  // Marquer un test comme terminé avec succès
  const completeTest = (testId: string, duration: number) => {
    setTestResults(prev => prev.map(result => 
      result.name === testId ? { ...result, status: 'passed' as const, duration } : result
    ));
    
    setActiveTests(prev => prev.filter(id => id !== testId));
    addTestHistory(testId, 'completed', duration);
  };

  // Marquer un test comme échoué
  const failTest = (testId: string, duration: number, error: string) => {
    setTestResults(prev => prev.map(result => 
      result.name === testId ? { ...result, status: 'failed' as const, duration, error } : result
    ));
    
    setActiveTests(prev => prev.filter(id => id !== testId));
    addTestHistory(testId, 'failed', duration, error);
  };

  // Ajouter une entrée à l'historique des tests
  const addTestHistory = (testName: string, status: 'started' | 'completed' | 'failed', duration?: number, error?: string) => {
    const entry = {
      timestamp: new Date(),
      testName,
      status,
      duration,
      error
    };
    
    setTestHistory(prev => [entry, ...prev.slice(0, 99)]); // Garder seulement les 100 dernières entrées
  };

  // Réinitialiser tous les tests
  const resetAllTests = () => {
    setTestResults([]);
    setActiveTests([]);
    setTestHistory([]);
    setIsRunningAll(false);
  };

  // Exporter les résultats des tests
  const exportResults = () => {
    const data = {
      timestamp: new Date().toISOString(),
      testResults,
      testHistory,
      summary: {
        total: testResults.length,
        passed: testResults.filter(r => r.status === 'passed').length,
        failed: testResults.filter(r => r.status === 'failed').length,
        running: testResults.filter(r => r.status === 'running').length
      }
    };
    
    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `phase9-test-results-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Calculer les statistiques
  const stats = {
    total: testResults.length,
    passed: testResults.filter(r => r.status === 'passed').length,
    failed: testResults.filter(r => r.status === 'failed').length,
    running: testResults.filter(r => r.status === 'running').length,
    pending: testResults.filter(r => r.status === 'pending').length,
    successRate: testResults.length > 0 
      ? (testResults.filter(r => r.status === 'passed').length / testResults.length) * 100 
      : 0
  };

  // Obtenir l'icône de statut
  const getStatusIcon = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4 text-gray-400" />;
      case 'running': return <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  // Obtenir la couleur de statut
  const getStatusColor = (status: TestResult['status']) => {
    switch (status) {
      case 'pending': return 'text-gray-400';
      case 'running': return 'text-blue-500';
      case 'passed': return 'text-green-500';
      case 'failed': return 'text-red-500';
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
          <span>Phase 9 - Suite de Tests</span>
          {stats.failed > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {stats.failed}
            </span>
          )}
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
          <span>Phase 9 - Suite de Tests</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#ff3333] hover:text-[#ff6666] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Statistiques globales */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📊 Statistiques Globales</h4>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{stats.total}</div>
            <div className="text-[#cccccc]">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.passed}</div>
            <div className="text-[#cccccc]">Réussis</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{stats.failed}</div>
            <div className="text-[#cccccc]">Échoués</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500">{stats.running}</div>
            <div className="text-[#cccccc]">En cours</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.successRate.toFixed(1)}%</div>
            <div className="text-[#cccccc]">Taux de succès</div>
          </div>
        </div>
      </div>

      {/* Contrôles globaux */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={startAllTests}
          disabled={isRunningAll}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Lancer tous les tests</span>
        </button>
        
        <button
          onClick={stopAllTests}
          disabled={!isRunningAll}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Pause className="w-4 h-4" />
          <span>Arrêter tous les tests</span>
        </button>
        
        <button
          onClick={resetAllTests}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialiser</span>
        </button>
        
        <button
          onClick={exportResults}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Exporter résultats</span>
        </button>
        
        <button
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Settings className="w-4 h-4" />
          <span>{showAdvanced ? 'Masquer' : 'Afficher'} avancé</span>
        </button>
      </div>

      {/* Configuration avancée */}
      {showAdvanced && (
        <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
          <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">⚙️ Configuration Avancée</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                checked={autoExport}
                onChange={(e) => setAutoExport(e.target.checked)}
                className="w-4 h-4"
              />
              <span className="text-sm text-[#cccccc]">Export automatique après tests</span>
            </div>
            <div className="text-sm text-[#cccccc]">
              Tests actifs: {activeTests.length}
            </div>
          </div>
        </div>
      )}

      {/* Suites de tests */}
      <div className="space-y-6 mb-6">
        {testSuites.map((suite) => {
          const Component = suite.component;
          const isActive = activeTests.includes(suite.id);
          const result = testResults.find(r => r.name === suite.id);
          
          return (
            <div key={suite.id} className="bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
              <div className="p-4 border-b border-[#333333]">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{suite.icon}</span>
                    <div>
                      <h4 className="text-lg font-medium text-[#e0e0e0]">{suite.name}</h4>
                      <p className="text-sm text-[#cccccc]">{suite.description}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center space-x-3">
                    {result && (
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(result.status)}
                        <span className={`text-sm ${getStatusColor(result.status)}`}>
                          {result.status === 'pending' ? 'En attente' :
                           result.status === 'running' ? 'En cours' :
                           result.status === 'passed' ? 'Réussi' :
                           'Échoué'}
                        </span>
                        {result.duration && (
                          <span className="text-xs text-[#666666]">
                            {result.duration}ms
                          </span>
                        )}
                      </div>
                    )}
                    
                    <div className="flex space-x-2">
                      {!isActive ? (
                        <button
                          onClick={() => startTest(suite.id)}
                          disabled={isRunningAll}
                          className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
                        >
                          Démarrer
                        </button>
                      ) : (
                        <button
                          onClick={() => stopTest(suite.id)}
                          className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-sm transition-colors"
                        >
                          Arrêter
                        </button>
                      )}
                    </div>
                  </div>
                </div>
                
                {result?.error && (
                  <div className="mt-3 p-3 bg-red-500/10 border border-red-500/20 rounded">
                    <div className="text-sm text-red-400 font-medium">Erreur:</div>
                    <div className="text-sm text-red-300">{result.error}</div>
                  </div>
                )}
              </div>
              
              <div className="p-4">
                <Component roomCode={roomCode} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Historique des tests */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📋 Historique des Tests</h4>
        <div className="h-48 overflow-y-auto bg-[#0a0a0a] rounded p-3">
          {testHistory.length === 0 ? (
            <span className="text-[#666666]">Aucun historique disponible</span>
          ) : (
            <div className="space-y-2">
              {testHistory.map((entry, index) => (
                <div key={index} className="text-xs text-[#cccccc] border-b border-[#333333] pb-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {entry.status === 'started' && <Activity className="w-3 h-3 text-blue-500" />}
                      {entry.status === 'completed' && <CheckCircle className="w-3 h-3 text-green-500" />}
                      {entry.status === 'failed' && <XCircle className="w-3 h-3 text-red-500" />}
                      <span className={entry.status === 'started' ? 'text-blue-500' : 
                                     entry.status === 'completed' ? 'text-green-500' : 'text-red-500'}>
                        {entry.testName}
                      </span>
                    </div>
                    <span className="text-[#666666]">
                      {entry.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  {entry.duration && (
                    <div className="text-[#999999] ml-5">
                      Durée: {entry.duration}ms
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

      {/* Résumé des résultats */}
      {testResults.length > 0 && (
        <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
          <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📈 Résumé des Résultats</h4>
          <div className="space-y-2">
            {testResults.map((result) => (
              <div key={result.name} className="flex items-center justify-between p-2 bg-[#2a2a2a] rounded">
                <div className="flex items-center space-x-2">
                  {getStatusIcon(result.status)}
                  <span className={`text-sm ${getStatusColor(result.status)}`}>
                    {result.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-2">
                  {result.duration && (
                    <span className="text-xs text-[#cccccc]">{result.duration}ms</span>
                  )}
                  {result.error && (
                    <span className="text-xs text-red-400" title={result.error}>
                      ⚠️ Erreur
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  );
};
