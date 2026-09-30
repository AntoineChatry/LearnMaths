import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { EpsilonNViz } from "./EpsilonNViz";
import { GeometricViz } from "./GeometricViz";
import { SeriesIntegralViz } from "./SeriesIntegralViz";

export function SeriesLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Une suite qui converge : le jeu ε-N</h2>
        <p>
          En STI2D, tu as manipulé des suites arithmétiques et géométriques : un terme général{" "}
          <Tex>{"u_n"}</Tex>, une relation de récurrence, un sens de variation. Il reste à dire proprement ce que veut
          dire « <Tex>{"u_n"}</Tex> tend vers <Tex>L</Tex> ». Prends
        </p>
        <Tex block>{"u_n = 1 + \\frac{2\\,(-1)^n}{n} \\qquad u_1 = -1,\\ u_2 = 2,\\ u_3 \\approx 0{,}33,\\ u_4 = 1{,}5,\\ \\dots"}</Tex>
        <p>
          Les termes sautent au-dessus puis en dessous de 1, mais de moins en moins fort. C'est le jeu ε-δ du chapitre
          sur les limites, avec une différence : une suite n'est définie que sur les entiers, donc ta réponse n'est plus
          une fenêtre δ mais un <strong>rang</strong> <Tex>N</Tex> à partir duquel tout se passe bien.
        </p>
        <Tex block>
          {
            "\\lim_{n \\to +\\infty} u_n = L \\iff \\forall \\varepsilon > 0,\\ \\exists N,\\ \\forall n \\ge N,\\quad |u_n - L| < \\varepsilon"
          }
        </Tex>
        <p>
          L'adversaire choisit la largeur ε de la bande jaune, tu places le rang <Tex>N</Tex>. Tu gagnes si tous les
          termes à partir de <Tex>N</Tex> restent dans la bande, pas seulement ceux que tu vois.
        </p>
        <EpsilonNViz />
        <p>
          Ici <Tex>{"|u_n - 1| = \\tfrac{2}{n}"}</Tex>, donc <Tex>{"|u_n - 1| < \\varepsilon \\iff n > \\tfrac{2}{\\varepsilon}"}</Tex>.
          Ta stratégie gagnante : prendre pour <Tex>N</Tex> n'importe quel entier plus grand que{" "}
          <Tex>{"\\tfrac{2}{\\varepsilon}"}</Tex>. Comme au chapitre 3, une preuve de limite est une formule qui donne ta
          réponse en fonction de ε.
        </p>
        <h3>Croissante et majorée, donc convergente</h3>
        <p>
          Parfois on ne connaît pas <Tex>L</Tex> à l'avance. On s'appuie alors sur une propriété des nombres réels,
          qu'on admet :
        </p>
        <Tex block>{"(u_n) \\text{ croissante et majorée} \\implies (u_n) \\text{ converge}"}</Tex>
        <p>
          Une suite qui monte sans jamais dépasser un plafond finit forcément par se tasser quelque part. Ce
          « quelque part » n'est pas forcément le plafond : c'est le plus petit des plafonds possibles. Tu vas t'en
          servir tout de suite, parce que c'est exactement le cas des sommes de termes positifs.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Une série, c'est une boucle qui accumule</h2>
        <p>
          Additionner une infinité de nombres n'a pas de sens direct. Ce qui en a, c'est la boucle qui les ajoute un par
          un. Voici la somme des puissances de <Tex>{"\\tfrac12"}</Tex>, de <Tex>{"k = 0"}</Tex> jusqu'à{" "}
          <Tex>{"k = N"}</Tex> :
        </p>
        <pre>
          <code>{`def somme_partielle(N):
    s = 0
    for k in range(N + 1):
        s += (1/2) ** k
    return s

for N in [0, 1, 2, 5, 10, 20, 60]:
    print(N, somme_partielle(N))`}</code>
        </pre>
        <pre>
          <code>{`0 1.0
1 1.5
2 1.75
5 1.96875
10 1.9990234375
20 1.9999990463256836
60 2.0`}</code>
        </pre>
        <p>
          La valeur renvoyée s'appelle une <strong>somme partielle</strong>, notée <Tex>{"S_N"}</Tex>. On définit
          alors :
        </p>
        <Tex block>
          {
            "S_N = \\sum_{k=0}^{N} a_k \\qquad\\qquad \\sum_{k=0}^{+\\infty} a_k = \\lim_{N \\to +\\infty} S_N \\quad \\text{(si cette limite existe)}"
          }
        </Tex>
        <p>
          Si la limite existe et est finie, la série <strong>converge</strong>. Sinon, elle <strong>diverge</strong>.
          Une série, c'est donc une suite comme les autres : la suite de ses sommes partielles. Tout ce que tu viens de
          voir sur les suites s'applique.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <p>
            Pour <Tex>{"N = 60"}</Tex>, la machine affiche exactement <code>2.0</code>. Pourtant, mathématiquement,
            chaque somme partielle vaut <Tex>{"S_N = 2 - 2^{-N}"}</Tex>, strictement moins que 2. L'écart{" "}
            <Tex>{"2^{-60}"}</Tex> est simplement plus petit que ce qu'un <code>float</code> sait distinguer autour de
            2 (des pas de <Tex>{"2^{-52}"}</Tex> environ). La boucle infinie, elle, n'a pas besoin d'être exécutée :
            c'est la limite qui la remplace.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>La série géométrique</h2>
        <p>
          C'est la série la plus importante du chapitre, et tu connais déjà ses termes : ceux d'une suite géométrique de
          raison <Tex>q</Tex>. L'astuce pour calculer la somme partielle : écrire <Tex>{"S_N"}</Tex> et{" "}
          <Tex>{"q S_N"}</Tex> l'une sous l'autre, puis soustraire. Presque tout se simplifie.
        </p>
        <Tex block>
          {
            "\\begin{aligned} S_N &= 1 + q + q^2 + \\dots + q^N \\\\ q\\,S_N &= \\phantom{1 + {}} q + q^2 + \\dots + q^N + q^{N+1} \\\\ (1 - q)\\,S_N &= 1 - q^{N+1} \\end{aligned}"
          }
        </Tex>
        <p>
          Donc, pour <Tex>{"q \\neq 1"}</Tex>, <Tex>{"S_N = \\dfrac{1 - q^{N+1}}{1 - q}"}</Tex>. Tout se joue sur{" "}
          <Tex>{"q^{N+1}"}</Tex> : si <Tex>{"|q| < 1"}</Tex>, il tend vers 0, sinon il ne tend pas vers 0.
        </p>
        <Tex block>{"\\sum_{k=0}^{+\\infty} q^k = \\frac{1}{1 - q} \\quad \\text{si } |q| < 1, \\qquad \\text{la série diverge si } |q| \\ge 1"}</Tex>
        <p>
          Fais varier <Tex>q</Tex>. Pour <Tex>{"q = 0{,}5"}</Tex>, les points se collent à la ligne verte{" "}
          <Tex>{"y = 2"}</Tex>. Pour <Tex>q</Tex> négatif, ils zigzaguent autour de la limite en se resserrant. Dès
          que <Tex>{"|q| \\ge 1"}</Tex>, plus rien ne se stabilise.
        </p>
        <GeometricViz />
        <p>
          Avec un premier terme <Tex>a</Tex> et un indice de départ <Tex>m</Tex>, on factorise :{" "}
          <Tex>{"\\sum_{k=m}^{+\\infty} a\\,q^k = \\dfrac{a\\,q^m}{1 - q}"}</Tex>, autrement dit « premier terme sur
          (1 moins la raison) ».
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Harmonique contre Bâle</h2>
        <p>
          Pour qu'une série converge, il faut que ses termes tendent vers 0 : sinon on ajoute sans cesse des morceaux
          de taille non négligeable. Mais ça ne suffit pas. La <strong>série harmonique</strong> le montre :
        </p>
        <Tex block>{"\\sum_{n=1}^{+\\infty} \\frac{1}{n} = +\\infty \\quad \\text{alors que} \\quad \\frac{1}{n} \\to 0"}</Tex>
        <p>La preuve tient en un regroupement : on coupe la somme en paquets de 1, 2, 4, 8… termes.</p>
        <Tex block>
          {
            "1 + \\frac12 + \\underbrace{\\frac13 + \\frac14}_{\\ge\\, 2 \\times \\frac14 \\,=\\, \\frac12} + \\underbrace{\\frac15 + \\dots + \\frac18}_{\\ge\\, 4 \\times \\frac18 \\,=\\, \\frac12} + \\underbrace{\\frac19 + \\dots + \\frac{1}{16}}_{\\ge\\, 8 \\times \\frac{1}{16} \\,=\\, \\frac12} + \\cdots"
          }
        </Tex>
        <p>
          Chaque paquet vaut au moins <Tex>{"\\tfrac12"}</Tex>, et il y en a une infinité : jusqu'à{" "}
          <Tex>{"n = 2^k"}</Tex>, la somme vaut au moins <Tex>{"1 + \\tfrac{k}{2}"}</Tex>. Elle dépasse donc n'importe quel
          plafond, mais très lentement :
        </p>
        <pre>
          <code>{`import math

h = 0
b = 0
for n in range(1, 10**6 + 1):
    h += 1 / n
    b += 1 / n**2
print(h)
print(b)
print(math.pi**2 / 6)`}</code>
        </pre>
        <pre>
          <code>{`14.392726722864989
1.64493306684877
1.6449340668482264`}</code>
        </pre>
        <p>
          Un million de termes pour à peine dépasser 14. À l'inverse, <Tex>{"\\sum \\frac{1}{n^2}"}</Tex> se stabilise.
          Trouver sa valeur exacte était un problème célèbre, posé par Pietro Mengoli en 1650 et appelé problème de Bâle.
          Euler l'a résolu en 1734 :
        </p>
        <Tex block>{"\\sum_{n=1}^{+\\infty} \\frac{1}{n^2} = \\frac{\\pi^2}{6} \\approx 1{,}6449"}</Tex>
        <p>
          La boucle confirme les six premiers chiffres. On ne démontrera pas la valeur ici, mais la convergence, si, en
          revenant aux intégrales.
        </p>
        <h3>Des rectangles sous une courbe</h3>
        <p>
          Au chapitre 6, tu as vu que <Tex>{"\\int_1^{+\\infty} \\frac{dx}{x^2}"}</Tex> converge alors que{" "}
          <Tex>{"\\int_1^{+\\infty} \\frac{dx}{x}"}</Tex> diverge. Ce n'est pas une coïncidence. Pour{" "}
          <Tex>{"f(x) = \\frac{1}{x^p}"}</Tex>, qui décroît, le rectangle de largeur 1 posé sur{" "}
          <Tex>{"[n-1, n]"}</Tex> avec la hauteur <Tex>{"f(n)"}</Tex> tient sous la courbe. Son aire vaut{" "}
          <Tex>{"f(n) = \\frac{1}{n^p}"}</Tex>, le terme de la série.
        </p>
        <SeriesIntegralViz />
        <p>
          Les rectangles bleus (termes <Tex>{"n \\ge 2"}</Tex>) ont une aire totale inférieure à l'aire sous la
          courbe, et le rectangle rouge est le terme <Tex>{"n = 1"}</Tex> :
        </p>
        <Tex block>{"\\sum_{n=1}^{N} \\frac{1}{n^2} \\le 1 + \\int_1^{N} \\frac{dx}{x^2} = 1 + 1 - \\frac{1}{N} < 2"}</Tex>
        <p>
          Les sommes partielles sont croissantes (on ajoute des termes positifs) et majorées par 2 : la série converge,
          par la propriété de la section 1. Dans l'autre sens, en plaçant les rectangles sur{" "}
          <Tex>{"[n, n+1]"}</Tex> ils dépassent de la courbe, et on obtient{" "}
          <Tex>{"\\sum_{n=1}^{N} \\frac1n \\ge \\ln(N+1)"}</Tex> : pour <Tex>{"N = 10^6"}</Tex>, ça donne au moins 13,8, et
          la boucle a trouvé 14,39. Retiens la règle générale :
        </p>
        <Tex block>{"\\sum_{n \\ge 1} \\frac{1}{n^p} \\text{ converge} \\iff p > 1"}</Tex>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Deux tests de convergence</h2>
        <p>
          Le plus souvent, on ne sait pas calculer la somme. On veut seulement savoir si elle est finie. Deux outils
          couvrent l'essentiel des cas, pour des termes positifs.
        </p>
        <h3>Comparaison</h3>
        <p>
          Si <Tex>{"0 \\le a_n \\le b_n"}</Tex> et que <Tex>{"\\sum b_n"}</Tex> converge, alors{" "}
          <Tex>{"\\sum a_n"}</Tex> converge : ses sommes partielles sont croissantes et plafonnées par celles de{" "}
          <Tex>{"\\sum b_n"}</Tex>. Dans l'autre sens, si la plus petite diverge, la plus grande aussi.
        </p>
        <Tex block>
          {
            "\\frac{1}{n^2 + n} \\le \\frac{1}{n^2} \\implies \\text{converge} \\qquad\\qquad \\frac{1}{\\sqrt n} \\ge \\frac{1}{n} \\implies \\text{diverge}"
          }
        </Tex>
        <h3>Le rapport de d'Alembert</h3>
        <p>
          La série géométrique suggère une idée : si chaque terme vaut à peu près <Tex>{"\\ell"}</Tex> fois le
          précédent, la série se comporte comme une géométrique de raison <Tex>{"\\ell"}</Tex>.
        </p>
        <Tex block>
          {
            "\\lim_{n \\to +\\infty} \\left|\\frac{a_{n+1}}{a_n}\\right| = \\ell \\qquad \\begin{cases} \\ell < 1 : \\text{converge} \\\\ \\ell > 1 : \\text{diverge} \\\\ \\ell = 1 : \\text{on ne peut pas conclure} \\end{cases}"
          }
        </Tex>
        <p>
          Exemple : pour <Tex>{"a_n = \\frac{n}{2^n}"}</Tex>, le rapport vaut{" "}
          <Tex>{"\\frac{n+1}{2n} \\to \\frac12"}</Tex>, donc la série converge (sa somme vaut 2). Le cas{" "}
          <Tex>{"\\ell = 1"}</Tex> est vraiment indécis : <Tex>{"\\frac1n"}</Tex> et <Tex>{"\\frac{1}{n^2}"}</Tex>{" "}
          donnent toutes les deux un rapport qui tend vers 1, et l'une diverge, l'autre converge.
        </p>
        <p>
          Un dernier exemple, qui prépare le chapitre suivant. Pour <Tex>{"a_n = \\frac{x^n}{n!}"}</Tex>, avec{" "}
          <Tex>x</Tex> fixé :
        </p>
        <Tex block>{"\\left|\\frac{a_{n+1}}{a_n}\\right| = \\frac{|x|}{n+1} \\xrightarrow[n \\to +\\infty]{} 0 < 1"}</Tex>
        <p>
          Cette série converge donc pour <em>tout</em> réel <Tex>x</Tex>, même énorme : la factorielle finit toujours
          par écraser la puissance. Tu découvriras au chapitre 8 que sa somme est <Tex>{"e^x"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>Application : régler le pas de la descente de gradient</h2>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans la vidéo sur la descente de gradient stochastique, chaque mise à jour est{" "}
            <Tex>{"w \\leftarrow w - \\eta\\, \\nabla_w \\text{Loss}(x, y, w)"}</Tex>, et le cours pose la question :
            que doit valoir le pas <Tex>{"\\eta"}</Tex> ? Il propose deux stratégies : constant (
            <Tex>{"\\eta = 0{,}1"}</Tex>), ou décroissant, <Tex>{"\\eta = 1/\\sqrt{\\text{nombre de mises à jour}}"}</Tex>.
          </p>
        </div>
        <p>
          Les séries donnent un cadre pour y réfléchir. En 1951, Herbert Robbins et Sutton Monro ont publié un
          algorithme d'approximation stochastique, ancêtre de la SGD, avec des pas <Tex>{"\\eta_t"}</Tex> qui vérifient
          deux conditions :
        </p>
        <Tex block>{"\\sum_{t=1}^{+\\infty} \\eta_t = +\\infty \\qquad \\text{et} \\qquad \\sum_{t=1}^{+\\infty} \\eta_t^2 < +\\infty"}</Tex>
        <p>L'intuition, sans la preuve :</p>
        <ul>
          <li>
            <p>
              La première série doit diverger. Si la somme des pas était finie, avec des gradients bornés, la distance
              totale parcourue serait bornée elle aussi : un point de départ trop loin de la solution ne l'atteindrait
              jamais.
            </p>
          </li>
          <li>
            <p>
              La seconde doit converger. Chaque gradient calculé sur un seul exemple est bruité, et le bruit
              accumulé se mesure avec les carrés des pas. S'il ne reste pas fini, les poids ne se posent jamais.
            </p>
          </li>
        </ul>
        <p>
          Le choix <Tex>{"\\eta_t = \\frac1t"}</Tex> coche les deux cases grâce à la section 4 :{" "}
          <Tex>{"\\sum \\frac1t"}</Tex> est la série harmonique, qui diverge, et <Tex>{"\\sum \\frac{1}{t^2}"}</Tex> est
          celle de Bâle, qui converge. Un pas constant rate la seconde condition : <Tex>{"\\sum 0{,}1^2"}</Tex> est une
          somme infinie de <Tex>{"0{,}01"}</Tex>. Et <Tex>{"\\frac{1}{\\sqrt t}"}</Tex>, le choix de CS221, la rate aussi,
          puisque <Tex>{"\\left(\\frac{1}{\\sqrt t}\\right)^2 = \\frac1t"}</Tex>.
        </p>
        <p>
          Ça ne rend pas le choix du cours faux : les conditions de Robbins–Monro sont <em>suffisantes</em>, pas
          nécessaires. Les notes de CS221 mentionnent des garanties de convergence pour <Tex>{"1/\\sqrt t"}</Tex>{" "}
          (avec des gradients bornés) : elles viennent d'autres théorèmes. Ce qu'il faut retenir, c'est le réflexe :
          devant une suite de pas, se demander ce que valent <Tex>{"\\sum \\eta_t"}</Tex> et{" "}
          <Tex>{"\\sum \\eta_t^2"}</Tex>.
        </p>
      </section>
    </LessonFlow>
  );
}
