import type { ConceptCard } from "../types";

export const diffusionCards: ConceptCard[] = [
  {
    id: "di-avant",
    section: 1,
    front: "Processus vers l'avant d'un modèle de diffusion (DDPM) ? Pourquoi peut-on sauter directement au pas $t$ ?",
    back: "$q(x_t \\mid x_{t-1}) = N(\\sqrt{1 - \\beta_t}\\, x_{t-1}, \\beta_t I)$, une chaîne de Markov sans paramètre. Les bruits gaussiens se composent : $q(x_t \\mid x_0) = N(\\sqrt{\\bar\\alpha_t}\\, x_0, (1 - \\bar\\alpha_t) I)$ avec $\\bar\\alpha_t = \\prod_s (1 - \\beta_s)$. Avec $T = 1000$ et $\\beta$ de $10^{-4}$ à 0,02, $x_T$ est du bruit pur.",
  },
  {
    id: "di-posterieur",
    section: 2,
    front: "Pourquoi $q(x_{t-1} \\mid x_t, x_0)$ est-il calculable alors que $q(x_{t-1} \\mid x_t)$ ne l'est pas ?",
    back: "Sachant $x_0$, le couple $(x_{t-1}, x_t)$ est gaussien : on conditionne, d'où une loi $N(\\tilde\\mu_t, \\tilde\\beta_t I)$ explicite. Sans $x_0$, il faudrait connaître toute la loi des données. Le réseau remplace $x_0$ par une estimation.",
  },
  {
    id: "di-entrainement",
    section: 2,
    front: "Que minimise l'entraînement de DDPM, et comment génère-t-on ?",
    back: "$L_{\\text{simple}} = \\mathbb E \\|\\varepsilon - \\varepsilon_\\theta(\\sqrt{\\bar\\alpha_t}\\, x_0 + \\sqrt{1 - \\bar\\alpha_t}\\, \\varepsilon, t)\\|^2$ : une régression qui prédit le bruit ajouté. Génération : $x_T \\sim N(0, I)$, puis $x_{t-1} = \\frac{1}{\\sqrt{\\alpha_t}}(x_t - \\frac{\\beta_t}{\\sqrt{1 - \\bar\\alpha_t}}\\varepsilon_\\theta) + \\sigma_t z$.",
  },
  {
    id: "di-score",
    section: 3,
    front: "Lien entre prédire le bruit et le score ?",
    back: "Le meilleur prédicteur est $\\varepsilon^\\star(x_t, t) = -\\sqrt{1 - \\bar\\alpha_t}\\, \\nabla \\log q_t(x_t)$ : débruiter, c'est estimer le score de la loi bruitée (score matching par débruitage, Vincent 2011). La perte minimale n'est pas nulle : $x_t$ seul ne détermine pas le bruit.",
  },
  {
    id: "di-eds",
    section: 4,
    front: "Version continue de DDPM, et comment l'inverser ?",
    back: "EDS à variance préservée $dx = -\\frac12\\beta(t)x\\,dt + \\sqrt{\\beta(t)}\\,dw$, un Ornstein-Uhlenbeck à rappel variable. Inverse (Anderson 1982) : $dx = [f - g^2\\nabla\\log p_t]\\,dt + g\\,d\\bar w$, en remontant le temps. Il suffit de connaître le score.",
  },
  {
    id: "di-flot",
    section: 4,
    front: "Qu'est-ce que le flot de probabilité ?",
    back: "L'équation sans hasard $dx = [f - \\frac12 g^2 \\nabla \\log p_t]\\,dt$, dont les trajectoires ont les mêmes lois $p_t$ que l'EDS. Elle associe à chaque bruit une donnée précise, de façon inversible, ce qui permet de calculer exactement la vraisemblance.",
  },
];
