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
            className="w-full bg-[#ff3333] hover:bg-[#e62e2e] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
            className="w-full bg-[#333a45] hover:bg-[#2a3038] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
            className="w-full bg-[#ff9933] hover:bg-[#e68a2e] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
            className="w-full bg-[#ff3333] hover:bg-[#e62e2e] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
            className="w-full bg-[#333a45] hover:bg-[#2a3038] text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 transition-colors"
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
      <div className="bg-[#ff9933]/20 rounded-lg p-4 border border-[#ff9933]/30">
        <div className="flex items-center gap-3 mb-3">
          <Crown className="w-6 h-6 text-[#ff9933]" />
          <h3 className="text-lg font-semibold text-[#e0e0e0]">Maître du jeu</h3>
        </div>
        <p className="text-sm text-[#cccccc]">
          Vous contrôlez le déroulement de la partie. Utilisez les actions ci-dessous pour gérer le jeu.
        </p>
      </div>

      {/* Phase Actions */}
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <h4 className="text-[#e0e0e0] font-semibold mb-3">Actions de phase</h4>
        {getPhaseActions()}
      </div>

      {/* Player Management */}
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <h4 className="text-[#e0e0e0] font-semibold mb-3 flex items-center gap-2">
          <Users className="w-5 h-5 text-[#ff9933]" />
          Gestion des joueurs
        </h4>
        
        <div className="space-y-3">
          {game.players.map((player: Player) => (
            <div
              key={player.id}
              className={`p-3 rounded-lg border transition-all duration-200 ${
                player.status === 'alive'
                  ? 'bg-[#1a1a1a] border-[#333333]'
                  : 'bg-[#ff3333]/20 border-[#ff3333]/40 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-[#e0e0e0]">{player.name}</span>
                  {player.isGameMaster && <Crown className="w-4 h-4 text-[#ff9933]" />}
                  {player.isLover && <Heart className="w-4 h-4 text-pink-400" />}
                </div>
                
                <div className="flex items-center gap-2">
                  <span className="text-sm text-[#cccccc]">
                    {getRoleData(player.role).name}
                  </span>
                  
                  {player.status === 'alive' && (
                    <>
                      <button
                        onClick={() => handleRevealRole(player.id)}
                        className="p-1 bg-[#333a45]/20 hover:bg-[#333a45]/30 rounded transition-colors"
                        title="Révéler le rôle"
                      >
                        <Eye className="w-4 h-4 text-[#ff9933]" />
                      </button>
                      
                      <button
                        onClick={() => handleEliminatePlayer(player.id)}
                        className="p-1 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 rounded transition-colors"
                        title="Éliminer le joueur"
                      >
                        <UserX className="w-4 h-4 text-[#ff3333]" />
                      </button>
                    </>
                  )}
                </div>
              </div>
              
              {player.status !== 'alive' && (
                <div className="text-sm text-[#ff3333] mt-1">
                  Éliminé
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Game Statistics */}
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <h4 className="text-[#e0e0e0] font-semibold mb-3">Statistiques</h4>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex justify-between">
            <span className="text-[#cccccc]">Joueurs vivants:</span>
            <span className="text-[#e0e0e0] font-semibold">{alivePlayers.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#cccccc]">Joueurs éliminés:</span>
            <span className="text-[#ff3333] font-semibold">{deadPlayers.length}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#cccccc]">Nuit actuelle:</span>
            <span className="text-[#e0e0e0] font-semibold">{game.currentNight}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#cccccc]">Phase:</span>
            <span className="text-[#e0e0e0] font-semibold">{game.phase}</span>
          </div>
        </div>
      </div>

      {/* Role Reveal Modal */}
      {showRoleModal && selectedPlayer && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-[#2a2a2a] rounded-lg p-6 max-w-md w-full mx-4 border border-[#ff3333]/20"
          >
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-4">Révéler le rôle</h3>
            <p className="text-[#cccccc] mb-4">
              Voulez-vous révéler le rôle de {game.players.find((p: Player) => p.id === selectedPlayer)?.name} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 bg-[#333333] hover:bg-[#444444] text-[#e0e0e0] rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={() => setShowRoleModal(false)}
                className="flex-1 px-4 py-2 bg-[#333a45] hover:bg-[#2a3038] text-white rounded-lg transition-colors"
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
            className="bg-[#2a2a2a] rounded-lg p-6 max-w-md w-full mx-4 border border-[#ff3333]/20"
          >
            <h3 className="text-xl font-semibold text-[#e0e0e0] mb-4">Éliminer le joueur</h3>
            <p className="text-[#cccccc] mb-4">
              Êtes-vous sûr de vouloir éliminer {game.players.find((p: Player) => p.id === selectedPlayer)?.name} ?
            </p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowEliminateModal(false)}
                className="flex-1 px-4 py-2 bg-[#333333] hover:bg-[#444444] text-[#e0e0e0] rounded-lg transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={confirmEliminate}
                className="flex-1 px-4 py-2 bg-[#ff3333] hover:bg-[#e62e2e] text-white rounded-lg transition-colors"
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