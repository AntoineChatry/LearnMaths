import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { QuadViz } from "./QuadViz";

export function SymetriquesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Le théorème spectral</h2>
        <p>
          Une matrice est <strong>symétrique</strong> quand <Tex>{"A^\\top = A"}</Tex> : le coefficient{" "}
          <Tex>{"a_{ij}"}</Tex> est égal à <Tex>{"a_{ji}"}</Tex>. Ces matrices sont partout en apprentissage
          automatique : <Tex>{"X^\\top X"}</Tex> des moindres carrés, matrices de covariance, hessiennes. Et elles se
          comportent remarquablement bien. Le chapitre 7 a montré qu'une matrice quelconque peut n'avoir aucune
          valeur propre réelle (la rotation), ou pas assez de vecteurs propres (le cisaillement). Pas une matrice
          symétrique :
        </p>
        <p>
          <strong>Théorème spectral</strong> (théorème 4.15 de MML). Si <Tex>A</Tex> est symétrique, ses valeurs
          propres sont réelles, et il existe une base orthonormée de vecteurs propres. Avec <Tex>Q</Tex> la matrice
          orthogonale de ces vecteurs propres en colonnes et <Tex>{"\\Lambda"}</Tex> la matrice diagonale des valeurs
          propres :
        </p>
        <Tex block>{"A = Q \\Lambda Q^\\top"}</Tex>
        <p>
          C'est <Tex>{"A = PDP^{-1}"}</Tex> du chapitre 7, avec en prime <Tex>{"P^{-1} = Q^\\top"}</Tex>, puisque{" "}
          <Tex>Q</Tex> est orthogonale (chapitre 6). Pourquoi les vecteurs propres sont-ils orthogonaux ? Prenons{" "}
          <Tex>{"Av_1 = \\lambda_1 v_1"}</Tex> et <Tex>{"Av_2 = \\lambda_2 v_2"}</Tex> avec{" "}
          <Tex>{"\\lambda_1 \\neq \\lambda_2"}</Tex>, et calculons <Tex>{"v_1^\\top A v_2"}</Tex> de deux façons :
        </p>
        <Tex block>{"\\lambda_1\\, v_1^\\top v_2 = (Av_1)^\\top v_2 = v_1^\\top A^\\top v_2 = v_1^\\top A v_2 = \\lambda_2\\, v_1^\\top v_2"}</Tex>
        <p>
          Donc <Tex>{"(\\lambda_1 - \\lambda_2)\\, v_1^\\top v_2 = 0"}</Tex>, et <Tex>{"v_1^\\top v_2 = 0"}</Tex>.
          C'est la symétrie <Tex>{"A^\\top = A"}</Tex> qui a servi. Quand une valeur propre est répétée, ses vecteurs
          propres forment un plan (ou plus) où l'on choisit une base orthonormée avec Gram-Schmidt. C'est l'exemple
          4.8 de MML :
        </p>
        <pre>
          <code>{`import numpy as np

A = np.array([[3, 2, 2], [2, 3, 2], [2, 2, 3]])
vals, Q = np.linalg.eigh(A)  # eigh : pour les matrices symétriques
print(vals)  # [1. 1. 7.] : la valeur propre 1 est double
print(np.allclose(Q.T @ Q, np.eye(3)))  # True : Q est orthogonale
print(np.allclose(Q @ np.diag(vals) @ Q.T, A))  # True
print(np.round(Q, 3))
# [[-0.816  0.    -0.577]
#  [ 0.408 -0.707 -0.577]
#  [ 0.408  0.707 -0.577]]`}</code>
        </pre>
        <p>
          La dernière colonne est la direction de <Tex>{"(1, 1, 1)"}</Tex>, de valeur propre 7. Les deux premières
          sont une base orthonormée du plan des vecteurs propres de valeur propre 1, qui est l'orthogonal de{" "}
          <Tex>{"(1, 1, 1)"}</Tex>. Pour une matrice symétrique, on utilise <code>eigh</code> plutôt que{" "}
          <code>eig</code> : elle profite de la symétrie et renvoie des valeurs propres réelles, triées par ordre
          croissant, et des vecteurs propres orthonormés.
        </p>
        <p>
          En développant le produit <Tex>{"Q \\Lambda Q^\\top"}</Tex> colonne par colonne, on obtient une autre
          lecture, très utile :
        </p>
        <Tex block>{"A = \\lambda_1 q_1 q_1^\\top + \\lambda_2 q_2 q_2^\\top + \\dots + \\lambda_n q_n q_n^\\top"}</Tex>
        <p>
          Chaque <Tex>{"q_i q_i^\\top"}</Tex> est la projection sur la droite de <Tex>{"q_i"}</Tex> (chapitre 6) :
          une matrice symétrique est une somme de projections orthogonales, pondérées par les valeurs propres. Pour{" "}
          <Tex>{"\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}"}</Tex> :
        </p>
        <Tex block>{"\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix} = 3 \\cdot \\tfrac{1}{2}\\begin{pmatrix} 1 & 1 \\\\ 1 & 1 \\end{pmatrix} + 1 \\cdot \\tfrac{1}{2}\\begin{pmatrix} 1 & -1 \\\\ -1 & 1 \\end{pmatrix}"}</Tex>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Formes quadratiques</h2>
        <p>
          Une matrice symétrique définit une fonction de <Tex>x</Tex> à valeurs réelles, la{" "}
          <strong>forme quadratique</strong> <Tex>{"x^\\top A x"}</Tex>. En dimension 2 :
        </p>
        <Tex block>{"\\begin{pmatrix} x & y \\end{pmatrix} \\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix} \\begin{pmatrix} x \\\\ y \\end{pmatrix} = a x^2 + 2b\\, xy + c y^2"}</Tex>
        <p>
          Dans l'autre sens, tout polynôme dont tous les termes sont de degré 2 s'écrit ainsi : on partage le terme
          croisé en deux moitiés égales. Par exemple <Tex>{"x^2 + 6xy - 2y^2"}</Tex> correspond à{" "}
          <Tex>{"\\begin{pmatrix} 1 & 3 \\\\ 3 & -2 \\end{pmatrix}"}</Tex>.
        </p>
        <p>
          Le théorème spectral simplifie tout. Dans la base propre, avec <Tex>{"x = Qy"}</Tex> :{" "}
          <Tex>{"x^\\top A x = y^\\top Q^\\top A Q\\, y = y^\\top \\Lambda\\, y"}</Tex>, donc
        </p>
        <Tex block>{"x^\\top A x = \\lambda_1 y_1^2 + \\lambda_2 y_2^2 + \\dots + \\lambda_n y_n^2"}</Tex>
        <p>
          Plus de terme croisé : dans les axes propres, la forme est une somme de carrés pondérés par les valeurs
          propres. Ce sont les signes des <Tex>{"\\lambda_i"}</Tex> qui décident de sa forme. Règle{" "}
          <Tex>a</Tex>, <Tex>b</Tex>, <Tex>c</Tex> et regarde les courbes de niveau :
        </p>
        <QuadViz />
        <p>
          Deux valeurs propres positives donnent des ellipses, dont les axes sont les vecteurs propres : c'est un
          bol. Des signes opposés donnent des hyperboles : une selle. Une valeur propre nulle donne des droites
          parallèles : une gouttière. Pour passer du bol à la selle, augmente <Tex>b</Tex> depuis{" "}
          <Tex>{"a = c = 1"}</Tex> : à <Tex>{"b = 1"}</Tex>, le bol s'aplatit en gouttière, puis se retourne en
          selle.
        </p>
        <p>
          Autre conséquence, pour les vecteurs unitaires : <Tex>{"\\|x\\| = \\|y\\| = 1"}</Tex>, donc{" "}
          <Tex>{"x^\\top A x"}</Tex> est une moyenne des <Tex>{"\\lambda_i"}</Tex> pondérée par les{" "}
          <Tex>{"y_i^2"}</Tex>, dont la somme vaut 1. D'où :
        </p>
        <Tex block>{"\\lambda_{\\min} \\le x^\\top A x \\le \\lambda_{\\max} \\quad \\text{pour } \\|x\\| = 1"}</Tex>
        <p>
          Les bornes sont atteintes sur les vecteurs propres correspondants. Le maximum de{" "}
          <Tex>{"x^\\top A x"}</Tex> sur les vecteurs unitaires est la plus grande valeur propre, atteinte dans sa
          direction propre : c'est le problème que résout la PCA (chapitre suivant).
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Définie positive</h2>
        <p>
          Une matrice symétrique <Tex>A</Tex> est <strong>définie positive</strong> si{" "}
          <Tex>{"x^\\top A x > 0"}</Tex> pour tout <Tex>{"x \\neq 0"}</Tex>, et{" "}
          <strong>semi-définie positive</strong> si <Tex>{"x^\\top A x \\ge 0"}</Tex> (définition 3.4 de MML). Par la
          somme de carrés de la section 2 :
        </p>
        <Tex block>{"A \\text{ définie positive} \\iff \\text{toutes ses valeurs propres sont } > 0"}</Tex>
        <p>
          (et <Tex>{"\\ge 0"}</Tex> pour semi-définie). Exemple 3.4 de MML : pour{" "}
          <Tex>{"A_1 = \\begin{pmatrix} 9 & 6 \\\\ 6 & 5 \\end{pmatrix}"}</Tex>, on complète le carré,{" "}
          <Tex>{"9x^2 + 12xy + 5y^2 = (3x + 2y)^2 + y^2"}</Tex>, qui est strictement positif sauf en{" "}
          <Tex>{"(0, 0)"}</Tex>. Pour <Tex>{"A_2 = \\begin{pmatrix} 9 & 6 \\\\ 6 & 3 \\end{pmatrix}"}</Tex>,{" "}
          <Tex>{"(3x + 2y)^2 - y^2"}</Tex> devient négatif, par exemple en <Tex>{"(2, -3)"}</Tex> :{" "}
          <Tex>{"36 - 72 + 27 = -9"}</Tex>.
        </p>
        <p>
          <strong>Le test en 2 × 2.</strong> Le déterminant est le produit des valeurs propres. S'il est positif,
          elles sont de même signe, et <Tex>{"a = e_1^\\top A e_1"}</Tex> donne ce signe. Donc
        </p>
        <Tex block>{"\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix} \\text{ définie positive} \\iff a > 0 \\text{ et } ac - b^2 > 0"}</Tex>
        <p>
          Pour <Tex>{"A_1"}</Tex> : <Tex>{"9 > 0"}</Tex> et <Tex>{"45 - 36 = 9 > 0"}</Tex>. Pour{" "}
          <Tex>{"A_2"}</Tex> : <Tex>{"27 - 36 < 0"}</Tex>, une selle.
        </p>
        <p>
          <strong>Toujours semi-définie : <Tex>{"X^\\top X"}</Tex>.</strong> Pour toute matrice <Tex>X</Tex>{" "}
          (théorème 4.14 de MML), <Tex>{"X^\\top X"}</Tex> est symétrique et
        </p>
        <Tex block>{"v^\\top X^\\top X v = (Xv)^\\top (Xv) = \\|Xv\\|^2 \\ge 0"}</Tex>
        <p>
          Elle est définie positive exactement quand <Tex>{"Xv \\neq 0"}</Tex> pour tout <Tex>{"v \\neq 0"}</Tex>,
          c'est-à-dire quand les colonnes de <Tex>X</Tex> sont indépendantes. C'est la condition qui rendait les
          équations normales du chapitre 6 inversibles. Même raisonnement pour une matrice de covariance{" "}
          <Tex>{"\\Sigma"}</Tex> : <Tex>{"v^\\top \\Sigma v"}</Tex> est la variance de <Tex>{"v^\\top x"}</Tex>, donc
          elle n'est jamais négative.
        </p>
        <p>
          <strong>Cholesky.</strong> Un nombre positif a une racine carrée. Une matrice définie positive aussi, en
          un sens : elle s'écrit
        </p>
        <Tex block>{"A = L L^\\top"}</Tex>
        <p>
          avec <Tex>L</Tex> triangulaire inférieure à diagonale positive, et ce <Tex>L</Tex> est unique (théorème
          4.18 de MML). En <Tex>{"2 \\times 2"}</Tex>, on identifie les coefficients de{" "}
          <Tex>{"LL^\\top"}</Tex> :
        </p>
        <Tex block>{"\\begin{pmatrix} l_{11} & 0 \\\\ l_{21} & l_{22} \\end{pmatrix} \\begin{pmatrix} l_{11} & l_{21} \\\\ 0 & l_{22} \\end{pmatrix} = \\begin{pmatrix} l_{11}^2 & l_{11} l_{21} \\\\ l_{11} l_{21} & l_{21}^2 + l_{22}^2 \\end{pmatrix}"}</Tex>
        <p>
          Pour <Tex>{"\\begin{pmatrix} 4 & 2 \\\\ 2 & 5 \\end{pmatrix}"}</Tex> : <Tex>{"l_{11} = 2"}</Tex>, puis{" "}
          <Tex>{"l_{21} = 2 / 2 = 1"}</Tex>, puis <Tex>{"l_{22} = \\sqrt{5 - 1} = 2"}</Tex>. L'algorithme demande à
          chaque étape la racine carrée d'un nombre qui doit être positif, et il échoue exactement quand la matrice
          n'est pas définie positive. En pratique, c'est le moyen le plus rapide de le tester.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>La hessienne décide de la forme du bol</h2>
        <p>
          Pour une fonction <Tex>{"f(x, y)"}</Tex>, les dérivées partielles secondes se rangent dans la{" "}
          <strong>hessienne</strong> :
        </p>
        <Tex block>{"H = \\begin{pmatrix} \\dfrac{\\partial^2 f}{\\partial x^2} & \\dfrac{\\partial^2 f}{\\partial x \\partial y} \\\\[2mm] \\dfrac{\\partial^2 f}{\\partial y \\partial x} & \\dfrac{\\partial^2 f}{\\partial y^2} \\end{pmatrix}"}</Tex>
        <p>
          Quand ces dérivées secondes sont continues, l'ordre de dérivation n'importe pas, et{" "}
          <Tex>H</Tex> est symétrique (MML, section 5.7). Le développement de Taylor à l'ordre 2 du chapitre
          Taylor s'étend à plusieurs variables (MML, section 5.8) : près d'un point <Tex>x</Tex>,
        </p>
        <Tex block>{"f(x + h) \\approx f(x) + \\nabla f(x)^\\top h + \\tfrac{1}{2}\\, h^\\top H h"}</Tex>
        <p>
          En un point critique, <Tex>{"\\nabla f = 0"}</Tex>, et il ne reste que la forme quadratique de la
          hessienne. Localement, <Tex>f</Tex> a la forme de <Tex>{"h^\\top H h"}</Tex> : c'est le test de la dérivée
          seconde en plusieurs dimensions (Goodfellow, Bengio et Courville, <em>Deep Learning</em>, section 4.3.1) :
        </p>
        <ul>
          <li>toutes les valeurs propres de <Tex>H</Tex> positives : minimum local (un bol) ;</li>
          <li>toutes négatives : maximum local ;</li>
          <li>au moins une positive et une négative : point selle ;</li>
          <li>
            une valeur propre nulle et les autres de même signe : le test ne conclut pas.
          </li>
        </ul>
        <p>
          Exemple : <Tex>{"f(x, y) = x^3 - 3x + y^2"}</Tex>. Le gradient <Tex>{"(3x^2 - 3,\\ 2y)"}</Tex> s'annule en{" "}
          <Tex>{"(1, 0)"}</Tex> et <Tex>{"(-1, 0)"}</Tex>, et <Tex>{"H = \\begin{pmatrix} 6x & 0 \\\\ 0 & 2 \\end{pmatrix}"}</Tex> :
        </p>
        <pre>
          <code>{`import numpy as np

def hessian(x, y):
    return np.array([[6 * x, 0], [0, 2]])

for x in [1, -1]:
    print(x, np.linalg.eigvalsh(hessian(x, 0)))
# 1 [2. 6.]    -> minimum local
# -1 [-6.  2.] -> point selle`}</code>
        </pre>
        <p>
          La hessienne dit aussi la courbure dans chaque direction. Pour un vecteur unitaire <Tex>d</Tex>, la
          dérivée seconde de <Tex>f</Tex> dans la direction <Tex>d</Tex> est <Tex>{"d^\\top H d"}</Tex>, comprise
          entre <Tex>{"\\lambda_{\\min}"}</Tex> et <Tex>{"\\lambda_{\\max}"}</Tex> (section 2). Le rapport{" "}
          <Tex>{"\\kappa = \\lambda_{\\max} / \\lambda_{\\min}"}</Tex> mesure à quel point le bol est allongé : c'est
          lui qui ralentissait la descente de gradient au chapitre 7.
        </p>
        <p>
          <strong>Convexité.</strong> Une fonction deux fois dérivable est convexe si et seulement si sa hessienne
          est semi-définie positive partout (MML, section 7.3, qui renvoie à Boyd et Vandenberghe, 2004). Et pour
          une fonction convexe, tout minimum local est global (MML, section 7.1). Les moindres carrés sont dans ce
          cas : la hessienne de <Tex>{"\\|Xw - y\\|^2"}</Tex> est <Tex>{"2X^\\top X"}</Tex>, semi-définie positive
          (section 3). La perte d'un réseau de neurones, elle, n'est pas convexe. Goodfellow et al. (section 4.3) notent qu'en apprentissage profond, on optimise des fonctions
          qui peuvent avoir beaucoup de minima locaux non optimaux et beaucoup de points selles entourés de
          régions très plates.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Covariance et gaussiennes</h2>
        <p>
          Une gaussienne en dimension <Tex>n</Tex> a une moyenne <Tex>{"\\mu"}</Tex> et une matrice de covariance{" "}
          <Tex>{"\\Sigma"}</Tex>, symétrique et semi-définie positive (section 3). Pour avoir une densité, il faut{" "}
          <Tex>{"\\Sigma"}</Tex> <strong>définie positive</strong>, donc inversible : si une valeur propre est nulle,
          la loi est écrasée sur un sous-espace et n'a pas de densité. Cette densité fait intervenir la
          forme quadratique <Tex>{"(x - \\mu)^\\top \\Sigma^{-1} (x - \\mu)"}</Tex> : ses courbes de niveau sont les
          ellipses de la section 2, avec les vecteurs propres de <Tex>{"\\Sigma"}</Tex> comme axes. Le module
          Probabilités y reviendra.
        </p>
        <p>
          Pour tirer des échantillons, on part de <Tex>z</Tex> gaussien standard (covariance <Tex>I</Tex>). Si{" "}
          <Tex>{"\\Sigma = L L^\\top"}</Tex>, alors <Tex>{"x = \\mu + L z"}</Tex> a pour covariance{" "}
          <Tex>{"L I L^\\top = \\Sigma"}</Tex>. MML (section 6.5.4) recommande pour <Tex>L</Tex> le facteur de
          Cholesky, parce qu'il est triangulaire, donc rapide à appliquer :
        </p>
        <pre>
          <code>{`import numpy as np

Sigma = np.array([[4.0, 2.0], [2.0, 5.0]])
L = np.linalg.cholesky(Sigma)
print(L)
# [[2. 0.]
#  [1. 2.]]

rng = np.random.default_rng(0)
z = rng.standard_normal((2, 100_000))  # covariance I
x = L @ z
print(np.round(np.cov(x), 2))  # proche de Sigma
# [[4.   2.01]
#  [2.01 5.03]]

A2 = np.array([[9.0, 6.0], [6.0, 3.0]])  # pas définie positive
np.linalg.cholesky(A2)
# LinAlgError: Matrix is not positive definite`}</code>
        </pre>
        <p>
          C'est le geste de l'<em>astuce de reparamétrisation</em> des autoencodeurs variationnels (Kingma et
          Welling, 2014, section 2.4) : écrire l'échantillon comme une fonction dérivable des paramètres et d'un
          bruit indépendant, pour pouvoir dériver par rapport aux paramètres. Leur exemple est la gaussienne en
          dimension 1, <Tex>{"z = \\mu + \\sigma \\epsilon"}</Tex> ; <Tex>{"x = \\mu + Lz"}</Tex> en est la version
          matricielle.
        </p>
      </section>
    </LessonFlow>
  );
}
