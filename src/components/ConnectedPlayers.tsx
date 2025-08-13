"use client";

import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';
import { motion } from 'framer-motion';
import { Users, CheckCircle, Clock, AlertCircle } from 'lucide-react';

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

  // Calculer le statut de la salle d'attente
  const totalPlayers = currentGame.players.length;
  const connectedCount = connectedPlayers.length;
  const minPlayersToStart = 4; // Minimum de joueurs pour commencer
  const isReadyToStart = connectedCount >= minPlayersToStart && connectedCount === totalPlayers;
  const isAlmostReady = connectedCount >= minPlayersToStart && connectedCount < totalPlayers;
  const isWaitingForMore = connectedCount < minPlayersToStart;

  const getWaitingStatus = () => {
    if (isReadyToStart) {
      return {
        icon: <CheckCircle className="w-5 h-5 text-green-400" />,
        text: 'Prêt à commencer !',
        color: 'text-green-400',
        bgColor: 'bg-green-400/10',
        borderColor: 'border-green-400/30'
      };
    } else if (isAlmostReady) {
      return {
        icon: <Clock className="w-5 h-5 text-yellow-400" />,
        text: `En attente de ${totalPlayers - connectedCount} joueur(s)`,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-400/10',
        borderColor: 'border-yellow-400/30'
      };
    } else {
      return {
        icon: <AlertCircle className="w-5 h-5 text-red-400" />,
        text: `Minimum ${minPlayersToStart} joueurs requis (${connectedCount}/${minPlayersToStart})`,
        color: 'text-red-400',
        bgColor: 'bg-red-400/10',
        borderColor: 'border-red-400/30'
      };
    }
  };

  const waitingStatus = getWaitingStatus();

  return (
    <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4 mb-4">
      {/* Header avec compteur principal */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white flex items-center">
          <div className="w-2 h-2 bg-green-400 rounded-full mr-2 animate-pulse"></div>
          Salle d'attente
        </h3>
        
        {/* Compteur principal X/Y */}
        <div className="text-right">
          <div className="text-2xl font-bold text-white">
            {connectedCount}/{totalPlayers}
          </div>
          <div className="text-xs text-gray-300">joueurs connectés</div>
        </div>
      </div>

      {/* Statut de la salle d'attente */}
      <motion.div 
        className={`p-3 rounded-lg border ${waitingStatus.bgColor} ${waitingStatus.borderColor} mb-4`}
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex items-center space-x-2">
          {waitingStatus.icon}
          <span className={`font-medium ${waitingStatus.color}`}>
            {waitingStatus.text}
          </span>
        </div>
      </motion.div>
      
      {/* Liste des joueurs connectés */}
      {connectedPlayers.length === 0 ? (
        <p className="text-gray-300 text-sm">Aucun joueur connecté</p>
      ) : (
        <div className="space-y-2">
          {connectedPlayers.map((player, index) => {
            const status = getPlayerStatus(player);
            const statusColor = getStatusColor(status);
            const statusText = getStatusText(status);
            
            return (
              <motion.div
                key={player.user_id || index}
                className="flex items-center justify-between bg-white/5 rounded-lg px-3 py-2"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.2, delay: index * 0.1 }}
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
              </motion.div>
            );
          })}
        </div>
      )}
      
      {/* Statistiques détaillées */}
      <div className="mt-4 pt-3 border-t border-white/10">
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Total joueurs:</span>
            <span className="text-white font-medium">{totalPlayers}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Connectés:</span>
            <span className="text-green-400 font-medium">{connectedCount}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">En vie:</span>
            <span className="text-green-400 font-medium">{currentGame.players.filter(p => p.status === 'alive').length}</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-gray-400">Minimum requis:</span>
            <span className="text-yellow-400 font-medium">{minPlayersToStart}</span>
          </div>
        </div>
      </div>

      {/* Barre de progression */}
      <div className="mt-3">
        <div className="flex justify-between text-xs text-gray-400 mb-1">
          <span>Progression</span>
          <span>{Math.round((connectedCount / totalPlayers) * 100)}%</span>
        </div>
        <div className="w-full bg-gray-700 rounded-full h-2">
          <motion.div 
            className={`h-2 rounded-full ${
              isReadyToStart ? 'bg-green-400' : 
              isAlmostReady ? 'bg-yellow-400' : 'bg-red-400'
            }`}
            initial={{ width: 0 }}
            animate={{ width: `${(connectedCount / totalPlayers) * 100}%` }}
            transition={{ duration: 0.5, ease: "easeOut" }}
          />
        </div>
      </div>
    </div>
  );
};
