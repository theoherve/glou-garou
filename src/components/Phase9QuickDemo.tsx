"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Play, 
  Pause, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Info,
  Zap,
  Target,
  Shield,
  Activity
} from 'lucide-react';

export const Phase9QuickDemo = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [currentTest, setCurrentTest] = useState(0);
  const [results, setResults] = useState<Array<{
    id: number;
    name: string;
    status: 'pending' | 'running' | 'passed' | 'failed';
    duration?: number;
  }>>([
    { id: 1, name: '🔌 Test de Connexion', status: 'pending' },
    { id: 2, name: '🎮 Test du Flux de Jeu', status: 'pending' },
    { id: 3, name: '👥 Test Multi-Joueurs', status: 'pending' },
    { id: 4, name: '🚨 Test Gestion d\'Erreurs', status: 'pending' },
    { id: 5, name: '🎨 Test UI/UX', status: 'pending' }
  ]);

  const testNames = [
    '🔌 Test de Connexion',
    '🎮 Test du Flux de Jeu', 
    '👥 Test Multi-Joueurs',
    '🚨 Test Gestion d\'Erreurs',
    '🎨 Test UI/UX'
  ];

  const handleStartTests = () => {
    setIsRunning(true);
    setCurrentTest(0);
    
    // Simuler l'exécution des tests
    const runTest = (index: number) => {
      if (index >= results.length) {
        setIsRunning(false);
        return;
      }

      setCurrentTest(index);
      
      // Mettre à jour le statut du test actuel
      setResults(prev => prev.map((result, i) => 
        i === index ? { ...result, status: 'running' } : result
      ));

      // Simuler la durée du test (1-3 secondes)
      const duration = Math.random() * 2000 + 1000;
      
      setTimeout(() => {
        // Déterminer si le test réussit ou échoue (90% de succès)
        const success = Math.random() > 0.1;
        
        setResults(prev => prev.map((result, i) => 
          i === index ? { 
            ...result, 
            status: success ? 'passed' : 'failed',
            duration: Math.round(duration)
          } : result
        ));

        // Passer au test suivant
        setTimeout(() => runTest(index + 1), 500);
      }, duration);
    };

    runTest(0);
  };

  const handleStopTests = () => {
    setIsRunning(false);
    setCurrentTest(0);
    
    // Remettre tous les tests en attente
    setResults(prev => prev.map(result => ({ ...result, status: 'pending' })));
  };

  const handleResetTests = () => {
    setIsRunning(false);
    setCurrentTest(0);
    
    // Remettre tous les tests en attente et effacer les durées
    setResults(prev => prev.map(result => ({ 
      ...result, 
      status: 'pending',
      duration: undefined
    })));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'failed': return <XCircle className="w-5 h-5 text-red-500" />;
      case 'running': return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      default: return <AlertTriangle className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'border-green-500/50 bg-green-500/10';
      case 'failed': return 'border-red-500/50 bg-red-500/10';
      case 'running': return 'border-blue-500/50 bg-blue-500/10';
      default: return 'border-gray-500/50 bg-gray-500/10';
    }
  };

  const passedTests = results.filter(r => r.status === 'passed').length;
  const failedTests = results.filter(r => r.status === 'failed').length;
  const totalTests = results.length;
  const successRate = totalTests > 0 ? Math.round((passedTests / totalTests) * 100) : 0;

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
      {/* En-tête */}
      <div className="text-center mb-6">
        <h3 className="text-2xl font-bold text-[#e0e0e0] mb-2">
          🧪 Phase 9 - Démonstration Rapide
        </h3>
        <p className="text-[#cccccc]">
          Testez rapidement les fonctionnalités de la Phase 9
        </p>
      </div>

      {/* Statistiques en temps réel */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        <div className="text-center p-3 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
          <div className="text-2xl font-bold text-[#e0e0e0]">{totalTests}</div>
          <div className="text-[#cccccc] text-sm">Total</div>
        </div>
        <div className="text-center p-3 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
          <div className="text-2xl font-bold text-green-500">{passedTests}</div>
          <div className="text-[#cccccc] text-sm">Réussis</div>
        </div>
        <div className="text-center p-3 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
          <div className="text-2xl font-bold text-red-500">{failedTests}</div>
          <div className="text-[#cccccc] text-sm">Échoués</div>
        </div>
        <div className="text-center p-3 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
          <div className="text-2xl font-bold text-blue-500">{successRate}%</div>
          <div className="text-[#cccccc] text-sm">Succès</div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex flex-wrap gap-3 justify-center mb-6">
        <button
          onClick={handleStartTests}
          disabled={isRunning}
          className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:cursor-not-allowed"
        >
          <Play className="w-5 h-5" />
          <span>🚀 Lancer les Tests</span>
        </button>
        
        <button
          onClick={handleStopTests}
          disabled={!isRunning}
          className="px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2 disabled:cursor-not-allowed"
        >
          <Pause className="w-5 h-5" />
          <span>⏹️ Arrêter</span>
        </button>
        
        <button
          onClick={handleResetTests}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Target className="w-5 h-5" />
          <span>🔄 Réinitialiser</span>
        </button>
      </div>

      {/* Barre de progression */}
      {isRunning && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[#e0e0e0] text-sm">Progression des tests</span>
            <span className="text-[#cccccc] text-sm">
              {currentTest + 1} / {totalTests}
            </span>
          </div>
          <div className="w-full bg-[#1a1a1a] rounded-full h-2">
            <motion.div
              className="bg-blue-500 h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${((currentTest + 1) / totalTests) * 100}%` }}
              transition={{ duration: 0.5 }}
            />
          </div>
        </div>
      )}

      {/* Liste des tests */}
      <div className="space-y-3">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📋 Tests Disponibles</h4>
        
        {results.map((test, index) => (
          <motion.div
            key={test.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`p-4 rounded-lg border transition-all duration-300 ${
              getStatusColor(test.status)
            } ${
              index === currentTest && isRunning ? 'ring-2 ring-blue-500 ring-opacity-50' : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                {getStatusIcon(test.status)}
                <div>
                  <div className="font-medium text-[#e0e0e0]">{test.name}</div>
                  {test.duration && (
                    <div className="text-sm text-[#cccccc]">
                      Durée: {test.duration}ms
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {test.status === 'running' && (
                  <div className="flex items-center space-x-1 text-blue-500 text-sm">
                    <Activity className="w-4 h-4 animate-pulse" />
                    <span>En cours...</span>
                  </div>
                )}
                {test.status === 'passed' && (
                  <div className="text-green-500 text-sm font-medium">✓ Réussi</div>
                )}
                {test.status === 'failed' && (
                  <div className="text-red-500 text-sm font-medium">✗ Échoué</div>
                )}
                {test.status === 'pending' && (
                  <div className="text-gray-400 text-sm">En attente</div>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Informations */}
      <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center space-x-2 mb-2">
          <Info className="w-5 h-5 text-blue-500" />
          <span className="text-[#e0e0e0] font-medium">Informations</span>
        </div>
        <div className="text-[#cccccc] text-sm space-y-1">
          <div>• Cette démonstration simule l'exécution des tests de la Phase 9</div>
          <div>• Les tests prennent entre 1 et 3 secondes chacun</div>
          <div>• Taux de succès simulé : environ 90%</div>
          <div>• Utilisez les boutons pour contrôler l'exécution</div>
        </div>
      </div>

      {/* Statut final */}
      {!isRunning && (passedTests > 0 || failedTests > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 rounded-lg border text-center"
          style={{
            backgroundColor: successRate >= 80 ? 'rgba(0, 204, 0, 0.1)' : 'rgba(255, 51, 51, 0.1)',
            borderColor: successRate >= 80 ? 'rgba(0, 204, 0, 0.3)' : 'rgba(255, 51, 51, 0.3)'
          }}
        >
          <div className="text-lg font-medium text-[#e0e0e0] mb-2">
            {successRate >= 80 ? '🎉 Tests Terminés avec Succès !' : '⚠️ Tests Terminés avec des Échecs'}
          </div>
          <div className="text-[#cccccc]">
            Taux de succès : <span className="font-bold">{successRate}%</span>
            {successRate >= 80 && ' - Excellent travail !'}
            {successRate < 80 && successRate >= 60 && ' - Bon travail, quelques améliorations possibles'}
            {successRate < 60 && ' - Des améliorations sont nécessaires'}
          </div>
        </motion.div>
      )}
    </div>
  );
};
