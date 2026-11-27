import React, { useState, useMemo, Fragment } from "react";
import { T, Icon, ListenBtn, shuffle } from "./ui.jsx";
import { TEXTES, ROLES } from "./content/textes.js";
import { SCHEMA_LIVRE } from "./content/livre.js";
import { buildPrompt, copyText, countW } from "./content/prompts.js";

export const getText = id => TEXTES.find(t => t.id === id);
export const getSchema = id => (id === "livre" ? SCHEMA_LIVRE : getText(id).schema);
const join = a => (Array.isArray(a) ? a.join(" ") : a || "");

// ---------- Schéma argumentatif (lecture) ----------
// cell : clé de case (theme, these, contre, argN, explN, exN)
export function cellValue(s, key) {
  if (key === "theme") return s.theme; if (key === "these") return s.these; if (key === "contre") return s.contre || "";
  const m = key.match(/^(arg|expl|ex)(\d+)$/); if (!m) return "";
  const a = s.args[+m[2]]; if (!a) return "";
  return m[1] === "arg" ? a.arg : join(a[m[1]]);
}

function Cell({ s, k, label, hidden, values, setValue, showCorr, cls }) {
  const isHidden = hidden && hidden.includes(k);
  const v = cellValue(s, k);
  const m = k.match(/^(expl|ex)(\d+)$/);
  const list = m ? (s.args[+m[2]] || {})[m[1]] || [] : null;
  if (!isHidden) return <div className={"sc-cell " + (cls || "")}>{label && <span className="sc-lab">{label}</span>}{list ? (list.length ? (list.length > 1 ? <ul className="clean">{list.map((x, i) => <T as="li" key={i}>{x}</T>)}</ul> : <T>{list[0]}</T>) : <span className="muted small">—</span>) : v ? <T>{v}</T> : <span className="muted small">—</span>}</div>;
  return <div className={"sc-cell hole " + (cls || "")}>{label && <span className="sc-lab">{label}</span>}
    <textarea rows={2} value={values[k] || ""} onChange={e => setValue(k, e.target.value)} placeholder="À compléter…" aria-label={"À compléter : " + (label || k)} />
    {showCorr && <div className="sc-corr"><b>Corrigé :</b> {v || "—"}</div>}
  </div>;
}

export function SchemaView({ s, hidden, values = {}, setValue = () => { }, showCorr, title }) {
  const n = s.args.length;
  const p = { s, hidden, values, setValue, showCorr };
  return <div className="schema" role="group" aria-label={title || "Schéma argumentatif"}>
    <div className="sc-grid" style={{ gridTemplateRows: `auto repeat(${n}, auto)` }}>
      <div className="sc-head" style={{ gridColumn: 1 }}>A. Thème</div><div className="sc-head" style={{ gridColumn: 2 }}>B. Thèse</div>
      <div className="sc-head" style={{ gridColumn: 3 }}>C. Arguments</div><div className="sc-head" style={{ gridColumn: 4 }}>D. Explications</div><div className="sc-head" style={{ gridColumn: 5 }}>E. Exemples</div>
      <div style={{ gridColumn: 1, gridRow: `2 / span ${n}` }} className="sc-span"><Cell {...p} k="theme" cls="c-theme" label="Thème" /></div>
      <div style={{ gridColumn: 2, gridRow: `2 / span ${n}` }} className="sc-span"><Cell {...p} k="these" cls="c-these" label="Thèse" /></div>
      {s.args.map((a, i) => <Fragment key={i}>
        <div style={{ gridColumn: 3, gridRow: i + 2 }}><Cell {...p} k={"arg" + i} cls="c-arg" label={"Argument " + (i + 1)} /></div>
        <div style={{ gridColumn: 4, gridRow: i + 2 }}><Cell {...p} k={"expl" + i} cls="c-expl" label="Explication" /></div>
        <div style={{ gridColumn: 5, gridRow: i + 2 }}><Cell {...p} k={"ex" + i} cls="c-ex" label="Exemple" /></div>
      </Fragment>)}
    </div>
    {(s.contre || (hidden && hidden.includes("contre"))) && <Cell {...p} k="contre" cls="c-contre" label="Contre-argument / concession et réfutation" />}
    {s.autres && <div className="sc-cell c-autre"><span className="sc-lab">Autres fonctions (hors schéma)</span><ul className="clean">{s.autres.map((x, i) => <T as="li" key={i}>{x}</T>)}</ul></div>}
  </div>;
}

