import type { ConceptCard } from "../types";

export const loisContinuesCards: ConceptCard[] = [
  {
    id: "lc-densite",
    section: 1,
    front: "Densité d'une variable continue : définition, et que vaut $P(X = x)$ ?",
    back: "$f \\ge 0$, $\\int f = 1$, et $P(a \\le X \\le b) = \\int_a^b f(x)\\,dx$. $P(X = x) = 0$ ; une densité n'est pas une probabilité et peut dépasser 1. $F' = f$.",
  },
  {
    id: "lc-exponentielle",
    section: 1,
    front: "Loi exponentielle de paramètre $\\lambda$ : densité, $P(X > t)$, propriété remarquable ?",
    back: "$f(x) = \\lambda e^{-\\lambda x}$ pour $x \\ge 0$, $P(X > t) = e^{-\\lambda t}$. Sans mémoire : $P(X > r + s \\mid X > r) = P(X > s)$, la seule densité continue à l'être.",
  },
  {
    id: "lc-moments",
    section: 2,
    front: "Espérance et variance de $U[a, b]$ et de l'exponentielle de paramètre $\\lambda$ ?",
    back: "Uniforme : $(a+b)/2$ et $(b-a)^2/12$ (donc $a^2/3$ sur $[-a, a]$). Exponentielle : $1/\\lambda$ et $1/\\lambda^2$.",
  },
  {
    id: "lc-changement",
    section: 3,
    front: "Densité de $Y = \\varphi(X)$ pour $\\varphi$ strictement monotone ?",
    back: "$f_Y(y) = f_X(\\varphi^{-1}(y)) \\cdot |\\frac{d}{dy}\\varphi^{-1}(y)|$. Méthode sûre : calculer $F_Y(y) = P(\\varphi(X) \\le y)$ puis dériver.",
  },
  {
    id: "lc-inversion",
    section: 3,
    front: "Comment tirer selon une loi de fonction de répartition $F$ à partir d'un uniforme ?",
    back: "$X = F^{-1}(U)$, car $P(F^{-1}(U) \\le x) = P(U \\le F(x)) = F(x)$. Exponentielle : $x = -\\ln(1 - u)/\\lambda$.",
  },
  {
    id: "lc-init-variance",
    section: 4,
    front: "Pourquoi la variance des poids initiaux doit-elle être de l'ordre de $1/n$ ?",
    back: "Pour $y = \\sum_{i=1}^n w_i x_i$ (poids centrés indépendants) : $V(y) = n\\,V(w)\\,E(x^2)$. Si $n V(w)$ s'écarte du bon facteur, le signal s'effondre ou explose exponentiellement avec la profondeur.",
  },
  {
    id: "lc-glorot-he",
    section: 4,
    front: "Initialisations de Glorot-Bengio et de He : variance visée ?",
    back: "Glorot : $V(W) = 2/(n_j + n_{j+1})$, avec $U[\\pm\\sqrt6/\\sqrt{n_j + n_{j+1}}]$ (activations presque linéaires). He (ReLU, qui garde la moitié de la variance) : $\\frac12 n V(w) = 1$, gaussienne d'écart type $\\sqrt{2/n}$.",
  },
];
