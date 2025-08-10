"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
import { gameApi } from "@/lib/gameApi";

export const SupabaseTest = () => {
  const [connectionStatus, setConnectionStatus] = useState<string>("Testing...");
  const [testResults, setTestResults] = useState<string[]>([]);
  const { isConnected, joinGame, sendPlayerAction } = useSupabaseRealtime();

  const addTestResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  // Test de connexion de base
  useEffect(() => {
    const testConnection = async () => {
      try {
        addTestResult("Tentative de connexion à Supabase...");
        
        // Test de connexion simple d'abord
        const { data, error } = await supabase.from('games').select('count').limit(1);
        
        if (error) {
          setConnectionStatus("❌ Erreur de connexion");
          addTestResult(`Erreur de connexion: ${error.message}`);
          addTestResult(`Code d'erreur: ${error.code}`);
          addTestResult(`Détails: ${error.details}`);
        } else {
          setConnectionStatus("✅ Connecté à Supabase");
          addTestResult("Connexion Supabase réussie");
          addTestResult(`Nombre de jeux: ${data?.[0]?.count || 0}`);
        }
      } catch (err) {
        setConnectionStatus("❌ Erreur de connexion");
        const errorMessage = err instanceof Error ? err.message : 'Unknown error';
        addTestResult(`Erreur: ${errorMessage}`);
        
        // Log détaillé pour le debugging
        console.error("Erreur détaillée:", err);
        if (err instanceof TypeError && err.message.includes('fetch')) {
          addTestResult("Problème réseau détecté - vérifiez CORS et la connectivité");
        }
      }
    };

    testConnection();
  }, []);

  // Test Realtime
  useEffect(() => {
    if (isConnected) {
      addTestResult("Realtime connecté");
    } else {
      addTestResult("Realtime déconnecté");
    }
  }, [isConnected]);

  const testCreateGame = async () => {
    try {
      const testGame = await gameApi.createGame(
        `test-${Date.now()}`,
        "test-master",
        {
          roles: ["loup-garou", "villageois", "voyante"],
          minPlayers: 4,
          maxPlayers: 8,
          roleCounts: {
            "loup-garou": 2,
            "villageois": 4,
            "voyante": 1,
            "chasseur": 0,
            "cupidon": 0,
            "sorciere": 0,
            "petite-fille": 0,
            "capitaine": 0,
            "voleur": 0
          },
          enableLovers: false,
          enableVoyante: true,
          enableChasseur: false,
          enableSorciere: false,
          enablePetiteFille: false,
          enableCapitaine: false,
          enableVoleur: false
        }
      );
      addTestResult(`Jeu créé: ${testGame.roomCode}`);
      return testGame;
    } catch (error) {
      addTestResult(`Erreur création jeu: ${error instanceof Error ? error.message : 'Unknown error'}`);
      return null;
    }
  };

  const testRealtimeChannel = async () => {
    try {
      const testRoomCode = `test-realtime-${Date.now()}`;
      joinGame(testRoomCode);
      addTestResult(`Canal Realtime créé: ${testRoomCode}`);
      
      // Envoyer un message de test
      setTimeout(() => {
        sendPlayerAction(testRoomCode, {
          type: 'test',
          message: 'Test message'
        });
        addTestResult("Message de test envoyé");
      }, 1000);
    } catch (error) {
      addTestResult(`Erreur canal Realtime: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="p-6 bg-gray-100 rounded-lg max-w-2xl mx-auto text-black">
      <h2 className="text-2xl font-bold mb-4">Test Supabase Realtime</h2>
      
      <div className="mb-4">
        <p className="font-semibold">Statut de connexion: {connectionStatus}</p>
        <p className="text-sm text-gray-600">Realtime: {isConnected ? "✅ Connecté" : "❌ Déconnecté"}</p>
      </div>

      <div className="space-y-2 mb-4">
        <button
          onClick={testCreateGame}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Test Création Jeu
        </button>
        
        <button
          onClick={testRealtimeChannel}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 ml-2"
        >
          Test Canal Realtime
        </button>
      </div>

      <div className="bg-white p-4 rounded border">
        <h3 className="font-semibold mb-2">Logs de test:</h3>
        <div className="max-h-64 overflow-y-auto space-y-1">
          {testResults.map((result, index) => (
            <div key={index} className="text-sm font-mono bg-gray-50 p-1 rounded">
              {result}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
