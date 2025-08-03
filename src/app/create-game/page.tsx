'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Settings, Play, Eye, Moon } from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { getAllRoles, getDefaultRoles, RoleData } from '@/data/roles';
import { Role } from '@/types/game';

export default function CreateGamePage() {
  const { createGame, isLoading } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState(8);
  const [selectedRoles, setSelectedRoles] = useState<Role[]>(getDefaultRoles(8));
  const [roomCode, setRoomCode] = useState('');

  const allRoles = getAllRoles();

  const handleRoleToggle = (roleId: Role) => {
    setSelectedRoles(prev => {
      if (prev.includes(roleId)) {
        return prev.filter(r => r !== roleId);
      } else {
        return [...prev, roleId];
      }
    });
  };

  const handleMaxPlayersChange = (newMax: number) => {
    setMaxPlayers(newMax);
    setSelectedRoles(getDefaultRoles(newMax));
  };

  const handleCreateGame = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;

    const gameMasterId = typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
    const settings = {
      roles: selectedRoles,
      maxPlayers,
      enableLovers: selectedRoles.includes('cupidon'),
      enableVoyante: selectedRoles.includes('voyante'),
      enableChasseur: selectedRoles.includes('chasseur'),
      enableSorciere: selectedRoles.includes('sorciere'),
      enablePetiteFille: selectedRoles.includes('petite-fille'),
      enableCapitaine: selectedRoles.includes('capitaine'),
      enableVoleur: selectedRoles.includes('voleur'),
    };

    await createGame(roomCode, gameMasterId, settings);
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  };

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-32 h-32 bg-red-500/10 rounded-full blur-xl pulse-glow"></div>
        <div className="absolute bottom-20 right-20 w-40 h-40 bg-orange-500/10 rounded-full blur-xl pulse-glow" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-orange-500/5 rounded-full blur-2xl pulse-glow" style={{ animationDelay: '1s' }}></div>
      </div>

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <motion.button
              className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] transition-colors border border-[#ff3333]/20"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6 text-[#e0e0e0]" />
            </motion.button>
          </Link>
          <div className="flex items-center gap-3">
            <Crown className="w-8 h-8 text-[#ff9933]" />
            <h1 className="text-3xl font-bold text-[#e0e0e0]">Créer une partie</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left column - Game settings */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-6"
          >
            {/* Basic settings */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
              <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Settings className="w-5 h-5 text-[#ff9933]" />
                Configuration de base
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-[#e0e0e0] mb-2">Nom du maître du jeu</label>
                  <input
                    type="text"
                    value={playerName}
                    onChange={(e) => setPlayerName(e.target.value)}
                    className="w-full px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                    placeholder="Votre nom"
                  />
                </div>

                <div>
                  <label className="block text-[#e0e0e0] mb-2">Code de la salle</label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomCode}
                      onChange={(e) => setRoomCode(e.target.value.toUpperCase())}
                      className="flex-1 px-4 py-3 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] placeholder-[#999999] focus:outline-none focus:border-[#ff3333] transition-colors"
                      placeholder="Code de 6 caractères"
                      maxLength={6}
                    />
                    <button
                      onClick={generateRoomCode}
                      className="px-4 py-3 bg-[#ff3333] hover:bg-[#e62e2e] text-white rounded-lg transition-colors font-semibold"
                    >
                      Générer
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-[#e0e0e0] mb-2">Nombre maximum de joueurs</label>
                  <div className="flex gap-2 flex-wrap">
                    {[6, 8, 10, 12, 15, 18].map(num => (
                      <button
                        key={num}
                        onClick={() => handleMaxPlayersChange(num)}
                        className={`px-4 py-2 rounded-lg transition-colors font-semibold ${
                          maxPlayers === num
                            ? 'bg-[#ff3333] text-white'
                            : 'bg-[#1a1a1a] text-[#e0e0e0] hover:bg-[#333333] border border-[#333333]'
                        }`}
                      >
                        {num}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Role selection */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
              <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#ff9933]" />
                Sélection des rôles ({selectedRoles.length})
              </h2>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {allRoles.map(role => (
                  <motion.button
                    key={role.id}
                    onClick={() => handleRoleToggle(role.id)}
                    className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                      selectedRoles.includes(role.id)
                        ? 'bg-[#ff3333]/20 border-[#ff3333] text-[#e0e0e0]'
                        : 'bg-[#1a1a1a] border-[#333333] text-[#cccccc] hover:bg-[#333333]'
                    }`}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold">{role.name}</span>
                      {role.team === 'loup-garou' && <span className="text-red-400">🐺</span>}
                      {role.team === 'village' && <span className="text-blue-400">🏠</span>}
                    </div>
                    <p className="text-sm opacity-80">{role.description}</p>
                  </motion.button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Right column - Preview and create */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Game preview */}
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
              <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Crown className="w-5 h-5 text-[#ff9933]" />
                Aperçu de la partie
              </h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-[#cccccc]">Maître du jeu:</span>
                  <span className="text-[#e0e0e0] font-semibold">{playerName || 'Non défini'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#cccccc]">Code de salle:</span>
                  <span className="text-[#e0e0e0] font-mono font-semibold">{roomCode || 'Non défini'}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#cccccc]">Joueurs max:</span>
                  <span className="text-[#e0e0e0] font-semibold">{maxPlayers}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-[#cccccc]">Rôles sélectionnés:</span>
                  <span className="text-[#e0e0e0] font-semibold">{selectedRoles.length}</span>
                </div>
              </div>

              {/* Role breakdown */}
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Répartition des rôles</h3>
                <div className="space-y-2">
                  {Object.entries(
                    selectedRoles.reduce((acc, role) => {
                      acc[role] = (acc[role] || 0) + 1;
                      return acc;
                    }, {} as Record<string, number>)
                  ).map(([role, count]) => (
                    <div key={role} className="flex items-center justify-between">
                      <span className="text-[#cccccc]">{getRoleData(role as Role).name}:</span>
                      <span className="text-[#e0e0e0] font-semibold">{count}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Create button */}
            <motion.button
              onClick={handleCreateGame}
              disabled={!playerName.trim() || !roomCode.trim() || isLoading}
              className="w-full bg-[#ff3333] hover:bg-[#e62e2e] disabled:bg-[#666666] disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              {isLoading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Création en cours...
                </>
              ) : (
                <>
                  <Play className="w-6 h-6" />
                  Créer la partie
                </>
              )}
            </motion.button>

            {/* Tips */}
            <div className="bg-[#333a45]/20 rounded-lg p-4 border border-[#333a45]/30">
              <h3 className="text-[#ff9933] font-semibold mb-2">💡 Conseils</h3>
              <ul className="text-sm text-[#cccccc] space-y-1">
                <li>• Partagez le code de salle avec vos amis pour qu&apos;ils puissent rejoindre</li>
                <li>• Assurez-vous d&apos;avoir au moins 1 loup-garou et 1 villageois</li>
                <li>• Les rôles spéciaux ajoutent de la stratégie au jeu</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function getRoleData(role: Role): RoleData {
  const allRoles = getAllRoles();
  return allRoles.find(r => r.id === role) || allRoles[0];
} 