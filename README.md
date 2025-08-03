# 🐺 Glou Garou

Un jeu de Loup Garou en ligne moderne, inspiré du célèbre jeu "Les Loups-Garous de Thiercelieux". Jouez avec vos amis en temps réel dans une interface moderne et intuitive.

## ✨ Fonctionnalités

- **Interface moderne** : Design sombre et mystérieux avec animations fluides
- **Jeu en temps réel** : Synchronisation en temps réel entre tous les joueurs
- **Rôles variés** : Tous les rôles classiques du jeu original
- **Maître du jeu** : Interface dédiée pour gérer la partie
- **Responsive** : Compatible mobile, tablette et desktop
- **Animations** : Effets visuels pour une expérience immersive

## 🎮 Rôles disponibles

### Villageois

- **Villageois** : Rôle de base, doit identifier les loups-garous
- **Voyante** : Peut découvrir l'identité d'un joueur chaque nuit
- **Chasseur** : Élimine un joueur quand il meurt
- **Cupidon** : Désigne deux amoureux qui mourront ensemble
- **Sorcière** : Possède deux potions (sauver/éliminer)
- **Petite Fille** : Peut espionner les loups-garous
- **Capitaine** : Son vote compte double
- **Voleur** : Peut échanger son rôle

### Loups-Garous

- **Loup-Garou** : Doit éliminer tous les villageois

## 🚀 Installation

### Prérequis

- Node.js 18+
- pnpm
- PostgreSQL (ou Supabase)

### Installation

1. **Cloner le projet**

```bash
git clone <repository-url>
cd glou-garou
```

2. **Installer les dépendances**

```bash
pnpm install
```

3. **Configuration de l'environnement**

```bash
cp .env.example .env.local
```

4. **Configurer la base de données**

```bash
# Avec Prisma
pnpm prisma generate
pnpm prisma db push

# Ou avec Supabase (recommandé)
# Suivre la documentation Supabase pour la configuration
```

5. **Lancer le serveur de développement**

```bash
pnpm dev
```

Le projet sera accessible sur `http://localhost:3000`

## 🛠️ Technologies utilisées

- **Frontend** : Next.js 15, React 19, TypeScript
- **Styling** : Tailwind CSS 4
- **Animations** : Framer Motion
- **État global** : Zustand
- **Base de données** : Prisma + PostgreSQL/Supabase
- **Icônes** : Lucide React
- **Package manager** : pnpm

## 📁 Structure du projet

```
src/
├── app/                    # Pages Next.js (App Router)
│   ├── page.tsx           # Page d'accueil
│   ├── create-game/       # Création de partie
│   ├── join-game/         # Rejoindre une partie
│   ├── game/[roomCode]/   # Interface de jeu
│   └── rules/             # Règles du jeu
├── components/            # Composants réutilisables
├── store/                 # État global (Zustand)
├── types/                 # Types TypeScript
├── data/                  # Données statiques (rôles, etc.)
└── lib/                   # Utilitaires et configurations
```

## 🎯 Comment jouer

### Créer une partie

1. Cliquez sur "Créer une partie"
2. Entrez votre nom et générez un code de salle
3. Sélectionnez les rôles pour la partie
4. Partagez le code avec vos amis

### Rejoindre une partie

1. Cliquez sur "Rejoindre une partie"
2. Entrez votre nom et le code de salle
3. Attendez que le maître du jeu démarre

### Déroulement d'une partie

1. **Préparation** : Distribution des rôles
2. **Nuit** : Les rôles actifs utilisent leurs pouvoirs
3. **Jour** : Le village se réveille et débat
4. **Vote** : Élimination d'un suspect
5. **Répétition** jusqu'à la victoire d'une équipe

## 🔧 Configuration avancée

### Variables d'environnement

```env
# Base de données
DATABASE_URL="postgresql://..."

# Supabase (optionnel)
NEXT_PUBLIC_SUPABASE_URL="..."
NEXT_PUBLIC_SUPABASE_ANON_KEY="..."
SUPABASE_SERVICE_ROLE_KEY="..."

# Next.js
NEXTAUTH_SECRET="..."
NEXTAUTH_URL="http://localhost:3000"
```

### Base de données

Le projet utilise Prisma avec PostgreSQL. Vous pouvez aussi utiliser Supabase pour une solution hébergée.

```bash
# Générer le client Prisma
pnpm prisma generate

# Pousser le schéma vers la base
pnpm prisma db push

# Ouvrir Prisma Studio
pnpm prisma studio
```

## 🎨 Personnalisation

### Thème

Le thème sombre est configuré dans `tailwind.config.js`. Vous pouvez modifier les couleurs et les animations.

### Rôles

Les rôles sont définis dans `src/data/roles.ts`. Vous pouvez ajouter de nouveaux rôles ou modifier les existants.

### Animations

Les animations utilisent Framer Motion. Vous pouvez les personnaliser dans les composants.

## 🚀 Déploiement

### Vercel (recommandé)

1. Connectez votre repository à Vercel
2. Configurez les variables d'environnement
3. Déployez automatiquement

### Autres plateformes

Le projet peut être déployé sur n'importe quelle plateforme supportant Next.js.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commiter vos changements
4. Pousser vers la branche
5. Ouvrir une Pull Request

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🙏 Remerciements

- Inspiré du jeu "Les Loups-Garous de Thiercelieux" d'Asmodée
- Icônes par [Lucide](https://lucide.dev/)
- Animations par [Framer Motion](https://www.framer.com/motion/)

## 📞 Support

Si vous avez des questions ou des problèmes :

- Ouvrez une issue sur GitHub
- Contactez l'équipe de développement

---

**Jouez bien et méfiez-vous des loups-garous ! 🐺**
