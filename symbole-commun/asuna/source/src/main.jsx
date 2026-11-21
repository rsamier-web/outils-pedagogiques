import React, { useState, useEffect, useRef, useCallback, useLayoutEffect } from "react";
import { createRoot } from "react-dom/client";
import DATA from "./data.json";
import { genererCartes, symboleCommun, disposer } from "./deck.js";

const CARTES = genererCartes(7);
const CATS = [...new Set(DATA.map((d) => d.cat))];

/* ---------- Préférences (mémorisées sur l'appareil) ---------- */
const PREFS_DEFAUT = { voix: true, rotation: false };
function lirePrefs() {
  try { return { ...PREFS_DEFAUT, ...JSON.parse(localStorage.getItem("sc-asuna-prefs") || "{}") }; }
  catch { return { ...PREFS_DEFAUT }; }
}
function ecrirePrefs(p) {
  try { localStorage.setItem("sc-asuna-prefs", JSON.stringify(p)); } catch {}
}

/* ---------- Synthèse vocale ---------- */
function motBrut(mot) { return mot; }
let voixFr = null;
function choisirVoix() {
  try {
    const v = window.speechSynthesis.getVoices().filter((x) => /^fr/i.test(x.lang));
    voixFr = v.find((x) => /fr-FR/i.test(x.lang) && /google|natural|online|amélie|thomas|denise|henri/i.test(x.name)) || v.find((x) => /fr-FR/i.test(x.lang)) || v[0] || null;
  } catch {}
}
if (typeof window !== "undefined" && "speechSynthesis" in window) {
  choisirVoix();
  window.speechSynthesis.onvoiceschanged = choisirVoix;
}
function dire(texte) {
  try {
    const s = window.speechSynthesis;
    s.cancel();
    const u = new SpeechSynthesisUtterance(texte);
    u.lang = "fr-FR";
    if (voixFr) u.voice = voixFr;
    u.rate = 0.85;
    s.speak(u);
  } catch {}
}

/* ---------- Nom de l'objet ---------- */
function Mot({ item }) {
  return <span className="mot">{item.mot}</span>;
}

/* ---------- Icônes (traits fins façon Breeze) ---------- */
const Ico = {
  stop: <svg viewBox="0 0 16 16" width="16" height="16"><rect x="3.5" y="3.5" width="9" height="9" rx="1" fill="none" stroke="currentColor" /></svg>,
  play: <svg viewBox="0 0 16 16" width="16" height="16"><path d="M5 3.5v9l7-4.5z" fill="none" stroke="currentColor" strokeLinejoin="round" /></svg>,
  son: <svg viewBox="0 0 16 16" width="16" height="16"><path d="M2.5 6h2.5l3.5-3v10L5 10H2.5z" fill="none" stroke="currentColor" strokeLinejoin="round" /><path d="M11 5.5a3.5 3.5 0 0 1 0 5M12.8 3.5a6 6 0 0 1 0 9" fill="none" stroke="currentColor" strokeLinecap="round" /></svg>,
  grille: <svg viewBox="0 0 16 16" width="16" height="16"><g fill="none" stroke="currentColor"><rect x="2.5" y="2.5" width="4" height="4" /><rect x="9.5" y="2.5" width="4" height="4" /><rect x="2.5" y="9.5" width="4" height="4" /><rect x="9.5" y="9.5" width="4" height="4" /></g></svg>,
  retour: <svg viewBox="0 0 16 16" width="16" height="16"><path d="M10 3.5 5.5 8l4.5 4.5" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>,
  install: <svg viewBox="0 0 16 16" width="16" height="16"><path d="M8 2.5v8M4.5 7 8 10.5 11.5 7M3 13.5h10" fill="none" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" /></svg>,
};

/* ---------- Case à cocher Breeze ---------- */
function Option({ checked, onChange, children }) {
  return (
    <label className="option">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} />
      <span className="coche" aria-hidden="true" />
      <span>{children}</span>
    </label>
  );
}

/* ---------- Installation PWA ---------- */
function useInstallation() {
  const [invite, setInvite] = useState(null);
  const [installee, setInstallee] = useState(
    typeof window !== "undefined" && (window.matchMedia("(display-mode: standalone)").matches || window.navigator.standalone === true)
  );
  useEffect(() => {
    const avant = (e) => { e.preventDefault(); setInvite(e); };
    const ok = () => { setInstallee(true); setInvite(null); };
    window.addEventListener("beforeinstallprompt", avant);
    window.addEventListener("appinstalled", ok);
    return () => { window.removeEventListener("beforeinstallprompt", avant); window.removeEventListener("appinstalled", ok); };
  }, []);
  const installer = async () => {
    if (!invite) return;
    invite.prompt();
    try { await invite.userChoice; } catch {}
    setInvite(null);
  };
  return { possible: !!invite && !installee, installee, installer };
}

