import React, { useState, useMemo, useEffect } from "react";
import { useApp, T, Icon, shuffle, Box } from "../ui.jsx";
import MapView from "../MapView.jsx";
import { SCENES, ATLAS, sceneItems, CLIMAT_NOMS, BIOME_NOMS } from "../scenes.js";
import { Diagram } from "../diagrams.jsx";
import { usePersist } from "../store.js";

export const LAYER_NAMES = { continents: "Continents", oceans: "Océans", lignes: "Lignes remarquables", poles: "Pôles", zones: "Zones", exemples: "Lieux d’exemple", pays: "Pays", villes: "Villes",
  reliefs: "Reliefs", fleuves: "Fleuves", regions: "Régions", provinces: "Provinces", communautes: "Communautés", frontiere: "Frontière linguistique", rivieres: "Cours d’eau",
  reperes: "Repères du relief", voisins: "Pays voisins", lacs: "Lacs", mines: "Mines", groupes: "Groupes armés", relief: "Relief", vegetation: "Végétation", climat: "Climat",
  sante: "Paludisme", densite: "Densité", volcans: "Volcans", lieux: "Lieux et institutions", quartiers: "Quartiers", sillon: "Sillon", hemis: "Hémisphères" };
const EU_OK = new Set(["pays_nor", "pays_che", "pays_isl", "pays_rus", "pays_blr"]);
const keepItem = (scene, it) => scene !== "europe_ue" || it.group !== "hors" || EU_OK.has(it.id);

function quizLayers(scene) {
  const items = sceneItems(scene).filter(it => keepItem(scene, it));
  const by = {};
  items.forEach(it => { const k = it.theme ? it.theme : it.layer; (by[k] = by[k] || []).push(it); });
  return Object.entries(by).filter(([, v]) => v.length >= 2);
}

function Task({ scene, mode }) {
  const layers = useMemo(() => quizLayers(scene), [scene]);
  const [lk, setLk] = useState(layers[0] ? layers[0][0] : null);
  const pool = (layers.find(l => l[0] === lk) || [null, []])[1];
  const catLayer = SCENES[scene].layers.find(l => l.cat);
  const isClass = mode === "classer";
  const cats = isClass && catLayer ? [...new Set(catLayer.data.map(d => d.group))] : [];
  const catNames = catLayer && catLayer.cat === "climat" ? CLIMAT_NOMS : BIOME_NOMS;
  const [queue, setQueue] = useState([]);
  const [i, setI] = useState(0);
  const [marks, setMarks] = useState({});
  const [fb, setFb] = useState(null);
  const [score, setScore] = useState(0);
  const [opts, setOpts] = useState([]);
  const [best, setBest] = usePersist("atlasBest", {});
  const pool2 = isClass && catLayer ? catLayer.data.map(d => ({ id: d.id, name: d.name, group: d.group, layer: catLayer.key })) : pool;
  const restart = () => { setQueue(shuffle(pool2)); setI(0); setMarks({}); setFb(null); setScore(0); };
  useEffect(restart, [lk, mode, scene]);
  const cur = queue[i];
  useEffect(() => {
    if (!cur) return;
    if (mode === "identifier") setOpts(shuffle([cur, ...shuffle(pool2.filter(p => p.id !== cur.id && p.name !== cur.name)).slice(0, 3)]).map(p => p.name));
    if (isClass) setOpts(shuffle(cats));
    if (mode !== "localiser") setMarks({ [cur.id]: "hl" });
  }, [cur && cur.id, mode]);
  const done = queue.length > 0 && i >= queue.length;
  const key = scene + ":" + mode + ":" + (isClass ? "cat" : lk);
  useEffect(() => { if (done) setBest(b => ({ ...b, [key]: Math.max(b[key] || 0, Math.round(100 * score / queue.length)) })); }, [done]);
  const next = () => { setFb(null); setI(x => x + 1); if (mode === "localiser") setMarks(m => Object.fromEntries(Object.entries(m).filter(([, v]) => v === "good"))); };

  const pick = p => {
    if (mode !== "localiser" || !cur || fb) return;
    if (p.id === cur.id || p.name === cur.name) { setScore(s => s + 1); setMarks(m => ({ ...m, [cur.id]: "good" })); setFb({ ok: true, t: "Exact : " + cur.name + "." }); setTimeout(next, 900); }
    else { setMarks(m => ({ ...m, [p.id]: "bad", [cur.id]: "hl" })); setFb({ ok: false, t: "Non : tu as désigné « " + p.name + " ». La bonne réponse clignote." }); }
  };
  const answer = o => {
    if (fb || !cur) return;
    const ok = isClass ? o === cur.group : o === cur.name;
    if (ok) setScore(s => s + 1);
    setFb({ ok, t: ok ? "Exact !" : "Non : la bonne réponse est « " + (isClass ? catNames[cur.group] : cur.name) + " »" + (isClass ? " (" + cur.name + ")." : "."), chosen: o });
  };

  if (!pool2.length) return <p className="muted">Pas d’exercice disponible pour cette carte.</p>;
  return <div className="maptask">
    {!isClass && layers.length > 1 && <div className="row"><span className="small">Je m’entraîne sur :</span>{layers.map(([k]) => <button key={k} className={"btn small" + (lk === k ? " on" : "")} onClick={() => setLk(k)}>{LAYER_NAMES[k] || k}</button>)}</div>}
    {!done && cur && <div className="prompt" aria-live="polite">
      {mode === "localiser" && <>Clique sur : <span style={{ color: "var(--accent-strong)" }}>{cur.name}</span></>}
      {mode === "identifier" && <>Qu’est-ce qui clignote sur la carte ?</>}
      {isClass && <>Quel est le {catLayer.cat === "climat" ? "climat" : "biome"} du lieu qui clignote ?</>}
      <span className="small muted" style={{ marginLeft: "auto" }}>{i + 1} / {queue.length} · score {score}</span>
    </div>}
    {fb && <div className={"feedback " + (fb.ok ? "ok" : "ko")} role="status">{fb.t}</div>}
    {(mode === "identifier" || isClass) && !done && cur && <div className="grid3">
      {opts.map(o => <button key={o} className={"opt" + (fb ? ((isClass ? o === cur.group : o === cur.name) ? " good" : o === fb.chosen ? " bad" : "") : "")} disabled={!!fb} onClick={() => answer(o)}>{isClass ? catNames[o] : o}</button>)}
    </div>}
    {fb && !done && (!fb.ok || mode !== "localiser") && <button className="btn primary" onClick={next} style={{ alignSelf: "flex-start" }}>Suivant<Icon n="right" /></button>}
    {done && <div className="feedback info" role="status"><b>Terminé : {score} / {queue.length}</b> ({Math.round(100 * score / queue.length)} %). Meilleur score : {best[key] || 0} %. <button className="btn small" onClick={restart}>Recommencer</button></div>}
    <MapView id={scene} mode={mode === "localiser" ? "pick" : "show"} marks={marks} onPick={pick}
      pickLayers={isClass ? [] : (SCENES[scene].layers.filter(l => (l.theme || l.key) === lk).map(l => l.key))}
      theme={SCENES[scene].themes ? (SCENES[scene].themes.some(t => t[0] === lk) ? lk : SCENES[scene].themes[0][0]) : undefined}
      neutral={isClass} focusId={mode !== "localiser" && cur ? cur.id : null}
      toggles={{ provinces: lk === "provinces", hemis: lk === "hemis" }} />
  </div>;
}

