# Calculateur Equip'Athlé Minimes 🏅

Une Web Application pointue, au design exclusif "Dark Forest", conçue sur-mesure pour calculer et optimiser le total de points d'une équipe d'athlétisme catégorie Minimes. L'outil intègre nativement et de façon automatisée l'ensemble des règles et des grilles de cotations complexes de la FFA (Fédération Française d'Athlétisme) pour l'année 2026.

## 🎯 Fonctionnalités Clés

- **Système de Cotation Automatique** : Saisissez la performance brute, l'application vous l'a convertie instantanément en points FFA officiels.
- **Auto-Détection des Formats de Courses** : Adieu les calculs savants et conversions manuelles. Tapez un temps chronométré de la façon la plus naturelle possible :
    - `3:15.22`
    - `3'15"22`
    - `195.22`
    *(Ces 3 formats seront auto-convertis en l'équivalent secondes pour s'ajuster parfaitement aux seuils d'exigence FFA).*
- **Moteur de Règles FFA Intégré** :
    - **Mixité obligatoire** surveillée (validation si l'équipe compte au moins 2 Filles et 2 Garçons).
    - **Validation du Relais (4x60m Mixte)** et des **Jeunes Juges**.
    - **Contrôle des Triathlons** : Validation algorithmique stricte de la structure "Triathlon" de chaque athlète (soit Généraliste, soit Orienté Courses/Sauts/Lancers).
    - **Limitation d'équipe** : Retient uniquement la *meilleure performance* par discipline pour l'équipe sans avoir à s'en soucier.
- **Fusion Intelligente des Épreuves** : Le 80m Haies (Filles) et le 100m Haies (Garçons) sont logiquement connectés pour se concurrencer sur la même ligne au bénéfice de l'équipe.
- **Export PDF Professionnel** : Impression d'un fichier de résultat A4 propre, brutaliste, listant les performances retenues, le bilan individuel des triathlons et le score final, prêt à être tendu à la table des juges.
- **100% Hors-Ligne & Zéro Données Privées** : Vos données restent dans le navigateur de votre appareil. S'il n'y a plus de 4G sur le stade, l'application fonctionnera toujours (une fois lancée).

## 🚀 Guide de Déploiement "1 Clic" (GitHub Pages)

Puisque cette application ne possède **ni backend lourd, ni base de données distante**, elle est 100% "statique". Ce qui signifie que vous pouvez l'héberger de façon illimitée et gratuitement sur GitHub Pages en 5 minutes.

1. Allez sur [GitHub](https://github.com/) et créez un **Nouveau Repository** (Pensez à bien sélectionner "Public").
2. Prenez TOUS les fichiers de ce projet (`index.html`, le dossier `css`, le dossier `js`, et de préférence `GUIDE_UTILISATEUR.md` ainsi que ce `README.md`) et glissez-les via l'interface web de GitHub pour les uploader.
3. Cliquez sur le bouton vert **"Commit changes"**.
4. Dans GitHub, rendez-vous dans l'onglet **Settings** de votre repository.
5. À gauche, cliquez sur la rubrique **Pages**.
6. Sous "Build and deployment" (Source : Deploy from a branch), choisissez la branche `main` (ou `master`), puis sauvegardez.
7. Patientez 2 minutes et GitHub vous affichera un lien du type `https://votre-club.github.io/calculateur-equipathle`.

Partagez ce lien avec tout l'encadrement de l'équipe. Ils pourront travailler parallèlement et générer autant d'équipes qu'ils le souhaitent, simultanément !

## 📘 Documentation

Pour savoir comment un entraîneur doit se servir de l'outil et comprendre les codes à saisir en compétition (ex: `DQ`, `AB`), veuillez vous référer au fichier **[GUIDE_UTILISATEUR.md](./GUIDE_UTILISATEUR.md)** fourni dans l'archive.
