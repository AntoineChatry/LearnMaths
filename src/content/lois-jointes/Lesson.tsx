import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { CorrViz } from "./CorrViz";

export function LoisJointesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Loi jointe, lois marginales, indépendance</h2>
        <p>
          Deux variables <Tex>X</Tex> et <Tex>Y</Tex> observées ensemble ont une <strong>loi jointe</strong>{" "}
          <Tex>{"p(x, y) = P(X = x, Y = y)"}</Tex>. On retrouve la loi d'une seule variable, dite{" "}
          <strong>marginale</strong>, en sommant sur l'autre : c'est la règle de la somme (MML, équation 6.20). La
          règle du produit relie la loi jointe aux conditionnelles (équation 6.22) :
        </p>
        <Tex block>{"p(x) = \\sum_y p(x, y) \\qquad\\qquad p(x, y) = p(y \\mid x)\\, p(x)"}</Tex>
        <p>
          Pour des densités, la somme devient une intégrale. <Tex>X</Tex> et <Tex>Y</Tex> sont{" "}
          <strong>indépendantes</strong> si la loi jointe est le produit des marginales,{" "}
          <Tex>{"p(x, y) = p(x)\\, p(y)"}</Tex> pour tous <Tex>x</Tex>, <Tex>y</Tex> (définition 6.10) : connaître{" "}
          <Tex>y</Tex> n'apprend alors rien sur <Tex>x</Tex>.
        </p>
        <p>
          <strong>Une matrice de confusion est une loi jointe.</strong> Un filtre anti-spam est évalué sur 100
          courriels. En divisant les effectifs par 100, on obtient la loi jointe de la classe prédite et de la vraie
          classe. Les marginales donnent la fréquence des spams (0,25) et celle des alertes (0,20). La diagonale
          donne la <em>précision globale</em> (accuracy), 0,91. Les conditionnelles donnent la <em>précision</em>{" "}
          (precision), <Tex>{"P(\\text{vrai spam} \\mid \\text{prédit spam}) = 0{,}18 / 0{,}20 = 0{,}9"}</Tex>, et le{" "}
          <em>rappel</em>, <Tex>{"P(\\text{prédit spam} \\mid \\text{vrai spam}) = 0{,}18 / 0{,}25 = 0{,}72"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

# Loi jointe (prédit, vrai) d'un filtre anti-spam, sur 100 courriels
#              vrai spam  vrai normal
P = np.array([[0.18,      0.02],    # prédit spam
              [0.07,      0.73]])   # prédit normal
p_pred, p_vrai = P.sum(axis=1), P.sum(axis=0)  # marginales
print(p_pred, p_vrai)
precision, rappel = P[0, 0] / p_pred[0], P[0, 0] / p_vrai[0]
print(round(np.trace(P), 2), precision, rappel)
print(np.outer(p_pred, p_vrai))  # ce que serait P si indépendance
# [0.2 0.8] [0.25 0.75]
# 0.91 0.9 0.72
# [[0.05 0.15]
#  [0.2  0.6 ]]`}</code>
        </pre>
        <p>
          Un classifieur utile rend la prédiction <em>dépendante</em> de la vraie classe : 0,18 au lieu du 0,05 qu'on
          aurait si le filtre répondait au hasard avec la même fréquence d'alertes.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Covariance et corrélation : la tendance linéaire</h2>
        <p>
          La <strong>covariance</strong> est l'espérance du produit des écarts à la moyenne (MML, définition 6.5 et
          équation 6.36) :
        </p>
        <Tex block>{"\\text{Cov}(X, Y) = E\\big((X - E X)(Y - E Y)\\big) = E(XY) - E(X)\\,E(Y)"}</Tex>
        <p>
          Elle est positive quand <Tex>X</Tex> et <Tex>Y</Tex> ont tendance à être ensemble au-dessus ou ensemble
          au-dessous de leurs moyennes, négative quand l'une monte pendant que l'autre descend, et{" "}
          <Tex>{"\\text{Cov}(X, X) = V(X)"}</Tex>. Elle complète la règle d'addition du chapitre 4, qui supposait
          l'indépendance (équation 6.48) :
        </p>
        <Tex block>{"V(X + Y) = V(X) + V(Y) + 2\\,\\text{Cov}(X, Y)"}</Tex>
        <p>
          La covariance dépend des unités : mesurer en centimètres plutôt qu'en mètres la multiplie par 100. La{" "}
          <strong>corrélation</strong> la normalise (définition 6.8) :{" "}
          <Tex>{"\\text{corr}(X, Y) = \\text{Cov}(X, Y) / \\sqrt{V(X)\\,V(Y)}"}</Tex>, toujours comprise entre −1 et 1.
          Elle vaut ±1 exactement quand <Tex>Y</Tex> est une fonction affine de <Tex>X</Tex>.
        </p>
        <CorrViz />
        <p>
          <strong>Non corrélées ne veut pas dire indépendantes.</strong> Si <Tex>X</Tex> et <Tex>Y</Tex> sont
          indépendantes, leur covariance est nulle, puisque <Tex>{"E(XY) = E(X)E(Y)"}</Tex>. La réciproque est fausse,
          car la covariance ne mesure que la dépendance linéaire (MML, exemple 6.5) : si <Tex>X</Tex> est centrée avec{" "}
          <Tex>{"E(X^3) = 0"}</Tex> et <Tex>{"Y = X^2"}</Tex>, alors <Tex>{"\\text{Cov}(X, Y) = E(X^3) = 0"}</Tex>.
        </p>
        <pre>
          <code>{`import numpy as np

x = np.array([-1, 0, 1])  # X uniforme sur {-1, 0, 1}
y = x**2                  # Y dépend entièrement de X
cov = np.mean(x * y) - np.mean(x) * np.mean(y)
print(cov)                # covariance nulle : non corrélées
jointe = np.mean((x == 0) & (y == 0))  # P(X = 0, Y = 0)
print(jointe, np.mean(x == 0) * np.mean(y == 0))
# 0.0
# 0.3333333333333333 0.1111111111111111`}</code>
        </pre>
        <p>
          <Tex>{"P(X = 0, Y = 0) = 1/3"}</Tex> alors que <Tex>{"P(X = 0)\\,P(Y = 0) = 1/9"}</Tex> : les deux variables
          ne sont pas indépendantes.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>La matrice de covariance, et la PCA</h2>
        <p>
          Pour un vecteur aléatoire <Tex>{"x \\in \\mathbb{R}^D"}</Tex> de moyenne <Tex>\mu</Tex>, on range toutes
          les covariances dans une matrice <Tex>{"D \\times D"}</Tex> (MML, définition 6.7) : la variance de chaque
          coordonnée sur la diagonale, les covariances croisées ailleurs.
        </p>
        <Tex block>{"\\Sigma = E\\big((x - \\mu)(x - \\mu)^\\top\\big) \\qquad \\Sigma_{ij} = \\text{Cov}(x_i, x_j)"}</Tex>
        <p>
          <Tex>\Sigma</Tex> est symétrique et semi-définie positive. Sur des données <Tex>{"x_1, \\dots, x_N"}</Tex>,
          on l'estime par la <strong>covariance empirique</strong>{" "}
          <Tex>{"\\hat\\Sigma = \\frac1N \\sum_n (x_n - \\bar x)(x_n - \\bar x)^\\top"}</Tex> (équation 6.42). MML
          utilise ce facteur <Tex>{"1/N"}</Tex> et précise que la version sans biais divise par{" "}
          <Tex>{"N - 1"}</Tex> ; c'est ce qui distingue <code>bias=True</code> du défaut de <code>np.cov</code>.
        </p>
        <p>
          <strong>Transformation affine.</strong> Pour <Tex>{"y = Ax + b"}</Tex>, on a{" "}
          <Tex>{"E(y) = A\\mu + b"}</Tex> et <Tex>{"V(y) = A \\Sigma A^\\top"}</Tex> (équations 6.50 et 6.51). En
          particulier, la projection <Tex>{"u^\\top x"}</Tex> sur un vecteur unitaire <Tex>u</Tex> a pour variance{" "}
          <Tex>{"u^\\top \\Sigma u"}</Tex>. Le chapitre Matrices symétriques a montré que{" "}
          <Tex>{"\\lambda_{\\min} \\le u^\\top \\Sigma u \\le \\lambda_{\\max}"}</Tex> pour <Tex>{"\\|u\\| = 1"}</Tex> :
          le maximum est la plus grande valeur propre de <Tex>\Sigma</Tex>, atteint sur son vecteur propre. Cette direction est le premier axe de la{" "}
          <strong>PCA</strong>, que le chapitre SVD obtenait à partir des données centrées.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
