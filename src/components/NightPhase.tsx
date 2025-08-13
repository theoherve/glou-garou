'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon } from 'lucide-react';
import { useGameStore } from '@/store/gameStore';

interface NightPhaseProps {
  isActive: boolean;
  onPhaseComplete: () => void;
}

export const NightPhase = ({ isActive, onPhaseComplete }: NightPhaseProps) => {
  const { currentGame } = useGameStore();

  if (!isActive || !currentGame) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-40 bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900">
      <div className="absolute inset-0 bg-gradient-to-b from-gray-800/20 to-purple-800/20" />
      
      <motion.div
        animate={{ 
          scale: [1, 1.1, 1],
          filter: ["drop-shadow(0 0 20px rgba(255, 255, 255, 0.3))"]
        }}
        transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-8 right-8"
      >
        <Moon className="w-16 h-16 text-yellow-200" />
      </motion.div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-white mb-4">
            🌙 Phase de Nuit
          </h1>
          <p className="text-xl text-gray-300">
            Les rôles spéciaux agissent dans l'ombre...
          </p>
        </motion.div>

        <div className="bg-gray-800/80 backdrop-blur-sm rounded-2xl p-8 max-w-2xl w-full border border-gray-600">
          <div className="text-center">
            <p className="text-gray-300 mb-6">
              Phase de nuit en cours...
            </p>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={onPhaseComplete}
              className="bg-blue-500 hover:bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold transition-all"
            >
              Terminer la phase de nuit
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};
