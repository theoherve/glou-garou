'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sun, Users, MessageCircle, Clock, AlertTriangle, CheckCircle, Heart, Skull, Eye, Zap } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { Player, PlayerStatus } from '@/types/game';
import { getRoleData } from '@/data/roles';

interface DayPhaseProps {
  isActive: boolean;
  onPhaseComplete: (accusations: Record<string, string[]>) => void;
  currentPlayer: Player;
  alivePlayers: Player[];
  deadPlayers: Player[];
  eliminatedPlayerId: string | null;
}

interface ChatMessage {
  id: string;
  playerId: string;
  playerName: string;
  message: string;
  timestamp: Date;
  isAccusation?: boolean;
}

export const DayPhase = ({ isActive, onPhaseComplete, currentPlayer, alivePlayers, deadPlayers, eliminatedPlayerId }: DayPhaseProps) => {
  const { currentGame } = useGameStore();
  const [currentStep, setCurrentStep] = useState<'events' | 'discussion' | 'accusations'>('events');
  const [discussionTime, setDiscussionTime] = useState(300); // 5 minutes
  const [isDiscussionActive, setIsDiscussionActive] = useState(false);
  const [chatMessages, setChatMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [accusations, setAccusations] = useState<Record<string, string[]>>({});
  const [showEvents, setShowEvents] = useState(true);

  // Timer pour la discussion
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>;
    
    if (isDiscussionActive && discussionTime > 0) {
      interval = setInterval(() => {
        setDiscussionTime(prev => {
          if (prev <= 1) {
            setIsDiscussionActive(false);
            setCurrentStep('accusations');
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isDiscussionActive, discussionTime]);

  // Démarrer la discussion
  const handleStartDiscussion = () => {
    setIsDiscussionActive(true);
    setCurrentStep('discussion');
    setShowEvents(false);
  };

  // Envoyer un message
  const handleSendMessage = () => {
    if (!newMessage.trim() || !currentPlayer) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      playerId: currentPlayer.id,
      playerName: currentPlayer.name,
      message: newMessage.trim(),
      timestamp: new Date(),
      isAccusation: newMessage.toLowerCase().includes('accuse') || 
                   newMessage.toLowerCase().includes('suspect') ||
                   newMessage.toLowerCase().includes('vote')
    };

    setChatMessages(prev => [...prev, message]);
    setNewMessage('');
  };

  // Gérer les accusations
  const handleAccusation = (accusedPlayerId: string) => {
    if (!currentPlayer) return;

    setAccusations(prev => {
      const current = prev[accusedPlayerId] || [];
      if (current.includes(currentPlayer.id)) {
        // Retirer l'accusation
        return {
          ...prev,
          [accusedPlayerId]: current.filter(id => id !== currentPlayer.id)
        };
      } else {
        // Ajouter l'accusation
        return {
          ...prev,
          [accusedPlayerId]: [...current, currentPlayer.id]
        };
      }
    });
  };

  // Passer à la phase de vote
  const handleStartVoting = () => {
    onPhaseComplete(accusations);
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

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-blue-50 via-yellow-100 to-orange-100">
      {/* Animation de fond diurne */}
      <div className="absolute inset-0 bg-gradient-to-b from-yellow-100/30 to-orange-100/30" />
      
      {/* Soleil */}
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          filter: ["drop-shadow(0 0 30px rgba(255, 215, 0, 0.4))"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-8"
      >
        <Sun className="w-20 h-20 text-yellow-500" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col p-6">
        {/* En-tête de la phase */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            ☀️ Phase de Jour
          </h1>
          <p className="text-xl text-gray-600">
            Le village se réveille et découvre les événements de la nuit...
          </p>
        </motion.div>

        {/* Navigation des étapes */}
        <div className="flex justify-center mb-6">
          <div className="flex space-x-2 bg-white/80 backdrop-blur-sm rounded-lg p-2 border border-gray-200">
            {[
              { key: 'events', label: 'Événements', icon: AlertTriangle, color: 'text-red-500' },
              { key: 'discussion', label: 'Discussion', icon: MessageCircle, color: 'text-blue-500' },
              { key: 'accusations', label: 'Accusations', icon: Users, color: 'text-purple-500' }
            ].map(({ key, label, icon: Icon, color }) => (
              <button
                key={key}
                onClick={() => setCurrentStep(key as any)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-all ${
                  currentStep === key
                    ? 'bg-blue-500 text-white shadow-lg'
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
          {/* Étape 1: Révélation des événements de la nuit */}
          {currentStep === 'events' && (
            <motion.div
              key="events"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full flex flex-col"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-6 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  🌙 Événements de la Nuit
                </h2>
                
                <div className="space-y-4">
                  <motion.div
                    key="night-event"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gray-50 rounded-lg p-4 border border-gray-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center">
                        <Skull className="w-5 h-5 text-red-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-gray-800 font-medium">Un joueur a été assassiné.</p>
                        <p className="text-sm text-gray-500">
                          Il y a 1 minute
                        </p>
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>

              {/* Statut des joueurs */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  👥 Statut des Joueurs
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Joueurs vivants */}
                  <div>
                    <h4 className="font-semibold text-green-600 mb-3 flex items-center">
                      <CheckCircle className="w-5 h-5 mr-2" />
                      Joueurs Vivants ({alivePlayers.length})
                    </h4>
                    <div className="space-y-2">
                      {alivePlayers.map(player => (
                        <div key={player.id} className="flex items-center space-x-3 p-2 bg-green-50 rounded-lg">
                          <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-bold">
                              {player.name.charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <span className="text-gray-800 font-medium">{player.name}</span>
                          <span className="text-sm text-gray-500">({getRoleData(player.role).name})</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Joueurs morts */}
                  {deadPlayers.length > 0 && (
                    <div>
                      <h4 className="font-semibold text-red-600 mb-3 flex items-center">
                        <Skull className="w-5 h-5 mr-2" />
                        Joueurs Morts ({deadPlayers.length})
                      </h4>
                      <div className="space-y-2">
                        {deadPlayers.map(player => (
                          <div key={player.id} className="flex items-center space-x-3 p-2 bg-red-50 rounded-lg">
                            <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
                              <span className="text-white text-sm font-bold">
                                {player.name.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <span className="text-gray-800 font-medium line-through">{player.name}</span>
                            <span className="text-sm text-gray-500">({getRoleData(player.role).name})</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bouton pour commencer la discussion */}
              <div className="text-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartDiscussion}
                  className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-blue-600 hover:to-purple-600 transition-all"
                >
                  Commencer la Discussion
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* Étape 2: Discussion */}
          {currentStep === 'discussion' && (
            <motion.div
              key="discussion"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full flex flex-col"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-gray-200 shadow-lg">
                <div className="flex items-center justify-between mb-4">
                  <h2 className="text-2xl font-bold text-gray-800">
                    💬 Discussion
                  </h2>
                  <div className="flex items-center space-x-3">
                    <Clock className="w-5 h-5 text-gray-500" />
                    <span className="text-lg font-semibold text-gray-700">
                      {formatTime(discussionTime)}
                    </span>
                    <div className={`w-3 h-3 rounded-full ${
                      isDiscussionActive ? 'bg-green-500' : 'bg-gray-400'
                    }`} />
                  </div>
                </div>

                {/* Zone de chat */}
                <div className="h-64 bg-gray-50 rounded-lg p-4 mb-4 overflow-y-auto border border-gray-200">
                  {chatMessages.length > 0 ? (
                    <div className="space-y-3">
                      {chatMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex items-start space-x-3 ${
                            message.playerId === currentPlayer?.id ? 'justify-end' : 'justify-start'
                          }`}
                        >
                          {message.playerId !== currentPlayer?.id && (
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">
                                {message.playerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                          
                          <div className={`max-w-xs ${
                            message.playerId === currentPlayer?.id ? 'order-first' : ''
                          }`}>
                            <div className={`rounded-lg p-3 ${
                              message.playerId === currentPlayer?.id
                                ? 'bg-blue-500 text-white'
                                : message.isAccusation
                                  ? 'bg-red-100 text-red-800 border border-red-200'
                                  : 'bg-white text-gray-800 border border-gray-200'
                            }`}>
                              <p className="text-sm">{message.message}</p>
                            </div>
                            <p className="text-xs text-gray-500 mt-1 text-center">
                              {message.timestamp.toLocaleTimeString()}
                            </p>
                          </div>

                          {message.playerId === currentPlayer?.id && (
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white text-sm font-bold">
                                {message.playerName.charAt(0).toUpperCase()}
                              </span>
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center text-gray-500 py-8">
                      <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                      <p>Aucun message pour le moment. Commencez la discussion !</p>
                    </div>
                  )}
                </div>

                {/* Zone de saisie */}
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={!isDiscussionActive}
                  />
                  <button
                    onClick={handleSendMessage}
                    disabled={!newMessage.trim() || !isDiscussionActive}
                    className="px-6 py-2 bg-blue-500 text-white rounded-lg font-medium hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all"
                  >
                    Envoyer
                  </button>
                </div>
              </div>

              {/* Instructions pour la discussion */}
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <h3 className="font-semibold text-blue-800 mb-2">💡 Conseils pour la Discussion</h3>
                <ul className="text-blue-700 text-sm space-y-1">
                  <li>• Analysez les événements de la nuit ensemble</li>
                  <li>• Partagez vos observations et suspicions</li>
                  <li>• Écoutez les arguments des autres joueurs</li>
                  <li>• Préparez-vous pour la phase de vote</li>
                </ul>
              </div>
            </motion.div>
          )}

          {/* Étape 3: Accusations */}
          {currentStep === 'accusations' && (
            <motion.div
              key="accusations"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 50 }}
              className="h-full flex flex-col"
            >
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-gray-200 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                  🎯 Accusations et Suspicions
                </h2>
                
                <p className="text-gray-600 text-center mb-6">
                  Cliquez sur les joueurs que vous suspectez. Vos accusations seront visibles par tous.
                </p>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {alivePlayers.map(player => {
                    const playerAccusations = accusations[player.id] || [];
                    const accusationCount = playerAccusations.length;
                    const isAccusedByCurrentPlayer = playerAccusations.includes(currentPlayer?.id || '');
                    
                    return (
                      <motion.button
                        key={player.id}
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleAccusation(player.id)}
                        className={`p-4 rounded-lg border-2 transition-all ${
                          isAccusedByCurrentPlayer
                            ? 'border-red-500 bg-red-100'
                            : accusationCount > 0
                              ? 'border-orange-400 bg-orange-50'
                              : 'border-gray-300 bg-white hover:border-gray-400'
                        }`}
                      >
                        <div className="text-center">
                          <div className={`w-16 h-16 rounded-full mx-auto mb-3 flex items-center justify-center ${
                            isAccusedByCurrentPlayer
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
                            <div className="bg-red-100 text-red-800 text-xs px-2 py-1 rounded-full">
                              {accusationCount} accusation{accusationCount > 1 ? 's' : ''}
                            </div>
                          )}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>
              </div>

              {/* Résumé des accusations */}
              <div className="bg-white/90 backdrop-blur-sm rounded-2xl p-6 mb-4 border border-gray-200 shadow-lg">
                <h3 className="text-xl font-bold text-gray-800 mb-4 text-center">
                  📊 Résumé des Accusations
                </h3>
                
                {Object.keys(accusations).length > 0 ? (
                  <div className="space-y-3">
                    {Object.entries(accusations)
                      .filter(([_, accusers]) => accusers.length > 0)
                      .sort(([_, a], [__, b]) => b.length - a.length)
                      .map(([playerId, accusers]) => {
                        const player = alivePlayers.find(p => p.id === playerId);
                        if (!player) return null;
                        
                        return (
                          <div key={playerId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-red-500 rounded-full flex items-center justify-center">
                                <span className="text-white font-bold">{player.name.charAt(0).toUpperCase()}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-800">{player.name}</p>
                                <p className="text-sm text-gray-500">{getRoleData(player.role).name}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <span className="text-2xl font-bold text-red-600">{accusers.length}</span>
                              <p className="text-sm text-gray-500">accusations</p>
                            </div>
                          </div>
                        );
                      })}
                  </div>
                ) : (
                  <div className="text-center text-gray-500 py-8">
                    <Users className="w-16 h-16 mx-auto mb-4 opacity-50" />
                    <p>Aucune accusation pour le moment.</p>
                  </div>
                )}
              </div>

              {/* Bouton pour passer au vote */}
              <div className="text-center mt-6">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleStartVoting}
                  className="bg-gradient-to-r from-red-500 to-pink-500 text-white px-8 py-4 rounded-lg font-semibold text-lg shadow-lg hover:from-red-600 hover:to-pink-600 transition-all"
                >
                  Passer au Vote
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
};
