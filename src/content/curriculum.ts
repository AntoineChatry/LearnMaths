import { continuiteCards } from "./continuite/cards";
import { continuiteGenerators } from "./continuite/exercises";
import { ContinuiteLesson } from "./continuite/Lesson";
import { derivationCards } from "./derivation/cards";
import { derivationGenerators } from "./derivation/exercises";
import { DerivationLesson } from "./derivation/Lesson";
import { gradientCards } from "./gradient/cards";
import { gradientGenerators } from "./gradient/exercises";
import { GradientLesson } from "./gradient/Lesson";
import { integrationCards } from "./integration/cards";
import { integrationGenerators } from "./integration/exercises";
import { IntegrationLesson } from "./integration/Lesson";
import { seriesCards } from "./series/cards";
import { seriesGenerators } from "./series/exercises";
import { SeriesLesson } from "./series/Lesson";
import { taylorCards } from "./taylor/cards";
import { taylorGenerators } from "./taylor/exercises";
import { TaylorLesson } from "./taylor/Lesson";
import { rappelsCards } from "./rappels/cards";
import { rappelsGenerators } from "./rappels/exercises";
import { RappelsLesson } from "./rappels/Lesson";
import { limitesCards } from "./limites/cards";
import { limitesGenerators } from "./limites/exercises";
import { LimitesLesson } from "./limites/Lesson";
import { secondDegreCards } from "./second-degre/cards";
import { secondDegreGenerators } from "./second-degre/exercises";
import { SecondDegreLesson } from "./second-degre/Lesson";
import { vecteursCards } from "./vecteurs/cards";
import { vecteursGenerators } from "./vecteurs/exercises";
import { VecteursLesson } from "./vecteurs/Lesson";
import { matricesCards } from "./matrices/cards";
import { matricesGenerators } from "./matrices/exercises";
import { MatricesLesson } from "./matrices/Lesson";
import { systemesCards } from "./systemes/cards";
import { systemesGenerators } from "./systemes/exercises";
import { SystemesLesson } from "./systemes/Lesson";
import { espacesCards } from "./espaces/cards";
import { espacesGenerators } from "./espaces/exercises";
import { EspacesLesson } from "./espaces/Lesson";
import { determinantCards } from "./determinant/cards";
import { determinantGenerators } from "./determinant/exercises";
import { DeterminantLesson } from "./determinant/Lesson";
import { orthogonaliteCards } from "./orthogonalite/cards";
import { orthogonaliteGenerators } from "./orthogonalite/exercises";
import { OrthogonaliteLesson } from "./orthogonalite/Lesson";
import { valeursPropresCards } from "./valeurs-propres/cards";
import { valeursPropresGenerators } from "./valeurs-propres/exercises";
import { ValeursPropresLesson } from "./valeurs-propres/Lesson";
import { symetriquesCards } from "./symetriques/cards";
import { symetriquesGenerators } from "./symetriques/exercises";
import { SymetriquesLesson } from "./symetriques/Lesson";
import { svdCards } from "./svd/cards";
import { svdGenerators } from "./svd/exercises";
import { SvdLesson } from "./svd/Lesson";
import { probasBaseCards } from "./probas-base/cards";
import { probasBaseGenerators } from "./probas-base/exercises";
import { ProbasBaseLesson } from "./probas-base/Lesson";
import { conditionnellesCards } from "./conditionnelles/cards";
import { conditionnellesGenerators } from "./conditionnelles/exercises";
import { ConditionnellesLesson } from "./conditionnelles/Lesson";
import { loisDiscretesCards } from "./lois-discretes/cards";
import { loisDiscretesGenerators } from "./lois-discretes/exercises";
import { LoisDiscretesLesson } from "./lois-discretes/Lesson";
import { esperanceCards } from "./esperance/cards";
import { esperanceGenerators } from "./esperance/exercises";
import { EsperanceLesson } from "./esperance/Lesson";
import { loisContinuesCards } from "./lois-continues/cards";
import { loisContinuesGenerators } from "./lois-continues/exercises";
import { LoisContinuesLesson } from "./lois-continues/Lesson";
import { loisJointesCards } from "./lois-jointes/cards";
import { loisJointesGenerators } from "./lois-jointes/exercises";
import { LoisJointesLesson } from "./lois-jointes/Lesson";
import { gaussienneCards } from "./gaussienne/cards";
import { gaussienneGenerators } from "./gaussienne/exercises";
import { GaussienneLesson } from "./gaussienne/Lesson";
import { grandsNombresCards } from "./grands-nombres/cards";
import { grandsNombresGenerators } from "./grands-nombres/exercises";
import { GrandsNombresLesson } from "./grands-nombres/Lesson";
import { vraisemblanceCards } from "./vraisemblance/cards";
import { vraisemblanceGenerators } from "./vraisemblance/exercises";
import { VraisemblanceLesson } from "./vraisemblance/Lesson";
import { jacobienneCards } from "./jacobienne/cards";
import { jacobienneGenerators } from "./jacobienne/exercises";
import { JacobienneLesson } from "./jacobienne/Lesson";
import { chaineCards } from "./chaine/cards";
import { chaineGenerators } from "./chaine/exercises";
import { ChaineLesson } from "./chaine/Lesson";
import { retropropagationCards } from "./retropropagation/cards";
import { retropropagationGenerators } from "./retropropagation/exercises";
import { RetropropagationLesson } from "./retropropagation/Lesson";
import { newtonCards } from "./newton/cards";
import { newtonGenerators } from "./newton/exercises";
import { NewtonLesson } from "./newton/Lesson";
import { optimiseursCards } from "./optimiseurs/cards";
import { optimiseursGenerators } from "./optimiseurs/exercises";
import { OptimiseursLesson } from "./optimiseurs/Lesson";
import { convexiteCards } from "./convexite/cards";
import { convexiteGenerators } from "./convexite/exercises";
import { ConvexiteLesson } from "./convexite/Lesson";
import { lagrangeCards } from "./lagrange/cards";
import { lagrangeGenerators } from "./lagrange/exercises";
import { LagrangeLesson } from "./lagrange/Lesson";
import { dualiteCards } from "./dualite/cards";
import { dualiteGenerators } from "./dualite/exercises";
import { DualiteLesson } from "./dualite/Lesson";
import { entropieCards } from "./entropie/cards";
import { entropieGenerators } from "./entropie/exercises";
import { EntropieLesson } from "./entropie/Lesson";
import { entropieCroiseeCards } from "./entropie-croisee/cards";
import { entropieCroiseeGenerators } from "./entropie-croisee/exercises";
import { EntropieCroiseeLesson } from "./entropie-croisee/Lesson";
import { informationMutuelleCards } from "./information-mutuelle/cards";
import { informationMutuelleGenerators } from "./information-mutuelle/exercises";
import { InformationMutuelleLesson } from "./information-mutuelle/Lesson";
import { klEntrainementCards } from "./kl-entrainement/cards";
import { klEntrainementGenerators } from "./kl-entrainement/exercises";
import { KlEntrainementLesson } from "./kl-entrainement/Lesson";
import { hoeffdingCards } from "./hoeffding/cards";
import { hoeffdingGenerators } from "./hoeffding/exercises";
import { HoeffdingLesson } from "./hoeffding/Lesson";
import { pacCards } from "./pac/cards";
import { pacGenerators } from "./pac/exercises";
import { PacLesson } from "./pac/Lesson";
import { vcDimensionCards } from "./vc-dimension/cards";
import { vcDimensionGenerators } from "./vc-dimension/exercises";
import { VcDimensionLesson } from "./vc-dimension/Lesson";
import { grandeDimensionCards } from "./grande-dimension/cards";
import { grandeDimensionGenerators } from "./grande-dimension/exercises";
import { GrandeDimensionLesson } from "./grande-dimension/Lesson";
import { chainesMarkovCards } from "./chaines-markov/cards";
import { chainesMarkovGenerators } from "./chaines-markov/exercises";
import { ChainesMarkovLesson } from "./chaines-markov/Lesson";
import { loiStationnaireCards } from "./loi-stationnaire/cards";
import { loiStationnaireGenerators } from "./loi-stationnaire/exercises";
import { LoiStationnaireLesson } from "./loi-stationnaire/Lesson";
import { mcmcCards } from "./mcmc/cards";
import { mcmcGenerators } from "./mcmc/exercises";
import { McmcLesson } from "./mcmc/Lesson";
import { marchesAleatoiresCards } from "./marches-aleatoires/cards";
import { marchesAleatoiresGenerators } from "./marches-aleatoires/exercises";
import { MarchesAleatoiresLesson } from "./marches-aleatoires/Lesson";
import { diffusionCards } from "./diffusion/cards";
import { diffusionGenerators } from "./diffusion/exercises";
import { DiffusionLesson } from "./diffusion/Lesson";
import type { SkillNode } from "./types";

