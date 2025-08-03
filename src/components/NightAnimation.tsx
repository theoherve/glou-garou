'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Star, Cloud, Eye, Skull } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NightAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function NightAnimation({ isActive, onComplete }: NightAnimationProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });
  const [showJumpScare, setShowJumpScare] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

  useEffect(() => {
    if (!isActive) return;

    // Jump scare après 2 secondes
    const jumpScareTimer = setTimeout(() => {
      setShowJumpScare(true);
      setTimeout(() => setShowJumpScare(false), 300);
    }, 2000);

    // Effet de glitch après 4 secondes
    const glitchTimer = setTimeout(() => {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 500);
    }, 4000);

    return () => {
      clearTimeout(jumpScareTimer);
      clearTimeout(glitchTimer);
    };
  }, [isActive]);

  if (!isActive) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 bg-[#1a1a1a]/90 backdrop-blur-sm"
        onAnimationComplete={onComplete}
      >
        {/* Jump scare flash */}
        <AnimatePresence>
          {showJumpScare && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.9 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="absolute inset-0 bg-red-500 z-60"
            />
          )}
        </AnimatePresence>

        {/* Effet de glitch */}
        <AnimatePresence>
          {showGlitch && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.2 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="absolute inset-0 bg-red-500 mix-blend-difference z-55"
            />
          )}
        </AnimatePresence>

        {/* Moon avec effet de pulsation */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 50, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.1, 1],
              filter: [
                "drop-shadow(0 0 10px rgba(255, 153, 51, 0.5))",
                "drop-shadow(0 0 20px rgba(255, 153, 51, 0.8))",
                "drop-shadow(0 0 10px rgba(255, 153, 51, 0.5))"
              ]
            }}
            transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
          >
            <Moon className="w-32 h-32 text-[#ff9933]" />
          </motion.div>
        </motion.div>

        {/* Crânes flottants */}
        {windowSize.width > 0 && [...Array(6)].map((_, i) => (
          <motion.div
            key={`skull-${i}`}
            initial={{ 
              x: Math.random() * windowSize.width,
              y: windowSize.height + 50,
              opacity: 0,
              rotate: 0
            }}
            animate={{ 
              y: -50,
              opacity: [0, 0.8, 0],
              rotate: 360
            }}
            transition={{
              duration: Math.random() * 3 + 4,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute"
          >
            <Skull className="w-8 h-8 text-[#ff9933]/60" />
          </motion.div>
        ))}

        {/* Stars avec effet de scintillement */}
        {[...Array(25)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, scale: 0 }}
            animate={{ 
              opacity: [0, 1, 0],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 60}%`,
            }}
          >
            <motion.div
              animate={{ 
                filter: [
                  "drop-shadow(0 0 2px rgba(255, 153, 51, 0.5))",
                  "drop-shadow(0 0 8px rgba(255, 153, 51, 1))",
                  "drop-shadow(0 0 2px rgba(255, 153, 51, 0.5))"
                ]
              }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Star className="w-2 h-2 text-[#ff9933]" fill="#ff9933" />
            </motion.div>
          </motion.div>
        ))}

        {/* Clouds avec effet de distorsion */}
        {windowSize.width > 0 && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -200, opacity: 0 }}
            animate={{ 
              x: windowSize.width + 200,
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: 8,
              repeat: Infinity,
              delay: i * 2,
              ease: "linear"
            }}
            className="absolute"
            style={{
              top: `${20 + Math.random() * 30}%`,
            }}
          >
            <motion.div
              animate={{ 
                filter: [
                  "blur(0px)",
                  "blur(2px)",
                  "blur(0px)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <Cloud className="w-24 h-12 text-[#333333]" />
            </motion.div>
          </motion.div>
        ))}

        {/* Wolf howl effect avec ondes sonores */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 2, 0],
            opacity: [0, 0.6, 0]
          }}
          transition={{
            duration: 4,
            repeat: Infinity,
            delay: 1,
            ease: "easeOut"
          }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <div className="w-4 h-4 bg-[#ff3333] rounded-full" />
        </motion.div>

        {/* Text avec effet de tremblement */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center"
        >
          <motion.h2 
            className="text-4xl font-bold text-[#e0e0e0] mb-4 font-creepster"
            animate={{ 
              textShadow: [
                "2px 2px 4px rgba(255, 51, 51, 0.3)",
                "2px 2px 8px rgba(255, 51, 51, 0.6)",
                "2px 2px 4px rgba(255, 51, 51, 0.3)"
              ]
            }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            La nuit tombe sur Thiercelieux...
          </motion.h2>
          <motion.p 
            className="text-xl text-[#cccccc]"
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Les loups-garous se réveillent
          </motion.p>
        </motion.div>

        {/* Ambient particles avec effet de sang */}
        {windowSize.width > 0 && [...Array(40)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ 
              x: Math.random() * windowSize.width,
              y: windowSize.height + 10,
              opacity: 0
            }}
            animate={{ 
              y: -10,
              opacity: [0, 1, 0]
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "linear"
            }}
            className="absolute w-1 h-1 bg-red-500/40 rounded-full"
          />
        ))}

        {/* Ombres qui bougent */}
        {windowSize.width > 0 && [...Array(8)].map((_, i) => (
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
              opacity: [0, 0.4, 0]
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              delay: Math.random() * 2,
              ease: "easeInOut"
            }}
            className="absolute w-24 h-24 bg-black/30 rounded-full blur-xl"
          />
        ))}

        {/* Effet de respiration sur l'écran */}
        <motion.div
          className="absolute inset-0"
          animate={{ 
            background: [
              "radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.05) 0%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.1) 0%, transparent 70%)",
              "radial-gradient(circle at 50% 50%, rgba(255, 51, 51, 0.05) 0%, transparent 70%)"
            ]
          }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
        />
      </motion.div>
    </AnimatePresence>
  );
} 