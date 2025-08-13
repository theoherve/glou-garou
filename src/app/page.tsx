'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Crown, Users, Zap, Eye, Skull } from 'lucide-react';
import Link from 'next/link';
import ScaryAnimations from '@/components/ScaryAnimations';
import { JoinGameTest } from '@/components/JoinGameTest';

export default function HomePage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [gameMasterName, setGameMasterName] = useState('');
  const [playerName, setPlayerName] = useState('');
  const [roomCode, setRoomCode] = useState('');
  const [showScaryAnimations, setShowScaryAnimations] = useState(false);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Activer les animations effrayantes après 3 secondes
    const timer = setTimeout(() => {
      setShowScaryAnimations(true);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const handleInputFocus = () => {
    // Effet de tremblement lors du focus sur les inputs
    const inputs = document.querySelectorAll('input');
    inputs.forEach(input => {
      input.classList.add('text-shake');
      setTimeout(() => input.classList.remove('text-shake'), 500);
    });
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Animations effrayantes */}
      <ScaryAnimations isActive={showScaryAnimations} intensity="medium" />

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="w-full max-w-md mx-auto"
        >
          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-center mb-8"
          >
            <div className="flex items-center justify-center gap-3 mb-2">
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Moon className="w-8 h-8 text-[#ff9933]" />
              </motion.div>
              <motion.h1 
                className="text-4xl font-bold text-[#ff9933] font-creepster title-pulse"
                animate={{ 
                  textShadow: [
                    "2px 2px 4px rgba(255, 51, 51, 0.3)",
                    "2px 2px 8px rgba(255, 51, 51, 0.6)",
                    "2px 2px 4px rgba(255, 51, 51, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Glou Garou
              </motion.h1>
            </div>
            <motion.p 
              className="text-[#cccccc] text-lg"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              Le jeu de loup-garou en ligne le plus effrayant
            </motion.p>
          </motion.div>

          {/* Create Game Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-[#2a2a2a] rounded-lg p-6 mb-6 border border-[#ff3333]/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ rotate: [0, 5, -5, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <Crown className="w-5 h-5 text-[#ff9933]" />
              </motion.div>
              <h2 className="text-[#e0e0e0] font-semibold text-lg">Créer une partie</h2>
            </div>
            <p className="text-[#cccccc] text-sm mb-4">
              Devenir maître du jeu et configurer la partie
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#e0e0e0] text-sm mb-2">Votre nom</label>
                <input
                  type="text"
                  value={gameMasterName}
                  onChange={(e) => setGameMasterName(e.target.value)}
                  onFocus={handleInputFocus}
                  placeholder="Entrez votre nom..."
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                />
              </div>
              
              <Link href={`/create-game?name=${encodeURIComponent(gameMasterName)}`}>
                <motion.button
                  disabled={!gameMasterName.trim()}
                  className="w-full bg-[#ff3333] hover:bg-[#e62e2e] disabled:bg-[#666666] disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: gameMasterName.trim() ? 1.02 : 1 }}
                  whileTap={{ scale: gameMasterName.trim() ? 0.98 : 1 }}
                  animate={gameMasterName.trim() ? { 
                    boxShadow: [
                      "0 0 0 rgba(255, 51, 51, 0)",
                      "0 0 20px rgba(255, 51, 51, 0.5)",
                      "0 0 0 rgba(255, 51, 51, 0)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Zap className="w-4 h-4" />
                  Créer une nouvelle partie
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Join Game Card */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="bg-[#2a2a2a] rounded-lg p-6 mb-6 border border-[#ff3333]/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Users className="w-5 h-5 text-[#ff9933]" />
              </motion.div>
              <h2 className="text-[#e0e0e0] font-semibold text-lg">Rejoindre une partie</h2>
            </div>
            <p className="text-[#cccccc] text-sm mb-4">
              Entrer le code de la partie pour rejoindre vos amis
            </p>
            
            <div className="space-y-4">
              <div>
                <label className="block text-[#e0e0e0] text-sm mb-2">Votre nom</label>
                <input
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  onFocus={handleInputFocus}
                  placeholder="Entrez votre nom..."
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[#e0e0e0] text-sm mb-2">Code de la partie</label>
                <input
                  type="text"
                  value={roomCode}
                  onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                  onFocus={handleInputFocus}
                  placeholder="Ex: WOLF123"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                />
              </div>
              
              <Link href={`/join-game?name=${encodeURIComponent(playerName)}&code=${encodeURIComponent(roomCode)}`}>
                <motion.button
                  disabled={!playerName.trim() || !roomCode.trim()}
                  className="w-full bg-[#333a45] hover:bg-[#2a3038] disabled:bg-[#666666] disabled:cursor-not-allowed text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: (playerName.trim() && roomCode.trim()) ? 1.02 : 1 }}
                  whileTap={{ scale: (playerName.trim() && roomCode.trim()) ? 0.98 : 1 }}
                  animate={(playerName.trim() && roomCode.trim()) ? { 
                    boxShadow: [
                      "0 0 0 rgba(51, 58, 69, 0)",
                      "0 0 20px rgba(51, 58, 69, 0.5)",
                      "0 0 0 rgba(51, 58, 69, 0)"
                    ]
                  } : {}}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Users className="w-4 h-4" />
                  Rejoindre la partie
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Composant de test pour rejoindre une partie */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="mb-6"
          >
            <JoinGameTest />
          </motion.div>

          {/* Footer avec icônes effrayantes */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center"
          >
            <div className="flex items-center justify-center gap-4 mb-2">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Eye className="w-4 h-4 text-[#ff3333]" />
              </motion.div>
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              >
                <Skull className="w-4 h-4 text-[#ff9933]" />
              </motion.div>
              <motion.div
                animate={{ rotate: [0, -360] }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
              >
                <Eye className="w-4 h-4 text-[#ff3333]" />
              </motion.div>
            </div>
            <motion.p 
              className="text-[#cccccc] text-sm flex items-center justify-center gap-2"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Préparez-vous pour une nuit terrifiante...
              <Moon className="w-4 h-4 text-[#ff9933]" />
            </motion.p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
