# 🏅 Calculateur Equip'Athlé Minimes (Edition 2026)

> **L'outil indispensable pour les entraîneurs d'athlétisme souhaitant optimiser leurs compositions d'équipe en temps réel.**

Ce calculateur est une **Web Application statique** conçue pour simplifier la gestion des compétitions d'Equip'Athlé (catégorie Minimes). Il automatise les calculs de points, vérifie les règles de triathlon et de mixité, et génère un rapport PDF professionnel pour la table de marque.

## ✨ Points Forts

*   **⚡️ Performance & Rapidité** : Calcul instantané sans rechargement de page.
*   **🎯 Intelligence Embarquée** : Prise en charge des formats de chronométrage complexes (`3:15.22`, `3'15"22`).
*   **⚖️ Conformité FFA** : Surveillance automatique de la mixité (2F/2G), du relais mixte et des structures de triathlons.
*   **🌑 Design** : Une interface unique en "Dark Forest", optimisée pour la lecture sur tablettes et pc.  
*   **🔒 Confidentialité Totale** : Aucune donnée n'est envoyée sur un serveur. Tout est traité localement sur votre appareil.

## 🛠️ Installation Rapide (GitHub Pages)

L'application est prête à l'emploi et ne nécessite aucun serveur. Pour la mettre en ligne gratuitement :

1. Créez un nouveau dépôt sur GitHub.
2. Déposez-y les dossiers `css/`, `js/` et les fichiers `index.html`, `LICENSE`.
3. Activez **GitHub Pages** dans les réglages du dépôt.

## 📖 Utilisation

Toutes les instructions pour les entraîneurs sont disponibles dans le **[Guide Utilisateur](./GUIDE_UTILISATEUR.md)**.

## ⚖️ Licence

## 🛠️ Coulisses Techniques & Développement

Cette application a été conçue avec une approche **"Brutaliste & Minimaliste"**, privilégiant la rapidité et l'indépendance technologique :

-   **Langages** : HTML5 sémantique, CSS3 (Vanilla) et JavaScript (ES6+). Aucun framework lourd (React/Vue) n'a été utilisé pour garantir un chargement instantané.
-   **Design System** : Inspiré par **Nothing OS**, utilisant des polices à matrice de points (`DotGothic16`) et un contraste profond (Dark Forest) pour une lisibilité maximale sur le terrain.
-   **Moteur de Données** : Cotations FFA stockées localement dans `js/db.js` pour éliminer toute latence ou erreur de connexion (CORS) lors de l'usage hors-ligne.
-   **Export** : Intégration de la librairie `html2pdf.js` pour transformer dynamiquement le DOM en document PDF formaté A4.

### 🤖 Processus de Développement
Ce projet a été réalisé via une interface de programmation assistée par l'agent IA **Antigravity** (Google DeepMind). L'architecture logicielle et l'intégration des règles métier (barèmes FFA 2026) ont été itérées en binôme, permettant une transcription rapide de la logique de compétition en code JavaScript modulaire et performant.

---

## ⚖️ Licence

Ce projet est distribué sous **Licence MIT**. Voir le fichier [LICENSE](./LICENSE) pour plus de détails.

---
