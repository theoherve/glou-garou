"use client";

import { useEffect, useRef, useState } from 'react';
import { useGameStore } from '@/store/gameStore';
import { useRealtime } from './RealtimeProvider';
import { 
  Save, 
  RotateCcw, 
  Download, 
  Upload, 
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';

interface StateBackupManagerProps {
  roomCode: string;
}

interface BackupInfo {
  timestamp: Date;
  gameState: any;
  playerCount: number;
  phase: string;
  size: number;
}

export const StateBackupManager = ({ roomCode }: StateBackupManagerProps) => {
  const { currentGame, getGameStateSnapshot, restoreGameState } = useGameStore();
  const { isConnected } = useRealtime();
  
  const [backups, setBackups] = useState<BackupInfo[]>([]);
  const [lastBackup, setLastBackup] = useState<Date | null>(null);
  const [isBackingUp, setIsBackingUp] = useState(false);
  const [isRestoring, setIsRestoring] = useState(false);
  const [showBackupPanel, setShowBackupPanel] = useState(false);
  
  // Référence pour le timer de sauvegarde automatique
  const autoSaveTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  
  // Sauvegarder l'état actuel
  const saveCurrentState = async () => {
    if (!currentGame || !isConnected) return;
    
    setIsBackingUp(true);
    
    try {
      const snapshot = getGameStateSnapshot();
      if (!snapshot) {
        throw new Error('Impossible de créer un snapshot de l\'état actuel');
      }
      
      // Créer l'information de backup
      const backupInfo: BackupInfo = {
        timestamp: new Date(),
        gameState: snapshot,
        playerCount: snapshot.players.length,
        phase: snapshot.phase,
        size: JSON.stringify(snapshot).length,
      };
      
      // Sauvegarder dans localStorage
      const backupKey = `game-backup-${roomCode}-${Date.now()}`;
      localStorage.setItem(backupKey, JSON.stringify(backupInfo));
      
      // Sauvegarder dans la base de données via l'API
      await fetch(`/api/games/${roomCode}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'state_backup',
          playerId: 'system',
          targetId: null,
          actionData: {
            backupKey,
            timestamp: backupInfo.timestamp.toISOString(),
            playerCount: backupInfo.playerCount,
            phase: backupInfo.phase,
            size: backupInfo.size,
          },
        }),
      });
      
      // Mettre à jour la liste des backups
      setBackups(prev => [backupInfo, ...prev.slice(0, 9)]); // Garder seulement les 10 derniers
      setLastBackup(backupInfo.timestamp);
      
      console.log('💾 État sauvegardé avec succès');
    } catch (error) {
      console.error('Erreur lors de la sauvegarde:', error);
    } finally {
      setIsBackingUp(false);
    }
  };
  
  // Restaurer un état depuis un backup
  const restoreFromBackup = async (backup: BackupInfo) => {
    if (!isConnected) {
      alert('Impossible de restaurer l\'état : pas de connexion au serveur');
      return;
    }
    
    setIsRestoring(true);
    
    try {
      // Vérifier que le backup n'est pas trop ancien (moins de 10 minutes)
      const backupAge = Date.now() - backup.timestamp.getTime();
      const maxAge = 10 * 60 * 1000; // 10 minutes
      
      if (backupAge > maxAge) {
        throw new Error('Ce backup est trop ancien pour être restauré');
      }
      
      // Restaurer l'état
      restoreGameState(backup.gameState);
      
      // Enregistrer la restauration dans la base de données
      await fetch(`/api/games/${roomCode}/actions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          actionType: 'state_restore',
          playerId: 'system',
          targetId: null,
          actionData: {
            backupTimestamp: backup.timestamp.toISOString(),
            restoredAt: new Date().toISOString(),
          },
        }),
      });
      
      console.log('💾 État restauré avec succès');
    } catch (error) {
      console.error('Erreur lors de la restauration:', error);
      alert(`Erreur lors de la restauration: ${error instanceof Error ? error.message : 'Erreur inconnue'}`);
    } finally {
      setIsRestoring(false);
    }
  };
  
  // Exporter un backup
  const exportBackup = (backup: BackupInfo) => {
    try {
      const dataStr = JSON.stringify(backup, null, 2);
      const dataBlob = new Blob([dataStr], { type: 'application/json' });
      
      const url = URL.createObjectURL(dataBlob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `glou-garou-backup-${roomCode}-${backup.timestamp.toISOString().split('T')[0]}.json`;
      
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
      
      console.log('📁 Backup exporté avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'export:', error);
    }
  };
  
  // Importer un backup depuis un fichier
  const importBackup = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    
    try {
      const text = await file.text();
      const backup: BackupInfo = JSON.parse(text);
      
      // Vérifier la structure du backup
      if (!backup.gameState || !backup.timestamp || !backup.phase) {
        throw new Error('Format de backup invalide');
      }
      
      // Ajouter à la liste des backups
      setBackups(prev => [backup, ...prev.slice(0, 9)]);
      
      console.log('📁 Backup importé avec succès');
    } catch (error) {
      console.error('Erreur lors de l\'import:', error);
      alert('Erreur lors de l\'import du backup: format invalide');
    }
    
    // Réinitialiser l'input
    event.target.value = '';
  };
  
  // Charger les backups existants depuis localStorage
  useEffect(() => {
    const loadExistingBackups = () => {
      const existingBackups: BackupInfo[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key && key.startsWith(`game-backup-${roomCode}-`)) {
          try {
            const backupData = localStorage.getItem(key);
            if (backupData) {
              const backup: BackupInfo = JSON.parse(backupData);
              existingBackups.push(backup);
            }
          } catch (error) {
            console.warn('Backup corrompu ignoré:', key);
          }
        }
      }
      
      // Trier par date (plus récent en premier)
      existingBackups.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
      
      setBackups(existingBackups.slice(0, 10)); // Garder seulement les 10 plus récents
      
      if (existingBackups.length > 0) {
        setLastBackup(existingBackups[0].timestamp);
      }
    };
    
    loadExistingBackups();
  }, [roomCode]);
  
  // Démarrer la sauvegarde automatique
  useEffect(() => {
    if (isConnected && currentGame) {
      // Sauvegarder automatiquement toutes les 2 minutes
      autoSaveTimerRef.current = setInterval(saveCurrentState, 2 * 60 * 1000);
      
      return () => {
        if (autoSaveTimerRef.current) {
          clearInterval(autoSaveTimerRef.current);
        }
      };
    }
  }, [isConnected, currentGame, roomCode]);
  
  // Nettoyer les anciens backups (plus de 24h)
  useEffect(() => {
    const cleanupOldBackups = () => {
      const now = Date.now();
      const maxAge = 24 * 60 * 60 * 1000; // 24 heures
      
      backups.forEach(backup => {
        const backupAge = now - backup.timestamp.getTime();
        if (backupAge > maxAge) {
          // Supprimer le backup du localStorage
          const backupKey = `game-backup-${roomCode}-${backup.timestamp.getTime()}`;
          localStorage.removeItem(backupKey);
        }
      });
      
      // Mettre à jour la liste en supprimant les anciens
      setBackups(prev => prev.filter(backup => {
        const backupAge = now - backup.timestamp.getTime();
        return backupAge <= maxAge;
      }));
    };
    
    const cleanupInterval = setInterval(cleanupOldBackups, 60 * 60 * 1000); // Toutes les heures
    
    return () => clearInterval(cleanupInterval);
  }, [backups, roomCode]);
  
  if (!currentGame) return null;
  
  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* En-tête */}
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Gestionnaire de Sauvegarde</h3>
        <button
          onClick={() => setShowBackupPanel(!showBackupPanel)}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          {showBackupPanel ? 'Masquer' : 'Afficher'}
        </button>
      </div>
      
      {/* Statut de la dernière sauvegarde */}
      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg mb-4">
        <div className="flex items-center space-x-2">
          <Save className="w-4 h-4 text-blue-500" />
          <span className="text-sm text-gray-600">
            Dernière sauvegarde: {lastBackup ? lastBackup.toLocaleTimeString() : 'Jamais'}
          </span>
        </div>
        
        <button
          onClick={saveCurrentState}
          disabled={isBackingUp || !isConnected}
          className="px-3 py-1 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-1"
        >
          {isBackingUp ? (
            <>
              <Clock className="w-3 h-3 animate-spin" />
              <span>Sauvegarde...</span>
            </>
          ) : (
            <>
              <Save className="w-3 h-3" />
              <span>Sauvegarder</span>
            </>
          )}
        </button>
      </div>
      
      {/* Panel détaillé */}
      {showBackupPanel && (
        <div className="space-y-4">
          {/* Import/Export */}
          <div className="flex space-x-2">
            <label className="flex-1">
              <input
                type="file"
                accept=".json"
                onChange={importBackup}
                className="hidden"
              />
              <div className="w-full px-3 py-2 bg-green-600 text-white text-sm rounded hover:bg-green-700 cursor-pointer flex items-center justify-center space-x-1">
                <Upload className="w-3 h-3" />
                <span>Importer</span>
              </div>
            </label>
          </div>
          
          {/* Liste des backups */}
          {backups.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-medium text-gray-700">Backups disponibles:</h4>
              {backups.map((backup, index) => (
                <div
                  key={backup.timestamp.getTime()}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium text-gray-900">
                        {backup.timestamp.toLocaleString()}
                      </span>
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                        {backup.phase}
                      </span>
                      <span className="text-xs text-gray-500">
                        {backup.playerCount} joueurs
                      </span>
                    </div>
                    <div className="text-xs text-gray-500 mt-1">
                      Taille: {(backup.size / 1024).toFixed(1)} KB
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <button
                      onClick={() => exportBackup(backup)}
                      className="p-2 text-blue-600 hover:bg-blue-100 rounded"
                      title="Exporter"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                    
                    <button
                      onClick={() => restoreFromBackup(backup)}
                      disabled={isRestoring || !isConnected}
                      className="p-2 text-green-600 hover:bg-green-100 rounded disabled:opacity-50"
                      title="Restaurer"
                    >
                      {isRestoring ? (
                        <Clock className="w-4 h-4 animate-spin" />
                      ) : (
                        <RotateCcw className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {backups.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-yellow-500" />
              <p>Aucun backup disponible</p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
