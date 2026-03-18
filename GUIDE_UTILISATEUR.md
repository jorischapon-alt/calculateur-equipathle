# Guide Utilisateur : Calculateur Equip'Athlé Minimes 📚

Ce document s'adresse à vous, entraîneurs, coordinateurs sportifs ou responsables d'équipe, qui utilisez l'outil lors de vos compositions ou directement le jour de la compétition.

---

## 🏁 Démarrage Rapide

L'interface de l'application est divisée en 3 grandes zones :
1. **En-Haut : Le Tableau de Bord**. C'est ici que l'on lit le **Score Total de l'équipe** instantané. À droite, les **Vérifications de Validité** (Mixité, Jeune Juge, Relais) agiront comme des "feux verts" de conformité à surveiller.
2. **À Gauche : La Grille de Saisie.** Classement des Épreuves par Famille (Sprints, Haies, Demi-Fond...). C'est la table où vous saisirez les performances de votre noyau d'athlètes.
3. **À Droite : Le Radar Athlètes.** À chaque fois qu'un athlète est détecté dans la Grille, il apparaîtra ici sous forme de carte individuelle. On pourra y voir d'un coup d'œil son Triathlon personnel.

---

## ✍️ Comment Saisir les Performances ?

Pour chaque athlète, il suffit de remplir :
- **Son Prénom/Nom** dans les cases `"Nom G"` ou `"Nom F"`. *(Faites attention : L'orthographe doit être identique sur toutes ses lignes).*
- **Sa Performance brute** dans les cases `"Perf"`.

### Formats de Saisie (Conversions Automatiques)

Le système est conçu pour être permissif et pardonner un maximum d'approximations vis-à-vis des formats de saisie :

* **Les sauts, lancers et sprints courts** : Tapez simplement `1m50`, `1.50`, ou `1,50`. S'il s'agit de `14s23`, la machine attendra de voir `14.23` ou `14,23`.
* **Les courses longues (Demi-fond et Marche)** : Ne vous prenez la tête avec des Mathématiques ou des calculatrices d'apothicaires ! Tapez le temps tel que vous l'écrivez sur vos compte-rendus :
  * Si un coureur boucle son 1000m en 3 min 18 et 45 centièmes.
  * Tapez : `3:18.45` ou `3'18"45`. 
  * *La calculette traduira instantanément en 198.45 secondes.*

### Cas Spéciaux (Abandon, Morde, DQ)
Le jour-J, un aléa arrive toujours. La règlementation prévoit d'indemniser d'**1 petit point** symbolique l'athlète ayant participé ou s'étant blessé. Dans la case `"Perf"`, au lieu d'une valeur numérique, inscrivez simplement l'un des sigles officiels suivants, et l'app lui accordera `1 pt` :
- `AB` (Abandon)
- `DQ` (Disqualifié)
- `NM` (No Mark / Essai Mordu)
- `DNF` (Did Not Finish)

---

## 🚦 Contrôler et Valider son Équipe

L'application n'est pas "passive". Si une erreur réglementaire empêche votre équipe d'être alignée, les panneaux s'éclaireront en rouge sur le côté droit.

#### Règle 1 : La Mixité (2 Filles / 2 Garçons Minimum)
Aucune manipulation ; dès que des athlètes féminines ("F") ou masculins ("G") sont insérés dans la grille de saisie, les curseurs de ce badge avanceront (par exemple "1F / 2G"). Ce drapeau ne passera au *vert "Validé"* que lorsque 4 sexes seront validés en suivant les quotas.

#### Règle 2 : Le Relais Mixte et Jeune Juge
Le 4x60m Mixte *doit* être renseigné pour cocher la pleine conformité. Vous trouverez cette saisie directement en haut, sans avoir besoin de scroller tout le tableau. Même chose pour le niveau de formation du *Jeune Juge* qui donnera immédiatement le boost de point adéquat.

#### Règle 3 : Les Triathlons
L'application analyse la liste des 3 épreuves de chaque athlète et vérifie si le triptyque rentre dans la famille des "triathlons officiels" :
* **Cas Général** : 1 Course + 1 Saut + 1 Lancer.
* **Orientation Course** : 2 Courses différentes + 1 Concours.
* **Orientation Saut** : 2 Sauts + 1 Course.
* **Orientation Lancer** : 2 Lancers + 1 Course.

Si un athlète dépasse la limite de 3 épreuves, ou fait *deux courses de la même sous-famille* (ex: 2 sprints), le panneau de cet athlète restera rouge avec la raison explicite écrite, pour que vous puissiez corriger avant la journée d'appel.

---

## 🖨️ Le Jour de la Compétition : Mode Impression
Une fois votre équipe parfaite sur votre écran (Radar au vert, Mixité OK), **cliquez sur "Exporter PDF"**.
L'écran calculera pendant 2 secondes, puis le fichier `Rapport_EquipAthle.pdf` se téléchargera sur votre téléphone / iPad / PC. 

Vous y trouverez un bilan épuré, très lisible, résumant votre score et toutes les preuves de vérifications. Imprimez-le ou envoyez-le directement par mail au secrétariat du secrétariat informatique (le "SI") !
