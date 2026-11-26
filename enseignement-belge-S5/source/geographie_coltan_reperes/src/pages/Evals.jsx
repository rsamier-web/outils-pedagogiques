import React, { useState, useEffect, useRef } from "react";
import { useApp, T, Icon, Box } from "../ui.jsx";
import { EVALUATIONS } from "../content/evaluations.js";
import { usePersist } from "../store.js";
import MapView from "../MapView.jsx";

const fmt = x => String(Math.round(x * 100) / 100).replace(".", ",");

function Timer({ minutes }) {
  const [left, setLeft] = useState(minutes * 60);
  const [on, setOn] = useState(false);
  useEffect(() => { if (!on) return; const t = setInterval(() => setLeft(l => Math.max(0, l - 1)), 1000); return () => clearInterval(t); }, [on]);
  return <span className="row"><span className="tag" style={{ fontVariantNumeric: "tabular-nums", fontSize: ".9rem" }}>{String(Math.floor(left / 60)).padStart(2, "0")}:{String(left % 60).padStart(2, "0")}</span>
    <button className="btn small" onClick={() => setOn(o => !o)}>{on ? "Pause" : left === minutes * 60 ? "Démarrer le chrono" : "Reprendre"}</button></span>;
}

function Sheet({ ev }) {
  const { go } = useApp();
  const [mode, setMode] = useState("entrainement");
  const [shown, setShown] = useState({});
  const [all, setAll] = useState(false);
  const [notes, setNotes] = usePersist("notes_" + ev.id, {});
  const [answers, setAnswers] = usePersist("ans_" + ev.id, {});
  const total = Object.values(notes).reduce((s, v) => s + (parseFloat(String(v).replace(",", ".")) || 0), 0);
  const mins = parseInt(ev.duree, 10);
  return <>
    <div className="row between noprint">
      <button className="btn small ghost" onClick={() => go("evaluations")}><Icon n="left" />Bibliothèque</button>
      <div className="row">
        <div className="tabs" role="tablist" style={{ border: "none" }}>
          <button role="tab" aria-selected={mode === "entrainement"} onClick={() => { setMode("entrainement"); setAll(false); }}>Entraînement (corrigé par question)</button>
          <button role="tab" aria-selected={mode === "examen"} onClick={() => { setMode("examen"); setShown({}); setAll(false); }}>Mode examen</button>
        </div>
        <button className="btn small" onClick={() => window.print()}><Icon n="print" />Imprimer</button>
      </div>
    </div>
    <div className="eval-sheet">
      <div className="eval-head">
        <div><h1 style={{ fontSize: "1.25rem" }}>{ev.titre}</h1><p className="small muted">Géographie · 5e secondaire · {ev.type} · durée : {ev.duree}</p></div>
        <div className="stack" style={{ gap: ".25rem", alignItems: "flex-end" }}><span>Nom : ……………………… Classe : ……</span><b>Note : {fmt(total)} / {ev.total}</b>{mode === "examen" && <span className="noprint"><Timer minutes={mins} /></span>}</div>
      </div>
      <Box kind="info" label="Consignes"><T>{ev.consignes}</T></Box>
      {(ev.docs || []).map((d, i) => <div key={i} className="doc"><span className="dlab">{d.lab}</span><T>{d.t}</T><span className="src">{d.src}</span></div>)}
      {ev.questions.map((q, i) => {
        const open = all || shown[i];
        return <React.Fragment key={i}>
          {q.part && <h2 style={{ marginTop: ".5rem" }}>{q.part}</h2>}
          <div className="q">
            <div className="qh"><T as="h3">{(i + 1) + ". " + q.q}</T><span className="pts">/ {fmt(q.pts)}</span></div>
            {q.map && <MapView id={q.map.scene} mode="show" numbers={q.map.numbers} names={q.map.names} only={q.map.only} height="52vh" hideLegend={!!q.map.numbers} plain={!!q.map.plain} />}
            <textarea className="noprint" value={answers[i] || ""} onChange={e => setAnswers(a => ({ ...a, [i]: e.target.value }))} placeholder="Ta réponse…" aria-label={"Réponse à la question " + (i + 1)} style={{ minHeight: (q.lignes || 3) * 1.6 + "rem" }} />
            <div className="lines printlines" aria-hidden="true">{Array.from({ length: q.lignes || 3 }, (_, k) => <span key={k} />)}</div>
            {mode === "entrainement" && !open && <button className="btn small noprint" style={{ alignSelf: "flex-start" }} onClick={() => setShown(s => ({ ...s, [i]: true }))}><Icon n="eye" />Voir le corrigé</button>}
            {open && <div className="correction"><h4>Corrigé</h4>{q.corrige.map((c, k) => <T key={k}>{c}</T>)}<p className="small"><b>Barème :</b> {q.bareme}</p>
              <label className="row small noprint">Mes points : <input type="text" inputMode="decimal" value={notes[i] ?? ""} onChange={e => setNotes(n => ({ ...n, [i]: e.target.value }))} style={{ width: "4.5rem" }} aria-label={"Points obtenus à la question " + (i + 1)} /> / {fmt(q.pts)}</label></div>}
          </div>
        </React.Fragment>;
      })}
      <div className="row between noprint">
        {!all ? <button className="btn primary" onClick={() => setAll(true)}><Icon n="check" />{mode === "examen" ? "J’ai terminé : afficher tout le corrigé" : "Afficher tout le corrigé"}</button> : <span />}
        <b>Total : {fmt(total)} / {ev.total}</b>
      </div>
    </div>
  </>;
}

export default function Evals() {
  const { route, go } = useApp();
  const ev = EVALUATIONS.find(e => e.id === route.sub[0]);
  if (ev) return <Sheet ev={ev} />;
  return <>
    <div className="card"><h1>Bibliothèque d’évaluations corrigées</h1>
      <T>Ces évaluations suivent la structure des évaluations de géographie du 3e degré en Fédération Wallonie-Bruxelles : des questions pour **connaître** (définitions, repères), pour **appliquer** (lire et mettre en relation des cartes, situer et localiser, réaliser un croquis) et pour **transférer** (une situation nouvelle).</T>
      <T>En mode entraînement, tu peux ouvrir le corrigé question par question. En mode examen, travaille d’abord seul avec le chronomètre, puis affiche le corrigé et note-toi avec le barème.</T>
    </div>
    <div className="toc">{EVALUATIONS.map(e => <button key={e.id} onClick={() => go("evaluations", e.id)}><b>{e.titre}</b><span>{e.type} · {e.duree} · sur {e.total} points · {e.questions.length} questions</span></button>)}</div>
  </>;
}
