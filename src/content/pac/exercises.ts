import { pick, randInt } from "../../lib/random";
import { texNum } from "../../lib/tex";
import type { Exercise, ExerciseGenerator } from "../types";

const DELTAS: [string, number][] = [
  ["0{,}1", 10],
  ["0{,}05", 20],
  ["0{,}01", 100],
];

// Uniform gap sqrt((ln|H| + ln(2/delta)) / (2m)) = sqrt(ln(2|H|/delta) / (2m)), exact.
function ecart(): Exercise {
  const H = pick([10, 50, 100, 1000, 5000]);
  const [deltaTex, inv] = pick(DELTAS);
  const m = pick([100, 200, 500, 1000, 5000]);
  const arg = 2 * H * inv;
  const ans = `\\sqrt{\\frac{\\ln ${arg}}{${2 * m}}}`;
  return {
    intro: `On choisit un modèle parmi ${H} à l'aide de ${m} exemples. Donne l'écart $\\varepsilon$ que garantit la borne des classes finies : avec probabilité au moins $1 - \\delta$, $|R(h) - \\hat R_S(h)| \\le \\varepsilon$ pour tous les modèles. Forme exacte, avec un seul logarithme.`,
    promptTex: `|H| = ${H} \\qquad m = ${m} \\qquad \\delta = ${deltaTex} \\qquad \\varepsilon = \\ ?`,
    answerTex: ans,
    hint: "$\\varepsilon = \\sqrt{\\frac{\\ln |H| + \\ln(2/\\delta)}{2m}}$, et $\\ln a + \\ln b = \\ln(ab)$.",
    solution: [`\\varepsilon = \\sqrt{\\frac{\\ln ${H} + \\ln(2 / ${deltaTex})}{2 \\times ${m}}} = ${ans}`],
  };
}

// Realizable case: bound (ln|H| + ln(1/delta)) / m, or the sample size for a target eps.
function realisable(): Exercise {
  const H = pick([100, 1000, 1024, 10001, 50]);
  const [deltaTex, inv] = pick(DELTAS);
  const arg = H * inv;
  if (Math.random() < 0.5) {
    const m = pick([50, 100, 200, 500, 1000]);
    const ans = `\\frac{\\ln ${arg}}{${m}}`;
    return {
      intro: `La vraie règle est l'un des ${H} modèles de la classe, et l'algorithme renvoie un modèle sans erreur sur ${m} exemples. Quel risque garantit la borne du cas réalisable, avec probabilité au moins $1 - \\delta$ ? Forme exacte, avec un seul logarithme.`,
      promptTex: `|H| = ${H} \\qquad m = ${m} \\qquad \\delta = ${deltaTex} \\qquad R(\\hat h) \\le \\ ?`,
      answerTex: ans,
      hint: "Cas réalisable : $R(\\hat h) \\le \\frac{\\ln |H| + \\ln(1/\\delta)}{m}$.",
      solution: [`R(\\hat h) \\le \\frac{\\ln ${H} + \\ln(1 / ${deltaTex})}{${m}} = ${ans}`],
    };
  }
  const [epsTex, invEps] = pick([
    ["0{,}1", 10],
    ["0{,}05", 20],
    ["0{,}01", 100],
  ] as [string, number][]);
  const ans = `${invEps}\\ln ${arg}`;
  return {
    intro: `La vraie règle est l'un des ${H} modèles de la classe, et l'algorithme renvoie un modèle sans erreur d'entraînement. Combien d'exemples suffisent, d'après la borne du cas réalisable, pour un risque au plus $\\varepsilon$ avec probabilité au moins $1 - \\delta$ ? Valeur exacte, avec un logarithme, avant arrondi.`,
    promptTex: `|H| = ${H} \\qquad \\varepsilon = ${epsTex} \\qquad \\delta = ${deltaTex} \\qquad m \\ge \\ ?`,
    answerTex: ans,
    hint: "Il faut $\\frac{\\ln |H| + \\ln(1/\\delta)}{m} \\le \\varepsilon$.",
    solution: [`m \\ge \\frac{\\ln ${H} + \\ln(1 / ${deltaTex})}{${epsTex}} = ${ans}`],
  };
}

