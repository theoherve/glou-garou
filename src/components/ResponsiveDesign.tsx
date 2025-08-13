'use client';

import { useEffect, useState, ReactNode } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Menu, 
  X, 
  ChevronDown, 
  ChevronUp, 
  Smartphone, 
  Tablet, 
  Monitor, 
  Touchpad
} from 'lucide-react';

// Hook pour détecter la taille de l'écran
export const useScreenSize = () => {
  const [screenSize, setScreenSize] = useState({
    width: typeof window !== 'undefined' ? window.innerWidth : 0,
    height: typeof window !== 'undefined' ? window.innerHeight : 0,
    isMobile: false,
    isTablet: false,
    isDesktop: false,
    orientation: 'portrait' as 'portrait' | 'landscape'
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      
      setScreenSize({
        width,
        height,
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024,
        orientation: width > height ? 'landscape' : 'portrait'
      });
    };

    if (typeof window !== 'undefined') {
      handleResize();
      window.addEventListener('resize', handleResize);
      window.addEventListener('orientationchange', handleResize);
      
      return () => {
        window.removeEventListener('resize', handleResize);
        window.removeEventListener('orientationchange', handleResize);
      };
    }
  }, []);

  return screenSize;
};

// Hook pour détecter le support tactile
export const useTouchSupport = () => {
  const [isTouchSupported, setIsTouchSupported] = useState(false);

  useEffect(() => {
    setIsTouchSupported('ontouchstart' in window || navigator.maxTouchPoints > 0);
  }, []);

  return isTouchSupported;
};

// Composant pour la navigation mobile
interface MobileNavigationProps {
  isOpen: boolean;
  onToggle: () => void;
  children: ReactNode;
  className?: string;
}

