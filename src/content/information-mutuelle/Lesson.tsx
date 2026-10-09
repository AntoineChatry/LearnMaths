import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { ChannelViz } from "./ChannelViz";

export function InformationMutuelleLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Entropie jointe et entropie conditionnelle</h2>
        <p>
          Pour deux variables <Tex>X</Tex> et <Tex>Y</Tex>, l'<strong>entropie jointe</strong> est simplement
          l'entropie du couple (Cover et Thomas, section 2.2 ; MacKay, équation 8.1) :{" "}
          <Tex>{"H(X, Y) = \\sum_{x, y} p(x, y) \\log_2 \\frac{1}{p(x, y)}"}</Tex>. Une fois <Tex>y</Tex> connu,
          l'incertitude qui reste sur <Tex>X</Tex> est l'entropie de la loi conditionnelle{" "}
          <Tex>{"p(x \\mid y)"}</Tex>, notée <Tex>{"H(X \\mid y)"}</Tex>. L'<strong>entropie conditionnelle</strong>{" "}
          en est la moyenne sur <Tex>y</Tex> (Cover et Thomas, équation 2.10 ; MacKay, équation 8.4 ; PRML, équation
          1.111) :
        </p>
        <Tex block>{"H(X \\mid Y) = \\sum_y p(y)\\, H(X \\mid y) = \\sum_{x, y} p(x, y) \\log_2 \\frac{1}{p(x \\mid y)}"}</Tex>
        <p>
          Comme <Tex>{"p(x, y) = p(x)\\, p(y \\mid x)"}</Tex>, les logarithmes s'additionnent, et en moyenne on obtient
          la <strong>règle de la chaîne</strong> (Cover et Thomas, théorème 2.2.1 ; MacKay, équation 8.7 ; PRML,
          équation 1.112) :
        </p>
        <Tex block>{"H(X, Y) = H(X) + H(Y \\mid X) = H(Y) + H(X \\mid Y)"}</Tex>
        <p>
          L'incertitude sur le couple, c'est l'incertitude sur l'un plus ce qui reste sur l'autre quand on connaît le
          premier. C'est la décomposition par étapes du chapitre Entropie, écrite pour deux variables. Prenons la loi
          jointe de l'exemple 2.2.1 de Cover et Thomas, qui est aussi l'exercice 8.6 de MacKay :
        </p>
        <pre>
          <code>{`import numpy as np
from fractions import Fraction

def H(p):  # entropie en bits d'un tableau de probabilités, quelle que soit sa forme
    p = np.asarray(p, dtype=float).ravel()
    p = p[p > 0]
    return p @ np.log2(1 / p)

# Cover et Thomas, exemple 2.2.1 ; MacKay, exercice 8.6. Lignes : y = 1..4, colonnes : x = 1..4.
P = np.array([[1/8,  1/16, 1/32, 1/32],
              [1/16, 1/8,  1/32, 1/32],
              [1/16, 1/16, 1/16, 1/16],
              [1/4,  0,    0,    0   ]])
px, py = P.sum(axis=0), P.sum(axis=1)
H_X_sachant_y = np.array([H(ligne / ligne.sum()) for ligne in P])  # H(X | y) pour chaque y
H_X_sachant_Y = py @ H_X_sachant_y                                  # leur moyenne
H_Y_sachant_X = px @ [H(col / col.sum()) for col in P.T]
print(H(px), H(py), H(P))
print(H_X_sachant_y)
print(H_X_sachant_Y, H_Y_sachant_X, H(px) + H_Y_sachant_X)
print(Fraction(H_X_sachant_Y), Fraction(H_Y_sachant_X), Fraction(H(P)))
# 1.75 2.0 3.375
# [1.75 1.75 2.   0.  ]
# 1.375 1.625 3.375
# 11/8 13/8 27/8`}</code>
        </pre>
        <p>
          On retrouve les valeurs de Cover et Thomas : <Tex>{"H(X) = \\tfrac74"}</Tex>,{" "}
          <Tex>{"H(Y) = 2"}</Tex>, <Tex>{"H(X \\mid Y) = \\tfrac{11}{8}"}</Tex>,{" "}
          <Tex>{"H(Y \\mid X) = \\tfrac{13}{8}"}</Tex> et <Tex>{"H(X, Y) = \\tfrac{27}{8}"}</Tex>, qui vaut bien{" "}
          <Tex>{"\\tfrac74 + \\tfrac{13}{8}"}</Tex>. Deux remarques. D'abord,{" "}
          <Tex>{"H(X \\mid Y) \\ne H(Y \\mid X)"}</Tex> en général. Ensuite, savoir que <Tex>{"y = 3"}</Tex> fait{" "}
          <em>monter</em> l'incertitude sur <Tex>X</Tex>, de 1,75 à 2 bits (MacKay, solution de l'exercice 8.2).
          Le conditionnement ne réduit l'entropie qu'en moyenne :{" "}
          <Tex>{"H(X \\mid Y) \\le H(X)"}</Tex>, avec égalité si et seulement si <Tex>X</Tex> et <Tex>Y</Tex> sont
          indépendantes (Cover et Thomas, théorème 2.6.5). Leur image : au tribunal, une preuve précise peut semer
          le doute, mais en moyenne les preuves l'éclaircissent.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>L'information mutuelle</h2>
        <p>
          Ce que <Tex>Y</Tex> apprend sur <Tex>X</Tex>, c'est la baisse moyenne de l'incertitude sur <Tex>X</Tex> :
          l'<strong>information mutuelle</strong> (MacKay, équation 8.8 ; Cover et Thomas, théorème 2.4.1 ; PRML,
          équation 1.121). Avec la règle de la chaîne, elle s'écrit de trois façons :
        </p>
        <Tex block>{"\\begin{aligned} I(X ; Y) &= H(X) - H(X \\mid Y) = H(Y) - H(Y \\mid X) \\\\ &= H(X) + H(Y) - H(X, Y) \\end{aligned}"}</Tex>
        <p>
          Elle est donc symétrique : <Tex>X</Tex> en dit autant sur <Tex>Y</Tex> que <Tex>Y</Tex> sur <Tex>X</Tex>.
          C'est aussi une divergence du chapitre précédent, entre la loi jointe et la loi qu'auraient les variables
          si elles étaient indépendantes (Cover et Thomas, équation 2.29 ; PRML, équation 1.120 ; MacKay, équation
          8.11) :
        </p>
        <Tex block>{"I(X ; Y) = D_{\\mathrm{KL}}\\big(p(x, y) \\,\\|\\, p(x)\\, p(y)\\big) = \\sum_{x, y} p(x, y) \\log_2 \\frac{p(x, y)}{p(x)\\, p(y)}"}</Tex>
        <p>
          L'inégalité de Gibbs donne alors <Tex>{"I(X ; Y) \\ge 0"}</Tex>, avec égalité si et seulement si{" "}
          <Tex>X</Tex> et <Tex>Y</Tex> sont indépendantes : c'est le théorème 2.6.5 vu autrement. À l'autre extrême,{" "}
          <Tex>{"I(X ; X) = H(X)"}</Tex>, d'où le nom d'« auto-information » parfois donné à l'entropie (Cover et
          Thomas, équation 2.47).
        </p>
        <pre>
          <code>{`import numpy as np

def H(p):
    p = np.asarray(p, dtype=float).ravel()
    p = p[p > 0]
    return p @ np.log2(1 / p)

def info_mutuelle(P):  # P[y, x] : loi jointe ; KL entre la jointe et le produit des marges
    px, py = P.sum(axis=0), P.sum(axis=1)
    Q = np.outer(py, px)
    m = P > 0
    return P[m] @ np.log2(P[m] / Q[m])

P = np.array([[1/8,  1/16, 1/32, 1/32],          # la loi jointe de la section 1
              [1/16, 1/8,  1/32, 1/32],
              [1/16, 1/16, 1/16, 1/16],
              [1/4,  0,    0,    0   ]])
px, py = P.sum(axis=0), P.sum(axis=1)
print(H(px) + H(py) - H(P), info_mutuelle(P))
print(info_mutuelle(np.outer(py, px)))            # mêmes marges, mais indépendantes
print(info_mutuelle(np.diag(px)), H(px))          # Y = X : I(X ; X) = H(X)
# 0.375 0.375
# 0.0
# 1.75 1.75`}</code>
        </pre>
        <p>
          Les deux calculs donnent les 0,375 bit de Cover et Thomas (exemple 2.4.1). MacKay (figure 8.1) et Cover et
          Thomas (figure 2.2) représentent ces quantités par deux barres qui se chevauchent :{" "}
          <Tex>{"H(X)"}</Tex> et <Tex>{"H(Y)"}</Tex> partagent la part <Tex>{"I(X ; Y)"}</Tex>, et le tout couvre{" "}
          <Tex>{"H(X, Y)"}</Tex>. MacKay prévient que l'image d'ensembles qui se recoupent devient trompeuse dès
          trois variables (exercice 8.8).
        </p>
        <p>
          <strong>Un canal bruité.</strong> On envoie un bit <Tex>X</Tex> équiprobable, et le canal l'inverse avec
          une probabilité <Tex>\varepsilon</Tex> : c'est le canal binaire symétrique (Cover et Thomas, section 7.1.4 ;
          MacKay, section 1.1). Ce qui reste d'incertitude sur la sortie quand on connaît l'entrée, c'est le bruit,{" "}
          <Tex>{"H(Y \\mid X) = H_2(\\varepsilon)"}</Tex>, donc <Tex>{"I(X ; Y) = 1 - H_2(\\varepsilon)"}</Tex>{" "}
          (Cover et Thomas, équations 7.2 à 7.7). Pour <Tex>{"\\varepsilon = 0{,}15"}</Tex>, chaque bit reçu
          n'apporte que <Tex>{"1 - 0{,}61 = 0{,}39"}</Tex> bit sur le bit envoyé (MacKay, équation 9.11).
        </p>
        <ChannelViz />
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le gain d'information des arbres de décision</h2>
        <p>
          Un arbre de décision classe un exemple en posant des questions sur ses attributs. Quelle question poser en
          premier ? L'algorithme ID3 de Quinlan (1986) choisit l'attribut <Tex>A</Tex> qui apporte le plus
          d'information sur la classe <Tex>C</Tex>. Son <strong>gain d'information</strong> est l'entropie de la
          classe, moins l'entropie moyenne qui reste dans chaque branche (Quinlan, section 4 ; Mitchell,{" "}
          <em>Machine Learning</em>, équation 3.4) :
        </p>
        <Tex block>{"\\begin{aligned} \\mathrm{gain}(A) &= H(C) - \\sum_v \\frac{|S_v|}{|S|}\\, H(C \\mid A = v) \\\\ &= H(C) - H(C \\mid A) = I(C ; A) \\end{aligned}"}</Tex>
        <p>
          où <Tex>{"S_v"}</Tex> est l'ensemble des exemples pour lesquels <Tex>A</Tex> vaut <Tex>v</Tex>. C'est
          exactement l'information mutuelle entre l'attribut et la classe, sous la loi empirique des données,
          comme le note Quinlan lui-même (section 4, note 3). Son exemple, repris par Mitchell (table 3.2) : 14 jours,
          quatre attributs météo, et une classe P ou N.
        </p>
        <pre>
          <code>{`import numpy as np
import pandas as pd

def H(y):  # entropie empirique, en bits, d'une colonne d'étiquettes
    p = y.value_counts(normalize=True).to_numpy()
    return p @ np.log2(1 / p)

def gain(df, attribut, cible="classe"):  # H(classe) - H(classe | attribut)
    poids = df[attribut].value_counts(normalize=True)
    reste = sum(poids[v] * H(groupe[cible]) for v, groupe in df.groupby(attribut))
    return H(df[cible]) - reste

# Quinlan (1986), table 1 ; Mitchell (1997), table 3.2
lignes = ["sunny hot high false N", "sunny hot high true N", "overcast hot high false P",
          "rain mild high false P", "rain cool normal false P", "rain cool normal true N",
          "overcast cool normal true P", "sunny mild high false N", "sunny cool normal false P",
          "rain mild normal false P", "sunny mild normal true P", "overcast mild high true P",
          "overcast hot normal false P", "rain mild high true N"]
df = pd.DataFrame([l.split() for l in lignes],
                  columns=["outlook", "temperature", "humidity", "windy", "classe"])
print(round(H(df["classe"]), 4))
for a in ["outlook", "temperature", "humidity", "windy"]:
    print(a, round(gain(df, a), 4))
# 0.9403
# outlook 0.2467
# temperature 0.0292
# humidity 0.1518
# windy 0.0481`}</code>
        </pre>
        <p>
          ID3 met donc <em>outlook</em> à la racine. Quinlan et Mitchell publient 0,246 et 0,151 pour outlook et
          humidity, au lieu de 0,2467 et 0,1518, parce qu'ils soustraient des valeurs déjà arrondies :{" "}
          <Tex>{"0{,}940 - 0{,}694 = 0{,}246"}</Tex>. Puis l'algorithme recommence dans chaque branche.
        </p>
        <p>
          <strong>Un piège.</strong> Le gain favorise les attributs qui ont beaucoup de valeurs. Un attribut « date »,
          différent pour chaque jour, sépare parfaitement les 14 exemples : son gain est maximal, mais il ne prédit
          rien sur un jour nouveau (Quinlan, section 7 ; Mitchell, section 3.7.3). Quinlan propose de diviser le gain
          par l'entropie de l'attribut lui-même, <Tex>{"H(A)"}</Tex> : c'est le <em>rapport de gain</em>. Pour
          outlook, <Tex>{"0{,}246 / 1{,}578 = 0{,}156"}</Tex>. Aujourd'hui, scikit-learn propose ce critère sous le
          nom <code>criterion="entropy"</code>, et sa documentation note qu'il revient à minimiser l'entropie croisée
          des probabilités prédites par l'arbre : le chapitre précédent.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Toute la dépendance, et rien de plus qu'à l'entrée</h2>
        <p>
          <strong>Plus fort que la corrélation.</strong> La covariance du chapitre Lois jointes ne mesure que la
          dépendance <em>linéaire</em> : <Tex>{"Y = X^2"}</Tex> peut avoir une covariance nulle avec <Tex>X</Tex>,
          on l'y a vu. L'information mutuelle,
          elle, ne s'annule que si les variables sont indépendantes, quelle que soit la forme du lien (Cover et
          Thomas, section 2.6 ; PRML, section 1.6).
        </p>
        <p>
          <strong>Le traitement ne crée pas d'information.</strong> Si <Tex>Z</Tex> est calculé à partir de{" "}
          <Tex>Y</Tex> seulement, sans regarder <Tex>X</Tex>, alors <Tex>{"I(X ; Z) \\le I(X ; Y)"}</Tex> : c'est
          l'<strong>inégalité du traitement des données</strong> (Cover et Thomas, théorème 2.8.1 ; MacKay, exercice
          8.9). En particulier <Tex>{"I(X ; g(Y)) \\le I(X ; Y)"}</Tex> pour toute fonction <Tex>g</Tex>. Tishby et
          Zaslavsky (2015, équation 4) l'appliquent aux réseaux de neurones : chaque couche ne voit que la
          précédente, donc l'information sur l'étiquette <Tex>Y</Tex> perdue par une couche ne peut être retrouvée
          par les suivantes,
        </p>
        <Tex block>{"I(Y ; X) \\ge I(Y ; h_1) \\ge I(Y ; h_2) \\ge \\dots \\ge I(Y ; \\hat Y)"}</Tex>
        <pre>
          <code>{`import numpy as np

def H(p):
    p = np.asarray(p, dtype=float).ravel()
    p = p[p > 0]
    return p @ np.log2(1 / p)

def info_mutuelle(a, b):  # deux variables discrètes, données par leurs valeurs sur des issues équiprobables
    va, ia = np.unique(a, return_inverse=True)
    vb, ib = np.unique(b, return_inverse=True)
    P = np.zeros((len(va), len(vb)))
    np.add.at(P, (ia, ib), 1 / len(a))
    return H(P.sum(axis=1)) + H(P.sum(axis=0)) - H(P)

x = np.array([-1, 0, 1])                    # X uniforme sur {-1, 0, 1}
y = x ** 2                                  # Y est une fonction de X
print(np.corrcoef(x, y)[0, 1].round(3), info_mutuelle(x, y).round(3))

x = np.arange(8)                            # X uniforme sur 0..7 : 3 bits
c = x % 2                                   # l'étiquette à prédire : la parité
print(info_mutuelle(c, x), info_mutuelle(c, x // 2), info_mutuelle(c, x % 4))
# 0.0 0.918
# 1.0 0.0 1.0`}</code>
        </pre>
        <p>
          <Tex>{"Y = X^2"}</Tex> est entièrement déterminé par <Tex>X</Tex>, et pourtant leur corrélation est nulle ;
          l'information mutuelle, elle, vaut 0,918 bit, toute l'entropie de <Tex>Y</Tex>. Ensuite, deux «
          couches » qui gardent chacune 2 bits sur les 3 de <Tex>X</Tex> : <Tex>{"\\lfloor x/2 \\rfloor"}</Tex> jette
          le bit de parité, et plus aucun calcul ne pourra prédire l'étiquette ; <Tex>{"x \\bmod 4"}</Tex> le garde.
          Ce n'est pas la quantité d'information conservée qui compte, c'est laquelle.
        </p>
      </section>
    </LessonFlow>
  );
}
