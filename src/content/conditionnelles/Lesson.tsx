import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { BayesViz } from "./BayesViz";

export function ConditionnellesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Mettre à jour une probabilité</h2>
        <p>
          On apprend qu'un événement <Tex>B</Tex> s'est réalisé. Les issues hors de <Tex>B</Tex> deviennent
          impossibles : on les retire, et on renormalise ce qui reste pour que la masse totale revienne à 1. C'est la{" "}
          <strong>probabilité conditionnelle</strong> de <Tex>A</Tex> sachant <Tex>B</Tex> (Blitzstein et Hwang,
          définition 2.2.1), définie quand <Tex>{"P(B) > 0"}</Tex> :
        </p>
        <Tex block>{"P(A \\mid B) = \\frac{P(A \\cap B)}{P(B)}"}</Tex>
        <p>
          <Tex>{"P(A)"}</Tex> est la probabilité <strong>a priori</strong> de <Tex>A</Tex>, avant l'observation, et{" "}
          <Tex>{"P(A \\mid B)"}</Tex> sa probabilité <strong>a posteriori</strong>. Avec des issues équiprobables,
          c'est simplement la proportion d'issues de <Tex>B</Tex> qui réalisent aussi <Tex>A</Tex>.
        </p>
        <p>
          <strong>Le bon conditionnement change tout</strong> (exemple 2.2.5). Une famille a deux enfants, chacun
          fille ou garçon avec probabilité 1/2, indépendamment. On sait qu'il y a au moins une fille : la
          probabilité que ce soient deux filles vaut <Tex>{"1/3"}</Tex>, car trois familles équiprobables restent
          (FF, FG, GF). Si l'on sait que l'<em>aînée</em> est une fille, elle vaut <Tex>{"1/2"}</Tex>, car il ne reste
          que FF et FG.
        </p>
        <pre>
          <code>{`from itertools import product
from fractions import Fraction

familles = list(product("FG", repeat=2))     # aîné puis cadet
une_fille = [f for f in familles if "F" in f]
ainee = [f for f in familles if f[0] == "F"]
for B in (une_fille, ainee):
    print(Fraction(B.count(("F", "F")), len(B)))
# 1/3
# 1/2`}</code>
        </pre>
        <p>
          <strong>
            <Tex>{"P(A \\mid B)"}</Tex> n'est pas <Tex>{"P(B \\mid A)"}</Tex>.
          </strong>{" "}
          On tire deux cartes sans remise ; <Tex>A</Tex> : « la première est un cœur », <Tex>B</Tex> : « la seconde
          est rouge ». Alors <Tex>{"P(B \\mid A) = 25/51"}</Tex> (il reste 25 rouges sur 51 cartes), mais{" "}
          <Tex>{"P(A \\mid B) = 25/102"}</Tex> (exemple 2.2.2). Les confondre s'appelle le{" "}
          <strong>sophisme du procureur</strong> : la probabilité d'observer ces indices si l'accusé est innocent
          n'est pas la probabilité qu'il soit innocent vu ces indices.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Règle du produit et chaînage</h2>
        <p>
          En faisant passer <Tex>{"P(B)"}</Tex> de l'autre côté (théorème 2.3.1), on obtient la{" "}
          <strong>règle du produit</strong>, et en l'appliquant de proche en proche, la{" "}
          <strong>règle de chaînage</strong> (théorème 2.3.2) :
        </p>
        <Tex block>{"\\begin{gathered} P(A \\cap B) = P(B)\\, P(A \\mid B) \\\\ P(A_1 \\cap \\cdots \\cap A_n) = P(A_1)\\, P(A_2 \\mid A_1) \\cdots P(A_n \\mid A_1, \\dots, A_{n-1}) \\end{gathered}"}</Tex>
        <p>
          C'est souvent la façon la plus simple de calculer une intersection : on suit l'expérience étape par étape.
          Probabilité que les trois premières cartes d'un jeu soient des as :{" "}
          <Tex>{"\\frac{4}{52} \\times \\frac{3}{51} \\times \\frac{2}{50} = \\frac{1}{5525}"}</Tex>.
        </p>
        <p>
          <strong>C'est exactement ce que calcule un modèle de langage.</strong> Une phrase est une suite de tokens{" "}
          <Tex>{"s_1, \\dots, s_n"}</Tex>, et la règle de chaînage donne, sans aucune approximation,
        </p>
        <Tex block>{"p(s_1, \\dots, s_n) = \\prod_{i=1}^{n} p(s_i \\mid s_1, \\dots, s_{i-1})"}</Tex>
        <p>
          L'article de GPT-2 (Radford et al., 2019, section 2, équation 1) part de cette factorisation : le réseau
          n'apprend qu'une chose, la loi du token suivant sachant tous les précédents, et la probabilité d'un texte
          entier en découle. Comme un produit de centaines de nombres inférieurs à 1 devient vite trop petit pour les
          flottants, on travaille avec son logarithme, une somme. La perte d'entraînement de ces modèles est cette
          somme changée de signe (chapitre 9).
        </p>
        <pre>
          <code>{`import math

# Probabilités conditionnelles inventées pour l'exemple
p = [0.05,   # p("le")
     0.01,   # p("chat" | "le")
     0.20]   # p("dort" | "le chat")
print(math.prod(p), sum(math.log(x) for x in p))
# 0.0001 -9.210340371976182`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Probabilités totales et formule de Bayes</h2>
        <p>
          Si <Tex>{"A_1, \\dots, A_n"}</Tex> forment une partition de <Tex>{"\\Omega"}</Tex> (disjoints, de réunion{" "}
          <Tex>{"\\Omega"}</Tex>), on calcule <Tex>{"P(B)"}</Tex> cas par cas : c'est la{" "}
          <strong>formule des probabilités totales</strong> (théorème 2.3.6). En écrivant{" "}
          <Tex>{"P(A \\cap B)"}</Tex> de deux façons avec la règle du produit, on obtient la{" "}
          <strong>formule de Bayes</strong> (théorème 2.3.3), qui retourne un conditionnement :
        </p>
        <Tex block>{"P(B) = \\sum_{i} P(B \\mid A_i)\\, P(A_i) \\qquad\\qquad P(A \\mid B) = \\frac{P(B \\mid A)\\, P(A)}{P(B)}"}</Tex>
        <p>
          <strong>Le test fiable à 95 %</strong> (exemple 2.3.9). Une maladie touche 1 % de la population. Le test
          détecte 95 % des malades (<strong>sensibilité</strong> <Tex>{"P(+ \\mid M)"}</Tex>) et donne un résultat
          négatif pour 95 % des gens sains (<strong>spécificité</strong> <Tex>{"P(- \\mid M^c)"}</Tex>). Fred est
          testé positif. La probabilité qu'il soit malade est
        </p>
        <Tex block>{"P(M \\mid +) = \\frac{0{,}95 \\times 0{,}01}{0{,}95 \\times 0{,}01 + 0{,}05 \\times 0{,}99} \\approx 0{,}16"}</Tex>
        <p>
          Seulement 16 %. Le test est bon, mais la maladie est rare, et 5 % de faux positifs parmi 99 % de gens sains
          font bien plus de monde que 95 % de vrais positifs parmi 1 % de malades. On le voit mieux en comptant des
          personnes plutôt qu'en multipliant des probabilités :
        </p>
        <BayesViz />
        <p>
          <strong>Le postérieur d'hier est le prior d'aujourd'hui.</strong> Si Fred refait un second test, et qu'on
          suppose les deux tests indépendants sachant son état, on applique Bayes à nouveau en partant de 0,16 : un
          second positif fait monter la probabilité à 0,78. De même (exemples 2.3.7 et 2.4.4), on choisit au hasard
          une pièce équilibrée ou une pièce qui tombe sur pile avec probabilité 3/4. Elle donne pile trois fois de
          suite. La probabilité qu'elle soit équilibrée passe de 1/2 à{" "}
          <Tex>{"\\frac{(1/2)^3 \\cdot 1/2}{(1/2)^3 \\cdot 1/2 + (3/4)^3 \\cdot 1/2} = \\frac{8}{35} \\approx 0{,}23"}</Tex>,
          et celle d'un quatrième pile vaut{" "}
          <Tex>{"\\frac{1}{2} \\cdot 0{,}23 + \\frac{3}{4} \\cdot 0{,}77 \\approx 0{,}69"}</Tex>, par les probabilités
          totales. C'est tout l'apprentissage bayésien : une croyance, révisée à chaque donnée.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Indépendance</h2>
        <p>
          <Tex>A</Tex> et <Tex>B</Tex> sont <strong>indépendants</strong> si{" "}
          <Tex>{"P(A \\cap B) = P(A)\\, P(B)"}</Tex>, autrement dit (si <Tex>{"P(B) > 0"}</Tex>) si{" "}
          <Tex>{"P(A \\mid B) = P(A)"}</Tex> : savoir que <Tex>B</Tex> s'est produit ne change rien à{" "}
          <Tex>A</Tex> (MML, définition 6.10, pour des variables aléatoires). Ne pas confondre avec{" "}
          <strong>disjoints</strong> : deux événements disjoints de probabilités non nulles sont au contraire très
          dépendants, puisque savoir que l'un s'est produit garantit que l'autre ne s'est pas produit.
        </p>
        <p>
          <Tex>A</Tex> et <Tex>B</Tex> sont <strong>indépendants conditionnellement</strong> à <Tex>C</Tex> si{" "}
          <Tex>{"P(A \\cap B \\mid C) = P(A \\mid C)\\, P(B \\mid C)"}</Tex> (définition 6.11). Les deux notions ne
          s'impliquent pas. Les deux tests de Fred ne sont pas indépendants, puisqu'un premier positif rend le second
          plus probable. Mais on les a supposés indépendants <em>sachant</em> son état : une fois qu'on sait s'il est
          malade, le premier résultat n'apprend plus rien sur le second.
        </p>
        <p>
          <strong>Le filtre anti-spam bayésien naïf.</strong> Un mail est une liste de mots{" "}
          <Tex>{"t_1, \\dots, t_n"}</Tex>, et l'on veut <Tex>{"P(\\text{spam} \\mid \\text{mots})"}</Tex>. Par Bayes,
          elle est proportionnelle à <Tex>{"P(\\text{mots} \\mid \\text{spam})\\, P(\\text{spam})"}</Tex>. Estimer la
          loi jointe de tous les mots est impossible ; on suppose donc les mots indépendants sachant la classe, ce
          qui transforme la loi jointe en produit (Manning, Raghavan et Schütze, <em>Introduction to Information
          Retrieval</em>, §13.2) :
        </p>
        <Tex block>{"P(c \\mid t_1, \\dots, t_n) \\propto P(c) \\prod_{k=1}^{n} P(t_k \\mid c)"}</Tex>
        <p>
          L'hypothèse est fausse (« gratuit » et « argent » ne sont pas indépendants dans un spam). Les probabilités
          obtenues sont donc mauvaises, mais le classement, lui, est souvent bon (§13.4) : pour décider, il suffit
          que la bonne classe ait le plus grand score.
        </p>
        <pre>
          <code>{`import math

# Estimations tirées d'un corpus (valeurs inventées pour l'exemple)
prior = {"spam": 0.4, "normal": 0.6}
p_mot = {
    "spam": {"gratuit": 0.05, "réunion": 0.001},
    "normal": {"gratuit": 0.002, "réunion": 0.01},
}
mail = ["gratuit", "gratuit", "réunion"]
score = {}
for c in prior:  # log P(c) + somme des log P(mot | c)
    score[c] = math.log(prior[c])
    score[c] += sum(math.log(p_mot[c][m]) for m in mail)
z = sum(math.exp(s) for s in score.values())
print({c: round(math.exp(s) / z, 4) for c, s in score.items()})
# {'spam': 0.9766, 'normal': 0.0234}`}</code>
        </pre>
      </section>
    </LessonFlow>
  );
}
