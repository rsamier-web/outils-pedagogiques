import React, { useState } from "react";
import { useApp, T, Icon, Box } from "../ui.jsx";
import { usePersist } from "../store.js";
import { TEXTES, textOf } from "../content/textes.js";
import { SCHEMA_LIVRE, FRAGMENTS, FONCTIONS, MOUVEMENTS, RESUMES_LIVRE, PIEGES_LIVRE } from "../content/livre.js";
import { THEMES } from "../content/themes.js";
import { SchemaView, SchemaEditor, emptySchema, schemaToText, schemaRef, PlainText, MarkText, CopyAI, WordCount, Trame, assemble } from "../components.jsx";

const CONNECT = ["D’abord, ", "Ensuite, ", "De plus, ", "Par ailleurs, ", "Enfin, ", "En outre, "];
const VERBES = "affirme, soutient, estime, rappelle, souligne, dénonce, regrette, admet, réfute, plaide pour, appelle à";
const CHECKS = [
  "J’écris à la 3e personne (j’ai changé d’énonciateur).",
  "J’attribue les idées à l’auteur par son nom de famille, ou son prénom et son nom.",
  "Mon introduction donne la source (auteur, titre, date), le thème et la thèse.",
  "Je consacre un paragraphe (ou une phrase) à chaque argument, dans l’ordre de mon schéma.",
  "J’utilise des connecteurs logiques variés et justes.",
  "Je n’ai pas gardé d’exemple inutile ni d’anecdote.",
  "Je n’ai donné aucun avis personnel (neutralité).",
  "J’ai reformulé avec mes mots, sans transformer les propos de l’auteur.",
  "Un lecteur qui n’a pas lu le texte comprend tout (anaphores claires, verbes précis).",
  "Je respecte le nombre de mots maximal.",
];

const SOURCES = [{ id: "livre", titre: "Un jihad de l’amour (le livre)", sub: "Production 1 · résumé de 200 mots", max: 200 }, ...TEXTES.map(t => ({ id: t.id, titre: t.titre, sub: "Texte inconnu · niveau " + t.niveau + " · résumé de " + t.resume.max + " mots", max: t.resume.max }))];
const srcInfo = id => SOURCES.find(s => s.id === id);
const schemaOf = id => (id === "livre" ? SCHEMA_LIVRE : TEXTES.find(t => t.id === id).schema);
const introStart = id => { if (id === "livre") return "Dans son essai-témoignage Un jihad de l’amour (2017), Mohamed El Bachiri "; const t = TEXTES.find(x => x.id === id); return "Dans « " + t.titre + " » (" + (t.source.match(/\d{4}/) || [""])[0] + "), " + t.auteur + " "; };

