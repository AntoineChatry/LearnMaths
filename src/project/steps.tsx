import { useState } from "react";
import { getSolved } from "../quest/progress";
import type { Level, Verdict } from "../quest/types";
import { PY_ENGINE } from "./engine";
import { DepthChart, LossChart, MeteorScene, resultOf } from "./MeteorScene";
import expertPy from "./py/expert.py?raw";
import monde from "./py/monde.py?raw";
import etape1 from "./py/etape1.py?raw";
import etape2 from "./py/etape2.py?raw";
import etape3 from "./py/etape3.py?raw";
import etape4 from "./py/etape4.py?raw";
import etape5 from "./py/etape5.py?raw";
import etape6 from "./py/etape6.py?raw";
import etape7 from "./py/etape7.py?raw";
import etape8 from "./py/etape8.py?raw";
import etape9 from "./py/etape9.py?raw";
import etape10 from "./py/etape10.py?raw";
import programme from "./py/programme.py?raw";

// "A robot that learns": each step asks for one function; the functions validated in earlier steps are run
// before the player's code (see monde.py), so the brain is assembled piece by piece.
type Ctx = { seed: number; deps: [number, string | null][] };
type R = Record<string, unknown>;

const IDS = ["projet-vision", "projet-decision", "projet-apprendre", "projet-gradient", "projet-conditionnement", "projet-softmax", "projet-couche", "projet-retro", "projet-adam", "projet-cerveau"];

const fr = (n: number, digits = 2) => n.toFixed(digits).replace(".", ",");
// Inside $...$: KaTeX needs {,} for a decimal comma without a space after it.
const frTex = (n: number, digits = 2) => n.toFixed(digits).replace(".", "{,}");
const num = (r: R, k: string) => r[k] as number;

function context(step: number): () => Ctx {
  return () => ({
    seed: Math.floor(Math.random() * 1e6),
    deps: IDS.slice(0, step - 1).map((id, i) => [i + 1, getSolved(id) ?? null]),
  });
}

// Common failures (error, missing earlier step), else the step's own verdict from the harness result.
function judgeWith(check: (r: R) => Verdict) {
  return (_ctx: Ctx, trace: unknown[], error: string | null): Verdict => {
    if (error) return { ok: false, stars: 0, message: "Ton code s'est arrêté sur une erreur (voir la console)." };
    const r = resultOf(trace);
    if (!r) return { ok: false, stars: 0, message: "Le test n'a pas pu aller jusqu'au bout." };
    if (r.dep) return { ok: false, stars: 0, message: String(r.dep) };
    return check(r);
  };
}

function Scene({ trace, step, done, vision }: { trace: unknown[]; step: number; done: boolean; vision?: boolean }) {
  const r = resultOf(trace);
  return (
    <>
      <MeteorScene trace={trace} step={step} showVision={!!vision} />
      {done && r && Array.isArray(r.pertes) && (
        <LossChart losses={r.pertes as number[]} target={r.cible as number | undefined} unit={r.n ? "passe" : undefined} />
      )}
      {done && r && Array.isArray(r.he) && <DepthChart ours={r.he as number[]} xavier={r.xavier as number[]} />}
    </>
  );
}

const common = {
  prelude: `${PY_ENGINE}\n${expertPy}\n${monde}`,
  packages: ["numpy"],
  timeoutMs: 30000,
  stepMs: 70,
};

const partieApi = [
  { sig: "partie.x", doc: "La colonne du robot, de 0 à 8. Le robot est toujours à la hauteur 0." },
  { sig: "partie.meteores", doc: "La liste des (colonne, hauteur) des météores ; la hauteur 1 est la ligne juste au-dessus du robot." },
];

