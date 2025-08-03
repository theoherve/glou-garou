'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Crown, 
  Play, 
  Users, 
  Eye, 
  Target, 
  Moon, 
  Sun, 
  UserX,
  Heart
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getRoleData } from '@/data/roles';
import { Player, Game } from '@/types/game';

interface GameMasterPanelProps {
  game: Game;
  currentPlayer: Player;
}

export default function GameMasterPanel({ game, currentPlayer }: GameMasterPanelProps) {
  const { nextPhase, eliminatePlayer } = useGameStore();
  const [selectedPlayer, setSelectedPlayer] = useState<string | null>(null);
  const [showRoleModal, setShowRoleModal] = useState(false);
  const [showEliminateModal, setShowEliminateModal] = useState(false);

  const alivePlayers = game.players.filter((p: Player) => p.status === 'alive');
  const deadPlayers = game.players.filter((p: Player) => p.status !== 'alive');

  const handleStartGame = async () => {
    // TODO: Implement start game logic
    console.log('Starting game...');
  };

  const handleNextPhase = async () => {
    await nextPhase();
  };

  const handleRevealRole = async (playerId: string) => {
    setSelectedPlayer(playerId);
    setShowRoleModal(true);
  };

  const handleEliminatePlayer = async (playerId: string) => {
    setSelectedPlayer(playerId);
    setShowEliminateModal(true);
  };

  const confirmEliminate = async () => {
    if (selectedPlayer) {
      await eliminatePlayer(selectedPlayer);
      setShowEliminateModal(false);
      setSelectedPlayer(null);
    }
  };

  const getPhaseActions = () => {
    switch (game.phase) {
      case 'waiting':
        return (
          <motion.button
            onClick={handleStartGame}
            className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Play className="w-5 h-5" />
            Démarrer la partie
          </motion.button>
        );
      
      case 'preparation':
        return (
          <motion.button
            onClick={handleNextPhase}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Moon className="w-5 h-5" />
            Commencer la première nuit
          </motion.button>
        );
      
      case 'night':
        return (
          <motion.button
            onClick={handleNextPhase}
            className="w-full bg-yellow-600 hover:bg-yellow-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Sun className="w-5 h-5" />
            Le village se réveille
          </motion.button>
        );
      
      case 'day':
        return (
          <motion.button
            onClick={handleNextPhase}
            className="w-full bg-red-600 hover:bg-red-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Target className="w-5 h-5" />
            Commencer le vote
          </motion.button>
        );
      
      case 'voting':
        return (
          <motion.button
            onClick={handleNextPhase}
            className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <Moon className="w-5 h-5" />
            La nuit tombe
          </motion.button>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Game Master Header */}
      <div className="bg-yellow-500/20 rounded-lg p-4 border border-yellow-500/30">
        <div className="flex items-center gap-3 mb-3">
          <Crown className="w-6 h-6 text-yellow-400" />
          <h3 className="text-lg font-semibold text-white">Maître du jeu</h3>
        </div>
        <p className="text-sm text-gray-300">
          Vous contrôlez le déroulement de la partie. Utilisez les actions ci-dessous pour gérer le jeu.
        </p>
      </div>

      {/* Phase Actions */}
      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        <h4 className="text-white font-semibold mb-3">Actions de phase</h4>
        {getPhaseActions()}
      </div>

      {/* Player Management */}
      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        <h4 className="text-white font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5" />
          Gestion des joueurs
        </h4>
        
        <div className="space-y-3">
          {game.players.map((player: Player) => (
            <div
              key={player.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                player.status === 'alive'
                  ? 'bg-white/10 border-white/20'
                  : 'bg-red-500/20 border-red-500/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-white">{player.name}</span>
                  {player.isGameMaster && <Crown className="w-4 h-4 text-yellow-400" />}
                  {player.isLover && <Heart className="w-4 h-4 text-pink-400" />}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-300">
                    {getRoleData(player.role).name}
                  </span>
                  
                  {player.status === 'alive' && (
                    <>
                      <button
                        onClick={() => handleRevealRole(player.id)}
                        className="p-1 bg-blue-600/20 hover:bg-blue-600/30 rounded transition-colors"
                        title="Révéler le rôle"
                      >
                        <Eye className="w-4 h-4 text-blue-400" />
                      </button>
                      
                      <button
                        onClick={() => handleEliminatePlayer(player.id)}
                        className="p-1 bg-red-600/20 hover:bg-red-600/30 rounded transition-colors"
                        title="Éliminer le joueur"
                      >
                        <UserX className="w-4 h-4 text-red-400" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {player.status !== 'alive' && (
                <div className="text-sm text-red-400 mt-1">
                  Éliminé
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Game Statistics */}
      <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
        <h4 className="text-white font-semibold mb-3">Statistiques</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-gray-300">Joueurs vivants:</span>
            <span className="text-white font-semibold">{alivePlayers.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Joueurs éliminés:</span>
            <span className="text-red-400 font-semibold">{deadPlayers.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Nuit actuelle:</span>
            <span className="text-white font-semibold">{game.currentNight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-gray-300">Phase:</span>
            <span className="text-white font-semibold">{game.phase}</span>
          </div>
        </div>
      </div>

      {/* Role Reveal Modal */}
      {showRoleModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Révéler le rôle</h3>
            <p className="text-gray-300 mb-4">
              Voulez-vous révéler le rôle de {game.players.find((p: Player) => p.id === selectedPlayer)?.name} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Révéler
              </button>
            </div>
          </motion.div>
        </div>
      )}

      {/* Eliminate Player Modal */}
      {showEliminateModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4"
          >
            <h3 className="text-xl font-semibold text-white mb-4">Éliminer le joueur</h3>
            <p className="text-gray-300 mb-4">
              Êtes-vous sûr de vouloir éliminer {game.players.find((p: Player) => p.id === selectedPlayer)?.name} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEliminateModal(false)}
                className="flex-1 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmEliminate}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors"
              >
                Éliminer
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
} 