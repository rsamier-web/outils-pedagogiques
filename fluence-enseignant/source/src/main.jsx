import React, { useState, useEffect, useRef, useCallback, useMemo, useSyncExternalStore } from "react";
import { createRoot } from "react-dom/client";
import {
  SERIES, SERIES_IDS, seriesOf, textsOf, textById, LEVELS, thresholds, levelOf, tooFast, fmtTime, fmtSec, cleanWord,
  todayKey, parseKey, diffDays, defaultSettings, textState, computeStreak, weekInfo, textWeek, WEEK_GOAL, REST_PER_WEEK,
  loadStore, saveStore, newProfile, fixProfile, uid, viewOf, writeBack, SINGLE_APPS, fromSingleApp,
} from "./data.js";
import { Speaker, ttsSupported, frenchVoices } from "./speech.js";

const FONTS = [
  { id: "andika", name: "Andika", css: "'Andika', sans-serif" },
  { id: "atkinson", name: "Atkinson Hyperlegible", css: "'Atkinson Hyperlegible', sans-serif" },
  { id: "lexend", name: "Lexend", css: "'Lexend', sans-serif" },
];
const fontCss = id => (FONTS.find(f => f.id === id) || FONTS[0]).css;
const reduceMotion = () => { try { return window.matchMedia("(prefers-reduced-motion: reduce)").matches; } catch (e) { return false; } };

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
  again: <I d={<><path d="M4 12a8 8 0 1 0 2.4-5.7" /><path d="M4 4v4h4" /></>} />,
  gear: <I d={<><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M4.9 19.1L7 17M17 7l2.1-2.1" /></>} />,
  help: <I d={<><circle cx="12" cy="12" r="9" /><path d="M9.5 9.5a2.5 2.5 0 1 1 3.5 2.3c-.7.3-1 .8-1 1.5v.7" /><circle cx="12" cy="17" r=".6" fill="currentColor" /></>} />,
  home: <I d={<><path d="M3 11l9-7 9 7" /><path d="M5 10v10h14V10" /></>} />,
  timer: <I d={<><circle cx="12" cy="13" r="8" /><path d="M12 9v4l3 2M10 2h4" /></>} />,
  ear: <I d={<><path d="M11 5L6 9H3v6h3l5 4z" /><path d="M15.5 8.5a5 5 0 0 1 0 7M18.5 5.5a9 9 0 0 1 0 13" /></>} />,
  words: <I d={<><rect x="3" y="5" width="18" height="14" rx="2" /><path d="M7 10h4M7 14h10M14 10h3" /></>} />,
  install: <I d={<><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>} />,
  check: <I d={<path d="M5 12.5l4.5 4.5L19 7.5" />} />,
  close: <I d={<path d="M6 6l12 12M18 6L6 18" />} />,
  lock: <I size={18} d={<><rect x="5" y="11" width="14" height="9" rx="2" /><path d="M8 11V8a4 4 0 0 1 8 0v3" /></>} />,
  book: <I d={<><path d="M4 5.5C6.5 4.5 9.5 4.5 12 6c2.5-1.5 5.5-1.5 8-.5V19c-2.5-1-5.5-1-8 .5-2.5-1.5-5.5-1.5-8-.5z" /><path d="M12 6v13.5" /></>} />,
  flag: <I d={<><path d="M5 21V4" /><path d="M5 4h11l-2 4 2 4H5" /></>} />,
  voice: <I d={<><path d="M4 5h16v11H10l-4 4v-4H4z" /><path d="M8 9h8M8 12h5" /></>} />,
  users: <I d={<><circle cx="9" cy="8" r="3.2" /><path d="M3 20c.5-3.5 3-5.5 6-5.5s5.5 2 6 5.5" /><circle cx="17" cy="9" r="2.5" /><path d="M16.5 14.5c2.5.2 4 1.8 4.5 4.5" /></>} />,
  chart: <I d={<><path d="M4 20V4M4 20h16" /><path d="M8 16v-5M12 16V8M16 16v-3" /></>} />,
  plus: <I d={<path d="M12 5v14M5 12h14" />} />,
  trash: <I size={18} d={<><path d="M4 7h16M10 11v6M14 11v6" /><path d="M6 7l1 13h10l1-13M9 7V4h6v3" /></>} />,
  down: <I d={<><path d="M12 4v11M7 10l5 5 5-5" /><path d="M5 20h14" /></>} />,
  up: <I d={<><path d="M12 16V5M7 10l5-5 5 5" /><path d="M5 20h14" /></>} />,
};

/* ---------- Installation (Chrome ordinateur / Android) ---------- */
let installEvt = null;
window.addEventListener("beforeinstallprompt", e => { e.preventDefault(); installEvt = e; window.dispatchEvent(new Event("can-install")); });
window.addEventListener("appinstalled", () => { installEvt = null; window.dispatchEvent(new Event("can-install")); });

