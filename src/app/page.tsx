'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Crown, Users, Zap, Copy } from 'lucide-react';
import Link from 'next/link';

export default function HomePage() {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Animated background elements - keeping the floating bubbles */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      {/* Floating particles effect - keeping the existing animation */}
      {windowSize.width > 0 && (
        <div className="absolute inset-0 pointer-events-none">
          {[...Array(20)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white/20 rounded-full"
              initial={{
                x: Math.random() * windowSize.width,
                y: Math.random() * windowSize.height,
              }}
              animate={{
                y: [null, -100],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
              }}
            />
          ))}
        </div>
      )}

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
              <Moon className="w-8 h-8 text-[#ff9933]" />
              <h1 className="text-4xl font-bold text-[#ff9933]">Glou Garou</h1>
            </div>
            <p className="text-[#cccccc] text-lg">
              Le jeu de loup-garou en ligne le plus effrayant
            </p>
          </motion.div>

          {/* Create Game Card */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="bg-[#2a2a2a] rounded-lg p-6 mb-6 border border-[#ff3333]/20"
          >
            <div className="flex items-center gap-2 mb-3">
              <Crown className="w-5 h-5 text-[#ff9933]" />
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
                  placeholder="Entrez votre nom..."
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                />
              </div>
              
              <Link href="/create-game">
                <motion.button
                  className="w-full bg-[#ff3333] hover:bg-[#e62e2e] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
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
              <Users className="w-5 h-5 text-[#ff9933]" />
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
                  placeholder="Entrez votre nom..."
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                />
              </div>
              
              <div>
                <label className="block text-[#e0e0e0] text-sm mb-2">Code de la partie</label>
                <input
                  type="text"
                  placeholder="Ex: WOLF123"
                  className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                />
              </div>
              
              <Link href="/join-game">
                <motion.button
                  className="w-full bg-[#333a45] hover:bg-[#2a3038] text-white py-3 rounded-lg font-semibold transition-colors flex items-center justify-center gap-2"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Users className="w-4 h-4" />
                  Rejoindre la partie
                </motion.button>
              </Link>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="text-center"
          >
            <p className="text-[#cccccc] text-sm flex items-center justify-center gap-2">
              Préparez-vous pour une nuit terrifiante...
              <Moon className="w-4 h-4 text-[#ff9933]" />
            </p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}
