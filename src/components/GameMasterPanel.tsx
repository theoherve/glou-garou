"use client";

import { useState } from 'react';
import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';
import { GamePhase, Player } from '@/types/game';

interface GameMasterPanelProps {
  currentGame: any;
  currentPlayer: Player;
}

export const GameMasterPanel = ({ currentGame, currentPlayer }: GameMasterPanelProps) => {
  const { sendPhaseChange, eliminatePlayer, revealRole } = useRealtime();
  const [selectedPlayer, setSelectedPlayer] = useState<string>('');
  const [isProcessing, setIsProcessing] = useState(false);

  if (!currentPlayer.isGameMaster) {
    return null;
  }

  const phaseOrder: GamePhase[] = ['waiting', 'preparation', 'night', 'day', 'voting'];
  const currentIndex = phaseOrder.indexOf(currentGame.phase);
  const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];

  const handlePhaseChange = async () => {
    if (isProcessing) return;
    
    setIsProcessing(true);
    try {
      await sendPhaseChange(nextPhase);
      console.log(`Phase changée vers: ${nextPhase}`);
    } catch (error) {
      console.error('Erreur lors du changement de phase:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleEliminatePlayer = async () => {
    if (!selectedPlayer || isProcessing) return;
    
    setIsProcessing(true);
    try {
      await eliminatePlayer(selectedPlayer);
      console.log(`Joueur éliminé: ${selectedPlayer}`);
      setSelectedPlayer('');
    } catch (error) {
      console.error('Erreur lors de l\'élimination:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleRevealRole = async () => {
    if (!selectedPlayer || isProcessing) return;
    
    setIsProcessing(true);
    try {
      const player = currentGame.players.find((p: Player) => p.id === selectedPlayer);
      if (player) {
        await revealRole(selectedPlayer, player.role);
        console.log(`Rôle révélé pour: ${player.name}`);
        setSelectedPlayer('');
      }
    } catch (error) {
      console.error('Erreur lors de la révélation du rôle:', error);
    } finally {
      setIsProcessing(false);
    }
  };

  const alivePlayers = currentGame.players.filter((p: Player) => p.status === 'alive');

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
      <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3 flex items-center">
        <span className="mr-2">👑</span>
        Panneau du Maître de jeu
      </h3>
      
      <div className="space-y-4">
        {/* Phase actuelle et suivante */}
        <div className="bg-[#3a3a3a] rounded-lg p-3">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-[#cccccc]">Phase actuelle:</span>
            <span className="text-[#e0e0e0] font-semibold capitalize">{currentGame.phase}</span>
          </div>
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm text-[#cccccc]">Phase suivante:</span>
            <span className="text-[#e0e0e0] font-semibold capitalize">{nextPhase}</span>
          </div>
          <button
            onClick={handlePhaseChange}
            disabled={isProcessing}
            className="w-full p-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] disabled:bg-[#3a3a3a] text-[#e0e0e0] rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {isProcessing ? 'Changement...' : 'Changer de phase'}
          </button>
        </div>

        {/* Éliminer un joueur */}
        <div className="bg-[#3a3a3a] rounded-lg p-3">
          <h4 className="text-sm font-semibold text-[#e0e0e0] mb-2">Éliminer un joueur</h4>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full p-2 bg-[#2a2a2a] text-[#e0e0e0] border border-[#ff3333]/20 rounded-lg mb-2"
          >
            <option value="">Sélectionner un joueur</option>
            {alivePlayers.map((player: Player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.role})
              </option>
            ))}
          </select>
          <button
            onClick={handleEliminatePlayer}
            disabled={!selectedPlayer || isProcessing}
            className="w-full p-2 bg-red-600 hover:bg-red-700 disabled:bg-[#3a3a3a] text-white rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {isProcessing ? 'Élimination...' : 'Éliminer le joueur'}
          </button>
        </div>

        {/* Révéler un rôle */}
        <div className="bg-[#3a3a3a] rounded-lg p-3">
          <h4 className="text-sm font-semibold text-[#e0e0e0] mb-2">Révéler un rôle</h4>
          <select
            value={selectedPlayer}
            onChange={(e) => setSelectedPlayer(e.target.value)}
            className="w-full p-2 bg-[#2a2a2a] text-[#e0e0e0] border border-[#ff3333]/20 rounded-lg mb-2"
          >
            <option value="">Sélectionner un joueur</option>
            {currentGame.players.map((player: Player) => (
              <option key={player.id} value={player.id}>
                {player.name} ({player.role})
              </option>
            ))}
          </select>
          <button
            onClick={handleRevealRole}
            disabled={!selectedPlayer || isProcessing}
            className="w-full p-2 bg-blue-600 hover:bg-blue-700 disabled:bg-[#3a3a3a] text-white rounded-lg transition-colors text-sm disabled:opacity-50"
          >
            {isProcessing ? 'Révélation...' : 'Révéler le rôle'}
          </button>
        </div>

        {/* Statistiques du jeu */}
        <div className="bg-[#3a3a3a] rounded-lg p-3">
          <h4 className="text-sm font-semibold text-[#e0e0e0] mb-2">Statistiques</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex justify-between">
              <span className="text-[#cccccc]">Total:</span>
              <span className="text-[#e0e0e0]">{currentGame.players.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#cccccc]">En vie:</span>
              <span className="text-green-400">{alivePlayers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#cccccc]">Éliminés:</span>
              <span className="text-red-400">{currentGame.players.length - alivePlayers.length}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[#cccccc]">Nuit:</span>
              <span className="text-[#e0e0e0]">{currentGame.currentNight}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}; 