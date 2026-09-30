// Long-term path toward AI research. All resources were checked online on 2026-09-29.

export type Resource = { label: string; url: string };

export type RoadmapStep = {
  id: string;
  title: string;
  // What you learn there, and why it matters in ML research.
  what: string;
  why: string;
  resources: Resource[];
};

export const roadmap: RoadmapStep[] = [
  {
    id: "analyse",
    title: "Analyse",
    what: "Limites, continuité, dérivées, intégrales, séries, Taylor, gradient.",
    why: "Entraîner un réseau, c'est dériver une perte et descendre le gradient.",
    resources: [],
  },
  {
    id: "algebre-lineaire",
    title: "Algèbre linéaire",
    what: "Espaces vectoriels, matrices comme transformations, déterminant, valeurs propres, SVD, avec des preuves.",
    why: "Un réseau de neurones est une suite de multiplications de matrices ; les embeddings sont des vecteurs.",
    resources: [
      { label: "3Blue1Brown, Essence of linear algebra (l'intuition)", url: "https://www.3blue1brown.com/topics/linear-algebra" },
      { label: "MIT 18.06, Gilbert Strang (le cours complet)", url: "https://ocw.mit.edu/courses/18-06-linear-algebra-spring-2010/" },
    ],
  },
  {
    id: "probas",
    title: "Probabilités et statistiques",
    what: "Variables aléatoires, espérance, lois usuelles, conditionnement, estimation.",
    why: "Les pertes sont des log-vraisemblances, et un modèle de langage prédit une loi de probabilité.",
    resources: [{ label: "Harvard Stat 110, Joe Blitzstein (vidéos et livre gratuits)", url: "https://stat110.hsites.harvard.edu/" }],
  },
  {
    id: "multivariable",
    title: "Calcul multivariable et optimisation",
    what: "Jacobienne, hessienne, convexité, multiplicateurs de Lagrange, optimisation continue.",
    why: "La rétropropagation est une règle de la chaîne matricielle ; l'optimisation décide si l'entraînement converge.",
    resources: [
      { label: "Mathematics for Machine Learning, Deisenroth, Faisal, Ong (PDF gratuit, ch. 5 et 7)", url: "https://mml-book.github.io/" },
      { label: "Convex Optimization, Boyd et Vandenberghe (PDF gratuit)", url: "https://web.stanford.edu/~boyd/cvxbook/" },
    ],
  },
  {
    id: "information",
    title: "Théorie de l'information",
    what: "Entropie, entropie croisée, divergence de Kullback-Leibler.",
    why: "La perte d'entraînement des LLM est une entropie croisée.",
    resources: [{ label: "MacKay, Information Theory, Inference, and Learning Algorithms (PDF gratuit)", url: "https://www.inference.org.uk/mackay/itila/" }],
  },
];

// What happens alongside the math: without it, math alone isn't enough.
export const alongside = {
  title: "En parallèle : coder et chercher",
  items: [
    {
      text: "Finir CS221 : après le chapitre 5, reprends à la vidéo « Apprentissage automatique 9 - Rétropropagation ».",
      afterNode: "derivation",
    },
    {
      text: "Après le chapitre 9 : « Apprentissage automatique 10 - Programmation différentiable ».",
      afterNode: "gradient",
    },
    {
      text: "Neural Networks: Zero to Hero d'Andrej Karpathy, qui demande Python et les dérivées : faisable dès le chapitre 5.",
      afterNode: "derivation",
      url: "https://karpathy.ai/zero-to-hero.html",
    },
  ],
};

// Real job postings read on 2026-09-29: what the big labs actually ask for.
export const jobNotes = {
  intro:
    "Ce que demandent de vraies offres. Les maths sont nécessaires partout ; ce qui change, c'est le diplôme et l'expérience. Research Engineer est la porte d'entrée réaliste sans doctorat.",
  offers: [
    {
      lab: "Anthropic",
      role: "Research Engineer / Scientist, Alignment",
      text: "« Significant software, ML, or research engineering experience » et « some experience contributing to empirical AI research projects ». Diplôme : bachelor ou combinaison équivalente d'études et d'expérience.",
      url: "https://job-boards.greenhouse.io/anthropic/jobs/4631822008",
    },
    {
      lab: "OpenAI",
      role: "Research Engineer",
      text: "« Strong programming skills » et « experience working in large distributed systems ». Aucun doctorat demandé.",
      url: "https://openai.com/careers/research-engineer/",
    },
    {
      lab: "Meta",
      role: "Research Scientist, FAIR Core Learning and Reasoning",
      text: "Doctorat exigé, plus des publications en premier auteur à NeurIPS, ICML ou ICLR et une expérience d'entraînement de modèles de fondation.",
      url: "https://www.metacareers.com/profile/job_details/1043087054976326/",
    },
  ],
};
