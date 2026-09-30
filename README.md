# LearnMaths

Application web personnelle pour apprendre les mathématiques du machine learning, en vue d'un poste de chercheur ou d'ingénieur de recherche en IA. Chaque chapitre part d'un concept déjà rencontré (CS221, STI2D…) et le relie à son usage en ML.

Stack : Vite + React 19 + TypeScript. Tout tourne dans le navigateur, sans serveur ni compte.

## Fonctionnalités

- **Leçons** rédigées en français, découpées en sections : après une section, des questions de rappel (cartes) peuvent être exigées avant d'afficher la suite.
- **Rendu des maths** avec KaTeX, **saisie des réponses** avec MathLive.
- **Vérification des réponses** avec CortexJS Compute Engine (`src/lib/checkAnswer.ts`) : comparaison symbolique, puis par échantillonnage numérique si l'expression contient une variable libre.
- **Exercices générés au hasard** : cinq questions par série, quatre bonnes réponses valident le chapitre.
- **Visualisations interactives** avec Mafs (une ou plusieurs par chapitre).
- **Répétition espacée** avec ts-fsrs : exercices et cartes reviennent dans la page Révisions (`#/revisions`) et en échauffement (jusqu'à trois éléments dus) à l'ouverture d'un chapitre.
- **Atelier** (`#/atelier`), code Python exécuté par Pyodide dans un Web Worker (`src/quest/pyWorker.ts`, chargé depuis le CDN jsDelivr, donc connexion requise) :
  - la **Quête** (`src/quest`) : un jeu type CodeCombat, où l'on écrit du Python pour agir dans le monde ;
  - le **Projet** (`src/project`) : un robot piloté par un petit réseau de neurones, construit fonction par fonction en cinq étapes.
- **Parcours** vers la recherche en IA sur la page d'accueil (`src/content/roadmap.ts`) : étapes, ressources externes, extraits d'offres d'emploi.
- Thème clair ou sombre.

Routage par hash : `#/` (sommaire), `#/<id-du-chapitre>`, `#/revisions`, `#/atelier`, `#/atelier/<id-du-niveau>`.

La progression est stockée dans le `localStorage` du navigateur (clés `learnmaths.progress.v1`, `learnmaths.srs.v1`, `learnmaths.unlocked.v1`, `learnmaths.theme`, plus la progression de l'atelier). Vider les données du site efface la progression.

## Programme

Chapitres rédigés, déclarés dans `src/content/curriculum.ts` :

**Analyse**
1. Rappels express et positionnement
2. Second degré et discriminant
3. Limites
4. Continuité et valeurs intermédiaires
5. Dérivation approfondie et trigo réciproque
6. Intégration
7. Suites et séries
8. Développements de Taylor
9. Dérivées partielles et gradient

**Algèbre linéaire**
1. Vecteurs et produit scalaire
2. Matrices et applications linéaires
3. Systèmes linéaires et élimination de Gauss
4. Indépendance, base, dimension et rang
5. Déterminant et inverse
6. Orthogonalité, projections et moindres carrés
7. Valeurs propres et vecteurs propres
8. Matrices symétriques et formes quadratiques
9. SVD, PCA et rang faible

**Probabilités et statistiques**
1. Probabilités et dénombrement
2. Probabilités conditionnelles et formule de Bayes
3. Variables aléatoires discrètes et lois usuelles
4. Espérance et variance
5. Variables continues et changement de variable
6. Lois jointes, covariance et espérance conditionnelle
7. La gaussienne multivariée
8. Loi des grands nombres et théorème central limite
9. Maximum de vraisemblance et estimation bayésienne

Les trois modules sont complets. Les étapes suivantes (multivariable et optimisation, théorie de l'information) figurent seulement dans le parcours de la page d'accueil.

## Installation et lancement

Prérequis : Node.js (sur cette machine : `F:\Node\`, à utiliser en chemin complet si `npm` n'est pas dans le PATH).

```powershell
npm install
npm run dev       # serveur de développement Vite
npm run build     # vérification TypeScript (tsc -b) puis build de production dans dist/
npm run preview   # sert le build de production
npm run lint      # oxlint
```

## Structure du projet

```
src/
  main.tsx, App.tsx      point d'entrée et routage par hash
  index.css
  pages/                 Home (sommaire + parcours), Chapter, Review, Atelier
  components/            LessonFlow, Practice, ExerciseView, MathInput, ConceptCardView,
                         ReviewItem, WarmUp, RichText, Tex, ThemeToggle
  lib/                   checkAnswer (Compute Engine), srs (FSRS), progress, random, tex, time
  content/
    curriculum.ts        modules et chapitres
    types.ts             types Exercise, ExerciseGenerator, ConceptCard, SkillNode
    lookup.ts            retrouve l'exercice ou la carte derrière un identifiant de révision
    roadmap.ts           parcours long terme et ressources
    <chapitre>/          Lesson.tsx, exercises.ts, cards.ts, *Viz.tsx
  quest/                 Quête de l'atelier : moteur, éditeur (CodeMirror), worker Pyodide,
                         niveaux (levels/), monde (world/)
  project/               Projet robot : étapes (steps.tsx), scène, code Python (py/)
```

## Ajouter un chapitre

1. Créer `src/content/<id>/` avec :
   - `Lesson.tsx` : le composant de leçon. Les sections sont les enfants de `LessonFlow` ; les cartes qui ont un champ `section` servent de point de contrôle après cette section.
   - `exercises.ts` : un tableau d'`ExerciseGenerator` (`{ id, make }`), où `make()` renvoie un `Exercise` aléatoire (`promptTex`, `answerTex`, `hint`, `solution`, et optionnellement `intro`, `code`). L'`id` sert de clé de répétition espacée : ne jamais le renommer une fois publié.
   - `cards.ts` : un tableau de `ConceptCard` (`{ id, section?, front, back }`, maths entre `$...$`). Les cartes sans `section` sont posées en fin de leçon.
   - une ou plusieurs visualisations `*Viz.tsx` (Mafs), importées par la leçon.
2. Enregistrer le chapitre dans `src/content/curriculum.ts` : importer les trois exports et ajouter un `SkillNode` (`id`, `title`, `bridge`, `lesson`, `generators`, `cards`) dans le tableau du module (`analyse`, `algebreLineaire` ou `probas`). L'`id` devient la route `#/<id>`.

Un chapitre sans `lesson` apparaît au sommaire comme « à rédiger » et n'est pas ouvrable.

## Sources des contenus

Références citées dans les leçons :

- M. P. Deisenroth, A. A. Faisal, C. S. Ong, *Mathematics for Machine Learning* (« MML »), https://mml-book.github.io/
- C. M. Grinstead, J. L. Snell, *Introduction to Probability*
- J. K. Blitzstein, J. Hwang, *Introduction to Probability*
- C. M. Bishop, *Pattern Recognition and Machine Learning* (« PRML »)
- I. Goodfellow, Y. Bengio, A. Courville, *Deep Learning*
- C. D. Manning, P. Raghavan, H. Schütze, *Introduction to Information Retrieval*
- Gilbert Strang (MIT 18.06) et Khan Academy, cités ponctuellement
- Articles, avec section ou équation citée : Glorot et Bengio (2010), He et al. (2015), Hinton, Vinyals et Dean (2015), Kingma et Welling (2014), Radford et al. (GPT-2, 2019), Ho, Jain et Abbeel (DDPM, 2020), McCandlish et al. (2018)

Le parcours (`roadmap.ts`) renvoie en plus vers 3Blue1Brown, Harvard Stat 110, Boyd et Vandenberghe (*Convex Optimization*) et MacKay (*Information Theory, Inference, and Learning Algorithms*).
