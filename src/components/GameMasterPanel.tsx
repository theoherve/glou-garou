"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Crown, Moon, Users, Eye, Zap, Target, Heart, Play, Pause, SkipForward, Clock, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import Image from 'next/image';
import { getRoleAssets } from '@/lib/roleAssets';
import { Role } from '@/types/game';

interface GameMasterPanelProps {
  isVisible: boolean;
  onClose: () => void;
}

export const GameMasterPanel = ({ isVisible, onClose }: GameMasterPanelProps) => {
  const { currentGame, currentPlayer } = useGameStore();
  const [currentPhase, setCurrentPhase] = useState<'preparation' | 'night' | 'day' | 'vote' | 'end'>('preparation');
  const [phaseTimer, setPhaseTimer] = useState<number>(0);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [gameLog, setGameLog] = useState<string[]>([]);

  // Vérifier que l'utilisateur actuel est le maître de jeu
  useEffect(() => {
    if (!currentPlayer?.isGameMaster) {
      onClose();
    }
  }, [currentPlayer, onClose]);

  // Timer pour les phases
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isTimerRunning && phaseTimer > 0) {
      interval = setInterval(() => {
        setPhaseTimer(prev => {
          if (prev <= 1) {
            setIsTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isTimerRunning, phaseTimer]);

  if (!isVisible || !currentGame || !currentPlayer?.isGameMaster) {
    return null;
  }

  const getRoleIcon = (role: Role) => {
    const { illustrationSrc, displayName } = getRoleAssets(role);
    return (
      <Image
        src={illustrationSrc}
        alt={displayName}
        width={56}
        height={56}
        className="w-14 h-14 object-contain"
      />
    );
  };

  const getRoleName = (role: Role) => getRoleAssets(role).displayName;

  const getTeamInfo = (role: Role) => {
    if (role === 'loup-garou') {
      return {
        team: 'loup-garou',
        color: 'text-red-400',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-500/30'
      };
    } else {
      return {
        team: 'villageois',
        color: 'text-green-400',
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-500/30'
      };
    }
  };

  const handlePhaseChange = (newPhase: typeof currentPhase) => {
    setCurrentPhase(newPhase);
    setPhaseTimer(0);
    setIsTimerRunning(false);
    
    // Ajouter au log
    const timestamp = new Date().toLocaleTimeString();
    setGameLog(prev => [`[${timestamp}] Phase changée: ${newPhase}`, ...prev.slice(0, 19)]);
    
    // TODO: Mettre à jour la base de données et envoyer via Realtime
  };

  const startTimer = (duration: number) => {
    setPhaseTimer(duration);
    setIsTimerRunning(true);
    
    const timestamp = new Date().toLocaleTimeString();
    setGameLog(prev => [`[${timestamp}] Timer démarré: ${duration}s`, ...prev.slice(0, 19)]);
  };

  const stopTimer = () => {
    setIsTimerRunning(false);
    const timestamp = new Date().toLocaleTimeString();
    setGameLog(prev => [`[${timestamp}] Timer arrêté`, ...prev.slice(0, 19)]);
  };

  const getPhaseInstructions = () => {
    switch (currentPhase) {
      case 'preparation':
        return {
          title: 'Phase de Préparation',
          description: 'Les joueurs découvrent leurs rôles. Assurez-vous que tout le monde est prêt.',
          steps: [
            'Vérifiez que tous les joueurs ont révélé leur rôle',
            'Expliquez les règles si nécessaire',
            'Préparez-vous à commencer la première nuit'
          ]
        };
      case 'night':
        return {
          title: 'Phase de Nuit',
          description: 'Les rôles spéciaux agissent dans l\'obscurité.',
          steps: [
            'Demandez aux loups-garous de choisir une victime',
            'Laissez la voyante observer un joueur',
            'Permettez à la sorcière d\'utiliser ses potions'
          ]
        };
      case 'day':
        return {
          title: 'Phase de Jour',
          description: 'Révélez les événements de la nuit et laissez les joueurs discuter.',
          steps: [
            'Annoncez qui est mort pendant la nuit',
            'Laissez les joueurs discuter et se défendre',
            'Préparez le vote d\'élimination'
          ]
        };
      case 'vote':
        return {
          title: 'Phase de Vote',
          description: 'Les joueurs votent pour éliminer un suspect.',
          steps: [
            'Ouvrez le vote pour tous les joueurs',
            'Comptez les votes',
            'Annoncez le résultat et éliminez le joueur'
          ]
        };
      case 'end':
        return {
          title: 'Fin de Partie',
          description: 'Déterminez le vainqueur et terminez la partie.',
          steps: [
            'Vérifiez les conditions de victoire',
            'Annoncez l\'équipe gagnante',
            'Permettez aux joueurs de rejouer ou de quitter'
          ]
        };
      default:
        return {
          title: 'Phase inconnue',
          description: 'Aucune instruction disponible.',
          steps: []
        };
    }
  };

  const instructions = getPhaseInstructions();

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
          className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-6 max-w-7xl w-full border border-[#ff3333]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-yellow-500 to-orange-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">👑 Panneau du Maître de Jeu</h2>
                <p className="text-gray-300">Contrôle total de la partie</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Colonne 1: Contrôles de phase */}
            <div className="space-y-6">
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">🎮 Contrôles de Phase</h3>
                
                <div className="space-y-3">
                  <button
                    onClick={() => handlePhaseChange('preparation')}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      currentPhase === 'preparation' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4" />
                      <span>Préparation</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePhaseChange('night')}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      currentPhase === 'night' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Moon className="w-4 h-4" />
                      <span>Nuit</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePhaseChange('day')}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      currentPhase === 'day' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Users className="w-4 h-4" />
                      <span>Jour</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePhaseChange('vote')}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      currentPhase === 'vote' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Vote</span>
                    </div>
                  </button>

                  <button
                    onClick={() => handlePhaseChange('end')}
                    className={`w-full p-3 rounded-lg text-left transition-all ${
                      currentPhase === 'end' 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-700 hover:bg-gray-600 text-gray-200'
                    }`}
                  >
                    <div className="flex items-center space-x-2">
                      <XCircle className="w-4 h-4" />
                      <span>Fin de Partie</span>
                    </div>
                  </button>
                </div>
              </motion.div>

              {/* Timer */}
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">⏱️ Timer de Phase</h3>
                
                <div className="text-center mb-4">
                  <div className="text-4xl font-bold text-white mb-2">
                    {Math.floor(phaseTimer / 60)}:{(phaseTimer % 60).toString().padStart(2, '0')}
                  </div>
                  <div className="text-gray-300 text-sm">
                    {isTimerRunning ? 'En cours...' : 'Arrêté'}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => startTimer(60)}
                    className="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm transition-colors"
                  >
                    1 min
                  </button>
                  <button
                    onClick={() => startTimer(300)}
                    className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors"
                  >
                    5 min
                  </button>
                  <button
                    onClick={() => startTimer(600)}
                    className="p-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
                  >
                    10 min
                  </button>
                  <button
                    onClick={() => startTimer(1800)}
                    className="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors"
                  >
                    30 min
                  </button>
                </div>

                <div className="flex space-x-2 mt-3">
                  <button
                    onClick={() => setIsTimerRunning(!isTimerRunning)}
                    className={`flex-1 p-2 rounded-lg text-sm transition-colors ${
                      isTimerRunning 
                        ? 'bg-red-600 hover:bg-red-700 text-white' 
                        : 'bg-green-600 hover:bg-green-700 text-white'
                    }`}
                  >
                    {isTimerRunning ? <Pause className="w-4 h-4 mx-auto" /> : <Play className="w-4 h-4 mx-auto" />}
                  </button>
                  <button
                    onClick={stopTimer}
                    className="flex-1 p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg text-sm transition-colors"
                  >
                    <SkipForward className="w-4 h-4 mx-auto" />
                  </button>
                </div>
              </motion.div>
            </div>

            {/* Colonne 2: Instructions et log */}
            <div className="space-y-6">
              {/* Instructions de phase */}
              <motion.div
                className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3 flex items-center space-x-2">
                  <Clock className="w-5 h-5 text-blue-400" />
                  <span>{instructions.title}</span>
                </h3>
                <p className="text-blue-200 text-sm mb-4">{instructions.description}</p>
                
                <div className="space-y-2">
                  {instructions.steps.map((step, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <div className="w-5 h-5 bg-blue-500/30 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-blue-300 text-xs font-bold">{index + 1}</span>
                      </div>
                      <span className="text-blue-100 text-sm">{step}</span>
                    </div>
                  ))}
                </div>
              </motion.div>

              {/* Log de la partie */}
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-3">📝 Log de la Partie</h3>
                <div className="bg-black/30 rounded-lg p-3 h-48 overflow-y-auto">
                  {gameLog.length === 0 ? (
                    <p className="text-gray-400 text-sm text-center">Aucun événement enregistré</p>
                  ) : (
                    <div className="space-y-1">
                      {gameLog.map((log, index) => (
                        <div key={index} className="text-gray-300 text-xs font-mono">
                          {log}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </motion.div>
            </div>

            {/* Colonne 3: Vue d'ensemble des joueurs */}
            <div className="space-y-6">
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.5, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">👥 Vue d'ensemble des Joueurs</h3>
                
                <div className="space-y-3">
                  {currentGame.players.map((player) => {
                    const teamInfo = getTeamInfo(player.role);
                    return (
                      <div
                        key={player.id}
                        className={`p-3 rounded-lg ${teamInfo.bgColor} border ${teamInfo.borderColor}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-3">
                            {getRoleIcon(player.role)}
                            <div>
                              <p className="text-white font-medium text-sm">{player.name}</p>
                              <p className={`text-xs ${teamInfo.color}`}>
                                {getRoleName(player.role)}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {player.isGameMaster && (
                              <Crown className="w-4 h-4 text-yellow-400" />
                            )}
                            <div className={`w-3 h-3 rounded-full ${
                              player.status === 'alive' ? 'bg-green-400' : 'bg-red-400'
                            }`}></div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </motion.div>

              {/* Actions spéciales */}
              <motion.div
                className="bg-[#3a3a3a] rounded-lg p-4"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-white mb-4">⚡ Actions Spéciales</h3>
                
                <div className="space-y-3">
                  <button className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors">
                    <div className="flex items-center space-x-2">
                      <Eye className="w-4 h-4" />
                      <span>Action Voyante</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm transition-colors">
                    <div className="flex items-center space-x-2">
                      <Zap className="w-4 h-4" />
                      <span>Action Sorcière</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 bg-orange-600 hover:bg-orange-700 text-white rounded-lg text-sm transition-colors">
                    <div className="flex items-center space-x-2">
                      <Target className="w-4 h-4" />
                      <span>Action Chasseur</span>
                    </div>
                  </button>
                  
                  <button className="w-full p-3 bg-pink-600 hover:bg-pink-700 text-white rounded-lg text-sm transition-colors">
                    <div className="flex items-center space-x-2">
                      <Heart className="w-4 h-4" />
                      <span>Action Petite Fille</span>
                    </div>
                  </button>
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
              Fermer le Panneau
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}; 