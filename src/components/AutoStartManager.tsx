"use client";

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';
import { Play, Users, Crown, Shuffle } from 'lucide-react';
import { Role } from '@/types/game';

interface AutoStartManagerProps {
  roomCode: string;
}

export const AutoStartManager = ({ roomCode }: AutoStartManagerProps) => {
  const { currentGame, currentPlayer, setCurrentGame } = useGameStore();
  const { connectedPlayers, sendPhaseChange } = useRealtime();
  const [showStartButton, setShowStartButton] = useState(false);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  // Vérifier si on peut démarrer automatiquement
  const totalPlayers = currentGame?.players?.length || 0;
  const connectedCount = connectedPlayers?.length || 0;
  const minPlayersToStart = 4;
  const canAutoStart = connectedCount >= minPlayersToStart && connectedCount === totalPlayers;

  const handleAutoStart = useCallback(async () => {
    if (isProcessing || !currentGame) return;
    
    setIsProcessing(true);
    setCountdown(null);
    
    try {
      console.log('🚀 Démarrage automatique de la partie...');
      
      // 1. Attribuer les rôles
      const updatedGame = await assignRolesToPlayers();
      
      // 2. Changer la phase vers 'preparation'
      await sendPhaseChange('preparation');
      
      // 3. Mettre à jour le store local
      setCurrentGame(updatedGame);
      
      console.log('✅ Partie démarrée automatiquement avec succès !');
      
    } catch (error) {
      console.error('❌ Erreur lors du démarrage automatique:', error);
    } finally {
      setIsProcessing(false);
    }
  }, [isProcessing, currentGame, sendPhaseChange, setCurrentGame]);

  // Déplacer tous les hooks au début, avant les conditions
  useEffect(() => {
    if (canAutoStart && currentPlayer?.isGameMaster) {
      setShowStartButton(true);
    } else {
      setShowStartButton(false);
    }
  }, [canAutoStart, currentPlayer?.isGameMaster]);

  // Gérer le compte à rebours automatique
  useEffect(() => {
    if (showStartButton && !isProcessing) {
      const timer = setTimeout(() => {
        setCountdown(10); // 10 secondes de compte à rebours
      }, 2000); // Attendre 2 secondes avant de commencer le compte à rebours

      return () => clearTimeout(timer);
    }
  }, [showStartButton, isProcessing]);

  // Gérer le compte à rebours
  useEffect(() => {
    if (countdown !== null && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);

      return () => clearTimeout(timer);
    } else if (countdown === 0) {
      // Démarrage automatique
      handleAutoStart();
    }
  }, [countdown, handleAutoStart]);

  if (!currentGame || !currentPlayer || currentGame.phase !== 'waiting') {
    return null;
  }

  const assignRolesToPlayers = async (): Promise<any> => {
    console.log('🎭 Attribution des rôles aux joueurs...');
    
    // Récupérer les rôles configurés dans le jeu
    const gameSettings = currentGame?.gameSettings;
    const roleDistribution: Record<string, number> = {
      'loup-garou': 2,
      'villageois': 6,
      'voyante': 1,
      'sorciere': 1,
      'chasseur': 1,
      'petite-fille': 1
    };

    // Créer la liste complète des rôles
    const allRoles: Role[] = [];
    Object.entries(roleDistribution).forEach(([role, count]) => {
      for (let i = 0; i < (count as number); i++) {
        allRoles.push(role as Role);
      }
    });

    // Mélanger les rôles
    const shuffledRoles = shuffleArray([...allRoles]);
    
    // Attribuer les rôles aux joueurs
    const updatedPlayers = currentGame.players.map((player, index) => ({
      ...player,
      role: shuffledRoles[index] || 'villageois'
    }));

    // Mettre à jour la base de données
    const response = await fetch(`/api/games/${roomCode}/players`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        players: updatedPlayers
      }),
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour des rôles');
    }

    // Retourner le jeu mis à jour
    return {
      ...currentGame,
      players: updatedPlayers,
      phase: 'preparation'
    };
  };

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const handleManualStart = () => {
    setCountdown(null);
    handleAutoStart();
  };

  const handleCancelAutoStart = () => {
    setCountdown(null);
    setShowStartButton(false);
  };

  if (!showStartButton) {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.div
        className="bg-gradient-to-r from-green-500/20 to-blue-500/20 backdrop-blur-sm rounded-lg p-6 border border-green-400/30 mb-6"
        initial={{ opacity: 0, y: -20, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -20, scale: 0.95 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center">
          {/* Icône et titre */}
          <div className="flex items-center justify-center space-x-3 mb-4">
            <div className="p-3 bg-green-500/20 rounded-full">
              <Play className="w-8 h-8 text-green-400" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-white">Prêt à commencer !</h3>
              <p className="text-green-300 text-sm">Tous les joueurs sont connectés</p>
            </div>
          </div>

          {/* Statistiques */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-white">{connectedCount}</div>
              <div className="text-xs text-gray-300">Joueurs</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-400">✓</div>
              <div className="text-xs text-gray-300">Prêt</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-400">
                {countdown !== null ? countdown : '∞'}
              </div>
              <div className="text-xs text-gray-300">Secondes</div>
            </div>
          </div>

          {/* Boutons d'action */}
          <div className="flex items-center justify-center space-x-3">
            {countdown !== null ? (
              <>
                <button
                  onClick={handleManualStart}
                  disabled={isProcessing}
                  className="px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-semibold rounded-lg transition-all duration-200 flex items-center space-x-2"
                >
                  <Play className="w-5 h-5" />
                  <span>Démarrer maintenant</span>
                </button>
                <button
                  onClick={handleCancelAutoStart}
                  disabled={isProcessing}
                  className="px-4 py-3 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-600/50 text-white font-medium rounded-lg transition-all duration-200"
                >
                  Annuler
                </button>
              </>
            ) : (
              <button
                onClick={handleManualStart}
                disabled={isProcessing}
                className="px-8 py-4 bg-green-600 hover:bg-green-700 disabled:bg-green-600/50 text-white font-bold rounded-lg transition-all duration-200 flex items-center space-x-3 text-lg"
              >
                <Shuffle className="w-6 h-6" />
                <span>Démarrer la partie</span>
              </button>
            )}
          </div>

          {/* Message d'information */}
          <div className="mt-4 p-3 bg-blue-500/10 border border-blue-500/20 rounded-lg">
            <p className="text-blue-300 text-sm">
              <Crown className="w-4 h-4 inline mr-2" />
              Les rôles seront attribués automatiquement et la partie passera en phase de préparation
            </p>
          </div>

          {/* Indicateur de traitement */}
          {isProcessing && (
            <motion.div
              className="mt-4 flex items-center justify-center space-x-2 text-green-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <div className="w-4 h-4 border-2 border-green-400 border-t-transparent rounded-full animate-spin"></div>
              <span>Démarrage en cours...</span>
            </motion.div>
          )}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

