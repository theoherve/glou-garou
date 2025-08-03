'use client';

import { motion } from 'framer-motion';
import { ArrowLeft, Moon, Users, Clock, Target } from 'lucide-react';
import Link from 'next/link';
import { getAllRoles } from '@/data/roles';

export default function RulesPage() {
  const allRoles = getAllRoles();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-4 mb-8"
        >
          <Link href="/">
            <motion.button
              className="p-2 rounded-lg bg-white/10 hover:bg-white/20 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowLeft className="w-6 h-6 text-white" />
            </motion.button>
          </Link>
          <h1 className="text-3xl font-bold text-white">Règles du jeu</h1>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Game overview */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Moon className="w-6 h-6 text-red-400" />
                Le village de Thiercelieux
              </h2>
              <p className="text-gray-300 leading-relaxed">
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
              className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Clock className="w-6 h-6 text-blue-400" />
                Déroulement d'une partie
              </h2>
              
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phase de préparation</h3>
                  <p className="text-gray-300">Les rôles sont distribués et les joueurs découvrent leur identité. Certains rôles spéciaux peuvent agir.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phase de nuit</h3>
                  <p className="text-gray-300">Tous les joueurs ferment les yeux. Les rôles actifs se réveillent pour utiliser leurs pouvoirs.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phase de jour</h3>
                  <p className="text-gray-300">Le village se réveille. Les joueurs découvrent les événements de la nuit et débattent.</p>
                </div>
                
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Phase de vote</h3>
                  <p className="text-gray-300">Les joueurs votent pour éliminer un suspect. Le joueur avec le plus de voix est éliminé.</p>
                </div>
              </div>
            </motion.div>

            {/* Victory conditions */}
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10"
            >
              <h2 className="text-2xl font-semibold text-white mb-4 flex items-center gap-2">
                <Target className="w-6 h-6 text-green-400" />
                Conditions de victoire
              </h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-red-500/10 rounded-lg p-4 border border-red-500/20">
                  <h3 className="text-lg font-semibold text-red-400 mb-2">Victoire des Loups-Garous</h3>
                  <p className="text-gray-300">Éliminer tous les villageois et rôles villageois</p>
                </div>
                
                <div className="bg-blue-500/10 rounded-lg p-4 border border-blue-500/20">
                  <h3 className="text-lg font-semibold text-blue-400 mb-2">Victoire du Village</h3>
                  <p className="text-gray-300">Éliminer tous les loups-garous</p>
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
            <div className="bg-white/5 rounded-lg p-6 backdrop-blur-sm border border-white/10">
              <h2 className="text-xl font-semibold text-white mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
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
                        ? 'bg-red-500/10 border-red-500/30'
                        : 'bg-blue-500/10 border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-semibold text-white">{role.name}</span>
                      {role.team === 'loup-garou' && <span className="text-red-400">🐺</span>}
                      {role.team === 'village' && <span className="text-blue-400">🏠</span>}
                    </div>
                    <p className="text-sm text-gray-300">{role.description}</p>
                    {role.nightAction && (
                      <p className="text-xs text-yellow-400 mt-1">
                        <strong>Action de nuit:</strong> {role.nightAction}
                      </p>
                    )}
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Tips */}
            <div className="bg-yellow-500/10 rounded-lg p-6 backdrop-blur-sm border border-yellow-500/20">
              <h3 className="text-lg font-semibold text-yellow-400 mb-3">💡 Conseils de jeu</h3>
              <ul className="text-sm text-gray-300 space-y-2">
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