// ---------- Schéma éditable (trame vide) ----------
export const emptySchema = (n = 3) => ({ theme: "", these: "", contre: "", args: Array.from({ length: n }, () => ({ arg: "", expl: "", ex: "" })) });

export function SchemaEditor({ value, onChange, hints }) {
  const v = value || emptySchema();
  const set = patch => onChange({ ...v, ...patch });
  const setArg = (i, k, x) => set({ args: v.args.map((a, j) => (j === i ? { ...a, [k]: x } : a)) });
  const H = hints || {};
  return <div className="schema edit" role="group" aria-label="Mon schéma">
    <div className="sc-top">
      <label className="sc-cell c-theme"><span className="sc-lab">A. Thème <small>(le sujet, sans avis)</small></span><textarea rows={2} value={v.theme} onChange={e => set({ theme: e.target.value })} placeholder={H.theme || "De quoi parle le texte ?"} /></label>
      <label className="sc-cell c-these"><span className="sc-lab">B. Thèse <small>(l’opinion défendue)</small></span><textarea rows={2} value={v.these} onChange={e => set({ these: e.target.value })} placeholder={H.these || "Que pense l’auteur de ce sujet ?"} /></label>
    </div>
    {v.args.map((a, i) => <div className="sc-row" key={i}>
      <label className="sc-cell c-arg"><span className="sc-lab">C. Argument {i + 1}</span><textarea rows={2} value={a.arg} onChange={e => setArg(i, "arg", e.target.value)} placeholder="Pourquoi ? (une raison générale)" /></label>
      <span className="sc-arrow" aria-hidden="true">en effet →</span>
      <label className="sc-cell c-expl"><span className="sc-lab">D. Explication</span><textarea rows={2} value={a.expl} onChange={e => setArg(i, "expl", e.target.value)} placeholder="Comment ? En quoi ?" /></label>
      <span className="sc-arrow" aria-hidden="true">par ex. →</span>
      <label className="sc-cell c-ex"><span className="sc-lab">E. Exemple</span><textarea rows={2} value={a.ex} onChange={e => setArg(i, "ex", e.target.value)} placeholder="Un cas précis (facultatif)" /></label>
    </div>)}
    <div className="row">
      <button className="btn small" onClick={() => set({ args: [...v.args, { arg: "", expl: "", ex: "" }] })}><Icon n="plus" />Ajouter un argument</button>
      {v.args.length > 1 && <button className="btn small" onClick={() => set({ args: v.args.slice(0, -1) })}><Icon n="minus" />Retirer le dernier</button>}
    </div>
    <label className="sc-cell c-contre"><span className="sc-lab">Contre-argument / concession et réfutation <small>(s’il y en a)</small></span><textarea rows={2} value={v.contre} onChange={e => set({ contre: e.target.value })} placeholder="Certes… / On objecte que… → Pourtant…" /></label>
  </div>;
}
export const schemaToText = v => ["Thème : " + (v.theme || "…"), "Thèse : " + (v.these || "…"), ...v.args.map((a, i) => `Argument ${i + 1} : ${a.arg || "…"} | Explication : ${a.expl || "…"} | Exemple : ${a.ex || "—"}`), v.contre ? "Contre-argument et réfutation : " + v.contre : null].filter(Boolean).join("\n");
export const schemaRef = s => ["Thème : " + s.theme, "Thèse : " + s.these, ...s.args.map((a, i) => `Argument ${i + 1} : ${a.arg} (explication : ${join(a.expl)} ; exemples : ${join(a.ex) || "aucun"})`), ...(s.contre ? [s.contre] : [])];

