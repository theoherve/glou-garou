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
import { GameMasterPanel } from '@/components/GameMasterPanel';
import NightAnimation from '@/components/NightAnimation';
import { GameSocketHandler } from '@/components/GameSocketHandler';
import { RealtimeProvider } from '@/components/RealtimeProvider';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { ConnectedPlayers } from '@/components/ConnectedPlayers';
import { GameActions } from '@/components/GameActions';

import { DatabaseSync } from '@/components/DatabaseSync';
import { DatabaseSyncTest } from '@/components/DatabaseSyncTest';
import { GameHistory } from '@/components/GameHistory';
import { ApiTest } from '@/components/ApiTest';
import { DebugPanel } from '@/components/DebugPanel';
import { Game, Player, Role, PlayerStatus } from '@/types/game';

interface GamePageProps {
  params: Promise<{
    roomCode: string;
  }>;
}

function GamePageClient({ params }: { params: Promise<{ roomCode: string }> }) {
  const [roomCode, setRoomCode] = useState<string>('');
  const { currentGame, currentPlayer, isLoading, error, setCurrentGame, setCurrentPlayer } = useGameStore();
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

  // Charger le jeu depuis la base de données si pas encore chargé
  useEffect(() => {
    if (roomCode && !currentGame) {
      const loadGame = async () => {
        try {
          console.log('Chargement du jeu depuis la base de données...');
          console.log('RoomCode:', roomCode);
          
          // Récupérer le jeu par le code de salle
          const response = await fetch(`/api/games?roomCode=${roomCode}`);
          console.log('Response status:', response.status);
          
          if (response.ok) {
            const gameData = await response.json();
            console.log('Jeu récupéré:', gameData);
            console.log('Structure des données:', {
              hasGame: !!gameData.game,
              hasPlayers: !!gameData.players,
              gameKeys: gameData.game ? Object.keys(gameData.game) : 'no game',
              playersLength: gameData.players ? gameData.players.length : 'no players'
            });
            
            if (gameData.game) {
              // Les joueurs sont déjà inclus dans gameData.game.players
              const players = gameData.game.players || [];
              console.log('Joueurs récupérés depuis gameData:', players);
              
              // Convertir les données de la base vers le format du store
              const game: Game = {
                id: gameData.game.id,
                roomCode: gameData.game.room_code,
                phase: gameData.game.phase as GamePhase,
                players: players,
                gameMasterId: gameData.game.game_master_id,
                currentNight: gameData.game.current_night,
                eliminatedPlayers: [],
                gameSettings: gameData.game.game_settings,
                createdAt: new Date(gameData.game.created_at),
                updatedAt: new Date(gameData.game.updated_at),
              };
              
              console.log('Jeu converti:', game);
              console.log('Nombre de joueurs:', game.players.length);
              
              setCurrentGame(game);
              console.log('Jeu défini dans le store');
              
              // Trouver le joueur maître parmi les joueurs récupérés
              const gameMaster = players.find((p: any) => p.is_game_master);
              if (gameMaster) {
                const player: Player = {
                  id: gameMaster.id,
                  name: gameMaster.name,
                  role: gameMaster.role as Role,
                  status: gameMaster.status as PlayerStatus,
                  isGameMaster: gameMaster.is_game_master,
                  isLover: gameMaster.is_lover,
                  loverId: gameMaster.lover_id || undefined,
                  hasUsedAbility: gameMaster.has_used_ability,
                  voteTarget: gameMaster.vote_target || undefined,
                };
                setCurrentPlayer(player);
                console.log('Joueur maître défini:', player);
              } else {
                console.log('Pas de joueur maître trouvé parmi les joueurs');
              }
            } else {
              console.error('Pas de jeu trouvé dans gameData.game');
            }
          } else {
            console.error('Erreur lors du chargement du jeu:', response.status);
            const errorText = await response.text();
            console.error('Erreur détaillée:', errorText);
          }
        } catch (error) {
          console.error('Erreur lors du chargement du jeu:', error);
        }
      };
      
      loadGame();
    }
  }, [roomCode, currentGame, setCurrentGame, setCurrentPlayer]);

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
          <p className="text-[#cccccc]">Chargement...</p>
        </div>
      </div>
    );
  }

  // Show loading while game is loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-[#ff3333]/30 border-t-[#ff3333] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-[#cccccc]">Chargement du jeu...</p>
        </div>
      </div>
    );
  }

  // Show error if there is one
  if (error) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#ff3333] text-2xl mb-4">❌</div>
          <p className="text-[#cccccc] mb-4">Erreur: {error}</p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-[#ff3333] text-white rounded-lg hover:bg-[#ff3333]/80 transition-colors"
          >
            Réessayer
          </button>
        </div>
      </div>
    );
  }

  // Show error if no game or player
  if (!currentGame || !currentPlayer) {
    return (
      <div className="min-h-screen bg-[#1a1a1a] flex items-center justify-center">
        <div className="text-center">
          <div className="text-[#ff3333] text-2xl mb-4">❌</div>
          <p className="text-[#cccccc] mb-4">Jeu ou joueur non trouvé</p>
          <button
            onClick={() => window.history.back()}
            className="px-4 py-2 bg-[#ff3333] text-white rounded-lg hover:bg-[#ff3333]/80 transition-colors"
          >
            Retour
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#1a1a1a] text-white">
      {/* Header */}
      <header className="bg-[#2a2a2a] border-b border-[#ff3333]/20 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <h1 className="text-2xl font-bold text-[#ff3333]">Glou-Garou</h1>
            <div className="flex items-center space-x-2">
              {getPhaseIcon(currentGame.phase)}
              <span className="text-[#e0e0e0]">{getPhaseText(currentGame.phase)}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-4">
            {/* Room Code */}
            <div className="flex items-center space-x-2">
              <span className="text-[#cccccc]">Code:</span>
              <code className="bg-[#1a1a1a] px-2 py-1 rounded text-[#ff3333] font-mono">
                {roomCode}
              </code>
              <button
                onClick={handleCopyRoomCode}
                className="p-1 hover:bg-[#ff3333]/20 rounded transition-colors"
                title="Copier le code"
              >
                {copied ? <Check className="w-4 h-4 text-green-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Sound Toggle */}
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="p-2 hover:bg-[#ff3333]/20 rounded transition-colors"
              title={isMuted ? "Activer le son" : "Désactiver le son"}
            >
              {isMuted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
            </button>

            {/* Settings */}
            <button className="p-2 hover:bg-[#ff3333]/20 rounded transition-colors" title="Paramètres">
              <Settings className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Game Area */}
          <div className="lg:col-span-2 space-y-6">
            {/* Connected Players */}
            <ConnectedPlayers />

            {/* Game Master Panel */}
            {isGameMaster && (
              <GameMasterPanel currentGame={currentGame} currentPlayer={currentPlayer} />
            )}

            {/* Game Actions */}
            <GameActions 
              currentPhase={currentGame.phase}
              currentPlayer={currentPlayer}
              alivePlayers={alivePlayers}
            />


            
            {/* Database Sync Test (temporaire pour le développement) */}
            <DatabaseSyncTest roomCode={roomCode} />
            
            {/* API Test (temporaire pour le développement) */}
            <ApiTest roomCode={roomCode} />
            
            {/* Panel de débogage (temporaire pour le développement) */}
            <DebugPanel roomCode={roomCode} />

            {/* Players Grid */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
              <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center">
                <Users className="w-5 h-5 mr-2" />
                Joueurs ({alivePlayers.length} vivants, {deadPlayers.length} éliminés)
              </h2>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {currentGame.players.map((player) => {
                  const isDead = player.status !== 'alive';
                  const isCurrentPlayer = player.id === currentPlayer.id;
                  
                  return (
                    <motion.div
                      key={player.id}
                      className={`relative p-4 rounded-lg border transition-all ${
                        isDead
                          ? 'bg-[#ff3333]/10 border-[#ff3333]/30 text-[#ff3333]'
                          : 'bg-[#1a1a1a] border-[#ff3333]/20 text-[#e0e0e0] hover:border-[#ff3333]/40'
                      } ${isCurrentPlayer ? 'ring-2 ring-[#ff3333]' : ''}`}
                      whileHover={!isDead ? { scale: 1.02 } : {}}
                      whileTap={!isDead ? { scale: 0.98 } : {}}
                    >
                      {/* Player Status Indicator */}
                      <div className="absolute top-2 right-2">
                        {isDead ? (
                          <div className="w-3 h-3 bg-[#ff3333] rounded-full"></div>
                        ) : (
                          <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>

                      {/* Player Info */}
                      <div className="text-center">
                        <div className="text-2xl mb-2">
                          {player.role === 'loup-garou' ? '🐺' : '🏠'}
                        </div>
                        <div className="font-semibold mb-1 truncate">
                          {player.name}
                          {isCurrentPlayer && <span className="text-[#ff3333] ml-1">(Vous)</span>}
                        </div>
                        <div className="text-xs text-[#cccccc]">
                          {isDead ? 'Éliminé' : getRoleData(player.role).name}
                        </div>
                      </div>

                      {/* Game Master Badge */}
                      {player.isGameMaster && (
                        <div className="absolute top-2 left-2">
                          <Crown className="w-4 h-4 text-[#ff9933]" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            </div>
          </div>

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

            {/* Game History */}
            <GameHistory roomCode={roomCode} />

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
      </main>

      {/* Night Animation */}
      <NightAnimation 
        isActive={showNightAnimation} 
        onComplete={() => setShowNightAnimation(false)}
      />
    </div>
  );
}

function GameSocketWrapper({ params }: GamePageProps) {
  const [roomCode, setRoomCode] = useState<string>('');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setRoomCode(resolvedParams.roomCode);
    };
    resolveParams();
  }, [params]);

  if (!roomCode) return null;
  return <GameSocketHandler roomCode={roomCode} />;
}

function GamePageWrapper({ params }: GamePageProps) {
  const [roomCode, setRoomCode] = useState<string>('');

  useEffect(() => {
    const resolveParams = async () => {
      const resolvedParams = await params;
      setRoomCode(resolvedParams.roomCode);
    };
    resolveParams();
  }, [params]);

  if (!roomCode) return null;

  return (
    <RealtimeProvider roomCode={roomCode}>
      <DatabaseSync roomCode={roomCode} />
      <GamePageClient params={params} />
      {/* Temporairement désactivé - remplacé par Supabase Realtime
      <GameSocketWrapper params={params} /> 
      */}
      <ConnectionStatus />
    </RealtimeProvider>
  );
}

export default function GamePage({ params }: GamePageProps) {
  return <GamePageWrapper params={params} />;
} 