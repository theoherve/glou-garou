"use client";

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useRealtime } from './RealtimeProvider';

interface DebugPanelProps {
  roomCode: string;
}

export const DebugPanel = ({ roomCode }: DebugPanelProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const { currentGame, currentPlayer, isLoading, error } = useGameStore();
  const { isConnected, isConnecting, connectedPlayers } = useRealtime();

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  if (!isExpanded) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <button
          onClick={toggleExpanded}
          className="text-lg font-semibold text-[#e0e0e0] hover:text-[#ff3333] transition-colors"
        >
          🔍 Panel de Débogage
        </button>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-[#e0e0e0]">🔍 Panel de Débogage</h3>
        <button
          onClick={toggleExpanded}
          className="text-[#ff3333] hover:text-[#ff6666] transition-colors"
        >
          ✕
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* État du Store */}
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <h4 className="text-sm font-medium text-[#cccccc] mb-2">📊 État du Store</h4>
          <div className="space-y-1 text-xs text-[#cccccc]">
            <p><span className="text-[#ff3333]">Loading:</span> {isLoading ? 'Oui' : 'Non'}</p>
            <p><span className="text-[#ff3333]">Error:</span> {error || 'Aucune'}</p>
            <p><span className="text-[#ff3333]">Current Game:</span> {currentGame ? 'Oui' : 'Non'}</p>
            <p><span className="text-[#ff3333]">Current Player:</span> {currentPlayer ? 'Oui' : 'Non'}</p>
          </div>
        </div>

        {/* Connexion Realtime */}
        <div className="bg-[#1a1a1a] rounded-lg p-3">
          <h4 className="text-sm font-medium text-[#cccccc] mb-2">🔌 Connexion Realtime</h4>
          <div className="space-y-1 text-xs text-[#cccccc]">
            <p><span className="text-[#ff3333]">Status:</span> {isConnected ? 'Connecté' : 'Déconnecté'}</p>
            <p><span className="text-[#ff3333]">Connecting:</span> {isConnecting ? 'Oui' : 'Non'}</p>
            <p><span className="text-[#ff3333]">Joueurs connectés:</span> {connectedPlayers.length}</p>
          </div>
        </div>

        {/* Informations du Jeu */}
        {currentGame && (
          <div className="bg-[#1a1a1a] rounded-lg p-3 lg:col-span-2">
            <h4 className="text-sm font-medium text-[#cccccc] mb-2">🎮 Informations du Jeu</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-[#cccccc]">
              <p><span className="text-[#ff3333]">Room Code:</span> {currentGame.roomCode}</p>
              <p><span className="text-[#ff3333]">Phase:</span> {currentGame.phase}</p>
              <p><span className="text-[#ff3333]">Nuit:</span> {currentGame.currentNight}</p>
              <p><span className="text-[#ff3333]">Joueurs:</span> {currentGame.players?.length || 0}</p>
              <p><span className="text-[#ff3333]">Créé:</span> {currentGame.createdAt ? new Date(currentGame.createdAt).toLocaleString() : 'N/A'}</p>
              <p><span className="text-[#ff3333]">Modifié:</span> {currentGame.updatedAt ? new Date(currentGame.updatedAt).toLocaleString() : 'N/A'}</p>

            </div>
          </div>
        )}

        {/* Informations du Joueur */}
        {currentPlayer && (
          <div className="bg-[#1a1a1a] rounded-lg p-3 lg:col-span-2">
            <h4 className="text-sm font-medium text-[#cccccc] mb-2">👤 Informations du Joueur</h4>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 text-xs text-[#cccccc]">
              <p><span className="text-[#ff3333]">ID:</span> {currentPlayer.id}</p>
              <p><span className="text-[#ff3333]">Nom:</span> {currentPlayer.name}</p>
              <p><span className="text-[#ff3333]">Rôle:</span> {currentPlayer.role}</p>
              <p><span className="text-[#ff3333]">Status:</span> {currentPlayer.status}</p>
              <p><span className="text-[#ff3333]">Game Master:</span> {currentPlayer.isGameMaster ? 'Oui' : 'Non'}</p>
              <p><span className="text-[#ff3333]">Vote Target:</span> {currentPlayer.voteTarget || 'Aucun'}</p>
              <p><span className="text-[#ff3333]">Ability Used:</span> {currentPlayer.hasUsedAbility ? 'Oui' : 'Non'}</p>
            </div>
          </div>
        )}

        {/* Joueurs Connectés */}
        {connectedPlayers.length > 0 && (
          <div className="bg-[#1a1a1a] rounded-lg p-3 lg:col-span-2">
            <h4 className="text-sm font-medium text-[#cccccc] mb-2">👥 Joueurs Connectés</h4>
            <div className="space-y-1">
              {connectedPlayers.map((player, index) => (
                <div key={index} className="text-xs text-[#cccccc] flex justify-between">
                  <span>{player.user_id}</span>
                  <span className="text-[#666666]">{player.room_code}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Informations de la Base de Données */}
        <div className="bg-[#1a1a1a] rounded-lg p-3 lg:col-span-2">
          <h4 className="text-sm font-medium text-[#cccccc] mb-2">🗄️ Informations de la Base de Données</h4>
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-2 text-xs text-[#cccccc]">
            <p><span className="text-[#ff3333]">Room Code:</span> {roomCode}</p>
            <p><span className="text-[#ff3333]">Game ID:</span> {currentGame?.id || 'N/A'}</p>
            <p><span className="text-[#ff3333]">Player ID:</span> {currentPlayer?.id || 'N/A'}</p>
            <p><span className="text-[#ff3333]">Tables:</span> games, players, game_actions</p>
            <p><span className="text-[#ff3333]">Realtime:</span> Activé</p>
            <p><span className="text-[#ff3333]">Sync:</span> DatabaseSync + Realtime</p>
          </div>
        </div>
      </div>

      {/* Actions de Débogage */}
      <div className="mt-4 pt-4 border-t border-[#444444]">
        <h4 className="text-sm font-medium text-[#cccccc] mb-2">⚙️ Actions de Débogage</h4>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={() => console.log('Game Store:', { currentGame, currentPlayer, isLoading, error })}
            className="px-3 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded text-xs transition-colors"
          >
            Log Store
          </button>
          <button
            onClick={() => console.log('Realtime Status:', { isConnected, isConnecting, connectedPlayers })}
            className="px-3 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded text-xs transition-colors"
          >
            Log Realtime
          </button>
          <button
            onClick={() => console.log('Room Code:', roomCode)}
            className="px-3 py-1 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded text-xs transition-colors"
          >
            Log Room
          </button>
        </div>
      </div>
    </div>
  );
};