// ---------- Texte coloré par rôles ----------
export function RoleLegend({ roles }) {
  return <div className="legend-roles">{roles.map(r => <span key={r} className={"rl r-" + r}><i />{ROLES[r].t}</span>)}</div>;
}
export function TextRoles({ id, colored = true, title = true }) {
  const t = getText(id);
  const used = [...new Set(t.paras.flat().map(s => s[0]))];
  return <div className="doc textroles">
    {title && <span className="dlab">« {t.titre} » · {t.auteur}</span>}
    {t.paras.map((p, i) => <p key={i}>{p.map(([r, s], j) => <Fragment key={j}><T as="span" className={colored ? "seg r-" + r : "seg"}>{s}</T>{" "}</Fragment>)}</p>)}
    <span className="src">{t.auteur}, {t.source}. Texte d’entraînement écrit pour cette application.</span>
    {colored && <RoleLegend roles={used} />}
  </div>;
}
export function PlainText({ id, open: o = false }) {
  const [open, setOpen] = useState(o);
  const t = getText(id);
  return <details className="doc" open={open} onToggle={e => setOpen(e.target.open)}>
    <summary><b>Texte : « {t.titre} »</b> <span className="muted small">({t.auteur} · niveau {t.niveau})</span></summary>
    {t.paras.map((p, i) => <T key={i}>{p.map(s => s[1]).join(" ")}</T>)}
    <span className="src">{t.auteur}, {t.source}. Texte d’entraînement écrit pour cette application.</span>
  </details>;
}

// ---------- Compteur de mots ----------
export function WordCount({ text, max }) {
  const n = countW(text);
  const over = max && n > max;
  return <span className={"tag " + (over ? "ko" : n ? "ok" : "")} role="status">{n} mot{n > 1 ? "s" : ""}{max ? " / " + max + " max" : ""}{over ? " : trop long" : ""}</span>;
}

// ---------- Copier pour l'IA ----------
export function CopyAI({ text, prompt, label = "mon texte" }) {
  const [msg, setMsg] = useState("");
  const [show, setShow] = useState(false);
  const p = useMemo(() => buildPrompt({ ...prompt, production: text }), [text, prompt]);
  const go = async (t, m) => { const ok = await copyText(t); setMsg(ok ? m : "La copie a échoué : sélectionne le texte et copie-le à la main."); setTimeout(() => setMsg(""), 4000); };
  return <div className="copyai">
    <div className="row">
      <button className="btn" disabled={!text.trim()} onClick={() => go(text, "Texte copié.")}><Icon n="copy" />Copier {label}</button>
      <button className="btn primary" disabled={!text.trim()} onClick={() => go(p, "Consigne et texte copiés : colle-les dans ton assistant IA.")}><Icon n="spark" />Copier pour un retour de l’IA</button>
      <button className="btn ghost small" onClick={() => setShow(s => !s)}><Icon n="eye" />{show ? "Masquer" : "Voir"} la consigne envoyée</button>
    </div>
    {msg && <p className="small" role="status" style={{ color: "var(--pos-strong)" }}>{msg}</p>}
    <p className="small muted">Le bouton bleu copie ton texte avec une consigne qui explique la tâche, la méthode et les critères à l’IA. Colle le tout dans l’assistant de ton choix : il te donnera un retour constructif, sans faire le travail à ta place.</p>
    {show && <pre className="prompt-view">{p}</pre>}
  </div>;
}

// ---------- Trame (champs guidés qui s'assemblent) ----------
// fields : [[clé, étiquette, début de phrase, aide?]]
export function Trame({ fields, value, onChange, side }) {
  const v = value || {};
  return <div className="trame">
    {fields.map(([k, lab, start, help], i) => <div key={k} className="trame-row">
      <label className="field"><span><span className="step-n">{i + 1}</span>{lab}</span>
        {help && <small>{help}</small>}
        <textarea rows={3} value={v[k] != null ? v[k] : start} onChange={e => onChange({ ...v, [k]: e.target.value })} /></label>
      {side && side[k] && <div className="trame-side">{side[k]}</div>}
    </div>)}
  </div>;
}
export const assemble = (fields, v) => fields.map(([k, , start]) => (v && v[k] != null ? v[k] : start)).map(x => String(x || "").trim()).filter(x => x && !fields.some(f => f[2].trim() === x)).join("\n\n");

