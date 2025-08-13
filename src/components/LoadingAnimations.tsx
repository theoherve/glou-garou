'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useState, useEffect } from 'react';
import { 
  Loader2, 
  CheckCircle, 
  XCircle, 
  AlertTriangle,
  Clock,
  Zap,
  Moon,
  Sun,
  Star,
  Heart
} from 'lucide-react';

// Composant de chargement principal
interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  color?: string;
  text?: string;
  className?: string;
}

export const LoadingSpinner = ({ 
  size = 'medium', 
  color = '#ff3333',
  text,
  className = ''
}: LoadingSpinnerProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'medium':
        return 'w-16 h-16';
      case 'large':
        return 'w-24 h-24';
      default:
        return 'w-16 h-16';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`${getSizeClasses()} border-4 border-gray-300 border-t-current rounded-full`}
        style={{ borderTopColor: color }}
        animate={{ rotate: 360 }}
        transition={{ 
          duration: 1, 
          repeat: Infinity, 
          ease: "linear" 
        }}
      />
      {text && (
        <motion.p
          className="mt-4 text-gray-400 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Composant de chargement avec étapes
interface LoadingStepsProps {
  steps: string[];
  currentStep: number;
  className?: string;
}

export const LoadingSteps = ({ 
  steps, 
  currentStep, 
  className = ''
}: LoadingStepsProps) => {
  return (
    <div className={`space-y-4 ${className}`}>
      {steps.map((step, index) => (
        <motion.div
          key={index}
          className={`flex items-center space-x-3 p-3 rounded-lg ${
            index < currentStep 
              ? 'bg-green-900/20 border border-green-500/30' 
              : index === currentStep
              ? 'bg-blue-900/20 border border-blue-500/30'
              : 'bg-gray-900/20 border border-gray-500/30'
          }`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1, duration: 0.3 }}
        >
          <div className="flex-shrink-0">
            {index < currentStep ? (
              <CheckCircle className="w-5 h-5 text-green-400" />
            ) : index === currentStep ? (
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              >
                <Loader2 className="w-5 h-5 text-blue-400" />
              </motion.div>
            ) : (
              <Clock className="w-5 h-5 text-gray-400" />
            )}
          </div>
          
          <span className={`text-sm ${
            index < currentStep 
              ? 'text-green-300' 
              : index === currentStep
              ? 'text-blue-300'
              : 'text-gray-400'
          }`}>
            {step}
          </span>
        </motion.div>
      ))}
    </div>
  );
};

// Composant de chargement avec barre de progression
interface LoadingProgressProps {
  progress: number;
  text?: string;
  showPercentage?: boolean;
  className?: string;
}

export const LoadingProgress = ({ 
  progress, 
  text,
  showPercentage = true,
  className = ''
}: LoadingProgressProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {text && (
        <motion.p
          className="text-gray-300 text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {text}
        </motion.p>
      )}
      
      <div className="w-full bg-gray-700 rounded-full h-3 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
      
      {showPercentage && (
        <motion.div
          className="text-center text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          {Math.round(progress)}%
        </motion.div>
      )}
    </div>
  );
};

// Composant de chargement avec animation de particules
interface ParticleLoadingProps {
  isActive: boolean;
  text?: string;
  className?: string;
}

