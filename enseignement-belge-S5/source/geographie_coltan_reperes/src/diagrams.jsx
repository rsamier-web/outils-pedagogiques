import React, { useState } from "react";
import MapView from "./MapView.jsx";
import M from "./maps.json";

const F = { fontFamily: "Noto Sans, system-ui, sans-serif" };
function Bx({ x, y, w, h, t, sub, fill = "var(--view)", stroke = "var(--border)", fs = 14, bold = true }) {
  const lines = Array.isArray(t) ? t : [t];
  return <g>
    <rect x={x} y={y} width={w} height={h} rx="6" fill={fill} stroke={stroke} strokeWidth="1.4" />
    {lines.map((l, i) => <text key={i} x={x + w / 2} y={y + h / 2 + (i - (lines.length - 1) / 2) * (fs + 3) + (sub ? -7 : 5)} textAnchor="middle" fontSize={fs} fontWeight={bold ? 600 : 400} style={{ ...F, stroke: "none" }} fill="var(--text)">{l}</text>)}
    {sub && <text x={x + w / 2} y={y + h / 2 + (lines.length - 1) * (fs + 3) / 2 + 13} textAnchor="middle" fontSize={12} style={{ ...F, stroke: "none" }} fill="var(--muted)">{sub}</text>}
  </g>;
}
const Arrow = ({ x1, y1, x2, y2, c = "var(--muted)", w = 2, dash }) => <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={c} strokeWidth={w} markerEnd="url(#ah)" strokeDasharray={dash} />;
const Defs = () => <defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0L10,5L0,10z" fill="var(--muted)" /></marker></defs>;
const Txt = ({ x, y, t, fs = 13, a = "middle", c = "var(--text)", b, it }) => <text x={x} y={y} textAnchor={a} fontSize={fs} fontWeight={b ? 600 : 400} fontStyle={it ? "italic" : undefined} fill={c} style={{ ...F, stroke: "none" }}>{t}</text>;

function ChaineColtan() {
  const steps = [["Mine artisanale", "Kivu (RDC)", "#b0763f"], ["Négociants", "souvent via le Rwanda", "#8e44ad"], ["Fonderie, raffinage", "surtout en Asie", "#5d6873"], ["Composants", "condensateurs au tantale", "#2980b9"], ["Marques", "smartphones, ordinateurs", "#16a085"], ["Consommateurs", "Europe, monde", "#c0392b"]];
  return <svg viewBox="0 0 640 300" role="img" aria-label="Chaîne d’approvisionnement du coltan, de la mine au consommateur"><Defs />
    <Txt x={320} y={22} t="Du coltan du Kivu à ton smartphone : une chaîne mondiale" b fs={15} />
    {steps.map(([t, s, c], i) => { const x = 14 + (i % 3) * 212, y = 48 + Math.floor(i / 3) * 120; return <g key={i}><rect x={x} y={y} width="190" height="74" rx="6" fill="var(--view)" stroke={c} strokeWidth="2" /><rect x={x} y={y} width="8" height="74" fill={c} /><Txt x={x + 100} y={y + 32} t={(i + 1) + ". " + t} b fs={14} /><Txt x={x + 100} y={y + 54} t={s} fs={12} c="var(--muted)" /></g>; })}
    <Arrow x1={205} y1={85} x2={224} y2={85} /><Arrow x1={417} y1={85} x2={436} y2={85} />
    <path d="M532,122 C532,150 110,140 110,166" fill="none" stroke="var(--muted)" strokeWidth="2" markerEnd="url(#ah)" />
    <Arrow x1={205} y1={205} x2={224} y2={205} /><Arrow x1={417} y1={205} x2={436} y2={205} />
    <Txt x={320} y={282} t="Chaque étape peut cacher des minerais de sang : d’où l’exigence de traçabilité." fs={12.5} it c="var(--muted)" />
  </svg>;
}

