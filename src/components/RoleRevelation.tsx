"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { RoleCard } from './RoleCard';
import { Crown, Users, Moon, Shield, Eye, Zap, Target, Heart, X } from 'lucide-react';
import { Role } from '@/types/game';

interface RoleRevelationProps {
  isVisible: boolean;
  onClose: () => void;
}

export const RoleRevelation = ({ isVisible, onClose }: RoleRevelationProps) => {
  const { currentGame, currentPlayer } = useGameStore();
  const [revealedRoles, setRevealedRoles] = useState<Set<string>>(new Set());
  const [showAllRoles, setShowAllRoles] = useState(false);

  // Réinitialiser l'état quand le composant devient visible
  useEffect(() => {
    if (isVisible) {
      setRevealedRoles(new Set());
      setShowAllRoles(false);
    }
  }, [isVisible]);

  if (!isVisible || !currentGame || !currentPlayer) {
    return null;
  }

  const handleRevealRole = (playerId: string) => {
    setRevealedRoles(prev => new Set([...prev, playerId]));
  };

  const handleShowAllRoles = () => {
    setShowAllRoles(true);
    // Révéler tous les rôles
    const allPlayerIds = currentGame.players.map(p => p.id);
    setRevealedRoles(new Set(allPlayerIds));
  };

  const getTeamStats = () => {
    const villageois = currentGame.players.filter(p => p.role !== 'loup-garou');
    const loups = currentGame.players.filter(p => p.role === 'loup-garou');
    
    return { villageois: villageois.length, loups: loups.length };
  };

  const teamStats = getTeamStats();

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
              <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-full flex items-center justify-center">
                <Crown className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">🎭 Révélation des Rôles</h2>
                <p className="text-gray-300">Phase de préparation - Découvrez votre rôle</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Statistiques des équipes */}
          <motion.div
            className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            {/* Total des joueurs */}
            <div className="bg-[#3a3a3a] rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-white mb-2">
                {currentGame.players.length}
              </div>
              <div className="text-gray-300 text-sm">Total des joueurs</div>
            </div>

            {/* Villageois */}
            <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">
                {teamStats.villageois}
              </div>
              <div className="text-green-300 text-sm">Villageois</div>
            </div>

            {/* Loups-garous */}
            <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-red-400 mb-2">
                {teamStats.loups}
              </div>
              <div className="text-red-300 text-sm">Loups-garous</div>
            </div>
          </motion.div>

          {/* Instructions */}
          <motion.div
            className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center space-x-3">
              <Shield className="w-5 h-5 text-blue-400" />
              <div>
                <h3 className="text-lg font-semibold text-white mb-1">Instructions</h3>
                <p className="text-blue-200 text-sm">
                  {currentPlayer.isGameMaster 
                    ? "En tant que maître de jeu, vous pouvez voir tous les rôles. Cliquez sur 'Révéler tous les rôles' pour les montrer à tous les joueurs."
                    : "Cliquez sur votre carte pour révéler votre rôle. Seul vous pouvez voir votre propre rôle pour l'instant."
                  }
                </p>
              </div>
            </div>
          </motion.div>

          {/* Bouton pour révéler tous les rôles (maître de jeu uniquement) */}
          {currentPlayer.isGameMaster && !showAllRoles && (
            <motion.div
              className="text-center mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <button
                onClick={handleShowAllRoles}
                className="px-8 py-4 bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 text-white font-bold rounded-lg transition-all duration-200 flex items-center space-x-3 mx-auto"
              >
                <Eye className="w-6 h-6" />
                <span>Révéler tous les rôles</span>
              </button>
            </motion.div>
          )}

          {/* Grille des cartes de rôle */}
          <motion.div
            className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 justify-items-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            {currentGame.players.map((player, index) => {
              const isRevealed = revealedRoles.has(player.id);
              const canReveal = currentPlayer.isGameMaster || player.id === currentPlayer.id;
              
              return (
                <motion.div
                  key={player.id}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.6 + index * 0.1, duration: 0.3 }}
                  className="flex flex-col items-center space-y-2"
                >
                  <RoleCard
                    role={player.role}
                    playerName={player.name}
                    isGameMaster={player.isGameMaster}
                    isRevealed={isRevealed}
                    onReveal={canReveal ? () => handleRevealRole(player.id) : undefined}
                  />
                  
                  {/* Statut de révélation */}
                  <div className="text-center">
                    {isRevealed ? (
                      <div className="flex items-center space-x-1 text-green-400">
                        <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                        <span className="text-xs">Révélé</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-1 text-gray-400">
                        <span className="w-2 h-2 bg-gray-400 rounded-full"></span>
                        <span className="text-xs">Caché</span>
                      </div>
                    )}
                  </div>
                </motion.div>
              );
            })}
          </motion.div>

          {/* Message de fin */}
          {showAllRoles && (
            <motion.div
              className="mt-8 text-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
            >
              <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-green-400 mb-2">
                  🎉 Tous les rôles sont révélés !
                </h3>
                <p className="text-green-200 text-sm">
                  La partie peut maintenant commencer. Chaque joueur connaît son rôle et son équipe.
                </p>
              </div>
            </motion.div>
          )}

          {/* Bouton de fermeture */}
          <motion.div
            className="text-center mt-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1, duration: 0.5 }}
          >
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#ff3333] hover:bg-[#ff3333]/80 text-white font-semibold rounded-lg transition-colors"
            >
              Fermer
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};



