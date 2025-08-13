'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { ReactNode, useEffect, useState } from 'react';
import { 
  CheckCircle, 
  AlertTriangle, 
  Info, 
  XCircle, 
  X,
  Bell,
  Star,
  Heart,
  Zap
} from 'lucide-react';

interface NotificationProps {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info' | 'special';
  title: string;
  message?: string;
  duration?: number;
  onClose?: (id: string) => void;
  icon?: ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export const Notification = ({ 
  id,
  type, 
  title, 
  message, 
  duration = 5000, 
  onClose,
  icon,
  action
}: NotificationProps) => {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  useEffect(() => {
    if (duration > 0) {
      const startTime = Date.now();
      const endTime = startTime + duration;
      
      const updateProgress = () => {
        const now = Date.now();
        const remaining = Math.max(0, endTime - now);
        const newProgress = (remaining / duration) * 100;
        
        if (newProgress <= 0) {
          handleClose();
        } else {
          setProgress(newProgress);
          requestAnimationFrame(updateProgress);
        }
      };
      
      requestAnimationFrame(updateProgress);
    }
  }, [duration]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.(id);
    }, 300);
  };

  const getTypeStyles = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'from-green-500 to-emerald-600',
          border: 'border-green-400/30',
          icon: <CheckCircle className="w-6 h-6 text-green-100" />,
          progress: 'bg-green-400'
        };
      case 'error':
        return {
          bg: 'from-red-500 to-pink-600',
          border: 'border-red-400/30',
          icon: <XCircle className="w-6 h-6 text-red-100" />,
          progress: 'bg-red-400'
        };
      case 'warning':
        return {
          bg: 'from-yellow-500 to-orange-600',
          border: 'border-yellow-400/30',
          icon: <AlertTriangle className="w-6 h-6 text-yellow-100" />,
          progress: 'bg-yellow-400'
        };
      case 'info':
        return {
          bg: 'from-blue-500 to-indigo-600',
          border: 'border-blue-400/30',
          icon: <Info className="w-6 h-6 text-blue-100" />,
          progress: 'bg-blue-400'
        };
      case 'special':
        return {
          bg: 'from-purple-500 to-pink-600',
          border: 'border-purple-400/30',
          icon: <Star className="w-6 h-6 text-purple-100" />,
          progress: 'bg-purple-400'
        };
      default:
        return {
          bg: 'from-gray-500 to-gray-600',
          border: 'border-gray-400/30',
          icon: <Bell className="w-6 h-6 text-gray-100" />,
          progress: 'bg-gray-400'
        };
    }
  };

  const styles = getTypeStyles();

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`bg-gradient-to-r ${styles.bg} rounded-lg border ${styles.border} shadow-lg overflow-hidden`}
          initial={{ 
            opacity: 0, 
            x: 300, 
            scale: 0.8,
            rotateY: 15
          }}
          animate={{ 
            opacity: 1, 
            x: 0, 
            scale: 1,
            rotateY: 0
          }}
          exit={{ 
            opacity: 0, 
            x: 300, 
            scale: 0.8,
            rotateY: -15
          }}
          transition={{ 
            duration: 0.4, 
            ease: "easeOut",
            type: "spring",
            stiffness: 200
          }}
          whileHover={{ 
            scale: 1.02,
            y: -2,
            transition: { duration: 0.2 }
          }}
        >
          {/* Barre de progression */}
          {duration > 0 && (
            <motion.div
              className="h-1 bg-black/20"
              initial={{ width: "100%" }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.1 }}
            >
              <div className={`h-full ${styles.progress} transition-all duration-300`} />
            </motion.div>
          )}

          {/* Contenu de la notification */}
          <div className="p-4">
            <div className="flex items-start space-x-3">
              {/* Icône */}
              <div className="flex-shrink-0">
                {icon || styles.icon}
              </div>

              {/* Contenu textuel */}
              <div className="flex-1 min-w-0">
                <h4 className="text-white font-semibold text-sm mb-1">
                  {title}
                </h4>
                {message && (
                  <p className="text-white/90 text-xs leading-relaxed">
                    {message}
                  </p>
                )}
                
                {/* Action */}
                {action && (
                  <motion.button
                    className="mt-2 text-xs text-white/80 hover:text-white underline transition-colors"
                    onClick={action.onClick}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {action.label}
                  </motion.button>
                )}
              </div>

              {/* Bouton de fermeture */}
              <motion.button
                className="flex-shrink-0 p-1 text-white/60 hover:text-white transition-colors"
                onClick={handleClose}
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.9 }}
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

// Composant pour afficher plusieurs notifications
interface NotificationContainerProps {
  notifications: NotificationProps[];
  onClose: (id: string) => void;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left' | 'top-center' | 'bottom-center';
}

export const NotificationContainer = ({ 
  notifications, 
  onClose,
  position = 'top-right'
}: NotificationContainerProps) => {
  const getPositionClasses = () => {
    switch (position) {
      case 'top-right':
        return 'top-4 right-4';
      case 'top-left':
        return 'top-4 left-4';
      case 'bottom-right':
        return 'bottom-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      default:
        return 'top-4 right-4';
    }
  };

  if (notifications.length === 0) return null;

  return (
    <div className={`fixed z-[200] space-y-3 max-w-sm ${getPositionClasses()}`}>
      <AnimatePresence>
        {notifications.map((notification, index) => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.8 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.8 }}
            transition={{ 
              duration: 0.3, 
              delay: index * 0.1,
              ease: "easeOut"
            }}
          >
            <Notification
              {...notification}
              onClose={onClose}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Hook pour gérer les notifications
export const useNotifications = () => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const addNotification = (notification: Omit<NotificationProps, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    const newNotification = { ...notification, id };
    
    setNotifications(prev => [...prev, newNotification]);
    
    return id;
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const clearAll = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAll
  };
};

// Composants de notification rapides
export const showSuccess = (title: string, message?: string, duration?: number) => {
  // Cette fonction sera utilisée avec le hook useNotifications
  return { type: 'success' as const, title, message, duration };
};

export const showError = (title: string, message?: string, duration?: number) => {
  return { type: 'error' as const, title, message, duration };
};

export const showWarning = (title: string, message?: string, duration?: number) => {
  return { type: 'warning' as const, title, message, duration };
};

export const showInfo = (title: string, message?: string, duration?: number) => {
  return { type: 'info' as const, title, message, duration };
};

export const showSpecial = (title: string, message?: string, duration?: number) => {
  return { type: 'special' as const, title, message, duration };
};
