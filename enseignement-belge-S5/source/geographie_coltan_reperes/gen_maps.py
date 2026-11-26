#!/usr/bin/env python3
"""Génère les cartes SVG (données Natural Earth, domaine public) pour l'application
Géographie S5. Sortie : maps.json (chemins SVG déjà projetés)."""
import json, math, sys
from shapely.geometry import shape, Polygon, MultiPolygon, LineString, MultiLineString, box, Point, mapping
from shapely.ops import unary_union, transform
from shapely import segmentize, voronoi_polygons, MultiPoint

G = "/home/claude/work/geo/"
def load(n): return json.load(open(G + n + ".geojson"))

# ---------- projections ----------
def equal_earth(lon, lat):
    A1, A2, A3, A4 = 1.340264, -0.081106, 0.000893, 0.003796
    M = math.sqrt(3) / 2
    p = math.asin(M * math.sin(math.radians(lat)))
    p2 = p * p; p6 = p2 * p2 * p2
    x = math.radians(lon) * math.cos(p) / (M * (A1 + 3 * A2 * p2 + p6 * (7 * A3 + 9 * A4 * p2)))
    y = p * (A1 + A2 * p2 + p6 * (A3 + A4 * p2))
    return x, y

def laea(lon0, lat0):
    l0, p0 = math.radians(lon0), math.radians(lat0)
    def f(lon, lat):
        l, p = math.radians(lon), math.radians(lat)
        k = math.sqrt(2 / (1 + math.sin(p0) * math.sin(p) + math.cos(p0) * math.cos(p) * math.cos(l - l0)))
        x = k * math.cos(p) * math.sin(l - l0)
        y = k * (math.cos(p0) * math.sin(p) - math.sin(p0) * math.cos(p) * math.cos(l - l0))
        return x, y
    return f

def equirect(lat0):
    c = math.cos(math.radians(lat0))
    return lambda lon, lat: (math.radians(lon) * c, math.radians(lat))

class Frame:
    """projection + mise à l'échelle vers un viewBox (y vers le bas)."""
    def __init__(self, proj, bounds_ll=None, width=1000, pad=0, xy_bounds=None, densify=1.0):
        self.proj = proj; self.W = width; self.densify = densify
        if xy_bounds is None:
            lo0, la0, lo1, la1 = bounds_ll
            pts = [proj(lo0 + (lo1 - lo0) * i / 40, la0 + (la1 - la0) * j / 40) for i in range(41) for j in range(41)]
            xs = [p[0] for p in pts]; ys = [p[1] for p in pts]
            xy_bounds = (min(xs), min(ys), max(xs), max(ys))
        x0, y0, x1, y1 = xy_bounds
        self.s = (width - 2 * pad) / (x1 - x0)
        self.x0, self.y1, self.pad = x0, y1, pad
        self.H = round((y1 - y0) * self.s + 2 * pad)
    def xy(self, lon, lat):
        x, y = self.proj(lon, lat)
        return ((x - self.x0) * self.s + self.pad, (self.y1 - y) * self.s + self.pad)
    def geom(self, g):
        if self.densify: g = segmentize(g, self.densify)
        return transform(lambda xs, ys, zs=None: tuple(zip(*[self.xy(a, b) for a, b in zip(xs, ys)])), g)

def ring_d(coords, close=True):
    pts = [(round(x), round(y)) for x, y in coords]
    dd = []
    for p in pts:
        if not dd or p != dd[-1]: dd.append(p)
    if close and len(dd) > 1 and dd[0] == dd[-1]: dd = dd[:-1]
    if len(dd) < 2: return ""
    out = f"M{dd[0][0]} {dd[0][1]}l"
    rel = []
    for (x0, y0), (x1, y1) in zip(dd, dd[1:]):
        dx, dy = x1 - x0, y1 - y0
        rel.append(f"{dx}" + (f"{dy}" if dy < 0 else f" {dy}"))
    out += " ".join(rel).replace(" -", "-")
    return out + ("z" if close else "")

def path_d(g, tol=0.35, min_area=0.0):
    if g is None or g.is_empty: return ""
    g = g.simplify(tol, preserve_topology=True)
    parts = []
    def rec(h):
        if h.is_empty: return
        t = h.geom_type
        if t == "Polygon":
            if h.area < min_area: return
            parts.append(ring_d(h.exterior.coords))
            for i in h.interiors:
                if Polygon(i).area >= min_area: parts.append(ring_d(i.coords))
        elif t == "LineString": parts.append(ring_d(h.coords, close=False))
        elif t == "LinearRing": parts.append(ring_d(h.coords))
        else:
            for k in getattr(h, "geoms", []): rec(k)
    rec(g)
    return "".join(p for p in parts if p)

def ellipse_ll(lon, lat, rx, ry, n=48, rot=0):
    pts = []
    for i in range(n):
        a = 2 * math.pi * i / n
        x, y = rx * math.cos(a), ry * math.sin(a)
        r = math.radians(rot)
        pts.append((lon + x * math.cos(r) - y * math.sin(r), lat + x * math.sin(r) + y * math.cos(r)))
    return Polygon(pts)

def chaikin(pts, it=3):
    for _ in range(it):
        q = [pts[0]]
        for (x0, y0), (x1, y1) in zip(pts, pts[1:]):
            q += [(0.75 * x0 + 0.25 * x1, 0.75 * y0 + 0.25 * y1), (0.25 * x0 + 0.75 * x1, 0.25 * y0 + 0.75 * y1)]
        q.append(pts[-1]); pts = q
    return pts

def smooth(g, r):
    return g.buffer(r, quad_segs=6).buffer(-2 * r, quad_segs=6).buffer(r, quad_segs=6)

def clean(g):
    return g.buffer(0) if not g.is_valid else g

# ---------- données ----------
c110 = load("ne_110m_admin_0_countries")["features"]
c50 = load("ne_50m_admin_0_countries")["features"]
c10 = load("ne_10m_admin_0_countries")["features"]
adm1 = load("ne_10m_admin_1_states_provinces")["features"]
lakes50 = load("ne_50m_lakes")["features"]
lakes10 = load("ne_10m_lakes")["features"]
riv10 = load("ne_10m_rivers_lake_centerlines")["features"]
riv50 = load("ne_50m_rivers_lake_centerlines")["features"]
regs = load("ne_50m_geography_regions_polys")["features"]
regs10 = load("ne_10m_geography_regions_polys")["features"]

def P(f, k): return f["properties"].get(k)
def iso(f):
    a = P(f, "ADM0_A3") or P(f, "adm0_a3")
    return a
def reg(name, src=regs):
    gs = [shape(f["geometry"]) for f in src if P(f, "NAME") == name]
    return clean(unary_union(gs)) if gs else None
def lake(name, src=lakes10):
    gs = [shape(f["geometry"]) for f in src if (P(f, "name") or "") == name]
    return unary_union(gs) if gs else None
def rivers(names, src=riv10, clip=None):
    gs = [shape(f["geometry"]) for f in src if (P(f, "name") in names or P(f, "name_en") in names)]
    g = unary_union(gs) if gs else None
    if g is not None and clip is not None: g = g.intersection(clip)
    return g

OUT = {}
def fr_name(f):
    return P(f, "NAME_FR") or P(f, "NAME")

# =====================================================================
# 1) MONDE
# =====================================================================
W = Frame(equal_earth, xy_bounds=None, bounds_ll=(-180, -90, 180, 90), width=1000, pad=4, densify=1.0)
world_land = clean(unary_union([shape(f["geometry"]) for f in c110]))
caspian = lake("Caspian Sea", lakes50)

CONT = {"Europe": "europe", "Asia": "asie", "Africa": "afrique", "North America": "amerique",
        "South America": "amerique", "Oceania": "oceanie", "Antarctica": "antarctique"}
cont_geoms = {k: [] for k in set(CONT.values())}
for f in c110:
    g = shape(f["geometry"]); c = P(f, "CONTINENT"); a = iso(f)
    if a == "RUS":
        cont_geoms["europe"].append(g.intersection(box(-180, -90, 60, 90)))
        cont_geoms["asie"].append(g.difference(box(-180, -90, 60, 90)))
        continue
    if a in ("KAZ", "TUR", "GEO", "ARM", "AZE", "CYP"): cont_geoms["asie"].append(g); continue
    if a == "FRA":
        cont_geoms["amerique"].append(g.intersection(box(-70, 0, -40, 15)))
        cont_geoms["europe"].append(g.difference(box(-70, 0, -40, 15))); continue
    if c in CONT: cont_geoms[CONT[c]].append(g)
    elif c == "Seven seas (open ocean)": cont_geoms["afrique"].append(g) if P(f, "NAME") == "Fr. S. Antarctic Lands" else None

CONT_NAMES = {"amerique": "Amérique", "europe": "Europe", "afrique": "Afrique", "asie": "Asie", "oceanie": "Océanie", "antarctique": "Antarctique"}
world_borders = []
for f in c110:
    g = shape(f["geometry"])
    world_borders.append(g.boundary)
borders = unary_union(world_borders)
# frontières intérieures uniquement (pas les côtes)
coast = world_land.boundary
inner = borders.difference(coast.buffer(0.05))

sphere = Polygon([(-180, -90), (180, -90), (180, 90), (-180, 90)])
def graticule_line(lat=None, lon=None):
    if lat is not None: return LineString([(x, lat) for x in range(-180, 181, 2)])
    return LineString([(lon, y) for y in range(-90, 91, 2)])

def world_common():
    return {"base": "world"}
def world_base():
    return {
        "sphere": path_d(W.geom(sphere), 0.2),
        "land": path_d(W.geom(world_land), 0.6, 0.5),
        "borders": path_d(W.geom(inner), 0.4),
        "caspian": path_d(W.geom(caspian), 0.4) if caspian else "",
        "grat": path_d(W.geom(MultiLineString([graticule_line(lat=l) for l in (-60, -30, 30, 60)] + [graticule_line(lon=l) for l in range(-150, 181, 30)])), 0.3),
    }

LINES = [
    ("equateur", "Équateur (0°)", graticule_line(lat=0)),
    ("tropique_cancer", "Tropique du Cancer (23° N)", graticule_line(lat=23.44)),
    ("tropique_capricorne", "Tropique du Capricorne (23° S)", graticule_line(lat=-23.44)),
    ("cercle_arctique", "Cercle polaire arctique (66° N)", graticule_line(lat=66.56)),
    ("cercle_antarctique", "Cercle polaire antarctique (66° S)", graticule_line(lat=-66.56)),
    ("greenwich", "Méridien de Greenwich (0°)", graticule_line(lon=0)),
]

