import type { ConceptCard } from "../types";

export const grandeDimensionCards: ConceptCard[] = [
  {
    id: "gd-coquille",
    section: 1,
    front: "Norme d'un vecteur aléatoire de $\\mathbb R^d$ à coordonnées indépendantes, centrées, de variance 1 ?",
    back: "$\\mathbb E\\,\\|X\\|^2 = d$, et $\\|X\\| = \\sqrt d \\pm O(1)$ quelle que soit $d$ (coordonnées sous-gaussiennes) : les vecteurs vivent sur une coquille mince de rayon $\\sqrt d$. En dimension 10 000, le plus court de 2 000 vecteurs normaux mesure 95 % du plus long.",
  },
  {
    id: "gd-gauss-sphere",
    section: 1,
    front: "Pourquoi les tirages d'une loi $N(0, I_d)$ ne tombent-ils pas près de l'origine, où la densité est maximale ?",
    back: "Une boule autour de l'origine a un volume minuscule en grande dimension, ce qui compense le pic de densité. En pratique, $N(0, I_d) \\approx \\mathrm{Unif}(\\sqrt d\\, S^{d-1})$.",
  },
  {
    id: "gd-orthogonal",
    section: 2,
    front: "Angle entre deux directions aléatoires indépendantes de $\\mathbb R^d$ ?",
    back: "$\\mathbb E\\,\\langle X, Y \\rangle^2 = 1/d$ pour des vecteurs unitaires, donc $|\\cos\\theta| \\approx 1/\\sqrt d$ : presque orthogonales. En dimension 10 000, 95 % des angles sont entre 88,9° et 91,1°. Densité de l'angle proportionnelle à $\\sin^{d-2}\\theta$.",
  },
  {
    id: "gd-distances",
    section: 2,
    front: "Distances entre vecteurs aléatoires indépendants à coordonnées $N(0, 1)$ en grande dimension ?",
    back: "$(X - Y)/\\sqrt 2$ a des coordonnées $N(0, 1)$ indépendantes, donc $\\|X - Y\\| \\approx \\sqrt{2d}$ pour presque toutes les paires : sur du pur bruit, toutes les distances se ressemblent.",
  },
  {
    id: "gd-attention",
    section: 3,
    front: "Pourquoi l'attention calcule-t-elle $\\mathrm{softmax}(QK^\\top / \\sqrt{d_k})$ ?",
    back: "Composantes indépendantes, centrées, de variance 1 : $\\mathrm{Var}(q \\cdot k) = d_k$ (Vaswani et al., note 4). Sans division, les scores ont un écart-type $\\sqrt{d_k}$, le softmax sature sur une clé et ses gradients deviennent très petits. Diviser par $\\sqrt{d_k}$ ramène la variance à 1.",
  },
  {
    id: "gd-jl",
    section: 4,
    front: "Lemme de Johnson-Lindenstrauss ?",
    back: "$N$ points de $\\mathbb R^d$, projection $\\frac{1}{\\sqrt k} A$ avec $A$ à coefficients $N(0, 1)$ : pour $k = 20 \\ln N / \\varepsilon^2$ (Mohri), toutes les distances au carré sont conservées à $1 \\pm \\varepsilon$ près. $k$ ne dépend pas de $d$. Preuve : concentration d'un $\\chi^2$ à $k$ degrés, puis borne de la réunion sur les paires.",
  },
];