export default function Atlas() {
  const { route, go } = useApp();
  const scene = route.sub[0] && SCENES[route.sub[0]] ? route.sub[0] : null;
  const [mode, setMode] = useState("explorer");
  const [names, setNames] = useState(false);
  const [tg, setTg] = useState({ provinces: false, hemis: false });
  const [best] = usePersist("atlasBest", {});
  useEffect(() => { setMode("explorer"); setNames(false); }, [scene]);

  if (!scene) return <>
    <div className="card"><h1>Les cartes interactives</h1>
      <T>Explore chaque carte (survole ou touche un élément pour voir son nom), puis entraîne-toi : « Où est… ? » (tu cliques sur la carte), « Qu’est-ce que c’est ? » (tu reconnais l’élément) et, pour les climats et les biomes, « Classe ».</T>
      <p className="small muted">Fonds de carte : Natural Earth (domaine public). Les zones thématiques (climats, végétation, régions naturelles…) sont des schémas simplifiés d’après les fiches du cours.</p></div>
    {ATLAS.map(g => <section key={g.part} className="stack"><h2>{g.part}</h2>
      <div className="toc">{g.items.map(id => { const b = Object.entries(best).filter(([k]) => k.startsWith(id + ":")).map(([, v]) => v); return <button key={id} onClick={() => go("atlas", id)}><b>{SCENES[id].title}</b><span>{b.length ? "Meilleur score : " + Math.max(...b) + " %" : "Pas encore d’entraînement"}</span></button>; })}</div>
    </section>)}
  </>;

  const sc = SCENES[scene];
  const hasCat = sc.layers.some(l => l.cat);
  const canQuiz = sceneItems(scene).length >= 2;
  return <>
    <div className="row between noprint"><button className="btn small ghost" onClick={() => go("atlas")}><Icon n="left" />Toutes les cartes</button></div>
    <h1>{sc.title}</h1>
    <div className="tabs" role="tablist">
      {[["explorer", "Explorer"], ...(canQuiz ? [["localiser", "Où est… ?"], ["identifier", "Qu’est-ce que c’est ?"]] : []), ...(hasCat ? [["classer", "Classe"]] : [])].map(([m, l]) =>
        <button key={m} role="tab" aria-selected={mode === m} onClick={() => setMode(m)}>{l}</button>)}
    </div>
    {mode === "explorer" ? <div className="stack">
      <div className="row">
        <label className="chk"><input type="checkbox" checked={names} onChange={e => setNames(e.target.checked)} /><span>Afficher les noms</span></label>
        {sc.layers.some(l => l.toggle === "provinces") && <label className="chk"><input type="checkbox" checked={tg.provinces} onChange={e => setTg(t => ({ ...t, provinces: e.target.checked }))} /><span>Limites des provinces</span></label>}
        {sc.layers.some(l => l.toggle === "hemis") && <label className="chk"><input type="checkbox" checked={tg.hemis} onChange={e => setTg(t => ({ ...t, hemis: e.target.checked }))} /><span>Colorer les hémisphères</span></label>}
      </div>
      <MapView id={scene} mode="explore" names={names} toggles={tg} />
      {scene === "monde_biomes" && <div className="stack"><h3>Pour comprendre : la pyramide des biomes</h3><Diagram id="pyramide" /></div>}
      {scene === "monde_climats" && <div className="stack"><h3>Pour comprendre : la zonation climatique</h3><Diagram id="zonation" /></div>}
      {scene === "rdc_ressources" && <Box kind="info" label="Le savais-tu ?"><T>La RDC fournit environ 70 % du cobalt extrait dans le monde, surtout autour de Kolwezi, dans la ceinture cuprifère.</T></Box>}
    </div> : <Task key={scene + mode} scene={scene} mode={mode} />}
  </>;
}