# océans (5 océans, limites conventionnelles simplifiées)
band = box(-180, -60, 180, 66.56)
land_and_lakes = world_land.union(caspian) if caspian else world_land
atl = Polygon([(-67, -60), (20, -60), (20, -30), (27, -25), (33, 30), (48, 47), (40, 66.56), (-95, 66.56),
               (-95, 50), (-100, 30), (-92, 17), (-84, 11), (-79.5, 8.8), (-76, 0), (-72, -20), (-70, -45), (-68.5, -55)])
ind = Polygon([(20, -60), (147, -60), (147, -43), (146, -38), (135, -25), (131, -11.5), (124, -9.5), (115, -8.5),
               (105.5, -6), (101, -1), (100.3, 4), (100.5, 13), (97, 20), (75, 35), (55, 40), (48, 47), (33, 30), (27, -25), (20, -30)])
oceans = {
    "ocean_arctique": ("Océan Arctique", box(-180, 66.56, 180, 90).difference(land_and_lakes)),
    "ocean_antarctique": ("Océan Antarctique (Austral)", box(-180, -90, 180, -60).difference(land_and_lakes)),
    "ocean_atlantique": ("Océan Atlantique", atl.intersection(band).difference(land_and_lakes)),
    "ocean_indien": ("Océan Indien", ind.intersection(band).difference(land_and_lakes)),
}
pac = band.difference(land_and_lakes).difference(atl).difference(ind)
oceans["ocean_pacifique"] = ("Océan Pacifique", pac)

OUT["world_base"] = world_base()
m = world_common()
m["features"] = [{"id": k, "name": CONT_NAMES[k], "group": "continent",
                  "d": path_d(W.geom(clean(unary_union(v))), 0.4, 0.3)} for k, v in cont_geoms.items()]
m["oceans"] = [{"id": k, "name": n, "group": "ocean", "d": path_d(W.geom(g), 0.5, 0.5)} for k, (n, g) in oceans.items()]
m["lines"] = [{"id": i, "name": n, "group": "ligne", "d": path_d(W.geom(g), 0.3)} for i, n, g in LINES]
poles = [("pole_nord", "Pôle Nord (90° N)", 0, 89.9), ("pole_sud", "Pôle Sud (90° S)", 0, -89.9)]
m["points"] = [{"id": i, "name": n, "group": "pole", "x": round(W.xy(lo, la)[0], 1), "y": round(W.xy(lo, la)[1], 1)} for i, n, lo, la in poles]
hem = [("hem_nord", "Hémisphère Nord", 0, 45), ("hem_sud", "Hémisphère Sud", 0, -45)]
m["hemis"] = [{"id": i, "name": n, "group": "hemisphere",
               "d": path_d(W.geom(box(-180, 0, 180, 90) if i == "hem_nord" else box(-180, -90, 180, 0)), 0.3)} for i, n, lo, la in hem]
m["vb"] = f"0 0 {W.W} {W.H}"
OUT["monde"] = m

# ---- monde : foyers et vides de population ----
def land_clip(g): return clean(g).intersection(world_land)
north60 = box(-180, 60, 180, 84).intersection(world_land)
pop_full = [
    ("asie_est", "Asie de l’Est (Chine)", ellipse_ll(115, 32, 11, 9, rot=20)),
    ("asie_sud", "Asie du Sud (Inde, Pakistan)", unary_union([ellipse_ll(80, 26, 11, 5, rot=-15), ellipse_ll(78, 15, 4, 6), ellipse_ll(72, 30, 3, 3)])),
    ("indonesie", "Indonésie (Java)", unary_union([ellipse_ll(110, -7.3, 5.5, 1.4), ellipse_ll(101, 0, 3, 2.5, rot=-40)])),
    ("europe_ouest", "Europe occidentale et centrale", ellipse_ll(8, 49, 11, 5.5, rot=8)),
    ("afrique_est", "Afrique de l’Est : région des Grands Lacs", ellipse_ll(31, -1, 4.5, 4.5)),
    ("afrique_ouest", "Afrique de l’Ouest : golfe de Guinée", ellipse_ll(4, 8, 8, 3, rot=-5)),
    ("usa_nord_est", "Nord-Est des États-Unis", ellipse_ll(-76, 40.5, 6, 3, rot=30)),
]
empty = [
    ("grand_nord", "Le Grand Nord (au nord du 60e parallèle)", north60),
    ("antarctique_v", "Antarctique", reg("ANTARCTICA")),
    ("sahara", "Sahara", reg("SAHARA")),
    ("amazonie", "Amazonie", reg("AMAZON BASIN")),
    ("gobi", "Désert de Gobi", reg("GOBI DESERT")),
    ("himalaya", "Himalaya", unary_union([reg("HIMALAYAS"), reg("PLATEAU OF TIBET")])),
    ("australie_v", "Désert australien (Outback)", unary_union([reg("GREAT VICTORIA DESERT"), reg("GREAT SANDY DESERT"), ellipse_ll(132, -25, 9, 6)])),
    ("rocheuses", "Rocheuses et Ouest américain", unary_union([reg("ROCKY MOUNTAINS"), reg("GREAT BASIN"), reg("COLORADO PLATEAU")])),
    ("congo_foret", "Forêt équatoriale du bassin du Congo", reg("CONGO BASIN")),
    ("andes", "Les Andes – Patagonie", unary_union([reg("ANDES"), reg("PATAGONIA")])),
    ("arabie", "Péninsule arabique", reg("RUB’ AL KHALI").union(ellipse_ll(47, 22, 7, 6))),
    ("borneo", "Bornéo (forêts d’Asie du Sud-Est)", reg("BORNEO")),
]
mp = world_common()
mp["features"] = ([{"id": i, "name": n, "group": "peuple", "d": path_d(W.geom(land_clip(g)), 0.4, 0.2)} for i, n, g in pop_full] +
                  [{"id": i, "name": n, "group": "vide", "d": path_d(W.geom(land_clip(g)), 0.4, 0.2)} for i, n, g in empty])
mp["vb"] = f"0 0 {W.W} {W.H}"
OUT["monde_pop"] = mp

# ---- monde : zonage climatique (bandes) + exemples ----
mc = world_common()
zones = [
    ("z_froid_n", "Zone froide (polaire)", box(-180, 66.56, 180, 90)),
    ("z_tempere_n", "Zone tempérée", box(-180, 30, 180, 66.56)),
    ("z_chaud", "Zone chaude (intertropicale)", box(-180, -30, 180, 30)),
    ("z_tempere_s", "Zone tempérée", box(-180, -66.56, 180, -30)),
    ("z_froid_s", "Zone froide (polaire)", box(-180, -90, 180, -66.56)),
]
mc["features"] = [{"id": i, "name": n, "group": "zone", "d": path_d(W.geom(g.intersection(world_land)), 0.4, 0.2)} for i, n, g in zones]
mc["lines"] = [{"id": i, "name": n, "group": "ligne", "d": path_d(W.geom(g), 0.3)} for i, n, g in LINES if i != "greenwich"]
CLIM_PTS = [
    ("c_equatorial_1", "Bassin du Congo", 22, 0, "equatorial"), ("c_equatorial_2", "Amazonie", -62, -4, "equatorial"), ("c_equatorial_3", "Indonésie", 113, 0, "equatorial"),
    ("c_tropical_1", "Sahel (Mali)", -2, 14, "tropical"), ("c_tropical_2", "Inde", 78, 20, "tropical"), ("c_tropical_3", "Brésil (centre)", -48, -15, "tropical"),
    ("c_desert_1", "Sahara", 10, 24, "desertique"), ("c_desert_2", "Péninsule arabique", 47, 22, "desertique"), ("c_desert_3", "Australie (centre)", 133, -24, "desertique"),
    ("c_medit_1", "Bassin méditerranéen", 14, 38, "mediterraneen"), ("c_medit_2", "Californie", -120, 36, "mediterraneen"), ("c_medit_3", "Chili (centre)", -71, -34, "mediterraneen"),
    ("c_ocean_1", "Europe de l’Ouest (Belgique)", 2, 50, "oceanique"), ("c_ocean_2", "Nouvelle-Zélande", 172, -42, "oceanique"),
    ("c_conti_1", "Russie", 50, 56, "continental"), ("c_conti_2", "Canada (centre)", -100, 52, "continental"), ("c_conti_3", "Chine du Nord-Est", 125, 45, "continental"),
    ("c_montagne_1", "Himalaya", 85, 30, "montagnard"), ("c_montagne_2", "Andes", -70, -18, "montagnard"), ("c_montagne_3", "Alpes", 10, 46.5, "montagnard"),
    ("c_polaire_1", "Groenland", -40, 74, "polaire"), ("c_polaire_2", "Antarctique", 30, -80, "polaire"),
]
mc["points"] = [{"id": i, "name": n, "group": g, "x": round(W.xy(lo, la)[0], 1), "y": round(W.xy(lo, la)[1], 1)} for i, n, lo, la, g in CLIM_PTS]
mc["vb"] = f"0 0 {W.W} {W.H}"
OUT["monde_climats"] = mc

mb = world_common()
BIO_PTS = [
    ("b_fth_1", "Amazonie", -62, -4, "foret_tropicale"), ("b_fth_2", "Bassin du Congo", 22, 0, "foret_tropicale"), ("b_fth_3", "Bornéo", 114, 1, "foret_tropicale"),
    ("b_sav_1", "Afrique de l’Est (Kenya, Tanzanie)", 35, -4, "savane"), ("b_sav_2", "Sahel", 5, 13, "savane"), ("b_sav_3", "Brésil (centre)", -48, -15, "savane"),
    ("b_des_1", "Sahara", 10, 24, "desert"), ("b_des_2", "Australie (centre)", 133, -24, "desert"), ("b_des_3", "Gobi", 105, 43, "desert"),
    ("b_ftemp_1", "Europe de l’Ouest", 6, 49, "foret_temperee"), ("b_ftemp_2", "Est des États-Unis", -82, 38, "foret_temperee"), ("b_ftemp_3", "Chine de l’Est", 115, 30, "foret_temperee"),
    ("b_taiga_1", "Sibérie", 100, 60, "taiga"), ("b_taiga_2", "Canada", -100, 55, "taiga"), ("b_taiga_3", "Finlande", 27, 64, "taiga"),
    ("b_toundra_1", "Nord du Canada", -100, 68, "toundra"), ("b_toundra_2", "Nord de la Sibérie", 120, 71, "toundra"),
    ("b_prairie_1", "Grandes Plaines (États-Unis)", -100, 42, "prairie"), ("b_prairie_2", "Steppes d’Asie centrale", 68, 48, "prairie"), ("b_prairie_3", "Pampa (Argentine)", -62, -35, "prairie"),
    ("b_glace_1", "Groenland", -40, 74, "glace"), ("b_glace_2", "Antarctique", 30, -80, "glace"),
]
mb["points"] = [{"id": i, "name": n, "group": g, "x": round(W.xy(lo, la)[0], 1), "y": round(W.xy(lo, la)[1], 1)} for i, n, lo, la, g in BIO_PTS]
mb["lines"] = [{"id": i, "name": n, "group": "ligne", "d": path_d(W.geom(g), 0.3)} for i, n, g in LINES if i != "greenwich"]
mb["vb"] = f"0 0 {W.W} {W.H}"
OUT["monde_biomes"] = mb

