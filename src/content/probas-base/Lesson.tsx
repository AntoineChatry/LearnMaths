import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { BirthdayViz } from "./BirthdayViz";

export function ProbasBaseLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Compter les issues favorables</h2>
        <p>
          Une expérience aléatoire a un ensemble d'issues possibles, l'<strong>univers</strong>{" "}
          <Tex>{"\\Omega"}</Tex>. Pour deux dés, c'est l'ensemble des 36 couples{" "}
          <Tex>{"(a, b)"}</Tex>. Un <strong>événement</strong> est une partie de <Tex>{"\\Omega"}</Tex> : « la somme
          vaut 11 » est l'ensemble <Tex>{"\\{(5, 6), (6, 5)\\}"}</Tex>. Les opérations sur les événements sont celles
          des ensembles : « A ou B » est <Tex>{"A \\cup B"}</Tex>, « A et B » est <Tex>{"A \\cap B"}</Tex>, « non A »
          est le complémentaire <Tex>{"A^c"}</Tex>.
        </p>
        <p>
          Quand <Tex>{"\\Omega"}</Tex> est fini et que toutes les issues sont également probables, la probabilité d'un
          événement est la proportion d'issues qui le réalisent (Blitzstein et Hwang, <em>Introduction to
          Probability</em>, définition 1.3.1, qu'ils appellent la définition « naïve ») :
        </p>
        <Tex block>{"P(A) = \\frac{|A|}{|\\Omega|} = \\frac{\\text{nombre d'issues favorables}}{\\text{nombre d'issues possibles}}"}</Tex>
        <p>
          Tout le travail est de bien choisir <Tex>{"\\Omega"}</Tex>. Leibniz pensait qu'une somme de 11 et une somme de
          12 étaient aussi probables avec deux dés, puisque chacune ne s'obtient que d'une façon : 5 et 6, ou 6 et 6
          (exemple 1.4.10 du même livre). Mais si l'on distingue les dés, l'un rouge et l'autre bleu, 11 s'obtient
          de deux façons, <Tex>{"(5, 6)"}</Tex> et <Tex>{"(6, 5)"}</Tex>, alors que 12 ne s'obtient que par{" "}
          <Tex>{"(6, 6)"}</Tex>. Les 36 couples sont également probables, pas les 21 paires non ordonnées :
        </p>
        <pre>
          <code>{`from itertools import product
from fractions import Fraction

issues = list(product(range(1, 7), repeat=2))   # les 36 couples (a, b)
for s in (11, 12):
    favorables = [x for x in issues if sum(x) == s]
    print(s, Fraction(len(favorables), len(issues)))
# 11 1/18
# 12 1/36`}</code>
        </pre>
        <p>
          Le piège inverse existe aussi : décréter des issues équiprobables sans raison. « Soit ça arrive, soit ça
          n'arrive pas, donc c'est 50 % » est faux dès qu'une issue a plus de chances que l'autre. La définition
          naïve ne s'applique que si une symétrie du problème, ou le protocole lui-même (un tirage au sort), rend
          les issues également probables.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Dénombrer</h2>
        <p>
          Tout repose sur le <strong>principe multiplicatif</strong> (théorème 1.4.1) : si une expérience se fait en
          deux étapes, avec <Tex>a</Tex> issues pour la première et <Tex>b</Tex> pour la seconde quelle que soit la
          première, elle a <Tex>{"ab"}</Tex> issues. On en déduit trois formules, pour <Tex>k</Tex> choix successifs
          parmi <Tex>n</Tex> objets :
        </p>
        <ul>
          <li>
            <strong>avec remise</strong> (un objet peut revenir) : <Tex>{"n^k"}</Tex> suites (théorème 1.4.5). Un code
            PIN à 4 chiffres : <Tex>{"10^4"}</Tex> possibilités ;
          </li>
          <li>
            <strong>sans remise</strong> : <Tex>{"n(n-1)\\cdots(n-k+1)"}</Tex> suites (théorème 1.4.6), et{" "}
            <Tex>{"n!"}</Tex> façons d'ordonner les <Tex>n</Tex> objets ;
          </li>
          <li>
            <strong>sans remise et sans ordre</strong> : chaque sous-ensemble de <Tex>k</Tex> objets a été compté{" "}
            <Tex>{"k!"}</Tex> fois (une fois par ordre), donc il y en a (théorème 1.4.13)
          </li>
        </ul>
        <Tex block>{"\\binom{n}{k} = \\frac{n(n-1)\\cdots(n-k+1)}{k!} = \\frac{n!}{k!\\,(n-k)!}"}</Tex>
        <p>
          Cette idée, compter trop puis diviser par le nombre de fois où chaque objet a été compté, sert partout.
          Exemple : un <strong>full</strong> au poker, trois cartes d'une hauteur et deux d'une autre, parmi 5 cartes
          tirées dans un jeu de 52 (exemple 1.4.18). On choisit la hauteur du brelan (13 choix), ses 3 couleurs parmi
          4, puis la hauteur de la paire (12 choix restants) et ses 2 couleurs parmi 4 :
        </p>
        <Tex block>{"P(\\text{full}) = \\frac{13 \\binom{4}{3} \\times 12 \\binom{4}{2}}{\\binom{52}{5}} = \\frac{3744}{2\\,598\\,960} \\approx 0{,}0014"}</Tex>
        <pre>
          <code>{`from math import comb, perm, factorial

# suites sans remise, sous-ensembles, ordres d'un sous-ensemble
print(perm(10, 3), comb(10, 3), factorial(3))
# 720 120 6 : 720 = 120 × 3!
print(13 * comb(4, 3) * 12 * comb(4, 2) / comb(52, 5))
# 0.0014405762304921968`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le paradoxe des anniversaires</h2>
        <p>
          <Tex>k</Tex> personnes sont dans une pièce, chaque anniversaire est l'un des 365 jours, équiprobables et
          indépendants. Quelle est la probabilité qu'au moins deux personnes aient le même (exemple 1.4.8) ? Compter
          directement les cas avec coïncidence est un cauchemar : deux personnes, trois, deux paires… On compte le{" "}
          <strong>complémentaire</strong>. Il y a <Tex>{"365^k"}</Tex> suites d'anniversaires (avec remise), dont{" "}
          <Tex>{"365 \\times 364 \\times \\cdots \\times (365 - k + 1)"}</Tex> sans répétition (sans remise), donc
        </p>
        <Tex block>{"P(\\text{au moins une coïncidence}) = 1 - \\frac{365 \\times 364 \\times \\cdots \\times (365 - k + 1)}{365^k}"}</Tex>
        <p>
          Elle dépasse 50 % dès <Tex>{"k = 23"}</Tex> (elle vaut 0,507) et 99 % dès <Tex>{"k = 57"}</Tex>. C'est
          contre-intuitif parce qu'on pense à <em>son</em> anniversaire, alors qu'il faut compter les paires : 23
          personnes forment <Tex>{"\\binom{23}{2} = 253"}</Tex> paires, et chacune peut coïncider.
        </p>
        <p>
          <strong>Une formule approchée.</strong> Pour <Tex>N</Tex> valeurs équiprobables au lieu de 365, la
          probabilité de n'avoir aucune coïncidence est un produit, <Tex>{"\\prod_{j=1}^{k-1} (1 - j/N)"}</Tex>. Son
          logarithme est une somme, et <Tex>{"\\ln(1 - x) \\approx -x"}</Tex> pour <Tex>x</Tex> petit (Taylor à
          l'ordre 1) :
        </p>
        <Tex block>{"\\ln P(\\text{aucune}) = \\sum_{j=1}^{k-1} \\ln\\!\\left(1 - \\frac{j}{N}\\right) \\approx -\\sum_{j=1}^{k-1} \\frac{j}{N} = -\\frac{k(k-1)}{2N}"}</Tex>
        <p>
          Donc <Tex>{"P(\\text{coïncidence}) \\approx 1 - e^{-k(k-1)/2N}"}</Tex>. Tout se joue quand{" "}
          <Tex>{"k^2"}</Tex> est de l'ordre de <Tex>N</Tex>, c'est-à-dire pour <Tex>k</Tex> de l'ordre de{" "}
          <Tex>{"\\sqrt N"}</Tex>. À <Tex>{"k = \\sqrt N"}</Tex>, la probabilité vaut déjà environ{" "}
          <Tex>{"1 - e^{-1/2} \\approx 0{,}39"}</Tex>, quel que soit <Tex>N</Tex> :
        </p>
        <BirthdayViz />
        <p>
          <strong>Pourquoi les collisions de hachage arrivent si tôt.</strong> Une fonction de hachage de{" "}
          <Tex>b</Tex> bits a <Tex>{"N = 2^b"}</Tex> sorties. Si elle se comporte comme un tirage au hasard, il suffit
          d'environ <Tex>{"\\sqrt{2^b} = 2^{b/2}"}</Tex> entrées pour avoir une bonne chance que deux d'entre elles
          aient la même empreinte. Un hachage de 32 bits a plus de 4 milliards de sorties, mais environ 77 000
          entrées suffisent pour une chance sur deux de collision (<Tex>{"k \\approx \\sqrt{2N \\ln 2}"}</Tex>). À
          l'inverse, un UUID de version 4 contient 122 bits aléatoires (RFC 9562, §5.4) : il en faudrait de l'ordre
          de <Tex>{"2^{61} \\approx 2{,}3 \\times 10^{18}"}</Tex> pour atteindre ces 39 %.
        </p>
        <p>
          Quand un calcul surprend, on le vérifie par <strong>simulation</strong> : on refait l'expérience un grand
          nombre de fois et on compte. Le chapitre 8 dira pourquoi la fréquence observée se rapproche de la
          probabilité.
        </p>
        <pre>
          <code>{`import numpy as np

rng = np.random.default_rng(0)
# 100 000 pièces de 23 personnes, une par ligne
jours = rng.integers(0, 365, size=(100_000, 23))
tries = np.sort(jours, axis=1)
coincidence = (np.diff(tries, axis=1) == 0).any(axis=1)
print(coincidence.mean())
# 0.50699, contre 0.507 exact`}</code>
        </pre>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Les axiomes, et ce qu'on en tire</h2>
        <p>
          La définition naïve ne suffit plus dès que les issues ne sont pas équiprobables, ou qu'il y en a une
          infinité. La définition générale (définition 1.6.1 de Blitzstein et Hwang, section 6.1 de MML) ne demande
          que deux axiomes à une fonction <Tex>P</Tex>, qui associe à tout événement un nombre de{" "}
          <Tex>{"[0, 1]"}</Tex> :
        </p>
        <ol>
          <li>
            <Tex>{"P(\\varnothing) = 0"}</Tex> et <Tex>{"P(\\Omega) = 1"}</Tex> ;
          </li>
          <li>
            si <Tex>{"A_1, A_2, \\dots"}</Tex> sont deux à deux disjoints,{" "}
            <Tex>{"P\\left(\\bigcup_j A_j\\right) = \\sum_j P(A_j)"}</Tex>.
          </li>
        </ol>
        <p>
          Une probabilité se comporte comme une masse : la masse totale vaut 1, et des tas disjoints s'additionnent.
          Tout le reste se démontre (théorème 1.6.2). Par exemple, <Tex>A</Tex> et <Tex>{"A^c"}</Tex> sont disjoints
          et leur réunion est <Tex>{"\\Omega"}</Tex>, donc <Tex>{"P(A) + P(A^c) = 1"}</Tex> :
        </p>
        <Tex block>{"\\begin{gathered} P(A^c) = 1 - P(A) \\\\ A \\subseteq B \\Rightarrow P(A) \\le P(B) \\\\ P(A \\cup B) = P(A) + P(B) - P(A \\cap B) \\end{gathered}"}</Tex>
        <p>
          La dernière formule retranche <Tex>{"P(A \\cap B)"}</Tex>, compté deux fois. Pour <Tex>n</Tex> événements,
          c'est la formule d'<strong>inclusion-exclusion</strong> (théorème 1.6.3) : on ajoute les probabilités
          seules, on retranche celles des intersections deux à deux, on rajoute celles des intersections trois à
          trois, et ainsi de suite en alternant les signes.
        </p>
        <p>
          <strong>Le problème des rencontres</strong> (de Montmort, exemple 1.6.4). On mélange <Tex>n</Tex> cartes
          numérotées de 1 à <Tex>n</Tex>, puis on les retourne une à une en comptant 1, 2, 3… On gagne si une carte
          sort au rang de son numéro. Soit <Tex>{"A_i"}</Tex> l'événement « la carte <Tex>i</Tex> est au rang{" "}
          <Tex>i</Tex> » : <Tex>{"P(A_i) = 1/n"}</Tex>, <Tex>{"P(A_i \\cap A_j) = 1/(n(n-1))"}</Tex>, etc. Par
          symétrie, l'inclusion-exclusion se simplifie en
        </p>
        <Tex block>{"P(\\text{gagner}) = 1 - \\frac{1}{2!} + \\frac{1}{3!} - \\cdots + \\frac{(-1)^{n+1}}{n!} \\xrightarrow[n \\to \\infty]{} 1 - \\frac{1}{e} \\approx 0{,}632"}</Tex>
        <p>
          On reconnaît la série de <Tex>{"e^{-1}"}</Tex> du chapitre sur les séries. Ni 0 ni 1 : quand{" "}
          <Tex>n</Tex> grandit, il y a plus de places où gagner, mais chacune est moins probable, et les deux effets
          se compensent. Déjà pour <Tex>{"n = 3"}</Tex>, on gagne avec probabilité <Tex>{"2/3"}</Tex> : sur les 6
          ordres de 1, 2, 3, seuls <Tex>{"(2, 3, 1)"}</Tex> et <Tex>{"(3, 1, 2)"}</Tex> ne placent aucune carte à son
          rang.
        </p>
        <p>
          Les axiomes ne disent pas ce qu'<em>est</em> une probabilité. Pour un fréquentiste, c'est une fréquence à
          long terme sur des répétitions de l'expérience. Pour un bayésien, c'est un degré de croyance, qui peut
          porter sur un événement unique, comme « ce modèle est le meilleur ». Les deux lectures obéissent aux mêmes
          règles, et le ML utilise les deux.
        </p>
      </section>
    </LessonFlow>
  );
}