function SituerLocaliser() {
  return <div className="stack" style={{ gap: ".4rem" }}>
    <svg viewBox="0 0 640 210" role="img" aria-label="Situer à petite échelle, localiser à grande échelle"><Defs />
      <Bx x={10} y={20} w={190} h={78} t="SITUER" sub="petite échelle · « Où, par rapport à… ? »" fill="var(--accent-bg)" stroke="var(--accent)" />
      <Bx x={440} y={20} w={190} h={78} t="LOCALISER" sub="grande échelle · « Où précisément ? »" fill="rgba(39,174,96,.12)" stroke="var(--pos)" />
      <Arrow x1={205} y1={59} x2={432} y2={59} />
      <Txt x={318} y={50} t="on zoome" fs={12} c="var(--muted)" />
      {[["Monde", "Afrique centrale"], ["Afrique", "hémisphère Sud, près de l’équateur"], ["RDC", "à l’est, frontière Rwanda"], ["Nord-Kivu", "rive nord du lac Kivu"], ["Goma", "1° 41′ S – 29° 13′ E"]].map(([a, b], i) =>
        <g key={i}><circle cx={60 + i * 130} cy={150} r={32 - i * 4} fill="none" stroke={i < 2 ? "var(--accent)" : i < 3 ? "var(--muted)" : "var(--pos)"} strokeWidth="2" /><Txt x={60 + i * 130} y={154} t={a} b fs={12.5} /><Txt x={60 + i * 130} y={200} t={b} fs={11} c="var(--muted)" />{i < 4 && <Arrow x1={60 + i * 130 + 36 - i * 4} y1={150} x2={60 + (i + 1) * 130 - 34 + i * 4} y2={150} />}</g>)}
    </svg>
    <MapView id="rdc_situation" mode="show" names={["villes", "lacs"]} hideLegend height="300px" only={["voisins", "lacs", "villes"]} />
  </div>;
}

function Malediction() {
  return <svg viewBox="0 0 640 260" role="img" aria-label="Le paradoxe de la malédiction des ressources"><Defs />
    <Bx x={20} y={20} w={250} h={80} t="Un sous-sol très riche" sub="cuivre, cobalt, coltan, or, diamants…" fill="rgba(39,174,96,.12)" stroke="var(--pos)" />
    <Bx x={370} y={20} w={250} h={80} t="Une population très pauvre" sub="> 70 % vivent avec < 2 $ par jour" fill="var(--neg-bg)" stroke="var(--neg)" />
    <Txt x={320} y={65} t="≠" fs={34} b c="var(--neg)" />
    <Txt x={320} y={135} t="Pourquoi ?" b fs={15} />
    {[["Convoitises", "pays voisins, milices, entreprises"], ["Corruption", "les revenus ne vont pas à l’État"], ["Conflits", "on se bat pour les mines"], ["Contrebande", "les minerais sortent sans taxes"]].map(([a, b], i) =>
      <Bx key={i} x={14 + i * 157} y={160} w={145} h={78} t={a} sub={b} fs={14} />)}
  </svg>;
}

function Racket() {
  return <svg viewBox="0 0 640 250" role="img" aria-label="Le cercle vicieux minerais et armes"><Defs />
    <Txt x={320} y={22} t="Le cercle vicieux des minerais de sang" b fs={15} />
    {[[250, 40, "Une milice contrôle une mine", "ex. : le M23 à Rubaya"], [440, 125, "Elle taxe creuseurs et transporteurs", "racket, travail forcé"], [250, 200, "Le minerai part en contrebande", "vers les pays voisins"], [40, 125, "L’argent achète armes et soldats", "≈ 300 000 $ par mois à Rubaya"]].map(([x, y, t, s], i) =>
      <Bx key={i} x={x} y={y} w={175} h={56} t={t} sub={s} fs={12.5} />)}
    <Arrow x1={425} y1={70} x2={500} y2={122} /><Arrow x1={500} y1={182} x2={428} y2={218} /><Arrow x1={248} y1={225} x2={140} y2={183} /><Arrow x1={130} y1={122} x2={246} y2={72} />
    <Txt x={337} y={145} t="violences" fs={13} it c="var(--neg)" b />
  </svg>;
}

