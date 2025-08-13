"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown, Users, Moon, Sun, Target, Shield, Eye, Zap, Heart } from 'lucide-react';
import { Role } from '@/types/game';

interface RoleCardProps {
  role: Role;
  playerName: string;
  isGameMaster?: boolean;
  isRevealed?: boolean;
  onReveal?: () => void;
  className?: string;
}

export const RoleCard = ({ 
  role, 
  playerName, 
  isGameMaster = false, 
  isRevealed = false, 
  onReveal,
  className = "" 
}: RoleCardProps) => {
  const [isFlipped, setIsFlipped] = useState(false);

  const handleReveal = () => {
    if (!isRevealed && onReveal) {
      setIsFlipped(true);
      onReveal();
    }
  };

  const getRoleIcon = (role: Role) => {
    switch (role) {
      case 'loup-garou':
        return <Moon className="w-8 h-8 text-red-400" />;
      case 'villageois':
        return <Users className="w-8 h-8 text-green-400" />;
      case 'voyante':
        return <Eye className="w-8 h-8 text-purple-400" />;
      case 'sorciere':
        return <Zap className="w-8 h-8 text-blue-400" />;
      case 'chasseur':
        return <Target className="w-8 h-8 text-orange-400" />;
      case 'petite-fille':
        return <Heart className="w-8 h-8 text-pink-400" />;
      default:
        return <Shield className="w-8 h-8 text-gray-400" />;
    }
  };

  const getRoleName = (role: Role) => {
    switch (role) {
      case 'loup-garou':
        return 'Loup-Garou';
      case 'villageois':
        return 'Villageois';
      case 'voyante':
        return 'Voyante';
      case 'sorciere':
        return 'Sorcière';
      case 'chasseur':
        return 'Chasseur';
      case 'petite-fille':
        return 'Petite Fille';
      default:
        return 'Rôle inconnu';
    }
  };

  const getTeamInfo = (role: Role) => {
    if (role === 'loup-garou') {
      return {
        team: 'loup-garou',
        color: 'from-red-600 to-red-800',
        borderColor: 'border-red-500',
        textColor: 'text-red-100',
        bgColor: 'bg-red-900/20'
      };
    } else {
      return {
        team: 'villageois',
        color: 'from-green-600 to-green-800',
        borderColor: 'border-green-500',
        textColor: 'text-green-100',
        bgColor: 'bg-green-900/20'
      };
    }
  };

  const teamInfo = getTeamInfo(role);

  return (
    <div className={`relative ${className}`}>
      {/* Carte face cachée */}
      <AnimatePresence mode="wait">
        {!isFlipped ? (
          <motion.div
            key="back"
            className="w-32 h-48 bg-gradient-to-br from-blue-900 to-indigo-900 rounded-xl border-2 border-blue-400 shadow-lg cursor-pointer transform perspective-1000"
            initial={{ rotateY: 0 }}
            exit={{ rotateY: -180 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
            onClick={handleReveal}
            whileHover={{ scale: 1.05, rotateY: -5 }}
            whileTap={{ scale: 0.95 }}
          >
            {/* Design de la carte face cachée */}
            <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
              {/* Motif de fond */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              
              {/* Icône centrale */}
              <div className="relative z-10">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                  <Crown className="w-8 h-8 text-blue-300" />
                </div>
              </div>
              
              {/* Texte */}
              <div className="relative z-10 text-center mt-4">
                <p className="text-blue-200 text-sm font-medium">Cliquez pour</p>
                <p className="text-blue-100 text-lg font-bold">Révéler</p>
              </div>
              
              {/* Nom du joueur */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className="text-blue-300 text-xs font-medium truncate px-2">
                  {playerName}
                </p>
                {isGameMaster && (
                  <div className="flex items-center justify-center mt-1">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs ml-1">MJ</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          /* Carte face visible */
          <motion.div
            key="front"
            className={`w-32 h-48 bg-gradient-to-br ${teamInfo.color} rounded-xl border-2 ${teamInfo.borderColor} shadow-lg transform perspective-1000`}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Design de la carte face visible */}
            <div className="w-full h-full flex flex-col items-center justify-center p-4 relative overflow-hidden">
              {/* Motif de fond */}
              <div className="absolute inset-0 opacity-20">
                <div className="w-full h-full bg-gradient-to-br from-white/10 to-transparent"></div>
              </div>
              
              {/* Icône du rôle */}
              <div className="relative z-10">
                <div className={`w-16 h-16 ${teamInfo.bgColor} rounded-full flex items-center justify-center border border-white/20`}>
                  {getRoleIcon(role)}
                </div>
              </div>
              
              {/* Nom du rôle */}
              <div className="relative z-10 text-center mt-4">
                <p className={`${teamInfo.textColor} text-lg font-bold`}>
                  {getRoleName(role)}
                </p>
                <p className={`${teamInfo.textColor} text-xs opacity-80 capitalize`}>
                  {teamInfo.team}
                </p>
              </div>
              
              {/* Nom du joueur */}
              <div className="absolute bottom-4 left-0 right-0 text-center">
                <p className={`${teamInfo.textColor} text-xs font-medium truncate px-2`}>
                  {playerName}
                </p>
                {isGameMaster && (
                  <div className="flex items-center justify-center mt-1">
                    <Crown className="w-3 h-3 text-yellow-400" />
                    <span className="text-yellow-400 text-xs ml-1">MJ</span>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      
      {/* Indicateur de révélation */}
      {isRevealed && (
        <motion.div
          className="absolute -top-2 -right-2 w-6 h-6 bg-green-500 rounded-full flex items-center justify-center"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ delay: 0.3, duration: 0.3 }}
        >
          <span className="text-white text-xs">✓</span>
        </motion.div>
      )}
    </div>
  );
};

