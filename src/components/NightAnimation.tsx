'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Moon, Star, Cloud } from 'lucide-react';
import { useEffect, useState } from 'react';

interface NightAnimationProps {
  isActive: boolean;
  onComplete?: () => void;
}

export default function NightAnimation({ isActive, onComplete }: NightAnimationProps) {
  const [windowSize, setWindowSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
  }, []);

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
        {/* Moon */}
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 50, opacity: 1 }}
          transition={{ duration: 2, ease: "easeOut" }}
          className="absolute top-20 left-1/2 transform -translate-x-1/2"
        >
          <Moon className="w-32 h-32 text-[#ff9933]" />
        </motion.div>

        {/* Stars */}
        {[...Array(20)].map((_, i) => (
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
            <Star className="w-2 h-2 text-[#ff9933]" fill="#ff9933" />
          </motion.div>
        ))}

        {/* Clouds */}
        {windowSize.width > 0 && [...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: -200, opacity: 0 }}
            animate={{ 
              x: windowSize.width + 200,
              opacity: [0, 0.3, 0]
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
            <Cloud className="w-24 h-12 text-[#333333]" />
          </motion.div>
        ))}

        {/* Wolf howl effect */}
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ 
            scale: [0, 1.5, 0],
            opacity: [0, 0.5, 0]
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

        {/* Text */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 1 }}
          className="absolute bottom-1/3 left-1/2 transform -translate-x-1/2 text-center"
        >
          <h2 className="text-4xl font-bold text-[#e0e0e0] mb-4">
            La nuit tombe sur Thiercelieux...
          </h2>
          <p className="text-xl text-[#cccccc]">
            Les loups-garous se réveillent
          </p>
        </motion.div>

        {/* Ambient particles */}
        {windowSize.width > 0 && [...Array(30)].map((_, i) => (
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
            className="absolute w-1 h-1 bg-[#ff9933]/30 rounded-full"
          />
        ))}
      </motion.div>
    </AnimatePresence>
  );
} 