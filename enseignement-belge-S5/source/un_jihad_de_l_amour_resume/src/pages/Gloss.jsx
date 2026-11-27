import React, { useState, useEffect, useMemo } from "react";
import { useApp, T, norm, ListenBtn, Icon } from "../ui.jsx";
import { GLOSSAIRE, THEMES_G } from "../content/glossaire.js";

export default function Gloss() {
  const { route, go } = useApp();
  const [q, setQ] = useState("");
  const [th, setTh] = useState("tous");
  const focus = route.sub[0];
  useEffect(() => { if (focus) { setQ(""); setTh("tous"); setTimeout(() => { const el = document.getElementById("g-" + focus); if (el) { el.scrollIntoView({ block: "center" }); el.style.outline = "2px solid var(--accent)"; } }, 100); } }, [focus]);
  const list = useMemo(() => {
    const n = norm(q);
    return GLOSSAIRE.filter(g => (th === "tous" || g.theme === th) && (!n || norm(g.terme + " " + g.def + " " + (g.alias || []).join(" ")).includes(n)))
      .sort((a, b) => a.terme.localeCompare(b.terme, "fr"));
  }, [q, th]);
  const letters = [...new Set(list.map(g => norm(g.terme)[0].toUpperCase()))];
  return <>
    <div className="card">
      <h1>Glossaire</h1>
      <T>Tout le vocabulaire difficile du livre et de la méthode : une définition simple et un exemple. Écoute chaque mot, puis mémorise-le avec les cartes mémoire.</T>
      <div className="row">
        <input type="search" placeholder="Rechercher un mot…" value={q} onChange={e => setQ(e.target.value)} aria-label="Rechercher dans le glossaire" style={{ flex: "1 1 14rem" }} />
        <select value={th} onChange={e => setTh(e.target.value)} aria-label="Thème"><option value="tous">Tous les thèmes ({GLOSSAIRE.length})</option>{Object.entries(THEMES_G).map(([k, v]) => <option key={k} value={k}>{v} ({GLOSSAIRE.filter(g => g.theme === k).length})</option>)}</select>
        <button className="btn" onClick={() => go("memo")}><Icon n="cards" />Mémoriser</button>
      </div>
      <div className="alpha" aria-label="Accès par lettre">{letters.map(l => <button key={l} onClick={() => { const g = list.find(x => norm(x.terme)[0].toUpperCase() === l); document.getElementById("g-" + g.id)?.scrollIntoView({ block: "start" }); }}>{l}</button>)}</div>
    </div>
    <p className="small muted">{list.length} terme{list.length > 1 ? "s" : ""}</p>
    <div className="gloss">
      {list.map(g => <article key={g.id} id={"g-" + g.id} className="gitem">
        <h3><span>{g.terme}</span><ListenBtn text={g.terme + ". " + g.def + " Par exemple : " + g.ex} /></h3>
        <T>{g.def}</T>
        <T className="ex">{"**Exemple :** " + g.ex}</T>
        <span className="tag" style={{ alignSelf: "flex-start" }}>{THEMES_G[g.theme]}</span>
      </article>)}
    </div>
  </>;
}
