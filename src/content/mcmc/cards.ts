import type { ConceptCard } from "../types";

export const mcmcCards: ConceptCard[] = [
  {
    id: "mc-probleme",
    section: 1,
    front: "Pourquoi a-t-on besoin de MCMC pour une loi a posteriori ?",
    back: "$p(\\theta \\mid D) = p(D \\mid \\theta)\\,p(\\theta) / Z$ : le numérateur se calcule, mais $Z = \\int p(D \\mid \\theta)p(\\theta)\\,d\\theta$ est hors de portée en grande dimension. MCMC construit une chaîne dont la loi stationnaire est $p$, sans jamais calculer $Z$.",
  },
  {
    id: "mc-equilibre",
    section: 1,
    front: "Équilibre détaillé : énoncé, et pourquoi il implique la stationnarité ?",
    back: "$\\pi(x)P(x, y) = \\pi(y)P(y, x)$ pour tous $x, y$. En sommant sur $x$ : $\\sum_x \\pi(x)P(x, y) = \\pi(y)\\sum_x P(y, x) = \\pi(y)$. Condition suffisante, pas nécessaire : la marche biaisée sur un cycle est stationnaire pour la loi uniforme sans être réversible.",
  },
  {
    id: "mc-mh",
    section: 2,
    front: "Probabilité d'acceptation de Metropolis-Hastings ? Que se passe-t-il en cas de refus ?",
    back: "$A(x, y) = \\min\\left(1, \\frac{\\tilde p(y)\\,q(x \\mid y)}{\\tilde p(x)\\,q(y \\mid x)}\\right)$, qui se réduit à $\\min(1, \\tilde p(y)/\\tilde p(x))$ pour une proposition symétrique. Seul le rapport compte, donc $Z$ disparaît. En cas de refus, la chaîne reste en $x$, qui compte une fois de plus.",
  },
  {
    id: "mc-graphe-uniforme",
    section: 2,
    front: "Comment tirer un sommet uniforme d'un graphe en marchant dessus ?",
    back: "La marche simple visite les sommets en proportion de leur degré. On accepte le pas $x \\to y$ avec probabilité $\\min(1, \\deg(x)/\\deg(y))$ : c'est le rapport de Hastings pour une cible uniforme et une proposition $q(y \\mid x) = 1/\\deg(x)$.",
  },
  {
    id: "mc-pas",
    section: 3,
    front: "Comment le pas $\\sigma$ d'une proposition gaussienne influence-t-il Metropolis ?",
    back: "Trop petit : presque tout est accepté mais la chaîne avance comme une marche aléatoire, en $\\sqrt T$, et peut rester coincée dans un mode. Trop grand : presque tout est refusé. Règle de MacKay : au moins $(L/\\sigma)^2$ itérations par tirage indépendant. Un fort taux d'acceptation ne prouve rien.",
  },
  {
    id: "mc-estimation",
    section: 4,
    front: "Comment estime-t-on une espérance sous la loi a posteriori avec une chaîne MCMC ?",
    back: "Par la moyenne le long d'une seule trajectoire (loi des grands nombres des chaînes de Markov), après avoir jeté le début (rodage). Pour 7 faces sur 10 avec a priori uniforme, la chaîne retrouve la loi Bêta(8, 4) exacte. En grande dimension, Monte-Carlo hamiltonien utilise le gradient pour éviter la marche aléatoire.",
  },
];
