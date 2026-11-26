import React, { useMemo, useRef, useState, useCallback, useEffect } from "react";
import M from "./maps.json";
import { SCENES } from "./scenes.js";

const LEFT = new Set(["louvre", "opera_garnier", "brazzaville", "lisbonne", "madrid", "liege", "aix", "maastricht", "bukavu", "uvira", "kalemie", "g_m23", "g_fdlr", "manchester", "birmingham", "londres",
  "matignon", "unesco", "sorbonne", "senat", "assemblee", "g_montparnasse", "g_austerlitz", "elysee", "ocde", "eupen", "lille", "c_medit_3", "ec_ocean_1", "m_coltan_1", "m_cuivre_1", "kolwezi", "tournai"]);
const ABOVE = new Set(["goma", "notre_dame", "arc", "sacre_coeur", "college_france", "g_est", "luxembourg_v", "naples", "m_etain_1"]);

function Shape({ shape, x, y, r, fill, stroke, cls, ...rest }) {
  const sw = 1.3;
  if (shape === "sq" || shape === "rail") return <rect x={x - r} y={y - r} width={2 * r} height={2 * r} rx={shape === "rail" ? 1 : 1.5} fill={fill} stroke={stroke} strokeWidth={sw} className={cls} {...rest} />;
  if (shape === "tri") return <path d={`M${x},${y - r * 1.25}L${x + r * 1.15},${y + r * .85}L${x - r * 1.15},${y + r * .85}Z`} fill={fill} stroke={stroke} strokeWidth={sw} className={cls} {...rest} />;
  if (shape === "diamond") return <path d={`M${x},${y - r * 1.3}L${x + r},${y}L${x},${y + r * 1.3}L${x - r},${y}Z`} fill={fill} stroke={stroke} strokeWidth={sw} className={cls} {...rest} />;
  if (shape === "star") {
    let d = ""; for (let i = 0; i < 10; i++) { const a = -Math.PI / 2 + i * Math.PI / 5; const rr = i % 2 ? r * .5 : r * 1.35; d += (i ? "L" : "M") + (x + rr * Math.cos(a)).toFixed(1) + "," + (y + rr * Math.sin(a)).toFixed(1); }
    return <path d={d + "Z"} fill={fill} stroke={stroke} strokeWidth={1} className={cls} {...rest} />;
  }
  return <circle cx={x} cy={y} r={r} fill={fill} stroke={stroke} strokeWidth={sw} className={cls} {...rest} />;
}

const val = (v, f, i) => (typeof v === "function" ? v(f, i) : v);

export function Legend({ items }) {
  if (!items || !items.length) return null;
  return (
    <div className="legend" aria-label="Légende">
      {items.map(([k, c, t], i) => (
        <span key={i}>
          {k === "line" ? <i className="ln" style={{ background: c }} /> :
            k === "pt" || k === "bubble" ? <i className="pt" style={{ background: c }} /> :
              k === "hatch" ? <i style={{ background: "repeating-linear-gradient(45deg,#f0e08a 0 3px,#a9d6a0 3px 6px)" }} /> :
                k === "areaDash" ? <i style={{ background: "transparent", border: `2px dashed ${c}` }} /> :
                  k === "sq" ? <i style={{ background: c, width: ".7rem", height: ".7rem" }} /> :
                    k === "tri" ? <i style={{ background: "none", border: "none", width: 0, height: 0, borderLeft: ".38rem solid transparent", borderRight: ".38rem solid transparent", borderBottom: `.66rem solid ${c}`, borderRadius: 0 }} /> :
                      k === "diamond" ? <i style={{ background: c, width: ".55rem", height: ".55rem", transform: "rotate(45deg)", borderRadius: 0 }} /> :
                        k === "star" ? <i style={{ background: "none", border: "none", color: c, width: "auto", height: "auto", fontStyle: "normal", fontSize: ".9rem", lineHeight: 1 }}>★</i> :
                          <i style={{ background: c }} />}
          {t}
        </span>
      ))}
    </div>
  );
}

