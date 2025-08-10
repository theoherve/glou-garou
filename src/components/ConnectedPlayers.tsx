"use client";

import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';

export const ConnectedPlayers = () => {
  const { connectedPlayers, isConnected } = useRealtime();
  const { currentGame } = useGameStore();

  if (!isConnected || !currentGame) {
    return null;
  }

  const getPlayerStatus = (player: any) => {
    const gamePlayer = currentGame.players.find(p => p.id === player.user_id);
    if (!gamePlayer) return 'unknown';
    return gamePlayer.status;
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'alive':
        return 'bg-green-400';
      case 'eliminated':
        return 'bg-red-400';
      case 'unknown':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'alive':
        return 'En vie';
      case 'eliminated':
        return 'Éliminé';
      case 'unknown':
        return 'Inconnu';
      default:
        return 'Inconnu';
    }
  };

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
      <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
        <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
        Joueurs connectés ({connectedPlayers.length})
      </h3>
      
      {connectedPlayers.length === 0 ? (
        <p className="text-gray-300 text-sm">Aucun joueur connecté</p>
      ) : (
        <div className="space-y-2">
          {connectedPlayers.map((player, index) => {
            const status = getPlayerStatus(player);
            const statusColor = getStatusColor(status);
            const statusText = getStatusText(status);
            
            return (
              <div
                key={player.user_id || index}
                className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
              >
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 ${statusColor} rounded-full ${status === 'alive' ? 'animate-pulse' : ''}`}></div>
                  <span className="text-white text-sm">
                    {player.name || `Joueur ${index + 1}`}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded-full ${status === 'eliminated' ? 'bg-red-500/20 text-red-300' : 'bg-green-500/20 text-green-300'}`}>
                    {statusText}
                  </span>
                </div>
                <span className="text-xs text-gray-400">
                  {player.joined_at ? 
                    new Date(player.joined_at).toLocaleTimeString() : 
                    'Maintenant'
                  }
                </span>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs text-gray-400">
          <span>Total joueurs: {currentGame.players.length}</span>
          <span>En vie: {currentGame.players.filter(p => p.status === 'alive').length}</span>
        </div>
      </div>
    </div>
  );
};
