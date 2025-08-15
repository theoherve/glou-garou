"use client";

import { motion } from 'framer-motion';
import { Eye, Zap, Target, Heart, Users, Moon } from 'lucide-react';
import Image from 'next/image';
import { Role, Player } from '@/types/game';
import { getRoleAssets } from '@/lib/roleAssets';

interface TeamDisplayProps {
  players: Player[];
  className?: string;
}

export const TeamDisplay = ({ players, className = "" }: TeamDisplayProps) => {
  const safePlayers: Player[] = Array.isArray(players)
    ? players.filter((p: any) => p && p.id && typeof p.name === 'string' && p.role)
    : [];
  const getRoleIcon = (role: Role) => {
    const { illustrationSrc, displayName } = getRoleAssets(role);
    return (
      <Image
        src={illustrationSrc}
        alt={displayName}
        width={56}
        height={56}
        className="w-14 h-14 object-contain"
      />
    );
  };

  const getRoleName = (role: Role) => getRoleAssets(role).displayName;

  const getTeamInfo = (role: Role) => {
    if (role === 'loup-garou') {
      return {
        team: 'loup-garou',
        color: 'text-red-400',
        bgColor: 'bg-red-900/20',
        borderColor: 'border-red-500/30',
        icon: '🐺'
      };
    } else {
      return {
        team: 'villageois',
        color: 'text-green-400',
        bgColor: 'bg-green-900/20',
        borderColor: 'border-green-500/30',
        icon: '🏠'
      };
    }
  };

  // Grouper les joueurs par équipe
  const villageois = safePlayers.filter(p => p.role !== 'loup-garou');
  const loups = safePlayers.filter(p => p.role === 'loup-garou');

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Titre */}
      <motion.div
        className="text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className="text-2xl font-bold text-white mb-2">⚖️ Équilibre des Équipes</h3>
        <p className="text-gray-300">Distribution des rôles et des équipes</p>
      </motion.div>

      {/* Statistiques globales */}
      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.5 }}
      >
        <div className="bg-[#3a3a3a] rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-white mb-2">
            {players.length}
          </div>
          <div className="text-gray-300 text-sm">Total des joueurs</div>
        </div>

        <div className="bg-green-900/20 border border-green-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-green-400 mb-2">
            {villageois.length}
          </div>
          <div className="text-green-300 text-sm">Villageois</div>
        </div>

        <div className="bg-red-900/20 border border-red-500/30 rounded-lg p-4 text-center">
          <div className="text-3xl font-bold text-red-400 mb-2">
            {loups.length}
          </div>
          <div className="text-red-300 text-sm">Loups-garous</div>
        </div>
      </motion.div>

      {/* Détail des équipes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Équipe des Villageois */}
        <motion.div
          className="bg-green-900/10 border border-green-500/20 rounded-lg p-6"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-green-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🏠</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-green-400">Équipe des Villageois</h4>
              <p className="text-green-300 text-sm">Protéger le village</p>
            </div>
          </div>

          <div className="space-y-3">
            {villageois.map((player, index) => {
              const teamInfo = getTeamInfo(player.role);
              return (
                <motion.div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${teamInfo.bgColor} border ${teamInfo.borderColor}`}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(player.role)}
                    <div>
                      <p className="text-white font-medium">{player.name || 'Joueur'}</p>
                      <p className={`text-sm ${teamInfo.color}`}>
                        {getRoleName(player.role)}
                      </p>
                    </div>
                  </div>
                  {player.isGameMaster && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-xs">👑</span>
                      <span className="text-yellow-400 text-xs">MJ</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Équipe des Loups-garous */}
        <motion.div
          className="bg-red-900/10 border border-red-500/20 rounded-lg p-6"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.4, duration: 0.5 }}
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-10 h-10 bg-red-500/20 rounded-full flex items-center justify-center">
              <span className="text-2xl">🐺</span>
            </div>
            <div>
              <h4 className="text-xl font-bold text-red-400">Équipe des Loups-garous</h4>
              <p className="text-red-300 text-sm">Éliminer les villageois</p>
            </div>
          </div>

          <div className="space-y-3">
            {loups.map((player, index) => {
              const teamInfo = getTeamInfo(player.role);
              return (
                <motion.div
                  key={player.id}
                  className={`flex items-center justify-between p-3 rounded-lg ${teamInfo.bgColor} border ${teamInfo.borderColor}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 + index * 0.1, duration: 0.3 }}
                >
                  <div className="flex items-center space-x-3">
                    {getRoleIcon(player.role)}
                    <div>
                      <p className="text-white font-medium">{player.name || 'Joueur'}</p>
                      <p className={`text-sm ${teamInfo.color}`}>
                        {getRoleName(player.role)}
                      </p>
                    </div>
                  </div>
                  {player.isGameMaster && (
                    <div className="flex items-center space-x-1">
                      <span className="text-yellow-400 text-xs">👑</span>
                      <span className="text-yellow-400 text-xs">MJ</span>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </div>

      {/* Légende des rôles */}
      <motion.div
        className="bg-[#3a3a3a] rounded-lg p-6"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6, duration: 0.5 }}
      >
        <h4 className="text-lg font-semibold text-white mb-4 text-center">📚 Légende des Rôles</h4>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          <div className="flex items-center space-x-2">
            <Eye className="w-4 h-4 text-purple-400" />
            <span className="text-gray-300 text-sm">Voyante : Voir les rôles</span>
          </div>
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-blue-400" />
            <span className="text-gray-300 text-sm">Sorcière : Ressusciter/Éliminer</span>
          </div>
          <div className="flex items-center space-x-2">
            <Target className="w-4 h-4 text-orange-400" />
            <span className="text-gray-300 text-sm">Chasseur : Vengeance post-mortem</span>
          </div>
          <div className="flex items-center space-x-2">
            <Heart className="w-4 h-4 text-pink-400" />
            <span className="text-gray-300 text-sm">Petite Fille : Espionner les loups</span>
          </div>
          <div className="flex items-center space-x-2">
            <Users className="w-4 h-4 text-green-400" />
            <span className="text-gray-300 text-sm">Villageois : Vote et discussion</span>
          </div>
          <div className="flex items-center space-x-2">
            <Moon className="w-4 h-4 text-red-400" />
            <span className="text-gray-300 text-sm">Loup-garou : Éliminer la nuit</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

