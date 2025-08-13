'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState, useRef } from 'react';
import { 
  Sparkles, 
  Zap, 
  Star, 
  Heart, 
  Moon, 
  Sun,
  Droplets,
  Flame,
  Wind
} from 'lucide-react';

interface ParticleEffectProps {
  isActive: boolean;
  type: 'sparkles' | 'stars' | 'hearts' | 'zaps' | 'droplets' | 'flames';
  count?: number;
  duration?: number;
  className?: string;
}

export const ParticleEffect = ({ 
  isActive, 
  type, 
  count = 20, 
  duration = 3,
  className = ''
}: ParticleEffectProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 0.5 + 0.5,
        delay: Math.random() * duration
      }));
      setParticles(newParticles);
    }
  }, [isActive, count, duration]);

  const getParticleIcon = (type: string) => {
    switch (type) {
      case 'sparkles':
        return <Sparkles className="w-full h-full" />;
      case 'stars':
        return <Star className="w-full h-full" />;
      case 'hearts':
        return <Heart className="w-full h-full" />;
      case 'zaps':
        return <Zap className="w-full h-full" />;
      case 'droplets':
        return <Droplets className="w-full h-full" />;
      case 'flames':
        return <Flame className="w-full h-full" />;
      default:
        return <Sparkles className="w-full h-full" />;
    }
  };

  const getParticleColor = (type: string) => {
    switch (type) {
      case 'sparkles':
        return 'text-yellow-400';
      case 'stars':
        return 'text-blue-400';
      case 'hearts':
        return 'text-pink-400';
      case 'zaps':
        return 'text-purple-400';
      case 'droplets':
        return 'text-cyan-400';
      case 'flames':
        return 'text-orange-400';
      default:
        return 'text-yellow-400';
    }
  };

  if (!isActive) return null;

  return (
    <div className={`absolute inset-0 pointer-events-none ${className}`}>
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className={`absolute ${getParticleColor(type)}`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size * 1.5}rem`,
            height: `${particle.size * 1.5}rem`
          }}
          initial={{ 
            opacity: 0, 
            scale: 0, 
            rotate: 0 
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360],
            y: [0, -50, -100]
          }}
          transition={{
            duration: duration,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeOut"
          }}
        >
          {getParticleIcon(type)}
        </motion.div>
      ))}
    </div>
  );
};

// Composant pour les effets de particules en arrière-plan
interface BackgroundParticlesProps {
  isActive: boolean;
  density?: 'low' | 'medium' | 'high';
  speed?: 'slow' | 'normal' | 'fast';
}

export const BackgroundParticles = ({ 
  isActive, 
  density = 'medium',
  speed = 'normal'
}: BackgroundParticlesProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    size: number;
    opacity: number;
    speed: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const count = density === 'low' ? 15 : density === 'medium' ? 30 : 50;
      const speedMultiplier = speed === 'slow' ? 0.5 : speed === 'normal' ? 1 : 2;
      
      const newParticles = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 2 + 1,
        opacity: Math.random() * 0.3 + 0.1,
        speed: (Math.random() * 0.5 + 0.5) * speedMultiplier
      }));
      setParticles(newParticles);
    }
  }, [isActive, density, speed]);

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute bg-white/20 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            opacity: particle.opacity
          }}
          animate={{
            y: [0, -100, -200],
            opacity: [particle.opacity, particle.opacity * 0.5, 0]
          }}
          transition={{
            duration: 20 / particle.speed,
            repeat: Infinity,
            ease: "linear"
          }}
        />
      ))}
    </div>
  );
};

// Composant pour les effets de distorsion
interface DistortionEffectProps {
  isActive: boolean;
  intensity?: number;
  duration?: number;
}

export const DistortionEffect = ({ 
  isActive, 
  intensity = 1,
  duration = 2
}: DistortionEffectProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-10"
      animate={{
        filter: [
          "hue-rotate(0deg) saturate(1) brightness(1)",
          `hue-rotate(${30 * intensity}deg) saturate(${1 + intensity * 0.2}) brightness(${1 + intensity * 0.1})`,
          "hue-rotate(0deg) saturate(1) brightness(1)"
        ]
      }}
      transition={{
        duration: duration,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    >
      {/* Effet de distorsion sur les bords */}
      <motion.div
        className="absolute inset-0"
        animate={{
          background: [
            "radial-gradient(circle at 0% 0%, rgba(255, 51, 51, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 100% 100%, rgba(59, 130, 246, 0.1) 0%, transparent 50%)",
            "radial-gradient(circle at 0% 0%, rgba(255, 51, 51, 0.1) 0%, transparent 50%)"
          ]
        }}
        transition={{
          duration: duration * 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </motion.div>
  );
};

// Composant pour les effets de pulsation
interface PulseEffectProps {
  isActive: boolean;
  color?: string;
  frequency?: number;
  size?: number;
}

export const PulseEffect = ({ 
  isActive, 
  color = "rgba(59, 130, 246, 0.3)",
  frequency = 2,
  size = 100
}: PulseEffectProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-5"
      animate={{
        background: [
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent ${size}%)`,
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent ${size * 1.5}%)`,
          `radial-gradient(circle at 50% 50%, ${color} 0%, transparent ${size}%)`
        ]
      }}
      transition={{
        duration: frequency,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Composant pour les effets de glitch
interface GlitchEffectProps {
  isActive: boolean;
  intensity?: number;
  frequency?: number;
}

export const GlitchEffect = ({ 
  isActive, 
  intensity = 1,
  frequency = 0.5
}: GlitchEffectProps) => {
  const [glitchActive, setGlitchActive] = useState(false);

  useEffect(() => {
    if (!isActive) return;

    const glitchInterval = setInterval(() => {
      if (Math.random() < intensity * 0.3) {
        setGlitchActive(true);
        setTimeout(() => setGlitchActive(false), 100);
      }
    }, frequency * 1000);

    return () => clearInterval(glitchInterval);
  }, [isActive, intensity, frequency]);

  if (!isActive || !glitchActive) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-20"
      initial={{ opacity: 0 }}
      animate={{ opacity: 0.1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.1 }}
      style={{
        background: "linear-gradient(45deg, transparent 0%, rgba(255, 51, 51, 0.3) 50%, transparent 100%)",
        filter: "hue-rotate(180deg)"
      }}
    />
  );
};

// Composant pour les effets de respiration
interface BreathingEffectProps {
  isActive: boolean;
  intensity?: number;
  speed?: number;
}

export const BreathingEffect = ({ 
  isActive, 
  intensity = 1,
  speed = 4
}: BreathingEffectProps) => {
  if (!isActive) return null;

  return (
    <motion.div
      className="fixed inset-0 pointer-events-none z-5"
      animate={{
        background: [
          `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, ${0.05 * intensity}) 0%, transparent 70%)`,
          `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, ${0.1 * intensity}) 0%, transparent 70%)`,
          `radial-gradient(circle at 50% 50%, rgba(255, 51, 51, ${0.05 * intensity}) 0%, transparent 70%)`
        ]
      }}
      transition={{
        duration: speed,
        repeat: Infinity,
        ease: "easeInOut"
      }}
    />
  );
};

// Composant pour les effets de météo
interface WeatherEffectProps {
  isActive: boolean;
  type: 'rain' | 'snow' | 'fog' | 'wind';
  intensity?: number;
}

export const WeatherEffect = ({ 
  isActive, 
  type,
  intensity = 1
}: WeatherEffectProps) => {
  const [drops, setDrops] = useState<Array<{
    id: number;
    x: number;
    delay: number;
    size: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const count = Math.floor(intensity * 50);
      const newDrops = Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2,
        size: Math.random() * 2 + 1
      }));
      setDrops(newDrops);
    }
  }, [isActive, intensity]);

  const getDropIcon = () => {
    switch (type) {
      case 'rain':
        return <Droplets className="w-full h-full text-blue-400" />;
      case 'snow':
        return <Star className="w-full h-full text-white" />;
      case 'fog':
        return <Wind className="w-full h-full text-gray-400" />;
      case 'wind':
        return <Wind className="w-full h-full text-gray-300" />;
      default:
        return <Droplets className="w-full h-full text-blue-400" />;
    }
  };

  if (!isActive) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-10">
      {drops.map((drop) => (
        <motion.div
          key={drop.id}
          className="absolute"
          style={{
            left: `${drop.x}%`,
            top: "-20px",
            width: `${drop.size}px`,
            height: `${drop.size}px`
          }}
          animate={{
            y: [0, window.innerHeight + 20],
            opacity: [0, 1, 0]
          }}
          transition={{
            duration: 2 / intensity,
            delay: drop.delay,
            repeat: Infinity,
            ease: "linear"
          }}
        >
          {getDropIcon()}
        </motion.div>
      ))}
    </div>
  );
};
