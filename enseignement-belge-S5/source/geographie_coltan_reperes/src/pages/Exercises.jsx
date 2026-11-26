import React, { useState, useMemo } from "react";
import { useApp, T, Icon, Box, shuffle } from "../ui.jsx";
import { FAMILLES } from "../content/exercices.js";
import { usePersist } from "../store.js";
import MapView from "../MapView.jsx";
import { CroquisBuilder } from "../diagrams.jsx";
import { sceneItems } from "../scenes.js";

const LV = { 1: ["lv1", "Niveau 1 · restituer"], 2: ["lv2", "Niveau 2 · appliquer"], 3: ["lv3", "Niveau 3 · argumenter, transférer"] };

function Doc({ d }) {
  if (!d) return null;
  if (d.map) return <MapView id={d.map} mode="explore" names={d.props && d.props.names} theme={d.props && d.props.theme} height="50vh" />;
  return <div className="doc">{d.lab && <span className="dlab">{d.lab}</span>}<T>{d.t}</T>{d.src && <span className="src">{d.src}</span>}</div>;
}

function Criteria({ list, id }) {
  const [ck, setCk] = usePersist("crit_" + id, {});
  return <div className="critere"><b className="small">Auto-évaluation : coche ce qui est présent dans ta réponse</b>
    {list.map((c, i) => <label key={i} className="chk"><input type="checkbox" checked={!!ck[i]} onChange={e => setCk(x => ({ ...x, [i]: e.target.checked }))} /><span>{c}</span></label>)}
    <span className="small muted">{Object.values(ck).filter(Boolean).length} / {list.length} critères</span></div>;
}

function TexteEx({ it, status, setStatus }) {
  const [txt, setTxt] = usePersist("rep_" + it.id, "");
  const [show, setShow] = useState(false);
  return <>
    <textarea value={txt} onChange={e => setTxt(e.target.value)} placeholder="Écris ta réponse ici (elle est enregistrée dans ce navigateur)…" aria-label="Ta réponse" />
    <div className="row"><button className="btn" onClick={() => setShow(s => !s)}><Icon n="eye" />{show ? "Masquer la correction" : "Voir la correction"}</button></div>
    {show && <div className="correction"><h4>Correction détaillée</h4>{it.correction.texte.map((t, i) => <T key={i}>{t}</T>)}
      <Criteria list={it.correction.criteres} id={it.id} />
      <Status status={status} setStatus={setStatus} /></div>}
  </>;
}
function Status({ status, setStatus }) {
  return <div className="row"><span className="small">Bilan :</span>
    <button className={"btn small" + (status === "ok" ? " on" : "")} onClick={() => setStatus("ok")}><Icon n="check" />Réussi</button>
    <button className={"btn small" + (status === "revoir" ? " on" : "")} onClick={() => setStatus("revoir")}>À revoir</button></div>;
}

function TableauEx({ it, status, setStatus }) {
  const [vals, setVals] = usePersist("tab_" + it.id, {});
  const [show, setShow] = useState(false);
  return <>
    <div className="tbl-wrap"><table className="tbl"><thead><tr><th>Information</th><th>Ta réponse</th>{show && <th>Correction</th>}</tr></thead>
      <tbody>{it.lignes.map(([q, a], i) => <tr key={i}><td>{q}</td><td><input type="text" value={vals[i] || ""} onChange={e => setVals(v => ({ ...v, [i]: e.target.value }))} style={{ width: "100%" }} aria-label={q} /></td>{show && <td style={{ background: "var(--pos-bg)" }}>{a}</td>}</tr>)}</tbody></table></div>
    <div className="row"><button className="btn" onClick={() => setShow(s => !s)}><Icon n="eye" />{show ? "Masquer la correction" : "Voir la correction"}</button></div>
    {show && <div className="correction"><Criteria list={it.criteres} id={it.id} /><Status status={status} setStatus={setStatus} /></div>}
  </>;
}