function Enjeux() {
  const C = (x, y, w, h, t, items, col) => <g><rect x={x} y={y} width={w} height={h} rx="6" fill="var(--view)" stroke={col} strokeWidth="1.8" /><rect x={x} y={y} width={w} height="26" rx="6" fill={col} /><Txt x={x + w / 2} y={y + 18} t={t} b fs={13} c="#fff" />
    {items.map((it, i) => <Txt key={i} x={x + 10} y={y + 46 + i * 18} t={"• " + it} fs={12} a="start" />)}</g>;
  return <svg viewBox="0 0 660 430" role="img" aria-label="Schéma des enjeux et problématiques du coltan en RDC"><Defs />
    {C(10, 10, 205, 150, "ATOUTS / CAUSES", ["60 à 80 % du coltan mondial", "sous-sol très riche (3T, or)", "forte demande mondiale", "État faible à l’est", "frontières proches et poreuses"], "#2980b9")}
    {C(227, 10, 205, 150, "ACTEURS", ["État congolais", "groupes armés (M23, ADF…)", "pays voisins (Rwanda…)", "négociants, multinationales", "creuseurs, consommateurs"], "#8e44ad")}
    {C(444, 10, 205, 150, "CONSÉQUENCES", ["+ de 6 millions de morts", "déplacés et réfugiés", "travail des enfants", "pauvreté, contrebande", "forêts menacées"], "#c0392b")}
    <rect x={180} y={190} width={300} height={70} rx="35" fill="var(--accent-bg)" stroke="var(--accent)" strokeWidth="2" />
    <Txt x={330} y={222} t="LE COLTAN AU KIVU" b fs={16} /><Txt x={330} y={243} t="une ressource convoitée = un enjeu" fs={12.5} c="var(--muted)" />
    <Arrow x1={112} y1={162} x2={215} y2={200} /><Arrow x1={330} y1={162} x2={330} y2={188} /><Arrow x1={440} y1={204} x2={540} y2={164} />
    {C(10, 285, 310, 132, "PROBLÉMATIQUES", ["Pourquoi un pays si riche reste-t-il pauvre ?", "Qui profite vraiment des minerais ?", "Comment arrêter le financement de la guerre ?", "Quelle responsabilité pour les consommateurs ?"], "#d35400")}
    {C(340, 285, 310, 132, "RÉPONSES", ["traçabilité, certification des mines", "loi Dodd-Frank (États-Unis, 2010)", "règlement européen (2021)", "accords de paix (2025), ONU, MONUSCO"], "#1e7e46")}
    <Arrow x1={260} y1={262} x2={180} y2={283} /><Arrow x1={400} y1={262} x2={480} y2={283} />
  </svg>;
}

