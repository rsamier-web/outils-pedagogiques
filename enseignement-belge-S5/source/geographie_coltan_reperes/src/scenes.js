// Définition des cartes interactives (« scènes ») à partir de maps.json.
// Données : Natural Earth (domaine public) ; zones thématiques : schémas simplifiés d'après le dossier du cours.
import M from "./maps.json";

export const PAL = {
  continent: { amerique: "#3fae5a", europe: "#c0392b", afrique: "#e5b922", asie: "#e67e22", oceanie: "#a2479c", antarctique: "#5dade2" },
  climat: { equatorial: "#d7301f", tropical: "#f39c33", desertique: "#f6e7a1", mediterraneen: "#e58fd3", oceanique: "#2fa4b8", continental: "#86c04a",
    montagnard: "#8a7bbf", polaire: "#eef3f7", tempere_chaud: "#f3d36b" },
  biome: { foret_tropicale: "#7fd98e", savane: "#ef7f2a", desert: "#f5c242", foret_temperee: "#2ea650", taiga: "#1f6e55", toundra: "#86e8df",
    prairie: "#dbe95a", glace: "#ffffff", garrigue: "#d6bd85", maquis: "#7d8d4e", steppe: "#dbe95a" },
  ue: { ue: "#3b82c4", candidat: "#b98fd0", candidat_reconnu: "#f59a3a", candidat_potentiel: "#f8dd6b", ancien: "#bfc5ca", hors: "var(--neigh)" },
};
export const CLIMAT_NOMS = { equatorial: "Climat équatorial", tropical: "Climat tropical", desertique: "Climat désertique", mediterraneen: "Climat méditerranéen",
  oceanique: "Climat océanique", continental: "Climat continental", montagnard: "Climat montagnard", polaire: "Climat froid (polaire)", tempere_chaud: "Climat tempéré chaud" };
export const BIOME_NOMS = { foret_tropicale: "Forêt tropicale humide", savane: "Savane (prairie tropicale)", desert: "Désert", foret_temperee: "Forêt tempérée",
  taiga: "Taïga", toundra: "Toundra", prairie: "Prairie (grassland, steppe)", glace: "Glace (inlandsis)", garrigue: "Garrigue", maquis: "Maquis", steppe: "Steppe" };
export const UE_NOMS = { ue: "État membre de l’UE", candidat: "Candidat (négociations entamées)", candidat_reconnu: "Candidat reconnu (Géorgie, processus gelé)",
  candidat_potentiel: "Candidature déposée (Kosovo)", ancien: "Ancien membre (Royaume-Uni)", hors: "Hors UE" };

const RN = ["#f2d478", "#9ad0a0", "#e8a87c", "#b4a7d6", "#87c3e6", "#f4b6c2", "#c5e384", "#d9b38c", "#a0d6c9", "#e3c565", "#9fb8d9", "#d7a6d9", "#bcd99a"];

const by = (arr, key) => arr.map((x, i) => ({ ...x, _i: i, [key]: x[key] }));

