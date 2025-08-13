'use client';

import { useState, useEffect, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Settings, 
  Palette, 
  Smartphone, 
  Tablet,
  Touchpad,
  Zap, 
  Eye,
  Volume2,
  VolumeX,
  Sun,
  Moon,
  Monitor
} from 'lucide-react';

// Import des composants créés
import { PhaseTransition } from './PhaseTransition';
import { MicroInteractions, AnimatedButton, AnimatedCard } from './MicroInteractions';
import { NotificationContainer, useNotifications } from './AnimatedNotifications';
import { 
  ParticleEffect, 
  BackgroundParticles, 
  DistortionEffect,
  PulseEffect,
  GlitchEffect,
  BreathingEffect,
  WeatherEffect
} from './AdvancedVisualEffects';
import { 
  useScreenSize, 
  useTouchSupport, 
  MobileNavigation,
  ResponsiveModal,
  TouchButton,
  ResponsiveGrid
} from './ResponsiveDesign';
import { 
  LoadingSpinner, 
  LoadingSteps, 
  LoadingProgress,
  ThemedLoading,
  ParticleLoading
} from './LoadingAnimations';

interface UXUIEnhancementsProps {
  children: ReactNode;
  enableAnimations?: boolean;
  enableParticles?: boolean;
  enableResponsive?: boolean;
  enableNotifications?: boolean;
  className?: string;
}

