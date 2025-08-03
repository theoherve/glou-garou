'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, UserPlus, Copy, Check } from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';

export default function JoinGamePage() {
  const { joinGame, isLoading } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [copied, setCopied] = useState(false);

  const handleJoinGame = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;
    await joinGame(roomCode.toUpperCase(), playerName);
  };

  const handleCopyRoomCode = () => {
    if (roomCode) {
      navigator.clipboard.writeText(roomCode.toUpperCase());
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <motion.button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Rejoindre une partie</h1>
        </motion.div>

        <div className="max-w-md mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white/5 rounded-lg p-8 backdrop-blur-sm border border-white/10"
          >
            <div className="text-center mb-8">
              <Users className="w-16 h-16 text-purple-400 mx-auto mb-4" />
              <h2 className="text-2xl font-semibold text-white mb-2">Rejoindre la partie</h2>
              <p className="text-gray-300">Entrez le code de salle fourni par le maître du jeu</p>
            </div>

            <div className="space-y-6">
              {/* Player name */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Votre nom</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors"
                  placeholder="Entrez votre nom"
                  maxLength={20}
                />
              </div>

              {/* Room code */}
              <div>
                <label className="block text-gray-300 mb-2 font-medium">Code de la salle</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roomCode}
                    onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                    className="flex-1 px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-purple-500 transition-colors font-mono text-center text-lg"
                    placeholder="XXXXXX"
                    maxLength={6}
                  />
                  <motion.button
                    onClick={handleCopyRoomCode}
                    className="px-4 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    disabled={!roomCode}
                  >
                    {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                  </motion.button>
                </div>
              </div>

              {/* Join button */}
              <motion.button
                onClick={handleJoinGame}
                disabled={!playerName.trim() || !roomCode.trim() || isLoading}
                className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
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
            <div className="mt-8 bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
              <h3 className="text-blue-400 font-semibold mb-2">💡 Comment rejoindre ?</h3>
              <ul className="text-sm text-gray-300 space-y-1">
                <li>• Demandez le code de salle au maître du jeu</li>
                <li>• Le code est composé de 6 caractères (lettres et chiffres)</li>
                <li>• Vous recevrez votre rôle une fois dans la salle</li>
              </ul>
            </div>

            {/* Create game link */}
            <div className="mt-6 text-center">
              <p className="text-gray-400 mb-2">Vous n&apos;avez pas de code ?</p>
              <Link href="/create-game">
                <motion.button
                  className="text-purple-400 hover:text-purple-300 transition-colors font-medium"
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