// Chaque couche : type (area|line|point|label|raw), données, style, interactivité.
export const SCENES = {
  monde_continents: {
    title: "Les grands repères du monde", base: "world", map: "monde",
    caption: "Projection Equal Earth · Données Natural Earth (domaine public) · Limites des océans simplifiées.",
    layers: [
      { key: "oceans", type: "area", data: M.monde.oceans, fill: () => "transparent", stroke: "none", group: "ocean", under: true },
      { key: "continents", type: "area", data: M.monde.features, fill: f => PAL.continent[f.id], stroke: "var(--land-line)" },
      { key: "hemis", type: "area", data: M.monde.hemis, fill: f => f.id === "hem_nord" ? "rgba(61,174,233,.18)" : "rgba(246,116,0,.16)", stroke: "none", toggle: "hemis" },
      { key: "lignes", type: "line", data: M.monde.lines, stroke: f => f.id === "equateur" ? "#c0392b" : f.id === "greenwich" ? "var(--text)" : f.id.startsWith("tropique") ? "#e67e22" : "#2980b9",
        width: 1.6, dash: f => (f.id === "equateur" || f.id === "greenwich") ? null : "6 4" },
      { key: "poles", type: "point", data: M.monde.points, color: () => "var(--text)", r: 5 },
    ],
    labelsFor: { continents: true, oceans: true },
    legend: [["area", PAL.continent.amerique, "Amérique"], ["area", PAL.continent.europe, "Europe"], ["area", PAL.continent.afrique, "Afrique"], ["area", PAL.continent.asie, "Asie"],
      ["area", PAL.continent.oceanie, "Océanie"], ["area", PAL.continent.antarctique, "Antarctique"], ["line", "#c0392b", "Équateur"], ["line", "#e67e22", "Tropiques"], ["line", "#2980b9", "Cercles polaires"], ["line", "#232629", "Méridien de Greenwich"]],
  },
  monde_population: {
    title: "Foyers de population et espaces peu peuplés", base: "world", map: "monde_pop",
    caption: "Zones simplifiées d’après la fiche Carte 2 (UN World Maps, 2020) · Fond Natural Earth.",
    layers: [{ key: "zones", type: "area", data: M.monde_pop.features, fill: f => f.group === "peuple" ? "#d7301f" : "#8c99a6", stroke: "var(--view)", opacity: f => f.group === "peuple" ? .85 : .65 }],
    legend: [["area", "#d7301f", "Foyer de population (espace densément peuplé)"], ["area", "#8c99a6", "Espace vide ou peu peuplé"]],
  },
  monde_climats: {
    title: "Les zones climatiques du monde", base: "world", map: "monde_climats",
    caption: "Modèle zonal simplifié (limites approximatives) et exemples de climats d’après la fiche Carte 7.",
    layers: [
      { key: "zones", type: "area", data: M.monde_climats.features, fill: f => f.id.startsWith("z_froid") ? "#dbe6ee" : f.id.startsWith("z_tempere") ? "#cfe8b4" : "#f8d49a", stroke: "none", passive: true },
      { key: "lignes", type: "line", data: M.monde_climats.lines, stroke: f => f.id === "equateur" ? "#c0392b" : f.id.startsWith("tropique") ? "#e67e22" : "#2980b9", width: 1.2, dash: f => f.id === "equateur" ? null : "6 4", passive: true },
      { key: "exemples", type: "point", data: M.monde_climats.points, color: f => PAL.climat[f.group], r: 6.5, stroke: "#333", cat: "climat" },
    ],
    legend: [["area", "#dbe6ee", "Zone froide"], ["area", "#cfe8b4", "Zones tempérées"], ["area", "#f8d49a", "Zone chaude (intertropicale)"],
      ...Object.keys(PAL.climat).filter(k => k !== "tempere_chaud").map(k => ["pt", PAL.climat[k], CLIMAT_NOMS[k]])],
  },
  monde_biomes: {
    title: "Les biomes (paysages naturels) du monde", base: "world", map: "monde_biomes",
    caption: "Exemples de localisation des grands biomes d’après la fiche Carte 8 · Fond Natural Earth.",
    layers: [
      { key: "lignes", type: "line", data: M.monde_biomes.lines, stroke: f => f.id === "equateur" ? "#c0392b" : f.id.startsWith("tropique") ? "#e67e22" : "#2980b9", width: 1.1, dash: f => f.id === "equateur" ? null : "6 4", passive: true },
      { key: "exemples", type: "point", data: M.monde_biomes.points, color: f => PAL.biome[f.group], r: 6.5, stroke: "#333", cat: "biome" },
    ],
    legend: ["foret_tropicale", "savane", "desert", "prairie", "foret_temperee", "taiga", "toundra", "glace"].map(k => ["pt", PAL.biome[k], BIOME_NOMS[k]]),
  },
  europe_ue: {
    title: "L’Union européenne (situation au 1er juillet 2025)", base: "europe_sea", map: "europe_ue",
    caption: "D’après la fiche Carte 5 (P. Orcier, 2025) · Fond Natural Earth.",
    layers: [{ key: "pays", type: "area", data: M.europe_ue.features, fill: f => PAL.ue[f.group], stroke: "var(--view)", width: .8 }],
    seaLabels: true,
    legend: ["ue", "candidat", "candidat_reconnu", "candidat_potentiel", "ancien", "hors"].map(k => ["area", PAL.ue[k], UE_NOMS[k]]),
  },
  europe_villes: {
    title: "Les 15 principales aires urbaines européennes", base: "europe", map: "europe_villes",
    caption: "D’après la fiche Carte 3 (aires urbaines en 2017, sur base de la population).",
    layers: [{ key: "villes", type: "point", data: M.europe_villes.points, color: f => f.group === "top15" ? "#d7301f" : "#f39c33", r: f => f.group === "top15" ? 6 : 5, stroke: "#fff" }],
    legend: [["pt", "#d7301f", "Les 15 principales aires urbaines européennes"], ["pt", "#f39c33", "Aires urbaines périphériques des pays voisins de la Belgique"]],
  },
  europe_relief: {
    title: "Orohydrographie de l’Europe : reliefs et cours d’eau", base: "europe", map: "europe_oro",
    caption: "D’après la fiche Carte 12 · Reliefs et fleuves : Natural Earth.",
    layers: [
      { key: "reliefs", type: "area", data: M.europe_oro.features, fill: f => f.group === "plaine" ? "#cfe3b0" : "#b0763f", stroke: f => f.group === "plaine" ? "none" : "#7a4b22", opacity: f => f.group === "plaine" ? .75 : .85 },
      { key: "fleuves", type: "line", data: M.europe_oro.lines, stroke: () => "var(--river)", width: 2 },
    ],
    extraLabels: M.europe_oro.labels,
    legend: [["area", "#b0763f", "Chaîne de montagnes"], ["area", "#cfe3b0", "Grande plaine"], ["line", "#2f8fd0", "Fleuve"]],
  },
  europe_climats: {
    title: "Les climats de l’Europe (exemples)", base: "europe", map: "europe_climats",
    caption: "Exemples de localisation d’après la fiche Carte 9.",
    layers: [{ key: "exemples", type: "point", data: M.europe_climats.points, color: f => PAL.climat[f.group], r: 7, stroke: "#333", cat: "climat" }],
    legend: ["oceanique", "continental", "mediterraneen", "tempere_chaud", "montagnard", "polaire"].map(k => ["pt", PAL.climat[k], CLIMAT_NOMS[k]]),
  },
  europe_biomes: {
    title: "Les biomes de l’Europe (exemples)", base: "europe", map: "europe_biomes",
    caption: "Exemples de localisation d’après la fiche Carte 10.",
    layers: [{ key: "exemples", type: "point", data: M.europe_biomes.points, color: f => PAL.biome[f.group], r: 7, stroke: "#333", cat: "biome" }],
    legend: ["taiga", "toundra", "foret_temperee", "garrigue", "maquis", "steppe"].map(k => ["pt", PAL.biome[k], BIOME_NOMS[k]]),
  },
  belgique_regions: {
    title: "La Belgique : Régions, frontière linguistique et villes", base: "belgique", map: "belgique_admin",
    caption: "Limites : Natural Earth · D’après la fiche Carte 6.",
    layers: [
      { key: "regions", type: "area", data: M.belgique_admin.regions, fill: f => ({ reg_flandre: "#f0e08a", reg_wallonie: "#a9d6a0", reg_bruxelles: "#e2725b" })[f.id], stroke: "var(--land-line)" },
      { key: "provinces", type: "area", data: M.belgique_admin.features, fill: () => "transparent", stroke: "var(--view)", width: 1.3, toggle: "provinces", group: "province" },
      { key: "frontiere", type: "line", data: M.belgique_admin.lines, stroke: () => "#1e7e46", width: 4 },
      { key: "villes", type: "point", data: M.belgique_admin.points, color: f => f.group === "top7" ? "#232629" : "#5d6873", r: f => f.group === "top7" ? 6 : 4, stroke: "#fff" },
    ],
    legend: [["area", "#f0e08a", "Région flamande"], ["area", "#a9d6a0", "Région wallonne"], ["area", "#e2725b", "Région de Bruxelles-Capitale"], ["line", "#1e7e46", "Frontière linguistique"]],
  },
  belgique_communautes: {
    title: "La Belgique : les trois Communautés", base: "belgique", map: "belgique_admin",
    caption: "Tracé de la Communauté germanophone simplifié · D’après la fiche Carte 6 (A et B).",
    layers: [
      { key: "communautes", type: "area", data: M.belgique_admin.communautes, fill: f => ({ com_flamande: "#f0e08a", com_francaise: "#a9d6a0", com_germanophone: "#2e9e44", com_bxl: "url(#hatchBxl)" })[f.id], stroke: "var(--land-line)" },
      { key: "frontiere", type: "line", data: M.belgique_admin.lines, stroke: () => "#1e7e46", width: 3, passive: true },
      { key: "villes", type: "point", data: M.belgique_admin.points.filter(p => ["bruxelles", "eupen", "namur", "anvers", "liege", "gand", "charleroi"].includes(p.id)), color: () => "#232629", r: 4.5, stroke: "#fff", passive: true },
    ],
    legend: [["area", "#f0e08a", "Communauté flamande"], ["area", "#a9d6a0", "Communauté française"], ["area", "#2e9e44", "Communauté germanophone"], ["hatch", "", "Bruxelles : bilingue (flamande et française)"]],
  },
  belgique_provinces: {
    title: "La Belgique : les dix provinces", base: "belgique", map: "belgique_admin",
    caption: "Limites : Natural Earth.",
    layers: [{ key: "provinces", type: "area", data: M.belgique_admin.features, fill: (f, i) => f.region === "flandre" ? ["#f0e08a", "#f5e9a8", "#ead575", "#f7ecb9", "#e9dc94"][i % 5] : f.region === "bruxelles" ? "#e2725b" : ["#a9d6a0", "#bfe0b6", "#94cc8a", "#c9e6c1", "#9fd197"][i % 5], stroke: "var(--land-line)" }],
    legend: [["area", "#f0e08a", "Provinces flamandes"], ["area", "#a9d6a0", "Provinces wallonnes"], ["area", "#e2725b", "Bruxelles (hors provinces)"]],
  },
  belgique_population: {
    title: "La population belge : les 7 aires urbaines", base: "belgique", map: "belgique_pop",
    caption: "D’après la fiche Carte 4 (aires urbaines en 2017, sur base de la population).",
    layers: [
      { key: "provlines", type: "raw", d: M.belgique_pop.provlines, cls: "border" },
      { key: "sillon", type: "line", data: M.belgique_pop.lines, stroke: () => "rgba(41,128,185,.55)", width: 14 },
      { key: "villes", type: "point", data: M.belgique_pop.points, color: f => f.group === "top7" ? "#d7301f" : "#f39c33", r: f => ({ bruxelles: 11, anvers: 9, gand: 8, charleroi: 7.5, liege: 7.5, bruges: 6.5, namur: 6.5 })[f.id] || 5.5, stroke: "#fff" },
    ],
    legend: [["pt", "#d7301f", "Les 7 principales aires urbaines belges"], ["pt", "#f39c33", "Aires urbaines périphériques des pays voisins"], ["line", "rgba(41,128,185,.55)", "Sillon Sambre-et-Meuse"]],
  },
  belgique_naturelle: {
    title: "Les régions naturelles (paysages) de Belgique", base: "belgique", map: "belgique_naturelle",
    caption: "Schéma simplifié d’après la fiche Carte 11 · Limites approximatives.",
    layers: [
      { key: "regions", type: "area", data: M.belgique_naturelle.features, fill: (f, i) => RN[i % RN.length], stroke: "var(--view)", width: 1 },
      { key: "indus", type: "area", data: M.belgique_naturelle.indus, fill: () => "rgba(90,90,90,.55)", stroke: "none", passive: true },
      { key: "fleuves", type: "line", data: M.belgique_naturelle.lines, stroke: () => "var(--river)", width: 2, passive: true },
    ],
    legend: [["area", "rgba(90,90,90,.55)", "Régions industrielles"], ["line", "#2f8fd0", "Meuse et Escaut"]],
  },
  belgique_relief: {
    title: "Orohydrographie de la Belgique : reliefs et cours d’eau", base: "belgique", map: "belgique_relief",
    caption: "Schéma simplifié d’après la fiche Carte 13 · Tracés des rivières simplifiés (sauf Meuse et Escaut : Natural Earth).",
    layers: [
      { key: "zones", type: "area", data: M.belgique_relief.features, fill: f => ({ rel_basse: "#cfe8c2", rel_moyenne: "#f3e2b0", rel_haute: "#e3a66a" })[f.id], stroke: "none" },
      { key: "rivieres", type: "line", data: M.belgique_relief.lines, stroke: () => "var(--river)", width: f => ["meuse", "escaut", "sambre"].includes(f.id) ? 2.6 : 1.6 },
      { key: "reperes", type: "point", data: M.belgique_relief.points, color: f => f.group === "sommet" ? "#c0392b" : "#6b4a2b", r: f => f.group === "sommet" ? 6 : 4.5, stroke: "#fff", shape: f => f.group === "sommet" ? "tri" : "circle" },
    ],
    legend: [["area", "#cfe8c2", "Basse Belgique (moins de 100 m)"], ["area", "#f3e2b0", "Moyenne Belgique (100 à 200 m)"], ["area", "#e3a66a", "Haute Belgique (plus de 200 m)"], ["line", "#2f8fd0", "Cours d’eau"]],
  },
  rdc_situation: {
    title: "La RDC et ses voisins", base: "rdc", map: "rdc",
    caption: "Données Natural Earth (domaine public).",
    layers: [
      { key: "voisins", type: "area", data: M.rdc.neigh.filter(n => ["n_cog", "n_caf", "n_ssd", "n_uga", "n_rwa", "n_bdi", "n_tza", "n_zmb", "n_ago"].includes(n.id)), fill: () => "var(--neigh)", stroke: "var(--land-line)", group: "voisin", under: true },
      { key: "lacs", type: "area", data: M.rdc.lakes, fill: () => "var(--lake)", stroke: "var(--river)", width: .6 },
      { key: "villes", type: "point", data: M.rdc.cities.filter(c => c.group !== "etranger"), color: f => f.group === "capitale" ? "#c0392b" : "#232629", r: f => f.group === "capitale" ? 7 : f.group === "ville" ? 5.5 : 4, stroke: "#fff", shape: f => f.group === "capitale" ? "sq" : "circle" },
    ],
    showEquator: true,
    legend: [["sq", "#c0392b", "Capitale"], ["pt", "#232629", "Ville"], ["line", "#c0392b", "Équateur"], ["area", "#9ccbe8", "Lac"]],
  },
  rdc_ressources: {
    title: "Les ressources minières de la RDC", base: "rdc", map: "rdc",
    caption: "Schéma simplifié d’après la Carte 1 du dossier (Atlas du continent africain, 2000) et la Carte 3 (IPIS Research, 2022).",
    layers: [
      { key: "zones", type: "area", data: M.rdc.themes.ressources, fill: f => f.id === "stannifere" ? "rgba(93,173,226,.45)" : "rgba(39,174,96,.55)", stroke: f => f.id === "stannifere" ? "#2980b9" : "#1e7e46", width: 1.2 },
      { key: "mines", type: "point", data: M.rdc.mines, color: f => ({ coltan: "#8e44ad", etain: "#5dade2", or: "#f1c40f", cuivre: "#27ae60", diamant: "#95a5a6", petrole: "#6c3483", uranium: "#232629" })[f.group], r: 6, stroke: "#fff", shape: f => f.group === "diamant" ? "diamond" : f.group === "petrole" || f.group === "uranium" ? "tri" : "sq" },
      { key: "villes", type: "point", data: M.rdc.cities.filter(c => ["kinshasa", "lubumbashi", "mbujimayi", "kisangani", "goma", "bukavu"].includes(c.id)), color: f => f.group === "capitale" ? "#c0392b" : "#232629", r: 4.5, stroke: "#fff", passive: true },
    ],
    showEquator: true,
    legend: [["area", "rgba(93,173,226,.45)", "Région stannifère (étain, coltan)"], ["area", "rgba(39,174,96,.55)", "Ceinture cuprifère (cuivre, cobalt)"],
      ["sq", "#8e44ad", "Coltan"], ["sq", "#5dade2", "Étain"], ["sq", "#f1c40f", "Or"], ["sq", "#27ae60", "Cuivre et cobalt"], ["diamond", "#95a5a6", "Diamants"], ["tri", "#6c3483", "Pétrole"], ["tri", "#232629", "Uranium"]],
  },
  rdc_conflits: {
    title: "Une RDC marquée par les conflits", base: "rdc", map: "rdc",
    caption: "Schéma simplifié d’après les Cartes 2 (AFP, Acled 2023) et 3 (IPIS Research, 2022) du dossier.",
    layers: [
      { key: "provinces", type: "area", data: M.rdc.themes.kivu.filter(k => k.id !== "katanga_anc"), fill: () => "rgba(192,57,43,.12)", stroke: "#c0392b", width: 1.2, dash: () => "4 3" },
      { key: "violences", type: "bubbles", data: M.rdc.violences, passive: true },
      { key: "groupes", type: "point", data: M.rdc.groupes, color: () => "#232629", r: 6, stroke: "#fff", shape: () => "star" },
      { key: "villes", type: "point", data: M.rdc.cities.filter(c => ["kinshasa", "kisangani", "goma", "bukavu", "beni", "bunia", "lubumbashi"].includes(c.id)), color: f => f.group === "capitale" ? "#c0392b" : "#5d6873", r: 4, stroke: "#fff", passive: true },
    ],
    showEquator: true,
    legend: [["bubble", "rgba(192,57,43,.45)", "Décès liés aux violences en 2023 (plus le cercle est grand, plus il y a de morts)"], ["star", "#232629", "Zone d’action d’un groupe armé"], ["areaDash", "#c0392b", "Provinces de l’Ituri, du Nord-Kivu et du Sud-Kivu"]],
  },
  rdc_milieu: {
    title: "Le milieu physique de la RDC", base: "rdc", map: "rdc",
    caption: "Schémas simplifiés d’après les Cartes 4 à 9 du dossier (limites approximatives).",
    themes: [["relief", "Relief"], ["vegetation", "Végétation"], ["climat", "Climat"], ["sante", "Paludisme"], ["densite", "Densité"]],
    layers: [
      { key: "relief", type: "area", data: M.rdc.themes.relief, fill: f => ({ rel_cuvette: "#b9dba0", rel_plateaux: "#f2e2a4", rel_montagnes: "#b5743f", rel_katanga: "#dea464" })[f.id], stroke: "none", theme: "relief" },
      { key: "vegetation", type: "area", data: M.rdc.themes.vegetation, fill: f => ({ veg_foret: "#3f8f4f", veg_sav_boisee: "#a8c96a", veg_sav_herb: "#ebe39c", veg_montagne: "#8f7155" })[f.id], stroke: "none", theme: "vegetation" },
      { key: "climat", type: "area", data: M.rdc.themes.climat, fill: f => ({ cl_equatorial: "#1f4e9c", cl_tropical: "#93b7e8", cl_montagne: "#c08fd0" })[f.id], stroke: "none", theme: "climat" },
      { key: "sante", type: "area", data: M.rdc.themes.sante, fill: () => "rgba(224,86,200,.6)", stroke: "#a0309a", theme: "sante" },
      { key: "densite", type: "area", data: M.rdc.themes.densite, fill: () => "#4a4f55", stroke: "none", theme: "densite" },
      { key: "volcans", type: "point", data: M.rdc.volcans, color: f => f.group === "volcan" ? "#c0392b" : "#6b4a2b", r: 6, stroke: "#fff", shape: () => "tri", theme: "relief" },
      { key: "villes", type: "point", data: M.rdc.cities.filter(c => ["kinshasa", "goma", "kisangani", "lubumbashi"].includes(c.id)), color: () => "#232629", r: 4, stroke: "#fff", passive: true },
    ],
    showEquator: true,
    legends: {
      relief: [["area", "#b9dba0", "Cuvette centrale (300 à 500 m)"], ["area", "#f2e2a4", "Plateaux et collines (500 à 1000 m)"], ["area", "#b5743f", "Montagnes de l’Est"], ["area", "#dea464", "Hauts plateaux du Katanga (plus de 1500 m)"], ["tri", "#c0392b", "Volcan actif"]],
      vegetation: [["area", "#3f8f4f", "Forêt équatoriale"], ["area", "#a8c96a", "Savane boisée"], ["area", "#ebe39c", "Savane herbeuse"], ["area", "#8f7155", "Végétation de montagne"]],
      climat: [["area", "#1f4e9c", "Climat équatorial (pluies toute l’année)"], ["area", "#93b7e8", "Climat tropical (une saison sèche)"], ["area", "#c08fd0", "Climat des montagnes"]],
      sante: [["area", "rgba(224,86,200,.6)", "Paludisme transmis toute l’année"]],
      densite: [["area", "#4a4f55", "Fortes densités de population"]],
    },
  },
  afrique: {
    title: "La RDC en Afrique", base: "afrique", map: "afrique",
    caption: "Projection azimutale équivalente · Données Natural Earth.",
    layers: [], legend: [["area", "#e67e22", "République démocratique du Congo"], ["line", "#c0392b", "Équateur"], ["line", "#e67e22", "Tropiques"]],
  },
  paris: {
    title: "Paris : les fonctions d’une grande ville européenne", base: "paris", map: "paris",
    caption: "Plan schématique d’après la fiche Carte 14 (emplacements simplifiés).",
    layers: [
      { key: "quartiers", type: "area", data: M.paris.quartiers, fill: f => f.id === "q_ministeres" ? "rgba(231,128,108,.65)" : "rgba(245,196,66,.7)", stroke: "none" },
      { key: "lieux", type: "point", data: M.paris.points, color: f => ({ politique: "#232629", economique: "#d7301f", culturelle: "#16a085", monument: "#8e44ad", transport: "#5d6873" })[f.group], r: 7, stroke: "#fff",
        shape: f => ({ politique: "star", economique: "circle", culturelle: "circle", monument: "sq", transport: "rail" })[f.group] },
    ],
    legend: [["area", "rgba(231,128,108,.65)", "Quartier des ministères"], ["area", "rgba(245,196,66,.7)", "Quartier des ambassades"], ["star", "#232629", "Institution politique nationale"],
      ["pt", "#d7301f", "Commandement économique et financier"], ["line", "#d7301f", "Axe des affaires"], ["pt", "#16a085", "Institution culturelle"], ["sq", "#8e44ad", "Monument, musée"],
      ["sq", "#5d6873", "Gare"], ["line", "#c0392b", "Boulevard périphérique"]],
  },
};

export const ATLAS = [
  { part: "Le monde", items: ["monde_continents", "monde_population", "monde_climats", "monde_biomes"] },
  { part: "L’Europe", items: ["europe_ue", "europe_villes", "europe_relief", "europe_climats", "europe_biomes", "paris"] },
  { part: "La Belgique", items: ["belgique_regions", "belgique_communautes", "belgique_provinces", "belgique_population", "belgique_naturelle", "belgique_relief"] },
  { part: "La RDC", items: ["afrique", "rdc_situation", "rdc_ressources", "rdc_conflits", "rdc_milieu"] },
];

// Éléments interrogeables d'une scène
export function sceneItems(id) {
  const sc = SCENES[id]; if (!sc) return [];
  const out = [];
  sc.layers.forEach(l => {
    if (l.passive || l.type === "raw" || l.type === "bubbles") return;
    (l.data || []).forEach(f => { if (f.name) out.push({ id: f.id, name: f.name, group: f.group, layer: l.key, kind: l.type, theme: l.theme }); });
  });
  if (id === "afrique") M.afrique.countries.filter(c => c.afr).forEach(c => out.push({ id: c.id, name: c.name, layer: "pays", kind: "area" }));
  return out;
}