const vision: Level<Ctx> = {
  ...common,
  id: IDS[0],
  nodeId: "vecteurs",
  title: "La vision",
  story: [
    "Pluie de météores. Ton robot est sur la ligne du bas d'un écran de 9 colonnes sur 10 lignes. À chaque tick, il va à gauche, reste ou va à droite ($-1$, $0$, $+1$), puis tous les météores descendent d'une ligne : s'il y en a un sur sa case, il est détruit. Au fil des étapes, tu vas lui écrire un cerveau qui apprend à esquiver, une fonction à la fois. Chaque fonction validée est reprise telle quelle dans les étapes suivantes.",
    "Première pièce : la vision. Un réseau de neurones ne voit pas un écran, il voit un vecteur. Le robot regarde les 5 colonnes autour de lui (de $x - 2$ à $x + 2$) sur les 4 lignes au-dessus de lui (hauteurs 1 à 4) : 20 cases, rangées ligne par ligne dans un vecteur $v \\in \\mathbb{R}^{20}$. La case de hauteur $h$ et de décalage $dx$ va à l'indice $5(h - 1) + (dx + 2)$. Elle vaut 1 s'il y a un météore, ou si elle sort de l'écran (un bord bloque autant qu'un météore), et 0 sinon.",
    "Ta fonction est testée sur toutes les positions de 6 parties jouées par un expert. Pendant le film, le panneau de droite affiche ton vecteur, rangé comme la fenêtre en pointillés.",
  ],
  api: partieApi,
  starter: `import numpy as np


def percevoir(partie):
    """Renvoie la vision du robot : un vecteur de 20 nombres (0 ou 1)."""
    x = partie.x
    meteores = set(partie.meteores)
    vision = np.zeros(20)
    # À toi : pour chaque hauteur h de 1 à 4 et chaque décalage dx de -2 à 2,
    # vision[5 * (h - 1) + (dx + 2)] vaut 1 s'il y a un météore en (x + dx, h)
    # ou si la colonne x + dx sort de l'écran.
    return vision
`,
  hint: "Deux boucles imbriquées : h dans range(1, 5) et dx dans range(-2, 3). La colonne regardée est $c = x + dx$ ; elle sort de l'écran si $c < 0$ ou $c > 8$. Le test (c, h) in meteores dit s'il y a un météore sur cette case.",
  newContext: context(1),
  postlude: etape1,
  judge: judgeWith((r) => {
    if (r.wrong === 0) return { ok: true, stars: 3, message: `Ta vision est exacte sur les ${r.total} positions testées.` };
    const first = r.first as { x: number; ref: number[]; got: number[] | null };
    if (!first.got || first.got.length !== 20)
      return { ok: false, stars: 0, message: `percevoir doit renvoyer 20 nombres ; ta fonction en renvoie ${first.got?.length ?? "autre chose"}.` };
    const i = first.ref.findIndex((v, k) => v !== first.got![k]);
    const h = Math.floor(i / 5) + 1;
    const dx = (i % 5) - 2;
    return {
      ok: false,
      stars: 0,
      message: `Faux sur ${r.wrong} positions sur ${r.total}. Première erreur : robot en colonne ${first.x}, case de hauteur ${h} et de décalage ${dx} (colonne ${first.x + dx}, indice ${i}) : il fallait ${first.ref[i]}, ton vecteur donne ${first.got[i]}.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} vision />,
};

const decision: Level<Ctx> = {
  ...common,
  id: IDS[1],
  nodeId: "matrices",
  title: "La décision",
  story: [
    "Deuxième pièce : la décision. Le cerveau le plus simple est linéaire : une matrice $W$ de taille $3 \\times 20$ et un vecteur $b \\in \\mathbb{R}^3$ donnent trois scores $s = Wv + b$, un par action. Chaque score est un produit scalaire entre une ligne de $W$ et la vision $v$ : la ligne $i$ dit combien chaque case vue pèse pour l'action $i$.",
    "Le robot joue l'action de plus grand score : l'indice 0 veut dire gauche ($-1$), 1 rester ($0$), 2 droite ($+1$). Ta fonction est testée sur 300 cas ; ensuite le robot joue avec des poids tirés au hasard. Ne t'attends pas à des miracles : c'est l'étape suivante qui lui apprendra ses poids.",
  ],
  api: [
    { sig: "W @ v", doc: "Le produit matrice-vecteur en NumPy." },
    { sig: "np.argmax(s)", doc: "L'indice du plus grand élément de s." },
  ],
  starter: `import numpy as np


def decider(W, b, vision):
    """Renvoie l'action : -1 (gauche), 0 (rester) ou +1 (droite)."""
    scores = np.zeros(3)  # À toi : les trois scores
    return 0  # À toi : l'action de plus grand score
`,
  hint: "Les scores sont W @ vision + b. np.argmax(scores) renvoie 0, 1 ou 2 : il reste à le décaler de 1 pour obtenir $-1$, $0$ ou $+1$.",
  newContext: context(2),
  postlude: etape2,
  judge: judgeWith((r) => {
    if (r.wrong === 0)
      return {
        ok: true,
        stars: 3,
        message: `Décision exacte sur les 300 cas. Avec des poids au hasard, le robot survit en moyenne ${fr(num(r, "survie"), 1)} ticks sur 300 : il lui faut apprendre.`,
      };
    const first = r.first as { scores: number[]; ref: number; got: string };
    return {
      ok: false,
      stars: 0,
      message: `Faux sur ${r.wrong} cas sur 300. Par exemple, pour les scores (${first.scores.map((s) => fr(s)).join(" ; ")}), il fallait renvoyer ${first.ref}, ta fonction renvoie ${first.got}.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const apprendre: Level<Ctx> = {
  ...common,
  id: IDS[2],
  nodeId: "orthogonalite",
  title: "Apprendre de l'expert",
  story: [
    "Troisième pièce : apprendre. Un joueur expert, qui voit tout l'écran, a joué 30 parties. À chaque tick, on a noté ce que voyait ton robot (une ligne de $X$, avec ta fonction percevoir) et le coup de l'expert, codé en « one-hot » (une ligne de $Y$ : $(1, 0, 0)$ pour gauche, $(0, 1, 0)$ pour rester, $(0, 0, 1)$ pour droite). Cela fait environ 8 700 exemples.",
    "On cherche $W$ et $b$ pour que les scores $Wv + b$ collent au mieux aux lignes de $Y$ : ce sont des moindres carrés (chapitre 6). On ajoute à $X$ une colonne de 1 pour le biais, $X_a = [X \\mid \\mathbf{1}]$, et on minimise $\\|X_a T - Y\\|^2$, où $T$ ($21 \\times 3$) empile $W^\\top$ puis $b$. Classer par moindres carrés est la méthode la plus simple qui soit (Bishop, Pattern Recognition and Machine Learning, §4.1.3).",
    "Le test vérifie l'équation normale $X_a^\\top (X_a T - Y) = 0$, puis ton robot joue 40 parties avec les poids appris (toujours les mêmes, pour comparer les cerveaux entre les étapes).",
  ],
  api: [
    { sig: "X, Y", doc: "Les visions (N × 20) et les coups de l'expert en one-hot (N × 3)." },
    { sig: "np.hstack([A, B])", doc: "Colle des matrices côte à côte ; np.ones((N, 1)) est une colonne de 1." },
    { sig: "np.linalg.lstsq(A, B, rcond=None)[0]", doc: "La solution des moindres carrés de A T = B (chapitre 6)." },
  ],
  starter: `import numpy as np


def apprendre(X, Y):
    """Renvoie W (3 x 20) et b (3,) qui ajustent au mieux les scores X W^T + b à Y."""
    Xa = X  # À toi : ajoute une colonne de 1 à droite de X
    T = np.zeros((21, 3))  # À toi : la solution des moindres carrés de Xa T = Y
    W = T[:-1].T
    b = T[-1]
    return W, b
`,
  hint: "Xa = np.hstack([X, np.ones((len(X), 1))]), puis T = np.linalg.lstsq(Xa, Y, rcond=None)[0]. Les 20 premières lignes de $T$ forment $W^\\top$, la dernière est $b$.",
  newContext: context(3),
  postlude: etape3,
  judge: judgeWith((r) => {
    if (r.shape) {
      const [w, b] = r.shape as number[][];
      return { ok: false, stars: 0, message: `W doit être de taille (3, 20) et b de taille (3,) ; ta fonction renvoie (${w.join(", ")}) et (${b.join(", ")}).` };
    }
    if (num(r, "normal") > 1e-6)
      return {
        ok: false,
        stars: 0,
        message: `Ce ne sont pas les moindres carrés : l'équation normale n'est pas vérifiée (écart ${num(r, "normal").toExponential(1)}). Ta perte vaut ${fr(num(r, "loss"), 4)}, le minimum est ${fr(num(r, "best"), 4)}.`,
      };
    return {
      ok: true,
      stars: 3,
      message: `Équation normale vérifiée. Ton robot survit en moyenne ${fr(num(r, "survie"), 1)} ticks sur 300, contre une douzaine avec des poids au hasard. L'expert, lui, tient les 300. Une partie de l'écart vient de la perte : les moindres carrés sont mal faits pour choisir entre des classes (Bishop, §4.1.3). Une étape future en essaiera une autre.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const gradient: Level<Ctx> = {
  ...common,
  id: IDS[3],
  nodeId: "symetriques",
  title: "Apprendre pas à pas",
  story: [
    "Quatrième pièce : la descente de gradient. lstsq résout le problème d'un coup, mais aucune formule ne donne les poids d'un réseau de neurones : on les entraîne par petits pas, $T \\leftarrow T - \\eta \\nabla L(T)$. On s'y exerce ici sur le problème de l'étape 3, dont on connaît déjà la réponse.",
    "La perte est $L(T) = \\frac{1}{N} \\|X_a T - Y\\|^2$. Son gradient est $\\nabla L = \\frac{2}{N} X_a^\\top (X_a T - Y)$, et sa hessienne $H = \\frac{2}{N} X_a^\\top X_a$ est symétrique et semi-définie positive (chapitre 8). Sur une quadratique, la descente à pas fixe converge exactement quand $0 < \\eta \\lambda_i < 2$ pour toutes les valeurs propres $\\lambda_i$ de $H$, donc quand $\\eta < 2 / \\lambda_{\\max}$. Le meilleur pas fixe est $\\eta = 2 / (\\lambda_{\\max} + \\lambda_{\\min})$ (Goh, « Why Momentum Really Works », Distill, 2017).",
    "La descente part de $T = 0$ et doit atteindre la perte des moindres carrés, à 1 % près, en moins de 300 itérations. Les étoiles dépendent du nombre d'itérations, comparé à celui du meilleur pas fixe.",
  ],
  api: [
    { sig: "gradient(T, Xa, Y)", doc: "T est de taille 21 × 3 ; le gradient a la même taille." },
    { sig: "np.linalg.eigvalsh(H)", doc: "Les valeurs propres d'une matrice symétrique, par ordre croissant (chapitre 8)." },
    { sig: "Xa.T, len(Xa)", doc: "La transposée, et le nombre N d'exemples." },
  ],
  starter: `import numpy as np


def gradient(T, Xa, Y):
    """Gradient de L(T) = ||Xa T - Y||² / N, de même taille que T."""
    N = len(Xa)
    return np.zeros_like(T)  # À toi


def choisir_pas(Xa):
    """Un pas de descente tiré des valeurs propres de la hessienne de L."""
    N = len(Xa)
    H = np.zeros((21, 21))  # À toi : la hessienne de L
    lam = np.linalg.eigvalsh(H)  # par ordre croissant : lam[0] est la plus petite, lam[-1] la plus grande
    return 0.01  # À toi
`,
  hint: "Le gradient est 2 * Xa.T @ (Xa @ T - Y) / N et la hessienne 2 * Xa.T @ Xa / N. Avec lam = eigvalsh(H), le pas 1 / lam[-1] converge toujours ; 2 / (lam[-1] + lam[0]) est le meilleur pas fixe.",
  newContext: context(4),
  postlude: etape4,
  judge: judgeWith((r) => {
    if (r.grad === false) {
      if (r.got === null || (r.shape as number[]).join() !== "21,3")
        return { ok: false, stars: 0, message: `Le gradient doit avoir la taille de T, (21, 3) ; ta fonction renvoie (${(r.shape as number[]).join(", ")}).` };
      return {
        ok: false,
        stars: 0,
        message: `Ton gradient est faux. Par différences finies, la dérivée de L par rapport au premier poids vaut ${fr(num(r, "slope"), 4)} ; ta fonction donne ${fr(num(r, "got"), 4)}.`,
      };
    }
    const { pas, lmin, lmax, its, its_opt } = r as { pas: number; lmin: number; lmax: number; its: number | null; its_opt: number };
    const pertes = r.pertes as number[];
    const bornes = `Ici $\\lambda_{\\min} = ${frTex(lmin, 3)}$ et $\\lambda_{\\max} = ${frTex(lmax, 3)}$, donc il faut $\\eta < 2 / \\lambda_{\\max} = ${frTex(2 / lmax, 3)}$.`;
    if (its === null) {
      if (pertes[pertes.length - 1] >= 1e6 || pertes.length < 300)
        return { ok: false, stars: 0, message: `La descente diverge avec $\\eta = ${frTex(pas, 4)}$ : la perte explose. ${bornes}` };
      return { ok: false, stars: 0, message: `Trop lent : avec $\\eta = ${frTex(pas, 4)}$, la perte n'a pas atteint la cible en 300 itérations. ${bornes}` };
    }
    const stars = its <= its_opt + 1 ? 3 : its <= 2 * its_opt ? 2 : 1;
    return {
      ok: true,
      stars,
      message: `Perte des moindres carrés atteinte en ${its} itérations (meilleur pas fixe : ${its_opt}). Le conditionnement de la hessienne vaut $\\kappa = \\lambda_{\\max} / \\lambda_{\\min} = ${frTex(lmax / lmin, 1)}$. Ton robot survit en moyenne ${fr(num(r, "survie"), 1)} ticks : c'est le cerveau de l'étape 3, trouvé pas à pas.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const conditionnement: Level<Ctx> = {
  ...common,
  id: IDS[4],
  nodeId: "svd",
  title: "Bien conditionner",
  story: [
    "Cinquième pièce : le conditionnement. À l'étape 4, la descente a mis des dizaines d'itérations. Sa vitesse dépend du conditionnement de la hessienne, $\\kappa = \\lambda_{\\max} / \\lambda_{\\min}$ (Goh, Distill, 2017), et $\\kappa(X_a^\\top X_a) = \\kappa(X_a)^2$ (chapitre 9).",
    "Le remède classique (LeCun et al., « Efficient BackProp », 1998, §4.3) : centrer chaque entrée pour que sa moyenne soit nulle, égaliser les variances et, si possible, décorréler les entrées. Ta fonction renvoie $\\mu$ et une matrice $M$, et le robot voit ensuite $(v - \\mu) M$. Standardiser, c'est $M = \\mathrm{diag}(1 / \\sigma_j)$. Décorréler, c'est passer dans la base des composantes principales (la PCA du chapitre 9) puis diviser chaque axe par son écart-type : c'est le « blanchiment ».",
    "L'entraînement reprend tes fonctions de l'étape 4, gradient et pas compris. Étoiles : une normalisation qui fait nettement baisser $\\kappa$ en vaut 1, la standardisation 2, et le blanchiment, qui ramène $\\kappa$ à 1, en vaut 3. Le cerveau appris doit rester aussi bon : une transformation qui perd de l'information est refusée.",
  ],
  api: [
    { sig: "X.mean(axis=0), X.std(axis=0)", doc: "Moyenne et écart-type de chaque colonne (chaque case vue)." },
    { sig: "np.diag(d)", doc: "La matrice diagonale de diagonale d." },
    { sig: "np.linalg.svd(A, full_matrices=False)", doc: "Renvoie U, s, Vt avec A = U diag(s) Vt (chapitre 9)." },
  ],
  starter: `import numpy as np


def normaliser(X):
    """Renvoie mu (20,) et M (20 x k) : le robot verra (vision - mu) @ M."""
    mu = np.zeros(20)  # À toi
    M = np.eye(20)  # À toi
    return mu, M
`,
  hint: "Standardiser : mu = X.mean(axis=0) et M = np.diag(1 / X.std(axis=0)). Blanchir : avec U, s, Vt = np.linalg.svd(X - mu, full_matrices=False), la covariance a pour vecteurs propres les colonnes de Vt.T et pour valeurs propres $s^2 / N$ ; M = Vt.T / (s / np.sqrt(len(X))).",
  newContext: context(5),
  postlude: etape5,
  judge: judgeWith((r) => {
    if (r.shape) {
      const [m, M] = r.shape as number[][];
      return { ok: false, stars: 0, message: `mu doit être de taille (20,) et M de taille (20, k) ; ta fonction renvoie (${m.join(", ")}) et (${M.join(", ")}).` };
    }
    const k = num(r, "k");
    const kBrut = num(r, "k_brut");
    if (!Number.isFinite(k) || num(r, "perte") > num(r, "best") * (1 + 1e-6) + 1e-12)
      return {
        ok: false,
        stars: 0,
        message: `Ta transformation perd de l'information : la meilleure perte possible passe de ${fr(num(r, "best"), 4)} à ${fr(num(r, "perte"), 4)}. Garde toutes les directions où les données varient.`,
      };
    if (k > kBrut / 2)
      return { ok: false, stars: 0, message: `$\\kappa(H)$ passe seulement de ${fr(kBrut, 1)} à ${fr(k, 1)} : ta normalisation ne change presque rien.` };
    if (r.its === null || r.its === undefined)
      return { ok: false, stars: 0, message: "La descente n'atteint pas la cible sur les données normalisées : vérifie ton pas de l'étape 4." };
    const stars = k <= 1.001 ? 3 : k <= num(r, "k_std") * 1.001 ? 2 : 1;
    return {
      ok: true,
      stars,
      message: `$\\kappa(H)$ passe de ${fr(kBrut, 1)} à ${fr(k, 2)}. La descente atteint la cible en ${r.its} itération${num(r, "its") > 1 ? "s" : ""}, contre ${r.its_brut} sans normalisation, et ton robot survit toujours en moyenne ${fr(num(r, "survie"), 1)} ticks : même cerveau, entraînement plus rapide.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const vec3 = (v: number[], digits = 4) => `(${v.map((x) => fr(x, digits)).join(" ; ")})`;

const probas: Level<Ctx> = {
  ...common,
  id: IDS[5],
  nodeId: "entropie-croisee",
  title: "Des scores aux probabilités",
  story: [
    "Sixième pièce : la perte. À l'étape 3, ton robot linéaire survivait 86 ticks en moyenne. Le cerveau n'est pas seul en cause : les moindres carrés reviennent à supposer un bruit gaussien autour des cibles 0 et 1, ce qu'un one-hot n'est pas du tout, et ils pénalisent même les prédictions « trop correctes », loin du bon côté de la frontière (Bishop, Pattern Recognition and Machine Learning, §4.1.3).",
    "Le remède : changer les scores en probabilités avec la softmax, ${p_k = e^{s_k} / \\sum_j e^{s_j}}$, et mesurer l'entropie croisée moyenne ${L = -\\frac{1}{N} \\sum_n \\log p_{n, y_n}}$, où $y_n$ est le coup de l'expert (PRML, éq. 4.104 et 4.108). Son gradient garde la forme simple des moindres carrés : par rapport à la ligne $k$ de $W$, c'est ${\\frac{1}{N} \\sum_n (p_{nk} - y_{nk})\\, v_n}$ (éq. 4.109).",
    "Attention aux grands scores : $e^{1000}$ dépasse ce qu'un flottant peut contenir. La softmax ne change pas si l'on retranche le même nombre à tous les scores, donc on retranche le plus grand, ${m = \\max_j s_j}$. Pour la perte, on calcule directement ${\\log p_k = s_k - m - \\log \\sum_j e^{s_j - m}}$, plutôt que le log d'une softmax qui peut valoir 0 (Goodfellow et al., Deep Learning, §4.1).",
    "Le test vérifie tes deux fonctions, puis entraîne le cerveau linéaire sur l'entropie croisée, sur tes données normalisées de l'étape 5, par la méthode de Newton (l'algorithme IRLS de PRML, §4.3.3). Étoiles : 1 si tes fonctions sont justes, une de plus pour chacune qui résiste aux grands scores.",
  ],
  api: [
    { sig: "S, Y", doc: "Les scores (N × 3, une ligne par exemple) et les coups de l'expert en one-hot (N × 3)." },
    { sig: "S.max(axis=1, keepdims=True)", doc: "Le plus grand score de chaque ligne, en colonne : S - m retranche à chaque ligne son maximum." },
    { sig: "E.sum(axis=1, keepdims=True)", doc: "La somme de chaque ligne, en colonne ; np.exp et np.log agissent terme à terme." },
    { sig: "np.sum(Y * logP)", doc: "Y vaut 1 sur le bon coup et 0 ailleurs : ce produit garde, sur chaque ligne, le log-probabilité du bon coup." },
  ],
  starter: `import numpy as np


def softmax(S):
    """S : une ligne de 3 scores par exemple (N x 3). Renvoie les probabilités, ligne par ligne."""
    E = np.exp(S)  # attention aux grands scores
    return E  # À toi : chaque ligne doit sommer à 1


def entropie_croisee(S, Y):
    """Moyenne sur les N exemples de -log p(coup de l'expert), à partir des scores S et de Y en one-hot."""
    return 0.0  # À toi
`,
  hint: "Avec m = S.max(axis=1, keepdims=True) : la softmax est E = np.exp(S - m) divisé par E.sum(axis=1, keepdims=True). Pour la perte : logP = S - m - np.log(np.exp(S - m).sum(axis=1, keepdims=True)), puis -np.sum(Y * logP) / len(S).",
  newContext: context(6),
  postlude: etape6,
  judge: judgeWith((r) => {
    if (!r.soft) {
      if (!r.got) return { ok: false, stars: 0, message: "softmax doit renvoyer un tableau de la même taille que S (N × 3)." };
      return {
        ok: false,
        stars: 0,
        message: `Ta softmax est fausse. Pour les scores ${vec3(r.s as number[], 2)}, il fallait ${vec3(r.ref as number[])}, ta fonction donne ${vec3(r.got as number[])}.`,
      };
    }
    if (!r.ce) {
      const got = r.got as number | null;
      const ratio = r.full_got !== null ? num(r, "full_got") / num(r, "full_ref") : 0;
      return {
        ok: false,
        stars: 0,
        message: `Ta perte est fausse. Sur les deux premiers exemples, elle vaut ${fr(num(r, "ref"), 4)}, ta fonction donne ${got === null ? "autre chose qu'un nombre" : fr(got, 4)}.${Math.abs(ratio - 200) < 1e-6 ? " Sur 200 exemples, ta valeur est 200 fois trop grande : il faut la moyenne, pas la somme." : ""}`,
      };
    }
    if (!r.train) return { ok: false, stars: 0, message: "L'entraînement s'est arrêté : ta softmax ou ta perte a renvoyé une valeur qui n'est pas finie." };
    const notes = [
      r.stable_soft ? "" : " Ta softmax ne résiste pas aux scores (1000 ; 999 ; −1000) : retranche d'abord le plus grand score de chaque ligne.",
      r.stable_ce ? "" : " Ta perte ne vaut pas 800 pour les scores (0 ; 800 ; 0) quand le bon coup est le premier : calcule log p sans passer par la softmax.",
    ].join("");
    return {
      ok: true,
      stars: 1 + (r.stable_soft ? 1 : 0) + (r.stable_ce ? 1 : 0),
      message: `Newton a convergé en ${r.its} itérations, jusqu'à une perte de ${fr(num(r, "perte"), 4)}. Avec l'entropie croisée, le même cerveau linéaire survit en moyenne ${fr(num(r, "survie"), 1)} ticks, contre ${fr(num(r, "survie_ls"), 1)} avec les moindres carrés de l'étape 3.${notes}`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const couche: Level<Ctx> = {
  ...common,
  id: IDS[6],
  nodeId: "lois-continues",
  title: "La couche cachée",
  story: [
    "Septième pièce : la couche cachée. Le cerveau devient un réseau de neurones : la vision normalisée $v$ (20 nombres) passe par 32 neurones, ${h = \\mathrm{ReLU}(W_1 v + b_1)}$, où ${\\mathrm{ReLU}(z) = \\max(z, 0)}$ agit sur chaque coordonnée, puis donne les scores ${s = W_2 h + b_2}$. $W_1$ est de taille $32 \\times 20$ et $W_2$ de taille $3 \\times 32$. Ta fonction propager fait ce calcul pour $N$ visions à la fois, rangées en lignes dans $X$ : $S = \\mathrm{ReLU}(X W_1^\\top + b_1)\\, W_2^\\top + b_2$.",
    "Avant d'apprendre, il faut des poids de départ. Ils ne peuvent pas être tous égaux : deux neurones identiques reçoivent les mêmes mises à jour et le restent (Goodfellow et al., Deep Learning, §8.4). On les tire donc au hasard, mais pas n'importe comment : chaque couche multiplie la variance du signal par ${\\frac{1}{2} n \\mathrm{Var}[w]}$, où $n$ est son nombre d'entrées et où le $\\frac{1}{2}$ vient de la ReLU, qui annule la moitié négative (He et al., « Delving Deep into Rectifiers », 2015, éq. 8). Pour garder ce facteur à 1, He et al. tirent ${w \\sim N(0, 2/n)}$ et mettent les biais à 0 (éq. 10).",
    "Le test vérifie propager, puis ton initialisation sur des dizaines de milliers de poids (forme, biais nuls, moyenne, variance, loi gaussienne). Il empile ensuite 30 couches de 256 neurones tirées par ta fonction et suit la variance du signal couche après couche, à côté de ${\\mathrm{Var}[w] = 1/n}$, l'initialisation de Xavier sous la forme qu'en donnent He et al. : elle ignore la ReLU et perd un facteur 2 par couche. Sur leur modèle de 30 couches, c'est elle qui bloque l'apprentissage (fig. 3). Enfin ton robot joue avec un réseau tiré au hasard : il n'a encore rien appris, ce sera le rôle des étapes 8 et 9.",
  ],
  api: [
    { sig: "rng.normal(0, ecart_type, size=(p, q))", doc: "Une matrice p × q de tirages gaussiens indépendants (rng est un générateur NumPy)." },
    { sig: "np.zeros(p)", doc: "Un vecteur de p zéros." },
    { sig: "np.maximum(Z, 0)", doc: "La ReLU, appliquée à chaque coefficient de Z." },
    { sig: "X @ W1.T + b1", doc: "Les N vecteurs W₁v + b₁, rangés en lignes : b1 s'ajoute à chaque ligne." },
  ],
  starter: `import numpy as np


def initialiser(n_entree, n_sortie, rng):
    """Une couche de He : W (n_sortie x n_entree) tiré selon N(0, 2 / n_entree), et b = 0."""
    W = np.zeros((n_sortie, n_entree))  # À toi
    b = np.zeros(n_sortie)
    return W, b


def propager(W1, b1, W2, b2, X):
    """X : une vision normalisée par ligne (N x 20). Renvoie les scores S (N x 3)."""
    return np.zeros((len(X), 3))  # À toi
`,
  hint: "La loi $N(0, 2/n)$ a pour écart-type $\\sqrt{2/n}$ : W = rng.normal(0, np.sqrt(2 / n_entree), size=(n_sortie, n_entree)). Pour propager : H = np.maximum(X @ W1.T + b1, 0), puis renvoie H @ W2.T + b2.",
  newContext: context(7),
  postlude: etape7,
  judge: judgeWith((r) => {
    if (!r.fwd) {
      if (r.got === null || r.got === undefined)
        return { ok: false, stars: 0, message: `propager doit renvoyer un tableau N × 3 ; pour 50 visions, ta fonction renvoie ${r.size ?? "autre chose qu'un tableau de nombres"}${r.size ? " nombres au lieu de 150" : ""}.` };
      if (r.no_relu) return { ok: false, stars: 0, message: "Ta fonction calcule le réseau sans la ReLU : sans elle, deux couches linéaires ne font qu'une seule matrice." };
      return { ok: false, stars: 0, message: `propager est fausse. Pour la première vision du test, il fallait les scores ${vec3(r.ref as number[], 3)}, ta fonction donne ${vec3(r.got as number[], 3)}.` };
    }
    if (!r.init) {
      if (r.pb === "forme")
        return { ok: false, stars: 0, message: `Pour initialiser(${r.n_in}, ${r.n_out}, rng), W doit être de taille (${r.n_out}, ${r.n_in}) et b de taille (${r.n_out},) ; ta fonction renvoie (${(r.w as number[]).join(", ")}) et (${(r.b as number[]).join(", ")}).` };
      if (r.pb === "biais") return { ok: false, stars: 0, message: "Les biais doivent partir de 0 (He et al., éq. 10)." };
      if (r.pb === "loi")
        return { ok: false, stars: 0, message: `Tes poids ont la bonne variance, mais pas une loi gaussienne : leur kurtosis vaut ${fr(num(r, "kurt"))}, contre 3 pour une gaussienne (1,8 pour une loi uniforme).` };
      return {
        ok: false,
        stars: 0,
        message: `Avec n_entree = ${r.n_in}, tes poids ont une moyenne de ${fr(num(r, "mean"), 5)} et une variance de ${fr(num(r, "var"), 5)} ; il faut une moyenne nulle et une variance de 2 / ${r.n_in} = ${fr(num(r, "ref"), 5)}.`,
      };
    }
    const he = r.he as number[];
    const xa = r.xavier as number[];
    const sci = (x: number) => x.toExponential(1).replace(".", ",");
    return {
      ok: true,
      stars: 3,
      message: `Réseau et initialisation corrects. Sur 30 couches, la variance du signal passe de ${fr(he[0])} à ${fr(he[he.length - 1])} avec ton initialisation, et de ${fr(xa[0])} à ${sci(xa[xa.length - 1])} avec celle de Xavier. Pas encore entraîné, ton réseau survit ${fr(num(r, "survie"), 1)} ticks en moyenne : à lui d'apprendre.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const retro: Level<Ctx> = {
  ...common,
  id: IDS[7],
  nodeId: "retropropagation",
  title: "La rétropropagation",
  story: [
    "Huitième pièce : le gradient du réseau. Pour l'entraîner, il faut les dérivées de la perte (l'entropie croisée moyenne de l'étape 6) par rapport à ses 771 paramètres : 640 dans $W_1$, 32 dans $b_1$, 96 dans $W_2$, 3 dans $b_2$. La rétropropagation les obtient toutes en un aller-retour (Bishop, Pattern Recognition and Machine Learning, §5.3).",
    "À l'aller, on garde ${Z = X W_1^\\top + b_1}$, ${H = \\mathrm{ReLU}(Z)}$ et ${S = H W_2^\\top + b_2}$. L'erreur des sorties est ${\\Delta_2 = (\\mathrm{softmax}(S) - Y) / N}$ : c'est $\\delta_k = y_k - t_k$ (éq. 5.54), divisé par $N$ parce que la perte est une moyenne. Chaque dérivée est l'erreur à la sortie d'un poids fois la valeur à son entrée (éq. 5.53) : ${\\nabla W_2 = \\Delta_2^\\top H}$, et $\\nabla b_2$ est la somme des lignes de $\\Delta_2$ (l'entrée d'un biais vaut 1).",
    "Au retour, l'erreur traverse $W_2$ puis la ReLU (éq. 5.56) : ${\\Delta_1 = (\\Delta_2 W_2) \\odot \\mathbb{1}[Z > 0]}$, où $\\odot$ multiplie terme à terme : la dérivée de la ReLU vaut 1 là où $z > 0$, 0 ailleurs. Enfin ${\\nabla W_1 = \\Delta_1^\\top X}$, et $\\nabla b_1$ est la somme des lignes de $\\Delta_1$.",
    "Pourquoi pas des différences finies, $\\frac{L(w + \\varepsilon) - L(w - \\varepsilon)}{2\\varepsilon}$ ? Il en faut deux passes avant par paramètre, soit $O(W^2)$ opérations au lieu de $O(W)$ (§5.3.3). Elles servent en revanche à vérifier une rétropropagation sur quelques poids (éq. 5.69). Le test compare tes gradients aux vrais, refait cette vérification, chronomètre les deux méthodes, puis fait 100 pas de descente de gradient avec tes gradients. L'entraînement complet viendra à l'étape 9.",
  ],
  api: [
    { sig: "softmax(S), propager(W1, b1, W2, b2, X)", doc: "Tes fonctions des étapes 6 et 7, toujours disponibles." },
    { sig: "A.T @ B", doc: "Le produit de la transposée de A par B." },
    { sig: "D.sum(axis=0)", doc: "La somme des lignes de D (un vecteur)." },
    { sig: "(Z > 0)", doc: "Un tableau de booléens ; multiplié par des nombres, True vaut 1 et False vaut 0." },
  ],
  starter: `import numpy as np


def gradients(W1, b1, W2, b2, X, Y):
    """Gradients de l'entropie croisée moyenne par rapport à W1, b1, W2, b2 (de mêmes tailles qu'eux)."""
    Z = X @ W1.T + b1  # l'aller, en gardant ce qui servira au retour
    H = np.maximum(Z, 0)
    S = H @ W2.T + b2
    D2 = np.zeros_like(S)  # À toi : l'erreur des sorties
    gW2, gb2 = np.zeros_like(W2), np.zeros_like(b2)  # À toi
    D1 = np.zeros_like(Z)  # À toi : l'erreur ramenée à la couche cachée
    gW1, gb1 = np.zeros_like(W1), np.zeros_like(b1)  # À toi
    return gW1, gb1, gW2, gb2
`,
  hint: "D2 = (softmax(S) - Y) / len(X) ; gW2 = D2.T @ H ; gb2 = D2.sum(axis=0) ; D1 = (D2 @ W2) * (Z > 0) ; gW1 = D1.T @ X ; gb1 = D1.sum(axis=0).",
  newContext: context(8),
  postlude: etape8,
  judge: judgeWith((r) => {
    if (!r.ok) {
      if (r.pb === "nombre") return { ok: false, stars: 0, message: "gradients doit renvoyer quatre tableaux : les gradients de W1, b1, W2 et b2, dans cet ordre." };
      if (r.pb === "forme")
        return { ok: false, stars: 0, message: `Le gradient de ${r.name} doit avoir la taille de ${r.name}, (${(r.want as number[]).join(", ")}) ; le tien a la taille (${(r.shape as number[]).join(", ")}).` };
      const where = `${r.name}[${(r.idx as number[]).join(", ")}]`;
      const tips = [
        r.mean_off ? " Ta valeur est 40 fois trop grande sur ces 40 exemples : la perte est une moyenne, divise par N." : "",
        r.no_mask ? " Il manque la dérivée de la ReLU : multiplie par (Z > 0)." : "",
      ].join("");
      return {
        ok: false,
        stars: 0,
        message: `Ton gradient de ${r.name} est faux. Par différences centrées, la dérivée de la perte par rapport à ${where} vaut ${fr(num(r, "slope"), 5)} ; ta fonction donne ${fr(num(r, "got"), 5)}.${tips}`,
      };
    }
    const checks = r.checks as [number, number][];
    const gap = Math.max(...checks.map(([a, b]) => Math.abs(a - b)));
    const ms = (s: number) => fr(s * 1000, s < 0.01 ? 3 : 1);
    const pertes = r.pertes as number[];
    return {
      ok: true,
      stars: 3,
      message: `Gradients exacts. Sur 5 poids de W1 tirés au hasard, différences centrées et rétropropagation diffèrent d'au plus ${gap.toExponential(0).replace(".", ",")}. Pour un gradient complet (${r.n_params} paramètres, 40 exemples), ta rétropropagation prend ${ms(num(r, "t_bp"))} ms, les différences centrées ${ms(num(r, "t_fd"))} ms. Avec tes gradients, 100 pas de descente (pas fixe 1) font passer la perte de ${fr(pertes[0], 3)} à ${fr(pertes[pertes.length - 1], 3)}.`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

const adam: Level<Ctx> = {
  ...common,
  timeoutMs: 60000, // about 11 s in Pyodide on a desktop CPU: margin for slower machines
  id: IDS[8],
  nodeId: "optimiseurs",
  title: "Entraîner le réseau",
  story: [
    "Neuvième pièce : l'entraînement. Tu as le réseau (étape 7) et ses gradients (étape 8) ; reste la façon de descendre. Adam (Kingma et Ba, « Adam: A Method for Stochastic Optimization », algorithme 1) garde pour chaque paramètre deux moyennes mobiles, terme à terme : celle des gradients, ${m \\leftarrow \\beta_1 m + (1 - \\beta_1) g}$, et celle de leurs carrés, ${v \\leftarrow \\beta_2 v + (1 - \\beta_2) g^2}$.",
    "Comme $m$ et $v$ partent de 0, leurs premières valeurs sont trop petites ; on les corrige au pas $t$ : ${\\hat m = m / (1 - \\beta_1^t)}$ et ${\\hat v = v / (1 - \\beta_2^t)}$ (§3 de l'article). Le pas est alors ${\\theta \\leftarrow \\theta - \\alpha\\, \\hat m / (\\sqrt{\\hat v} + \\varepsilon)}$, avec les réglages par défaut de l'article, ${\\beta_1 = 0{,}9}$, ${\\beta_2 = 0{,}999}$ et ${\\varepsilon = 10^{-8}}$, et ici ${\\alpha = 0{,}003}$.",
    "Le test entraîne ton réseau par mini-lots : chaque pas calcule le gradient sur 256 exemples seulement, et l'on fait 60 passes sur les données, dans un ordre tiré au hasard à chaque passe (avec une graine fixe, pour retrouver le même cerveau à chaque essai).",
    "Le réseau a 771 paramètres, le cerveau linéaire 63 : il lui faut plus d'exemples. En préparant ce niveau, sur 16 tirages de l'initialisation, un réseau entraîné sur les 30 parties des étapes précédentes n'a battu la softmax linéaire que 7 fois sur les 40 parties de test ; entraîné sur 100 parties, 16 fois sur 16. Le test prend donc 100 parties de l'expert, au lieu des 30 des étapes précédentes, réentraîne la softmax linéaire de l'étape 6 sur ces mêmes parties, et fait jouer les deux cerveaux sur les mêmes 40 parties.",
  ],
  api: [
    { sig: "theta, g, m, v", doc: "Des tableaux de même taille : les paramètres, leur gradient et les deux moyennes mobiles (nulles au départ)." },
    { sig: "t, alpha", doc: "Le numéro du pas (1 au premier appel) et le pas d'apprentissage α." },
    { sig: "np.sqrt(A), A**2, beta1**t", doc: "Racine et carré terme à terme ; la puissance t d'un nombre." },
  ],
  starter: `import numpy as np


def pas_adam(theta, g, m, v, t, alpha, beta1=0.9, beta2=0.999, eps=1e-8):
    """Un pas d'Adam sur le tableau theta, de gradient g, au pas t (1, 2, 3...). Renvoie theta, m, v mis à jour."""
    return theta - alpha * g, m, v  # À toi : ceci n'est qu'une descente de gradient
`,
  hint: "Dans l'ordre : m = beta1 * m + (1 - beta1) * g ; v = beta2 * v + (1 - beta2) * g**2 ; m_hat = m / (1 - beta1**t) ; v_hat = v / (1 - beta2**t) ; puis renvoie theta - alpha * m_hat / (np.sqrt(v_hat) + eps), m, v.",
  newContext: context(9),
  postlude: etape9,
  judge: judgeWith((r) => {
    if (!r.ok) {
      if (r.pb === "nombre") return { ok: false, stars: 0, message: "pas_adam doit renvoyer trois tableaux : theta, m et v mis à jour." };
      if (r.no_corr) return { ok: false, stars: 0, message: "Il manque la correction de biais (§3 de l'article) : divise m par 1 − β₁ᵗ et v par 1 − β₂ᵗ avant de faire le pas." };
      if (r.eps_in) return { ok: false, stars: 0, message: "ε s'ajoute après la racine : il faut √v̂ + ε, et non √(v̂ + ε)." };
      return { ok: false, stars: 0, message: `Au pas t = ${r.t}, ton ${r.which} ne correspond pas à l'algorithme 1 de Kingma et Ba.` };
    }
    const pertes = r.pertes as number[];
    const net = num(r, "survie");
    const lin = num(r, "survie_lin");
    const verdict =
      net > lin
        ? `Ton réseau survit en moyenne ${fr(net, 1)} ticks sur les 40 parties de test, contre ${fr(lin, 1)} pour la softmax linéaire entraînée sur les mêmes parties.`
        : `Ton réseau survit en moyenne ${fr(net, 1)} ticks sur les 40 parties de test : il ne fait pas mieux que la softmax linéaire entraînée sur les mêmes parties (${fr(lin, 1)}).`;
    return {
      ok: true,
      stars: 3,
      message: `Adam est exact. Sur ${num(r, "n").toLocaleString("fr-FR")} exemples, ${num(r, "pas").toLocaleString("fr-FR")} pas d'Adam font passer la perte de ${fr(pertes[0], 3)} à ${fr(pertes[pertes.length - 1], 3)}. ${verdict}`,
    };
  }),
  Scene: ({ trace, step, done }) => <Scene trace={trace} step={step} done={done} />,
};

// The whole program: engine, expert, the player's validated code of every step, then the main program.
// Null while a step is not validated yet.
export function buildProgram(): string | null {
  const codes = IDS.map((id) => getSolved(id));
  if (codes.some((c) => !c)) return null;
  const steps = codes.map((c, i) => `# ---- Étape ${i + 1} : ${projectSteps[i].title} ----\n${c!.trim()}\n`);
  return [
    "# cerveau.py : le robot de la pluie de météores, écrit étape par étape dans LearnMaths.",
    "# Lancer : python cerveau.py (il faut Python 3 et NumPy).",
    "import numpy as np\n",
    PY_ENGINE.trim(),
    "\n# ---- L'expert ----",
    expertPy.trim(),
    "",
    ...steps,
    "# ---- Le programme ----",
    programme.trim(),
    "",
  ].join("\n");
}

function DownloadProgram() {
  const [missing, setMissing] = useState(false);
  const download = () => {
    const text = buildProgram();
    if (!text) {
      setMissing(true);
      return;
    }
    const url = URL.createObjectURL(new Blob([text], { type: "text/x-python;charset=utf-8" }));
    const a = document.createElement("a");
    a.href = url;
    a.download = "cerveau.py";
    a.click();
    window.setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <p className="project-download">
      <button type="button" className="btn btn-primary" onClick={download}>
        Télécharger cerveau.py
      </button>
      {missing && " Il manque le code validé d'une étape : réussis d'abord les dix étapes."}
    </p>
  );
}

const assemblage: Level<Ctx> = {
  ...common,
  timeoutMs: 60000,
  id: IDS[9],
  nodeId: "retropropagation",
  title: "Le cerveau complet",
  story: [
    "Dixième et dernière pièce : l'assemblage. Jusqu'ici, le test reliait tes fonctions entre elles ; c'est maintenant à toi. entrainer(X, Y, rng) écrit la boucle de l'étape 9 : ton initialisation, des mini-lots de 256 exemples, tes gradients, ton pas d'Adam avec ${\\alpha = 0{,}003}$, et 60 passes. cerveau(...) enchaîne ce que le robot fait à chaque tick : percevoir, normaliser avec $\\mu$ et $M$, propager, puis jouer le coup de meilleur score.",
    "Le test entraîne ton réseau sur les 100 parties de l'expert. Il réussit si la perte d'entraînement passe sous 0,11196 : c'est, à $10^{-5}$ près, la plus petite perte qu'un cerveau linéaire puisse atteindre sur ces données (la perte d'une softmax linéaire est convexe en ses poids, et la méthode de Newton y converge). Ton réseau fait alors mieux que n'importe quel cerveau linéaire. Le test vérifie ensuite que cerveau joue le coup de meilleur score du réseau à chaque position de deux parties.",
    "Une fois l'étape réussie, tu peux télécharger cerveau.py : tout ton code des dix étapes, avec le moteur du jeu et l'expert, en un seul programme. Avec Python 3 et NumPy, python cerveau.py refait l'apprentissage et affiche la survie de ton robot sur 40 parties.",
  ],
  api: [
    { sig: "initialiser, gradients, pas_adam", doc: "Tes fonctions des étapes 7, 8 et 9." },
    { sig: "percevoir(partie), propager(W1, b1, W2, b2, X)", doc: "Tes fonctions des étapes 1 et 7 ; propager attend une vision par ligne : v[None] fait d'un vecteur une matrice à une ligne." },
    { sig: "rng.permutation(N), X[lot]", doc: "Les entiers de 0 à N − 1 dans un ordre aléatoire ; les lignes de X dont les indices sont dans lot." },
  ],
  starter: `import numpy as np


def entrainer(X, Y, rng):
    """Entraîne le réseau 20-32-3 sur X (visions normalisées) et Y (coups en one-hot). Renvoie W1, b1, W2, b2."""
    W1, b1 = initialiser(X.shape[1], 32, rng)
    W2, b2 = initialiser(32, 3, rng)
    params = [W1, b1, W2, b2]
    m = [np.zeros_like(p) for p in params]
    v = [np.zeros_like(p) for p in params]
    t = 0
    for passe in range(60):
        ordre = rng.permutation(len(X))
        for i in range(0, len(X), 256):
            lot = ordre[i:i + 256]
            pass  # À toi : les gradients sur ce lot, puis un pas d'Adam (alpha = 0.003) sur chacun des 4 tableaux
    return params


def cerveau(W1, b1, W2, b2, mu, M, partie):
    """Le coup du robot, -1, 0 ou +1 : vision, normalisation, réseau, puis le coup de meilleur score."""
    return 0  # À toi
`,
  hint: "Dans la boucle : grads = gradients(*params, X[lot], Y[lot]), t += 1, puis pour k de 0 à 3 : params[k], m[k], v[k] = pas_adam(params[k], grads[k], m[k], v[k], t, 0.003). Pour cerveau : v = (percevoir(partie) - mu) @ M, puis renvoie int(np.argmax(propager(W1, b1, W2, b2, v[None])[0])) - 1.",
  newContext: context(10),
  postlude: etape10,
  judge: judgeWith((r) => {
    if (!r.ok) {
      if (r.pb === "forme") {
        const want = (r.want as number[][]).map((s) => `(${s.join(", ")})`).join(", ");
        const got = r.got ? (r.got as number[][]).map((s) => `(${s.join(", ")})`).join(", ") : "autre chose que quatre tableaux";
        return { ok: false, stars: 0, message: `entrainer doit renvoyer W1, b1, W2, b2 de tailles ${want} ; ta fonction renvoie ${got}.` };
      }
      if (r.pb === "perte")
        return {
          ok: false,
          stars: 0,
          message: `La perte d'entraînement de ton réseau vaut ${r.perte === null ? "autre chose qu'un nombre" : fr(num(r, "perte"), 4)} ; il faut passer sous 0,11196, la meilleure perte d'un cerveau linéaire sur ces données. Fais-tu bien un pas d'Adam sur les 4 tableaux, à chaque lot, pendant les 60 passes ?`,
        };
      return {
        ok: false,
        stars: 0,
        message: `Ton réseau apprend bien (perte ${fr(num(r, "perte"), 4)}), mais au tick ${r.tick} d'une partie de l'expert, il donne son meilleur score au coup ${r.ref}, alors que cerveau renvoie ${r.got}.`,
      };
    }
    return {
      ok: true,
      stars: 3,
      message: `Ton réseau atteint une perte d'entraînement de ${fr(num(r, "perte"), 4)}, sous les 0,11196 du meilleur cerveau linéaire, et ton robot survit en moyenne ${fr(num(r, "survie"), 1)} ticks sur les 40 parties de test. Le cerveau est complet : tu peux télécharger ton programme.`,
    };
  }),
  Scene: ({ trace, step, done }) => (
    <>
      <Scene trace={trace} step={step} done={done} />
      {done && resultOf(trace)?.ok === true && <DownloadProgram />}
    </>
  ),
};

export const projectSteps = [vision, decision, apprendre, gradient, conditionnement, probas, couche, retro, adam, assemblage] as Level<unknown>[];
