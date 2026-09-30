import type { ConceptCard } from "../types";

export const svdCards: ConceptCard[] = [
  {
    id: "svd-geometrie",
    section: 1,
    front: "Que dit la SVD $A = U\\Sigma V^\\top$, géométriquement ?",
    back: "Toute matrice est une transformation orthogonale ($V^\\top$), puis un étirement de chaque axe par les valeurs singulières $\\sigma_i \\ge 0$, puis une autre transformation orthogonale ($U$). Le cercle unité devient une ellipse de demi-axes $\\sigma_i$, et $Av_i = \\sigma_i u_i$.",
  },
  {
    id: "svd-calcul",
    section: 2,
    front: "Comment obtient-on les valeurs singulières de $A$ ?",
    back: "Ce sont les racines carrées des valeurs propres de $A^\\top A$ (symétrique, semi-définie positive). Les $v_i$ sont ses vecteurs propres, et $u_i = Av_i / \\sigma_i$.",
  },
  {
    id: "svd-lecture",
    section: 2,
    front: "Que lit-on dans les valeurs singulières : norme, déterminant, rang ?",
    back: "$\\|A\\|_2 = \\sigma_1$ (le plus grand étirement) ; $|\\det A| = \\prod \\sigma_i$ pour $A$ carrée ; le rang est le nombre de $\\sigma_i$ non nulles (au-dessus d'un seuil, en flottants).",
  },
  {
    id: "svd-conditionnement",
    section: 3,
    front: "Qu'est-ce que le conditionnement, et pourquoi éviter de former $X^\\top X$ ?",
    back: "$\\kappa = \\sigma_{\\max} / \\sigma_{\\min}$ : si $\\kappa = 10^k$, on peut perdre jusqu'à $k$ chiffres. Le déterminant, lui, ne mesure pas la presque singularité. $\\kappa(X^\\top X) = \\kappa(X)^2$ : l'équation normale double le nombre de chiffres perdus.",
  },
  {
    id: "svd-eckart-young",
    section: 4,
    front: "Que dit le théorème d'Eckart-Young ?",
    back: "La SVD tronquée $A_k = \\sum_{i \\le k} \\sigma_i u_i v_i^\\top$ est la meilleure approximation de rang $k$ de $A$ (en norme spectrale), et l'erreur vaut $\\|A - A_k\\|_2 = \\sigma_{k+1}$.",
  },
  {
    id: "svd-lora",
    section: 4,
    front: "Quel lien entre LoRA et la SVD ?",
    back: "LoRA apprend une mise à jour de rang faible $\\Delta W = BA$. Hu et al. analysent les matrices apprises par SVD : seule la première direction singulière est nettement commune entre $r = 8$ et $r = 64$, ce qui explique à leurs yeux que $r = 1$ suffise déjà bien pour GPT-3.",
  },
  {
    id: "svd-pca",
    section: 5,
    front: "Comment la PCA se calcule-t-elle avec la SVD ?",
    back: "On centre $X$ (un point par ligne). Les composantes principales sont les vecteurs singuliers à droite de $X$, c'est-à-dire les vecteurs propres de la covariance $S = X^\\top X / N$, et les variances associées sont $\\sigma_i^2 / N$.",
  },
];
