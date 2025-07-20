# 🎥 TikTok Live Connector - React App

Une application React qui utilise [TikTok-Live-Connector](https://github.com/zerodytrash/TikTok-Live-Connector) pour se connecter aux lives TikTok et afficher les messages, cadeaux et interactions en temps réel.

## ✨ Fonctionnalités

- 🔗 **Connexion en temps réel** aux lives TikTok
- 💬 **Affichage des messages** de chat en direct
- 🎁 **Suivi des cadeaux** envoyés au streamer
- 👥 **Compteur de viewers** en temps réel
- 📱 **Interface responsive** et moderne
- 🎨 **Design inspiré de TikTok** avec animations

## 🚀 Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation

```bash
# Cloner le projet
git clone https://github.com/trandriantiana/behoririka-live.git
cd behoririka-live

# Installer les dépendances
npm install
```

### Démarrage

#### Option 1: Démarrage automatique (recommandé)
```bash
# Démarre automatiquement le serveur WebSocket ET l'application React
npm start
```

#### Option 2: Démarrage manuel
```bash
# Terminal 1: Démarrer le serveur WebSocket
npm run server

# Terminal 2: Démarrer l'application React
npm run dev
```

**Accès à l'application:**
- Application React: `http://localhost:5173/`
- Serveur WebSocket: `ws://localhost:8081/`

## 🎯 Utilisation

1. **Entrez un nom d'utilisateur TikTok** qui est actuellement en live
2. **Cliquez sur "Se connecter"** pour établir la connexion
3. **Observez en temps réel** :
   - Les messages du chat
   - Les cadeaux envoyés
   - Le nombre de viewers
4. **Cliquez sur "Déconnecter"** pour arrêter la connexion

### Exemples de noms d'utilisateurs pour tester
- `officialgeilegisela` (exemple de la documentation)
- Tout utilisateur TikTok actuellement en live

## 🛠️ Technologies Utilisées

- **React 18** - Framework frontend
- **Vite** - Build tool et serveur de développement
- **Node.js** - Serveur backend pour TikTok-Live-Connector
- **WebSocket (ws)** - Communication temps réel client-serveur
- **TikTok-Live-Connector** - Bibliothèque Node.js pour se connecter aux lives TikTok
- **CSS3** - Styling avec animations et responsive design
- **Concurrently** - Démarrage simultané des serveurs

## 📦 Dépendances Principales

```json
{
  "tiktok-live-connector": "^2.x.x",
  "react": "^18.x.x",
  "react-dom": "^18.x.x"
}
```

## 🔧 Structure du Projet

```
├── server.js         # Serveur WebSocket Node.js (proxy TikTok-Live-Connector)
├── package.json      # Configuration npm avec scripts de démarrage
src/
├── App.jsx          # Composant React avec client WebSocket
├── App.css          # Styles de l'application
├── main.jsx         # Point d'entrée React
└── index.css        # Styles globaux
```

## 🎨 Fonctionnalités de l'Interface

### Panneau de Connexion
- Champ de saisie pour le nom d'utilisateur TikTok
- Bouton de connexion/déconnexion
- Indicateur de statut de connexion
- Compteur de viewers

### Affichage en Temps Réel
- **Messages** : Affichage des commentaires avec horodatage et nom d'utilisateur
- **Cadeaux** : Liste des cadeaux reçus avec quantité
- **Animations** : Effets visuels pour les nouveaux éléments
- **Défilement automatique** : Les listes se mettent à jour automatiquement

## 🔗 Événements TikTok Supportés

L'application écoute plusieurs types d'événements :

- `WebcastEvent.CHAT` - Messages de chat
- `WebcastEvent.GIFT` - Cadeaux envoyés
- `WebcastEvent.LIKE` - Likes sur le live
- `WebcastEvent.MEMBER` - Nouveaux membres rejoignant
- `connected` - Connexion établie
- `disconnected` - Connexion fermée
- `error` - Erreurs de connexion

## 🚨 Notes Importantes

- **Utilisateurs en live uniquement** : La connexion ne fonctionne qu'avec des utilisateurs actuellement en direct
- **Limitations de TikTok** : Certains lives peuvent avoir des restrictions d'accès
- **Respect des conditions** : Utilisez cette application dans le respect des conditions d'utilisation de TikTok

## 🛠️ Développement

### Scripts Disponibles

```bash
# Démarrer en mode développement
npm run dev

# Build pour la production
npm run build

# Prévisualiser le build de production
npm run preview

# Linter ESLint
npm run lint
```

### Personnalisation

Vous pouvez facilement personnaliser l'application :

1. **Modifier les styles** dans `src/App.css`
2. **Ajouter de nouveaux événements** dans `src/App.jsx`
3. **Personnaliser l'interface** selon vos besoins

## 📄 Licence

Ce projet est sous licence MIT. Voir le fichier `LICENSE` pour plus de détails.

## 🤝 Contribution

Les contributions sont les bienvenues ! N'hésitez pas à :

1. Fork le projet
2. Créer une branche pour votre fonctionnalité
3. Commit vos changements
4. Push vers la branche
5. Ouvrir une Pull Request

## 📞 Support

Pour toute question ou problème :
- Ouvrir une issue sur GitHub
- Consulter la [documentation TikTok-Live-Connector](https://github.com/zerodytrash/TikTok-Live-Connector)

---

**Développé avec ❤️ en utilisant React + Vite + TikTok-Live-Connector**
