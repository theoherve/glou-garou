'use client';

import { useGameStore } from '@/store/gameStore';

export const PlayerDataDebug = () => {
  const { currentGame, currentPlayer } = useGameStore();

  if (!currentGame) {
    return (
      <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
        <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">🐛 Debug: Données du jeu</h3>
        <p className="text-[#cccccc]">Aucun jeu chargé</p>
      </div>
    );
  }

  return (
    <div className="bg-[#2a2a2a] rounded-lg p-4 border border-[#ff3333]/20">
      <h3 className="text-lg font-semibold text-[#e0e0e0] mb-3">🐛 Debug: Données du jeu</h3>
      
      <div className="space-y-4">
        {/* Informations générales */}
        <div>
          <h4 className="text-md font-medium text-[#ff9933] mb-2">Informations générales</h4>
          <div className="text-sm text-[#cccccc] space-y-1">
            <div>ID du jeu: {currentGame.id}</div>
            <div>Code de salle: {currentGame.roomCode}</div>
            <div>Phase: {currentGame.phase}</div>
            <div>Nombre de joueurs: {currentGame.players?.length || 0}</div>
            <div>Joueur maître ID: {currentGame.gameMasterId}</div>
          </div>
        </div>

        {/* Données des joueurs */}
        <div>
          <h4 className="text-md font-medium text-[#ff9933] mb-2">Données des joueurs</h4>
          <div className="text-sm text-[#cccccc] space-y-2">
            {currentGame.players?.map((player, index) => (
              <div key={player?.id || index} className="border border-[#333333] p-2 rounded">
                <div className="font-medium">Joueur {index + 1}:</div>
                <div className="ml-4 space-y-1">
                  <div>ID: {player?.id || 'undefined'}</div>
                  <div>Nom: {player?.name || 'undefined'}</div>
                  <div>Rôle: {player?.role || 'undefined'}</div>
                  <div>Statut: {player?.status || 'undefined'}</div>
                  <div>Est maître: {player?.isGameMaster ? 'Oui' : 'Non'}</div>
                  <div>Type d'objet: {typeof player}</div>
                  <div>Propriétés: {player ? Object.keys(player).join(', ') : 'null/undefined'}</div>
                </div>
              </div>
            )) || <div className="text-red-400">Aucun joueur trouvé</div>}
          </div>
        </div>

        {/* Joueur actuel */}
        <div>
          <h4 className="text-md font-medium text-[#ff9933] mb-2">Joueur actuel</h4>
          <div className="text-sm text-[#cccccc] space-y-1">
            {currentPlayer ? (
              <>
                <div>ID: {currentPlayer.id}</div>
                <div>Nom: {currentPlayer.name}</div>
                <div>Rôle: {currentPlayer.role}</div>
                <div>Statut: {currentPlayer.status}</div>
                <div>Est maître: {currentPlayer.isGameMaster ? 'Oui' : 'Non'}</div>
              </>
            ) : (
              <div className="text-red-400">Aucun joueur actuel</div>
            )}
          </div>
        </div>

        {/* Validation des données */}
        <div>
          <h4 className="text-md font-medium text-[#ff9933] mb-2">Validation des données</h4>
          <div className="text-sm text-[#cccccc] space-y-1">
            <div>Joueurs valides: {currentGame.players?.filter(p => p && p.id && p.name).length || 0}</div>
            <div>Joueurs avec ID: {currentGame.players?.filter(p => p && p.id).length || 0}</div>
            <div>Joueurs avec nom: {currentGame.players?.filter(p => p && p.name).length || 0}</div>
            <div>Joueurs undefined: {currentGame.players?.filter(p => !p).length || 0}</div>
            <div>Joueurs null: {currentGame.players?.filter(p => p === null).length || 0}</div>
          </div>
        </div>
      </div>
    </div>
  );
};

