import { GLOSSAIRE, THEMES_G } from "./glossaire.js";
import { sceneItems } from "../scenes.js";

// Questions-réponses sur les notions et concepts (rappel actif)
const NOTIONS = [
  ["Quels sont les deux métaux extraits du coltan ?", "Le niobium et le tantale."],
  ["À quoi sert le tantale ?", "À fabriquer des condensateurs (téléphones, ordinateurs, consoles)."],
  ["Quelle part des réserves mondiales de coltan se trouve au Kivu ?", "Entre 60 et 80 %."],
  ["Cite les autres pays qui ont des réserves de coltan (dossier).", "Australie, Brésil, Canada, Espagne, Venezuela, Chine."],
  ["Combien de morts la guerre en RDC a-t-elle faits ?", "Plus de 6 millions : un des conflits les plus meurtriers depuis 1945."],
  ["Quels pays voisins ont été mis en cause par l’ONU (2015) ?", "L’Ouganda, le Rwanda et le Burundi (qui ont nié)."],
  ["Combien l’armée rwandaise aurait-elle retiré du trafic de coltan entre 1998 et 2000 ?", "250 millions de dollars."],
  ["Qui contrôle la mine de Rubaya depuis avril 2024 ? Combien rapporte-t-elle ?", "Le M23 ; environ 300 000 $ par mois."],
  ["Quels sont les « 3T » ?", "Tin (étain), tantale, tungstène ; avec l’or : minerais des conflits."],
  ["Quel pourcentage de Congolais vit avec moins de 2 $ par jour ?", "Plus de 70 %."],
  ["CODECO : où ? quoi ?", "Ituri ; ancienne coopérative agricole (1970), milice qui prétend défendre les Lendu contre les Hema."],
  ["ADF : où ? quoi ?", "Beni (Nord-Kivu) et Ituri ; fondées en Ouganda fin des années 1990 ; veulent un État islamique."],
  ["FDLR : qui ?", "Groupe surtout composé de Hutu rwandais, dont d’anciens militaires du régime renversé en 1994 ; présent depuis 2000."],
  ["M23 : origine du nom ?", "Mouvement du 23 mars, né après la rupture de l’accord de paix du 23 mars 2009."],
  ["Maï-Maï Kata Katanga : objectif ?", "L’indépendance du Katanga ; revenus tirés de mines d’or."],
  ["Que s’est-il passé à Goma le 27 janvier 2025 ?", "La ville a été prise par l’alliance AFC/M23."],
  ["Accord de Washington : date et signataires ?", "27 juin 2025, entre la RDC et le Rwanda."],
  ["Altitude de la cuvette centrale ?", "300 à 500 m."],
  ["Deux volcans actifs près de Goma ?", "Le Nyiragongo et le Nyamuragira."],
  ["Quatre lacs du Rift à l’est de la RDC ?", "Albert, Édouard, Kivu, Tanganyika."],
  ["Les 4 villes secondaires du croquis ?", "Lubumbashi, Mbuji-Mayi, Kisangani, Goma."],
  ["Goma : coordonnées et altitude ?", "Environ 1° 41′ S, 29° 13′ E ; environ 1500 m."],
  ["Différence entre situer et localiser ?", "Situer : par rapport à de grands repères, petite échelle. Localiser : position précise, grande échelle."],
  ["Les 5 informations d’une carte ?", "Titre, légende, orientation, échelle, source."],
  ["Les 3 informations d’un titre ?", "Sujet, lieu, date."],
  ["Point, ligne, surface : à quoi servent-ils ?", "Point : un lieu · Ligne : une limite, un trajet · Surface : un espace."],
  ["Les 6 continents ?", "Amérique, Europe, Afrique, Asie, Océanie, Antarctique."],
  ["Les océans de la carte 1 ?", "Pacifique, Atlantique, Indien, Arctique, Antarctique (Austral)."],
  ["Latitude des tropiques et des cercles polaires ?", "Tropiques : 23° N et S · Cercles polaires : 66° N et S."],
  ["Les 7 foyers de population, dans l’ordre ?", "Asie de l’Est, Asie du Sud, Indonésie, Europe, Grands Lacs, golfe de Guinée, Nord-Est des États-Unis."],
  ["4 contraintes qui expliquent les espaces vides ?", "Le froid, l’aridité, l’altitude, la forêt dense."],
  ["Les 3 climats chauds ?", "Équatorial, tropical, désertique."],
  ["Les 3 climats tempérés ?", "Océanique, continental, méditerranéen."],
  ["Que fait l’altitude à la température ?", "Elle la fait baisser (environ −6 °C tous les 1000 m)."],
  ["Qu’est-ce que la continentalité ?", "Loin de la mer : hivers plus froids, étés plus chauds, pluies plus faibles."],
  ["Biome sous climat équatorial ?", "La forêt tropicale humide (équatoriale)."],
  ["Biome sous climat tropical ?", "La savane."],
  ["Biome des régions continentales froides ?", "La taïga (conifères)."],
  ["Biome des régions polaires ?", "La toundra (mousses, lichens, permafrost)."],
  ["Deux formations végétales méditerranéennes ?", "La garrigue (basse, clairsemée) et le maquis (dense, plus haut)."],
  ["Combien d’États membres dans l’UE ?", "27."],
  ["Quand le Royaume-Uni a-t-il quitté l’UE ?", "Le 31 janvier 2020 (Brexit)."],
  ["Pays candidats en négociation avec l’UE ?", "Turquie, Monténégro, Serbie, Albanie, Macédoine du Nord, Ukraine, Moldavie, Bosnie-Herzégovine."],
  ["Les 15 aires urbaines européennes ?", "Moscou, Londres, Paris, Madrid, Barcelone, Milan, Berlin, Saint-Pétersbourg, Rome, Naples, Athènes, Kiev, Lisbonne, Manchester, Birmingham."],
  ["Les 4 aires urbaines périphériques autour de la Belgique ?", "Lille, Maastricht, Aix-la-Chapelle, Luxembourg."],
  ["Les 7 aires urbaines belges ?", "Bruxelles, Anvers, Gand, Charleroi, Liège, Bruges, Namur."],
  ["Les 3 Régions belges ?", "Flamande, wallonne, Bruxelles-Capitale."],
  ["Les 3 Communautés belges ?", "Flamande, française (Fédération Wallonie-Bruxelles), germanophone."],
  ["Régions ou Communautés : qui gère l’enseignement ?", "Les Communautés (compétences liées aux personnes)."],
  ["Date de la frontière linguistique ?", "1962-1963."],
  ["Les 5 provinces wallonnes ?", "Hainaut, Brabant wallon, Namur, Liège, Luxembourg."],
  ["Les 5 provinces flamandes ?", "Flandre-Occidentale, Flandre-Orientale, Anvers, Limbourg, Brabant flamand."],
  ["Point culminant de la Belgique ?", "Le Signal de Botrange (694 m), plateau des Hautes Fagnes."],
  ["Où la Sambre rejoint-elle la Meuse ?", "À Namur."],
  ["Les 3 étages du relief belge ?", "Basse Belgique (< 100 m), Moyenne Belgique (100-200 m), Haute Belgique (> 200 m)."],
  ["Plus long fleuve d’Europe ?", "La Volga."],
  ["Chaîne qui sépare l’Europe de l’Asie ?", "L’Oural."],
  ["Les 4 fonctions urbaines de Paris (carte 14) ?", "Politique, économique, culturelle, transports et communication."],
  ["Le quartier d’affaires de Paris ?", "La Défense, à l’ouest, relié au centre par l’axe des affaires."],
];

