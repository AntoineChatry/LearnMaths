import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { KlViz } from "./KlViz";

export function EntropieCroiseeLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Coder avec le mauvais modèle : l'entropie croisée</h2>
        <p>
          Au chapitre Entropie, le meilleur code donnait à chaque symbole un mot de longueur{" "}
          <Tex>{"\\log_2(1/p_i)"}</Tex>, sa surprise. Mais on ne connaît jamais la vraie loi <Tex>p</Tex> : on
          construit le code avec un modèle <Tex>q</Tex>, donc avec des longueurs <Tex>{"\\log_2(1/q_i)"}</Tex>. Les
          symboles, eux, arrivent toujours selon <Tex>p</Tex>. La longueur moyenne est alors l'<strong>entropie
          croisée</strong> de <Tex>q</Tex> par rapport à <Tex>p</Tex> (Goodfellow, équation 3.51 ; Jurafsky et Martin,{" "}
          <em>Speech and Language Processing</em>, équation 3.39) :
        </p>
        <Tex block>{"H(p, q) = \\sum_x p(x) \\log_2 \\frac{1}{q(x)} = -\\mathbb E_{x \\sim p}\\big[\\log_2 q(x)\\big]"}</Tex>
        <p>
          Les symboles viennent de <Tex>p</Tex>, les longueurs de <Tex>q</Tex>. Si <Tex>{"q = p"}</Tex>, on retrouve
          l'entropie <Tex>{"H(p)"}</Tex>. Reprenons le code <Tex>{"0, 10, 110, 111"}</Tex> de Shannon, fait pour la loi{" "}
          <Tex>{"(\\tfrac12, \\tfrac14, \\tfrac18, \\tfrac18)"}</Tex>, et le code « naïf » qui donne 2 bits à chacun des
          quatre symboles, fait pour la loi uniforme.
        </p>
        <pre>
          <code>{`import numpy as np

np.seterr(divide="ignore")  # 1/0 donne inf, sans avertissement

def entropie_croisee(p, q):  # en bits : p la vraie loi, q la loi qui a servi à construire le code
    p, q = np.asarray(p, float), np.asarray(q, float)
    m = p > 0
    return p[m] @ np.log2(1 / q[m])

uniforme = np.array([1/4, 1/4, 1/4, 1/4])   # code de longueur 2 pour chaque symbole
shannon = np.array([1/2, 1/4, 1/8, 1/8])    # code 0, 10, 110, 111
print(entropie_croisee(shannon, shannon), entropie_croisee(shannon, uniforme))
print(entropie_croisee(uniforme, uniforme), entropie_croisee(uniforme, shannon))
# 1.75 2.0
# 2.0 2.25`}</code>
        </pre>
        <p>
          Sur la source de Shannon, son propre code coûte 1,75 bit par symbole, le code naïf 2 bits. Sur une source
          uniforme, c'est l'inverse : le code naïf coûte 2 bits, celui de Shannon 2,25, car il gaspille 3 bits sur des
          symboles qui ne sont plus rares. Dans les deux cas, le mauvais modèle coûte plus cher que l'entropie. MacKay
          (section 5.4, équation 5.23) et Cover et Thomas (<em>Elements of Information Theory</em>, section 2.3)
          donnent le surcoût exact :
        </p>
        <Tex block>{"H(p, q) = H(p) + \\sum_x p(x) \\log_2 \\frac{p(x)}{q(x)}"}</Tex>
        <p>
          Il suffit d'écrire <Tex>{"\\log \\frac1q = \\log \\frac1p + \\log \\frac pq"}</Tex> dans la somme. Ici, les deux
          surcoûts valent <Tex>{"\\tfrac14"}</Tex> de bit, mais c'est une coïncidence : la section 2 montre qu'en
          général ils diffèrent.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>La divergence de Kullback-Leibler</h2>
        <p>
          Le surcoût porte un nom : la <strong>divergence de Kullback-Leibler</strong>, ou entropie relative (Kullback
          et Leibler, 1951 ; MacKay, équation 2.45 ; PRML, équation 1.113 ; Goodfellow, équation 3.50) :
        </p>
        <Tex block>{"D_{\\mathrm{KL}}(p \\,\\|\\, q) = \\sum_x p(x) \\log \\frac{p(x)}{q(x)} = H(p, q) - H(p)"}</Tex>
        <p>
          C'est le nombre de bits gaspillés par symbole quand on code avec <Tex>q</Tex> une source qui suit{" "}
          <Tex>p</Tex> (MacKay, section 5.7 ; Cover et Thomas, section 2.3). On l'écrit souvent en nats, avec le logarithme naturel.
        </p>
        <p>
          <strong>Inégalité de Gibbs.</strong> <Tex>{"D_{\\mathrm{KL}}(p \\| q) \\ge 0"}</Tex>, avec égalité si et
          seulement si <Tex>{"p = q"}</Tex> (MacKay, équation 2.46, qui la juge « probablement l'inégalité la plus
          importante » de son livre ; PRML, équation 1.118). La preuve est l'inégalité de Jensen du chapitre
          Convexité, appliquée à la fonction convexe <Tex>{"-\\ln"}</Tex>, sous la loi <Tex>p</Tex> (PRML, section 1.6) :
        </p>
        <Tex block>{"\\begin{aligned} D_{\\mathrm{KL}}(p \\| q) &= \\mathbb E_p\\!\\left[-\\ln \\frac{q(x)}{p(x)}\\right] \\ge -\\ln \\mathbb E_p\\!\\left[\\frac{q(x)}{p(x)}\\right] \\\\ &= -\\ln \\sum_{x : p(x) > 0} q(x) \\ge -\\ln 1 = 0 \\end{aligned}"}</Tex>
        <p>
          Comme <Tex>{"-\\ln"}</Tex> est strictement convexe, l'égalité impose que <Tex>{"q/p"}</Tex> soit constant,
          donc <Tex>{"q = p"}</Tex>. Conséquence : <Tex>{"H(p, q) \\ge H(p)"}</Tex>. Aucun modèle ne code mieux que
          la vraie loi.
        </p>
        <p>
          <strong>Ce n'est pas une distance.</strong> En général,{" "}
          <Tex>{"D_{\\mathrm{KL}}(p \\| q) \\ne D_{\\mathrm{KL}}(q \\| p)"}</Tex> (MacKay, section 2.6 ; PRML,
          section 1.6 ; Goodfellow, section 3.13). Et si le modèle donne une probabilité nulle à un symbole qui arrive,{" "}
          <Tex>{"q(x) = 0 < p(x)"}</Tex>, la divergence est infinie : le code n'a aucun mot pour ce symbole (Cover et
          Thomas, section 2.3, convention <Tex>{"p \\log \\frac p0 = \\infty"}</Tex>).
        </p>
        <pre>
          <code>{`import numpy as np

np.seterr(divide="ignore")  # 1/0 donne inf, sans avertissement

def kl(p, q):  # divergence de Kullback-Leibler, en bits
    p, q = np.asarray(p, float), np.asarray(q, float)
    m = p > 0
    return p[m] @ np.log2(p[m] / q[m])

p, q = [1/2, 1/2], [3/4, 1/4]               # Cover et Thomas, exemple 2.3.1
print(kl(p, q).round(4), kl(q, p).round(4), kl(p, p))
print(kl([0.9, 0.1], [1.0, 0.0]), kl([1.0, 0.0], [0.9, 0.1]).round(3))

rng = np.random.default_rng(0)
d = [kl(rng.dirichlet(np.ones(5)), rng.dirichlet(np.ones(5))) for _ in range(100_000)]
print(min(d) >= 0, round(min(d), 5))
# 0.2075 0.1887 0.0
# inf 0.152
# True 0.00334`}</code>
        </pre>
        <p>
          On retrouve les deux valeurs de Cover et Thomas, 0,2075 et 0,1887 bit : l'ordre compte. Un modèle certain
          que le symbole 2 n'arrive jamais a une divergence infinie dès qu'il arrive une fois sur dix ; dans l'autre
          sens, la divergence reste finie. Et sur 100 000 paires de lois tirées au hasard, aucune divergence n'est
          négative.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>Minimiser l'entropie croisée, c'est maximiser la vraisemblance</h2>
        <p>
          Pour entraîner un modèle <Tex>{"q_\\theta"}</Tex>, on voudrait minimiser{" "}
          <Tex>{"D_{\\mathrm{KL}}(p \\| q_\\theta)"}</Tex>, mais la vraie loi <Tex>p</Tex> est inconnue. On la
          remplace par la <strong>loi empirique</strong> <Tex>{"\\hat p"}</Tex> des <Tex>N</Tex> exemples
          d'entraînement, qui met un poids <Tex>{"1/N"}</Tex> sur chacun. L'entropie croisée devient la perte moyenne
          (PRML, équation 1.119 ; Goodfellow, équations 5.59 à 5.61) :
        </p>
        <Tex block>{"H(\\hat p, q_\\theta) = -\\frac1N \\sum_{n=1}^N \\ln q_\\theta(x_n) = H(\\hat p) + D_{\\mathrm{KL}}(\\hat p \\| q_\\theta)"}</Tex>
        <p>
          <Tex>{"H(\\hat p)"}</Tex> ne dépend pas de <Tex>\theta</Tex> : minimiser la divergence, minimiser
          l'entropie croisée et maximiser la vraisemblance du chapitre Vraisemblance sont <em>le même problème</em>.
          Goodfellow (section 5.5) insiste : toute perte de la forme « moins log-vraisemblance » est une entropie
          croisée, entre la loi empirique et le modèle. La perte quadratique aussi, avec un modèle gaussien.
        </p>
        <pre>
          <code>{`import numpy as np

y = np.array([0] * 50 + [1] * 30 + [2] * 20)    # classes observées (chapitre Vraisemblance)
p_hat = np.bincount(y) / y.size                  # loi empirique : 0,5 0,3 0,2
H = -(p_hat @ np.log(p_hat))                     # son entropie, en nats

for q in [[1/3, 1/3, 1/3], [0.6, 0.25, 0.15], [0.5, 0.3, 0.2]]:
    q = np.array(q)
    perte = -np.mean(np.log(q[y]))               # -1/N somme des ln q(y_n)
    kl = p_hat @ np.log(p_hat / q)
    print(perte.round(4), (H + kl).round(4), kl.round(4))
# 1.0986 1.0986 0.069
# 1.0507 1.0507 0.0211
# 1.0297 1.0297 0.0`}</code>
        </pre>
        <p>
          La perte moyenne vaut toujours l'entropie, 1,0297 nat, plus la divergence. Le modèle uniforme paie{" "}
          <Tex>{"\\ln 3 \\approx 1{,}0986"}</Tex> ; la perte touche son plancher quand le modèle prédit exactement
          les fréquences. On comprend le 1,0297 du chapitre Vraisemblance : c'est la part de la perte que rien ne
          peut faire disparaître, l'incertitude propre aux données. Seule la divergence se réduit en entraînant.
        </p>
        <KlViz />
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>Modèles de langage : bits par token et perplexité</h2>
        <p>
          Un modèle de langage donne une probabilité <Tex>{"q(w_i \\mid w_{<i})"}</Tex> à chaque token sachant les
          précédents. Sa perte d'entraînement est l'entropie croisée moyenne sur les <Tex>N</Tex> tokens d'un
          texte, <Tex>{"-\\frac1N \\sum_i \\ln q(w_i \\mid w_{<i})"}</Tex>, en nats par token ; divisée par{" "}
          <Tex>{"\\ln 2"}</Tex>, elle donne des bits par token. On la publie souvent sous forme de{" "}
          <strong>perplexité</strong>, son exponentielle (Jurafsky et Martin, section 3.3 et équation 3.42 ;
          documentation Hugging Face, « Perplexity of fixed-length models ») :
        </p>
        <Tex block>{"\\mathrm{PP} = \\exp\\!\\Big(-\\frac1N \\sum_{i=1}^N \\ln q(w_i \\mid w_{<i})\\Big) = 2^{H_{\\text{bits}}} = q(w_1 \\dots w_N)^{-1/N}"}</Tex>
        <p>
          La perplexité se lit comme un nombre de choix : un modèle qui hésite uniformément entre <Tex>K</Tex>{" "}
          tokens a une perplexité <Tex>K</Tex>. Jurafsky et Martin (section 3.3.1) l'appellent le{" "}
          <em>facteur de branchement moyen pondéré</em>, et prennent l'exemple d'un langage de trois couleurs et du
          texte « red red red red blue ».
        </p>
        <pre>
          <code>{`import numpy as np

def perplexite(probas):  # probabilités données par le modèle aux tokens réellement observés
    return np.exp(-np.mean(np.log(probas)))

A = [1/3] * 5                     # red red red red blue, modèle uniforme
B = [0.8, 0.8, 0.8, 0.8, 0.1]     # modèle qui a appris que red est fréquent
print(perplexite(A).round(2), perplexite(B).round(2))

perte = -np.mean(np.log(B))       # la perte d'entraînement : nats par token
bits = perte / np.log(2)          # la même, en bits par token
print(perte.round(3), bits.round(3), np.exp(perte).round(2), (2 ** bits).round(2))
# 3.0 1.89
# 0.639 0.922 1.89 1.89`}</code>
        </pre>
        <p>
          Le modèle uniforme a une perplexité de 3, le modèle B de 1,89, comme chez Jurafsky et Martin (équations
          3.19 et 3.21) : il hésite en moyenne comme entre 1,89 couleurs. Que l'on passe par les nats ou par les bits,
          on trouve la même perplexité. Deux précautions. D'abord, comme{" "}
          <Tex>{"H(p, q) \\ge H(p)"}</Tex>, la perplexité ne peut pas descendre sous <Tex>{"2^{H(p)}"}</Tex> : la
          perte d'un modèle de langage a un plancher, l'entropie du langage lui-même (Jurafsky et Martin, équation
          3.41). Ensuite, la perplexité dépend du découpage en tokens : on ne compare que des modèles qui ont le même
          vocabulaire (Jurafsky et Martin, section 3.3) et la même tokenisation (documentation Hugging Face).
        </p>
      </section>
    </LessonFlow>
  );
}