# =====================================================================
# 2) EUROPE
# =====================================================================
E = Frame(laea(12, 52), xy_bounds=None, bounds_ll=None, width=1000, pad=0, densify=0.5) if False else None
proj_e = laea(12, 52)
# cadre en coordonnées projetées
ex0, ey0 = proj_e(-24, 36)[0], proj_e(0, 33.5)[1]
ex1, ey1 = proj_e(50, 36)[0], proj_e(12, 71.5)[1]
E = Frame(proj_e, xy_bounds=(proj_e(-12, 50)[0] - 0.12, proj_e(12, 34)[1], proj_e(52, 50)[0] + 0.1, proj_e(12, 71.5)[1]), width=1000, pad=0, densify=0.5)
ebox_ll = box(-35, 26, 75, 80)
frame_poly = box(0, 0, E.W, E.H)
def eu_geom(g): return E.geom(clean(g).intersection(ebox_ll)).intersection(frame_poly)

EU27 = ["AUT", "BEL", "BGR", "HRV", "CYP", "CZE", "DNK", "EST", "FIN", "FRA", "DEU", "GRC", "HUN", "IRL", "ITA", "LVA", "LTU", "LUX", "MLT", "NLD", "POL", "PRT", "ROU", "SVK", "SVN", "ESP", "SWE"]
CANDIDATS = ["TUR", "MNE", "SRB", "ALB", "MKD", "UKR", "MDA", "BIH"]
CAND_RECONNU = ["GEO"]
CAND_POT = ["KOS"]
ANCIEN = ["GBR"]
NAMES_FIX = {"KOS": "Kosovo", "MKD": "Macédoine du Nord", "BIH": "Bosnie-Herzégovine", "CZE": "Tchéquie", "GBR": "Royaume-Uni",
             "NLD": "Pays-Bas", "MDA": "Moldavie", "RUS": "Russie", "BLR": "Biélorussie", "CYN": "Chypre du Nord"}
eu_countries = []
eu_land = []
for f in c50:
    a = iso(f); g = shape(f["geometry"])
    if not g.intersects(ebox_ll): continue
    eu_land.append(g)
    gg = eu_geom(g)
    if gg.is_empty or gg.area < 1: continue
    st = "ue" if a in EU27 else "candidat" if a in CANDIDATS else "candidat_reconnu" if a in CAND_RECONNU else "candidat_potentiel" if a in CAND_POT else "ancien" if a in ANCIEN else "hors"
    eu_countries.append({"id": "pays_" + a.lower(), "iso": a, "name": NAMES_FIX.get(a, fr_name(f)), "group": st, "d": path_d(gg, 0.45, 2)})
eland = unary_union(eu_land)
seas_pts = [("Océan Atlantique", -16, 47), ("Mer du Nord", 3.5, 56), ("Manche", -2.5, 50.0), ("Mer Baltique", 19.5, 57.5),
            ("Mer Méditerranée", 17, 35.5), ("Mer Noire", 34, 43.3), ("Mer Caspienne", 51, 43.5), ("Océan Arctique", 18, 71)]
base_e = {"sea": f"M0,0H{E.W}V{E.H}H0Z", "vb": f"0 0 {E.W} {E.H}"}
me = dict(base_e); me["features"] = eu_countries
me["labels"] = [{"t": n, "x": round(E.xy(lo, la)[0], 1), "y": round(E.xy(lo, la)[1], 1), "cls": "sea"} for n, lo, la in seas_pts]
OUT["europe_ue"] = me

# villes européennes
EU_CITIES = [("londres", "Londres", -0.13, 51.5, "top15"), ("paris", "Paris", 2.35, 48.86, "top15"), ("moscou", "Moscou", 37.62, 55.75, "top15"),
             ("madrid", "Madrid", -3.7, 40.42, "top15"), ("barcelone", "Barcelone", 2.17, 41.39, "top15"), ("milan", "Milan", 9.19, 45.46, "top15"),
             ("berlin", "Berlin", 13.4, 52.52, "top15"), ("saint_petersbourg", "Saint-Pétersbourg", 30.31, 59.94, "top15"), ("rome", "Rome", 12.5, 41.9, "top15"),
             ("naples", "Naples", 14.27, 40.85, "top15"), ("athenes", "Athènes", 23.73, 37.98, "top15"), ("kiev", "Kiev (Kyiv)", 30.52, 50.45, "top15"),
             ("lisbonne", "Lisbonne", -9.14, 38.72, "top15"), ("manchester", "Manchester", -2.24, 53.48, "top15"), ("birmingham", "Birmingham (West Midlands)", -1.9, 52.49, "top15"),
             ("lille", "Lille", 3.06, 50.63, "peri"), ("maastricht", "Maastricht", 5.69, 50.85, "peri"), ("aix", "Aix-la-Chapelle", 6.08, 50.78, "peri"), ("luxembourg_v", "Luxembourg", 6.13, 49.61, "peri")]
OUT["europe_base"] = {"base": path_d(eu_geom(eland), 0.45, 2), "labels": me["labels"]}
mv = dict(base_e); mv["base_ref"] = "europe"
OUT["europe_base"]["borders"] = path_d(eu_geom(unary_union([shape(f["geometry"]).boundary for f in c50 if shape(f["geometry"]).intersects(ebox_ll)]).difference(eland.boundary.buffer(0.03))), 0.45)
mv["points"] = [{"id": i, "name": n, "group": g, "x": round(E.xy(lo, la)[0], 1), "y": round(E.xy(lo, la)[1], 1)} for i, n, lo, la, g in EU_CITIES]
OUT["europe_villes"] = mv

# orohydrographie Europe
mo = dict(base_e)
mo["base_ref"] = "europe"
EU_MTS = [("alpes", "Alpes", reg("ALPS")), ("pyrenees", "Pyrénées", reg("PYRENEES")), ("carpates", "Carpates", unary_union([reg("CARPATHIAN MOUNTAINS"), reg("Transylvanian Alps", regs10)])),
          ("oural", "Oural", reg("URAL MOUNTAINS")), ("caucase", "Caucase", reg("CAUCASUS MTS.")), ("apennins", "Apennins", reg("APPENNINI")),
          ("dinariques", "Alpes dinariques", reg("Dinaric Alps", regs10)), ("balkans", "Balkans", reg("Balkan Mts.", regs10)),
          ("scandinave", "Massif scandinave", reg("KJØLEN MOUNTAINS")), ("massif_central", "Massif central", reg("Massif Central", regs10)),
          ("sierra_nevada", "Sierra Nevada", reg("S. Nevada", regs10))]
EU_PLAINS = [("plaine_nord", "Grande plaine d’Europe du Nord (germano-polonaise et russe)", reg("NORTHERN EUROPEAN PLAIN")), ("plaine_hongroise", "Plaine hongroise", reg("Alföld", regs10))]
mo["features"] = ([{"id": i, "name": n, "group": "plaine", "d": path_d(eu_geom(g.intersection(eland)), 0.5, 3)} for i, n, g in EU_PLAINS if g] +
                  [{"id": i, "name": n, "group": "montagne", "d": path_d(eu_geom(g), 0.5, 1)} for i, n, g in EU_MTS if g])
EU_RIV = [("rhin", "Rhin", ["Rhine", "Rhin"]), ("rhone", "Rhône", ["Rhône"]), ("danube", "Danube", ["Danube", "Donau"]), ("volga", "Volga", ["Volga"]),
          ("seine", "Seine", ["Seine"]), ("loire", "Loire", ["Loire"]), ("elbe", "Elbe", ["Elbe"]), ("oder", "Oder", ["Oder"]), ("vistule", "Vistule", ["Vistula"]),
          ("po", "Pô", ["Po"]), ("tage", "Tage", ["Tagus"]), ("ebre", "Èbre", ["Ebro"]), ("dniepr", "Dniepr", ["Dnieper"]), ("meuse_e", "Meuse", ["Maas"]), ("escaut_e", "Escaut", ["Schelde"]),
          ("tamise", "Tamise", ["Thames"]), ("garonne", "Garonne", ["Garonne"])]
mo["lines"] = []
for i, n, names in EU_RIV:
    g = rivers(names, riv10)
    if g is None: print("riv manquante", n, file=sys.stderr); continue
    d = path_d(eu_geom(g), 0.4)
    if d: mo["lines"].append({"id": i, "name": n, "group": "fleuve", "d": d})
mo["labels"] = [{"t": "Mer Adriatique", "x": round(E.xy(15.5, 43)[0], 1), "y": round(E.xy(15.5, 43)[1], 1), "cls": "sea"}]
OUT["europe_oro"] = mo

# climats / biomes Europe : points d'exemple
EU_CLIM = [("ec_ocean_1", "Brest / Bretagne", -4.5, 48.4, "oceanique"), ("ec_ocean_2", "Bruxelles", 4.35, 50.85, "oceanique"), ("ec_ocean_3", "Dublin", -6.26, 53.35, "oceanique"),
           ("ec_conti_1", "Varsovie", 21.0, 52.23, "continental"), ("ec_conti_2", "Moscou", 37.62, 55.75, "continental"), ("ec_conti_3", "Kiev", 30.52, 50.45, "continental"),
           ("ec_medit_1", "Athènes", 23.73, 37.98, "mediterraneen"), ("ec_medit_2", "Rome", 12.5, 41.9, "mediterraneen"), ("ec_medit_3", "Marseille", 5.37, 43.3, "mediterraneen"),
           ("ec_mont_1", "Alpes", 10, 46.5, "montagnard"), ("ec_mont_2", "Pyrénées", 0.5, 42.7, "montagnard"), ("ec_mont_3", "Carpates", 24.5, 47.5, "montagnard"),
           ("ec_tchaud_1", "Madrid (intérieur ibérique)", -3.7, 40.42, "tempere_chaud"), ("ec_tchaud_2", "Toulouse", 1.44, 43.6, "tempere_chaud"),
           ("ec_froid_1", "Laponie", 25, 68.5, "polaire")]