function ElementsCarte() {
  return <svg viewBox="0 0 640 330" role="img" aria-label="Les cinq éléments d’une carte"><Defs />
    <rect x={150} y={52} width={340} height={210} fill="var(--alt)" stroke="var(--text)" strokeWidth="1.5" />
    <path d={M.rdc.rdc} transform="translate(196 62) scale(.19)" fill="var(--land)" stroke="var(--text)" strokeWidth="6" />
    <rect x={150} y={18} width={340} height={30} rx="3" fill="var(--accent-bg)" stroke="var(--accent)" />
    <Txt x={320} y={38} t="TITRE : sujet + date + lieu" b fs={13.5} />
    <g transform="translate(455 82)"><circle r="16" fill="var(--view)" stroke="var(--text)" /><path d="M0,-14L5,4L0,0L-5,4Z" fill="var(--neg)" /><Txt x={0} y={-20} t="N" b fs={12} /></g>
    <Txt x={455} y={120} t="ORIENTATION" fs={11} b />
    <line x1={360} y1={245} x2={440} y2={245} stroke="var(--text)" strokeWidth="3" /><Txt x={400} y={238} t="ÉCHELLE" fs={11} b />
    <rect x={500} y={52} width={130} height={150} rx="3" fill="var(--view)" stroke="var(--text)" />
    <Txt x={565} y={70} t="LÉGENDE" b fs={12.5} />
    <circle cx={515} cy={92} r={5} fill="#232629" /><Txt x={526} y={96} t="point : lieu" a="start" fs={11.5} />
    <line x1={509} y1={117} x2={522} y2={117} stroke="#c0392b" strokeWidth="3" /><Txt x={526} y={121} t="ligne : limite" a="start" fs={11.5} />
    <rect x={509} y={136} width={12} height={10} fill="rgba(39,174,96,.6)" /><Txt x={526} y={145} t="surface : espace" a="start" fs={11.5} />
    <Txt x={565} y={176} t="classée par thème," fs={10.5} c="var(--muted)" /><Txt x={565} y={190} t="mêmes figurés" fs={10.5} c="var(--muted)" />
    <Txt x={150} y={282} t="SOURCE : « Cours de géographie EBC – S5 – 2026-27 »" a="start" fs={12} b />
    <Txt x={320} y={315} t="Croquis schématique : l’échelle n’est pas nécessaire." fs={12} it c="var(--muted)" />
    <g>{[["1", 20, 40, "Titre"], ["2", 20, 90, "Légende"], ["3", 20, 140, "Orientation"], ["4", 20, 190, "Échelle"], ["5", 20, 240, "Source"]].map(([n, x, y, t]) => <g key={n}><circle cx={x + 10} cy={y} r={11} fill="var(--accent)" /><Txt x={x + 10} y={y + 4.5} t={n} b fs={12} c="#fff" /><Txt x={x + 28} y={y + 4.5} t={t} a="start" fs={13} b /></g>)}</g>
  </svg>;
}

function Zonation() {
  const bands = [["Zone froide", "#dbe6ee", 90, 66], ["Zone tempérée", "#cfe8b4", 66, 30], ["Zone chaude", "#f8d49a", 30, -30], ["Zone tempérée", "#cfe8b4", -30, -66], ["Zone froide", "#dbe6ee", -66, -90]];
  const Y = lat => 150 - Math.sin(lat * Math.PI / 180) * 130;
  return <svg viewBox="0 0 640 300" role="img" aria-label="Zonation climatique selon la latitude"><Defs />
    <defs><clipPath id="globe"><circle cx="150" cy="150" r="130" /></clipPath></defs>
    <g clipPath="url(#globe)">{bands.map(([t, c, a, b], i) => <rect key={i} x={20} y={Y(a)} width={260} height={Y(b) - Y(a)} fill={c} />)}</g>
    <circle cx="150" cy="150" r="130" fill="none" stroke="var(--text)" strokeWidth="1.5" />
    {[[0, "Équateur", "#c0392b"], [23.44, "Tropique du Cancer", "#e67e22"], [-23.44, "Tropique du Capricorne", "#e67e22"], [66.56, "Cercle polaire arctique", "#2980b9"], [-66.56, "Cercle polaire antarctique", "#2980b9"]].map(([l, t, c], i) => {
      const y = Y(l), hw = Math.sqrt(130 * 130 - (y - 150) ** 2);
      return <g key={i}><line x1={150 - hw} y1={y} x2={150 + hw} y2={y} stroke={c} strokeWidth="1.6" strokeDasharray={l === 0 ? null : "5 3"} /><line x1={150 + hw} y1={y} x2={300} y2={y} stroke={c} strokeWidth=".8" /><Txt x={305} y={y + 4} t={t} a="start" fs={12} c={c} b /></g>;
    })}
    {bands.map(([t, c, a, b], i) => <Txt key={i} x={150} y={(Y(a) + Y(b)) / 2 + 5} t={t} b fs={12.5} />)}
    <Txt x={480} y={70} t="Plus on s’éloigne de l’équateur," fs={12.5} a="start" /><Txt x={480} y={88} t="plus il fait froid." fs={12.5} a="start" b />
    <Txt x={480} y={215} t="Mais aussi :" fs={12.5} a="start" b /><Txt x={480} y={233} t="• altitude : −6 °C / 1000 m" fs={12} a="start" /><Txt x={480} y={251} t="• continentalité : loin de la mer," fs={12} a="start" /><Txt x={490} y={267} t="hivers froids, étés chauds" fs={12} a="start" />
  </svg>;
}

