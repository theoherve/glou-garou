"use client";

import { motion } from 'framer-motion';
import { Crown, CheckCircle } from 'lucide-react';

export const Phase5Test = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-gradient-to-r from-green-900/20 to-emerald-900/20 border border-green-500/30 rounded-lg p-6"
    >
      <div className="flex items-center space-x-3 mb-4">
        <CheckCircle className="w-6 h-6 text-green-400" />
        <h3 className="text-lg font-semibold text-green-400">Phase 5 - Interface du Maître de Jeu</h3>
      </div>
      
      <div className="space-y-3 text-sm text-green-200">
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>✅ Panneau de contrôle du maître de jeu</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>✅ Instructions étape par étape</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>✅ Gestionnaire de phases avec timer</span>
        </div>
        <div className="flex items-center space-x-2">
          <CheckCircle className="w-4 h-4 text-green-400" />
          <span>✅ Intégration dans la page principale</span>
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-green-800/20 rounded border border-green-500/20">
        <p className="text-xs text-green-300">
          <Crown className="w-3 h-3 inline mr-1" />
          La Phase 5 est maintenant complètement implémentée et intégrée !
        </p>
      </div>
    </motion.div>
  );
};

