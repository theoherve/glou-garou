# 🎮 Task List - Implémentation du Flux de Partie Glou-Garou

## 📋 Vue d'ensemble

Ce document contient toutes les tâches nécessaires pour implémenter le flux complet du jeu Glou-Garou, de la création de partie jusqu'au déroulement complet avec toutes les phases.

---

## 🚨 Phase 1 : Tests et Corrections (Priorité HAUTE)

### Tests de base

- [ ] **1.1.1** Tester la création de partie actuelle
  - [ ] Vérifier que la page `/create-game` fonctionne
  - [ ] Vérifier que la redirection vers `/game/[roomCode]` fonctionne
  - [ ] Vérifier que la salle d'attente s'affiche correctement
  - [ ] Corriger l'erreur "Jeu ou joueur non trouvé" si elle persiste

### Connexion Realtime

- [ ] **1.2.1** Vérifier la connexion Realtime
  - [ ] Confirmer que `useSupabaseRealtime` fonctionne sur la page du jeu
  - [ ] Tester la synchronisation des joueurs connectés
  - [ ] Vérifier que les événements de présence fonctionnent

---

## 🚪 Phase 2 : Système de Rejoindre une Partie (Priorité HAUTE)

### Page de rejoindre une partie

- [ ] **2.1.1** Créer la page de rejoindre une partie
  - [ ] Créer `/join-game` page avec formulaire (nom + code de salle)
  - [ ] Implémenter la logique de validation du code de salle
  - [ ] Intégrer l'API `POST /api/games` avec action "join"
  - [ ] Redirection vers la page du jeu après connexion

### Navigation et interface

- [ ] **2.2.1** Mettre à jour la page d'accueil
  - [ ] Ajouter bouton "Rejoindre une partie" à côté de "Créer une partie"
  - [ ] Navigation entre les deux options

### Gestion des erreurs

- [ ] **2.3.1** Gérer les erreurs de connexion
  - [ ] Code de salle invalide
  - [ ] Partie pleine
  - [ ] Partie déjà commencée

---

## 🎮 Phase 3 : Logique de Début Automatique (Priorité HAUTE)

### Système de comptage

- [ ] **3.1.1** Système de comptage des joueurs
  - [ ] Afficher le compteur "X/Y joueurs" dans la salle d'attente
  - [ ] Mettre à jour en temps réel via Realtime
  - [ ] Détecter quand X = Y (tous les joueurs sont là)

### Attribution des rôles

- [ ] **3.2.1** Attribution automatique des rôles
  - [ ] Logique de mélange aléatoire des rôles configurés
  - [ ] Mise à jour de la base de données avec les rôles attribués
  - [ ] Changement de phase de "waiting" à "preparation"

### Notification de début

- [ ] **3.3.1** Notification de début de partie
  - [ ] Broadcast Realtime pour informer tous les joueurs
  - [ ] Transition visuelle de la salle d'attente vers la partie

---

## 🃏 Phase 4 : Révélation des Rôles avec Animation (Priorité HAUTE)

### Composant de carte de rôle

- [ ] **4.1.1** Créer le composant de carte de rôle
  - [ ] Créer `RoleCard.tsx` avec design de carte à jouer
  - [ ] Animation de retournement de carte (CSS + Framer Motion)
  - [ ] Icône du rôle au centre de la carte
  - [ ] Couleurs et styles selon l'équipe (villageois vs loups-garous)

### Interface de révélation

- [ ] **4.2.1** Interface de révélation des rôles
  - [ ] Modal/overlay pour afficher la carte
  - [ ] Bouton "Révéler mon rôle" pour les joueurs non-maître
  - [ ] Animation de retournement au clic
  - [ ] Affichage permanent du rôle après révélation

### Gestion des équipes

- [ ] **4.3.1** Gestion des équipes
  - [ ] Différencier visuellement villageois et loups-garous
  - [ ] Couleurs distinctes (vert pour villageois, rouge pour loups)
  - [ ] Icônes spécifiques à chaque rôle

---

## 👑 Phase 5 : Interface du Maître de Jeu (Priorité MOYENNE)

### Panneau de contrôle

- [ ] **5.1.1** Panneau de contrôle du maître
  - [ ] Vue d'ensemble de tous les joueurs et leurs rôles
  - [ ] Boutons de contrôle des phases (Nuit → Jour → Vote)
  - [ ] Gestion des actions spéciales (pouvoirs des rôles)

