'use client';

import { useState } from 'react';
import { UXUIEnhancements, UXUIDemo } from './UXUIEnhancements';

export const UXUIDemoPage = () => {
  const [showDemo, setShowDemo] = useState(false);

  return (
    <UXUIEnhancements
      enableAnimations={true}
      enableParticles={true}
      enableResponsive={true}
      enableNotifications={true}
    >
      <div className="min-h-screen bg-[#1a1a1a] text-white">
        {/* Header */}
        <header className="bg-[#2a2a2a] border-b border-[#ff3333]/20 p-6">
          <div className="max-w-7xl mx-auto">
            <h1 className="text-4xl font-bold text-[#ff3333] mb-2">
              🎨 Démonstration UX/UI
            </h1>
            <p className="text-[#cccccc] text-lg">
              Testez toutes les améliorations d'interface implémentées
            </p>
          </div>
        </header>

        {/* Navigation */}
        <nav className="bg-[#2a2a2a] border-b border-[#ff3333]/20 p-4">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between">
            <div className="flex items-center space-x-6">
              <button
                onClick={() => setShowDemo(false)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  !showDemo 
                    ? 'bg-[#ff3333] text-white' 
                    : 'bg-[#3a3a3a] text-[#cccccc] hover:bg-[#4a4a4a]'
                }`}
              >
                Vue d'ensemble
              </button>
              <button
                onClick={() => setShowDemo(true)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  showDemo 
                    ? 'bg-[#ff3333] text-white' 
                    : 'bg-[#3a3a3a] text-[#cccccc] hover:bg-[#4a4a4a]'
                }`}
              >
                Démonstrations interactives
              </button>
            </div>
            
            <div className="text-[#cccccc] text-sm">
              Glou-Garou - Phase 8 ✅
            </div>
          </div>
        </nav>

        {/* Contenu principal */}
        <main className="max-w-7xl mx-auto p-6">
          {!showDemo ? (
            <div className="space-y-8">
              {/* Vue d'ensemble */}
              <div className="bg-[#2a2a2a] rounded-lg p-8 border border-[#ff3333]/20">
                <h2 className="text-3xl font-bold text-white mb-6 text-center">
                  🎉 Phase 8 : Améliorations UX/UI Complétée !
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Animations */}
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#ff3333]/20">
                    <div className="text-4xl mb-4">✨</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Animations & Transitions</h3>
                    <ul className="text-[#cccccc] space-y-2 text-sm">
                      <li>• Transitions fluides entre phases</li>
                      <li>• Micro-interactions subtiles</li>
                      <li>• Effets visuels avancés</li>
                      <li>• Animations de chargement</li>
                    </ul>
                  </div>

                  {/* Responsive */}
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#ff3333]/20">
                    <div className="text-4xl mb-4">📱</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Design Responsive</h3>
                    <ul className="text-[#cccccc] space-y-2 text-sm">
                      <li>• Adaptation mobile/tablette</li>
                      <li>• Interface tactile optimisée</li>
                      <li>• Navigation mobile intuitive</li>
                      <li>• Grilles adaptatives</li>
                    </ul>
                  </div>

                  {/* Notifications */}
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#ff3333]/20">
                    <div className="text-4xl mb-4">🔔</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Système de Notifications</h3>
                    <ul className="text-[#cccccc] space-y-2 text-sm">
                      <li>• Notifications animées</li>
                      <li>• Types multiples (succès, erreur, etc.)</li>
                      <li>• Barre de progression</li>
                      <li>• Positionnement flexible</li>
                    </ul>
                  </div>

                  {/* Effets visuels */}
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#ff3333]/20">
                    <div className="text-4xl mb-4">🎭</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Effets Visuels</h3>
                    <ul className="text-[#cccccc] space-y-2 text-sm">
                      <li>• Particules animées</li>
                      <li>• Effets météo</li>
                      <li>• Distorsions et glitches</li>
                      <li>• Pulsations et ondes</li>
                    </ul>
                  </div>

                  {/* Performance */}
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#ff3333]/20">
                    <div className="text-4xl mb-4">⚡</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Performance</h3>
                    <ul className="text-[#cccccc] space-y-2 text-sm">
                      <li>• Niveaux d'animation configurables</li>
                      <li>• Optimisation des ressources</li>
                      <li>• Chargement différé</li>
                      <li>• Gestion intelligente</li>
                    </ul>
                  </div>

                  {/* Accessibilité */}
                  <div className="bg-[#1a1a1a] rounded-lg p-6 border border-[#ff3333]/20">
                    <div className="text-4xl mb-4">♿</div>
                    <h3 className="text-xl font-semibold text-white mb-3">Accessibilité</h3>
                    <ul className="text-[#cccccc] space-y-2 text-sm">
                      <li>• Support des lecteurs d'écran</li>
                      <li>• Navigation au clavier</li>
                      <li>• Contrastes adaptatifs</li>
                      <li>• Tailles responsives</li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Statistiques */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
                <h3 className="text-2xl font-semibold text-white mb-6 text-center">
                  📊 Statistiques de la Phase 8
                </h3>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-4xl font-bold text-[#ff3333] mb-2">7</div>
                    <div className="text-[#cccccc]">Composants principaux</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#ff9933] mb-2">25+</div>
                    <div className="text-[#cccccc]">Fonctionnalités</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#33ff33] mb-2">100%</div>
                    <div className="text-[#cccccc]">Responsive</div>
                  </div>
                  <div>
                    <div className="text-4xl font-bold text-[#3333ff] mb-2">3</div>
                    <div className="text-[#cccccc]">Niveaux d'animation</div>
                  </div>
                </div>
              </div>

              {/* Instructions */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                  🚀 Comment utiliser les améliorations
                </h3>
                
                <div className="space-y-4 text-[#cccccc]">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ff3333] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                      1
                    </div>
                    <div>
                      <strong>Bouton de paramètres :</strong> Cliquez sur l'icône ⚙️ en bas à droite pour accéder aux paramètres UX/UI
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ff3333] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                      2
                    </div>
                    <div>
                      <strong>Configuration :</strong> Ajustez le niveau d'animations, la densité des particules et les effets météo selon vos préférences
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ff3333] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                      3
                    </div>
                    <div>
                      <strong>Navigation mobile :</strong> Sur mobile, utilisez le menu hamburger en haut à gauche pour accéder aux options
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-[#ff3333] rounded-full flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-1">
                      4
                    </div>
                    <div>
                      <strong>Démonstrations :</strong> Cliquez sur "Démonstrations interactives" pour tester toutes les fonctionnalités
                    </div>
                  </div>
                </div>
              </div>

              {/* Prochaines étapes */}
              <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
                <h3 className="text-2xl font-semibold text-white mb-4 text-center">
                  🔮 Prochaines étapes
                </h3>
                
                <div className="text-center text-[#cccccc]">
                  <p className="mb-4">
                    La Phase 8 est maintenant complète ! Prochaine étape : la Phase 9 (Tests et Debug)
                  </p>
                  <div className="inline-flex items-center space-x-2 bg-[#1a1a1a] px-4 py-2 rounded-lg border border-[#ff3333]/20">
                    <span>📋</span>
                    <span>22/25 tâches principales complétées</span>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <UXUIDemo />
          )}
        </main>
      </div>
    </UXUIEnhancements>
  );
};