mcl = dict(base_e); mcl["base_ref"] = "europe"
mcl["points"] = [{"id": i, "name": n, "group": g, "x": round(E.xy(lo, la)[0], 1), "y": round(E.xy(lo, la)[1], 1)} for i, n, lo, la, g in EU_CLIM]
OUT["europe_climats"] = mcl
EU_BIO = [("eb_taiga_1", "Finlande", 27, 63, "taiga"), ("eb_taiga_2", "Nord de la Russie", 45, 62, "taiga"), ("eb_taiga_3", "Suède du Nord", 18, 64.5, "taiga"),
          ("eb_toundra_1", "Laponie (nord de la Norvège)", 25, 70, "toundra"), ("eb_toundra_2", "Islande (intérieur)", -18, 64.8, "toundra"),
          ("eb_ftemp_1", "Belgique (Ardenne)", 5.5, 50.1, "foret_temperee"), ("eb_ftemp_2", "Allemagne", 10, 51, "foret_temperee"), ("eb_ftemp_3", "Pologne", 19, 52, "foret_temperee"),
          ("eb_garr_1", "Provence (garrigue)", 5, 43.8, "garrigue"), ("eb_garr_2", "Sud de l’Espagne", -4, 37.5, "garrigue"),
          ("eb_maquis_1", "Corse (maquis)", 9.1, 42.1, "maquis"), ("eb_maquis_2", "Grèce", 22, 39, "maquis"),
          ("eb_steppe_1", "Sud de l’Ukraine (steppe)", 34, 47, "steppe")]
mbi = dict(mcl); mbi["points"] = [{"id": i, "name": n, "group": g, "x": round(E.xy(lo, la)[0], 1), "y": round(E.xy(lo, la)[1], 1)} for i, n, lo, la, g in EU_BIO]
OUT["europe_biomes"] = mbi

# =====================================================================
# 3) BELGIQUE
# =====================================================================
B = Frame(equirect(50.5), xy_bounds=None, bounds_ll=(2.35, 49.35, 6.55, 51.62), width=1000, pad=0, densify=0)
bframe = box(2.35, 49.35, 6.55, 51.62)
def bg(g): return B.geom(clean(g).intersection(bframe))
bel = [f for f in c10 if iso(f) == "BEL"][0]
bel_g = shape(bel["geometry"])
neigh = []
for f in c10:
    if iso(f) in ("FRA", "NLD", "DEU", "LUX"):
        neigh.append({"id": "n_" + iso(f).lower(), "name": NAMES_FIX.get(iso(f), fr_name(f)), "d": path_d(bg(shape(f["geometry"])), 0.4, 1)})
provs = [f for f in adm1 if P(f, "adm0_a3") == "BEL"]
PROV_FR = {"West Flanders": "Flandre-Occidentale", "East Flanders": "Flandre-Orientale", "Antwerp": "Anvers", "Limburg": "Limbourg", "Flemish Brabant": "Brabant flamand",
           "Walloon Brabant": "Brabant wallon", "Hainaut": "Hainaut", "Namur": "Namur", "Liege": "Liège", "Luxembourg": "Luxembourg", "Brussels": "Bruxelles-Capitale"}
prov_geoms = {PROV_FR[P(f, "name")]: shape(f["geometry"]) for f in provs}
flandre = unary_union([prov_geoms[k] for k in ("Flandre-Occidentale", "Flandre-Orientale", "Anvers", "Limbourg", "Brabant flamand")])
wallonie = unary_union([prov_geoms[k] for k in ("Brabant wallon", "Hainaut", "Namur", "Liège", "Luxembourg")])
bxl = prov_geoms["Bruxelles-Capitale"]
# Communauté germanophone : tracé simplifié (cantons d'Eupen et de Saint-Vith)
dg_n = Polygon([(5.95, 50.79), (6.13, 50.79), (6.45, 50.66), (6.45, 50.56), (6.17, 50.555), (6.06, 50.59), (5.99, 50.64), (5.96, 50.70)])
dg_s = Polygon([(6.16, 50.50), (6.45, 50.50), (6.45, 50.10), (6.06, 50.10), (6.02, 50.22), (6.10, 50.32), (6.16, 50.40)])
germ = unary_union([dg_n, dg_s]).intersection(prov_geoms["Liège"])
fr_comm = wallonie.difference(germ)
ling = flandre.boundary.intersection(wallonie.boundary.buffer(0.004))
mbel = {"vb": f"0 0 {B.W} {B.H}", "sea": f"M0,0H{B.W}V{B.H}H0Z", "neigh": neigh}
mbel["features"] = [{"id": "prov_" + k.lower().replace(" ", "_").replace("-", "_").replace("è", "e"), "name": ("Province de " if k not in ("Bruxelles-Capitale",) else "Région de ") + k,
                     "group": "province", "region": ("flandre" if g.within(flandre.buffer(0.001)) else "bruxelles" if k == "Bruxelles-Capitale" else "wallonie"),
                     "d": path_d(bg(g), 0.3, 0.5)} for k, g in prov_geoms.items()]
mbel["regions"] = [{"id": "reg_flandre", "name": "Région flamande", "d": path_d(bg(flandre), 0.3, 0.5)},
                   {"id": "reg_wallonie", "name": "Région wallonne", "d": path_d(bg(wallonie), 0.3, 0.5)},
                   {"id": "reg_bruxelles", "name": "Région de Bruxelles-Capitale", "d": path_d(bg(bxl), 0.3, 0.5)}]
mbel["communautes"] = [{"id": "com_flamande", "name": "Communauté flamande", "d": path_d(bg(unary_union([flandre, bxl])), 0.3, 0.5)},
                       {"id": "com_francaise", "name": "Communauté française (Fédération Wallonie-Bruxelles)", "d": path_d(bg(unary_union([fr_comm, bxl])), 0.3, 0.5)},
                       {"id": "com_germanophone", "name": "Communauté germanophone", "d": path_d(bg(germ), 0.3, 0.2)},
                       {"id": "com_bxl", "name": "Bruxelles : bilingue (les deux communautés)", "d": path_d(bg(bxl), 0.3, 0.2)}]
mbel["lines"] = [{"id": "frontiere_ling", "name": "Frontière linguistique", "group": "limite", "d": path_d(bg(ling), 0.3)}]
mbel["outline"] = path_d(bg(bel_g), 0.3, 0.5)
BE_CITIES = [("bruxelles", "Bruxelles", 4.35, 50.85, "top7"), ("anvers", "Anvers", 4.40, 51.22, "top7"), ("gand", "Gand", 3.72, 51.05, "top7"),
             ("charleroi", "Charleroi", 4.44, 50.41, "top7"), ("liege", "Liège", 5.57, 50.63, "top7"), ("bruges", "Bruges", 3.22, 51.21, "top7"), ("namur", "Namur", 4.87, 50.47, "top7"),
             ("mons", "Mons", 3.95, 50.45, "autre"), ("tournai", "Tournai", 3.39, 50.61, "autre"), ("louvain", "Louvain", 4.70, 50.88, "autre"), ("hasselt", "Hasselt", 5.34, 50.93, "autre"),
             ("arlon", "Arlon", 5.82, 49.68, "autre"), ("wavre", "Wavre", 4.61, 50.72, "autre"), ("eupen", "Eupen", 6.04, 50.63, "autre"), ("courtrai", "Courtrai", 3.27, 50.83, "autre"),
             ("ypres", "Ypres", 2.88, 50.85, "autre"), ("bastogne", "Bastogne", 5.72, 50.0, "autre")]
PERI = [("lille", "Lille", 3.06, 50.63, "peri"), ("maastricht", "Maastricht", 5.69, 50.85, "peri"), ("aix", "Aix-la-Chapelle", 6.08, 50.78, "peri"), ("luxembourg_v", "Luxembourg", 6.13, 49.61, "peri")]
def ptsB(L): return [{"id": i, "name": n, "group": g, "x": round(B.xy(lo, la)[0], 1), "y": round(B.xy(lo, la)[1], 1)} for i, n, lo, la, g in L]
mbel["points"] = ptsB(BE_CITIES)
mbel["labels"] = [{"t": "Mer du Nord", "x": round(B.xy(2.75, 51.45)[0]), "y": round(B.xy(2.75, 51.45)[1]), "cls": "sea"},
                  {"t": "FRANCE", "x": round(B.xy(3.3, 49.8)[0]), "y": round(B.xy(3.3, 49.8)[1]), "cls": "country"},
                  {"t": "PAYS-BAS", "x": round(B.xy(5.3, 51.5)[0]), "y": round(B.xy(5.3, 51.5)[1]), "cls": "country"},
                  {"t": "ALLEMAGNE", "x": round(B.xy(6.4, 50.95)[0]), "y": round(B.xy(6.4, 50.95)[1]), "cls": "country"},
                  {"t": "G.-D. DE LUXEMBOURG", "x": round(B.xy(6.1, 49.5)[0]), "y": round(B.xy(6.1, 49.5)[1]), "cls": "country"}]
OUT["belgique_base"] = {k: mbel.pop(k) for k in ("neigh", "outline", "labels")}
mbel["base_ref"] = "belgique"
OUT["belgique_admin"] = mbel

