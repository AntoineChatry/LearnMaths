import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { DichotomyViz } from "./DichotomyViz";
import { PiecewiseViz } from "./PiecewiseViz";

export function ContinuiteLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Continue : la limite tombe pile sur la valeur</h2>
        <p>
          Au chapitre précédent, la limite en <Tex>a</Tex> ne regardait jamais <Tex>{"f(a)"}</Tex>. La continuité,
          c'est le cas où les deux sont d'accord :
        </p>
        <Tex block>{"f \\text{ est continue en } a \\iff \\lim_{x \\to a} f(x) = f(a)"}</Tex>
        <p>Ça cache trois conditions, et chacune peut échouer :</p>
        <ul>
          <li>
            <Tex>{"f(a)"}</Tex> existe ;
          </li>
          <li>
            la limite <Tex>{"\\lim_{x \\to a} f(x)"}</Tex> existe (donc les limites à gauche et à droite sont égales) ;
          </li>
          <li>les deux valeurs sont égales.</li>
        </ul>
        <p>
          En version ε-δ, c'est la définition de la limite avec <Tex>{"L = f(a)"}</Tex>, et sans exclure{" "}
          <Tex>{"x = a"}</Tex> :
        </p>
        <Tex block>
          {"\\forall \\varepsilon > 0,\\ \\exists \\delta > 0,\\ \\forall x,\\quad |x - a| < \\delta \\implies |f(x) - f(a)| < \\varepsilon"}
        </Tex>
        <p>
          En clair : une petite erreur sur l'entrée ne produit qu'une petite erreur sur la sortie. On dit que{" "}
          <Tex>f</Tex> est continue sur un intervalle si elle est continue en chacun de ses points.
        </p>
        <p>
          Bonne nouvelle, tu n'auras presque jamais à le prouver à la main. Les polynômes, <Tex>{"\\sin"}</Tex>,{" "}
          <Tex>{"\\cos"}</Tex> et <Tex>{"\\exp"}</Tex> sont continues sur <Tex>{"\\mathbb{R}"}</Tex>,{" "}
          <Tex>{"\\ln"}</Tex> l'est sur <Tex>{"]0, +\\infty["}</Tex>, et sommes, produits, quotients (là où le
          dénominateur ne s'annule pas) et composées de fonctions continues restent continues. De plus, toute
          fonction dérivable en <Tex>a</Tex> est continue en <Tex>a</Tex>. La réciproque est fausse :{" "}
          <Tex>{"|x|"}</Tex> est continue en 0 mais n'y est pas dérivable (la courbe fait un angle).
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Trois façons de casser la continuité</h2>
        <h3>Le trou (discontinuité « effaçable »)</h3>
        <p>
          La limite existe, mais <Tex>{"f(a)"}</Tex> manque ou est mal placé. C'est le{" "}
          <Tex>{"\\frac{x^2-1}{x-1}"}</Tex> du chapitre précédent : pas défini en 1, limite 2. On répare en posant{" "}
          <Tex>{"f(1) = 2"}</Tex>, on appelle ça un <strong>prolongement par continuité</strong>.
        </p>
        <h3>Le saut</h3>
        <p>
          Les limites à gauche et à droite existent mais diffèrent. C'est le cas typique des fonctions définies par
          morceaux, que tu as vues en précalcul. Chaque morceau est continu, tout se joue au raccord. Règle{" "}
          <Tex>k</Tex> pour que les deux morceaux se touchent :
        </p>
        <PiecewiseViz />
        <p>
          À gauche de 2, <Tex>{"f(x) = 2x - 1 \\to 3"}</Tex>. À droite, <Tex>{"f(x) = -x + k \\to k - 2"}</Tex>, qui
          est aussi <Tex>{"f(2)"}</Tex>. Continuité en 2 si et seulement si <Tex>{"k - 2 = 3"}</Tex>, soit{" "}
          <Tex>{"k = 5"}</Tex>. C'est toujours la même méthode : égaler les deux limites latérales au point de
          raccord.
        </p>
        <h3>L'explosion</h3>
        <p>
          Une limite latérale est infinie, comme <Tex>{"\\frac{1}{x^2}"}</Tex> en 0. Attention au piège :{" "}
          <Tex>{"\\frac{1}{x}"}</Tex> est continue <em>sur son domaine</em> <Tex>{"\\mathbb{R}^*"}</Tex>, car 0 n'en
          fait pas partie. Sa courbe en deux morceaux ne vient pas d'une discontinuité, mais d'un trou dans le domaine.
          Il existe aussi des cas plus sauvages, comme <Tex>{"\\sin(1/x)"}</Tex> près de 0, qui oscille sans jamais
          se fixer.
        </p>
        <div className="aside-cs">
          <p className="aside-cs-title">Tu l'as déjà vu en CS221</p>
          <p>
            Le classifieur linéaire prédit <Tex>{"f_w(x) = \\text{sign}(w \\cdot \\phi(x))"}</Tex>. La fonction{" "}
            <Tex>{"\\text{sign}"}</Tex> saute de <Tex>{"-1"}</Tex> à <Tex>{"+1"}</Tex> en 0 : c'est une fonction par
            morceaux avec un saut. La perte zéro-un qui en découle est constante par morceaux, et le cours le dit : son
            gradient est nul presque partout, donc la descente de gradient n'a rien à suivre. C'est pour ça qu'on la
            remplace par la perte hinge, qui est continue.
          </p>
        </div>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Le théorème des valeurs intermédiaires</h2>
        <p>
          Intuitivement : une courbe qu'on trace sans lever le crayon, et qui part sous une hauteur pour finir au-dessus,
          doit la traverser. Voici l'énoncé précis.
        </p>
        <Tex block>
          {
            "\\begin{gathered} f \\text{ continue sur } [a, b] \\\\ \\Downarrow \\\\ \\text{pour tout } y \\text{ compris entre } f(a) \\text{ et } f(b),\\ \\exists\\, c \\in [a, b] \\ \\text{tel que}\\ f(c) = y \\end{gathered}"
          }
        </Tex>
        <p>Le cas qui sert tout le temps, avec <Tex>{"y = 0"}</Tex> :</p>
        <Tex block>
          {"f \\text{ continue sur } [a, b] \\text{ et } f(a)\\,f(b) < 0 \\implies \\exists\\, c \\in \\,]a, b[ \\ \\text{tel que}\\ f(c) = 0"}
        </Tex>
        <p>
          Si en plus <Tex>f</Tex> est strictement monotone sur <Tex>{"[a, b]"}</Tex>, cette racine est{" "}
          <strong>unique</strong> : une fonction strictement croissante ne peut pas repasser par 0.
        </p>
        <h3>Chaque hypothèse compte</h3>
        <table className="value-table">
          <thead>
            <tr>
              <th>Ce qu'on retire</th>
              <th>Contre-exemple</th>
              <th>Ce qui casse</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>la continuité</td>
              <td>
                <Tex>{"f(x) = -1"}</Tex> si <Tex>{"x < 0"}</Tex>, <Tex>{"1"}</Tex> sinon, sur{" "}
                <Tex>{"[-1, 1]"}</Tex>
              </td>
              <td>
                <Tex>{"f(-1) < 0 < f(1)"}</Tex>, aucune racine
              </td>
            </tr>
            <tr>
              <td>un intervalle d'un seul tenant</td>
              <td>
                <Tex>{"\\frac{1}{x}"}</Tex> sur <Tex>{"[-1, 1] \\setminus \\{0\\}"}</Tex>
              </td>
              <td>continue là où elle est définie, change de signe, aucune racine</td>
            </tr>
            <tr>
              <td>les nombres réels</td>
              <td>
                <Tex>{"x^2 - 2"}</Tex> sur les rationnels de <Tex>{"[1, 2]"}</Tex>
              </td>
              <td>
                la racine <Tex>{"\\sqrt{2}"}</Tex> n'est pas rationnelle
              </td>
            </tr>
          </tbody>
        </table>
        <p>
          La dernière ligne montre que le TVI dit quelque chose de profond sur <Tex>{"\\mathbb{R}"}</Tex> lui-même :
          la droite réelle n'a pas de trous. Et il y a deux choses que le théorème ne dit <em>pas</em> :
        </p>
        <ul>
          <li>
            combien il y a de racines : <Tex>{"x^3 - x"}</Tex> change de signe sur <Tex>{"[-2, 2]"}</Tex> et s'annule
            trois fois (en <Tex>{"-1"}</Tex>, 0 et 1) ;
          </li>
          <li>
            qu'il n'y a pas de racine quand <Tex>{"f(a)"}</Tex> et <Tex>{"f(b)"}</Tex> ont le même signe :{" "}
            <Tex>{"x^2 - 1"}</Tex> est positive en <Tex>{"-2"}</Tex> et en 2, et s'annule deux fois entre les deux.
          </li>
        </ul>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>La dichotomie : le TVI devenu algorithme</h2>
        <p>
          Le TVI dit qu'une racine existe, pas où elle est. La <strong>dichotomie</strong> (<em>bisection</em> en
          anglais) la traque. On part de <Tex>{"[a, b]"}</Tex> avec <Tex>{"f(a)"}</Tex> et <Tex>{"f(b)"}</Tex> de
          signes contraires, on coupe au milieu <Tex>{"m = \\frac{a + b}{2}"}</Tex>, et on garde la moitié où le
          changement de signe persiste :
        </p>
        <Tex block>
          {"f(a)\\,f(m) \\le 0 \\ \\Rightarrow\\ [a, b] \\leftarrow [a, m] \\qquad\\qquad \\text{sinon}\\ \\ [a, b] \\leftarrow [m, b]"}
        </Tex>
        <p>
          Pourquoi ça marche toujours ? Parce qu'à chaque étape, <Tex>{"f(a)"}</Tex> et <Tex>{"f(b)"}</Tex> restent
          de signes contraires (ou l'un est nul). Le TVI s'applique donc au nouvel intervalle : il contient encore une
          racine. L'intervalle se referme sur elle. Avance pas à pas, puis essaie la version à saut :
        </p>
        <DichotomyViz />
        <div className="aside-cs">
          <p className="aside-cs-title">Toi qui codes en Python</p>
          <p>
            La condition « <Tex>{"f(a)"}</Tex> et <Tex>{"f(b)"}</Tex> de signes contraires » est un{" "}
            <strong>invariant de boucle</strong> : vraie avant la boucle, préservée par chaque tour. Le TVI transforme
            cet invariant en garantie.
          </p>
          <pre>
            <code>{`def dichotomie(f, a, b, eps):
    n = 0
    while b - a > eps:
        m = (a + b) / 2
        if f(a) * f(m) <= 0:
            b = m
        else:
            a = m
        n += 1
    return a, b, n

a, b, n = dichotomie(lambda x: x**3 - x - 1, 1, 2, 1e-6)
print(n, a, b)   # 20 1.3247175216674805 1.3247184753417969`}</code>
          </pre>
          <p>
            Lancée sur la fonction à saut de la figure, la même fonction répond{" "}
            <code>20 1.2999992370605469 1.3000001907348633</code> : un intervalle minuscule autour de 1,3, où{" "}
            <Tex>f</Tex> ne s'annule pas. L'algorithme ne vérifie pas ses hypothèses, c'est à toi de le faire.
          </p>
        </div>
        <p>
          Le module <code>bisect</code> de la bibliothèque standard Python applique la même idée à une liste triée :
          chercher où insérer une valeur, c'est chercher où « valeur de la liste moins cible » change de signe.
        </p>
      </section>

      <section className="section">
        <span className="section-num">5</span>
        <h2>Combien d'étapes pour une précision donnée ?</h2>
        <p>
          Chaque étape divise la longueur par 2. Après <Tex>n</Tex> étapes, l'intervalle mesure{" "}
          <Tex>{"\\frac{b - a}{2^n}"}</Tex>. Pour qu'il mesure au plus <Tex>{"\\varepsilon"}</Tex> :
        </p>
        <Tex block>
          {
            "\\begin{gathered} \\frac{b - a}{2^n} \\le \\varepsilon \\iff 2^n \\ge \\frac{b - a}{\\varepsilon} \\iff n \\ge \\log_2 \\frac{b - a}{\\varepsilon} \\\\[1ex] \\text{donc}\\quad n = \\left\\lceil \\log_2 \\frac{b - a}{\\varepsilon} \\right\\rceil \\end{gathered}"
          }
        </Tex>
        <p>
          <Tex>{"\\lceil \\cdot \\rceil"}</Tex> est l'arrondi à l'entier supérieur. Pour calculer{" "}
          <Tex>{"\\log_2"}</Tex> avec ce que tu connais :{" "}
          <Tex>{"\\log_2 y = \\frac{\\ln y}{\\ln 2}"}</Tex>, car <Tex>{"2^n \\ge y \\iff n \\ln 2 \\ge \\ln y"}</Tex>.
        </p>
        <p>
          Exemple : sur <Tex>{"[1, 2]"}</Tex> avec <Tex>{"\\varepsilon = 10^{-6}"}</Tex>,{" "}
          <Tex>{"\\log_2(10^6) = \\frac{6 \\ln 10}{\\ln 2} \\approx 19{,}93"}</Tex>, donc 20 étapes. C'est bien le{" "}
          <code>20</code> affiché par le programme. Un million de fois plus précis ne coûte que 20 tours, car chaque
          étape apporte un <strong>bit</strong> de précision, soit environ <Tex>{"\\log_2 10 \\approx 3{,}32"}</Tex>{" "}
          étapes par chiffre décimal. Le milieu du dernier intervalle est alors à moins de{" "}
          <Tex>{"\\varepsilon / 2"}</Tex> de la racine.
        </p>
        <p>
          Et si on ne s'arrête jamais ? Sur une machine, les flottants de <Tex>{"[1, 2["}</Tex> sont espacés de{" "}
          <Tex>{"2^{-52}"}</Tex>. On peut donc couper au plus 52 fois avant que le milieu tombe sur une des bornes :
        </p>
        <pre>
          <code>{`f = lambda x: x**3 - x - 1
a, b = 1.0, 2.0
n = 0
while True:
    m = (a + b) / 2
    if m == a or m == b:
        break
    if f(a) * f(m) <= 0:
        b = m
    else:
        a = m
    n += 1
print(n, a, b)   # 52 1.3247179572447458 1.324717957244746`}</code>
        </pre>
        <p>
          Après 52 étapes, <Tex>a</Tex> et <Tex>b</Tex> sont deux flottants voisins : impossible de faire mieux en
          double précision.
        </p>
      </section>
    </LessonFlow>
  );
}
