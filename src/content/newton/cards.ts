import type { ConceptCard } from "../types";

export const newtonCards: ConceptCard[] = [
  {
    id: "nt-pas",
    section: 1,
    front: "Pas de Newton en plusieurs variables : d'où vient-il, et comment le calcule-t-on ?",
    back: "Il annule le gradient du modèle quadratique $\\hat f(x + v) = f(x) + g^\\top v + \\tfrac12 v^\\top H v$ : $\\Delta x_{\\text{nt}} = -H^{-1} g$. On résout $Hv = -g$ sans inverser $H$. Si $H$ est définie positive, c'est une direction de descente ; si $f$ est quadratique, un pas suffit.",
  },
  {
    id: "nt-invariance",
    section: 2,
    front: "Pourquoi Newton ne souffre-t-il pas d'un mauvais conditionnement, contrairement au gradient ?",
    back: "Il est invariant par changement de coordonnées affine $x = Ty$ : $\\Delta y_{\\text{nt}} = T^{-1}\\Delta x_{\\text{nt}}$ (Boyd 9.5.1). Étirer un axe ne change pas la suite des itérés, alors que le pas de gradient devient $-T^\\top g$. Newton préconditionne par $P = H$.",
  },
  {
    id: "nt-phases",
    section: 3,
    front: "Newton pur peut diverger. Que fait la méthode de Newton de Boyd, et comment converge-t-elle ?",
    back: "Elle ajoute une recherche linéaire par rebroussement. Phase amortie loin du minimum ($t < 1$, baisse d'au moins une constante), puis phase quadratique : pas plein accepté, erreur grossièrement élevée au carré à chaque pas, le nombre de chiffres justes double.",
  },
  {
    id: "nt-decrement",
    section: 3,
    front: "Qu'est-ce que le décrément de Newton, et à quoi sert-il ?",
    back: "$\\lambda^2 = g^\\top H^{-1} g$. La baisse promise par le modèle quadratique est $\\lambda^2/2$, une estimation de $f(x) - \\min f$ : on s'arrête quand elle passe sous la tolérance.",
  },
  {
    id: "nt-grande-dim",
    section: 4,
    front: "Pourquoi n'entraîne-t-on pas les réseaux profonds avec Newton ?",
    back: "Hors du convexe, le pas de Newton est attiré par les points selles (Dauphin et al. 2014). Et avec $n$ paramètres, $H$ a $n^2$ coefficients et la résolution coûte de l'ordre de $n^3$. On sait seulement calculer $Hv$ au prix d'un gradient ; L-BFGS, momentum et Adam contournent la hessienne.",
  },
];
