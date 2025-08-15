"use client";

import { useEffect, useRef } from 'react';
import { useSupabaseSubscription } from '@/hooks/useSupabaseSubscription';
import { useGameStore } from '@/store/gameStore';
import { useRealtime } from './RealtimeProvider';
import { Player, Role, PlayerStatus } from '@/types/game';

interface DatabaseSyncProps {
  roomCode: string;
}

export const DatabaseSync = ({ roomCode }: DatabaseSyncProps) => {
  const { 
    currentGame, 
    setCurrentGame, 
    currentPlayer, 
    setCurrentPlayer,
    syncGameState,
    syncPlayerState,
    updateGamePhase,
    updatePlayerStatus,
    getGameStateSnapshot,
    restoreGameState
  } = useGameStore();
  const { isConnected } = useRealtime();

  const validRoles: Role[] = [
    'loup-garou',
    'villageois',
    'voyante',
    'chasseur',
    'cupidon',
    'sorciere',
    'petite-fille',
    'capitaine',
    'voleur',
  ];

  const toPlayer = (row: any): Player => {
    const role: Role = validRoles.includes(row?.role as Role) ? (row.role as Role) : 'villageois';
    const status: PlayerStatus = (row?.status as PlayerStatus) || 'alive';
    return {
      id: row.id,
      name: typeof row.name === 'string' ? row.name : 'Joueur',
      role,
      status,
      isGameMaster: !!row.is_game_master,
      isLover: !!row.is_lover,
      loverId: row.lover_id || undefined,
      hasUsedAbility: !!row.has_used_ability,
      voteTarget: row.vote_target || undefined,
    };
  };
  
  // Référence pour stocker le dernier snapshot
  const lastSnapshotRef = useRef<any>(null);
  
  // Timer pour la sauvegarde périodique
  const saveIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Fonction de sauvegarde périodique de l'état
  const startPeriodicSave = () => {
    if (saveIntervalRef.current) {
      clearInterval(saveIntervalRef.current);
    }
    
    saveIntervalRef.current = setInterval(() => {
      if (currentGame) {
        const snapshot = getGameStateSnapshot();
        if (snapshot) {
          lastSnapshotRef.current = snapshot;
          // Sauvegarder dans localStorage comme backup
          try {
            localStorage.setItem(`game-snapshot-${roomCode}`, JSON.stringify(snapshot));
            console.log('💾 État de jeu sauvegardé périodiquement');
          } catch (error) {
            console.warn('Impossible de sauvegarder dans localStorage:', error);
          }
        }
      }
    }, 30000); // Sauvegarder toutes les 30 secondes
  };

  // Fonction de restauration depuis le backup
  const restoreFromBackup = () => {
    try {
      const backupData = localStorage.getItem(`game-snapshot-${roomCode}`);
      if (backupData) {
        const snapshot = JSON.parse(backupData);
        const backupAge = Date.now() - new Date(snapshot.updatedAt).getTime();
        
        // Restaurer seulement si le backup n'est pas trop ancien (moins de 5 minutes)
        if (backupAge < 5 * 60 * 1000) {
          restoreGameState(snapshot);
          console.log('💾 État de jeu restauré depuis le backup local');
          return true;
        }
      }
    } catch (error) {
      console.warn('Erreur lors de la restauration depuis le backup:', error);
    }
    return false;
  };

  // Écouter les changements de la table games
  const { isSubscribed: isGamesSubscribed, error: gamesError, subscribe: subscribeGames, unsubscribe: unsubscribeGames } = useSupabaseSubscription({
    table: 'games',
    filter: `room_code=eq.${roomCode}`,
    onData: (payload) => {
      console.log('Game update received:', payload);
      if ((payload.eventType === 'UPDATE' || payload.type === 'UPDATE') && payload.new) {
        // Fusion non destructive: ne remplace pas l'objet jeu par la ligne brute Supabase
        const newPhase = payload.new.phase;
        const newNight = payload.new.current_night;
        const newSettings = payload.new.game_settings;
        const newUpdatedAt = payload.new.updated_at ? new Date(payload.new.updated_at) : new Date();
        if (currentGame) {
          setCurrentGame({
            ...currentGame,
            phase: newPhase ?? currentGame.phase,
            currentNight: typeof newNight === 'number' ? newNight : currentGame.currentNight,
            gameSettings: newSettings ?? currentGame.gameSettings,
            updatedAt: newUpdatedAt,
          });
        }
      }
    },
    onError: (error) => {
      console.error('Games subscription error:', error);
      // En cas d'erreur, essayer de restaurer depuis le backup
      if (!restoreFromBackup()) {
        console.error('Impossible de restaurer l\'état depuis le backup');
      }
    },
  });

  // Écouter les changements de la table players
  const { isSubscribed: isPlayersSubscribed, error: playersError, subscribe: subscribePlayers, unsubscribe: unsubscribePlayers } = useSupabaseSubscription({
    table: 'players',
    filter: currentGame ? `game_id=eq.${currentGame.id}` : undefined,
    onData: (payload) => {
      console.log('Player update received:', payload);
      if ((payload.eventType === 'UPDATE' || payload.type === 'UPDATE') && payload.new) {
        // Normaliser la ligne Supabase en Player typé
        const normalized = toPlayer(payload.new);
        syncPlayerState(normalized);
      } else if ((payload.eventType === 'INSERT' || payload.type === 'INSERT') && payload.new) {
        // Ajouter un nouveau joueur
        if (currentGame) {
          const normalized = toPlayer(payload.new);
          const updatedGame = {
            ...currentGame,
            players: [...currentGame.players, normalized],
            updatedAt: new Date(),
          };
          setCurrentGame(updatedGame);
        }
      } else if ((payload.eventType === 'DELETE' || payload.type === 'DELETE') && payload.old) {
        // Supprimer un joueur
        if (currentGame) {
          const updatedGame = {
            ...currentGame,
            players: currentGame.players.filter(p => p.id !== payload.old.id),
            updatedAt: new Date(),
          };
          setCurrentGame(updatedGame);
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
        // Traiter les nouvelles actions de jeu avec les nouvelles fonctions
        const action = payload.new;
        
        switch (action.action_type) {
          case 'game_start':
            // Démarrer le jeu
            if (currentGame && action.action_data?.phase) {
              updateGamePhase(action.action_data.phase as any);
            }
            break;
          case 'vote':
            // Mettre à jour le vote du joueur
            if (currentGame) {
              updatePlayerStatus(action.player_id, 'alive', { voteTarget: action.target_id });
            }
            break;
          case 'ability_use':
            // Marquer l'utilisation d'une capacité
            if (currentGame) {
              updatePlayerStatus(action.player_id, 'alive', { hasUsedAbility: true });
            }
            break;
          case 'phase_change':
            // Changer la phase du jeu
            if (currentGame && action.action_data?.phase) {
              updateGamePhase(action.action_data.phase as any, action.action_data);
            }
            break;
          case 'player_elimination':
            // Éliminer un joueur
            if (currentGame && action.target_id) {
              updatePlayerStatus(action.target_id, 'eliminated');
            }
            break;
          case 'role_reveal':
            // Révéler le rôle d'un joueur
            if (currentGame && action.target_id) {
              updatePlayerStatus(action.target_id, 'alive', { role: action.action_data?.role });
            }
            break;
        }
      }
    },
    onError: (error) => {
      console.error('Game actions subscription error:', error);
    },
  });

  // Démarrer la sauvegarde périodique quand le jeu est chargé
  useEffect(() => {
    if (currentGame) {
      startPeriodicSave();
    }
    
    return () => {
      if (saveIntervalRef.current) {
        clearInterval(saveIntervalRef.current);
      }
    };
  }, [currentGame, roomCode]);

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
