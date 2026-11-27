import React, { useState, useMemo } from "react";
import { useApp, T, Icon, Box, shuffle } from "../ui.jsx";
import { FAMILLES, GROUPES, NIVEAUX } from "../content/exercices.js";
import { THEMES } from "../content/themes.js";
import { usePersist } from "../store.js";
import { SchemaView, SchemaEditor, emptySchema, schemaToText, schemaRef, getSchema, getText, PlainText, MarkText, OrderEx, CopyAI, WordCount, Trame, assemble } from "../components.jsx";
import { textOf } from "../content/textes.js";
import { SCHEMA_LIVRE } from "../content/livre.js";

function Status({ status, setStatus }) {
  return <div className="row"><span className="small">Bilan :</span>
    <button className={"btn small" + (status === "ok" ? " on" : "")} onClick={() => setStatus("ok")}><Icon n="check" />Réussi</button>
    <button className={"btn small" + (status === "revoir" ? " on" : "")} onClick={() => setStatus("revoir")}>À revoir</button></div>;
}
function Criteria({ list, id }) {
  const [ck, setCk] = usePersist("crit_" + id, {});
  return <div className="critere"><b className="small">Auto-évaluation : coche ce qui est présent dans ta production</b>
    {list.map((c, i) => <label key={i} className="chk"><input type="checkbox" checked={!!ck[i]} onChange={e => setCk(x => ({ ...x, [i]: e.target.checked }))} /><span>{c}</span></label>)}
    <span className="small muted">{Object.values(ck).filter(Boolean).length} / {list.length} critères</span></div>;
}

function TriEx({ it, setStatus }) {
  const [rep, setRep] = useState({});
  const [checked, setChecked] = useState(false);
  const tags = useMemo(() => shuffle(it.etiquettes.map((e, i) => [...e, i])), [it.id]);
  const nOk = it.etiquettes.filter((e, i) => rep[i] === e[1]).length;
  return <>
    <div className="stack" style={{ gap: ".4rem" }}>
      {tags.map(([t, c, i]) => <div key={i} className="tri-row" style={{ background: checked ? (rep[i] === c ? "var(--pos-bg)" : "var(--neg-bg)") : "var(--view)" }}>
        <T as="span" className="tri-t">{t}</T>
        <span className="row">{it.cats.map((cat, k) => <button key={k} className={"btn small" + (rep[i] === k ? " on" : "")} onClick={() => { if (!checked) setRep(r => ({ ...r, [i]: k })); }} aria-pressed={rep[i] === k}>{cat}</button>)}</span>
        {checked && rep[i] !== c && <span className="small" style={{ color: "var(--neg-strong)" }}>→ {it.cats[c]}</span>}
      </div>)}
    </div>
    <div className="row">
      {!checked ? <button className="btn primary" disabled={Object.keys(rep).length < it.etiquettes.length} onClick={() => { setChecked(true); setStatus(nOk === it.etiquettes.length ? "ok" : "revoir"); }}>Vérifier</button>
        : <button className="btn" onClick={() => { setRep({}); setChecked(false); }}><Icon n="reset" />Recommencer</button>}
      {!checked && <span className="small muted">{Object.keys(rep).length} / {it.etiquettes.length} classées</span>}
    </div>
    {checked && <div className="correction"><h4>Résultat : {nOk} / {it.etiquettes.length}</h4><T>{it.conclusion}</T></div>}
  </>;
}

function QcmEx({ it, setStatus }) {
  const [ans, setAns] = useState(null);
  return <>
    <T as="p"><b>{it.q}</b></T>
    <div className="opts">{it.o.map((o, i) => <button key={i} className={"opt" + (ans != null ? (i === it.a ? " good" : i === ans ? " bad" : "") : "")} disabled={ans != null} onClick={() => { setAns(i); setStatus(i === it.a ? "ok" : "revoir"); }}><span className="k">{"ABCD"[i]}</span><span>{o}</span></button>)}</div>
    {ans != null && <div className={"feedback " + (ans === it.a ? "ok" : "ko")}><b>{ans === it.a ? "Exact ! " : "Non. "}</b><T as="span">{it.e}</T> <button className="btn small" onClick={() => setAns(null)}>Recommencer</button></div>}
  </>;
}

