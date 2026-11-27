import { TEXTS as T_CYCLE3 } from "./texts-cycle3.js";
import { TEXTS as T_COLLEGE } from "./texts-college.js";

/* ---------- Préparation des textes : mots, phrases, pages ---------- */
const isWord = s => /[\p{L}\d]/u.test(s);
const silentTok = s => /^[—–«»"]+$/.test(s);
const sentenceEnd = (tok, next) => /[.!?…]["»]?$/.test(tok) && (!next || /^[\p{Lu}—«]/u.test(next));

function prepare(t, index, series) {
  const tokens = []; const sentences = []; const lineItems = [];
  const pages = t.pages.map((lines, p) => {
    const pageSent = []; const pageLines = [];
    const lineToks = lines.map(line => {
      const l = lineItems.length; lineItems.push(null); pageLines.push(l);
      const parts = line.split(/\s+/).filter(Boolean); const ids = []; let cur = null;
      parts.forEach((part, i) => {
        if (!cur) { cur = { page: p, ids: [] }; sentences.push(cur); pageSent.push(sentences.length - 1); }
        const id = tokens.length;
        tokens.push({ t: part, word: isWord(part), s: sentences.length - 1, l, page: p });
        cur.ids.push(id); ids.push(id);
        if (sentenceEnd(part, parts[i + 1])) cur = null;
      });
      lineItems[l] = { ids };
      return ids;
    });
    return { lines: lineToks, lineIdx: pageLines, sentences: pageSent };
  });
  const speakText = ids => ids.map(id => tokens[id].t).filter(x => !silentTok(x)).join(" ");
  lineItems.forEach((li, l) => { const text = speakText(li.ids); li.item = { text, s: l, toks: [], chars: text.length }; });
  // Texte prononcé de chaque phrase (clic « la phrase »).
  sentences.forEach(s => { const text = speakText(s.ids); s.item = { text, s: -1, toks: [], chars: text.length }; });
  const words = tokens.filter(x => x.word).length;
  return { ...t, index, series, tokens, sentences, lineItems, pages, words };
}
export const cleanWord = s => s.replace(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, "");

/* ---------- Paliers de vitesse : les tempos musicaux (du plus rapide au plus lent) ----------
   Couleurs : dégradé bleu ciel → indigo (aucune connotation vert / orange / rouge).
   Les temps cibles dépendent de la série de textes de l'élève. */
export const LEVELS = [
  { n: "Presto", c: "#4a2d85" }, { n: "Vivace", c: "#4c47a3" }, { n: "Allegro", c: "#4561bb" },
  { n: "Allegretto", c: "#3a7ccf" }, { n: "Moderato", c: "#3d9ae0" }, { n: "Andante", c: "#62b2e6" },
  { n: "Adagio", c: "#8dc8ee" }, { n: "Lento", c: "#b4dbf4" }, { n: "Largo", c: "#d6ecfa" },
];

/* ---------- Les deux séries de textes ---------- */
export const SERIES = {
  cycle3: {
    id: "cycle3", label: "Cycle 3 · Aventures dans un monde de blocs", short: "Cycle 3",
    hint: "Récits courts inspirés de Minecraft (environ 150 à 280 mots).",
    wpm: [108, 99, 91, 83, 75, 66, 58, 50, 41], fast: 220,
    preview: ["Je casse du bois avec mes mains.", "Je fabrique une table et une pioche."],
  },
  college: {
    id: "college", label: "Collège · Carnets du monde", short: "Collège",
    hint: "Art, voyages et cultures du monde (environ 280 à 370 mots), narrateur sans marque de genre.",
    wpm: [170, 155, 142, 130, 118, 106, 94, 82, 70], fast: 260,
    preview: ["Dans la médina, les ruelles sont étroites.", "Ça sent le cuir, la menthe et le pain chaud."],
  },
};
SERIES.cycle3.texts = T_CYCLE3.map((t, i) => prepare(t, i, "cycle3"));
SERIES.college.texts = T_COLLEGE.map((t, i) => prepare(t, i, "college"));
export const SERIES_IDS = ["cycle3", "college"];
export const seriesOf = data => SERIES[data && data.series] || SERIES.cycle3;
export const textsOf = data => seriesOf(data).texts;
export const textById = id => SERIES.cycle3.texts.concat(SERIES.college.texts).find(t => t.id === id);

export const thresholds = P => SERIES[P.series].wpm.map(w => Math.round((P.words / w) * 60));
// Indice du palier atteint (0 = presto), ou -1 si plus lent que largo.
export function levelOf(P, ms) {
  const sec = ms / 1000; const th = thresholds(P);
  for (let i = 0; i < th.length; i++) if (sec < th[i]) return i;
  return -1;
}
export const tooFast = (P, ms) => ms / 1000 < (P.words / SERIES[P.series].fast) * 60;
export function fmtTime(ms) {
  const sec = Math.round(ms / 1000); const m = Math.floor(sec / 60); const s = sec % 60;
  return `${m}'${String(s).padStart(2, "0")}"`;
}
export const fmtSec = sec => fmtTime(sec * 1000);

/* ---------- Dates locales ---------- */
const pad = n => String(n).padStart(2, "0");
export const dayKey = d => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const parseKey = k => { const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d); };
export const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const monday = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); return addDays(x, -((x.getDay() + 6) % 7)); };
export const todayKey = () => dayKey(new Date());
export const diffDays = (a, b) => Math.round((parseKey(b) - parseKey(a)) / 86400000);