// ---------- Étape 1 (livre) : fiche de repérage par fragment ----------
function RepereLivre({ st, set }) {
  const r = st.frag || {};
  const [show, setShow] = useState(false);
  const setF = (i, k, v) => set({ frag: { ...r, [i]: { ...(r[i] || {}), [k]: v } } });
  const nDone = FRAGMENTS.filter((f, i) => r[i] && r[i].f).length;
  const nOk = FRAGMENTS.filter((f, i) => r[i] && r[i].f === f.f).length;
  return <div className="stack">
    <Box kind="methode" label="Étapes 1 à 4 de la procédure (p. 78), à l’échelle du livre"><T>Pour chaque fragment, indique sa fonction dominante (récit, lyrique, argumentatif, mixte) et, s’il argumente, l’argument qu’il soutient. Les arguments sont nommés A1 à A5 dans le corrigé, mais tu peux d’abord noter tes propres idées dans la colonne « Mon idée ».</T></Box>
    <div className="row"><span className="tag">{nDone} / {FRAGMENTS.length} fragments traités</span><button className="btn small" onClick={() => setShow(s => !s)}><Icon n="eye" />{show ? "Masquer" : "Afficher"} le corrigé</button>{show && <span className="tag ok">{nOk} fonctions identiques au corrigé</span>}</div>
    {MOUVEMENTS.map(m => <details key={m.id} className="frag-m"><summary><span className="tag acc">{m.id}</span> <b>{m.t}</b></summary>
      <div className="tbl-wrap"><table className="tbl small"><thead><tr><th>Fragment</th><th>Fonction</th><th>Mon idée / argument</th>{show && <th>Corrigé</th>}</tr></thead>
        <tbody>{FRAGMENTS.map((f, i) => f.m !== m.id ? null : <tr key={i}><td><b>{f.t}</b><br /><span className="muted">{f.d}</span></td>
          <td><select value={(r[i] && r[i].f) || ""} onChange={e => setF(i, "f", e.target.value)} aria-label={"Fonction de " + f.t}><option value="">—</option>{Object.entries(FONCTIONS).map(([k, v]) => <option key={k} value={k}>{v[0]}</option>)}</select></td>
          <td><input type="text" value={(r[i] && r[i].a) || ""} onChange={e => setF(i, "a", e.target.value)} placeholder="ex. : refuser la vengeance" aria-label={"Idée de " + f.t} style={{ width: "100%" }} /></td>
          {show && <td style={{ background: "var(--pos-bg)" }}>{FONCTIONS[f.f][0]}{f.a.length ? " · " + f.a.join(", ") : ""}</td>}</tr>)}</tbody></table></div>
    </details>)}
    {show && <p className="small muted">A1 vengeance · A2 sens du jihad · A3 foi et raison · A4 fraternité humaine · A5 diversité et éducation. Plusieurs fragments peuvent servir le même argument : c’est ce regroupement qui donne ton schéma.</p>}
  </div>;
}

function RepereTexte({ id }) {
  const t = TEXTES.find(x => x.id === id);
  const roles = ["amorce", "these", "arg", "expl", "ex", "contre", "refut", "concl"].filter(r => r !== "refut" || t.paras.flat().some(s => s[0] === "refut")).filter(r => r !== "contre" || t.paras.flat().some(s => s[0] === "contre"));
  return <div className="stack">
    <Box kind="methode" label="Étapes 1 à 4 de la procédure (p. 78)"><ol className="clean"><li>Lis le texte en entier et vérifie que tu le comprends (cherche les mots difficiles).</li><li>Repère le thème et la thèse.</li><li>Repère les phrases qui ont une autre fonction (accroche, anecdote, citation).</li><li>Repère les arguments, leurs explications et leurs exemples.</li></ol></Box>
    <MarkText id={id} roles={roles} />
  </div>;
}

// ---------- Étape 3 : résumé guidé, à côté de mon schéma ----------
function resumeFields(id, sch) {
  const n = Math.max(1, sch.args.filter(a => a.arg.trim()).length || schemaOf(id).args.length);
  const f = [["intro", "Introduction : source, thème, thèse", introStart(id), "Qui écrit ? Quel titre ? Quand ? Quel genre ? Puis la thèse, reformulée. Verbes possibles : " + VERBES + "."]];
  for (let i = 0; i < n; i++) f.push(["a" + i, "Argument " + (i + 1), CONNECT[i === n - 1 && n > 1 ? 4 : i] || "Enfin, ", "Un paragraphe court : l’argument, et si tu as la place, son explication principale. Pas d’exemple."]);
  if (sch.contre && sch.contre.trim()) f.push(["contre", "Concession ou contre-argument réfuté", "Certes, ", "Seulement si l’auteur en présente un."]);
  return f;
}

