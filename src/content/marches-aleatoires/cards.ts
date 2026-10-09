import type { ConceptCard } from "../types";

export const marchesAleatoiresCards: ConceptCard[] = [
  {
    id: "ma-racine",
    section: 1,
    front: "Jusqu'où va une marche aléatoire simple en $n$ pas ?",
    back: "$\\mathbb E\\,S_n = 0$ et $\\mathrm{Var}(S_n) = n$ : distance typique $\\sqrt n$. C'est pourquoi une exploration par marche aléatoire (Metropolis à petit pas) est lente.",
  },
  {
    id: "ma-polya",
    section: 1,
    front: "Une marche aléatoire simple revient-elle à son point de départ ?",
    back: "Théorème de Pólya : avec probabilité 1 en dimension 1 et 2 (et une infinité de fois), avec probabilité ≈ 0,34 seulement en dimension 3. Critère : la somme des $P(S_{2m} = 0)$ diverge ou non ; en dimension 1, $P(S_{2m} = 0) = \\binom{2m}{m}2^{-2m} \\approx 1/\\sqrt{\\pi m}$.",
  },
  {
    id: "ma-ruine",
    section: 2,
    front: "Marche équilibrée partie de $x$, arrêtée en $a$ ou en $b$ : probabilité de finir en $b$, durée moyenne ?",
    back: "$P_x(b \\text{ avant } a) = \\frac{x - a}{b - a}$ (la position moyenne reste $x$) et $\\mathbb E_x(\\text{durée}) = (b - x)(x - a)$. Avec un biais $p \\ne 1/2$ et $a = 0$ : $\\frac{r^x - 1}{r^b - 1}$, $r = (1 - p)/p$.",
  },
  {
    id: "ma-brownien",
    section: 3,
    front: "Définition du mouvement brownien standard ?",
    back: "$B_0 = 0$ ; accroissements indépendants sur des intervalles disjoints ; $B_t - B_s \\sim N(0, t - s)$ ; trajectoires continues (et nulle part dérivables). La variance est proportionnelle au temps, $\\mathrm{Cov}(B_s, B_t) = \\min(s, t)$.",
  },
  {
    id: "ma-donsker",
    section: 3,
    front: "Comment passe-t-on d'une marche aléatoire au mouvement brownien ?",
    back: "Donsker : $t \\mapsto S_{\\lfloor nt \\rfloor}/\\sqrt n$ converge vers $(B_t)$, quelle que soit la loi des pas (moyenne 0, variance 1). Temps divisé par $n$, espace par $\\sqrt n$ : c'est l'invariance d'échelle, $B(a^2 t)/a$ est encore un brownien.",
  },
  {
    id: "ma-rappel",
    section: 4,
    front: "Que donne la chaîne $x_t = \\sqrt{1 - \\beta}\\, x_{t-1} + \\sqrt\\beta\\, \\varepsilon_t$ ?",
    back: "Elle garde la variance 1 et a pour loi stationnaire $N(0, 1)$. En $t$ pas : $x_t \\mid x_0 \\sim N(\\sqrt{\\bar\\alpha_t}\\, x_0, 1 - \\bar\\alpha_t)$ avec $\\bar\\alpha_t = (1 - \\beta)^t$. C'est le processus vers l'avant d'un modèle de diffusion ; en temps continu, Ornstein-Uhlenbeck, de loi stationnaire $N(0, q/2\\lambda)$.",
  },
];
