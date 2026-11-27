// Consigne (prompt) à coller dans une IA pour obtenir un retour constructif sur une production d'élève.
export const APP_URL = "https://rsamier-web.github.io/outils-pedagogiques/enseignement-belge-S5/un_jihad_de_l_amour_resume.html";
export const CTX_URL = "https://rsamier-web.github.io/outils-pedagogiques/enseignement-belge-S5/un_jihad_de_l_amour_resume_contexte_ia.txt";

const METHODE_COURTE = [
  "Fiche « méthodologie du schéma » (p. 78) : 1. lire et comprendre ; 2. repérer le thème (sujet) et la thèse (idée défendue) ; 3. repérer les parties qui ont une autre fonction que la fonction argumentative ; 4. repérer les arguments et les exemples ; 5. tracer le schéma (hiérarchiser, reformuler) selon la structure A. thème, B. thèse, C. arguments, D. explications/développement, E. exemples ; 6. rédiger le résumé.",
  "Fiche « méthodologie du résumé » (p. 86) : changer d’énonciateur (3e personne) ; attribuer les propos à l’auteur par son nom de famille ou prénom + nom (jamais le prénom seul) ; hiérarchiser selon l’ordre du schéma : introduction (source : auteur, titre, date ; thème ; thèse), puis un paragraphe par argument, organisé par des connecteurs logiques adéquats ; pas d’exemple sauf s’il est indispensable ; neutralité (transmettre l’avis de l’auteur, pas le sien) ; reformulation obligatoire sans transformer les propos ; intelligibilité et recevabilité (précision, anaphores correctes, verbes introducteurs adéquats ; respect du nombre de mots et du destinataire : un lecteur qui n’a pas lu le texte).",
].join("\n");

export function countW(s) {
  return (String(s || "").replace(/[’']/g, " ").match(/[A-Za-zÀ-ÖØ-öø-ÿœŒæÆ0-9]+(?:-[A-Za-zÀ-ÖØ-öø-ÿœŒ]+)*/g) || []).length;
}

export function buildPrompt({ tache, consigne, max, source, reference, production, criteres }) {
  const n = countW(production);
  const parts = [
    "Tu es professeur de français dans l’enseignement secondaire belge francophone (Fédération Wallonie-Bruxelles), en 5e secondaire. Compétence travaillée : UAA 2, réduire et résumer un texte argumentatif, et en réaliser le schéma. Tu aides un élève de 16-17 ans à progresser, avec bienveillance et exigence.",
    "",
    "Contexte : l’élève prépare un examen où il doit fournir le schéma argumentatif et le résumé du livre « Un jihad de l’amour » de Mohamed El Bachiri (avec David Van Reybrouck, 2017), puis faire le même exercice sur un texte argumentatif non étudié en classe. Il applique deux fiches de méthode :",
    METHODE_COURTE,
    "Toutes les ressources (méthode, analyse du livre, textes d’entraînement et corrigés) sont disponibles en texte brut ici : " + CTX_URL + " (application : " + APP_URL + ").",
    "",
    "TÂCHE DE L’ÉLÈVE : " + tache,
    consigne ? "CONSIGNE : " + consigne : null,
    max ? "LONGUEUR MAXIMALE : " + max + " mots (la production compte " + n + " mots)." : "LONGUEUR DE LA PRODUCTION : " + n + " mots.",
  ];
  if (source) parts.push("", "TEXTE SOURCE :", "\"\"\"", source, "\"\"\"");
  if (reference && reference.length) parts.push("", "REPÈRES DE CORRECTION (pour toi ; ne les recopie pas à l’élève, sers-t’en pour vérifier la fidélité et la pertinence) :", ...reference.map(r => "- " + r));
  if (criteres && criteres.length) parts.push("", "CRITÈRES DE RÉUSSITE ANNONCÉS À L’ÉLÈVE :", ...criteres.map(r => "- " + r));
  parts.push("", "PRODUCTION DE L’ÉLÈVE :", "\"\"\"", String(production || "").trim() || "(vide)", "\"\"\"", "",
    "CE QUE J’ATTENDS DE TOI :",
    "1. Commence par deux points forts précis, en citant l’élève.",
    "2. Évalue la production selon ces critères : pertinence (essentiel gardé, accessoire supprimé), fidélité (pas de contresens ni d’avis personnel), énonciation et attribution (3e personne, nom de l’auteur, verbes introducteurs), organisation (introduction, un paragraphe par argument, connecteurs), intelligibilité, respect du nombre de mots, correction de la langue.",
    "3. Donne au maximum trois priorités d’amélioration, classées de la plus importante à la moins importante, en citant chaque fois le passage concerné.",
    "4. Ne réécris pas la production à la place de l’élève : pose-lui des questions qui le font réfléchir, et propose au plus une phrase reformulée comme modèle.",
    "5. Termine par une note indicative sur 20 et une question qui l’aide à commencer sa correction.",
    "Réponds en français, avec des phrases courtes et claires, sans jargon inutile.");
  return parts.filter(x => x != null).join("\n");
}

export async function copyText(text) {
  try { if (navigator.clipboard && navigator.clipboard.writeText) { await navigator.clipboard.writeText(text); return true; } } catch (e) { /* on essaie autrement */ }
  try {
    const ta = document.createElement("textarea"); ta.value = text; ta.style.position = "fixed"; ta.style.opacity = "0";
    document.body.appendChild(ta); ta.select(); const ok = document.execCommand("copy"); document.body.removeChild(ta); return ok;
  } catch (e) { return false; }
}
