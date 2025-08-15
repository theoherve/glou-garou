'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Crown, Settings, Play, Eye, Plus, Minus, AlertTriangle, Database, TestTube } from 'lucide-react';
import Link from 'next/link';
import { useGameStore } from '@/store/gameStore';
import { getAllRoles, getDefaultRoleCounts, getTotalRoleCount, validateRoleCounts, RoleData } from '@/data/roles';
import { Role } from '@/types/game';
import Image from 'next/image';
import { getRoleAssets } from '@/lib/roleAssets';
import ScaryAnimations from '@/components/ScaryAnimations';
import ScaryHoverEffects from '@/components/ScaryHoverEffects';
import RealtimeTest from '@/components/RealtimeTest';

// Helper accessors
const roleIllustrationSrc = (role: Role) => getRoleAssets(role).illustrationSrc;
const roleDisplayName = (role: Role) => getRoleAssets(role).displayName;

export default function CreateGamePage() {
  const { createGame, isLoading, error } = useGameStore();
  const [playerName, setPlayerName] = useState('');
  const [playerCount, setPlayerCount] = useState(8);
  const [roleCounts, setRoleCounts] = useState<Record<Role, number>>(getDefaultRoleCounts(8));
  const [roomCode, setRoomCode] = useState('');
  const [showScaryAnimations, setShowScaryAnimations] = useState(false);
  const [localError, setLocalError] = useState<string | null>(null);

  const allRoles = getAllRoles();

  // Récupérer le nom depuis l'URL
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const nameFromUrl = urlParams.get('name');
      if (nameFromUrl) {
        setPlayerName(decodeURIComponent(nameFromUrl));
      }
    }
  }, []);

  useEffect(() => {
    // Activer les animations effrayantes après 2 secondes
    const timer = setTimeout(() => {
      setShowScaryAnimations(true);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  const handlePlayerCountChange = (newCount: number) => {
    setPlayerCount(newCount);
    setRoleCounts(getDefaultRoleCounts(newCount));
  };

  const handleRoleCountChange = (roleId: Role, newCount: number) => {
    if (newCount < 0) return;
    
    setRoleCounts(prev => {
      const newCounts = { ...prev, [roleId]: newCount };
      
      // Ajuster automatiquement le nombre de villageois pour maintenir le total
      const currentTotal = getTotalRoleCount(newCounts);
      const villageoisCount = playerCount - (currentTotal - newCounts["villageois"]);
      
      if (villageoisCount >= 0) {
        newCounts["villageois"] = villageoisCount;
      }
      
      return newCounts;
    });
  };

  const handleCreateGame = async () => {
    if (!playerName.trim() || !roomCode.trim()) return;

    const validation = validateRoleCounts(roleCounts, playerCount);
    if (!validation.isValid) {
      setLocalError(`Erreurs de validation:\n${validation.errors.join('\n')}`);
      return;
    }

    try {
      setLocalError(null); // Effacer les erreurs précédentes
      
      const gameMasterId = typeof crypto !== 'undefined' ? crypto.randomUUID() : Math.random().toString(36).substring(2);
      
      // Convertir roleCounts en tableau de rôles
      const roles: Role[] = [];
      Object.entries(roleCounts).forEach(([role, count]) => {
        for (let i = 0; i < count; i++) {
          roles.push(role as Role);
        }
      });

      const settings = {
        roles,
        minPlayers: playerCount,
        maxPlayers: playerCount,
        roleCounts,
        enableLovers: roleCounts.cupidon > 0,
        enableVoyante: roleCounts.voyante > 0,
        enableChasseur: roleCounts.chasseur > 0,
        enableSorciere: roleCounts.sorciere > 0,
        enablePetiteFille: roleCounts["petite-fille"] > 0,
        enableCapitaine: roleCounts.capitaine > 0,
        enableVoleur: roleCounts.voleur > 0,
      };

      console.log('Création du jeu avec:', { roomCode, gameMasterId, settings });
      
      await createGame(roomCode, gameMasterId, settings);
      
      // Rediriger vers la page du jeu après création réussie
      window.location.href = `/game/${roomCode}`;
      
    } catch (error) {
      console.error('Erreur lors de la création du jeu:', error);
      const errorMessage = error instanceof Error ? error.message : 'Erreur inconnue';
      setLocalError(`Erreur lors de la création du jeu: ${errorMessage}`);
    }
  };

  const generateRoomCode = () => {
    const code = Math.random().toString(36).substring(2, 8).toUpperCase();
    setRoomCode(code);
  };

  const validation = validateRoleCounts(roleCounts, playerCount);
  const totalRoles = getTotalRoleCount(roleCounts);

  return (
    <div className="min-h-screen bg-[#1a1a1a] relative overflow-hidden">
      {/* Animations effrayantes */}
      <ScaryAnimations isActive={showScaryAnimations} intensity="low" />

      <div className="relative z-10 container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <ScaryHoverEffects intensity="low">
              <motion.button
                className="p-2 rounded-lg bg-[#2a2a2a] hover:bg-[#333333] transition-colors border border-[#ff3333]/20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <ArrowLeft className="w-6 h-6 text-[#e0e0e0]" />
              </motion.button>
            </ScaryHoverEffects>
          </Link>
          <div className="flex items-center gap-3">
            <motion.div
              animate={{ rotate: [0, 5, -5, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <Crown className="w-8 h-8 text-[#ff9933]" />
            </motion.div>
            <motion.h1 
              className="text-3xl font-bold text-[#e0e0e0] font-creepster"
              animate={{ 
                textShadow: [
                  "2px 2px 4px rgba(255, 51, 51, 0.3)",
                  "2px 2px 8px rgba(255, 51, 51, 0.6)",
                  "2px 2px 4px rgba(255, 51, 51, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
            >
              Créer une partie
            </motion.h1>
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
            <ScaryHoverEffects intensity="low">
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
                <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Settings className="w-5 h-5 text-[#ff9933]" />
                  </motion.div>
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
                      <ScaryHoverEffects intensity="medium">
                        <button
                          onClick={generateRoomCode}
                          className="px-4 py-3 bg-[#ff3333] hover:bg-[#e62e2e] text-white rounded-lg transition-colors font-semibold"
                        >
                          Générer
                        </button>
                      </ScaryHoverEffects>
                    </div>
                  </div>

                  <div>
                    <label className="block text-[#e0e0e0] mb-2">Nombre de joueurs</label>
                    <div className="flex items-center gap-4">
                      <input
                        type="number"
                        min="6"
                        max="18"
                        value={playerCount}
                        onChange={(e) => handlePlayerCountChange(parseInt(e.target.value) || 6)}
                        className="w-20 px-3 py-2 bg-[#1a1a1a] border border-[#333333] rounded-lg text-[#e0e0e0] text-center focus:outline-none focus:border-[#ff3333] transition-colors"
                      />
                      <span className="text-[#cccccc]">joueurs (6-18)</span>
                    </div>
                  </div>
                </div>
              </div>
            </ScaryHoverEffects>

            {/* Role selection */}
            <ScaryHoverEffects intensity="low">
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
                <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <Eye className="w-5 h-5 text-[#ff9933]" />
                  </motion.div>
                  Configuration des rôles
                </h2>
                
                <div className="space-y-4">
                  {allRoles.map(role => (
                    <motion.div 
                      key={role.id} 
                      className="flex items-center justify-between p-3 bg-[#1a1a1a] rounded-lg border border-[#333333]"
                      whileHover={{ 
                        boxShadow: "0 0 10px rgba(255, 51, 51, 0.2)"
                      }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <motion.div
                          className="w-40 h-40 relative"
                          animate={{ 
                            filter: role.team === 'loup-garou' ? [
                              "drop-shadow(0 0 5px rgba(255, 0, 0, 0.5))",
                              "drop-shadow(0 0 10px rgba(255, 0, 0, 0.8))",
                              "drop-shadow(0 0 5px rgba(255, 0, 0, 0.5))"
                            ] : "none"
                          }}
                          transition={{ duration: 2, repeat: role.team === 'loup-garou' ? Infinity : 0 }}
                        >
                          <Image
                            src={roleIllustrationSrc(role.id)}
                            alt={roleDisplayName(role.id)}
                            fill
                            sizes="80px"
                            className="object-contain"
                          />
                        </motion.div>
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="font-semibold text-[#e0e0e0]">{roleDisplayName(role.id)}</span>
                          </div>
                          <p className="text-sm text-[#cccccc]">{role.description}</p>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <ScaryHoverEffects intensity="low">
                          <button
                            onClick={() => handleRoleCountChange(role.id, roleCounts[role.id] - 1)}
                            disabled={roleCounts[role.id] <= 0}
                            className="p-1 rounded bg-[#333333] hover:bg-[#444444] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                          >
                            <Minus className="w-4 h-4 text-[#e0e0e0]" />
                          </button>
                        </ScaryHoverEffects>
                        
                        <span className="w-8 text-center font-semibold text-[#e0e0e0]">
                          {roleCounts[role.id]}
                        </span>
                        
                        <ScaryHoverEffects intensity="low">
                          <button
                            onClick={() => handleRoleCountChange(role.id, roleCounts[role.id] + 1)}
                            className="p-1 rounded bg-[#333333] hover:bg-[#444444] transition-colors"
                          >
                            <Plus className="w-4 h-4 text-[#e0e0e0]" />
                          </button>
                        </ScaryHoverEffects>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </ScaryHoverEffects>
          </motion.div>

          {/* Right column - Preview and create */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="space-y-6"
          >
            {/* Game preview */}
            <ScaryHoverEffects intensity="low">
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
                    <span className="text-[#cccccc]">Nombre de joueurs:</span>
                    <span className="text-[#e0e0e0] font-semibold">{playerCount}</span>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-[#cccccc]">Total des rôles:</span>
                    <motion.span 
                      className={`font-semibold ${totalRoles === playerCount ? 'text-green-400' : 'text-red-400'}`}
                      animate={totalRoles === playerCount ? { 
                        textShadow: [
                          "0 0 5px rgba(34, 197, 94, 0.5)",
                          "0 0 10px rgba(34, 197, 94, 0.8)",
                          "0 0 5px rgba(34, 197, 94, 0.5)"
                        ]
                      } : {}}
                      transition={{ duration: 2, repeat: totalRoles === playerCount ? Infinity : 0 }}
                    >
                      {totalRoles} / {playerCount}
                    </motion.span>
                  </div>
                </div>

                {/* Role breakdown */}
                <div className="mt-6">
                  <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">Répartition des rôles</h3>
                  <div className="space-y-2">
                    {Object.entries(roleCounts)
                      .filter(([_, count]) => count > 0)
                      .map(([role, count]) => (
                        <div 
                          key={role} 
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-2">
                            <span className="relative w-20 h-20">
                              <Image
                                src={roleIllustrationSrc(role as Role)}
                                alt={roleDisplayName(role as Role)}
                                fill
                                sizes="56px"
                                className="object-contain"
                              />
                            </span>
                            <span className="text-[#cccccc]">{roleDisplayName(role as Role)}:</span>
                          </div>
                          <span className="text-[#e0e0e0] font-semibold">{count}</span>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Validation errors */}
                {!validation.isValid && (
                  <motion.div 
                    className="mt-6 p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                    animate={{ 
                      boxShadow: [
                        "0 0 10px rgba(239, 68, 68, 0.3)",
                        "0 0 20px rgba(239, 68, 68, 0.6)",
                        "0 0 10px rgba(239, 68, 68, 0.3)"
                      ]
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <div className="flex items-center gap-2 mb-2">
                      <motion.div
                        animate={{ rotate: [0, 10, -10, 0] }}
                        transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                      >
                        <AlertTriangle className="w-5 h-5 text-red-400" />
                      </motion.div>
                      <h4 className="text-red-400 font-semibold">Erreurs de validation</h4>
                    </div>
                    <ul className="text-sm text-red-300 space-y-1">
                      {validation.errors.map((error, index) => (
                        <li key={index}>• {error}</li>
                      ))}
                    </ul>
                  </motion.div>
                )}
              </div>
            </ScaryHoverEffects>

            {/* Create button */}
            <ScaryHoverEffects intensity="high">
              <motion.button
                onClick={handleCreateGame}
                disabled={!playerName.trim() || !roomCode.trim() || isLoading || !validation.isValid}
                className="w-full bg-[#ff3333] hover:bg-[#e62e2e] disabled:bg-[#666666] disabled:cursor-not-allowed text-white py-4 rounded-lg text-lg font-semibold transition-all duration-300 flex items-center justify-center gap-3"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                animate={(!playerName.trim() || !roomCode.trim() || isLoading || !validation.isValid) ? {} : {
                  boxShadow: [
                    "0 0 20px rgba(255, 51, 51, 0.3)",
                    "0 0 40px rgba(255, 51, 51, 0.6)",
                    "0 0 20px rgba(255, 51, 51, 0.3)"
                  ]
                }}
                transition={{ duration: 2, repeat: (!playerName.trim() || !roomCode.trim() || isLoading || !validation.isValid) ? 0 : Infinity }}
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
            </ScaryHoverEffects>

            {/* Error display */}
            {(error || localError) && (
              <motion.div 
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg"
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center gap-2 mb-2">
                  <motion.div
                    animate={{ rotate: [0, 10, -10, 0] }}
                    transition={{ duration: 0.5, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <AlertTriangle className="w-5 h-5 text-red-400" />
                  </motion.div>
                  <h4 className="text-red-400 font-semibold">Erreur</h4>
                </div>
                <div className="text-sm text-red-300 whitespace-pre-line">
                  {localError || error}
                </div>
              </motion.div>
            )}

            {/* Test section */}
            <RealtimeTest />

            {/* Tips */}
            <ScaryHoverEffects intensity="low">
              <div className="bg-[#333a45]/20 rounded-lg p-4 border border-[#333a45]/30">
                <h3 className="text-[#ff9933] font-semibold mb-2 flex items-center gap-2">
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  >
                    💡
                  </motion.div>
                  Conseils
                </h3>
                <ul className="text-sm text-[#cccccc] space-y-1">
                  <li>• Partagez le code de salle avec vos amis pour qu&apos;ils puissent rejoindre</li>
                  <li>• Assurez-vous d&apos;avoir au moins 1 loup-garou</li>
                  <li>• Le nombre total de rôles doit être égal au nombre de joueurs</li>
                  <li>• Vous pouvez créer des compositions libres sans villageois</li>
                </ul>
              </div>
            </ScaryHoverEffects>
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