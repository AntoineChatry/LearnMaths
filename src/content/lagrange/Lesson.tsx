import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { LagrangeViz } from "./LagrangeViz";

export function LagrangeLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Deux gradients alignés</h2>
        <p>
          On cherche le maximum (ou le minimum) de <Tex>{"f(x)"}</Tex>, mais seulement parmi les <Tex>x</Tex> qui
          vérifient une contrainte <Tex>{"h(x) = c"}</Tex> : des poids de norme 1, des probabilités de somme 1. Première
          idée, exprimer une variable en fonction des autres et substituer. Bishop (PRML, annexe E) en note les
          défauts : l'équation de contrainte n'a pas toujours de solution explicite, et la substitution traite les
          variables de façon asymétrique.
        </p>
        <p>
          L'argument géométrique de Bishop est plus élégant. En dimension <Tex>D</Tex>, la contrainte{" "}
          <Tex>{"h(x) = c"}</Tex> décrit une surface de dimension <Tex>{"D - 1"}</Tex>. Pour un petit déplacement{" "}
          <Tex>\epsilon</Tex> qui reste sur la surface, Taylor donne{" "}
          <Tex>{"h(x + \\epsilon) \\approx h(x) + \\epsilon^\\top \\nabla h(x)"}</Tex>, et comme les deux valeurs
          valent <Tex>c</Tex>, <Tex>{"\\epsilon^\\top \\nabla h(x) = 0"}</Tex> : le gradient{" "}
          <Tex>{"\\nabla h"}</Tex> est <strong>perpendiculaire à la surface</strong> (équation E.2).
        </p>
        <p>
          En un point optimal <Tex>{"x^\\star"}</Tex>, <Tex>{"\\nabla f"}</Tex> doit lui aussi être perpendiculaire à
          la surface. Sinon, il aurait une composante le long de la surface, et un petit glissement dans ce sens
          augmenterait <Tex>f</Tex> (le sens opposé la diminuerait). Deux vecteurs perpendiculaires à la même surface
          sont parallèles : il existe un nombre <Tex>\lambda</Tex>, le <strong>multiplicateur de Lagrange</strong>, tel
          que
        </p>
        <Tex block>{"\\nabla f(x^\\star) = \\lambda\\, \\nabla h(x^\\star)"}</Tex>
        <LagrangeViz />
        <p>
          Sur la figure, les lignes de niveau de <Tex>f</Tex> sont des ellipses. Aux points critiques, la ligne de
          niveau touche le cercle sans le traverser, et la valeur de <Tex>\lambda</Tex> affichée est la même que celle
          de <Tex>f</Tex>. Ce n'est pas un hasard : la section 3 l'explique.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Le lagrangien : une recette</h2>
        <p>
          On regroupe tout dans une seule fonction, le <strong>lagrangien</strong> :
        </p>
        <Tex block>{"L(x, \\lambda) = f(x) + \\lambda\\,\\big(c - h(x)\\big)"}</Tex>
        <p>
          Annuler <Tex>{"\\nabla_x L"}</Tex> donne <Tex>{"\\nabla f = \\lambda \\nabla h"}</Tex>, et annuler{" "}
          <Tex>{"\\partial L / \\partial \\lambda"}</Tex> redonne la contrainte <Tex>{"h(x) = c"}</Tex>. On a{" "}
          <Tex>{"D + 1"}</Tex> équations pour <Tex>{"D + 1"}</Tex> inconnues : les <Tex>D</Tex> coordonnées de{" "}
          <Tex>x</Tex> et <Tex>\lambda</Tex>. Le problème contraint est devenu la recherche d'un point stationnaire
          sans contrainte, en dimension <Tex>{"D + 1"}</Tex>. Bishop écrit la contrainte <Tex>{"g(x) = 0"}</Tex> et{" "}
          <Tex>{"L = f + \\lambda g"}</Tex> (équation E.4) : c'est la même chose avec <Tex>\lambda</Tex> changé de
          signe. Le signe de <Tex>\lambda</Tex> est libre.
        </p>
        <p>
          L'exemple de Bishop : maximiser <Tex>{"f = 1 - x_1^2 - x_2^2"}</Tex> sous <Tex>{"x_1 + x_2 = 1"}</Tex>.
          Laissons sympy résoudre les trois équations, puis un second problème, <Tex>{"x + 2y"}</Tex> sur le cercle
          unité :
        </p>
        <pre>
          <code>{`import sympy as sp

x1, x2, lam = sp.symbols("x1 x2 lambda")
f = 1 - x1**2 - x2**2
h = x1 + x2                                   # contrainte h(x) = 1
L = f + lam * (1 - h)
eqs = [sp.diff(L, v) for v in (x1, x2, lam)]  # D + 1 = 3 équations
print(sp.solve(eqs, [x1, x2, lam], dict=True))

x, y, lam = sp.symbols("x y lambda", real=True)
f = x + 2 * y
L = f + lam * (1 - (x**2 + y**2))             # contrainte x² + y² = 1
sols = sp.solve([sp.diff(L, v) for v in (x, y, lam)], [x, y, lam], dict=True)
for s in sols:
    print(s[x], s[y], s[lam], "  f =", f.subs(s))
# [{lambda: -1, x1: 1/2, x2: 1/2}]
# -sqrt(5)/5 -2*sqrt(5)/5 -sqrt(5)/2   f = -sqrt(5)
# sqrt(5)/5 2*sqrt(5)/5 sqrt(5)/2   f = sqrt(5)`}</code>
        </pre>
        <p>
          On retrouve le point <Tex>{"(\\tfrac12, \\tfrac12)"}</Tex> de Bishop, avec <Tex>{"\\lambda = -1"}</Tex> dans
          notre convention (Bishop trouve <Tex>{"\\lambda = 1"}</Tex> dans la sienne). Le second problème montre la
          limite de la méthode : elle donne des <strong>candidats</strong>, ici deux. Le maximum{" "}
          <Tex>{"\\sqrt 5"}</Tex> et le minimum <Tex>{"-\\sqrt 5"}</Tex> vérifient tous deux la condition. Pour
          conclure, on compare les valeurs de <Tex>f</Tex> aux candidats. Si l'ensemble des contraintes est fermé et
          borné, comme un cercle, le maximum existe. Et si <Tex>{"\\nabla h"}</Tex> ne s'annule pas sur cet ensemble
          (ici <Tex>{"\\nabla h = 2x \\ne 0"}</Tex>), l'argument de la section 1 s'applique : le maximum fait partie
          des candidats.
        </p>
        <p>
          Avec plusieurs contraintes <Tex>{"h_j(x) = c_j"}</Tex>, on met un multiplicateur par contrainte (PRML,
          équation E.12) : <Tex>{"\\nabla f = \\sum_j \\lambda_j \\nabla h_j"}</Tex>. Le gradient de <Tex>f</Tex> doit
          être une combinaison des gradients des contraintes, c'est-à-dire perpendiculaire à l'ensemble où elles
          sont toutes satisfaites.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>La PCA et le softmax sortent d'un lagrangien</h2>
        <p>
          <strong>La PCA.</strong> Bishop (PRML, section 12.1.1) cherche la direction <Tex>{"u_1"}</Tex> sur laquelle
          la projection des données a la plus grande variance. Cette variance vaut{" "}
          <Tex>{"u_1^\\top S u_1"}</Tex>, où <Tex>S</Tex> est la matrice de covariance des données. Sans contrainte,
          il suffirait d'allonger <Tex>{"u_1"}</Tex> pour l'augmenter, d'où la contrainte{" "}
          <Tex>{"u_1^\\top u_1 = 1"}</Tex>. Le lagrangien est (équation 12.4)
        </p>
        <Tex block>{"u_1^\\top S u_1 + \\lambda_1 \\big(1 - u_1^\\top u_1\\big)"}</Tex>
        <p>
          et l'annuler en <Tex>{"u_1"}</Tex> donne <Tex>{"2Su_1 - 2\\lambda_1 u_1 = 0"}</Tex>, soit{" "}
          <Tex>{"S u_1 = \\lambda_1 u_1"}</Tex> (équation 12.5). La condition de Lagrange est une équation aux
          valeurs propres ! En multipliant à gauche par <Tex>{"u_1^\\top"}</Tex>, la variance vaut{" "}
          <Tex>{"u_1^\\top S u_1 = \\lambda_1"}</Tex> (équation 12.6). Elle est donc maximale pour le vecteur propre de
          la plus grande valeur propre : la première composante principale. C'est ce qu'on voyait sur la
          visualisation : <Tex>\lambda</Tex> et <Tex>f</Tex> coïncidaient aux points critiques, qui sont les vecteurs
          propres de <Tex>S</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(500, 2)) @ np.array([[2.0, 0.0], [1.2, 0.5]])
