"use client";

import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';
import { GamePhase, Player } from '@/types/game';

interface GameActionsProps {
  currentPhase: GamePhase;
  currentPlayer: Player;
  alivePlayers: Player[];
}

export const GameActions = ({ currentPhase, currentPlayer, alivePlayers }: GameActionsProps) => {
  const { sendVote, sendPlayerAction, sendPhaseChange } = useRealtime();
  const { currentGame, setCurrentGame } = useGameStore();

  const handleVote = async (targetId: string) => {
    try {
      await sendVote(currentPlayer.id, targetId);
      console.log(`Vote envoyé pour ${targetId}`);
    } catch (error) {
      console.error('Erreur lors de l\'envoi du vote:', error);
    }
  };

  const handleUseAbility = async (targetId?: string) => {
    try {
      await sendPlayerAction({
        type: 'useAbility',
        playerId: currentPlayer.id,
        targetId,
        timestamp: new Date().toISOString(),
      });
      console.log('Capacité utilisée');
    } catch (error) {
      console.error('Erreur lors de l\'utilisation de la capacité:', error);
    }
  };

  const handleNextPhase = async () => {
    if (!currentGame) return;
    
    try {
      const phaseOrder: GamePhase[] = ['waiting', 'preparation', 'night', 'day', 'voting'];
      const currentIndex = phaseOrder.indexOf(currentGame.phase);
      const nextPhase = phaseOrder[(currentIndex + 1) % phaseOrder.length];
      
      await sendPhaseChange(nextPhase);
      console.log(`Phase changée vers: ${nextPhase}`);
    } catch (error) {
      console.error('Erreur lors du changement de phase:', error);
    }
  };

  if (currentPhase === 'voting') {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Voter</h3>
        <p className="text-sm text-[#cccccc] mb-3">
          Choisissez un joueur à éliminer
        </p>
        <div className="space-y-2">
          {alivePlayers
            .filter(p => p.id !== currentPlayer.id)
            .map(player => (
              <button
                key={player.id}
                onClick={() => handleVote(player.id)}
                className="w-full p-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 text-[#e0e0e0] rounded-lg transition-colors text-sm"
              >
                Voter pour {player.name}
              </button>
            ))}
        </div>
      </div>
    );
  }

  if (currentPhase === 'night' && currentPlayer.role === 'loup-garou') {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Action de nuit</h3>
        <p className="text-sm text-[#cccccc] mb-3">
          Choisissez une victime
        </p>
        <div className="space-y-2">
          {alivePlayers
            .filter(p => p.role !== 'loup-garou')
            .map(player => (
              <button
                key={player.id}
                onClick={() => handleUseAbility(player.id)}
                className="w-full p-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 text-[#e0e0e0] rounded-lg transition-colors text-sm"
              >
                Attaquer {player.name}
              </button>
            ))}
        </div>
      </div>
    );
  }

  if (currentPlayer.isGameMaster) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Actions du Maître de jeu</h3>
        <div className="space-y-2">
          <button
            onClick={handleNextPhase}
            className="w-full p-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded-lg transition-colors text-sm"
          >
            Phase suivante
          </button>
        </div>
      </div>
    );
  }

  return null;
};