// Fond de carte selon le type de base
function BaseUnder({ base }) {
  if (base === "world") { const w = M.world_base; return <g><path className="sea" d={w.sphere} /><path className="grat" d={w.grat} /><path className="land" d={w.land} /></g>; }
  if (base === "europe") { const e = M.europe_base; return <g><rect className="sea" x="-5000" y="-5000" width="20000" height="20000" /><path className="land" d={e.base} /></g>; }
  if (base === "europe_sea" || base === "afrique") return <rect className="sea" x="-5000" y="-5000" width="20000" height="20000" />;
  if (base === "belgique") { const b = M.belgique_base; return <g><rect className="sea" x="-5000" y="-5000" width="20000" height="20000" />{b.neigh.map(n => <path key={n.id} className="neigh" d={n.d} />)}<path className="land" d={b.outline} /></g>; }
  if (base === "rdc") { const r = M.rdc; return <g><rect className="sea" x="-5000" y="-5000" width="20000" height="20000" />{r.neigh.map(n => <path key={n.id} className="neigh" d={n.d} />)}<path className="land" d={r.rdc} /></g>; }
  if (base === "paris") {
    const p = M.paris;
    return <g><rect x="-5000" y="-5000" width="20000" height="20000" fill="var(--land)" /><path d={p.periph} fill="var(--alt)" stroke="none" />{p.bois.map((b, i) => <path key={i} d={b.d} fill="#bcdc9a" opacity=".8" />)}</g>;
  }
  return null;
}
function BaseOver({ base, sc, k }) {
  if (base === "world") { const w = M.world_base; return <g><path className="lake" d={w.caspian} /><path className="border" d={w.borders} /><path d={w.sphere} fill="none" stroke="var(--land-line)" /></g>; }
  if (base === "europe" || base === "europe_sea") {
    const e = M.europe_base;
    return <g>{base === "europe" && <path className="border" d={e.borders} />}{(base === "europe_sea" || sc.seaLabels || base === "europe") && e.labels.map((l, i) => <text key={i} x={l.x} y={l.y} className="sea" fontSize={13 * k} textAnchor="middle">{l.t}</text>)}
      {(sc.extraLabels || []).map((l, i) => <text key={"x" + i} x={l.x} y={l.y} className="sea" fontSize={12 * k} textAnchor="middle">{l.t}</text>)}</g>;
  }
  if (base === "belgique") { const b = M.belgique_base; return <g><path d={b.outline} fill="none" stroke="var(--text)" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />{b.labels.map((l, i) => <text key={i} x={l.x} y={l.y} className={l.cls} fontSize={(l.cls === "sea" ? 14 : 11.5) * k} textAnchor="middle">{l.t}</text>)}</g>; }
  if (base === "rdc") {
    const r = M.rdc;
    return <g>
      <path d={r.provlines} fill="none" stroke="var(--land-line)" strokeWidth=".8" strokeDasharray="3 3" vectorEffect="non-scaling-stroke" />
      <path className="river" d={r.rivers} style={{ strokeWidth: 1 }} opacity=".85" /><path className="river" d={r.congo} style={{ strokeWidth: 2 }} />
      {sc.layers.some(l => l.key === "lacs") ? null : r.lakes.map(l => <path key={l.id} className="lake" d={l.d} />)}
      <path d={r.rdc} fill="none" stroke="var(--text)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
      {sc.showEquator && <path d={r.equator} fill="none" stroke="#c0392b" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />}
      {r.labels.map((l, i) => <text key={i} x={l.x} y={l.y} className={l.cls === "line" ? "" : l.cls} fill={l.cls === "line" ? "#c0392b" : undefined} fontSize={(l.cls === "country_s" ? 10 : l.cls === "sea" ? 13 : 11.5) * k} textAnchor="middle">{l.t}</text>)}
    </g>;
  }
  if (base === "paris") {
    const p = M.paris;
    return <g>
      <path d={p.rails} fill="none" stroke="var(--text)" strokeWidth="2" strokeDasharray="7 4" opacity=".6" />
      <path d={p.periph} fill="none" stroke="#c0392b" strokeWidth="6" strokeLinejoin="round" />
      <path d={p.seine} fill="none" stroke="var(--river)" strokeWidth="9" strokeLinecap="round" strokeLinejoin="round" />
      <path d={p.cite} fill="var(--land)" stroke="var(--river)" />
      <path d={p.axe} fill="none" stroke="#d7301f" strokeWidth="3" strokeDasharray="8 5" />
      {p.airports.map((a, i) => <g key={i}><text x={a.x} y={a.y} fontSize={22 * k} textAnchor="middle" style={{ stroke: "none" }}>✈</text><text x={a.x} y={a.y + 18 * k} fontSize={11 * k} textAnchor="middle">{a.name}</text></g>)}
      <text x="60" y="560" className="sea" fontSize={13 * k} style={{ stroke: "none" }}>Seine</text>
      {p.bois.map((b, i) => null)}
    </g>;
  }
  return null;
}

