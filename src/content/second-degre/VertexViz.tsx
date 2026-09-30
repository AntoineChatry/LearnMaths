import { useState } from "react";
import { Coordinates, Line, Mafs, Plot, Point, Theme, useMovablePoint } from "mafs";
import { Tex } from "../../components/Tex";
import { texNum } from "../../lib/tex";

const snap = (v: number) => Math.round(v * 2) / 2;

// Sum of terms with decimal coefficients: [[2, "x^2"], [-3, "x"], [0.5, ""]] → "2x^2 - 3x + 0{,}5".
function sumTex(terms: [number, string][]): string {
  let out = "";
  for (const [c, v] of terms) {
    if (Math.abs(c) < 1e-9) continue;
    const abs = Math.abs(c);
    const coef = v && Math.abs(abs - 1) < 1e-9 ? "" : texNum(abs);
    const sign = c < 0 ? "-" : out ? "+" : "";
    out += `${out ? " " : ""}${sign}${out ? " " : ""}${coef}${v}`;
  }
  return out || "0";
}

function canonicalTex(a: number, h: number, k: number): string {
  const lead = a === 1 ? "" : a === -1 ? "-" : texNum(a);
  const square = h === 0 ? "x^2" : `(x ${h > 0 ? "-" : "+"} ${texNum(Math.abs(h))})^2`;
  const tail = k === 0 ? "" : ` ${k > 0 ? "+" : "-"} ${texNum(Math.abs(k))}`;
  return `${lead}${square}${tail}`;
}

type Props = { showDelta?: boolean };

export function VertexViz({ showDelta = false }: Props) {
  const [a, setA] = useState(1);
  const vertex = useMovablePoint([1, -2], {
    constrain: ([x, y]) => [Math.max(-4, Math.min(4, snap(x))), Math.max(-4, Math.min(4, snap(y)))],
  });
  const h = vertex.x;
  const k = vertex.y;

  const b = -2 * a * h;
  const c = a * h * h + k;
  const delta = -4 * a * k;
  const roots = delta > 1e-9 ? [h - Math.sqrt(-k / a), h + Math.sqrt(-k / a)] : Math.abs(delta) < 1e-9 ? [h] : [];

  const deltaClass = delta > 1e-9 ? "viz-verdict-ok" : Math.abs(delta) < 1e-9 ? "" : "viz-verdict-ko";
  const deltaText =
    roots.length === 2 ? "deux racines réelles" : roots.length === 1 ? "une racine double" : "aucune racine réelle";

  return (
    <figure className="viz" aria-label="Parabole dont on déplace le sommet">
      <Mafs height={340} viewBox={{ x: [-5, 5], y: [-5, 5] }} preserveAspectRatio={false} pan={false}>
        <Coordinates.Cartesian />
        <Plot.OfX y={(x) => a * (x - h) ** 2 + k} color={Theme.blue} weight={3} />
        <Line.Segment point1={[h, -50]} point2={[h, 50]} style="dashed" color={Theme.foreground} opacity={0.35} />
        {showDelta && roots.map((r) => <Point key={r} x={r} y={0} color={Theme.green} />)}
        {vertex.element}
      </Mafs>
      <div className="viz-controls">
        <label>
          a
          <input
            type="range"
            min={-3}
            max={3}
            step={0.25}
            value={a}
            onChange={(e) => {
              const v = Number(e.target.value);
              setA(v === 0 ? 0.25 : v);
            }}
          />
          <span className="viz-readout">{texNumPlain(a)}</span>
        </label>
        <span>
          Sommet <Tex>{`(\\alpha, \\beta) = (${texNum(h)},\\ ${texNum(k)})`}</Tex>
        </span>
      </div>
      <div className="viz-formulas">
        <Tex>{`f(x) = ${canonicalTex(a, h, k)}`}</Tex>
        <Tex>{`\\phantom{f(x)} = ${sumTex([[a, "x^2"], [b, "x"], [c, ""]])}`}</Tex>
        {showDelta && (
          <p className="viz-delta">
            <Tex>{`\\Delta = b^2 - 4ac = ${texNum(delta)}`}</Tex>
            <span className={deltaClass}> : {deltaText}</span>
            {roots.length > 0 && (
              <>
                {" "}
                <Tex>{roots.map((r, i) => `x_{${roots.length === 1 ? 0 : i + 1}} \\approx ${texNum(r)}`).join(",\\ ")}</Tex>
              </>
            )}
          </p>
        )}
      </div>
    </figure>
  );
}

function texNumPlain(n: number): string {
  return String(n).replace(".", ",");
}
