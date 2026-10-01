import type { ConceptCard } from "../types";

export const integrationCards: ConceptCard[] = [
  {
    id: "rectangles-ordre-erreur",
    section: 1,
    front: "Tu multiplies par 10 le nombre $n$ de rectangles. Que devient l'erreur avec les rectangles à gauche ? Avec les rectangles au milieu ?",
    back: "À gauche, elle est divisée par environ 10 (erreur en $\\frac{1}{n}$). Au milieu, par environ 100 (erreur en $\\frac{1}{n^2}$).",
  },
  {
    id: "pourquoi-milieu-meilleur",
    section: 1,
    front: "Pourquoi le rectangle lu au milieu de la bande est-il bien plus précis que celui lu au bord gauche ?",
    back: "Si la courbe était une droite sur la bande, le rectangle du milieu aurait exactement la bonne aire : le petit triangle en trop d'un côté compense celui qui manque de l'autre. Il ne reste que l'effet de la courbure, d'un ordre plus petit.",
  },
  {
    id: "tfa-intuition",
    section: 2,
    front: "Pourquoi la dérivée de $F(x) = \\int_a^x f(t)\\,\\mathrm{d}t$ est-elle $f(x)$, et sous quelle hypothèse ?",
    back: "Si $f$ est continue : quand $x$ avance de $h$, l'aire accumulée gagne une bande fine, presque un rectangle d'aire $f(x)\\,h$ (sur la bande, $f$ reste proche de $f(x)$). Donc $\\frac{F(x+h) - F(x)}{h} \\to f(x)$. Sans continuité, c'est faux : pour un saut de 0 à 1 en 0, $F(x) = \\max(x, 0)$ n'est pas dérivable en 0.",
  },
  {
    id: "primitive-constante",
    section: 2,
    front: "Pourquoi peut-on utiliser n'importe quelle primitive $G$ de $f$ pour calculer $\\int_a^b f$ ?",
    back: "Deux primitives de $f$ sur un intervalle diffèrent d'une constante $C$, et dans $G(b) - G(a)$ cette constante s'annule.",
  },
  {
    id: "integrale-vs-aire",
    section: 2,
    front: "Que vaut $\\int_0^{2\\pi} \\sin x\\,\\mathrm{d}x$, et pourquoi ce n'est pas l'aire entre la courbe et l'axe ?",
    back: "Elle vaut $0$ : l'intégrale compte négativement ce qui est sous l'axe, et les deux arches se compensent. L'aire géométrique est $\\int_0^{2\\pi} |\\sin x|\\,\\mathrm{d}x = 4$.",
  },
  {
    id: "ipp-origine-choix",
    section: 4,
    front: "D'où vient l'intégration par parties, et comment choisir $u$ et $v'$ ?",
    back: "De la dérivée d'un produit, $(uv)' = u'v + uv'$, intégrée entre $a$ et $b$. On prend pour $u$ ce qui se simplifie en le dérivant (polynôme, $\\ln$) et pour $v'$ ce qu'on sait intégrer ($e^x$, $\\sin$, $\\cos$). Si l'intégrale obtenue est pire, on a fait le mauvais choix.",
  },
  {
    id: "changement-variable-bornes",
    section: 3,
    front: "Dans $\\int_1^e \\frac{\\ln x}{x}\\,\\mathrm{d}x$ avec $u = \\ln x$, que se passe-t-il si tu gardes les bornes 1 et $e$ ?",
    back: "Le résultat est faux : $\\int_1^e u\\,\\mathrm{d}u = \\frac{e^2 - 1}{2}$ au lieu de $\\frac12$. La règle de la chaîne lue à l'envers donne $\\int_a^b f(u(x))\\,u'(x)\\,\\mathrm{d}x = \\int_{u(a)}^{u(b)} f(u)\\,\\mathrm{d}u$ : les bornes deviennent $u(1) = 0$ et $u(e) = 1$.",
  },
  {
    id: "impropre-tendre-vers-zero",
    section: 5,
    front: "Si $f(x) \\to 0$ quand $x \\to +\\infty$, l'intégrale $\\int_1^{+\\infty} f(x)\\,\\mathrm{d}x$ converge-t-elle forcément ?",
    back: "Non. $\\frac{1}{x} \\to 0$, mais $\\int_1^A \\frac{\\mathrm{d}x}{x} = \\ln A \\to +\\infty$. Il faut tendre vers 0 assez vite : $\\int_1^{+\\infty} \\frac{\\mathrm{d}x}{x^p}$ converge si et seulement si $p > 1$.",
  },
];
