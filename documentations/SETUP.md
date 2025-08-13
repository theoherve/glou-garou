# Configuration du Projet Glou-Garou

## Prérequis

- Node.js 18+
- pnpm
- Compte Supabase (pour la base de données PostgreSQL)
- Compte Vercel (optionnel pour le déploiement)

## Configuration de la Base de Données

### 1. Créer un projet Supabase

1. Allez sur [supabase.com](https://supabase.com)
2. Créez un nouveau projet
3. Notez votre URL de base de données PostgreSQL

### 2. Configuration des Variables d'Environnement

Créez un fichier `.env.local` à la racine du projet avec les variables suivantes :

```env
# Database URL (Supabase PostgreSQL)
POSTGRES_URL_NON_POOLING="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"

# Socket.io Configuration
NEXT_PUBLIC_SOCKET_URL="http://localhost:3001"
SOCKET_PORT="3001"
```

### 3. Synchronisation du Schéma Prisma

```bash
# Installer les dépendances
pnpm install

# Synchroniser le schéma avec la base de données
pnpm prisma db push

# Générer le client Prisma
pnpm prisma generate
```

## Démarrage du Projet

### Développement Local

```bash
# Démarrer le serveur Socket.io
pnpm dev:server

# Dans un autre terminal, démarrer Next.js
pnpm dev

# Ou démarrer les deux en même temps
pnpm dev:all
```

### Production

```bash
# Build du projet
pnpm build
pnpm build:server

# Démarrer en production
pnpm start
pnpm start:server
```

## Architecture

### Frontend (Next.js)

- **Pages** : Interface utilisateur pour créer/rejoindre des parties
- **Components** : Composants React réutilisables
- **Store** : Gestion d'état avec Zustand
- **Hooks** : Hooks personnalisés (Socket.io, etc.)
- **API Routes** : Endpoints pour les opérations CRUD

### Backend (Socket.io)

- **Serveur** : Gestion des connexions temps réel
- **Events** : Communication bidirectionnelle entre clients
- **Rooms** : Isolation des parties par code de salle

### Base de Données (Prisma + PostgreSQL)

- **Games** : Informations des parties
- **Players** : Joueurs et leurs états
- **GameSettings** : Configuration des parties
- **GameActions** : Historique des actions

## Fonctionnalités Implémentées

### ✅ Terminé

- [x] Schéma de base de données Prisma
- [x] Serveur Socket.io pour le temps réel
- [x] Service Prisma pour les opérations CRUD
- [x] API routes Next.js
- [x] Hook personnalisé Socket.io
- [x] Store Zustand avec intégration Prisma
- [x] Scripts de développement et production

### 🔄 En Cours

- [ ] Intégration Socket.io dans les composants
- [ ] Gestion des événements temps réel
- [ ] Tests des API routes

### 📋 À Faire

- [ ] Authentification (NextAuth.js ou similaire)
- [ ] Gestion des sessions utilisateur
- [ ] Déploiement Vercel
- [ ] Tests end-to-end
- [ ] Optimisations de performance

## Déploiement

### Vercel (Frontend)

1. Connectez votre repo GitHub à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Serveur Socket.io

1. Déployez sur un service comme Railway, Render ou Heroku
2. Configurez l'URL du serveur dans les variables d'environnement
3. Mettez à jour `NEXT_PUBLIC_SOCKET_URL` pour la production

## Support

Pour toute question ou problème, consultez :

- [Documentation Prisma](https://www.prisma.io/docs)
- [Documentation PostgreSQL](https://www.postgresql.org/docs)
- [Documentation Socket.io](https://socket.io/docs)
- [Documentation Next.js](https://nextjs.org/docs)