N = 10_000
z = rng.standard_normal((N, 2))
X = z @ np.array([[2.0, 0.0], [1.2, 0.5]])  # deux features liées
S = np.cov(X, rowvar=False, bias=True)  # 1/N, comme MML (6.42)
print(S.round(2))
vals, vecs = np.linalg.eigh(S)
u = vecs[:, -1]  # direction de plus grande variance
print(vals.round(2), u.round(2))
print(np.var(X @ u).round(2), (u @ S @ u).round(2))
print(np.var(X @ np.array([1.0, 0.0])).round(2))
# [[5.33 0.58]
#  [0.58 0.25]]
# [0.18 5.4 ] [-0.99 -0.11]
# 5.4 5.4
# 5.33`}</code>
        </pre>
        <p>
          La variance des données projetées sur <Tex>u</Tex> vaut bien <Tex>{"u^\\top \\hat\\Sigma u"}</Tex>, égale à
          la plus grande valeur propre, 5,4, et dépasse celle de n'importe quel axe, comme le premier (5,33). Le signe
          de <Tex>u</Tex> est arbitraire : <Tex>{"-u"}</Tex> est aussi un vecteur propre.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Espérance conditionnelle : le meilleur prédicteur</h2>
        <p>
          L'<strong>espérance conditionnelle</strong> de <Tex>Y</Tex> sachant un événement <Tex>F</Tex> est
          l'espérance calculée avec la loi conditionnelle (Grinstead et Snell, définition 6.2) :{" "}
          <Tex>{"E(Y \\mid F) = \\sum_y y\\, P(Y = y \\mid F)"}</Tex>. Si les événements{" "}
          <Tex>{"F_1, \\dots, F_r"}</Tex> partitionnent l'univers, on retrouve l'espérance totale en moyennant
          (théorème 6.5) :
        </p>
        <Tex block>{"E(Y) = \\sum_j E(Y \\mid F_j)\\, P(F_j)"}</Tex>
        <p>
          C'est la formule des probabilités totales du chapitre 2, appliquée aux moyennes. Par exemple, si un modèle
          a une perte moyenne de 0,2 sur les images de jour (70 % des données) et de 0,8 sur celles de nuit, sa perte
          moyenne globale est <Tex>{"0{,}2 \\times 0{,}7 + 0{,}8 \\times 0{,}3 = 0{,}38"}</Tex>.
        </p>
        <p>
          Avec <Tex>{"F = \\{X = x\\}"}</Tex>, on obtient une fonction de <Tex>x</Tex>,{" "}
          <Tex>{"x \\mapsto E(Y \\mid X = x)"}</Tex>. Bishop (PRML, section 1.5.5, équations 1.89 et 1.90) montre que
          c'est la meilleure prédiction de <Tex>Y</Tex> à partir de <Tex>X</Tex> au sens de la perte quadratique. La
          perte attendue de n'importe quel prédicteur <Tex>h</Tex> se découpe en deux termes :
        </p>
        <Tex block>{"E\\big((h(X) - Y)^2\\big) = E\\big((h(X) - E(Y \\mid X))^2\\big) + E\\big((E(Y \\mid X) - Y)^2\\big)"}</Tex>
        <p>
          Seul le premier dépend de <Tex>h</Tex>, et il s'annule pour <Tex>{"h(x) = E(Y \\mid X = x)"}</Tex>. Le
          second est le bruit que rien ne peut enlever. Une régression par moindres carrés cherche donc, dans sa
          famille de fonctions, la plus proche de <Tex>{"E(Y \\mid X)"}</Tex>. Ci-dessous, <Tex>{"Y = X^2"}</Tex> plus
          un bruit de variance 2/3 : la moyenne par valeur de <Tex>X</Tex> atteint ce plancher de 2/3, alors que la
          meilleure droite en reste loin.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
x = rng.integers(1, 7, size=100_000)          # un dé
y = x**2 + rng.integers(-1, 2, size=x.size)   # bruit -1, 0 ou 1
cond = {k: y[x == k].mean() for k in range(1, 7)}
pred_cond = np.array([cond[k] for k in x])
a, b = np.polyfit(x, y, 1)                    # meilleure droite
print(np.mean((y - pred_cond)**2).round(3))   # E(Y | X)
print(np.mean((y - (a * x + b))**2).round(3))  # droite
# 0.666
# 6.887`}</code>
        </pre>
      </section>
    </LessonFlow>
  );
}
