"use client";

import { useState, useEffect } from 'react';
import { useRealtime } from './RealtimeProvider';
import { useGameStore } from '@/store/gameStore';
import { 
  Wifi, 
  WifiOff, 
  Signal, 
  SignalHigh, 
  SignalMedium, 
  SignalLow,
  AlertCircle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface PlayerConnectionStatusProps {
  showDetails?: boolean;
}

interface PlayerStatus {
  id: string;
  name: string;
  isOnline: boolean;
  lastSeen: Date;
  connectionQuality: 'excellent' | 'good' | 'poor' | 'disconnected';
  isDisconnected?: boolean;
}

export const PlayerConnectionStatus = ({ showDetails = false }: PlayerConnectionStatusProps) => {
  const { currentGame, currentPlayer } = useGameStore();
  const { 
    isConnected, 
    connectionQuality, 
    reconnectAttempts, 
    maxReconnectAttempts,
    getConnectionStats 
  } = useRealtime();
  
  const [playerStatuses, setPlayerStatuses] = useState<PlayerStatus[]>([]);
  const [showFullPanel, setShowFullPanel] = useState(false);
  const [connectionStats, setConnectionStats] = useState({
    latency: 0,
    packetLoss: 0,
    uptime: 0,
  });

  // Mettre à jour les statistiques de connexion
  useEffect(() => {
    if (isConnected) {
      const updateStats = () => {
        setConnectionStats(getConnectionStats());
      };
      
      updateStats();
      const interval = setInterval(updateStats, 5000);
      
      return () => clearInterval(interval);
    }
  }, [isConnected, getConnectionStats]);

  // Mettre à jour le statut des joueurs
  useEffect(() => {
    if (currentGame) {
      const now = new Date();
      const disconnectedThreshold = 2 * 60 * 1000; // 2 minutes
      
      const statuses = currentGame.players.map(player => {
        // Simuler le statut de connexion basé sur la présence
        const isOnline = player.id === currentPlayer?.id ? isConnected : true; // Simplifié pour la démo
        const lastSeen = isOnline ? now : new Date(now.getTime() - Math.random() * 60000);
        const timeSinceLastSeen = now.getTime() - lastSeen.getTime();
        const isDisconnected = timeSinceLastSeen > disconnectedThreshold;
        
        let quality: 'excellent' | 'good' | 'poor' | 'disconnected' = 'excellent';
        if (isDisconnected) {
          quality = 'disconnected';
        } else if (timeSinceLastSeen > 30000) {
          quality = 'poor';
        } else if (timeSinceLastSeen > 10000) {
          quality = 'good';
        }
        
        return {
          id: player.id,
          name: player.name,
          isOnline: isOnline && !isDisconnected,
          lastSeen,
          connectionQuality: quality,
          isDisconnected,
        };
      });
      
      setPlayerStatuses(statuses);
    }
  }, [currentGame, currentPlayer, isConnected]);

  // Fonction pour obtenir l'icône de qualité de connexion
  const getConnectionIcon = (quality: string) => {
    switch (quality) {
      case 'excellent':
        return <SignalHigh className="w-4 h-4 text-green-500" />;
      case 'good':
        return <SignalMedium className="w-4 h-4 text-yellow-500" />;
      case 'poor':
        return <SignalLow className="w-4 h-4 text-orange-500" />;
      case 'disconnected':
        return <WifiOff className="w-4 h-4 text-red-500" />;
      default:
        return <Wifi className="w-4 h-4 text-gray-500" />;
    }
  };

  // Fonction pour obtenir la couleur de statut
  const getStatusColor = (status: PlayerStatus) => {
    if (status.isDisconnected) return 'text-red-600';
    if (status.connectionQuality === 'excellent') return 'text-green-600';
    if (status.connectionQuality === 'good') return 'text-yellow-600';
    if (status.connectionQuality === 'poor') return 'text-orange-600';
    return 'text-gray-600';
  };

  // Fonction pour formater le temps écoulé
  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diff = now.getTime() - date.getTime();
    const minutes = Math.floor(diff / 60000);
    const seconds = Math.floor((diff % 60000) / 1000);
    
    if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    }
    return `${seconds}s`;
  };

  if (!currentGame) return null;

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* En-tête avec statut global */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wifi className={`w-5 h-5 ${isConnected ? 'text-green-500' : 'text-red-500'}`} />
          <h3 className="text-lg font-semibold">Statut des Connexions</h3>
        </div>
        
        <div className="flex items-center space-x-2">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            connectionQuality === 'excellent' ? 'bg-green-100 text-green-800' :
            connectionQuality === 'good' ? 'bg-yellow-100 text-yellow-800' :
            connectionQuality === 'poor' ? 'bg-orange-100 text-orange-800' :
            'bg-red-100 text-red-800'
          }`}>
            {connectionQuality === 'excellent' ? 'Excellent' :
             connectionQuality === 'good' ? 'Bon' :
             connectionQuality === 'poor' ? 'Médiocre' :
             'Déconnecté'}
          </span>
          
          {!isConnected && reconnectAttempts > 0 && (
            <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800">
              Reconnexion {reconnectAttempts}/{maxReconnectAttempts}
            </span>
          )}
        </div>
      </div>

      {/* Statistiques de connexion */}
      {showDetails && (
        <div className="grid grid-cols-3 gap-4 mb-4 p-3 bg-gray-50 rounded-lg">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600">{connectionStats.latency}ms</div>
            <div className="text-xs text-gray-600">Latence</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-600">{connectionStats.packetLoss}%</div>
            <div className="text-xs text-gray-600">Perte de paquets</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-600">{connectionStats.uptime}s</div>
            <div className="text-xs text-gray-600">Temps de connexion</div>
          </div>
        </div>
      )}

      {/* Liste des joueurs */}
      <div className="space-y-2">
        {playerStatuses.map((status) => (
          <div
            key={status.id}
            className={`flex items-center justify-between p-3 rounded-lg border ${
              status.isDisconnected ? 'bg-red-50 border-red-200' :
              status.connectionQuality === 'excellent' ? 'bg-green-50 border-green-200' :
              status.connectionQuality === 'good' ? 'bg-yellow-50 border-yellow-200' :
              status.connectionQuality === 'poor' ? 'bg-orange-50 border-orange-200' :
              'bg-gray-50 border-gray-200'
            }`}
          >
            <div className="flex items-center space-x-3">
              {getConnectionIcon(status.connectionQuality)}
              
              <div>
                <div className="font-medium text-gray-900">
                  {status.name}
                  {status.id === currentPlayer?.id && (
                    <span className="ml-2 text-xs text-blue-600">(Vous)</span>
                  )}
                </div>
                
                {showDetails && (
                  <div className="text-xs text-gray-500">
                    Dernière activité: {formatTimeAgo(status.lastSeen)}
                  </div>
                )}
              </div>
            </div>

            <div className="flex items-center space-x-2">
              {status.isOnline ? (
                <CheckCircle className="w-4 h-4 text-green-500" />
              ) : status.isDisconnected ? (
                <AlertCircle className="w-4 h-4 text-red-500" />
              ) : (
                <Clock className="w-4 h-4 text-yellow-500" />
              )}
              
              <span className={`text-xs font-medium ${getStatusColor(status)}`}>
                {status.isOnline ? 'En ligne' :
                 status.isDisconnected ? 'Déconnecté' :
                 'Inactif'}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Bouton pour afficher/masquer les détails */}
      <div className="mt-4 text-center">
        <button
          onClick={() => setShowFullPanel(!showFullPanel)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showFullPanel ? 'Masquer les détails' : 'Afficher les détails'}
        </button>
      </div>
    </div>
  );
};
