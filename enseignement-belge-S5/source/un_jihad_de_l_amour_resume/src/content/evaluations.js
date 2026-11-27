import { TEXTES, textOf } from "./textes.js";
import { SCHEMA_LIVRE, RESUMES_LIVRE } from "./livre.js";

const tx = id => TEXTES.find(t => t.id === id);
const doc = id => { const t = tx(id); return { lab: "Texte : « " + t.titre + " »", t: textOf(t), src: t.auteur + ", " + t.source + ". Texte d’entraînement écrit pour cette application." }; };
const schemaTxt = s => ["Thème : " + s.theme, "Thèse : " + s.these, ...s.args.map((a, i) => "Argument " + (i + 1) + " : " + a.arg + (a.expl.length ? " Explication : " + a.expl[0] : "") + (a.ex.length ? " Exemple : " + a.ex[0] : "")), ...(s.contre ? [s.contre] : [])];

export const EVALUATIONS = [
  {
    id: "e-livre", titre: "Examen blanc 1 · Un jihad de l’amour : schéma et résumé", type: "Production 1 (le livre)", duree: "100 min", total: 40,
    consignes: "Tu as lu Un jihad de l’amour de Mohamed El Bachiri. Réalise d’abord le schéma argumentatif du livre (fiche p. 78), puis rédige son résumé en 200 mots maximum (fiche p. 86), pour un lecteur de ton âge qui n’a pas lu le livre. Indique le nombre de mots au bas de ta copie.",
    docs: [],
    questions: [
      { part: "Partie 1 · Le schéma", q: "Formule le thème du livre.", pts: 2, lignes: 2, corrige: ["Thème : " + SCHEMA_LIVRE.theme], bareme: "2 pts : sujet neutre qui englobe tout le livre. 1 pt : thème trop étroit (la mort de Loubna, Molenbeek). 0 pt : une thèse ou un résumé du récit." },
      { q: "Formule la thèse du livre.", pts: 4, lignes: 3, corrige: ["Thèse : " + SCHEMA_LIVRE.these], bareme: "4 pts : opinion complète, avec le sens de « jihad de l’amour » (effort sur soi, refus de la haine et de la vengeance). 2 pts : « il faut répondre à la haine par l’amour » sans explication. 0 pt : contresens." },
      { q: "Repère deux passages qui ont une autre fonction que la fonction argumentative et précise cette fonction.", pts: 4, lignes: 4, corrige: SCHEMA_LIVRE.autres, bareme: "2 pts par passage correctement identifié avec sa fonction (raconter, émouvoir, rendre hommage, rendre l’auteur crédible)." },
      { q: "Complète le schéma : les arguments, avec pour chacun une explication et un exemple.", pts: 10, lignes: 14, corrige: SCHEMA_LIVRE.args.map((a, i) => "A" + (i + 1) + " : " + a.arg + " → " + a.expl[0] + " → Ex. : " + a.ex[0]), bareme: "2 pts par argument : 1 pt pour l’argument reformulé, 0,5 pt pour l’explication, 0,5 pt pour un exemple bien rattaché. On accepte d’autres regroupements s’ils sont fidèles et justifiés." },
      { part: "Partie 2 · Le résumé", q: "Rédige le résumé du livre en 200 mots maximum.", pts: 20, lignes: 18, corrige: RESUMES_LIVRE[1].paras, bareme: "Pertinence (thèse + arguments, sans anecdotes) : 6 pts. Fidélité (aucun contresens, aucun avis) : 4 pts. Énonciation et attribution (3e personne, nom de famille, verbes introducteurs) : 3 pts. Organisation (intro avec source, un paragraphe par argument, connecteurs) : 4 pts. Langue : 3 pts. Plus de 220 mots : résumé non recevable (moitié des points au maximum)." },
    ],
  },
  {
    id: "e-ia", titre: "Examen blanc 2 · Texte inconnu : l’IA à l’école", type: "Production 2 (texte non exploité en classe)", duree: "50 min", total: 30,
    consignes: "Lis le texte ci-dessous. Réalise son schéma argumentatif, puis rédige son résumé en 120 mots maximum pour un lecteur de ton âge qui n’a pas lu le texte. Indique le nombre de mots.",
    docs: [doc("t6")],
    questions: [
      { q: "Thème et thèse du texte.", pts: 4, lignes: 3, corrige: ["Thème : " + tx("t6").schema.theme, "Thèse : " + tx("t6").schema.these], bareme: "2 + 2 pts." },
      { q: "Quelle est la fonction des deux premières phrases du texte ?", pts: 2, lignes: 2, corrige: ["La première présente le contexte (autre fonction) ; la deuxième est une concession : l’auteur admet que la crainte de la tricherie est compréhensible avant d’exposer sa thèse."], bareme: "1 pt par fonction juste." },
      { q: "Réalise le schéma argumentatif complet (arguments, explications, exemples, contre-argument et réfutation).", pts: 10, lignes: 12, corrige: schemaTxt(tx("t6").schema), bareme: "2 pts par argument complet (argument, explication, exemple) ; 2 pts pour le contre-argument et sa réfutation ; 2 pts pour la reformulation." },
      { q: "Rédige le résumé (120 mots maximum).", pts: 14, lignes: 12, corrige: tx("t6").resume.texte, bareme: "Pertinence : 4 pts. Fidélité : 3 pts. Énonciation (Verbeke, verbes introducteurs) : 2 pts. Organisation et connecteurs : 3 pts. Langue : 2 pts. Au-delà de 132 mots : moitié des points au maximum." },
    ],
  },
  {
    id: "e-justice", titre: "Examen blanc 3 · Texte inconnu : justice et vengeance", type: "Production 2 (texte non exploité en classe)", duree: "50 min", total: 30,
    consignes: "Ce texte aborde un thème proche du livre. Réalise son schéma argumentatif, puis rédige son résumé en 120 mots maximum pour un lecteur de ton âge. Indique le nombre de mots.",
    docs: [doc("t7")],
    questions: [
      { q: "Thème et thèse du texte.", pts: 4, lignes: 3, corrige: ["Thème : " + tx("t7").schema.theme, "Thèse : " + tx("t7").schema.these], bareme: "2 + 2 pts." },
      { q: "Réalise le schéma argumentatif complet.", pts: 10, lignes: 12, corrige: schemaTxt(tx("t7").schema), bareme: "2 pts par argument complet ; 2 pts pour le contre-argument et la réfutation ; 2 pts pour la reformulation." },
      { q: "Rédige le résumé (120 mots maximum).", pts: 14, lignes: 12, corrige: tx("t7").resume.texte, bareme: "Pertinence : 4 pts. Fidélité : 3 pts. Énonciation : 2 pts. Organisation : 3 pts. Langue : 2 pts." },
      { q: "Quel argument de ce texte rejoint un argument d’Un jihad de l’amour ? Justifie en deux phrases.", pts: 2, lignes: 3, corrige: ["« La vengeance n’a pas de fin » rejoint l’argument A1 d’El Bachiri : répondre à la violence par la violence reproduit le mal. Les deux textes rejettent aussi la peine de mort."], bareme: "1 pt pour le rapprochement, 1 pt pour la justification." },
    ],
  },
];
