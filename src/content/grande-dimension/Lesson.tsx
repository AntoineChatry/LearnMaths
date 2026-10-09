import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { AngleViz } from "./AngleViz";

export function GrandeDimensionLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Tous les vecteurs ont la même longueur</h2>
        <p>
          Un plongement de mot, une ligne d'activations, une image aplatie : en apprentissage profond, les vecteurs
          ont des centaines ou des milliers de coordonnées, et la géométrie de ces espaces ne ressemble pas à celle du
          plan. Prenons <Tex>{"X \\in \\mathbb R^d"}</Tex> à coordonnées indépendantes, centrées, de variance 1.
          Par linéarité de l'espérance :
        </p>
        <Tex block>{"\\mathbb E\\,\\|X\\|^2 = \\sum_{i=1}^d \\mathbb E\\,X_i^2 = d"}</Tex>
        <p>
          La norme vaut donc environ <Tex>{"\\sqrt d"}</Tex>. Le fait remarquable est l'écart : pour des coordonnées
          sous-gaussiennes (une loi normale par exemple), <Tex>{"\\|X\\| - \\sqrt d"}</Tex> reste de l'ordre de 1,{" "}
          <em>quelle que soit la dimension</em> (Vershynin, théorème 3.1.1). L'idée de la preuve est celle du
          chapitre 1 : <Tex>{"\\|X\\|^2"}</Tex> est une somme de <Tex>d</Tex> termes indépendants, donc il se
          concentre autour de <Tex>d</Tex> avec un écart en <Tex>{"\\sqrt d"}</Tex>, et{" "}
          <Tex>{"\\sqrt{d \\pm O(\\sqrt d)} = \\sqrt d \\pm O(1)"}</Tex> (remarque 3.1.2).
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
for d in [2, 10, 100, 1000, 10000]:
    X = rng.standard_normal((2000, d))           # 2 000 vecteurs aléatoires, coordonnées N(0, 1)
    normes = np.linalg.norm(X, axis=1)
    print(d, round(np.sqrt(d), 1), round(normes.mean(), 1), round(normes.std(), 2), round(normes.min() / normes.max(), 2))
# 2 1.4 1.3 0.64 0.01
# 10 3.2 3.1 0.69 0.23
# 100 10.0 10.0 0.68 0.63
# 1000 31.6 31.6 0.7 0.85
# 10000 100.0 100.0 0.71 0.95`}</code>
        </pre>
        <p>
          L'écart-type de la norme reste vers 0,7 pendant que la norme moyenne passe de 1,3 à 100. En dimension
          10 000, le plus court des 2 000 vecteurs mesure 95 % du plus long : ils vivent tous sur une{" "}
          <strong>coquille mince</strong> de rayon <Tex>{"\\sqrt d"}</Tex>. La densité de la loi normale est
          pourtant maximale en 0 ; mais une boule autour de l'origine a un volume si petit en grande dimension
          qu'aucun tirage n'y tombe. Vershynin résume :{" "}
          <Tex>{"N(0, I_d) \\approx \\mathrm{Unif}(\\sqrt d\\, S^{d-1})"}</Tex>, la loi uniforme sur la sphère de
          rayon <Tex>{"\\sqrt d"}</Tex> (équation 3.17).
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Deux directions au hasard sont presque orthogonales</h2>
        <p>
          Prenons maintenant deux vecteurs unitaires indépendants <Tex>X</Tex> et <Tex>Y</Tex>, de direction
          uniforme. Par symétrie, les <Tex>d</Tex> coordonnées de <Tex>X</Tex> ont toutes le même carré moyen, et
          leur somme vaut 1, donc <Tex>{"\\mathbb E\\,X_i^2 = 1/d"}</Tex>. On en déduit (Vershynin, section 3.3.3,
          équation 3.14) :
        </p>
        <Tex block>{"\\mathbb E\\,\\langle X, Y\\rangle^2 = \\frac1d \\qquad\\text{donc}\\qquad |\\cos\\theta| = |\\langle X, Y \\rangle| \\approx \\frac{1}{\\sqrt d}"}</Tex>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
for d in [2, 10, 100, 1000, 10000]:
    X = rng.standard_normal((2000, d))
    Y = rng.standard_normal((2000, d))
    cos = (X * Y).sum(axis=1) / (np.linalg.norm(X, axis=1) * np.linalg.norm(Y, axis=1))
    angles = np.degrees(np.arccos(cos))
    print(d, round(np.sqrt((cos**2).mean() * d), 2), np.percentile(angles, [2.5, 97.5]).round(1))
