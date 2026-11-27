import React, { useState, useMemo } from "react";
import { useApp, T, Icon, norm, ListenBtn } from "../ui.jsx";
import { THEMES, DOMAINES } from "../content/themes.js";

function ThemeCard({ t }) {
  const { go } = useApp();
  const [open, setOpen] = useState(false);
  return <article className="theme-card" id={"th-" + t.id}>
    <header className="row between">
      <div className="stack" style={{ gap: ".15rem" }}><b>{t.titre}</b><span className="small muted">{DOMAINES[t.domaine]}</span></div>
      <span className="row">{t.cess && <span className="tag acc">CESS {t.cess}</span>}{t.manuel && <span className="tag">vu en classe</span>}{t.livre && <span className="tag ok">lien avec le livre ({t.livre})</span>}</span>
    </header>
    <ul className="clean small">{t.sujets.map((s, i) => <li key={i}><i>{s}</i></li>)}</ul>
    <button className="btn small" onClick={() => setOpen(o => !o)} aria-expanded={open}><Icon n={open ? "up" : "down"} />{open ? "Masquer" : "Voir"} les arguments</button>
    {open && <div className="pc">
      <div className="pc-col pour"><b>Oui (pour)</b><ul className="clean">{t.pour.map((a, i) => <li key={i}><T as="span">{a[0]}</T> <span className="muted small">Ex. : {a[1]}</span></li>)}</ul></div>
      <div className="pc-col contre"><b>Non (contre)</b><ul className="clean">{t.contre.map((a, i) => <li key={i}><T as="span">{a[0]}</T> <span className="muted small">Ex. : {a[1]}</span></li>)}</ul></div>
    </div>}
    {open && <div className="row"><ListenBtn text={t.sujets[0] + " Arguments pour : " + t.pour.map(a => a[0]).join(" ") + " Arguments contre : " + t.contre.map(a => a[0]).join(" ")} label="Écouter les arguments" small={false} /><button className="btn small" onClick={() => go("atelier", "ecrire", t.id)}><Icon n="pen" />Écrire un texte sur ce sujet</button></div>}
  </article>;
}

export default function Library() {
  const { go } = useApp();
  const [q, setQ] = useState("");
  const [d, setD] = useState("tous");
  const list = useMemo(() => { const n = norm(q); return THEMES.filter(t => (d === "tous" || t.domaine === d) && (!n || norm(t.titre + " " + t.sujets.join(" ") + " " + t.pour.flat().join(" ") + " " + t.contre.flat().join(" ")).includes(n))); }, [q, d]);
  return <>
    <div className="card">
      <h1>Bibliothèque de thèmes et d’arguments</h1>
      <T>Les sujets qui reviennent souvent en 5e secondaire, avec les arguments qu’on rencontre le plus fréquemment, pour et contre. Pourquoi les mémoriser ? Comme un joueur d’échecs qui reconnaît d’un coup d’œil des positions qu’il a déjà vues, tu repéreras beaucoup plus vite les arguments d’un texte inconnu si tu les connais déjà.</T>
      <T>Les étiquettes « CESS » signalent les thèmes déjà proposés à l’épreuve externe de synthèse (UAA 2) ; « vu en classe », les thèmes des textes de ta séquence ; « lien avec le livre », ceux qui rejoignent un argument d’Un jihad de l’amour.</T>
      <div className="row">
        <input type="search" placeholder="Rechercher un thème, un argument…" value={q} onChange={e => setQ(e.target.value)} aria-label="Rechercher dans la bibliothèque" style={{ flex: "1 1 14rem" }} />
        <select value={d} onChange={e => setD(e.target.value)} aria-label="Domaine"><option value="tous">Tous les domaines ({THEMES.length})</option>{Object.entries(DOMAINES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}</select>
        <button className="btn" onClick={() => go("memo")}><Icon n="cards" />Mémoriser (cartes)</button>
      </div>
    </div>
    <div className="themes-grid">{list.map(t => <ThemeCard key={t.id} t={t} />)}</div>
  </>;
}