/* ---------- Écran d'accueil ---------- */
function Accueil({ prefs, setPrefs, onJouer, onImagier }) {
  const inst = useInstallation();
  const ios = /iphone|ipad|ipod/i.test(navigator.userAgent);
  return (
    <main className="page accueil">
      <section className="panneau">
        <div className="titre-app">
          <img className="logo" src="icon-192.png" alt="" aria-hidden="true" />
          <div>
            <h1>Symbole commun</h1>
            <p className="sous-titre">Asuna · fruits, cuisine, nature et objets</p>
          </div>
        </div>

        <div className="groupe">
          <h2>Règle du jeu</h2>
          <ol className="regle">
            <li>Deux cartes rondes s'affichent, avec 8 images sur chacune.</li>
            <li>Une seule image se trouve sur les deux cartes : c'est le <strong>symbole commun</strong>.</li>
            <li>Clique sur cette image <strong>sur chacune des deux cartes</strong> pour marquer un point.</li>
            <li>Dis le nom de l'objet à voix haute.</li>
          </ol>
        </div>

        <div className="groupe">
          <h2>Options</h2>
          <Option checked={prefs.voix} onChange={(v) => setPrefs({ ...prefs, voix: v })}>Lire le nom à voix haute après chaque réussite</Option>
          <Option checked={prefs.rotation} onChange={(v) => setPrefs({ ...prefs, rotation: v })}>Images inclinées (plus difficile)</Option>
        </div>

        <div className="actions">
          <button className="btn" onClick={onImagier}>{Ico.grille}<span>Voir l'imagier</span></button>
          {inst.possible && <button className="btn" onClick={inst.installer}>{Ico.install}<span>Installer l'application</span></button>}
          <button className="btn primaire" onClick={onJouer} autoFocus>{Ico.play}<span>Commencer</span></button>
        </div>
        {!inst.possible && !inst.installee && (
          <p className="astuce">
            {ios
              ? "Pour installer l'application sur iPhone ou iPad : bouton Partager, puis « Sur l'écran d'accueil »."
              : "Pour installer l'application : menu de Chrome ⋮, puis « Installer l'application » ou « Ajouter à l'écran d'accueil »."}
          </p>
        )}
      </section>
      <Credits />
    </main>
  );
}

function Credits() {
  return (
    <footer className="credits">
      Images : textures du jeu <a href="https://content.luanti.org/packages/EmptyStar/asuna/" target="_blank" rel="noopener">Asuna</a> (EmptyStar) et de ses mods (Minetest Game, Ethereal, Better Farming, Animalia, Everness, Herbs, Marinara…) · licences libres · détails dans LISEZMOI.md
    </footer>
  );
}

/* ---------- Imagier ---------- */
function Imagier({ prefs, onRetour }) {
  return (
    <main className="page">
      <div className="barre-titre">
        <button className="btn" onClick={onRetour}>{Ico.retour}<span>Retour</span></button>
        <h1>Imagier · 57 images</h1>
      </div>
      {CATS.map((cat) => (
        <section className="panneau imagier-groupe" key={cat}>
          <h2>{cat}</h2>
          <div className="imagier">
            {DATA.filter((d) => d.cat === cat).map((d) => (
              <button key={d.id} className="vignette" onClick={() => dire(motBrut(d.mot))} title="Écouter le nom">
                <img src={d.img} alt="" draggable="false" />
                <Mot item={d} />
              </button>
            ))}
          </div>
        </section>
      ))}
      <Credits />
    </main>
  );
}

/* ---------- Carte ronde ---------- */
function Carte({ disposition, taille, selection, etat, commun, onChoisir, verrou }) {
  const R = taille / 2;
  return (
    <div className="carte" style={{ width: taille, height: taille }}>
      {disposition.map((s) => {
        const w = s.taille * R;
        const choisi = selection === s.id;
        let cls = "symbole";
        if (choisi) cls += " choisi";
        if (choisi && etat === "erreur") cls += " faux";
        if (etat === "reussite" && s.id === commun) cls += " juste";
        return (
          <button
            key={s.id}
            className={cls}
            style={{ width: w, height: w, left: R + s.x * R - w / 2, top: R + s.y * R - w / 2 }}
            onClick={() => !verrou && onChoisir(s.id)}
            aria-label={motBrut(DATA[s.id].mot)}
            aria-pressed={choisi}
          >
            <span className="halo" />
            <img src={DATA[s.id].img} alt="" draggable="false" style={{ transform: `rotate(${s.angle}deg)` }} />
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Taille des cartes selon l'écran ---------- */
function useTailleCartes(ref) {
  const [dim, setDim] = useState({ taille: 300, sens: "ligne" });
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const calc = () => {
      const cs = getComputedStyle(el);
      const w = el.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
      const h = el.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
      const gap = 16;
      const ligne = Math.min((w - gap) / 2, h);
      const colonne = Math.min(w, (h - gap) / 2);
      const sens = ligne >= colonne ? "ligne" : "colonne";
      setDim({ taille: Math.max(140, Math.floor(Math.max(ligne, colonne)) - 4), sens });
    };
    calc();
    const ro = new ResizeObserver(calc);
    ro.observe(el);
    return () => ro.disconnect();
  }, [ref]);
  return dim;
}

function tirerPaire(precedente) {
  let a, b;
  do {
    a = Math.floor(Math.random() * CARTES.length);
    do { b = Math.floor(Math.random() * CARTES.length); } while (b === a);
  } while (precedente && (a === precedente[0] || b === precedente[1] || symboleCommun(CARTES[a], CARTES[b]) === precedente[2]));
  return [a, b, symboleCommun(CARTES[a], CARTES[b])];
}

/* ---------- Partie ---------- */
function Partie({ prefs, onFin }) {
  const zone = useRef(null);
  const { taille, sens } = useTailleCartes(zone);
  const nouvelleManche = (prec) => {
    const p = tirerPaire(prec);
    return { paire: p, dispoA: disposer(CARTES[p[0]], prefs.rotation), dispoB: disposer(CARTES[p[1]], prefs.rotation) };
  };
  const [manche, setManche] = useState(() => nouvelleManche(null));
  const [selA, setSelA] = useState(null);
  const [selB, setSelB] = useState(null);
  const [etat, setEtat] = useState("jeu"); // jeu | verif | reussite | erreur
  const [stats, setStats] = useState({ points: 0, essais: 0, erreurs: 0, trouves: [] });
  const debut = useRef(Date.now());
  const commun = manche.paire[2];

  useEffect(() => {
    if (selA === null || selB === null || etat !== "jeu") return;
    setEtat("verif");
    const t = setTimeout(() => {
      const bon = selA === commun && selB === commun;
      setStats((s) => ({
        points: s.points + (bon ? 1 : 0),
        essais: s.essais + 1,
        erreurs: s.erreurs + (bon ? 0 : 1),
        trouves: bon ? [...s.trouves, commun] : s.trouves,
      }));
      setEtat(bon ? "reussite" : "erreur");
      if (bon && prefs.voix) dire(motBrut(DATA[commun].mot));
    }, 250);
    return () => clearTimeout(t);
  }, [selA, selB]); // eslint-disable-line

  const continuer = useCallback(() => {
    setManche((m) => nouvelleManche(m.paire));
    setSelA(null); setSelB(null); setEtat("jeu");
  }, []); // eslint-disable-line
  const reessayer = useCallback(() => { setSelA(null); setSelB(null); setEtat("jeu"); }, []);

  useEffect(() => {
    const k = (e) => {
      if (e.key !== "Enter" && e.key !== " " && e.key !== "Escape") return;
      if (etat === "reussite") { e.preventDefault(); continuer(); }
      else if (etat === "erreur") { e.preventDefault(); reessayer(); }
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [etat, continuer, reessayer]);

  const arreter = () => onFin({ ...stats, duree: Date.now() - debut.current });
  const verrou = etat !== "jeu";

  return (
    <main className="partie">
      <header className="barre">
        <div className="consigne">Clique l'image commune aux deux cartes</div>
        <div className="score" title="réussites / essais">
          <span><strong>{stats.points}</strong> / {stats.essais}</span>
          <span className="score-legende">réussites / essais</span>
        </div>
        <button className="btn" onClick={arreter}>{Ico.stop}<span>Arrêter la partie</span></button>
      </header>

      <div className="zone" ref={zone}>
        <div className={"cartes " + sens}>
          <Carte disposition={manche.dispoA} taille={taille} selection={selA} etat={etat} commun={commun} onChoisir={setSelA} verrou={verrou} />
          <Carte disposition={manche.dispoB} taille={taille} selection={selB} etat={etat} commun={commun} onChoisir={setSelB} verrou={verrou} />
        </div>
      </div>

      {(etat === "reussite" || etat === "erreur") && (
        <div className="voile" role="dialog" aria-modal="true">
          {etat === "reussite" ? (
            <div className="dialogue">
              <div className="dialogue-titre positif">Bravo !</div>
              <div className="dialogue-corps">
                <img className="dialogue-img" src={DATA[commun].img} alt="" />
                <div className="dialogue-mot">
                  <Mot item={DATA[commun]} />
                  <button className="btn rond" onClick={() => dire(motBrut(DATA[commun].mot))} title="Écouter le nom" aria-label="Écouter le nom">{Ico.son}</button>
                </div>
              </div>
              <div className="dialogue-actions">
                <button className="btn primaire" onClick={continuer} autoFocus>Continuer</button>
              </div>
            </div>
          ) : (
            <div className="dialogue">
              <div className="dialogue-titre negatif">Vérifie, tu as fait une erreur !</div>
              <p className="dialogue-texte">Cherche encore l'image qui est sur les deux cartes.</p>
              <div className="dialogue-actions">
                <button className="btn primaire" onClick={reessayer} autoFocus>Réessayer</button>
              </div>
            </div>
          )}
        </div>
      )}
    </main>
  );
}

/* ---------- Bilan ---------- */
function Bilan({ res, prefs, onRejouer, onAccueil }) {
  const min = Math.floor(res.duree / 60000), sec = Math.round((res.duree % 60000) / 1000);
  const taux = res.essais ? Math.round((100 * res.points) / res.essais) : 0;
  const parCat = (cat) => res.trouves.filter((id) => DATA[id].cat === cat);
  return (
    <main className="page">
      <section className="panneau">
        <h1>Fin de la partie</h1>
        <div className="chiffres">
          <div><strong>{res.points}</strong><span>réussite{res.points > 1 ? "s" : ""}</span></div>
          <div><strong>{res.erreurs}</strong><span>erreur{res.erreurs > 1 ? "s" : ""}</span></div>
          <div><strong>{taux} %</strong><span>de réussite</span></div>
          <div><strong>{min > 0 ? `${min} min ${sec} s` : `${sec} s`}</strong><span>de jeu</span></div>
        </div>
        {res.trouves.length > 0 && (
          <div className="groupe">
            <h2>Objets trouvés</h2>
            {CATS.map((cat) => {
              const l = parCat(cat);
              if (!l.length) return null;
              return (
                <div className="bilan-ligne" key={cat}>
                  <span className="pastille">{cat} · {l.length}</span>
                  <span className="bilan-mots">
                    {l.map((id, i) => (<React.Fragment key={i}>{i > 0 && ", "}<Mot item={DATA[id]} /></React.Fragment>))}
                  </span>
                </div>
              );
            })}
          </div>
        )}
        <div className="actions">
          <button className="btn" onClick={onAccueil}>{Ico.retour}<span>Accueil</span></button>
          <button className="btn primaire" onClick={onRejouer} autoFocus>{Ico.play}<span>Nouvelle partie</span></button>
        </div>
      </section>
      <Credits />
    </main>
  );
}

/* ---------- Application ---------- */
function App() {
  const [ecran, setEcran] = useState("accueil");
  const [prefs, setPrefsState] = useState(lirePrefs);
  const [res, setRes] = useState(null);
  const [cle, setCle] = useState(0);
  const setPrefs = (p) => { setPrefsState(p); ecrirePrefs(p); };

  if (ecran === "imagier") return <Imagier prefs={prefs} onRetour={() => setEcran("accueil")} />;
  if (ecran === "partie")
    return <Partie key={cle} prefs={prefs} onFin={(r) => { setRes(r); setEcran("bilan"); }} />;
  if (ecran === "bilan")
    return <Bilan res={res} prefs={prefs} onRejouer={() => { setCle((k) => k + 1); setEcran("partie"); }} onAccueil={() => setEcran("accueil")} />;
  return <Accueil prefs={prefs} setPrefs={setPrefs} onJouer={() => { setCle((k) => k + 1); setEcran("partie"); }} onImagier={() => setEcran("imagier")} />;
}

createRoot(document.getElementById("root")).render(<App />);

if ("serviceWorker" in navigator && location.protocol === "https:") {
  window.addEventListener("load", () => navigator.serviceWorker.register("sw.js").catch(() => {}));
}