function Resumer({ id, st, set }) {
  const info = srcInfo(id);
  const sch = st.schema || emptySchema(id === "livre" ? 5 : schemaOf(id).args.length);
  const fields = resumeFields(id, sch);
  const side = { intro: <><b>Thème :</b> {sch.theme || "…"}<br /><b>Thèse :</b> {sch.these || "…"}</> };
  sch.args.forEach((a, i) => { side["a" + i] = <><b>Argument {i + 1} :</b> {a.arg || "…"}<br /><span className="muted">Explication : {a.expl || "…"}</span></>; });
  if (sch.contre) side.contre = <>{sch.contre}</>;
  const text = assemble(fields, st.res);
  return <div className="stack">
    <Box kind="methode" label="Fiche p. 86"><T>Chaque case du résumé est placée à côté de la ligne correspondante de ton schéma. Complète les débuts de phrases, change-les si tu veux. Ton texte s’assemble en dessous.</T></Box>
    <Trame fields={fields} value={st.res} onChange={res => set({ res })} side={side} />
    <div className="row"><WordCount text={text} max={info.max} /><button className="btn small ghost" onClick={() => set({ res: {} })}><Icon n="reset" />Effacer le résumé</button></div>
  </div>;
}

function Relire({ id, st, set }) {
  const info = srcInfo(id);
  const sch = st.schema || emptySchema();
  const text = assemble(resumeFields(id, sch), st.res);
  const [show, setShow] = useState(false);
  const ck = st.checks || {};
  const isL = id === "livre";
  const t = !isL && TEXTES.find(x => x.id === id);
  return <div className="stack">
    <div className="doc"><span className="dlab">Mon résumé</span>{text ? text.split("\n\n").map((p, i) => <T key={i}>{p}</T>) : <span className="muted small">Ton résumé est encore vide : complète l’étape 3.</span>}<div className="row"><WordCount text={text} max={info.max} /></div></div>
    <div className="card flat"><h3>Je vérifie avec la fiche p. 86</h3>
      {CHECKS.map((c, i) => <label key={i} className="chk"><input type="checkbox" checked={!!ck[i]} onChange={e => set({ checks: { ...ck, [i]: e.target.checked } })} /><span>{c}</span></label>)}
      <span className="small muted">{Object.values(ck).filter(Boolean).length} / {CHECKS.length}</span></div>
    <CopyAI text={text} label="mon résumé" prompt={{ tache: "rédiger le résumé " + (isL ? "du livre « Un jihad de l’amour » de Mohamed El Bachiri" : "du texte « " + t.titre + " » de " + t.auteur) + " pour un lecteur de son âge qui ne l’a pas lu, à partir de son schéma argumentatif.", consigne: "Résumé de " + info.max + " mots maximum. Schéma réalisé par l’élève : " + schemaToText(sch).replace(/\n/g, " / "), max: info.max, source: isL ? null : textOf(t), reference: [...schemaRef(schemaOf(id)), ...(isL ? ["Résumé modèle : " + RESUMES_LIVRE[0].paras.join(" "), ...PIEGES_LIVRE.map(p => "Piège : " + p)] : ["Résumé modèle : " + t.resume.texte.join(" ")])], criteres: CHECKS }} />
    <div className="row"><button className="btn" onClick={() => setShow(s => !s)}><Icon n="eye" />{show ? "Masquer" : "Comparer avec"} le corrigé</button></div>
    {show && <div className="correction"><h4>Schéma corrigé</h4><SchemaView s={schemaOf(id)} />
      <h4>Résumé{isL ? "s" : ""} modèle{isL ? "s" : ""}</h4>
      {isL ? RESUMES_LIVRE.map(r => <div key={r.id} className="doc"><span className="dlab">{r.titre}</span>{r.paras.map((p, i) => <T key={i}>{p}</T>)}<WordCount text={r.paras.join(" ")} /></div>)
        : <div className="doc">{t.resume.texte.map((p, i) => <T key={i}>{p}</T>)}<WordCount text={t.resume.texte.join(" ")} max={t.resume.max} /></div>}
      <T>Ton résumé n’a pas besoin d’être identique : compare la thèse, la présence de chaque argument, l’absence d’exemples et d’avis, et la longueur.</T></div>}
  </div>;
}

