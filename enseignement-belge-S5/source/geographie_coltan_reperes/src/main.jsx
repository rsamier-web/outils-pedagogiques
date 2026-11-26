import React, { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { createRoot } from "react-dom/client";
import { AppCtx, Icon, findTerm, T } from "./ui.jsx";
import { Reader, ttsSupported } from "./tts.js";
import { usePersist, load } from "./store.js";
import Home from "./pages/Home.jsx";
import Course from "./pages/Course.jsx";
import Atlas from "./pages/Atlas.jsx";
import Gloss from "./pages/Gloss.jsx";
import Flash from "./pages/Flash.jsx";
import Quiz from "./pages/Quiz.jsx";
import Exercises from "./pages/Exercises.jsx";
import Evals from "./pages/Evals.jsx";
import Settings from "./pages/Settings.jsx";
import { dueCount } from "./pages/Flash.jsx";

const NAV = [
  ["home", "Accueil", "home"], ["cours", "Cours", "book"], ["atlas", "Cartes interactives", "map"], ["glossaire", "Glossaire", "abc"],
  ["memo", "Cartes mémoire", "cards"], ["quiz", "Quiz", "quiz"], ["exercices", "Exercices", "pen"], ["evaluations", "Évaluations", "doc"],
];
export const DEFAULTS = { voiceURI: "", rate: 0.9, pitch: 1, volume: 1, hlSentence: true, hlWord: true, clickMode: "word", autoNext: false, scale: 1, theme: "auto", newPerDay: 15 };

function readRoute() {
  const h = decodeURIComponent(location.hash.replace(/^#\/?/, ""));
  const [page, ...rest] = h.split("/");
  return { page: NAV.some(n => n[0] === page) ? page : "home", sub: rest };
}

function App() {
  const [route, setRoute] = useState(readRoute);
  const [settings, setSettings] = usePersist("settings", DEFAULTS);
  const S = { ...DEFAULTS, ...settings };
  const sRef = useRef(S); sRef.current = S;
  const reader = useMemo(() => new Reader(() => sRef.current), []);
  const [rstate, setRstate] = useState("idle");
  const [showSettings, setShowSettings] = useState(false);
  const [menu, setMenu] = useState(false);
  const [pop, setPop] = useState(null);
  const contentRef = useRef(null);
  const nextPageRef = useRef(null);
  const [, force] = useState(0);

  useEffect(() => reader.sub(setRstate), [reader]);
  useEffect(() => {
    const f = () => { reader.stop(); setRoute(readRoute()); setPop(null); setMenu(false); window.scrollTo(0, 0); };
    window.addEventListener("hashchange", f); return () => window.removeEventListener("hashchange", f);
  }, [reader]);
  useEffect(() => {
    document.documentElement.style.setProperty("--scale", S.scale);
    if (S.theme === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", S.theme);
  }, [S.scale, S.theme]);
  useEffect(() => { if (ttsSupported()) { const f = () => force(x => x + 1); window.speechSynthesis.addEventListener?.("voiceschanged", f); return () => window.speechSynthesis.removeEventListener?.("voiceschanged", f); } }, []);

  const go = useCallback((page, ...sub) => { location.hash = "#/" + [page, ...sub].map(encodeURIComponent).join("/"); }, []);

  // Lecture de la page entière (et passage automatique à la page suivante du cours si demandé)
  const readPage = useCallback(() => {
    const onEnd = () => { if (sRef.current.autoNext && nextPageRef.current) { const n = nextPageRef.current; n(); setTimeout(() => reader.readContainer(contentRef.current, null, onEnd), 600); } };
    reader.readContainer(contentRef.current, null, onEnd);
  }, [reader]);

  // Clic sur un mot / un terme du glossaire
  const onContentClick = e => {
    const term = e.target.closest(".term");
    if (term) { const g = findTerm(term.dataset.term); if (g) { const r = term.getBoundingClientRect(); setPop({ g, x: Math.min(r.left, window.innerWidth - 360), y: r.bottom + 6 > window.innerHeight - 200 ? r.top - 190 : r.bottom + 6 }); } e.preventDefault(); return; }
    if (S.clickMode === "off") return;
    const w = e.target.closest(".w");
    if (!w || e.target.closest("button, a, input, select, textarea, .opt")) return;
    if (S.clickMode === "word") reader.say(w.textContent.replace(/[«»“”"(),.;:!?…]/g, ""), w);
    else { const s = w.closest(".s"); if (s) reader.play([{ text: s.textContent, el: s }], 0); }
  };
  useEffect(() => { const f = e => { if (pop && !e.target.closest(".pop") && !e.target.closest(".term")) setPop(null); }; document.addEventListener("pointerdown", f); return () => document.removeEventListener("pointerdown", f); }, [pop]);

  const ctx = { reader, settings: S, setSettings: o => setSettings(p => ({ ...DEFAULTS, ...p, ...o })), go, route, setNextPage: f => { nextPageRef.current = f; } };
  const due = dueCount();
  const Page = { home: Home, cours: Course, atlas: Atlas, glossaire: Gloss, memo: Flash, quiz: Quiz, exercices: Exercises, evaluations: Evals }[route.page];
  const title = NAV.find(n => n[0] === route.page)[1];
  const wide = route.page === "atlas" || route.page === "cours";

  return (
    <AppCtx.Provider value={ctx}>
      <div className="app">
        <aside className={"side" + (menu ? " open" : "")} aria-label="Navigation">
          <div className="brand"><strong>Géographie S5</strong><span>Le coltan en RDC · Repères spatiaux</span></div>
          <ul className="nav">
            {NAV.map(([id, lab, ic]) => <li key={id}><button aria-current={route.page === id ? "page" : undefined} onClick={() => go(id)}><Icon n={ic} />{lab}{id === "memo" && due > 0 && <span className="count" aria-label={due + " cartes à revoir"}>{due}</span>}</button></li>)}
          </ul>
          <div className="side-foot">Enseignement belge francophone · 5e secondaire<br />Cartes : Natural Earth (domaine public)</div>
        </aside>
        <div className="main">
          <header className="topbar">
            <button className="btn ghost menu-btn" onClick={() => setMenu(m => !m)} aria-label="Menu" aria-expanded={menu}><Icon n="menu" /></button>
            <span className="title">{title}</span>
            {ttsSupported() && <div className="tts" role="group" aria-label="Lecture à voix haute">
              {rstate === "idle" && <button className="btn small" onClick={readPage}><Icon n="play" /><span className="label">Lire la page</span></button>}
              {rstate === "playing" && <button className="btn small" onClick={() => reader.pause()}><Icon n="pause" /><span className="label">Pause</span></button>}
              {rstate === "paused" && <button className="btn small" onClick={() => reader.resume()}><Icon n="play" /><span className="label">Reprendre</span></button>}
              {rstate !== "idle" && <button className="btn small" onClick={() => reader.stop()}><Icon n="stop" /><span className="label">Arrêter</span></button>}
            </div>}
            <button className="btn small" onClick={() => setShowSettings(true)} aria-label="Réglages"><Icon n="gear" /><span className="label sr">Réglages</span></button>
          </header>
          <main ref={contentRef} className={"content" + (wide ? " wide" : "") + (S.clickMode !== "off" ? " clickread" : "")} onClick={onContentClick}>
            <Page />
          </main>
        </div>
        {menu && <div className="dialog-back" style={{ zIndex: 30, background: "rgba(0,0,0,.25)" }} onClick={() => setMenu(false)} />}
      </div>
      {pop && <div className="pop" style={{ left: Math.max(8, pop.x), top: Math.max(8, pop.y) }} role="dialog" aria-label={"Définition : " + pop.g.terme}>
        <div className="row between"><strong>{pop.g.terme}</strong><span className="row"><button className="btn small ghost" onClick={() => reader.say(pop.g.terme + ". " + pop.g.def + " Exemple : " + pop.g.ex)} aria-label="Écouter la définition"><Icon n="speaker" /></button><button className="btn small ghost" onClick={() => setPop(null)} aria-label="Fermer"><Icon n="x" /></button></span></div>
        <span>{pop.g.def}</span><span className="ex">Exemple : {pop.g.ex}</span>
        <button className="btn small" onClick={() => { setPop(null); go("glossaire", pop.g.id); }}>Voir dans le glossaire</button>
      </div>}
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
    </AppCtx.Provider>
  );
}

createRoot(document.getElementById("root")).render(<App />);
