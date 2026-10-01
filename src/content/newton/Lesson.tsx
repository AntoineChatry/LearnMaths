import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { NewtonPathViz } from "./NewtonPathViz";

export function NewtonLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Sauter au fond du modèle quadratique</h2>
        <p>
          Le chapitre Taylor s'est arrêté sur un aperçu : en une variable, la méthode de Newton remplace{" "}
          <Tex>f</Tex> par sa parabole osculatrice et saute à son sommet, <Tex>{"x \\leftarrow x - f'(x)/f''(x)"}</Tex>.
          En plusieurs variables, notons <Tex>{"g = \\nabla f(x)"}</Tex> et <Tex>{"H = \\nabla^2 f(x)"}</Tex> la
          hessienne. Le développement d'ordre 2 du chapitre Symétriques donne un <strong>modèle quadratique</strong>{" "}
          de <Tex>f</Tex> autour de <Tex>x</Tex> (Boyd et Vandenberghe, <em>Convex Optimization</em>, équation 9.28) :
        </p>
        <Tex block>{"\\hat f(x + v) = f(x) + g^\\top v + \\tfrac12\\, v^\\top H v"}</Tex>
        <p>
          Si <Tex>H</Tex> est définie positive, ce modèle est un bol, dont on trouve le fond en annulant son gradient
          en <Tex>v</Tex> : <Tex>{"g + Hv = 0"}</Tex>. C'est le <strong>pas de Newton</strong> :
        </p>
        <Tex block>{"\\Delta x_{\\text{nt}} = -H^{-1} g \\qquad\\qquad x \\leftarrow x + \\Delta x_{\\text{nt}}"}</Tex>
        <p>
          C'est une direction de descente : <Tex>{"g^\\top \\Delta x_{\\text{nt}} = -g^\\top H^{-1} g < 0"}</Tex> dès
          que <Tex>{"g \\ne 0"}</Tex>, puisque <Tex>{"H^{-1}"}</Tex> est définie positive elle aussi. Boyd en donne une
          autre lecture : c'est la linéarisation de la condition d'optimalité,{" "}
          <Tex>{"\\nabla f(x + v) \\approx g + Hv = 0"}</Tex>. En une variable, on retrouve la recherche du zéro de{" "}
          <Tex>{"f'"}</Tex> par sa tangente.
        </p>
        <p>
          Si <Tex>f</Tex> est elle-même quadratique, le modèle est exact et un seul pas tombe sur le minimum.
          Reprenons le bol incliné de conditionnement <Tex>{"\\kappa = 100"}</Tex> du chapitre Valeurs propres, où la
          descente de gradient demandait 691 pas :
        </p>
        <pre>
          <code>{`import numpy as np

c, s = np.cos(np.pi / 4), np.sin(np.pi / 4)
Q = np.array([[c, -s], [s, c]])
A = Q @ np.diag([1.0, 0.01]) @ Q.T     # kappa = 100 : 691 pas de gradient au chapitre Valeurs propres
b = np.array([1.0, 2.0])               # f(w) = 1/2 w^T A w - b^T w

w = np.array([1.0, 0.0])
g = A @ w - b                          # gradient
H = A                                  # hessienne
w = w + np.linalg.solve(H, -g)         # pas de Newton : on résout H v = -g
print(w, np.linalg.norm(A @ w - b))
# [-48.5  51.5] 2.589462819655575e-15`}</code>
        </pre>
        <p>
          Un pas, et le gradient est nul aux arrondis près. En pratique, on ne calcule jamais{" "}
          <Tex>{"H^{-1}"}</Tex> : on résout le système <Tex>{"Hv = -g"}</Tex>, comme au chapitre Systèmes.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Pourquoi Newton ignore le conditionnement</h2>
        <p>
          Change de coordonnées, <Tex>{"x = Ty"}</Tex> avec <Tex>T</Tex> inversible, et pose{" "}
          <Tex>{"\\bar f(y) = f(Ty)"}</Tex>. La règle de la chaîne donne{" "}
          <Tex>{"\\nabla \\bar f(y) = T^\\top g"}</Tex> et <Tex>{"\\nabla^2 \\bar f(y) = T^\\top H T"}</Tex>. Le pas
          de Newton de <Tex>{"\\bar f"}</Tex> vaut alors (Boyd, section 9.5.1) :
        </p>
        <Tex block>{"\\Delta y_{\\text{nt}} = -\\big(T^\\top H T\\big)^{-1} T^\\top g = -T^{-1} H^{-1} g = T^{-1}\\,\\Delta x_{\\text{nt}}"}</Tex>
        <p>
          Les pas se correspondent exactement : Newton est <strong>invariant par changement de coordonnées
          affine</strong>. Or étirer un axe change le conditionnement : un bol rond devient une vallée étroite.
          La descente de gradient y est sensible : son pas en <Tex>y</Tex> est{" "}
          <Tex>{"-T^\\top g"}</Tex>, qui ne correspond pas à <Tex>{"-T^{-1}g"}</Tex>. Newton, lui, fait la même suite de pas dans les deux systèmes. MML (section 7.1) décrit
          le remède général : un <strong>préconditionneur</strong> <Tex>P</Tex> qui rend le problème mieux conditionné.
          Newton prend <Tex>{"P = H"}</Tex>, recalculée à chaque pas.
        </p>
        <p>
          Sur la fonction convexe mais non quadratique <Tex>{"f(x, y) = \\sqrt{1 + x^2 + k\\,y^2}"}</Tex>, les deux
          méthodes avec la même recherche linéaire (section 3), depuis le même point une fois l'axe <Tex>y</Tex>{" "}
          remis à l'échelle, jusqu'à <Tex>{"f - \\min f < 10^{-10}"}</Tex> :
        </p>
        <pre>
          <code>{`import numpy as np

def iterations(k, newton):
    # f(x, y) = sqrt(1 + x² + k y²), de minimum p* = 1 en (0, 0)
    f = lambda w: np.sqrt(1 + w[0]**2 + k * w[1]**2)
    w = np.array([3.0, 3.0 / np.sqrt(k)])
    it = 0
    while f(w) - 1 > 1e-10:
        s = 1 + w[0]**2 + k * w[1]**2
        u = np.array([w[0], k * w[1]])
        g = u / np.sqrt(s)
        H = np.diag([1.0, k]) / np.sqrt(s) - np.outer(u, u) / s**1.5
        d = np.linalg.solve(H, -g) if newton else -g
        t = 1.0                        # recherche linéaire par rebroussement (Boyd, algorithme 9.2)
        while f(w + t * d) > f(w) + 0.25 * t * (g @ d):
            t *= 0.5
        w = w + t * d
        it += 1
    return it

for k in [1, 10, 100]:
    print(k, "gradient :", iterations(k, False), "  Newton :", iterations(k, True))
# 1 gradient : 7   Newton : 4
# 10 gradient : 38   Newton : 4
# 100 gradient : 475   Newton : 4`}</code>
        </pre>
        <p>
          Quatre itérations de Newton dans les trois cas : c'est l'invariance, mesurée. La visualisation reprend{" "}
          <Tex>{"k = 10"}</Tex>. Déplace le point de départ :
        </p>
        <NewtonPathViz />
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Amortir loin, converger quadratiquement près</h2>
        <p>
          Le modèle quadratique n'est fiable que près de <Tex>x</Tex>. Loin du minimum, le pas plein peut aggraver
          les choses. Boyd (exercice 9.10) prend <Tex>{"f(x) = \\log(e^x + e^{-x})"}</Tex>, de minimum en 0 :
        </p>
        <pre>
          <code>{`import numpy as np

# Boyd, exercice 9.10 : f(x) = log(e^x + e^-x), minimum en 0
f = lambda x: np.log(np.exp(x) + np.exp(-x))
d1 = np.tanh                                  # f'
d2 = lambda x: 1 - np.tanh(x) ** 2            # f''

for x0 in [1.0, 1.1]:
    x, xs = x0, []
    for _ in range(5):
        x = x - d1(x) / d2(x)                 # Newton pur : pas t = 1
        xs.append(round(float(x), 4))
    print(x0, xs)

x = 1.1
for _ in range(5):
    d = -d1(x) / d2(x)
    t = 1.0
    while f(x + t * d) > f(x) + 0.25 * t * d1(x) * d:   # rebroussement
        t *= 0.5
    x = x + t * d
print("amorti :", float(x))
# 1.0 [-0.8134, 0.4094, -0.0473, 0.0001, -0.0]
# 1.1 [-1.1286, 1.2341, -1.6952, 5.7154, -23021.3565]
# amorti : 0.0`}</code>
        </pre>
        <p>
          Depuis 1, Newton pur converge ; depuis 1,1, il diverge. Loin de 0, <Tex>f</Tex> est presque affine,{" "}
          <Tex>{"f''"}</Tex> presque nulle, et diviser par elle projette le point très loin. Le remède est la{" "}
          <strong>recherche linéaire par rebroussement</strong> (Boyd, algorithme 9.2) : on essaie{" "}
          <Tex>{"t = 1"}</Tex>, et tant que la baisse obtenue est inférieure à une fraction <Tex>\alpha</Tex> de celle
          que prédit la pente, on divise <Tex>t</Tex> par deux :
        </p>
        <Tex block>{"\\text{tant que } f(x + t\\,\\Delta x) > f(x) + \\alpha\\, t\\, g^\\top \\Delta x : \\quad t \\leftarrow \\beta t"}</Tex>
        <p>
          avec <Tex>{"0 < \\alpha < \\tfrac12"}</Tex> et <Tex>{"0 < \\beta < 1"}</Tex> (le code ci-dessus prend{" "}
          <Tex>{"\\alpha = 0{,}25"}</Tex> et <Tex>{"\\beta = 0{,}5"}</Tex>). La méthode de Newton de Boyd (algorithme 9.5) est ce pas de Newton, avec cette recherche. Son analyse
          (section 9.5.3) distingue deux phases, pour <Tex>f</Tex> fortement convexe et de hessienne lipschitzienne.
          D'abord une <strong>phase amortie</strong>, où <Tex>{"t < 1"}</Tex> est possible et où chaque itération
          fait baisser <Tex>f</Tex> d'au moins une constante. Puis, près du minimum, une{" "}
          <strong>phase quadratique</strong>, où le pas plein est toujours accepté et où l'erreur est
          grossièrement élevée au carré à chaque itération : le nombre de chiffres justes double. Le nombre
          d'itérations de cette phase croît si lentement avec la précision voulue que Boyd le traite comme une
          constante : cinq ou six.
        </p>
        <p>
          Pour s'arrêter, Boyd utilise le <strong>décrément de Newton</strong>{" "}
          <Tex>{"\\lambda(x)^2 = g^\\top H^{-1} g"}</Tex> : la baisse que promet le modèle quadratique est{" "}
          <Tex>{"f(x) - \\hat f(x + \\Delta x_{\\text{nt}}) = \\lambda^2/2"}</Tex>, une estimation de{" "}
          <Tex>{"f(x) - \\min f"}</Tex>. On s'arrête quand elle passe sous la tolérance.
        </p>
        <p>
          <strong>En ML : la régression logistique.</strong> Bishop (PRML, section 4.3.3) minimise l'entropie croisée
          de la régression logistique par Newton. Le gradient est <Tex>{"\\Phi^\\top(y - t)"}</Tex> (équation 4.96) et
          la hessienne <Tex>{"\\Phi^\\top R\\,\\Phi"}</Tex>, où <Tex>R</Tex> est diagonale de coefficients{" "}
          <Tex>{"y_n(1 - y_n)"}</Tex> (équations 4.97 et 4.98). Comme <Tex>{"0 < y_n < 1"}</Tex>,{" "}
          <Tex>{"u^\\top \\Phi^\\top R\\,\\Phi\\, u = \\sum_n y_n(1 - y_n)(\\phi_n^\\top u)^2 \\ge 0"}</Tex> : la perte est
          convexe, et la hessienne est définie positive dès que les colonnes de <Tex>\Phi</Tex> sont indépendantes
          (comme pour <Tex>{"X^\\top X"}</Tex>). Chaque pas résout des équations normales pondérées, d'où le nom
          d'<em>iterative reweighted least squares</em> (IRLS).
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
N = 200
X = rng.standard_normal((N, 2))
t = (X @ np.array([2.0, -1.0]) + 0.5 + rng.standard_normal(N) > 0).astype(float)
Phi = np.column_stack([np.ones(N), X])        # biais + 2 features

