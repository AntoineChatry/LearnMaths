import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { DetViz } from "./DetViz";

export function DeterminantLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Le facteur d'aire</h2>
        <p>
          Au chapitre 2, une matrice <Tex>{"2 \\times 2"}</Tex> envoie le carré unité sur le parallélogramme construit
          sur ses deux colonnes. Toute la grille suit, et chaque petit carré devient une copie de ce parallélogramme.
          Toutes les aires sont donc multipliées par le même nombre : l'aire de ce parallélogramme. Ce facteur, muni
          d'un signe, est le <strong>déterminant</strong>.
        </p>
        <p>
          Calculons-le pour <Tex>{"A = \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}"}</Tex>, de colonnes{" "}
          <Tex>{"(a, c)"}</Tex> et <Tex>{"(b, d)"}</Tex>, dans le cas où tous les nombres sont positifs,{" "}
          <Tex>{"a > b"}</Tex> et <Tex>{"d > c"}</Tex>. Le parallélogramme tient dans un rectangle{" "}
          <Tex>{"(a + b) \\times (c + d)"}</Tex>. Autour de lui restent deux triangles de côtés <Tex>a</Tex> et{" "}
          <Tex>c</Tex>, deux triangles de côtés <Tex>b</Tex> et <Tex>d</Tex>, et deux rectangles{" "}
          <Tex>{"b \\times c"}</Tex> :
        </p>
        <Tex block>{"(a + b)(c + d) - ac - bd - 2bc = ad - bc"}</Tex>
        <Tex block>{"\\det \\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} = ad - bc"}</Tex>
        <p>
          Déplace les colonnes. Le carré en pointillés est le carré unité, d'aire 1 :
        </p>
        <DetViz />
        <p>
          Le signe dit si la transformation <strong>conserve l'orientation</strong> ou la retourne comme un miroir.
          Échanger les deux colonnes retourne la figure et change le signe. Un déterminant nul signifie que le
          parallélogramme est aplati : les colonnes sont colinéaires, et le plan entier est écrasé sur une droite.
        </p>
        <p>
          En dimension 3, c'est pareil avec le volume du parallélépipède construit sur les trois colonnes, et en
          dimension <Tex>n</Tex> avec un volume à <Tex>n</Tex> dimensions : le déterminant est le{" "}
          <strong>volume signé</strong> de l'image du cube unité.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Les règles du déterminant</h2>
        <p>
          Pour une matrice carrée <Tex>{"n \\times n"}</Tex>, le déterminant obéit à trois règles sur les lignes (on
          les vérifie à la main en <Tex>{"2 \\times 2"}</Tex> avec <Tex>{"ad - bc"}</Tex> ; en dimension{" "}
          <Tex>n</Tex>, on les admet) :
        </p>
        <ul>
          <li>
            échanger deux lignes change le signe ;
          </li>
          <li>
            multiplier une ligne par <Tex>{"\\lambda"}</Tex> multiplie le déterminant par <Tex>{"\\lambda"}</Tex> ;
          </li>
          <li>
            ajouter à une ligne un multiple d'une autre ne change rien (c'est un cisaillement, qui conserve les aires).
          </li>
        </ul>
        <p>
          Avec <Tex>{"\\det(I) = 1"}</Tex>, on en déduit tout le reste. Une matrice <strong>triangulaire</strong> a
          pour déterminant le produit de sa diagonale : en retranchant des multiples de lignes, on efface ce qui est
          au-dessus de la diagonale sans changer le déterminant, et il reste une matrice diagonale.
        </p>
        <Tex block>{"\\det \\begin{pmatrix} 2 & 5 & -1 \\\\ 0 & 3 & 4 \\\\ 0 & 0 & -2 \\end{pmatrix} = 2 \\times 3 \\times (-2) = -12"}</Tex>
        <p>
          Multiplier toute la matrice par <Tex>{"\\lambda"}</Tex>, c'est multiplier ses <Tex>n</Tex> lignes :{" "}
          <Tex>{"\\det(\\lambda A) = \\lambda^n \\det(A)"}</Tex>. En dimension 3, doubler toutes les longueurs
          multiplie les volumes par 8, pas par 2.
        </p>
        <p>
          Deux autres propriétés importantes, admises :
        </p>
        <Tex block>{"\\det(AB) = \\det(A)\\,\\det(B) \\qquad \\det(A^\\top) = \\det(A)"}</Tex>
        <p>
          La première se lit géométriquement : appliquer <Tex>B</Tex> puis <Tex>A</Tex> multiplie les aires par{" "}
          <Tex>{"\\det(B)"}</Tex> puis par <Tex>{"\\det(A)"}</Tex>. La seconde dit que tout ce qu'on vient de dire
          des lignes vaut aussi pour les colonnes.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Calculer un déterminant</h2>
        <p>
          <strong>Par élimination.</strong> L'élimination du chapitre 3 n'utilise que des ajouts de multiples de
          lignes et des échanges. Elle ne change donc le déterminant qu'au signe près, et aboutit à une matrice
          triangulaire dont la diagonale porte les pivots :
        </p>
        <Tex block>{"\\det(A) = \\pm\\, \\text{(produit des pivots)}"}</Tex>
        <p>
          avec un signe moins par échange de lignes. Pour le système du chapitre 3, les pivots étaient{" "}
          <Tex>{"2, -8, 1"}</Tex>, sans échange :
        </p>
        <Tex block>{"\\det \\begin{pmatrix} 2 & 1 & 1 \\\\ 4 & -6 & 0 \\\\ -2 & 7 & 2 \\end{pmatrix} = 2 \\times (-8) \\times 1 = -16"}</Tex>
        <p>
          On en tire le résultat central : <Tex>{"\\det(A) \\neq 0"}</Tex> si et seulement si l'élimination trouve{" "}
          <Tex>n</Tex> pivots, c'est-à-dire si et seulement si <Tex>{"\\text{rg}(A) = n"}</Tex>. Avec le chapitre 4 :
        </p>
        <Tex block>{"\\det(A) \\neq 0 \\iff \\text{rg}(A) = n \\iff \\text{colonnes indépendantes}"}</Tex>
        <Tex block>{"\\iff A \\text{ inversible}"}</Tex>
        <p>
          <strong>Par développement.</strong> On peut aussi développer selon une ligne (développement de Laplace) :
          chaque coefficient multiplie le déterminant de la sous-matrice obtenue en rayant sa ligne et sa colonne,
          avec des signes alternés <Tex>{"+, -, +"}</Tex>. Sur la même matrice, selon la première ligne :
        </p>
        <Tex block>{"2 \\begin{vmatrix} -6 & 0 \\\\ 7 & 2 \\end{vmatrix} - 1 \\begin{vmatrix} 4 & 0 \\\\ -2 & 2 \\end{vmatrix} + 1 \\begin{vmatrix} 4 & -6 \\\\ -2 & 7 \\end{vmatrix}"}</Tex>
        <Tex block>{"= 2 \\times (-12) - 8 + (28 - 12) = -16"}</Tex>
        <p>
          C'est pratique à la main en <Tex>{"3 \\times 3"}</Tex>, mais le développement complet d'une matrice{" "}
          <Tex>{"n \\times n"}</Tex> contient <Tex>{"n!"}</Tex> termes : environ <Tex>{"3{,}6"}</Tex> millions pour{" "}
          <Tex>{"n = 10"}</Tex>. L'élimination, elle, coûte de l'ordre de <Tex>{"n^3"}</Tex> opérations. C'est elle
          que les machines utilisent :
        </p>
        <pre>
          <code>{`import numpy as np

def det(A):
    A = [row[:] for row in A]
    n = len(A)
    d = 1.0
    for k in range(n):
        p = max(range(k, n), key=lambda i: abs(A[i][k]))
        if A[p][k] == 0:
            return 0.0  # pas de pivot : colonnes liées
        if p != k:
            A[k], A[p] = A[p], A[k]
            d = -d  # un échange change le signe
        d *= A[k][k]
        for i in range(k + 1, n):
            f = A[i][k] / A[k][k]
            for j in range(k, n):
                A[i][j] -= f * A[k][j]
    return d

M = [[2, 1, 1], [4, -6, 0], [-2, 7, 2]]
print(det(M))                      # -16.0
print(np.linalg.det(np.array(M)))  # -15.999999999999998`}</code>
        </pre>
        <p>
          Avec le pivot partiel, notre fonction fait des échanges que l'élimination à la main ne faisait pas, mais
          les signes se compensent. D'après sa documentation, <code>np.linalg.det</code> passe par une factorisation{" "}
          <Tex>{"PA = LU"}</Tex> (routine LAPACK <code>getrf</code>), la même que <code>solve</code> : l'écart en
          quinzième décimale vient des arrondis.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>L'inverse</h2>
        <p>
          Une matrice carrée <Tex>A</Tex> est <strong>inversible</strong> s'il existe <Tex>{"A^{-1}"}</Tex> avec{" "}
          <Tex>{"AA^{-1} = A^{-1}A = I"}</Tex> : c'est la transformation qui défait <Tex>A</Tex>. Elle existe
          exactement quand <Tex>A</Tex> n'écrase pas l'espace, c'est-à-dire quand <Tex>{"\\det(A) \\neq 0"}</Tex>{" "}
          (une transformation qui aplatit le plan sur une droite perd de l'information, rien ne peut la défaire). On
          a alors <Tex>{"Ax = b \\iff x = A^{-1}b"}</Tex>.
        </p>
        <p>
          En <Tex>{"2 \\times 2"}</Tex>, on échange la diagonale, on change le signe des deux autres coefficients et
          on divise par le déterminant :
        </p>
        <Tex block>{"\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix}^{-1} = \\frac{1}{ad - bc} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix}"}</Tex>
        <p>
          Pour le vérifier, il suffit de multiplier :{" "}
          <Tex>{"\\begin{pmatrix} a & b \\\\ c & d \\end{pmatrix} \\begin{pmatrix} d & -b \\\\ -c & a \\end{pmatrix} = \\begin{pmatrix} ad - bc & 0 \\\\ 0 & ad - bc \\end{pmatrix}"}</Tex>
          .
        </p>
        <p>
          En dimension quelconque, on calcule l'inverse par élimination sur le tableau <Tex>{"(A \\mid I)"}</Tex> : on
          pousse l'élimination jusqu'à obtenir <Tex>I</Tex> à gauche (méthode de Gauss-Jordan), et <Tex>{"A^{-1}"}</Tex>{" "}
          apparaît à droite. C'est résoudre d'un coup les <Tex>n</Tex> systèmes <Tex>{"Ax = e_j"}</Tex>, un par
          colonne de <Tex>I</Tex> :
        </p>
        <Tex block>{"\\left(\\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 3 & 7 & 0 & 1 \\end{array}\\right) \\xrightarrow{L_2 - 3L_1} \\left(\\begin{array}{cc|cc} 1 & 2 & 1 & 0 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right)"}</Tex>
        <Tex block>{"\\xrightarrow{L_1 - 2L_2} \\left(\\begin{array}{cc|cc} 1 & 0 & 7 & -2 \\\\ 0 & 1 & -3 & 1 \\end{array}\\right)"}</Tex>
        <p>
          Propriétés utiles, qui se vérifient en multipliant :
        </p>
        <Tex block>{"(AB)^{-1} = B^{-1}A^{-1} \\qquad (A^\\top)^{-1} = (A^{-1})^\\top \\qquad \\det(A^{-1}) = \\frac{1}{\\det(A)}"}</Tex>
        <p>
          L'ordre s'inverse, comme pour la transposée : pour défaire « <Tex>B</Tex> puis <Tex>A</Tex> », on défait{" "}
          <Tex>A</Tex> d'abord. La dernière vient de <Tex>{"\\det(A)\\det(A^{-1}) = \\det(I) = 1"}</Tex>. En revanche,{" "}
          <Tex>{"(A + B)^{-1}"}</Tex> n'a aucune formule simple.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>En pratique, et en machine learning</h2>
        <p>
          <strong>On n'inverse pas pour résoudre.</strong> <Tex>{"x = A^{-1}b"}</Tex> est une écriture, pas un
          algorithme. Dans le code source de numpy, <code>inv</code> résout <Tex>{"AX = I"}</Tex> avec la même
          routine que <code>solve</code>, donc <Tex>n</Tex> systèmes, là où <code>solve(A, b)</code> n'en résout
          qu'un. Pour <Tex>{"Ax = b"}</Tex>, on appelle <code>solve</code>.
        </p>
        <p>
          <strong>Un petit déterminant ne veut pas dire « presque non inversible ».</strong> Il dépend de l'échelle :
        </p>
        <pre>
          <code>{`import numpy as np

A = 0.1 * np.eye(50)  # 0,1 fois l'identité 50 × 50
print(np.linalg.det(A))  # 9.999999999999234e-51
b = np.ones(50)
print(np.allclose(np.linalg.solve(A, b), 10 * b))  # True

B = 10 * np.eye(400)
print(np.linalg.det(B))  # inf (et un avertissement d'overflow)
sign, logdet = np.linalg.slogdet(B)
print(sign, logdet)  # 1.0 921.0340371976151`}</code>
        </pre>
        <p>
          <Tex>A</Tex> a un déterminant de <Tex>{"10^{-50}"}</Tex> et s'inverse pourtant sans aucune difficulté :
          c'est juste une réduction d'échelle. Mesurer la « presque singularité » demande un autre outil, qui viendra
          avec la SVD. Et dès <Tex>{"n = 400"}</Tex>, <Tex>{"10^{400}"}</Tex> dépasse les flottants. D'où{" "}
          <code>slogdet</code>, qui renvoie le signe et <Tex>{"\\ln|\\det|"}</Tex> (ici{" "}
          <Tex>{"400 \\ln 10 \\approx 921{,}03"}</Tex>) : selon la documentation de numpy, elle est plus robuste
          face à l'overflow et à l'underflow parce qu'elle calcule le logarithme du déterminant plutôt que le
          déterminant lui-même.
        </p>
        <p>
          <strong>Les normalizing flows.</strong> Un modèle génératif de ce type apprend une transformation
          inversible <Tex>f</Tex> qui envoie les données <Tex>x</Tex> (des images, par exemple) sur une variable{" "}
          <Tex>{"z = f(x)"}</Tex> de loi simple, une gaussienne. Pour connaître la densité des données, il faut
          savoir de combien <Tex>f</Tex> dilate les volumes près de <Tex>x</Tex>. Localement, <Tex>f</Tex> se comporte
          comme une matrice, sa <strong>jacobienne</strong> (la matrice de ses dérivées partielles), et le facteur
          de volume en est le déterminant. C'est la formule de changement de variable, telle que l'écrivent Dinh,
          Sohl-Dickstein et Bengio (2016, <em>Density estimation using Real NVP</em>, éq. 2 et 3) :
        </p>
        <Tex block>{"p_X(x) = p_Z\\big(f(x)\\big)\\,\\left|\\det \\frac{\\partial f(x)}{\\partial x^\\top}\\right|"}</Tex>
        <Tex block>{"\\log p_X(x) = \\log p_Z\\big(f(x)\\big) + \\log \\left|\\det \\frac{\\partial f(x)}{\\partial x^\\top}\\right|"}</Tex>
        <p>
          Sans le déterminant, ce n'est même plus une densité. Avec <Tex>f</Tex> linéaire, <Tex>{"f(x) = Lx"}</Tex>{" "}
          et <Tex>{"\\det L = 6"}</Tex>, on peut le vérifier en sommant sur une grille :
        </p>
        <pre>
          <code>{`import numpy as np

L = np.array([[2.0, 0.0], [1.0, 3.0]])  # triangulaire : det = 6

def p_z(z):  # densité gaussienne standard en 2D
    return np.exp(-0.5 * (z**2).sum(axis=-1)) / (2 * np.pi)

g = np.linspace(-4, 4, 801)
h = g[1] - g[0]
X = np.stack(np.meshgrid(g, g), axis=-1)  # grille de points x
Z = X @ L.T  # z = f(x) = Lx en chaque point
# sans le déterminant :
print(p_z(Z).sum() * h * h)  # 0.16666666666665939
# avec |det L| = 6 :
print((p_z(Z) * 6).sum() * h * h)  # 0.999999999999956`}</code>
        </pre>
        <p>
          En dimension <Tex>n</Tex> (des milliers pour une image), un déterminant quelconque coûterait de l'ordre de{" "}
          <Tex>{"n^3"}</Tex> opérations à chaque exemple. L'idée de Real NVP est de ne construire <Tex>f</Tex> qu'avec
          des couches dont la jacobienne est <strong>triangulaire</strong> : les auteurs partent de « la simple
          observation que le déterminant d'une matrice triangulaire se calcule efficacement comme le produit de ses
          termes diagonaux ». Leur diagonale vaut <Tex>{"\\exp(s_j)"}</Tex>, et le déterminant{" "}
          <Tex>{"\\exp\\big(\\sum_j s_j\\big)"}</Tex> : le log-déterminant n'est plus qu'une somme.
        </p>
      </section>
    </LessonFlow>
  );
}