export type Module = { id: string; title: string; nodes: SkillNode[] };

export const analyse: SkillNode[] = [
  {
    id: "rappels",
    title: "Rappels express et positionnement",
    bridge: "Bagage STI2D : dérivées, primitives, exp et ln",
    lesson: RappelsLesson,
    generators: rappelsGenerators,
    cards: rappelsCards,
  },
  {
    id: "second-degre",
    title: "Second degré et discriminant",
    bridge: "La perte quadratique de la régression linéaire de CS221 est une parabole",
    lesson: SecondDegreLesson,
    generators: secondDegreGenerators,
    cards: secondDegreCards,
  },
  {
    id: "limites",
    title: "Limites",
    bridge: "La sigmoïde des réseaux de neurones de CS221, vue en +∞ et en −∞",
    lesson: LimitesLesson,
    generators: limitesGenerators,
    cards: limitesCards,
  },
  {
    id: "continuite",
    title: "Continuité et valeurs intermédiaires",
    bridge: "Pourquoi la recherche dichotomique trouve toujours une racine",
    lesson: ContinuiteLesson,
    generators: continuiteGenerators,
    cards: continuiteCards,
  },
  {
    id: "derivation",
    title: "Dérivation approfondie et trigo réciproque",
    bridge: "La descente de gradient de CS221, et arctan cousine de la sigmoïde",
    lesson: DerivationLesson,
    generators: derivationGenerators,
    cards: derivationCards,
  },
  {
    id: "integration",
    title: "Intégration",
    bridge: "Une boucle for qui somme des rectangles de plus en plus fins",
    lesson: IntegrationLesson,
    generators: integrationGenerators,
    cards: integrationCards,
  },
  {
    id: "series",
    title: "Suites et séries",
    bridge: "Une boucle infinie qui renvoie pourtant un nombre fini",
    lesson: SeriesLesson,
    generators: seriesGenerators,
    cards: seriesCards,
  },
  {
    id: "taylor",
    title: "Développements de Taylor",
    bridge: "Comment une machine calcule sin et exp",
    lesson: TaylorLesson,
    generators: taylorGenerators,
    cards: taylorCards,
  },
  {
    id: "gradient",
    title: "Dérivées partielles et gradient",
    bridge: "Re-dériver à la main la régression linéaire et la SGD de CS221",
    lesson: GradientLesson,
    generators: gradientGenerators,
    cards: gradientCards,
  },
];

