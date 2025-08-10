"use client";

import { useRealtime } from './RealtimeProvider';

export const ConnectionStatus = () => {
  const { isConnected, isConnecting, error } = useRealtime();

  if (isConnecting) {
    return (
      <div className="fixed top-4 right-4 bg-yellow-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Connexion en cours...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed top-4 right-4 bg-red-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full"></div>
          <span>Erreur: {error}</span>
        </div>
      </div>
    );
  }

  if (isConnected) {
    return (
      <div className="fixed bottom-4 right-4 bg-green-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
        <div className="flex items-center space-x-2">
          <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
          <span>Connecté en temps réel</span>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-gray-600 text-white px-4 py-2 rounded-lg shadow-lg z-50">
      <div className="flex items-center space-x-2">
        <div className="w-2 h-2 bg-white rounded-full"></div>
        <span>Déconnecté</span>
      </div>
    </div>
  );
};
