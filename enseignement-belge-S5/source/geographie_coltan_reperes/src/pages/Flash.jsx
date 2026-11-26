import React, { useState, useMemo, useEffect } from "react";
import { useApp, T, Icon, ListenBtn, shuffle, Progress } from "../ui.jsx";
import { buildDecks } from "../content/flashcards.js";
import { schedule, fmtDelay, isMature, newState } from "../srs.js";
import { load, save, usePersist, today } from "../store.js";
import MapView from "../MapView.jsx";
import { SCENES } from "../scenes.js";

const DECKS = buildDecks();
const DEFAULT_DECKS = DECKS.map(d => d.id);
const MIN = 60000;

function activeCards() {
  const act = new Set(load("decks", DEFAULT_DECKS));
  return DECKS.filter(d => act.has(d.id)).flatMap(d => d.cards.map(c => ({ ...c, deck: d.id })));
}
function newLeftToday() {
  const S = load("settings", {}); const per = S.newPerDay || 15;
  const day = load("srsDay", { date: "", n: 0 });
  return Math.max(0, per - (day.date === today() ? day.n : 0));
}
export function dueCount() {
  const srs = load("srs", {}); const now = Date.now();
  const cards = activeCards();
  const due = cards.filter(c => srs[c.id] && srs[c.id].due <= now).length;
  const nNew = cards.filter(c => !srs[c.id]).length;
  return due + Math.min(nNew, newLeftToday());
}

function Front({ c, reverse }) {
  if (c.kind === "map") return <div style={{ width: "100%" }} className="stack"><div className="front">{c.front}</div>
    <MapView id={c.scene} mode="show" marks={{ [c.item]: "hl" }} focusId={c.item} hideLegend showCaption={false} height="48vh" toggles={{ provinces: c.layer === "provinces" }} theme={SCENES[c.scene].themes ? SCENES[c.scene].themes[0][0] : undefined} /></div>;
  if (c.kind === "voc" && reverse) return <><span className="tag">Quel est le mot ?</span><T className="front" as="div">{c.back}</T></>;
  return <><T className="front" as="div">{c.front}</T><ListenBtn text={c.front} /></>;
}
function Back({ c, reverse }) {
  if (c.kind === "map") return <div className="back"><b style={{ fontSize: "1.2rem" }}>{c.back}</b><ListenBtn text={c.back} /></div>;
  if (c.kind === "voc") return <div className="back">{reverse ? <b style={{ fontSize: "1.2rem" }}>{c.front}</b> : <T>{c.back}</T>}<T className="ex">{"Exemple : " + c.ex}</T><ListenBtn text={(reverse ? c.front + ". " : "") + c.back + " Exemple : " + c.ex} /></div>;
  return <div className="back"><T>{c.back}</T><ListenBtn text={c.back} /></div>;
}

