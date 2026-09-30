import { modules, type Module } from "../content/curriculum";
import { alongside, jobNotes, roadmap } from "../content/roadmap";
import { getProgress } from "../lib/progress";

const masteredCount = (m: Module) => m.nodes.filter((n) => getProgress(n.id)?.mastered).length;
const isDone = (m: Module) => masteredCount(m) === m.nodes.length;

function Roadmap() {
  const masteredIds = new Set(modules.flatMap((m) => m.nodes).filter((n) => getProgress(n.id)?.mastered).map((n) => n.id));
  // The current step is the first one not fully mastered.
  const currentIndex = roadmap.findIndex((step) => {
    const m = modules.find((mod) => mod.id === step.id);
    return !m || !isDone(m);
  });
  const current = modules.find((m) => m.id === roadmap[currentIndex]?.id);
  const ready = current?.nodes.filter((n) => n.lesson).length ?? 0;

  return (
    <details className="roadmap">
      <summary>Parcours vers la recherche en IA</summary>
      <p className="roadmap-intro">
        {current && (
          <>
            Étape actuelle : {current.title}, {masteredCount(current)} chapitre{masteredCount(current) > 1 ? "s" : ""} acquis
            sur {current.nodes.length}
            {ready < current.nodes.length ? ` (${ready} rédigés)` : ""}.{" "}
          </>
        )}
        Les étapes qui ne sont pas encore dans l'app ont des ressources gratuites et vérifiées.
      </p>
      <ol className="roadmap-steps">
        {roadmap.map((step, i) => {
          const m = modules.find((mod) => mod.id === step.id);
          const done = m ? isDone(m) : false;
          const state = done ? "is-done" : i === currentIndex ? "is-current" : "";
          const status = !m ? "hors de l'app pour l'instant" : done ? "acquis" : i === currentIndex ? "en cours" : "dans l'app";
          return (
            <li key={step.id} className={state}>
              <p className="roadmap-title">
                {step.title}
                <span className="roadmap-status">{status}</span>
              </p>
              <p>{step.what}</p>
              <p className="roadmap-why">{step.why}</p>
              {step.resources.map((r) => (
                <p key={r.url} className="roadmap-cue">
                  <a href={r.url} target="_blank" rel="noreferrer">
                    {r.label}
                  </a>
                </p>
              ))}
            </li>
          );
        })}
      </ol>

      <h3>{alongside.title}</h3>
      <ul>
        {alongside.items.map((item) => (
          <li key={item.text} className={masteredIds.has(item.afterNode) ? "" : "roadmap-why"}>
            {item.url ? (
              <a href={item.url} target="_blank" rel="noreferrer">
                {item.text}
              </a>
            ) : (
              item.text
            )}
            {masteredIds.has(item.afterNode) && <strong> C'est le moment.</strong>}
          </li>
        ))}
      </ul>

      <h3>Ce que demandent les grands labos</h3>
      <p>{jobNotes.intro}</p>
      <ul>
        {jobNotes.offers.map((o) => (
          <li key={o.url}>
            <a href={o.url} target="_blank" rel="noreferrer">
              {o.lab}, {o.role}
            </a>{" "}
            : {o.text}
          </li>
        ))}
      </ul>
    </details>
  );
}

function Contents({ module }: { module: Module }) {
  return (
    <section className="module">
      <h2 className="module-title">{module.title}</h2>
      <ol className="contents">
        {module.nodes.map((node, i) => {
          const ready = Boolean(node.lesson);
          const mastered = getProgress(node.id)?.mastered ?? false;
          const inner = (
            <>
              <span className="contents-num">{i + 1}</span>
              <span className="contents-body">
                <span className={`contents-title${mastered ? " is-mastered" : ""}`}>{node.title}</span>
                <span className="contents-bridge">{node.bridge}</span>
              </span>
              <span className="contents-leader" aria-hidden="true" />
              <span className="contents-status">{mastered ? "acquis" : ready ? "ouvrir" : "à rédiger"}</span>
            </>
          );
          return (
            <li key={node.id} className={ready ? "is-ready" : "is-draft"}>
              {ready ? <a href={`#/${node.id}`}>{inner}</a> : <div>{inner}</div>}
            </li>
          );
        })}
      </ol>
    </section>
  );
}

export function Home() {
  return (
    <main className="sheet">
      <header className="sheet-head">
        <p className="subject">Mathématiques pour l'IA</p>
        <h1>Sommaire</h1>
        <p className="home-links">
          <a href="#/revisions">Révisions</a>
          <a href="#/atelier">Atelier</a>
        </p>
      </header>
      {modules.map((m) => (
        <Contents key={m.id} module={m} />
      ))}
      <Roadmap />
    </main>
  );
}