function SchemaTrous({ it, status, setStatus }) {
  const s = getSchema(it.texte);
  const [vals, setVals] = usePersist("st_" + it.id, {});
  const [show, setShow] = useState(false);
  return <>
    {it.texte !== "livre" ? <PlainText id={it.texte} open /> : <p className="small muted">Appuie-toi sur la leçon « L’argumentation du livre » (Comprendre le livre).</p>}
    <SchemaView s={s} hidden={it.trous} values={vals} setValue={(k, v) => setVals(x => ({ ...x, [k]: v }))} showCorr={show} />
    <div className="row"><button className="btn" onClick={() => setShow(x => !x)}><Icon n="eye" />{show ? "Masquer le corrigé" : "Afficher le corrigé dans les cases"}</button></div>
    {show && <div className="correction"><T>Compare le sens, pas les mots exacts : ta formulation peut être différente et juste. Vérifie qu’elle est courte, reformulée et fidèle.</T><Status status={status} setStatus={setStatus} /></div>}
  </>;
}

function SchemaVide({ it, status, setStatus }) {
  const s = getSchema(it.texte);
  const [val, setVal] = usePersist("sv_" + it.id, emptySchema(it.texte === "livre" ? 5 : s.args.length));
  const [show, setShow] = useState(false);
  const isLivre = it.texte === "livre";
  return <>
    {!isLivre && <PlainText id={it.texte} open />}
    <SchemaEditor value={val} onChange={setVal} />
    <CopyAI text={schemaToText(val)} label="mon schéma" prompt={{ tache: "réaliser le schéma argumentatif " + (isLivre ? "du livre « Un jihad de l’amour »" : "du texte « " + getText(it.texte).titre + " »") + " (thème, thèse, arguments, explications, exemples, contre-argument éventuel).", consigne: it.consigne, source: isLivre ? null : textOf(getText(it.texte)), reference: schemaRef(s) }} />
    <div className="row"><button className="btn" onClick={() => setShow(x => !x)}><Icon n="eye" />{show ? "Masquer le corrigé" : "Comparer avec le corrigé"}</button></div>
    {show && <div className="correction"><h4>Schéma corrigé</h4><SchemaView s={s} /><T>Ton schéma est juste si tu as la même thèse et les mêmes arguments, même formulés autrement. Un argument peut être découpé ou regroupé différemment, à condition que le sens soit fidèle.</T><Status status={status} setStatus={setStatus} /></div>}
  </>;
}