function Session({ onEnd }) {
  const [srs, setSrs] = usePersist("srs", {});
  const [reverse, setReverse] = usePersist("reverse", false);
  const [queue, setQueue] = useState(() => {
    const now = Date.now(); const cards = activeCards();
    const due = cards.filter(c => srs[c.id] && srs[c.id].due <= now).sort((a, b) => srs[a.id].due - srs[b.id].due);
    const fresh = shuffle(cards.filter(c => !srs[c.id])).slice(0, newLeftToday());
    // alternance : nouvelles cartes intercalées entre les révisions
    const q = []; let i = 0, j = 0;
    while (i < due.length || j < fresh.length) { if (i < due.length) q.push(due[i++]); if (i < due.length) q.push(due[i++]); if (j < fresh.length) q.push(fresh[j++]); }
    return q;
  });
  const [total] = useState(queue.length);
  const [done, setDone] = useState(0);
  const [show, setShow] = useState(false);
  const c = queue[0];
  useEffect(() => { setShow(false); }, [c && c.id, queue.length]);
  useEffect(() => {
    const k = e => {
      if (e.target.closest("input,textarea,select")) return;
      if (!show && (e.key === " " || e.key === "Enter")) { e.preventDefault(); setShow(true); }
      else if (show && ["1", "2", "3", "4"].includes(e.key)) grade(+e.key - 1);
    };
    window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k);
  });
  if (!c) return <div className="card"><h2>Séance terminée !</h2><T>Bravo : tu as revu toutes les cartes prévues aujourd’hui. Reviens demain : l’application te reproposera les cartes au bon moment.</T><button className="btn primary" onClick={onEnd} style={{ alignSelf: "flex-start" }}>Retour aux paquets</button></div>;
  const st = srs[c.id];
  function grade(g) {
    const now = Date.now();
    const ns = schedule(st, g, now);
    setSrs(s => ({ ...s, [c.id]: ns }));
    if (!st) { const day = load("srsDay", { date: "", n: 0 }); save("srsDay", { date: today(), n: (day.date === today() ? day.n : 0) + 1 }); }
    setQueue(q => { const rest = q.slice(1); if (ns.due - now < 20 * MIN) { const pos = Math.min(rest.length, g === 0 ? 3 : 6); rest.splice(pos, 0, c); } return rest; });
    setDone(d => d + 1);
  }
  const prev = g => fmtDelay(schedule(st, g).due - Date.now());
  return <div className="stack">
    <div className="row between"><span className="small muted">{done} réponse{done > 1 ? "s" : ""} · reste {queue.length} carte{queue.length > 1 ? "s" : ""}</span>
      <span className="row">{c.kind === "voc" && <label className="chk small"><input type="checkbox" checked={reverse} onChange={e => setReverse(e.target.checked)} /><span>Sens inverse (définition → mot)</span></label>}<button className="btn small" onClick={onEnd}>Arrêter</button></span></div>
    <Progress value={total ? Math.min(1, done / (total + 2)) : 1} />
    <div className="flash-card" aria-live="polite">
      {!st && <span className="tag acc">Nouvelle carte</span>}
      <Front c={c} reverse={reverse} />
      {show && <Back c={c} reverse={reverse} />}
    </div>
    {!show ? <button className="btn primary" onClick={() => setShow(true)}><Icon n="eye" />Afficher la réponse <small className="muted">(Espace)</small></button> :
      <div className="grade" role="group" aria-label="As-tu retrouvé la réponse ?">
        <button className="btn again" onClick={() => grade(0)}>À revoir<small>{prev(0)} · touche 1</small></button>
        <button className="btn hard" onClick={() => grade(1)}>Difficile<small>{prev(1)} · 2</small></button>
        <button className="btn good" onClick={() => grade(2)}>Bien<small>{prev(2)} · 3</small></button>
        <button className="btn easy" onClick={() => grade(3)}>Facile<small>{prev(3)} · 4</small></button>
      </div>}
    <p className="small muted">Sois honnête : « À revoir » si tu n’as pas trouvé, « Difficile » si tu as hésité longtemps, « Bien » si tu as trouvé, « Facile » si c’était immédiat.</p>
  </div>;
}

export default function Flash() {
  const [decks, setDecks] = usePersist("decks", DEFAULT_DECKS);
  const [run, setRun] = useState(false);
  const srs = load("srs", {});
  const now = Date.now();
  const due = dueCount();
  if (run) return <Session onEnd={() => setRun(false)} />;
  const stats = d => { const cs = d.cards; return { n: cs.length, fresh: cs.filter(c => !srs[c.id]).length, due: cs.filter(c => srs[c.id] && srs[c.id].due <= now).length, mature: cs.filter(c => isMature(srs[c.id])).length }; };
  const toggle = id => setDecks(ds => ds.includes(id) ? ds.filter(x => x !== id) : [...ds, id]);
  const groups = [["Vocabulaire", DECKS.filter(d => d.kind === "voc")], ["Notions", DECKS.filter(d => d.kind === "qa")], ["Cartes (repères spatiaux)", DECKS.filter(d => d.kind === "map")]];
  return <>
    <div className="card">
      <h1>Cartes mémoire</h1>
      <T>Comme dans Anki, chaque carte revient au bon moment : juste avant que tu l’oublies. Essaie de répondre de tête, retourne la carte, puis dis honnêtement si tu avais trouvé.</T>
      <div className="row"><button className="btn primary" disabled={due === 0} onClick={() => setRun(true)}><Icon n="cards" />{due ? `Commencer la séance (${due} carte${due > 1 ? "s" : ""})` : "Rien à revoir pour l’instant"}</button></div>
      {due === 0 && <p className="small muted">Toutes les cartes prévues sont faites. Tu peux ajouter des paquets ci-dessous ou augmenter le nombre de nouvelles cartes par jour dans les réglages.</p>}
    </div>
    {groups.map(([t, ds]) => <section key={t} className="stack"><h2>{t}</h2>
      <div className="grid3">{ds.map(d => { const s = stats(d); return <label key={d.id} className="card flat" style={{ cursor: "pointer", gap: ".35rem" }}>
        <span className="row" style={{ flexWrap: "nowrap", alignItems: "flex-start" }}><input type="checkbox" checked={decks.includes(d.id)} onChange={() => toggle(d.id)} style={{ marginTop: ".3rem", accentColor: "var(--accent)" }} /><b>{d.t}</b></span>
        <span className="small muted">{s.n} cartes · {s.fresh} nouvelles · {s.due} à revoir · {s.mature} bien acquises</span>
        <Progress value={s.n ? (s.n - s.fresh) / s.n : 0} />
      </label>; })}</div></section>)}
  </>;
}