function Pyramide() {
  const rows = [["Arctique", "Toundra", [["Toundra", "#86e8df"]]], ["Subarctique", "Taïga", [["Taïga", "#1f6e55"]]], ["Tempéré", "", [["Forêt tempérée", "#2ea650"], ["Prairie tempérée", "#dbe95a"], ["Désert", "#f5c242"]]], ["Tropical", "", [["Forêt humide", "#7fd98e"], ["Savane", "#ef7f2a"], ["Désert", "#f5c242"]]]];
  const top = 30, H = 62;
  return <svg viewBox="0 0 640 340" role="img" aria-label="Pyramide des biomes selon la température et l’humidité"><Defs />
    {rows.map(([zone, , cells], r) => {
      const y = top + r * H, wTop = 60 + r * 105, wBot = 60 + (r + 1) * 105, cx = 300;
      const cw = wBot / cells.length;
      return <g key={r}>
        {cells.map(([t, c], j) => { const x0 = cx - wTop / 2 + j * wTop / cells.length, x1 = x0 + wTop / cells.length, x2 = cx - wBot / 2 + (j + 1) * cw, x3 = cx - wBot / 2 + j * cw;
          return <g key={j}><path d={`M${x0},${y}L${x1},${y}L${x2},${y + H}L${x3},${y + H}Z`} fill={c} stroke="var(--view)" strokeWidth="2" /><Txt x={(x0 + x1 + x2 + x3) / 4} y={y + H / 2 + 5} t={t} b fs={r < 2 ? 13 : 11.5} c={c === "#1f6e55" ? "#fff" : "#232629"} /></g>; })}
        <Txt x={cx + wBot / 2 + 14} y={y + H / 2 + 5} t={zone} a="start" b fs={13} />
      </g>;
    })}
    <Arrow x1={60} y1={290} x2={60} y2={40} c="#2980b9" w={2.5} /><Txt x={46} y={170} t="de plus en plus froid" fs={12} c="#2980b9" b />
    <Arrow x1={100} y1={315} x2={520} y2={315} c="#e67e22" w={2.5} /><Txt x={310} y={335} t="de plus en plus sec" fs={12} c="#e67e22" b />
    <Txt x={110} y={325} t="humide" fs={11} c="var(--muted)" /><Txt x={540} y={319} t="sec" fs={11} c="var(--muted)" a="start" />
  </svg>;
}

export const DIAGRAMS = { chaine_coltan: ChaineColtan, situer_localiser: SituerLocaliser, malediction: Malediction, racket: Racket, enjeux: Enjeux, elements_carte: ElementsCarte, zonation: Zonation, pyramide: Pyramide };
export function Diagram({ id }) { const C = DIAGRAMS[id]; return C ? <div className="diagram">{id === "situer_localiser" ? <C /> : <C />}</div> : null; }

// ---------- Atelier : construire le croquis de synthèse ----------
const ELEMENTS = [
  { id: "frontieres", t: "Les frontières de la RDC", impl: "ligne", legend: ["line", "#232629", "Frontière de la RDC"] },
  { id: "equateur", t: "L’équateur", impl: "ligne", legend: ["line", "#c0392b", "Équateur"] },
  { id: "kinshasa", t: "La capitale : Kinshasa", impl: "point", legend: ["sq", "#c0392b", "Capitale"] },
  { id: "villes", t: "Lubumbashi, Mbuji-Mayi, Kisangani, Goma", impl: "point", legend: ["pt", "#232629", "Ville secondaire importante"] },
  { id: "stann", t: "La région stannifère", impl: "surface", legend: ["area", "rgba(93,173,226,.5)", "Région stannifère (étain, coltan)"] },
  { id: "cupr", t: "La ceinture cuprifère", impl: "surface", legend: ["area", "rgba(39,174,96,.55)", "Ceinture cuprifère (cuivre, cobalt)"] },
  { id: "violences", t: "Les zones de violences en 2023", impl: "surface", legend: ["area", "rgba(192,57,43,.45)", "Concentration des tués (violences, 2023)"] },
  { id: "palu", t: "La zone de paludisme toute l’année", impl: "surface", legend: ["hatchP", "#e056c8", "Paludisme transmis toute l’année"] },
];
const TITRES = [
  { t: "Carte de la RDC", ok: false, why: "Il manque le sujet précis et la date." },
  { t: "Les minerais, sources de conflits en RDC (2023)", ok: true, why: "Sujet (minerais et conflits), lieu (RDC) et date (2023) : les trois informations sont présentes." },
  { t: "Les minerais et les conflits", ok: false, why: "Il manque le lieu et la date." },
  { t: "La RDC en 2023", ok: false, why: "Il manque le sujet (de quoi parle le croquis ?)." },
];

