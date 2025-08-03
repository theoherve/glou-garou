'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScaryTransitionProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function ScaryTransition({ isActive, onComplete }: ScaryTransitionProps) {
  const [showGlitch, setShowGlitch] = useState(false);
  const [showDistortion, setShowDistortion] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    // Séquence d'effets effrayants
    const sequence = async () => {
      // Effet de glitch initial
      setShowGlitch(true);
      await new Promise(resolve => setTimeout(resolve, 200));
      setShowGlitch(false);

      // Effet de distorsion
      await new Promise(resolve => setTimeout(resolve, 300));
      setShowDistortion(true);
      await new Promise(resolve => setTimeout(resolve, 500));
      setShowDistortion(false);

      // Deuxième glitch
      await new Promise(resolve => setTimeout(resolve, 200));
      setShowGlitch(true);
      await new Promise(resolve => setTimeout(resolve, 150));
      setShowGlitch(false);

      // Finalisation
      await new Promise(resolve => setTimeout(resolve, 300));
      onComplete?.();
    };

    sequence();
  }, [isActive, onComplete]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] pointer-events-none"
      >
        {/* Overlay principal */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.8 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black"
        />

        {/* Effet de glitch */}
        <AnimatePresence>
          {showGlitch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.3 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-red-500 mix-blend-difference"
            />
          )}
        </AnimatePresence>

        {/* Effet de distorsion */}
        <AnimatePresence>
          {showDistortion && (
            <motion.div
              initial={{ opacity: 0, scale: 1 }}
              animate={{ 
                opacity: 0.2,
                scale: [1, 1.1, 0.9, 1]
              }}
              exit={{ opacity: 0, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="absolute inset-0 bg-gradient-to-r from-red-500 via-purple-500 to-red-500 mix-blend-multiply"
            />
          )}
        </AnimatePresence>

        {/* Lignes de scan */}
        <motion.div
          initial={{ y: -100 }}
          animate={{ y: "100vh" }}
          transition={{ duration: 1, ease: "linear" }}
          className="absolute inset-0"
        >
          <div className="w-full h-1 bg-red-500/50 shadow-lg shadow-red-500/50" />
        </motion.div>

        {/* Particules de glitch */}
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: 0,
              scale: 0
            }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
            }}
            transition={{
              duration: 0.5,
              delay: Math.random() * 0.5,
              ease: "easeInOut"
            }}
            className="absolute w-2 h-2 bg-red-500 rounded-full"
          />
        ))}

        {/* Texte de transition */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -50 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="absolute inset-0 flex items-center justify-center"
        >
          <motion.div
            animate={{ 
              textShadow: [
                "2px 2px 4px rgba(255, 51, 51, 0.3)",
                "2px 2px 8px rgba(255, 51, 51, 0.6)",
                "2px 2px 4px rgba(255, 51, 51, 0.3)"
              ]
            }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-2xl font-bold text-red-500 font-creepster"
          >
            TRANSITION...
          </motion.div>
        </motion.div>

        {/* Effet de pulsation cardiaque */}
        <motion.div
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.1) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.2) 0%, transparent 50%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.1) 0%, transparent 50%)"
            ]
          }}
          transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </AnimatePresence>
  );
} 