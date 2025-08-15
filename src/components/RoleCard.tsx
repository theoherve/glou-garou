"use client";

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Crown } from 'lucide-react';
import Image from 'next/image';
import { Role } from '@/types/game';
import { getRoleAssets } from '@/lib/roleAssets';

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

  const roleAssets = getRoleAssets(role);

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
            {/* Dos de la carte */}
            <div className="w-full h-full relative overflow-hidden rounded-xl">
              <div className="absolute inset-0 bg-gradient-to-br from-blue-900 to-indigo-900" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-16 h-16 bg-blue-500/20 rounded-full flex items-center justify-center border border-blue-400/30">
                  <Crown className="w-8 h-8 text-blue-300" />
                </div>
              </div>
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className="text-blue-200 text-xs font-medium truncate px-2">{playerName}</p>
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
            className={`w-32 h-48 bg-black rounded-xl border-2 ${teamInfo.borderColor} shadow-lg transform perspective-1000 overflow-hidden`}
            initial={{ rotateY: 180 }}
            animate={{ rotateY: 0 }}
            transition={{ duration: 0.6, ease: "easeInOut" }}
          >
            {/* Face visible: carte du rôle */}
            <div className="w-full h-full relative">
              <Image
                src={roleAssets.cardSrc}
                alt={roleAssets.displayName}
                fill
                priority={false}
                sizes="128px"
                className="object-contain"
              />
              <div className="absolute bottom-2 left-0 right-0 text-center">
                <p className={`text-white text-xs font-medium truncate px-2`}>{playerName}</p>
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