export const ParticleLoading = ({ 
  isActive, 
  text,
  className = ''
}: ParticleLoadingProps) => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    delay: number;
  }>>([]);

  useEffect(() => {
    if (isActive) {
      const newParticles = Array.from({ length: 12 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 2
      }));
      setParticles(newParticles);
    }
  }, [isActive]);

  if (!isActive) return null;

  return (
    <div className={`relative ${className}`}>
      {/* Particules animées */}
      {particles.map((particle) => (
        <motion.div
          key={particle.id}
          className="absolute w-2 h-2 bg-blue-400 rounded-full"
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`
          }}
          initial={{ 
            opacity: 0, 
            scale: 0,
            rotate: 0
          }}
          animate={{ 
            opacity: [0, 1, 0],
            scale: [0, 1, 0],
            rotate: [0, 180, 360]
          }}
          transition={{
            duration: 2,
            delay: particle.delay,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
      ))}
      
      {/* Texte central */}
      {text && (
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <p className="text-white text-lg font-medium">{text}</p>
        </motion.div>
      )}
    </div>
  );
};

// Composant de chargement avec thème
interface ThemedLoadingProps {
  theme: 'default' | 'night' | 'day' | 'magic' | 'love';
  size?: 'small' | 'medium' | 'large';
  text?: string;
  className?: string;
}

export const ThemedLoading = ({ 
  theme, 
  size = 'medium',
  text,
  className = ''
}: ThemedLoadingProps) => {
  const getThemeConfig = () => {
    switch (theme) {
      case 'night':
        return {
          icon: <Moon className="w-full h-full" />,
          color: 'text-indigo-400',
          bgColor: 'bg-indigo-900/20',
          borderColor: 'border-indigo-500/30'
        };
      case 'day':
        return {
          icon: <Sun className="w-full h-full" />,
          color: 'text-yellow-400',
          bgColor: 'bg-yellow-900/20',
          borderColor: 'border-yellow-500/30'
        };
      case 'magic':
        return {
          icon: <Zap className="w-full h-full" />,
          color: 'text-purple-400',
          bgColor: 'bg-purple-900/20',
          borderColor: 'border-purple-500/30'
        };
      case 'love':
        return {
          icon: <Heart className="w-full h-full" />,
          color: 'text-pink-400',
          bgColor: 'bg-pink-900/20',
          borderColor: 'border-pink-500/30'
        };
      default:
        return {
          icon: <Star className="w-full h-full" />,
          color: 'text-blue-400',
          bgColor: 'bg-blue-900/20',
          borderColor: 'border-blue-500/30'
        };
    }
  };

  const themeConfig = getThemeConfig();
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-12 h-12';
      case 'medium':
        return 'w-20 h-20';
      case 'large':
        return 'w-32 h-32';
      default:
        return 'w-20 h-20';
    }
  };

  return (
    <div className={`flex flex-col items-center justify-center ${className}`}>
      <motion.div
        className={`${getSizeClasses()} ${themeConfig.bgColor} ${themeConfig.borderColor} border-2 rounded-full flex items-center justify-center ${themeConfig.color}`}
        animate={{
          scale: [1, 1.1, 1],
          rotate: [0, 180, 360]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        {themeConfig.icon}
      </motion.div>
      
      {text && (
        <motion.p
          className="mt-4 text-gray-300 text-center"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {text}
        </motion.p>
      )}
    </div>
  );
};

// Composant de chargement avec skeleton
interface SkeletonLoadingProps {
  lines?: number;
  className?: string;
}

export const SkeletonLoading = ({ 
  lines = 3, 
  className = ''
}: SkeletonLoadingProps) => {
  return (
    <div className={`space-y-3 ${className}`}>
      {Array.from({ length: lines }, (_, i) => (
        <motion.div
          key={i}
          className="h-4 bg-gray-700 rounded animate-pulse"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: i * 0.1, duration: 0.3 }}
          style={{
            width: `${Math.random() * 40 + 60}%`
          }}
        />
      ))}
    </div>
  );
};

// Composant de chargement avec animation de typewriter
interface TypewriterLoadingProps {
  text: string;
  speed?: number;
  className?: string;
}

export const TypewriterLoading = ({ 
  text, 
  speed = 100,
  className = ''
}: TypewriterLoadingProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < text.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);

      return () => clearTimeout(timer);
    }
  }, [currentIndex, text, speed]);

  return (
    <div className={className}>
      <motion.span
        className="text-white text-lg font-mono"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        {displayedText}
        <motion.span
          className="inline-block w-2 h-6 bg-white ml-1"
          animate={{ opacity: [1, 0, 1] }}
          transition={{ duration: 0.8, repeat: Infinity }}
        />
      </motion.span>
    </div>
  );
};

// Composant de chargement avec animation de pulsation
interface PulseLoadingProps {
  color?: string;
  size?: 'small' | 'medium' | 'large';
  className?: string;
}

export const PulseLoading = ({ 
  color = '#ff3333',
  size = 'medium',
  className = ''
}: PulseLoadingProps) => {
  const getSizeClasses = () => {
    switch (size) {
      case 'small':
        return 'w-8 h-8';
      case 'medium':
        return 'w-16 h-16';
      case 'large':
        return 'w-24 h-24';
      default:
        return 'w-16 h-16';
    }
  };

  return (
    <div className={`flex items-center justify-center ${className}`}>
      <motion.div
        className={`${getSizeClasses()} rounded-full`}
        style={{ backgroundColor: color }}
        animate={{
          scale: [1, 1.2, 1],
          opacity: [1, 0.5, 1]
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
    </div>
  );
};