# 2 1.01 [  4.1 176.4]
# 10 1.01 [ 52.8 125.8]
# 100 0.98 [ 79.5 101. ]
# 1000 1.01 [86.4 93.6]
# 10000 1.0 [88.9 91.1]`}</code>
        </pre>
        <p>
          La deuxième colonne vérifie <Tex>{"d \\cdot \\mathbb E \\cos^2\\theta = 1"}</Tex>. Dans le plan, l'angle
          entre deux directions est quelconque ; en dimension 10 000, 95 % des angles tombent entre 88,9° et 91,1°.
          Diviser un vecteur normal par sa norme donne une direction uniforme (équation 3.15) : c'est ainsi qu'on
          tire <Tex>X</Tex> et <Tex>Y</Tex> ici. La loi exacte de l'angle a une densité proportionnelle à{" "}
          <Tex>{"\\sin^{d-2}\\theta"}</Tex> (d'après la remarque 3.3.10 de Vershynin), que l'on peut parcourir
          ci-dessous.
        </p>
        <AngleViz />
        <p>
          Deux conséquences. D'abord, il n'existe pas plus de <Tex>d</Tex> vecteurs exactement orthogonaux, mais on
          peut en loger un nombre exponentiel en <Tex>d</Tex> qui le sont presque, en les tirant au hasard
          (Vershynin, exercice 3.41). Ensuite, pour des vecteurs <Tex>X</Tex>, <Tex>Y</Tex> indépendants à
          coordonnées <Tex>{"N(0, 1)"}</Tex>, <Tex>{"(X - Y)/\\sqrt 2"}</Tex> a encore des coordonnées
          indépendantes de variance 1, donc <Tex>{"\\|X - Y\\| \\approx \\sqrt{2d}"}</Tex> pour presque toutes les
          paires : sur du pur bruit, toutes les distances se ressemblent.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Pourquoi l'attention divise par √d</h2>
        <p>
          Dans un Transformer, une requête <Tex>q</Tex> est comparée à des clés <Tex>{"k_j"}</Tex> par produit
          scalaire, puis un softmax transforme ces scores en poids. Vaswani et al. (2017, section 3.2.1) calculent{" "}
          <Tex>{"\\mathrm{softmax}(QK^\\top/\\sqrt{d_k})\\,V"}</Tex>, et justifient le{" "}
          <Tex>{"\\sqrt{d_k}"}</Tex> dans leur note 4 : si les composantes de <Tex>q</Tex> et <Tex>k</Tex> sont
          indépendantes, de moyenne 0 et de variance 1, alors
        </p>
        <Tex block>{"\\mathrm{Var}(q \\cdot k) = \\sum_{i=1}^{d_k} \\mathrm{Var}(q_i k_i) = d_k"}</Tex>
        <p>
          C'est le même calcul qu'à la section précédente, sans normaliser : l'écart-type des scores croît comme{" "}
          <Tex>{"\\sqrt{d_k}"}</Tex>. Selon eux, des scores aussi grands poussent le softmax vers des régions où ses
          gradients sont extrêmement petits. Mesurons-le, avec 10 clés par requête.
        </p>
        <pre>
          <code>{`import numpy as np

def softmax(z):
    e = np.exp(z - z.max())
    return e / e.sum()

def stats(logits):  # poids max moyen, et taille moyenne du gradient de softmax (norme de diag(p) - p pT)
    p = [softmax(z) for z in logits]
    return np.mean([x.max() for x in p]), np.mean([np.linalg.norm(np.diag(x) - np.outer(x, x)) for x in p])

rng = np.random.default_rng(0)
for dk in [16, 64, 512]:
    q = rng.standard_normal((1000, dk))           # 1 000 requêtes
    k = rng.standard_normal((1000, 10, dk))       # 10 clés chacune
    scores = np.einsum("nd,nkd->nk", q, k)        # produits scalaires q . k
    brut, echelle = stats(scores), stats(scores / np.sqrt(dk))
    print(dk, round(scores.std(), 1), np.round(brut, 3), np.round(echelle, 3))
# 16 4.0 [0.734 0.254] [0.323 0.345]
# 64 8.0 [0.868 0.157] [0.32  0.347]
# 512 22.8 [0.95  0.067] [0.317 0.348]`}</code>
        </pre>
        <p>
          Sans division, l'écart-type des scores vaut 4, 8 puis 22,8, soit <Tex>{"\\sqrt{d_k}"}</Tex>. Pour{" "}
          <Tex>{"d_k = 512"}</Tex>, le softmax met en moyenne 95 % du poids sur une seule clé, et la jacobienne du
          softmax, <Tex>{"\\operatorname{diag}(p) - pp^\\top"}</Tex>, est 5 fois plus petite qu'avec la division :
          le gradient passe mal, et de moins en moins quand <Tex>{"d_k"}</Tex> grandit.
          Avec la division, les scores ont une variance 1 quelle que soit la dimension, et les deux mesures restent
          les mêmes, vers 0,32 et 0,35, pour les trois valeurs de <Tex>{"d_k"}</Tex>. Le{" "}
          <Tex>{"1/\\sqrt{d_k}"}</Tex> n'est pas une astuce empirique : c'est la normalisation qui rend l'écart-type
          d'une somme de <Tex>{"d_k"}</Tex> termes indépendants indépendant de <Tex>{"d_k"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Johnson-Lindenstrauss : réduire la dimension sans tout casser</h2>
        <p>
          La concentration a aussi un côté utile. Projetons <Tex>N</Tex> points de <Tex>{"\\mathbb R^d"}</Tex> par
          une matrice aléatoire <Tex>{"A \\in \\mathbb R^{k \\times d}"}</Tex> à coefficients <Tex>{"N(0, 1)"}</Tex>,
          divisée par <Tex>{"\\sqrt k"}</Tex>. Pour un vecteur <Tex>z</Tex> fixé,{" "}
          <Tex>{"\\|Az\\|^2 / \\|z\\|^2"}</Tex> suit une loi du <Tex>{"\\chi^2"}</Tex> à <Tex>k</Tex> degrés de
          liberté divisée par <Tex>k</Tex> : une moyenne de <Tex>k</Tex> termes indépendants, qui se concentre
          autour de 1 (Mohri, lemmes 15.2 et 15.3). Une borne de la réunion sur les{" "}
          <Tex>{"N^2"}</Tex> paires donne le <strong>lemme de Johnson-Lindenstrauss</strong> : pour{" "}
          <Tex>{"N > 4"}</Tex> points, <Tex>{"0 < \\varepsilon < 1/2"}</Tex> et <Tex>{"k = 20 \\ln N / \\varepsilon^2"}</Tex>, toutes les
          distances au carré sont conservées à un facteur <Tex>{"1 \\pm \\varepsilon"}</Tex> près (Mohri,
          lemme 15.4) :
        </p>
        <Tex block>{"(1 - \\varepsilon)\\,\\|u - v\\|^2 \\le \\Big\\|\\tfrac{1}{\\sqrt k} A u - \\tfrac{1}{\\sqrt k} A v\\Big\\|^2 \\le (1 + \\varepsilon)\\,\\|u - v\\|^2"}</Tex>
        <p>
          Vershynin (théorème 5.3.1) énonce une version pour les distances elles-mêmes et la projection{" "}
          <Tex>P</Tex> sur un sous-espace aléatoire de dimension <Tex>k</Tex>. Par symétrie, chacune des{" "}
          <Tex>k</Tex> coordonnées gardées porte en moyenne <Tex>{"1/d"}</Tex> de <Tex>{"\\|z\\|^2"}</Tex>, d'où{" "}
          <Tex>{"\\mathbb E\\,\\|Pz\\|^2 = \\frac kd \\|z\\|^2"}</Tex> (lemme 5.3.2) et le facteur{" "}
          <Tex>{"\\sqrt{d/k}"}</Tex> qui corrige la projection. Sa condition est{" "}
          <Tex>{"k \\ge C \\varepsilon^{-2} \\ln N"}</Tex>, avec une constante <Tex>C</Tex> non précisée. Point
          frappant : <Tex>k</Tex> ne dépend pas de la dimension de départ <Tex>d</Tex>, seulement du nombre de
          points, et à travers un logarithme.
        </p>
        <pre>
          <code>{`import numpy as np
from math import log
from scipy.spatial.distance import pdist

rng = np.random.default_rng(0)
N, d = 300, 5000
centres = 10 * rng.standard_normal((5, d))
X = centres[rng.integers(0, 5, N)] + rng.standard_normal((N, d))   # 300 points en 5 grappes, en dimension 5 000
D2 = pdist(X) ** 2                                # les 44 850 distances au carré d'origine
for k in [200, 800, 3200]:
    A = rng.standard_normal((k, d)) / np.sqrt(k)  # projection aléatoire (Mohri, lemme 15.4)
    eps = np.abs(pdist(X @ A.T) ** 2 / D2 - 1).max()   # pire déformation sur toutes les paires
    print(k, round(eps, 3), round(20 * log(N) / eps**2))
# 200 0.383 778
# 800 0.192 3102
# 3200 0.09 14038`}</code>
        </pre>
        <p>
          Avec 3 200 dimensions au lieu de 5 000, aucune des 44 850 distances au carré ne bouge de plus de 9 %. Quand{" "}
          <Tex>k</Tex> est multiplié par 4, la pire déformation est divisée par 2 : c'est le{" "}
          <Tex>{"\\varepsilon \\propto 1/\\sqrt k"}</Tex> du lemme. La dernière colonne donne le <Tex>k</Tex> que
          demanderait la formule de Mohri pour la déformation observée, environ 4 fois plus : la constante 20 est
          prudente, la forme est la bonne. Une projection tirée au hasard, sans rien apprendre des données, réduit
          donc la dimension en gardant leur géométrie (Vershynin, section 5.3) : c'est le pendant utile de la
          concentration qui, aux sections 1 et 2, rendait toutes les normes et tous les angles semblables.
        </p>
      </section>
    </LessonFlow>
  );
}
