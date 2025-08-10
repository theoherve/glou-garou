"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export const SimpleSupabaseTest = () => {
  const [status, setStatus] = useState<string>("Testing...");
  const [error, setError] = useState<string | null>(null);
  const [gamesCount, setGamesCount] = useState<number | null>(null);

  useEffect(() => {
    const testConnection = async () => {
      try {
        setStatus("Testing connection...");
        
        // Test simple de connexion
        const { data, error } = await supabase
          .from('games')
          .select('*', { count: 'exact', head: true });
        
        if (error) {
          setError(`Connection error: ${error.message}`);
          setStatus("❌ Failed");
        } else {
          setGamesCount(data?.length || 0);
          setStatus("✅ Connected");
          setError(null);
        }
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        setError(`Exception: ${errorMessage}`);
        setStatus("❌ Failed");
      }
    };

    testConnection();
  }, []);

  const testCreateGame = async () => {
    try {
      setStatus("Creating test game...");
      
      const { data, error } = await supabase
        .from('games')
        .insert({
          room_code: `test-${Date.now()}`,
          game_master_id: 'test-master',
          game_settings: { maxPlayers: 8 }
        })
        .select()
        .single();
      
      if (error) {
        setError(`Create error: ${error.message}`);
      } else {
        setStatus(`✅ Game created: ${data.room_code}`);
        setGamesCount(prev => (prev || 0) + 1);
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Create exception: ${errorMessage}`);
    }
  };

  const testRealtime = async () => {
    try {
      setStatus("Testing realtime...");
      
      const channel = supabase.channel('test-channel');
      
      channel
        .on('postgres_changes', 
          { event: 'INSERT', schema: 'public', table: 'games' },
          (payload) => {
            setStatus(`✅ Realtime working: ${payload.new.room_code}`);
          }
        )
        .subscribe();
      
      // Envoyer un message de test
      setTimeout(() => {
        channel.unsubscribe();
        setStatus("✅ Realtime test completed");
      }, 2000);
      
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Unknown error';
      setError(`Realtime error: ${errorMessage}`);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-md mx-auto">
      <h2 className="text-xl font-bold mb-4 text-gray-800">Supabase Test</h2>
      
      <div className="mb-4">
        <p className="font-medium">Status: {status}</p>
        {gamesCount !== null && (
          <p className="text-sm text-gray-600">Games in database: {gamesCount}</p>
        )}
        {error && (
          <p className="text-sm text-red-600 mt-2">{error}</p>
        )}
      </div>

      <div className="space-y-2">
        <button
          onClick={testCreateGame}
          className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          disabled={status.includes("❌")}
        >
          Test Create Game
        </button>
        
        <button
          onClick={testRealtime}
          className="w-full px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
          disabled={status.includes("❌")}
        >
          Test Realtime
        </button>
      </div>
    </div>
  );
};