/**
 * Carte interactive.
 * mode : "explore" (survol = nom), "pick" (clic → onPick), "show" (statique)
 * marks : { id: "good" | "bad" | "sel" | "hl" | "dim" }
 * names : afficher les noms ; numbers : numéroter les points (objet id → n)
 * pickLayers : couches cliquables (par défaut : toutes)
 */
export default function MapView({ id, mode = "explore", marks = {}, onPick, names = false, numbers = null, pickLayers = null, theme: themeProp, only = null, height, toggles = {}, hideLegend = false, showCaption = true, extra = null, focusId = null, neutral = false, plain = false }) {
  const sc = SCENES[id];
  const data = M[sc.map] || {};
  const [tip, setTip] = useState(null);
  const [theme, setTheme] = useState(themeProp || (sc.themes ? sc.themes[0][0] : null));
  useEffect(() => { if (themeProp) setTheme(themeProp); }, [themeProp]);
  useEffect(() => { setTheme(themeProp || (sc.themes ? sc.themes[0][0] : null)); setTip(null); }, [id]);
  const [pxw, setPxw] = useState(800);
  useEffect(() => {
    if (!(svgRef.current || box.current) || typeof ResizeObserver === "undefined") return;
    const ro = new ResizeObserver(e => { const w = e[0].contentRect.width; if (w > 0) setPxw(w); });
    ro.observe(svgRef.current || box.current); return () => ro.disconnect();
  }, []);
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState([0, 0]);
  const drag = useRef(null);
  const box = useRef(null);
  const vbFull = (data.vb || "0 0 1000 600").split(" ").map(Number);
  const W = vbFull[2], H = vbFull[3];
  const vw = W / zoom, vh = H / zoom;
  const cx = Math.min(Math.max(pan[0], 0), W - vw), cy = Math.min(Math.max(pan[1], 0), H - vh);
  const vb = `${cx} ${cy} ${vw} ${vh}`;
  const k = vw / Math.max(200, pxw); // unités de la carte par pixel à l'écran
  const svgRef = useRef(null);
  // Zoom automatique sur un petit élément (cartes mémoire, exercices)
  useEffect(() => {
    if (!focusId || !svgRef.current) { setZoom(1); setPan([0, 0]); return; }
    const el = svgRef.current.querySelector(`[data-id="${focusId}"]`);
    if (!el || !el.getBBox || el.tagName.toLowerCase() !== "path") { setZoom(1); setPan([0, 0]); return; }
    const b = el.getBBox();
    const size = Math.max(b.width, b.height * W / H);
    if (size > W / 5) { setZoom(1); setPan([0, 0]); return; }
    const z = Math.min(3.5, Math.max(1, (W / 3.2) / Math.max(size, 1)));
    setZoom(z); setPan([b.x + b.width / 2 - W / z / 2, b.y + b.height / 2 - H / z / 2]);
  }, [focusId, id]);

  const zoomBy = f => {
    const nz = Math.min(4, Math.max(1, zoom * f));
    const ncx = cx + vw / 2 - W / nz / 2, ncy = cy + vh / 2 - H / nz / 2;
    setZoom(nz); setPan([ncx, ncy]);
  };
  const onDown = e => { if (zoom === 1) return; drag.current = { x: e.clientX, y: e.clientY, cx, cy, moved: false }; };
  const onMove = e => {
    if (!drag.current || !box.current) return;
    const r = box.current.getBoundingClientRect(); const s = vw / r.width;
    const dx = (e.clientX - drag.current.x) * s, dy = (e.clientY - drag.current.y) * s;
    if (Math.abs(dx) + Math.abs(dy) > 3) drag.current.moved = true;
    setPan([drag.current.cx - dx, drag.current.cy - dy]);
  };
  const onUp = () => { setTimeout(() => { drag.current = null; }, 0); };

  const canPick = layer => mode === "pick" && !layer.passive && (!pickLayers || pickLayers.includes(layer.key));
  const showTip = (e, f) => {
    if (mode === "pick" && !names) return; // pas d'indice pendant un exercice
    if (!box.current) return;
    const r = box.current.getBoundingClientRect();
    setTip({ x: e.clientX - r.left + 12, y: e.clientY - r.top + 10, t: f.name });
  };
  const handle = (layer, f) => {
    const interactive = !layer.passive && f.name;
    if (!interactive) return {};
    return {
      onMouseMove: e => showTip(e, f), onMouseLeave: () => setTip(null),
      onClick: e => {
        if (drag.current && drag.current.moved) return;
        if (canPick(layer) && onPick) onPick({ id: f.id, name: f.name, group: f.group, layer: layer.key });
        else if (mode === "explore" && box.current) { const r = box.current.getBoundingClientRect(); setTip({ x: e.clientX - r.left + 12, y: e.clientY - r.top + 10, t: f.name }); }
      },
      onKeyDown: e => { if ((e.key === "Enter" || e.key === " ") && canPick(layer) && onPick) { e.preventDefault(); onPick({ id: f.id, name: f.name, group: f.group, layer: layer.key }); } },
      tabIndex: canPick(layer) ? 0 : undefined, role: canPick(layer) ? "button" : undefined, "aria-label": canPick(layer) ? (numbers && numbers[f.id] ? "Élément " + numbers[f.id] : "Zone de la carte") : f.name,
    };
  };
  const markCls = (f) => {
    const m = marks[f.id];
    const anyHl = Object.values(marks).includes("hl");
    let c = "it";
    if (m === "good") c += " good"; else if (m === "bad") c += " bad"; else if (m === "sel") c += " sel"; else if (m === "hl") c += " sel flash";
    else if (m === "dim" || (anyHl && !m)) c += " dim";
    return c;
  };
  const visible = l => (!l.toggle || toggles[l.toggle]) && (!l.theme || l.theme === theme) && (!only || only.includes(l.key));

  const layers = sc.layers.filter(visible);
  const under = layers.filter(l => l.under), over = layers.filter(l => !l.under);

  const renderLayer = (l) => {
    if (l.type === "raw") return <path key={l.key} d={l.d} className={l.cls} />;
    if (l.type === "bubbles") return <g key={l.key}>{l.data.map(b => <circle key={b.id} cx={b.x} cy={b.y} r={Math.sqrt(b.n) * 1.3 * k} fill="rgba(192,57,43,.42)" stroke="#a93226" strokeWidth=".8" vectorEffect="non-scaling-stroke" />)}</g>;
    if (l.type === "area") return <g key={l.key}>{l.data.map((f, i) => {
      const op = val(l.opacity, f, i);
      return <path key={f.id || i} data-id={f.id} d={f.d} fill={plain && !l.passive ? "#c3c9cf" : val(l.fill, f, i)} fillOpacity={plain ? 1 : op} stroke={val(l.stroke, f, i) || "none"} strokeWidth={(val(l.width, f, i) || .8)} vectorEffect="non-scaling-stroke"
        strokeDasharray={val(l.dash, f, i) || undefined} className={l.passive ? undefined : markCls(f)} {...handle(l, f)} />;
    })}</g>;
    if (l.type === "line") return <g key={l.key}>{l.data.map((f, i) => <g key={f.id || i} data-id={f.id} {...handle(l, f)}>
      <path d={f.d} fill="none" stroke={val(l.stroke, f, i)} strokeWidth={(val(l.width, f, i) || 1.5)} vectorEffect="non-scaling-stroke" strokeDasharray={val(l.dash, f, i) || undefined} strokeLinecap="round" strokeLinejoin="round" className={l.passive ? undefined : markCls(f)} />
      {!l.passive && <path d={f.d} className="hit" style={{ strokeWidth: 14 }} vectorEffect="non-scaling-stroke" />}
    </g>)}</g>;
    if (l.type === "point") return <g key={l.key}>{l.data.map((f, i) => {
      const r = (val(l.r, f, i) || 5) * k;
      return <g key={f.id || i} data-id={f.id} {...handle(l, f)}>
        <Shape shape={val(l.shape, f, i) || "circle"} x={f.x} y={f.y} r={r} fill={(neutral && l.cat) || plain ? "#8c99a6" : val(l.color, f, i)} stroke={l.stroke || "#fff"} cls={l.passive ? undefined : markCls(f)} />
        {marks[f.id] === "hl" && <circle cx={f.x} cy={f.y} r={r + 7 * k} fill="none" stroke="var(--neg)" strokeWidth="3" vectorEffect="non-scaling-stroke" className="flash" />}
        {!l.passive && <circle cx={f.x} cy={f.y} r={r + 6 * k} className="hitpt" />}
      </g>;
    })}</g>;
    return null;
  };

  // étiquettes (noms ou numéros)
  const labelEls = [];
  if (names || numbers) {
    layers.forEach(l => {
      if (l.type === "point") (l.data || []).forEach(f => {
        const n = numbers ? numbers[f.id] : null;
        const t = numbers ? n : (names === true || (Array.isArray(names) && names.includes(l.key))) ? f.name : null;
        if (t == null || t === "") return;
        const left = LEFT.has(f.id), above = ABOVE.has(f.id);
        const rr = (val(l.r, f) || 5) * k;
        const dx = numbers ? 0 : left ? -rr - 4 * k : rr + 4 * k, dy = numbers ? -rr - 4 * k : above ? -rr - 3 * k : 4.5 * k;
        labelEls.push(<text key={"l" + l.key + f.id} x={f.x + dx} y={f.y + dy} fontSize={(numbers ? 15 : 12.5) * k} fontWeight={numbers ? 700 : 400} textAnchor={numbers ? "middle" : left ? "end" : "start"} style={{ pointerEvents: "none" }}>{t}</text>);
      });
      if ((l.type === "area" || l.type === "line") && !l.passive) (l.data || []).forEach(f => {
        const n = numbers ? numbers[f.id] : null;
        const t = numbers ? n : (names === true || (Array.isArray(names) && names.includes(l.key))) ? f.name : null;
        if (t == null || t === "" || f.lx == null) return;
        labelEls.push(<text key={"l" + l.key + f.id} x={f.lx} y={f.ly} fontSize={(numbers ? 16 : 12.5) * k} fontWeight={numbers ? 700 : 600} textAnchor="middle" style={{ pointerEvents: "none" }}>{t}</text>);
      });
    });
  }

  const legend = sc.legends ? sc.legends[theme] : sc.legend;
  return (
    <div className="mapbox">
      {(sc.themes || mode !== "show") && (
        <div className="row between noprint" style={{ padding: ".35rem .5rem", borderBottom: "1px solid var(--border-soft)", background: "var(--alt)" }}>
          <div className="row">
            {sc.themes && !themeProp && sc.themes.map(([t, lab]) => <button key={t} className={"btn small" + (theme === t ? " on" : "")} onClick={() => setTheme(t)} aria-pressed={theme === t}>{lab}</button>)}
          </div>
          <div className="row">
            <button className="btn small" onClick={() => zoomBy(1 / 1.5)} disabled={zoom <= 1} aria-label="Dézoomer">−</button>
            <button className="btn small" onClick={() => zoomBy(1.5)} disabled={zoom >= 4} aria-label="Zoomer">+</button>
            {zoom > 1 && <button className="btn small" onClick={() => { setZoom(1); setPan([0, 0]); }}>Vue entière</button>}
          </div>
        </div>
      )}
      <div ref={box} style={{ position: "relative" }} onPointerDown={onDown} onPointerMove={onMove} onPointerUp={onUp} onPointerLeave={onUp}>
        <svg ref={svgRef} viewBox={vb} role="img" aria-label={sc.title} style={{ maxWidth: `calc(${height || "76vh"} * ${(W / H).toFixed(3)})`, margin: "0 auto", cursor: zoom > 1 ? "grab" : undefined }}>
          <defs>
            <pattern id="hatchBxl" width="8" height="8" patternUnits="userSpaceOnUse" patternTransform="rotate(45)"><rect width="8" height="8" fill="#f0e08a" /><rect width="4" height="8" fill="#a9d6a0" /></pattern>
          </defs>
          <BaseUnder base={sc.base} />
          {under.map(renderLayer)}
          {sc.base === "afrique" && <AfricaLayer mode={mode} marks={marks} onPick={onPick} markCls={markCls} showTip={showTip} setTip={setTip} k={k} />}
          {over.map(renderLayer)}
          <BaseOver base={sc.base} sc={sc} k={k} />
          {labelEls}
          {extra}
        </svg>
        {tip && <div className="maptip" style={{ left: tip.x, top: tip.y }}>{tip.t}</div>}
      </div>
      {!hideLegend && !neutral && !plain && <Legend items={legend} />}
      {showCaption && <div className="mapcap">{sc.caption}</div>}
    </div>
  );
}

