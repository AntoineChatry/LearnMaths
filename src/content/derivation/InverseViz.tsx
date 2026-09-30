import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

type FnName = "sin" | "tan";

const HALF_PI = Math.PI / 2;

const FNS = {
  sin: {
    f: Math.sin,
    df: Math.cos,
    inv: "\\arcsin",
    // Branch kept: [−π/2, π/2]. The derivative of the inverse is read as 1/√(1 − y²).
    lo: -HALF_PI,
    hi: HALF_PI,
    invDeriv: (y: number) => 1 / Math.sqrt(1 - y * y),
    invDerivTex: "\\frac{1}{\\sqrt{1-y^2}}",
    // All visible t such that sin t = y.
    preimages: (y: number) => {
      const out: number[] = [];
      for (let k = -2; k <= 2; k++) out.push(Math.asin(y) + 2 * k * Math.PI, Math.PI - Math.asin(y) + 2 * k * Math.PI);
      return out;
    },
  },
  tan: {
    f: Math.tan,
    df: (x: number) => 1 / Math.cos(x) ** 2,
    inv: "\\arctan",
    // ]−π/2, π/2[: stop before the asymptotes to stay within the window.
    lo: -1.35,
    hi: 1.35,
    invDeriv: (y: number) => 1 / (1 + y * y),
    invDerivTex: "\\frac{1}{1+y^2}",
    preimages: (y: number) => [-2, -1, 0, 1, 2].map((k) => Math.atan(y) + k * Math.PI),
  },
};

const VIEW = 4.5;
const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

type Props = { showTangents?: boolean };

export function InverseViz({ showTangents = false }: Props) {
  const [name, setName] = useState<FnName>("sin");
  const [restrict, setRestrict] = useState(true);
  const fn = FNS[name];
  const keep = showTangents || restrict;

  const p = useMovablePoint([0.6, Math.sin(0.6)], {
    constrain: ([x]) => {
      const a = clamp(x, fn.lo, fn.hi);
      return [a, fn.f(a)];
    },
  });
  const a = clamp(p.x, fn.lo, fn.hi);
  const b = fn.f(a);
  const m = fn.df(a);

  const choose = (next: FnName) => {
    setName(next);
    const a2 = clamp(a, FNS[next].lo, FNS[next].hi);
    p.setPoint([a2, FNS[next].f(a2)]);
  };

  // Full branches of the function (tan is drawn branch by branch so the asymptotes aren't connected).
  const branches: [number, number][] =
    name === "sin"
      ? [[-2 * Math.PI, 2 * Math.PI]]
      : [-1, 0, 1].map((k) => [k * Math.PI - HALF_PI + 0.02, k * Math.PI + HALF_PI - 0.02]);
  const keptDomain: [number, number] = name === "sin" ? [-HALF_PI, HALF_PI] : [-HALF_PI + 0.02, HALF_PI - 0.02];
  // At y = ±1, the two families of solutions of sin t = y coincide: deduplicate.
  const hits = keep
    ? [a]
    : fn
        .preimages(b)
        .filter((t) => Math.abs(t) <= VIEW)
        .sort((u, v) => u - v)
        .filter((t, i, all) => i === 0 || t - all[i - 1] > 1e-6);
  const flat = Math.abs(m) < 1e-9;

  return (
    <figure className="viz" aria-label="Une fonction, sa réciproque et leur symétrie par rapport à la droite y = x">
      <Mafs height={380} viewBox={{ x: [-VIEW, VIEW], y: [-VIEW, VIEW] }} pan={false}>
        <Coordinates.Cartesian subdivisions={2} />
        <Line.ThroughPoints point1={[0, 0]} point2={[1, 1]} style="dashed" color={Theme.foreground} opacity={0.4} />

        {branches.map((d) => (
          <Plot.OfX key={`f${d[0]}`} y={fn.f} domain={d} color={Theme.blue} opacity={keep ? 0.25 : 0.9} weight={2} />
        ))}
        {!keep &&
          branches.map((d) => (
            <Plot.Parametric key={`g${d[0]}`} xy={(t) => [fn.f(t), t]} domain={d} color={Theme.red} weight={2} />
          ))}
        {keep && (
          <>
            <Plot.OfX y={fn.f} domain={keptDomain} color={Theme.blue} weight={4} />
            <Plot.Parametric xy={(t) => [fn.f(t), t]} domain={keptDomain} color={Theme.red} weight={4} />
          </>
        )}

        {!keep && (
          <Line.Segment point1={[b, -VIEW]} point2={[b, VIEW]} style="dashed" color={Theme.red} opacity={0.6} />
        )}
        {hits.map((t) => (
          <Point key={t} x={b} y={t} color={Theme.red} />
        ))}

        {showTangents && (
          <>
            <Line.ThroughPoints point1={[a, b]} point2={[a + 1, b + m]} color={Theme.blue} opacity={0.7} />
            {/* The tangent of the inverse is the image of f's tangent under the symmetry(x, y) ↦ (y, x). */}
            <Line.ThroughPoints point1={[b, a]} point2={[b + m, a + 1]} color={Theme.red} opacity={0.7} />
            <Line.Segment point1={[a, b]} point2={[b, a]} style="dashed" color={Theme.foreground} opacity={0.35} />
          </>
        )}
        {p.element}
      </Mafs>
      <div className="viz-controls">
        <button type="button" className={`btn ${name === "sin" ? "" : "btn-quiet"}`} onClick={() => choose("sin")}>
          sin
        </button>
        <button type="button" className={`btn ${name === "tan" ? "" : "btn-quiet"}`} onClick={() => choose("tan")}>
          tan
        </button>
        {!showTangents && (
          <label>
            <input type="checkbox" checked={restrict} onChange={(e) => setRestrict(e.target.checked)} />
            Restreindre à {name === "sin" ? "[−π/2, π/2]" : "]−π/2, π/2["}
          </label>
        )}
      </div>
      <div className="viz-formulas">
        {!showTangents &&
          (keep ? (
            <p>
              <Tex>{`${fn.inv}(${texNum(b, 3)}) = ${texNum(a, 3)}`}</Tex>
              <span className="viz-verdict-ok"> : un seul antécédent, la réciproque existe.</span>
            </p>
          ) : (
            <p>
              <Tex>{`\\${name}\\,t = ${texNum(b, 3)}`}</Tex>
              <span className="viz-verdict-ko">
                {" "}
                : {hits.length} solutions rien que dans la fenêtre. La courbe rouge n'est pas le graphe d'une fonction.
              </span>
            </p>
          ))}
        {showTangents && (
          <>
            <Tex>{`a = ${texNum(a, 3)}, \\quad y = \\${name}(a) = ${texNum(b, 3)}, \\quad \\${name}'(a) = ${texNum(m, 3)}`}</Tex>
            <Tex>
              {flat
                ? `(${fn.inv})'(${texNum(b, 3)}) = \\frac{1}{0} : \\text{tangente verticale}`
                : `(${fn.inv})'(${texNum(b, 3)}) = \\frac{1}{${texNum(m, 3)}} = ${texNum(1 / m, 3)} \\qquad ${fn.invDerivTex} = ${texNum(fn.invDeriv(b), 3)}`}
            </Tex>
          </>
        )}
      </div>
    </figure>
  );
}
