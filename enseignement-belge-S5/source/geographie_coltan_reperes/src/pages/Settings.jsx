import React, { useEffect, useState } from "react";
import { useApp, Icon } from "../ui.jsx";
import { frenchVoices, ttsSupported } from "../tts.js";
import { resetAll } from "../store.js";

export default function Settings({ onClose }) {
  const { settings: S, setSettings, reader } = useApp();
  const [voices, setVoices] = useState(frenchVoices());
  const [confirmReset, setConfirmReset] = useState(false);
  useEffect(() => {
    if (!ttsSupported()) return;
    const f = () => setVoices(frenchVoices());
    f(); window.speechSynthesis.addEventListener?.("voiceschanged", f);
    const t = setTimeout(f, 800);
    return () => { clearTimeout(t); window.speechSynthesis.removeEventListener?.("voiceschanged", f); };
  }, []);
  useEffect(() => { const k = e => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", k); return () => window.removeEventListener("keydown", k); }, [onClose]);
  const cur = voices.find(v => v.voiceURI === S.voiceURI) || voices[0];
  const quality = v => { const n = v.name.toLowerCase(); return n.includes("natural") || n.includes("neural") ? " — voix neuronale (très naturelle)" : n.includes("google") ? " — voix Google (naturelle)" : n.includes("premium") || n.includes("enhanced") || n.includes("amélior") ? " — voix améliorée" : ""; };
  return (
    <div className="dialog-back" onClick={e => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="dialog" role="dialog" aria-modal="true" aria-label="Réglages">
        <div className="row between"><h2>Réglages</h2><button className="btn small" onClick={onClose} aria-label="Fermer"><Icon n="x" /></button></div>

        <h3>Synthèse vocale</h3>
        {!ttsSupported() ? <div className="feedback ko">Ton navigateur ne propose pas la synthèse vocale. Essaie Chrome, Edge ou Safari.</div> :
          voices.length === 0 ? <div className="feedback ko">Aucune voix française n’est installée sur cet appareil. Sous Windows : Paramètres → Heure et langue → Voix → Ajouter une voix (Français). Sous Android : Paramètres → Synthèse vocale → installer les données en français. Dans Edge, les voix « Online (Natural) » sont gratuites et de très bonne qualité.</div> :
            <>
              <label className="field"><span>Voix française</span>
                <select value={cur ? cur.voiceURI : ""} onChange={e => setSettings({ voiceURI: e.target.value })}>
                  {voices.map((v, i) => <option key={v.voiceURI} value={v.voiceURI}>{(i === 0 ? "★ " : "") + v.name + " (" + v.lang + ")" + quality(v)}</option>)}
                </select>
                <small>Les meilleures voix gratuites sont proposées en premier (★ = recommandée). Les voix « Natural » (Edge) et « Google » (Chrome) demandent une connexion internet.</small>
              </label>
              <label className="field"><span>Vitesse : {S.rate.toFixed(2).replace(".", ",")}</span><input type="range" min="0.5" max="1.5" step="0.05" value={S.rate} onChange={e => setSettings({ rate: +e.target.value })} /></label>
              <label className="field"><span>Hauteur : {S.pitch.toFixed(1).replace(".", ",")}</span><input type="range" min="0.5" max="1.5" step="0.1" value={S.pitch} onChange={e => setSettings({ pitch: +e.target.value })} /></label>
              <label className="field"><span>Volume : {Math.round(S.volume * 100)} %</span><input type="range" min="0" max="1" step="0.05" value={S.volume} onChange={e => setSettings({ volume: +e.target.value })} /></label>
              <button className="btn" onClick={() => reader.say("Bonjour ! Le coltan est un minerai dont on extrait le tantale. Voici la voix choisie.")}><Icon n="speaker" />Tester la voix</button>
              <label className="chk"><input type="checkbox" checked={S.hlSentence} onChange={e => setSettings({ hlSentence: e.target.checked })} /><span>Surligner la phrase lue</span></label>
              <label className="chk"><input type="checkbox" checked={S.hlWord} onChange={e => setSettings({ hlWord: e.target.checked })} /><span>Surligner le mot lu <small className="muted">(selon la voix, certaines ne le permettent pas)</small></span></label>
              <label className="field"><span>Un clic (ou un toucher) sur un mot lit…</span>
                <select value={S.clickMode} onChange={e => setSettings({ clickMode: e.target.value })}><option value="word">le mot</option><option value="sentence">la phrase</option><option value="off">rien (désactivé)</option></select></label>
              <label className="chk"><input type="checkbox" checked={S.autoNext} onChange={e => setSettings({ autoNext: e.target.checked })} /><span>Passer seul à la page suivante du cours à la fin de la lecture</span></label>
            </>}

        <h3>Affichage</h3>
        <label className="field"><span>Taille du texte : {Math.round(S.scale * 100)} %</span><input type="range" min="0.85" max="1.4" step="0.05" value={S.scale} onChange={e => setSettings({ scale: +e.target.value })} /></label>
        <label className="field"><span>Thème</span><select value={S.theme} onChange={e => setSettings({ theme: e.target.value })}><option value="auto">Automatique (selon l’appareil)</option><option value="light">Breeze clair</option><option value="dark">Breeze sombre</option></select></label>

        <h3>Cartes mémoire</h3>
        <label className="field"><span>Nouvelles cartes par jour : {S.newPerDay}</span><input type="range" min="5" max="50" step="5" value={S.newPerDay} onChange={e => setSettings({ newPerDay: +e.target.value })} /><small>15 par jour est un bon rythme : mieux vaut un peu chaque jour que beaucoup la veille de l’interro.</small></label>

        <h3>Progression</h3>
        <p className="small muted">Ta progression (leçons lues, cartes mémoire, scores) est enregistrée uniquement dans ce navigateur.</p>
        {!confirmReset ? <button className="btn" onClick={() => setConfirmReset(true)}>Effacer ma progression</button>
          : <div className="row"><span className="small">Tout effacer ?</span><button className="btn" style={{ borderColor: "var(--neg)" }} onClick={() => { resetAll(); location.hash = "#/home"; location.reload(); }}>Oui, effacer</button><button className="btn" onClick={() => setConfirmReset(false)}>Annuler</button></div>}
      </div>
    </div>
  );
}
