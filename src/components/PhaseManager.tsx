"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Moon, Users, Target, Crown, Clock, Play, Pause, SkipForward, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';

interface PhaseManagerProps {
  isVisible: boolean;
  onClose: () => void;
}

export const PhaseManager = ({ isVisible, onClose }: PhaseManagerProps) => {
  const { currentGame, currentPlayer } = useGameStore();
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'night' | 'day' | 'vote' | 'end'>('preparation');
  const [phaseTimer, setPhaseTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [autoTransition, setAutoTransition] = useState(false);
  const [phaseHistory, setPhaseHistory] = useState<Array<{
    phase: string;
    timestamp: string;
    duration: number;
  }>>([]);

  // Vérifier que l'utilisateur actuel est le maître de jeu
  useEffect(() => {
    if (!currentPlayer?.isGameMaster) {
      onClose();
    }
  }, [currentPlayer, onClose]);

  // Synchroniser avec la phase actuelle du jeu
  useEffect(() => {
    if (currentGame?.phase) {
      setCurrentPhase(currentGame.phase as any);
    }
  }, [currentGame?.phase]);

  // Timer pour les phases
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerRunning && phaseTimer > 0) {
      interval = setInterval(() => {
        setPhaseTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            if (autoTransition) {
              handleAutoTransition();
            }
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, phaseTimer, autoTransition]);

  if (!isVisible || !currentGame || !currentPlayer?.isGameMaster) {
    return null;
  }

  const getPhaseInfo = (phase: string) => {
    switch (phase) {
      case 'preparation':
        return {
          title: 'Préparation',
          description: 'Les joueurs découvrent leurs rôles',
          icon: <CheckCircle className="w-6 h-6 text-green-400" />,
          color: 'from-green-500 to-green-600',
          bgColor: 'bg-green-900/20',
          borderColor: 'border-green-500/30'
        };
      case 'night':
        return {
          title: 'Nuit',
          description: 'Les rôles spéciaux agissent',
          icon: <Moon className="w-6 h-6 text-indigo-400" />,
          color: 'from-indigo-500 to-indigo-600',
          bgColor: 'bg-indigo-900/20',
          borderColor: 'border-indigo-500/30'
        };
      case 'day':
        return {
          title: 'Jour',
          description: 'Discussion et débat',
          icon: <Users className="w-6 h-6 text-yellow-400" />,
          color: 'from-yellow-500 to-yellow-600',
          bgColor: 'bg-yellow-900/20',
          borderColor: 'border-yellow-500/30'
        };
      case 'vote':
        return {
          title: 'Vote',
          description: 'Élimination d\'un suspect',
          icon: <Target className="w-6 h-6 text-red-400" />,
          color: 'from-red-500 to-red-600',
          bgColor: 'bg-red-900/20',
          borderColor: 'border-red-500/30'
        };
      case 'end':
        return {
          title: 'Fin de Partie',
          description: 'Détermination du vainqueur',
          icon: <Crown className="w-6 h-6 text-purple-400" />,
          color: 'from-purple-500 to-purple-600',
          bgColor: 'bg-purple-900/20',
          borderColor: 'border-purple-500/30'
        };
      default:
        return {
          title: 'Inconnue',
          description: 'Phase non définie',
          icon: <Clock className="w-6 h-6 text-gray-400" />,
          color: 'from-gray-500 to-gray-600',
          bgColor: 'bg-gray-900/20',
          borderColor: 'border-gray-500/30'
        };
    }
  };

  const getNextPhase = (current: string) => {
    const phases = ['preparation', 'night', 'day', 'vote', 'end'];
    const currentIndex = phases.indexOf(current);
    return phases[(currentIndex + 1) % phases.length];
  };

  const handlePhaseChange = (newPhase: typeof currentPhase) => {
    const oldPhase = currentPhase;
    const timestamp = new Date().toLocaleTimeString();
    const duration = phaseTimer > 0 ? phaseTimer : 0;

    // Ajouter à l'historique
    setPhaseHistory(prev => [
      {
        phase: oldPhase,
        timestamp,
        duration
      },
      ...prev.slice(0, 9) // Garder seulement les 10 dernières phases
    ]);

    setCurrentPhase(newPhase);
    setPhaseTimer(0);
    setIsTimerRunning(false);

    // TODO: Mettre à jour la base de données et envoyer via Realtime
    console.log(`Phase changée: ${oldPhase} → ${newPhase}`);
  };

  const handleAutoTransition = () => {
    const nextPhase = getNextPhase(currentPhase);
    if (nextPhase !== 'end') {
      handlePhaseChange(nextPhase as typeof currentPhase);
    } else {
      setAutoTransition(false);
    }
  };

  const startTimer = (duration: number) => {
    setPhaseTimer(duration);
    setIsTimerRunning(true);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    setPhaseTimer(0);
  };

  const toggleAutoTransition = () => {
    setAutoTransition(!autoTransition);
    if (!autoTransition && phaseTimer > 0) {
      setIsTimerRunning(true);
    }
  };

  const getDefaultPhaseDuration = (phase: string) => {
    switch (phase) {
      case 'preparation':
        return 300; // 5 minutes
      case 'night':
        return 180; // 3 minutes
      case 'day':
        return 600; // 10 minutes
      case 'vote':
        return 300; // 5 minutes
      default:
        return 300;
    }
  };

  const currentPhaseInfo = getPhaseInfo(currentPhase);
  const nextPhase = getNextPhase(currentPhase);
  const nextPhaseInfo = getPhaseInfo(nextPhase);

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-6 max-w-6xl w-full border border-[#ff3333]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Clock className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">⏱️ Gestionnaire de Phases</h2>
                <p className="text-gray-300">Contrôle automatique des transitions de phase</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Colonne 1: Phase actuelle et contrôles */}
            <div className="space-y-6">
              {/* Phase actuelle */}
              <motion.div
                className={`rounded-lg p-6 ${currentPhaseInfo.bgColor} border ${currentPhaseInfo.borderColor}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {currentPhaseInfo.icon}
                  <div>
                    <h3 className="text-xl font-bold text-white">Phase Actuelle</h3>
                    <p className="text-gray-300">{currentPhaseInfo.description}</p>
                  </div>
                </div>

                <div className="text-center mb-4">
                  <div className="text-5xl font-bold text-white mb-2">
                    {Math.floor(phaseTimer / 60)}:{(phaseTimer % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {isTimerRunning ? 'En cours...' : 'Arrêté'}
                  </div>
                </div>

                {/* Barre de progression */}
                <div className="w-full bg-gray-700 rounded-full h-3 mb-4">
                  <div
                    className={`h-3 rounded-full transition-all duration-300 bg-gradient-to-r ${currentPhaseInfo.color}`}
                    style={{ 
                      width: phaseTimer > 0 
                        ? `${((getDefaultPhaseDuration(currentPhase) - phaseTimer) / getDefaultPhaseDuration(currentPhase)) * 100}%` 
                        : '0%' 
                    }}
                  ></div>
                </div>

                {/* Contrôles du timer */}
                <div className="grid grid-cols-2 gap-3">
                  <button
                    onClick={() => startTimer(getDefaultPhaseDuration(currentPhase))}
                    className="p-3 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Timer par défaut
                  </button>
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`p-3 rounded-lg text-sm transition-colors ${
                      isTimerRunning 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                    }`}
                  >
                    {isTimerRunning ? 'Pause' : 'Reprendre'}
                  </button>
                  <button
                    onClick={stopTimer}
                    className="p-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Arrêter
                  </button>
                  <button
                    onClick={handleAutoTransition}
                    className="p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                  >
                    Phase suivante
                  </button>
                </div>
              </motion.div>

              {/* Phase suivante */}
              <motion.div
                className={`rounded-lg p-6 ${nextPhaseInfo.bgColor} border ${nextPhaseInfo.borderColor}`}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <div className="flex items-center space-x-3 mb-4">
                  {nextPhaseInfo.icon}
                  <div>
                    <h3 className="text-xl font-bold text-white">Phase Suivante</h3>
                    <p className="text-gray-300">{nextPhaseInfo.description}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <button
                    onClick={() => handlePhaseChange(nextPhase as typeof currentPhase)}
                    className="w-full p-3 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-lg transition-all duration-200"
                  >
                    Passer à {nextPhaseInfo.title}
                  </button>
                  
                  <div className="text-center text-sm text-gray-300">
                    Durée recommandée: {Math.floor(getDefaultPhaseDuration(nextPhase) / 60)} min
                  </div>
                </div>
              </motion.div>

              {/* Transition automatique */}
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">🔄 Transition Automatique</h3>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-300">Activer la transition automatique</span>
                    <button
                      onClick={toggleAutoTransition}
                      className={`w-12 h-6 rounded-full transition-colors ${
                        autoTransition ? 'bg-green-500' : 'bg-gray-600'
                      }`}
                    >
                      <div
                        className={`w-4 h-4 bg-white rounded-full transition-transform ${
                          autoTransition ? 'translate-x-6' : 'translate-x-1'
                        }`}
                      ></div>
                    </button>
                  </div>
                  
                  {autoTransition && (
                    <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-3">
                      <p className="text-green-200 text-sm">
                        Les phases changeront automatiquement à la fin de chaque timer.
                      </p>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Colonne 2: Historique et phases disponibles */}
            <div className="space-y-6">
              {/* Phases disponibles */}
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">🎯 Phases Disponibles</h3>
                
                <div className="space-y-2">
                  {['preparation', 'night', 'day', 'vote', 'end'].map((phase) => {
                    const phaseInfo = getPhaseInfo(phase);
                    const isActive = currentPhase === phase;
                    
                    return (
                      <button
                        key={phase}
                        onClick={() => handlePhaseChange(phase as typeof currentPhase)}
                        disabled={isActive}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          isActive
                            ? 'bg-blue-600 text-white cursor-default'
                            : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          {phaseInfo.icon}
                          <div>
                            <div className="font-medium">{phaseInfo.title}</div>
                            <div className="text-xs opacity-80">{phaseInfo.description}</div>
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </motion.div>

              {/* Historique des phases */}
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">📊 Historique des Phases</h3>
                
                <div className="space-y-2 max-h-64 overflow-y-auto">
                  {phaseHistory.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center">Aucune phase enregistrée</p>
                  ) : (
                    phaseHistory.map((entry, index) => {
                      const phaseInfo = getPhaseInfo(entry.phase);
                      return (
                        <div
                          key={index}
                          className={`p-3 rounded-lg ${phaseInfo.bgColor} border ${phaseInfo.borderColor}`}
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-2">
                              {phaseInfo.icon}
                              <span className="text-white font-medium">{phaseInfo.title}</span>
                            </div>
                            <div className="text-right">
                              <div className="text-gray-300 text-sm">{entry.timestamp}</div>
                              <div className="text-gray-400 text-xs">
                                {Math.floor(entry.duration / 60)}:{(entry.duration % 60).toString().padStart(2, '0')}
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              </motion.div>

              {/* Statistiques de la partie */}
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">📈 Statistiques</h3>
                
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-400 mb-1">
                      {phaseHistory.length}
                    </div>
                    <div className="text-gray-300 text-sm">Phases jouées</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-400 mb-1">
                      {Math.floor(phaseHistory.reduce((acc, entry) => acc + entry.duration, 0) / 60)}
                    </div>
                    <div className="text-gray-300 text-sm">Minutes totales</div>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Bouton de fermeture */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 0.5 }}
          >
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#ff3333] hover:bg-[#ff3333]/80 text-white font-semibold rounded-lg transition-colors"
            >
              Fermer le Gestionnaire
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

