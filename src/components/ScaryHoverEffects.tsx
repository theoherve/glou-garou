'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface ScaryHoverEffectsProps {
  children: ReactNode;
  intensity?: 'low' | 'medium' | 'high';
  className?: string;
}

export default function ScaryHoverEffects({ 
  children, 
  intensity = 'medium',
  className = ''
}: ScaryHoverEffectsProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showGlitch, setShowGlitch] = useState(false);

  const handleMouseEnter = () => {
    setIsHovered(true);
    
    // Effet de glitch aléatoire
    if (Math.random() < 0.3) {
      setShowGlitch(true);
      setTimeout(() => setShowGlitch(false), 200);
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'high': return 1.5;
      case 'medium': return 1;
      case 'low': return 0.5;
      default: return 1;
    }
  };

  const multiplier = getIntensityMultiplier();

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      whileHover={{ 
        filter: isHovered ? "brightness(1.1)" : "brightness(1)"
      }}
      transition={{ 
        duration: 0.3
      }}
    >
      {/* Effet de lueur rouge au hover */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          background: isHovered 
            ? "radial-gradient(circle at center, rgba(255, 51, 51, 0.1) 0%, transparent 70%)"
            : "transparent"
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Effet de glitch */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={{
          opacity: showGlitch ? 0.2 : 0,
          filter: showGlitch ? "hue-rotate(180deg)" : "hue-rotate(0deg)"
        }}
        transition={{ duration: 0.2 }}
        style={{
          background: "linear-gradient(45deg, transparent 0%, rgba(255, 51, 51, 0.3) 50%, transparent 100%)"
        }}
      />

      {/* Effet de tremblement */}
      <motion.div
        className="absolute inset-0 rounded-lg pointer-events-none"
        animate={isHovered ? {
          x: [0, -1, 1, -1, 0],
          y: [0, 1, -1, 1, 0],
        } : {
          x: 0,
          y: 0
        }}
        transition={{ 
          duration: 0.1,
          repeat: isHovered ? Infinity : 0,
          repeatType: "reverse"
        }}
        style={{
          background: "rgba(255, 51, 51, 0.05)"
        }}
      />

      {/* Particules de sang au hover */}
      {isHovered && [...Array(5)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-1 h-1 bg-red-500 rounded-full pointer-events-none"
          initial={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: 0,
            scale: 0
          }}
          animate={{
            x: Math.random() * 100,
            y: Math.random() * 100,
            opacity: [0, 1, 0],
            scale: [0, 1, 0]
          }}
          transition={{
            duration: 1,
            delay: i * 0.1,
            ease: "easeOut"
          }}
        />
      ))}

      {/* Contenu principal */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
} 