/* ---------- Fenêtre modale accessible (focus piégé, Échap) ---------- */
function Modal({ title, onClose, children, side, wide, labelId }) {
  const ref = useRef(null); const opener = useRef(document.activeElement);
  useEffect(() => {
    const el = ref.current; const sel = 'button:not([disabled]), [href], input, select, textarea, [tabindex]:not([tabindex="-1"])';
    const f = el.querySelector("[data-autofocus]") || el.querySelector(sel); if (f) f.focus();
    const key = e => {
      if (e.key === "Escape") { e.preventDefault(); onClose(); return; }
      if (!el.contains(document.activeElement) && e.key === "Tab") { e.preventDefault(); const f2 = el.querySelector(sel); if (f2) f2.focus(); return; }
      if (e.key === "Tab") {
        const items = [...el.querySelectorAll(sel)].filter(x => x.offsetParent !== null); if (!items.length) return;
        const a = items[0], b = items[items.length - 1];
        if (e.shiftKey && document.activeElement === a) { e.preventDefault(); b.focus(); }
        else if (!e.shiftKey && document.activeElement === b) { e.preventDefault(); a.focus(); }
      }
    };
    // Écouté sur le document : Échap ferme aussi la fenêtre quand le focus s'est perdu.
    document.addEventListener("keydown", key);
    const o = opener.current;
    return () => { document.removeEventListener("keydown", key); if (o && o.focus && document.contains(o)) o.focus(); };
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

/* ---------- Petits contrôles de réglage ---------- */
function Slider({ label, min, max, step, value, onChange, fmt }) {
  const id = useMemo(() => "s" + Math.random().toString(36).slice(2), []);
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

/* ---------- Voix disponibles ---------- */
function useVoices() {
  const [state, setState] = useState({ list: frenchVoices(), ready: false });
  useEffect(() => {
    if (!ttsSupported()) { setState({ list: [], ready: true }); return; }
    const upd = () => setState(s => ({ list: frenchVoices(), ready: s.ready || frenchVoices().length > 0 }));
    window.speechSynthesis.addEventListener("voiceschanged", upd); upd();
    const iv = setInterval(upd, 400); // Android ne déclenche pas toujours « voiceschanged »
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
        <li>Sur Android : Paramètres › Accessibilité (ou Système › Langues) › Synthèse vocale › moteur « Google » › installer les données vocales en français.</li>
        <li>Sur ordinateur : utilise Google Chrome (voix Google en ligne) ou ajoute une voix française dans les réglages de langue du système.</li>
      </ul>
      Ensuite, recharge la page.
    </div>
  );
}

/* ---------- Réglages ---------- */
function SettingsPanel({ data, update, speaker, voices, onClose }) {
  const s = data.settings;
  const set = patch => update(d => { d.settings = { ...d.settings, ...patch }; });
  const [confirmReset, setConfirmReset] = useState(false);
  return (
    <Modal title="Réglages" onClose={onClose} side labelId="settings-title">
      <section className="set-group">
        <h3>Affichage du texte</h3>
        <div className="field">
          <span className="field-label" id="font-lbl">Police</span>
          <div className="seg" role="radiogroup" aria-labelledby="font-lbl">
            {FONTS.map(f => (
              <label key={f.id} className={"seg-opt" + (s.font === f.id ? " on" : "")} style={{ fontFamily: f.css }}>
                <input type="radio" name="font" value={f.id} checked={s.font === f.id} onChange={() => set({ font: f.id })} />
                {f.name}
              </label>
            ))}
          </div>
        </div>
        <Slider label="Taille du texte" min={16} max={30} step={1} value={s.size} onChange={v => set({ size: v })} fmt={v => v + " px"} />
        <Slider label="Interligne" min={1.4} max={2.2} step={0.1} value={s.lh} onChange={v => set({ lh: Math.round(v * 10) / 10 })} fmt={v => v.toFixed(1).replace(".", ",")} />
        <Switch label="Espacement élargi des lettres et des mots" checked={s.spacing} onChange={v => set({ spacing: v })} />
        <div className={"preview" + (s.spacing ? " wide" : "")} style={{ fontFamily: fontCss(s.font), fontSize: s.size + "px", lineHeight: s.lh }} aria-label="Aperçu">
          {seriesOf(data).preview[0]}<br />{seriesOf(data).preview[1]}
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
        <button className="btn" onClick={() => speaker.say("Bonjour ! Je vais t’aider à lire. Clique sur un mot pour l’entendre.")} disabled={!voices.list.length}>
          {Ico.ear}<span>Tester la voix</span>
        </button>
        <Switch label="Surligner la ligne lue" checked={s.highlight} onChange={v => set({ highlight: v })} />
        <div className="field">
          <span className="field-label" id="click-lbl">Un clic sur un mot lit…</span>
          <div className="seg" role="radiogroup" aria-labelledby="click-lbl">
            {[["word", "le mot"], ["sentence", "la phrase"]].map(([v, l]) => (
              <label key={v} className={"seg-opt" + (s.clickMode === v ? " on" : "")}>
                <input type="radio" name="click" value={v} checked={s.clickMode === v} onChange={() => set({ clickMode: v })} />{l}
              </label>
            ))}
          </div>
        </div>
        <Switch label="Passer seul à la page suivante" hint="Après « Lire la page », la lecture continue jusqu’à la fin du texte." checked={s.autoNext} onChange={v => set({ autoNext: v })} />
      </section>

      <section className="set-group">
        <h3>Chrono</h3>
        <Switch label="Afficher les secondes pendant la lecture" hint="Désactivé : le temps s’affiche seulement à la fin, pour lire sans pression." checked={s.showTimer} onChange={v => set({ showTimer: v })} />
      </section>

      <section className="set-group">
        <h3>Pour l’enseignant</h3>
        <Switch label="Déverrouiller tous les textes" hint="Permet de changer de texte sans attendre la fin de la semaine." checked={data.unlockAll} onChange={v => update(d => { d.unlockAll = v; })} />
        <div className="row">
          <button className="btn" onClick={() => set(defaultSettings())}>Rétablir les réglages par défaut</button>
          {!confirmReset
            ? <button className="btn" onClick={() => setConfirmReset(true)}>Effacer la progression de cet élève…</button>
            : <button className="btn danger" onClick={() => { update(d => { const st = d.settings; Object.assign(d, { cur: 0, texts: {}, readings: [], days: [], best: 0, unlockAll: false, settings: st }); }); setConfirmReset(false); }}>Confirmer : tout effacer</button>}
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
        <li>Tu travailles <b>un texte par semaine</b>. Lis-le à voix haute <b>au moins {WEEK_GOAL} jours</b> dans la semaine.</li>
        <li><b>Lire page par page</b> : la voix lit une page, puis s’arrête. À toi de relire cette page à voix haute, juste après. Ensuite, passe à la page suivante.</li>
        <li><b>Écouter le texte</b> : la voix lit tout le texte pendant que tu suis des yeux.</li>
        <li><b>Mots à préparer</b> : écoute les mots difficiles avant de lire.</li>
        <li><b>Lire sans chrono</b> : entraîne-toi à lire tout le texte à voix haute, sans être chronométré. Le texte s’ouvre à la dernière page lue.</li>
        <li><b>Lire avec le chrono</b> : lis le texte en entier, puis clique sur « J’ai fini ». Ton temps s’affiche à la fin, avec ton tempo.</li>
        <li>Les <b>paliers</b> portent les noms des tempos musicaux, du plus lent (largo) au plus rapide (presto). Tu te compares seulement à toi-même : chaque semaine, vise le palier suivant.</li>
        <li>Si un mot est difficile, <b>clique dessus</b> (ou touche-le) : la voix le lit.</li>
        <li>Ta <b>série</b> compte tes jours de lecture. Tu peux prendre {REST_PER_WEEK} jours de repos par semaine (du lundi au dimanche) sans la perdre.</li>
      </ul>
      <h3>Clavier et écran tactile</h3>
      <ul className="help-list">
        <li><kbd>←</kbd> <kbd>→</kbd> : page précédente / suivante.</li>
        <li><kbd>Espace</kbd> : lire la page, mettre en pause, reprendre. <kbd>Entrée</kbd> active le bouton sélectionné.</li>
        <li>Sur téléphone : fais glisser le texte vers la gauche ou la droite pour changer de page.</li>
      </ul>
      <details className="adult">
        <summary>Pour l’adulte : principes et conseils</summary>
        <p><b>Lecture répétée.</b> Relire le même texte plusieurs jours de suite, avec un modèle oral, améliore la vitesse et la prosodie ; le gain se transfère à d’autres textes. D’où un texte par semaine et {WEEK_GOAL} lectures minimum.</p>
        <p><b>Charge cognitive et apprentissage multimédia (Sweller, Mayer).</b></p>
        <ul className="help-list">
          <li>Cohérence : aucune image décorative, un seul texte à l’écran, réglages rangés à part.</li>
          <li>Segmentation : le texte est découpé en pages courtes, par unités de sens ; l’élève avance à son rythme.</li>
          <li>Pré-entraînement : les mots difficiles sont écoutés avant la lecture.</li>
          <li>Signalement et contiguïté temporelle : la voix lit ligne par ligne et la ligne lue est surlignée pendant toute sa lecture (synchronisation exacte, quelle que soit la voix).</li>
          <li>Modalité : la voix sert de modèle à l’écoute, puis disparaît pendant la lecture chronométrée (seule l’aide « mot par mot » reste).</li>
          <li>Pression temporelle réduite : le chrono tourne sans afficher les secondes (réglable) ; le temps et le palier s’affichent à la fin, comparés aux propres temps de l’élève.</li>
        </ul>
        <p><b>Déroulé conseillé.</b> Jour 1 : écouter le texte en suivant des yeux, préparer les mots, puis lire avec le chrono. Jours suivants : une lecture chronométrée, avec réécoute des mots difficiles au besoin. L’application ne note pas les erreurs : écoutez l’élève lire de temps en temps.</p>
        <p><b>Paliers de vitesse.</b> Neuf tempos musicaux, du largo au presto, sur un dégradé bleu → indigo : pas de code vert / orange / rouge ni d’image enfantine. Cycle 3 : environ 41 à 108 mots par minute (temps des fiches papier). Collège : environ 70 à 170. Les temps cibles s’ajustent à la longueur de chaque texte.</p>
        <p><b>Deux séries de textes.</b> Cycle 3 : 8 récits courts dans un monde de blocs. Collège : 8 « Carnets du monde » sur l’art, les voyages et les cultures, avec un narrateur qui ne marque ni le masculin ni le féminin. La série se choisit pour chaque élève dans « Élèves » ; changer de série garde la progression de l’autre.</p>
        <p><b>Profils et données.</b> Chaque élève a ses réglages d’affichage et de voix, sa série de jours et sa progression. Tout reste dans ce navigateur, sur cet appareil : rien n’est envoyé sur Internet. Pensez à « Exporter tous les élèves » de temps en temps pour garder une sauvegarde, ou pour passer sur un autre appareil (« Importer une sauvegarde »).</p>
        <p><b>Installer l’application.</b> Dans Chrome sur ordinateur : bouton « Installer » en haut, ou icône d’installation dans la barre d’adresse. Sur Android : menu ⋮ › « Installer l’application » ou « Ajouter à l’écran d’accueil ». Les réglages et la progression restent sur l’appareil.</p>
      </details>
    </Modal>
  );
}

/* ---------- Série ---------- */
function StreakCard({ data, compact }) {
  const streak = computeStreak(data.days); const wk = weekInfo(data.days);
  const todayDone = data.days.includes(todayKey()); const goal = wk.done >= WEEK_GOAL;
  let msg;
  if (goal) msg = "Objectif de la semaine atteint. Bravo !";
  else if (todayDone) msg = "Journée validée. À demain !";
  else if (wk.restLeft === 0 && streak > 0) msg = "Lis aujourd’hui pour garder ta série.";
  else msg = "Une lecture avec le chrono valide ta journée.";
  return (
    <section className={"card streak" + (compact ? " compact" : "")} aria-label="Ma série">
      <div className="streak-main">
        <div className="streak-num"><b>{streak}</b><span>{streak > 1 ? "jours de série" : "jour de série"}</span></div>
        <div className="streak-week">
          <ol className="week" aria-label="Semaine en cours">
            {wk.list.map(d => (
              <li key={d.k} className={"day " + d.st}>
                <span className="dl" aria-hidden="true">{d.label}</span>
                <span className="dot" aria-hidden="true">{d.st === "done" ? Ico.check : null}</span>
                <span className="sr">{d.full} : {d.st === "done" ? "lecture faite" : d.st === "today" ? "aujourd’hui" : d.st === "rest" ? "repos" : "à venir"}</span>
              </li>
            ))}
          </ol>
          <div className="goal">
            <span className="goal-bar" aria-hidden="true"><i style={{ width: Math.min(100, (100 * wk.done) / WEEK_GOAL) + "%" }} /></span>
            <span>{Math.min(wk.done, 7)} / {WEEK_GOAL} jours cette semaine</span>
          </div>
        </div>
      </div>
      <p className="streak-msg">{msg}</p>
    </section>
  );
}

/* ---------- Échelle des tempos : dégradé du plus lent (gauche) au plus rapide (droite) ---------- */
const Chip = ({ i }) => <span className="tchip" style={{ background: LEVELS[i].c }} aria-hidden="true" />;
function TempoScale({ P, bestMs, small, label = "ton meilleur temps" }) {
  const th = thresholds(P); const lvl = bestMs != null ? levelOf(P, bestMs) : -2;
  const next = lvl === -1 ? LEVELS.length - 1 : lvl > 0 ? lvl - 1 : -1;
  const order = LEVELS.map((_, i) => i).reverse();
  return (
    <div className={"tempo" + (small ? " small" : "")}>
      <div className="tempo-bar" aria-hidden="true">
        {order.map(i => (
          <span key={i} className={"seg" + (i === lvl ? " on" : "") + (i === next ? " next" : "")} style={{ background: LEVELS[i].c }}>
            {i === lvl && <b className="mark">{label}</b>}
          </span>
        ))}
      </div>
      <div className="tempo-ends" aria-hidden="true"><span>plus lent</span><span>plus rapide</span></div>
      <ol className="tempo-legend" aria-label="Paliers de vitesse, du plus lent au plus rapide">
        {order.map(i => (
          <li key={i} className={(i === lvl ? "on" : "") + (i === next ? " next" : "")}>
            <Chip i={i} /><span className="tn">{LEVELS[i].n}</span><span className="tt">&lt; {fmtSec(th[i])}</span>
            {i === lvl && <span className="sr"> : ton palier</span>}{i === next && <span className="sr"> : prochain palier</span>}
          </li>
        ))}
      </ol>
    </div>
  );
}

/* ---------- Accueil ---------- */
function Home({ data, update, go, who }) {
  const TX = textsOf(data); const ti = Math.min(data.cur, TX.length - 1); const P = TX[ti]; const wk = textWeek(data, ti);
  const isLast = ti === TX.length - 1;
  const canNext = !isLast && (wk.over || data.unlockAll);
  const nextText = () => update(d => {
    d.texts[P.id] = { ...textState(d, P.id), done: true };
    d.cur = ti + 1;
  });
  const lvlBest = wk.best != null ? levelOf(P, wk.best) : null;
  return (
    <main id="main" tabIndex={-1}>
      {who && <div className="who"><span className="muted">Élève :</span> <b>{who}</b></div>}
      <StreakCard data={data} />

      {wk.over && (
        <section className={"card banner" + (wk.count >= WEEK_GOAL ? " good" : "")} aria-live="polite">
          <div>
            <h2>{wk.count >= WEEK_GOAL ? "Semaine réussie !" : "La semaine est terminée"}</h2>
            <p>{isLast
              ? "Tu as travaillé tous les textes. Bravo pour ce long voyage ! Tu peux relire tes textes préférés."
              : wk.count >= WEEK_GOAL
                ? `Tu as lu « ${P.title} » ${wk.count} jours. Tu peux passer au texte suivant.`
                : `Tu as lu ce texte ${wk.count} jour${wk.count > 1 ? "s" : ""} sur ${WEEK_GOAL}. Tu peux passer au texte suivant, ou le relire encore quelques jours.`}</p>
          </div>
          {!isLast && <button className="btn primary" onClick={nextText}>{Ico.next}<span>Passer au texte suivant</span></button>}
        </section>
      )}

      <section className="card current" aria-labelledby="cur-title">
        <div className="cur-head">
          <div>
            <div className="eyebrow">Texte {ti + 1} sur {TX.length} · {seriesOf(data).short}</div>
            <h2 id="cur-title" style={{ fontFamily: fontCss(data.settings.font) }}>{P.title}</h2>
          </div>
          <div className="week-state">
            {wk.started
              ? <><b>Jour {Math.min(wk.day, 7)}</b> sur 7{wk.day > 7 && <span className="muted"> (semaine finie)</span>}</>
              : <span className="muted">La semaine commence à ta première lecture.</span>}
          </div>
        </div>
        <div className="pips" aria-label={`Lectures chronométrées : ${wk.count} jours sur ${WEEK_GOAL}`}>
          {Array.from({ length: WEEK_GOAL }, (_, i) => <span key={i} className={"pip" + (i < wk.count ? " on" : "")} aria-hidden="true">{i < wk.count ? Ico.check : null}</span>)}
          <span className="pips-lbl">{Math.min(wk.count, 7)} / {WEEK_GOAL} jours de lecture</span>
        </div>

        <ol className="steps">
          <li><button className="btn step" onClick={() => go("reader", { ti, mode: "echo" })}>
            <span className="num">1</span>{Ico.book}<span className="st-txt"><b>Lire page par page</b><small>Écoute une page, puis relis-la à voix haute.</small></span></button></li>
          <li><button className="btn step" onClick={() => go("reader", { ti, mode: "listen" })}>
            <span className="num">2</span>{Ico.ear}<span className="st-txt"><b>Écouter le texte</b><small>Suis des yeux pendant que la voix lit.</small></span></button></li>
          <li><button className="btn step" onClick={() => go("words", { ti })}>
            <span className="num">3</span>{Ico.words}<span className="st-txt"><b>Mots à préparer</b><small>Écoute les mots difficiles.</small></span></button></li>
          <li><button className="btn step" onClick={() => go("reader", { ti, mode: "read" })}>
            <span className="num">4</span>{Ico.voice}<span className="st-txt"><b>Lire sans chrono</b><small>Lis le texte à voix haute, à ton rythme.</small></span></button></li>
          <li><button className="btn step primary" onClick={() => go("reader", { ti, mode: "chrono" })}>
            <span className="num">5</span>{Ico.timer}<span className="st-txt"><b>Lire avec le chrono</b><small>Lis tout le texte à voix haute.</small></span></button></li>
        </ol>
      </section>

      <section className="card" aria-labelledby="times-title">
        <h2 id="times-title" className="h-small">Mes temps cette semaine</h2>
        <div className="days-grid">
          {(wk.started ? wk.grid : Array.from({ length: 7 }, (_, i) => ({ i, best: null, future: true }))).map(c => {
            const l = c.best != null ? levelOf(P, c.best) : null;
            return (
              <div key={c.i} className={"dcell" + (c.today ? " today" : "") + (c.best != null ? " done" : "")}>
                <span className="dname">Jour {c.i + 1}</span>
                {c.k && <span className="ddate">{parseKey(c.k).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric" })}</span>}
                <span className="dtime">{c.best != null ? fmtTime(c.best) : c.future ? "" : "—"}</span>
                <span className="dtempo">{l != null && l >= 0 ? <><Chip i={l} />{LEVELS[l].n}</> : ""}</span>
              </div>
            );
          })}
        </div>
        {wk.after > 0 && <p className="muted small">+ {wk.after} lecture{wk.after > 1 ? "s" : ""} après la semaine.</p>}
        <h3 className="h-small">Objectifs de vitesse</h3>
        <TempoScale P={P} bestMs={wk.best} />
        <p className="muted small">{wk.best != null
          ? <>Ton meilleur temps : <b>{fmtTime(wk.best)}</b>{lvlBest >= 0 ? <> — palier {LEVELS[lvlBest].n}</> : null}.</>
          : "Ton meilleur temps s’affichera ici."}</p>
      </section>

      <Library data={data} update={update} go={go} />
    </main>
  );
}

function Library({ data, update, go }) {
  const TX = textsOf(data); const cur = Math.min(data.cur, TX.length - 1);
  const wk = textWeek(data, cur);
  return (
    <section className="card" aria-labelledby="lib-title">
      <h2 id="lib-title" className="h-small">Mes textes</h2>
      <ul className="lib">
        {TX.map((P, i) => {
          const rs = data.readings.filter(r => r.id === P.id);
          const best = rs.length ? Math.min(...rs.map(r => r.ms)) : null;
          const lv = best != null ? levelOf(P, best) : null;
          const isCur = i === cur; const past = i < cur;
          const canSwitch = !isCur && (data.unlockAll || (i === cur + 1 && wk.over));
          const status = isCur ? "En cours" : past ? "Terminé" : canSwitch ? "Disponible" : "Verrouillé";
          return (
            <li key={P.id} className={"lib-item" + (isCur ? " cur" : "") + (!past && !isCur && !canSwitch ? " locked" : "")}>
              <span className="lib-n">{i + 1}</span>
              <span className="lib-t"><b>{P.title}</b><small>{status}{best != null ? ` · meilleur temps ${fmtTime(best)}` : ""}{lv != null && lv >= 0 ? " · " + LEVELS[lv].n : ""}</small></span>
              {past && <button className="btn" onClick={() => go("reader", { ti: i, mode: "read" })}>Relire</button>}
              {canSwitch && <button className="btn" onClick={() => update(d => { d.texts[TX[cur].id] = { ...textState(d, TX[cur].id), done: i > cur || textState(d, TX[cur].id).done }; d.cur = i; })}>Choisir</button>}
              {!past && !isCur && !canSwitch && <span className="lock" title="Disponible après une semaine sur le texte en cours">{Ico.lock}</span>}
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/* ---------- Mots à préparer ---------- */
function Words({ ti, data, speaker, voices, go }) {
  const P = textsOf(data)[ti]; const s = data.settings;
  const snap = useSyncExternalStore(speaker.sub, speaker.get);
  const [active, setActive] = useState(-1);
  useEffect(() => { if (snap.status === "idle") setActive(-1); }, [snap.status]);
  useEffect(() => () => speaker.stop(), []);
  const sayAll = () => {
    const q = P.mots.map((m, i) => ({ text: m, s: -1, toks: [{ tok: i, start: 0, w: 1 }], chars: m.length }));
    speaker.play(q, 0, { mode: "single" });
  };
  useEffect(() => { if (snap.mode === "single" && snap.w >= 0 && snap.w < P.mots.length) setActive(snap.w); }, [snap.w, snap.mode]);
  return (
    <main id="main" tabIndex={-1}>
      <section className="card">
        <div className="eyebrow">{P.title}</div>
        <h2 className="h-mid">Mots à préparer</h2>
        <p>Touche chaque mot pour l’écouter. Puis lis-le à voix haute, deux fois.</p>
        <NoVoice voices={voices} />
        <div className="word-grid" style={{ fontFamily: fontCss(s.font) }}>
          {P.mots.map((m, i) => (
            <button key={m} className={"btn word-btn" + (active === i ? " on" : "")} style={{ fontSize: Math.max(22, s.size + 4) + "px" }}
              onClick={() => { setActive(i); speaker.play([{ text: m, s: -1, toks: [{ tok: i, start: 0, w: 1 }], chars: m.length }], 0, { mode: "single" }); }}>
              {m}
            </button>
          ))}
        </div>
        <div className="row">
          <button className="btn" onClick={sayAll} disabled={!voices.list.length}>{Ico.ear}<span>Écouter tous les mots</span></button>
          <button className="btn primary" onClick={() => go("reader", { ti, mode: "chrono" })}>{Ico.timer}<span>Lire avec le chrono</span></button>
        </div>
      </section>
    </main>
  );
}

/* ---------- Lecteur ---------- */
const NBSP_BEFORE = /^[?!:;»]+$/;
function Reader({ ti, mode, data, update, speaker, voices, go, openSettings }) {
  const TX = textsOf(data); const P = TX[ti]; const s = data.settings; const last = P.pages.length - 1;
  const isCurrent = ti === Math.min(data.cur, TX.length - 1);
  const [page, setPage] = useState(() => mode === "read" ? Math.min(textState(data, P.id).page || 0, last) : 0);
  const [chrono, setChrono] = useState(mode === "chrono" ? "ready" : "off"); // off | ready | run
  const chronoRef = useRef(chrono); chronoRef.current = chrono;
  const echo = mode === "echo"; const [echoTurn, setEchoTurn] = useState(false);
  const [t0, setT0] = useState(0); const [now, setNow] = useState(0);
  const [result, setResult] = useState(null);
  const [toast, setToast] = useState("");
  const snap = useSyncExternalStore(speaker.sub, speaker.get);
  const autoPlay = useRef(false); const listenAll = useRef(mode === "listen");
  const textRef = useRef(null); const swipe = useRef(null); const lastSwipe = useRef(0);
  const settingsRef = useRef(s); settingsRef.current = s;

  // La semaine du texte commence à la première activité.
  useEffect(() => {
    if (isCurrent && !textState(data, P.id).start) update(d => { d.texts[P.id] = { ...textState(d, P.id), start: todayKey() }; });
    return () => speaker.stop();
  }, []);
  useEffect(() => { update(d => { d.texts[P.id] = { ...textState(d, P.id), page }; }); }, [page]);
  useEffect(() => { if (!toast) return; const t = setTimeout(() => setToast(""), 2600); return () => clearTimeout(t); }, [toast]);
  useEffect(() => {
    if (chrono !== "run" || !s.showTimer) return;
    const iv = setInterval(() => setNow(performance.now()), 500); return () => clearInterval(iv);
  }, [chrono, s.showTimer]);

  const pageQueue = p => P.pages[p].lineIdx.map(l => P.lineItems[l].item);
  const playPage = useCallback((p = page, from = 0) => {
    speaker.play(pageQueue(p), from, {
      mode: "page",
      onEnd: () => {
        // Lecture page par page : la voix s'arrête à la fin de la page, c'est au tour de l'élève.
        if (echo && chronoRef.current === "off") { setEchoTurn(true); return; }
        const cont = listenAll.current || settingsRef.current.autoNext;
        if (cont) setPage(cur => { if (cur < last) { autoPlay.current = true; return cur + 1; } listenAll.current = false; return cur; });
      },
    });
  }, [page, last]);
  useEffect(() => { if (autoPlay.current) { autoPlay.current = false; playPage(page); } }, [page]);
  // Mode « page par page » : chaque page est lue dès qu'on y arrive.
  useEffect(() => {
    if (!echo || chronoRef.current !== "off" || !voices.list.length) return;
    setEchoTurn(false); const t = setTimeout(() => playPage(page), 300); return () => clearTimeout(t);
  }, [page, voices.list.length > 0]);
  useEffect(() => { if (snap.status === "playing" && snap.mode === "page") setEchoTurn(false); }, [snap.status, snap.mode]);
  // Mode « Écouter le texte » : démarre tout de suite à la page 1.
  useEffect(() => { if (mode === "listen" && voices.list.length) { const t = setTimeout(() => playPage(0), 250); return () => clearTimeout(t); } }, [voices.list.length > 0]);

  const goto = useCallback(p => {
    if (p < 0 || p > last) return;
    autoPlay.current = false; listenAll.current = false; speaker.stop(); setPage(p);
  }, [last]);
  const nextPage = () => {
    if (page < last) goto(page + 1);
    else if (chrono === "run") finish();
    else goto(0);
  };
  const ttsBlocked = chrono === "run";
  const toggleRead = () => {
    if (ttsBlocked) { setToast("Pendant le chrono, touche un mot difficile pour l’écouter."); return; }
    if (!voices.list.length) { setToast("Aucune voix française n’est disponible."); return; }
    if (snap.status === "playing" && snap.mode === "page") speaker.pause();
    else if (snap.status === "paused") speaker.resume();
    else { listenAll.current = false; playPage(page); }
  };

  const startChrono = () => { speaker.stop(); listenAll.current = false; setPage(0); setResult(null); setChrono("run"); const t = performance.now(); setT0(t); setNow(t); textRef.current && textRef.current.focus(); };
  const cancelChrono = () => { setChrono("off"); setToast("Chrono annulé."); };
  const finish = () => {
    const ms = performance.now() - t0; speaker.stop(); setChrono("off");
    if (tooFast(P, ms)) { setResult({ invalid: true, ms }); return; }
    const prev = data.readings.filter(r => r.id === P.id);
    const prevBest = prev.length ? Math.min(...prev.map(r => r.ms)) : null;
    const prevLast = prev.length ? prev[prev.length - 1].ms : null;
    const tk = todayKey(); const wasDone = data.days.includes(tk);
    let streak = 0, record = false;
    update(d => {
      d.readings.push({ id: P.id, d: tk, ms: Math.round(ms), ts: Date.now() });
      if (!d.days.includes(tk)) d.days.push(tk);
      if (!textState(d, P.id).start && isCurrent) d.texts[P.id] = { ...textState(d, P.id), start: tk };
      streak = computeStreak(d.days); if (streak > (d.best || 0)) { record = streak >= 3 && streak > (d.best || 0); d.best = streak; }
    });
    setResult({ ms, prevBest, prevLast, streak: computeStreak([...new Set([...data.days, tk])]), record, wasDone, lvl: levelOf(P, ms) });
  };

  // Clavier : ← → pages, Espace lecture / pause.
  useEffect(() => {
    const onKey = e => {
      if (document.querySelector(".overlay")) return;
      const t = e.target; const tag = t && t.tagName;
      if (tag === "INPUT" || tag === "SELECT" || tag === "TEXTAREA" || (t && t.isContentEditable)) return;
      if (e.altKey || e.ctrlKey || e.metaKey) return;
      if (e.key === "ArrowRight") { e.preventDefault(); if (page < last) goto(page + 1); }
      else if (e.key === "ArrowLeft") { e.preventDefault(); goto(page - 1); }
      else if (e.key === " " || e.code === "Space") { e.preventDefault(); toggleRead(); }
    };
    window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey);
  });

  // Glissement gauche-droite (écran tactile).
  const onPointerDown = e => { if (e.pointerType === "mouse") return; swipe.current = { x: e.clientX, y: e.clientY, t: Date.now() }; };
  const onPointerUp = e => {
    const sw = swipe.current; swipe.current = null; if (!sw) return;
    const dx = e.clientX - sw.x, dy = e.clientY - sw.y;
    if (Math.abs(dx) > 60 && Math.abs(dx) > 1.6 * Math.abs(dy) && Date.now() - sw.t < 900) {
      lastSwipe.current = Date.now();
      if (dx < 0) { if (page < last) goto(page + 1); } else goto(page - 1);
    }
  };
  const onTextClick = e => {
    if (Date.now() - lastSwipe.current < 400) return;
    const el = e.target.closest && e.target.closest("[data-t]"); if (!el) return;
    const id = Number(el.dataset.t); const tok = P.tokens[id]; if (!tok.word) return;
    if (!voices.list.length) { setToast("Aucune voix française n’est disponible."); return; }
    if (s.clickMode === "sentence") speaker.play([{ ...P.sentences[tok.s].item, s: tok.l }], 0, { mode: "single" });
    else { const w = cleanWord(tok.t); speaker.play([{ text: w, s: -1, toks: [{ tok: id, start: 0, w: 1 }], chars: w.length }], 0, { mode: "single" }); }
  };

  const hlOn = s.highlight && snap.status === "playing";
  const reading = snap.status !== "idle" && snap.mode === "page";
  const readLabel = snap.status === "playing" && snap.mode === "page" ? "Pause" : snap.status === "paused" ? "Reprendre" : "Lire la page";
  const readIcon = snap.status === "playing" && snap.mode === "page" ? Ico.pause : Ico.play;
  const elapsed = chrono === "run" ? Math.max(0, now - t0) : 0;

  return (
    <main id="main" className="reader-main" tabIndex={-1}>
      <div className="reader-bar card" role="toolbar" aria-label="Lecture">
        <div className="tts">
          <button className="btn primary" onClick={toggleRead} disabled={ttsBlocked || !ttsSupported()} aria-keyshortcuts="Space" title={ttsBlocked ? "Indisponible pendant le chrono" : "Espace"}>
            {readIcon}<span>{readLabel}</span>
          </button>
          <button className="btn" onClick={() => { listenAll.current = false; speaker.stop(); }} disabled={snap.status === "idle"} aria-label="Arrêter" title="Arrêter">{Ico.stop}<span className="lbl-txt">Arrêter</span></button>
        </div>
        <div className="chrono" aria-live="polite">
          {chrono === "off" && <button className="btn" onClick={() => setChrono("ready")} aria-label="Chrono" title="Lire avec le chrono">{Ico.timer}<span className="lbl-txt">Chrono</span></button>}
          {chrono === "run" && <>
            <span className="chip run"><span className="rec" aria-hidden="true" />{s.showTimer ? fmtTime(elapsed) : "Chrono en marche"}</span>
            <button className="btn flat" onClick={cancelChrono}>Annuler</button>
          </>}
        </div>
      </div>

      <NoVoice voices={voices} />

      <article className="card reading-card" aria-labelledby="text-title">
        <header className="text-head">
          <h2 id="text-title" style={{ fontFamily: fontCss(s.font) }}>{P.title}</h2>
          <span className="muted">Page {page + 1} / {last + 1}</span>
        </header>
        <div ref={textRef} tabIndex={-1}
          className={"reading" + (s.spacing ? " wide" : "") + (hlOn ? " speaking" : "")}
          style={{ fontFamily: fontCss(s.font), fontSize: s.size + "px", lineHeight: s.lh }}
          onClick={onTextClick} onPointerDown={onPointerDown} onPointerUp={onPointerUp} onPointerCancel={() => (swipe.current = null)}
          aria-describedby="text-hint">
          {P.pages[page].lines.map((ids, li) => {
            const gl = P.pages[page].lineIdx[li];
            return (
              <p className={"line" + (hlOn && snap.s === gl ? " hl" : "")} key={li}>
                {ids.map((id, k) => {
                  const tok = P.tokens[id]; const nx = ids[k + 1] != null ? P.tokens[ids[k + 1]].t : null;
                  const sep = nx == null ? "" : (NBSP_BEFORE.test(nx) || tok.t === "—" || tok.t === "«") ? "\u00A0" : " ";
                  // Seul le mot touché par l'élève est surligné (lecture d'un mot isolé).
                  const cls = (tok.word ? "w" : "p") + (hlOn && snap.mode === "single" && snap.w === id ? " hw" : "");
                  return <React.Fragment key={id}><span data-t={id} className={cls}>{tok.t}</span>{sep}</React.Fragment>;
                })}
              </p>
            );
          })}
        </div>
        <p id="text-hint" className="sr">Clique sur un mot pour l’entendre.</p>
      </article>

      <div className="pager-wrap">
      {echo && echoTurn && chrono === "off" && snap.status === "idle" && (
        <div className="echo-prompt" role="status">
          <p><b>À toi !</b> Relis cette page à voix haute{page < last ? ", puis passe à la page suivante." : ". C’était la dernière page : bravo !"}</p>
          <div className="echo-actions">
            <button className="btn" onClick={() => playPage(page)}>{Ico.ear}<span>Réécouter la page</span></button>
            {page === last && <button className="btn" onClick={() => go("home")}>{Ico.home}<span>Retour à l’accueil</span></button>}
          </div>
        </div>
      )}
      <nav className="pager" aria-label="Pages">
        <button className="btn big" onClick={() => goto(page - 1)} disabled={page === 0} aria-keyshortcuts="ArrowLeft">{Ico.prev}<span>Précédente</span></button>
        <span className="page-dots" aria-hidden="true">{P.pages.map((_, i) => <i key={i} className={i === page ? "on" : ""} />)}</span>
        {page < last
          ? <button className="btn big" onClick={nextPage} aria-keyshortcuts="ArrowRight"><span>Suivante</span>{Ico.next}</button>
          : chrono === "run"
            ? <button className="btn big success" onClick={finish}>{Ico.flag}<span>J’ai fini</span></button>
            : <button className="btn big" onClick={() => goto(0)}>{Ico.again}<span>Recommencer</span></button>}
      </nav>
      </div>

      {toast && <div className="toast" role="status">{toast}</div>}

      {chrono === "ready" && (
        <Modal title="Lire avec le chrono" onClose={() => setChrono("off")} labelId="ready-title">
          <p>Lis tout le texte <b>à voix haute</b>, à ton rythme.</p>
          <ul className="help-list">
            <li>Change de page avec « Suivante ».</li>
            <li>Un mot difficile ? Touche-le pour l’entendre.</li>
            <li>À la dernière page, clique sur <b>« J’ai fini »</b>.</li>
          </ul>
          <div className="row end">
            <button className="btn" onClick={() => setChrono("off")}>Plus tard</button>
            <button className="btn primary" data-autofocus onClick={startChrono}>{Ico.timer}<span>Démarrer</span></button>
          </div>
        </Modal>
      )}

      {result && <ResultDialog P={P} r={result} data={data} onClose={() => setResult(null)}
        onHome={() => go("home")} onAgain={() => { setResult(null); setChrono("ready"); }} />}
    </main>
  );
}

function ResultDialog({ P, r, data, onClose, onHome, onAgain }) {
  if (r.invalid) return (
    <Modal title="Lecture trop rapide" onClose={onClose} labelId="res-title">
      <p>Le texte a été parcouru en {fmtTime(r.ms)} : c’est trop rapide pour une lecture à voix haute. Cette lecture n’est pas enregistrée.</p>
      <div className="row end"><button className="btn primary" data-autofocus onClick={onAgain}>Recommencer</button></div>
    </Modal>
  );
  const th = thresholds(P); const next = r.lvl === -1 ? LEVELS.length - 1 : r.lvl - 1;
  let compare = null;
  if (r.prevBest == null) compare = "Première lecture chronométrée de ce texte. C’est ton temps de départ !";
  else if (r.ms < r.prevBest) compare = `Nouveau record sur ce texte : ${Math.round((r.prevBest - r.ms) / 1000)} s de mieux que ton meilleur temps.`;
  else if (r.prevLast != null && r.ms < r.prevLast) compare = `${Math.round((r.prevLast - r.ms) / 1000)} s de moins que la dernière fois.`;
  else compare = "Continue : la vitesse vient en relisant chaque jour.";
  return (
    <Modal title="Bravo, tu as fini !" onClose={onClose} labelId="res-title">
      <div className="result">
        <div className="res-time"><b>{fmtTime(r.ms)}</b></div>
        <p className="res-lvl">{r.lvl >= 0 ? <>Palier atteint : <Chip i={r.lvl} /> <b>{LEVELS[r.lvl].n}</b></> : "Tu as lu tout le texte. Chaque lecture te rapproche du premier palier."}</p>
        {next >= 0 ? <p className="muted">Prochain palier : {LEVELS[next].n}, en moins de {fmtSec(th[next])}.</p> : <p className="muted">Tu as atteint le palier le plus rapide.</p>}
        <p>{compare}</p>
        <p className="res-streak">{r.wasDone ? "Ta journée était déjà validée : lecture bonus !" : `Journée validée. Série : ${r.streak} jour${r.streak > 1 ? "s" : ""}.`}{r.record ? " Nouveau record de série !" : ""}</p>
        <TempoScale P={P} bestMs={r.ms} small label="cette lecture" />
      </div>
      <div className="row end">
        <button className="btn" onClick={onAgain}>Relire</button>
        <button className="btn primary" data-autofocus onClick={onHome}>{Ico.home}<span>Accueil</span></button>
      </div>
    </Modal>
  );
}

/* ---------- Enseignant : élèves ---------- */
const download = (name, text) => {
  const url = URL.createObjectURL(new Blob([text], { type: "application/json" }));
  const a = document.createElement("a"); a.href = url; a.download = name; document.body.appendChild(a); a.click();
  setTimeout(() => { URL.revokeObjectURL(url); a.remove(); }, 1000);
};
function singleAppData() {
  return SINGLE_APPS.map(app => {
    try { const raw = JSON.parse(localStorage.getItem(app.key)); if (raw && ((raw.readings || []).length || (raw.days || []).length)) return { ...app, raw }; } catch (e) {}
    return null;
  }).filter(Boolean);
}
function Profiles({ store, setStore, onClose }) {
  const [name, setName] = useState(""); const [series, setSeries] = useState("cycle3");
  const [del, setDel] = useState(null); const [msg, setMsg] = useState(""); const fileRef = useRef(null);
  const legacy = useMemo(singleAppData, []);
  const add = e => {
    e.preventDefault(); const n = name.trim(); if (!n) return;
    setStore(s => { const id = uid(); s.profiles[id] = newProfile(n, series); s.order.push(id); s.cur = id; });
    setName(""); setMsg(`${n} : élève ajouté à la liste.`);
    requestAnimationFrame(() => { const i = document.getElementById("new-name"); if (i) i.focus(); });
  };
  const exportAll = () => download(`fluence-eleves-${todayKey()}.json`, JSON.stringify({ app: "fluence-enseignant", version: 1, exported: new Date().toISOString(), profiles: store.profiles, order: store.order }));
  const importAll = ev => {
    const f = ev.target.files && ev.target.files[0]; if (!f) return;
    f.text().then(t => {
      try {
        const s = JSON.parse(t); if (!s.profiles) throw new Error();
        let n = 0;
        setStore(cur => { (s.order || Object.keys(s.profiles)).forEach(id => { const p = s.profiles[id]; if (!p) return; const nid = cur.profiles[id] ? uid() : id; cur.profiles[nid] = fixProfile(p); cur.order.push(nid); n++; }); if (!cur.cur) cur.cur = cur.order[0] || null; });
        setMsg(`Import terminé : ${n} élève${n > 1 ? "s" : ""} ajouté${n > 1 ? "s" : ""}.`);
      } catch (e) { setMsg("Ce fichier n’est pas une sauvegarde de Fluence (enseignant)."); }
      ev.target.value = "";
    });
  };
  const fromLegacy = app => {
    const n = name.trim() || "Élève";
    setStore(s => { const id = uid(); s.profiles[id] = fromSingleApp(app.raw, app.series, n); s.order.push(id); s.cur = id; });
    setName(""); setMsg(`Progression de « ${app.label} » reprise pour ${n}. Tu peux renommer l’élève dans la liste.`);
  };
  return (
    <Modal title="Élèves" onClose={onClose} wide labelId="profiles-title">
      <form className="add-row" onSubmit={add}>
        <label htmlFor="new-name" className="sr">Prénom de l’élève</label>
        <input id="new-name" className="input" value={name} onChange={ev => setName(ev.target.value)} placeholder="Prénom de l’élève" autoComplete="off" data-autofocus />
        <label htmlFor="new-series" className="sr">Série de textes</label>
        <select id="new-series" value={series} onChange={ev => setSeries(ev.target.value)}>
          {SERIES_IDS.map(id => <option key={id} value={id}>{SERIES[id].label}</option>)}
        </select>
        <button className="btn primary" type="submit" disabled={!name.trim()}>{Ico.plus}<span>Ajouter</span></button>
      </form>
      <p className="muted small">{SERIES[series].hint}</p>
      {msg && <p className="notice" role="status">{msg}</p>}
      <ul className="profiles">
        {store.order.map(id => {
          const p = store.profiles[id]; if (!p) return null; const isCur = id === store.cur;
          return (
            <li key={id} className={"prof" + (isCur ? " cur" : "")}>
              <input className="input" aria-label={`Prénom de ${p.name}`} value={p.name} onChange={ev => { const v = ev.target.value; setStore(s => { s.profiles[id].name = v; }); }} />
              <select aria-label={`Série de textes de ${p.name}`} value={p.series} onChange={ev => { const v = ev.target.value; setStore(s => { s.profiles[id].series = v; }); }}>
                {SERIES_IDS.map(sid => <option key={sid} value={sid}>{SERIES[sid].label}</option>)}
              </select>
              <label className="mini-check"><input type="checkbox" checked={p.prog[p.series].unlockAll} onChange={ev => { const v = ev.target.checked; setStore(s => { const q = s.profiles[id]; q.prog[q.series].unlockAll = v; }); }} />Tous les textes</label>
              {isCur ? <span className="chip">Élève actif</span> : <button className="btn" onClick={() => { setStore(s => { s.cur = id; }); onClose(); }}>Choisir</button>}
              {del === id
                ? <button className="btn danger" onClick={() => { setStore(s => { delete s.profiles[id]; s.order = s.order.filter(x => x !== id); if (s.cur === id) s.cur = s.order[0] || null; }); setDel(null); }}>Confirmer</button>
                : <button className="btn flat icon" onClick={() => setDel(id)} aria-label={`Supprimer ${p.name}`} title="Supprimer">{Ico.trash}</button>}
            </li>
          );
        })}
      </ul>
      {!store.order.length && <p className="muted">Ajoute un premier élève pour commencer. Chaque élève a ses textes, ses réglages et sa série de jours.</p>}
      <p className="muted small">« Tous les textes » permet à l’élève de changer de texte sans attendre la fin de la semaine.</p>
      <section className="set-group">
        <h3>Sauvegarde</h3>
        <p className="muted small">Les données restent dans ce navigateur. Exporte-les pour les garder en sécurité ou les transférer sur un autre appareil.</p>
        <div className="row">
          <button className="btn" onClick={exportAll} disabled={!store.order.length}>{Ico.down}<span>Exporter tous les élèves</span></button>
          <button className="btn" onClick={() => fileRef.current && fileRef.current.click()}>{Ico.up}<span>Importer une sauvegarde</span></button>
          <input ref={fileRef} type="file" accept="application/json,.json" hidden onChange={importAll} />
        </div>
      </section>
      {legacy.length > 0 && (
        <section className="set-group">
          <h3>Reprendre une progression de cet appareil</h3>
          <p className="muted small">Une progression des applications pour un seul élève a été trouvée ici. Saisis d’abord le prénom en haut, puis :</p>
          <div className="row">
            {legacy.map(app => <button key={app.key} className="btn" onClick={() => fromLegacy(app)}>{Ico.plus}<span>Créer l’élève avec « {app.label} » ({app.raw.readings.length} lecture{app.raw.readings.length > 1 ? "s" : ""})</span></button>)}
          </div>
        </section>
      )}
    </Modal>
  );
}

/* ---------- Enseignant : suivi de la classe ---------- */
function Suivi({ store, setStore, go }) {
  const tk = todayKey();
  return (
    <main id="main" tabIndex={-1}>
      <section className="card">
        <h2 className="h-mid">Suivi de la classe</h2>
        <p className="muted small">Pour chaque élève : texte en cours, jours de lecture dans la semaine du texte (objectif {WEEK_GOAL}), meilleur temps et série de jours. Ouvre le détail pour voir toutes les lectures.</p>
      </section>
      {!store.order.length && <p className="card muted">Aucun élève pour l’instant.</p>}
      {store.order.map(id => {
        const p = store.profiles[id]; if (!p) return null; const d = viewOf(p); const TX = textsOf(d);
        const ti = Math.min(d.cur, TX.length - 1); const P = TX[ti]; const wk = textWeek(d, ti);
        const lv = wk.best != null ? levelOf(P, wk.best) : null; const streak = computeStreak(d.days);
        const last = d.readings.length ? d.readings[d.readings.length - 1] : null;
        const lastTxt = last ? (last.d === tk ? "aujourd’hui" : `il y a ${diffDays(last.d, tk)} j`) : "aucune";
        return (
          <section key={id} className={"card student" + (id === store.cur ? " cur" : "")} aria-label={p.name}>
            <div className="stu-head">
              <h3>{p.name}</h3><span className="chip">{SERIES[p.series].short}</span>
              <button className="btn" onClick={() => { setStore(s => { s.cur = id; }); go("home"); }}>Ouvrir</button>
            </div>
            <dl className="stu-grid">
              <div><dt>Texte en cours</dt><dd>{ti + 1}. {P.title}</dd></div>
              <div><dt>Semaine du texte</dt><dd>{wk.started ? `jour ${Math.min(wk.day, 7)} sur 7${wk.over ? " (finie)" : ""}` : "pas commencée"}</dd></div>
              <div><dt>Jours de lecture</dt><dd>{wk.count} / {WEEK_GOAL}</dd></div>
              <div><dt>Meilleur temps</dt><dd>{wk.best != null ? <>{fmtTime(wk.best)}{lv >= 0 && <> · <Chip i={lv} />{LEVELS[lv].n}</>}</> : "—"}</dd></div>
              <div><dt>Série</dt><dd>{streak} jour{streak > 1 ? "s" : ""}</dd></div>
              <div><dt>Dernière lecture</dt><dd>{lastTxt}</dd></div>
            </dl>
            {d.readings.length > 0 && (
              <details className="stu-detail">
                <summary>Toutes les lectures chronométrées ({d.readings.length})</summary>
                {TX.filter(T => d.readings.some(r => r.id === T.id)).map(T => (
                  <div key={T.id} className="hist">
                    <b>{T.index + 1}. {T.title}</b>
                    <ul>{d.readings.filter(r => r.id === T.id).map((r, k) => {
                      const l = levelOf(T, r.ms);
                      return <li key={k}><span>{parseKey(r.d).toLocaleDateString("fr-FR", { weekday: "short", day: "numeric", month: "short" })}</span><b>{fmtTime(r.ms)}</b><span>{l >= 0 ? <><Chip i={l} />{LEVELS[l].n}</> : "—"}</span></li>;
                    })}</ul>
                  </div>
                ))}
              </details>
            )}
          </section>
        );
      })}
    </main>
  );
}

/* ---------- Application ---------- */
function App() {
  const [store, setStoreState] = useState(loadStore);
  const storeRef = useRef(store);
  const setStore = useCallback(fn => {
    const s = JSON.parse(JSON.stringify(storeRef.current)); fn(s); storeRef.current = s; saveStore(s); setStoreState(s);
  }, []);
  const prof = store.cur ? store.profiles[store.cur] : null;
  const data = useMemo(() => prof ? viewOf(prof) : null, [prof]);
  const update = useCallback(fn => setStore(s => { const p = s.profiles[s.cur]; if (!p) return; const d = viewOf(p); fn(d); writeBack(p, d); }), []);
  const speaker = useMemo(() => new Speaker(() => { const s = storeRef.current; const p = s.cur && s.profiles[s.cur]; return p ? p.settings : defaultSettings(); }), []);
  const voices = useVoices();
  const [view, setView] = useState({ name: "home" });
  const [panel, setPanel] = useState(() => store.order.length ? null : "profiles");
  const [canInstall, setCanInstall] = useState(!!installEvt);
  useEffect(() => { const f = () => setCanInstall(!!installEvt); window.addEventListener("can-install", f); return () => window.removeEventListener("can-install", f); }, []);
  const go = (name, params = {}) => {
    speaker.stop(); setView({ name, ...params, key: Date.now() });
    requestAnimationFrame(() => { const m = document.getElementById("main"); if (m) m.focus({ preventScroll: true }); window.scrollTo(0, 0); });
  };
  // Changer d'élève ou de série ramène à l'accueil de l'élève.
  const sig = store.cur + ":" + (prof ? prof.series : "");
  const firstSig = useRef(sig);
  useEffect(() => { if (sig !== firstSig.current) { firstSig.current = sig; if (view.name !== "suivi") { speaker.stop(); setView({ name: "home", key: Date.now() }); } } }, [sig]);
  const install = async () => { if (!installEvt) return; installEvt.prompt(); try { await installEvt.userChoice; } catch (e) {} installEvt = null; setCanInstall(false); };
  const P = data && view.ti != null ? textsOf(data)[view.ti] : null;
  const inText = view.name === "reader" || view.name === "words";

  return (
    <div className="app">
      <a className="skip" href="#main">Aller au contenu</a>
      <header className="toolbar">
        {view.name !== "home"
          ? <button className="btn flat" onClick={() => go("home")} aria-label="Accueil de l’élève" title="Accueil de l’élève">{Ico.home}<span className="lbl-txt">Accueil</span></button>
          : <span className="logo" aria-hidden="true">{Ico.book}</span>}
        <h1 className={store.order.length > 0 && !inText ? "with-sel" : ""}>{inText && P ? P.title : view.name === "suivi" ? "Suivi" : "Fluence"}</h1>
        {store.order.length > 0 && !inText && (
          <select className="who-sel" aria-label="Élève" value={store.cur || ""} onChange={ev => { const v = ev.target.value; setStore(s => { s.cur = v; }); }}>
            {store.order.map(id => <option key={id} value={id}>{store.profiles[id].name}</option>)}
          </select>
        )}
        {!inText && <button className="btn flat" onClick={() => setPanel("profiles")} aria-label="Élèves" title="Élèves">{Ico.users}<span className="lbl-txt">Élèves</span></button>}
        {!inText && store.order.length > 0 && view.name !== "suivi" && <button className="btn flat" onClick={() => go("suivi")} aria-label="Suivi de la classe" title="Suivi de la classe">{Ico.chart}<span className="lbl-txt">Suivi</span></button>}
        {canInstall && <button className="btn" onClick={install} aria-label="Installer l’application" title="Installer l’application">{Ico.install}<span className="lbl-txt">Installer</span></button>}
        {data && <button className="btn flat" onClick={() => setPanel("settings")} aria-label="Réglages de l’élève" title="Réglages de l’élève">{Ico.gear}<span className="lbl-txt">Réglages</span></button>}
        <button className="btn flat" onClick={() => setPanel("help")} aria-label="Aide" title="Aide">{Ico.help}<span className="lbl-txt">Aide</span></button>
      </header>
      {!data && view.name !== "suivi" && (
        <main id="main" tabIndex={-1}>
          <section className="card banner">
            <div><h2>Bienvenue</h2><p>Ajoute tes élèves pour commencer. Pour chacun, choisis la série de textes : cycle 3 ou collège. Chaque élève a ses réglages, sa progression et sa série de jours.</p></div>
            <button className="btn primary big" onClick={() => setPanel("profiles")}>{Ico.plus}<span>Ajouter un élève</span></button>
          </section>
        </main>
      )}
      {data && view.name === "home" && <Home key={store.cur} data={data} update={update} go={go} who={prof.name} />}
      {data && view.name === "words" && <Words key={view.key} ti={view.ti} data={data} speaker={speaker} voices={voices} go={go} />}
      {data && view.name === "reader" && <Reader key={view.key} ti={view.ti} mode={view.mode} data={data} update={update} speaker={speaker} voices={voices} go={go} />}
      {view.name === "suivi" && <Suivi store={store} setStore={setStore} go={go} />}
      {panel === "profiles" && <Profiles store={store} setStore={setStore} onClose={() => setPanel(null)} />}
      {panel === "settings" && data && <SettingsPanel data={data} update={update} speaker={speaker} voices={voices} onClose={() => setPanel(null)} />}
      {panel === "help" && <Help onClose={() => setPanel(null)} />}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
