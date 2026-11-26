import React, { createContext, useContext, Fragment } from "react";
import { GLOSSAIRE } from "./content/glossaire.js";

export const AppCtx = createContext(null);
export const useApp = () => useContext(AppCtx);

export const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[’']/g, "'").trim();
const GIDX = new Map();
GLOSSAIRE.forEach(g => {
  GIDX.set(norm(g.id), g); GIDX.set(norm(g.terme), g);
  (g.alias || []).forEach(a => GIDX.set(norm(a), g));
});
export function findTerm(key) {
  const k = norm(key);
  return GIDX.get(k) || GIDX.get(k.replace(/s$/, "")) || GIDX.get(k.replace(/x$/, "")) || GIDX.get(k.replace(/es$/, "")) || null;
}

// Découpe en phrases : ponctuation forte suivie d'un espace et d'une majuscule, d'un chiffre ou d'un guillemet.
function sentences(text) {
  const out = []; let start = 0;
  const re = /([.!?…])(\s+)(?=[«"(A-ZÀ-ÖØ-Ý0-9])/g; let m;
  while ((m = re.exec(text))) {
    const before = text.slice(Math.max(0, m.index - 4), m.index + 1);
    if (/\b(env|cf|ex|av|apr|J\.-C|p|km|hab|etc|M|Mme|St|n°)\.$/i.test(before) || /\b[A-Z]\.$/.test(before)) continue;
    out.push(text.slice(start, m.index + 1)); start = m.index + 1 + m[2].length;
  }
  if (start < text.length) out.push(text.slice(start));
  return out.filter(s => s.trim());
}
// Jetons : texte, **gras**, [[terme]] ou [[affiché|terme]]
function tokens(s) {
  const out = []; const re = /\*\*(.+?)\*\*|\[\[(.+?)\]\]/g; let last = 0, m;
  while ((m = re.exec(s))) {
    if (m.index > last) out.push({ t: "txt", v: s.slice(last, m.index) });
    if (m[1] != null) out.push({ t: "b", v: m[1] });
    else { const [key, shown] = m[2].split("|"); out.push({ t: "term", v: shown || key, key }); }
    last = re.lastIndex;
  }
  if (last < s.length) out.push({ t: "txt", v: s.slice(last) });
  return out;
}
function words(str, kp) {
  const parts = str.split(/(\s+)/);
  return parts.map((p, i) => /^\s+$/.test(p) || p === "" ? p : <span className="w" key={kp + i}>{p}</span>);
}
function sentenceNodes(s, si) {
  return tokens(s).map((tk, i) => {
    if (tk.t === "txt") return <Fragment key={i}>{words(tk.v, si + "-" + i + "-")}</Fragment>;
    if (tk.t === "b") return <strong key={i}>{sentenceNodes(tk.v, si + "-" + i)}</strong>;
    const g = findTerm(tk.key);
    if (!g) return <Fragment key={i}>{words(tk.v, si + "-" + i + "-")}</Fragment>;
    return <button type="button" key={i} className="term" data-term={g.id} aria-label={tk.v + " : voir la définition"}>{words(tk.v, si + "-" + i + "-")}</button>;
  });
}

// Texte lisible à voix haute (phrases .s et mots .w) avec termes du glossaire
export function T({ children, as = "p", className, style }) {
  const text = Array.isArray(children) ? children.join("") : String(children ?? "");
  const Tag = as;
  return <Tag className={className} style={style}>{sentences(text).map((s, i) => <Fragment key={i}><span className="s">{sentenceNodes(s, i)}</span>{" "}</Fragment>)}</Tag>;
}
export const Li = ({ children }) => <T as="li">{children}</T>;

export function Box({ kind = "retenir", label, children }) {
  const lab = label || ({ retenir: "À retenir", attention: "Attention", methode: "Méthode", info: "Pour aller plus loin" })[kind];
  return <div className={"box " + (kind === "info" ? "" : kind)}><span className="lab">{lab}</span>{children}</div>;
}

export function Progress({ value }) {
  return <div className="progress" role="progressbar" aria-valuenow={Math.round(value * 100)} aria-valuemin="0" aria-valuemax="100"><span style={{ width: Math.round(value * 100) + "%" }} /></div>;
}

const P = {
  home: "M3 10.5 12 3l9 7.5V21h-6v-6H9v6H3z",
  book: "M4 4.5A2.5 2.5 0 0 1 6.5 2H20v17H6.5A2.5 2.5 0 0 0 4 21.5zM4 21.5A2.5 2.5 0 0 1 6.5 19H20v3H6.5",
  map: "M9 3 3 5.5v15L9 18l6 3 6-2.5v-15L15 6 9 3zm0 0v15m6-12v15",
  abc: "M4 19 8 5l4 14M5.5 14h5M15 5h3a2.5 2.5 0 0 1 0 5h-3zm0 5h3.5a2.5 2.5 0 0 1 0 5H15z",
  cards: "M4 7h12v13H4zM8 4h12v13",
  quiz: "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zm-2.5-13a2.5 2.5 0 1 1 3.5 2.3c-.6.3-1 .9-1 1.6V14m0 3v.5",
  pen: "M4 20h4L19 9l-4-4L4 16zM14 6l4 4",
  doc: "M6 2h9l5 5v15H6zM14 2v6h6M9 13h8M9 17h8",
  gear: "M12 15a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm8.6-3a8.6 8.6 0 0 0-.1-1.3l2-1.6-2-3.4-2.4 1a8 8 0 0 0-2.2-1.3L15.5 3h-4l-.4 2.4a8 8 0 0 0-2.2 1.3l-2.4-1-2 3.4 2 1.6a8.6 8.6 0 0 0 0 2.6l-2 1.6 2 3.4 2.4-1a8 8 0 0 0 2.2 1.3l.4 2.4h4l.4-2.4a8 8 0 0 0 2.2-1.3l2.4 1 2-3.4-2-1.6c.1-.4.1-.9.1-1.3z",
  play: "M7 4v16l13-8z", pause: "M7 4h4v16H7zm6 0h4v16h-4z", stop: "M6 6h12v12H6z",
  menu: "M3 6h18M3 12h18M3 18h18", speaker: "M4 9v6h4l5 4V5L8 9zm12-1a5 5 0 0 1 0 8m2-11a9 9 0 0 1 0 14",
  left: "M15 5l-7 7 7 7", right: "M9 5l7 7-7 7", check: "M4 12l5 5L20 6", x: "M6 6l12 12M18 6 6 18", print: "M6 9V2h12v7M6 18H4v-7h16v7h-2M6 14h12v8H6z",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7S2 12 2 12zm10 3a3 3 0 1 0 0-6 3 3 0 0 0 0 6z", shuffle: "M16 3h5v5M4 20 21 3M21 16v5h-5M15 15l6 6M4 4l5 5",
};
export function Icon({ n, ...p }) {
  return <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" {...p}><path d={P[n]} /></svg>;
}

export function shuffle(a, seed) {
  const r = [...a];
  let s = seed == null ? Math.random() * 1e9 : seed;
  const rnd = () => { s = (s * 9301 + 49297) % 233280; return s / 233280; };
  for (let i = r.length - 1; i > 0; i--) { const j = Math.floor((seed == null ? Math.random() : rnd()) * (i + 1)); [r[i], r[j]] = [r[j], r[i]]; }
  return r;
}

export function ListenBtn({ text, label = "Écouter", small = true }) {
  const { reader } = useApp();
  return <button className={"btn ghost" + (small ? " small" : "")} onClick={() => reader.say(text)} aria-label={label + " : " + text.slice(0, 40)} title={label}><Icon n="speaker" /></button>;
}
