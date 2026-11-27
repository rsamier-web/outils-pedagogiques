// Synthèse vocale (Web Speech API, gratuite) : lecture phrase par phrase,
// surlignage de la phrase et du mot, lecture d'un mot ou d'une phrase au clic.

export const ttsSupported = () =>
  typeof window !== "undefined" && "speechSynthesis" in window && typeof window.SpeechSynthesisUtterance !== "undefined";

const normLang = l => String(l || "").replace("_", "-").toLowerCase();
export const isFrench = v => normLang(v.lang).startsWith("fr");

// Les meilleures voix gratuites d'abord : Google, puis voix neuronales
// (Edge « Online (Natural) »), puis voix améliorées (Apple), puis le reste.
export function voiceScore(v) {
  const n = (v.name || "").toLowerCase(); const l = normLang(v.lang);
  let s = 0;
  if (n.includes("natural") || n.includes("neural")) s += 110;
  if (n.includes("google")) s += 100;
  if (n.includes("online")) s += 10;
  if (n.includes("premium") || n.includes("enhanced") || n.includes("amélior")) s += 60;
  if (/(amélie|thomas|audrey|aurélie|denise|henri|vivienne|remy|eloise|julie|paul)/.test(n)) s += 8;
  if (l === "fr-fr") s += 20; else if (l === "fr-be") s += 18; else if (l.startsWith("fr")) s += 5;
  if (v.localService) s += 1;
  return s;
}
export function frenchVoices() {
  if (!ttsSupported()) return [];
  return window.speechSynthesis.getVoices().filter(isFrench).sort((a, b) => voiceScore(b) - voiceScore(a));
}

// Position de départ de chaque mot (span .w) dans le texte de la phrase.
function wordOffsets(sEl) {
  const out = []; const seen = new Set(); let pos = 0;
  const tw = document.createTreeWalker(sEl, NodeFilter.SHOW_TEXT);
  let n;
  while ((n = tw.nextNode())) {
    const w = n.parentElement && n.parentElement.closest(".w");
    if (w && sEl.contains(w) && !seen.has(w)) { seen.add(w); out.push({ el: w, start: pos }); }
    pos += n.length;
  }
  return out;
}

export class Reader {
  constructor(getSettings) {
    this.getSettings = getSettings;
    this.gen = 0; this.queue = []; this.idx = 0; this.onEnd = null;
    this.state = "idle"; this.listeners = new Set(); this.cur = null; this.curW = null; this.watchdog = null;
    this.forceLocal = false;
  }
  sub(f) { this.listeners.add(f); return () => this.listeners.delete(f); }
  set(st) { this.state = st; this.listeners.forEach(f => f(st)); }
  pickVoice() {
    const list = frenchVoices(); if (!list.length) return null;
    const uri = this.getSettings().voiceURI;
    let v = (uri && list.find(x => x.voiceURI === uri)) || list[0];
    if (this.forceLocal && !v.localService) v = list.find(x => x.localService) || v;
    return v;
  }
  clearMarks() {
    if (this.cur) this.cur.classList.remove("reading");
    if (this.curW) this.curW.classList.remove("reading");
    this.cur = null; this.curW = null;
  }
  halt() {
    this.gen++; clearTimeout(this.watchdog);
    if (ttsSupported()) { try { window.speechSynthesis.cancel(); } catch (e) { /* rien */ } }
  }
  // Lit toutes les phrases (.s) d'un conteneur, à partir d'une phrase donnée.
  readContainer(el, fromEl, onEnd) {
    if (!el) return;
    const all = Array.from(el.querySelectorAll(".s")).filter(s => s.offsetParent !== null && s.textContent.trim());
    if (!all.length) return;
    let start = 0;
    if (fromEl) { const i = all.indexOf(fromEl); if (i >= 0) start = i; }
    this.play(all.map(s => ({ el: s, text: s.textContent })), start, onEnd);
  }
  play(queue, from, onEnd) {
    if (!ttsSupported()) return;
    this.halt(); this.clearMarks();
    this.queue = queue; this.idx = from || 0; this.onEnd = onEnd || null;
    this.set("playing");
    const g = this.gen; setTimeout(() => { if (g === this.gen) this.speakCurrent(); }, 60);
  }
  speakCurrent(retry = false) {
    const g = this.gen; const item = this.queue[this.idx]; if (!item) return;
    const st = this.getSettings();
    const u = new window.SpeechSynthesisUtterance(item.text);
    const v = this.pickVoice();
    if (v) { u.voice = v; u.lang = v.lang.replace("_", "-"); } else u.lang = "fr-FR";
    u.rate = st.rate; u.pitch = st.pitch; u.volume = st.volume;
    const offs = item.el ? wordOffsets(item.el) : [];
    u.onstart = () => {
      if (g !== this.gen) return;
      this.clearMarks();
      if (item.el) {
        if (st.hlSentence) item.el.classList.add("reading");
        this.cur = item.el;
        try { item.el.scrollIntoView({ block: "nearest", behavior: "smooth" }); } catch (e) { /* rien */ }
      }
    };
    u.onboundary = e => {
      if (g !== this.gen || !st.hlWord || !offs.length || (e.name && e.name !== "word")) return;
      let w = offs[0];
      for (const o of offs) { if (o.start <= e.charIndex) w = o; else break; }
      if (this.curW) this.curW.classList.remove("reading");
      w.el.classList.add("reading"); this.curW = w.el;
    };
    u.onend = () => { if (g === this.gen) this.advance(); };
    u.onerror = e => {
      if (g !== this.gen || e.error === "interrupted" || e.error === "canceled") return;
      if (!retry && v && !v.localService && frenchVoices().some(x => x.localService)) {
        this.forceLocal = true; this.halt(); this.speakCurrent(true); return;
      }
      this.stop();
    };
    const est = (item.text.length / (13 * Math.max(0.5, st.rate || 1))) * 1000;
    this.watchdog = setTimeout(() => { if (g === this.gen) this.advance(); }, est * 2.5 + 5000);
    try { window.speechSynthesis.resume(); } catch (e) { /* rien */ }
    window.speechSynthesis.speak(u);
  }
  advance() {
    clearTimeout(this.watchdog);
    if (this.idx + 1 < this.queue.length) {
      this.halt(); this.idx++; const g = this.gen;
      setTimeout(() => { if (g === this.gen) this.speakCurrent(); }, 40);
      return;
    }
    this.halt(); this.clearMarks(); this.set("idle");
    const f = this.onEnd; this.onEnd = null; if (f) f();
  }
  pause() { if (this.state !== "playing") return; this.halt(); this.set("paused"); }
  resume() { if (this.state !== "paused") return; this.play(this.queue, this.idx, this.onEnd); }
  stop() { this.halt(); this.clearMarks(); this.onEnd = null; this.set("idle"); }
  say(text, el) { this.play([{ text, el: el || null }], 0, null); }
}
