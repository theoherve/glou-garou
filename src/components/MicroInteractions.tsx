'use client';

import { motion } from 'framer-motion';
import { ReactNode, useState } from 'react';

interface MicroInteractionsProps {
  children: ReactNode;
  className?: string;
  interactionType?: 'hover' | 'click' | 'focus' | 'all';
  intensity?: 'low' | 'medium' | 'high';
}

export const MicroInteractions = ({ 
  children, 
  className = '',
  interactionType = 'all',
  intensity = 'medium'
}: MicroInteractionsProps) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  const getIntensityMultiplier = () => {
    switch (intensity) {
      case 'high': return 1.5;
      case 'medium': return 1;
      case 'low': return 0.5;
      default: return 1;
    }
  };

  const multiplier = getIntensityMultiplier();

  const handleMouseEnter = () => {
    if (interactionType === 'all' || interactionType === 'hover') {
      setIsHovered(true);
    }
  };

  const handleMouseLeave = () => {
    if (interactionType === 'all' || interactionType === 'hover') {
      setIsHovered(false);
    }
  };

  const handleMouseDown = () => {
    if (interactionType === 'all' || interactionType === 'click') {
      setIsClicked(true);
    }
  };

  const handleMouseUp = () => {
    if (interactionType === 'all' || interactionType === 'click') {
      setIsClicked(false);
    }
  };

  const handleFocus = () => {
    if (interactionType === 'all' || interactionType === 'focus') {
      setIsFocused(true);
    }
  };

  const handleBlur = () => {
    if (interactionType === 'all' || interactionType === 'focus') {
      setIsFocused(false);
    }
  };

  return (
    <motion.div
      className={`relative ${className}`}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onMouseDown={handleMouseDown}
      onMouseUp={handleMouseUp}
      onFocus={handleFocus}
      onBlur={handleBlur}
      whileHover={interactionType === 'all' || interactionType === 'hover' ? {
        scale: 1 + (0.02 * multiplier),
        y: -2 * multiplier,
        transition: { duration: 0.2, ease: "easeOut" }
      } : {}}
      whileTap={interactionType === 'all' || interactionType === 'click' ? {
        scale: 1 - (0.05 * multiplier),
        transition: { duration: 0.1, ease: "easeOut" }
      } : {}}
      animate={{
        scale: isClicked ? 1 - (0.05 * multiplier) : 1,
        y: isHovered ? -2 * multiplier : 0,
        filter: isFocused ? `brightness(1.1)` : `brightness(1)`,
      }}
      transition={{
        duration: 0.2,
        ease: "easeOut"
      }}
    >
      {/* Effet de lueur au hover */}
      {(interactionType === 'all' || interactionType === 'hover') && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          animate={{
            opacity: isHovered ? 0.1 : 0,
            background: "radial-gradient(circle at center, rgba(59, 130, 246, 0.2) 0%, transparent 70%)"
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Effet de focus */}
      {(interactionType === 'all' || interactionType === 'focus') && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none border-2 border-transparent"
          animate={{
            borderColor: isFocused ? "rgba(59, 130, 246, 0.5)" : "transparent",
            boxShadow: isFocused ? "0 0 0 3px rgba(59, 130, 246, 0.2)" : "none"
          }}
          transition={{ duration: 0.2 }}
        />
      )}

      {/* Effet de ripple au clic */}
      {(interactionType === 'all' || interactionType === 'click') && isClicked && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ 
            scale: 0, 
            opacity: 0.3,
            background: "radial-gradient(circle, rgba(59, 130, 246, 0.3) 0%, transparent 70%)"
          }}
          animate={{ 
            scale: 2, 
            opacity: 0 
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Contenu principal */}
      <div className="relative z-10">
        {children}
      </div>
    </motion.div>
  );
};

// Composant spécialisé pour les boutons
export const AnimatedButton = ({ 
  children, 
  className = '',
  onClick,
  disabled = false,
  variant = 'primary'
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
}) => {
  const [isPressed, setIsPressed] = useState(false);

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
    }
  };

  return (
    <motion.button
      className={`px-6 py-3 text-white font-semibold rounded-lg transition-all duration-200 ${getVariantStyles()} ${className} ${
        disabled ? 'opacity-50 cursor-not-allowed' : ''
      }`}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { 
        scale: 1.02, 
        y: -2,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled ? { 
        scale: 0.98,
        transition: { duration: 0.1 }
      } : {}}
      onMouseDown={() => setIsPressed(true)}
      onMouseUp={() => setIsPressed(false)}
      onMouseLeave={() => setIsPressed(false)}
    >
      {/* Effet de ripple */}
      {isPressed && !disabled && (
        <motion.div
          className="absolute inset-0 rounded-lg pointer-events-none"
          initial={{ 
            scale: 0, 
            opacity: 0.3,
            background: "radial-gradient(circle, rgba(255, 255, 255, 0.3) 0%, transparent 70%)"
          }}
          animate={{ 
            scale: 2, 
            opacity: 0 
          }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        />
      )}

      {/* Contenu du bouton */}
      <div className="relative z-10 flex items-center justify-center space-x-2">
        {children}
      </div>
    </motion.button>
  );
};

// Composant pour les cartes avec animations
export const AnimatedCard = ({ 
  children, 
  className = '',
  delay = 0,
  direction = 'up'
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  direction?: 'up' | 'down' | 'left' | 'right';
}) => {
  const getInitialPosition = () => {
    switch (direction) {
      case 'up': return { y: 20, opacity: 0 };
      case 'down': return { y: -20, opacity: 0 };
      case 'left': return { x: 20, opacity: 0 };
      case 'right': return { x: -20, opacity: 0 };
      default: return { y: 20, opacity: 0 };
    }
  };

  return (
    <motion.div
      className={className}
      initial={getInitialPosition()}
      animate={{ 
        y: 0, 
        x: 0, 
        opacity: 1 
      }}
      transition={{
        duration: 0.6,
        delay: delay * 0.1,
        ease: "easeOut"
      }}
      whileHover={{
        y: -5,
        transition: { duration: 0.2 }
      }}
    >
      {children}
    </motion.div>
  );
};
