'use client';

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

export const JoinGameTest = () => {
  const { joinGame, isLoading, error, setError } = useGameStore();
  const [playerName, setPlayerName] = useState('TestPlayer');
  const [roomCode, setRoomCode] = useState('TEST123');

  const handleJoinGame = async () => {
    setError(null);
    try {
      await joinGame(roomCode.toUpperCase(), playerName.trim());
    } catch (error) {
      console.error("Erreur lors de la connexion:", error);
    }
  };

  return (
    <div className="p-6 bg-[#2a2a2a] rounded-lg border border-[#ff3333]/20">
      <h3 className="text-xl font-semibold text-white mb-4">🧪 Test Rejoindre une Partie</h3>
      
      <div className="space-y-4">
        <div>
          <label className="block text-[#e0e0e0] mb-2">Nom du joueur</label>
          <input
            type="text"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded text-[#e0e0e0]"
          />
        </div>
        
        <div>
          <label className="block text-[#e0e0e0] mb-2">Code de salle</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded text-[#e0e0e0]"
          />
        </div>
        
        <button
          onClick={handleJoinGame}
          disabled={isLoading}
          className="w-full bg-[#ff3333] hover:bg-[#cc2929] disabled:bg-[#666666] text-white py-2 rounded transition-colors"
        >
          {isLoading ? 'Connexion...' : 'Rejoindre la partie'}
        </button>
        
        {error && (
          <div className="bg-[#ff3333]/10 border border-[#ff3333]/30 rounded p-3 text-[#ff3333]">
            {error}
          </div>
        )}
      </div>
    </div>
  );
};

