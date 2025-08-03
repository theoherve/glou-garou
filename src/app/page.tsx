'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Moon, Users, Play, Settings, Eye } from 'lucide-react';
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
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900 relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-purple-500/10 rounded-full blur-xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-500/5 rounded-full blur-2xl animate-pulse delay-500"></div>
      </div>

      {/* Main content */}
      <div className="relative z-10 flex flex-col items-center justify-center min-h-screen px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center"
        >
          {/* Title */}
          <motion.h1 
            className="text-6xl md:text-8xl font-bold text-white mb-4"
          >
            <span className="text-red-500">Glou</span>
            <span className="text-gray-300"> Garou</span>
          </motion.h1>

          {/* Subtitle */}
          <motion.p 
            className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            Le jeu de loup-garou en ligne. Survivez à la nuit ou éliminez les villageois.
          </motion.p>

          {/* Action buttons */}
          <motion.div 
            className="flex flex-col sm:flex-row gap-6 justify-center items-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
          >
            <Link href="/create-game">
              <motion.button
                className="flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play className="w-6 h-6" />
                Créer une partie
              </motion.button>
            </Link>

            <Link href="/join-game">
              <motion.button
                className="flex items-center gap-3 bg-purple-600 hover:bg-purple-700 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-purple-500/25"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Users className="w-6 h-6" />
                Rejoindre une partie
              </motion.button>
            </Link>
          </motion.div>

          {/* Features */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <Moon className="w-12 h-12 text-red-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Nuit Mystérieuse</h3>
              <p className="text-gray-300">Plongez dans l&apos;atmosphère sombre et mystérieuse du village de Thiercelieux</p>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <Users className="w-12 h-12 text-purple-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Jouez en Ligne</h3>
              <p className="text-gray-300">Rejoignez vos amis en temps réel pour des parties épiques</p>
            </div>

            <div className="text-center p-6 bg-white/5 rounded-lg backdrop-blur-sm border border-white/10">
              <Eye className="w-12 h-12 text-blue-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-white mb-2">Rôles Variés</h3>
              <p className="text-gray-300">Découvrez tous les rôles du jeu original avec leurs pouvoirs uniques</p>
            </div>
          </motion.div>

          {/* Rules link */}
          <motion.div 
            className="mt-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8 }}
          >
            <Link href="/rules">
              <button className="text-gray-400 hover:text-white transition-colors duration-300 flex items-center gap-2 mx-auto">
                <Settings className="w-5 h-5" />
                Voir les règles du jeu
              </button>
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Floating particles effect */}
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
    </div>
  );
}
