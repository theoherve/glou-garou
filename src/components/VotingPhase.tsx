'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Users, Vote, Clock, CheckCircle, XCircle, AlertTriangle, Skull, Crown } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Player, PlayerStatus } from '@/types/game';
import { getRoleData } from '@/data/roles';

interface VotingPhaseProps {
  isActive: boolean;
  onPhaseComplete: (eliminatedPlayerId: string | null) => void;
  accusations: Record<string, string[]>;
}

interface VoteData {
  playerId: string;
  targetId: string;
  timestamp: Date;
  isConfirmed: boolean;
}

export const VotingPhase = ({ isActive, onPhaseComplete, accusations }: VotingPhaseProps) => {
  const { currentGame, currentPlayer } = useGameStore();
  const [currentStep, setCurrentStep] = useState<'preparation' | 'voting' | 'results'>('preparation');
  const [votingTime, setVotingTime] = useState(120); // 2 minutes
  const [isVotingActive, setIsVotingActive] = useState(false);
  const [votes, setVotes] = useState<Record<string, VoteData>>({});
  const [selectedTarget, setSelectedTarget] = useState<string | null>(null);
  const [showVoteConfirmation, setShowVoteConfirmation] = useState(false);
  const [eliminatedPlayer, setEliminatedPlayer] = useState<Player | null>(null);
  const [voteResults, setVoteResults] = useState<Record<string, number>>({});

  // Timer pour le vote
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isVotingActive && votingTime > 0) {
      interval = setInterval(() => {
        setVotingTime(prev => {
          if (prev <= 1) {
            setIsVotingActive(false);
            calculateResults();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isVotingActive, votingTime]);

  // Initialiser les votes
  useEffect(() => {
    if (currentGame && currentStep === 'preparation') {
      const initialVotes: Record<string, VoteData> = {};
      currentGame.players
        .filter(p => p.status === 'alive')
        .forEach(player => {
          initialVotes[player.id] = {
            playerId: player.id,
            targetId: '',
            timestamp: new Date(),
            isConfirmed: false
          };
        });
      setVotes(initialVotes);
    }
  }, [currentGame, currentStep]);

  // Démarrer le vote
  const handleStartVoting = () => {
    setIsVotingActive(true);
    setCurrentStep('voting');
  };

  // Sélectionner une cible
  const handleTargetSelection = (targetId: string) => {
    if (!currentPlayer) return;
    
    setSelectedTarget(targetId);
    
    // Mettre à jour le vote
    setVotes(prev => ({
      ...prev,
      [currentPlayer.id]: {
        ...prev[currentPlayer.id],
        targetId,
        timestamp: new Date()
      }
    }));
  };

  // Confirmer le vote
  const handleConfirmVote = () => {
    if (!currentPlayer || !selectedTarget) return;

    setVotes(prev => ({
      ...prev,
      [currentPlayer.id]: {
        ...prev[currentPlayer.id],
        isConfirmed: true,
        timestamp: new Date()
      }
    }));

    setShowVoteConfirmation(true);
    setTimeout(() => {
      setShowVoteConfirmation(false);
      setSelectedTarget(null);
    }, 1500);
  };

  // Calculer les résultats
  const calculateResults = () => {
    const results: Record<string, number> = {};
    
    Object.values(votes).forEach(vote => {
      if (vote.targetId && vote.isConfirmed) {
        results[vote.targetId] = (results[vote.targetId] || 0) + 1;
      }
    });

    setVoteResults(results);
    
    // Trouver le joueur avec le plus de votes
    const maxVotes = Math.max(...Object.values(results));
    const eliminatedPlayers = Object.entries(results)
      .filter(([_, count]) => count === maxVotes)
      .map(([playerId, _]) => playerId);

    if (eliminatedPlayers.length === 1) {
      const eliminated = currentGame?.players.find(p => p.id === eliminatedPlayers[0]);
      setEliminatedPlayer(eliminated || null);
    } else {
      // Égalité - pas d'élimination
      setEliminatedPlayer(null);
    }

    setCurrentStep('results');
  };

  // Passer à la phase suivante
  const handleContinue = () => {
    onPhaseComplete(eliminatedPlayer?.id || null);
  };

  // Formater le temps
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!isActive || !currentGame) {
    return null;
  }

  const alivePlayers = currentGame.players.filter(p => p.status === 'alive');
  const confirmedVotes = Object.values(votes).filter(v => v.isConfirmed).length;
  const totalVoters = alivePlayers.length;

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-red-50 via-orange-100 to-red-100">
      {/* Animation de fond de vote */}
      <div className="absolute inset-0 bg-gradient-to-b from-red-100/30 to-pink-100/30" />
      
      {/* Icône de vote */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          filter: ["drop-shadow(0 0 20px rgba(220, 38, 38, 0.3))"]
        }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-8"
      >
        <Target className="w-20 h-20 text-red-500" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col p-6">
        {/* En-tête de la phase */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🗳️ Phase de Vote
          </h1>
          <p className="text-xl text-gray-600">
            Le village doit choisir qui éliminer...
          </p>
        </motion.div>

        {/* Navigation des étapes */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
            {[
              { key: 'preparation', label: 'Préparation', icon: Users, color: 'text-blue-500' },
              { key: 'voting', label: 'Vote', icon: Vote, color: 'text-green-500' },
              { key: 'results', label: 'Résultats', icon: Target, color: 'text-red-500' }
            ].map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => setCurrentStep(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  currentStep === key
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'text-gray-600 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 ${currentStep === key ? 'text-white' : color}`} />
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Contenu selon l'étape */}
        <div className="flex-1 overflow-hidden">
          {/* Étape 1: Préparation */}
          {currentStep === 'preparation' && (
            <motion.div
              key="preparation"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full flex flex-col"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  📋 Préparation du Vote
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Résumé des accusations */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <AlertTriangle className="w-5 h-5 mr-2 text-orange-500" />
                      Accusations Reçues
                    </h3>
                    
                    {Object.keys(accusations).length > 0 ? (
                      <div className="space-y-2">
                        {Object.entries(accusations)
                          .filter(([_, accusers]) => accusers.length > 0)
                          .sort(([_, a], [__, b]) => b.length - a.length)
                          .map(([playerId, accusers]) => {
                            const player = alivePlayers.find(p => p.id === playerId);
                            if (!player) return null;
                            
                            return (
                              <div key={playerId} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg border border-orange-200">
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-orange-500 rounded-full flex items-center justify-center">
                                    <span className="text-white text-sm font-bold">
                                      {player.name.charAt(0).toUpperCase()}
                                    </span>
                                  </div>
                                  <span className="font-medium text-gray-800">{player.name}</span>
                                </div>
                                <span className="text-orange-600 font-bold">{accusers.length}</span>
                              </div>
                            );
                          })}
                      </div>
                    ) : (
                      <p className="text-gray-500 text-center py-4">
                        Aucune accusation n'a été portée.
                      </p>
                    )}
                  </div>

                  {/* Instructions */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-700 mb-3 flex items-center">
                      <Vote className="w-5 h-5 mr-2 text-blue-500" />
                      Instructions de Vote
                    </h3>
                    
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                      <ul className="text-blue-800 text-sm space-y-2">
                        <li>• Chaque joueur vivant doit voter</li>
                        <li>• Vous ne pouvez pas voter pour vous-même</li>
                        <li>• Le joueur avec le plus de votes sera éliminé</li>
                        <li>• En cas d'égalité, personne n'est éliminé</li>
                        <li>• Le vote est secret jusqu'à la révélation</li>
                      </ul>
                    </div>
                  </div>
                </div>

                {/* Bouton pour commencer le vote */}
                <div className="text-center mt-6">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleStartVoting}
                    className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-red-600 hover:to-pink-600 transition-all"
                  >
                    Commencer le Vote
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}

          {/* Étape 2: Vote */}
          {currentStep === 'voting' && (
            <motion.div
              key="voting"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full flex flex-col"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-800">
                    🗳️ Vote en Cours
                  </h2>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-semibold text-gray-700">
                      {formatTime(votingTime)}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      isVotingActive ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>

                {/* Progression du vote */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-gray-600">
                      Votes confirmés : {confirmedVotes} / {totalVoters}
                    </span>
                    <span className="text-gray-600">
                      {Math.round((confirmedVotes / totalVoters) * 100)}%
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <motion.div
                      className="bg-gradient-to-r from-green-500 to-blue-500 h-3 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(confirmedVotes / totalVoters) * 100}%` }}
                      transition={{ duration: 0.5 }}
                    />
                  </div>
                </div>

                {/* Sélection de la cible */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Sélectionnez le joueur à éliminer :
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {alivePlayers
                      .filter(player => player.id !== currentPlayer?.id)
                      .map(player => {
                        const accusationCount = (accusations[player.id] || []).length;
                        
                        return (
                          <motion.button
                            key={player.id}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleTargetSelection(player.id)}
                            className={`p-4 rounded-lg border-2 transition-all ${
                              selectedTarget === player.id
                                ? 'border-red-500 bg-red-100 shadow-lg'
                                : 'border-gray-300 bg-white hover:border-gray-400'
                            }`}
                          >
                            <div className="text-center">
                              <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                                selectedTarget === player.id
                                  ? 'bg-red-500'
                                  : accusationCount > 0
                                    ? 'bg-orange-400'
                                    : 'bg-gray-400'
                              }`}>
                                <span className="text-white text-lg font-bold">
                                  {player.name.charAt(0).toUpperCase()}
                                </span>
                              </div>
                              <p className="font-medium text-gray-800 mb-1">{player.name}</p>
                              <p className="text-sm text-gray-500 mb-2">{getRoleData(player.role).name}</p>
                              
                              {accusationCount > 0 && (
                                <div className="bg-orange-100 text-orange-800 text-xs px-2 py-1 rounded-full">
                                  {accusationCount} accusation{accusationCount > 1 ? 's' : ''}
                                </div>
                              )}
                            </div>
                          </motion.button>
                        );
                      })}
                  </div>
                </div>

                {/* Confirmation du vote */}
                {selectedTarget && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center"
                  >
                    <p className="text-gray-600 mb-4">
                      Vous votez pour éliminer{' '}
                      <span className="font-semibold text-red-600">
                        {alivePlayers.find(p => p.id === selectedTarget)?.name}
                      </span>
                    </p>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleConfirmVote}
                      className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-red-600 hover:to-pink-600 transition-all"
                    >
                      Confirmer mon Vote
                    </motion.button>
                  </motion.div>
                )}

                {/* Statut des votes des autres joueurs */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-3 text-center">
                    Statut des Votes
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {alivePlayers.map(player => {
                      const vote = votes[player.id];
                      const hasVoted = vote?.isConfirmed;
                      
                      return (
                        <div
                          key={player.id}
                          className={`p-3 rounded-lg border-2 ${
                            hasVoted
                              ? 'border-green-500 bg-green-50'
                              : 'border-gray-300 bg-gray-50'
                          }`}
                        >
                          <div className="text-center">
                            <div className={`w-10 h-10 rounded-full mx-auto mb-2 flex items-center justify-center ${
                              hasVoted ? 'bg-green-500' : 'bg-gray-400'
                            }`}>
                              {hasVoted ? (
                                <CheckCircle className="w-5 h-5 text-white" />
                              ) : (
                                <span className="text-white text-sm font-bold">
                                  {player.name.charAt(0).toUpperCase()}
                                </span>
                              )}
                            </div>
                            <p className="text-sm font-medium text-gray-800">{player.name}</p>
                            <p className="text-xs text-gray-500">
                              {hasVoted ? 'A voté' : 'En attente'}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Étape 3: Résultats */}
          {currentStep === 'results' && (
            <motion.div
              key="results"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full flex flex-col"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
                  📊 Résultats du Vote
                </h2>

                {/* Résultats détaillés */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-700 mb-4 text-center">
                    Détail des Votes
                  </h3>
                  
                  <div className="space-y-3">
                    {Object.entries(voteResults)
                      .sort(([_, a], [__, b]) => b - a)
                      .map(([playerId, voteCount]) => {
                        const player = alivePlayers.find(p => p.id === playerId);
                        if (!player) return null;
                        
                        return (
                          <div key={playerId} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg border border-gray-200">
                            <div className="flex items-center space-x-3">
                              <div className="w-12 h-12 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{player.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{player.name}</p>
                                <p className="text-sm text-gray-500">{getRoleData(player.role).name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-3xl font-bold text-red-600">{voteCount}</span>
                              <p className="text-sm text-gray-500">vote{voteCount > 1 ? 's' : ''}</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                </div>

                {/* Résultat final */}
                <div className="text-center mb-6">
                  {eliminatedPlayer ? (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-6">
                      <div className="flex items-center justify-center mb-4">
                        <Skull className="w-16 h-16 text-red-500 mr-4" />
                        <div>
                          <h3 className="text-2xl font-bold text-red-600">
                            {eliminatedPlayer.name} a été éliminé !
                          </h3>
                          <p className="text-red-600">
                            Rôle : {getRoleData(eliminatedPlayer.role).name}
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Le village a choisi d'éliminer {eliminatedPlayer.name} avec {voteResults[eliminatedPlayer.id]} vote{voteResults[eliminatedPlayer.id] > 1 ? 's' : ''}.
                      </p>
                    </div>
                  ) : (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                      <div className="flex items-center justify-center mb-4">
                        <XCircle className="w-16 h-16 text-yellow-500 mr-4" />
                        <div>
                          <h3 className="text-2xl font-bold text-yellow-600">
                            Aucun joueur éliminé
                          </h3>
                          <p className="text-yellow-600">
                            Égalité dans les votes
                          </p>
                        </div>
                      </div>
                      <p className="text-gray-600">
                        Le vote s'est terminé sur une égalité. Aucun joueur n'est éliminé ce tour.
                      </p>
                    </div>
                  )}
                </div>

                {/* Bouton pour continuer */}
                <div className="text-center">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleContinue}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                  >
                    Continuer
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Notification de confirmation de vote */}
      <AnimatePresence>
        {showVoteConfirmation && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50"
          >
            <div className="bg-green-500 text-white px-8 py-4 rounded-lg font-semibold text-xl">
              ✓ Vote confirmé
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
