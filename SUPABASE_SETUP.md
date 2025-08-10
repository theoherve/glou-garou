# Configuration Supabase Realtime

Ce guide vous explique comment configurer Supabase Realtime pour remplacer Socket.io dans votre application de jeu Loup-Garou.

## 1. Configuration Supabase

### Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de projet et vos clés API

### Variables d'environnement

Ajoutez ces variables à votre fichier `.env.local` :

```env
NEXT_PUBLIC_SUPABASE_URL="https://[YOUR-PROJECT-REF].supabase.co"
NEXT_PUBLIC_SUPABASE_ANON_KEY="[YOUR-ANON-KEY]"
SUPABASE_SERVICE_ROLE_KEY="[YOUR-SERVICE-ROLE-KEY]"
```

### Configuration de la base de données

1. Allez dans l'interface SQL de Supabase
2. Exécutez le script `supabase-schema.sql` pour créer les tables nécessaires
3. Activez Realtime pour les tables :
   - `games`
   - `players`
   - `game_actions`

## 2. Architecture Supabase Realtime

### Composants principaux

- **`src/lib/supabase.ts`** : Configuration du client Supabase
- **`src/hooks/useSupabaseRealtime.ts`** : Hook pour la communication en temps réel
- **`src/hooks/useSupabaseSubscription.ts`** : Hook pour écouter les changements de base de données
- **`src/lib/gameApi.ts`** : API pour les opérations de jeu
- **`src/components/GameSocketHandler.tsx`** : Gestionnaire d'événements de jeu (mis à jour)

### Fonctionnalités

#### Communication en temps réel

- **Broadcast** : Envoi de messages à tous les joueurs d'une partie
- **Presence** : Suivi des joueurs connectés/déconnectés
- **Database Changes** : Écoute des changements de base de données

#### Événements supportés

- `gameStateUpdated` : Mise à jour de l'état du jeu
- `playerAction` : Actions des joueurs
- `nightAction` : Actions de nuit (loup-garou, voyante, etc.)
- `vote` : Votes des joueurs
- `phaseChange` : Changement de phase
- `playerEliminated` : Élimination d'un joueur
- `roleRevealed` : Révélation d'un rôle

## 3. Migration depuis Socket.io

### Étapes de migration

1. **Installer les dépendances** :

   ```bash
   pnpm add @supabase/supabase-js
   ```

2. **Configurer Supabase** (voir section 1)

3. **Remplacer les imports** :

   ```typescript
   // Avant
   import { useSocket } from "@/hooks/useSocket";

   // Après
   import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
   ```

4. **Mettre à jour les composants** :
   - Remplacer `useSocket` par `useSupabaseRealtime`
   - Adapter les gestionnaires d'événements

### Différences principales

| Socket.io                  | Supabase Realtime            |
| -------------------------- | ---------------------------- |
| Serveur WebSocket séparé   | Service hébergé              |
| Événements personnalisés   | Broadcast + Database Changes |
| Gestion manuelle des rooms | Canaux automatiques          |
| Configuration complexe     | Configuration simple         |

## 4. Utilisation

### Rejoindre une partie

```typescript
const { joinGame, isConnected } = useSupabaseRealtime();

useEffect(() => {
  if (isConnected) {
    joinGame(roomCode);
  }
}, [isConnected, roomCode]);
```

### Envoyer une action

```typescript
const { sendPlayerAction } = useSupabaseRealtime();

const handleVote = (targetId: string) => {
  sendPlayerAction(roomCode, {
    type: "vote",
    playerId: currentPlayer.id,
    targetId,
  });
};
```

### Écouter les changements

```typescript
const { data: game, loading } = useGameSubscription(roomCode);
const { data: players } = usePlayersSubscription(gameId);
```

## 5. Avantages de Supabase Realtime

### Pour Vercel

- **Pas de serveur WebSocket** : Fonctionne parfaitement avec Vercel
- **Scalabilité automatique** : Géré par Supabase
- **Fiabilité** : Service hébergé avec haute disponibilité

### Fonctionnalités

- **Presence** : Suivi des joueurs en temps réel
- **Database Changes** : Synchronisation automatique des données
- **Broadcast** : Communication entre joueurs
- **Filtrage** : Événements spécifiques par canal

### Performance

- **Latence faible** : Optimisé pour les applications en temps réel
- **Bandwidth efficace** : Compression automatique
- **Reconnection automatique** : Gestion des déconnexions

## 6. Dépannage

### Problèmes courants

1. **Connexion échoue** :

   - Vérifiez vos variables d'environnement
   - Assurez-vous que Realtime est activé dans Supabase

2. **Événements non reçus** :

   - Vérifiez que vous êtes abonné au bon canal
   - Contrôlez les filtres d'événements

3. **Performance** :
   - Limitez le nombre d'abonnements simultanés
   - Utilisez les filtres pour réduire le trafic

### Logs et debugging

```typescript
// Activer les logs détaillés
const supabase = createClient(url, key, {
  realtime: {
    params: {
      eventsPerSecond: 10,
    },
  },
  db: {
    schema: "public",
  },
});
```

## 7. Nettoyage

Une fois la migration terminée, vous pouvez :

1. Supprimer les dépendances Socket.io :

   ```bash
   pnpm remove socket.io socket.io-client
   ```

2. Supprimer le serveur Socket.io (`server/`)

3. Mettre à jour les scripts dans `package.json`

4. Supprimer les variables d'environnement Socket.io