export const algebreLineaire: SkillNode[] = [
  {
    id: "vecteurs",
    title: "Vecteurs et produit scalaire",
    bridge: "Un embedding est un vecteur, et deux mots proches ont un grand cosinus",
    lesson: VecteursLesson,
    generators: vecteursGenerators,
    cards: vecteursCards,
  },
  {
    id: "matrices",
    title: "Matrices et applications linéaires",
    bridge: "Une couche de réseau de neurones calcule Wx + b",
    lesson: MatricesLesson,
    generators: matricesGenerators,
    cards: matricesCards,
  },
  {
    id: "systemes",
    title: "Systèmes linéaires et élimination de Gauss",
    bridge: "Résoudre en grand les équations normales du chapitre Gradient",
    lesson: SystemesLesson,
    generators: systemesGenerators,
    cards: systemesCards,
  },
  {
    id: "espaces",
    title: "Indépendance, base, dimension et rang",
    bridge: "Combien d'informations différentes contient vraiment une matrice",
    lesson: EspacesLesson,
    generators: espacesGenerators,
    cards: espacesCards,
  },
  {
    id: "determinant",
    title: "Déterminant et inverse",
    bridge: "De combien une couche étire l'espace, et si on peut revenir en arrière",
    lesson: DeterminantLesson,
    generators: determinantGenerators,
    cards: determinantCards,
  },
  {
    id: "orthogonalite",
    title: "Orthogonalité, projections et moindres carrés",
    bridge: "La régression linéaire comme une ombre portée",
    lesson: OrthogonaliteLesson,
    generators: orthogonaliteGenerators,
    cards: orthogonaliteCards,
  },
  {
    id: "valeurs-propres",
    title: "Valeurs propres et vecteurs propres",
    bridge: "Les directions qu'une matrice ne fait qu'étirer, et le zigzag de la descente de gradient",
    lesson: ValeursPropresLesson,
    generators: valeursPropresGenerators,
    cards: valeursPropresCards,
  },
  {
    id: "symetriques",
    title: "Matrices symétriques et formes quadratiques",
    bridge: "La hessienne décide de la forme du bol",
    lesson: SymetriquesLesson,
    generators: symetriquesGenerators,
    cards: symetriquesCards,
  },
  {
    id: "svd",
    title: "SVD, PCA et rang faible",
    bridge: "L'idée derrière LoRA : une grosse matrice presque de rang faible",
    lesson: SvdLesson,
    generators: svdGenerators,
    cards: svdCards,
  },
];