function AtelierResume({ id }) {
  const { go } = useApp();
  const [st, setSt] = usePersist("at_" + id, {});
  const set = patch => setSt(s => ({ ...s, ...patch }));
  const step = st.step || 0;
  const info = srcInfo(id);
  const isL = id === "livre";
  const STEPS = ["1. Repérer", "2. Mon schéma", "3. Mon résumé", "4. Relire et demander un retour"];
  return <>
    <div className="row between noprint"><button className="btn small ghost" onClick={() => go("atelier")}><Icon n="left" />Tous les ateliers</button><span className="small muted">Ton travail est enregistré dans ce navigateur.</span></div>
    <div className="card"><h1>{info.titre}</h1><T>{isL ? "Production 1 de l’examen : le schéma argumentatif et le résumé du livre (200 mots), pour un lecteur de ton âge qui ne l’a pas lu." : "Production 2 de l’examen : le même travail sur un texte que tu ne connais pas. Résumé de " + info.max + " mots maximum, pour un lecteur de ton âge qui n’a pas lu le texte."}</T>
      <div className="tabs" role="tablist">{STEPS.map((s, i) => <button key={i} role="tab" aria-selected={step === i} onClick={() => set({ step: i })}>{s}</button>)}</div></div>
    <div className="atelier-grid">
      <div className="stack">
        {step === 0 && (isL ? <RepereLivre st={st} set={set} /> : <RepereTexte id={id} />)}
        {step === 1 && <><Box kind="methode" label="Étape 5 : tracer le schéma"><T>Hiérarchise (une ligne par argument) et reformule (court, avec tes mots). {isL ? "Pour le livre, regroupe les fragments qui défendent la même idée : cinq arguments suffisent." : ""}</T></Box>
          <SchemaEditor value={st.schema || emptySchema(isL ? 5 : schemaOf(id).args.length)} onChange={schema => set({ schema })} />
          <CopyAI text={schemaToText(st.schema || emptySchema())} label="mon schéma" prompt={{ tache: "réaliser le schéma argumentatif " + (isL ? "du livre « Un jihad de l’amour »" : "du texte « " + info.titre + " »") + ".", source: isL ? null : textOf(TEXTES.find(x => x.id === id)), reference: schemaRef(schemaOf(id)) }} /></>}
        {step === 2 && <Resumer id={id} st={st} set={set} />}
        {step === 3 && <Relire id={id} st={st} set={set} />}
        <div className="row between">{step > 0 ? <button className="btn" onClick={() => set({ step: step - 1 })}><Icon n="left" />Étape précédente</button> : <span />}{step < 3 && <button className="btn primary" onClick={() => set({ step: step + 1 })}>Étape suivante<Icon n="right" /></button>}</div>
      </div>
      {!isL && step > 0 && step < 3 && <aside className="atelier-side"><PlainText id={id} open /></aside>}
    </div>
  </>;
}

