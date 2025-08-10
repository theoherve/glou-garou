"use client";

import { useState } from 'react';
import { useSupabaseSubscription } from '@/hooks/useSupabaseSubscription';
import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';

interface DatabaseSyncTestProps {
  roomCode: string;
}

export const DatabaseSyncTest = ({ roomCode }: DatabaseSyncTestProps) => {
  const [testAction, setTestAction] = useState('');
  const [testTarget, setTestTarget] = useState('');
  const { sendPlayerAction, sendVote, sendPhaseChange, eliminatePlayer, revealRole } = useRealtime();
  const { currentGame, currentPlayer } = useGameStore();

  // Test des subscriptions
  const { isSubscribed: isGamesSubscribed, error: gamesError } = useSupabaseSubscription({
    table: 'games',
    filter: `room_code=eq.${roomCode}`,
    onData: (payload) => {
      console.log('🔴 Games subscription test:', payload);
    },
  });

  const { isSubscribed: isPlayersSubscribed, error: playersError } = useSupabaseSubscription({
    table: 'players',
    filter: currentGame ? `game_id=eq.${currentGame.id}` : undefined,
    onData: (payload) => {
      console.log('🟢 Players subscription test:', payload);
    },
  });

  const { isSubscribed: isActionsSubscribed, error: actionsError } = useSupabaseSubscription({
    table: 'game_actions',
    filter: currentGame ? `game_id=eq.${currentGame.id}` : undefined,
    onData: (payload) => {
      console.log('🔵 Actions subscription test:', payload);
    },
  });

  const handleTestAction = async () => {
    if (!currentPlayer) return;
    
    await sendPlayerAction({
      type: testAction,
      playerId: currentPlayer.id,
      targetId: testTarget,
      data: { test: true, timestamp: Date.now() },
    });
    
    setTestAction('');
    setTestTarget('');
  };

  const handleTestVote = async () => {
    if (!currentPlayer || !testTarget) return;
    
    await sendVote(currentPlayer.id, testTarget);
    setTestTarget('');
  };

  const handleTestPhaseChange = async () => {
    const phases = ['waiting', 'preparation', 'night', 'day', 'voting', 'ended'];
    const currentIndex = phases.indexOf(currentGame?.phase || 'waiting');
    const nextPhase = phases[(currentIndex + 1) % phases.length];
    
    await sendPhaseChange(nextPhase);
  };

  const handleTestElimination = async () => {
    if (!testTarget) return;
    
    await eliminatePlayer(testTarget);
    setTestTarget('');
  };

  const handleTestRoleReveal = async () => {
    if (!testTarget) return;
    
    const roles = ['villageois', 'loup-garou', 'voyante', 'sorciere', 'chasseur'];
    const randomRole = roles[Math.floor(Math.random() * roles.length)];
    
    await revealRole(testTarget, randomRole);
    setTestTarget('');
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
      <h3 className="text-lg font-semibold text-[#e0e0e0] mb-4">
        🗄️ Test Synchronisation Base de Données
      </h3>
      
      {/* Statut des subscriptions */}
      <div className="grid grid-cols-3 gap-4 mb-4">
        <div className={`text-center p-2 rounded ${isGamesSubscribed ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
          <div className="text-xs text-gray-400">Games</div>
          <div className={`text-sm font-mono ${isGamesSubscribed ? 'text-green-400' : 'text-red-400'}`}>
            {isGamesSubscribed ? '✓' : '✗'}
          </div>
          {gamesError && <div className="text-xs text-red-400">{gamesError}</div>}
        </div>
        
        <div className={`text-center p-2 rounded ${isPlayersSubscribed ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
          <div className="text-xs text-gray-400">Players</div>
          <div className={`text-sm font-mono ${isPlayersSubscribed ? 'text-green-400' : 'text-red-400'}`}>
            {isPlayersSubscribed ? '✓' : '✗'}
          </div>
          {playersError && <div className="text-xs text-red-400">{playersError}</div>}
        </div>
        
        <div className={`text-center p-2 rounded ${isActionsSubscribed ? 'bg-green-600/20' : 'bg-red-600/20'}`}>
          <div className="text-xs text-gray-400">Actions</div>
          <div className={`text-sm font-mono ${isActionsSubscribed ? 'text-green-400' : 'text-red-400'}`}>
            {isActionsSubscribed ? '✓' : '✗'}
          </div>
          {actionsError && <div className="text-xs text-red-400">{actionsError}</div>}
        </div>
      </div>

      {/* Test des actions */}
      <div className="space-y-3">
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="Type d'action"
            value={testAction}
            onChange={(e) => setTestAction(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#ff3333]/20 rounded text-[#e0e0e0] text-sm"
          />
          <input
            type="text"
            placeholder="ID cible"
            value={testTarget}
            onChange={(e) => setTestTarget(e.target.value)}
            className="flex-1 px-3 py-2 bg-[#1a1a1a] border border-[#ff3333]/20 rounded text-[#e0e0e0] text-sm"
          />
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={handleTestAction}
            disabled={!testAction || !currentPlayer}
            className="px-3 py-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 disabled:opacity-50 text-[#e0e0e0] rounded text-sm transition-colors"
          >
            Test Action
          </button>
          
          <button
            onClick={handleTestVote}
            disabled={!testTarget || !currentPlayer}
            className="px-3 py-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 disabled:opacity-50 text-[#e0e0e0] rounded text-sm transition-colors"
          >
            Test Vote
          </button>
        </div>
        
        <div className="grid grid-cols-3 gap-2">
          <button
            onClick={handleTestPhaseChange}
            className="px-3 py-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 text-[#e0e0e0] rounded text-sm transition-colors"
          >
            Phase +1
          </button>
          
          <button
            onClick={handleTestElimination}
            disabled={!testTarget}
            className="px-3 py-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 disabled:opacity-50 text-[#e0e0e0] rounded text-sm transition-colors"
          >
            Éliminer
          </button>
          
          <button
            onClick={handleTestRoleReveal}
            disabled={!testTarget}
            className="px-3 py-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 disabled:opacity-50 text-[#e0e0e0] rounded text-sm transition-colors"
          >
            Révéler Rôle
          </button>
        </div>
      </div>

      {/* Instructions */}
      <div className="mt-4 p-3 bg-[#1a1a1a] rounded text-xs text-gray-400">
        <div className="font-semibold mb-2">Instructions :</div>
        <ul className="space-y-1">
          <li>• Vérifiez les statuts des subscriptions ci-dessus</li>
          <li>• Testez les actions et regardez la console pour les logs</li>
          <li>• Les actions sont sauvegardées en DB ET envoyées en temps réel</li>
          <li>• Utilisez l'ID d'un joueur existant pour les tests</li>
        </ul>
      </div>
    </div>
  );
};