function AfricaLayer({ mode, marks, onPick, markCls, showTip, setTip, k }) {
  const a = M.afrique;
  return <g>
    {a.countries.map(c => <path key={c.id} data-id={c.id} d={c.d} className={c.afr ? markCls(c) : undefined} fill={c.iso === "COD" ? "#e67e22" : c.afr ? "var(--land)" : "var(--neigh)"} stroke="var(--land-line)" strokeWidth=".6"
      onMouseMove={c.afr ? e => showTip(e, c) : undefined} onMouseLeave={() => setTip(null)}
      onClick={c.afr && mode === "pick" && onPick ? () => onPick({ id: c.id, name: c.name, layer: "pays" }) : undefined} />)}
    {a.lakes.map(l => <path key={l.id} d={l.d} className="lake" />)}
    {a.lines.map(l => <path key={l.id} d={l.d} fill="none" stroke={l.id === "equateur" ? "#c0392b" : l.id === "greenwich" ? "var(--text)" : "#e67e22"} strokeWidth="1.3" strokeDasharray={l.id === "equateur" ? null : "6 4"} />)}
    {a.labels.map((l, i) => <text key={i} x={l.x} y={l.y} className="sea" fontSize={(l.cls === "sea_s" ? 10.5 : 12.5) * k} textAnchor="middle">{l.t}</text>)}
    {a.points.map(p => <g key={p.id}><circle cx={p.x} cy={p.y} r={4 * k} fill="#232629" stroke="#fff" /><text x={p.x + 7 * k} y={p.y + 4 * k} fontSize={12 * k}>{p.name}</text></g>)}
  </g>;
}
