import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { PolarViz } from "./PolarViz";

export function JacobienneLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Des fonctions qui rendent un vecteur</h2>
        <p>
          Au chapitre Gradient, les fonctions prenaient un vecteur et rendaient un nombre, une perte. Mais une couche
          de réseau prend un vecteur et rend un <em>vecteur</em> : <Tex>{"x \\mapsto Wx + b"}</Tex>, puis une
          activation sur chaque composante. Une fonction <Tex>{"f : \\mathbb R^n \\to \\mathbb R^m"}</Tex> se voit
          comme <Tex>m</Tex> fonctions à valeurs réelles empilées, <Tex>{"f = (f_1, \\dots, f_m)"}</Tex>, et chacune se
          dérive comme au chapitre Gradient (MML, section 5.3, équation 5.54).
        </p>
        <p>
          On range toutes les dérivées partielles dans une matrice, la <strong>jacobienne</strong> (MML, définition
          5.6) : une ligne par sortie, une colonne par entrée.
        </p>
        <Tex block>{"J = \\frac{\\partial f}{\\partial x} = \\begin{pmatrix} \\frac{\\partial f_1}{\\partial x_1} & \\cdots & \\frac{\\partial f_1}{\\partial x_n} \\\\ \\vdots & & \\vdots \\\\ \\frac{\\partial f_m}{\\partial x_1} & \\cdots & \\frac{\\partial f_m}{\\partial x_n} \\end{pmatrix} \\in \\mathbb R^{m \\times n} \\qquad J_{ij} = \\frac{\\partial f_i}{\\partial x_j}"}</Tex>
        <p>
          Exemple, de <Tex>{"\\mathbb R^2"}</Tex> dans <Tex>{"\\mathbb R^3"}</Tex> :
        </p>
        <Tex block>{"f(x_1, x_2) = \\begin{pmatrix} x_1^2 x_2 \\\\ x_1 + 3x_2 \\\\ x_2^2 \\end{pmatrix} \\qquad J(x) = \\begin{pmatrix} 2x_1x_2 & x_1^2 \\\\ 1 & 3 \\\\ 0 & 2x_2 \\end{pmatrix}"}</Tex>
        <Tex block>{"J(1, 2) = \\begin{pmatrix} 4 & 1 \\\\ 1 & 3 \\\\ 0 & 4 \\end{pmatrix}"}</Tex>
        <p>
          La ligne <Tex>i</Tex> est le gradient de <Tex>{"f_i"}</Tex>, écrit en ligne. La colonne <Tex>j</Tex> dit
          comment bougent toutes les sorties quand on pousse l'entrée <Tex>{"x_j"}</Tex>. Les cas déjà vus sont des
          cas particuliers (MML, figure 5.6) :
        </p>
        <ul>
          <li>
            <Tex>{"f : \\mathbb R \\to \\mathbb R"}</Tex> : une matrice <Tex>{"1 \\times 1"}</Tex>, la dérivée{" "}
            <Tex>{"f'(x)"}</Tex> ;
          </li>
          <li>
            <Tex>{"f : \\mathbb R^n \\to \\mathbb R"}</Tex> : une ligne <Tex>{"1 \\times n"}</Tex>, le gradient ;
          </li>
          <li>
            <Tex>{"f : \\mathbb R \\to \\mathbb R^m"}</Tex> : une colonne <Tex>{"m \\times 1"}</Tex>, la vitesse d'un
            point qui se déplace.
          </li>
        </ul>
        <p>
          Attention à la convention. MML écrit le gradient d'une fonction à valeurs réelles comme une{" "}
          <strong>ligne</strong> (c'est le « numerator layout » de sa remarque en section 5.3), parce qu'alors la
          règle de la chaîne est un simple produit de matrices, sans transposée. Beaucoup de textes, et le chapitre
          Gradient, l'écrivent en colonne. C'est la même information, transposée.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La meilleure approximation linéaire</h2>
        <p>
          En une variable, <Tex>{"f(x_0 + h) \\approx f(x_0) + f'(x_0)\\,h"}</Tex> : la tangente. En plusieurs
          variables, le gradient donne la même approximation pour une fonction à valeurs réelles (MML, équation
          5.148). Appliquée à chaque composante, elle s'écrit d'un bloc avec la jacobienne :
        </p>
        <Tex block>{"f(x_0 + h) \\approx f(x_0) + J(x_0)\\,h"}</Tex>
        <p>
          Le produit <Tex>{"J(x_0)\\,h"}</Tex> transforme un petit déplacement de l'entrée en un petit déplacement de
          la sortie. Près de <Tex>{"x_0"}</Tex>, la fonction se comporte comme une application linéaire, et cette
          application a pour matrice la jacobienne. Sur l'exemple, avec <Tex>{"x_0 = (1, 2)"}</Tex> et{" "}
          <Tex>{"h = (0{,}01;\\ -0{,}02)"}</Tex> :
        </p>
        <pre>
          <code>{`import numpy as np

def f(x):
    x1, x2 = x
    return np.array([x1**2 * x2, x1 + 3 * x2, x2**2])

def J(x):
    x1, x2 = x
    return np.array([[2 * x1 * x2, x1**2],
                     [1.0, 3.0],
                     [0.0, 2 * x2]])

x0 = np.array([1.0, 2.0])
h = np.array([0.01, -0.02])
print(f(x0 + h))          # valeur exacte
print(f(x0) + J(x0) @ h)  # approximation linéaire
# [2.019798 6.95     3.9204  ]
# [2.02 6.95 3.92]`}</code>
        </pre>
        <p>
          La deuxième composante est exacte : <Tex>{"x_1 + 3x_2"}</Tex> est déjà linéaire. Les deux autres ont une
          erreur de l'ordre de <Tex>{"\\|h\\|^2"}</Tex>, comme à l'ordre 1 de Taylor.
        </p>
        <p>
          <strong>Une couche linéaire.</strong> Pour <Tex>{"f(x) = Wx + b"}</Tex> avec{" "}
          <Tex>{"W \\in \\mathbb R^{m \\times n}"}</Tex>, on a <Tex>{"f_i(x) = \\sum_j W_{ij} x_j + b_i"}</Tex>, donc{" "}
          <Tex>{"\\partial f_i / \\partial x_j = W_{ij}"}</Tex> : la jacobienne est <Tex>W</Tex> elle-même, en tout
          point (MML, exemple 5.9). Le biais disparaît, comme une constante en une variable. Une fonction linéaire est
          sa propre meilleure approximation linéaire.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Vérifier une jacobienne, comme on vérifie un gradient</p>
          <p>
            MML (remarque de la section 5.2.2) recommande de comparer toute dérivée codée à la main à des taux
            d'accroissement. Pour une jacobienne, chaque colonne <Tex>j</Tex> est un taux d'accroissement le long de{" "}
            <Tex>{"x_j"}</Tex> :
          </p>
          <pre>
            <code>{`import numpy as np

def jac_num(f, x, eps=1e-6):
    # colonne j : taux d'accroissement centré le long de x_j
    cols = []
    for j in range(len(x)):
        e = np.zeros(len(x))
        e[j] = eps
        cols.append((f(x + e) - f(x - e)) / (2 * eps))
    return np.stack(cols, axis=1)

rng = np.random.default_rng(0)
W = rng.standard_normal((4, 3))
b = rng.standard_normal(4)
x = rng.standard_normal(3)
Jn = jac_num(lambda x: W @ x + b, x)
print(Jn.shape, np.abs(Jn - W).max())
# (4, 3) 1.4178558327415658e-10`}</code>
          </pre>
          <p>
            La forme <Tex>{"4 \\times 3"}</Tex> le confirme : autant de lignes que de sorties, autant de colonnes que
            d'entrées.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Les jacobiennes d'un réseau de neurones</h2>
        <p>
          <strong>Une activation composante par composante.</strong> Si <Tex>{"a = \\sigma(z)"}</Tex> applique la même
          fonction <Tex>\sigma</Tex> à chaque composante, <Tex>{"a_i = \\sigma(z_i)"}</Tex> ne dépend que de{" "}
          <Tex>{"z_i"}</Tex>. Toutes les dérivées croisées sont nulles, et la jacobienne est <strong>diagonale</strong> :
        </p>
        <Tex block>{"\\frac{\\partial a}{\\partial z} = \\operatorname{diag}\\big(\\sigma'(z_1), \\dots, \\sigma'(z_n)\\big)"}</Tex>
        <p>
          Pour la sigmoïde, <Tex>{"\\sigma' = \\sigma(1 - \\sigma)"}</Tex> ; pour ReLU,{" "}
          <Tex>{"\\max(0, z)"}</Tex>, la dérivée vaut 1 si <Tex>{"z > 0"}</Tex> et 0 si <Tex>{"z < 0"}</Tex>. La
          jacobienne de ReLU est donc une matrice diagonale de 0 et de 1 : elle laisse passer les composantes actives
          et coupe les autres. En pratique on ne la construit jamais : multiplier par une matrice diagonale revient à
          multiplier composante par composante.
        </p>
        <p>
          <strong>Le softmax</strong> ne se comporte pas ainsi. Chaque probabilité{" "}
          <Tex>{"y_k = e^{z_k} / \\sum_j e^{z_j}"}</Tex> dépend de tous les logits à cause du dénominateur. Bishop
          (PRML, section 4.3.4, équation 4.106) donne ses dérivées :
        </p>
        <Tex block>{"\\frac{\\partial y_k}{\\partial z_j} = y_k\\,(\\delta_{kj} - y_j) \\qquad\\text{soit}\\qquad J = \\operatorname{diag}(y) - y\\,y^\\top"}</Tex>
        <p>
          où <Tex>{"\\delta_{kj}"}</Tex> vaut 1 si <Tex>{"k = j"}</Tex> et 0 sinon. Sur la diagonale,{" "}
          <Tex>{"y_k(1 - y_k)"}</Tex>, comme pour la sigmoïde ; hors diagonale, <Tex>{"-y_k y_j < 0"}</Tex> : monter un
          logit fait baisser les probabilités des autres classes. Et chaque colonne somme à 0, parce que{" "}
          <Tex>{"\\sum_k y_k = 1"}</Tex> quels que soient les logits : sa dérivée est nulle.
        </p>
        <pre>
          <code>{`import numpy as np

def jac_num(f, x, eps=1e-6):
    cols = []
    for j in range(len(x)):
        e = np.zeros(len(x))
        e[j] = eps
        cols.append((f(x + e) - f(x - e)) / (2 * eps))
    return np.stack(cols, axis=1)

def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

z = np.array([2.0, 1.0, 0.1])
y = softmax(z)
J = np.diag(y) - np.outer(y, y)
print(J.round(3))
print(np.abs(J - jac_num(softmax, z)).max())
print(J.sum(axis=0).round(12))
# [[ 0.225 -0.16  -0.065]
#  [-0.16   0.184 -0.024]
#  [-0.065 -0.024  0.089]]
# 7.943584678926641e-11
# [0. 0. 0.]`}</code>
        </pre>
        <p>
          Une couche complète, <Tex>{"x \\mapsto \\sigma(Wx + b)"}</Tex>, est la composée d'une couche linéaire et
          d'une activation. Sa jacobienne est le produit des deux jacobiennes, <Tex>{"\\operatorname{diag}(\\sigma'(z))\\,W"}</Tex> :
          c'est la règle de la chaîne, le sujet du chapitre suivant.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le déterminant de la jacobienne mesure les aires</h2>
        <p>
          Au chapitre Déterminant, une matrice <Tex>{"2 \\times 2"}</Tex> multiplie toutes les aires par{" "}
          <Tex>{"|\\det|"}</Tex>. MML (section 5.3, figure 5.5) prend les vecteurs <Tex>{"(-2, 1)"}</Tex> et{" "}
          <Tex>{"(1, 1)"}</Tex> : le carré unité devient un parallélogramme d'aire{" "}
          <Tex>{"|\\det J| = |-2 - 1| = 3"}</Tex>. Pour une fonction non linéaire, la jacobienne est la meilleure
          approximation linéaire près d'un point, donc <Tex>{"|\\det J(x)|"}</Tex> est le facteur par lequel{" "}
          <Tex>f</Tex> multiplie les <em>petites</em> aires autour de <Tex>x</Tex>.
        </p>
        <p>
          <strong>Les coordonnées polaires.</strong> <Tex>{"f(r, \\theta) = (r\\cos\\theta,\\ r\\sin\\theta)"}</Tex>{" "}
          envoie un rectangle du plan <Tex>{"(r, \\theta)"}</Tex> sur un morceau de couronne :
        </p>
        <Tex block>{"J = \\begin{pmatrix} \\cos\\theta & -r\\sin\\theta \\\\ \\sin\\theta & r\\cos\\theta \\end{pmatrix} \\qquad \\det J = r\\cos^2\\theta + r\\sin^2\\theta = r"}</Tex>
        <p>
          Un petit rectangle <Tex>{"dr \\times d\\theta"}</Tex> devient une surface d'aire environ{" "}
          <Tex>{"r\\,dr\\,d\\theta"}</Tex> : loin de l'origine, le même écart d'angle balaie un arc plus long.
        </p>
        <PolarViz />
        <p>
          <strong>Une application célèbre : le <Tex>{"\\sqrt{2\\pi}"}</Tex> de la loi normale.</strong> Pour intégrer{" "}
          <Tex>{"e^{-(x^2 + y^2)/2}"}</Tex> sur le plan, on passe en polaires, sans oublier le facteur{" "}
          <Tex>{"|\\det J| = r"}</Tex> :
        </p>
        <Tex block>{"\\iint e^{-(x^2+y^2)/2}\\,dx\\,dy = \\int_0^{2\\pi}\\!\\!\\int_0^{\\infty} e^{-r^2/2}\\,r\\,dr\\,d\\theta = 2\\pi \\Big[-e^{-r^2/2}\\Big]_0^{\\infty} = 2\\pi"}</Tex>
        <p>
          Le facteur <Tex>r</Tex> est exactement la dérivée de <Tex>{"r^2/2"}</Tex>, ce qui rend la primitive
          évidente. Comme l'intégrale double est le carré de <Tex>{"\\int e^{-x^2/2}\\,dx"}</Tex>, celle-ci vaut{" "}
          <Tex>{"\\sqrt{2\\pi}"}</Tex> : c'est la constante de la densité gaussienne. Sans le facteur <Tex>r</Tex>, le
          résultat est faux :
        </p>
        <pre>
          <code>{`import numpy as np

# Intégrale de exp(-(x² + y²)/2) sur le plan, par une somme sur une grille
g = np.linspace(-8, 8, 1601)
h = g[1] - g[0]
X, Y = np.meshgrid(g, g)
print((np.exp(-(X**2 + Y**2) / 2)).sum() * h * h)

# La même en coordonnées polaires, avec et sans le facteur r
r = np.linspace(0, 8, 4001)
dr = r[1] - r[0]
dtheta = 2 * np.pi  # rien ne dépend de theta
print((np.exp(-r**2 / 2) * r).sum() * dr * dtheta)
print((np.exp(-r**2 / 2)).sum() * dr * dtheta)
print(2 * np.pi)
# 6.283185307179304
# 6.283183212783986
# 7.881088158168381
# 6.283185307179586`}</code>
        </pre>
        <p>
          C'est la même idée que le changement de variable des densités (chapitre Variables continues, MML théorème
          6.16) et que les normalizing flows du chapitre Déterminant : quand une transformation étire l'espace, le
          déterminant de sa jacobienne corrige les aires, et donc les densités.
        </p>
      </section>
    </LessonFlow>
  );
}
