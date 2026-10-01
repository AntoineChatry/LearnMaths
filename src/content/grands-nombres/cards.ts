import type { ConceptCard } from "../types";

export const grandsNombresCards: ConceptCard[] = [
  {
    id: "gn-tchebychev",
    section: 1,
    front: "Inégalité de Tchebychev, et sa version en écarts types ?",
    back: "$P(|X - \\mu| \\ge \\varepsilon) \\le V(X)/\\varepsilon^2$ ; avec $\\varepsilon = k\\sigma$ : au plus $1/k^2$, pour toute loi. Borne universelle mais grossière.",
  },
  {
    id: "gn-lgn",
    section: 2,
    front: "Loi des grands nombres : énoncé et preuve en une ligne ?",
    back: "Pour des tirages indépendants de même loi, de variance finie : $P(|A_n - \\mu| \\ge \\varepsilon) \\to 0$. Preuve : $V(A_n) = \\sigma^2/n$ et Tchebychev donne une borne $\\sigma^2/(n\\varepsilon^2)$. La variance finie ne sert qu'à cette preuve : le théorème reste vrai dès que $E(|X|) < \\infty$ (Khintchine).",
  },
  {
    id: "gn-monte-carlo",
    section: 2,
    front: "Erreur typique d'une estimation de Monte-Carlo à $n$ tirages ?",
    back: "$\\sigma/\\sqrt n$ : diviser l'erreur par 10 coûte 100 fois plus de tirages. Cette vitesse suppose une variance finie ; sans elle la moyenne converge encore si $E(|X|) < \\infty$, mais plus lentement. Sans espérance (Cauchy), elle ne converge pas.",
  },
  {
    id: "gn-tcl",
    section: 3,
    front: "Théorème central limite ?",
    back: "Pour une somme de $n$ variables indépendantes de même loi (variance finie), $(S_n - n\\mu)/(\\sigma\\sqrt n)$ tend en loi vers $\\mathcal N(0, 1)$ : $S_n \\approx \\mathcal N(n\\mu, n\\sigma^2)$, $A_n \\approx \\mathcal N(\\mu, \\sigma^2/n)$.",
  },
  {
    id: "gn-intervalle",
    section: 4,
    front: "Intervalle de confiance à 95 % d'une précision mesurée $\\hat p$ sur $n$ exemples ?",
    back: "$\\hat p \\pm 2\\sqrt{\\hat p(1-\\hat p)/n}$ ; comme $p(1-p) \\le 1/4$, une marge $\\pm 1/\\sqrt n$ est toujours garantie (±3 points dès $n \\ge 1112$).",
  },
  {
    id: "gn-bruit-gradient",
    section: 4,
    front: "Échelle de bruit du gradient $B_{\\text{simple}}$, et que dit-elle de la taille de minibatch ?",
    back: "$B_{\\text{simple}} = \\text{tr}(\\Sigma)/\\|G\\|^2$, et l'erreur relative d'un minibatch vaut $B_{\\text{simple}}/B$. Bien en dessous de l'échelle de bruit, doubler $B$ double presque le progrès par pas ; bien au-dessus, presque rien (McCandlish et al. 2018).",
  },
];
