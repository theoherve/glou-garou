"use client";

import { useState } from 'react';
import { useGameStore } from '@/store/gameStore';

interface ApiTestProps {
  roomCode: string;
}

export const ApiTest = ({ roomCode }: ApiTestProps) => {
  const [testResults, setTestResults] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const { currentGame, currentPlayer } = useGameStore();

  const addResult = (result: string) => {
    setTestResults(prev => [...prev, `${new Date().toLocaleTimeString()}: ${result}`]);
  };

  const testCreateGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create',
          roomCode: `test-${Date.now()}`,
          gameMasterId: 'test-master',
          settings: {
            minPlayers: 3,
            maxPlayers: 8,
            enableLovers: false,
            enableVoyante: true,
            enableChasseur: false,
            enableSorciere: false,
            enablePetiteFille: false,
            enableCapitaine: false,
            enableVoleur: false,
          }
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        addResult(`✅ Création de jeu réussie: ${data.game.room_code}`);
      } else {
        addResult(`❌ Erreur création: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Erreur réseau: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testJoinGame = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/games', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'join',
          roomCode,
          playerName: `TestPlayer-${Date.now()}`,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        addResult(`✅ Rejoindre jeu réussi: ${data.player.name}`);
      } else {
        addResult(`❌ Erreur rejoindre: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Erreur réseau: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testStartGame = async () => {
    if (!currentGame?.gameMasterId) {
      addResult('❌ Pas de maître de jeu identifié');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${roomCode}/start`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          gameMasterId: currentGame.gameMasterId,
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        addResult(`✅ Démarrage du jeu réussi: ${data.game.phase}`);
      } else {
        addResult(`❌ Erreur démarrage: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Erreur réseau: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGameActions = async () => {
    if (!currentPlayer) {
      addResult('❌ Pas de joueur actuel');
      return;
    }

    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${roomCode}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          actionType: 'test_action',
          playerId: currentPlayer.id,
          targetId: null,
          actionData: { message: 'Test action' },
        }),
      });
      
      const data = await response.json();
      if (response.ok) {
        addResult(`✅ Action de test créée: ${data.action.id}`);
      } else {
        addResult(`❌ Erreur action: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Erreur réseau: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const testGetGameActions = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(`/api/games/${roomCode}/actions`);
      const data = await response.json();
      
      if (response.ok) {
        addResult(`✅ Récupération actions: ${data.actions.length} actions trouvées`);
      } else {
        addResult(`❌ Erreur récupération: ${data.error}`);
      }
    } catch (error) {
      addResult(`❌ Erreur réseau: ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
      <h3 className="text-lg font-semibold text-[#e0e0e0] mb-4">🧪 Test des API Routes</h3>
      
      <div className="grid grid-cols-2 gap-2 mb-4">
        <button
          onClick={testCreateGame}
          disabled={isLoading}
          className="p-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          Créer Jeu
        </button>
        <button
          onClick={testJoinGame}
          disabled={isLoading}
          className="p-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          Rejoindre Jeu
        </button>
        <button
          onClick={testStartGame}
          disabled={isLoading || !currentGame?.gameMasterId}
          className="p-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          Démarrer Jeu
        </button>
        <button
          onClick={testGameActions}
          disabled={isLoading || !currentPlayer}
          className="p-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          Créer Action
        </button>
        <button
          onClick={testGetGameActions}
          disabled={isLoading}
          className="p-2 bg-[#4a4a4a] hover:bg-[#5a5a5a] text-[#e0e0e0] rounded-lg transition-colors text-sm disabled:opacity-50"
        >
          Récupérer Actions
        </button>
        <button
          onClick={clearResults}
          className="p-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 text-[#e0e0e0] rounded-lg transition-colors text-sm"
        >
          Effacer
        </button>
      </div>

      <div className="bg-[#1a1a1a] rounded-lg p-3 max-h-40 overflow-y-auto">
        <h4 className="text-sm font-medium text-[#cccccc] mb-2">Résultats des tests:</h4>
        {testResults.length === 0 ? (
          <p className="text-sm text-[#666666]">Aucun test exécuté</p>
        ) : (
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs text-[#cccccc] font-mono">
                {result}
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="mt-3 text-xs text-[#666666]">
        <p>État actuel: {currentGame ? `Jeu ${currentGame.phase}` : 'Aucun jeu'}</p>
        <p>Joueur: {currentPlayer ? currentPlayer.name : 'Aucun joueur'}</p>
      </div>
    </div>
  );
};
