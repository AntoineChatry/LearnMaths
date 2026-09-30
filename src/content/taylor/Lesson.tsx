import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { NewtonViz } from "./NewtonViz";
import { TaylorViz } from "./TaylorViz";

export function TaylorLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>De la tangente à la parabole</h2>
        <p>
          Tu connais déjà la meilleure approximation d'une fonction par une droite : sa tangente. Près de 0,
        </p>
        <Tex block>{"f(x) \\approx f(0) + f'(0)\\,x"}</Tex>
        <p>
          Pour <Tex>{"\\cos"}</Tex>, ça donne <Tex>{"\\cos x \\approx 1"}</Tex>, puisque <Tex>{"\\cos'(0) = -\\sin 0 = 0"}</Tex>.
          La tangente est horizontale : elle ignore complètement que la courbe se courbe vers le bas.
        </p>
        <p>
          Idée : remplacer la droite par une parabole <Tex>{"a + bx + cx^2"}</Tex> qui colle à <Tex>f</Tex> encore
          mieux, en imposant la même valeur, la même pente <em>et</em> la même dérivée seconde en 0. En dérivant{" "}
          <Tex>{"a + bx + cx^2"}</Tex> deux fois, on trouve <Tex>{"a = f(0)"}</Tex>, <Tex>{"b = f'(0)"}</Tex> et{" "}
          <Tex>{"2c = f''(0)"}</Tex> :
        </p>
        <Tex block>{"f(x) \\approx f(0) + f'(0)\\,x + \\frac{f''(0)}{2}\\,x^2"}</Tex>
        <p>
          C'est la <strong>parabole osculatrice</strong> (du latin <em>osculari</em>, embrasser). Pour{" "}
          <Tex>{"\\cos"}</Tex>, <Tex>{"\\cos''(0) = -\\cos 0 = -1"}</Tex>, donc <Tex>{"\\cos x \\approx 1 - \\frac{x^2}{2}"}</Tex>.
          Compare en <Tex>{"x = 0{,}1"}</Tex> :
        </p>
        <table className="value-table">
          <thead>
            <tr>
              <th>cos(0,1)</th>
              <th>tangente : 1</th>
              <th>parabole : 1 − 0,01/2</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>0,9950041652…</td>
              <td>1 (écart ≈ 5·10⁻³)</td>
              <td>0,995 (écart ≈ 4·10⁻⁶)</td>
            </tr>
          </tbody>
        </table>
        <p>Un seul terme de plus, et l'erreur est divisée par plus de mille.</p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>L'ordre n, et pourquoi des factorielles</h2>
        <p>
          On continue : un polynôme de degré <Tex>n</Tex> qui a les mêmes dérivées que <Tex>f</Tex> en 0 jusqu'à
          l'ordre <Tex>n</Tex>. D'où viennent les factorielles ? Dérive <Tex>{"x^k"}</Tex> <Tex>k</Tex> fois de suite :
        </p>
        <Tex block>{"x^k \\to k\\,x^{k-1} \\to k(k-1)\\,x^{k-2} \\to \\cdots \\to k(k-1)\\cdots 2 \\cdot 1 = k!"}</Tex>
        <p>
          Donc si <Tex>{"P(x) = c_0 + c_1 x + \\dots + c_n x^n"}</Tex>, sa dérivée <Tex>k</Tex>-ième en 0 vaut{" "}
          <Tex>{"k!\\,c_k"}</Tex> (les autres termes sont soit déjà annulés, soit encore multipliés par une puissance de{" "}
          <Tex>x</Tex> qui vaut 0). Pour qu'elle égale <Tex>{"f^{(k)}(0)"}</Tex>, il faut{" "}
          <Tex>{"c_k = \\frac{f^{(k)}(0)}{k!}"}</Tex>. C'est le <strong>polynôme de Taylor</strong> d'ordre{" "}
          <Tex>n</Tex> en 0 :
        </p>
        <Tex block>{"P_n(x) = \\sum_{k=0}^{n} \\frac{f^{(k)}(0)}{k!}\\,x^k = f(0) + f'(0)\\,x + \\frac{f''(0)}{2!}\\,x^2 + \\dots + \\frac{f^{(n)}(0)}{n!}\\,x^n"}</Tex>
        <h3>Et l'erreur ?</h3>
        <p>
          La <strong>formule de Taylor-Lagrange</strong> dit exactement ce qu'on perd. Si <Tex>f</Tex> est dérivable{" "}
          <Tex>{"n+1"}</Tex> fois, il existe un nombre <Tex>c</Tex> entre 0 et <Tex>x</Tex> tel que
        </p>
        <Tex block>{"f(x) = P_n(x) + \\frac{f^{(n+1)}(c)}{(n+1)!}\\,x^{n+1}"}</Tex>
        <p>
          On ne connaît pas <Tex>c</Tex>, mais on peut souvent borner <Tex>{"f^{(n+1)}"}</Tex>. Pour{" "}
          <Tex>{"e^x"}</Tex> en <Tex>{"x = 1"}</Tex>, toutes les dérivées valent <Tex>{"e^c \\le e < 3"}</Tex>, donc
        </p>
        <Tex block>{"\\left| e - P_n(1) \\right| \\le \\frac{3}{(n+1)!}"}</Tex>
        <p>
          Pour <Tex>{"n = 5"}</Tex>, la borne vaut <Tex>{"\\tfrac{3}{720} \\approx 0{,}004"}</Tex>, et l'écart réel est
          de 0,0016. La factorielle au dénominateur explose, et c'est elle qui fait marcher toute la méthode.
        </p>
        <p>
          La version qualitative, dite de <strong>Taylor-Young</strong>, suffit souvent : près de 0, l'erreur{" "}
          <Tex>{"f(x) - P_n(x)"}</Tex> est négligeable devant <Tex>{"x^n"}</Tex>, c'est-à-dire{" "}
          <Tex>{"\\frac{f(x) - P_n(x)}{x^n} \\to 0"}</Tex> quand <Tex>{"x \\to 0"}</Tex>. C'est ce qui permet de lever
          des formes indéterminées : <Tex>{"\\frac{1 - \\cos x}{x^2} = \\frac{x^2/2 + (\\text{négligeable devant } x^2)}{x^2} \\to \\frac12"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Les cinq développements à connaître</h2>
        <p>
          En appliquant <Tex>{"c_k = \\frac{f^{(k)}(0)}{k!}"}</Tex> (les dérivées successives de exp, sin et cos
          tournent en boucle), on obtient :
        </p>
        <Tex block>
          {
            "\\begin{aligned} e^x &= 1 + x + \\frac{x^2}{2!} + \\frac{x^3}{3!} + \\cdots + \\frac{x^n}{n!} + \\cdots \\\\ \\sin x &= x - \\frac{x^3}{3!} + \\frac{x^5}{5!} - \\cdots \\\\ \\cos x &= 1 - \\frac{x^2}{2!} + \\frac{x^4}{4!} - \\cdots \\\\ \\ln(1+x) &= x - \\frac{x^2}{2} + \\frac{x^3}{3} - \\frac{x^4}{4} + \\cdots \\\\ \\frac{1}{1-x} &= 1 + x + x^2 + x^3 + \\cdots \\end{aligned}"
          }
        </Tex>
        <p>
          Le dernier, tu le connais déjà : c'est la série géométrique du chapitre 7, lue à l'envers. Et le premier
          répond à la promesse du chapitre 7 : la série <Tex>{"\\sum \\frac{x^n}{n!}"}</Tex>, qui converge pour tout{" "}
          <Tex>x</Tex>, a pour somme <Tex>{"e^x"}</Tex>. Remarque aussi les parités : <Tex>{"\\sin"}</Tex> est impaire et
          n'a que des puissances impaires, <Tex>{"\\cos"}</Tex> est paire et n'a que des puissances paires.
        </p>
        <p>
          Choisis une fonction et monte l'ordre <Tex>n</Tex>. La courbe grise est la fonction, la rouge est{" "}
          <Tex>{"P_n"}</Tex>. Le trait vert en bas marque la zone autour de 0 où l'écart reste sous 0,01.
        </p>
        <TaylorViz />
        <p>
          Pour exp, sin et cos, la zone verte s'élargit à mesure que <Tex>n</Tex> augmente. Pour{" "}
          <Tex>{"\\ln(1+x)"}</Tex> et <Tex>{"\\frac{1}{1-x}"}</Tex>, elle se cogne à un mur : quel que soit l'ordre
          choisi, elle reste coincée entre <Tex>{"-1"}</Tex> et <Tex>1</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Là où ça tient, là où ça casse</h2>
        <p>
          Voici <Tex>{"P_n(x)"}</Tex> pour <Tex>{"\\ln(1+x)"}</Tex>, calculé en deux points :
        </p>
        <table className="value-table">
          <thead>
            <tr>
              <th>n</th>
              <th>1</th>
              <th>2</th>
              <th>3</th>
              <th>4</th>
              <th>5</th>
              <th>10</th>
              <th>20</th>
              <th>vraie valeur</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <th>x = 0,5</th>
              <td>0,5</td>
              <td>0,375</td>
              <td>0,4167</td>
              <td>0,401</td>
              <td>0,4073</td>
              <td>0,4054</td>
              <td>0,4055</td>
              <td>ln 1,5 ≈ 0,4055</td>
            </tr>
            <tr>
              <th>x = 2</th>
              <td>2</td>
              <td>0</td>
              <td>2,6667</td>
              <td>−1,3333</td>
              <td>5,0667</td>
              <td>−64,8254</td>
              <td>−34359,7081</td>
              <td>ln 3 ≈ 1,0986</td>
            </tr>
          </tbody>
        </table>
        <p>
          En <Tex>{"x = 0{,}5"}</Tex>, ça converge. En <Tex>{"x = 2"}</Tex>, ça explose. Le test de d'Alembert du
          chapitre 7 explique pourquoi. Le terme général est <Tex>{"a_k = \\frac{x^k}{k}"}</Tex> (au signe près) :
        </p>
        <Tex block>{"\\left|\\frac{a_{k+1}}{a_k}\\right| = |x|\\,\\frac{k}{k+1} \\xrightarrow[k \\to +\\infty]{} |x|"}</Tex>
        <p>
          Convergence si <Tex>{"|x| < 1"}</Tex>, divergence si <Tex>{"|x| > 1"}</Tex>. Ce seuil 1 s'appelle le{" "}
          <strong>rayon de convergence</strong>. Intuition : <Tex>{"\\ln(1+x)"}</Tex> n'existe plus en{" "}
          <Tex>{"x = -1"}</Tex>, et un développement centré en 0 ne peut pas voir plus loin que la distance à ce
          problème, y compris de l'autre côté. Même chose pour <Tex>{"\\frac{1}{1-x}"}</Tex>, qui explose en{" "}
          <Tex>{"x = 1"}</Tex>. Pour <Tex>{"e^x"}</Tex>, le rapport vaut <Tex>{"\\frac{|x|}{k+1} \\to 0"}</Tex> : aucun
          mur, rayon infini.
        </p>
        <p>
          Morale : un polynôme de Taylor est une approximation <em>locale</em>. Il est excellent près du point de
          développement, et peut devenir absurde loin de lui.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Comment une machine calcule sin et exp</h2>
        <p>
          Un processeur sait additionner et multiplier, pas « faire exp ». Un polynôme, c'est justement des additions
          et des multiplications. Essayons la série de <Tex>{"e^x"}</Tex> telle quelle, en calculant chaque terme à
          partir du précédent (<Tex>{"\\frac{x^{k+1}}{(k+1)!} = \\frac{x^k}{k!} \\times \\frac{x}{k+1}"}</Tex>) :
        </p>
        <pre>
          <code>{`import math

def exp_serie(x, n_termes=30):
    s, terme = 0, 1
    for k in range(n_termes):
        s += terme              # terme vaut x**k / k!
        terme *= x / (k + 1)    # on passe à x**(k+1) / (k+1)!
    return s

for x in [1, 5, -20]:
    print(x, exp_serie(x), math.exp(x))`}</code>
        </pre>
        <pre>
          <code>{`1 2.7182818284590455 2.718281828459045
5 148.41315910257242 148.4131591025766
-20 -2448299.296599294 2.061153622438558e-09`}</code>
        </pre>
        <p>
          En <Tex>{"x = 1"}</Tex>, parfait au dernier chiffre près. En <Tex>{"x = 5"}</Tex>, 12 chiffres justes. En{" "}
          <Tex>{"x = -20"}</Tex>, catastrophe : une valeur négative de l'ordre de <Tex>{"-2{,}4 \\times 10^6"}</Tex> pour
          un nombre qui vaut <Tex>{"2 \\times 10^{-9}"}</Tex>. Deux problèmes se cumulent. D'abord 30 termes ne
          suffisent pas : loin de 0, il en faut beaucoup plus. Ensuite, même avec 100 termes, les termes
          intermédiaires atteignent <Tex>{"\\frac{20^{20}}{20!} \\approx 4 \\times 10^7"}</Tex> avec des signes
          alternés, et leurs erreurs d'arrondi, minuscules en relatif, sont énormes comparées au résultat :
        </p>
        <pre>
          <code>{`print(exp_serie(-20, 100))
print(1 / exp_serie(20, 100))
print(math.exp(-20))`}</code>
        </pre>
        <pre>
          <code>{`6.147561828914626e-09
2.061153622438557e-09
2.061153622438558e-09`}</code>
        </pre>
        <p>
          La deuxième ligne contourne le problème avec une identité, <Tex>{"e^{-20} = \\frac{1}{e^{20}}"}</Tex> : tous
          les termes deviennent positifs. C'est l'idée clé des vraies bibliothèques : <strong>on ne développe jamais
          loin de 0</strong>. On utilise d'abord les propriétés de la fonction pour ramener <Tex>x</Tex> dans un petit
          intervalle, puis on applique un polynôme là où il est excellent.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <p>
            La documentation de CPython précise que le module <code>math</code> est surtout une fine couche au-dessus
            de la bibliothèque mathématique C de la plateforme. Ce qui suit décrit l'une d'elles, celle de FreeBSD
            (msun), dont le code source est public ; chaque bibliothèque fait ses propres choix de détail.
          </p>
        </div>
        <p>Pour <Tex>{"\\sin"}</Tex>, le code source de FreeBSD procède en deux temps :</p>
        <ol>
          <li>
            <p>
              <strong>Réduction d'argument.</strong> On écrit <Tex>{"x = k\\,\\frac{\\pi}{2} + y"}</Tex> avec{" "}
              <Tex>{"|y| \\le \\frac{\\pi}{4}"}</Tex>. Selon le reste de <Tex>k</Tex> modulo 4,{" "}
              <Tex>{"\\sin x"}</Tex> vaut <Tex>{"\\sin y"}</Tex>, <Tex>{"\\cos y"}</Tex>, <Tex>{"-\\sin y"}</Tex> ou{" "}
              <Tex>{"-\\cos y"}</Tex> : c'est le cercle trigonométrique, qui tourne d'un quart de tour à chaque fois.
            </p>
          </li>
          <li>
            <p>
              <strong>Polynôme.</strong> Sur <Tex>{"[-\\frac{\\pi}{4}, \\frac{\\pi}{4}]"}</Tex>,{" "}
              <Tex>{"\\sin y \\approx y + S_1 y^3 + S_2 y^5 + \\dots + S_6 y^{13}"}</Tex>, et le commentaire du code
              garantit que l'écart relatif entre ce polynôme et <Tex>{"\\sin"}</Tex> reste sous{" "}
              <Tex>{"2^{-58}"}</Tex> sur tout l'intervalle.
            </p>
          </li>
        </ol>
        <p>
          Ce polynôme de degré 13 ressemble beaucoup au développement de Taylor, mais pas tout à fait. Les premiers
          coefficients coïncident presque avec <Tex>{"-\\frac{1}{3!}"}</Tex>, <Tex>{"\\frac{1}{5!}"}</Tex>,{" "}
          <Tex>{"-\\frac{1}{7!}"}</Tex> (<Tex>{"S_1 \\approx -0{,}16666666666666632"}</Tex> contre{" "}
          <Tex>{"-\\frac16 = -0{,}1666\\ldots"}</Tex>), mais le dernier, <Tex>{"S_6"}</Tex>, s'écarte d'environ 1 % de{" "}
          <Tex>{"\\frac{1}{13!}"}</Tex>. Ce ne sont donc pas les coefficients de Taylor, qui visent la perfection
          près de 0, mais ceux d'un polynôme construit pour tenir la borne sur tout l'intervalle. Taylor donne le
          point de départ, l'ingénierie numérique fait le reste.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>Aperçu : l'ordre 2 et la méthode de Newton</h2>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            La descente de gradient fait <Tex>{"w \\leftarrow w - \\eta\\,\\nabla_w \\text{TrainLoss}(w)"}</Tex>. En
            dimension 1, c'est <Tex>{"w \\leftarrow w - \\eta\\,f'(w)"}</Tex> : elle ne regarde que la pente,
            c'est-à-dire l'ordre 1 de Taylor. Le pas <Tex>{"\\eta"}</Tex>, il faut le choisir à la main.
          </p>
        </div>
        <p>
          Et si on regardait aussi la courbure ? Près d'un point <Tex>x</Tex>, le développement d'ordre 2 remplace{" "}
          <Tex>f</Tex> par une parabole :
        </p>
        <Tex block>{"f(x + h) \\approx f(x) + f'(x)\\,h + \\frac{f''(x)}{2}\\,h^2"}</Tex>
        <p>
          Si <Tex>{"f''(x) > 0"}</Tex>, cette parabole a un minimum, qu'on trouve en annulant sa dérivée en{" "}
          <Tex>h</Tex> : <Tex>{"f'(x) + f''(x)\\,h = 0"}</Tex>, donc <Tex>{"h = -\\frac{f'(x)}{f''(x)}"}</Tex>. La{" "}
          <strong>méthode de Newton</strong> saute directement au sommet de cette parabole, puis recommence :
        </p>
        <Tex block>{"x \\leftarrow x - \\frac{f'(x)}{f''(x)}"}</Tex>
        <p>
          C'est une descente de gradient dont le pas <Tex>{"\\eta = \\frac{1}{f''(x)}"}</Tex> est réglé par la
          courbure : grands pas là où la courbe est plate, petits pas là où elle est serrée. Déplace le point bleu,
          puis clique plusieurs fois sur le bouton : la parabole rouge en pointillés est la parabole osculatrice.
        </p>
        <NewtonViz />
        <p>
          Depuis <Tex>{"x = 2{,}5"}</Tex>, les pas donnent 1,664 ; 1,043 ; 0,748 ; 0,6946 ; 0,693148, pour{" "}
          <Tex>{"\\ln 2 \\approx 0{,}693147"}</Tex>. Sur les trois derniers, l'erreur passe d'environ 0,05 à 0,0015 puis
          à <Tex>{"10^{-6}"}</Tex> : près du minimum, le nombre de chiffres justes double à peu près à chaque pas.
        </p>
        <p>
          En plusieurs dimensions, <Tex>{"f''"}</Tex> devient une matrice de dérivées secondes, la{" "}
          <strong>hessienne</strong>, et diviser par <Tex>{"f''"}</Tex> devient résoudre un système linéaire, du calcul
          matriciel comme sur Khan Academy. Pour un réseau de neurones à des millions de poids, cette matrice est
          beaucoup trop grosse pour être calculée telle quelle : c'est une des raisons pour lesquelles on s'en tient
          en pratique à des méthodes du premier ordre comme la SGD. Mais l'idée de courbure reste centrale, et tu
          la retrouveras au chapitre sur le gradient.
        </p>
      </section>
    </LessonFlow>
  );
}