function Redaction({ it, status, setStatus }) {
  const [v, setV] = usePersist("red_" + it.id, {});
  const [show, setShow] = useState(false);
  const text = assemble(it.trame, v);
  const theme = it.theme && THEMES.find(t => t.id === it.theme);
  const t = it.texte && getText(it.texte);
  const corr = it.correction;
  const ref = t ? [...schemaRef(t.schema), "Résumé modèle : " + t.resume.texte.join(" ")] : it.id.startsWith("l") ? schemaRef(SCHEMA_LIVRE) : corr.texte;
  return <>
    {t && !it.schemaDonne && <PlainText id={t.id} />}
    {t && it.schemaDonne && <><PlainText id={t.id} /><Box kind="info" label="Schéma donné"><SchemaView s={t.schema} /></Box></>}
    {theme && <Box kind="info" label={"Bibliothèque : " + theme.titre}><b className="small">Arguments « pour » : {theme.sujets[0]}</b><ul className="clean">{theme.pour.map((a, i) => <li key={i}>{a[0]} <span className="muted">(ex. : {a[1]})</span></li>)}</ul><b className="small">Contre-arguments possibles</b><ul className="clean">{theme.contre.map((a, i) => <li key={i}>{a[0]}</li>)}</ul></Box>}
    <Trame fields={it.trame} value={v} onChange={setV} />
    <div className="row"><WordCount text={text} max={it.max} /><button className="btn small ghost" onClick={() => setV({})}><Icon n="reset" />Effacer</button></div>
    <div className="doc"><span className="dlab">Mon texte assemblé</span>{text ? text.split("\n\n").map((p, i) => <p key={i}>{p}</p>) : <span className="muted small">Ton texte apparaîtra ici.</span>}</div>
    <CopyAI text={text} prompt={{ tache: it.consigne, max: it.max, source: t ? textOf(t) : null, reference: ref, criteres: corr.criteres }} />
    <div className="row"><button className="btn" onClick={() => setShow(s => !s)}><Icon n="eye" />{show ? "Masquer la correction" : "Voir la correction"}</button></div>
    {show && <div className="correction"><h4>Correction</h4>
      {corr.modele ? <><b className="small">Résumé modèle</b>{getText(corr.modele).resume.texte.map((x, i) => <T key={i}>{x}</T>)}<WordCount text={getText(corr.modele).resume.texte.join(" ")} max={getText(corr.modele).resume.max} /></> : corr.texte.map((x, i) => <T key={i}>{x}</T>)}
      <Criteria list={corr.criteres} id={it.id} /><Status status={status} setStatus={setStatus} /></div>}
  </>;
}

function Defauts({ it, setStatus }) {
  const [ck, setCk] = useState({});
  const [checked, setChecked] = useState(false);
  const nOk = it.options.filter((o, i) => !!ck[i] === o[1]).length;
  return <>
    <div className="doc"><span className="dlab">Résumé à évaluer</span><T>{it.resume}</T><WordCount text={it.resume} /></div>
    <div className="stack" style={{ gap: ".3rem" }}>{it.options.map(([o, yes], i) => <label key={i} className={"chk" + (checked ? (!!ck[i] === yes ? " good-t" : " bad-t") : "")}><input type="checkbox" disabled={checked} checked={!!ck[i]} onChange={e => setCk(x => ({ ...x, [i]: e.target.checked }))} /><span>{o}{checked && <b> {yes ? " (présent)" : " (absent)"}</b>}</span></label>)}</div>
    <div className="row">{!checked ? <button className="btn primary" onClick={() => { setChecked(true); setStatus(nOk === it.options.length ? "ok" : "revoir"); }}>Vérifier</button> : <button className="btn" onClick={() => { setCk({}); setChecked(false); }}><Icon n="reset" />Recommencer</button>}</div>
    {checked && <div className="correction"><h4>Correction : {nOk} / {it.options.length} réponses justes</h4>{it.correction.map((c, i) => <T key={i}>{c}</T>)}</div>}
  </>;
}

function Item({ it, n }) {
  const [st, setSt] = usePersist("exs", {});
  const status = st[it.id];
  const setStatus = v => setSt(s => ({ ...s, [it.id]: v }));
  const [cls, lab] = NIVEAUX[it.niveau];
  const p = { it, status, setStatus };
  return <div className="ex-item" id={"ex-" + it.id}>
    <div className="row between"><span className={"level " + cls}>Exercice {n} · {lab}</span>{status && <span className={"tag " + (status === "ok" ? "ok" : "ko")}>{status === "ok" ? "réussi" : "à revoir"}</span>}</div>
    {it.consigne && <T as="h4">{it.consigne}</T>}
    {it.type === "tri" && <TriEx {...p} />}
    {it.type === "qcm" && <QcmEx {...p} />}
    {it.type === "marquer" && <MarkText id={it.texte} roles={it.roles} onResult={ok => setStatus(ok ? "ok" : "revoir")} />}
    {it.type === "schema-trous" && <SchemaTrous {...p} />}
    {it.type === "schema-vide" && <SchemaVide {...p} />}
    {it.type === "redaction" && <Redaction {...p} />}
    {it.type === "defauts" && <Defauts {...p} />}
    {it.type === "ordre" && <OrderEx items={it.items} conclusion={it.conclusion} onResult={ok => setStatus(ok ? "ok" : "revoir")} />}
  </div>;
}

