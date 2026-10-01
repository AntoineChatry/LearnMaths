import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { KktViz } from "./KktViz";

export function DualiteLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Contraintes d'inégalité : actives ou non</h2>
        <p>
          On passe aux contraintes d'inégalité, sous la forme standard de Boyd et Vandenberghe et de MML (section
          7.2) : minimiser <Tex>{"f(x)"}</Tex> sous <Tex>{"g_i(x) \\le 0"}</Tex> pour <Tex>{"i = 1, \\dots, m"}</Tex>. À
          l'optimum <Tex>{"x^\\star"}</Tex>, chaque contrainte est dans l'un de deux cas (Bishop, PRML, annexe E) :
        </p>
        <ul>
          <li>
            <strong>inactive</strong>, <Tex>{"g_i(x^\\star) < 0"}</Tex> : l'optimum est à l'intérieur, la contrainte
            ne joue aucun rôle, et on a le même optimum sans elle. Son multiplicateur vaut 0 ;
          </li>
          <li>
            <strong>active</strong>, <Tex>{"g_i(x^\\star) = 0"}</Tex> : l'optimum est sur le bord, comme avec une
            égalité. Mais cette fois, le signe du multiplicateur compte. Au minimum, <Tex>f</Tex> ne doit pas pouvoir
            baisser en rentrant dans la zone permise. Donc <Tex>{"-\\nabla f"}</Tex>, la direction de plus forte
            baisse, doit pointer vers l'extérieur, du côté de <Tex>{"\\nabla g_i"}</Tex> :{" "}
            <Tex>{"-\\nabla f = \\lambda_i \\nabla g_i"}</Tex> avec <Tex>{"\\lambda_i \\ge 0"}</Tex>.
          </li>
        </ul>
        <p>
          Dans les deux cas, <Tex>{"\\lambda_i\\, g_i(x^\\star) = 0"}</Tex>. Avec le lagrangien{" "}
          <Tex>{"L(x, \\lambda) = f(x) + \\sum_i \\lambda_i g_i(x)"}</Tex> (MML, équation 7.20), cela donne les{" "}
          <strong>conditions de Karush-Kuhn-Tucker</strong> (KKT). Boyd (section 5.5.3, équation 5.49) les écrit
          aussi avec des contraintes d'égalité, qu'on omet ici :
        </p>
        <Tex block>{"\\begin{gathered} g_i(x^\\star) \\le 0 \\qquad \\lambda_i \\ge 0 \\qquad \\lambda_i\\, g_i(x^\\star) = 0 \\\\ \\nabla f(x^\\star) + \\sum_i \\lambda_i \\nabla g_i(x^\\star) = 0 \\end{gathered}"}</Tex>
        <p>
          Dans l'ordre : le point est admissible, les multiplicateurs sont positifs, chaque contrainte est soit active
          soit de multiplicateur nul (c'est la <strong>complémentarité</strong>), et le lagrangien est stationnaire en{" "}
          <Tex>x</Tex>. Exemple : projeter un point <Tex>p</Tex> sur le disque unité, c'est minimiser{" "}
          <Tex>{"\\|x - p\\|^2"}</Tex> sous <Tex>{"\\|x\\|^2 - 1 \\le 0"}</Tex>. Hors du disque, la stationnarité{" "}
          <Tex>{"2(x - p) + 2\\lambda x = 0"}</Tex> donne <Tex>{"(1 + \\lambda)\\,x = p"}</Tex>, donc{" "}
          <Tex>{"x^\\star = p / \\|p\\|"}</Tex> et <Tex>{"\\lambda = \\|p\\| - 1"}</Tex>.
        </p>
        <KktViz />
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Le problème dual</h2>
        <p>
          Le lagrangien donne aussi une borne inférieure. Pour <Tex>{"\\lambda \\ge 0"}</Tex> et <Tex>x</Tex>{" "}
          admissible, chaque terme <Tex>{"\\lambda_i g_i(x)"}</Tex> est négatif, donc{" "}
          <Tex>{"L(x, \\lambda) \\le f(x)"}</Tex>. La <strong>fonction duale</strong>{" "}
          <Tex>{"D(\\lambda) = \\min_x L(x, \\lambda)"}</Tex> (MML, définition 7.1) est donc sous{" "}
          <Tex>{"p^\\star = \\min f"}</Tex> pour tout <Tex>{"\\lambda \\ge 0"}</Tex>. C'est la{" "}
          <strong>dualité faible</strong> (MML, équation 7.27) :
        </p>
        <Tex block>{"d^\\star = \\max_{\\lambda \\ge 0} D(\\lambda) \\;\\le\\; p^\\star"}</Tex>
        <p>
          Le <strong>problème dual</strong> consiste à chercher la meilleure de ces bornes. Il a une propriété
          remarquable : <Tex>{"D"}</Tex> est toujours concave, même si <Tex>f</Tex> et les <Tex>{"g_i"}</Tex> ne sont
          pas convexes. En effet, <Tex>L</Tex> est affine en <Tex>\lambda</Tex>, et un minimum de fonctions affines
          est concave (MML, section 7.2). Maximiser <Tex>D</Tex> est donc un problème convexe.
        </p>
        <p>
          Exemple : minimiser <Tex>{"x^2"}</Tex> sous <Tex>{"x \\ge 1"}</Tex>, soit <Tex>{"g(x) = 1 - x \\le 0"}</Tex>,
          de solution <Tex>{"p^\\star = 1"}</Tex>. Le lagrangien <Tex>{"x^2 + \\lambda(1 - x)"}</Tex> est minimal en{" "}
          <Tex>{"x = \\lambda/2"}</Tex>, d'où <Tex>{"D(\\lambda) = \\lambda - \\lambda^2/4"}</Tex>, une parabole
          renversée :
        </p>
        <pre>
          <code>{`import numpy as np

# min x²  sous  g(x) = 1 - x <= 0.   L(x, lam) = x² + lam (1 - x)
# min en x : 2x - lam = 0, x = lam/2, donc D(lam) = lam - lam²/4
lams = np.linspace(0, 6, 601)
D = lams - lams**2 / 4
print(D.max() <= 1, lams[D.argmax()], D.max())
# True 2.0 1.0`}</code>
        </pre>
        <p>
          Toutes les bornes sont sous <Tex>{"p^\\star = 1"}</Tex>, et la meilleure l'atteint :{" "}
          <Tex>{"d^\\star = p^\\star"}</Tex>. C'est la <strong>dualité forte</strong>. Elle ne tient pas toujours,
          mais Boyd (section 5.2.3) donne une condition simple, la <strong>condition de Slater</strong> : si le
          problème est convexe et qu'un point vérifie toutes les inégalités strictement,{" "}
          <Tex>{"g_i(x) < 0"}</Tex>, alors <Tex>{"d^\\star = p^\\star"}</Tex>. Pour des contraintes affines, il suffit
          même que le problème soit admissible.
        </p>
        <p>
          Pour un programme linéaire, <Tex>{"\\min c^\\top x"}</Tex> sous <Tex>{"Ax \\le b"}</Tex>, MML (section 7.3.1)
          calcule le dual : <Tex>{"\\max -b^\\top \\lambda"}</Tex> sous <Tex>{"c + A^\\top \\lambda = 0"}</Tex> et{" "}
          <Tex>{"\\lambda \\ge 0"}</Tex> (équation 7.43). Résolvons les deux pour l'exemple 7.5 de MML :
        </p>
        <pre>
          <code>{`import numpy as np
from scipy.optimize import linprog

c = np.array([-5.0, -3.0])
A = np.array([[2, 2], [2, -4], [-2, 1], [0, -1], [0, 1]], dtype=float)
b = np.array([33, 8, 5, -1, 8], dtype=float)
primal = linprog(c, A_ub=A, b_ub=b, bounds=[(None, None)] * 2)
# dual (MML 7.43) : max -b.lam  sous  c + A^T lam = 0, lam >= 0
dual = linprog(b, A_eq=A.T, b_eq=-c, bounds=[(0, None)] * 5)
print(primal.x.round(4), round(primal.fun, 4))
print(dual.x.round(4), round(-dual.fun, 4))
# [12.3333  4.1667] -74.1667
# [2.1667 0.3333 0.     0.     0.    ] -74.1667`}</code>
        </pre>
        <p>
          Les deux valeurs optimales coïncident. Et les multiplicateurs se lisent : seules les deux premières
          contraintes ont <Tex>{"\\lambda_i > 0"}</Tex>. Ce sont les deux actives en{" "}
          <Tex>{"x^\\star = (12{,}33 ;\\ 4{,}17)"}</Tex> : <Tex>{"2x_1 + 2x_2 = 33"}</Tex> et{" "}
          <Tex>{"2x_1 - 4x_2 = 8"}</Tex>. Les trois autres sont inactives, de multiplicateur nul. C'est la
          complémentarité.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>KKT et la machine à vecteurs de support</h2>
        <p>
          Boyd (section 5.5.2) montre pourquoi la complémentarité est inévitable. Si{" "}
          <Tex>{"d^\\star = p^\\star"}</Tex>, avec <Tex>{"x^\\star"}</Tex> et <Tex>{"\\lambda^\\star"}</Tex> optimaux :
        </p>
        <Tex block>{"f(x^\\star) = D(\\lambda^\\star) \\le L(x^\\star, \\lambda^\\star) = f(x^\\star) + \\sum_i \\lambda_i^\\star g_i(x^\\star) \\le f(x^\\star)"}</Tex>
        <p>
          Les deux inégalités sont donc des égalités. La somme <Tex>{"\\sum_i \\lambda_i^\\star g_i(x^\\star)"}</Tex>{" "}
          est nulle alors que chaque terme est négatif : chaque terme est nul. Et <Tex>{"x^\\star"}</Tex> minimise{" "}
          <Tex>{"L(\\cdot, \\lambda^\\star)"}</Tex>, d'où la stationnarité. Les conditions KKT sont donc{" "}
          <strong>nécessaires</strong> dès que la dualité forte tient. Pour un problème convexe, elles sont aussi{" "}
          <strong>suffisantes</strong> : tout point qui les vérifie est optimal (Boyd, section 5.5.3). Sous Slater,
          résoudre le problème revient donc à résoudre les conditions KKT.
        </p>
        <p>
          <strong>La SVM.</strong> On sépare deux classes, <Tex>{"t_n \\in \\{-1, 1\\}"}</Tex>, par un hyperplan{" "}
          <Tex>{"y(x) = w^\\top x + b"}</Tex>. La distance d'un point bien classé à l'hyperplan est{" "}
          <Tex>{"t_n y(x_n) / \\|w\\|"}</Tex>. Bishop (PRML, section 7.1) veut maximiser la plus petite de ces
          distances, la <strong>marge</strong>. Comme <Tex>w</Tex> et <Tex>b</Tex> peuvent être multipliés par un même
          facteur, il fixe <Tex>{"t_n y(x_n) = 1"}</Tex> pour le point le plus proche. Maximiser la marge revient
          alors à (équations 7.5 et 7.6)
        </p>
        <Tex block>{"\\min_{w,\\, b}\\ \\tfrac12 \\|w\\|^2 \\quad \\text{sous} \\quad t_n\\,(w^\\top x_n + b) \\ge 1, \\quad n = 1, \\dots, N"}</Tex>
        <p>
          C'est un problème convexe : un objectif quadratique, des contraintes affines. Annuler le gradient du
          lagrangien en <Tex>w</Tex> et en <Tex>b</Tex> donne <Tex>{"w = \\sum_n a_n t_n x_n"}</Tex> et{" "}
          <Tex>{"\\sum_n a_n t_n = 0"}</Tex> (équations 7.8 et 7.9). En reportant, on obtient le dual (équation 7.10) :
        </p>
        <Tex block>{"\\max_{a \\ge 0}\\ \\sum_n a_n - \\tfrac12 \\sum_{n,m} a_n a_m t_n t_m\\, x_n^\\top x_m \\quad \\text{sous} \\quad \\sum_n a_n t_n = 0"}</Tex>
        <p>
          La complémentarité (équation 7.16) dit que <Tex>{"a_n\\,\\{t_n y(x_n) - 1\\} = 0"}</Tex>. Donc{" "}
          <Tex>{"a_n = 0"}</Tex> pour tout point au-delà de la marge : seuls comptent les points sur la marge, les{" "}
          <strong>vecteurs de support</strong>. Résolvons le dual avec un optimiseur générique, puis comparons à
          scikit-learn :
        </p>
        <pre>
          <code>{`import numpy as np
from scipy.optimize import minimize
from sklearn.svm import SVC

X = np.array([[1.0, 2.0], [2.0, 3.0], [2.0, 1.0], [3.0, 3.5], [4.0, 1.0], [5.0, 2.0], [4.5, -0.5], [6.0, 1.0]])
t = np.array([1, 1, 1, 1, -1, -1, -1, -1], dtype=float)
K = X @ X.T                                    # noyau linéaire k(x, x') = x^T x'
Q = (t[:, None] * t[None, :]) * K

res = minimize(lambda a: 0.5 * a @ Q @ a - a.sum(), np.zeros(8), jac=lambda a: Q @ a - 1,
               method="SLSQP", bounds=[(0, None)] * 8,
               constraints=[{"type": "eq", "fun": lambda a: a @ t}], options={"ftol": 1e-12, "maxiter": 500})
a = res.x
sv = a > 1e-6
w = (a * t) @ X                                # PRML 7.8
bias = np.mean(t[sv] - X[sv] @ w)              # PRML 7.18
print(a.round(3))
print(w.round(3), round(bias, 3))
print((t * (X @ w + bias)).round(3))           # t_n y(x_n) : 1 pour les vecteurs de support
print(round(0.5 * w @ w, 4), round(-res.fun, 4))

clf = SVC(kernel="linear", C=1e10).fit(X, t)   # C immense : marge dure
print(clf.coef_.round(3), clf.intercept_.round(3), np.sort(clf.support_))
# [0.   0.   0.42 0.16 0.58 0.   0.   0.  ]
# [-1.   0.4] 2.6
# [2.4 1.8 1.  1.  1.  1.6 2.1 3. ]
# 0.58 0.58
# [[-1.   0.4]] [2.599] [2 3 4]`}</code>
        </pre>
        <p>
          Sur huit points, trois ont <Tex>{"a_n > 0"}</Tex> (les indices 2, 3 et 4, en comptant à partir de 0) : ce sont exactement ceux où{" "}
          <Tex>{"t_n y(x_n) = 1"}</Tex>, et ceux que scikit-learn désigne comme vecteurs de support. Les cinq autres
          sont au-delà de la marge, avec <Tex>{"a_n = 0"}</Tex> : on pourrait les supprimer sans changer la solution.
          La valeur primale <Tex>{"\\tfrac12\\|w\\|^2"}</Tex> égale la valeur duale : la dualité forte tient.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Marge souple, perte charnière et noyaux</h2>
        <p>
          Si les classes se chevauchent, aucun hyperplan ne sépare tout. Bishop (section 7.1.1) autorise alors
          chaque point à violer la marge d'une quantité <Tex>{"\\xi_n \\ge 0"}</Tex>, avec{" "}
          <Tex>{"t_n y(x_n) \\ge 1 - \\xi_n"}</Tex>, et minimise{" "}
          <Tex>{"C \\sum_n \\xi_n + \\tfrac12 \\|w\\|^2"}</Tex> (équations 7.20 et 7.21). Le dual est le même, à un
          détail près : les multiplicateurs sont bornés, <Tex>{"0 \\le a_n \\le C"}</Tex> (équation 7.33). Les KKT
          classent les points :
        </p>
        <ul>
          <li>
            <Tex>{"a_n = 0"}</Tex> : point bien classé, au-delà de la marge ;
          </li>
          <li>
            <Tex>{"0 < a_n < C"}</Tex> : point exactement sur la marge, <Tex>{"t_n y(x_n) = 1"}</Tex> ;
          </li>
          <li>
            <Tex>{"a_n = C"}</Tex> : point dans la marge, voire du mauvais côté si <Tex>{"\\xi_n > 1"}</Tex>.
          </li>
        </ul>
        <pre>
          <code>{`import numpy as np
from sklearn.svm import SVC

rng = np.random.default_rng(0)
X = np.vstack([rng.normal([0, 0], 1.0, (40, 2)), rng.normal([2.5, 2.5], 1.0, (40, 2))])
t = np.array([1.0] * 40 + [-1.0] * 40)
C = 1.0
clf = SVC(kernel="linear", C=C).fit(X, t)
a = np.abs(clf.dual_coef_[0])                  # a_n des vecteurs de support
margin = t[clf.support_] * clf.decision_function(X[clf.support_])
at_C = np.isclose(a, C)
print(len(a), at_C.sum(), (~at_C).sum())
print(np.allclose(margin[~at_C], 1, atol=1e-3), (margin[at_C] <= 1 + 1e-3).all())
# 15 13 2
# True True`}</code>
        </pre>
        <p>
          Quinze vecteurs de support sur 80 points : deux sur la marge (<Tex>{"t_n y = 1"}</Tex>), treize avec{" "}
          <Tex>{"a_n = C"}</Tex>, tous à l'intérieur de la marge, voire du mauvais côté (<Tex>{"t_n y \\le 1"}</Tex>). C'est bien le tri prédit
          par les KKT.
        </p>
        <p>
          <strong>La perte charnière.</strong> À l'optimum, <Tex>{"\\xi_n = \\max(0,\\ 1 - t_n y(x_n))"}</Tex>, la
          plus petite valeur permise. En remplaçant, le problème devient, à une constante près (PRML, équations 7.44
          et 7.45) :
        </p>
        <Tex block>{"\\sum_n \\max\\big(0,\\ 1 - t_n y(x_n)\\big) + \\lambda \\|w\\|^2 \\qquad \\lambda = \\frac{1}{2C}"}</Tex>
        <p>
          C'est la perte charnière du chapitre Convexité, plus une pénalité ridge : un problème convexe sans
          contrainte, qu'on pourrait aussi minimiser par descente de (sous-)gradient. Les contraintes et les
          multiplicateurs n'ont pas disparu : ils sont cachés dans le maximum.
        </p>
        <p>
          <strong>Les noyaux.</strong> Dans le dual, les données n'apparaissent qu'à travers les produits scalaires{" "}
          <Tex>{"x_n^\\top x_m"}</Tex>. Bishop les remplace par un noyau <Tex>{"k(x_n, x_m) = \\phi(x_n)^\\top \\phi(x_m)"}</Tex>{" "}
          (équation 7.10). On obtient une SVM dans un espace de features <Tex>{"\\phi"}</Tex> de très grande dimension,
          voire infinie, pour le coût d'un problème à <Tex>N</Tex> variables. C'est le principal intérêt du dual.
        </p>
        <p>
          Ce chapitre clôt le module. On sait maintenant dériver des fonctions vectorielles et les rétropropager, les
          optimiser avec Newton, le momentum ou Adam, reconnaître les problèmes convexes, et traiter les contraintes
          d'égalité et d'inégalité.
        </p>
      </section>
    </LessonFlow>
  );
}
