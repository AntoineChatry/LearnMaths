import type { ConceptCard } from "../types";

export const vecteursCards: ConceptCard[] = [
  {
    id: "combinaison-lineaire",
    section: 1,
    front: "Qu'est-ce qu'une combinaison linéaire de $v_1, \\dots, v_k$ ?",
    back: "Une somme $\\lambda_1 v_1 + \\dots + \\lambda_k v_k$ où les $\\lambda_i$ sont des nombres. On ne fait que deux opérations : multiplier un vecteur par un nombre, et additionner des vecteurs, composante par composante.",
  },
  {
    id: "norme-pythagore",
    section: 2,
    front: "Comment calcule-t-on la norme de $a = (a_1, \\dots, a_n)$, et d'où vient la formule ?",
    back: "$\\|a\\| = \\sqrt{a_1^2 + \\dots + a_n^2}$. En 2D c'est Pythagore ; en 3D, Pythagore appliqué deux fois. En dimension $n$, on la prend comme définition.",
  },
  {
    id: "norme-produit-scalaire",
    section: 3,
    front: "Quel lien entre la norme et le produit scalaire ?",
    back: "$a \\cdot a = a_1^2 + \\dots + a_n^2 = \\|a\\|^2$, donc $\\|a\\| = \\sqrt{a \\cdot a}$.",
  },
  {
    id: "signe-produit-scalaire",
    section: 4,
    front: "Que dit le signe de $a \\cdot b$ sur deux vecteurs non nuls ?",
    back: "$a \\cdot b = \\|a\\|\\,\\|b\\|\\cos\\theta$, et les normes sont positives : le signe est celui de $\\cos\\theta$. Positif : angle aigu. Négatif : angle obtus. Nul : ils sont orthogonaux.",
  },
  {
    id: "projete-orthogonal",
    section: 5,
    front: "Quel est le projeté orthogonal de $a$ sur la droite portée par $b \\ne 0$, et comment vérifier qu'il est juste ?",
    back: "$p = \\frac{a \\cdot b}{\\|b\\|^2}\\,b$. Le reste $a - p$ doit être orthogonal à $b$ : $(a - p) \\cdot b = a \\cdot b - \\frac{a \\cdot b}{\\|b\\|^2}\\,\\|b\\|^2 = 0$.",
  },
  {
    id: "cauchy-schwarz-preuve",
    section: 6,
    front: "Quelle est l'idée de la preuve de Cauchy-Schwarz, $|a \\cdot b| \\le \\|a\\|\\,\\|b\\|$ ?",
    back: "Si $b = 0$, les deux membres sont nuls. Sinon, $t \\mapsto \\|a + t\\,b\\|^2 = \\|b\\|^2 t^2 + 2(a \\cdot b)\\,t + \\|a\\|^2$ est un trinôme jamais négatif. Son discriminant est donc $\\le 0$ : $4(a \\cdot b)^2 - 4\\|a\\|^2\\|b\\|^2 \\le 0$.",
  },
  {
    id: "similarite-cosinus",
    section: 7,
    front: "Pourquoi compare-t-on des embeddings avec la similarité cosinus plutôt qu'avec le produit scalaire brut ?",
    back: "$\\frac{a \\cdot b}{\\|a\\|\\,\\|b\\|}$ ne dépend que des directions : multiplier un vecteur par 10 ne la change pas. Et Cauchy-Schwarz garantit qu'elle reste entre −1 et 1.",
  },
  {
    id: "attention-racine-d",
    section: 7,
    front: "Pourquoi l'attention divise-t-elle $q \\cdot k$ par $\\sqrt{d_k}$ ?",
    back: "Si les composantes de $q$ et $k$ sont indépendantes, de moyenne 0 et de variance 1, $q \\cdot k$ a une variance $d_k$ : les scores grandissent avec la dimension et écrasent le softmax. Diviser par $\\sqrt{d_k}$ ramène la variance à 1.",
  },
];
