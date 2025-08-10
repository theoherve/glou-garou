'use client';

import { useState } from 'react';
import { useSupabaseRealtime } from '@/hooks/useSupabaseRealtime';
import { supabase } from '@/lib/supabase';

export default function RealtimeTest() {
  const [roomCode, setRoomCode] = useState('TEST123');
  const [testResults, setTestResults] = useState<string[]>([]);
  const { isConnected, isConnecting, error, joinGame, leaveGame } = useSupabaseRealtime('test-player');

  const addResult = (message: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testSupabaseConnection = async () => {
    try {
      addResult('🔍 Test de connexion Supabase de base...');
      
      const { data, error } = await supabase
        .from('games')
        .select('id')
        .limit(1);
      
      if (error) {
        addResult(`❌ Erreur Supabase: ${error.message}`);
      } else {
        addResult(`✅ Connexion Supabase OK: ${data?.length || 0} jeux trouvés`);
      }
    } catch (err) {
      addResult(`❌ Erreur: ${err}`);
    }
  };

  const testRealtimeConnection = async () => {
    try {
      addResult('🔄 Test de connexion Realtime...');
      await joinGame(roomCode);
    } catch (err) {
      addResult(`❌ Erreur Realtime: ${err}`);
    }
  };

  const testChannelCreation = async () => {
    try {
      addResult('📡 Test de création de canal...');
      
      const channel = supabase.channel(`test:${Date.now()}`);
      addResult('✅ Canal créé');
      
      const subscription = await channel.subscribe();
      addResult(`✅ Abonnement: ${subscription}`);
      
      await channel.unsubscribe();
      addResult('✅ Désabonnement OK');
      
    } catch (err) {
      addResult(`❌ Erreur canal: ${err}`);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
      <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4">
        🧪 Test Realtime Supabase
      </h2>
      
      <div className="space-y-4 mb-6">
        <div>
          <label className="block text-[#e0e0e0] mb-2">Code de salle de test:</label>
          <input
            type="text"
            value={roomCode}
            onChange={(e) => setRoomCode(e.target.value)}
            className="w-full px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded text-[#e0e0e0]"
            placeholder="Code de salle"
          />
        </div>
        
        <div className="flex gap-2 flex-wrap">
          <button
            onClick={testSupabaseConnection}
            className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-[#e0e0e0] rounded transition-colors"
          >
            🔍 Tester Supabase
          </button>
          
          <button
            onClick={testChannelCreation}
            className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-[#e0e0e0] rounded transition-colors"
          >
            📡 Tester Canal
          </button>
          
          <button
            onClick={testRealtimeConnection}
            disabled={isConnecting}
            className="px-4 py-2 bg-[#ff3333] hover:bg-[#e62e2e] disabled:bg-[#666666] text-white rounded transition-colors"
          >
            {isConnecting ? '🔄 Connexion...' : '🎮 Tester Realtime'}
          </button>
          
          <button
            onClick={() => leaveGame(roomCode)}
            disabled={!isConnected}
            className="px-4 py-2 bg-[#333333] hover:bg-[#444444] disabled:bg-[#666666] text-[#e0e0e0] rounded transition-colors"
          >
            🚪 Quitter
          </button>
          
          <button
            onClick={clearResults}
            className="px-4 py-2 bg-[#333333] hover:bg-[#444444] text-[#e0e0e0] rounded transition-colors"
          >
            🗑️ Effacer
          </button>
        </div>
      </div>

      {/* Status */}
      <div className="mb-4 p-3 bg-[#1a1a1a] rounded">
        <div className="flex items-center gap-4 text-sm">
          <span className={`px-2 py-1 rounded ${isConnected ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}`}>
            {isConnected ? '✅ Connecté' : '❌ Déconnecté'}
          </span>
          <span className={`px-2 py-1 rounded ${isConnecting ? 'bg-yellow-600 text-white' : 'bg-gray-600 text-white'}`}>
            {isConnecting ? '🔄 Connexion...' : '⏸️ En attente'}
          </span>
          {error && (
            <span className="px-2 py-1 rounded bg-red-600 text-white">
              ❌ {error}
            </span>
          )}
        </div>
      </div>

      {/* Results */}
      {testResults.length > 0 && (
        <div className="bg-[#1a1a1a] rounded p-3 max-h-64 overflow-y-auto">
          <h3 className="text-sm font-semibold text-[#cccccc] mb-2">Résultats des tests:</h3>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs text-[#cccccc] font-mono">
                {result}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
