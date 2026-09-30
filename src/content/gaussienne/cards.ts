import type { ConceptCard } from "../types";

export const gaussienneCards: ConceptCard[] = [
  {
    id: "ga-densite-1d",
    section: 1,
    front: "Densité de $\\mathcal N(\\mu, \\sigma^2)$, et comment se ramener à la normale standard ?",
    back: "$\\frac{1}{\\sqrt{2\\pi\\sigma^2}} e^{-(x-\\mu)^2/2\\sigma^2}$. $Z = (X - \\mu)/\\sigma \\sim \\mathcal N(0, 1)$, et $X = \\mu + \\sigma Z$.",
  },
  {
    id: "ga-68-95",
    section: 1,
    front: "Probabilité qu'une gaussienne tombe à moins de 1, 2, 3 écarts types de sa moyenne ?",
    back: "Environ 0,683, 0,954 et 0,997.",
  },
  {
    id: "ga-somme",
    section: 1,
    front: "Loi de $aX + bY$ pour $X$, $Y$ gaussiennes indépendantes ?",
    back: "Gaussienne $\\mathcal N(a\\mu_X + b\\mu_Y,\\ a^2\\sigma_X^2 + b^2\\sigma_Y^2)$.",
  },
  {
    id: "ga-multivariee",
    section: 2,
    front: "Densité de $\\mathcal N(\\mu, \\Sigma)$ et forme de ses lignes de niveau ?",
    back: "$(2\\pi)^{-D/2}|\\Sigma|^{-1/2} \\exp(-\\frac12 (x-\\mu)^\\top\\Sigma^{-1}(x-\\mu))$. Lignes de niveau : ellipsoïdes centrés en $\\mu$, d'axes les vecteurs propres de $\\Sigma$, de demi-longueurs proportionnelles à $\\sqrt{\\lambda_i}$.",
  },
  {
    id: "ga-independance",
    section: 2,
    front: "Pour un vecteur gaussien, que signifie une covariance diagonale ?",
    back: "Les composantes sont indépendantes : la densité se factorise. C'est propre à la gaussienne ; en général, non corrélé n'implique pas indépendant.",
  },
  {
    id: "ga-lineaire-tirage",
    section: 3,
    front: "Loi de $Ax + b$ si $x \\sim \\mathcal N(\\mu, \\Sigma)$, et comment tirer selon $\\mathcal N(\\mu, \\Sigma)$ ?",
    back: "$\\mathcal N(A\\mu + b, A\\Sigma A^\\top)$. Tirage : $x = \\mu + Lz$, $z \\sim \\mathcal N(0, I)$, $LL^\\top = \\Sigma$ (par exemple Cholesky).",
  },
  {
    id: "ga-conditionnelle",
    section: 3,
    front: "Loi de $x_1$ sachant $x_2$ pour un couple gaussien ?",
    back: "Gaussienne de moyenne $\\mu_1 + \\frac{\\Sigma_{12}}{\\Sigma_{22}}(x_2 - \\mu_2)$ (affine en $x_2$) et de variance $\\Sigma_{11} - \\Sigma_{12}^2/\\Sigma_{22}$ (indépendante de $x_2$).",
  },
  {
    id: "ga-reparametrisation",
    section: 4,
    front: "Astuce de reparamétrisation d'un VAE ?",
    back: "Écrire $z = \\mu + \\sigma\\epsilon$ avec $\\epsilon \\sim \\mathcal N(0, 1)$ : le hasard ne dépend plus des paramètres, et $z$ est dérivable par rapport à $\\mu$ et $\\sigma$ (Kingma et Welling 2014, §2.4).",
  },
  {
    id: "ga-diffusion",
    section: 4,
    front: "Processus avant d'un modèle de diffusion (DDPM) en une étape ?",
    back: "$x_t = \\sqrt{\\bar\\alpha_t}\\,x_0 + \\sqrt{1 - \\bar\\alpha_t}\\,\\epsilon$, $\\bar\\alpha_t = \\prod_s (1 - \\beta_s)$ : les petits bruits gaussiens indépendants s'additionnent en un seul. La variance est conservée si $V(x_0) = 1$.",
  },
];
