// Synthèse vocale : Web Speech API, lecture phrase par phrase.
// Surlignage : la phrase en cours de lecture (pas de balayage mot à mot).
// Pause = on mémorise la phrase en cours ; Reprendre = on relit cette phrase depuis son début.

export const ttsSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";

const normLang = l => String(l || "").replace("_", "-").toLowerCase();
export const isFrench = v => normLang(v.lang).startsWith("fr");

// Classement : Google d'abord, puis voix neuronales (« Natural »), puis voix améliorées.
export function voiceScore(v) {
  const n = (v.name || "").toLowerCase(); const l = normLang(v.lang);
  let s = 0;
  if (n.includes("google")) s += 100;
  if (n.includes("natural") || n.includes("neural")) s += 80;
  if (n.includes("online")) s += 10;
  if (n.includes("premium") || n.includes("enhanced") || n.includes("amélior")) s += 40;
  if (l === "fr-fr") s += 20; else if (l.startsWith("fr")) s += 5;
  if (v.default) s += 2;
  return s;
}
export function frenchVoices() {
  if (!ttsSupported()) return [];
  return window.speechSynthesis.getVoices().filter(isFrench).sort((a, b) => voiceScore(b) - voiceScore(a));
}

/* ---------- Découpage du texte : lignes, phrases, mots ---------- */
const isWord = s => /[\p{L}\d]/u.test(s);
const silent = s => /^[—–«»"“”()]+$/.test(s);
const endsSentence = (tok, next) => /[.!?…]["»”)]*$/.test(tok) && (!next || /^[\p{Lu}\d—–«“"]/u.test(next));

// Registre des phrases affichées : clé → { text, starts }
export const REG = new Map();

// Renvoie les lignes d'un texte ; chaque ligne = liste de phrases ; chaque phrase = { key, toks, text, starts }.
export function segment(prefix, raw) {
  const lines = String(raw).split("\n");
  let si = 0; let bold = false;
  return lines.map(line => {
    const parts = line.split(/\s+/).filter(Boolean);
    const sents = []; let cur = null;
    parts.forEach((p, i) => {
      if (!cur) { cur = { key: prefix + "." + si++, toks: [] }; sents.push(cur); }
      let t = p; let b0 = bold;
      if (t.startsWith("**")) { t = t.slice(2); b0 = true; bold = true; }
      let closes = false;
      const m = t.match(/\*\*([^\p{L}\d]*)$/u);
      if (m) { t = t.slice(0, m.index) + m[1]; closes = true; }
      cur.toks.push({ t, word: isWord(t), b: b0 });
      if (closes) bold = false;
      if (endsSentence(t, parts[i + 1])) cur = null;
    });
    sents.forEach(s => {
      let text = ""; const starts = []; let wi = 0;
      s.toks.forEach(tk => {
        if (silent(tk.t)) { tk.wi = -1; return; }
        if (text) text += " ";
        if (tk.word) { tk.wi = wi++; starts.push(text.length); } else tk.wi = -1;
        text += tk.t;
      });
      s.text = text; s.starts = starts;
      REG.set(s.key, { key: s.key, text, starts });
    });
    return sents;
  });
}
export const cleanWord = s => s.replace(/^[^\p{L}\d]+|[^\p{L}\d]+$/gu, "");

/* ---------- Lecteur ---------- */
export class Speaker {
  constructor(getSettings) {
    this.getSettings = getSettings;
    this.gen = 0; this.queue = []; this.idx = 0; this.opts = {};
    this.snap = { status: "idle", mode: null, key: null, w: -1, error: null };
    this.listeners = new Set(); this.watchdog = null; this.saved = null; this.forceLocal = false;
  }
  sub = f => { this.listeners.add(f); return () => this.listeners.delete(f); };
  get = () => this.snap;
  setSnap(o) { this.snap = { ...this.snap, ...o }; this.listeners.forEach(f => f()); }

