import React, { useState, useEffect } from "react";
import { useApp, T, Box, Icon } from "../ui.jsx";
import { METHODE } from "../content/methode.js";
import { LIVRE_COURS } from "../content/livrecours.js";
import { FICHE, MOUVEMENTS, FRAGMENTS, FONCTIONS, TRADUCTIONS, RESUMES_LIVRE, PIEGES_LIVRE, SCHEMA_LIVRE } from "../content/livre.js";
import { usePersist } from "../store.js";
import { Diagram } from "../diagrams.jsx";
import { SchemaView, TextRoles, ArgCard, getSchema, WordCount } from "../components.jsx";

export const COURSES = {
  methode: { t: "La méthode", lessons: METHODE, intro: "Les fiches des pages 78 (schéma) et 86 (résumé), découpées en pages courtes. Le texte et le visuel sont côte à côte : lis le texte en regardant le visuel. Clique sur un mot souligné pour voir sa définition." },
  livre: { t: "Comprendre le livre", lessons: LIVRE_COURS, intro: "Le contexte, la structure, les mots-clés, ce que révèlent les traductions, puis l’argumentation complète du livre et deux résumés modèles." },
};

function Fiche() {
  return <div className="tbl-wrap"><table className="tbl"><tbody>{FICHE.map(([k, v]) => <tr key={k}><th>{k}</th><td><T as="span">{v}</T></td></tr>)}</tbody></table></div>;
}
function Fragments({ ms }) {
  return <div className="stack" style={{ gap: ".5rem" }}>
    {MOUVEMENTS.filter(m => ms.includes(m.id)).map(m => <details key={m.id} className="frag-m" open={ms.length === 1}>
      <summary><span className="tag acc">{m.id}</span> <b>{m.t}</b></summary>
      <T className="small muted">{m.d}</T>
      <div className="tbl-wrap"><table className="tbl small"><thead><tr><th>Fragment</th><th>Fonction</th><th>Argument</th><th>Contenu</th></tr></thead>
        <tbody>{FRAGMENTS.filter(f => f.m === m.id).map(f => <tr key={f.t}><td><b>{f.t}</b><br /><span className="muted">{f.nl} · {f.en}</span></td><td><span className={"fn fn-" + f.f}>{FONCTIONS[f.f][0]}</span></td><td>{f.a.join(", ") || "—"}</td><td><T as="span">{f.d}</T></td></tr>)}</tbody></table></div>
    </details>)}
    <p className="small muted">Titres traduits des éditions néerlandaise et anglaise : ils peuvent différer un peu dans l’édition française.</p>
  </div>;
}
function Traductions({ idx }) {
  return <div className="stack" style={{ gap: ".5rem" }}>{idx.map(i => { const t = TRADUCTIONS[i]; return <details key={i} className="frag-m" open={i === idx[0]}>
    <summary><b>{t.t}</b></summary><T>{t.d}</T><Box kind="retenir" label="Ce que j’en retiens"><T>{t.lecon}</T></Box></details>; })}</div>;
}
function ResumeModele({ id }) {
  const r = RESUMES_LIVRE.find(x => x.id === id);
  const all = r.paras.join(" ");
  return <div className="doc"><span className="dlab">{r.titre}</span>{r.paras.map((p, i) => <T key={i}>{p}</T>)}<div className="row"><WordCount text={all} /></div></div>;
}

export function Visual({ v }) {
  if (!v) return null;
  if (v.diagram) return <Diagram id={v.diagram} />;
  if (v.textroles) return <TextRoles id={v.textroles} />;
  if (v.schema) return <SchemaView s={getSchema(v.schema)} />;
  if (v.compare) return <div className="stack" style={{ gap: ".5rem" }}>{v.compare.map(([a, b], i) => <div key={i} className="cmp"><T className="cmp-a">{a}</T><T className="cmp-b small">{b}</T></div>)}</div>;
  if (v.fiche) return <Fiche />;
  if (v.mouvements) return <Diagram id="mouvements" />;
  if (v.fragments) return <Fragments ms={v.fragments} />;
  if (v.traductions) return <Traductions idx={v.traductions} />;
  if (v.arg) return <ArgCard id={v.arg} />;
  if (v.resume) return <ResumeModele id={v.resume} />;
  if (v.pieges) return <Box kind="attention" label="À ne pas mettre dans le résumé du livre"><ul className="clean">{PIEGES_LIVRE.map((p, i) => <T as="li" key={i}>{p}</T>)}</ul></Box>;
  return null;
}

