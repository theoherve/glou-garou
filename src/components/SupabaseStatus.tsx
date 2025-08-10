"use client";

import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import { Wifi, WifiOff } from 'lucide-react';

export const SupabaseStatus = () => {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Vérifier le statut initial de la connexion
    const checkConnection = async () => {
      try {
        const { data, error } = await supabase.from('games').select('count').limit(1);
        setIsConnected(!error);
      } catch {
        setIsConnected(false);
      }
    };

    checkConnection();

    // Écouter les changements de statut de connexion
    const channel = supabase.channel('connection_status');
    
    channel
      .on('system', { event: 'disconnect' }, () => {
        setIsConnected(false);
      })
      .on('system', { event: 'reconnect' }, () => {
        setIsConnected(true);
      });

    channel.subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, []);

  return (
    <div className="flex items-center gap-2 text-sm">
      {isConnected ? (
        <>
          <Wifi className="w-4 h-4 text-green-500" />
          <span className="text-green-500">Connecté</span>
        </>
      ) : (
        <>
          <WifiOff className="w-4 h-4 text-red-500" />
          <span className="text-red-500">Déconnecté</span>
        </>
      )}
    </div>
  );
}; 