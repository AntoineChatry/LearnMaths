import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { SpanViz } from "./SpanViz";

export function EspacesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Des vecteurs sans redondance</h2>
        <p>
          Les colonnes <Tex>{"(1, 2, 3)"}</Tex>, <Tex>{"(4, 5, 6)"}</Tex> et <Tex>{"(7, 8, 9)"}</Tex> ont l'air de
          contenir trois informations différentes. Pourtant la troisième se déduit des deux autres :
        </p>
        <Tex block>{"(7, 8, 9) = 2\\,(4, 5, 6) - (1, 2, 3)"}</Tex>
        <p>
          Elle est <strong>redondante</strong>. Pour le dire sans privilégier aucun vecteur, on passe tout du même
          côté : <Tex>{"1\\,(1, 2, 3) - 2\\,(4, 5, 6) + 1\\,(7, 8, 9) = 0"}</Tex>. D'où la définition.
        </p>
        <p>
          Des vecteurs <Tex>{"v_1, \\dots, v_k"}</Tex> sont <strong>linéairement indépendants</strong> si la seule
          combinaison qui donne le vecteur nul est la combinaison triviale :
        </p>
        <Tex block>{"\\lambda_1 v_1 + \\dots + \\lambda_k v_k = 0 \\quad\\Longrightarrow\\quad \\lambda_1 = \\dots = \\lambda_k = 0"}</Tex>
        <p>
          Sinon, ils sont <strong>liés</strong> (linéairement dépendants) : une combinaison non triviale donne 0, et
          on peut alors isoler un vecteur dont le coefficient est non nul pour l'exprimer avec les autres.
        </p>
        <p>
          Pour tester, on range les vecteurs en colonnes d'une matrice <Tex>A</Tex> : la question devient «{" "}
          <Tex>{"A\\lambda = 0"}</Tex> a-t-il une autre solution que <Tex>{"\\lambda = 0"}</Tex> ? ». C'est un
          système, et le chapitre précédent y répond : les colonnes sont indépendantes exactement quand
          l'élimination trouve un pivot dans chaque colonne, c'est-à-dire sans variable libre.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>L'espace engendré</h2>
        <p>
          L'ensemble de toutes les combinaisons linéaires de <Tex>{"v_1, \\dots, v_k"}</Tex> s'appelle l'
          <strong>espace engendré</strong>, noté <Tex>{"\\text{Vect}(v_1, \\dots, v_k)"}</Tex> (en anglais{" "}
          <em>span</em>). Deux vecteurs du plan non colinéaires engendrent tout le plan ; deux vecteurs colinéaires
          n'engendrent qu'une droite. Essaie d'atteindre le point orange <Tex>b</Tex>, puis rends{" "}
          <Tex>u</Tex> et <Tex>v</Tex> colinéaires :
        </p>
        <SpanViz />
        <p>
          Un espace engendré a deux propriétés : il contient 0, et il est stable par combinaison linéaire (une
          combinaison de combinaisons reste une combinaison). Un ensemble qui vérifie ces deux propriétés est un{" "}
          <strong>sous-espace vectoriel</strong>. Dans l'espace, ce sont : le point 0, les droites et les plans{" "}
          <em>passant par l'origine</em>, et l'espace entier. Une droite qui ne passe pas par 0 n'en est pas un.
        </p>
        <p>
          Le plus important est l'espace engendré par les colonnes d'une matrice, son{" "}
          <strong>image</strong> (ou espace des colonnes) : c'est l'ensemble des <Tex>{"Ax"}</Tex>. La lecture par
          colonnes donne alors une réponse géométrique à la question du chapitre 3 :
        </p>
        <Tex block>{"Ax = b \\text{ a une solution} \\iff b \\text{ est une combinaison des colonnes de } A"}</Tex>
        <Tex block>{"\\iff b \\in \\text{Im}(A)"}</Tex>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Base et dimension</h2>
        <p>
          Une <strong>base</strong> d'un sous-espace est une famille de vecteurs à la fois indépendants et qui
          l'engendrent : assez de vecteurs pour tout atteindre, aucun de trop. Par exemple{" "}
          <Tex>{"e_1, \\dots, e_n"}</Tex> est une base de <Tex>{"\\mathbb{R}^n"}</Tex>, et{" "}
          <Tex>{"(1, 1), (1, -1)"}</Tex> en est une autre de <Tex>{"\\mathbb{R}^2"}</Tex>.
        </p>
        <p>
          Dans une base, chaque vecteur s'écrit d'une <strong>seule</strong> façon. Preuve : si{" "}
          <Tex>{"x = \\sum \\lambda_i v_i = \\sum \\mu_i v_i"}</Tex>, la différence donne{" "}
          <Tex>{"\\sum (\\lambda_i - \\mu_i)\\,v_i = 0"}</Tex>, et l'indépendance force{" "}
          <Tex>{"\\lambda_i = \\mu_i"}</Tex> pour tout <Tex>i</Tex>. Ces coefficients uniques sont les{" "}
          <strong>coordonnées</strong> de <Tex>x</Tex> dans la base. Dans la viz, <Tex>{"b = (3, -1)"}</Tex> a pour
          coordonnées <Tex>{"(1, 2)"}</Tex> dans la base <Tex>{"(1, 1), (1, -1)"}</Tex> :
        </p>
        <Tex block>{"1\\,(1, 1) + 2\\,(1, -1) = (3, -1)"}</Tex>
        <p>
          Un théorème, qu'on admet ici, dit que toutes les bases d'un même sous-espace ont le même nombre de
          vecteurs. Ce nombre est sa <strong>dimension</strong> : 1 pour une droite, 2 pour un plan,{" "}
          <Tex>n</Tex> pour <Tex>{"\\mathbb{R}^n"}</Tex>. Conséquence utile : dans <Tex>{"\\mathbb{R}^n"}</Tex>, plus
          de <Tex>n</Tex> vecteurs sont forcément liés.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le rang</h2>
        <p>
          Le <strong>rang</strong> d'une matrice <Tex>A</Tex>, noté <Tex>{"\\text{rg}(A)"}</Tex>, est le nombre
          maximal de colonnes indépendantes, autrement dit la dimension de son image. On le lit sur l'élimination :
          c'est le <strong>nombre de pivots</strong>. La matrice aux colonnes <Tex>{"(1, 2, 3), (4, 5, 6), (7, 8, 9)"}</Tex>{" "}
          a trois colonnes mais un rang de 2.
        </p>
        <p>
          Un fait moins évident, qu'on admet aussi : le nombre de lignes indépendantes est égal au nombre de colonnes
          indépendantes, <Tex>{"\\text{rg}(A) = \\text{rg}(A^\\top)"}</Tex>. Une matrice{" "}
          <Tex>{"m \\times n"}</Tex> a donc un rang au plus <Tex>{"\\min(m, n)"}</Tex> ; si elle atteint ce maximum,
          elle est de <strong>rang plein</strong>. Deux faits à retenir :
        </p>
        <ul>
          <li>
            <Tex>{"Ax = b"}</Tex> a une solution si et seulement si ajouter la colonne <Tex>b</Tex> ne change pas le
            rang : <Tex>{"\\text{rg}(A) = \\text{rg}(A \\mid b)"}</Tex>. C'est la version « rang » de{" "}
            <Tex>{"b \\in \\text{Im}(A)"}</Tex> ;
          </li>
          <li>
            une matrice carrée <Tex>{"n \\times n"}</Tex> est inversible si et seulement si son rang vaut{" "}
            <Tex>n</Tex> : un pivot par colonne, donc une solution unique pour tout <Tex>b</Tex>.
          </li>
        </ul>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <pre>
            <code>{`import numpy as np

A = np.array([[1, 4, 7],
              [2, 5, 8],
              [3, 6, 9]])
print(np.linalg.matrix_rank(A))            # 2
print(A[:, 2] - (2 * A[:, 1] - A[:, 0]))   # [0 0 0]`}</code>
          </pre>
          <p>
            En flottants, le rang se calcule en décidant quels nombres minuscules sont des « zéros » arrondis :{" "}
            <code>matrix_rank</code> utilise pour cela la SVD du chapitre 9, avec un seuil de tolérance.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Le noyau et le théorème du rang</h2>
        <p>
          Le <strong>noyau</strong> de <Tex>A</Tex> est l'ensemble des solutions de <Tex>{"Ax = 0"}</Tex>. C'est un
          sous-espace : si <Tex>{"Ax = 0"}</Tex> et <Tex>{"Ay = 0"}</Tex>, alors{" "}
          <Tex>{"A(\\lambda x + \\mu y) = 0"}</Tex>. Pour <Tex>A</Tex> de taille <Tex>{"m \\times n"}</Tex>,
          l'élimination répartit les <Tex>n</Tex> inconnues en deux groupes : celles qui ont un pivot, au nombre de{" "}
          <Tex>{"\\text{rg}(A)"}</Tex>, et les libres. Chaque variable libre fournit un vecteur de base du noyau (on
          la met à 1, les autres libres à 0, et on remonte). D'où le <strong>théorème du rang</strong> :
        </p>
        <Tex block>{"\\dim \\ker(A) + \\text{rg}(A) = n"}</Tex>
        <p>
          Ce que la matrice écrase (le noyau) plus ce qu'elle garde (l'image) redonne toute la dimension de départ.
          L'exemple du chapitre 3 le montrait déjà : 3 inconnues, 2 pivots, et un noyau de dimension 1, la droite
          dirigée par <Tex>{"(1, -2, 1)"}</Tex>.
        </p>
        <p>
          Enfin, si <Tex>{"x_p"}</Tex> est <em>une</em> solution de <Tex>{"Ax = b"}</Tex>, toutes les solutions sont{" "}
          <Tex>{"x_p + z"}</Tex> avec <Tex>z</Tex> dans le noyau, car <Tex>{"A(x - x_p) = b - b = 0"}</Tex>. La
          solution est unique exactement quand le noyau est réduit à 0, c'est-à-dire quand les colonnes sont
          indépendantes.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>Le rang en machine learning</h2>
        <p>
          <strong>Des features redondantes.</strong> Si une colonne de la matrice de données <Tex>X</Tex> est une
          combinaison des autres (la même mesure en deux unités, par exemple), <Tex>X</Tex> n'est pas de rang plein
          et son noyau contient un vecteur non nul <Tex>z</Tex>. Alors <Tex>{"w"}</Tex> et <Tex>{"w + z"}</Tex>{" "}
          donnent exactement les mêmes prédictions : les équations normales ont une infinité de solutions. Et le
          calcul flottant ne prévient pas toujours :
        </p>
        <pre>
          <code>{`import numpy as np

x = np.array([30.0, 45.0, 60.0, 80.0])  # surface en m²
# 2e colonne = 2 fois la 1re
X = np.column_stack([x, 2 * x, np.ones(4)])
y = np.array([150.0, 200.0, 260.0, 330.0])
print(np.linalg.matrix_rank(X))  # 2 : trois colonnes, rang 2

w = np.linalg.solve(X.T @ X, X.T @ y)  # aucune erreur...
print(w)  # [ 0.254  1.690 39.635] (environ)
# (2, -1, 0) est dans le noyau de X
autre = w + 5 * np.array([2.0, -1.0, 0.0])
print(np.allclose(X @ w, X @ autre))  # True : mêmes prédictions`}</code>
        </pre>
        <p>
          Les arrondis ont rendu <Tex>{"X^\\top X"}</Tex> « presque » inversible, et <code>solve</code> a rendu une
          solution parmi une infinité, choisie par le bruit numérique. Les poids individuels n'ont alors aucun sens :
          seule la combinaison <Tex>{"w_1 + 2w_2"}</Tex> est déterminée par les données.
        </p>
        <p>
          <strong>LoRA.</strong> Hu et al. (2021) partent d'un constat : pendant le fine-tuning, la modification{" "}
          <Tex>{"\\Delta W"}</Tex> d'une matrice de poids <Tex>{"W_0 \\in \\mathbb{R}^{d \\times k}"}</Tex> a, selon
          leur hypothèse, un faible « rang intrinsèque ». Ils l'imposent en l'écrivant comme un produit :
        </p>
        <Tex block>{"W_0 + \\Delta W = W_0 + BA, \\qquad B \\in \\mathbb{R}^{d \\times r},\\ A \\in \\mathbb{R}^{r \\times k},\\ r \\ll \\min(d, k)"}</Tex>
        <p>
          Chaque colonne de <Tex>{"BA"}</Tex> est une combinaison des <Tex>r</Tex> colonnes de <Tex>B</Tex>, donc{" "}
          <Tex>{"\\text{rg}(BA) \\le r"}</Tex>. Et on n'entraîne que <Tex>{"r(d + k)"}</Tex> nombres au lieu de{" "}
          <Tex>{"dk"}</Tex> :
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
d, k, r = 512, 512, 8
B = rng.standard_normal((d, r))
A = rng.standard_normal((r, k))
W = rng.standard_normal((d, k))
print(np.linalg.matrix_rank(W))       # 512 : rang plein
print(np.linalg.matrix_rank(B @ A))   # 8
print(d * k, r * (d + k))             # 262144 8192`}</code>
        </pre>
        <p>
          Trente-deux fois moins de paramètres pour cette couche. Comment trouver la meilleure approximation de rang{" "}
          <Tex>r</Tex> d'une matrice donnée, c'est la SVD, au chapitre 9.
        </p>
      </section>
    </LessonFlow>
  );
}
