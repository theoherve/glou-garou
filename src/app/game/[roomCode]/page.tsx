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
        return <Moon className="w-6 h-6 text-[#ff9933]" />;
      case 'day':
        return <Sun className="w-6 h-6 text-[#ff9933]" />;
      case 'voting':
        return <Target className="w-6 h-6 text-[#ff3333]" />;
      default:
        return <Users className="w-6 h-6 text-[#cccccc]" />;
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
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff3333]/30 border-t-[#ff3333] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#e0e0e0] text-lg">Chargement de la salle...</p>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff3333]/30 border-t-[#ff3333] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#e0e0e0] text-lg">Chargement de la partie...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#ff3333] text-lg mb-4">Erreur: {error}</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-[#ff3333] hover:bg-[#e62e2e] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  if (!currentGame || !currentPlayer) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <p className="text-[#e0e0e0] text-lg mb-4">Partie non trouvée</p>
          <button 
            onClick={() => window.history.back()}
            className="bg-[#ff3333] hover:bg-[#e62e2e] text-white px-6 py-2 rounded-lg transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Header */}
      <div className="relative z-10 bg-[#2a2a2a]/80 backdrop-blur-sm border-b border-[#ff3333]/20 p-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-[#ff9933] font-creepster">Glou Garou</h1>
            <div className="flex items-center gap-2 bg-[#1a1a1a] px-3 py-1 rounded-lg border border-[#333333]">
              <span className="text-[#cccccc] text-sm">Salle:</span>
              <span className="text-[#e0e0e0] font-mono font-semibold">{roomCode}</span>
              <button
                onClick={handleCopyRoomCode}
                className="ml-2 text-[#cccccc] hover:text-[#e0e0e0] transition-colors"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Phase indicator */}
            <div className="flex items-center gap-2 bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#333333]">
              {getPhaseIcon(currentGame.phase)}
              <span className="text-[#e0e0e0] font-medium">{getPhaseText(currentGame.phase)}</span>
            </div>

            {/* Sound toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#333333] transition-colors border border-[#333333]"
            >
              {isMuted ? (
                <VolumeX className="w-5 h-5 text-[#e0e0e0]" />
              ) : (
                <Volume2 className="w-5 h-5 text-[#e0e0e0]" />
              )}
            </button>

            {/* Settings */}
            <button className="p-2 rounded-lg bg-[#1a1a1a] hover:bg-[#333333] transition-colors border border-[#333333]">
              <Settings className="w-5 h-5 text-[#e0e0e0]" />
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 container mx-auto p-4">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Main game area */}
          <div className={`space-y-6 ${isGameMaster ? 'lg:col-span-2' : 'lg:col-span-3'}`}>
            {/* Game phase content */}
            <motion.div
              key={currentGame.phase}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20"
            >
              <div className="text-center">
                <h2 className="text-2xl font-semibold text-[#e0e0e0] mb-4">
                  {getPhaseText(currentGame.phase)}
                </h2>
                
                {currentGame.phase === 'waiting' && (
                  <div className="space-y-4">
                    <p className="text-[#cccccc]">En attente que le maître du jeu démarre la partie...</p>
                    <div className="flex items-center justify-center gap-2 text-[#ff9933]">
                      <Crown className="w-5 h-5" />
                      <span>Maître du jeu: {currentGame.players.find(p => p.isGameMaster)?.name}</span>
                    </div>
                  </div>
                )}

                {currentGame.phase === 'night' && (
                  <div className="space-y-4">
                    <p className="text-[#cccccc]">La nuit tombe sur Thiercelieux...</p>
                    {currentPlayer.role === 'loup-garou' && (
                      <p className="text-[#ff3333]">Vous vous réveillez avec vos complices pour choisir une victime.</p>
                    )}
                    {currentPlayer.role === 'voyante' && (
                      <p className="text-[#ff9933]">Vous pouvez découvrir l'identité d'un joueur.</p>
                    )}
                    {currentPlayer.role === 'sorciere' && (
                      <p className="text-[#ff9933]">Vous pouvez utiliser vos potions.</p>
                    )}
                  </div>
                )}

                {currentGame.phase === 'day' && (
                  <div className="space-y-4">
                    <p className="text-[#cccccc]">Le village se réveille...</p>
                    <p className="text-[#e0e0e0]">Débattons pour identifier les loups-garous !</p>
                  </div>
                )}

                {currentGame.phase === 'voting' && (
                  <div className="space-y-4">
                    <p className="text-[#ff3333] font-semibold">Vote d&apos;élimination</p>
                    <p className="text-[#cccccc]">Choisissez qui éliminer du village.</p>
                  </div>
                )}
              </div>
            </motion.div>

            {/* Player grid */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
              <h3 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff9933]" />
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
                        ? 'bg-[#1a1a1a] border-[#333333]'
                        : 'bg-[#ff3333]/20 border-[#ff3333]/40 opacity-60'
                    } ${player.id === currentPlayer.id ? 'ring-2 ring-[#ff9933]' : ''}`}
                  >
                    <div className="text-center">
                      <div className="flex items-center justify-center gap-2 mb-2">
                        <span className="font-semibold text-[#e0e0e0]">{player.name}</span>
                        {player.isGameMaster && <Crown className="w-4 h-4 text-[#ff9933]" />}
                        {player.isLover && <span className="text-pink-400">💕</span>}
                      </div>
                      
                      {player.status === 'alive' ? (
                        <div className="text-sm text-[#cccccc]">
                          {player.id === currentPlayer.id ? getRoleData(player.role).name : '???'}
                        </div>
                      ) : (
                        <div className="text-sm text-[#ff3333]">
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
            <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
              <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Votre rôle</h3>
              <div className="text-center">
                <div className="text-2xl mb-2">
                  {currentPlayer.role === 'loup-garou' ? '🐺' : '🏠'}
                </div>
                <div className="text-[#e0e0e0] font-semibold mb-1">
                  {getRoleData(currentPlayer.role).name}
                </div>
                <p className="text-sm text-[#cccccc]">
                  {getRoleData(currentPlayer.role).description}
                </p>
              </div>
            </div>

            {/* Game info */}
            <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
              <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Informations</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-[#cccccc]">Nuit:</span>
                  <span className="text-[#e0e0e0]">{currentGame.currentNight}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cccccc]">Joueurs:</span>
                  <span className="text-[#e0e0e0]">{currentGame.players.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-[#cccccc]">Éliminés:</span>
                  <span className="text-[#ff3333]">{deadPlayers.length}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            {currentGame.phase === 'voting' && (
              <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
                <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Voter</h3>
                <p className="text-sm text-[#cccccc] mb-3">
                  Choisissez un joueur à éliminer
                </p>
                <div className="space-y-2">
                  {alivePlayers
                    .filter(p => p.id !== currentPlayer.id)
                    .map(player => (
                      <button
                        key={player.id}
                        className="w-full p-2 bg-[#ff3333]/20 hover:bg-[#ff3333]/30 text-[#e0e0e0] rounded-lg transition-colors text-sm"
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