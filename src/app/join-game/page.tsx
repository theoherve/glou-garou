'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserPlus, Copy, Check, Moon } from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';

export default function JoinGamePage() {
  const { joinGame, isLoading, error, setError } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);
  const [isValidatingCode, setIsValidatingCode] = useState(false);
  const [codeValidationStatus, setCodeValidationStatus] = useState<'idle' | 'validating' | 'valid' | 'invalid'>('idle');

  // Récupérer les paramètres depuis l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const nameFromUrl = urlParams.get('name');
      const codeFromUrl = urlParams.get('code');
      
      if (nameFromUrl) {
        setPlayerName(decodeURIComponent(nameFromUrl));
      }
      if (codeFromUrl) {
        setRoomCode(decodeURIComponent(codeFromUrl));
      }
    }
  }, []);

  const handleJoinGame = async () => {
    // Validation locale
    setLocalError(null);
    setError(null);
    
    if (!playerName.trim()) {
      setLocalError("Veuillez entrer votre nom");
      return;
    }
    
    if (!roomCode.trim()) {
      setLocalError("Veuillez entrer le code de salle");
      return;
    }
    
    if (playerName.trim().length < 2) {
      setLocalError("Le nom doit contenir au moins 2 caractères");
      return;
    }
    
    if (roomCode.trim().length < 3) {
      setLocalError("Le code de salle doit contenir au moins 3 caractères");
      return;
    }
    
    try {
      await joinGame(roomCode.toUpperCase(), playerName.trim());
    } catch (error) {
      // L'erreur est déjà gérée dans le store, on l'affiche juste
      console.error("Erreur lors de la connexion:", error);
    }
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode.toUpperCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  // Validation du code de salle en temps réel
  const validateRoomCode = async (code: string) => {
    if (code.length < 3) {
      setCodeValidationStatus('idle');
      return;
    }

    setIsValidatingCode(true);
    setCodeValidationStatus('validating');

    try {
      // Appel à l'API pour vérifier si le code existe
      const response = await fetch(`/api/games?roomCode=${code.toUpperCase()}`);
      if (response.ok) {
        const data = await response.json();
        if (data.game) {
          setCodeValidationStatus('valid');
          setLocalError(null);
        } else {
          setCodeValidationStatus('invalid');
        }
      } else {
        setCodeValidationStatus('invalid');
      }
    } catch (error) {
      setCodeValidationStatus('invalid');
    } finally {
      setIsValidatingCode(false);
    }
  };

  // Validation en temps réel du code de salle
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (roomCode.trim().length >= 3) {
        validateRoomCode(roomCode);
      }
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [roomCode]);

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <motion.button
              className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] transition-colors border border-[#ff3333]/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6 text-[#e0e0e0]" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-3">
            <Users className="w-8 h-8 text-[#ff9933]" />
            <h1 className="text-3xl font-bold text-[#e0e0e0] font-creepster">Rejoindre une partie</h1>
          </div>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-[#2a2a2a] rounded-lg p-8 border border-[#ff3333]/20"
          >
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-[#ff9933] mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-[#e0e0e0] mb-2">Rejoindre la partie</h2>
              <p className="text-[#cccccc]">Entrez le code de salle fourni par le maître du jeu</p>
            </div>

            <div className="space-y-6">
              {/* Player name */}
              <div>
                <label className="block text-[#e0e0e0] mb-2 font-medium">Votre nom</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                  placeholder="Entrez votre nom"
                  maxLength={20}
                />
              </div>

              {/* Room code */}
              <div>
                <label className="block text-[#e0e0e0] mb-2 font-medium">Code de la salle</label>
                <div className="flex gap-2">
                  <div className="flex-1 relative">
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      className={`w-full px-4 py-3 bg-[#1a1a1a] border rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none transition-colors font-mono text-center text-lg ${
                        codeValidationStatus === 'valid' 
                          ? 'border-green-500 focus:border-green-500' 
                          : codeValidationStatus === 'invalid' 
                          ? 'border-red-500 focus:border-red-500'
                          : 'border-[#333333] focus:border-[#ff3333]'
                      }`}
                      placeholder="XXXXXX"
                      maxLength={6}
                    />
                    {/* Status indicator */}
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {codeValidationStatus === 'validating' && (
                        <div className="w-5 h-5 border-2 border-[#ff9933]/30 border-t-[#ff9933] rounded-full animate-spin"></div>
                      )}
                      {codeValidationStatus === 'valid' && (
                        <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      )}
                      {codeValidationStatus === 'invalid' && roomCode.length >= 3 && (
                        <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                          <span className="text-white text-xs font-bold">✕</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <motion.button
                    onClick={handleCopyRoomCode}
                    className="px-4 py-3 bg-[#333a45] hover:bg-[#2a3038] text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!roomCode}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                </div>
                {/* Validation message */}
                {codeValidationStatus === 'valid' && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-green-400 text-sm mt-2 flex items-center gap-2"
                  >
                    <Check className="w-4 h-4" />
                    Code de salle valide
                  </motion.p>
                )}
                {codeValidationStatus === 'invalid' && roomCode.length >= 3 && (
                  <motion.p
                    initial={{ opacity: 0, y: -5 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-red-400 text-sm mt-2 flex items-center gap-2"
                  >
                    <span className="w-4 h-4 bg-red-400 rounded-full flex items-center justify-center text-white text-xs">✕</span>
                    Code de salle invalide
                  </motion.p>
                )}
              </div>

              {/* Error Display */}
              {(localError || error) && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-[#ff3333]/10 border border-[#ff3333]/30 rounded-lg p-4"
                >
                  <div className="flex items-center gap-2 text-[#ff3333]">
                    <div className="w-5 h-5 bg-[#ff3333] rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">!</span>
                    </div>
                    <span className="font-medium">
                      {localError || error}
                    </span>
                  </div>
                </motion.div>
              )}

              {/* Join button */}
              <motion.button
                onClick={handleJoinGame}
                disabled={!playerName.trim() || !roomCode.trim() || isLoading || codeValidationStatus !== 'valid'}
                className="w-full bg-[#333a45] hover:bg-[#2a3038] disabled:bg-[#666666] disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                {isLoading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Connexion en cours...
                  </>
                ) : (
                  <>
                    <UserPlus className="w-6 h-6" />
                    Rejoindre la partie
                  </>
                )}
              </motion.button>
            </div>

            {/* Tips */}
            <div className="mt-8 bg-[#333a45]/20 rounded-lg p-4 border border-[#333a45]/30">
              <h3 className="text-[#ff9933] font-semibold mb-2">💡 Comment rejoindre ?</h3>
              <ul className="text-sm text-[#cccccc] space-y-1">
                <li>• Demandez le code de salle au maître du jeu</li>
                <li>• Le code est composé de 6 caractères (lettres et chiffres)</li>
                <li>• Vous recevrez votre rôle une fois dans la salle</li>
              </ul>
            </div>

            {/* Create game link */}
            <div className="mt-6 text-center">
              <p className="text-[#cccccc] mb-2">Vous n&apos;avez pas de code ?</p>
              <Link href="/create-game">
                <motion.button
                  className="text-[#ff9933] hover:text-[#e68a2e] transition-colors font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Créer une nouvelle partie
                </motion.button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 