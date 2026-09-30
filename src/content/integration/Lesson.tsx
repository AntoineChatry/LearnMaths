import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { AccumulationViz } from "./AccumulationViz";
import { ImproperViz } from "./ImproperViz";
import { RiemannViz } from "./RiemannViz";

export function IntegrationLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Des rectangles à l'intégrale</h2>
        <p>
          En Terminale, tu as vu la méthode des rectangles : on découpe <Tex>{"[a, b]"}</Tex> en <Tex>n</Tex> bandes de
          largeur <Tex>{"h = \\tfrac{b-a}{n}"}</Tex>, on remplace la courbe par un rectangle sur chaque bande, et on
          additionne :
        </p>
        <Tex block>{"S_n = \\sum_{i=0}^{n-1} f(x_i)\\,h \\quad\\xrightarrow[n \\to +\\infty]{}\\quad \\int_a^b f(x)\\,\\mathrm{d}x"}</Tex>
        <div className="aside-cs">
          <p className="aside-cs-title">En Python</p>
          <p>
            Le symbole <Tex>{"\\sum"}</Tex> est une boucle <code>for</code> avec un accumulateur, et l'intégrale est ce
            que cette boucle renvoie quand les rectangles deviennent infiniment fins :
          </p>
          <pre>
            <code>{`h = (b - a) / n
s = 0
for i in range(n):
    s += f(a + i*h) * h    # aire du rectangle n° i`}</code>
          </pre>
        </div>
        <p>
          Tout le jeu consiste à choisir <em>où</em> on lit la hauteur de chaque rectangle : au bord gauche de la
          bande, au bord droit, ou au milieu. Ici <Tex>{"f(x) = \\tfrac{x^2}{4} + 1"}</Tex> sur{" "}
          <Tex>{"[0, 3]"}</Tex>, dont l'intégrale vaut exactement <Tex>{"5{,}25"}</Tex>. Monte <Tex>n</Tex> et compare
          les trois méthodes.
        </p>
        <RiemannViz />
        <p>
          Deux choses sautent aux yeux. À gauche, la courbe monte, donc chaque rectangle est trop bas : la somme sous-estime.
          À droite, c'est l'inverse. Et surtout, regarde la dernière case : à gauche, « erreur × n » se stabilise
          vers <Tex>{"-3{,}375"}</Tex>. L'erreur se comporte donc comme <Tex>{"\\tfrac{C}{n}"}</Tex> : pour gagner un
          chiffre de précision, il faut dix fois plus de rectangles.
        </p>
        <h3>Pourquoi 1/n à gauche</h3>
        <p>
          Sur une bande de largeur <Tex>h</Tex>, le rectangle de gauche rate à peu près un triangle de base{" "}
          <Tex>h</Tex> et de hauteur <Tex>{"f'(x_i)\\,h"}</Tex> (la courbe monte avec la pente <Tex>{"f'(x_i)"}</Tex>).
          On additionne ces <Tex>n</Tex> triangles, et on reconnaît une somme de rectangles pour <Tex>{"f'"}</Tex> :
        </p>
        <Tex block>
          {"\\begin{aligned} S_n - \\int_a^b f &\\approx -\\sum_{i} \\frac{f'(x_i)\\,h^2}{2} = -\\frac{h}{2}\\sum_i f'(x_i)\\,h \\\\ &\\approx -\\frac{h}{2}\\int_a^b f' = -\\frac{(b-a)\\big(f(b)-f(a)\\big)}{2n} \\end{aligned}"}
        </Tex>
        <p>
          Ici <Tex>{"(b-a)\\big(f(b)-f(a)\\big)/2 = 3 \\times 2{,}25 / 2 = 3{,}375"}</Tex> : c'est exactement la valeur
          vers laquelle « erreur × n » tend.
        </p>
        <h3>Pourquoi le milieu est bien meilleur</h3>
        <p>
          Passe en mode « au milieu » : cette fois c'est « erreur × n² » qui reste fixe, à{" "}
          <Tex>{"-0{,}5625"}</Tex>. L'erreur décroît comme <Tex>{"\\tfrac{1}{n^2}"}</Tex> : dix fois plus de
          rectangles, cent fois moins d'erreur. La raison : si la courbe était une droite sur la bande, le rectangle du
          milieu aurait exactement la bonne aire, le petit triangle en trop d'un côté compensant celui qui manque de
          l'autre. Il ne reste que l'effet de la courbure, qui est d'un ordre plus petit.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Le théorème fondamental : dériver une aire</h2>
        <p>
          Tu connais la fonction <Tex>{"F(x) = \\int_a^x f(t)\\,\\mathrm{d}t"}</Tex> et le résultat de Terminale{" "}
          <Tex>{"F' = f"}</Tex>. Voici pourquoi c'est vrai. Quand <Tex>x</Tex> avance de <Tex>h</Tex>, l'aire accumulée
          gagne une bande fine, presque un rectangle de hauteur <Tex>{"f(x)"}</Tex> :
        </p>
        <Tex block>{"\\begin{gathered} F(x+h) - F(x) = \\int_x^{x+h} f(t)\\,\\mathrm{d}t \\approx f(x)\\,h \\\\[1ex] \\Longrightarrow\\quad \\frac{F(x+h)-F(x)}{h} \\xrightarrow[h \\to 0]{} f(x) \\end{gathered}"}</Tex>
        <p>
          La vitesse à laquelle l'aire grandit, c'est la hauteur de la courbe. Déplace le point sur l'axe : la courbe
          bleue est <Tex>{"f(t) = \\tfrac12(t-1)(t-3)"}</Tex>, la courbe noire est l'aire accumulée{" "}
          <Tex>{"F(x) = \\int_0^x f(t)\\,\\mathrm{d}t"}</Tex>, tracée au fur et à mesure.
        </p>
        <AccumulationViz />
        <p>
          Entre 1 et 3, <Tex>f</Tex> est négative : l'aire rouge se retranche et <Tex>F</Tex> descend. En{" "}
          <Tex>{"x = 1"}</Tex>, <Tex>f</Tex> change de signe et <Tex>F</Tex> atteint un maximum local, avec une
          tangente horizontale. En <Tex>{"x = 3"}</Tex>, les deux aires se compensent exactement et{" "}
          <Tex>{"F(3) = 0"}</Tex>.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as vu en STI2D</p>
          <p>
            La méthode d'Euler pour <Tex>{"y' = f(x)"}</Tex> avec <Tex>{"y(a) = 0"}</Tex> avance par pas de{" "}
            <Tex>h</Tex> : <Tex>{"y_{i+1} = y_i + h\\,f(x_i)"}</Tex>. Déroule la boucle :{" "}
            <Tex>{"y_n = \\sum_{i=0}^{n-1} f(x_i)\\,h"}</Tex>. C'est exactement la somme des rectangles à gauche. Euler et
            les rectangles sont un seul et même algorithme, vu une fois comme « construire une primitive » et une fois
            comme « calculer une aire ».
          </p>
        </div>
        <p>
          La conséquence pratique : si <Tex>G</Tex> est n'importe quelle primitive de <Tex>f</Tex>, alors{" "}
          <Tex>{"G - F"}</Tex> a une dérivée nulle sur l'intervalle, donc elle est constante. Cette constante
          disparaît dans la différence :
        </p>
        <Tex block>{"\\int_a^b f(x)\\,\\mathrm{d}x = F(b) - F(a) = G(b) - G(a) = \\big[G(x)\\big]_a^b"}</Tex>
        <p>
          Un calcul d'aire, infini en apparence, se ramène à trouver une primitive. Tout le reste du chapitre, ce sont
          des techniques pour trouver des primitives que tu ne sais pas encore écrire.
        </p>
        <p>
          Au passage, la valeur moyenne de Terminale se relit ainsi :{" "}
          <Tex>{"\\mu = \\frac{1}{b-a}\\int_a^b f"}</Tex> est la hauteur du rectangle de base <Tex>{"[a, b]"}</Tex>{" "}
          qui a la même aire que la courbe.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Changement de variable : la règle de la chaîne à l'envers</h2>
        <p>
          Tu sais trouver une primitive de <Tex>{"u'e^u"}</Tex>, <Tex>{"u'u^n"}</Tex> ou <Tex>{"\\tfrac{u'}{u}"}</Tex>.
          Ce ne sont pas des formules isolées : ce sont toutes des cas de la dérivée d'une composée. Si{" "}
          <Tex>F</Tex> est une primitive de <Tex>f</Tex> :
        </p>
        <Tex block>{"\\big(F(u(x))\\big)' = F'(u(x))\\,u'(x) = f(u(x))\\,u'(x)"}</Tex>
        <p>On intègre les deux côtés entre <Tex>a</Tex> et <Tex>b</Tex>, et on obtient la règle générale :</p>
        <Tex block>{"\\int_a^b f(u(x))\\,u'(x)\\,\\mathrm{d}x = F(u(b)) - F(u(a)) = \\int_{u(a)}^{u(b)} f(u)\\,\\mathrm{d}u"}</Tex>
        <p>
          En pratique : on pose <Tex>{"u = u(x)"}</Tex>, on remplace <Tex>{"u'(x)\\,\\mathrm{d}x"}</Tex> par{" "}
          <Tex>{"\\mathrm{d}u"}</Tex>, et surtout <strong>on change les bornes</strong>.
        </p>
        <h3>Dans le sens que tu connais</h3>
        <Tex block>
          {"\\begin{gathered} u = \\ln x,\\ \\ \\mathrm{d}u = \\frac{\\mathrm{d}x}{x},\\ \\ x = 1 \\mapsto u = 0,\\ \\ x = e \\mapsto u = 1 \\\\[1ex] \\int_1^e \\frac{\\ln x}{x}\\,\\mathrm{d}x = \\int_0^1 u\\,\\mathrm{d}u = \\frac12 \\end{gathered}"}
        </Tex>
        <h3>Dans l'autre sens : le quart de disque</h3>
        <p>
          La vraie force de la règle, c'est qu'on peut la lire de droite à gauche et <em>introduire</em> une variable.
          Le quart de disque de rayon 1 a pour aire <Tex>{"\\tfrac{\\pi}{4}"}</Tex>, et c'est l'aire sous{" "}
          <Tex>{"\\sqrt{1 - x^2}"}</Tex> entre 0 et 1. Aucune formule de Terminale ne donne sa primitive. Pose{" "}
          <Tex>{"x = \\sin t"}</Tex> : quand <Tex>t</Tex> va de 0 à <Tex>{"\\tfrac{\\pi}{2}"}</Tex>, <Tex>x</Tex> va
          de 0 à 1, et <Tex>{"\\mathrm{d}x = \\cos t\\,\\mathrm{d}t"}</Tex>. Sur le cercle unité,{" "}
          <Tex>{"\\cos^2 t + \\sin^2 t = 1"}</Tex> (c'est Pythagore), et <Tex>{"\\cos t \\ge 0"}</Tex> sur{" "}
          <Tex>{"[0, \\tfrac{\\pi}{2}]"}</Tex>, donc <Tex>{"\\sqrt{1 - \\sin^2 t} = \\cos t"}</Tex> :
        </p>
        <Tex block>
          {"\\begin{aligned} \\int_0^1 \\sqrt{1-x^2}\\,\\mathrm{d}x &= \\int_0^{\\pi/2} \\cos^2 t\\,\\mathrm{d}t = \\int_0^{\\pi/2} \\frac{1 + \\cos 2t}{2}\\,\\mathrm{d}t \\\\ &= \\left[\\frac{t}{2} + \\frac{\\sin 2t}{4}\\right]_0^{\\pi/2} = \\frac{\\pi}{4} \\end{aligned}"}
        </Tex>
        <p>
          La linéarisation de <Tex>{"\\cos^2"}</Tex> que tu as apprise en Terminale sert exactement à ça.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Intégration par parties : la dérivée d'un produit à l'envers</h2>
        <p>
          Le changement de variable venait de la dérivée d'une composée. L'intégration par parties vient de la dérivée
          d'un produit, que tu connais :
        </p>
        <Tex block>{"(uv)' = u'v + uv'"}</Tex>
        <p>
          On intègre entre <Tex>a</Tex> et <Tex>b</Tex> : à gauche, <Tex>{"uv"}</Tex> est une primitive de{" "}
          <Tex>{"(uv)'"}</Tex>, donc son intégrale vaut <Tex>{"\\big[uv\\big]_a^b"}</Tex>. On isole un des deux termes :
        </p>
        <Tex block>{"\\int_a^b u(x)\\,v'(x)\\,\\mathrm{d}x = \\big[u(x)\\,v(x)\\big]_a^b - \\int_a^b u'(x)\\,v(x)\\,\\mathrm{d}x"}</Tex>
        <p>
          On échange une intégrale contre une autre. Ça ne sert que si la nouvelle est plus simple : on choisit pour{" "}
          <Tex>u</Tex> ce qui se simplifie en le dérivant (un polynôme, un <Tex>{"\\ln"}</Tex>), et pour{" "}
          <Tex>{"v'"}</Tex> ce qu'on sait intégrer sans que ça empire (<Tex>{"e^x"}</Tex>, <Tex>{"\\sin"}</Tex>,{" "}
          <Tex>{"\\cos"}</Tex>).
        </p>
        <h3>Un polynôme fois une exponentielle</h3>
        <p>
          Pour <Tex>{"\\int_0^1 x e^x\\,\\mathrm{d}x"}</Tex>, on pose <Tex>{"u = x"}</Tex> (donc <Tex>{"u' = 1"}</Tex>) et{" "}
          <Tex>{"v' = e^x"}</Tex> (donc <Tex>{"v = e^x"}</Tex>) :
        </p>
        <Tex block>{"\\int_0^1 x e^x\\,\\mathrm{d}x = \\big[x e^x\\big]_0^1 - \\int_0^1 e^x\\,\\mathrm{d}x = e - (e - 1) = 1"}</Tex>
        <p>
          Le choix inverse, <Tex>{"u = e^x"}</Tex> et <Tex>{"v' = x"}</Tex>, donnerait{" "}
          <Tex>{"\\int \\tfrac{x^2}{2}e^x"}</Tex> : pire qu'au départ. Si ton intégrale se complique, change de choix.
        </p>
        <h3>La primitive de ln</h3>
        <p>
          Tu n'as jamais eu de primitive de <Tex>{"\\ln x"}</Tex>. L'astuce : voir <Tex>{"\\ln x"}</Tex> comme{" "}
          <Tex>{"\\ln x \\times 1"}</Tex>, avec <Tex>{"u = \\ln x"}</Tex> (donc <Tex>{"u' = \\tfrac1x"}</Tex>) et{" "}
          <Tex>{"v' = 1"}</Tex> (donc <Tex>{"v = x"}</Tex>) :
        </p>
        <Tex block>{"\\int_1^e \\ln x\\,\\mathrm{d}x = \\big[x\\ln x\\big]_1^e - \\int_1^e \\frac{1}{x}\\cdot x\\,\\mathrm{d}x = e - (e - 1) = 1"}</Tex>
        <p>
          Le même calcul avec une borne variable donne la primitive <Tex>{"x\\ln x - x"}</Tex>. Vérifie-la en la
          dérivant : <Tex>{"\\ln x + x \\cdot \\tfrac1x - 1 = \\ln x"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Intégrales impropres : une aire infiniment longue peut être finie</h2>
        <p>
          Que vaut l'aire sous <Tex>{"\\tfrac{1}{x^2}"}</Tex> de 1 jusqu'à l'infini ? On ne peut pas poser la borne{" "}
          <Tex>{"+\\infty"}</Tex> directement. On intègre jusqu'à une borne <Tex>A</Tex>, puis on fait tendre{" "}
          <Tex>A</Tex> vers <Tex>{"+\\infty"}</Tex> : c'est une limite, comme au chapitre précédent.
        </p>
        <Tex block>{"\\begin{gathered} \\int_1^A \\frac{\\mathrm{d}x}{x^2} = \\left[-\\frac1x\\right]_1^A = 1 - \\frac1A \\xrightarrow[A \\to +\\infty]{} 1 \\\\[1ex] \\int_1^A \\frac{\\mathrm{d}x}{x} = \\ln A \\xrightarrow[A \\to +\\infty]{} +\\infty \\end{gathered}"}</Tex>
        <p>
          Dans le premier cas, l'intégrale <strong>converge</strong> et vaut 1. Dans le second, elle{" "}
          <strong>diverge</strong>. Pourtant les deux fonctions tendent vers 0. Pousse <Tex>A</Tex> jusqu'à{" "}
          <Tex>{"10^9"}</Tex> : la première aire se fige, la seconde continue de grimper, lentement mais sans fin.
        </p>
        <ImproperViz />
        <p>
          Tendre vers 0 ne suffit pas, il faut y tendre assez vite. Le même calcul, pour <Tex>{"p \\neq 1"}</Tex>, donne{" "}
          <Tex>{"\\int_1^A x^{-p}\\,\\mathrm{d}x = \\frac{A^{1-p} - 1}{1-p}"}</Tex>, d'où la règle :
        </p>
        <Tex block>{"\\int_1^{+\\infty} \\frac{\\mathrm{d}x}{x^p} \\ \\text{converge} \\iff p > 1, \\qquad \\text{et alors elle vaut } \\frac{1}{p-1}"}</Tex>
        <p>
          Tu retrouveras exactement ce contraste au chapitre suivant, avec les séries. La section 1 donne déjà l'argument :{" "}
          <Tex>{"\\tfrac1x"}</Tex> décroît, donc les rectangles à gauche de largeur 1 sont au-dessus de la courbe, et
        </p>
        <Tex block>{"1 + \\frac12 + \\frac13 + \\cdots + \\frac1n \\ \\ge\\ \\int_1^{n+1} \\frac{\\mathrm{d}x}{x} = \\ln(n+1) \\xrightarrow[n \\to +\\infty]{} +\\infty"}</Tex>
        <p>
          Cette somme de termes qui tendent vers 0 dépasse donc n'importe quel nombre. Tu recroiseras aussi les
          intégrales impropres en probabilités : une densité doit avoir une intégrale totale égale à 1, par exemple{" "}
          <Tex>{"\\int_0^{+\\infty} e^{-x}\\,\\mathrm{d}x = \\lim_{A \\to +\\infty}\\left(1 - e^{-A}\\right) = 1"}</Tex>, et
          l'espérance d'une variable continue est elle aussi une intégrale.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>Intégrer numériquement en Python</h2>
        <p>
          Beaucoup de fonctions n'ont pas de primitive qu'on sache écrire avec les fonctions usuelles. Dans ce cas, on
          revient à la boucle de la section 1. Voici trois méthodes, testées sur{" "}
          <Tex>{"\\int_0^1 e^x\\,\\mathrm{d}x = e - 1"}</Tex>. La méthode des trapèzes fait la moyenne des rectangles
          à gauche et à droite.
        </p>
        <pre>
          <code>{`import math

def gauche(f, a, b, n):
    h = (b - a) / n
    return sum(f(a + i*h) for i in range(n)) * h

def milieu(f, a, b, n):
    h = (b - a) / n
    return sum(f(a + (i + 0.5)*h) for i in range(n)) * h

def trapezes(f, a, b, n):
    h = (b - a) / n
    return (f(a)/2 + sum(f(a + i*h) for i in range(1, n)) + f(b)/2) * h

exact = math.e - 1   # intégrale de exp entre 0 et 1

for n in [10, 100, 1000]:
    print(f"n = {n:>4}   gauche : {gauche(math.exp, 0, 1, n) - exact:+.2e}"
          f"   milieu : {milieu(math.exp, 0, 1, n) - exact:+.2e}"
          f"   trapèzes : {trapezes(math.exp, 0, 1, n) - exact:+.2e}")`}</code>
        </pre>
        <p>Sortie (ce sont les erreurs, pas les sommes) :</p>
        <pre>
          <code>{`n =   10   gauche : -8.45e-02   milieu : -7.16e-04   trapèzes : +1.43e-03
n =  100   gauche : -8.58e-03   milieu : -7.16e-06   trapèzes : +1.43e-05
n = 1000   gauche : -8.59e-04   milieu : -7.16e-08   trapèzes : +1.43e-07`}</code>
        </pre>
        <p>
          On lit tout ce qu'on a vu : à gauche, l'erreur est divisée par 10 quand <Tex>n</Tex> est multiplié par 10 ;
          au milieu et aux trapèzes, elle est divisée par 100. La formule de la section 1 prédit même la première
          colonne : <Tex>{"-\\frac{(b-a)\\big(f(b)-f(a)\\big)}{2n} = -\\frac{e-1}{2n}"}</Tex>, soit{" "}
          <Tex>{"-8{,}59 \\times 10^{-4}"}</Tex> pour <Tex>{"n = 1000"}</Tex>.
        </p>
        <p>
          Dernier détail : l'erreur des trapèzes vaut à peu près l'opposé du double de celle du milieu. L'un
          surestime, l'autre sous-estime, dans un rapport proche de 2. En les combinant avec les bons poids,{" "}
          <Tex>{"\\tfrac{2}{3}\\,\\text{milieu} + \\tfrac13\\,\\text{trapèzes}"}</Tex>, les deux erreurs principales
          s'annulent : c'est la méthode de Simpson.
        </p>
      </section>
    </LessonFlow>
  );
}
