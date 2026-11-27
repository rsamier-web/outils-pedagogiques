// Version texte brut des contenus de l'application, lisible par un assistant IA (l'application elle-même est en JavaScript).
import { METHODE } from "./src/content/methode.js";
import { SCHEMA_LIVRE, MOUVEMENTS, FRAGMENTS, TRADUCTIONS, FICHE, RESUMES_LIVRE, PIEGES_LIVRE } from "./src/content/livre.js";
import { TEXTES, textOf } from "./src/content/textes.js";
import { THEMES } from "./src/content/themes.js";

const clean = s => String(s).replace(/\[\[([^\]|]+)\|([^\]]+)\]\]/g, "$2").replace(/\[\[([^\]]+)\]\]/g, "$1").replace(/\*\*/g, "");
export async function genContexte() {
  const L = [];
  const h = t => L.push("", "=".repeat(70), t, "=".repeat(70));
  L.push("UN JIHAD DE L’AMOUR · SCHÉMA ET RÉSUMÉ · CONTEXTE POUR ASSISTANT IA",
    "Application pour élèves de 5e secondaire (enseignement belge francophone, UAA 2).",
    "Application : https://rsamier-web.github.io/outils-pedagogiques/enseignement-belge-S5/un_jihad_de_l_amour_resume.html",
    "Rôle attendu de l’IA : donner un retour constructif sur les productions des élèves (schéma, résumé, texte argumentatif), sans faire le travail à leur place.",
    "Le livre n’est pas reproduit : les analyses ci-dessous sont des reformulations (faites à partir des éditions néerlandaise et anglaise).");
  h("1. MÉTHODE (fiches du cours p. 78 : schéma ; p. 86 : résumé)");
  METHODE.forEach(l => { L.push("", "## " + l.titre); l.pages.forEach(p => { L.push("- " + p.titre + " : " + p.blocs.map(clean).join(" ")); if (p.retenir) L.push("  À retenir : " + p.retenir.map(clean).join(" ")); }); });
  h("2. LE LIVRE");
  FICHE.forEach(([k, v]) => L.push(k + " : " + v));
  L.push("", "Mouvements :"); MOUVEMENTS.forEach(m => L.push(m.id + ". " + m.t + " : " + m.d));
  L.push("", "Fragments (titre traduit · fonction · argument · contenu) :"); FRAGMENTS.forEach(f => L.push("- " + f.t + " (" + f.nl + " / " + f.en + ") · " + f.f + " · " + (f.a.join(", ") || "—") + " · " + f.d));
  L.push("", "SCHÉMA ARGUMENTATIF DE RÉFÉRENCE", "Thème : " + SCHEMA_LIVRE.theme, "Thèse : " + SCHEMA_LIVRE.these);
  SCHEMA_LIVRE.args.forEach(a => { L.push(a.id + " · " + a.arg, "   Explications : " + a.expl.join(" "), "   Exemples : " + a.ex.join(" "), "   Fragments : " + a.fragments.join(", ")); });
  L.push("Conclusion du livre : " + SCHEMA_LIVRE.conclusion, "Passages à autre fonction : " + SCHEMA_LIVRE.autres.join(" "));
  L.push("", "Pièges du résumé du livre :"); PIEGES_LIVRE.forEach(p => L.push("- " + p));
  RESUMES_LIVRE.forEach(r => L.push("", r.titre + " :", r.paras.join("\n")));
  L.push("", "Ce que révèle la comparaison des traductions :"); TRADUCTIONS.forEach(t => L.push("- " + t.t + " : " + t.d + " Leçon : " + t.lecon));
  h("3. TEXTES D’ENTRAÎNEMENT (écrits pour l’application, auteurs fictifs) ET CORRIGÉS");
  TEXTES.forEach(t => {
    L.push("", "## " + t.id + " · « " + t.titre + " » · " + t.auteur + ", " + t.source + " · niveau " + t.niveau, textOf(t), "", "Schéma corrigé :", "Thème : " + t.schema.theme, "Thèse : " + t.schema.these);
    t.schema.args.forEach((a, i) => L.push("Argument " + (i + 1) + " : " + a.arg + " | Explication : " + a.expl.join(" ") + " | Exemple : " + (a.ex.join(" ") || "—")));
    if (t.schema.contre) L.push(t.schema.contre);
    L.push("Résumé modèle (" + t.resume.max + " mots max) : " + t.resume.texte.join(" "));
  });
  h("4. BIBLIOTHÈQUE DE THÈMES ET D’ARGUMENTS FRÉQUENTS");
  THEMES.forEach(t => { L.push("", "## " + t.titre + (t.cess ? " (CESS " + t.cess + ")" : ""), "Sujets : " + t.sujets.join(" / "), "Pour : " + t.pour.map(a => a[0] + " (ex. : " + a[1] + ")").join(" ; "), "Contre : " + t.contre.map(a => a[0] + " (ex. : " + a[1] + ")").join(" ; ")); });
  return L.join("\n") + "\n";
}
