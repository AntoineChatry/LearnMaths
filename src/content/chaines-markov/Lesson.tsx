import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { OzViz } from "./OzViz";

export function ChainesMarkovLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Le futur ne dépend que du présent</h2>
        <p>
          Jusqu'ici, les tirages successifs étaient indépendants : le résultat d'un lancer ne disait rien du suivant.
          Une <strong>chaîne de Markov</strong> autorise une dépendance, mais une seule : l'état suivant dépend de
          l'état présent, et pas du chemin qui y a mené. Pour une suite <Tex>{"X_0, X_1, X_2, \\dots"}</Tex> à
          valeurs dans un ensemble fini d'états, c'est la <strong>propriété de Markov</strong> (Levin et Peres,
          équation 1.1 ; Bishop, équation 11.37) :
        </p>
        <Tex block>{"\\begin{aligned} &P(X_{t+1} = y \\mid X_t = x,\\ X_{t-1} = x_{t-1},\\ \\dots,\\ X_0 = x_0) \\\\ &\\quad = P(X_{t+1} = y \\mid X_t = x) = P(x, y) \\end{aligned}"}</Tex>
        <p>
          La probabilité <Tex>{"P(x, y)"}</Tex> de passer de <Tex>x</Tex> à <Tex>y</Tex> ne dépend pas non plus de{" "}
          <Tex>t</Tex> (chaîne <em>homogène</em>). Tout tient donc dans la <strong>matrice de transition</strong>{" "}
          <Tex>P</Tex>, dont la ligne <Tex>x</Tex> est la loi de l'état suivant quand on est en <Tex>x</Tex>. Ses
          coefficients sont positifs et chaque ligne somme à 1 : on dit que <Tex>P</Tex> est{" "}
          <strong>stochastique</strong>. L'exemple classique de Grinstead et Snell (exemple 11.1) est la météo du
          pays d'Oz : il n'y fait jamais beau deux jours de suite ; après un beau jour, pluie et neige sont également
          probables ; après de la pluie ou de la neige, le même temps revient une fois sur deux, et sinon il fait beau
          une fois sur deux.
        </p>
        <Tex block>{"P = \\begin{array}{c|ccc} & \\text{Pluie} & \\text{Beau} & \\text{Neige} \\\\ \\hline \\text{Pluie} & 1/2 & 1/4 & 1/4 \\\\ \\text{Beau} & 1/2 & 0 & 1/2 \\\\ \\text{Neige} & 1/4 & 1/4 & 1/2 \\end{array}"}</Tex>
        <p>
          Lire une ligne, c'est lire une prévision : s'il pleut aujourd'hui, demain il pleut avec probabilité 1/2,
          il fait beau avec probabilité 1/4, il neige avec probabilité 1/4.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Plusieurs pas : les puissances de P</h2>
        <p>
          S'il pleut aujourd'hui, quelle est la probabilité qu'il neige après-demain ? Il faut passer par le temps de
          demain, qui peut être pluie, beau ou neige. Ces trois chemins sont disjoints, et chacun a pour probabilité
          un produit de deux transitions :
        </p>
        <Tex block>{"\\begin{aligned} p^{(2)}_{\\text{P,N}} &= p_{\\text{P,P}}\\,p_{\\text{P,N}} + p_{\\text{P,B}}\\,p_{\\text{B,N}} + p_{\\text{P,N}}\\,p_{\\text{N,N}} \\\\ &= \\tfrac12 \\cdot \\tfrac14 + \\tfrac14 \\cdot \\tfrac12 + \\tfrac14 \\cdot \\tfrac12 = \\tfrac38 \\end{aligned}"}</Tex>
        <p>
          C'est le produit scalaire de la ligne « Pluie » de <Tex>P</Tex> par sa colonne « Neige », c'est-à-dire un
          coefficient de <Tex>{"P^2"}</Tex>. Par récurrence, le coefficient <Tex>{"(x, y)"}</Tex> de{" "}
          <Tex>{"P^n"}</Tex> est la probabilité d'être en <Tex>y</Tex> après <Tex>n</Tex> pas en partant de{" "}
          <Tex>x</Tex> (Grinstead et Snell, théorème 11.1) :
        </p>
        <Tex block>{"P(X_n = y \\mid X_0 = x) = (P^n)(x, y)"}</Tex>
        <pre>
          <code>{`import numpy as np

# Pays d'Oz (Grinstead et Snell, exemple 11.1) : états Pluie, Beau, Neige
P = np.array([[1/2, 1/4, 1/4],
              [1/2, 0,   1/2],
              [1/4, 1/4, 1/2]])
print(P.sum(axis=1))                          # chaque ligne est une loi : somme 1
P2 = P @ P
print(P2[0, 2], sum(P[0, k] * P[k, 2] for k in range(3)))   # p(2) Pluie -> Neige, deux façons
for n in [2, 3, 6]:
    print(n, np.linalg.matrix_power(P, n).round(3).tolist())
# [1. 1. 1.]
# 0.375 0.375
# 2 [[0.438, 0.188, 0.375], [0.375, 0.25, 0.375], [0.375, 0.188, 0.438]]
# 3 [[0.406, 0.203, 0.391], [0.406, 0.188, 0.406], [0.391, 0.203, 0.406]]
# 6 [[0.4, 0.2, 0.4], [0.4, 0.2, 0.4], [0.4, 0.2, 0.4]]`}</code>
        </pre>
        <p>
          Ces puissances sont celles du tableau 11.1 de Grinstead et Snell. Il fait beau après-demain avec
          probabilité 0,25 s'il fait beau aujourd'hui, alors que c'est impossible demain : <Tex>{"P^2"}</Tex> peut
          avoir un coefficient non nul là où <Tex>P</Tex> a un 0. Et dès <Tex>{"n = 6"}</Tex>, les trois lignes
          sont identiques à trois décimales près : la prévision à six jours ne dépend plus du temps d'aujourd'hui.
          Ce phénomène est le sujet du chapitre suivant.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>La loi au jour n</h2>
        <p>
          Si l'état de départ est lui-même aléatoire, de loi <Tex>u</Tex>, on range cette loi dans un{" "}
          <em>vecteur ligne</em>. En conditionnant sur l'état présent, la loi de l'état suivant est{" "}
          <Tex>{"u^{(1)}(y) = \\sum_x u(x)\\,P(x, y)"}</Tex> (Bishop, équation 11.38), c'est-à-dire{" "}
          <Tex>{"u^{(1)} = uP"}</Tex>. En répétant (Levin et Peres, équations 1.6 et 1.7 ; Grinstead et Snell,
          théorème 11.2) :
        </p>
        <Tex block>{"u^{(n)} = u\\,P^n"}</Tex>
        <p>
          On multiplie à droite, parce que les lignes de <Tex>P</Tex> sont indexées par l'état de départ. La
          probabilité d'une trajectoire entière est un produit, par la règle de multiplication des probabilités
          conditionnelles et la propriété de Markov :
        </p>
        <Tex block>{"\\begin{aligned} &P(X_0 = x_0, X_1 = x_1, \\dots, X_n = x_n) \\\\ &\\quad = u(x_0)\\,P(x_0, x_1)\\,P(x_1, x_2) \\cdots P(x_{n-1}, x_n) \\end{aligned}"}</Tex>
        <pre>
          <code>{`import numpy as np

P = np.array([[1/2, 1/4, 1/4],
              [1/2, 0,   1/2],
              [1/4, 1/4, 1/2]])
u = np.array([1/3, 1/3, 1/3])                 # jour 0 : météo tirée au hasard
for n in [1, 2, 3, 10]:
    print(n, (u @ np.linalg.matrix_power(P, n)).round(3))
# trajectoire Pluie, Pluie, Beau, Neige en partant de Pluie
print(P[0, 0] * P[0, 1] * P[1, 2])
rng = np.random.default_rng(0)
X = np.zeros((100000, 4), dtype=int)          # 100 000 chaînes simulées, toutes parties de Pluie (état 0)
for t in range(1, 4):
    for i in range(100000):
        X[i, t] = rng.choice(3, p=P[X[i, t - 1]])
print((X[:, 1:] == [0, 1, 2]).all(axis=1).mean(), np.bincount(X[:, 3]) / 100000)
print(np.linalg.matrix_power(P, 3)[0].round(3))
# 1 [0.417 0.167 0.417]
# 2 [0.396 0.208 0.396]
# 3 [0.401 0.198 0.401]
# 10 [0.4 0.2 0.4]
# 0.0625
# 0.06161 [0.40725 0.2038  0.38895]
# [0.406 0.203 0.391]`}</code>
        </pre>
        <p>
          La ligne <Tex>{"n = 3"}</Tex> est l'exemple 11.3 de Grinstead et Snell, (0,401 ; 0,198 ; 0,401). La
          trajectoire pluie, pluie, beau, neige a pour probabilité{" "}
          <Tex>{"\\tfrac12 \\cdot \\tfrac14 \\cdot \\tfrac12 = \\tfrac1{16}"}</Tex>, et la simulation de 100 000
          chaînes la retrouve (0,0616), comme elle retrouve la ligne « Pluie » de <Tex>{"P^3"}</Tex> à moins de
          0,003 près. Choisissez ci-dessous le point de départ et faites avancer les jours.
        </p>
        <OzViz />
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Un modèle bigramme est une chaîne de Markov</h2>
        <p>
          Un modèle de langage donne la probabilité du mot suivant sachant les précédents, et la probabilité d'une
          phrase est le produit de ces probabilités conditionnelles (Jurafsky et Martin, <em>Speech and Language
          Processing</em>, équation 3.4). Le modèle <strong>bigramme</strong> fait l'hypothèse de Markov : il ne
          garde que le dernier mot, <Tex>{"P(w_n \\mid w_{1:n-1}) \\approx P(w_n \\mid w_{n-1})"}</Tex>{" "}
          (équation 3.7). Les états sont les mots, plus un symbole de début <Tex>{"\\texttt{<s>}"}</Tex> et un de
          fin <Tex>{"\\texttt{</s>}"}</Tex>, et la probabilité d'une phrase est celle d'une trajectoire (équation
          3.9). On estime chaque transition en comptant, dans un corpus, les paires de mots consécutifs
          (équation 3.11) :
        </p>
        <Tex block>{"P(w_n \\mid w_{n-1}) = \\frac{C(w_{n-1}\\,w_n)}{C(w_{n-1})}"}</Tex>
        <p>Voici le mini-corpus de trois phrases de Jurafsky et Martin (section 3.1.2).</p>
        <pre>
          <code>{`from collections import Counter
import numpy as np

corpus = ["<s> I am Sam </s>", "<s> Sam I am </s>", "<s> I do not like green eggs and ham </s>"]
paires, avant = Counter(), Counter()
for phrase in corpus:
    mots = phrase.split()
    for a, b in zip(mots, mots[1:]):
        paires[a, b] += 1                       # C(a b)
        avant[a] += 1                           # C(a), comme premier mot d'une paire
P = lambda b, a: paires[a, b] / avant[a]        # estimation par comptage (SLP3, éq. 3.11)
print(round(P("I", "<s>"), 2), round(P("Sam", "<s>"), 2), round(P("am", "I"), 2), P("</s>", "Sam"))

def proba(phrase):                              # produit des transitions (SLP3, éq. 3.9)
    mots = phrase.split()
    return np.prod([P(b, a) for a, b in zip(mots, mots[1:])])
print(round(proba("<s> I am Sam </s>"), 4), round(proba("<s> Sam I am Sam I am </s>"), 4))

rng = np.random.default_rng(5)
suivants = {a: [b for (x, b) in paires if x == a] for a in avant}
for _ in range(5):                              # génération mot à mot : une marche sur la chaîne
    mot, phrase = "<s>", []
    while mot != "</s>":
        choix = suivants[mot]
        mot = choix[rng.choice(len(choix), p=[P(b, mot) for b in choix])]
        phrase.append(mot)
    print(" ".join(phrase[:-1]))
# 0.67 0.33 0.67 0.5
# 0.1111 0.0093
# Sam I am Sam
# I am Sam
# Sam I am Sam I do not like green eggs and ham
# Sam
# Sam I am`}</code>
        </pre>
        <p>
          Les quatre probabilités sont celles du livre. « I am Sam » reçoit{" "}
          <Tex>{"\\tfrac23 \\cdot \\tfrac23 \\cdot \\tfrac12 \\cdot \\tfrac12 = \\tfrac19"}</Tex>. Générer du texte
          revient à faire marcher la chaîne depuis <Tex>{"\\texttt{<s>}"}</Tex> jusqu'à{" "}
          <Tex>{"\\texttt{</s>}"}</Tex> (section 3.4) : la chaîne produit des phrases absentes du corpus, comme
          « Sam I am Sam I do not like green eggs and ham », parce qu'elle ne retient que le dernier mot. Un modèle
          trigramme garde les deux derniers mots (équation 3.8) : c'est encore une chaîne de Markov, dont les états
          sont des paires de mots. Plus le contexte est long, plus les phrases générées sont cohérentes (section
          3.5) ; un Transformer conditionne sur toute sa fenêtre de contexte, et la
          génération se fait de la même façon, un token tiré à la fois.
        </p>
      </section>
    </LessonFlow>
  );
}