w = np.zeros(3)
for it in range(7):
    y = 1 / (1 + np.exp(-Phi @ w))            # sigmoïde
    g = Phi.T @ (y - t)                       # PRML 4.96
    R = y * (1 - y)
    H = Phi.T @ (R[:, None] * Phi)            # PRML 4.97 : Phi^T R Phi
    print(it, f"{np.linalg.norm(g):.1e}")
    w = w - np.linalg.solve(H, g)             # PRML 4.92
print(w.round(3))
# 0 7.1e+01
# 1 2.0e+01
# 2 7.0e+00
# 3 1.9e+00
# 4 2.7e-01
# 5 7.6e-03
# 6 6.4e-06
# [ 0.805  3.852 -1.872]`}</code>
        </pre>
        <p>
          Les deux phases se voient : le gradient baisse d'abord d'un facteur 3 ou 4 par pas, puis 0,27 donne
          0,0076 puis 0,0000064, soit à peu près le carré à chaque fois. Attention : si les deux classes sont
          séparables par un hyperplan, l'entropie croisée n'a pas de minimum fini et les poids partent à l'infini
          (PRML, section 4.3.2).
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Hors du convexe, et en très grande dimension</h2>
        <p>
          <strong>Les points selles attirent Newton.</strong> Si <Tex>H</Tex> a une valeur propre négative, le modèle
          quadratique n'a plus de fond. Le pas de Newton annule encore son gradient, mais il vise alors un point selle
          du modèle. Dans la base propre de <Tex>H</Tex>, le long du vecteur propre <Tex>i</Tex>, le pas de gradient
          vaut <Tex>{"-\\eta\\lambda_i"}</Tex> fois l'écart au point critique, et le pas de Newton vaut l'écart
          changé de signe. Pour <Tex>{"\\lambda_i < 0"}</Tex>, Newton va donc à l'opposé de la descente, vers le point
          critique. Dauphin et al. (2014, section 4) en concluent qu'un point selle devient un attracteur pour Newton,
          alors que la descente de gradient s'en éloigne, lentement, en suivant la courbure négative :
        </p>
        <pre>
          <code>{`import numpy as np

# f(x, y) = x² - y² + y⁴/4 : minima en (0, ±√2), point selle en (0, 0)
grad = lambda w: np.array([2 * w[0], -2 * w[1] + w[1] ** 3])
hess = lambda w: np.diag([2.0, -2 + 3 * w[1] ** 2])

w_newton = np.array([1.0, 0.5])
w_grad = np.array([1.0, 0.5])
for _ in range(20):
    w_newton = w_newton - np.linalg.solve(hess(w_newton), grad(w_newton))
    w_grad = w_grad - 0.1 * grad(w_grad)
print("Newton   :", w_newton.round(4))
print("gradient :", w_grad.round(4))
# Newton   : [0. 0.]
# gradient : [0.0115 1.4138]`}</code>
        </pre>
        <p>
          Newton s'est posé sur le point selle, le gradient approche le minimum{" "}
          <Tex>{"(0, \\sqrt 2) \\approx (0;\\ 1{,}4142)"}</Tex>. Or Dauphin et al. soutiennent que, dans les grandes
          dimensions de l'apprentissage profond, les points selles sont bien plus nombreux que les mauvais minima
          locaux. Une parade classique est d'amortir : remplacer <Tex>H</Tex> par <Tex>{"H + \\alpha I"}</Tex>, ce qui
          ajoute <Tex>\alpha</Tex> à chaque valeur propre, au prix de pas plus courts.
        </p>
        <p>
          <strong>Le coût.</strong> Pour <Tex>n</Tex> paramètres, la hessienne a <Tex>{"n^2"}</Tex> coefficients, et
          résoudre <Tex>{"Hv = -g"}</Tex> par élimination coûte de l'ordre de <Tex>{"n^3"}</Tex> opérations. Avec{" "}
          <Tex>{"n = 10^9"}</Tex>, c'est <Tex>{"10^{18}"}</Tex> coefficients : ni stockables, ni calculables. On peut
          en revanche multiplier <Tex>H</Tex> par un vecteur sans la former : c'est la dérivée de{" "}
          <Tex>{"\\nabla f(x)^\\top v"}</Tex> par rapport à <Tex>x</Tex>, que la différentiation automatique calcule
          pour un coût du même ordre qu'un gradient (Pearlmutter, 1994).
        </p>
        <pre>
          <code>{`import torch

torch.manual_seed(0)
A = torch.randn(5, 5)
w = torch.randn(5, requires_grad=True)
v = torch.randn(5)

def f(w):
    return torch.sum(torch.tanh(A @ w) ** 2)

# Produit hessienne-vecteur : on dérive (gradient · v), sans jamais former H
g = torch.autograd.grad(f(w), w, create_graph=True)[0]
Hv = torch.autograd.grad(g @ v, w)[0]

H = torch.autograd.functional.hessian(f, w)   # la hessienne complète, pour comparer
print(torch.allclose(Hv, H @ v, atol=1e-6))
# True`}</code>
        </pre>
        <p>
          Les méthodes de quasi-Newton comme L-BFGS approchent la hessienne à partir des gradients successifs, pour un
          coût bien moindre (MML, section 7.4, qui renvoie à Nocedal et Wright). Pour entraîner les grands réseaux, on
          garde surtout l'idée d'un pas adapté à chaque direction, sans hessienne : c'est ce que font le momentum et
          Adam, au chapitre suivant.
        </p>
      </section>
    </LessonFlow>
  );
}
