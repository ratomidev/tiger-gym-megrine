# Tiger Gym Megrine - Système de Gestion de Salle de Sport

![Logo Tiger Gym](public/images/logo.png)

## 📷 Captures d'écran

### Page d'accueil
![Page d'accueil](screenshots/landing-page.jpg)

### Tableau de bord administrateur
![Tableau de bord](screenshots/dashboard.jpg)

### Liste des adherents
![liste des adherents](screenshots/dashboard2.jpg)

### Page d'inscription
![Page d'inscription](screenshots/register.jpg)

## 📝 Description

Tiger Gym Megrine est une plateforme complète de gestion de salle de sport développée pour optimiser l'expérience des membres et faciliter l'administration quotidienne. Le système permet la gestion des abonnements, le suivi des membres, et offre une interface attrayante pour présenter les services de la salle.

## ✨ Fonctionnalités principales

- **Site vitrine responsive** présentant les services et tarifs de la salle
- **Système d'inscription** pour les nouveaux membres
- **Gestion des abonnements** avec différentes formules
- **Tableau de bord administrateur** pour la gestion quotidienne
- **Système de validation des accès** pour les membres
- **Tâches automatisées** pour la gestion des abonnements expirés
- **Interface multilingue** (français/anglais)

## 🛠️ Technologies utilisées

- **Frontend**: Next.js 14, React, Tailwind CSS, Shadcn UI
- **Backend**: Next.js API Routes, Prisma ORM
- **Base de données**: PostgreSQL
- **Authentification**: NextAuth.js
- **Déploiement**: Vercel
- **Autres**: TypeScript, Lucide Icons

## 🚀 Installation et démarrage

1. Clonez le dépôt
   ```bash
   git clone https://github.com/votre-username/tiger-gym-megrine.git
   cd tiger-gym-megrine
   ```
2. Installez les dépendances
   ```bash
   npm install
   # ou
   yarn install
   # ou
   pnpm install
   # ou
   bun install
   ```
3. Configurez les variables d'environnement
   ```bash
   cp .env.example .env.local
   ```
   Modifiez le fichier `.env.local` avec vos informations de base de données et autres clés API nécessaires.

4. Lancez le serveur de développement
   ```bash
   npm run dev
   # ou
   yarn dev
   # ou
   pnpm dev
   # ou
   bun dev
   ```

Ouvrez [http://localhost:3000](http://localhost:3000) dans votre navigateur pour voir le résultat.

Vous pouvez commencer à modifier la page en modifiant `app/page.tsx`. La page se met à jour automatiquement lorsque vous modifiez le fichier.

Ce projet utilise [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) pour optimiser et charger automatiquement la police [Geist](https://vercel.com/font), une nouvelle famille de polices pour Vercel.

## Fonctionnalités

### Téléchargement de photos avec le stockage Blob Vercel

- Les photos des membres sont téléchargées sur le stockage Blob Vercel
- Prend en charge à la fois le téléchargement de fichiers et la capture par caméra
- Validation automatique des fichiers (type et taille)
- Les photos sont stockées en toute sécurité avec des URL publiques
- **Nettoyage automatique** : Les photos sont supprimées du stockage Blob lorsque les adhérents sont supprimés
- **Nettoyage des orphelins** : Point de terminaison API disponible pour nettoyer les photos inutilisées (`POST /api/upload/photo/cleanup`)

## En savoir plus

Pour en savoir plus sur Next.js, consultez les ressources suivantes :

- [Documentation Next.js](https://nextjs.org/docs) - découvrez les fonctionnalités et l'API de Next.js.
- [Apprendre Next.js](https://nextjs.org/learn) - un tutoriel interactif sur Next.js.

Vous pouvez consulter [le dépôt GitHub de Next.js](https://github.com/vercel/next.js) - vos retours et contributions sont les bienvenus !

## Déployer sur Vercel

Le moyen le plus simple de déployer votre application Next.js est d'utiliser la [plateforme Vercel](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) des créateurs de Next.js.

Consultez notre [documentation sur le déploiement Next.js](https://nextjs.org/docs/app/building-your-application/deploying) pour plus de détails.
