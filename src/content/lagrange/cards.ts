import type { ConceptCard } from "../types";

export const lagrangeCards: ConceptCard[] = [
  {
    id: "lg-gradients",
    section: 1,
    front: "Pourquoi, à l'optimum de $f$ sous $h(x) = c$, a-t-on $\\nabla f = \\lambda \\nabla h$ ?",
    back: "$\\nabla h$ est perpendiculaire à la surface $h = c$. Si $\\nabla f$ avait une composante le long de la surface, glisser dans ce sens augmenterait $f$. Donc $\\nabla f$ est aussi perpendiculaire à la surface, donc parallèle à $\\nabla h$. Hypothèse : $\\nabla h \\neq 0$ à l'optimum (sinon, ex. $\\min x$ sous $y^2 = x^3$, optimum $(0, 0)$ sans aucun $\\lambda$).",
  },
  {
    id: "lg-lagrangien",
    section: 2,
    front: "Comment utilise-t-on le lagrangien, et que donne-t-il exactement ?",
    back: "$L(x, \\lambda) = f(x) + \\lambda(c - h(x))$. On annule $\\nabla_x L$ et $\\partial L / \\partial \\lambda$ : $D + 1$ équations pour $x$ et $\\lambda$. Cela donne des candidats (points stationnaires), qu'il faut comparer entre eux : sur le cercle, $x + 2y$ a deux candidats, le max $\\sqrt 5$ et le min $-\\sqrt 5$.",
  },
  {
    id: "lg-pca",
    section: 3,
    front: "Comment la PCA sort-elle d'un lagrangien ?",
    back: "On maximise la variance projetée $u^\\top S u$ sous $u^\\top u = 1$. Lagrange donne $Su = \\lambda u$ (un vecteur propre) et $u^\\top S u = \\lambda$ : la meilleure direction est le vecteur propre de la plus grande valeur propre (PRML, éq. 12.4 à 12.6).",
  },
  {
    id: "lg-softmax",
    section: 3,
    front: "Quel problème sous contrainte le softmax à température $T$ résout-il ?",
    back: "Maximiser $\\sum_i p_i z_i + T\\,H(p)$ sous $\\sum_i p_i = 1$. Le lagrangien donne $\\log p_i = z_i / T + \\text{cte}$, donc $p_i = e^{z_i/T} / \\sum_j e^{z_j/T}$. Avec $z = 0$ : la distribution d'entropie maximale est uniforme.",
  },
  {
    id: "lg-sensibilite",
    section: 4,
    front: "Que mesure le multiplicateur $\\lambda$ ?",
    back: "La sensibilité de la valeur optimale à la contrainte : $\\frac{dp^\\star}{dc} = \\lambda$ (règle de la chaîne, avec $\\nabla f = \\lambda \\nabla h$). Relâcher $c$ de $\\delta$ fait gagner environ $\\lambda \\delta$ : c'est le « prix fictif » de la ressource.",
  },
];