// ---------- Du schéma au texte argumentatif ----------
function AtelierEcrire({ id }) {
  const { go } = useApp();
  const th = THEMES.find(t => t.id === id);
  const [st, setSt] = usePersist("ec_" + id, { side: "pour" });
  const side = st.side || "pour";
  const args = side === "pour" ? th.pour : th.contre;
  const adverse = side === "pour" ? th.contre : th.pour;
  const fields = [["intro", "Introduction : accroche + thèse", "", "Une accroche (un fait, une question), puis ta thèse : « " + (side === "pour" ? "Oui" : "Non") + ", … »"], ...args.slice(0, 3).map((a, i) => ["a" + i, "Paragraphe " + (i + 1), ["D’abord, ", "Ensuite, ", "Enfin, "][i], "Argument → explication (en effet) → exemple (par exemple) → lien avec la thèse."]), ["contre", "Contre-argument et réfutation", "Certes, ", "Choisis un argument adverse et réponds-y (pourtant, mais…)."], ["concl", "Conclusion : thèse reformulée + ouverture", "En somme, ", ""]];
  const sideP = {}; args.slice(0, 3).forEach((a, i) => { sideP["a" + i] = <><b>{a[0]}</b><br /><span className="muted">Exemple possible : {a[1]}</span></>; });
  sideP.contre = <><b>Arguments adverses :</b><ul className="clean">{adverse.map((a, i) => <li key={i}>{a[0]}</li>)}</ul></>;
  const text = assemble(fields, st.v);
  return <>
    <div className="row between noprint"><button className="btn small ghost" onClick={() => go("atelier")}><Icon n="left" />Tous les ateliers</button></div>
    <div className="card"><h1>Du schéma au texte : {th.titre}</h1><T>{"Sujet : « " + th.sujets[0] + " » Tu pars des arguments de la bibliothèque (ton schéma) et tu les déplies en un texte argumentatif d’environ 250 mots."}</T>
      <div className="row"><span className="small">Je défends :</span><button className={"btn small" + (side === "pour" ? " on" : "")} onClick={() => setSt(s => ({ ...s, side: "pour" }))}>Oui (pour)</button><button className={"btn small" + (side === "contre" ? " on" : "")} onClick={() => setSt(s => ({ ...s, side: "contre" }))}>Non (contre)</button></div></div>
    <Trame fields={fields} value={st.v} onChange={v => setSt(s => ({ ...s, v }))} side={sideP} />
    <div className="row"><WordCount text={text} max={300} /><button className="btn small ghost" onClick={() => setSt(s => ({ ...s, v: {} }))}><Icon n="reset" />Effacer</button></div>
    <div className="doc"><span className="dlab">Mon texte</span>{text ? text.split("\n\n").map((p, i) => <p key={i}>{p}</p>) : <span className="muted small">Ton texte apparaîtra ici.</span>}</div>
    <CopyAI text={text} prompt={{ tache: "rédiger un texte argumentatif d’environ 250 mots sur le sujet « " + th.sujets[0] + " », en défendant la réponse « " + (side === "pour" ? "oui" : "non") + " », à partir d’un schéma (introduction avec thèse, un paragraphe par argument avec explication et exemple, un contre-argument réfuté, conclusion avec ouverture). Ici, ce n’est pas un résumé : l’élève peut et doit défendre une opinion.", max: 300, reference: [...args.map(a => "Argument possible : " + a[0] + " (ex. : " + a[1] + ")"), ...adverse.map(a => "Contre-argument possible : " + a[0])], criteres: ["L’introduction contient une accroche et la thèse.", "Chaque argument a son paragraphe, avec explication et exemple.", "Un contre-argument est présenté puis réfuté.", "La conclusion reformule la thèse et ouvre le débat.", "Les connecteurs sont variés et justes."] }} />
  </>;
}

export default function Atelier() {
  const { route, go } = useApp();
  const [mode, id] = route.sub;
  if (mode === "resume" && srcInfo(id)) return <AtelierResume id={id} />;
  if (mode === "ecrire" && THEMES.find(t => t.id === id)) return <AtelierEcrire id={id} />;
  return <>
    <div className="card"><h1>Ateliers : les trames à remplir</h1>
      <T>Chaque atelier te guide pas à pas avec une trame vide : repérer, schématiser, résumer, relire. Les débuts de phrases sont déjà écrits, et chaque case du résumé est placée à côté de la ligne de ton schéma qui lui correspond. À la fin, tu peux copier ton texte avec une consigne pour obtenir un retour d’une IA.</T></div>
    <h2>Schéma et résumé (les deux productions de l’examen)</h2>
    <div className="toc">{SOURCES.map(s => <button key={s.id} onClick={() => go("atelier", "resume", s.id)}><b>{s.titre}</b><span>{s.sub}</span></button>)}</div>
    <h2>Du schéma au texte argumentatif (le chemin inverse)</h2>
    <p className="small muted">Choisis un sujet de la bibliothèque : ses arguments forment ton schéma, et tu les déplies en paragraphes.</p>
    <div className="toc">{THEMES.map(t => <button key={t.id} onClick={() => go("atelier", "ecrire", t.id)}><b>{t.titre}</b><span>{t.sujets[0]}</span></button>)}</div>
  </>;
}
