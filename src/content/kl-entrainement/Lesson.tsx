import { LessonFlow } from "../../components/LessonFlow";
import { Tex } from "../../components/Tex";
import { ModeViz } from "./ModeViz";

export function KlEntrainementLesson() {
  return (
    <LessonFlow>
      <section className="section">
        <span className="section-num">1</span>
        <h2>Deux sens, deux comportements</h2>
        <p>
          Au chapitre Entropie croisée, la divergence <Tex>{"D_{\\mathrm{KL}}"}</Tex> n'était pas symétrique. En
          apprentissage, ce détail décide de ce que fait le modèle. On approche une loi compliquée <Tex>p</Tex> par
          une loi simple <Tex>q</Tex>, ici une seule gaussienne, et on peut minimiser{" "}
          <Tex>{"D_{\\mathrm{KL}}(p \\| q)"}</Tex>, la divergence <strong>directe</strong>, ou{" "}
          <Tex>{"D_{\\mathrm{KL}}(q \\| p)"}</Tex>, la divergence <strong>inverse</strong>.
        </p>
        <ul>
          <li>
            <Tex>{"D_{\\mathrm{KL}}(p \\| q) = \\mathbb E_p[\\ln p - \\ln q]"}</Tex> fait la moyenne sous <Tex>p</Tex>{" "}
            : partout où <Tex>p</Tex> a de la masse, une petite valeur de <Tex>q</Tex> coûte très cher. Le
            minimiseur <em>couvre</em> tout le support de <Tex>p</Tex>, quitte à mettre de la masse là où{" "}
            <Tex>p</Tex> n'en a pas.
          </li>
          <li>
            <Tex>{"D_{\\mathrm{KL}}(q \\| p) = \\mathbb E_q[\\ln q - \\ln p]"}</Tex> fait la moyenne sous <Tex>q</Tex>{" "}
            : c'est maintenant une masse de <Tex>q</Tex> là où <Tex>p</Tex> est presque nulle qui coûte cher. Le
            minimiseur <em>évite</em> ces régions et se contente d'un mode de <Tex>p</Tex>.
          </li>
        </ul>
        <p>
          C'est la figure 10.3 de PRML (section 10.1.2) et la figure 3.6 de Goodfellow. Pour le sens direct, il y a
          même une formule : une gaussienne qui minimise <Tex>{"D_{\\mathrm{KL}}(p \\| q)"}</Tex> a la même moyenne
          et la même variance que <Tex>p</Tex> (PRML, section 10.7, équation 10.187, « moment matching »).
        </p>
        <pre>
          <code>{`import numpy as np

x = np.linspace(-8, 8, 4001)
dx = x[1] - x[0]

def gauss(x, mu, s):
    return np.exp(-(x - mu) ** 2 / (2 * s * s)) / (s * np.sqrt(2 * np.pi))

p = 0.5 * gauss(x, -2, 0.6) + 0.5 * gauss(x, 2, 0.6)    # deux bosses, en -2 et en 2

def kl(a, b):  # divergence en nats, par une somme de Riemann
    return np.sum(a * np.log(a / b)) * dx

# Toutes les gaussiennes q(mu, s) d'une grille, et les deux sens de la divergence
grille = [(mu, s) for mu in np.arange(-3, 3.01, 0.05) for s in np.arange(0.3, 3.01, 0.01)]
directe = min(grille, key=lambda m: kl(p, gauss(x, *m)))      # min de D(p || q)
inverse = min(grille, key=lambda m: kl(gauss(x, *m), p))      # min de D(q || p)
print(f"{abs(directe[0]):.2f} {directe[1]:.2f} | {inverse[0]:.2f} {inverse[1]:.2f}")
print(f"{np.sqrt(0.6**2 + 2**2):.2f}")                       # écart type de p
for q in [directe, inverse]:
    print(f"{kl(p, gauss(x, *q)):.3f} {kl(gauss(x, *q), p):.3f}")
# 0.00 2.09 | 2.00 0.60
# 2.09
# 0.555 1.269
# 10.419 0.692`}</code>
        </pre>
        <p>
          Le sens direct donne une gaussienne centrée en 0, d'écart type 2,09 : exactement celui de <Tex>p</Tex>,
          dont la variance est <Tex>{"0{,}6^2 + 2^2"}</Tex>. Elle met beaucoup de masse dans le creux entre les
          bosses. Le sens inverse se pose sur une seule bosse, avec son écart type 0,6. Chacune est mauvaise pour
          l'autre critère : plus de 10 nats pour la gaussienne étroite en sens direct, car elle ignore toute une bosse
          de <Tex>p</Tex>. La grille est grossière ; la figure ci-dessous cherche l'optimum exact, d'où de légers écarts
          dans les décimales. Sa divergence inverse, 0,692, est presque <Tex>{"\\ln 2"}</Tex> : vue de <Tex>q</Tex>, la
          loi <Tex>p</Tex> est la même bosse, avec deux fois moins de masse.
        </p>
        <ModeViz />
        <p>
          Quand les bosses se rapprochent, le sens inverse ne choisit plus : une gaussienne centrée lui coûte moins
          cher. Goodfellow le note sous sa figure 3.6, il faut une vraie région de faible probabilité entre les modes.
          La suite du chapitre montre les deux sens à l'œuvre : le sens inverse dans les VAE et le RLHF, le sens
          direct dans la distillation.
        </p>
      </section>

      <section className="section">
        <span className="section-num">2</span>
        <h2>Le VAE et sa borne variationnelle</h2>
        <p>
          Un autoencodeur variationnel (VAE, Kingma et Welling, 2014) explique chaque donnée <Tex>x</Tex> par une
          variable cachée <Tex>z</Tex> : on tire <Tex>{"z \\sim p(z)"}</Tex>, puis <Tex>{"x \\sim p_\\theta(x \\mid z)"}</Tex>.
          Pour l'entraîner par maximum de vraisemblance, il faudrait{" "}
          <Tex>{"\\ln p_\\theta(x) = \\ln \\sum_z p(z)\\, p_\\theta(x \\mid z)"}</Tex>, une somme (ou une intégrale)
          impossible à calculer. On introduit un <strong>encodeur</strong> <Tex>{"q_\\phi(z \\mid x)"}</Tex>, et
          l'identité suivante, valable pour tout <Tex>q</Tex> (Kingma et Welling, équations 1 et 2 ; PRML,
          équation 10.2) :
        </p>
        <Tex block>{"\\ln p_\\theta(x) = \\underbrace{\\mathbb E_{q}\\big[\\ln p_\\theta(x, z) - \\ln q_\\phi(z \\mid x)\\big]}_{\\mathcal L,\\ \\text{la borne (ELBO)}} + D_{\\mathrm{KL}}\\big(q_\\phi(z \\mid x) \\,\\|\\, p_\\theta(z \\mid x)\\big)"}</Tex>
        <p>
          Il suffit d'écrire <Tex>{"\\ln p(x) = \\ln p(x, z) - \\ln p(z \\mid x)"}</Tex>, d'ajouter et retrancher{" "}
          <Tex>{"\\ln q"}</Tex>, puis de prendre la moyenne sous <Tex>q</Tex>. Par l'inégalité de Gibbs, la
          divergence est positive : <Tex>{"\\mathcal L"}</Tex> est une borne inférieure de la log-vraisemblance,
          qu'on maximise à la place. Et l'écart est une divergence <em>inverse</em>, de l'encodeur vers la vraie loi a
          posteriori.
        </p>
        <pre>
          <code>{`import numpy as np

# Un modèle à variable latente z dans {0, 1, 2}, et une donnée x observée
prior = np.array([0.5, 0.3, 0.2])           # p(z)
vrais = np.array([0.1, 0.6, 0.3])           # p(x | z) pour la donnée x
jointe = prior * vrais                      # p(x, z)
px = jointe.sum()                           # p(x) = 0,29
post = jointe / px                          # la vraie loi a posteriori p(z | x)

def elbo(q):
    return q @ (np.log(jointe) - np.log(q))

def kl(a, b):
    return a @ np.log(a / b)

for q in [np.array([1/3, 1/3, 1/3]), np.array([0.2, 0.5, 0.3]), post]:
    print(round(np.log(px), 4), round(elbo(q), 4), round(kl(q, post), 4))
# -1.2379 -1.4094 0.1715
# -1.2379 -1.2709 0.033
# -1.2379 -1.2379 0.0`}</code>
        </pre>
        <p>
          Pour chaque <Tex>q</Tex>, la borne plus la divergence redonne <Tex>{"\\ln p(x) \\approx -1{,}2379"}</Tex>,
          et la borne est atteinte quand <Tex>q</Tex> est la vraie loi a posteriori. En réécrivant{" "}
          <Tex>{"\\ln p_\\theta(x, z) = \\ln p_\\theta(x \\mid z) + \\ln p(z)"}</Tex>, la borne se coupe en deux
          termes, que le VAE optimise (Kingma et Welling, équation 3) :
        </p>
        <Tex block>{"\\mathcal L = \\underbrace{\\mathbb E_{q}\\big[\\ln p_\\theta(x \\mid z)\\big]}_{\\text{reconstruction}} - \\underbrace{D_{\\mathrm{KL}}\\big(q_\\phi(z \\mid x) \\,\\|\\, p(z)\\big)}_{\\text{régularisation}}"}</Tex>
        <p>
          Le premier demande au décodeur de reconstruire <Tex>x</Tex> à partir de son code ; le second retient
          l'encodeur près de l'a priori <Tex>{"p(z) = \\mathcal N(0, I)"}</Tex>. Avec un encodeur gaussien{" "}
          <Tex>{"\\mathcal N(\\mu, \\operatorname{diag} \\sigma^2)"}</Tex> en dimension <Tex>J</Tex>, ce terme se
          calcule exactement (Kingma et Welling, annexe B ; Doersch, <em>Tutorial on VAEs</em>, équation 7) :
        </p>
        <Tex block>{"D_{\\mathrm{KL}}\\big(\\mathcal N(\\mu, \\sigma^2) \\,\\|\\, \\mathcal N(0, I)\\big) = \\frac12 \\sum_{j=1}^{J} \\big(\\mu_j^2 + \\sigma_j^2 - 1 - \\ln \\sigma_j^2\\big)"}</Tex>
        <pre>
          <code>{`import numpy as np

mu, sigma = 1.0, 0.5                       # une dimension : q = N(1, 0,5^2), a priori N(0, 1)
formule = 0.5 * (mu**2 + sigma**2 - 1 - np.log(sigma**2))

rng = np.random.default_rng(0)
z = mu + sigma * rng.standard_normal(1_000_000)          # z = mu + sigma * epsilon
log_q = -0.5 * ((z - mu) / sigma) ** 2 - np.log(sigma) - 0.5 * np.log(2 * np.pi)
log_p = -0.5 * z**2 - 0.5 * np.log(2 * np.pi)
print(round(formule, 4), round(np.mean(log_q - log_p), 4))
# 0.8181 0.8181`}</code>
        </pre>
        <p>
          La moyenne de <Tex>{"\\ln q - \\ln p"}</Tex> sur un million de tirages retrouve la formule. Les tirages{" "}
          <Tex>{"z = \\mu + \\sigma \\varepsilon"}</Tex>, avec <Tex>{"\\varepsilon \\sim \\mathcal N(0, 1)"}</Tex>, sont
          l'astuce de reparamétrisation du chapitre Gaussienne : c'est ainsi que le VAE estime le terme de
          reconstruction, qui n'a pas de formule, tout en gardant un gradient par rapport à <Tex>\mu</Tex> et{" "}
          <Tex>\sigma</Tex>. Le terme KL, lui, est nul seulement pour <Tex>{"\\mu = 0"}</Tex> et{" "}
          <Tex>{"\\sigma = 1"}</Tex>.
        </p>
      </section>

      <section className="section">
        <span className="section-num">3</span>
        <h2>La distillation</h2>
        <p>
          Pour transmettre ce qu'a appris un gros modèle, le <em>professeur</em>, à un petit modèle, l'
          <em>élève</em>, Hinton, Vinyals et Dean (2015) entraînent l'élève sur les probabilités du professeur
          plutôt que sur les seules étiquettes. Ces <strong>cibles douces</strong> disent aussi quelles erreurs sont
          plausibles : un 2 qui ressemble un peu à un 3. Pour les rendre visibles, on adoucit les deux softmax avec
          une température <Tex>T</Tex>, celle du chapitre Lois discrètes (Hinton et al., équation 1) :
        </p>
        <Tex block>{"p_i = \\frac{e^{v_i / T}}{\\sum_j e^{v_j / T}} \\qquad q_i = \\frac{e^{z_i / T}}{\\sum_j e^{z_j / T}}"}</Tex>
        <p>
          où <Tex>v</Tex> sont les logits du professeur et <Tex>z</Tex> ceux de l'élève. La perte est l'entropie
          croisée <Tex>{"H(p, q) = H(p) + D_{\\mathrm{KL}}(p \\| q)"}</Tex>. Comme <Tex>{"H(p)"}</Tex> ne dépend pas
          de l'élève, l'entraîner revient à minimiser la divergence <em>directe</em> : l'élève doit couvrir toute la
          loi du professeur, y compris ses petites probabilités. La même température sert au professeur et à
          l'élève pendant l'entraînement, puis l'élève revient à <Tex>{"T = 1"}</Tex> (Hinton et al., section 2 ;
          Sanh et al., DistilBERT, section 2). Le gradient par rapport à un logit de l'élève vaut (Hinton et al.,
          équation 2) :
        </p>
        <Tex block>{"\\frac{\\partial H(p, q)}{\\partial z_i} = \\frac{1}{T}\\,(q_i - p_i)"}</Tex>
        <pre>
          <code>{`import numpy as np

def softmax(z, T):
    e = np.exp((z - z.max()) / T)
    return e / e.sum()

def perte(z, v, T):  # entropie croisée avec les cibles douces du professeur, à la température T
    return -softmax(v, T) @ np.log(softmax(z, T))

v = np.array([4.0, 1.0, -1.0, -4.0])   # logits du professeur (moyenne nulle)
z = np.array([2.0, 1.0, 0.0, -3.0])    # logits de l'élève (moyenne nulle)

T = 2.0
p, q = softmax(v, T), softmax(z, T)
H, D = -(p @ np.log(p)), p @ np.log(p / q)
print(round(perte(z, v, T), 4), round(H + D, 4))

h = 1e-6                               # gradient par différences finies
num = np.array([(perte(z + h * e, v, T) - perte(z - h * e, v, T)) / (2 * h) for e in np.eye(4)])
print(num.round(4), ((q - p) / T).round(4))

for T in [1, 5, 20, 100]:
    g = (softmax(z, T) - softmax(v, T)) / T
    print(T, (T**2 * g).round(3))
print((z - v) / 4)
# 0.9019 0.9019
# [-0.1346  0.0632  0.0584  0.013 ] [-0.1346  0.0632  0.0584  0.013 ]
# 1 [-0.284  0.197  0.083  0.004]
# 5 [-0.61   0.138  0.305  0.167]
# 20 [-0.54   0.033  0.273  0.235]
# 100 [-0.509  0.006  0.255  0.247]
# [-0.5   0.    0.25  0.25]`}</code>
        </pre>
        <p>
          La perte vaut bien <Tex>{"H(p) + D_{\\mathrm{KL}}(p \\| q)"}</Tex>, et les différences finies retrouvent
          le gradient <Tex>{"(q - p)/T"}</Tex>. La dernière boucle montre un point pratique. Quand <Tex>T</Tex> est
          grand devant les logits, <Tex>{"q_i - p_i"}</Tex> est de l'ordre de <Tex>{"(z_i - v_i)/(NT)"}</Tex>, si bien
          que le gradient décroît comme <Tex>{"1/T^2"}</Tex> : multiplié par <Tex>{"T^2"}</Tex>, il tend vers{" "}
          <Tex>{"(z_i - v_i)/N"}</Tex>, ici <Tex>{"(-0{,}5,\\ 0,\\ 0{,}25,\\ 0{,}25)"}</Tex> (Hinton et al., équation
          4). D'où leur consigne : quand on ajoute la perte sur les vraies étiquettes, multiplier la perte douce par{" "}
          <Tex>{"T^2"}</Tex> garde l'équilibre entre les deux quand on change la température. À haute température,
          distiller revient à faire coïncider les logits.
        </p>
      </section>

      <section className="section">
        <span className="section-num">4</span>
        <h2>RLHF : la laisse KL</h2>
        <p>
          Après le pré-entraînement et l'affinage supervisé, on obtient un modèle de référence{" "}
          <Tex>{"\\pi_{\\text{ref}}"}</Tex>. Le RLHF entraîne ensuite une politique <Tex>\pi</Tex> à maximiser la
          note <Tex>{"r(x, y)"}</Tex> d'un modèle de récompense, appris sur des préférences humaines. Mais ce modèle
          de récompense n'est fiable que près des réponses qu'il a vues, et une politique libre finit par exploiter
          ses failles. On ajoute donc une pénalité de divergence, en sens <em>inverse</em> (Ziegler et al., 2019,
          section 2, équation 2 ; Stiennon et al., 2020, section 3.4 ; Ouyang et al., 2022, InstructGPT, équation 2 ;
          Rafailov et al., 2023, DPO, équation 3) :
        </p>
        <Tex block>{"\\max_\\pi\\ \\mathbb E_{y \\sim \\pi}\\big[r(x, y)\\big] - \\beta\\, D_{\\mathrm{KL}}\\big(\\pi(\\cdot \\mid x) \\,\\|\\, \\pi_{\\text{ref}}(\\cdot \\mid x)\\big)"}</Tex>
        <p>
          En pratique, on retire <Tex>{"\\beta \\ln \\frac{\\pi(y \\mid x)}{\\pi_{\\text{ref}}(y \\mid x)}"}</Tex> à la
          récompense de chaque réponse tirée, token par token, et la moyenne de ce terme est la divergence.
          Stiennon et Ziegler lui donnent deux rôles : un bonus d'entropie qui empêche la politique de s'effondrer
          sur une seule réponse, et une laisse qui la garde là où le modèle de récompense est valable. InstructGPT
          utilise <Tex>{"\\beta = 0{,}02"}</Tex> (annexe C.4).
        </p>
        <p>
          <strong>La politique optimale a une formule.</strong> Posons{" "}
          <Tex>{"\\pi^*(y) = \\pi_{\\text{ref}}(y)\\, e^{r(y)/\\beta} / Z"}</Tex>, avec <Tex>Z</Tex> la constante de
          normalisation. En développant, l'objectif s'écrit (DPO, annexe A.1) :
        </p>
        <Tex block>{"\\mathbb E_{\\pi}[r] - \\beta\\, D_{\\mathrm{KL}}(\\pi \\| \\pi_{\\text{ref}}) = \\beta \\ln Z - \\beta\\, D_{\\mathrm{KL}}(\\pi \\| \\pi^*)"}</Tex>
        <p>
          <Tex>Z</Tex> ne dépend pas de <Tex>\pi</Tex>, et par l'inégalité de Gibbs le maximum est atteint en{" "}
          <Tex>{"\\pi = \\pi^*"}</Tex>, et seulement là (Ziegler et al., section 3.1 ; DPO, équation 4). La
          politique optimale repondère le modèle de référence par <Tex>{"e^{r/\\beta}"}</Tex> : une réponse qui a
          une probabilité nulle sous <Tex>{"\\pi_{\\text{ref}}"}</Tex> le reste. C'est le point de départ de DPO,
          qui en déduit une perte sans apprentissage par renforcement.
        </p>
        <pre>
          <code>{`import numpy as np

ref = np.array([0.4, 0.3, 0.2, 0.1])   # pi_ref : le modèle de départ, sur 4 réponses possibles
r = np.array([0.0, 1.0, 2.0, 3.0])     # la note du modèle de récompense pour chaque réponse

def kl(a, b):
    m = a > 0
    return a[m] @ np.log(a[m] / b[m])

def objectif(pi, beta):                # récompense moyenne moins la laisse KL
    return pi @ r - beta * kl(pi, ref)

def optimale(beta):                    # pi* = pi_ref exp(r / beta) / Z
    w = ref * np.exp(r / beta)
    return w / w.sum(), np.log(w.sum())

rng = np.random.default_rng(0)
for beta in [5.0, 1.0, 0.2]:
    pi, logZ = optimale(beta)
    autres = max(objectif(rng.dirichlet(np.ones(4)), beta) for _ in range(20_000))
    print(beta, pi.round(3), round(pi @ r, 3), round(kl(pi, ref), 3))
    print("  ", round(objectif(pi, beta), 4), round(beta * logZ, 4), autres < objectif(pi, beta))
# 5.0 [0.321 0.294 0.239 0.146] 1.211 0.021
#    1.1037 1.1037 True
# 1.0 [0.085 0.173 0.314 0.427] 2.084 0.536
#    1.548 1.548 True
# 0.2 [0.    0.    0.013 0.987] 2.986 2.221
#    2.5422 2.5422 True`}</code>
        </pre>
        <p>
          À chaque <Tex>\beta</Tex>, l'objectif de <Tex>{"\\pi^*"}</Tex> vaut <Tex>{"\\beta \\ln Z"}</Tex>, et aucune
          des 20 000 politiques tirées au hasard ne fait mieux. Avec une laisse longue (<Tex>{"\\beta = 5"}</Tex>), la
          politique reste proche de la référence : récompense 1,21, divergence 0,02 nat. Avec une laisse courte
          (<Tex>{"\\beta = 0{,}2"}</Tex>), elle met 98,7 % de sa masse sur la meilleure réponse : la récompense
          approche 3, la divergence approche <Tex>{"\\ln(1/0{,}1) \\approx 2{,}30"}</Tex>, et la diversité disparaît.
          Régler <Tex>\beta</Tex>, c'est choisir combien de récompense on achète contre combien d'écart au modèle de
          départ.
        </p>
      </section>
    </LessonFlow>
  );
}
