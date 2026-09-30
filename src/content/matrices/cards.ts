import type { ConceptCard } from "../types";

export const matricesCards: ConceptCard[] = [
  {
    id: "ax-colonnes",
    section: 1,
    front: "Comment lire $Ax$ « par colonnes » ?",
    back: "$Ax = x_1 (\\text{colonne } 1) + \\dots + x_n (\\text{colonne } n)$ : une combinaison linéaire des colonnes de $A$, avec les composantes de $x$ pour coefficients. Par lignes, chaque composante de $Ax$ est un produit scalaire ligne $\\cdot\\, x$.",
  },
  {
    id: "colonnes-images",
    section: 2,
    front: "Que représentent les colonnes d'une matrice ?",
    back: "La colonne $j$ est $Ae_j$, l'image du $j$-ième vecteur de base. Connaître ces images suffit à connaître $A$ : $Ax = x_1 Ae_1 + \\dots + x_n Ae_n$.",
  },
  {
    id: "translation-pas-lineaire",
    section: 3,
    front: "Pourquoi $x \\mapsto x + b$ (avec $b \\ne 0$) n'est-elle pas linéaire ?",
    back: "Une application linéaire vérifie $f(0) = f(0 \\cdot 0) = 0 \\cdot f(0) = 0$. Ici $f(0) = b \\ne 0$. Une matrice suivie d'une translation, $Wx + b$, est dite affine.",
  },
  {
    id: "produit-composition",
    section: 4,
    front: "Que signifie le produit $AB$, et comment calcule-t-on $(AB)_{ij}$ ?",
    back: "$AB$ est la transformation « appliquer $B$, puis $A$ ». $(AB)_{ij}$ est le produit scalaire de la ligne $i$ de $A$ par la colonne $j$ de $B$. Tailles : $(m \\times n)(n \\times p) = m \\times p$.",
  },
  {
    id: "non-commutatif",
    section: 4,
    front: "A-t-on $AB = BA$ en général ? Et $(AB)C = A(BC)$ ?",
    back: "Non : enchaîner deux transformations dans l'autre ordre donne en général autre chose (un quart de tour et un cisaillement, par exemple). Oui pour l'associativité : les deux côtés veulent dire « $C$, puis $B$, puis $A$ ».",
  },
  {
    id: "transposee-produit",
    section: 5,
    front: "Que vaut $(AB)^\\top$ ?",
    back: "$B^\\top A^\\top$ : l'ordre s'inverse. Le coefficient $(i, j)$ des deux côtés est le produit scalaire de la ligne $j$ de $A$ et de la colonne $i$ de $B$.",
  },
  {
    id: "couches-sans-activation",
    section: 6,
    front: "Pourquoi un réseau a-t-il besoin d'une fonction d'activation non linéaire entre ses couches ?",
    back: "Sans elle, $W_2(W_1 x) = (W_2 W_1)\\,x$ : par associativité, deux couches linéaires se fusionnent en une seule matrice. Empiler des couches n'apporterait rien.",
  },
  {
    id: "parametres-couche",
    section: 6,
    front: "Combien de paramètres a une couche dense de $n_{\\text{in}}$ entrées et $n_{\\text{out}}$ sorties ?",
    back: "$W$ a $n_{\\text{out}} \\times n_{\\text{in}}$ coefficients (une ligne de poids par neurone), plus $n_{\\text{out}}$ biais : $n_{\\text{out}}\\,n_{\\text{in}} + n_{\\text{out}}$.",
  },
];