# rivières belges (tracés simplifiés, sauf Meuse et Escaut issus de Natural Earth)
BE_RIV = {
    "sambre": ("Sambre", [(3.80, 50.22), (3.97, 50.28), (4.10, 50.31), (4.29, 50.34), (4.44, 50.41), (4.60, 50.44), (4.75, 50.43), (4.87, 50.465)]),
    "lys": ("Lys", [(2.55, 50.62), (2.88, 50.69), (3.00, 50.77), (3.15, 50.79), (3.27, 50.83), (3.44, 50.92), (3.58, 50.99), (3.72, 51.05)]),
    "yser": ("Yser", [(2.40, 50.85), (2.62, 50.92), (2.75, 50.97), (2.86, 51.03), (2.80, 51.09), (2.75, 51.14)]),
    "dyle": ("Dyle", [(4.55, 50.58), (4.61, 50.72), (4.69, 50.86), (4.62, 50.96), (4.48, 51.03), (4.36, 51.08)]),
    "senne": ("Senne", [(4.07, 50.57), (4.24, 50.73), (4.35, 50.85), (4.43, 50.93), (4.45, 51.01), (4.45, 51.03)]),
    "dendre": ("Dendre", [(3.70, 50.58), (3.78, 50.63), (3.89, 50.74), (4.02, 50.83), (4.04, 50.94), (4.10, 51.03)]),
    "ourthe": ("Ourthe", [(5.75, 50.08), (5.58, 50.18), (5.53, 50.27), (5.46, 50.35), (5.53, 50.45), (5.57, 50.53), (5.58, 50.62)]),
    "vesdre": ("Vesdre", [(6.10, 50.61), (6.04, 50.63), (5.86, 50.59), (5.72, 50.58), (5.63, 50.58), (5.59, 50.61)]),
    "ambleve": ("Amblève", [(6.20, 50.42), (6.03, 50.40), (5.93, 50.39), (5.80, 50.43), (5.67, 50.47), (5.60, 50.49)]),
    "lesse": ("Lesse", [(5.32, 49.95), (5.30, 50.05), (5.22, 50.16), (5.05, 50.18), (4.91, 50.24)]),
    "semois": ("Semois", [(5.81, 49.68), (5.55, 49.70), (5.31, 49.70), (5.07, 49.79), (4.90, 49.82), (4.76, 49.85)]),
    "demer": ("Démer", [(5.55, 50.88), (5.34, 50.93), (5.05, 50.99), (4.84, 50.99), (4.70, 50.97)]),
}
meuse = rivers(["Maas"], riv10, clip=box(4.5, 49.3, 6.2, 51.75))
escaut = rivers(["Schelde"], riv10, clip=box(2.9, 50.0, 4.5, 51.6))
bel_riv = [{"id": "meuse", "name": "Meuse", "group": "riviere", "d": path_d(bg(meuse), 0.3)},
           {"id": "escaut", "name": "Escaut", "group": "riviere", "d": path_d(bg(escaut), 0.3)}]
for k, (n, pts) in BE_RIV.items():
    bel_riv.append({"id": k, "name": n, "group": "riviere", "d": path_d(B.geom(LineString(chaikin(pts)).intersection(bframe)), 0.3)})
sillon = LineString(chaikin([(3.75, 50.40), (4.1, 50.38), (4.44, 50.41), (4.87, 50.46), (5.2, 50.53), (5.57, 50.63), (5.85, 50.72)]))

mpop = {"vb": mbel["vb"], "sea": mbel["sea"], "base_ref": "belgique"}
mpop["provlines"] = path_d(bg(unary_union([g.boundary for g in prov_geoms.values()]).difference(bel_g.boundary.buffer(0.01))), 0.3)
mpop["points"] = ptsB([c for c in BE_CITIES if c[4] == "top7"] + PERI)
mpop["lines"] = [{"id": "sillon", "name": "Sillon Sambre-et-Meuse", "group": "sillon", "d": path_d(B.geom(sillon), 0.3)}]
OUT["belgique_pop"] = mpop

# régions naturelles (approximation par diagramme de Voronoï à partir de germes, découpé sur la Belgique)
NAT = {
    "dunes": ("Dunes", [(2.56, 51.09), (2.70, 51.16), (2.88, 51.22), (3.05, 51.28), (3.25, 51.34), (3.36, 51.37)]),
    "polders": ("Polders", [(2.70, 51.10), (2.85, 51.15), (3.02, 51.22), (3.20, 51.28), (3.40, 51.30), (3.60, 51.27), (3.90, 51.24), (4.15, 51.30), (4.28, 51.33)]),
    "flandre_r": ("Flandre (plaine sablonneuse)", [(2.75, 50.98), (3.10, 51.05), (3.40, 51.08), (3.75, 51.10), (4.05, 51.13), (3.20, 50.95), (3.55, 50.98), (2.95, 51.02)]),
    "campine": ("Campine", [(4.70, 51.30), (5.00, 51.25), (5.30, 51.20), (5.55, 51.10), (5.25, 51.05), (4.85, 51.15), (4.55, 51.38), (5.70, 51.0)]),
    "collines": ("Région des Collines", [(3.30, 50.78), (3.60, 50.80), (3.90, 50.83), (4.15, 50.88), (4.45, 50.95), (4.80, 50.95), (5.10, 50.95), (2.80, 50.80)]),
    "hennuyer": ("Pays hennuyer et brabançon (plateaux limoneux)", [(3.40, 50.55), (3.75, 50.55), (4.10, 50.58), (4.40, 50.65), (4.65, 50.70), (3.95, 50.65), (3.60, 50.62)]),
    "hesbaye": ("Hesbaye", [(4.90, 50.70), (5.15, 50.68), (5.35, 50.72), (5.10, 50.78), (5.50, 50.77)]),
    "herve": ("Pays de Herve", [(5.80, 50.66), (5.90, 50.70), (5.75, 50.71)]),
    "condroz": ("Condroz", [(4.60, 50.33), (4.95, 50.35), (5.25, 50.40), (5.50, 50.45), (4.35, 50.30)]),
    "famenne": ("Famenne", [(4.95, 50.20), (5.20, 50.23), (5.40, 50.30), (4.75, 50.17)]),
    "fagne": ("Fagne", [(4.25, 50.12), (4.45, 50.10), (4.10, 50.15)]),
    "ardenne": ("Ardenne", [(4.80, 49.90), (5.20, 50.00), (5.55, 50.10), (5.85, 50.25), (6.10, 50.35), (5.30, 49.85), (4.60, 49.98), (6.20, 50.15), (5.95, 50.48)]),
    "lorraine": ("Lorraine belge", [(5.55, 49.62), (5.75, 49.60), (5.40, 49.62)]),
}
seeds = []; owner = []
for k, (n, pts) in NAT.items():
    for p in pts: seeds.append(Point(p)); owner.append(k)
vor = voronoi_polygons(MultiPoint(seeds), extend_to=box(1, 48, 8, 53))
cells = {k: [] for k in NAT}
for cell in vor.geoms:
    for i, s in enumerate(seeds):
        if cell.contains(s): cells[owner[i]].append(cell); break
coastline = LineString([(2.545, 51.089), (2.75, 51.17), (3.0, 51.25), (3.2, 51.33), (3.37, 51.375)])
dunes_g = coastline.buffer(0.025).intersection(bel_g)
polders_g = unary_union([coastline.buffer(0.11), LineString([(3.37, 51.37), (3.8, 51.25), (4.2, 51.30), (4.3, 51.37)]).buffer(0.06)]).intersection(bel_g).difference(dunes_g)
coastal = unary_union([dunes_g, polders_g])
nat_feats = []
for k, (n, _) in NAT.items():
    if k == "dunes": g = dunes_g
    elif k == "polders": g = polders_g
    else: g = unary_union(cells[k]).intersection(bel_g).difference(coastal)
    if k not in ("dunes", "polders"): g = smooth(g, 0.06).intersection(bel_g).difference(coastal)
    nat_feats.append({"id": "rn_" + k, "name": n, "group": "region_naturelle", "d": path_d(bg(g), 0.6, 0.5)})
INDUS = [("Liège", 5.57, 50.62, 0.12, 0.035, 25), ("Charleroi", 4.44, 50.41, 0.13, 0.03, 10), ("Mons (Borinage)", 3.90, 50.43, 0.12, 0.03, 5), ("Bruxelles", 4.37, 50.86, 0.06, 0.06, 0), ("Anvers (port)", 4.33, 51.27, 0.05, 0.08, 0)]
mnat = {"vb": mbel["vb"], "sea": mbel["sea"], "base_ref": "belgique"}
mnat["features"] = nat_feats
mnat["indus"] = [{"id": "ind_" + str(i), "name": n, "d": path_d(bg(ellipse_ll(lo, la, rx, ry, rot=r)), 0.3)} for i, (n, lo, la, rx, ry, r) in enumerate(INDUS)]
mnat["lines"] = bel_riv[:2]
OUT["belgique_naturelle"] = mnat

# relief belge : 3 grandes zones (basse, moyenne, haute Belgique) + repères
REL = {
    "basse": ("Basse Belgique (moins de 100 m)", [(2.8, 51.0), (3.3, 51.15), (3.8, 51.15), (4.3, 51.2), (4.8, 51.25), (5.3, 51.2), (5.7, 51.1), (3.2, 50.95), (3.6, 51.05), (4.0, 51.05), (2.6, 51.05)]),
    "moyenne": ("Moyenne Belgique (100 à 200 m)", [(3.4, 50.65), (3.9, 50.65), (4.3, 50.7), (4.7, 50.75), (5.1, 50.75), (5.4, 50.75), (3.5, 50.8), (4.0, 50.85), (4.5, 50.88), (5.0, 50.88), (2.9, 50.78)]),
    "haute": ("Haute Belgique (plus de 200 m)", [(4.4, 50.2), (4.9, 50.25), (5.3, 50.3), (5.7, 50.4), (6.1, 50.5), (5.5, 50.0), (5.8, 50.15), (5.1, 49.9), (5.6, 49.7), (6.0, 50.6), (4.2, 50.05)]),
}
seeds = []; owner = []
for k, (n, pts) in REL.items():
    for p in pts: seeds.append(Point(p)); owner.append(k)
vor = voronoi_polygons(MultiPoint(seeds), extend_to=box(1, 48, 8, 53))
cells = {k: [] for k in REL}
for cell in vor.geoms:
    for i, s in enumerate(seeds):
        if cell.contains(s): cells[owner[i]].append(cell); break
mrel = {"vb": mbel["vb"], "sea": mbel["sea"], "base_ref": "belgique"}
mrel["features"] = [{"id": "rel_" + k, "name": n, "group": "relief", "d": path_d(bg(smooth(unary_union(cells[k]), 0.04).intersection(bel_g)), 0.6, 0.5)} for k, (n, _) in REL.items()]
mrel["lines"] = bel_riv
RELPTS = [("botrange", "Signal de Botrange (694 m), point culminant – Hautes Fagnes", 6.09, 50.50, "sommet"),
          ("hautes_fagnes", "Plateau des Hautes Fagnes", 6.05, 50.53, "plateau"), ("tailles", "Plateau des Tailles", 5.75, 50.22, "plateau"),
          ("haut_ardenne", "Haut-plateau d’Ardenne", 5.45, 49.95, "plateau"), ("herve_p", "Plateau de Herve", 5.83, 50.68, "plateau"),
          ("campine_p", "Bas-plateau de Campine", 5.3, 51.12, "plateau"), ("flandre_c", "Collines de Flandre (mont Kemmel)", 2.82, 50.78, "colline"),
          ("brabancon", "Bas-plateau brabançon", 4.55, 50.78, "plateau"), ("hesbignon", "Bas-plateau hesbignon", 5.15, 50.70, "plateau"),
          ("condroz_p", "Collines du Condroz", 5.05, 50.35, "colline"), ("fagne_famenne", "Dépression Fagne-Famenne", 4.95, 50.18, "depression"),
          ("lorrain", "Plateau lorrain", 5.60, 49.66, "plateau")]