function Check({ c, id }) {
  const [ans, setAns] = useState(null);
  useEffect(() => setAns(null), [id]);
  return <div className="card">
    <span className="tag acc" style={{ alignSelf: "flex-start" }}>Vérifie ce que tu as retenu</span>
    <T as="h3">{c.q}</T>
    <div className="opts">{c.o.map((o, i) => <button key={i} className={"opt" + (ans != null ? (i === c.a ? " good" : i === ans ? " bad" : "") : "")} disabled={ans != null} onClick={() => setAns(i)}><span className="k">{"ABCD"[i]}</span><span>{o}</span></button>)}</div>
    {ans != null && <div className={"feedback " + (ans === c.a ? "ok" : "ko")} role="status"><b>{ans === c.a ? "Bravo ! " : "Pas tout à fait. "}</b><T as="span">{c.e}</T></div>}
  </div>;
}

export default function Course({ which }) {
  const { route, go, setNextPage } = useApp();
  const C = COURSES[which];
  const ALL = C.lessons;
  const [seen, setSeen] = usePersist("seen", {});
  const lid = route.sub[0];
  const lesson = ALL.find(l => l.id === lid);
  const pi = Math.max(0, Math.min(+(route.sub[1] || 0), lesson ? lesson.pages.length - 1 : 0));

  useEffect(() => {
    if (!lesson) { setNextPage(null); return; }
    const idx = ALL.indexOf(lesson);
    if (pi === lesson.pages.length - 1 && !seen[lesson.id]) setSeen(s => ({ ...s, [lesson.id]: Date.now() }));
    setNextPage(pi < lesson.pages.length - 1 ? () => go(which, lesson.id, String(pi + 1)) : idx < ALL.length - 1 ? () => go(which, ALL[idx + 1].id) : null);
    return () => setNextPage(null);
  }, [lid, pi, which]);

  if (!lesson) return <>
    <div className="card"><h1>{C.t}</h1><T>{C.intro}</T></div>
    <div className="toc">{ALL.map((l, i) => <button key={l.id} className={seen[l.id] ? "seen" : ""} onClick={() => go(which, l.id)}><b>{(i + 1) + ". " + l.titre}</b><span>{l.resume}</span><span>{l.pages.length} page{l.pages.length > 1 ? "s" : ""}{seen[l.id] ? " · lue ✓" : ""}</span></button>)}</div>
  </>;

  const page = lesson.pages[pi];
  const idx = ALL.indexOf(lesson);
  const prev = pi > 0 ? () => go(which, lesson.id, String(pi - 1)) : idx > 0 ? () => go(which, ALL[idx - 1].id, String(ALL[idx - 1].pages.length - 1)) : null;
  const next = pi < lesson.pages.length - 1 ? () => go(which, lesson.id, String(pi + 1)) : idx < ALL.length - 1 ? () => go(which, ALL[idx + 1].id) : null;
  const last = pi === lesson.pages.length - 1;
  return <>
    <div className="row between noprint"><button className="btn small ghost" onClick={() => go(which)}><Icon n="left" />Sommaire</button><span className="small muted">Leçon {idx + 1} / {ALL.length}</span></div>
    <div className="stack" style={{ gap: ".35rem" }}>
      <h1>{lesson.titre}</h1>
      <div className="steps" aria-label={"Page " + (pi + 1) + " sur " + lesson.pages.length}>{lesson.pages.map((_, i) => <span key={i} className={i <= pi ? "done" : ""} />)}</div>
    </div>
    <div className={"lesson" + (page.visuel ? "" : " textonly")}>
      <div className="text">
        <h2>{page.titre}</h2>
        {page.blocs.map((b, i) => <T key={i}>{b}</T>)}
        {page.retenir && <Box kind="retenir"><ul className="clean">{page.retenir.map((r, i) => <T as="li" key={i}>{r}</T>)}</ul></Box>}
      </div>
      {page.visuel && <div className="visual"><Visual v={page.visuel} /></div>}
    </div>
    {last && lesson.check && <Check c={lesson.check} id={lesson.id} />}
    <div className="row between noprint">
      {prev ? <button className="btn" onClick={prev}><Icon n="left" />Précédent</button> : <span />}
      {next ? <button className="btn primary" onClick={next}>{last ? "Leçon suivante" : "Page suivante"}<Icon n="right" /></button> : <button className="btn primary" onClick={() => go("exercices")}>Passer aux exercices<Icon n="right" /></button>}
    </div>
  </>;
}