S = np.cov(X.T, bias=True)                    # PRML 12.3
vals, vecs = np.linalg.eigh(S)
u1, lam1 = vecs[:, -1], vals[-1]
print(np.allclose(S @ u1, lam1 * u1))         # PRML 12.5 : S u1 = lambda1 u1
print(round(u1 @ S @ u1, 4), round(lam1, 4), round(np.var(X @ u1), 4))

angles = np.linspace(0, np.pi, 1801)          # toutes les directions, au dixième de degré
best = max(np.var(X @ np.array([np.cos(t), np.sin(t)])) for t in angles)
print(round(best, 4))
# True
# 5.3171 5.3171 5.3171
# 5.3171`}</code>
        </pre>
        <p>
          La recherche exhaustive sur toutes les directions ne fait pas mieux que <Tex>{"\\lambda_1"}</Tex>. Le chapitre
          SVD trouvait la même direction par une autre route.
        </p>
        <p>
          <strong>Le softmax.</strong> Cherchons une distribution <Tex>p</Tex> sur <Tex>n</Tex> classes qui donne un
          score moyen <Tex>{"\\sum_i p_i z_i"}</Tex> élevé, tout en gardant une entropie{" "}
          <Tex>{"H(p) = -\\sum_i p_i \\log p_i"}</Tex> élevée, sous la contrainte <Tex>{"\\sum_i p_i = 1"}</Tex>. On
          maximise <Tex>{"\\sum_i p_i z_i + T\\, H(p)"}</Tex>, où <Tex>{"T > 0"}</Tex> règle le compromis. Le
          lagrangien, dérivé par rapport à <Tex>{"p_i"}</Tex>, donne
        </p>
        <Tex block>{"z_i - T(\\log p_i + 1) - \\lambda = 0 \\quad\\Longrightarrow\\quad p_i \\propto e^{z_i / T} \\quad\\Longrightarrow\\quad p_i = \\frac{e^{z_i/T}}{\\sum_j e^{z_j/T}}"}</Tex>
        <p>
          Le multiplicateur <Tex>\lambda</Tex> sert juste à normaliser. C'est le softmax à température{" "}
          <Tex>T</Tex> du chapitre Lois discrètes. Avec <Tex>{"z = 0"}</Tex>, il ne reste que l'entropie, et on
          retrouve le calcul de Bishop (PRML, section 1.6, équation 1.99) : la distribution d'entropie maximale est
          uniforme. Boyd et Vandenberghe (exemple 3.25) font le même calcul en sens inverse : ils calculent la
          conjuguée du log-sum-exp, trouvent exactement cette condition{" "}
          <Tex>{"y_i = e^{x_i} / \\sum_j e^{x_j}"}</Tex>, et obtiennent l'entropie négative. Vérifions avec un
          optimiseur sous contrainte générique :
        </p>
        <pre>
          <code>{`import numpy as np
from scipy.optimize import minimize

z = np.array([2.0, 1.0, 0.1])
T = 0.5
obj = lambda p: -(p @ z - T * np.sum(p * np.log(p)))        # on maximise p.z + T H(p)
res = minimize(obj, np.ones(3) / 3, method="SLSQP", bounds=[(1e-9, 1)] * 3,
               constraints=[{"type": "eq", "fun": lambda p: p.sum() - 1}])
softmax = np.exp(z / T) / np.exp(z / T).sum()
print(res.x.round(4))
print(softmax.round(4))
print(round(-res.fun, 4), round(T * np.log(np.sum(np.exp(z / T))), 4))
# [0.8638 0.1169 0.0193]
# [0.8638 0.1169 0.0193]
# 2.0732 2.0732`}</code>
        </pre>
        <p>
          L'optimiseur retrouve le softmax, et la valeur optimale est{" "}
          <Tex>{"T \\log \\sum_j e^{z_j / T}"}</Tex> : le log-sum-exp du chapitre Convexité, mis à l'échelle.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Ce que vaut λ : le prix de la contrainte</h2>
        <p>
          Notons <Tex>{"p^\\star(c)"}</Tex> la valeur optimale quand la contrainte est <Tex>{"h(x) = c"}</Tex>, et{" "}
          <Tex>{"x^\\star(c)"}</Tex> le point qui l'atteint. Si tout est dérivable, la règle de la chaîne donne
        </p>
        <Tex block>{"\\frac{d p^\\star}{dc} = \\nabla f(x^\\star)^\\top \\frac{dx^\\star}{dc} = \\lambda\\, \\nabla h(x^\\star)^\\top \\frac{dx^\\star}{dc} = \\lambda\\, \\frac{d}{dc}\\, h\\big(x^\\star(c)\\big) = \\lambda"}</Tex>
        <p>
          puisque <Tex>{"h(x^\\star(c)) = c"}</Tex>. Le multiplicateur est la <strong>sensibilité</strong> de
          l'optimum à la contrainte : relâcher <Tex>c</Tex> de <Tex>\delta</Tex> fait gagner environ{" "}
          <Tex>{"\\lambda\\delta"}</Tex>. Boyd (section 5.6.3, équation 5.58) énonce ce résultat rigoureusement, sous
          une hypothèse de dualité forte qu'on verra au chapitre suivant. Sa convention de signe est l'inverse de la
          nôtre.
        </p>
        <p>
          Pour la PCA, <Tex>{"\\max u^\\top S u"}</Tex> sous <Tex>{"\\|u\\|^2 = c"}</Tex> vaut{" "}
          <Tex>{"c\\,\\lambda_1"}</Tex>, de dérivée <Tex>{"\\lambda_1"}</Tex> en <Tex>c</Tex> : c'est bien le
          multiplicateur. Vérifions par différence finie, avec les données de la section 3 :
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
X = rng.normal(size=(500, 2)) @ np.array([[2.0, 0.0], [1.2, 0.5]])
S = np.cov(X.T, bias=True)                    # mêmes données qu'en section 3
lam1 = np.linalg.eigvalsh(S)[-1]