mrel["points"] = ptsB(RELPTS)
OUT["belgique_relief"] = mrel

# =====================================================================
# 4) RDC
# =====================================================================
R = Frame(equirect(-3), xy_bounds=None, bounds_ll=(11.6, -14.2, 31.8, 6.0), width=1000, pad=0, densify=0)
rframe = box(11.6, -14.2, 31.8, 6.0)
def rg(g): return R.geom(clean(g).intersection(rframe))
cod = shape([f for f in c10 if iso(f) == "COD"][0]["geometry"])
NEI = {"COG": "Congo", "CAF": "Centrafrique", "SSD": "Soudan du Sud", "UGA": "Ouganda", "RWA": "Rwanda", "BDI": "Burundi", "TZA": "Tanzanie", "ZMB": "Zambie", "AGO": "Angola",
       "GAB": "Gabon", "CMR": "Cameroun", "KEN": "Kenya", "SDN": "Soudan", "MWI": "Malawi", "TCD": "Tchad", "ETH": "Éthiopie", "NAM": "Namibie", "MOZ": "Mozambique"}
rn = []
for f in c10:
    a = iso(f)
    if a in NEI:
        g = shape(f["geometry"]).intersection(rframe)
        if not g.is_empty: rn.append({"id": "n_" + a.lower(), "name": NEI[a], "d": path_d(rg(g), 0.5, 2)})
rlakes = []
for nm, fr in [("Lake Kivu", "Lac Kivu"), ("Lake Tanganyika", "Lac Tanganyika"), ("Lake Albert", "Lac Albert"), ("Lake Edward", "Lac Édouard"), ("Lake Mweru", "Lac Moero"),
               ("Lake Victoria", "Lac Victoria"), ("Lac Mai-Ndombe", "Lac Mai-Ndombe"), ("Lake Bangweulu", "Lac Bangwelo"), ("Lac Tumba", "Lac Tumba"), ("Lake Malawi", "Lac Malawi"), ("Lake Kyoga", "Lac Kyoga")]:
    g = lake(nm)
    if g is None: print("lac manquant", nm, file=sys.stderr); continue
    rlakes.append({"id": "lac_" + nm.split()[-1].lower(), "name": fr, "d": path_d(rg(g), 0.3, 0.3)})
rlakes.append({"id": "lac_mweru", "name": "Lac Moero", "d": path_d(rg(ellipse_ll(28.72, -9.0, 0.32, 0.55, rot=-25)), 0.3)})
rriv = rivers(["Congo", "Lualaba", "Kasai", "Ubangi", "Uele", "Lomami", "Aruwimi", "Kwango", "Sankuru", "Lukuga", "Luapula", "Itimbiri", "Ruki", "Tshuapa", "Lulonga", "Mongala"], riv10, clip=rframe)
congo_main = rivers(["Congo", "Lualaba"], riv10, clip=rframe)
rprov = [f for f in adm1 if P(f, "adm0_a3") == "COD"]
prov_lines = unary_union([shape(f["geometry"]).boundary for f in rprov]).difference(cod.boundary.buffer(0.03))
kivu_n = shape([f for f in rprov if P(f, "name") == "Nord-Kivu"][0]["geometry"])
kivu_s = shape([f for f in rprov if P(f, "name") == "Sud-Kivu"][0]["geometry"])
katanga = shape([f for f in rprov if P(f, "name") == "Katanga"][0]["geometry"])
ituri = Polygon([(27.9, 3.2), (30.85, 3.5), (31.3, 2.2), (30.3, 1.1), (29.95, 0.9), (29.65, 0.75), (29.2, 1.05), (28.7, 1.0), (28.1, 1.4), (27.6, 2.4)]).intersection(cod)
RDC = {"vb": f"0 0 {R.W} {R.H}", "sea": f"M0,0H{R.W}V{R.H}H0Z", "neigh": rn, "lakes": rlakes,
       "rdc": path_d(rg(cod), 0.35, 1), "rivers": path_d(rg(rriv), 0.4), "congo": path_d(rg(congo_main), 0.4), "provlines": path_d(rg(prov_lines), 0.4),
       "equator": path_d(R.geom(LineString([(11.6, 0), (31.8, 0)])), 0.3)}
RDC_CITIES = [("kinshasa", "Kinshasa (capitale)", 15.31, -4.32, "capitale"), ("lubumbashi", "Lubumbashi", 27.48, -11.66, "ville"), ("mbujimayi", "Mbuji-Mayi", 23.60, -6.13, "ville"),
              ("kisangani", "Kisangani", 25.19, 0.52, "ville"), ("goma", "Goma", 29.22, -1.68, "ville"), ("bukavu", "Bukavu", 28.86, -2.51, "ville2"), ("kolwezi", "Kolwezi", 25.47, -10.71, "ville2"),
              ("kananga", "Kananga", 22.42, -5.90, "ville2"), ("bunia", "Bunia", 30.25, 1.56, "ville2"), ("beni", "Beni", 29.47, 0.49, "ville2"), ("uvira", "Uvira", 29.14, -3.40, "ville2"),
              ("kindu", "Kindu", 25.93, -2.95, "ville2"), ("matadi", "Matadi", 13.46, -5.82, "ville2"), ("mbandaka", "Mbandaka", 18.26, 0.05, "ville2"), ("kalemie", "Kalemie", 29.19, -5.93, "ville2"),
              ("kigali", "Kigali", 30.06, -1.95, "etranger"), ("bujumbura", "Bujumbura", 29.36, -3.38, "etranger"), ("brazzaville", "Brazzaville", 15.24, -4.27, "etranger"), ("kampala", "Kampala", 32.58, 0.35, "etranger")]
def ptsR(L): return [{"id": i, "name": n, "group": g, "x": round(R.xy(lo, la)[0], 1), "y": round(R.xy(lo, la)[1], 1)} for i, n, lo, la, g in L]
RDC["cities"] = ptsR(RDC_CITIES)
RDC["labels"] = [{"t": t, "x": round(R.xy(lo, la)[0]), "y": round(R.xy(lo, la)[1]), "cls": c} for t, lo, la, c in [
    ("CONGO", 14.6, -1.5, "country"), ("CENTRAFRIQUE", 20.5, 5.2, "country"), ("SOUDAN DU SUD", 29.5, 5.3, "country"), ("OUGANDA", 31.0, 3.4, "country"),
    ("RWANDA", 30.25, -1.95, "country_s"), ("BURUNDI", 30.15, -3.3, "country_s"), ("TANZANIE", 30.9, -7.0, "country"), ("ZAMBIE", 28.3, -13.4, "country"),
    ("ANGOLA", 18.5, -12.0, "country"), ("Océan Atlantique", 12.4, -7.8, "sea"), ("Équateur", 13.0, 0.35, "line")]]
