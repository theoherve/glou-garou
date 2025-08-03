'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Users, 
  Crown, 
  Moon, 
  Sun, 
  Target, 
  Volume2, 
  VolumeX,
  Settings,
  Copy,
  Check
} from 'lucide-react';
import { useGameStore } from '@/store/gameStore';
import { getRoleData } from '@/data/roles';
import { GamePhase } from '@/types/game';
import GameMasterPanel from '@/components/GameMasterPanel';
import NightAnimation from '@/components/NightAnimation';

interface GamePageProps {
  params: Promise<{
    roomCode: string;
  }>;
}

function GamePageClient({ params }: { params: Promise<{ roomCode: string }> }) {
  const [roomCode, setRoomCode] = useState<string>('');
  const { currentGame, currentPlayer, isLoading, error } = useGameStore();
  const [isMuted, setIsMuted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showNightAnimation, setShowNightAnimation] = useState(false);

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setRoomCode(resolvedParams.roomCode);
    };
    resolveParams();
  }, [params]);

  const handleCopyRoomCode = () => {
    navigator.clipboard.writeText(roomCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const getPhaseIcon = (phase: GamePhase) => {
    switch (phase) {
      case 'night':
        return <Moon className="w-6 h-6 text-blue-400" />;
      case 'day':
        return <Sun className="w-6 h-6 text-yellow-400" />;
      case 'voting':
        return <Target className="w-6 h-6 text-red-400" />;
      default:
        return <Users className="w-6 h-6 text-gray-400" />;
    }
  };

  const getPhaseText = (phase: GamePhase) => {
    switch (phase) {
      case 'waiting':
        return 'En attente de joueurs';
      case 'preparation':
        return 'Phase de préparation';
      case 'night':
        return 'Nuit - Les loups-garous rôdent';
      case 'day':
        return 'Jour - Le village se réveille';
      case 'voting':
        return 'Vote - Qui éliminer ?';
      case 'ended':
        return 'Partie terminée';
      default:
        return 'Phase inconnue';
    }
  };

  // Show night animation when phase changes to night
  useEffect(() => {
    if (currentGame?.phase === 'night') {
      setShowNightAnimation(true);
      setTimeout(() => setShowNightAnimation(false), 5000);
    }
  }, [currentGame?.phase]);

  const alivePlayers = currentGame?.players.filter(p => p.status === 'alive') || [];
  const deadPlayers = currentGame?.players.filter(p => p.status !== 'alive') || [];
  const isGameMaster = currentPlayer?.isGameMaster || false;

  // Show loading while roomCode is being resolved
  if (!roomCode) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement de la salle...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-white/30 border-t-white rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Chargement de la partie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-lg mb-4">Erreur: {error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!currentGame || !currentPlayer) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <p className="text-white text-lg mb-4">Partie non trouvée</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-sm border-b border-white/10 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">Glou Garou</h1>
            <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-lg">
              <span className="text-gray-300 text-sm">Salle:</span>
              <span className="text-white font-mono font-semibold">{roomCode}</span>
              <button
                onClick={handleCopyRoomCode}
                className="ml-2 text-gray-400 hover:text-white transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Phase indicator */}
            <div className="flex items-center gap-2 bg-white/10 px-4 py-2 rounded-lg">
              {getPhaseIcon(currentGame.phase)}
              <span className="text-white font-medium">{getPhaseText(currentGame.phase)}</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-white" />
              ) : (
                <Volume2 className="w-5 h-5 text-white" />
              )}
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors">
              <Settings className="w-5 h-5 text-white" />
            </button>
          </div>
        </div>
      </div>

      <div className="container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main game area */}
          <div className={`space-y-6 ${isGameMaster ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {/* Game phase content */}
            <motion.div
              key={currentGame.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-white mb-4">
                  {getPhaseText(currentGame.phase)}
                </h2>
                
                {currentGame.phase === 'waiting' && (
                  <div className="space-y-4">
                    <p className="text-gray-300">En attente que le maître du jeu démarre la partie...</p>
                    <div className="flex items-center justify-center gap-2 text-yellow-400">
                      <Crown className="w-5 h-5" />
                      <span>Maître du jeu: {currentGame.players.find(p => p.isGameMaster)?.name}</span>
                    </div>
                  </div>
                )}

                {currentGame.phase === 'night' && (
                  <div className="space-y-4">
                    <p className="text-gray-300">La nuit tombe sur Thiercelieux...</p>
                    {currentPlayer.role === 'loup-garou' && (
                      <p className="text-red-400">Vous vous réveillez avec vos complices pour choisir une victime.</p>
                    )}
                    {currentPlayer.role === 'voyante' && (
                      <p className="text-blue-400">Vous pouvez découvrir l'identité d'un joueur.</p>
                    )}
                    {currentPlayer.role === 'sorciere' && (
                      <p className="text-purple-400">Vous pouvez utiliser vos potions.</p>
                    )}
                  </div>
                )}

                {currentGame.phase === 'day' && (
                  <div className="space-y-4">
                    <p className="text-gray-300">Le village se réveille...</p>
                    <p className="text-white">Débattons pour identifier les loups-garous !</p>
                  </div>
                )}

                {currentGame.phase === 'voting' && (
                  <div className="space-y-4">
                    <p className="text-red-400 font-semibold">Vote d&apos;élimination</p>
                    <p className="text-gray-300">Choisissez qui éliminer du village.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Player grid */}
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                Joueurs ({alivePlayers.length} vivants)
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentGame.players.map((player) => (
                  <motion.div
                    key={player.id}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className={`p-4 rounded-lg border transition-all duration-200 ${
                      player.status === 'alive'
                        ? 'bg-white/10 border-white/20'
                        : 'bg-red-500/20 border-red-500/40 opacity-60'
                    } ${player.id === currentPlayer.id ? 'ring-2 ring-blue-500' : ''}`}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="font-semibold text-white">{player.name}</span>
                        {player.isGameMaster && <Crown className="w-4 h-4 text-yellow-400" />}
                        {player.isLover && <span className="text-pink-400">💕</span>}
                      </div>
                      
                      {player.status === 'alive' ? (
                        <div className="text-sm text-gray-300">
                          {player.id === currentPlayer.id ? getRoleData(player.role).name : '???'}
                        </div>
                      ) : (
                        <div className="text-sm text-red-400">
                          {getRoleData(player.role).name} - Éliminé
                        </div>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* Game Master Panel */}
          {isGameMaster && (
            <div className="lg:col-span-2">
              <GameMasterPanel game={currentGame} currentPlayer={currentPlayer} />
            </div>
          )}

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Current player info */}
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Votre rôle</h3>
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {currentPlayer.role === 'loup-garou' ? '🐺' : '🏠'}
                </div>
                <div className="text-white font-semibold mb-1">
                  {getRoleData(currentPlayer.role).name}
                </div>
                <p className="text-sm text-gray-300">
                  {getRoleData(currentPlayer.role).description}
                </p>
              </div>
            </div>

            {/* Game info */}
            <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
              <h3 className="text-lg font-semibold text-white mb-3">Informations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-300">Nuit:</span>
                  <span className="text-white">{currentGame.currentNight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Joueurs:</span>
                  <span className="text-white">{currentGame.players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-300">Éliminés:</span>
                  <span className="text-red-400">{deadPlayers.length}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {currentGame.phase === 'voting' && (
              <div className="bg-white/5 rounded-lg p-4 backdrop-blur-sm border border-white/10">
                <h3 className="text-lg font-semibold text-white mb-3">Voter</h3>
                <p className="text-sm text-gray-300 mb-3">
                  Choisissez un joueur à éliminer
                </p>
                <div className="space-y-2">
                  {alivePlayers
                    .filter(p => p.id !== currentPlayer.id)
                    .map(player => (
                      <button
                        key={player.id}
                        className="w-full p-2 bg-red-600/20 hover:bg-red-600/30 text-white rounded-lg transition-colors text-sm"
                      >
                        Voter pour {player.name}
                      </button>
                    ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Night Animation */}
      <NightAnimation 
        isActive={showNightAnimation} 
        onComplete={() => setShowNightAnimation(false)}
      />
    </div>
  );
}

export default function GamePage({ params }: GamePageProps) {
  return <GamePageClient params={params} />;
} 