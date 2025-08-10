"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRealtime } from './RealtimeProvider';

interface GameAction {
  id: string;
  action_type: string;
  player_id: string;
  target_id?: string;
  action_data?: any;
  created_at: string;
}

interface GameHistoryProps {
  roomCode: string;
}

export const GameHistory = ({ roomCode }: GameHistoryProps) => {
  const [actions, setActions] = useState<GameAction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { isConnected } = useRealtime();

  const fetchActions = useCallback(async () => {
    if (!roomCode) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/games/${roomCode}/actions`);
      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des actions');
      }
      
      const data = await response.json();
      setActions(data.actions || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue');
      console.error('Error fetching actions:', err);
    } finally {
      setIsLoading(false);
    }
  }, [roomCode]);

  useEffect(() => {
    if (isConnected) {
      fetchActions();
    }
  }, [roomCode, isConnected, fetchActions]);

  const getActionDescription = (action: GameAction) => {
    switch (action.action_type) {
      case 'vote':
        return `a voté pour ${action.target_id ? `joueur ${action.target_id}` : 'personne'}`;
      case 'ability_use':
        return 'a utilisé sa capacité';
      case 'phase_change':
        return `a changé la phase vers ${action.action_data?.phase || 'inconnue'}`;
      case 'player_elimination':
        return `a éliminé le joueur ${action.target_id || 'inconnu'}`;
      case 'role_reveal':
        return `a révélé le rôle ${action.action_data?.role || 'inconnu'} du joueur ${action.target_id || 'inconnu'}`;
      default:
        return `a effectué l'action ${action.action_type}`;
    }
  };

  const getActionIcon = (actionType: string) => {
    switch (actionType) {
      case 'vote':
        return '🗳️';
      case 'ability_use':
        return '⚡';
      case 'phase_change':
        return '🔄';
      case 'player_elimination':
        return '💀';
      case 'role_reveal':
        return '👁️';
      default:
        return '❓';
    }
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  if (!isConnected) {
    return null;
  }

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-[#e0e0e0]">
          📜 Historique des Actions
        </h3>
        <button
          onClick={fetchActions}
          disabled={isLoading}
          className="px-3 py-1 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 disabled:opacity-50 text-[#e0e0e0] rounded text-sm transition-colors"
        >
          {isLoading ? '🔄' : '🔄'}
        </button>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-600/20 border border-red-600/30 rounded text-red-400 text-sm">
          Erreur: {error}
        </div>
      )}

      {isLoading ? (
        <div className="text-center py-8">
          <div className="w-8 h-8 border-2 border-[#ff3333]/30 border-t-[#ff3333] rounded-full animate-spin mx-auto mb-2"></div>
          <p className="text-[#cccccc] text-sm">Chargement...</p>
        </div>
      ) : actions.length === 0 ? (
        <div className="text-center py-8 text-[#cccccc] text-sm">
          Aucune action enregistrée
        </div>
      ) : (
        <div className="space-y-3 max-h-64 overflow-y-auto">
          {actions.map((action) => (
            <div
              key={action.id}
              className="flex items-start gap-3 p-3 bg-[#1a1a1a] rounded border border-[#ff3333]/10"
            >
              <div className="text-2xl">{getActionIcon(action.action_type)}</div>
              
              <div className="flex-1 min-w-0">
                <div className="text-[#e0e0e0] text-sm">
                  <span className="font-mono text-[#ff3333]">
                    {action.player_id === 'system' ? 'Système' : `Joueur ${action.player_id}`}
                  </span>
                  {' '}
                  <span className="text-[#cccccc]">
                    {getActionDescription(action)}
                  </span>
                </div>
                
                {action.action_data && (
                  <div className="mt-1 text-xs text-gray-400">
                    <code className="bg-[#2a2a2a] px-2 py-1 rounded">
                      {JSON.stringify(action.action_data)}
                    </code>
                  </div>
                )}
              </div>
              
              <div className="text-xs text-gray-500 whitespace-nowrap">
                {formatTimestamp(action.created_at)}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="text-xs text-gray-400 text-center">
          Total: {actions.length} actions
        </div>
      </div>
    </div>
  );
};
