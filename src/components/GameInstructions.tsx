"use client";

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useGameStore } from '@/store/gameStore';
import { Crown, Moon, Users, Eye, Zap, Target, Heart, Clock, AlertTriangle, CheckCircle, Info, ArrowRight, ArrowLeft, XCircle } from 'lucide-react';
import { Role } from '@/types/game';

interface GameInstructionsProps {
  isVisible: boolean;
  onClose: () => void;
}

export const GameInstructions = ({ isVisible, onClose }: GameInstructionsProps) => {
  const { currentGame, currentPlayer } = useGameStore();
  const [currentStep, setCurrentStep] = useState(0);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    if (isVisible) {
      setCurrentStep(0);
      setShowAdvanced(false);
    }
  }, [isVisible]);

  if (!isVisible || !currentGame) {
    return null;
  }

  const getPhaseInstructions = () => {
    const baseInstructions = {
      preparation: {
        title: 'Phase de Préparation',
        description: 'Les joueurs découvrent leurs rôles et se préparent pour la partie.',
        steps: [
          {
            title: 'Vérification des rôles',
            description: 'Assurez-vous que tous les joueurs ont révélé leur rôle.',
            action: 'Demander aux joueurs de cliquer sur leur carte pour révéler leur rôle.',
            icon: <Eye className="w-5 h-5 text-purple-400" />
          },
          {
            title: 'Explication des règles',
            description: 'Rappelez les règles de base du jeu.',
            action: 'Expliquer le déroulement des phases et les conditions de victoire.',
            icon: <Info className="w-5 h-5 text-blue-400" />
          },
          {
            title: 'Préparation de la nuit',
            description: 'Préparez-vous à commencer la première phase de nuit.',
            action: 'Annoncer le début de la nuit et demander aux joueurs de fermer les yeux.',
            icon: <Moon className="w-5 h-5 text-indigo-400" />
          }
        ]
      },
      night: {
        title: 'Phase de Nuit',
        description: 'Les rôles spéciaux agissent dans l\'obscurité.',
        steps: [
          {
            title: 'Début de la nuit',
            description: 'Tous les joueurs ferment les yeux.',
            action: 'Annoncer "La nuit tombe sur le village. Tous les joueurs ferment les yeux."',
            icon: <Moon className="w-5 h-5 text-indigo-400" />
          },
          {
            title: 'Action des loups-garous',
            description: 'Les loups-garous choisissent une victime.',
            action: 'Demander aux loups-garous d\'ouvrir les yeux et de désigner une victime.',
            icon: <Moon className="w-5 h-5 text-red-400" />
          },
          {
            title: 'Action de la voyante',
            description: 'La voyante observe un joueur.',
            action: 'Demander à la voyante d\'ouvrir les yeux et de choisir un joueur à observer.',
            icon: <Eye className="w-5 h-5 text-purple-400" />
          },
          {
            title: 'Action de la sorcière',
            description: 'La sorcière utilise ses potions.',
            action: 'Demander à la sorcière d\'ouvrir les yeux et de décider d\'utiliser ses potions.',
            icon: <Zap className="w-5 h-5 text-blue-400" />
          },
          {
            title: 'Fin de la nuit',
            description: 'Tous les joueurs ferment les yeux.',
            action: 'Annoncer "La nuit se termine. Tous les joueurs ferment les yeux."',
            icon: <Moon className="w-5 h-5 text-indigo-400" />
          }
        ]
      },
      day: {
        title: 'Phase de Jour',
        description: 'Révélez les événements de la nuit et laissez les joueurs discuter.',
        steps: [
          {
            title: 'Révélation des événements',
            description: 'Annoncez qui est mort pendant la nuit.',
            action: 'Révéler les morts de la nuit et expliquer les circonstances.',
            icon: <AlertTriangle className="w-5 h-5 text-red-400" />
          },
          {
            title: 'Discussion générale',
            description: 'Laissez les joueurs discuter et se défendre.',
            action: 'Encourager la discussion et laisser les joueurs s\'exprimer.',
            icon: <Users className="w-5 h-5 text-green-400" />
          },
          {
            title: 'Préparation du vote',
            description: 'Préparez le vote d\'élimination.',
            action: 'Annoncer le début du vote et expliquer les règles.',
            icon: <Target className="w-5 h-5 text-orange-400" />
          }
        ]
      },
      vote: {
        title: 'Phase de Vote',
        description: 'Les joueurs votent pour éliminer un suspect.',
        steps: [
          {
            title: 'Ouverture du vote',
            description: 'Ouvrez le vote pour tous les joueurs.',
            action: 'Demander à chaque joueur de voter pour un suspect.',
            icon: <Target className="w-5 h-5 text-orange-400" />
          },
          {
            title: 'Comptage des votes',
            description: 'Comptez les votes et identifiez le gagnant.',
            action: 'Compter les votes et annoncer le joueur éliminé.',
            icon: <CheckCircle className="w-5 h-5 text-green-400" />
          },
          {
            title: 'Élimination',
            description: 'Éliminez le joueur voté.',
            action: 'Révéler le rôle du joueur éliminé et le retirer du jeu.',
            icon: <XCircle className="w-5 h-5 text-red-400" />
          }
        ]
      },
      end: {
        title: 'Fin de Partie',
        description: 'Déterminez le vainqueur et terminez la partie.',
        steps: [
          {
            title: 'Vérification des conditions',
            description: 'Vérifiez les conditions de victoire.',
            action: 'Compter les joueurs restants et vérifier les conditions de victoire.',
            icon: <CheckCircle className="w-5 h-5 text-green-400" />
          },
          {
            title: 'Annonce du vainqueur',
            description: 'Annoncez l\'équipe gagnante.',
            action: 'Révéler tous les rôles et annoncer le vainqueur.',
            icon: <Crown className="w-5 h-5 text-yellow-400" />
          },
          {
            title: 'Conclusion',
            description: 'Permettez aux joueurs de rejouer ou de quitter.',
            action: 'Féliciter les vainqueurs et proposer une nouvelle partie.',
            icon: <Users className="w-5 h-5 text-green-400" />
          }
        ]
      }
    };

    return baseInstructions[currentGame.phase as keyof typeof baseInstructions] || baseInstructions.preparation;
  };

  const instructions = getPhaseInstructions();
  const totalSteps = instructions.steps.length;

  const nextStep = () => {
    if (currentStep < totalSteps - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getRoleDistribution = () => {
    const villageois = currentGame.players.filter(p => p.role !== 'loup-garou');
    const loups = currentGame.players.filter(p => p.role === 'loup-garou');
    
    return { villageois: villageois.length, loups: loups.length };
  };

  const roleDistribution = getRoleDistribution();

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="bg-gradient-to-br from-[#2a2a2a] to-[#1a1a1a] rounded-2xl p-6 max-w-4xl w-full border border-[#ff3333]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.8, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.8, y: 20 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
        >
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <Info className="w-6 h-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">📚 Instructions du Jeu</h2>
                <p className="text-gray-300">Guide étape par étape pour le maître de jeu</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
            >
              <XCircle className="w-6 h-6 text-gray-400" />
            </button>
          </div>

          {/* Informations de la partie */}
          <motion.div
            className="bg-[#3a3a3a] rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-white mb-1">
                  {currentGame.players.length}
                </div>
                <div className="text-gray-300 text-sm">Total des joueurs</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-400 mb-1">
                  {roleDistribution.villageois}
                </div>
                <div className="text-gray-300 text-sm">Villageois</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-red-400 mb-1">
                  {roleDistribution.loups}
                </div>
                <div className="text-gray-300 text-sm">Loups-garous</div>
              </div>
            </div>
          </motion.div>

          {/* Phase actuelle */}
          <motion.div
            className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <div className="flex items-center space-x-3 mb-3">
              <Clock className="w-6 h-6 text-blue-400" />
              <h3 className="text-xl font-bold text-white">{instructions.title}</h3>
            </div>
            <p className="text-blue-200">{instructions.description}</p>
          </motion.div>

          {/* Instructions étape par étape */}
          <motion.div
            className="bg-[#3a3a3a] rounded-lg p-6 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">Étape {currentStep + 1} sur {totalSteps}</h3>
              <div className="flex space-x-2">
                <button
                  onClick={prevStep}
                  disabled={currentStep === 0}
                  className="p-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  <ArrowLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={nextStep}
                  disabled={currentStep === totalSteps - 1}
                  className="p-2 bg-gray-600 hover:bg-gray-700 disabled:bg-gray-800 disabled:opacity-50 text-white rounded-lg transition-colors"
                >
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Barre de progression */}
            <div className="w-full bg-gray-700 rounded-full h-2 mb-6">
              <div
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentStep + 1) / totalSteps) * 100}%` }}
              ></div>
            </div>

            {/* Étape actuelle */}
            <AnimatePresence mode="wait">
              <motion.div
                key={currentStep}
                className="text-center"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
              >
                <div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-blue-500/20 to-purple-500/20 rounded-full flex items-center justify-center border border-blue-500/30">
                  {instructions.steps[currentStep].icon}
                </div>
                
                <h4 className="text-xl font-bold text-white mb-3">
                  {instructions.steps[currentStep].title}
                </h4>
                
                <p className="text-gray-300 mb-4 text-lg">
                  {instructions.steps[currentStep].description}
                </p>
                
                <div className="bg-blue-900/20 border border-blue-500/30 rounded-lg p-4">
                  <h5 className="text-sm font-semibold text-blue-300 mb-2">Action à effectuer :</h5>
                  <p className="text-blue-200 text-sm">
                    {instructions.steps[currentStep].action}
                  </p>
                </div>
              </motion.div>
            </AnimatePresence>
          </motion.div>

          {/* Instructions avancées */}
          <motion.div
            className="bg-[#3a3a3a] rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.5 }}
          >
            <button
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="w-full p-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center justify-between"
            >
              <span>Instructions Avancées</span>
              <motion.div
                animate={{ rotate: showAdvanced ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ArrowRight className="w-4 h-4" />
              </motion.div>
            </button>

            <AnimatePresence>
              {showAdvanced && (
                <motion.div
                  className="mt-4 space-y-4"
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="bg-purple-900/20 border border-purple-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-purple-300 mb-3">Conseils pour le maître de jeu</h4>
                    <ul className="space-y-2 text-purple-200 text-sm">
                      <li>• Maintenez un rythme constant pour éviter que la partie traîne</li>
                      <li>• Soyez impartial et ne donnez pas d'indices</li>
                      <li>• Adaptez les règles selon l'expérience des joueurs</li>
                      <li>• Gardez un œil sur le temps pour chaque phase</li>
                      <li>• Encouragez la participation de tous les joueurs</li>
                    </ul>
                  </div>

                  <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4">
                    <h4 className="text-lg font-semibold text-green-300 mb-3">Conditions de victoire</h4>
                    <div className="space-y-2 text-green-200 text-sm">
                      <div className="flex justify-between">
                        <span>Villageois :</span>
                        <span>Éliminer tous les loups-garous</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Loups-garous :</span>
                        <span>Égaler ou dépasser le nombre de villageois</span>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Bouton de fermeture */}
          <motion.div
            className="text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
          >
            <button
              onClick={onClose}
              className="px-6 py-3 bg-[#ff3333] hover:bg-[#ff3333]/80 text-white font-semibold rounded-lg transition-colors"
            >
              Fermer les Instructions
            </button>
          </motion.div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

