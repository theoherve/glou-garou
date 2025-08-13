"use client";

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  AlertTriangle, 
  XCircle, 
  CheckCircle, 
  Info, 
  Bug, 
  Trash2, 
  Download,
  Upload,
  RefreshCw,
  Settings,
  Eye,
  EyeOff,
  Filter,
  Search,
  Copy,
  Check
} from 'lucide-react';

interface ErrorLog {
  id: string;
  timestamp: Date;
  level: 'error' | 'warning' | 'info' | 'debug';
  category: 'api' | 'realtime' | 'game' | 'ui' | 'network' | 'database' | 'validation';
  message: string;
  details?: string;
  stack?: string;
  context?: Record<string, any>;
  resolved: boolean;
  userAction?: string;
}

interface ErrorStats {
  total: number;
  errors: number;
  warnings: number;
  info: number;
  debug: number;
  resolved: number;
  unresolved: number;
  byCategory: Record<string, number>;
  byLevel: Record<string, number>;
}

export const ErrorHandler = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [errorLogs, setErrorLogs] = useState<ErrorLog[]>([]);
  const [filteredLogs, setFilteredLogs] = useState<ErrorLog[]>([]);
  const [filters, setFilters] = useState({
    level: 'all' as 'all' | 'error' | 'warning' | 'info' | 'debug',
    category: 'all' as 'all' | 'api' | 'realtime' | 'game' | 'ui' | 'network' | 'database' | 'validation',
    resolved: 'all' as 'all' | 'resolved' | 'unresolved',
    search: ''
  });
  const [showResolved, setShowResolved] = useState(false);
  const [autoResolve, setAutoResolve] = useState(false);
  const [maxLogs, setMaxLogs] = useState(1000);
  const [copied, setCopied] = useState(false);
  
  const errorListenerRef = useRef<((error: ErrorEvent | PromiseRejectionEvent) => void) | null>(null);
  const unhandledRejectionRef = useRef<((event: PromiseRejectionEvent) => void) | null>(null);

  // Configuration des niveaux d'erreur
  const errorLevels = {
    error: { color: 'text-red-500', bgColor: 'bg-red-500/10', icon: XCircle },
    warning: { color: 'text-yellow-500', bgColor: 'bg-yellow-500/10', icon: AlertTriangle },
    info: { color: 'text-blue-500', bgColor: 'bg-blue-500/10', icon: Info },
    debug: { color: 'text-gray-500', bgColor: 'bg-gray-500/10', icon: Bug }
  };

  // Configuration des catégories
  const errorCategories = {
    api: { color: 'text-purple-500', icon: '🌐' },
    realtime: { color: 'text-green-500', icon: '⚡' },
    game: { color: 'text-blue-500', icon: '🎮' },
    ui: { color: 'text-yellow-500', icon: '🎨' },
    network: { color: 'text-red-500', icon: '📡' },
    database: { color: 'text-orange-500', icon: '🗄️' },
    validation: { color: 'text-pink-500', icon: '✅' }
  };

  // Initialiser la gestion des erreurs globales
  useEffect(() => {
    // Écouter les erreurs JavaScript non capturées
    errorListenerRef.current = (event: ErrorEvent | PromiseRejectionEvent) => {
      if ('message' in event) {
        // ErrorEvent
        addErrorLog({
          level: 'error',
          category: 'ui',
          message: event.message || 'Erreur JavaScript',
          details: event.filename ? `Fichier: ${event.filename}:${event.lineno}:${event.colno}` : undefined,
          stack: event.error?.stack,
          context: {
            filename: event.filename,
            lineno: event.lineno,
            colno: event.colno,
            error: event.error
          }
        });
      } else {
        // PromiseRejectionEvent
        addErrorLog({
          level: 'error',
          category: 'api',
          message: 'Promesse rejetée non gérée',
          details: event.reason?.message || String(event.reason),
          context: {
            reason: event.reason,
            stack: event.reason?.stack
          }
        });
      }
    };

    // Écouter les promesses rejetées non gérées
    unhandledRejectionRef.current = (event: PromiseRejectionEvent) => {
      addErrorLog({
        level: 'error',
        category: 'api',
        message: 'Promesse rejetée non gérée',
        details: event.reason?.message || String(event.reason),
        context: {
          reason: event.reason,
          promise: event.promise,
          stack: event.reason?.stack
        }
      });
    };

    // Ajouter les écouteurs
    window.addEventListener('error', errorListenerRef.current);
    window.addEventListener('unhandledrejection', unhandledRejectionRef.current);

    // Nettoyer
    return () => {
      if (errorListenerRef.current) {
        window.removeEventListener('error', errorListenerRef.current);
      }
      if (unhandledRejectionRef.current) {
        window.removeEventListener('unhandledrejection', unhandledRejectionRef.current);
      }
    };
  }, []);

  // Filtrer les logs selon les critères
  useEffect(() => {
    let filtered = errorLogs;

    // Filtre par niveau
    if (filters.level !== 'all') {
      filtered = filtered.filter(log => log.level === filters.level);
    }

    // Filtre par catégorie
    if (filters.category !== 'all') {
      filtered = filtered.filter(log => log.category === filters.category);
    }

    // Filtre par statut de résolution
    if (filters.resolved !== 'all') {
      const isResolved = filters.resolved === 'resolved';
      filtered = filtered.filter(log => log.resolved === isResolved);
    }

    // Filtre par recherche textuelle
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(log => 
        log.message.toLowerCase().includes(searchLower) ||
        log.details?.toLowerCase().includes(searchLower) ||
        log.category.toLowerCase().includes(searchLower)
      );
    }

    setFilteredLogs(filtered);
  }, [errorLogs, filters]);

  // Ajouter un log d'erreur
  const addErrorLog = (logData: Omit<ErrorLog, 'id' | 'timestamp' | 'resolved'>) => {
    const newLog: ErrorLog = {
      ...logData,
      id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date(),
      resolved: false
    };

    setErrorLogs(prev => {
      const updated = [newLog, ...prev];
      
      // Limiter le nombre de logs
      if (updated.length > maxLogs) {
        return updated.slice(0, maxLogs);
      }
      
      return updated;
    });

    // Auto-résolution pour les erreurs de debug et info
    if (autoResolve && (logData.level === 'debug' || logData.level === 'info')) {
      setTimeout(() => {
        resolveError(newLog.id);
      }, 5000);
    }

    // Log dans la console pour le débogage
    console.group(`[${newLog.level.toUpperCase()}] ${newLog.category}: ${newLog.message}`);
    if (newLog.details) console.log('Details:', newLog.details);
    if (newLog.context) console.log('Context:', newLog.context);
    if (newLog.stack) console.log('Stack:', newLog.stack);
    console.groupEnd();
  };

  // Résoudre une erreur
  const resolveError = (errorId: string) => {
    setErrorLogs(prev => prev.map(log => 
      log.id === errorId ? { ...log, resolved: true, userAction: 'Résolu automatiquement' } : log
    ));
  };

  // Résoudre toutes les erreurs
  const resolveAllErrors = () => {
    setErrorLogs(prev => prev.map(log => ({ 
      ...log, 
      resolved: true, 
      userAction: 'Résolu en masse' 
    })));
  };

  // Supprimer un log
  const deleteLog = (errorId: string) => {
    setErrorLogs(prev => prev.filter(log => log.id !== errorId));
  };

  // Supprimer tous les logs
  const clearAllLogs = () => {
    setErrorLogs([]);
  };

  // Exporter les logs
  const exportLogs = () => {
    const dataStr = JSON.stringify(errorLogs, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `error-logs-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
  };

  // Importer des logs
  const importLogs = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedLogs = JSON.parse(e.target?.result as string);
          if (Array.isArray(importedLogs)) {
            setErrorLogs(prev => [...importedLogs, ...prev]);
          }
        } catch (error) {
          addErrorLog({
            level: 'error',
            category: 'validation',
            message: 'Erreur lors de l\'import des logs',
            details: error instanceof Error ? error.message : 'Format de fichier invalide'
          });
        }
      };
      reader.readAsText(file);
    }
  };

  // Copier les logs dans le presse-papiers
  const copyLogs = async () => {
    try {
      const logsText = filteredLogs.map(log => 
        `[${log.timestamp.toISOString()}] ${log.level.toUpperCase()} ${log.category}: ${log.message}`
      ).join('\n');
      
      await navigator.clipboard.writeText(logsText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      addErrorLog({
        level: 'error',
        category: 'ui',
        message: 'Impossible de copier les logs',
        details: error instanceof Error ? error.message : 'Erreur de copie'
      });
    }
  };

  // Calculer les statistiques
  const stats: ErrorStats = {
    total: errorLogs.length,
    errors: errorLogs.filter(log => log.level === 'error').length,
    warnings: errorLogs.filter(log => log.level === 'warning').length,
    info: errorLogs.filter(log => log.level === 'info').length,
    debug: errorLogs.filter(log => log.level === 'debug').length,
    resolved: errorLogs.filter(log => log.resolved).length,
    unresolved: errorLogs.filter(log => !log.resolved).length,
    byCategory: errorLogs.reduce((acc, log) => {
      acc[log.category] = (acc[log.category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>),
    byLevel: errorLogs.reduce((acc, log) => {
      acc[log.level] = (acc[log.level] || 0) + 1;
      return acc;
    }, {} as Record<string, number>)
  };

  // Obtenir l'icône de niveau
  const getLevelIcon = (level: ErrorLog['level']) => {
    const IconComponent = errorLevels[level].icon;
    return <IconComponent className="w-4 h-4" />;
  };

  // Obtenir l'icône de catégorie
  const getCategoryIcon = (category: ErrorLog['category']) => {
    return errorCategories[category].icon;
  };

  if (!isExpanded) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <button
          onClick={() => setIsExpanded(true)}
          className="text-lg font-semibold text-[#e0e0e0] hover:text-[#ff3333] transition-colors flex items-center space-x-2"
        >
          <span className="text-2xl">🚨</span>
          <span>Gestionnaire d'Erreurs</span>
          {stats.unresolved > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {stats.unresolved}
            </span>
          )}
        </button>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="bg-[#2a2a2a] rounded-lg p-6 border border-[#ff3333]/20"
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-[#e0e0e0] flex items-center space-x-2">
          <span className="text-2xl">🚨</span>
          <span>Gestionnaire d'Erreurs</span>
        </h3>
        <button
          onClick={() => setIsExpanded(false)}
          className="text-[#ff3333] hover:text-[#ff6666] transition-colors"
        >
          ✕
        </button>
      </div>

      {/* Statistiques */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">📊 Statistiques des Erreurs</h4>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          <div className="text-center">
            <div className="text-2xl font-bold text-[#e0e0e0]">{stats.total}</div>
            <div className="text-[#cccccc]">Total</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-red-500">{stats.errors}</div>
            <div className="text-[#cccccc]">Erreurs</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-yellow-500">{stats.warnings}</div>
            <div className="text-[#cccccc]">Avertissements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500">{stats.resolved}</div>
            <div className="text-[#cccccc]">Résolues</div>
          </div>
        </div>
      </div>

      {/* Contrôles */}
      <div className="flex flex-wrap gap-3 mb-6">
        <button
          onClick={resolveAllErrors}
          className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <CheckCircle className="w-4 h-4" />
          <span>Résoudre tout</span>
        </button>
        
        <button
          onClick={exportLogs}
          className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Download className="w-4 h-4" />
          <span>Exporter</span>
        </button>
        
        <button
          onClick={copyLogs}
          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          <span>{copied ? 'Copié!' : 'Copier'}</span>
        </button>
        
        <button
          onClick={clearAllLogs}
          className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center space-x-2"
        >
          <Trash2 className="w-4 h-4" />
          <span>Vider tout</span>
        </button>
      </div>

      {/* Filtres */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-[#e0e0e0]">🔍 Filtres</h4>
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={showResolved}
              onChange={(e) => setShowResolved(e.target.checked)}
              className="mr-2"
            />
            <span className="text-sm text-[#cccccc]">Afficher résolues</span>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Niveau</label>
            <select
              value={filters.level}
              onChange={(e) => setFilters(prev => ({ ...prev, level: e.target.value as any }))}
              className="w-full bg-[#2a2a2a] text-[#e0e0e0] px-3 py-2 rounded border border-[#ff3333]/20"
            >
              <option value="all">Tous les niveaux</option>
              <option value="error">Erreurs</option>
              <option value="warning">Avertissements</option>
              <option value="info">Informations</option>
              <option value="debug">Debug</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Catégorie</label>
            <select
              value={filters.category}
              onChange={(e) => setFilters(prev => ({ ...prev, category: e.target.value as any }))}
              className="w-full bg-[#2a2a2a] text-[#e0e0e0] px-3 py-2 rounded border border-[#ff3333]/20"
            >
              <option value="all">Toutes les catégories</option>
              <option value="api">API</option>
              <option value="realtime">Realtime</option>
              <option value="game">Jeu</option>
              <option value="ui">Interface</option>
              <option value="network">Réseau</option>
              <option value="database">Base de données</option>
              <option value="validation">Validation</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Statut</label>
            <select
              value={filters.resolved}
              onChange={(e) => setFilters(prev => ({ ...prev, resolved: e.target.value as any }))}
              className="w-full bg-[#2a2a2a] text-[#e0e0e0] px-3 py-2 rounded border border-[#ff3333]/20"
            >
              <option value="all">Tous</option>
              <option value="unresolved">Non résolues</option>
              <option value="resolved">Résolues</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Recherche</label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-[#666666]" />
              <input
                type="text"
                value={filters.search}
                onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                placeholder="Rechercher..."
                className="w-full bg-[#2a2a2a] text-[#e0e0e0] pl-10 pr-3 py-2 rounded border border-[#ff3333]/20"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Configuration */}
      <div className="mb-6 p-4 bg-[#1a1a1a] rounded-lg border border-[#ff3333]/20">
        <div className="flex items-center justify-between mb-3">
          <h4 className="text-lg font-medium text-[#e0e0e0]">⚙️ Configuration</h4>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Max logs</label>
            <input
              type="number"
              value={maxLogs}
              onChange={(e) => setMaxLogs(Number(e.target.value))}
              className="w-full bg-[#2a2a2a] text-[#e0e0e0] px-3 py-2 rounded border border-[#ff3333]/20"
              min="100"
              max="10000"
              step="100"
            />
          </div>
          
          <div className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={autoResolve}
              onChange={(e) => setAutoResolve(e.target.checked)}
              className="w-4 h-4"
            />
            <span className="text-sm text-[#cccccc]">Auto-résolution debug/info</span>
          </div>
          
          <div>
            <label className="block text-sm text-[#cccccc] mb-1">Importer logs</label>
            <input
              type="file"
              accept=".json"
              onChange={importLogs}
              className="w-full bg-[#2a2a2a] text-[#e0e0e0] px-3 py-2 rounded border border-[#ff3333]/20"
            />
          </div>
        </div>
      </div>

      {/* Logs d'erreurs */}
      <div className="mb-6">
        <h4 className="text-lg font-medium text-[#e0e0e0] mb-3">
          📋 Logs d'Erreurs ({filteredLogs.length})
        </h4>
        <div className="space-y-2 max-h-96 overflow-y-auto">
          {filteredLogs.length === 0 ? (
            <div className="text-center text-[#666666] py-8">
              Aucun log d'erreur trouvé
            </div>
          ) : (
            filteredLogs.map((log) => (
              <motion.div
                key={log.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`p-4 rounded-lg border transition-all ${
                  log.resolved 
                    ? 'bg-[#1a1a1a] border-[#333333] opacity-60' 
                    : 'bg-[#1a1a1a] border-[#ff3333]/20'
                }`}
              >
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center space-x-2">
                    <div className={`p-1 rounded ${errorLevels[log.level].bgColor}`}>
                      {getLevelIcon(log.level)}
                    </div>
                    <span className={`text-sm font-medium ${errorLevels[log.level].color}`}>
                      {log.level.toUpperCase()}
                    </span>
                    <span className="text-sm text-[#cccccc]">
                      {errorCategories[log.category].icon} {log.category}
                    </span>
                    <span className="text-xs text-[#666666]">
                      {log.timestamp.toLocaleString()}
                    </span>
                  </div>
                  
                  <div className="flex items-center space-x-2">
                    {!log.resolved && (
                      <button
                        onClick={() => resolveError(log.id)}
                        className="px-2 py-1 bg-green-600 hover:bg-green-700 text-white rounded text-xs transition-colors"
                      >
                        Résoudre
                      </button>
                    )}
                    <button
                      onClick={() => deleteLog(log.id)}
                      className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
                
                <div className="text-[#e0e0e0] mb-2">{log.message}</div>
                
                {log.details && (
                  <div className="text-sm text-[#cccccc] mb-2">{log.details}</div>
                )}
                
                {log.context && (
                  <details className="text-xs text-[#999999] mb-2">
                    <summary className="cursor-pointer hover:text-[#cccccc]">
                      Contexte ({Object.keys(log.context).length} propriétés)
                    </summary>
                    <pre className="mt-2 p-2 bg-[#0a0a0a] rounded overflow-x-auto">
                      {JSON.stringify(log.context, null, 2)}
                    </pre>
                  </details>
                )}
                
                {log.stack && (
                  <details className="text-xs text-[#999999] mb-2">
                    <summary className="cursor-pointer hover:text-[#cccccc]">
                      Stack trace
                    </summary>
                    <pre className="mt-2 p-2 bg-[#0a0a0a] rounded overflow-x-auto">
                      {log.stack}
                    </pre>
                  </details>
                )}
                
                {log.userAction && (
                  <div className="text-xs text-green-400">
                    Action utilisateur: {log.userAction}
                  </div>
                )}
              </motion.div>
            ))
          )}
        </div>
      </div>
    </motion.div>
  );
};