export function CroquisBuilder() {
  const [placed, setPlaced] = useState({});
  const [msg, setMsg] = useState(null);
  const [cur, setCur] = useState(0);
  const [titre, setTitre] = useState(null);
  const [extras, setExtras] = useState({ nord: false, source: false });
  const r = M.rdc;
  const el = ELEMENTS[cur];
  const choose = impl => {
    if (!el) return;
    if (impl === el.impl) { setPlaced(p => ({ ...p, [el.id]: true })); setMsg({ ok: true, t: `Exact : ${el.t.toLowerCase()} → figuré ${impl === "point" ? "ponctuel (un point)" : impl === "ligne" ? "linéaire (une ligne)" : "zonal (une surface)"}.` }); setCur(c => c + 1); }
    else setMsg({ ok: false, t: `Pas tout à fait. Demande-toi : « ${el.t} », dans la réalité, est-ce un lieu (point), une limite (ligne) ou un espace (surface) ?` });
  };
  const stann = r.themes.ressources[0].d, cupr = r.themes.ressources[1].d, palu = r.themes.sante[0].d;
  const done = cur >= ELEMENTS.length;
  return <div className="card flat" style={{ gap: ".6rem" }}>
    <h3>Atelier : construis le croquis de synthèse</h3>
    {!done ? <div className="prompt">Élément {cur + 1}/{ELEMENTS.length} : {el.t}. Quel figuré choisis-tu ?
      <span className="row">{["point", "ligne", "surface"].map(i => <button key={i} className="btn small" onClick={() => choose(i)}>{i === "point" ? "● Point" : i === "ligne" ? "━ Ligne" : "▇ Surface"}</button>)}</span></div>
      : <div className="feedback ok">Tous les éléments sont placés. Ajoute maintenant les informations obligatoires de la carte.</div>}
    {msg && <div className={"feedback " + (msg.ok ? "ok" : "ko")} role="status">{msg.t}</div>}
    <div className="mapbox">
      <svg viewBox={r.vb} role="img" aria-label="Croquis en construction">
        <defs><pattern id="hp" width="9" height="9" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="9" height="9" fill="transparent" /><rect width="3" height="9" fill="#e056c8" opacity=".7" /></pattern></defs>
        <rect x="-5000" y="-5000" width="20000" height="20000" fill="var(--view)" />
        <path d={r.rdc} fill="var(--alt)" stroke={placed.frontieres ? "#232629" : "var(--border)"} strokeWidth={placed.frontieres ? 3 : 1} strokeDasharray={placed.frontieres ? null : "4 4"} />
        {placed.stann && <path d={stann} fill="rgba(93,173,226,.5)" stroke="#2980b9" />}
        {placed.cupr && <path d={cupr} fill="rgba(39,174,96,.55)" stroke="#1e7e46" />}
        {placed.palu && <path d={palu} fill="url(#hp)" stroke="#a0309a" />}
        {placed.violences && <g>{[[29.3, -1.2, 1.2, 2.2], [30.1, 1.6, .9, .9], [28.95, -3.2, .5, 1.2], [16.3, -3.6, .9, .7]].map(([lo, la, rx, ry], i) => { const x = (lo - 11.6) / (31.8 - 11.6) * 1000; const yy = (6 - la) / (6 + 14.2); return <ellipse key={i} cx={x} cy={yy * parseFloat(r.vb.split(" ")[3])} rx={rx * 50} ry={ry * 50} fill="rgba(192,57,43,.45)" />; })}</g>}
        {placed.equateur && <path d={r.equator} stroke="#c0392b" strokeWidth="2.5" fill="none" />}
        {placed.kinshasa && r.cities.filter(c => c.id === "kinshasa").map(c => <g key={c.id}><rect x={c.x - 10} y={c.y - 10} width="20" height="20" fill="#c0392b" stroke="#fff" strokeWidth="2" /><text x={c.x + 14} y={c.y + 26} fontSize="24">Kinshasa</text></g>)}
        {placed.villes && r.cities.filter(c => ["lubumbashi", "mbujimayi", "kisangani", "goma"].includes(c.id)).map(c => <g key={c.id}><circle cx={c.x} cy={c.y} r="9" fill="#232629" stroke="#fff" strokeWidth="2" /><text x={c.x + (c.id === "goma" ? -14 : 14)} y={c.y + 8} fontSize="22" textAnchor={c.id === "goma" ? "end" : "start"}>{c.name}</text></g>)}
        {extras.nord && <g transform="translate(930 110)"><circle r="34" fill="var(--view)" stroke="var(--text)" /><path d="M0,-28L10,8L0,0L-10,8Z" fill="var(--neg)" /><text y="-40" textAnchor="middle" fontSize="22" fontWeight="700">N</text></g>}
        {titre != null && TITRES[titre].ok && <text x="500" y="40" textAnchor="middle" fontSize="30" fontWeight="700">{TITRES[titre].t}</text>}
        {extras.source && <text x="20" y={parseFloat(r.vb.split(" ")[3]) - 16} fontSize="21">Source : « Cours de géographie EBC – S5 – 2026-27 »</text>}
      </svg>
      <Legend2 items={ELEMENTS.filter(e => placed[e.id]).map(e => e.legend)} />
    </div>
    {done && <div className="stack">
      <div className="field"><span>Choisis le meilleur titre :</span>
        <div className="opts">{TITRES.map((t, i) => <button key={i} className={"opt" + (titre === i ? (t.ok ? " good" : " bad") : "")} onClick={() => setTitre(i)}><span className="k">{"ABCD"[i]}</span><span>{t.t}{titre === i && <><br /><small>{t.why}</small></>}</span></button>)}</div></div>
      <div className="row"><button className={"btn" + (extras.nord ? " on" : "")} onClick={() => setExtras(e => ({ ...e, nord: true }))}>Ajouter l’orientation (N)</button>
        <button className={"btn" + (extras.source ? " on" : "")} onClick={() => setExtras(e => ({ ...e, source: true }))}>Ajouter la source</button>
        <button className="btn ghost" onClick={() => { setPlaced({}); setCur(0); setMsg(null); setTitre(null); setExtras({ nord: false, source: false }); }}>Recommencer</button></div>
      {titre != null && TITRES[titre].ok && extras.nord && extras.source && <div className="feedback ok">Bravo : ton croquis a un titre complet, une légende conforme, une orientation et une source. L’échelle n’est pas nécessaire pour un croquis schématique.</div>}
    </div>}
  </div>;
}
function Legend2({ items }) {
  if (!items.length) return <div className="legend muted">La légende se remplira au fur et à mesure.</div>;
  return <div className="legend"><b style={{ width: "100%" }}>Légende</b>{items.map(([k, c, t], i) => <span key={i}>{k === "line" ? <i className="ln" style={{ background: c }} /> : k === "pt" ? <i className="pt" style={{ background: c }} /> : k === "hatchP" ? <i style={{ background: "repeating-linear-gradient(45deg,#e056c8 0 2px,transparent 2px 5px)" }} /> : k === "sq" ? <i style={{ background: c, width: ".7rem", height: ".7rem" }} /> : <i style={{ background: c }} />}{t}</span>)}</div>;
}
