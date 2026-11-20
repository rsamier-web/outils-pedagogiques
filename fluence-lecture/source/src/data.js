import { TEXTS } from "./texts.js";

/* ---------- Préparation des textes : mots, phrases, pages ---------- */
const isWord = s => /[\p{L}\d]/u.test(s);
const silentTok = s => /^[—–«»"]+$/.test(s);
const sentenceEnd = (tok, next) => /[.!?…]["»]?$/.test(tok) && (!next || /^[\p{Lu}—«]/u.test(next));

function prepare(t, index) {
  const tokens = []; const sentences = [];
  const pages = t.pages.map((lines, p) => {
    const pageSent = [];
    const lineToks = lines.map(line => {
      const parts = line.split(/\s+/).filter(Boolean); const ids = []; let cur = null;
      parts.forEach((part, i) => {
        if (!cur) { cur = { page: p, ids: [] }; sentences.push(cur); pageSent.push(sentences.length - 1); }
        const id = tokens.length;
        tokens.push({ t: part, word: isWord(part), s: sentences.length - 1, page: p });
        cur.ids.push(id); ids.push(id);
        if (sentenceEnd(part, parts[i + 1])) cur = null;
      });
      return ids;
    });
    return { lines: lineToks, sentences: pageSent };
  });
  // Texte prononcé de chaque phrase + position de chaque mot (pour le surlignage).
  sentences.forEach((s, si) => {
    let text = ""; const toks = [];
    for (const id of s.ids) {
      const tk = tokens[id]; if (silentTok(tk.t)) continue;
      if (text) text += " ";
      if (tk.word) toks.push({ tok: id, start: text.length, w: tk.t.replace(/[^\p{L}\d]/gu, "").length + 2 });
      text += tk.t;
    }
    s.item = { text, s: si, toks, chars: text.length };
  });
  const words = tokens.filter(x => x.word).length;
  return { ...t, index, tokens, sentences, pages, words };
}
export const PREP = TEXTS.map(prepare);
export const cleanWord = s => s.replace(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, "");

/* ---------- Objectifs de vitesse (mêmes paliers que les fiches papier) ---------- */
export const LEVELS = [
  { e: "🚀", n: "la fusée", wpm: 108 },
  { e: "✈️", n: "l’avion", wpm: 99 },
  { e: "🏎️", n: "la voiture de course", wpm: 91 },
  { e: "🏍️", n: "la moto", wpm: 83 },
  { e: "🚗", n: "la voiture", wpm: 75 },
  { e: "🛵", n: "le scooter", wpm: 66 },
  { e: "🚲", n: "le vélo", wpm: 58 },
  { e: "🛼", n: "les rollers", wpm: 50 },
  { e: "🛴", n: "la trottinette", wpm: 41 },
];
export const thresholds = words => LEVELS.map(l => Math.round((words / l.wpm) * 60));
// Indice du palier atteint (0 = fusée), ou -1 si plus lent que la trottinette.
export function levelOf(words, ms) {
  const sec = ms / 1000; const th = thresholds(words);
  for (let i = 0; i < th.length; i++) if (sec < th[i]) return i;
  return -1;
}
export const tooFast = (words, ms) => ms / 1000 < (words / 220) * 60;
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
export const LS_KEY = "fluence-lecture-v1";
export const WEEK_GOAL = 5;
export const REST_PER_WEEK = 7 - WEEK_GOAL;
export const defaultSettings = () => ({
  font: "andika", size: 22, lh: 1.8, spacing: false,
  voiceURI: "", rate: 0.9, pitch: 1, volume: 1,
  highlight: true, clickMode: "word", autoNext: false, showTimer: false,
});
export const newData = () => ({ settings: defaultSettings(), cur: 0, texts: {}, readings: [], days: [], best: 0, unlockAll: false });
export function loadData() {
  try {
    const s = JSON.parse(localStorage.getItem(LS_KEY));
    if (s && s.settings) return { ...newData(), ...s, settings: { ...defaultSettings(), ...s.settings } };
  } catch (e) {}
  return newData();
}
export function saveData(d) { try { localStorage.setItem(LS_KEY, JSON.stringify(d)); } catch (e) {} }
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
  const P = PREP[ti]; const st = textState(data, P.id); const tk = dayKey(now);
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
