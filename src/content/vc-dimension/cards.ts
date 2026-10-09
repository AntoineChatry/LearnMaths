import type { ConceptCard } from "../types";

export const vcDimensionCards: ConceptCard[] = [
  {
    id: "vc-croissance",
    section: 1,
    front: "Fonction de croissance $\\Pi_H(m)$, et pourquoi la regarder plutôt que $|H|$ ?",
    back: "$\\Pi_H(m)$ est le plus grand nombre d'étiquetages distincts que $H$ réalise sur $m$ points ; $\\Pi_H(m) \\le 2^m$. Une classe infinie (classifieurs linéaires à coefficients réels) n'a, vue à travers $m$ exemples, qu'un nombre fini de comportements : c'est lui qui compte.",
  },
  {
    id: "vc-definition",
    section: 1,
    front: "Pulvériser un ensemble, dimension VC ?",
    back: "$H$ pulvérise un ensemble de points s'il en réalise les $2^m$ étiquetages. $\\mathrm{VC}(H)$ est la taille du plus grand ensemble pulvérisé : il suffit d'un ensemble de $d$ points pulvérisé, et aucun de $d + 1$. Intervalles : 2 ; demi-plans : 3 ; demi-espaces de $\\mathbb R^n$ : $n + 1$.",
  },
  {
    id: "vc-sauer",
    section: 2,
    front: "Lemme de Sauer ?",
    back: "Si $\\mathrm{VC}(H) = d$ : $\\Pi_H(m) \\le \\sum_{i=0}^{d} \\binom{m}{i} \\le (em/d)^d$ (la seconde pour $m \\ge d$). Deux régimes seulement : $2^m$ pour tout $m$ (dimension infinie), ou une croissance polynomiale en $O(m^d)$.",
  },
  {
    id: "vc-borne",
    section: 3,
    front: "Borne de généralisation VC ?",
    back: "Avec probabilité au moins $1 - \\delta$, pour tout $h \\in H$ : $R(h) \\le \\hat R_S(h) + \\sqrt{\\frac{2d \\ln(em/d)}{m}} + \\sqrt{\\frac{\\ln(1/\\delta)}{2m}}$. Le $\\ln|H|$ des classes finies devient $d \\ln(em/d)$ : tout se joue sur le rapport $m/d$.",
  },
  {
    id: "vc-parametres",
    section: 4,
    front: "La dimension VC est-elle le nombre de paramètres ?",
    back: "Souvent à peu près (demi-espaces : $n + 1$ paramètres, dimension $n + 1$), mais pas toujours : $\\mathbf 1[\\sin(\\omega x) > 0]$, avec un seul paramètre $\\omega$, pulvérise les points $10^{-i}$ en nombre quelconque. Dimension infinie.",
  },
  {
    id: "vc-inferieure",
    section: 4,
    front: "Pourquoi la dimension VC est-elle nécessaire, et pas seulement suffisante ?",
    back: "Borne inférieure (Mohri, th. 3.23) : si $d > 1$, pour tout algorithme, une loi des données fait dépasser à l'excès de risque $\\sqrt{d/(320m)}$ avec probabilité au moins $1/64$. Il faut donc $m$ de l'ordre de $d/\\varepsilon^2$ exemples.",
  },
];
