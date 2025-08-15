"use client";

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Crown, Users, Moon, Sun, Target, CheckCircle } from 'lucide-react';
import { GamePhase } from '@/types/game';

interface GameStartNotificationProps {
  isVisible: boolean;
  onClose: () => void;
}

export const GameStartNotification = ({ isVisible, onClose }: GameStartNotificationProps) => {
  const { currentGame, currentPlayer } = useGameStore();
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    if (isVisible) {
      // Afficher les détails après 2 secondes
      const timer = setTimeout(() => {
        setShowDetails(true);
      }, 2000);

      // Fermer automatiquement après 8 secondes
      const autoCloseTimer = setTimeout(() => {
        onClose();
      }, 8000);

      return () => {
        clearTimeout(timer);
        clearTimeout(autoCloseTimer);
      };
    }
  }, [isVisible, onClose]);

  if (!isVisible || !currentGame || !currentPlayer) {
    return null;
  }

  const getPhaseIcon = (phase: GamePhase) => {
    switch (phase) {
      case 'preparation':
        return <Crown className="w-6 h-6 text-yellow-400" />;
      case 'night':
        return <Moon className="w-6 h-6 text-blue-400" />;
      case 'day':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      case 'voting':
        return <Target className="w-6 h-6 text-red-400" />;
      default:
        return <Users className="w-6 h-6 text-gray-400" />;
    }
  };

  const getPhaseText = (phase: GamePhase) => {
    switch (phase) {
      case 'preparation':
        return 'Phase de Préparation';
      case 'night':
        return 'Phase de Nuit';
      case 'day':
        return 'Phase de Jour';
      case 'voting':
        return 'Phase de Vote';
      default:
        return 'Phase inconnue';
    }
  };

  const getRoleTeam = (role: string) => {
    if (role === 'loup-garou') return 'loup-garou';
    if (role === 'villageois' || role === 'voyante' || role === 'sorciere' || role === 'chasseur' || role === 'petite-fille') return 'villageois';
    return 'neutre';
  };

  const getRoleColor = (role: string) => {
    const team = getRoleTeam(role);
    switch (team) {
      case 'loup-garou':
        return 'text-red-400 border-red-400/30 bg-red-400/10';
      case 'villageois':
        return 'text-green-400 border-green-400/30 bg-green-400/10';
      default:
        return 'text-gray-400 border-gray-400/30 bg-gray-400/10';
    }
  };

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
          className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-8 max-w-2xl w-full border border-[#ff3333]/30 shadow-2xl"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header avec animation */}
          <motion.div
            className="text-center mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-500 rounded-full mx-auto mb-4 flex items-center justify-center">
              <CheckCircle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-white mb-2">🎉 La Partie Commence !</h2>
            <p className="text-gray-300 text-lg">Les rôles ont été attribués</p>
          </motion.div>

          {/* Phase actuelle */}
          <motion.div
            className="bg-[#3a3a3a] rounded-lg p-4 mb-6 text-center"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <div className="flex items-center justify-center space-x-3 mb-2">
              {getPhaseIcon(currentGame.phase)}
              <span className="text-xl font-semibold text-white">
                {getPhaseText(currentGame.phase)}
              </span>
            </div>
            <p className="text-gray-300 text-sm">
              La partie est maintenant en phase de préparation
            </p>
          </motion.div>

          {/* Détails des rôles (affichés progressivement) */}
          <AnimatePresence>
            {showDetails && (
              <motion.div
                className="space-y-4"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.5 }}
              >
                <h3 className="text-xl font-semibold text-white text-center mb-4">
                  📊 Distribution des Rôles
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {currentGame.players.map((player, index) => (
                    <motion.div
                      key={player.id}
                      className={`p-3 rounded-lg border ${getRoleColor(player.role)}`}
                      initial={{ opacity: 0, x: index % 2 === 0 ? -20 : 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-medium">{player.name}</span>
                        <span className="text-sm capitalize">
                          {player.role === 'loup-garou' ? '🐺' : '🏠'} {player.role}
                        </span>
                      </div>
                      {player.isGameMaster && (
                        <div className="flex items-center justify-center mt-1">
                          <Crown className="w-4 h-4 text-yellow-400 mr-1" />
                          <span className="text-xs text-yellow-400">Maître de jeu</span>
                        </div>
                      )}
                    </motion.div>
                  ))}
                </div>

                {/* Statistiques des équipes */}
                <motion.div
                  className="bg-[#3a3a3a] rounded-lg p-4 mt-4"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.5 }}
                >
                  <h4 className="text-lg font-semibold text-white mb-3 text-center">
                    ⚖️ Équilibre des Équipes
                  </h4>
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-green-400">
                        {currentGame.players.filter(p => getRoleTeam(p.role) === 'villageois').length}
                      </div>
                      <div className="text-sm text-gray-300">Villageois</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-red-400">
                        {currentGame.players.filter(p => getRoleTeam(p.role) === 'loup-garou').length}
                      </div>
                      <div className="text-sm text-gray-300">Loups-garous</div>
                    </div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Bouton de fermeture */}
          <motion.div
            className="text-center mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#ff3333] hover:bg-[#ff3333]/80 text-white font-semibold rounded-lg transition-colors"
            >
              Compris !
            </button>
          </motion.div>

          {/* Indicateur de fermeture automatique */}
          <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.5 }}
          >
            <p className="text-xs text-gray-400">
              Fermeture automatique dans quelques secondes...
            </p>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