export const MobileNavigation = ({ 
  isOpen, 
  onToggle, 
  children,
  className = ''
}: MobileNavigationProps) => {
  return (
    <>
      {/* Bouton de menu mobile */}
      <motion.button
        className={`lg:hidden p-2 rounded-lg bg-[#ff3333]/20 hover:bg-[#ff3333]/30 transition-colors ${className}`}
        onClick={onToggle}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        aria-label="Menu de navigation"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="menu"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <Menu className="w-6 h-6 text-white" />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Menu mobile */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="fixed inset-0 z-50 lg:hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Overlay */}
            <motion.div
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={onToggle}
            />

            {/* Menu */}
            <motion.div
              className="absolute right-0 top-0 h-full w-80 bg-[#2a2a2a] border-l border-[#ff3333]/20 shadow-2xl"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-white">Menu</h2>
                  <button
                    onClick={onToggle}
                    className="p-2 hover:bg-[#ff3333]/20 rounded-lg transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  {children}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

// Composant pour les cartes adaptatives
interface AdaptiveCardProps {
  children: ReactNode;
  className?: string;
  mobileClassName?: string;
  tabletClassName?: string;
  desktopClassName?: string;
}

export const AdaptiveCard = ({ 
  children, 
  className = '',
  mobileClassName = '',
  tabletClassName = '',
  desktopClassName = ''
}: AdaptiveCardProps) => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  const getResponsiveClasses = () => {
    if (isMobile) return mobileClassName;
    if (isTablet) return tabletClassName;
    if (isDesktop) return desktopClassName;
    return '';
  };

  return (
    <div className={`${className} ${getResponsiveClasses()}`}>
      {children}
    </div>
  );
};

// Composant pour la grille responsive
interface ResponsiveGridProps {
  children: ReactNode;
  className?: string;
  mobileCols?: number;
  tabletCols?: number;
  desktopCols?: number;
  gap?: string;
}

export const ResponsiveGrid = ({ 
  children, 
  className = '',
  mobileCols = 1,
  tabletCols = 2,
  desktopCols = 3,
  gap = 'gap-4'
}: ResponsiveGridProps) => {
  const { isMobile, isTablet, isDesktop } = useScreenSize();

  const getGridCols = () => {
    if (isMobile) return `grid-cols-${mobileCols}`;
    if (isTablet) return `grid-cols-${tabletCols}`;
    if (isDesktop) return `grid-cols-${desktopCols}`;
    return `grid-cols-${desktopCols}`;
  };

  return (
    <div className={`grid ${getGridCols()} ${gap} ${className}`}>
      {children}
    </div>
  );
};

// Composant pour les boutons tactiles optimisés
interface TouchButtonProps {
  children: ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'danger' | 'success';
  size?: 'small' | 'medium' | 'large';
  disabled?: boolean;
}

export const TouchButton = ({ 
  children, 
  onClick, 
  className = '',
  variant = 'primary',
  size = 'medium',
  disabled = false
}: TouchButtonProps) => {
  const { isMobile, isTablet } = useScreenSize();
  const isTouchDevice = isMobile || isTablet;

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
      case 'secondary':
        return 'bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800';
      case 'danger':
        return 'bg-gradient-to-r from-red-600 to-pink-600 hover:from-red-700 hover:to-pink-700';
      case 'success':
        return 'bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700';
      default:
        return 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return isTouchDevice ? 'px-4 py-3 text-sm' : 'px-3 py-2 text-sm';
      case 'medium':
        return isTouchDevice ? 'px-6 py-4 text-base' : 'px-4 py-2 text-base';
      case 'large':
        return isTouchDevice ? 'px-8 py-5 text-lg' : 'px-6 py-3 text-lg';
      default:
        return isTouchDevice ? 'px-6 py-4 text-base' : 'px-4 py-2 text-base';
    }
  };

  return (
    <motion.button
      className={`
        ${getVariantStyles()} 
        ${getSizeStyles()} 
        text-white font-semibold rounded-lg transition-all duration-200 
        ${isTouchDevice ? 'touch-manipulation' : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { 
        scale: isTouchDevice ? 1.02 : 1.05, 
        y: isTouchDevice ? -1 : -2,
        transition: { duration: 0.2 }
      } : {}}
      whileTap={!disabled ? { 
        scale: isTouchDevice ? 0.98 : 0.95,
        transition: { duration: 0.1 }
      } : {}}
      style={{
        minHeight: isTouchDevice ? '44px' : 'auto', // Taille minimale pour le tactile
        WebkitTapHighlightColor: 'transparent'
      }}
    >
      {children}
    </motion.button>
  );
};

// Composant pour les modales responsives
interface ResponsiveModalProps {
  isVisible: boolean;
  onClose: () => void;
  children: ReactNode;
  title?: string;
  size?: 'small' | 'medium' | 'large' | 'full';
}

export const ResponsiveModal = ({ 
  isVisible, 
  onClose, 
  children, 
  title,
  size = 'medium'
}: ResponsiveModalProps) => {
  const { isMobile, isTablet } = useScreenSize();

  const getSizeClasses = () => {
    if (isMobile) return 'w-full h-full rounded-none';
    
    switch (size) {
      case 'small':
        return 'max-w-md';
      case 'medium':
        return 'max-w-2xl';
      case 'large':
        return 'max-w-4xl';
      case 'full':
        return 'max-w-7xl';
      default:
        return 'max-w-2xl';
    }
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className={`bg-[#2a2a2a] rounded-lg shadow-2xl border border-[#ff3333]/30 ${getSizeClasses()}`}
            initial={{ 
              scale: 0.8, 
              y: isMobile ? 0 : 20,
              opacity: 0 
            }}
            animate={{ 
              scale: 1, 
              y: 0,
              opacity: 1 
            }}
            exit={{ 
              scale: 0.8, 
              y: isMobile ? 0 : 20,
              opacity: 0 
            }}
            transition={{ 
              duration: 0.4, 
              ease: "easeOut",
              type: "spring",
              damping: 25,
              stiffness: 200
            }}
          >
            {/* Header */}
            {title && (
              <div className="flex items-center justify-between p-6 border-b border-[#ff3333]/20">
                <h2 className="text-xl font-bold text-white">{title}</h2>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-[#ff3333]/20 rounded-lg transition-colors"
                  aria-label="Fermer"
                >
                  <X className="w-5 h-5 text-white" />
                </button>
              </div>
            )}

            {/* Contenu */}
            <div className="p-6">
              {children}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Composant pour les indicateurs de taille d'écran (debug)
export const ScreenSizeIndicator = () => {
  const screenSize = useScreenSize();
  const isTouchSupported = useTouchSupport();

  return (
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
  );
};

// Composant pour les accordéons responsifs
interface ResponsiveAccordionProps {
  title: string;
  children: ReactNode;
  defaultOpen?: boolean;
  className?: string;
}

export const ResponsiveAccordion = ({ 
  title, 
  children, 
  defaultOpen = false,
  className = ''
}: ResponsiveAccordionProps) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  const { isMobile } = useScreenSize();

  return (
    <div className={`border border-[#ff3333]/20 rounded-lg ${className}`}>
      <button
        className="w-full p-4 text-left bg-[#2a2a2a] hover:bg-[#3a3a3a] transition-colors rounded-lg"
        onClick={() => setIsOpen(!isOpen)}
        style={{
          minHeight: isMobile ? '56px' : 'auto'
        }}
      >
        <div className="flex items-center justify-between">
          <span className="font-semibold text-white">{title}</span>
          <motion.div
            animate={{ rotate: isOpen ? 180 : 0 }}
            transition={{ duration: 0.2 }}
          >
            {isOpen ? (
              <ChevronUp className="w-5 h-5 text-[#ff3333]" />
            ) : (
              <ChevronDown className="w-5 h-5 text-[#ff3333]" />
            )}
          </motion.div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="p-4 bg-[#1a1a1a] border-t border-[#ff3333]/20">
              {children}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