  pickVoice() {
    const list = frenchVoices(); if (!list.length) return null;
    const uri = this.getSettings().voiceURI;
    let v = (uri && list.find(x => x.voiceURI === uri)) || list[0];
    if (this.forceLocal && !v.localService) v = list.find(x => x.localService) || v;
    return v;
  }
  halt() {
    this.gen++; clearTimeout(this.watchdog);
    if (ttsSupported()) { try { window.speechSynthesis.cancel(); } catch (e) {} }
  }
  // items : [{ key, text, starts, fixedW? }]
  play(queue, from = 0, opts = {}) {
    if (!ttsSupported() || !queue.length) return;
    if (opts.mode === "single" && this.snap.mode === "page" && this.snap.status !== "idle")
      this.saved = { queue: this.queue, idx: this.idx, opts: this.opts };
    else if (opts.mode !== "single") this.saved = null;
    this.halt(); this.queue = queue; this.idx = Math.max(0, Math.min(from, queue.length - 1)); this.opts = opts;
    this.setSnap({ status: "playing", mode: opts.mode || "page", key: null, w: -1, error: null });
    const g = this.gen; setTimeout(() => { if (g === this.gen) this.speakCurrent(); }, 60);
  }
  wordAt(item, ci) {
    const st = item.starts; let w = 0;
    for (let i = 0; i < st.length; i++) if (st[i] <= ci) w = i; else break;
    return w;
  }
  speakCurrent(retry = false) {
    const g = this.gen; const item = this.queue[this.idx]; if (!item) return;
    const st = this.getSettings();
    const u = new window.SpeechSynthesisUtterance(item.text);
    const v = this.pickVoice();
    if (v) { u.voice = v; u.lang = v.lang.replace("_", "-"); } else u.lang = "fr-FR";
    u.rate = st.rate; u.pitch = st.pitch; u.volume = st.volume;
    // Saillance sur la phrase en cours uniquement (pas de balayage mot à mot).
    // Seul un mot touché par l'élève (fixedW) est mis en évidence.
    u.onstart = () => { if (g === this.gen) this.setSnap({ key: item.key, w: item.fixedW != null ? item.fixedW : -1 }); };
    u.onend = () => { if (g === this.gen) this.advance(); };
    u.onerror = e => {
      if (g !== this.gen || e.error === "interrupted" || e.error === "canceled") return;
      if (!retry && v && !v.localService && frenchVoices().some(x => x.localService)) {
        this.forceLocal = true; this.halt(); this.speakCurrent(true); return;
      }
      this.halt(); this.setSnap({ status: "idle", mode: null, key: null, w: -1, error: e.error || "erreur" });
    };
    const est = (item.text.length / (12 * Math.max(0.5, st.rate || 1))) * 1000;
    this.watchdog = setTimeout(() => { if (g === this.gen) this.advance(); }, est * 2.5 + 5000);
    try { window.speechSynthesis.resume(); } catch (e) {}
    window.speechSynthesis.speak(u);
  }
  advance() {
    clearTimeout(this.watchdog);
    if (this.idx + 1 < this.queue.length) {
      this.halt(); this.idx++; const g = this.gen;
      setTimeout(() => { if (g === this.gen) this.speakCurrent(); }, 40);
      return;
    }
    this.halt();
    const onEnd = this.opts.onEnd;
    if (this.opts.mode === "single" && this.saved) {
      const s = this.saved; this.saved = null; this.queue = s.queue; this.idx = s.idx; this.opts = s.opts;
      this.setSnap({ status: "paused", mode: "page", key: null, w: -1 });
    } else this.setSnap({ status: "idle", mode: null, key: null, w: -1 });
    if (onEnd) onEnd();
  }
  pause() {
    if (this.snap.status !== "playing") return;
    if (this.snap.mode === "single") { this.stop(); return; }
    this.halt(); this.setSnap({ status: "paused", w: -1 });
  }
  resume() { if (this.snap.status === "paused") this.play(this.queue, this.idx, this.opts); }
  stop() { this.halt(); this.saved = null; this.setSnap({ status: "idle", mode: null, key: null, w: -1 }); }
  say(text) { this.play([{ key: "__say", text, starts: [0], fixedW: -1 }], 0, { mode: "single" }); }
}