function TriEx({ it, setStatus }) {
  const [rep, setRep] = useState({});
  const [checked, setChecked] = useState(false);
  const tags = useMemo(() => shuffle(it.etiquettes.map((e, i) => [...e, i])), [it.id]);
  const nOk = it.etiquettes.filter((e, i) => rep[i] === e[1]).length;
  return <>
    <div className="stack" style={{ gap: ".4rem" }}>
      {tags.map(([t, c, i]) => <div key={i} className="row" style={{ padding: ".35rem .5rem", border: "1px solid var(--border-soft)", borderRadius: "4px", background: checked ? (rep[i] === c ? "var(--pos-bg)" : "var(--neg-bg)") : "var(--view)" }}>
        <span style={{ flex: "1 1 12rem" }}>{t}</span>
        {it.cats.map((cat, k) => <button key={k} className={"btn small" + (rep[i] === k ? " on" : "")} onClick={() => { if (!checked) setRep(r => ({ ...r, [i]: k })); }} aria-pressed={rep[i] === k}>{cat}</button>)}
        {checked && rep[i] !== c && <span className="small" style={{ color: "var(--neg-strong)" }}>→ {it.cats[c]}</span>}
      </div>)}
    </div>
    <div className="row">
      {!checked ? <button className="btn primary" disabled={Object.keys(rep).length < it.etiquettes.length} onClick={() => { setChecked(true); setStatus(nOk === it.etiquettes.length ? "ok" : "revoir"); }}>Vérifier</button>
        : <button className="btn" onClick={() => { setRep({}); setChecked(false); }}>Recommencer</button>}
      {!checked && <span className="small muted">Classe toutes les étiquettes, puis vérifie.</span>}
    </div>
    {checked && <div className="correction"><h4>Résultat : {nOk} / {it.etiquettes.length}</h4><T>{it.conclusion}</T></div>}
  </>;
}

function CarteEx({ it, setStatus }) {
  const items = sceneItems(it.scene);
  const targets = useMemo(() => shuffle(it.targets), [it.id]);
  const [i, setI] = useState(0); const [marks, setMarks] = useState({}); const [fb, setFb] = useState(null); const [score, setScore] = useState(0);
  const cur = items.find(x => x.id === targets[i]);
  const pick = p => {
    if (!cur || fb) return;
    if (p.id === cur.id) { setScore(s => s + 1); setMarks(m => ({ ...m, [cur.id]: "good" })); setFb({ ok: true, t: "Exact !" }); setTimeout(() => { setFb(null); setI(x => { if (x + 1 >= targets.length) setStatus("ok"); return x + 1; }); }, 700); }
    else { setMarks(m => ({ ...m, [p.id]: "bad", [cur.id]: "hl" })); setFb({ ok: false, t: "Non, c’est « " + p.name + " ». La bonne réponse clignote." }); }
  };
  return <div className="maptask">
    {cur ? <div className="prompt">Clique sur : <span style={{ color: "var(--accent-strong)" }}>{cur.name}</span><span className="small muted" style={{ marginLeft: "auto" }}>{i + 1}/{targets.length} · score {score}</span></div>
      : <div className="feedback ok">Terminé : {score} / {targets.length}. <button className="btn small" onClick={() => { setI(0); setMarks({}); setScore(0); }}>Recommencer</button></div>}
    {fb && <div className={"feedback " + (fb.ok ? "ok" : "ko")}>{fb.t} {!fb.ok && <button className="btn small" onClick={() => { setFb(null); setMarks(m => { const n = { ...m }; Object.keys(n).forEach(k => { if (n[k] !== "good") delete n[k]; }); return n; }); setI(x => x + 1); }}>Suivant</button>}</div>}
    <MapView id={it.scene} mode="pick" pickLayers={[it.layer]} marks={marks} onPick={pick} height="60vh" />
  </div>;
}