def best_value(c):
    # max de u^T S u sur ||u||^2 = c, par recherche sur les directions
    t = np.linspace(0, np.pi, 200001)
    U = np.sqrt(c) * np.stack([np.cos(t), np.sin(t)])
    return np.max(np.einsum("in,ij,jn->n", U, S, U))

c, dc = 1.0, 1e-3
print(round((best_value(c + dc) - best_value(c)) / dc, 4), round(lam1, 4))
# 5.3171 5.3171`}</code>
        </pre>
        <p>
          Sur le cercle, <Tex>{"x + 2y"}</Tex> vaut au plus <Tex>{"\\sqrt 5\\, \\sqrt c"}</Tex>, de dérivée{" "}
          <Tex>{"\\sqrt 5 / 2"}</Tex> en <Tex>{"c = 1"}</Tex> : c'est le <Tex>\lambda</Tex> trouvé par sympy en
          section 2. Boyd en donne une lecture économique : si chaque contrainte limite une ressource (main-d'œuvre,
          acier, surface d'entrepôt), le multiplicateur dit combien une unité de ressource en plus rapporterait. On
          l'appelle un <em>prix fictif</em> (<em>shadow price</em>).
        </p>
        <p>
          Jusqu'ici, les contraintes étaient des égalités. Le chapitre suivant passe aux inégalités,{" "}
          <Tex>{"g(x) \\le 0"}</Tex> : une contrainte peut alors être active ou non, le signe de <Tex>\lambda</Tex>{" "}
          compte, et on obtient les conditions KKT.
        </p>
      </section>
    </LessonFlow>
  );
}