/* ---------- Sauvegarde ---------- */
export const LS_KEY = "fluence-enseignant-v1";
export const WEEK_GOAL = 5;
export const REST_PER_WEEK = 7 - WEEK_GOAL;
export const defaultSettings = () => ({
  font: "andika", size: 22, lh: 1.8, spacing: false,
  voiceURI: "", rate: 0.9, pitch: 1, volume: 1,
  highlight: true, clickMode: "word", autoNext: false, showTimer: false,
});
/* Une sauvegarde pour toute la classe : un profil par élève.
   Chaque profil garde ses réglages, sa série de jours et une progression par série de textes. */
export const newProg = () => ({ cur: 0, texts: {}, readings: [], unlockAll: false });
export const newProfile = (name, series = "cycle3") => ({
  name, series, created: Date.now(), settings: defaultSettings(), days: [], best: 0,
  prog: { cycle3: newProg(), college: newProg() },
});
export const newStore = () => ({ profiles: {}, order: [], cur: null });
export function fixProfile(p) {
  const q = { ...newProfile(p.name || "Élève", SERIES[p.series] ? p.series : "cycle3"), ...p };
  q.settings = { ...defaultSettings(), ...(p.settings || {}) };
  q.prog = { cycle3: { ...newProg(), ...((p.prog || {}).cycle3 || {}) }, college: { ...newProg(), ...((p.prog || {}).college || {}) } };
  q.days = Array.isArray(p.days) ? p.days : []; q.best = p.best || 0;
  return q;
}
export function loadStore() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY));
    if (s && s.profiles) {
      const st = { ...newStore(), ...s };
      Object.keys(st.profiles).forEach(id => { st.profiles[id] = fixProfile(st.profiles[id]); });
      st.order = st.order.filter(id => st.profiles[id]);
      if (!st.profiles[st.cur]) st.cur = st.order[0] || null;
      return st;
    }
  } catch (e) {}
  return newStore();
}
export function saveStore(s) { try { localStorage.setItem(LS_KEY, JSON.stringify(s)); } catch (e) {} }
export const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
// Ce que manipulent les écrans de lecture : la progression de l'élève dans sa série actuelle.
export function viewOf(p) {
  const g = p.prog[p.series];
  return { series: p.series, settings: p.settings, days: p.days, best: p.best, cur: g.cur, texts: g.texts, readings: g.readings, unlockAll: g.unlockAll };
}
export function writeBack(p, d) {
  p.settings = d.settings; p.days = d.days; p.best = d.best;
  p.prog[p.series] = { cur: d.cur, texts: d.texts, readings: d.readings, unlockAll: d.unlockAll };
}
// Reprise d'une progression enregistrée par les applications « Fluence de lecture » / « Carnets du monde ».
export const SINGLE_APPS = [
  { key: "fluence-lecture-v1", series: "cycle3", label: "Fluence de lecture (cycle 3)" },
  { key: "fluence-college-v1", series: "college", label: "Carnets du monde (collège)" },
];
export function fromSingleApp(raw, series, name) {
  const p = newProfile(name, series);
  p.settings = { ...defaultSettings(), ...(raw.settings || {}) };
  p.days = Array.isArray(raw.days) ? raw.days : []; p.best = raw.best || 0;
  p.prog[series] = { cur: raw.cur || 0, texts: raw.texts || {}, readings: raw.readings || [], unlockAll: !!raw.unlockAll };
  return p;
}
export const textState = (data, id) => data.texts[id] || { start: null, page: 0, done: false };