function Item({ it, n }) {
  const [st, setSt] = usePersist("exs", {});
  const status = st[it.id];
  const setStatus = v => setSt(s => ({ ...s, [it.id]: v }));
  const [cls, lab] = LV[it.niveau];
  return <div className="ex-item" id={"ex-" + it.id}>
    <div className="row between"><span className={"level " + cls}>Exercice {n} · {lab}</span>{status && <span className={"tag " + (status === "ok" ? "ok" : "ko")}>{status === "ok" ? "réussi" : "à revoir"}</span>}</div>
    <T as="h4">{it.consigne}</T>
    {it.doc && <Doc d={it.doc} />}
    {it.type === "texte" && <TexteEx it={it} status={status} setStatus={setStatus} />}
    {it.type === "tableau" && <TableauEx it={it} status={status} setStatus={setStatus} />}
    {it.type === "tri" && <TriEx it={it} setStatus={setStatus} />}
    {it.type === "carte" && <CarteEx it={it} setStatus={setStatus} />}
  </div>;
}

function Solved({ r }) {
  const [k, setK] = useState(1);
  return <div className="ex-item solved">
    <span className="level" style={{ color: "#8e44ad" }}>Exercice résolu · lis-le avant de t’entraîner</span>
    <T as="h4">{r.consigne}</T>
    {(r.docs || []).map((d, i) => <Doc key={i} d={d} />)}
    {r.map && <MapView id={r.map.scene} mode="explore" names={r.map.props && r.map.props.names} theme={r.map.props && r.map.props.theme} height="48vh" />}
    <ol className="clean" style={{ listStyle: "none", paddingLeft: 0, gap: ".5rem" }}>
      {r.etapes.slice(0, k).map((e, i) => <li key={i} className="box methode"><span className="lab">{e.t}</span><T>{e.d}</T></li>)}
    </ol>
    <div className="row">
      {k < r.etapes.length ? <><button className="btn" onClick={() => setK(x => x + 1)}>Étape suivante<Icon n="right" /></button><button className="btn ghost" onClick={() => setK(r.etapes.length)}>Tout afficher</button></> : null}
    </div>
    {k >= r.etapes.length && <Box kind="retenir" label="Réponse rédigée"><T>{r.reponse}</T></Box>}
    {k >= r.etapes.length && r.builder && <CroquisBuilder />}
  </div>;
}

export default function Exercises() {
  const { route, go } = useApp();
  const [st] = usePersist("exs", {});
  const fam = FAMILLES.find(f => f.id === route.sub[0]);
  if (!fam) return <>
    <div className="card"><h1>Exercices par famille</h1>
      <T>Les exercices sont rangés par famille, de la restitution des connaissances à l’argumentation et au transfert. Chaque famille commence par un **exercice résolu** étape par étape : lis-le attentivement, puis entraîne-toi seul avant d’ouvrir la correction détaillée.</T></div>
    <div className="toc">{FAMILLES.map((f, i) => { const done = f.items.filter(it => st[it.id] === "ok").length; return <button key={f.id} onClick={() => go("exercices", f.id)}>
      <b>{i + 1}. {f.titre}</b><span>{f.comp} · {f.items.length} exercices · {done} réussi{done > 1 ? "s" : ""}</span><span>{f.but}</span></button>; })}</div>
  </>;
  const idx = FAMILLES.indexOf(fam);
  return <>
    <div className="row between noprint"><button className="btn small ghost" onClick={() => go("exercices")}><Icon n="left" />Toutes les familles</button>
      {idx < FAMILLES.length - 1 && <button className="btn small ghost" onClick={() => go("exercices", FAMILLES[idx + 1].id)}>Famille suivante<Icon n="right" /></button>}</div>
    <div className="fam">
      <header><h3>{idx + 1}. {fam.titre}</h3><span className="tag acc">{fam.comp}</span></header>
      <div className="body">
        <T>{fam.but}</T>
        <Box kind="methode"><ol className="clean">{fam.methode.map((m, i) => <T as="li" key={i}>{m}</T>)}</ol></Box>
        <Solved r={fam.resolu} />
        {fam.items.map((it, i) => <Item key={it.id} it={it} n={i + 1} />)}
      </div>
    </div>
  </>;
}