# couches thématiques (schémas simplifiés d'après les cartes du dossier)
stann = Polygon([(28.0, 1.9), (29.3, 1.3), (29.55, -0.3), (29.2, -1.3), (28.95, -2.6), (29.0, -4.2), (28.6, -6.0), (28.2, -8.0), (27.4, -9.6), (26.0, -10.1), (25.5, -9.2), (25.9, -7.6), (26.2, -6.3), (25.9, -4.6), (25.7, -3.0), (26.1, -1.3), (27.0, 0.7)]).intersection(cod)
cupr = Polygon([(24.6, -10.25), (25.8, -10.35), (26.8, -10.75), (27.7, -11.15), (28.5, -11.9), (28.0, -12.5), (27.0, -12.0), (25.8, -11.5), (24.8, -11.1), (24.3, -10.7)]).intersection(cod)
palu = Polygon([(17.0, 4.3), (21.0, 4.6), (25.5, 4.8), (27.8, 4.0), (28.5, 2.4), (27.8, 0.2), (26.0, -1.2), (23.5, -2.0), (20.5, -2.4), (18.0, -1.6), (16.6, 0.5), (16.4, 2.5)]).intersection(cod)
cuvette = Polygon([(16.8, 2.5), (19.0, 4.0), (23.0, 3.6), (25.6, 2.2), (26.2, 0.0), (25.6, -2.6), (23.0, -3.6), (19.5, -3.4), (17.0, -2.6), (16.3, -0.5)]).intersection(cod)
montagnes = Polygon([(29.4, 3.0), (30.9, 2.4), (30.0, 0.5), (29.7, -1.0), (29.4, -2.4), (29.2, -4.0), (29.4, -6.2), (28.9, -8.2), (27.9, -8.0), (28.3, -6.0), (28.5, -4.0), (28.4, -2.5), (28.7, -1.0), (29.0, 0.6), (29.1, 2.3)]).intersection(cod)
hauts_kat = Polygon([(25.5, -9.8), (27.5, -9.5), (28.6, -10.6), (29.0, -12.5), (27.8, -13.0), (26.2, -12.0), (24.8, -11.3)]).intersection(cod)
cuvette, montagnes, hauts_kat = [smooth(x, 0.35).intersection(cod) for x in (cuvette, montagnes, hauts_kat)]
stann, cupr, palu = [smooth(x, 0.3).intersection(cod) for x in (stann, cupr, palu)]
plateaux = cod.difference(cuvette).difference(montagnes).difference(hauts_kat)
foret = Polygon([(17.0, 4.0), (24.0, 5.0), (28.5, 4.5), (29.8, 2.0), (29.0, 0.0), (28.5, -2.5), (27.0, -4.5), (24.5, -4.8), (22.0, -4.5), (19.0, -4.0), (16.5, -3.5), (15.8, -1.0), (16.3, 2.0)]).intersection(cod)
foret = smooth(foret, 0.4).intersection(cod)
veg_mont = montagnes.difference(Polygon([(29.0, -6.0), (31, -6), (31, -9), (28, -9)]))
sav_herb = Polygon([(25.5, -8.0), (28.0, -7.8), (29.5, -9.0), (30.5, -13.5), (27.0, -13.5), (24.5, -11.5), (24.0, -9.5)]).intersection(cod).difference(veg_mont)
sav_herb = smooth(sav_herb, 0.3).intersection(cod).difference(veg_mont)
sav_boisee = cod.difference(foret).difference(veg_mont).difference(sav_herb)
clim_eq = Polygon([(17.5, 4.0), (25.0, 4.2), (28.5, 2.5), (28.4, -1.5), (27.0, -3.6), (24.0, -4.4), (20.0, -4.4), (16.4, -3.6), (16.0, -1.0), (16.4, 2.2)]).intersection(cod).difference(montagnes)
clim_eq = smooth(clim_eq, 0.4).intersection(cod).difference(montagnes)
clim_mont = montagnes
clim_trop = cod.difference(clim_eq).difference(clim_mont)
dens = unary_union([ellipse_ll(29.1, -1.0, 0.7, 1.6), ellipse_ll(28.9, -2.6, 0.5, 0.7), ellipse_ll(15.3, -4.4, 0.5, 0.35), ellipse_ll(27.2, -11.3, 0.9, 0.5), ellipse_ll(23.6, -6.1, 0.4, 0.4), ellipse_ll(30.2, 1.4, 0.5, 0.5)]).intersection(cod)
RDC["themes"] = {
    "ressources": [{"id": "stannifere", "name": "Région stannifère (riche en étain, coltan)", "d": path_d(rg(stann), 0.4)},
                   {"id": "cuprifere", "name": "Ceinture cuprifère (cuivre et cobalt)", "d": path_d(rg(cupr), 0.4)}],
    "relief": [{"id": "rel_cuvette", "name": "Cuvette centrale (300 à 500 m)", "d": path_d(rg(cuvette), 0.4)},
               {"id": "rel_plateaux", "name": "Plateaux et collines périphériques (500 à 1000 m)", "d": path_d(rg(plateaux), 0.4, 1)},
               {"id": "rel_montagnes", "name": "Chaînes montagneuses de l’Est (Rift Albertin, Rwenzori, Virunga, monts Mitumba)", "d": path_d(rg(montagnes), 0.4)},
               {"id": "rel_katanga", "name": "Hauts plateaux du Haut-Katanga (plus de 1500 m)", "d": path_d(rg(hauts_kat), 0.4)}],
    "vegetation": [{"id": "veg_foret", "name": "Forêt équatoriale", "d": path_d(rg(foret), 0.4)},
                   {"id": "veg_sav_boisee", "name": "Savane boisée", "d": path_d(rg(sav_boisee), 0.4, 1)},
                   {"id": "veg_sav_herb", "name": "Savane herbeuse", "d": path_d(rg(sav_herb), 0.4)},
                   {"id": "veg_montagne", "name": "Végétation de montagne", "d": path_d(rg(veg_mont), 0.4)}],
    "climat": [{"id": "cl_equatorial", "name": "Climat équatorial (11 à 12 mois de pluie)", "d": path_d(rg(clim_eq), 0.4)},
               {"id": "cl_tropical", "name": "Climat tropical (5 à 9 mois de pluie : une saison sèche)", "d": path_d(rg(clim_trop), 0.4, 1)},
               {"id": "cl_montagne", "name": "Climat des montagnes", "d": path_d(rg(clim_mont), 0.4)}],
    "sante": [{"id": "palu", "name": "Paludisme transmis toute l’année", "d": path_d(rg(palu), 0.4)}],
    "densite": [{"id": "dense", "name": "Fortes densités (plus de 70 hab./km²)", "d": path_d(rg(dens), 0.4)}],
    "kivu": [{"id": "nord_kivu", "name": "Province du Nord-Kivu", "d": path_d(rg(kivu_n), 0.3)},
             {"id": "sud_kivu", "name": "Province du Sud-Kivu", "d": path_d(rg(kivu_s), 0.3)},
             {"id": "ituri", "name": "Province de l’Ituri", "d": path_d(rg(ituri), 0.3)},
             {"id": "katanga_anc", "name": "Katanga (ancienne province)", "d": path_d(rg(katanga), 0.3)}],
}
MINES = [("m_coltan_1", "Coltan : Rubaya (Nord-Kivu)", 28.88, -1.55, "coltan"), ("m_coltan_2", "Coltan : Punia (Maniema)", 26.45, -1.47, "coltan"), ("m_coltan_3", "Coltan et étain : Manono (Tanganyika)", 27.42, -7.30, "coltan"),
         ("m_etain_1", "Étain (cassitérite) : Bisie – Walikale", 28.05, -1.42, "etain"), ("m_etain_2", "Étain : Kalima (Maniema)", 26.6, -2.55, "etain"),
         ("m_or_1", "Or : Kilo-Moto (Ituri)", 30.1, 1.9, "or"), ("m_or_2", "Or : Kamituga (Sud-Kivu)", 28.18, -3.06, "or"),
         ("m_cuivre_1", "Cuivre et cobalt : Kolwezi", 25.47, -10.71, "cuivre"), ("m_cuivre_2", "Cuivre et cobalt : Likasi", 26.73, -10.98, "cuivre"), ("m_cuivre_3", "Cuivre et cobalt : Lubumbashi", 27.48, -11.66, "cuivre"),
         ("m_diamant_1", "Diamants : Mbuji-Mayi", 23.60, -6.13, "diamant"), ("m_diamant_2", "Diamants : Tshikapa", 20.80, -6.42, "diamant"),
         ("m_petrole", "Pétrole : Muanda (côte atlantique)", 12.35, -5.93, "petrole"), ("m_uranium", "Uranium : Shinkolobwe", 26.57, -11.05, "uranium")]
RDC["mines"] = ptsR(MINES)
VIOL = [("v1", 29.45, -1.2, 60), ("v2", 29.25, -1.65, 50), ("v3", 29.47, 0.49, 60), ("v4", 30.2, 1.6, 55), ("v5", 30.4, 2.0, 45), ("v6", 29.3, 0.1, 40), ("v7", 28.9, -2.5, 25),
        ("v8", 29.1, -3.4, 25), ("v9", 28.9, -4.2, 15), ("v10", 25.2, 0.5, 30), ("v11", 16.3, -3.3, 35), ("v12", 15.3, -4.35, 30), ("v13", 16.9, -4.3, 15), ("v14", 28.4, -1.5, 30),
        ("v15", 29.1, -0.6, 40), ("v16", 27.5, -11.6, 10), ("v17", 23.6, -6.1, 10)]
RDC["violences"] = [{"id": i, "x": round(R.xy(lo, la)[0], 1), "y": round(R.xy(lo, la)[1], 1), "n": n} for i, lo, la, n in VIOL]
GROUPS = [("g_codeco", "CODECO (Ituri)", 30.35, 1.9), ("g_adf", "ADF (Beni, Nord-Kivu et Ituri)", 29.7, 0.75), ("g_m23", "M23 / AFC (Rutshuru, Masisi, Goma)", 29.35, -1.25),
          ("g_fdlr", "FDLR (Nord-Kivu)", 28.95, -0.95), ("g_maimai", "Maï-Maï Kata Katanga (Haut-Katanga)", 27.0, -9.7)]
RDC["groupes"] = ptsR([(i, n, lo, la, "groupe") for i, n, lo, la in GROUPS])
RDC["volcans"] = ptsR([("nyiragongo", "Nyiragongo (volcan actif)", 29.25, -1.52, "volcan"), ("nyamuragira", "Nyamuragira (volcan actif)", 29.20, -1.41, "volcan"),
                       ("rwenzori", "Monts Rwenzori (pic Marguerite, 5109 m)", 29.87, 0.39, "sommet")])
OUT["rdc"] = RDC

# =====================================================================
# 5) AFRIQUE (situation de la RDC)
# =====================================================================
A = Frame(laea(18, 2), xy_bounds=None, bounds_ll=(-20, -36, 54, 38), width=800, pad=0, densify=0.5)
pa = laea(18, 2)
A = Frame(pa, xy_bounds=(pa(-18, 2)[0], pa(18, -36)[1], pa(52, 2)[0], pa(18, 38)[1]), width=800, pad=0, densify=0.5)
aframe = box(0, 0, A.W, A.H)
af = []
for f in c50:
    g = shape(f["geometry"])
    if P(f, "CONTINENT") == "Africa" or iso(f) in ("ESP", "PRT", "ITA", "GRC", "TUR", "SAU", "YEM", "OMN", "ISR", "JOR", "SYR", "IRQ", "PSE", "LBN", "CYP", "ARE", "IRN", "KWT", "QAT", "MLT", "FRA"):
        gg = A.geom(g.intersection(box(-30, -40, 60, 45))).intersection(aframe)
        if not gg.is_empty: af.append({"id": "af_" + iso(f).lower(), "iso": iso(f), "name": NAMES_FIX.get(iso(f), fr_name(f)), "afr": P(f, "CONTINENT") == "Africa", "d": path_d(gg, 0.5, 1)})
MA = {"vb": f"0 0 {A.W} {A.H}", "sea": f"M0,0H{A.W}V{A.H}H0Z", "countries": af}
MA["lines"] = [{"id": i, "name": n, "d": path_d(A.geom(g.intersection(box(-30, -40, 60, 45))).intersection(aframe), 0.3)} for i, n, g in LINES if i in ("equateur", "tropique_cancer", "tropique_capricorne", "greenwich")]
MA["lakes"] = [{"id": "lac_" + n.split()[-1].lower(), "name": fr, "d": path_d(A.geom(lake(n, lakes50)).intersection(aframe), 0.3)} for n, fr in [("Lake Victoria", "Lac Victoria"), ("Lake Tanganyika", "Lac Tanganyika"), ("Lake Malawi", "Lac Malawi"), ("Lake Kivu", "Lac Kivu"), ("Lake Albert", "Lac Albert"), ("Lake Chad", "Lac Tchad")] if lake(n, lakes50) is not None]
MA["labels"] = [{"t": t, "x": round(A.xy(lo, la)[0]), "y": round(A.xy(lo, la)[1]), "cls": c} for t, lo, la, c in [
    ("Océan Atlantique", -10, -5, "sea"), ("Océan Indien", 55, -15, "sea"), ("Mer Méditerranée", 18, 35, "sea"), ("Golfe de Guinée", 3, 2, "sea_s")]]
MA["points"] = [{"id": "goma_a", "name": "Goma", "x": round(A.xy(29.22, -1.68)[0], 1), "y": round(A.xy(29.22, -1.68)[1], 1)},
                {"id": "kinshasa_a", "name": "Kinshasa", "x": round(A.xy(15.31, -4.32)[0], 1), "y": round(A.xy(15.31, -4.32)[1], 1)}]