export const UXUIEnhancements = ({ 
  children, 
  enableAnimations = true,
  enableParticles = true,
  enableResponsive = true,
  enableNotifications = true,
  className = ''
}: UXUIEnhancementsProps) => {
  const [showSettings, setShowSettings] = useState(false);
  const [animationLevel, setAnimationLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [particleDensity, setParticleDensity] = useState<'low' | 'medium' | 'high'>('medium');
  const [weatherEffect, setWeatherEffect] = useState<'none' | 'rain' | 'snow' | 'fog' | 'wind'>('none');
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const screenSize = useScreenSize();
  const isTouchSupported = useTouchSupport();
  const { notifications, addNotification, removeNotification } = useNotifications();

  // Gestion des animations selon le niveau
  const getAnimationIntensity = () => {
    switch (animationLevel) {
      case 'low': return 0.5;
      case 'medium': return 1;
      case 'high': return 1.5;
      default: return 1;
    }
  };

  // Gestion des particules selon la densité
  const getParticleCount = () => {
    switch (particleDensity) {
      case 'low': return 15;
      case 'medium': return 30;
      case 'high': return 50;
      default: return 30;
    }
  };

  // Note: Les effets de particules sont automatiquement activés selon les paramètres
  // Pas besoin de notification automatique pour éviter les boucles infinies

  // Gestion du mode sombre/clair
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  // Gestion du son
  useEffect(() => {
    if (isMuted) {
      // Désactiver tous les sons
      document.documentElement.style.setProperty('--sound-enabled', '0');
    } else {
      // Réactiver les sons
      document.documentElement.style.setProperty('--sound-enabled', '1');
    }
  }, [isMuted]);

  return (
    <div className={`relative ${className}`}>
      {/* Effets de particules en arrière-plan */}
      {enableParticles && (
        <BackgroundParticles 
          isActive={true}
          density={particleDensity}
          speed="normal"
        />
      )}

      {/* Effet de météo */}
      {weatherEffect !== 'none' && (
        <WeatherEffect 
          isActive={true}
          type={weatherEffect}
          intensity={1}
        />
      )}

      {/* Effet de respiration */}
      <BreathingEffect 
        isActive={enableAnimations && animationLevel !== 'low'}
        intensity={getAnimationIntensity()}
        speed={4}
      />

      {/* Effet de pulsation */}
      <PulseEffect 
        isActive={enableAnimations && animationLevel === 'high'}
        color="rgba(59, 130, 246, 0.1)"
        frequency={3}
        size={50}
      />

      {/* Effet de glitch occasionnel */}
      <GlitchEffect 
        isActive={enableAnimations && animationLevel === 'high'}
        intensity={0.5}
        frequency={10}
      />

      {/* Contenu principal avec micro-interactions */}
      <MicroInteractions 
        intensity={animationLevel}
        className="w-full"
      >
        {children}
      </MicroInteractions>

      {/* Bouton de paramètres flottant */}
      <motion.button
        className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-blue-600 to-purple-600 rounded-full shadow-lg hover:shadow-xl transition-all duration-200"
        onClick={() => setShowSettings(true)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        initial={{ opacity: 0, scale: 0 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
      >
        <Settings className="w-6 h-6 text-white" />
      </motion.button>

      {/* Navigation mobile */}
      {enableResponsive && screenSize.isMobile && (
        <MobileNavigation
          isOpen={showMobileMenu}
          onToggle={() => setShowMobileMenu(!showMobileMenu)}
          className="fixed top-4 left-4 z-50"
        >
          <div className="space-y-4">
            <TouchButton
              variant="primary"
              size="medium"
              onClick={() => {
                setShowSettings(true);
                setShowMobileMenu(false);
              }}
            >
              Paramètres
            </TouchButton>
            
            <TouchButton
              variant="secondary"
              size="medium"
              onClick={() => {
                setIsDarkMode(!isDarkMode);
                setShowMobileMenu(false);
              }}
            >
              {isDarkMode ? 'Mode clair' : 'Mode sombre'}
            </TouchButton>

            <TouchButton
              variant="secondary"
              size="medium"
              onClick={() => {
                setIsMuted(!isMuted);
                setShowMobileMenu(false);
              }}
            >
              {isMuted ? 'Activer le son' : 'Désactiver le son'}
            </TouchButton>
          </div>
        </MobileNavigation>
      )}

      {/* Modal des paramètres */}
      <ResponsiveModal
        isVisible={showSettings}
        onClose={() => setShowSettings(false)}
        title="Paramètres UX/UI"
        size="medium"
      >
        <div className="space-y-6">
          {/* Niveau d'animations */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Zap className="w-5 h-5 mr-2" />
              Niveau d'animations
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((level) => (
                <TouchButton
                  key={level}
                  variant={animationLevel === level ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => setAnimationLevel(level)}
                >
                  {level === 'low' ? 'Faible' : level === 'medium' ? 'Moyen' : 'Élevé'}
                </TouchButton>
              ))}
            </div>
          </div>

          {/* Densité des particules */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Eye className="w-5 h-5 mr-2" />
              Densité des particules
            </h3>
            <div className="grid grid-cols-3 gap-3">
              {(['low', 'medium', 'high'] as const).map((density) => (
                <TouchButton
                  key={density}
                  variant={particleDensity === density ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => setParticleDensity(density)}
                >
                  {density === 'low' ? 'Faible' : density === 'medium' ? 'Moyen' : 'Élevé'}
                </TouchButton>
              ))}
            </div>
          </div>

          {/* Effets météo */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Sun className="w-5 h-5 mr-2" />
              Effets météo
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {(['none', 'rain', 'snow', 'fog', 'wind'] as const).map((weather) => (
                <TouchButton
                  key={weather}
                  variant={weatherEffect === weather ? 'primary' : 'secondary'}
                  size="small"
                  onClick={() => setWeatherEffect(weather)}
                >
                  {weather === 'none' ? 'Aucun' : 
                   weather === 'rain' ? 'Pluie' :
                   weather === 'snow' ? 'Neige' :
                   weather === 'fog' ? 'Brouillard' : 'Vent'}
                </TouchButton>
              ))}
            </div>
          </div>

          {/* Mode sombre/clair */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              {isDarkMode ? <Moon className="w-5 h-5 mr-2" /> : <Sun className="w-5 h-5 mr-2" />}
              Thème
            </h3>
            <TouchButton
              variant="secondary"
              size="medium"
              onClick={() => setIsDarkMode(!isDarkMode)}
              className="w-full"
            >
              Passer au mode {isDarkMode ? 'clair' : 'sombre'}
            </TouchButton>
          </div>

          {/* Contrôle du son */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              {isMuted ? <VolumeX className="w-5 h-5 mr-2" /> : <Volume2 className="w-5 h-5 mr-2" />}
              Son
            </h3>
            <TouchButton
              variant="secondary"
              size="medium"
              onClick={() => setIsMuted(!isMuted)}
              className="w-full"
            >
              {isMuted ? 'Activer' : 'Désactiver'} le son
            </TouchButton>
          </div>

          {/* Informations système */}
          <div className="bg-[#3a3a3a] rounded-lg p-4">
            <h3 className="text-lg font-semibold text-white mb-3 flex items-center">
              <Monitor className="w-5 h-5 mr-2" />
              Informations système
            </h3>
            <div className="space-y-2 text-sm text-gray-300">
              <div>Écran: {screenSize.width} × {screenSize.height}</div>
              <div>Type: {screenSize.isMobile ? 'Mobile' : screenSize.isTablet ? 'Tablette' : 'Desktop'}</div>
              <div>Orientation: {screenSize.orientation}</div>
              <div>Tactile: {isTouchSupported ? 'Oui' : 'Non'}</div>
              <div>Animations: {animationLevel}</div>
              <div>Particules: {particleDensity}</div>
            </div>
          </div>
        </div>
      </ResponsiveModal>

      {/* Notifications */}
      {enableNotifications && (
        <NotificationContainer
          notifications={notifications}
          onClose={removeNotification}
          position="top-right"
        />
      )}

      {/* Indicateur de taille d'écran (debug) */}
      {process.env.NODE_ENV === 'development' && (
        <div className="fixed bottom-4 left-4 bg-black/80 text-white p-3 rounded-lg text-xs font-mono z-50">
          <div className="flex items-center space-x-2 mb-2">
            {screenSize.isMobile && <Smartphone className="w-4 h-4" />}
            {screenSize.isTablet && <Tablet className="w-4 h-4" />}
            {screenSize.isDesktop && <Monitor className="w-4 h-4" />}
            {isTouchSupported && <Touchpad className="w-4 h-4" />}
          </div>
          <div>{screenSize.width} × {screenSize.height}</div>
          <div className="text-gray-400">{screenSize.orientation}</div>
        </div>
      )}
    </div>
  );
};

// Composant de démonstration des améliorations
export const UXUIDemo = () => {
  const [currentDemo, setCurrentDemo] = useState<'particles' | 'loading' | 'transitions' | 'responsive'>('particles');
  const [isLoading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [loadingSteps, setLoadingSteps] = useState(0);

  const demos = [
    { id: 'particles', name: 'Particules', icon: '✨' },
    { id: 'loading', name: 'Chargement', icon: '⏳' },
    { id: 'transitions', name: 'Transitions', icon: '🔄' },
    { id: 'responsive', name: 'Responsive', icon: '📱' }
  ];

  const startLoadingDemo = () => {
    setLoading(true);
    setLoadingProgress(0);
    setLoadingSteps(0);

    const steps = [
      'Initialisation...',
      'Chargement des données...',
      'Préparation de l\'interface...',
      'Finalisation...'
    ];

    let currentStep = 0;
    const interval = setInterval(() => {
      setLoadingProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setLoading(false);
          return 100;
        }
        return prev + 10;
      });

      if (currentStep < steps.length) {
        setLoadingSteps(currentStep);
        currentStep++;
      }
    }, 200);
  };

  return (
    <div className="p-6 space-y-6">
      <h2 className="text-2xl font-bold text-white mb-6">🎨 Démonstration des Améliorations UX/UI</h2>

      {/* Navigation des démos */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {demos.map((demo) => (
          <AnimatedCard
            key={demo.id}
            delay={demos.indexOf(demo)}
            direction="up"
            className="cursor-pointer"
          >
            <div 
              className={`p-4 rounded-lg border-2 transition-colors ${
                currentDemo === demo.id 
                  ? 'border-blue-500 bg-blue-900/20' 
                  : 'border-gray-600 bg-gray-800/20'
              }`}
              onClick={() => setCurrentDemo(demo.id as any)}
            >
              <div className="text-3xl mb-2">{demo.icon}</div>
              <div className="text-white font-medium">{demo.name}</div>
            </div>
          </AnimatedCard>
        ))}
      </div>

      {/* Contenu des démos */}
      <div className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20">
        {currentDemo === 'particles' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">✨ Effets de Particules</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative h-32 bg-[#1a1a1a] rounded-lg border border-gray-600">
                <ParticleEffect isActive={true} type="sparkles" count={15} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400">Étincelles</span>
                </div>
              </div>
              <div className="relative h-32 bg-[#1a1a1a] rounded-lg border border-gray-600">
                <ParticleEffect isActive={true} type="stars" count={20} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400">Étoiles</span>
                </div>
              </div>
              <div className="relative h-32 bg-[#1a1a1a] rounded-lg border border-gray-600">
                <ParticleEffect isActive={true} type="hearts" count={12} />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-gray-400">Cœurs</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {currentDemo === 'loading' && (
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-white">⏳ Animations de Chargement</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Spinner classique</h4>
                <LoadingSpinner size="large" text="Chargement..." />
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Barre de progression</h4>
                <LoadingProgress 
                  progress={loadingProgress} 
                  text="Chargement en cours..."
                  showPercentage={true}
                />
              </div>
            </div>

            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-300">Étapes de chargement</h4>
              <LoadingSteps 
                steps={[
                  'Initialisation...',
                  'Chargement des données...',
                  'Préparation de l\'interface...',
                  'Finalisation...'
                ]}
                currentStep={loadingSteps}
              />
            </div>

            <div className="text-center">
              <AnimatedButton
                variant="primary"
                onClick={startLoadingDemo}
                disabled={isLoading}
              >
                {isLoading ? 'Chargement...' : 'Démarrer la démo'}
              </AnimatedButton>
            </div>
          </div>
        )}

        {currentDemo === 'transitions' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">🔄 Transitions et Animations</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Micro-interactions</h4>
                <div className="space-y-3">
                  <MicroInteractions>
                    <div className="p-4 bg-blue-600 rounded-lg text-white text-center">
                      Hoverez-moi !
                    </div>
                  </MicroInteractions>
                  
                  <AnimatedButton variant="primary">
                    Bouton animé
                  </AnimatedButton>
                </div>
              </div>
              
              <div className="space-y-4">
                <h4 className="text-lg font-medium text-gray-300">Cartes animées</h4>
                <div className="space-y-3">
                  {[0, 1, 2].map((i) => (
                    <AnimatedCard key={i} delay={i} direction="left">
                      <div className="p-3 bg-purple-600 rounded-lg text-white text-center">
                        Carte {i + 1}
                      </div>
                    </AnimatedCard>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {currentDemo === 'responsive' && (
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-white">📱 Design Responsive</h3>
            <div className="space-y-4">
              <h4 className="text-lg font-medium text-gray-300">Grille adaptative</h4>
              <ResponsiveGrid
                mobileCols={1}
                tabletCols={2}
                desktopCols={3}
                gap="gap-4"
              >
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div key={i} className="p-4 bg-gray-700 rounded-lg text-white text-center">
                    Élément {i}
                  </div>
                ))}
              </ResponsiveGrid>

              <h4 className="text-lg font-medium text-gray-300">Boutons tactiles</h4>
              <div className="flex flex-wrap gap-3">
                <TouchButton variant="primary" size="small">
                  Petit
                </TouchButton>
                <TouchButton variant="secondary" size="medium">
                  Moyen
                </TouchButton>
                <TouchButton variant="danger" size="large">
                  Grand
                </TouchButton>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
