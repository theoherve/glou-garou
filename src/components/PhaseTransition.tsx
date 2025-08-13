'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';
import { Moon, Sun, Target, Crown, Users, CheckCircle } from 'lucide-react';
import { GamePhase } from '@/types/game';

interface PhaseTransitionProps {
  fromPhase: GamePhase;
  toPhase: GamePhase;
  isActive: boolean;
  onComplete?: () => void;
}

export const PhaseTransition = ({ 
  fromPhase, 
  toPhase, 
  isActive, 
  onComplete 
}: PhaseTransitionProps) => {
  const [showTransition, setShowTransition] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (isActive) {
      setShowTransition(true);
      setCurrentStep(0);
      
      // Séquence de transition en 3 étapes
      const sequence = async () => {
        // Étape 1: Fade out de l'ancienne phase
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(1);
        
        // Étape 2: Transition centrale
        await new Promise(resolve => setTimeout(resolve, 1200));
        setCurrentStep(2);
        
        // Étape 3: Fade in de la nouvelle phase
        await new Promise(resolve => setTimeout(resolve, 800));
        setCurrentStep(3);
        
        // Finalisation
        await new Promise(resolve => setTimeout(resolve, 500));
        setShowTransition(false);
        onComplete?.();
      };
      
      sequence();
    }
  }, [isActive, onComplete]);

  const getPhaseIcon = (phase: GamePhase) => {
    switch (phase) {
      case 'waiting':
        return <Users className="w-8 h-8 text-gray-400" />;
      case 'preparation':
        return <Crown className="w-8 h-8 text-yellow-400" />;
      case 'night':
        return <Moon className="w-8 h-8 text-indigo-400" />;
      case 'day':
        return <Sun className="w-8 h-8 text-yellow-400" />;
      case 'voting':
        return <Target className="w-8 h-8 text-red-400" />;
      case 'ended':
        return <CheckCircle className="w-8 h-8 text-green-400" />;
      default:
        return <Users className="w-8 h-8 text-gray-400" />;
    }
  };

  const getPhaseName = (phase: GamePhase) => {
    switch (phase) {
      case 'waiting':
        return 'En Attente';
      case 'preparation':
        return 'Préparation';
      case 'night':
        return 'Nuit';
      case 'day':
        return 'Jour';
      case 'voting':
        return 'Vote';
      case 'ended':
        return 'Terminé';
      default:
        return 'Inconnu';
    }
  };

  const getPhaseColor = (phase: GamePhase) => {
    switch (phase) {
      case 'waiting':
        return 'from-gray-500 to-gray-600';
      case 'preparation':
        return 'from-yellow-500 to-orange-600';
      case 'night':
        return 'from-indigo-500 to-purple-600';
      case 'day':
        return 'from-yellow-500 to-orange-600';
      case 'voting':
        return 'from-red-500 to-pink-600';
      case 'ended':
        return 'from-green-500 to-emerald-600';
      default:
        return 'from-gray-500 to-gray-600';
    }
  };

  if (!isActive || !showTransition) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 z-[100] bg-black/90 backdrop-blur-sm flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <div className="text-center space-y-8">
          {/* Phase de départ */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 1, scale: 1, y: 0 }}
            animate={currentStep >= 1 ? { 
              opacity: 0, 
              scale: 0.8, 
              y: -50,
              filter: "blur(4px)"
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <div className="w-24 h-24 bg-gradient-to-br from-gray-500 to-gray-600 rounded-full mx-auto flex items-center justify-center">
              {getPhaseIcon(fromPhase)}
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-300 mb-2">
                {getPhaseName(fromPhase)}
              </h3>
              <p className="text-gray-400">Phase précédente</p>
            </div>
          </motion.div>

          {/* Flèche de transition */}
          <motion.div
            className="flex items-center justify-center"
            initial={{ opacity: 0, scale: 0 }}
            animate={currentStep >= 1 ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <motion.div
              className="w-16 h-1 bg-gradient-to-r from-gray-400 to-gray-600 rounded-full"
              animate={currentStep >= 1 ? { 
                scaleX: [0, 1.2, 1],
                background: [
                  "linear-gradient(to right, #9ca3af, #4b5563)",
                  "linear-gradient(to right, #f59e0b, #ea580c)",
                  "linear-gradient(to right, #9ca3af, #4b5563)"
                ]
              } : {}}
              transition={{ duration: 1.2, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Phase d'arrivée */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, scale: 0.8, y: 50 }}
            animate={currentStep >= 2 ? { 
              opacity: 1, 
              scale: 1, 
              y: 0 
            } : {}}
            transition={{ duration: 0.8, ease: "easeInOut" }}
          >
            <motion.div
              className={`w-24 h-24 bg-gradient-to-br ${getPhaseColor(toPhase)} rounded-full mx-auto flex items-center justify-center`}
              animate={currentStep >= 2 ? { 
                scale: [1, 1.1, 1],
                filter: [
                  "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))",
                  "drop-shadow(0 0 20px rgba(59, 130, 246, 0.8))",
                  "drop-shadow(0 0 10px rgba(59, 130, 246, 0.5))"
                ]
              } : {}}
              transition={{ duration: 1, repeat: Infinity, ease: "easeInOut" }}
            >
              {getPhaseIcon(toPhase)}
            </motion.div>
            <div>
              <h3 className="text-2xl font-bold text-white mb-2">
                {getPhaseName(toPhase)}
              </h3>
              <p className="text-gray-300">Nouvelle phase</p>
            </div>
          </motion.div>

          {/* Indicateur de progression */}
          <motion.div
            className="w-64 h-2 bg-gray-700 rounded-full mx-auto overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <motion.div
              className="h-full bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              initial={{ width: "0%" }}
              animate={{ width: `${(currentStep / 3) * 100}%` }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            />
          </motion.div>

          {/* Texte de statut */}
          <motion.div
            className="text-gray-400 text-lg"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            {currentStep === 0 && "Fermeture de la phase précédente..."}
            {currentStep === 1 && "Transition en cours..."}
            {currentStep === 2 && "Ouverture de la nouvelle phase..."}
            {currentStep === 3 && "Transition terminée !"}
          </motion.div>
        </div>

        {/* Particules de transition */}
        {currentStep >= 1 && (
          <div className="absolute inset-0 pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute w-2 h-2 bg-blue-400 rounded-full"
                initial={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: 0,
                  scale: 0
                }}
                animate={{
                  x: Math.random() * window.innerWidth,
                  y: Math.random() * window.innerHeight,
                  opacity: [0, 1, 0],
                  scale: [0, 1, 0]
                }}
                transition={{
                  duration: 2,
                  delay: i * 0.1,
                  ease: "easeOut"
                }}
              />
            ))}
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
