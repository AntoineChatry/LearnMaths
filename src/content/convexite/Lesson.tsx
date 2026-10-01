import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { ChordViz } from "./ChordViz";

export function ConvexiteLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>La corde au-dessus du graphe</h2>
        <p>
          Un ensemble <Tex>C</Tex> est <strong>convexe</strong> s'il contient le segment entre deux quelconques de ses
          points : pour tous <Tex>{"x, y \\in C"}</Tex> et <Tex>{"0 \\le \\theta \\le 1"}</Tex>,{" "}
          <Tex>{"\\theta x + (1-\\theta) y \\in C"}</Tex> (MML, définition 7.2). Un disque est convexe, un croissant de
          lune ne l'est pas.
        </p>
        <p>
          Une fonction <Tex>f</Tex>, définie sur un ensemble convexe, est <strong>convexe</strong> si, pour tous{" "}
          <Tex>x</Tex>, <Tex>y</Tex> de son domaine et tout <Tex>{"0 \\le \\theta \\le 1"}</Tex> (MML, définition 7.3 ;
          Boyd et Vandenberghe, équation 3.1) :
        </p>
        <Tex block>{"f\\big(\\theta x + (1-\\theta) y\\big) \\le \\theta f(x) + (1-\\theta) f(y)"}</Tex>
        <p>
          À gauche, <Tex>f</Tex> évaluée en un point du segment ; à droite, la même moyenne pondérée prise sur les
          valeurs. Géométriquement, la <strong>corde</strong> entre <Tex>{"(x, f(x))"}</Tex> et{" "}
          <Tex>{"(y, f(y))"}</Tex> reste au-dessus du graphe. Une fonction est <strong>concave</strong> si{" "}
          <Tex>-f</Tex> est convexe. Les fonctions affines sont les deux à la fois, avec égalité partout.
        </p>
        <ChordViz />
        <p>
          Avec <Tex>{"x^4/8 - x^2"}</Tex>, place <Tex>x</Tex> et <Tex>y</Tex> de part et d'autre de 0 : la corde passe
          sous la bosse. Avec les trois autres, impossible de faire virer le trait au rouge.
        </p>
        <p>
          MML (exemple 7.3) vérifie l'inégalité sur l'entropie négative <Tex>{"f(x) = x \\log_2 x"}</Tex>, avec{" "}
          <Tex>{"x = 2"}</Tex>, <Tex>{"y = 4"}</Tex> et <Tex>{"\\theta = \\tfrac12"}</Tex>. L'inégalité se prolonge à
          plus de deux points, puis à une espérance : c'est l'<strong>inégalité de Jensen</strong>,{" "}
          <Tex>{"f(\\mathbb E[X]) \\le \\mathbb E[f(X)]"}</Tex> pour <Tex>f</Tex> convexe (Boyd, section 3.1.8).
        </p>
        <pre>
          <code>{`import numpy as np

f = lambda x: x * np.log2(x)                  # entropie négative (MML, exemple 7.3)
x, y, th = 2.0, 4.0, 0.5
print(round(f(th * x + (1 - th) * y), 2), th * f(x) + (1 - th) * f(y))

vals = np.array([0.0, 1.0, 2.0, 3.0])         # X uniforme sur {0, 1, 2, 3}
print(round(np.mean(np.exp(vals)), 3), round(np.exp(vals.mean()), 3))
print(np.mean(vals**2) - vals.mean() ** 2, vals.var())
# 4.75 5.0
# 7.798 4.482
# 1.25 1.25`}</code>
        </pre>
        <p>
          <Tex>{"3\\log_2 3 \\approx 4{,}75 \\le 5"}</Tex> : l'inégalité tient. Pour <Tex>{"e^x"}</Tex>, la moyenne
          des exponentielles dépasse l'exponentielle de la moyenne. Et avec <Tex>{"f(x) = x^2"}</Tex>, l'écart de
          Jensen <Tex>{"\\mathbb E[X^2] - \\mathbb E[X]^2"}</Tex> n'est autre que la variance : Jensen dit qu'elle est
          positive.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Tangente et hessienne : deux tests</h2>
        <p>
          Vérifier la définition pour tous les couples de points est impraticable. Si <Tex>f</Tex> est dérivable,
          elle est convexe si et seulement si son domaine est convexe et (Boyd, équation 3.2 ; MML, équation 7.31) :
        </p>
        <Tex block>{"f(y) \\ge f(x) + \\nabla f(x)^\\top (y - x) \\quad \\text{pour tous } x, y"}</Tex>
        <p>
          À droite, c'est le développement de Taylor d'ordre 1 en <Tex>x</Tex> : la tangente, ou l'hyperplan
          tangent. Pour une fonction convexe, il est sous le graphe <em>partout</em>. Coche « tangente en{" "}
          <Tex>x</Tex> » dans la visualisation : pour <Tex>{"x^4/8 - x^2"}</Tex> en <Tex>{"x = 1"}</Tex>, elle passe
          au-dessus du graphe.
        </p>
        <p>
          Boyd la présente comme la propriété la plus importante des fonctions convexes : une information locale (la
          valeur et le gradient en un point) donne une borne globale. En particulier, si{" "}
          <Tex>{"\\nabla f(x) = 0"}</Tex>, alors <Tex>{"f(y) \\ge f(x)"}</Tex> pour tout <Tex>y</Tex> :{" "}
          <strong>un point critique d'une fonction convexe est un minimum global</strong>. Plus généralement, pour un
          problème d'optimisation convexe, tout minimum local est global (Boyd, section 4.2.2). Si un{" "}
          <Tex>y</Tex> faisait mieux que le minimum local <Tex>x</Tex>, la corde de <Tex>x</Tex> à <Tex>y</Tex>{" "}
          descendrait strictement dès qu'on quitte <Tex>x</Tex>, et l'inégalité de la corde forcerait <Tex>f</Tex> à
          faire de même, tout près de <Tex>x</Tex>. Contradiction.
        </p>
        <p>
          Si <Tex>f</Tex> est deux fois dérivable, le test devient local (Boyd, section 3.1.4) :{" "}
          <Tex>f</Tex> est convexe si et seulement si son domaine est convexe et sa hessienne est{" "}
          <strong>semi-définie positive</strong> en tout point, <Tex>{"\\nabla^2 f(x) \\succeq 0"}</Tex>. En une
          variable, <Tex>{"f'' \\ge 0"}</Tex>. Pour une quadratique{" "}
          <Tex>{"\\tfrac12 x^\\top P x + q^\\top x + r"}</Tex>, la hessienne vaut <Tex>P</Tex> partout : convexe si et
          seulement si <Tex>{"P \\succeq 0"}</Tex>. Pour une matrice 2×2 symétrique{" "}
          <Tex>{"\\begin{pmatrix} a & b \\\\ b & c \\end{pmatrix}"}</Tex>, cela revient à <Tex>{"a \\ge 0"}</Tex>,{" "}
          <Tex>{"c \\ge 0"}</Tex> et <Tex>{"ac - b^2 \\ge 0"}</Tex> (les deux valeurs propres ont une somme{" "}
          <Tex>{"a + c"}</Tex> et un produit <Tex>{"ac - b^2"}</Tex> positifs).
        </p>
        <p>Deux subtilités relevées par Boyd :</p>
        <ul>
          <li>
            <Tex>{"H \\succ 0"}</Tex> partout implique <strong>strictement</strong> convexe, mais pas l'inverse :{" "}
            <Tex>{"x^4"}</Tex> est strictement convexe alors que <Tex>{"f''(0) = 0"}</Tex>.
          </li>
          <li>
            Le domaine doit être convexe : <Tex>{"1/x^2"}</Tex> sur <Tex>{"\\mathbb R \\setminus \\{0\\}"}</Tex> a{" "}
            <Tex>{"f'' > 0"}</Tex> partout, mais n'est pas convexe (remarque 3.1). La corde de <Tex>-1</Tex> à{" "}
            <Tex>1</Tex> passe sous le pic en 0.
          </li>
        </ul>
        <p>
          Exemple important pour la suite : le <strong>log-sum-exp</strong>{" "}
          <Tex>{"f(x) = \\log(e^{x_1} + \\dots + e^{x_n})"}</Tex>, une version lisse du maximum, puisque{" "}
          <Tex>{"\\max_i x_i \\le f(x) \\le \\max_i x_i + \\log n"}</Tex>. Boyd (section 3.1.5) calcule sa hessienne et
          montre par Cauchy-Schwarz qu'elle est semi-définie positive. Vérifions numériquement :
        </p>
        <pre>
          <code>{`import numpy as np

def hess_lse(x):
    z = np.exp(x)
    s = z.sum()
    return (s * np.diag(z) - np.outer(z, z)) / s**2     # Boyd, section 3.1.5

rng = np.random.default_rng(0)
worst = min(np.linalg.eigvalsh(hess_lse(rng.normal(size=4) * 3)).min() for _ in range(1000))
print(f"{worst:.1e}")

x = rng.normal(size=4)
lse = lambda x: np.log(np.sum(np.exp(x)))
print(lse(x + 2.0) - lse(x))
print(np.allclose(hess_lse(x) @ np.ones(4), 0))
# -1.5e-16
# 2.0
# True`}</code>
        </pre>
        <p>
          Sur 1000 points, la plus petite valeur propre vaut 0 aux arrondis près : jamais négative, mais jamais
          strictement positive non plus. La direction <Tex>{"(1, \\dots, 1)"}</Tex> l'explique : ajouter{" "}
          <Tex>t</Tex> à toutes les coordonnées ajoute exactement <Tex>t</Tex> à <Tex>f</Tex>. Le long de cette
          droite, <Tex>f</Tex> est affine, de courbure nulle. Convexe, donc, mais pas strictement.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Assembler des pertes convexes</h2>
        <p>
          En pratique, on prouve rarement la convexité à partir de la définition. On l'obtient par des opérations qui
          la conservent (Boyd, section 3.2 ; MML, exemple 7.4) :
        </p>
        <ul>
          <li>
            <strong>somme à coefficients positifs</strong> : si <Tex>{"f_1, \\dots, f_m"}</Tex> sont convexes et{" "}
            <Tex>{"w_i \\ge 0"}</Tex>, alors <Tex>{"\\sum_i w_i f_i"}</Tex> l'est (section 3.2.1) ;
          </li>
          <li>
            <strong>composition avec une application affine</strong> : si <Tex>f</Tex> est convexe, alors{" "}
            <Tex>{"x \\mapsto f(Ax + b)"}</Tex> aussi (section 3.2.2) ;
          </li>
          <li>
            <strong>maximum</strong> : le maximum point par point de fonctions convexes est convexe (section 3.2.3).
            Par exemple <Tex>{"\\max(0, t)"}</Tex>, la ReLU, maximum de deux fonctions affines.
          </li>
        </ul>
        <p>Ces trois règles suffisent pour les pertes classiques, vues comme fonctions des poids :</p>
        <ul>
          <li>
            <strong>moindres carrés</strong> <Tex>{"\\sum_n (w^\\top x_n - y_n)^2"}</Tex> : le carré est convexe, composé
            avec l'affine <Tex>{"w \\mapsto w^\\top x_n - y_n"}</Tex>, puis sommé. Ajouter{" "}
            <Tex>{"\\lambda \\|w\\|^2"}</Tex> (ridge) garde la convexité ;
          </li>
          <li>
            <strong>entropie croisée de la régression logistique</strong> : pour une étiquette{" "}
            <Tex>{"t \\in \\{-1, 1\\}"}</Tex>, la perte vaut{" "}
            <Tex>{"\\log(1 + e^{-t\\, w^\\top x}) = \\text{lse}(0,\\ -t\\, w^\\top x)"}</Tex>. C'est le log-sum-exp de la
            section 2 composé avec une application affine de <Tex>w</Tex> ;
          </li>
          <li>
            <strong>entropie croisée du softmax</strong> : pour les logits <Tex>{"z = Wx"}</Tex> et la bonne classe{" "}
            <Tex>c</Tex>, <Tex>{"-\\log \\operatorname{softmax}(z)_c = \\text{lse}(z) - z_c"}</Tex>. C'est un
            log-sum-exp moins une fonction linéaire, le tout affine en <Tex>W</Tex> ;
          </li>
          <li>
            <strong>perte charnière du SVM</strong> <Tex>{"\\max(0,\\ 1 - t\\, w^\\top x)"}</Tex> : un maximum de deux
            fonctions affines. On la retrouvera au chapitre KKT et dualité.
          </li>
        </ul>
        <p>
          <strong>Un réseau de neurones, lui, ne l'est pas.</strong> Goodfellow et al. (<em>Deep Learning</em>,
          section 8.2.2) en donnent une raison structurelle, la <strong>symétrie de l'espace des poids</strong>.
          Échanger deux neurones cachés, c'est-à-dire leurs poids entrants et leurs poids sortants, donne le même
          réseau. Donc la même perte. Si la perte était convexe, la moyenne de ces deux jeux de poids ferait au moins
          aussi bien. Or cette moyenne donne deux neurones identiques :
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(1)
X = rng.normal(size=(100, 2))
W1 = np.array([[1.0, -2.0], [2.0, 1.0]])      # 2 neurones cachés, poids entrants en lignes
w2 = np.array([1.0, -1.0])                    # poids sortants
y = np.tanh(X @ W1.T) @ w2                    # données produites par ce réseau : perte nulle en (W1, w2)