### Instructions étape par étape

- [ ] **5.2.1** Instructions étape par étape
  - [ ] Guide contextuel selon la phase actuelle
  - [ ] Étapes à suivre pour le maître
  - [ ] Validation des actions des joueurs

### Gestion des phases

- [ ] **5.3.1** Gestion des phases
  - [ ] Transition automatique entre phases
  - [ ] Timer pour chaque phase
  - [ ] Log des événements de la partie

---

## 🌙 Phase 6 : Déroulement des Phases (Priorité MOYENNE)

### Phase de nuit

- [ ] **6.1.1** Phase de nuit
  - [ ] Interface sombre pour la nuit
  - [ ] Actions des rôles spéciaux (voyante, sorcière, etc.)
  - [ ] Actions des loups-garous (choix de victime)

### Phase de jour

- [ ] **6.2.1** Phase de jour
  - [ ] Révélation des événements de la nuit
  - [ ] Discussion entre joueurs
  - [ ] Interface de vote

### Système de vote

- [ ] **6.3.1** Système de vote
  - [ ] Interface de sélection de cible
  - [ ] Comptage des votes
  - [ ] Élimination du joueur voté

---

## 🔄 Phase 7 : Synchronisation et Realtime (Priorité MOYENNE)

### Mise à jour des états

- [ ] **7.1.1** Mise à jour des états de jeu
  - [ ] Synchronisation des phases entre tous les joueurs
  - [ ] Mise à jour des statuts des joueurs (vivant/mort)
  - [ ] Gestion des actions en temps réel

### Gestion des déconnexions

- [ ] **7.2.1** Gestion des déconnexions
  - [ ] Détection des joueurs déconnectés
  - [ ] Gestion des reconnexions
  - [ ] Sauvegarde de l'état de la partie

---

## 🎨 Phase 8 : Améliorations UX/UI (Priorité BASSE)

### Animations et transitions

- [ ] **8.1.1** Animations et transitions
  - [ ] Transitions fluides entre les phases
  - [ ] Animations pour les actions importantes
  - [ ] Effets visuels pour les événements

### Responsive design

- [ ] **8.2.1** Responsive design
  - [ ] Adaptation mobile/tablette
  - [ ] Interface tactile optimisée

---

## 🧪 Phase 9 : Tests et Debug (Priorité BASSE)

### Tests de bout en bout

- [ ] **9.1.1** Tests de bout en bout
  - [ ] Test complet du flux de création → attente → début → jeu
  - [ ] Test avec plusieurs joueurs
  - [ ] Test des déconnexions/reconnexions

### Gestion des erreurs

- [ ] **9.2.1** Gestion des erreurs
  - [ ] Logs détaillés pour le debug
  - [ ] Gestion gracieuse des erreurs
  - [ ] Messages d'erreur utilisateur

---

## 📊 Progression Globale

- **Phase 1** : 0/3 tâches principales ✅
- **Phase 2** : 0/3 tâches principales ✅
- **Phase 3** : 0/3 tâches principales ✅
- **Phase 4** : 0/3 tâches principales ✅
- **Phase 5** : 0/3 tâches principales ✅
- **Phase 6** : 0/3 tâches principales ✅
- **Phase 7** : 0/2 tâches principales ✅
- **Phase 8** : 0/2 tâches principales ✅
- **Phase 9** : 0/2 tâches principales ✅

**Total : 0/25 tâches principales complétées**

---

## 🚀 Ordre de Priorité Recommandé

1. **Phase 1** : S'assurer que le système de base fonctionne
2. **Phase 2** : Permettre aux autres joueurs de rejoindre
3. **Phase 3** : Logique de début automatique
4. **Phase 4** : Animation de révélation des rôles (demande spécifique)
5. **Phase 5-6** : Interface du maître et déroulement des phases
6. **Phase 7-9** : Améliorations et tests

---

## 📝 Notes de Développement

- Utiliser `pnpm` pour la gestion des dépendances
- Suivre les bonnes pratiques React/Next.js
- Implémenter l'accessibilité sur tous les composants
- Utiliser TailwindCSS pour le styling
- Tester chaque phase avant de passer à la suivante

---

_Dernière mise à jour : [Date]_
_Développeur : Assistant IA_
