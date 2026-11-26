import React, { useState, useEffect } from "react";
import { useApp, T, Box, Icon } from "../ui.jsx";
import { COURS, ALL_LESSONS } from "../content/cours.js";
import { usePersist } from "../store.js";
import MapView from "../MapView.jsx";
import { Diagram, CroquisBuilder } from "../diagrams.jsx";

export function Visual({ v }) {
  if (!v) return null;
  if (v.map) { const p = v.props || {}; return <MapView id={v.map} mode={p.mode || "explore"} names={p.names} only={p.only} theme={p.theme} height="62vh" />; }
  if (v.diagram) return <Diagram id={v.diagram} />;
  if (v.builder) return <CroquisBuilder />;
  return null;
}

function Check({ c, id }) {
  const [ans, setAns] = useState(null);
  useEffect(() => setAns(null), [id]);
  return <div className="card">
    <span className="tag acc" style={{ alignSelf: "flex-start" }}>Vérifie ce que tu as retenu</span>
    <T as="h3">{c.q}</T>
    <div className="opts" role="list">
      {c.o.map((o, i) => <button key={i} className={"opt" + (ans != null ? (i === c.a ? " good" : i === ans ? " bad" : "") : "")} disabled={ans != null} onClick={() => setAns(i)}><span className="k">{"ABCD"[i]}</span><span>{o}</span></button>)}
    </div>
    {ans != null && <div className={"feedback " + (ans === c.a ? "ok" : "ko")} role="status"><b>{ans === c.a ? "Bravo ! " : "Pas tout à fait. "}</b><T as="span">{c.e}</T></div>}
  </div>;
}

export default function Course() {
  const { route, go, setNextPage } = useApp();
  const [seen, setSeen] = usePersist("seen", {});
  const lid = route.sub[0];
  const lesson = ALL_LESSONS.find(l => l.id === lid);
  const pi = Math.max(0, Math.min(+(route.sub[1] || 0), lesson ? lesson.pages.length - 1 : 0));

  useEffect(() => {
    if (!lesson) { setNextPage(null); return; }
    const idx = ALL_LESSONS.indexOf(lesson);
    if (pi === lesson.pages.length - 1 && !seen[lesson.id]) setSeen(s => ({ ...s, [lesson.id]: Date.now() }));
    setNextPage(pi < lesson.pages.length - 1 ? () => go("cours", lesson.id, String(pi + 1)) : idx < ALL_LESSONS.length - 1 ? () => go("cours", ALL_LESSONS[idx + 1].id) : null);
    return () => setNextPage(null);
  }, [lid, pi]);

  if (!lesson) return <>
    <div className="card"><h1>Le cours</h1><T>Chaque leçon est découpée en pages courtes. Le texte et la carte sont côte à côte : regarde la carte pendant que tu lis. Clique sur un mot souligné pour voir sa définition.</T></div>
    {COURS.map(p => <section key={p.id} className="stack">
      <div><h2>{p.id === "A" ? "Partie A" : "Partie B"} · {p.titre}</h2><p className="muted small">{p.sous}</p></div>
      <div className="toc">{p.lecons.map((l, i) => <button key={l.id} className={seen[l.id] ? "seen" : ""} onClick={() => go("cours", l.id)}><b>{(p.id === "A" ? "A" : "B") + (i + 1) + ". " + l.titre}</b><span>{l.resume}</span><span>{l.pages.length} page{l.pages.length > 1 ? "s" : ""}{seen[l.id] ? " · lue ✓" : ""}</span></button>)}</div>
    </section>)}
  </>;

  const page = lesson.pages[pi];
  const idx = ALL_LESSONS.indexOf(lesson);
  const prev = pi > 0 ? () => go("cours", lesson.id, String(pi - 1)) : idx > 0 ? () => go("cours", ALL_LESSONS[idx - 1].id, String(ALL_LESSONS[idx - 1].pages.length - 1)) : null;
  const next = pi < lesson.pages.length - 1 ? () => go("cours", lesson.id, String(pi + 1)) : idx < ALL_LESSONS.length - 1 ? () => go("cours", ALL_LESSONS[idx + 1].id) : null;
  const last = pi === lesson.pages.length - 1;
  const num = (lesson.part) + (ALL_LESSONS.filter(l => l.part === lesson.part).indexOf(lesson) + 1);

  return <>
    <div className="row between noprint">
      <button className="btn small ghost" onClick={() => go("cours")}><Icon n="left" />Sommaire du cours</button>
      <span className="small muted">Page {pi + 1} / {lesson.pages.length}</span>
    </div>
    <div className="steps" aria-hidden="true">{lesson.pages.map((_, i) => <span key={i} className={i <= pi ? "done" : ""} />)}</div>
    <div>
      <p className="small muted">{num} · {lesson.titre}</p>
      <h1>{page.titre}</h1>
    </div>
    <div className={"lesson" + (page.visuel ? "" : " textonly")}>
      <div className="text">
        {page.blocs.map((b, i) => <T key={i}>{b}</T>)}
        {page.table && <div className="tbl-wrap"><table className="tbl"><thead><tr>{page.table.head.map((h, i) => <th key={i}>{h}</th>)}</tr></thead>
          <tbody>{page.table.rows.map((r, i) => <tr key={i}>{r.map((c, j) => <td key={j}><T as="span">{c}</T></td>)}</tr>)}</tbody></table></div>}
        {page.retenir && <Box kind="retenir"><ul className="clean">{page.retenir.map((r, i) => <T as="li" key={i}>{r}</T>)}</ul></Box>}
        {page.note && <p className="small muted">{page.note}</p>}
      </div>
      {page.visuel && <div className="visual"><Visual v={page.visuel} /></div>}
    </div>
    {last && lesson.check && <Check c={lesson.check} id={lesson.id} />}
    <div className="row between noprint">
      <button className="btn" onClick={prev} disabled={!prev}><Icon n="left" />Précédent</button>
      <button className="btn primary" onClick={next || (() => go("memo"))}>{next ? (last ? "Leçon suivante" : "Page suivante") : "Réviser avec les cartes mémoire"}<Icon n="right" /></button>
    </div>
  </>;
}