export const probas: SkillNode[] = [
  {
    id: "probas-base",
    title: "Probabilités et dénombrement",
    bridge: "Le paradoxe des anniversaires, ou pourquoi les collisions de hachage arrivent si tôt",
    lesson: ProbasBaseLesson,
    generators: probasBaseGenerators,
    cards: probasBaseCards,
  },
  {
    id: "conditionnelles",
    title: "Probabilités conditionnelles et formule de Bayes",
    bridge: "Un filtre anti-spam bayésien, et le piège du test fiable à 99 %",
    lesson: ConditionnellesLesson,
    generators: conditionnellesGenerators,
    cards: conditionnellesCards,
  },
  {
    id: "lois-discretes",
    title: "Variables aléatoires discrètes et lois usuelles",
    bridge: "Le prochain token tiré par un modèle de langage est une variable aléatoire",
    lesson: LoisDiscretesLesson,
    generators: loisDiscretesGenerators,
    cards: loisDiscretesCards,
  },
  {
    id: "esperance",
    title: "Espérance et variance",
    bridge: "La perte d'entraînement est une moyenne, et un minibatch l'estime",
    lesson: EsperanceLesson,
    generators: esperanceGenerators,
    cards: esperanceCards,
  },
  {
    id: "lois-continues",
    title: "Variables continues et changement de variable",
    bridge: "Des poids initialisés au hasard, selon une loi normale",
    lesson: LoisContinuesLesson,
    generators: loisContinuesGenerators,
    cards: loisContinuesCards,
  },
  {
    id: "lois-jointes",
    title: "Lois jointes, covariance et espérance conditionnelle",
    bridge: "Deux features corrélées, et la matrice de covariance de la PCA",
    lesson: LoisJointesLesson,
    generators: loisJointesGenerators,
    cards: loisJointesCards,
  },
  {
    id: "gaussienne",
    title: "La gaussienne multivariée",
    bridge: "Le bruit d'un modèle de diffusion et l'espace latent d'un VAE",
    lesson: GaussienneLesson,
    generators: gaussienneGenerators,
    cards: gaussienneCards,
  },
  {
    id: "grands-nombres",
    title: "Loi des grands nombres et théorème central limite",
    bridge: "Pourquoi un plus gros minibatch donne un gradient moins bruité",
    lesson: GrandsNombresLesson,
    generators: grandsNombresGenerators,
    cards: grandsNombresCards,
  },
  {
    id: "vraisemblance",
    title: "Maximum de vraisemblance et estimation bayésienne",
    bridge: "L'entropie croisée et le weight decay sortent d'un même principe",
    lesson: VraisemblanceLesson,
    generators: vraisemblanceGenerators,
    cards: vraisemblanceCards,
  },
];