// ---------- Exercice de marquage dans le texte ----------
export function MarkText({ id, roles, onResult }) {
  const t = getText(id);
  const flat = t.paras.flatMap((p, pi) => p.map((s, si) => ({ key: pi + "-" + si, role: s[0], text: s[1], pi })));
  const [cur, setCur] = useState(roles[1] || roles[0]);
  const [marks, setMarks] = useState({});
  const [checked, setChecked] = useState(false);
  const ok = flat.filter(s => marks[s.key] === s.role).length;
  const all = flat.every(s => marks[s.key]);
  return <div className="stack">
    <div className="palette" role="radiogroup" aria-label="Choisis un rôle, puis clique sur les phrases">
      {roles.map(r => <button key={r} role="radio" aria-checked={cur === r} className={"btn small rb r-" + r + (cur === r ? " on" : "")} onClick={() => setCur(r)}><i />{ROLES[r].t}</button>)}
    </div>
    <p className="small muted">Choisis un rôle ci-dessus, puis clique sur chaque phrase du texte. Clique à nouveau pour changer.</p>
    <div className="doc marktext">
      {t.paras.map((p, pi) => <p key={pi}>{flat.filter(s => s.pi === pi).map(s => {
        const m = marks[s.key]; const bad = checked && m !== s.role;
        return <Fragment key={s.key}><button type="button" className={"mk " + (m ? "r-" + m : "") + (checked ? (bad ? " bad" : " good") : "")} onClick={() => { if (!checked) setMarks(x => ({ ...x, [s.key]: cur })); }} aria-label={s.text + (m ? " : " + ROLES[m].t : "")}>{s.text}</button>
          {checked && bad && <span className="mk-fix">→ {ROLES[s.role].t}</span>}{" "}</Fragment>;
      })}</p>)}
    </div>
    <div className="row">
      {!checked ? <button className="btn primary" disabled={!all} onClick={() => { setChecked(true); onResult && onResult(ok === flat.length); }}>Vérifier</button>
        : <button className="btn" onClick={() => { setMarks({}); setChecked(false); }}><Icon n="reset" />Recommencer</button>}
      {!all && !checked && <span className="small muted">{Object.keys(marks).length} / {flat.length} phrases marquées</span>}
      {checked && <span className={"tag " + (ok === flat.length ? "ok" : "ko")}>{ok} / {flat.length} correctes</span>}
    </div>
    {checked && <div className="correction"><h4>Correction</h4><TextRoles id={id} title={false} /></div>}
  </div>;
}

// ---------- Remettre dans l'ordre ----------
export function OrderEx({ items, conclusion, onResult }) {
  const [order, setOrder] = useState(() => { let s = shuffle(items.map((_, i) => i)); if (s.every((x, i) => x === i)) s = s.reverse(); return s; });
  const [checked, setChecked] = useState(false);
  const move = (i, d) => setOrder(o => { const n = [...o]; const j = i + d; if (j < 0 || j >= n.length) return o; [n[i], n[j]] = [n[j], n[i]]; return n; });
  const ok = order.every((x, i) => x === i);
  return <div className="stack">
    <ol className="order">{order.map((x, i) => <li key={x} className={checked ? (x === i ? "good" : "bad") : ""}>
      <span className="row" style={{ flexWrap: "nowrap" }}><span className="ord-btns"><button className="btn small ghost" disabled={checked || i === 0} onClick={() => move(i, -1)} aria-label="Monter"><Icon n="up" /></button><button className="btn small ghost" disabled={checked || i === order.length - 1} onClick={() => move(i, 1)} aria-label="Descendre"><Icon n="down" /></button></span><T as="span">{items[x]}</T></span></li>)}</ol>
    <div className="row">{!checked ? <button className="btn primary" onClick={() => { setChecked(true); onResult && onResult(ok); }}>Vérifier</button> : <button className="btn" onClick={() => setChecked(false)}>Modifier</button>}</div>
    {checked && <div className={"feedback " + (ok ? "ok" : "ko")}><b>{ok ? "Bon ordre ! " : "Pas encore : les phrases en rouge sont mal placées. "}</b><T as="span">{conclusion}</T></div>}
  </div>;
}

// ---------- Carte d'argument du livre ----------
export function ArgCard({ id }) {
  const a = SCHEMA_LIVRE.args.find(x => x.id === id);
  return <div className="argcard">
    <div className="ac-head"><span className="tag acc">{a.id}</span><T as="b">{a.arg}</T><ListenBtn text={a.arg} /></div>
    <div className="ac-col c-expl"><span className="sc-lab">Explications (développement)</span><ul className="clean">{a.expl.map((x, i) => <T as="li" key={i}>{x}</T>)}</ul></div>
    <div className="ac-col c-ex"><span className="sc-lab">Exemples</span><ul className="clean">{a.ex.map((x, i) => <T as="li" key={i}>{x}</T>)}</ul></div>
    <p className="small muted">Fragments concernés : {a.fragments.join(" · ")}</p>
  </div>;
}
