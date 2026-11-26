import React, { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import { FICHES, FICHE, STRATS, CATS, DIAGS, PALIERS } from "./fiches.js";
import { Speaker, ttsSupported, frenchVoices, segment, REG, cleanWord } from "./speech.js";

/* global __TEACHER__ */
const TEACHER = typeof __TEACHER__ !== "undefined" && __TEACHER__;
const LS = TEACHER ? "comprehension-enseignant-v1" : "comprehension-eleve-v1";
const APP_NAME = "Comprendre les textes";

/* ---------- Données ---------- */
const defaultSettings = () => ({ font: "andika", size: 20, lh: 1.6, spacing: false, voiceURI: "", rate: 0.9, pitch: 1, volume: 1, highlight: true, clickMode: "word", autoNext: false });
const emptyData = () => ({ settings: defaultSettings(), prog: {}, res: {}, txt: {}, rap: {}, bilan: {}, pos: null, startPalier: 1, unlockAll: false, sameDay: false });
const fixData = d => { const e = emptyData(); const o = { ...e, ...(d || {}) }; o.settings = { ...e.settings, ...((d && d.settings) || {}) }; return o; };
const uid = () => Math.random().toString(36).slice(2, 9);
function loadStore() {
  try {
    const s = JSON.parse(localStorage.getItem(LS));
    if (s) {
      if (!TEACHER) return fixData(s);
      if (s.profiles) { Object.values(s.profiles).forEach(p => { p.data = fixData(p.data); }); return { cur: null, order: [], ...s }; }
    }
  } catch (e) {}
  return TEACHER ? { profiles: {}, order: [], cur: null } : emptyData();
}
const saveStore = s => { try { localStorage.setItem(LS, JSON.stringify(s)); } catch (e) {} };

const todayKey = () => { const d = new Date(); return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0"); };
const fmtDay = k => { if (!k) return ""; const [y, m, d] = k.split("-").map(Number); return new Date(y, m - 1, d).toLocaleDateString("fr-FR", { day: "numeric", month: "short" }); };

const prog = (d, fid, sk) => { d.prog[fid] = d.prog[fid] || {}; d.prog[fid][sk] = d.prog[fid][sk] || {}; return d.prog[fid][sk]; };
const pget = (d, fid, sk) => (d.prog[fid] && d.prog[fid][sk]) || {};
const isDone = (d, f, sk) => !!pget(d, f.id, sk).done;
const palierFiches = p => FICHES.filter(x => x.palier === p);

function canStartA(d, f) {
  if (d.unlockAll || f.palier < d.startPalier) return true;
  const open = f.palier <= d.startPalier || palierFiches(f.palier - 1).every(x => isDone(d, x, "B"));
  if (!open) return false;
  if (f.palier >= 3) return true;
  const same = palierFiches(f.palier); const i = same.indexOf(f);
  return i === 0 || isDone(d, same[i - 1], "B");
}
function stateB(d, f) {
  if (!isDone(d, f, "A")) return "lockedA";
  if (d.unlockAll || d.sameDay) return "open";
  return pget(d, f.id, "A").done < todayKey() ? "open" : "tomorrow";
}
function lastDoneFiche(d, exceptId) {
  let best = null, at = -1;
  FICHES.forEach(f => { const b = pget(d, f.id, "B"); if (f.id !== exceptId && b.done && (b.at || 0) > at) { at = b.at || 0; best = f; } });
  return best;
}
function nextStep(d) {
  if (d.pos) { const f = FICHE[d.pos.fid]; if (f && !isDone(d, f, d.pos.sk)) return { f, sk: d.pos.sk, resume: true }; }
  for (const f of FICHES) {
    if (!canStartA(d, f)) continue;
    if (!isDone(d, f, "A")) return { f, sk: "A" };
    if (!isDone(d, f, "B")) return { f, sk: "B", wait: stateB(d, f) === "tomorrow" };
  }
  return null;
}
const qKeys = (f, sk) => f[sk].ecrans.map((e, i) => (e.t === "q" || e.t === "intrus") ? sk + i : null).filter(Boolean);

/* ---------- Polices ---------- */
const FONTS = [
  { id: "andika", name: "Andika", css: "'Andika', sans-serif" },
  { id: "atkinson", name: "Atkinson Hyperlegible", css: "'Atkinson Hyperlegible', sans-serif" },
  { id: "lexend", name: "Lexend", css: "'Lexend', sans-serif" },
];
const fontCss = id => (FONTS.find(f => f.id === id) || FONTS[0]).css;
const textStyle = s => ({ fontFamily: fontCss(s.font), fontSize: s.size + "px", lineHeight: s.lh });

/* ---------- Icônes (traits fins, style Breeze) ---------- */
const I = ({ d, size = 20 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
    strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" focusable="false">{d}</svg>
);
const Ico = {
  play: <I d={<path d="M7 5l12 7-12 7z" fill="currentColor" />} />,
  pause: <I d={<><rect x="6" y="5" width="4" height="14" fill="currentColor" /><rect x="14" y="5" width="4" height="14" fill="currentColor" /></>} />,
  stop: <I d={<rect x="6" y="6" width="12" height="12" rx="1" fill="currentColor" />} />,
  prev: <I d={<path d="M15 5l-7 7 7 7" />} />,
  next: <I d={<path d="M9 5l7 7-7 7" />} />,
  gear: <I d={<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>} />,
  help: <I d={<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></>} />,
  home: <I d={<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>} />,
  ear: <I d={<><path d="M11 5L6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></>} />,
  install: <I d={<><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>} />,
  check: <I d={<path d="M5 12.5l4.5 4.5L19 7.5" />} />,
  cross: <I d={<path d="M7 7l10 10M17 7L7 17" />} />,
  close: <I d={<path d="M6 6l12 12M18 6L6 18" />} />,
  lock: <I size={18} d={<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>} />,
  book: <I d={<><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z" /><path d="M12 6v13.5" /></>} />,
  text: <I d={<><path d="M5 5h14M5 9h14M5 13h10M5 17h8" /></>} />,
  bulb: <I d={<><path d="M9 18h6M10 21h4" /><path d="M12 3a6 6 0 0 0-3.5 10.9c.6.5 1 1.2 1 2.1h5c0-.9.4-1.6 1-2.1A6 6 0 0 0 12 3z" /></>} />,
  users: <I d={<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.6-3.4 3-5.5 6-5.5s5.4 2.1 6 5.5" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.6c2.3.3 4 2 4.5 4.9" /></>} />,
  chart: <I d={<><path d="M4 20V4M4 20h16" /><path d="M8 16v-5M12 16V8M16 16v-3" /></>} />,
  plus: <I d={<path d="M12 5v14M5 12h14" />} />,
  trash: <I d={<><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>} />,
  print: <I d={<><path d="M7 9V3h10v6" /><rect x="3" y="9" width="18" height="8" rx="2" /><path d="M7 14h10v7H7z" /></>} />,
  down: <I d={<><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>} />,
  up: <I d={<><path d="M12 15V4M7 9l5-5 5 5" /><path d="M5 20h14" /></>} />,
  pen: <I d={<><path d="M4 20h4L19 9l-4-4L4 16z" /><path d="M13.5 6.5l4 4" /></>} />,
  chat: <I d={<><path d="M4 5h16v11H10l-4 4v-4H4z" /></>} />,
  flag: <I d={<><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>} />,
};
const SIco = {
  S1: <I d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 5v14M17 5v14M3 9h4M3 15h4M17 9h4M17 15h4" /></>} />,
  S2: <I d={<><path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1" /><path d="M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" /></>} />,
  S3: Ico.bulb,
  S4: <I d={<><path d="M9 4L3 6v14l6-2 6 2 6-2V4l-6 2z" /><path d="M9 4v14M15 6v14" /></>} />,
  S5: <I d={<><circle cx="12" cy="12" r="9" /><path d="M8 12.5l3 3 5-6" /></>} />,
  S6: <I d={<><circle cx="11" cy="11" r="6" /><path d="M20 20l-4.5-4.5" /></>} />,
};
const StratTag = ({ s }) => s && STRATS[s] ? <span className="strat-tag">{SIco[s]}<span>{STRATS[s].nom}</span></span> : null;

/* ---------- Installation ---------- */
let installEvt = null;
if (!TEACHER) {
  window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; window.dispatchEvent(new Event("can-install")); });
  window.addEventListener("appinstalled", () => { installEvt = null; window.dispatchEvent(new Event("can-install")); });
}

/* ---------- Fenêtre modale accessible ---------- */
function Modal({ title, onClose, children, side, wide, labelId }) {
  const ref = useRef(null); const opener = useRef(document.activeElement);
  useEffect(() => {
    const el = ref.current; const sel = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const f = el.querySelector("[data-autofocus]") || el.querySelector(sel); if (f) f.focus();
    const key = e => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); }
      if (e.key === "Tab") {
        const items = [...el.querySelectorAll(sel)].filter(x => x.offsetParent !== null); if (!items.length) return;
        const a = items[0], b = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      }
    };
    el.addEventListener("keydown", key);
    const o = opener.current;
    return () => { el.removeEventListener("keydown", key); if (o && o.focus) o.focus(); };
  }, []);
  const id = labelId || "modal-title";
  return (
    <div className={"overlay" + (side ? " side" : "")} onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className={"modal" + (wide ? " wide" : "")} role="dialog" aria-modal="true" aria-labelledby={id} ref={ref}>
        <div className="modal-head">
          <h2 id={id}>{title}</h2>
          <button className="btn flat icon" onClick={onClose} aria-label="Fermer" title="Fermer">{Ico.close}</button>
        </div>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}
function Slider({ label, min, max, step, value, onChange, fmt }) {
  const id = useMemo(() => "s" + uid(), []);
  return (
    <div className="field">
      <label htmlFor={id}>{label} <output>{fmt ? fmt(value) : value}</output></label>
      <input id={id} type="range" min={min} max={max} step={step} value={value}
        onChange={e => onChange(Number(e.target.value))} aria-valuetext={fmt ? fmt(value) : String(value)} />
    </div>
  );
}
function Switch({ label, checked, onChange, hint }) {
  return (
    <label className="switch">
      <input type="checkbox" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="track" aria-hidden="true"><span /></span>
      <span className="sw-text">{label}{hint && <small>{hint}</small>}</span>
    </label>
  );
}
function Seg({ label, value, options, onChange, name }) {
  const lid = useMemo(() => "l" + uid(), []);
  return (
    <div className="field">
      <span className="field-label" id={lid}>{label}</span>
      <div className="seg" role="radiogroup" aria-labelledby={lid}>
        {options.map(([v, l, style]) => (
          <label key={v} className={"seg-opt" + (value === v ? " on" : "")} style={style}>
            <input type="radio" name={name} value={v} checked={value === v} onChange={() => onChange(v)} />{l}
          </label>
        ))}
      </div>
    </div>
  );
}

/* ---------- Voix ---------- */
function useVoices() {
  const [state, setState] = useState({ list: frenchVoices(), ready: false });
  useEffect(() => {
    if (!ttsSupported()) { setState({ list: [], ready: true }); return; }
    const upd = () => setState(s => ({ list: frenchVoices(), ready: s.ready || frenchVoices().length > 0 }));
    window.speechSynthesis.addEventListener("voiceschanged", upd); upd();
    const iv = setInterval(upd, 400);
    const t = setTimeout(() => { clearInterval(iv); setState({ list: frenchVoices(), ready: true }); }, 3000);
    return () => { window.speechSynthesis.removeEventListener("voiceschanged", upd); clearInterval(iv); clearTimeout(t); };
  }, []);
  return state;
}
function NoVoice({ voices }) {
  if (!ttsSupported()) return <p className="notice warn" role="status">Ce navigateur ne propose pas la synthèse vocale. Ouvre l’application dans Google Chrome.</p>;
  if (!voices.ready || voices.list.length) return null;
  return (
    <div className="notice warn" role="status">
      <b>Aucune voix française n’est installée sur cet appareil.</b> La lecture à voix haute ne peut pas fonctionner pour l’instant.
      <ul>
        <li>Sur Android : Paramètres › Système › Langues › Synthèse vocale › moteur « Google » › installer les données vocales en français.</li>
        <li>Sur ordinateur : utilise Google Chrome (voix Google en ligne) ou ajoute une voix française dans les réglages de langue du système.</li>
      </ul>
      Ensuite, recharge la page.
    </div>
  );
}

/* ---------- Texte « parlant » : phrases et mots cliquables, surlignage ---------- */
const Ctx = React.createContext(null);
function Say({ id, text, as = "span", className, click = true }) {
  const { snap, settings, onWord } = React.useContext(Ctx);
  const lines = useMemo(() => segment(id, text), [id, text]);
  const hlOn = settings.highlight && snap.status === "playing";
  const Tag = as;
  return (
    <Tag className={className} onClick={click ? onWord : undefined}>
      {lines.map((sents, li) => (
        <React.Fragment key={li}>
          {li > 0 && <br />}
          {sents.map((s, si) => {
            const on = hlOn && snap.key === s.key;
            return (
              <React.Fragment key={s.key}>
                {si > 0 && " "}
                <span className={"snt" + (on && snap.mode === "page" ? " on" : "")} data-sk={s.key}>
                  {s.toks.map((tk, k) => {
                    const nx = s.toks[k + 1];
                    const sep = !nx ? "" : (/^[?!:;»”]+$/.test(nx.t) || tk.t === "«" || tk.t === "—" || tk.t === "–") ? " " : " ";
                    const w = tk.wi >= 0 && on && snap.w === tk.wi;
                    const el = tk.word ? <span className={"w" + (w ? " wd" : "")} data-w={tk.wi}>{tk.t}</span> : tk.t;
                    return <React.Fragment key={k}>{tk.b ? <b>{el}</b> : el}{sep}</React.Fragment>;
                  })}
                </span>
              </React.Fragment>
            );
          })}
        </React.Fragment>
      ))}
    </Tag>
  );
}
const collectQueue = root => {
  if (!root) return [];
  const out = []; const seen = new Set();
  root.querySelectorAll("[data-sk]").forEach(el => { const it = REG.get(el.dataset.sk); if (it && it.text && !seen.has(it.key)) { seen.add(it.key); out.push(it); } });
  return out;
};

/* ---------- Réglages ---------- */
function SettingsPanel({ data, update, speaker, voices, onClose, openSuivi }) {
  const s = data.settings;
  const set = patch => update(d => { d.settings = { ...d.settings, ...patch }; });
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <Modal title="Réglages" onClose={onClose} side labelId="settings-title">
      <section className="set-group">
        <h3>Affichage du texte</h3>
        <Seg label="Police" name="font" value={s.font} onChange={v => set({ font: v })} options={FONTS.map(f => [f.id, f.name, { fontFamily: f.css }])} />
        <Slider label="Taille du texte" min={16} max={30} step={1} value={s.size} onChange={v => set({ size: v })} fmt={v => v + " px"} />
        <Slider label="Interligne" min={1.4} max={2.2} step={0.1} value={s.lh} onChange={v => set({ lh: Math.round(v * 10) / 10 })} fmt={v => v.toFixed(1).replace(".", ",")} />
        <Switch label="Espacement élargi des lettres et des mots" checked={s.spacing} onChange={v => set({ spacing: v })} />
        <div className={"preview" + (s.spacing ? " wide" : "")} style={textStyle(s)} aria-label="Aperçu">
          Le gardien sautillait sur sa ligne.<br />Sacha prit son élan.
        </div>
      </section>

      <section className="set-group">
        <h3>Voix</h3>
        <NoVoice voices={voices} />
        {voices.list.length > 0 && (
          <div className="field">
            <label htmlFor="voice-sel" className="field-label">Voix française</label>
            <select id="voice-sel" value={s.voiceURI} onChange={e => { speaker.forceLocal = false; set({ voiceURI: e.target.value }); }}>
              <option value="">Automatique (la meilleure voix disponible)</option>
              {voices.list.map(v => (
                <option key={v.voiceURI} value={v.voiceURI}>{v.name} ({v.lang.replace("_", "-")}){v.localService ? "" : " · en ligne"}</option>
              ))}
            </select>
            <small className="muted">Les voix « Google » et « Natural » sont les plus naturelles. Elles ont besoin d’Internet ; sans connexion, une voix de l’appareil prend le relais.</small>
          </div>
        )}
        <Slider label="Vitesse" min={0.5} max={1.5} step={0.05} value={s.rate} onChange={v => set({ rate: v })} fmt={v => v.toFixed(2).replace(".", ",")} />
        <Slider label="Hauteur" min={0.5} max={1.5} step={0.05} value={s.pitch} onChange={v => set({ pitch: v })} fmt={v => v.toFixed(2).replace(".", ",")} />
        <Slider label="Volume" min={0} max={1} step={0.05} value={s.volume} onChange={v => set({ volume: v })} fmt={v => Math.round(v * 100) + " %"} />
        <button className="btn" onClick={() => speaker.say("Bonjour ! Je lis le texte avec toi. Touche un mot pour l’entendre.")} disabled={!voices.list.length}>
          {Ico.ear}<span>Tester la voix</span>
        </button>
        <Switch label="Surligner la phrase et le mot lus" checked={s.highlight} onChange={v => set({ highlight: v })} />
        <Seg label="Un clic sur un mot lit…" name="click" value={s.clickMode} onChange={v => set({ clickMode: v })} options={[["word", "le mot"], ["sentence", "la phrase"]]} />
        <Switch label="Passer seul à la page suivante" hint="Après « Lire la page », la lecture continue sur les écrans suivants (consignes, texte) et s’arrête à la question." checked={s.autoNext} onChange={v => set({ autoNext: v })} />
      </section>

      <section className="set-group">
        <h3>Pour l’adulte</h3>
        <div className="field">
          <label htmlFor="start-pal" className="field-label">Palier de départ</label>
          <select id="start-pal" value={data.startPalier} onChange={e => update(d => { d.startPalier = Number(e.target.value); })}>
            {PALIERS.map(p => <option key={p.n} value={p.n}>Palier {p.n} · {p.nom}</option>)}
          </select>
        </div>
        <Switch label="Ouvrir la séance B le jour même" hint="Par défaut, la séance B s’ouvre le lendemain : espacer les séances aide à retenir." checked={data.sameDay} onChange={v => update(d => { d.sameDay = v; })} />
        <Switch label="Déverrouiller toutes les fiches" checked={data.unlockAll} onChange={v => update(d => { d.unlockAll = v; })} />
        {!TEACHER && <button className="btn" onClick={openSuivi}>{Ico.chart}<span>Voir le suivi détaillé</span></button>}
        <div className="row">
          <button className="btn" onClick={() => set(defaultSettings())}>Rétablir l’affichage et la voix par défaut</button>
          {!confirmReset
            ? <button className="btn" onClick={() => setConfirmReset(true)}>Effacer la progression…</button>
            : <button className="btn danger" onClick={() => { update(d => { const st = d.settings; Object.assign(d, emptyData(), { settings: st, startPalier: d.startPalier }); }); setConfirmReset(false); }}>Confirmer : tout effacer</button>}
        </div>
      </section>
    </Modal>
  );
}

/* ---------- Aide ---------- */
function Help({ onClose }) {
  return (
    <Modal title="Aide" onClose={onClose} wide labelId="help-title">
      <h3>Comment ça marche ?</h3>
      <ul className="help-list">
        <li>Chaque <b>fiche</b> contient un texte et se fait en <b>deux séances</b> : la séance A, puis la séance B le lendemain.</li>
        <li>Une séance avance <b>écran par écran</b>. Le texte reste à côté de la question : tu peux le relire quand tu veux.</li>
        <li>Si tu ne sais pas, choisis <b>« Je ne sais pas »</b> : ce n’est pas une erreur, tu reçois un coup de pouce.</li>
        <li>Les <b>six stratégies</b> t’aident à comprendre : {Object.keys(STRATS).map((k, i) => <span key={k}>{i ? ", " : ""}« {STRATS[k].nom} »</span>)}.</li>
        <li><b>Lire la page</b> lit l’écran à voix haute, phrase par phrase. <b>Touche un mot</b> pour l’entendre.</li>
        <li>Les <b>Réglages</b> changent la police, la taille, l’interligne, l’espacement et la voix. Ils restent enregistrés, comme l’écran où tu t’es arrêté.</li>
      </ul>
      <details className="adult">
        <summary>Pour l’adulte : principes de conception</summary>
        <p><b>Cadre TACIT.</b> Les questions couvrent les catégories d’inférences de TACIT (anaphores, marques grammaticales, ponctuation, hypothèses, calcul, inférences locales et globales, temps et ordre, vocabulaire en contexte), avec une progression en 4 paliers sans référence à un niveau scolaire.</p>
        <p><b>Recommandations retenues.</b> Enseignement explicite et bref des stratégies (exemple montré, puis guidé, puis autonome) ; inférences de connaissances rendues visibles (« Le texte dit / Je sais / Donc ») ; vocabulaire en contexte ; plan des textes ; contrôle de la compréhension (chasse à l’intrus) ; écriture à partir du texte ; rappels espacés sans le texte ; discussion facultative.</p>
        <p><b>Charge cognitive et apprentissage multimédia.</b></p>
        <ul className="help-list">
          <li>Segmentation : deux séances courtes par fiche, un écran = une tâche.</li>
          <li>Contiguïté : le texte reste visible à côté de la question ; le passage visé est surligné ; le retour est immédiat, sous la question.</li>
          <li>Cohérence : aucune image, aucun chronomètre, aucun son de récompense, aucun décor.</li>
          <li>Pré-entraînement : « Je sais déjà » donne seulement les connaissances indispensables avant la lecture.</li>
          <li>Effet de l’exemple résolu et estompage : « Je te montre », puis coups de pouce qui diminuent d’un palier à l’autre.</li>
          <li>Redondance : la voix est une option, utile quand le décodage bloque.</li>
        </ul>
        <p><b>Diagnostics des erreurs</b> (dans le suivi) : {Object.values(DIAGS).map(x => x.nom).join(" · ")}.</p>
        <p><b>Installer l’application.</b> Chrome sur ordinateur : bouton « Installer » ou icône d’installation dans la barre d’adresse. Android : menu ⋮ › « Installer l’application ». Les données restent sur l’appareil.</p>
      </details>
    </Modal>
  );
}

/* ---------- Accueil ---------- */
function Home({ data, update, go }) {
  const ns = nextStep(data);
  return (
    <main id="main" tabIndex={-1}>
      {ns ? (
        <section className="card banner">
          <div>
            <div className="eyebrow">{ns.resume ? "Reprendre" : ns.wait ? "À demain" : "Prochaine séance"}</div>
            <h2>Fiche {ns.f.id} · {ns.f.titre}</h2>
            <p className="muted">Séance {ns.sk} · {ns.f[ns.sk].titre}{ns.wait ? " · elle s’ouvre demain : espacer les séances aide à retenir." : ""}</p>
          </div>
          {!ns.wait && <button className="btn primary big" onClick={() => go("session", { fid: ns.f.id, sk: ns.sk })}>{Ico.play}<span>{ns.resume ? "Reprendre" : "Commencer"}</span></button>}
        </section>
      ) : (
        <section className="card banner good"><div><h2>Parcours terminé !</h2><p>Tu as fait toutes les fiches. Tu peux revoir celles que tu veux.</p></div></section>
      )}
      {PALIERS.map(p => <PalierCard key={p.n} p={p} data={data} go={go} />)}
    </main>
  );
}
function PalierCard({ p, data, go }) {
  const list = palierFiches(p.n);
  const done = list.filter(f => isDone(data, f, "B")).length;
  return (
    <section className="card" aria-labelledby={"pal-" + p.n}>
      <div className="pal-head">
        <div>
          <div className="eyebrow">Palier {p.n}</div>
          <h2 id={"pal-" + p.n} className="h-mid">{p.nom}</h2>
        </div>
        <span className="chip">{done} / {list.length} fiches</span>
      </div>
      <p className="muted small">{p.aide}</p>
      <ul className="lib">
        {list.map(f => {
          const okA = canStartA(data, f); const dA = isDone(data, f, "A"); const dB = isDone(data, f, "B"); const sB = stateB(data, f);
          const keys = [...qKeys(f, "A"), ...qKeys(f, "B")]; const r = data.res[f.id] || {};
          const ans = keys.filter(k => r[k]); const ok1 = ans.filter(k => r[k].ok1).length;
          return (
            <li key={f.id} className={"lib-item" + (!okA ? " locked" : "")}>
              <span className="lib-n">{f.id}</span>
              <span className="lib-t"><b>{f.titre}</b><small>{f.genre} · {f.theme}{ans.length ? ` · ${ok1}/${ans.length} du premier coup` : ""}</small></span>
              <span className="lib-act">
                {!okA ? <span className="lock" title="Termine d’abord les fiches précédentes">{Ico.lock}</span> : <>
                  <button className={"btn sm" + (!dA ? " primary" : "")} onClick={() => go("session", { fid: f.id, sk: "A" })} aria-label={`Fiche ${f.id}, séance A${dA ? ", faite" : ""}`}>
                    {dA ? Ico.check : null}<span>A</span>
                  </button>
                  <button className={"btn sm" + (dA && !dB && sB === "open" ? " primary" : "")} disabled={sB === "lockedA" || (sB === "tomorrow" && !dB)}
                    onClick={() => go("session", { fid: f.id, sk: "B" })} title={sB === "tomorrow" && !dB ? "S’ouvre demain" : ""}
                    aria-label={`Fiche ${f.id}, séance B${dB ? ", faite" : sB === "tomorrow" ? ", s’ouvre demain" : ""}`}>
                    {dB ? Ico.check : null}<span>B</span>
                  </button>
                </>}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------- Séance ---------- */
const TEXT_SCREENS = ["montre", "lire", "q", "intrus", "film", "ecrire", "verif", "corr"];
const PASSIVE = ["avant", "montre", "lire", "parler"];
const LOCAL_CATS = ["F", "ANA", "VOC", "GRAM", "PONC"];

function Session({ fid, sk, data, update, speaker, voices, go }) {
  const f = FICHE[fid]; const se = f[sk]; const differe = !!se.differe; const s = data.settings;
  const prevF = useMemo(() => lastDoneFiche(data, fid), []);
  const screens = useMemo(() => {
    const a = se.ecrans.map((e, i) => ({ ...e, k: sk + i })).filter(e => !(e.t === "rappel" && e.from === "prev" && !(prevF && prevF.suite)));
    a.push({ t: "fin", k: sk + "fin" }); return a;
  }, []);
  const P = pget(data, fid, sk);
  const review = useRef(!!P.done).current;
  const [i, setI] = useState(() => review ? 0 : Math.min(P.i || 0, screens.length - 1));
  const e = screens[i];
  const snap = useSyncExternalStore(speaker.sub, speaker.get);
  const panelRef = useRef(null); const textRef = useRef(null); const autoRead = useRef(false);
  const res = data.res[fid] || {};
  const visible = e.seul || (se.visibles ? Array.from({ length: se.visibles }, (_, j) => j + 1) : null);

  const initialSig = sc => {
    if (sc.t === "montre") return sc.p || [];
    if ((sc.t === "q" || sc.t === "intrus") && f.palier <= 2 && LOCAL_CATS.includes(sc.cat)) return sc.p || [];
    if ((sc.t === "q" || sc.t === "intrus") && res[sc.k] && !differe) return sc.p || [];
    return [];
  };
  const [sig, setSig] = useState(() => initialSig(e));
  useEffect(() => { setSig(initialSig(e)); }, [i]);

  useEffect(() => {
    if (!review) update(d => { prog(d, fid, sk).i = i; d.pos = { fid, sk }; });
    requestAnimationFrame(() => {
      const h = document.getElementById("screen-title"); if (h) h.focus({ preventScroll: true });
      window.scrollTo(0, 0); if (textRef.current) textRef.current.scrollTop = 0;
    });
    if (e.t === "fin" && !review) update(d => { const p = prog(d, fid, sk); if (!p.done) { p.done = todayKey(); p.at = Date.now(); } d.pos = null; });
    if (autoRead.current) { autoRead.current = false; setTimeout(() => readPage(), 350); }
  }, [i]);
  useEffect(() => () => speaker.stop(), []);
  useEffect(() => {
    if (!sig.length || !textRef.current) return;
    const el = textRef.current.querySelector(`[data-para="${sig[0]}"]`);
    if (el) { const pane = textRef.current; const top = el.offsetTop - pane.offsetTop - 12; if (pane.scrollHeight > pane.clientHeight + 4) pane.scrollTo({ top: Math.max(0, top), behavior: "smooth" }); else el.scrollIntoView({ block: "nearest", behavior: "smooth" }); }
  }, [sig.join(",")]);

  const tmp = (P.tmp) || {};
  const validated = !!P.validated || review;
  const record = (k, rec) => update(d => { d.res[fid] = d.res[fid] || {}; d.res[fid][k] = { ...rec, at: Date.now() }; });
  const setTmp = (k, v) => update(d => { const p = prog(d, fid, sk); p.tmp = { ...(p.tmp || {}), [k]: v }; });
  const qScreens = screens.filter(x => x.t === "q" || x.t === "intrus");
  const validate = () => update(d => {
    const p = prog(d, fid, sk); d.res[fid] = d.res[fid] || {};
    qScreens.forEach(q => {
      const c = (p.tmp || {})[q.k]; const ok = c === q.ok;
      const dg = c != null && c >= 0 && !ok ? (q.no && q.no[c] ? q.no[c][0] : "I") : null;
      d.res[fid][q.k] = { cat: q.cat === undefined ? "INTRUS" : q.cat, ok1: ok, tries: 1, wrong: ok || c == null || c < 0 ? [] : [c], diags: dg ? [dg] : [], jnsp: c === -1 || c == null, aids: 0, final: ok ? "ok" : "faux", at: Date.now() };
    });
    p.validated = true;
  });

  const canNext = (() => {
    if (e.t === "q" || e.t === "intrus") return differe ? (validated || tmp[e.k] != null) : !!res[e.k];
    if (e.t === "verif") return validated;
    return true;
  })();

  const readPage = () => {
    const root = e.t === "lire" ? textRef.current : panelRef.current;
    const q = collectQueue(root);
    if (!q.length) return;
    speaker.play(q, 0, {
      mode: "page", onEnd: () => {
        if (data.settings.autoNext && PASSIVE.includes(e.t) && i < screens.length - 1) { autoRead.current = true; setI(x => Math.min(x + 1, screens.length - 1)); }
      },
    });
  };
  const readText = () => { const q = collectQueue(textRef.current); if (q.length) speaker.play(q, 0, { mode: "page" }); };
  const toggleRead = () => {
    if (!voices.list.length) return;
    if (snap.status === "playing" && snap.mode === "page") speaker.pause();
    else if (snap.status === "paused") speaker.resume();
    else readPage();
  };
  const onWord = ev => {
    const w = ev.target.closest && ev.target.closest("[data-w]"); if (!w) return;
    const sEl = w.closest("[data-sk]"); const it = sEl && REG.get(sEl.dataset.sk); if (!it) return;
    if (!voices.list.length) return;
    if (data.settings.clickMode === "sentence") speaker.play([it], 0, { mode: "single" });
    else speaker.play([{ key: it.key, text: cleanWord(w.textContent), starts: [0], fixedW: Number(w.dataset.w) }], 0, { mode: "single" });
  };
  const goto = n => { speaker.stop(); setI(Math.max(0, Math.min(n, screens.length - 1))); };
  const showText = TEXT_SCREENS.includes(e.t);
  const [folded, setFolded] = useState(false);
  const panelStyle = { fontFamily: fontCss(s.font), fontSize: Math.min(24, Math.max(16, s.size - 2)) + "px", lineHeight: Math.min(s.lh, 1.8) };
  const playing = snap.status === "playing" && snap.mode === "page";
  const ctx = { snap, settings: s, onWord };

  return (
    <Ctx.Provider value={ctx}>
      <main id="main" className="session-main" tabIndex={-1}>
        <div className="session-bar card" role="toolbar" aria-label="Lecture à voix haute">
          <div className="tts">
            <button className="btn primary" onClick={toggleRead} disabled={!ttsSupported() || !voices.list.length}>
              {playing ? Ico.pause : Ico.play}<span>{playing ? "Pause" : snap.status === "paused" ? "Reprendre" : "Lire la page"}</span>
            </button>
            <button className="btn" onClick={() => { autoRead.current = false; speaker.stop(); }} disabled={snap.status === "idle"} aria-label="Arrêter" title="Arrêter">{Ico.stop}<span className="lbl-txt">Arrêter</span></button>
          </div>
          <div className="progress" aria-label={`Écran ${i + 1} sur ${screens.length}`}>
            <span className="muted small">Séance {sk} · {i + 1}/{screens.length}</span>
            <span className="dots" aria-hidden="true">{screens.map((_, j) => <i key={j} className={j === i ? "on" : j < i ? "past" : ""} />)}</span>
          </div>
        </div>
        <NoVoice voices={voices} />
        <div className={"session" + (showText ? " with-text" : "")}>
          {showText && (
            <article className="card text-pane" aria-labelledby="text-title">
              <header className="text-head">
                <div>
                  <h2 id="text-title" style={{ fontFamily: fontCss(s.font) }}>{f.titre}</h2>
                  {f.sousTitre && <div className="muted small">{f.sousTitre}</div>}
                </div>
                <span className="row tight th-act">
                  <button className="btn sm" onClick={readText} disabled={!voices.list.length} title="Écouter le texte">{Ico.ear}<span className="lbl-txt">Écouter</span></button>
                  <button className="btn sm fold-btn" onClick={() => setFolded(x => !x)} aria-expanded={!folded}>{folded ? "Afficher le texte" : "Réduire"}</button>
                </span>
              </header>
              <div ref={textRef} className={"reading" + (s.spacing ? " wide" : "") + (folded ? " folded" : "")} style={textStyle(s)}>
                {f.paras.map((para, j) => {
                  const n = j + 1; if (visible && !visible.includes(n)) return null;
                  return (
                    <div key={n} className={"para" + (sig.includes(n) ? " sig" : "")} data-para={n}>
                      <span className="pn" aria-label={`Paragraphe ${n}`}>¶{n}</span>
                      <Say id={"t" + fid + "-" + n} text={para} as="p" />
                    </div>
                  );
                })}
                {visible && <p className="muted small">La suite du texte s’affichera plus tard.</p>}
              </div>
              {f.note && !folded && <p className="muted small note">{f.note}</p>}
            </article>
          )}
          <section className={"card panel" + (s.spacing ? " wide" : "")} ref={panelRef} style={panelStyle}>
            <Screen e={e} f={f} sk={sk} data={data} update={update} res={res} tmp={tmp} differe={differe} validated={validated}
              record={record} setTmp={setTmp} validate={validate} setSig={setSig} prevF={prevF} screens={screens} goto={goto} review={review} />
            <nav className="pager" aria-label="Navigation">
              <button className="btn big" onClick={() => goto(i - 1)} disabled={i === 0}>{Ico.prev}<span>Retour</span></button>
              {e.t === "fin"
                ? <button className="btn big primary" onClick={() => go("home")}>{Ico.home}<span>Terminer</span></button>
                : <button className="btn big primary" onClick={() => goto(i + 1)} disabled={!canNext}><span>Continuer</span>{Ico.next}</button>}
            </nav>
            {!canNext && <p className="muted small hint">{e.t === "verif" ? "Valide tes réponses pour voir la correction." : "Choisis une réponse pour continuer."}</p>}
          </section>
        </div>
      </main>
    </Ctx.Provider>
  );
}

const Title = ({ eyebrow, children, s }) => (
  <header className="screen-head">
    {eyebrow && <div className="eyebrow">{eyebrow}</div>}
    <h2 id="screen-title" tabIndex={-1} className="h-mid">{children}</h2>
    {s && <StratTag s={s} />}
  </header>
);

function Screen(props) {
  const { e, f, sk } = props;
  switch (e.t) {
    case "avant": return <Avant {...props} />;
    case "montre": return <Montre {...props} />;
    case "lire": return (
      <div>
        <Title eyebrow={`Fiche ${f.id} · ${f.genre}`}>{e.relire ? "Je relis le texte" : "Je lis le texte"}</Title>
        <Say id={"lire" + e.k} as="p" text={e.relire ? "Relis le texte en entier avant de répondre. Tu peux l’écouter avec le bouton « Écouter »." : "Lis tout le texte, à ton rythme. Si un mot est difficile, touche-le pour l’entendre. Quand tu as fini, clique sur « Continuer »."} />
      </div>
    );
    case "film": return <Ecrire {...props} titre="Mon film en une phrase" consigne="Raconte ce que tu as compris, en une phrase, avec tes mots." s="S1" />;
    case "ecrire": return <Ecrire {...props} titre="J’écris" consigne={e.consigne} />;
    case "q": case "intrus": return <Question key={e.k} {...props} />;
    case "rappel": return <Rappel key={e.k} {...props} />;
    case "parler": return (
      <div>
        <Title eyebrow="Facultatif · avec un adulte ou un camarade">On en parle</Title>
        <div className="notice talk">{Ico.chat}<Say id={"parler" + e.k} as="p" text={e.txt} /></div>
        <p className="muted small">Tu peux passer cet écran si tu travailles seul.</p>
      </div>
    );
    case "bilan": return <Bilan {...props} />;
    case "verif": return <Verif {...props} />;
    case "corr": return <Corr {...props} />;
    case "fin": return <Fin {...props} />;
    default: return null;
  }
}

function Avant({ e, f, sk }) {
  return (
    <div>
      <Title eyebrow={`Fiche ${f.id} · Séance ${sk}`}>Avant de lire</Title>
      {e.aujourdhui && <div className="block"><h3 className="h-small">Aujourd’hui</h3><Say id={"auj" + e.k} as="p" text={e.aujourdhui} /></div>}
      <div className="block"><h3 className="h-small">Mon but de lecture</h3><Say id={"but" + e.k} as="p" text={e.but} /></div>
      {e.sais && <div className="block"><h3 className="h-small">Je sais déjà</h3>
        <ul className="sais">{e.sais.map((x, j) => <li key={j}><Say id={"sais" + e.k + j} text={x} /></li>)}</ul></div>}
    </div>
  );
}
function Montre({ e }) {
  return (
    <div>
      <Title eyebrow="Je te montre" s={e.s}>{STRATS[e.s].nom}</Title>
      <div className="think">
        <Say id={"montre" + e.k} as="p" text={e.txt} />
      </div>
      <p className="muted small">C’est un exemple : regarde comment on fait. Ensuite, ce sera à toi.</p>
    </div>
  );
}

function Ecrire({ e, f, data, update, titre, consigne, s }) {
  const key = e.k; const val = (data.txt[f.id] || {})[key] || "";
  const [v, setV] = useState(val); const [show, setShow] = useState(!!val && false);
  const save = x => update(d => { d.txt[f.id] = d.txt[f.id] || {}; d.txt[f.id][key] = x; });
  useEffect(() => { const t = setTimeout(() => { if (v !== val) save(v); }, 500); return () => clearTimeout(t); }, [v]);
  const st = data.settings;
  return (
    <div>
      <Title eyebrow={`Fiche ${f.id}`} s={s}>{titre}</Title>
      <Say id={"cons" + key} as="p" text={consigne} />
      {e.mots && <div className="mots" aria-label="Mots à utiliser">{e.mots.map(m => {
        const ok = new RegExp("\\b" + m, "i").test(v);
        return <span key={m} className={"chip" + (ok ? " ok" : "")}>{ok ? Ico.check : null}{m}</span>;
      })}</div>}
      <label htmlFor={"ta" + key} className="sr">Ta réponse</label>
      <textarea id={"ta" + key} className={"answer" + (st.spacing ? " wide" : "")} style={{ ...textStyle(st), fontSize: Math.max(16, st.size - 2) + "px" }}
        rows={4} value={v} placeholder={e.amorce || "Écris ici…"} onChange={ev => setV(ev.target.value)} onBlur={() => save(v)} />
      <div className="row">
        {!show
          ? <button className="btn" onClick={() => { save(v); setShow(true); }}>{Ico.bulb}<span>Comparer avec un exemple</span></button>
          : <div className="model"><div className="eyebrow">Un exemple de réponse</div><Say id={"mod" + key} as="p" text={e.modele} /></div>}
      </div>
    </div>
  );
}

function Rappel({ e, f, sk, data, update, prevF }) {
  const items = e.items || (prevF && prevF.suite) || [];
  const from = e.from === "prev" && prevF ? `Sans regarder le texte « ${prevF.titre} »` : "Sans regarder le texte";
  return (
    <div>
      <Title eyebrow={from}>Je me souviens</Title>
      <Say id={"rap" + e.k} as="p" className="muted" text="Réponds dans ta tête, à voix haute ou par écrit. Puis vérifie." />
      <ol className="rappel">
        {items.map((it, j) => <RappelItem key={j} id={f.id + e.k + j} it={it} data={data} update={update} />)}
      </ol>
    </div>
  );
}
function RappelItem({ id, it, data, update }) {
  const v = data.rap[id]; const [open, setOpen] = useState(!!v);
  const rate = x => update(d => { d.rap[id] = x; });
  return (
    <li className="rap-item">
      <Say id={"rq" + id} as="p" className="q-text" text={it.q} />
      {!open ? <button className="btn" onClick={() => setOpen(true)}>Voir la réponse</button> : (
        <div className="rap-ans">
          <div className="model"><Say id={"rr" + id} as="p" text={it.r} /></div>
          <div className="row tight" role="group" aria-label="Je savais ?">
            <button className={"btn sm" + (v === "oui" ? " sel" : "")} aria-pressed={v === "oui"} onClick={() => rate("oui")}>{Ico.check}<span>Je savais</span></button>
            <button className={"btn sm" + (v === "non" ? " sel" : "")} aria-pressed={v === "non"} onClick={() => rate("non")}><span>Pas encore</span></button>
          </div>
        </div>
      )}
    </li>
  );
}

/* ---------- Question à choix ---------- */
const L = ["a", "b", "c", "d"];
function cp1Text(e) { return e.cp1 || (e.p ? `Relis le ¶${e.p.join(" et le ¶")}.` : "Relis le texte calmement, phrase par phrase."); }
function cp2Text(e) { return e.cp2 || (e.s ? `${STRATS[e.s].nom} : ${STRATS[e.s].def}` : null); }

function Question({ e, f, res, tmp, differe, validated, record, setTmp, setSig }) {
  const palier = f.palier; const intrus = e.t === "intrus"; const cat = intrus ? "INTRUS" : e.cat;
  const rec = res[e.k];
  const [wrong, setWrong] = useState([]); const [jnsp, setJnsp] = useState(0);
  const [aid, setAid] = useState(0); // 0 rien · 1 cp1 · 2 cp2 · 3 rappel de stratégie
  const [msg, setMsg] = useState(null); const [diags, setDiags] = useState([]);
  // Enregistre la réponse (valeurs passées explicitement pour éviter un état périmé).
  const finish = (final, w = wrong, dg = diags, j = jnsp, a = aid) => {
    const tries = w.length + j;
    const r = { cat, ok1: final === "ok" && tries === 0, tries: tries + (final === "ok" ? 1 : 0), wrong: w, diags: dg, jnsp: j > 0, aids: a > 0 ? 1 : 0, final };
    record(e.k, r); setSig(e.p || []);
  };
  // Aides selon le palier ; n = nombre d'échecs (erreurs + « Je ne sais pas »).
  const escalate = (n, isJnsp, w, dg, j) => {
    const hasCp2 = !!cp2Text(e);
    if (palier <= 2) {
      if (n === 1) { setAid(1); if (e.p) setSig(e.p); return; }
      if (n === 2 && isJnsp && hasCp2 && aid < 2) { setAid(2); return; }
      finish("revealed", w, dg, j, Math.max(aid, 1));
    } else {
      if (n === 1) { if (isJnsp && (e.s || e.aide)) setAid(3); else if (isJnsp) { setAid(1); if (e.p) setSig(e.p); } return; }
      finish("revealed", w, dg, j, aid);
    }
  };
  const choose = idx => {
    if (differe) { setTmp(e.k, idx); return; }
    if (rec || wrong.includes(idx)) return;
    if (idx === e.ok) { setMsg({ kind: "ok", text: e.fb || "Oui, c’est juste." }); finish("ok"); return; }
    const d = (e.no && e.no[idx] && e.no[idx][0]) || "I";
    const t = (e.no && e.no[idx] && e.no[idx][1]) || DIAGS[d].msg;
    const nw = [...wrong, idx]; const nd = [...diags, d]; setWrong(nw); setDiags(nd);
    setMsg({ kind: "no", text: t });
    // Si une seule réponse reste possible, on montre la correction.
    if (nw.length >= e.o.length - 1) { finish("revealed", nw, nd, jnsp, aid); return; }
    escalate(nw.length + jnsp, false, nw, nd, jnsp);
  };
  const dontKnow = () => {
    if (differe) { setTmp(e.k, -1); return; }
    if (rec) return;
    const nj = jnsp + 1; setJnsp(nj);
    setMsg({ kind: "jnsp", text: "Pas de souci : voici un coup de pouce." });
    escalate(wrong.length + nj, true, wrong, diags, nj);
  };

  const done = !!rec && (!differe || validated);
  const chosenTmp = tmp[e.k];
  const cp1 = cp1Text(e), cp2 = cp2Text(e);
  const qid = "q" + e.k;
  const qLines = e.q.split("\n");
  return (
    <div>
      <Title eyebrow={intrus ? "Chasse à l’intrus" : CATS[e.cat]} s={!intrus && palier <= 2 ? e.s : (intrus ? "S5" : null)}>
        {intrus ? "Je vérifie que ça tient" : "Question"}
      </Title>
      <div className="q-text" id={qid}>
        {qLines.length > 1
          ? <div className="ponc">{qLines.map((l, j) => <Say key={j} id={qid + "l" + j} as="p" text={l} />)}</div>
          : <Say id={qid} as="p" text={e.q} />}
      </div>
      <div className="opts" role="group" aria-labelledby={qid}>
        {e.o.map((o, j) => {
          let cls = "opt";
          if (differe && !validated) { if (chosenTmp === j) cls += " sel"; }
          else if (done) { if (j === e.ok) cls += " good"; else if ((rec.wrong || []).includes(j)) cls += " bad"; else cls += " dim"; }
          else if (wrong.includes(j)) cls += " bad";
          const dis = (done) || (!differe && wrong.includes(j));
          return (
            <button key={j} className={cls} onClick={() => choose(j)} disabled={dis} aria-pressed={differe && !validated ? chosenTmp === j : undefined}>
              <span className="opt-l" aria-hidden="true">{L[j]}</span>
              <Say id={qid + "o" + j} text={o} click={false} className="opt-t" />
              {(done && j === e.ok) && <span className="opt-i" aria-label="bonne réponse">{Ico.check}</span>}
              {((done && (rec.wrong || []).includes(j)) || (!done && !differe && wrong.includes(j))) && <span className="opt-i" aria-label="réponse écartée">{Ico.cross}</span>}
            </button>
          );
        })}
        {!done && <button className={"btn flat jnsp" + (differe && chosenTmp === -1 ? " sel" : "")} onClick={dontKnow} aria-pressed={differe ? chosenTmp === -1 : undefined}>Je ne sais pas</button>}
      </div>

      <div className="feedback" role="status" aria-live="polite">
        {!done && msg && msg.kind === "no" && <p className="fb no"><Say id={qid + "m" + wrong.length} text={msg.text} /></p>}
        {!done && msg && msg.kind === "jnsp" && <p className="fb neutral"><Say id={qid + "j" + jnsp} text={msg.text} /></p>}
        {!done && aid === 1 && <div className="aid"><div className="eyebrow">Coup de pouce</div><Say id={qid + "c1"} as="p" text={cp1} /></div>}
        {!done && aid === 2 && <div className="aid"><div className="eyebrow">Coup de pouce</div><Say id={qid + "c2"} as="p" text={cp2} /></div>}
        {!done && aid === 3 && e.s && <div className="aid"><div className="eyebrow">Rappel de stratégie</div><StratTag s={e.s} /><Say id={qid + "c3"} as="p" text={STRATS[e.s].def + (e.aide ? " " + e.aide : "")} /></div>}
        {!done && !differe && palier === 2 && aid === 1 && cp2 && <button className="btn sm" onClick={() => setAid(2)}>{Ico.bulb}<span>Un indice de plus</span></button>}
        {!done && !differe && palier === 3 && aid !== 3 && (e.s || e.aide) && <button className="btn sm" onClick={() => { setAid(3); }}>{Ico.bulb}<span>Rappel de stratégie</span></button>}
        {done && <Correction e={e} rec={rec} qid={qid} />}
        {differe && !validated && chosenTmp != null && <p className="muted small">Réponse enregistrée. Tu pourras la vérifier à la fin de la séance.</p>}
      </div>
    </div>
  );
}
function Correction({ e, rec, qid }) {
  if (rec.final === "ok") return <p className="fb ok">{Ico.check}<Say id={qid + "ok"} text={(rec.ok1 ? "" : "Tu as trouvé. ") + (e.fb || "C’est juste.")} /></p>;
  const last = (rec.wrong || [])[rec.wrong.length - 1];
  const why = last != null && e.no && e.no[last] && e.no[last][1];
  return (
    <div className="fb reveal">
      <Say id={qid + "rv"} as="p" text={`La bonne réponse est « ${e.o[e.ok]} ».`} />
      {why && <Say id={qid + "rw"} as="p" className="muted" text={`Ta réponse : ${why}`} />}
      {e.fb && <Say id={qid + "rf"} as="p" text={e.fb} />}
    </div>
  );
}

/* ---------- Palier 4 : vérification puis correction ---------- */
function Verif({ screens, tmp, validated, validate, goto }) {
  const qs = screens.map((x, idx) => ({ x, idx })).filter(o => o.x.t === "q" || o.x.t === "intrus");
  const [confirm, setConfirm] = useState(false);
  const missing = qs.filter(o => tmp[o.x.k] == null).length;
  return (
    <div>
      <Title eyebrow="Avant la correction">Je vérifie mes réponses</Title>
      <p>Relis chaque question. Tu peux encore changer une réponse avec « Revoir ».</p>
      <ul className="strat-list">{Object.keys(STRATS).map(k => <li key={k}><StratTag s={k} /></li>)}</ul>
      <ol className="verif">
        {qs.map(({ x, idx }, j) => {
          const c = tmp[x.k];
          return (
            <li key={x.k}>
              <span className="v-q"><b>{j + 1}.</b> {x.q.split("\n").slice(-1)[0]}</span>
              <span className={"v-a" + (c == null ? " miss" : "")}>{c == null ? "Pas de réponse" : c === -1 ? "Je ne sais pas" : `${L[c]}) ${x.o[c]}`}</span>
              {!validated && <button className="btn sm" onClick={() => goto(idx)}>Revoir</button>}
            </li>
          );
        })}
      </ol>
      {!validated && (missing && !confirm
        ? <button className="btn primary" onClick={() => setConfirm(true)}>Valider mes réponses</button>
        : <div className="row">{missing > 0 && <p className="notice warn">Il reste {missing} question{missing > 1 ? "s" : ""} sans réponse. Valider quand même ?</p>}
          <button className="btn primary" data-autofocus onClick={validate}>{Ico.check}<span>{missing ? "Oui, valider" : "Valider mes réponses"}</span></button></div>)}
      {validated && <p className="fb ok">{Ico.check}<span>Réponses validées. Continue pour voir la correction.</span></p>}
    </div>
  );
}
function Corr({ screens, res }) {
  const qs = screens.filter(x => x.t === "q" || x.t === "intrus");
  const ok = qs.filter(x => res[x.k] && res[x.k].ok1).length;
  return (
    <div>
      <Title eyebrow="Correction">{ok} réponse{ok > 1 ? "s" : ""} juste{ok > 1 ? "s" : ""} sur {qs.length}</Title>
      <ol className="corr">
        {qs.map((x, j) => {
          const r = res[x.k] || {}; const c = (r.wrong || [])[0];
          return (
            <li key={x.k} className={r.ok1 ? "good" : "bad"}>
              <Say id={"cq" + x.k} as="p" className="q-text" text={`${j + 1}. ${x.q.split("\n").slice(-1)[0]}`} />
              {r.ok1 ? <p className="fb ok">{Ico.check}<Say id={"cf" + x.k} text={x.fb || "Juste."} /></p> : (
                <div className="fb reveal">
                  <Say id={"cr" + x.k} as="p" text={`Bonne réponse : « ${x.o[x.ok]} ». ${r.jnsp ? "Tu avais choisi « Je ne sais pas »." : ""}`} />
                  {c != null && x.no && x.no[c] && x.no[c][1] && <Say id={"cw" + x.k} as="p" className="muted" text={`Ta réponse : ${x.no[c][1]}`} />}
                  {x.fb && <Say id={"cx" + x.k} as="p" text={x.fb} />}
                </div>
              )}
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Bilan({ e, data, update }) {
  const key = "p" + e.palier; const b = data.bilan[key] || { strats: [], txt: "" };
  const set = patch => update(d => { d.bilan[key] = { ...(d.bilan[key] || { strats: [], txt: "" }), ...patch }; });
  const toggle = k => set({ strats: b.strats.includes(k) ? b.strats.filter(x => x !== k) : [...b.strats, k] });
  const q2 = e.palier === 4 ? "Quelle stratégie dois-tu encore travailler ?" : "Quelle question t’a fait demander un coup de pouce ?";
  return (
    <div>
      <Title eyebrow={`Bilan du palier ${e.palier}`}>Mes stratégies</Title>
      <p>Coche les stratégies que tu as utilisées.</p>
      <div className="checks">
        {Object.keys(STRATS).map(k => (
          <label key={k} className={"check" + (b.strats.includes(k) ? " on" : "")}>
            <input type="checkbox" checked={b.strats.includes(k)} onChange={() => toggle(k)} />
            {SIco[k]}<span><b>{STRATS[k].nom}</b><small>{STRATS[k].def}</small></span>
          </label>
        ))}
      </div>
      <label className="field-label" htmlFor={"bil" + key}>{q2}</label>
      <textarea id={"bil" + key} className="answer" rows={3} value={b.txt} onChange={ev => set({ txt: ev.target.value })} />
    </div>
  );
}

function Fin({ f, sk, res, screens }) {
  const qs = screens.filter(x => x.t === "q" || x.t === "intrus");
  const ans = qs.filter(x => res[x.k]); const ok1 = ans.filter(x => res[x.k].ok1).length;
  const nextMsg = sk === "A" ? "La séance B de cette fiche s’ouvrira demain : espacer les séances aide à retenir." : "Fiche terminée ! La prochaine fiche t’attend sur l’accueil.";
  return (
    <div className="fin">
      <Title eyebrow={`Fiche ${f.id} · Séance ${sk}`}>Séance terminée</Title>
      <p className="big-num"><b>{ok1}</b> / {ans.length || qs.length}</p>
      <p>réponse{ok1 > 1 ? "s" : ""} trouvée{ok1 > 1 ? "s" : ""} du premier coup.</p>
      <p>{nextMsg}</p>
    </div>
  );
}

/* ---------- Suivi (adulte) ---------- */
function Suivi({ data, name, go }) {
  const all = []; FICHES.forEach(f => ["A", "B"].forEach(sk => qKeys(f, sk).forEach(k => { const r = (data.res[f.id] || {})[k]; if (r) all.push({ f, sk, k, r }); })));
  const tot = all.length; const ok1 = all.filter(x => x.r.ok1).length;
  const aids = all.filter(x => x.r.aids > 0).length; const jn = all.filter(x => x.r.jnsp).length;
  const byCat = {}; all.forEach(x => { const c = x.r.cat || "?"; byCat[c] = byCat[c] || { n: 0, ok: 0 }; byCat[c].n++; if (x.r.ok1) byCat[c].ok++; });
  const dg = {}; all.forEach(x => (x.r.diags || []).forEach(d => { dg[d] = (dg[d] || 0) + 1; }));
  const raps = Object.values(data.rap); const rapOk = raps.filter(x => x === "oui").length;
  const pct = (a, b) => b ? Math.round((100 * a) / b) : 0;
  return (
    <main id="main" tabIndex={-1} className="suivi">
      <section className="card">
        <div className="pal-head">
          <div><div className="eyebrow">Suivi détaillé</div><h2 className="h-mid">{name || "Mon parcours"}</h2></div>
          <div className="row tight no-print">
            <button className="btn" onClick={() => window.print()}>{Ico.print}<span>Imprimer</span></button>
            <button className="btn" onClick={() => go("home")}>{Ico.home}<span>Accueil</span></button>
          </div>
        </div>
        <div className="kpis">
          <div><b>{tot}</b><span>questions faites</span></div>
          <div><b>{pct(ok1, tot)} %</b><span>réussies du premier coup</span></div>
          <div><b>{aids}</b><span>avec coup de pouce</span></div>
          <div><b>{jn}</b><span>« Je ne sais pas »</span></div>
          <div><b>{raps.length ? pct(rapOk, raps.length) + " %" : "–"}</b><span>rappels réussis</span></div>
        </div>
      </section>
      <section className="card">
        <h3 className="h-small">Par type de question (réussite du premier coup)</h3>
        {!tot ? <p className="muted">Pas encore de réponses.</p> : (
          <ul className="bars">
            {Object.keys(CATS).filter(c => byCat[c]).map(c => (
              <li key={c}><span className="b-l">{CATS[c]}</span><span className="b-bar" aria-hidden="true"><i style={{ width: pct(byCat[c].ok, byCat[c].n) + "%" }} /></span><span className="b-v">{byCat[c].ok}/{byCat[c].n}</span></li>
            ))}
          </ul>
        )}
      </section>
      <section className="card">
        <h3 className="h-small">Types d’erreurs</h3>
        {!Object.keys(dg).length ? <p className="muted">Aucune erreur enregistrée.</p> : (
          <table className="tbl"><thead><tr><th>Erreur</th><th>Nombre</th><th>Piste de travail</th></tr></thead><tbody>
            {Object.keys(DIAGS).filter(d => dg[d]).map(d => (
              <tr key={d}><td>{DIAGS[d].nom}</td><td>{dg[d]}</td><td className="small">{{
                L: "Montrer que le texte « dit » sans écrire : indices, accords, sous-entendus (stratégie Texte + tête).",
                I: "Revenir systématiquement à l’indice du texte avant de répondre (stratégie Le texte permet-il de répondre ?).",
                C: "Ralentir, reformuler le passage avec ses mots (stratégie Je me fais le film), repérer les connecteurs (mais, pourtant).",
                R: "Remonter au référent et vérifier par substitution (stratégie Qui est qui ?).",
                D: "Hiérarchiser : idée principale contre détail ; plan du texte (stratégie Je repère le plan).",
              }[d]}</td></tr>
            ))}
          </tbody></table>
        )}
      </section>
      <section className="card">
        <h3 className="h-small">Fiches</h3>
        <table className="tbl"><thead><tr><th>Fiche</th><th>Séance A</th><th>Séance B</th><th>Du premier coup</th></tr></thead><tbody>
          {FICHES.map(f => {
            const ks = [...qKeys(f, "A"), ...qKeys(f, "B")]; const r = data.res[f.id] || {}; const a = ks.filter(k => r[k]);
            return <tr key={f.id}><td><b>{f.id}</b> {f.titre}</td><td>{fmtDay(pget(data, f.id, "A").done) || "–"}</td><td>{fmtDay(pget(data, f.id, "B").done) || "–"}</td><td>{a.length ? `${a.filter(k => r[k].ok1).length}/${a.length}` : "–"}</td></tr>;
          })}
        </tbody></table>
      </section>
      <section className="card">
        <h3 className="h-small">Productions écrites</h3>
        {FICHES.filter(f => data.txt[f.id] && Object.values(data.txt[f.id]).some(Boolean)).map(f => (
          <details key={f.id} className="adult"><summary>Fiche {f.id} · {f.titre}</summary>
            {Object.entries(data.txt[f.id]).filter(([, v]) => v).map(([k, v]) => {
              const sc = f[k[0]] && f[k[0]].ecrans[Number(k.slice(1))];
              return <div key={k} className="prod"><div className="eyebrow">Séance {k[0]} · {sc && sc.t === "film" ? "Mon film en une phrase" : (sc && sc.consigne) || "J’écris"}</div><p>{v}</p></div>;
            })}
          </details>
        ))}
        {!FICHES.some(f => data.txt[f.id] && Object.values(data.txt[f.id]).some(Boolean)) && <p className="muted">Pas encore de production écrite.</p>}
        {Object.keys(data.bilan).length > 0 && <>
          <h3 className="h-small">Bilans de palier</h3>
          {Object.entries(data.bilan).map(([k, b]) => <p key={k}><b>Palier {k.slice(1)}</b> · stratégies cochées : {b.strats.length ? b.strats.map(x => STRATS[x].nom).join(", ") : "aucune"}{b.txt ? ` · « ${b.txt} »` : ""}</p>)}
        </>}
      </section>
    </main>
  );
}

/* ---------- Enseignant : élèves ---------- */
function Profiles({ store, setStore, onClose }) {
  const [name, setName] = useState(""); const [del, setDel] = useState(null);
  const fileRef = useRef(null); const [msg, setMsg] = useState("");
  const add = () => {
    const n = name.trim(); if (!n) return;
    setStore(s => { const id = uid(); s.profiles[id] = { name: n, created: Date.now(), data: emptyData() }; s.order.push(id); s.cur = id; });
    setName("");
  };
  const exportAll = () => {
    const blob = new Blob([JSON.stringify(store, null, 1)], { type: "application/json" });
    const a = document.createElement("a"); a.href = URL.createObjectURL(blob); a.download = `comprehension-eleves-${todayKey()}.json`; a.click();
    setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  };
  const importAll = ev => {
    const file = ev.target.files && ev.target.files[0]; if (!file) return;
    file.text().then(t => {
      try {
        const s = JSON.parse(t); if (!s.profiles) throw new Error();
        setStore(cur => { Object.entries(s.profiles).forEach(([id, p]) => { const nid = cur.profiles[id] ? uid() : id; cur.profiles[nid] = { ...p, data: fixData(p.data) }; cur.order.push(nid); }); if (!cur.cur) cur.cur = cur.order[0]; });
        setMsg("Import terminé : les élèves du fichier ont été ajoutés.");
      } catch (e) { setMsg("Ce fichier n’est pas une sauvegarde valide."); }
    });
    ev.target.value = "";
  };
  return (
    <Modal title="Élèves" onClose={onClose} wide labelId="prof-title">
      <form className="row" onSubmit={ev => { ev.preventDefault(); add(); }}>
        <label htmlFor="new-name" className="sr">Prénom de l’élève</label>
        <input id="new-name" className="input" value={name} onChange={ev => setName(ev.target.value)} placeholder="Prénom de l’élève" data-autofocus />
        <button className="btn primary" type="submit" disabled={!name.trim()}>{Ico.plus}<span>Ajouter</span></button>
      </form>
      <ul className="profiles">
        {store.order.map(id => {
          const p = store.profiles[id]; if (!p) return null;
          const n = FICHES.filter(f => isDone(p.data, f, "B")).length;
          return (
            <li key={id} className={store.cur === id ? "cur" : ""}>
              <input className="input" aria-label="Prénom" value={p.name} onChange={ev => { const v = ev.target.value; setStore(s => { s.profiles[id].name = v; }); }} />
              <select aria-label="Palier de départ" value={p.data.startPalier} onChange={ev => { const v = Number(ev.target.value); setStore(s => { s.profiles[id].data.startPalier = v; }); }}>
                {PALIERS.map(x => <option key={x.n} value={x.n}>Départ : palier {x.n}</option>)}
              </select>
              <span className="muted small">{n}/{FICHES.length} fiches</span>
              <button className="btn sm" onClick={() => setStore(s => { s.cur = id; })} disabled={store.cur === id}>{store.cur === id ? "Élève actif" : "Choisir"}</button>
              {del === id
                ? <button className="btn sm danger" onClick={() => { setStore(s => { delete s.profiles[id]; s.order = s.order.filter(x => x !== id); if (s.cur === id) s.cur = s.order[0] || null; }); setDel(null); }}>Confirmer</button>
                : <button className="btn sm flat" onClick={() => setDel(id)} aria-label={`Supprimer ${p.name}`} title="Supprimer">{Ico.trash}</button>}
            </li>
          );
        })}
      </ul>
      {!store.order.length && <p className="muted">Ajoute un premier élève pour commencer.</p>}
      <div className="set-group">
        <h3>Sauvegarde</h3>
        <p className="muted small">Les données restent dans ce navigateur. Exporte-les régulièrement pour les garder ou les transférer sur un autre ordinateur.</p>
        <div className="row tight">
          <button className="btn" onClick={exportAll} disabled={!store.order.length}>{Ico.down}<span>Exporter tous les élèves</span></button>
          <button className="btn" onClick={() => fileRef.current && fileRef.current.click()}>{Ico.up}<span>Importer une sauvegarde</span></button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importAll} />
        </div>
        {msg && <p className="notice" role="status">{msg}</p>}
      </div>
    </Modal>
  );
}

/* ---------- Application ---------- */
function App() {
  const [store, setStoreState] = useState(loadStore);
  const storeRef = useRef(store);
  const setStore = useCallback(fn => {
    const s = JSON.parse(JSON.stringify(storeRef.current)); fn(s); storeRef.current = s; saveStore(s); setStoreState(s);
  }, []);
  const cur = TEACHER ? store.cur : null;
  const data = TEACHER ? (cur && store.profiles[cur] ? store.profiles[cur].data : null) : store;
  const update = useCallback(fn => setStore(s => { const d = TEACHER ? (s.cur && s.profiles[s.cur] && s.profiles[s.cur].data) : s; if (d) fn(d); }), []);
  const settingsRef = useRef(null); settingsRef.current = data ? data.settings : defaultSettings();
  const speaker = useMemo(() => new Speaker(() => settingsRef.current), []);
  const voices = useVoices();
  const [view, setView] = useState({ name: "home" });
  const [panel, setPanel] = useState(TEACHER && !store.order.length ? "profiles" : null);
  const [canInstall, setCanInstall] = useState(!!installEvt);
  useEffect(() => { const f = () => setCanInstall(!!installEvt); window.addEventListener("can-install", f); return () => window.removeEventListener("can-install", f); }, []);
  useEffect(() => { if (TEACHER) setView({ name: "home" }); }, [cur]);
  const go = (name, params = {}) => {
    speaker.stop(); setView({ name, ...params, key: Date.now() });
    requestAnimationFrame(() => { const m = document.getElementById("main"); if (m) m.focus({ preventScroll: true }); window.scrollTo(0, 0); });
  };
  const install = async () => { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch (e) {} installEvt = null; setCanInstall(false); };
  const f = view.fid ? FICHE[view.fid] : null;
  const pname = TEACHER && cur && store.profiles[cur] ? store.profiles[cur].name : "";

  return (
    <div className="app">
      <a className="skip" href="#main">Aller au contenu</a>
      <header className="toolbar">
        {view.name !== "home"
          ? <button className="btn flat" onClick={() => go("home")} aria-label="Accueil" title="Accueil">{Ico.home}<span className="lbl-txt">Accueil</span></button>
          : <span className="logo" aria-hidden="true">{Ico.book}</span>}
        <h1>{view.name === "session" && f ? `Fiche ${f.id} · ${f.titre}` : view.name === "suivi" ? "Suivi" : APP_NAME + (TEACHER ? " · enseignant" : "")}</h1>
        {TEACHER && store.order.length > 0 && view.name !== "session" && (
          <select className="prof-sel" aria-label="Élève actif" value={cur || ""} onChange={e => setStore(s => { s.cur = e.target.value; })}>
            {store.order.map(id => <option key={id} value={id}>{store.profiles[id].name}</option>)}
          </select>
        )}
        {TEACHER && view.name !== "session" && <button className="btn flat" onClick={() => setPanel("profiles")} aria-label="Élèves" title="Élèves">{Ico.users}<span className="lbl-txt">Élèves</span></button>}
        {TEACHER && data && view.name === "home" && <button className="btn flat" onClick={() => go("suivi")} aria-label="Suivi" title="Suivi">{Ico.chart}<span className="lbl-txt">Suivi</span></button>}
        {!TEACHER && canInstall && <button className="btn" onClick={install} aria-label="Installer l’application" title="Installer l’application">{Ico.install}<span className="lbl-txt">Installer</span></button>}
        {data && <button className="btn flat" onClick={() => setPanel("settings")} aria-label="Réglages" title="Réglages">{Ico.gear}<span className="lbl-txt">Réglages</span></button>}
        <button className="btn flat" onClick={() => setPanel("help")} aria-label="Aide" title="Aide">{Ico.help}<span className="lbl-txt">Aide</span></button>
      </header>
      {!data && (
        <main id="main" tabIndex={-1}>
          <section className="card banner"><div><h2>Bienvenue</h2><p>Ajoute un premier élève pour commencer. Chaque élève a son parcours, ses réglages d’affichage et son suivi.</p></div>
            <button className="btn primary big" onClick={() => setPanel("profiles")}>{Ico.plus}<span>Ajouter un élève</span></button></section>
        </main>
      )}
      {data && view.name === "home" && <>{TEACHER && <div className="who"><span className="muted">Élève :</span> <b>{pname}</b></div>}<Home data={data} update={update} go={go} /></>}
      {data && view.name === "session" && <Session key={view.key} fid={view.fid} sk={view.sk} data={data} update={update} speaker={speaker} voices={voices} go={go} />}
      {data && view.name === "suivi" && <Suivi data={data} name={pname} go={go} />}
      {panel === "settings" && data && <SettingsPanel data={data} update={update} speaker={speaker} voices={voices} onClose={() => setPanel(null)} openSuivi={() => { setPanel(null); go("suivi"); }} />}
      {panel === "help" && <Help onClose={() => setPanel(null)} />}
      {panel === "profiles" && TEACHER && <Profiles store={store} setStore={setStore} onClose={() => setPanel(null)} />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