/* ---------- Série : 5 jours par semaine, 2 jours de repos tolérés (lundi → dimanche) ---------- */
export function computeStreak(daysArr, now = new Date()) {
  const days = new Set(daysArr);
  let d = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  if (!days.has(dayKey(d))) d = addDays(d, -1);
  const first = daysArr.length ? daysArr.slice().sort()[0] : null;
  let count = 0; const missed = {};
  for (let i = 0; i < 4000 && first && dayKey(d) >= first; i++) {
    const k = dayKey(d);
    if (days.has(k)) count++;
    else { const w = dayKey(monday(d)); missed[w] = (missed[w] || 0) + 1; if (missed[w] > REST_PER_WEEK) break; }
    d = addDays(d, -1);
  }
  return count;
}
export function weekInfo(daysArr, now = new Date()) {
  const days = new Set(daysArr); const start = monday(now); const tk = dayKey(now);
  const first = daysArr.length ? daysArr.slice().sort()[0] : tk;
  const out = []; let done = 0, missed = 0;
  for (let i = 0; i < 7; i++) {
    const k = dayKey(addDays(start, i)); let st;
    if (days.has(k)) { st = "done"; done++; }
    else if (k === tk) st = "today";
    else if (k < tk && k > first) { st = "rest"; missed++; }
    else st = "future";
    out.push({ k, st, label: ["L", "M", "M", "J", "V", "S", "D"][i], full: ["lundi", "mardi", "mercredi", "jeudi", "vendredi", "samedi", "dimanche"][i] });
  }
  return { list: out, done, missed, restLeft: Math.max(0, REST_PER_WEEK - missed) };
}

/* ---------- Semaine de travail sur un texte ---------- */
export function textWeek(data, ti, now = new Date()) {
  const P = textsOf(data)[ti]; const st = textState(data, P.id); const tk = dayKey(now);
  const mine = data.readings.filter(r => r.id === P.id);
  if (!st.start) return { started: false, day: 0, count: 0, over: false, grid: [], best: null, mine };
  const day = diffDays(st.start, tk) + 1;
  const grid = [];
  for (let i = 0; i < 7; i++) {
    const k = dayKey(addDays(parseKey(st.start), i));
    const rs = mine.filter(r => r.d === k);
    grid.push({ k, i, best: rs.length ? Math.min(...rs.map(r => r.ms)) : null, n: rs.length, today: k === tk, future: k > tk });
  }
  const inWeek = new Set(mine.filter(r => r.d >= st.start && diffDays(st.start, r.d) < 7).map(r => r.d));
  const best = mine.length ? Math.min(...mine.map(r => r.ms)) : null;
  return { started: true, day, count: inWeek.size, over: day > 7, grid, best, mine, after: mine.filter(r => diffDays(st.start, r.d) >= 7).length };
}
