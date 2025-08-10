"use client";

import { useEffect } from 'react';
import { useSupabaseSubscription } from '@/hooks/useSupabaseSubscription';
import { useGameStore } from '@/store/gameStore';
import { useRealtime } from './RealtimeProvider';

interface DatabaseSyncProps {
  roomCode: string;
}

export const DatabaseSync = ({ roomCode }: DatabaseSyncProps) => {
  const { currentGame, setCurrentGame, currentPlayer, setCurrentPlayer } = useGameStore();
  const { isConnected } = useRealtime();

  // Écouter les changements de la table games
  const { isSubscribed: isGamesSubscribed, error: gamesError, subscribe: subscribeGames, unsubscribe: unsubscribeGames } = useSupabaseSubscription({
    table: 'games',
    filter: `room_code=eq.${roomCode}`,
    onData: (payload) => {
      console.log('Game update received:', payload);
      if ((payload.eventType === 'UPDATE' || payload.type === 'UPDATE') && payload.new) {
        setCurrentGame(payload.new);
      }
    },
    onError: (error) => {
      console.error('Games subscription error:', error);
    },
  });

  // Écouter les changements de la table players
  const { isSubscribed: isPlayersSubscribed, error: playersError, subscribe: subscribePlayers, unsubscribe: unsubscribePlayers } = useSupabaseSubscription({
    table: 'players',
    filter: currentGame ? `game_id=eq.${currentGame.id}` : undefined,
    onData: (payload) => {
      console.log('Player update received:', payload);
      if ((payload.eventType === 'UPDATE' || payload.type === 'UPDATE') && payload.new) {
        // Mettre à jour le joueur actuel si c'est lui qui a changé
        if (currentPlayer && payload.new.id === currentPlayer.id) {
          setCurrentPlayer(payload.new);
        }
        
        // Mettre à jour la liste des joueurs dans le jeu
        if (currentGame) {
          setCurrentGame({
            ...currentGame,
            players: currentGame.players.map(p => 
              p.id === payload.new.id ? payload.new : p
            ),
          });
        }
      } else if ((payload.eventType === 'INSERT' || payload.type === 'INSERT') && payload.new) {
        // Ajouter un nouveau joueur
        if (currentGame) {
          setCurrentGame({
            ...currentGame,
            players: [...currentGame.players, payload.new],
          });
        }
      } else if ((payload.eventType === 'DELETE' || payload.type === 'DELETE') && payload.old) {
        // Supprimer un joueur
        if (currentGame) {
          setCurrentGame({
            ...currentGame,
            players: currentGame.players.filter(p => p.id !== payload.old.id),
          });
        }
      }
    },
    onError: (error) => {
      console.error('Players subscription error:', error);
    },
  });

  // Écouter les changements de la table game_actions
  const { isSubscribed: isActionsSubscribed, error: actionsError, subscribe: subscribeActions, unsubscribe: unsubscribeActions } = useSupabaseSubscription({
    table: 'game_actions',
    filter: currentGame ? `game_id=eq.${currentGame.id}` : undefined,
    onData: (payload) => {
      console.log('Game action received:', payload);
      if ((payload.eventType === 'INSERT' || payload.type === 'INSERT') && payload.new) {
        // Traiter les nouvelles actions de jeu
        const action = payload.new;
        
        switch (action.action_type) {
          case 'game_start':
            // Démarrer le jeu
            if (currentGame && action.action_data?.phase) {
              setCurrentGame({
                ...currentGame,
                phase: action.action_data.phase,
                updatedAt: new Date(),
              });
            }
            break;
          case 'vote':
            // Mettre à jour le vote du joueur
            if (currentGame) {
              setCurrentGame({
                ...currentGame,
                players: currentGame.players.map(p => 
                  p.id === action.player_id 
                    ? { ...p, voteTarget: action.target_id }
                    : p
                ),
              });
            }
            break;
          case 'ability_use':
            // Marquer l'utilisation d'une capacité
            if (currentGame) {
              setCurrentGame({
                ...currentGame,
                players: currentGame.players.map(p => 
                  p.id === action.player_id 
                    ? { ...p, hasUsedAbility: true }
                    : p
                ),
              });
            }
            break;
          case 'phase_change':
            // Changer la phase du jeu
            if (currentGame && action.action_data?.phase) {
              setCurrentGame({
                ...currentGame,
                phase: action.action_data.phase,
                currentNight: action.action_data.current_night || currentGame.currentNight,
              });
            }
            break;
          case 'player_elimination':
            // Éliminer un joueur
            if (currentGame && action.target_id) {
              setCurrentGame({
                ...currentGame,
                players: currentGame.players.map(p => 
                  p.id === action.target_id 
                    ? { ...p, status: 'eliminated' }
                    : p
                ),
              });
            }
            break;
          case 'role_reveal':
            // Révéler le rôle d'un joueur
            if (currentGame && action.target_id) {
              setCurrentGame({
                ...currentGame,
                players: currentGame.players.map(p => 
                  p.id === action.target_id 
                    ? { ...p, role: action.action_data?.role || p.role }
                    : p
                ),
              });
            }
            break;
        }
      }
    },
    onError: (error) => {
      console.error('Game actions subscription error:', error);
    },
  });

  // S'abonner aux tables quand le composant est monté
  useEffect(() => {
    if (roomCode) {
      subscribeGames();
    }
    return () => {
      unsubscribeGames();
    };
  }, [roomCode, subscribeGames, unsubscribeGames]);

  useEffect(() => {
    if (currentGame?.id) {
      subscribePlayers();
      subscribeActions();
    }
    return () => {
      unsubscribePlayers();
      unsubscribeActions();
    };
  }, [currentGame?.id, subscribePlayers, subscribeActions, unsubscribePlayers, unsubscribeActions]);

  // Afficher les erreurs de synchronisation
  useEffect(() => {
    if (gamesError) {
      console.error('Games sync error:', gamesError);
    }
    if (playersError) {
      console.error('Players sync error:', playersError);
    }
    if (actionsError) {
      console.error('Actions sync error:', actionsError);
    }
  }, [gamesError, playersError, actionsError]);

  // Composant invisible qui gère la synchronisation
  return null;
};
