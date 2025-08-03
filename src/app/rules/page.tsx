'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Users, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { getAllRoles } from '@/data/roles';

export default function RulesPage() {
  const allRoles = getAllRoles();

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
            <Moon className="w-8 h-8 text-[#ff9933]" />
            <h1 className="text-3xl font-bold text-[#e0e0e0]">Règles du jeu</h1>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game overview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20"
            >
              <h2 className="text-2xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Moon className="w-6 h-6 text-[#ff9933]" />
                Le village de Thiercelieux
              </h2>
              <p className="text-[#cccccc] leading-relaxed">
                Dans le petit village de Thiercelieux, les loups-garous rôdent la nuit et menacent la paix des villageois. 
                Chaque nuit, ils se réveillent pour choisir une victime à éliminer. Les villageois doivent identifier 
                et éliminer tous les loups-garous avant qu'il ne soit trop tard.
              </p>
            </motion.div>

            {/* Game phases */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20"
            >
              <h2 className="text-2xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-[#ff9933]" />
                Déroulement d'une partie
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">Phase de préparation</h3>
                  <p className="text-[#cccccc]">Les rôles sont distribués et les joueurs découvrent leur identité. Certains rôles spéciaux peuvent agir.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">Phase de nuit</h3>
                  <p className="text-[#cccccc]">Tous les joueurs ferment les yeux. Les rôles actifs se réveillent pour utiliser leurs pouvoirs.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">Phase de jour</h3>
                  <p className="text-[#cccccc]">Le village se réveille. Les joueurs découvrent les événements de la nuit et débattent.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-[#e0e0e0] mb-2">Phase de vote</h3>
                  <p className="text-[#cccccc]">Les joueurs votent pour éliminer un suspect. Le joueur avec le plus de voix est éliminé.</p>
                </div>
              </div>
            </motion.div>

            {/* Victory conditions */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20"
            >
              <h2 className="text-2xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-[#ff9933]" />
                Conditions de victoire
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-[#ff3333]/10 rounded-lg p-4 border border-[#ff3333]/20">
                  <h3 className="text-lg font-semibold text-[#ff3333] mb-2">Victoire des Loups-Garous</h3>
                  <p className="text-[#cccccc]">Éliminer tous les villageois et rôles villageois</p>
                </div>
                
                <div className="bg-[#333a45]/20 rounded-lg p-4 border border-[#333a45]/30">
                  <h3 className="text-lg font-semibold text-[#ff9933] mb-2">Victoire du Village</h3>
                  <p className="text-[#cccccc]">Éliminer tous les loups-garous</p>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Sidebar - Roles */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8 }}
            className="space-y-6"
          >
            <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
              <h2 className="text-xl font-semibold text-[#e0e0e0] mb-4 flex items-center gap-2">
                <Users className="w-5 h-5 text-[#ff9933]" />
                Rôles du jeu
              </h2>
              
              <div className="space-y-4">
                {allRoles.map((role, index) => (
                  <motion.div
                    key={role.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className={`p-3 rounded-lg border transition-all duration-200 ${
                      role.team === 'loup-garou'
                        ? 'bg-[#ff3333]/10 border-[#ff3333]/30'
                        : 'bg-[#333a45]/20 border-[#333a45]/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-[#e0e0e0]">{role.name}</span>
                      {role.team === 'loup-garou' && <span className="text-red-400">🐺</span>}
                      {role.team === 'village' && <span className="text-blue-400">🏠</span>}
                    </div>
                    <p className="text-sm text-[#cccccc]">{role.description}</p>
                    {role.nightAction && (
                      <p className="text-xs text-[#ff9933] mt-1">
                        <strong>Action de nuit:</strong> {role.nightAction}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-[#333a45]/20 rounded-lg p-6 border border-[#333a45]/30">
              <h3 className="text-lg font-semibold text-[#ff9933] mb-3">💡 Conseils de jeu</h3>
              <ul className="text-sm text-[#cccccc] space-y-2">
                <li>• <strong>Observez</strong> attentivement le comportement des autres joueurs</li>
                <li>• <strong>Communiquez</strong> avec votre équipe (loups-garous ou villageois)</li>
                <li>• <strong>Méfiez-vous</strong> des accusations trop rapides</li>
                <li>• <strong>Utilisez</strong> vos pouvoirs au bon moment</li>
                <li>• <strong>Bluffez</strong> si nécessaire pour survivre</li>
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
} 