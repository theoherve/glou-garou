# Guide de Migration vers Supabase Realtime

## ✅ Étapes déjà effectuées

1. ✅ Installation de `@supabase/supabase-js`
2. ✅ Configuration du client Supabase (`src/lib/supabase.ts`)
3. ✅ Création du hook `useSupabaseRealtime`
4. ✅ Mise à jour de `GameSocketHandler`
5. ✅ Création des API Supabase (`src/lib/gameApi.ts`)
6. ✅ Mise à jour du store Zustand
7. ✅ Création du script SQL (`supabase-schema.sql`)
8. ✅ Page de test (`/test-supabase`)

## 🔄 Prochaines étapes

### 1. Exécuter le script SQL dans Supabase

1. Allez sur https://supabase.com/dashboard/project/wyezkprcotvvospsepxw
2. Cliquez sur "SQL Editor"
3. Créez une nouvelle requête
4. Copiez le contenu de `supabase-schema.sql`
5. Exécutez le script

### 2. Tester la configuration

1. Lancez l'application : `pnpm dev`
2. Allez sur http://localhost:3000/test-supabase
3. Vérifiez que :
   - Le statut affiche "Connecté"
   - Les tests de création de jeu fonctionnent
   - Les canaux Realtime fonctionnent

### 3. Remplacer Socket.io dans les composants

Pour chaque composant qui utilise `useSocket`, remplacez par `useSupabaseRealtime` :

```typescript
// Avant
import { useSocket } from "@/hooks/useSocket";
const { socket, joinGame } = useSocket();

// Après
import { useSupabaseRealtime } from "@/hooks/useSupabaseRealtime";
const { isConnected, joinGame } = useSupabaseRealtime();
```

### 4. Mettre à jour les pages de jeu

1. **Page de création de jeu** (`src/app/create-game/page.tsx`)
2. **Page de jeu** (`src/app/game/[roomCode]/page.tsx`)
3. **Page de rejoindre** (`src/app/join-game/page.tsx`)

### 5. Nettoyer l'ancien code

Une fois que tout fonctionne :

```bash
# Supprimer les dépendances Socket.io
pnpm remove socket.io socket.io-client

# Supprimer le dossier server
rm -rf server/

# Supprimer les variables d'environnement Socket.io de .env.local
```

### 6. Déployer sur Vercel

1. Commitez vos changements
2. Poussez sur GitHub
3. Vercel déploiera automatiquement

## 🧪 Tests à effectuer

### Test de base

- [ ] Connexion à Supabase
- [ ] Création d'un jeu
- [ ] Rejoindre un jeu
- [ ] Mise à jour de l'état du jeu

### Test Realtime

- [ ] Messages entre joueurs
- [ ] Votes en temps réel
- [ ] Changements de phase
- [ ] Élimination de joueurs

### Test multi-joueurs

- [ ] Plusieurs onglets/écrans
- [ ] Synchronisation des actions
- [ ] Gestion des déconnexions

## 🚨 Problèmes courants

### Erreur de connexion

- Vérifiez les variables d'environnement
- Assurez-vous que les tables existent

### Realtime ne fonctionne pas

- Vérifiez que Realtime est activé dans Supabase
- Contrôlez les politiques RLS

### Erreurs de type

- Vérifiez que les types correspondent entre Supabase et votre application

## 📞 Support

Si vous rencontrez des problèmes :

1. Vérifiez les logs dans la console du navigateur
2. Consultez les logs Supabase dans le dashboard
3. Testez avec la page `/test-supabase`