export const multivariable: SkillNode[] = [
  {
    id: "jacobienne",
    title: "Fonctions vectorielles et jacobienne",
    bridge: "Une couche de réseau rend un vecteur : sa dérivée est une matrice",
    lesson: JacobienneLesson,
    generators: jacobienneGenerators,
    cards: jacobienneCards,
  },
  {
    id: "chaine",
    title: "Règle de la chaîne et gradients matriciels",
    bridge: "Dériver une perte par rapport à une matrice de poids",
    lesson: ChaineLesson,
    generators: chaineGenerators,
    cards: chaineCards,
  },
  {
    id: "retropropagation",
    title: "Rétropropagation et différentiation automatique",
    bridge: "Ce que fait loss.backward() dans PyTorch",
    lesson: RetropropagationLesson,
    generators: retropropagationGenerators,
    cards: retropropagationCards,
  },
  {
    id: "newton",
    title: "Taylor d'ordre 2 et méthode de Newton",
    bridge: "Utiliser la courbure pour choisir le pas",
    lesson: NewtonLesson,
    generators: newtonGenerators,
    cards: newtonCards,
  },
  {
    id: "optimiseurs",
    title: "Momentum, SGD et Adam",
    bridge: "L'optimiseur qu'on passe à l'entraînement d'un réseau",
    lesson: OptimiseursLesson,
    generators: optimiseursGenerators,
    cards: optimiseursCards,
  },
  {
    id: "convexite",
    title: "Convexité",
    bridge: "Quand un minimum local est forcément le minimum global",
    lesson: ConvexiteLesson,
    generators: convexiteGenerators,
    cards: convexiteCards,
  },
  {
    id: "lagrange",
    title: "Multiplicateurs de Lagrange",
    bridge: "Optimiser sous contrainte : la PCA et le softmax en sortent",
    lesson: LagrangeLesson,
    generators: lagrangeGenerators,
    cards: lagrangeCards,
  },
  {
    id: "dualite",
    title: "Conditions KKT et dualité",
    bridge: "Les contraintes d'inégalité, et la machine à vecteurs de support",
    lesson: DualiteLesson,
    generators: dualiteGenerators,
    cards: dualiteCards,
  },
];

export const information: SkillNode[] = [
  {
    id: "entropie",
    title: "Entropie : mesurer l'information",
    bridge: "Combien de bits faut-il, au minimum, pour compresser un texte",
    lesson: EntropieLesson,
    generators: entropieGenerators,
    cards: entropieCards,
  },
  {
    id: "entropie-croisee",
    title: "Entropie croisée et divergence de Kullback-Leibler",
    bridge: "La perte de tout classifieur et de tout modèle de langage",
    lesson: EntropieCroiseeLesson,
    generators: entropieCroiseeGenerators,
    cards: entropieCroiseeCards,
  },
  {
    id: "information-mutuelle",
    title: "Entropie conditionnelle et information mutuelle",
    bridge: "Le gain d'information qui choisit les questions d'un arbre de décision",
    lesson: InformationMutuelleLesson,
    generators: informationMutuelleGenerators,
    cards: informationMutuelleCards,
  },
  {
    id: "kl-entrainement",
    title: "La divergence KL dans l'entraînement",
    bridge: "VAE, distillation, et le terme qui retient un modèle affiné par RLHF",
    lesson: KlEntrainementLesson,
    generators: klEntrainementGenerators,
    cards: klEntrainementCards,
  },
];