OUT["afrique"] = MA

# =====================================================================
# 6) PARIS (plan schématique des fonctions)
# =====================================================================
Pf = Frame(equirect(48.86), xy_bounds=None, bounds_ll=(2.215, 48.805, 2.47, 48.915), width=1000, pad=0, densify=0)
def pp(lo, la): x, y = Pf.xy(lo, la); return round(x, 1), round(y, 1)
periph = [(2.2795, 48.8786), (2.2950, 48.8890), (2.3200, 48.8995), (2.3450, 48.9010), (2.3700, 48.9008), (2.3900, 48.8990), (2.3985, 48.8870), (2.4100, 48.8770),
          (2.4130, 48.8650), (2.4140, 48.8500), (2.4120, 48.8360), (2.4020, 48.8300), (2.3880, 48.8270), (2.3650, 48.8165), (2.3450, 48.8165), (2.3250, 48.8215), (2.3000, 48.8270),
          (2.2780, 48.8330), (2.2650, 48.8420), (2.2555, 48.8500), (2.2530, 48.8620), (2.2580, 48.8720), (2.2680, 48.8780)]
seine = [(2.470, 48.810), (2.440, 48.812), (2.414, 48.823), (2.390, 48.830), (2.375, 48.838), (2.366, 48.846), (2.357, 48.851), (2.347, 48.856), (2.333, 48.859), (2.322, 48.863),
         (2.310, 48.864), (2.300, 48.862), (2.289, 48.857), (2.280, 48.851), (2.272, 48.844), (2.262, 48.837), (2.248, 48.833), (2.235, 48.838), (2.227, 48.850), (2.228, 48.862),
         (2.235, 48.873), (2.250, 48.885), (2.262, 48.893), (2.280, 48.903), (2.300, 48.912)]
cite = [(2.3405, 48.8575), (2.3480, 48.8565), (2.3540, 48.8525), (2.3470, 48.8520), (2.3400, 48.8555)]
MP = {"vb": f"0 0 {Pf.W} {Pf.H}", "periph": path_d(Pf.geom(Polygon(periph)), 0.2), "seine": path_d(Pf.geom(LineString(seine)), 0.2), "cite": path_d(Pf.geom(Polygon(cite)), 0.2)}
MP["bois"] = [{"name": "Bois de Boulogne", "d": path_d(Pf.geom(Polygon([(2.2380, 48.8790), (2.2600, 48.8770), (2.2640, 48.8600), (2.2560, 48.8460), (2.2470, 48.8450), (2.2400, 48.8550), (2.2340, 48.8700)])), 0.2)},
              {"name": "Bois de Vincennes", "d": path_d(Pf.geom(Polygon([(2.4150, 48.8450), (2.4400, 48.8480), (2.4650, 48.8380), (2.4600, 48.8260), (2.4350, 48.8230), (2.4150, 48.8320)])), 0.2)}]
MP["quartiers"] = [{"id": "q_ministeres", "name": "Quartier des ministères", "group": "politique_zone", "d": path_d(Pf.geom(Polygon([(2.3080, 48.8700), (2.3260, 48.8720), (2.3320, 48.8610), (2.3250, 48.8500), (2.3080, 48.8520), (2.3000, 48.8600)])), 0.2)},
                   {"id": "q_ambassades", "name": "Quartier des ambassades", "group": "politique_zone", "d": path_d(Pf.geom(Polygon([(2.2720, 48.8800), (2.2950, 48.8770), (2.3020, 48.8680), (2.2930, 48.8620), (2.2780, 48.8580), (2.2680, 48.8650)])), 0.2)}]
MP["axe"] = path_d(Pf.geom(LineString([(2.2380, 48.8920), (2.2950, 48.8738)])), 0.2)
PARIS = [("elysee", "Palais de l’Élysée (présidence)", 2.3165, 48.8704, "politique"), ("assemblee", "Assemblée nationale", 2.3185, 48.8619, "politique"), ("matignon", "Hôtel Matignon (Premier ministre)", 2.3205, 48.8546, "politique"),
         ("senat", "Sénat", 2.3371, 48.8483, "politique"), ("bercy", "Ministère de l’Économie et des Finances (Bercy)", 2.3784, 48.8381, "politique"),
         ("defense", "La Défense (quartier des affaires)", 2.2380, 48.8920, "economique"), ("bourse", "Bourse", 2.3412, 48.8690, "economique"), ("ocde", "OCDE", 2.2711, 48.8616, "economique"),
         ("unesco", "UNESCO", 2.3065, 48.8497, "culturelle"), ("sorbonne", "Sorbonne", 2.3431, 48.8486, "culturelle"), ("college_france", "Collège de France", 2.3449, 48.8494, "culturelle"),
         ("opera_garnier", "Opéra Garnier", 2.3316, 48.8720, "culturelle"), ("opera_bastille", "Opéra Bastille", 2.3700, 48.8526, "culturelle"),
         ("louvre", "Musée du Louvre", 2.3376, 48.8606, "monument"), ("eiffel", "Tour Eiffel", 2.2945, 48.8584, "monument"), ("arc", "Arc de Triomphe", 2.2950, 48.8738, "monument"),
         ("sacre_coeur", "Sacré-Cœur", 2.3431, 48.8867, "monument"), ("notre_dame", "Notre-Dame-de-Paris", 2.3499, 48.8530, "monument"), ("pompidou", "Centre Pompidou", 2.3522, 48.8606, "monument"),
         ("g_nord", "Gare du Nord", 2.3553, 48.8809, "transport"), ("g_est", "Gare de l’Est", 2.3590, 48.8768, "transport"), ("g_stlazare", "Gare Saint-Lazare", 2.3253, 48.8763, "transport"),
         ("g_lyon", "Gare de Lyon", 2.3733, 48.8443, "transport"), ("g_austerlitz", "Gare d’Austerlitz", 2.3653, 48.8420, "transport"), ("g_montparnasse", "Gare Montparnasse", 2.3210, 48.8412, "transport")]
MP["points"] = [{"id": i, "name": n, "group": g, "x": pp(lo, la)[0], "y": pp(lo, la)[1]} for i, n, lo, la, g in PARIS]
rails = [[(2.3553, 48.8809), (2.3600, 48.8950), (2.3700, 48.915)], [(2.3590, 48.8768), (2.3750, 48.8900), (2.4000, 48.915)], [(2.3253, 48.8763), (2.3150, 48.8900), (2.3000, 48.915)],
         [(2.3733, 48.8443), (2.3950, 48.8300), (2.4400, 48.808)], [(2.3653, 48.8420), (2.3700, 48.8250), (2.3800, 48.805)], [(2.3210, 48.8412), (2.3050, 48.8250), (2.2850, 48.805)]]
MP["rails"] = path_d(Pf.geom(MultiLineString(rails)), 0.2)
MP["airports"] = [{"name": "Aéroport de Roissy-Charles-de-Gaulle", "x": pp(2.455, 48.906)[0], "y": pp(2.455, 48.906)[1], "dir": "ne"},
                  {"name": "Aéroport d’Orly", "x": pp(2.36, 48.809)[0], "y": pp(2.36, 48.809)[1], "dir": "s"}]
OUT["paris"] = MP

json.dump(OUT, open(sys.argv[1] if len(sys.argv) > 1 else "maps.json", "w"), ensure_ascii=False, separators=(",", ":"))
for k, v in OUT.items(): print(k, len(json.dumps(v)) // 1024, "Ko")

# ---------- points d'étiquette pour les surfaces (post-traitement) ----------
import re as _re
def parse_d(d):
    polys = []
    for ring in _re.findall(r"M[^Mz]*z", d):
        m = _re.match(r"M(-?\d+) (-?\d+)l(.*)z", ring)
        if not m: continue
        x, y = int(m.group(1)), int(m.group(2)); pts = [(x, y)]
        for a, b in _re.findall(r"(-?\d+)\s?(-?\d+)", m.group(3)):
            x += int(a); y += int(b); pts.append((x, y))
        if len(pts) >= 3:
            p = Polygon(pts)
            if not p.is_valid: p = p.buffer(0)
            if not p.is_empty: polys.append(p)
    return polys
def label_pt(d):
    ps = parse_d(d)
    if not ps: return None
    big = max(ps, key=lambda p: p.area)
    if big.geom_type == "MultiPolygon": big = max(big.geoms, key=lambda p: p.area)
    rp = big.representative_point()
    return round(rp.x), round(rp.y)
def line_pt(d, frac=0.3):
    best = None
    for seg in _re.findall(r"M[^Mz]*(?=M|$)", d):
        m = _re.match(r"M(-?\d+) (-?\d+)l(.*)", seg)
        if not m: continue
        x, y = int(m.group(1)), int(m.group(2)); pts = [(x, y)]
        for a, b in _re.findall(r"(-?\d+)\s?(-?\d+)", m.group(3)):
            x += int(a); y += int(b); pts.append((x, y))
        L = LineString(pts) if len(pts) > 1 else None
        if L is not None and (best is None or L.length > best.length): best = L
    if best is None: return None
    p = best.interpolate(frac, normalized=True)
    return round(p.x), round(p.y)
def add_lp(obj):
    if isinstance(obj, dict):
        if "d" in obj and isinstance(obj["d"], str) and not obj["d"].endswith("z") and "name" in obj and obj["d"].startswith("M"):
            lp = line_pt(obj["d"], 0.22 if obj.get("group") == "ligne" else 0.45)
            if lp: obj["lx"], obj["ly"] = lp
        if "d" in obj and isinstance(obj["d"], str) and obj["d"].endswith("z") and "name" in obj:
            lp = label_pt(obj["d"])
            if lp: obj["lx"], obj["ly"] = lp
        for v in obj.values(): add_lp(v)
    elif isinstance(obj, list):
        for v in obj: add_lp(v)
add_lp(OUT)
# corrections manuelles de position d'étiquettes (océans)
for o in OUT["monde"]["oceans"]:
    pos = {"ocean_pacifique": (-150, 0), "ocean_atlantique": (-35, 15), "ocean_indien": (80, -25), "ocean_arctique": (0, 80), "ocean_antarctique": (-60, -63)}[o["id"]]
    o["lx"], o["ly"] = [round(v) for v in W.xy(*pos)]
json.dump(OUT, open(sys.argv[1] if len(sys.argv) > 1 else "maps.json", "w"), ensure_ascii=False, separators=(",", ":"))
print("étiquettes ajoutées")