def loss(W1, w2):
    return np.mean((np.tanh(X @ W1.T) @ w2 - y) ** 2)

W1s, w2s = W1[::-1], w2[::-1]                 # on échange les deux neurones
print(loss(W1, w2), loss(W1s, w2s))
print(round(loss((W1 + W1s) / 2, (w2 + w2s) / 2), 3))
# 0.0 0.0
# 1.178`}</code>
        </pre>
        <p>
          Deux minima globaux, de perte nulle, et une perte de 1,178 au milieu du segment : l'inégalité de la corde
          est violée, la perte n'est pas convexe. Avec <Tex>n</Tex> neurones par couche et <Tex>m</Tex> couches, il y
          a <Tex>{"n!^m"}</Tex> façons de les permuter, donc au moins autant de minima équivalents. Goodfellow et al.
          notent que ces minima-là ne posent pas de problème, puisqu'ils ont tous la même perte ; les minima gênants
          sont ceux dont la perte est élevée.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Forte convexité : une vitesse garantie</h2>
        <p>
          La convexité garantit que le minimum trouvé est global. Pas qu'on le trouve vite, ni qu'il soit unique :{" "}
          <Tex>{"\\max(0, |x| - 1)"}</Tex> est convexe et nulle sur tout <Tex>{"[-1, 1]"}</Tex>. Pour une vitesse, Boyd
          (section 9.1.2) suppose <Tex>f</Tex> <strong>fortement convexe</strong> : il existe{" "}
          <Tex>{"m > 0"}</Tex> tel que <Tex>{"\\nabla^2 f(x) \\succeq mI"}</Tex> partout (équation 9.7). Toutes les
          courbures valent au moins <Tex>m</Tex>, et la borne de la tangente se renforce d'un bol (équation 9.8) :
        </p>
        <Tex block>{"f(y) \\ge f(x) + \\nabla f(x)^\\top (y - x) + \\frac m2 \\|y - x\\|^2"}</Tex>
        <p>
          En minimisant le membre de droite en <Tex>y</Tex>, Boyd en tire deux garanties, avec{" "}
          <Tex>{"p^\\star = \\min f"}</Tex> et <Tex>{"x^\\star"}</Tex> le point qui l'atteint :
        </p>
        <Tex block>{"f(x) - p^\\star \\le \\frac{1}{2m} \\|\\nabla f(x)\\|^2 \\qquad\\qquad \\|x - x^\\star\\| \\le \\frac 2m \\|\\nabla f(x)\\|"}</Tex>
        <p>
          (équations 9.9 et 9.11). Un petit gradient certifie donc qu'on est près de l'optimum, en valeur comme en
          position, et le minimum est unique. C'est le critère d'arrêt qui manque pour une fonction seulement
          convexe.
        </p>
        <p>
          Si de plus <Tex>{"\\nabla^2 f(x) \\preceq MI"}</Tex>, alors <Tex>{"\\kappa = M/m"}</Tex> borne le
          conditionnement de la hessienne. La descente de gradient avec recherche linéaire exacte vérifie alors
          (Boyd, section 9.3.1, équation 9.18) :
        </p>
        <Tex block>{"f(x^{(k)}) - p^\\star \\le c^k \\big(f(x^{(0)}) - p^\\star\\big) \\qquad c = 1 - \\frac mM"}</Tex>
        <p>
          C'est une <strong>convergence linéaire</strong> : l'erreur décroît au moins comme une suite géométrique, et
          d'autant plus lentement que <Tex>\kappa</Tex> est grand. On retrouve le rôle du conditionnement vu aux
          chapitres Valeurs propres et Momentum, cette fois garanti hors des quadratiques. Testons la borne :
        </p>
        <pre>
          <code>{`import numpy as np

A = np.diag([1.0, 10.0])                      # m = 1, M = 10
f = lambda x: 0.5 * x @ A @ x                 # p* = 0
x = np.array([10.0, 1.0])
f0, c, ratios = f(x), 1 - 1 / 10, []
for k in range(1, 31):
    g = A @ x
    t = (g @ g) / (g @ A @ g)                 # recherche exacte : le meilleur pas le long de -g
    x = x - t * g
    ratios.append(f(x) / (c**k * f0))
print(round(max(ratios), 3))                  # erreur / borne : toujours <= 1
print(round((f(x) / f0) ** (1 / 30), 3))      # taux moyen réel par pas
# 0.744
# 0.669`}</code>
        </pre>
        <p>
          La borne est respectée à chaque pas, mais le taux réel, 0,669, est bien meilleur que{" "}
          <Tex>{"c = 0{,}9"}</Tex>. Boyd prévient d'ailleurs que la borne est grossière ; son intérêt est de montrer
          de quoi dépend la vitesse.
        </p>
        <p>
          <strong>En ML : la régularisation ridge rend fortement convexe.</strong> La hessienne des moindres carrés{" "}
          <Tex>{"\\|Xw - y\\|^2"}</Tex> est <Tex>{"2X^\\top X"}</Tex>. Si deux features sont colinéaires, elle est
          singulière : <Tex>{"m = 0"}</Tex>, et une infinité de solutions. Avec <Tex>{"\\lambda \\|w\\|^2"}</Tex>, elle
          devient <Tex>{"2X^\\top X + 2\\lambda I"}</Tex>, dont toutes les valeurs propres augmentent de{" "}
          <Tex>{"2\\lambda"}</Tex> : <Tex>{"m \\ge 2\\lambda > 0"}</Tex>. Le minimum devient unique, et{" "}
          <Tex>\kappa</Tex> diminue.
        </p>
        <p>
          Jusqu'ici, on minimisait sans contrainte. Mais on veut souvent optimiser sous contrainte : des poids de
          norme fixée, des probabilités de somme 1. C'est l'objet des multiplicateurs de Lagrange, au chapitre
          suivant.
        </p>
      </section>
    </LessonFlow>
  );
}
