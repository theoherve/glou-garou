'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

interface ScaryAnimationsProps {
  isActive: boolean;
  intensity?: 'low' | 'medium' | 'high';
  onComplete?: () => void;
}

export default function ScaryAnimations({ 
  isActive, 
  intensity = 'medium',
  onComplete 
}: ScaryAnimationsProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showJumpScare, setShowJumpScare] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);
  const [showMessage, setShowMessage] = useState(false);
  const [messagePosition, setMessagePosition] = useState({ x: 0, y: 0 });
  const [currentMessage, setCurrentMessage] = useState('');

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Jump scare aléatoire
    const jumpScareInterval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% de chance
        setShowJumpScare(true);
        setTimeout(() => setShowJumpScare(false), 200);
      }
    }, 15000); // Toutes les 15 secondes

    // Effet de glitch aléatoire
    const glitchInterval = setInterval(() => {
      if (Math.random() < 0.15) { // 15% de chance
        setShowGlitch(true);
        setTimeout(() => setShowGlitch(false), 300);
      }
    }, 20000); // Toutes les 20 secondes

    // Messages effrayants rares et aléatoires
    const messageInterval = setInterval(() => {
      if (Math.random() < 0.1) { // 10% de chance
        const messages = [
          "Ils vous regardent...",
          "La nuit est leur domaine...",
          "Vous ne pouvez pas vous cacher...",
          "Les ombres bougent...",
          "Quelque chose vous observe...",
          "La lune est rouge ce soir...",
          "Les loups hurlent au loin...",
          "La mort rôde dans l'ombre..."
        ];
        
        setCurrentMessage(messages[Math.floor(Math.random() * messages.length)]);
        setMessagePosition({
          x: Math.random() * (windowSize.width - 200),
          y: Math.random() * (windowSize.height - 100)
        });
        setShowMessage(true);
        setTimeout(() => setShowMessage(false), 3000);
      }
    }, 30000); // Toutes les 30 secondes

    return () => {
      clearInterval(jumpScareInterval);
      clearInterval(glitchInterval);
      clearInterval(messageInterval);
    };
  }, [isActive, windowSize.width, windowSize.height]);

  if (!isActive) return null;

  const particleCount = intensity === 'high' ? 50 : intensity === 'medium' ? 30 : 15;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 pointer-events-none z-40">
        {/* Flash rouge intermittent */}
        <motion.div
          className="absolute inset-0 red-flash"
          style={{ animationDelay: '2s' }}
        />

        {/* Jump scare flash */}
        <AnimatePresence>
          {showJumpScare && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.8 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-red-500 z-50"
            />
          )}
        </AnimatePresence>

        {/* Effet de glitch sur l'écran */}
        <AnimatePresence>
          {showGlitch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-red-500 mix-blend-difference z-40"
            />
          )}
        </AnimatePresence>

        {/* Gouttes de sang en background */}
        {windowSize.width > 0 && [...Array(particleCount)].map((_, i) => (
          <motion.div
            key={`blood-bg-${i}`}
            className="absolute w-1 h-1 bg-red-600/30 rounded-full blood-drop-bg"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 8}s`,
              animationDuration: `${6 + Math.random() * 4}s`,
            }}
          />
        ))}

        {/* Particules de sang */}
        {windowSize.width > 0 && [...Array(particleCount)].map((_, i) => (
          <motion.div
            key={`blood-${i}`}
            className="absolute w-1 h-1 bg-red-600 rounded-full blood-drop"
            style={{
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 4}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}

        {/* Effet de respiration sur les éléments */}
        <motion.div
          className="absolute inset-0 breathe"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.1) 0%, transparent 70%)',
          }}
        />

        {/* Ombres qui bougent */}
        {windowSize.width > 0 && [...Array(6)].map((_, i) => (
          <motion.div
            key={`shadow-${i}`}
            initial={{ 
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              opacity: 0 
            }}
            animate={{ 
              x: Math.random() * windowSize.width,
              y: Math.random() * windowSize.height,
              opacity: [0, 0.3, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute w-20 h-20 bg-black/20 rounded-full blur-xl"
          />
        ))}

        {/* Effet de distorsion sur les bords */}
        <motion.div
          className="absolute inset-0 distort"
          style={{
            background: 'linear-gradient(45deg, transparent 0%, rgba(255, 51, 51, 0.05) 50%, transparent 100%)',
          }}
        />

        {/* Messages effrayants rares et aléatoires */}
        <AnimatePresence>
          {showMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{ duration: 0.5 }}
              className="absolute text-red-500 font-creepster text-lg text-shake z-50"
              style={{
                left: messagePosition.x,
                top: messagePosition.y,
              }}
            >
              {currentMessage}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Effet de pulsation cardiaque sur l'écran */}
        <motion.div
          className="absolute inset-0 heartbeat"
          style={{
            background: 'radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.05) 0%, transparent 50%)',
          }}
        />
      </div>
    </AnimatePresence>
  );
} 