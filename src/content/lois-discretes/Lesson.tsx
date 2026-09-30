import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { TokenViz } from "./TokenViz";

export function LoisDiscretesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Une variable aléatoire est une fonction</h2>
        <p>
          On s'intéresse rarement à l'issue brute d'une expérience, plutôt à un nombre qu'on en tire : la somme de deux
          dés, le nombre de piles, l'identifiant du token produit. Une <strong>variable aléatoire</strong> est une
          fonction <Tex>{"X : \\Omega \\to T"}</Tex> qui associe à chaque issue une valeur (MML, section 6.1.2). Le
          livre prévient que le nom est trompeur : elle n'est ni aléatoire, ni une variable, c'est une fonction. Le
          hasard est dans le choix de l'issue <Tex>\omega</Tex>, pas dans <Tex>X</Tex>. La probabilité d'un ensemble
          de valeurs est celle de ses antécédents (MML, équation 6.8) :
        </p>
        <Tex block>{"P(X \\in S) = P\\big(\\{\\omega \\in \\Omega : X(\\omega) \\in S\\}\\big)"}</Tex>
        <p>
          <strong>Exemple</strong> (MML, exemple 6.1). On tire deux pièces avec remise dans un sac, chacune américaine
          avec probabilité 0,3. <Tex>X</Tex> compte les pièces américaines. L'issue « 1 » a deux antécédents,
          (américaine, anglaise) et (anglaise, américaine), d'où <Tex>{"P(X = 1) = 2 \\times 0{,}3 \\times 0{,}7 = 0{,}42"}</Tex>,
          puis <Tex>{"P(X = 2) = 0{,}09"}</Tex> et <Tex>{"P(X = 0) = 0{,}49"}</Tex>.
        </p>
        <p>
          Quand <Tex>X</Tex> prend ses valeurs dans un ensemble fini ou dénombrable, elle est{" "}
          <strong>discrète</strong>, et sa <strong>loi</strong> est décrite par sa{" "}
          <strong>fonction de masse</strong> <Tex>{"p_X(x) = P(X = x)"}</Tex>, positive et de somme 1. Sa{" "}
          <strong>fonction de répartition</strong> <Tex>{"F_X(x) = P(X \\le x)"}</Tex> est définie pour tout réel{" "}
          <Tex>x</Tex> : elle croît en escalier de 0 à 1, avec un saut de hauteur <Tex>{"p_X(x)"}</Tex> en chaque
          valeur possible. Pour la somme <Tex>S</Tex> de deux dés,{" "}
          <Tex>{"F_S(4) = F_S(4{,}5) = \\frac{1 + 2 + 3}{36} = \\frac{1}{6}"}</Tex>.
        </p>
        <pre>
          <code>{`from itertools import product
from collections import Counter
from fractions import Fraction

omega = list(product(range(1, 7), repeat=2))  # 36 issues
S = lambda w: w[0] + w[1]          # la variable aléatoire
compte = Counter(S(w) for w in omega)
p = {s: Fraction(n, 36) for s, n in sorted(compte.items())}
F = lambda x: sum(q for s, q in p.items() if s <= x)
print(p[7], sum(p.values()), F(4), F(4.5), F(12))
# 1/6 1 1/6 1/6 1`}</code>
        </pre>
        <p>
          <strong>Une loi n'est pas une variable.</strong> Le premier dé <Tex>{"D_1"}</Tex> et le second{" "}
          <Tex>{"D_2"}</Tex> ont la même loi, uniforme sur <Tex>{"\\{1, \\dots, 6\\}"}</Tex>, mais ce sont deux
          fonctions différentes : <Tex>{"D_1 = D_2"}</Tex> n'arrive qu'avec probabilité 1/6. On écrit{" "}
          <Tex>{"X \\sim p"}</Tex> pour « <Tex>X</Tex> suit la loi <Tex>p</Tex> ». La variable la plus simple est
          l'<strong>indicatrice</strong> d'un événement <Tex>A</Tex> : <Tex>{"I_A(\\omega) = 1"}</Tex> si{" "}
          <Tex>{"\\omega \\in A"}</Tex>, 0 sinon. Elle vaut 1 avec probabilité <Tex>{"P(A)"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Bernoulli et binomiale : compter des succès</h2>
        <p>
          Une variable qui vaut 1 avec probabilité <Tex>p</Tex> et 0 sinon suit la <strong>loi de Bernoulli</strong>{" "}
          <Tex>{"\\text{Ber}(p)"}</Tex> : succès ou échec, pile ou face, bonne ou mauvaise prédiction. On répète{" "}
          <Tex>n</Tex> fois une telle expérience, avec la même probabilité de succès <Tex>p</Tex> à chaque essai et
          des essais indépendants : c'est un <strong>schéma de Bernoulli</strong> (Grinstead et Snell, définition
          3.5). Le nombre <Tex>X</Tex> de succès suit la <strong>loi binomiale</strong>{" "}
          <Tex>{"\\text{Bin}(n, p)"}</Tex> (définition 3.6) :
        </p>
        <Tex block>{"P(X = k) = \\binom{n}{k}\\, p^k (1 - p)^{n - k} \\qquad k = 0, 1, \\dots, n"}</Tex>
        <p>
          Chaque suite précise de <Tex>k</Tex> succès et <Tex>{"n - k"}</Tex> échecs a probabilité{" "}
          <Tex>{"p^k (1-p)^{n-k}"}</Tex> par indépendance, et il y a <Tex>{"\\binom{n}{k}"}</Tex> façons de placer
          les succès. L'exemple des pièces ci-dessus est une <Tex>{"\\text{Bin}(2\\,;\\,0{,}3)"}</Tex>.
        </p>
        <p>
          <strong>Mesurer la précision d'un modèle.</strong> Un classifieur a une précision réelle de 90 %. On le teste
          sur 20 exemples, supposés tirés indépendamment. Le nombre de bonnes réponses suit{" "}
          <Tex>{"\\text{Bin}(20\\,;\\,0{,}9)"}</Tex>. La valeur la plus probable est bien 18, mais elle n'arrive
          qu'avec probabilité 0,285, et le modèle obtient 80 % ou moins (au plus 16 bonnes réponses) avec probabilité
          0,133 : environ une fois sur sept et demie, un modèle à 90 % a l'air d'un modèle à 80 %. Sur 1000
          exemples, la probabilité de mesurer 88 % ou moins tombe à 0,022. Le chapitre 8 dira à quelle vitesse la
          mesure se resserre.
        </p>
        <pre>
          <code>{`from math import comb

def binom(n, p, k):
    return comb(n, k) * p**k * (1 - p)**(n - k)

# Un classifieur juste à 90 %, évalué sur n exemples :
# probabilité de mesurer au plus 80 % (resp. 88 %)
for n, seuil in ((20, 16), (1000, 880)):
    queue = sum(binom(n, 0.9, k) for k in range(seuil + 1))
    print(n, round(queue, 3))
# 20 0.133
# 1000 0.022`}</code>
        </pre>
        <p>
          <strong>Sans remise, c'est la loi hypergéométrique</strong> (Grinstead et Snell, section 5.1). Une urne
          contient <Tex>N</Tex> boules dont <Tex>K</Tex> rouges ; on en tire <Tex>n</Tex> sans remise. Les essais ne
          sont plus indépendants, et le nombre <Tex>X</Tex> de rouges vérifie
        </p>
        <Tex block>{"P(X = x) = \\frac{\\binom{K}{x} \\binom{N - K}{n - x}}{\\binom{N}{n}}"}</Tex>
        <p>
          Probabilité d'avoir exactement deux cœurs dans une main de 5 cartes :{" "}
          <Tex>{"\\binom{13}{2}\\binom{39}{3} / \\binom{52}{5} \\approx 0{,}274"}</Tex>, contre{" "}
          <Tex>{"\\binom{5}{2}\\, 0{,}25^2\\, 0{,}75^3 \\approx 0{,}264"}</Tex> si l'on remettait chaque carte. Quand
          la population est grande devant l'échantillon, retirer quelques boules change à peine les proportions, et
          les deux lois se rapprochent.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Géométrique et Poisson : attendre et compter l'imprévu</h2>
        <p>
          <strong>Loi géométrique.</strong> On répète des essais de Bernoulli de paramètre <Tex>p</Tex> jusqu'au
          premier succès. Le rang <Tex>T</Tex> de ce succès vérifie (Grinstead et Snell, section 5.1)
        </p>
        <Tex block>{"P(T = n) = (1 - p)^{n-1}\\, p \\quad (n \\ge 1) \\qquad\\qquad P(T > k) = (1 - p)^k"}</Tex>
        <p>
          <Tex>{"T > k"}</Tex> signifie que les <Tex>k</Tex> premiers essais ont échoué. Attention aux conventions :
          certains livres, dont Blitzstein et Hwang, comptent les échecs avant le succès, soit <Tex>{"T - 1"}</Tex>.
          NumPy compte les essais : <code>rng.geometric(p)</code> renvoie des entiers à partir de 1. Probabilité de ne
          voir aucun 6 en 10 lancers de dé : <Tex>{"(5/6)^{10} \\approx 0{,}16"}</Tex>.
        </p>
        <p>
          <strong>La loi géométrique est sans mémoire</strong> (Grinstead et Snell, exemple 5.1) :
        </p>
        <Tex block>{"P(T > r + s \\mid T > r) = \\frac{(1-p)^{r+s}}{(1-p)^r} = (1-p)^s = P(T > s)"}</Tex>
        <p>
          Avoir déjà échoué <Tex>r</Tex> fois ne rapproche pas du succès : après dix lancers sans 6, le prochain donne
          toujours 6 avec probabilité 1/6. Croire le contraire est l'erreur du joueur. En échantillonnage par rejet,
          on tire des points uniformes dans un carré jusqu'à en obtenir un dans le disque inscrit (probabilité{" "}
          <Tex>{"\\pi/4"}</Tex>) : le nombre de tentatives est géométrique, et il en faut plus de trois avec
          probabilité <Tex>{"(1 - \\pi/4)^3 \\approx 0{,}0099"}</Tex>.
        </p>
        <p>
          <strong>Loi de Poisson.</strong> Beaucoup d'occasions indépendantes, chacune très peu probable : requêtes
          reçues par un serveur en une seconde, fautes de frappe dans une page. Si <Tex>X</Tex> suit{" "}
          <Tex>{"\\text{Bin}(n, \\lambda/n)"}</Tex> et que <Tex>n</Tex> grandit à <Tex>{"\\lambda = np"}</Tex> fixé,
          la loi binomiale tend vers la <strong>loi de Poisson</strong> de paramètre <Tex>\lambda</Tex> (Grinstead et
          Snell, équation 5.2) :
        </p>
        <Tex block>{"P(X = k) = e^{-\\lambda} \\frac{\\lambda^k}{k!} \\qquad k = 0, 1, 2, \\dots"}</Tex>
        <p>
          L'approximation est déjà bonne pour <Tex>n = 100</Tex> et <Tex>{"p = 0{,}01"}</Tex> :{" "}
          <Tex>{"P(X = 0)"}</Tex> vaut 0,3660 pour la binomiale et <Tex>{"e^{-1} \\approx 0{,}3679"}</Tex> pour
          Poisson (tableau 5.1). Exemple 5.4, repris de Feller : 400 bombes volantes V1 tombent au hasard sur un
          quartier de Londres découpé en 100 carrés. Chaque carré reçoit un nombre de bombes de loi{" "}
          <Tex>{"\\text{Bin}(400\\,;\\,0{,}01)"}</Tex>, proche de Poisson de paramètre <Tex>{"\\lambda = 4"}</Tex>.
          Un carré est épargné avec probabilité <Tex>{"e^{-4} \\approx 0{,}018"}</Tex>, soit environ 1,8 carré sur
          100. La simulation ci-dessous compare les comptes à la prédiction ; ce n'est qu'un tirage, d'où des écarts.
        </p>
        <pre>
          <code>{`import numpy as np
from math import exp, factorial

rng = np.random.default_rng(0)
carre = rng.integers(0, 100, size=400)  # 400 V1, 100 carrés
coups = np.bincount(carre, minlength=100)  # V1 par carré
print(np.bincount(coups)[:8])  # carrés touchés 0, 1, 2… fois
print([round(100 * exp(-4) * 4**k / factorial(k), 1)
       for k in range(8)])
# [ 0  4 18 24 20 12 11  7]
# [1.8, 7.3, 14.7, 19.5, 19.5, 15.6, 10.4, 6.0]`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Le token suivant : une loi catégorielle</h2>
        <p>
          Une variable qui prend une valeur parmi <Tex>K</Tex> catégories sans ordre, avec des probabilités{" "}
          <Tex>{"p_1, \\dots, p_K"}</Tex> de somme 1, suit une <strong>loi catégorielle</strong>. C'est le cas de la
          classe prédite par un classifieur, et du token suivant dans un modèle de langage : le réseau calcule un
          score, ou <strong>logit</strong>, <Tex>{"z_i"}</Tex> par token du vocabulaire, et la couche softmax les
          change en probabilités. Hinton, Vinyals et Dean (2015, section 2, équation 1) y ajoutent une{" "}
          <strong>température</strong> <Tex>T</Tex>, « normalement fixée à 1 » :
        </p>
        <Tex block>{"p_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}"}</Tex>
        <p>
          Une température plus haute donne une loi « plus douce » : les écarts entre logits sont divisés par{" "}
          <Tex>T</Tex>, et la loi tend vers l'uniforme quand <Tex>T</Tex> grandit. Quand <Tex>T</Tex> tend vers 0,
          toute la masse va au plus grand logit, et tirer revient à prendre l'argmax. Les outils de génération de
          texte exposent ce même paramètre.
        </p>
        <p>
          <strong>Tirer selon une loi avec un seul nombre uniforme.</strong> On découpe <Tex>{"[0, 1]"}</Tex> en
          segments consécutifs de longueurs <Tex>{"p_1, \\dots, p_K"}</Tex> : leurs extrémités sont les valeurs de la
          fonction de répartition <Tex>{"F_i = p_1 + \\dots + p_i"}</Tex>. On tire <Tex>u</Tex> uniforme sur{" "}
          <Tex>{"[0, 1]"}</Tex> et l'on renvoie le <Tex>i</Tex> dont le segment contient <Tex>u</Tex>. Ce tirage
          suit bien la loi voulue, puisque <Tex>{"P(F_{i-1} \\le u < F_i) = F_i - F_{i-1} = p_i"}</Tex>.
        </p>
        <TokenViz />
        <pre>
          <code>{`import numpy as np
from collections import Counter

tokens = ["souris", "croquettes", "pâtes", "salades",
          "chaussures"]
z = np.array([3.0, 2.5, 1.0, 0.5, -1.0])  # logits inventés

def softmax(z, T=1.0):
    e = np.exp((z - z.max()) / T)
    return e / e.sum()

def tirer(p, rng):
    c = np.cumsum(p)  # fonction de répartition
    u = rng.random() * c[-1]  # c[-1] vaut 1 aux arrondis près
    return int(np.searchsorted(c, u, side="right"))

rng = np.random.default_rng(0)
for T in (0.5, 1.0, 2.0):
    p = softmax(z, T)
    n = Counter(tokens[tirer(p, rng)] for _ in range(10_000))
    print(T, p.round(2), n["souris"] / 10_000)
# 0.5 [0.72 0.26 0.01 0.   0.  ] 0.72
# 1.0 [0.54 0.33 0.07 0.04 0.01] 0.5364
# 2.0 [0.39 0.3  0.14 0.11 0.05] 0.3885`}</code>
        </pre>
        <p>
          Retirer le maximum des logits avant l'exponentielle ne change pas le résultat (le facteur{" "}
          <Tex>{"e^{-\\max z / T}"}</Tex> se simplifie) mais évite les dépassements de capacité. Un texte généré est
          une suite de tels tirages, chacun selon la loi du token suivant sachant les précédents : c'est la règle de
          chaînage du chapitre 2, parcourue dans l'autre sens.
        </p>
      </section>
    </LessonFlow>
  );
}
