import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { TransformViz } from "./TransformViz";

export function MatricesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Deux façons de lire Ax</h2>
        <p>
          Une <strong>matrice</strong> <Tex>{"m \\times n"}</Tex> est un tableau de nombres à <Tex>m</Tex> lignes et{" "}
          <Tex>n</Tex> colonnes ; <Tex>{"a_{ij}"}</Tex> désigne le nombre de la ligne <Tex>i</Tex>, colonne{" "}
          <Tex>j</Tex>. Elle agit sur un vecteur <Tex>x</Tex> de <Tex>{"\\mathbb{R}^n"}</Tex> et rend un vecteur{" "}
          <Tex>{"Ax"}</Tex> de <Tex>{"\\mathbb{R}^m"}</Tex>. Il y a deux façons, équivalentes, de faire le calcul.
          Prends
        </p>
        <Tex block>{"A = \\begin{pmatrix} 1 & 2 \\\\ 3 & 4 \\\\ 5 & 6 \\end{pmatrix} \\qquad x = \\begin{pmatrix} 2 \\\\ 1 \\end{pmatrix}"}</Tex>
        <p>
          <strong>Par lignes</strong> : chaque composante de <Tex>{"Ax"}</Tex> est le produit scalaire d'une ligne de{" "}
          <Tex>A</Tex> avec <Tex>x</Tex>. C'est la façon de calculer à la main.
        </p>
        <Tex block>{"Ax = \\begin{pmatrix} 1 \\times 2 + 2 \\times 1 \\\\ 3 \\times 2 + 4 \\times 1 \\\\ 5 \\times 2 + 6 \\times 1 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 10 \\\\ 16 \\end{pmatrix}"}</Tex>
        <p>
          <strong>Par colonnes</strong> : <Tex>{"Ax"}</Tex> est une combinaison linéaire des colonnes de{" "}
          <Tex>A</Tex>, avec les composantes de <Tex>x</Tex> pour coefficients. C'est la façon de comprendre.
        </p>
        <Tex block>{"Ax = 2 \\begin{pmatrix} 1 \\\\ 3 \\\\ 5 \\end{pmatrix} + 1 \\begin{pmatrix} 2 \\\\ 4 \\\\ 6 \\end{pmatrix} = \\begin{pmatrix} 4 \\\\ 10 \\\\ 16 \\end{pmatrix}"}</Tex>
        <p>
          Les deux donnent la même chose : ce sont les mêmes six produits, regroupés autrement. Gilbert Strang ouvre
          son cours du MIT (18.06, première leçon) avec ces deux lectures, la « row picture » et la « column picture ».
          Garde la seconde en tête : presque tout le module se comprend avec elle.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Une matrice déforme le plan</h2>
        <p>
          Applique la lecture par colonnes aux vecteurs <Tex>{"e_1 = (1, 0)"}</Tex> et <Tex>{"e_2 = (0, 1)"}</Tex> :{" "}
          <Tex>{"Ae_1"}</Tex> est la première colonne de <Tex>A</Tex>, et <Tex>{"Ae_2"}</Tex> la seconde. Et comme
          tout vecteur s'écrit <Tex>{"x = x_1 e_1 + x_2 e_2"}</Tex>, son image est{" "}
          <Tex>{"x_1\\,(Ae_1) + x_2\\,(Ae_2)"}</Tex>. Une matrice <Tex>{"2 \\times 2"}</Tex> est donc entièrement
          décrite par l'endroit où elle envoie <Tex>{"e_1"}</Tex> et <Tex>{"e_2"}</Tex>.
        </p>
        <p>
          Déplace les deux colonnes, ou essaie les exemples. Regarde ce qui ne change jamais : l'origine reste en
          place, les droites restent des droites, et les lignes de la grille restent parallèles et régulièrement
          espacées.
        </p>
        <TransformViz />
        <p>
          Le dernier exemple est spécial : les deux colonnes sont sur une même droite, et tout le plan est écrasé sur
          elle. Des informations sont perdues : deux points différents peuvent avoir la même image. Ce phénomène
          reviendra aux chapitres 4 (le rang) et 5 (le déterminant).
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Linéaire veut dire : respecte les combinaisons</h2>
        <p>La lecture par colonnes donne immédiatement deux propriétés, pour tous vecteurs et tout nombre :</p>
        <Tex block>{"A(x + y) = Ax + Ay \\qquad A(\\lambda x) = \\lambda\\,Ax"}</Tex>
        <p>
          Une fonction qui vérifie ces deux règles s'appelle une <strong>application linéaire</strong>. La
          réciproque est vraie et c'est le point clé : toute application linéaire <Tex>f</Tex> de{" "}
          <Tex>{"\\mathbb{R}^n"}</Tex> dans <Tex>{"\\mathbb{R}^m"}</Tex> est une matrice. En effet,
        </p>
        <Tex block>{"f(x) = f(x_1 e_1 + \\dots + x_n e_n) = x_1 f(e_1) + \\dots + x_n f(e_n)"}</Tex>
        <p>
          et c'est exactement la lecture par colonnes de la matrice dont les colonnes sont{" "}
          <Tex>{"f(e_1), \\dots, f(e_n)"}</Tex>. Rotations, symétries, projections, étirements : pour trouver leur
          matrice, il suffit de chercher l'image de chaque <Tex>{"e_j"}</Tex>. Par exemple, la rotation d'angle{" "}
          <Tex>{"\\theta"}</Tex> envoie <Tex>{"e_1"}</Tex> sur <Tex>{"(\\cos\\theta, \\sin\\theta)"}</Tex> et{" "}
          <Tex>{"e_2"}</Tex> sur <Tex>{"(-\\sin\\theta, \\cos\\theta)"}</Tex> :
        </p>
        <Tex block>{"R_\\theta = \\begin{pmatrix} \\cos\\theta & -\\sin\\theta \\\\ \\sin\\theta & \\cos\\theta \\end{pmatrix}"}</Tex>
        <p>
          Attention : une translation <Tex>{"x \\mapsto x + b"}</Tex> avec <Tex>{"b \\ne 0"}</Tex> n'est{" "}
          <em>pas</em> linéaire, car une application linéaire envoie toujours 0 sur 0. Une matrice suivie d'une
          translation, <Tex>{"x \\mapsto Wx + b"}</Tex>, s'appelle une application <strong>affine</strong>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le produit de matrices, c'est enchaîner</h2>
        <p>
          Applique d'abord <Tex>B</Tex>, puis <Tex>A</Tex> : <Tex>{"x \\mapsto A(Bx)"}</Tex>. C'est encore une
          application linéaire, donc une matrice, qu'on note <Tex>{"AB"}</Tex>. Ses colonnes sont les images des{" "}
          <Tex>{"e_j"}</Tex> : la colonne <Tex>j</Tex> de <Tex>{"AB"}</Tex> est <Tex>A</Tex> fois la colonne{" "}
          <Tex>j</Tex> de <Tex>B</Tex>. En lisant ce produit par lignes, on obtient la règle de calcul :
        </p>
        <Tex block>{"(AB)_{ij} = \\text{(ligne } i \\text{ de } A) \\cdot \\text{(colonne } j \\text{ de } B) = \\sum_{k} a_{ik}\\, b_{kj}"}</Tex>
        <p>
          Le produit scalaire exige des longueurs égales : le nombre de colonnes de <Tex>A</Tex> doit être celui des
          lignes de <Tex>B</Tex>. Les tailles se lisent comme des dominos :
        </p>
        <Tex block>{"(m \\times n)\\,(n \\times p) = (m \\times p)"}</Tex>
        <p>
          Enchaîner deux transformations dans un ordre ou dans l'autre ne donne en général pas la même chose. Un
          quart de tour <Tex>A</Tex> et un cisaillement <Tex>B</Tex> :
        </p>
        <pre>
          <code>{`import numpy as np

A = np.array([[0, -1],
              [1,  0]])    # rotation d'un quart de tour
B = np.array([[1, 1],
              [0, 1]])     # cisaillement
print(A @ B)   # [[ 0 -1]
               #  [ 1  1]]
print(B @ A)   # [[ 1 -1]
               #  [ 1  0]]`}</code>
        </pre>
        <p>
          Donc <Tex>{"AB \\ne BA"}</Tex> : le produit de matrices n'est <strong>pas commutatif</strong>. Il est en
          revanche <strong>associatif</strong>, <Tex>{"(AB)C = A(BC)"}</Tex>, puisque les deux côtés veulent dire «
          appliquer <Tex>C</Tex>, puis <Tex>B</Tex>, puis <Tex>A</Tex> ».
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>La transposée</h2>
        <p>
          La <strong>transposée</strong> <Tex>{"A^\\top"}</Tex> échange lignes et colonnes :{" "}
          <Tex>{"(A^\\top)_{ij} = a_{ji}"}</Tex>. Une matrice <Tex>{"m \\times n"}</Tex> devient{" "}
          <Tex>{"n \\times m"}</Tex>. En voyant un vecteur comme une colonne (une matrice <Tex>{"n \\times 1"}</Tex>
          ), le produit scalaire devient un produit de matrices :
        </p>
        <Tex block>{"x \\cdot y = x^\\top y \\qquad \\text{(une ligne fois une colonne : une matrice } 1 \\times 1\\text{)}"}</Tex>
        <p>La transposée d'un produit inverse l'ordre :</p>
        <Tex block>{"(AB)^\\top = B^\\top A^\\top"}</Tex>
        <p>
          Preuve, coefficient par coefficient : <Tex>{"((AB)^\\top)_{ij} = (AB)_{ji}"}</Tex>, le produit scalaire de
          la ligne <Tex>j</Tex> de <Tex>A</Tex> et de la colonne <Tex>i</Tex> de <Tex>B</Tex>. Or la colonne{" "}
          <Tex>i</Tex> de <Tex>B</Tex> est la ligne <Tex>i</Tex> de <Tex>{"B^\\top"}</Tex>, et la ligne <Tex>j</Tex>{" "}
          de <Tex>A</Tex> est la colonne <Tex>j</Tex> de <Tex>{"A^\\top"}</Tex> : c'est donc aussi{" "}
          <Tex>{"(B^\\top A^\\top)_{ij}"}</Tex>.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Retour à l'attention</p>
          <p>
            Range les requêtes <Tex>{"q_1, \\dots, q_T"}</Tex> en lignes d'une matrice <Tex>Q</Tex>, et les clés en
            lignes d'une matrice <Tex>K</Tex>. Alors <Tex>{"K^\\top"}</Tex> a les clés en colonnes, et le coefficient{" "}
            <Tex>{"(i, j)"}</Tex> de <Tex>{"QK^\\top"}</Tex> est ligne <Tex>i</Tex> de <Tex>Q</Tex> fois colonne{" "}
            <Tex>j</Tex> de <Tex>{"K^\\top"}</Tex>, c'est-à-dire <Tex>{"q_i \\cdot k_j"}</Tex>. Le{" "}
            <Tex>{"QK^\\top"}</Tex> de la formule du chapitre précédent est le tableau de tous les produits
            scalaires entre requêtes et clés, calculé en une seule multiplication.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>Une couche de réseau de neurones</h2>
        <p>
          Une couche dense prend un vecteur d'entrée <Tex>x</Tex> de taille <Tex>{"n_{\\text{in}}"}</Tex>,
          applique une application affine, puis une fonction non linéaire <Tex>{"\\sigma"}</Tex> composante par
          composante (sigmoïde, ReLU…) :
        </p>
        <Tex block>{"y = \\sigma(Wx + b) \\qquad W \\in \\mathbb{R}^{n_{\\text{out}} \\times n_{\\text{in}}},\\ b \\in \\mathbb{R}^{n_{\\text{out}}}"}</Tex>
        <p>
          La ligne <Tex>i</Tex> de <Tex>W</Tex> contient les poids du neurone <Tex>i</Tex> : sa sortie est un
          produit scalaire, plus un biais, passé dans <Tex>{"\\sigma"}</Tex>. La couche a{" "}
          <Tex>{"n_{\\text{out}} \\times n_{\\text{in}} + n_{\\text{out}}"}</Tex> paramètres.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Dans PyTorch</p>
          <p>
            La documentation de <code>nn.Linear</code> écrit <Tex>{"y = xA^\\top + b"}</Tex>, avec des poids de
            forme <code>(out_features, in_features)</code>. C'est notre <Tex>{"Wx + b"}</Tex>, transposé : les
            exemples d'un batch sont rangés en <em>lignes</em> d'une matrice <Tex>X</Tex>, et{" "}
            <Tex>{"(Wx)^\\top = x^\\top W^\\top"}</Tex>. Tout le batch passe en une seule multiplication :
          </p>
          <pre>
            <code>{`import numpy as np

rng = np.random.default_rng(0)
X = rng.standard_normal((32, 4))   # 32 exemples, 4 features
W = rng.standard_normal((16, 4))   # (sorties, entrées)
b = np.zeros(16)
Y = X @ W.T + b
print(Y.shape)                     # (32, 16)
print(np.allclose(Y[5], W @ X[5] + b))   # True`}</code>
          </pre>
        </div>
        <p>
          Pourquoi la fonction <Tex>{"\\sigma"}</Tex> ? Sans elle, deux couches donnent{" "}
          <Tex>{"W_2(W_1 x) = (W_2 W_1)\\,x"}</Tex> : l'associativité les fusionne en une seule matrice. Empiler
          cent couches linéaires ne ferait pas mieux qu'une seule. On le vérifie :
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
W1 = rng.standard_normal((16, 4))   # couche 1 : 4 -> 16
W2 = rng.standard_normal((3, 16))   # couche 2 : 16 -> 3
x = rng.standard_normal(4)

une_seule = (W2 @ W1) @ x           # une seule matrice 3 x 4
print(np.allclose(W2 @ (W1 @ x), une_seule))   # True

relu = lambda z: np.maximum(z, 0)
print(np.allclose(W2 @ relu(W1 @ x), une_seule))   # False`}</code>
        </pre>
        <p>
          Avec la ReLU entre les deux, la fusion n'est plus possible : c'est la non-linéarité qui donne de l'intérêt
          à la profondeur. Mais chaque couche reste, pour l'essentiel, une matrice. Savoir quand <Tex>{"Wx = y"}</Tex>{" "}
          a une solution, et la trouver, c'est le chapitre suivant.
        </p>
      </section>
    </LessonFlow>
  );
}
