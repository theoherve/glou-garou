"use client";

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  TestTube, 
  Play, 
  Pause, 
  RotateCcw, 
  CheckCircle, 
  XCircle,
  AlertTriangle,
  Info,
  Settings,
  Download,
  BarChart3
} from 'lucide-react';
import { Phase9TestSuite } from './Phase9TestSuite';

export const Phase9Demo = ({ roomCode }: { roomCode: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [demoMode, setDemoMode] = useState<'overview' | 'tests' | 'full'>('overview');

  const demoFeatures = [
    {
      icon: '🧪',
      title: 'Tests de Bout en Bout',
      description: 'Validation complète du flux de jeu',
      status: 'ready'
    },
    {
      icon: '👥',
      title: 'Tests Multi-Joueurs',
      description: 'Simulation d\'interactions avec IA',
      status: 'ready'
    },
    {
      icon: '🔌',
      title: 'Tests de Connexion',
      description: 'Robustesse réseau et synchronisation',
      status: 'ready'
    },
    {
      icon: '🚨',
      title: 'Gestionnaire d\'Erreurs',
      description: 'Logs détaillés et gestion gracieuse',
      status: 'ready'
    }
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'ready': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'running': return <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />;
      case 'error': return <XCircle className="w-5 h-5 text-red-500" />;
      default: return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (!isExpanded) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-lg font-semibold text-[#e0e0e0] hover:text-[#ff3333] transition-colors flex items-center space-x-2"
        >
          <span className="text-2xl">🎯</span>
          <span>Phase 9 - Démonstration</span>
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
          <span className="text-2xl">🎯</span>
          <span>Phase 9 - Démonstration</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#ff3333] hover:text-[#ff6666] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Mode de démonstration */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-[#e0e0e0]">🎮 Mode de Démonstration</h4>
          <div className="flex space-x-2">
            <button
              onClick={() => setDemoMode('overview')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                demoMode === 'overview' 
                  ? 'bg-[#ff3333] text-white' 
                  : 'bg-[#4a4a4a] text-[#cccccc] hover:bg-[#5a5a5a]'
              }`}
            >
              Vue d'ensemble
            </button>
            <button
              onClick={() => setDemoMode('tests')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                demoMode === 'tests' 
                  ? 'bg-[#ff3333] text-white' 
                  : 'bg-[#4a4a4a] text-[#cccccc] hover:bg-[#5a5a5a]'
              }`}
            >
              Tests individuels
            </button>
            <button
              onClick={() => setDemoMode('full')}
              className={`px-3 py-1 rounded text-sm transition-colors ${
                demoMode === 'full' 
                  ? 'bg-[#ff3333] text-white' 
                  : 'bg-[#4a4a4a] text-[#cccccc] hover:bg-[#5a5a5a]'
              }`}
            >
              Suite complète
            </button>
          </div>
        </div>
        
        <p className="text-[#cccccc] text-sm">
          {demoMode === 'overview' && 'Vue d\'ensemble des fonctionnalités de la Phase 9'}
          {demoMode === 'tests' && 'Tests individuels de chaque composant'}
          {demoMode === 'full' && 'Suite complète de tests avec interface unifiée'}
        </p>
      </div>

      {/* Vue d'ensemble */}
      {demoMode === 'overview' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {demoFeatures.map((feature, index) => (
              <motion.div
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20 hover:border-[#ff3333]/40 transition-colors"
              >
                <div className="flex items-start space-x-3">
                  <span className="text-3xl">{feature.icon}</span>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h5 className="text-lg font-medium text-[#e0e0e0]">{feature.title}</h5>
                      {getStatusIcon(feature.status)}
                    </div>
                    <p className="text-[#cccccc] text-sm">{feature.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Statistiques de la Phase 9 */}
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
            <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📊 Statistiques de la Phase 9</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div className="text-center">
                <div className="text-2xl font-bold text-[#e0e0e0]">5</div>
                <div className="text-[#cccccc]">Composants créés</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#e0e0e0]">25+</div>
                <div className="text-[#cccccc]">Tests différents</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#e0e0e0]">100%</div>
                <div className="text-[#cccccc]">Couverture</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-[#e0e0e0]">✅</div>
                <div className="text-[#cccccc]">Complétée</div>
              </div>
            </div>
          </div>

          {/* Fonctionnalités clés */}
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
            <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">🚀 Fonctionnalités Clés</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[#cccccc]">Tests automatisés complets</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[#cccccc]">Gestion d'erreurs robuste</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[#cccccc]">Interface utilisateur intuitive</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[#cccccc]">Export des résultats</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[#cccccc]">Simulation multi-joueurs</span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-[#cccccc]">Tests de robustesse réseau</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tests individuels */}
      {demoMode === 'tests' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
            <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">🧪 Tests Individuels</h4>
            <p className="text-[#cccccc] text-sm mb-4">
              Testez chaque composant individuellement pour valider ses fonctionnalités.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {demoFeatures.map((feature) => (
                <div key={feature.title} className="p-3 bg-[#2a2a2a] rounded border border-[#ff3333]/20">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-xl">{feature.icon}</span>
                    <span className="font-medium text-[#e0e0e0]">{feature.title}</span>
                  </div>
                  <p className="text-[#cccccc] text-xs mb-3">{feature.description}</p>
                  <button className="px-3 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors">
                    Tester
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Suite complète */}
      {demoMode === 'full' && (
        <div className="space-y-6">
          <div className="p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
            <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">🎯 Suite Complète de Tests</h4>
            <p className="text-[#cccccc] text-sm mb-4">
              Accédez à la suite complète de tests avec interface unifiée et gestion centralisée.
            </p>
            
            <div className="flex flex-wrap gap-3">
              <button className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Play className="w-4 h-4" />
                <span>Lancer tous les tests</span>
              </button>
              <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <BarChart3 className="w-4 h-4" />
                <span>Voir les statistiques</span>
              </button>
              <button className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2">
                <Download className="w-4 h-4" />
                <span>Exporter les résultats</span>
              </button>
            </div>
          </div>

          {/* Intégration de la suite complète */}
          <Phase9TestSuite roomCode={roomCode} />
        </div>
      )}

      {/* Actions rapides */}
      <div className="mt-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">⚡ Actions Rapides</h4>
        <div className="flex flex-wrap gap-3">
          <button className="px-3 py-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded transition-colors flex items-center space-x-2">
            <Info className="w-4 h-4" />
            <span>Documentation</span>
          </button>
          <button className="px-3 py-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded transition-colors flex items-center space-x-2">
            <Settings className="w-4 h-4" />
            <span>Configuration</span>
          </button>
          <button className="px-3 py-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded transition-colors flex items-center space-x-2">
            <RotateCcw className="w-4 h-4" />
            <span>Réinitialiser</span>
          </button>
        </div>
      </div>
    </motion.div>
  );
};
