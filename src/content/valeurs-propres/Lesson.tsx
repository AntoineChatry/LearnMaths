import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { EigenViz } from "./EigenViz";

export function ValeursPropresLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Les directions qui ne tournent pas</h2>
        <p>
          Une matrice fait en général tourner les vecteurs. Mais certaines directions sont seulement étirées (ou
          retournées) : <Tex>Ax</Tex> reste sur la même droite que <Tex>x</Tex>. Fais tourner <Tex>x</Tex> et
          cherche-les, pour chaque matrice :
        </p>
        <EigenViz />
        <p>
          Un vecteur <Tex>{"x \\neq 0"}</Tex> tel que
        </p>
        <Tex block>{"Ax = \\lambda x"}</Tex>
        <p>
          est un <strong>vecteur propre</strong> de <Tex>A</Tex>, et le nombre <Tex>{"\\lambda"}</Tex> est la{" "}
          <strong>valeur propre</strong> associée. Pour la matrice symétrique <Tex>{"\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}"}</Tex>,
          tu as dû trouver la diagonale : <Tex>{"A(1, 1) = (3, 3)"}</Tex>, donc <Tex>{"\\lambda = 3"}</Tex>, et
          l'antidiagonale : <Tex>{"A(1, -1) = (1, -1)"}</Tex>, donc <Tex>{"\\lambda = 1"}</Tex>. Tout multiple non nul
          d'un vecteur propre en est encore un : c'est la <em>direction</em> qui compte.
        </p>
        <p>
          Le cisaillement n'a qu'une direction propre, l'axe horizontal. La rotation d'un quart de tour n'en a
          aucune : elle fait tourner tous les vecteurs.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Trouver les valeurs propres</h2>
        <p>
          <Tex>{"Ax = \\lambda x"}</Tex> s'écrit <Tex>{"(A - \\lambda I)x = 0"}</Tex>. On veut une solution{" "}
          <Tex>{"x \\neq 0"}</Tex>, donc un noyau non réduit à 0, donc (chapitre 5) :
        </p>
        <Tex block>{"\\det(A - \\lambda I) = 0"}</Tex>
        <p>
          C'est une équation en <Tex>{"\\lambda"}</Tex> seul : le <strong>polynôme caractéristique</strong>. En{" "}
          <Tex>{"2 \\times 2"}</Tex> :
        </p>
        <Tex block>{"\\det \\begin{pmatrix} a - \\lambda & b \\\\ c & d - \\lambda \\end{pmatrix} = \\lambda^2 - (a + d)\\,\\lambda + (ad - bc)"}</Tex>
        <p>
          Pour <Tex>{"\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix}"}</Tex> : <Tex>{"\\lambda^2 - 4\\lambda + 3 = (\\lambda - 1)(\\lambda - 3)"}</Tex>.
          Puis, pour chaque valeur propre, les vecteurs propres forment le noyau de <Tex>{"A - \\lambda I"}</Tex> :
          avec <Tex>{"\\lambda = 3"}</Tex>, <Tex>{"A - 3I = \\begin{pmatrix} -1 & 1 \\\\ 1 & -1 \\end{pmatrix}"}</Tex>{" "}
          a pour noyau la droite de <Tex>{"(1, 1)"}</Tex>.
        </p>
        <p>
          Le coefficient <Tex>{"a + d"}</Tex> est la <strong>trace</strong> (somme de la diagonale), et le terme
          constant le déterminant. Comme <Tex>{"\\lambda^2 - (\\lambda_1 + \\lambda_2)\\lambda + \\lambda_1\\lambda_2"}</Tex>{" "}
          a pour racines <Tex>{"\\lambda_1"}</Tex> et <Tex>{"\\lambda_2"}</Tex>, on lit :
        </p>
        <Tex block>{"\\lambda_1 + \\lambda_2 = \\text{tr}(A) \\qquad \\lambda_1 \\lambda_2 = \\det(A)"}</Tex>
        <p>
          C'est vrai en toute dimension (théorèmes 4.16 et 4.17 de MML) : le déterminant est le produit des valeurs
          propres, la trace leur somme. Deux cas particuliers utiles. Pour une matrice triangulaire, les valeurs
          propres sont les coefficients diagonaux, puisque <Tex>{"A - \\lambda I"}</Tex> est encore triangulaire.
          Et la rotation d'un quart de tour donne <Tex>{"\\lambda^2 + 1 = 0"}</Tex> : pas de valeur propre réelle
          (il y en a deux complexes, <Tex>{"\\pm i"}</Tex>).
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Diagonaliser</h2>
        <p>
          Quand <Tex>A</Tex> (de taille <Tex>{"n \\times n"}</Tex>) a <Tex>n</Tex> vecteurs propres indépendants{" "}
          <Tex>{"v_1, \\dots, v_n"}</Tex>, ils forment une base. Dans cette base, <Tex>A</Tex> est très simple : elle
          multiplie la <Tex>i</Tex>-ème coordonnée par <Tex>{"\\lambda_i"}</Tex>. Avec <Tex>P</Tex> la matrice des
          vecteurs propres en colonnes et <Tex>D</Tex> la matrice diagonale des valeurs propres, les{" "}
          <Tex>n</Tex> égalités <Tex>{"Av_i = \\lambda_i v_i"}</Tex> s'écrivent <Tex>{"AP = PD"}</Tex>, soit
        </p>
        <Tex block>{"A = P D P^{-1}"}</Tex>
        <p>
          Lu de droite à gauche : <Tex>{"P^{-1}"}</Tex> passe aux coordonnées dans la base propre,{" "}
          <Tex>D</Tex> étire chaque axe, <Tex>P</Tex> revient aux coordonnées de départ. Pour notre exemple :
        </p>
        <Tex block>{"\\begin{pmatrix} 2 & 1 \\\\ 1 & 2 \\end{pmatrix} = \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix} \\begin{pmatrix} 3 & 0 \\\\ 0 & 1 \\end{pmatrix} \\begin{pmatrix} 1 & 1 \\\\ 1 & -1 \\end{pmatrix}^{-1}"}</Tex>
        <p>
          C'est toujours possible quand les <Tex>n</Tex> valeurs propres sont distinctes (théorème 4.12 de MML : des
          vecteurs propres de valeurs propres distinctes sont indépendants). Sinon, ça peut échouer : le
          cisaillement a <Tex>{"\\lambda = 1"}</Tex> double, mais <Tex>{"A - I = \\begin{pmatrix} 0 & 1 \\\\ 0 & 0 \\end{pmatrix}"}</Tex>{" "}
          a un noyau de dimension 1 seulement. Une telle matrice n'est pas diagonalisable.
        </p>
        <p>
          Le gain : les puissances. <Tex>{"A^2 = PDP^{-1}PDP^{-1} = PD^2P^{-1}"}</Tex>, et de même
        </p>
        <Tex block>{"A^k = P D^k P^{-1}, \\qquad D^k = \\text{diag}(\\lambda_1^k, \\dots, \\lambda_n^k)"}</Tex>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Itérer une matrice</h2>
        <p>
          Appliquons <Tex>A</Tex> encore et encore à un vecteur. On écrit le départ dans la base propre,{" "}
          <Tex>{"x_0 = c_1 v_1 + \\dots + c_n v_n"}</Tex>, et chaque application multiplie chaque composante par sa
          valeur propre :
        </p>
        <Tex block>{"A^k x_0 = c_1 \\lambda_1^k\\, v_1 + c_2 \\lambda_2^k\\, v_2 + \\dots + c_n \\lambda_n^k\\, v_n"}</Tex>
        <p>
          Si <Tex>{"|\\lambda_1|"}</Tex> est strictement la plus grande (et <Tex>{"c_1 \\neq 0"}</Tex>), son terme
          écrase les autres : la direction de <Tex>{"A^k x_0"}</Tex> tend vers <Tex>{"v_1"}</Tex>. Les composantes
          de valeur propre <Tex>{"|\\lambda| < 1"}</Tex> s'éteignent, celles de <Tex>{"|\\lambda| > 1"}</Tex>{" "}
          explosent.
        </p>
        <p>
          <strong>Fibonacci.</strong> <Tex>{"(F_{k+1}, F_k) = M (F_k, F_{k-1})"}</Tex> avec{" "}
          <Tex>{"M = \\begin{pmatrix} 1 & 1 \\\\ 1 & 0 \\end{pmatrix}"}</Tex>. Son polynôme caractéristique{" "}
          <Tex>{"\\lambda^2 - \\lambda - 1"}</Tex> a pour racines <Tex>{"\\varphi = \\frac{1 + \\sqrt 5}{2} \\approx 1{,}618"}</Tex>{" "}
          et <Tex>{"\\frac{1 - \\sqrt 5}{2} \\approx -0{,}618"}</Tex>. La seconde s'éteint, donc{" "}
          <Tex>{"F_{k+1} / F_k \\to \\varphi"}</Tex> : le nombre d'or.
        </p>
        <p>
          <strong>PageRank.</strong> L'idée de départ de PageRank (MML, exemple 4.9) : l'importance d'une page vient
          de l'importance des pages qui pointent vers elle. Un internaute clique au hasard sur un lien de la page
          où il est. On range dans la colonne <Tex>j</Tex> de <Tex>A</Tex> les probabilités de passer de la page{" "}
          <Tex>j</Tex> aux autres. La répartition des internautes après un clic est <Tex>{"Ax"}</Tex>, et la
          répartition stable vérifie <Tex>{"Ax = x"}</Tex> : c'est un vecteur propre de valeur propre 1. On le trouve
          en itérant, c'est la <strong>méthode de la puissance</strong>. Ici, avec quatre pages (on laisse de côté
          les raffinements de la version réelle) :
        </p>
        <pre>
          <code>{`import numpy as np

# liens : 1 -> 2, 3 ; 2 -> 3, 4 ; 3 -> 1 ; 4 -> 1, 3
A = np.array([
    [0,   0,   1, 1/2],
    [1/2, 0,   0, 0  ],
    [1/2, 1/2, 0, 1/2],
    [0,   1/2, 0, 0  ],
])
x = np.ones(4) / 4  # départ : internautes répartis uniformément
for _ in range(100):
    x = A @ x
print(np.round(x, 4))  # [0.381  0.1905 0.3333 0.0952]

vals, vecs = np.linalg.eig(A)
print(np.round(vals, 4))
# [ 1.  +0.j    -0.5 +0.j    -0.25+0.433j -0.25-0.433j]`}</code>
        </pre>
        <p>
          La limite est <Tex>{"\\tfrac{1}{21}(8, 4, 7, 2)"}</Tex> (vérifie que <Tex>{"Ax = x"}</Tex>) : la page 1
          est la plus importante. Les autres valeurs propres ont un module de 0,5 (certaines sont complexes, ce n'est
          pas grave) : l'écart à la limite est divisé par 2 environ à chaque itération.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Le zigzag de la descente de gradient</h2>
        <p>
          Au chapitre Gradient, le bol <Tex>{"x^2 + 5y^2"}</Tex> était aligné sur les axes, et la descente se
          calculait coordonnée par coordonnée. Un bol quelconque s'écrit{" "}
          <Tex>{"f(w) = \\tfrac{1}{2}\\, w^\\top A w"}</Tex> avec <Tex>A</Tex> symétrique (pour le bol du chapitre
          Gradient, <Tex>{"A = \\text{diag}(2, 10)"}</Tex>). Son gradient est <Tex>{"Aw"}</Tex>, et un pas de
          descente donne
        </p>
        <Tex block>{"w \\leftarrow w - \\eta A w = (I - \\eta A)\\, w"}</Tex>
        <p>
          Descendre, c'est itérer la matrice <Tex>{"I - \\eta A"}</Tex>. Ses vecteurs propres sont ceux de{" "}
          <Tex>A</Tex>, avec les valeurs propres <Tex>{"1 - \\eta \\lambda_i"}</Tex>. Dans la base propre de{" "}
          <Tex>A</Tex> (les axes du bol, même s'il est incliné ; le chapitre suivant montre qu'une matrice symétrique
          en a toujours une), chaque composante est multipliée par{" "}
          <Tex>{"1 - \\eta\\lambda_i"}</Tex> à chaque pas. On retrouve tout le chapitre Gradient, pour n'importe quel
          bol :
        </p>
        <ul>
          <li>
            la descente converge si et seulement si <Tex>{"|1 - \\eta\\lambda_i| < 1"}</Tex> pour tout <Tex>i</Tex>,
            soit <Tex>{"\\eta < 2 / \\lambda_{\\max}"}</Tex> (pour <Tex>{"\\text{diag}(2, 10)"}</Tex> :{" "}
            <Tex>{"\\eta < 0{,}2"}</Tex>, comme au chapitre Gradient) ;
          </li>
          <li>
            dans la direction de <Tex>{"\\lambda_{\\max}"}</Tex>, le facteur devient négatif dès que{" "}
            <Tex>{"\\eta > 1/\\lambda_{\\max}"}</Tex> : c'est le zigzag ;
          </li>
          <li>
            dans la direction de <Tex>{"\\lambda_{\\min}"}</Tex>, le facteur <Tex>{"1 - \\eta\\lambda_{\\min}"}</Tex>{" "}
            reste proche de 1 : c'est la lenteur.
          </li>
        </ul>
        <p>
          Le meilleur pas, <Tex>{"\\eta = 2/(\\lambda_{\\max} + \\lambda_{\\min})"}</Tex>, équilibre les deux
          extrêmes, et chaque pas réduit l'erreur d'un facteur{" "}
          <Tex>{"\\frac{\\kappa - 1}{\\kappa + 1}"}</Tex>, où <Tex>{"\\kappa = \\lambda_{\\max} / \\lambda_{\\min}"}</Tex>.
          Plus le bol est allongé, plus <Tex>{"\\kappa"}</Tex> est grand et plus la descente est lente :
        </p>
        <pre>
          <code>{`import numpy as np

c, s = np.cos(np.pi / 4), np.sin(np.pi / 4)
Q = np.array([[c, -s], [s, c]])  # rotation de 45° : bol incliné

def steps(lmin, tol=1e-6):
    A = Q @ np.diag([1.0, lmin]) @ Q.T  # valeurs propres 1 et lmin
    eta = 2 / (1.0 + lmin)  # le meilleur pas
    w = np.array([1.0, 0.0])
    k = 0
    while np.linalg.norm(w) > tol:
        w = w - eta * (A @ w)
        k += 1
    return k

for lmin in [0.5, 0.1, 0.01]:  # kappa = 2, 10, 100
    print(lmin, steps(lmin))
# 0.5 13
# 0.1 69
# 0.01 691`}</code>
        </pre>
        <p>
          <strong>Réseaux récurrents.</strong> Un RNN applique la même matrice de poids <Tex>W</Tex> à chaque pas de
          temps, et la rétropropagation multiplie le gradient par <Tex>{"W^\\top"}</Tex> autant de fois. Pascanu,
          Mikolov et Bengio (2013, <em>On the difficulty of training recurrent neural networks</em>) montrent que,
          dans le cas linéaire, il suffit que la plus grande valeur propre de <Tex>W</Tex> (en module) soit
          inférieure à 1 pour que les contributions lointaines du gradient s'évanouissent, et qu'il faut qu'elle
          dépasse 1 pour qu'il explose. C'est le calcul de la section 4 : sur 50 pas,{" "}
          <Tex>{"0{,}9^{50} \\approx 0{,}005"}</Tex> et <Tex>{"1{,}1^{50} \\approx 117"}</Tex>.
        </p>
      </section>
    </LessonFlow>
  );
}
