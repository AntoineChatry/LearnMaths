import type { ConceptCard } from "../types";

export const rappelsCards: ConceptCard[] = [
  {
    id: "derivee-pente-secante",
    section: 2,
    front: "Que représente géométriquement $f'(a)$, et d'où vient-il ?",
    back: "La pente de la tangente en $a$. C'est la limite des pentes des sécantes $\\frac{f(a+h) - f(a)}{h}$ quand $h \\to 0$.",
  },
  {
    id: "chaine-facteur-oublie",
    section: 2,
    front: "Pourquoi la dérivée de $e^{3x}$ n'est-elle pas $e^{3x}$ ?",
    back: "C'est une composée $e^{u}$ avec $u = 3x$ : on dérive l'extérieur, puis on multiplie par $u' = 3$. Donc $(e^{3x})' = 3e^{3x}$.",
  },
  {
    id: "primitive-constante",
    section: 3,
    front: "Pourquoi dit-on « une » primitive et pas « la » primitive ?",
    back: "Si $F' = f$, alors $(F + C)' = f$ pour toute constante $C$. Une condition comme $F(0) = 0$ en choisit une seule.",
  },
  {
    id: "integrale-constante-disparait",
    section: 3,
    front: "Dans $\\int_a^b f = F(b) - F(a)$, pourquoi n'importe quelle primitive convient-elle ?",
    back: "Avec $F + C$ à la place de $F$ : $(F(b) + C) - (F(a) + C) = F(b) - F(a)$. La constante s'élimine.",
  },
  {
    id: "ln-domaine",
    section: 4,
    front: "Pourquoi $\\ln x$ n'existe-t-il que pour $x > 0$ ?",
    back: "$\\ln$ est la réciproque de $\\exp$ : $\\ln x$ est le nombre $y$ tel que $e^y = x$. Or $e^y > 0$ pour tout $y$, donc aucun $y$ ne convient si $x \\le 0$.",
  },
  {
    id: "ln-somme-piege",
    section: 4,
    front: "A-t-on $\\ln(a + b) = \\ln a + \\ln b$ ?",
    back: "Non. C'est le produit qui devient une somme : $\\ln(ab) = \\ln a + \\ln b$. Contre-exemple : $\\ln(1 + 1) = \\ln 2 \\neq 0 = \\ln 1 + \\ln 1$.",
  },
  {
    id: "inequation-ln-sens",
    section: 4,
    front: "Que se passe-t-il quand on résout $0{,}9^n < 0{,}01$ en divisant par $\\ln 0{,}9$ ?",
    back: "$\\ln 0{,}9 < 0$ (car $0{,}9 < 1$), donc le sens de l'inégalité change : $n > \\frac{\\ln 0{,}01}{\\ln 0{,}9} \\approx 43{,}7$.",
  },
];
