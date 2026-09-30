import type { ConceptCard } from "../types";

export const symetriquesCards: ConceptCard[] = [
  {
    id: "sym-spectral",
    section: 1,
    front: "Que dit le théorème spectral ?",
    back: "Une matrice symétrique a des valeurs propres réelles et une base orthonormée de vecteurs propres : $A = Q\\Lambda Q^\\top$ avec $Q$ orthogonale et $\\Lambda$ diagonale.",
  },
  {
    id: "sym-orthogonaux",
    section: 1,
    front: "Pourquoi deux vecteurs propres d'une matrice symétrique, de valeurs propres distinctes, sont-ils orthogonaux ?",
    back: "$\\lambda_1 v_1^\\top v_2 = (Av_1)^\\top v_2 = v_1^\\top A v_2 = \\lambda_2 v_1^\\top v_2$ (on utilise $A^\\top = A$), donc $(\\lambda_1 - \\lambda_2) v_1^\\top v_2 = 0$.",
  },
  {
    id: "sym-somme-projections",
    section: 1,
    front: "Comment écrire une matrice symétrique comme une somme de projections ?",
    back: "$A = \\sum_i \\lambda_i q_i q_i^\\top$ : chaque $q_i q_i^\\top$ projette sur la droite du vecteur propre unitaire $q_i$.",
  },
  {
    id: "sym-forme-quadratique",
    section: 2,
    front: "Que devient $x^\\top A x$ dans la base propre de $A$ symétrique ?",
    back: "$\\lambda_1 y_1^2 + \\dots + \\lambda_n y_n^2$ : plus de termes croisés. Les signes des valeurs propres donnent la forme (bol, selle, gouttière), et pour $\\|x\\| = 1$, $\\lambda_{\\min} \\le x^\\top A x \\le \\lambda_{\\max}$.",
  },
  {
    id: "sym-definie-positive",
    section: 3,
    front: "Définie positive : définition, critère spectral, test en $2 \\times 2$ ?",
    back: "$x^\\top A x > 0$ pour tout $x \\neq 0$ ; toutes les valeurs propres sont $> 0$ ; pour $\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}$ : $a > 0$ et $ac - b^2 > 0$.",
  },
  {
    id: "sym-xtx",
    section: 3,
    front: "Pourquoi $X^\\top X$ est-elle toujours semi-définie positive ? Quand est-elle définie positive ?",
    back: "$v^\\top X^\\top X v = \\|Xv\\|^2 \\ge 0$. Elle est définie positive quand les colonnes de $X$ sont indépendantes ($Xv \\neq 0$ pour $v \\neq 0$).",
  },
  {
    id: "sym-cholesky",
    section: 3,
    front: "Qu'est-ce que la décomposition de Cholesky, et à quoi sert-elle ?",
    back: "$A = LL^\\top$ avec $L$ triangulaire inférieure à diagonale positive, pour $A$ définie positive. Elle échoue sinon (test pratique), et $x = \\mu + Lz$ avec $z \\sim \\mathcal{N}(0, I)$ tire une gaussienne de covariance $A$.",
  },
  {
    id: "sym-hessienne",
    section: 4,
    front: "Comment la hessienne classe-t-elle un point critique ?",
    back: "Valeurs propres toutes $> 0$ : minimum local ; toutes $< 0$ : maximum local ; des deux signes : point selle ; une nulle et les autres de même signe : on ne peut pas conclure. Hessienne semi-définie positive partout : $f$ convexe.",
  },
];
