// Synthèse vocale : Web Speech API, lecture ligne par ligne.
// Pause = on mémorise la ligne en cours et on coupe ; Reprendre = on relit
// cette ligne depuis son début (fiable dans Chrome, Android compris).

export const ttsSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";

const normLang = l => String(l || "").replace("_", "-").toLowerCase();
export const isFrench = v => normLang(v.lang).startsWith("fr");

// Classement des voix françaises : Google d'abord, puis voix neuronales
// (Edge « Online (Natural) »), puis voix améliorées, puis le reste.
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

export class Speaker {
  constructor(getSettings) {
    this.getSettings = getSettings;
    this.gen = 0; this.queue = []; this.idx = 0; this.opts = {};
    this.snap = { status: "idle", mode: null, s: -1, w: -1, error: null };
    this.listeners = new Set(); this.timer = null; this.watchdog = null; this.saved = null;
    this.forceLocal = false;
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
  // item : { text, s, toks: [{ tok, start, w }], chars }
  play(queue, from, opts = {}) {
    if (!ttsSupported() || !queue.length) return;
    if (opts.mode === "single" && this.snap.mode === "page" && this.snap.status !== "idle")
      this.saved = { queue: this.queue, idx: this.idx, opts: this.opts };
    else if (opts.mode !== "single") this.saved = null;
    this.halt(); this.queue = queue; this.idx = Math.max(0, Math.min(from, queue.length - 1)); this.opts = opts;
    this.setSnap({ status: "playing", mode: opts.mode || "page", s: -1, w: -1, error: null });
    const g = this.gen; setTimeout(() => { if (g === this.gen) this.speakCurrent(); }, 70);
  }
  speakCurrent(retry = false) {
    const g = this.gen; const item = this.queue[this.idx]; if (!item) return;
    const st = this.getSettings();
    const u = new window.SpeechSynthesisUtterance(item.text);
    const v = this.pickVoice();
    if (v) { u.voice = v; u.lang = v.lang.replace("_", "-"); } else u.lang = "fr-FR";
    u.rate = st.rate; u.pitch = st.pitch; u.volume = st.volume;
    this.utter = u;
    const first = item.toks[0] ? item.toks[0].tok : -1;
    // Surlignage : l'unité lue (ligne) est surlignée du début à la fin de l'énoncé.
    u.onstart = () => { if (g === this.gen) this.setSnap({ s: item.s, w: first }); };
    u.onend = () => { if (g === this.gen) this.advance(); };
    u.onerror = e => {
      if (g !== this.gen || e.error === "interrupted" || e.error === "canceled") return;
      // Voix en ligne indisponible (pas de réseau) : on bascule sur une voix de l'appareil.
      if (!retry && v && !v.localService && frenchVoices().some(x => x.localService)) {
        this.forceLocal = true; this.halt(); this.speakCurrent(true); return;
      }
      this.halt(); this.setSnap({ status: "idle", mode: null, s: -1, w: -1, error: e.error || "erreur" });
    };
    // Filet de sécurité si « onend » ne vient jamais.
    const est = (item.chars / (13 * Math.max(0.5, st.rate || 1))) * 1000;
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
      this.setSnap({ status: "paused", mode: "page", s: this.queue[this.idx] ? this.queue[this.idx].s : -1, w: -1 });
    } else this.setSnap({ status: "idle", mode: null, s: -1, w: -1 });
    if (onEnd) onEnd();
  }
  pause() {
    if (this.snap.status !== "playing") return;
    if (this.snap.mode === "single") { this.stop(); return; }
    this.halt(); this.setSnap({ status: "paused", w: -1 });
  }
  resume() {
    if (this.snap.status !== "paused") return;
    this.play(this.queue, this.idx, this.opts);
  }
  stop() { this.halt(); this.saved = null; this.setSnap({ status: "idle", mode: null, s: -1, w: -1 }); }
  // Phrase de test ou mot isolé, hors file de lecture.
  say(text) {
    const toks = [{ tok: -1, start: 0, w: 1 }];
    this.play([{ text, s: -1, toks, chars: text.length }], 0, { mode: "single" });
  }
}