const slug = s => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "_").slice(0, 40);

// Paquets de cartes « carte » : élément surligné → nom
const MAPDECKS = [
  { id: "carte_monde", t: "Cartes · Monde", parts: [["monde_continents", ["continents", "oceans", "lignes"]], ["monde_population", ["zones"]]] },
  { id: "carte_europe", t: "Cartes · Europe", parts: [["europe_ue", ["pays"], it => it.group !== "hors" || ["pays_nor", "pays_che", "pays_isl", "pays_rus"].includes(it.id)], ["europe_villes", ["villes"]], ["europe_relief", ["reliefs", "fleuves"]]] },
  { id: "carte_belgique", t: "Cartes · Belgique", parts: [["belgique_regions", ["regions", "villes"], it => it.layer !== "villes" || ["bruxelles", "anvers", "gand", "charleroi", "liege", "bruges", "namur", "mons", "arlon", "hasselt", "louvain", "wavre", "eupen"].includes(it.id)], ["belgique_provinces", ["provinces"]], ["belgique_communautes", ["communautes"]], ["belgique_naturelle", ["regions"]], ["belgique_relief", ["rivieres", "reperes"]]] },
  { id: "carte_rdc", t: "Cartes · RDC", parts: [["rdc_situation", ["voisins", "lacs", "villes"]], ["rdc_conflits", ["groupes"]]] },
];

export function buildDecks() {
  const decks = [];
  Object.entries(THEMES_G).forEach(([th, t]) => {
    decks.push({ id: "voc_" + th, t: "Vocabulaire · " + t, kind: "voc",
      cards: GLOSSAIRE.filter(g => g.theme === th).map(g => ({ id: "v_" + g.id, front: g.terme, back: g.def, ex: g.ex, kind: "voc" })) });
  });
  decks.push({ id: "notions", t: "Notions et chiffres clés", kind: "qa", cards: NOTIONS.map(([q, a]) => ({ id: "n_" + slug(q), front: q, back: a, kind: "qa" })) });
  MAPDECKS.forEach(md => {
    const cards = [];
    md.parts.forEach(([scene, layers, filter]) => {
      sceneItems(scene).filter(it => layers.includes(it.layer) && (!filter || filter(it))).forEach(it => {
        cards.push({ id: "m_" + scene + "_" + it.id, kind: "map", scene, item: it.id, layer: it.layer, front: "Qu’est-ce qui est surligné sur la carte ?", back: it.name });
      });
    });
    decks.push({ id: md.id, t: md.t, kind: "map", cards });
  });
  return decks;
}