// ERM guarantee: R(h_hat) <= R_emp(h_hat) + eps, or <= R(h*) + 2 eps (hundredths, written as decimals).
function erm(): Exercise {
  const eps = randInt(1, 9);
  const dec = (n: number) => texNum(n / 100, 2);
  if (Math.random() < 0.5) {
    const star = randInt(0, 30);
    const ans = dec(star + 2 * eps);
    return {
      intro: `Tous les écarts $|R(h) - \\hat R_S(h)|$ de la classe sont au plus $\\varepsilon$, et le meilleur modèle $h^*$ de la classe a un risque $R(h^*)$. Quelle borne sur le risque du modèle $\\hat h$ renvoyé par la minimisation du risque empirique ?`,
      promptTex: `\\varepsilon = ${dec(eps)} \\qquad R(h^*) = ${dec(star)} \\qquad R(\\hat h) \\le \\ ?`,
      answerTex: ans,
      hint: "$R(\\hat h) \\le \\hat R_S(\\hat h) + \\varepsilon \\le \\hat R_S(h^*) + \\varepsilon \\le R(h^*) + 2\\varepsilon$.",
      solution: [`R(\\hat h) \\le R(h^*) + 2\\varepsilon = ${dec(star)} + 2 \\times ${dec(eps)} = ${ans}`],
    };
  }
  const emp = randInt(0, 30);
  const ans = dec(emp + eps);
  return {
    intro: `Tous les écarts $|R(h) - \\hat R_S(h)|$ de la classe sont au plus $\\varepsilon$. Le modèle $\\hat h$ renvoyé par l'entraînement a l'erreur d'entraînement ci-dessous. Quelle borne sur son vrai risque ?`,
    promptTex: `\\varepsilon = ${dec(eps)} \\qquad \\hat R_S(\\hat h) = ${dec(emp)} \\qquad R(\\hat h) \\le \\ ?`,
    answerTex: ans,
    hint: "La borne vaut pour tous les modèles de la classe, donc pour $\\hat h$ : $R(\\hat h) \\le \\hat R_S(\\hat h) + \\varepsilon$.",
    solution: [`R(\\hat h) \\le ${dec(emp)} + ${dec(eps)} = ${ans}`],
  };
}

// ln|H| <= bits * W * ln 2 for a network of W parameters stored on b bits.
function bits(): Exercise {
  const [fmt, b] = pick([
    ["float32", 32],
    ["float16", 16],
    ["int8", 8],
    ["4 bits", 4],
  ] as [string, number][]);
  const W = pick([10, 100, 1000, 5000, 20000]) * randInt(1, 9);
  const ans = `${b * W}\\ln 2`;
  return {
    intro: `Un réseau a ${W.toLocaleString("fr-FR")} paramètres, chacun stocké en ${fmt} (${b} bits). En comptant tous les réseaux que ces bits peuvent écrire, donne la majoration de $\\ln |H|$ qui entre dans la borne des classes finies, sous forme exacte.`,
    promptTex: `W = ${W} \\qquad ${b} \\text{ bits par paramètre} \\qquad \\ln |H| \\le \\ ?`,
    answerTex: ans,
    hint: `${b} bits par paramètre font $${b}W$ bits en tout, donc au plus $2^{${b}W}$ réseaux distincts.`,
    solution: [`|H| \\le 2^{${b} \\times ${W}} = 2^{${b * W}} \\qquad \\ln |H| \\le ${b * W}\\ln 2`],
  };
}

export const pacGenerators: ExerciseGenerator[] = [
  { id: "pac-ecart", make: ecart },
  { id: "pac-realisable", make: realisable },
  { id: "pac-erm", make: erm },
  { id: "pac-bits", make: bits },
];
