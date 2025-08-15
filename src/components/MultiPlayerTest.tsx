"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Plus, 
  Trash2, 
  Play, 
  Pause, 
  RotateCcw,
  UserPlus,
  UserMinus,
  MessageSquare,
  Vote,
  Moon,
  Sun,
  Target,
  Crown,
  Bot
} from 'lucide-react';
import Image from 'next/image';
import { getRoleAssets } from '@/lib/roleAssets';
import { useGameStore } from '@/store/gameStore';
import { useRealtime } from './RealtimeProvider';

interface SimulatedPlayer {
  id: string;
  name: string;
  role: string;
  status: 'alive' | 'dead' | 'eliminated';
  isGameMaster: boolean;
  isConnected: boolean;
  lastAction?: string;
  voteTarget?: string;
}

interface SimulatedAction {
  id: string;
  playerId: string;
  action: string;
  targetId?: string;
  timestamp: Date;
  phase: string;
}

export const MultiPlayerTest = ({ roomCode }: { roomCode: string }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulatedPlayers, setSimulatedPlayers] = useState<SimulatedPlayer[]>([]);
  const [simulatedActions, setSimulatedActions] = useState<SimulatedAction[]>([]);
  const [currentPhase, setCurrentPhase] = useState<'waiting' | 'preparation' | 'night' | 'day' | 'voting'>('waiting');
  const [simulationSpeed, setSimulationSpeed] = useState(1000); // ms
  const [autoAdvance, setAutoAdvance] = useState(false);
  
  const { currentGame, currentPlayer } = useGameStore();
  const { isConnected, connectedPlayers } = useRealtime();

  // Configuration des rôles disponibles
  const availableRoles = [
    'villageois',
    'loup-garou',
    'voyante',
    'sorcière',
    'chasseur',
    'cupidon',
    'petite-fille',
    'grand-mère'
  ];

  // Initialiser les joueurs simulés
  useEffect(() => {
    if (currentGame?.players) {
      const players = currentGame.players.map(player => ({
        id: player.id,
        name: player.name,
        role: player.role,
        status: player.status,
        isGameMaster: player.isGameMaster,
        isConnected: true,
        lastAction: undefined,
        voteTarget: undefined
      }));
      setSimulatedPlayers(players);
    }
  }, [currentGame]);

  // Ajouter un joueur simulé
  const addSimulatedPlayer = () => {
    const playerCount = simulatedPlayers.length;
    const newPlayer: SimulatedPlayer = {
      id: `sim-${Date.now()}-${playerCount}`,
      name: `Joueur ${playerCount + 1}`,
      role: availableRoles[Math.floor(Math.random() * availableRoles.length)],
      status: 'alive',
      isGameMaster: false,
      isConnected: true
    };
    
    setSimulatedPlayers(prev => [...prev, newPlayer]);
    addSimulatedAction(newPlayer.id, 'join', undefined, 'waiting');
  };

  // Supprimer un joueur simulé
  const removeSimulatedPlayer = (playerId: string) => {
    setSimulatedPlayers(prev => prev.filter(p => p.id !== playerId));
    addSimulatedAction(playerId, 'leave', undefined, currentPhase);
  };

  // Ajouter une action simulée
  const addSimulatedAction = (playerId: string, action: string, targetId?: string, phase?: string) => {
    const newAction: SimulatedAction = {
      id: `action-${Date.now()}`,
      playerId,
      action,
      targetId,
      timestamp: new Date(),
      phase: phase || currentPhase
    };
    
    setSimulatedActions(prev => [...prev, newAction]);
  };

  // Simuler une action de joueur
  const simulatePlayerAction = (player: SimulatedPlayer, action: string, targetId?: string) => {
    const updatedPlayers = simulatedPlayers.map(p => 
      p.id === player.id 
        ? { ...p, lastAction: action, voteTarget: targetId }
        : p
    );
    
    setSimulatedPlayers(updatedPlayers);
    addSimulatedAction(player.id, action, targetId);
  };

  // Simuler une phase de nuit
  const simulateNightPhase = async () => {
    setCurrentPhase('night');
    addSimulatedAction('system', 'phase-change', undefined, 'night');
    
    // Simuler les actions des loups-garous
    const wolves = simulatedPlayers.filter(p => p.role === 'loup-garou' && p.status === 'alive');
    if (wolves.length > 0) {
      const aliveVillagers = simulatedPlayers.filter(p => p.role !== 'loup-garou' && p.status === 'alive');
      if (aliveVillagers.length > 0) {
        const target = aliveVillagers[Math.floor(Math.random() * aliveVillagers.length)];
        simulatePlayerAction(wolves[0], 'kill', target.id);
        
        // Marquer la cible comme morte
        setSimulatedPlayers(prev => prev.map(p => 
          p.id === target.id ? { ...p, status: 'dead' } : p
        ));
      }
    }
    
    // Simuler les actions des rôles spéciaux
    simulatedPlayers.forEach(player => {
      if (player.status === 'alive' && player.role !== 'loup-garou') {
        switch (player.role) {
          case 'voyante':
            const randomPlayer = simulatedPlayers[Math.floor(Math.random() * simulatedPlayers.length)];
            simulatePlayerAction(player, 'reveal-role', randomPlayer.id);
            break;
          case 'sorcière':
            if (Math.random() > 0.5) {
              simulatePlayerAction(player, 'use-potion', undefined);
            }
            break;
        }
      }
    });
  };

  // Simuler une phase de jour
  const simulateDayPhase = async () => {
    setCurrentPhase('day');
    addSimulatedAction('system', 'phase-change', undefined, 'day');
    
    // Simuler la discussion
    simulatedPlayers.filter(p => p.status === 'alive').forEach(player => {
      if (Math.random() > 0.7) {
        simulatePlayerAction(player, 'accuse', undefined);
      }
    });
  };

  // Simuler une phase de vote
  const simulateVotingPhase = async () => {
    setCurrentPhase('voting');
    addSimulatedAction('system', 'phase-change', undefined, 'voting');
    
    // Simuler le vote
    const alivePlayers = simulatedPlayers.filter(p => p.status === 'alive');
    alivePlayers.forEach(player => {
      const possibleTargets = alivePlayers.filter(p => p.id !== player.id);
      if (possibleTargets.length > 0) {
        const target = possibleTargets[Math.floor(Math.random() * possibleTargets.length)];
        simulatePlayerAction(player, 'vote', target.id);
      }
    });
    
    // Compter les votes et éliminer le joueur le plus voté
    const voteCounts: Record<string, number> = {};
    simulatedActions
      .filter(a => a.action === 'vote' && a.phase === 'voting')
      .forEach(action => {
        if (action.targetId) {
          voteCounts[action.targetId] = (voteCounts[action.targetId] || 0) + 1;
        }
      });
    
    const mostVoted = Object.entries(voteCounts).reduce((a, b) => a[1] > b[1] ? a : b);
    if (mostVoted) {
      setSimulatedPlayers(prev => prev.map(p => 
        p.id === mostVoted[0] ? { ...p, status: 'eliminated' } : p
      ));
      addSimulatedAction('system', 'eliminate', mostVoted[0], 'voting');
    }
  };

  // Simulation automatique
  const startAutoSimulation = () => {
    setIsSimulating(true);
    setAutoAdvance(true);
    
    const simulationLoop = async () => {
      if (!autoAdvance) return;
      
      // Attendre que tous les joueurs soient connectés
      if (simulatedPlayers.length < 3) {
        setTimeout(simulationLoop, simulationSpeed);
        return;
      }
      
      // Simuler le flux de jeu
      await simulateNightPhase();
      await new Promise(resolve => setTimeout(resolve, simulationSpeed));
      
      await simulateDayPhase();
      await new Promise(resolve => setTimeout(resolve, simulationSpeed));
      
      await simulateVotingPhase();
      await new Promise(resolve => setTimeout(resolve, simulationSpeed));
      
      // Retour à la phase d'attente
      setCurrentPhase('waiting');
      addSimulatedAction('system', 'phase-change', undefined, 'waiting');
      
      // Continuer la simulation si activée
      if (autoAdvance) {
        setTimeout(simulationLoop, simulationSpeed);
      }
    };
    
    simulationLoop();
  };

  const stopAutoSimulation = () => {
    setIsSimulating(false);
    setAutoAdvance(false);
  };

  const resetSimulation = () => {
    setSimulatedPlayers([]);
    setSimulatedActions([]);
    setCurrentPhase('waiting');
    setIsSimulating(false);
    setAutoAdvance(false);
  };

  const getPhaseIcon = (phase: string) => {
    switch (phase) {
      case 'night': return <Moon className="w-4 h-4 text-blue-500" />;
      case 'day': return <Sun className="w-4 h-4 text-yellow-500" />;
      case 'voting': return <Target className="w-4 h-4 text-red-500" />;
      default: return <Users className="w-4 h-4 text-gray-500" />;
    }
  };

  const getRoleIcon = (role: string) => {
    const { illustrationSrc, displayName } = getRoleAssets(role as any);
    return (
      <Image
        src={illustrationSrc}
        alt={displayName}
        width={56}
        height={56}
        className="w-14 h-14 object-contain"
      />
    );
  };

  if (!isExpanded) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-lg font-semibold text-[#e0e0e0] hover:text-[#ff3333] transition-colors flex items-center space-x-2"
        >
          <span className="text-2xl">👥</span>
          <span>Test Multi-Joueurs</span>
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center space-x-2">
          <span className="text-2xl">👥</span>
          <span>Test Multi-Joueurs</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#ff3333] hover:text-[#ff6666] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Contrôles de simulation */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={addSimulatedPlayer}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <UserPlus className="w-4 h-4" />
          <span>Ajouter Joueur</span>
        </button>
        
        <button
          onClick={startAutoSimulation}
          disabled={isSimulating}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Play className="w-4 h-4" />
          <span>Démarrer Simulation</span>
        </button>
        
        <button
          onClick={stopAutoSimulation}
          disabled={!isSimulating}
          className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Pause className="w-4 h-4" />
          <span>Arrêter</span>
        </button>
        
        <button
          onClick={resetSimulation}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Réinitialiser</span>
        </button>
      </div>

      {/* Configuration de la simulation */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-[#e0e0e0]">⚙️ Configuration</h4>
          <div className="flex items-center space-x-2">
            <span className="text-[#cccccc]">Vitesse:</span>
            <select
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number(e.target.value))}
              className="bg-[#2a2a2a] text-[#e0e0e0] px-2 py-1 rounded border border-[#ff3333]/20"
            >
              <option value={500}>Rapide (500ms)</option>
              <option value={1000}>Normal (1s)</option>
              <option value={2000}>Lent (2s)</option>
              <option value={5000}>Très lent (5s)</option>
            </select>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{simulatedPlayers.length}</div>
            <div className="text-[#cccccc]">Joueurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{simulatedActions.length}</div>
            <div className="text-[#cccccc]">Actions</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{currentPhase}</div>
            <div className="text-[#cccccc]">Phase actuelle</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{isSimulating ? 'Oui' : 'Non'}</div>
            <div className="text-[#cccccc]">Simulation active</div>
          </div>
        </div>
      </div>

      {/* Phase actuelle */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between">
          <h4 className="text-lg font-medium text-[#e0e0e0] flex items-center space-x-2">
            {getPhaseIcon(currentPhase)}
            <span>Phase: {currentPhase}</span>
          </h4>
          
          <div className="flex space-x-2">
            <button
              onClick={simulateNightPhase}
              disabled={isSimulating}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              Nuit
            </button>
            <button
              onClick={simulateDayPhase}
              disabled={isSimulating}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              Jour
            </button>
            <button
              onClick={simulateVotingPhase}
              disabled={isSimulating}
              className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-gray-600 text-white rounded text-sm transition-colors"
            >
              Vote
            </button>
          </div>
        </div>
      </div>

      {/* Joueurs simulés */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">👥 Joueurs Simulés</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {simulatedPlayers.map((player) => (
            <motion.div
              key={player.id}
              className={`p-3 rounded-lg border transition-all ${
                player.status === 'alive' 
                  ? 'bg-[#1a1a1a] border-[#ff3333]/20' 
                  : 'bg-[#ff3333]/10 border-[#ff3333]/30'
              }`}
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <span className="text-xl">{getRoleIcon(player.role)}</span>
                  <span className={`font-medium ${
                    player.status === 'alive' ? 'text-[#e0e0e0]' : 'text-[#ff3333]'
                  }`}>
                    {player.name}
                  </span>
                </div>
                
                <div className="flex items-center space-x-1">
                  {player.isGameMaster && <Crown className="w-4 h-4 text-yellow-500" />}
                  <div className={`w-2 h-2 rounded-full ${
                    player.isConnected ? 'bg-green-500' : 'bg-red-500'
                  }`} />
                </div>
              </div>
              
              <div className="text-xs text-[#cccccc] mb-2">
                <div>Rôle: {player.role}</div>
                <div>Statut: {player.status}</div>
                {player.lastAction && <div>Dernière action: {player.lastAction}</div>}
                {player.voteTarget && <div>Cible de vote: {player.voteTarget}</div>}
              </div>
              
              <div className="flex space-x-1">
                <button
                  onClick={() => simulatePlayerAction(player, 'accuse')}
                  className="px-2 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded text-xs transition-colors"
                >
                  Accuser
                </button>
                <button
                  onClick={() => simulatePlayerAction(player, 'defend')}
                  className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                >
                  Défendre
                </button>
                <button
                  onClick={() => removeSimulatedPlayer(player.id)}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Actions simulées */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📋 Actions Simulées</h4>
        <div className="h-48 overflow-y-auto bg-[#0a0a0a] rounded p-3">
          {simulatedActions.length === 0 ? (
            <span className="text-[#666666]">Aucune action simulée</span>
          ) : (
            <div className="space-y-2">
              {simulatedActions.slice(-20).reverse().map((action) => (
                <div key={action.id} className="text-xs text-[#cccccc] border-b border-[#333333] pb-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[#ff3333]">
                      {action.playerId === 'system' ? '🖥️ Système' : 
                       simulatedPlayers.find(p => p.id === action.playerId)?.name || action.playerId}
                    </span>
                    <span className="text-[#666666]">
                      {action.timestamp.toLocaleTimeString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span>{action.action}</span>
                    {action.targetId && (
                      <span className="text-[#ff9933]">
                        → {simulatedPlayers.find(p => p.id === action.targetId)?.name || action.targetId}
                      </span>
                    )}
                    <span className="text-[#666666]">[{action.phase}]</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};