export const concentration: SkillNode[] = [
  {
    id: "hoeffding",
    title: "Concentration : de Markov à Hoeffding",
    bridge: "Combien d'exemples de test faut-il pour croire une précision mesurée",
    lesson: HoeffdingLesson,
    generators: hoeffdingGenerators,
    cards: hoeffdingCards,
  },
  {
    id: "pac",
    title: "Apprendre avec garantie : le cadre PAC",
    bridge: "Pourquoi un modèle choisi parmi beaucoup d'autres peut sur-apprendre, et de combien",
    lesson: PacLesson,
    generators: pacGenerators,
    cards: pacCards,
  },
  {
    id: "vc-dimension",
    title: "Classes infinies : la dimension VC",
    bridge: "Mesurer la capacité d'un classifieur linéaire, qui a une infinité de réglages",
    lesson: VcDimensionLesson,
    generators: vcDimensionGenerators,
    cards: vcDimensionCards,
  },
  {
    id: "grande-dimension",
    title: "Probabilités en grande dimension",
    bridge: "Pourquoi deux embeddings au hasard sont presque orthogonaux, et le 1/√d de l'attention",
    lesson: GrandeDimensionLesson,
    generators: grandeDimensionGenerators,
    cards: grandeDimensionCards,
  },
];

export const markov: SkillNode[] = [
  {
    id: "chaines-markov",
    title: "Chaînes de Markov",
    bridge: "Un modèle bigramme génère du texte en marchant sur une chaîne de Markov",
    lesson: ChainesMarkovLesson,
    generators: chainesMarkovGenerators,
    cards: chainesMarkovCards,
  },
  {
    id: "loi-stationnaire",
    title: "Loi stationnaire et convergence",
    bridge: "PageRank classe les pages web par la loi d'équilibre d'une marche aléatoire",
    lesson: LoiStationnaireLesson,
    generators: loiStationnaireGenerators,
    cards: loiStationnaireCards,
  },
  {
    id: "mcmc",
    title: "Échantillonner par MCMC : Metropolis-Hastings",
    bridge: "Tirer selon une loi connue à une constante près, comme une loi a posteriori",
    lesson: McmcLesson,
    generators: mcmcGenerators,
    cards: mcmcCards,
  },
  {
    id: "marches-aleatoires",
    title: "Marches aléatoires et mouvement brownien",
    bridge: "Ajouter du bruit pas à pas, jusqu'à la limite continue",
    lesson: MarchesAleatoiresLesson,
    generators: marchesAleatoiresGenerators,
    cards: marchesAleatoiresCards,
  },
  {
    id: "diffusion",
    title: "Les modèles de diffusion",
    bridge: "Comment un générateur d'images part du bruit pur pour arriver à une image",
    lesson: DiffusionLesson,
    generators: diffusionGenerators,
    cards: diffusionCards,
  },
];

export const modules: Module[] = [
  { id: "analyse", title: "Analyse", nodes: analyse },
  { id: "algebre-lineaire", title: "Algèbre linéaire", nodes: algebreLineaire },
  { id: "probas", title: "Probabilités et statistiques", nodes: probas },
  { id: "multivariable", title: "Calcul multivariable et optimisation", nodes: multivariable },
  { id: "information", title: "Théorie de l'information", nodes: information },
  { id: "concentration", title: "Concentration et généralisation", nodes: concentration },
  { id: "markov", title: "Chaînes de Markov et diffusion", nodes: markov },
];

export const allNodes: SkillNode[] = modules.flatMap((m) => m.nodes);

// Finds a chapter by id, with its module and its number inside the module (1-based).
export function locateNode(id?: string): { node: SkillNode; module: Module; number: number } | null {
  for (const module of modules) {
    const i = module.nodes.findIndex((n) => n.id === id);
    if (i !== -1) return { node: module.nodes[i], module, number: i + 1 };
  }
  return null;
}
