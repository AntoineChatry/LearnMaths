import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { VertexViz } from "./VertexViz";

export function SecondDegreLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>De x² à n'importe quelle parabole</h2>
        <p>
          Dans la vidéo de précalcul, tu as vu les transformations de fonctions : <Tex>{"f(x - \\alpha)"}</Tex> décale
          la courbe de <Tex>{"\\alpha"}</Tex> vers la droite, <Tex>{"f(x) + \\beta"}</Tex> la monte de{" "}
          <Tex>{"\\beta"}</Tex>, et <Tex>{"a\\,f(x)"}</Tex> l'étire verticalement (et la retourne si{" "}
          <Tex>{"a < 0"}</Tex>). Applique les trois à <Tex>{"x^2"}</Tex> :
        </p>
        <Tex block>{"f(x) = a(x - \\alpha)^2 + \\beta"}</Tex>
        <p>
          C'est la <strong>forme canonique</strong>, et son sommet est le point <Tex>{"(\\alpha, \\beta)"}</Tex>.
          Attrape le sommet, déplace-le, et joue avec <Tex>a</Tex> :
        </p>
        <VertexViz />
        <p>
          La deuxième ligne est la même fonction, développée : <Tex>{"ax^2 + bx + c"}</Tex>. Toute parabole s'écrit
          des deux façons. La forme développée est celle qu'on te donne presque toujours, mais elle cache le
          sommet. La forme canonique le montre. Toute l'histoire du second degré, c'est passer de l'une à l'autre.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Compléter le carré</h2>
        <p>
          Partons de <Tex>{"ax^2 + bx + c"}</Tex> avec <Tex>{"a \\neq 0"}</Tex>. L'idée : <Tex>{"x^2 + px"}</Tex> est
          le début du carré <Tex>{"(x + \\tfrac{p}{2})^2 = x^2 + px + \\tfrac{p^2}{4}"}</Tex>, il ne manque que{" "}
          <Tex>{"\\tfrac{p^2}{4}"}</Tex>. On l'ajoute et on le retire :
        </p>
        <Tex block>
          {
            "\\begin{aligned} ax^2 + bx + c &= a\\left[x^2 + \\tfrac{b}{a}x\\right] + c \\\\ &= a\\left[\\left(x + \\tfrac{b}{2a}\\right)^2 - \\tfrac{b^2}{4a^2}\\right] + c \\\\ &= a\\left(x + \\tfrac{b}{2a}\\right)^2 - \\frac{b^2 - 4ac}{4a} \\end{aligned}"
          }
        </Tex>
        <p>
          Le nombre qui apparaît tout seul au numérateur a un nom : le <strong>discriminant</strong>,{" "}
          <Tex>{"\\Delta = b^2 - 4ac"}</Tex>. On lit directement le sommet :
        </p>
        <Tex block>{"\\alpha = -\\frac{b}{2a} \\qquad \\beta = -\\frac{\\Delta}{4a}"}</Tex>
        <p>Exemple, à refaire à la main :</p>
        <Tex block>{"2x^2 - 8x + 6 = 2(x^2 - 4x) + 6 = 2\\left[(x - 2)^2 - 4\\right] + 6 = 2(x - 2)^2 - 2"}</Tex>
        <p>
          Sommet <Tex>{"(2, -2)"}</Tex>. Vérification par la formule : <Tex>{"\\Delta = 64 - 48 = 16"}</Tex> et{" "}
          <Tex>{"\\beta = -16/8 = -2"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le discriminant décide</h2>
        <p>Résoudre <Tex>{"ax^2 + bx + c = 0"}</Tex>, c'est résoudre, grâce à la forme canonique :</p>
        <Tex block>{"\\left(x + \\frac{b}{2a}\\right)^2 = \\frac{\\Delta}{4a^2}"}</Tex>
        <p>
          À gauche, un carré, donc un nombre positif ou nul. À droite, <Tex>{"4a^2 > 0"}</Tex>, donc tout dépend du
          signe de <Tex>{"\\Delta"}</Tex> :
        </p>
        <Tex block>
          {
            "\\begin{cases} \\Delta > 0 : & x_{1,2} = \\dfrac{-b \\pm \\sqrt{\\Delta}}{2a} \\\\[1ex] \\Delta = 0 : & x_0 = -\\dfrac{b}{2a} \\\\[1ex] \\Delta < 0 : & \\text{aucune racine réelle} \\end{cases}"
          }
        </Tex>
        <p>
          Reprends la parabole, cette fois avec <Tex>{"\\Delta"}</Tex> affiché. Fais traverser l'axe des abscisses au
          sommet, puis retourne la parabole avec <Tex>a</Tex> :
        </p>
        <VertexViz showDelta />
        <p>
          Tu as dû voir la règle : il y a deux racines quand la parabole « s'ouvre vers l'axe ». C'est la formule{" "}
          <Tex>{"\\beta = -\\Delta/(4a)"}</Tex> lue à l'envers, <Tex>{"\\Delta = -4a\\beta"}</Tex> : Δ est positif
          exactement quand <Tex>a</Tex> et <Tex>{"\\beta"}</Tex> sont de signes contraires.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as vu en Terminale</p>
          <p>
            Tu as résolu <Tex>{"z^2 = a"}</Tex> avec <Tex>{"a < 0"}</Tex> dans <Tex>{"\\mathbb{C}"}</Tex>. Même chose
            ici : si <Tex>{"\\Delta < 0"}</Tex>, il n'y a pas de racine réelle, mais il y a deux racines complexes
            conjuguées, <Tex>{"z_{1,2} = \\dfrac{-b \\pm i\\sqrt{-\\Delta}}{2a}"}</Tex>.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Signe et factorisation</h2>
        <p>
          Quand <Tex>{"\\Delta > 0"}</Tex>, tu retrouves la forme factorisée de ton programme de Première, sauf que
          maintenant tu sais trouver les racines toi-même :
        </p>
        <Tex block>{"ax^2 + bx + c = a(x - x_1)(x - x_2)"}</Tex>
        <p>
          Le signe se lit sur la parabole : <strong>signe de a à l'extérieur des racines, signe contraire entre
          elles</strong>. Si <Tex>{"\\Delta \\le 0"}</Tex>, le trinôme a le signe de <Tex>a</Tex> partout (et
          s'annule en <Tex>{"x_0"}</Tex> si <Tex>{"\\Delta = 0"}</Tex>).
        </p>
        <p>En développant la forme factorisée et en identifiant avec <Tex>{"ax^2 + bx + c"}</Tex>, on obtient gratuitement :</p>
        <Tex block>{"x_1 + x_2 = -\\frac{b}{a} \\qquad x_1\\,x_2 = \\frac{c}{a}"}</Tex>
        <p>
          C'est l'outil idéal pour vérifier un calcul, ou pour deviner une racine évidente et en déduire
          l'autre. Il resservira dans la dernière section.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>La régression linéaire est une parabole</h2>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Dans la vidéo sur la régression linéaire, on prédit avec <Tex>{"f_w(x) = w \\cdot \\phi(x)"}</Tex> et on
            minimise la perte quadratique moyenne <Tex>{"\\text{TrainLoss}(w)"}</Tex> par descente de gradient.
          </p>
        </div>
        <p>
          Prends le cas le plus simple : une seule feature <Tex>{"\\phi(x) = x"}</Tex>, pas de biais, <Tex>n</Tex>{" "}
          exemples <Tex>{"(x_i, y_i)"}</Tex>. Développe la perte :
        </p>
        <Tex block>
          {
            "\\text{TrainLoss}(w) = \\frac{1}{n}\\sum_{i=1}^{n} (w x_i - y_i)^2 = \\frac{1}{n}\\Big[\\underbrace{\\textstyle\\sum x_i^2}_{a}\\; w^2 \\;\\underbrace{-\\,2\\textstyle\\sum x_i y_i}_{b}\\; w + \\underbrace{\\textstyle\\sum y_i^2}_{c}\\Big]"
          }
        </Tex>
        <p>
          C'est un trinôme en <Tex>w</Tex>. Son coefficient <Tex>a</Tex> est une somme de carrés, donc strictement
          positif dès qu'un <Tex>{"x_i"}</Tex> est non nul : la parabole est tournée vers le haut et son minimum est au sommet. Pas besoin de descente de gradient,
          la section 2 donne directement la réponse :
        </p>
        <Tex block>{"w^* = -\\frac{b}{2a} = \\frac{\\sum x_i y_i}{\\sum x_i^2}"}</Tex>
        <p>
          La descente de gradient ne fait rien d'autre que glisser le long de cette parabole vers son sommet. Avec
          plusieurs features, la parabole devient un « bol » en dimension <Tex>d</Tex>, et la même idée donne les
          équations normales. On y reviendra au dernier chapitre.
        </p>
      </section>

      <section className="section">
        <span className="section-num">6</span>
        <h2>Pour aller plus loin : la formule en flottants</h2>
        <p>
          La formule <Tex>{"\\frac{-b + \\sqrt{\\Delta}}{2a}"}</Tex> est juste sur le papier, mais elle peut être
          fausse dans un ordinateur. Essaie avec <Tex>{"x^2 + 10^8 x + 1"}</Tex>, dont une racine vaut presque
          exactement <Tex>{"-10^{-8}"}</Tex> :
        </p>
        <pre>
          <code>{`import math

a, b, c = 1, 1e8, 1
d = math.sqrt(b*b - 4*a*c)

print((-b + d) / (2*a))   # -7.450580596923828e-09  : 25 % d'erreur

q = -(b + math.copysign(d, b)) / 2
print(c / q)              # -1e-08  : juste`}</code>
        </pre>
        <p>
          Ici <Tex>{"\\sqrt{\\Delta}"}</Tex> est presque égal à <Tex>b</Tex> : la soustraction{" "}
          <Tex>{"-b + \\sqrt{\\Delta}"}</Tex> efface tous les chiffres significatifs communs, c'est la{" "}
          <strong>cancellation catastrophique</strong>. La version stable calcule d'abord la racine « sans
          soustraction », <Tex>{"x_1 = q/a"}</Tex>, puis obtient l'autre avec le produit des racines de la section 4 :{" "}
          <Tex>{"x_2 = \\frac{c/a}{x_1} = \\frac{c}{q}"}</Tex>.
        </p>
        <p>
          C'est le genre de détail qui sépare un calcul juste d'un calcul qui marche. En ML, où l'on entraîne
          souvent en demi-précision, on le croise tout le temps.
        </p>
      </section>
    </LessonFlow>
  );
}