function Solved({ r }) {
  const [k, setK] = useState(1);
  return <div className="ex-item solved">
    <span className="level" style={{ color: "#8e44ad" }}>Exemple résolu · lis-le avant de t’entraîner</span>
    <T as="h4">{r.consigne}</T>
    <ol className="clean" style={{ listStyle: "none", paddingLeft: 0, gap: ".5rem" }}>{r.etapes.slice(0, k).map((e, i) => <li key={i} className="box methode"><span className="lab">{e.t}</span><T>{e.d}</T></li>)}</ol>
    <div className="row">{k < r.etapes.length && <><button className="btn" onClick={() => setK(x => x + 1)}>Étape suivante<Icon n="right" /></button><button className="btn ghost" onClick={() => setK(r.etapes.length)}>Tout afficher</button></>}</div>
    {k >= r.etapes.length && <Box kind="retenir" label="Réponse"><T>{r.reponse}</T></Box>}
  </div>;
}

export default function Exercises() {
  const { route, go } = useApp();
  const [st] = usePersist("exs", {});
  const fam = FAMILLES.find(f => f.id === route.sub[0]);
  if (!fam) return <>
    <div className="card"><h1>Exercices de complexité croissante</h1>
      <T>Les exercices sont rangés en familles. Dans chaque famille, l’aide diminue peu à peu : d’abord un **exemple résolu** étape par étape, puis des exercices guidés, puis des tâches complètes comme à l’examen. Les familles 1 à 5 vont **du texte au schéma**, la famille 6 **du schéma au texte**, la famille 7 **du schéma au résumé**, et la famille 8 t’apprend à **évaluer** un résumé.</T>
      <T>Pour les productions écrites, un bouton copie ton texte avec une consigne destinée à une IA : tu obtiens un retour détaillé, sans qu’elle fasse le travail à ta place.</T></div>
    {GROUPES.map(g => <section key={g.id} className="stack"><h2>{g.t}</h2>
      <div className="toc">{FAMILLES.filter(f => f.groupe === g.id).map((f, i) => { const done = f.items.filter(it => st[it.id] === "ok").length; return <button key={f.id} className={done === f.items.length ? "seen" : ""} onClick={() => go("exercices", f.id)}>
        <b>{f.id.toUpperCase()} · {f.titre}</b><span>{f.comp} · {f.items.length} exercice{f.items.length > 1 ? "s" : ""} · {done} réussi{done > 1 ? "s" : ""}</span><span>{f.but}</span></button>; })}</div></section>)}
  </>;
  const idx = FAMILLES.indexOf(fam);
  return <>
    <div className="row between noprint"><button className="btn small ghost" onClick={() => go("exercices")}><Icon n="left" />Toutes les familles</button>
      {idx < FAMILLES.length - 1 && <button className="btn small ghost" onClick={() => go("exercices", FAMILLES[idx + 1].id)}>Famille suivante<Icon n="right" /></button>}</div>
    <div className="fam">
      <header><h3>{fam.id.toUpperCase()} · {fam.titre}</h3><span className="tag acc">{fam.comp}</span></header>
      <div className="body">
        <T>{fam.but}</T>
        <Box kind="methode"><ol className="clean">{fam.methode.map((m, i) => <T as="li" key={i}>{m}</T>)}</ol></Box>
        <Solved r={fam.resolu} />
        {fam.items.map((it, i) => <Item key={it.id} it={it} n={i + 1} />)}
      </div>
    </div>
  </>;
}
