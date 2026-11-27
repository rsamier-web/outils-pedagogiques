import { GLOSSAIRE } from "./glossaire.js";
import { SCHEMA_LIVRE } from "./livre.js";
import { THEMES } from "./themes.js";

const NOTIONS_METHODE = [
  ["Quelle est la différence entre thème et thèse ?", "Le thème est le sujet (sans avis) ; la thèse est l’opinion défendue sur ce sujet."],
  ["Comment distinguer un argument d’un exemple ?", "L’argument est général et répond à « pourquoi ? » ; l’exemple est particulier (nom, lieu, date, chiffre) et répond à « par exemple ? »."],
  ["Quelles sont les 6 étapes de la procédure du schéma (p. 78) ?", "1. Lire et comprendre. 2. Repérer thème et thèse. 3. Repérer les parties qui ont une autre fonction. 4. Repérer arguments et exemples. 5. Tracer le schéma (hiérarchiser, reformuler). 6. Rédiger le résumé."],
  ["Quelle est la structure du schéma, de A à E ?", "A. Thème · B. Thèse · C. Arguments · D. Explications (développement) · E. Exemples."],
  ["Où place-t-on le contre-argument dans le schéma ?", "Dans une case à part, sous la thèse, avec la réfutation de l’auteur."],
  ["Trois techniques pour reformuler ?", "Raccourcir, généraliser, nominaliser (sans changer le sens)."],
  ["Comment remonter d’un exemple à l’argument ?", "En se demandant : « qu’est-ce que cet exemple prouve ? », et en formulant la réponse de façon générale."],
  ["Que contient l’introduction d’un résumé ?", "La source (auteur, titre, date, genre), le thème et la thèse."],
  ["Comment organise-t-on le développement d’un résumé ?", "Dans l’ordre du schéma : un paragraphe (ou une phrase) par argument, reliés par des connecteurs logiques."],
  ["À quelle personne rédige-t-on un résumé ?", "À la 3e personne : on change d’énonciateur."],
  ["Comment désigne-t-on l’auteur dans le résumé ?", "Par son nom de famille, ou son prénom et son nom ; jamais par son prénom seul."],
  ["Garde-t-on les exemples dans un résumé ?", "En général non : on garde l’idée. Un exemple seulement s’il est indispensable pour comprendre."],
  ["Que signifie « neutralité » dans un résumé ?", "On transmet l’avis de l’auteur sans donner le sien."],
  ["Quels sont les critères d’un bon résumé ?", "Pertinence, fidélité, intelligibilité, recevabilité (consigne), correction de la langue."],
  ["Cite trois erreurs fréquentes dans un résumé.", "Recopier, garder les exemples à la place des arguments, donner son avis (aussi : dépasser le nombre de mots, résumer mécaniquement)."],
  ["Comment déplier une ligne de schéma en paragraphe ?", "Argument (connecteur d’énumération) → explication (en effet) → exemple (par exemple) → lien avec la thèse."],
  ["Que contient la conclusion d’un texte argumentatif ?", "La thèse reformulée (avec un bilan des arguments) et une ouverture."],
  ["Qu’est-ce que la recevabilité ?", "Le respect de la consigne : nombre de mots, destinataire, forme demandée."],
  ["Qu’est-ce que l’intelligibilité ?", "Un lecteur qui n’a pas lu le texte source comprend tout le résumé."],
  ["Comment résume-t-on un livre fait de fragments ?", "On lit par mouvements, on regroupe les fragments qui défendent la même idée (plusieurs fragments = un argument) et on écarte récits et textes lyriques."],
];

const VERBES = [
  ["Verbe pour montrer que l’auteur admet une part de l’avis adverse ?", "Admettre, concéder, reconnaître."],
  ["Verbe pour une critique ?", "Dénoncer, critiquer, déplorer, regretter, condamner."],
  ["Verbe pour une affirmation forte ?", "Affirmer, soutenir, défendre l’idée que, être convaincu que."],
  ["Verbe pour un appel à agir ?", "Appeler à, inviter à, exhorter, encourager."],
  ["Verbe pour répondre à un contre-argument ?", "Réfuter, contester, rejeter, objecter."],
  ["Verbe pour une idée importante ?", "Souligner, insister sur, rappeler, mettre en évidence."],
  ["Verbe pour une opinion personnelle prudente ?", "Estimer, considérer, penser, juger."],
  ["Connecteurs pour annoncer un nouvel argument ?", "D’abord, ensuite, de plus, en outre, par ailleurs, enfin."],
  ["Connecteurs pour une explication ?", "En effet, car, puisque, c’est-à-dire."],
  ["Connecteurs pour un exemple ?", "Par exemple, ainsi, notamment, comme en témoigne."],
  ["Connecteurs pour une opposition ?", "Mais, cependant, pourtant, toutefois, en revanche."],
  ["Connecteurs pour une concession ?", "Certes… mais, bien que, même si, il est vrai que… cependant."],
  ["Connecteurs pour une conséquence ?", "Donc, ainsi, c’est pourquoi, par conséquent, dès lors."],
  ["Connecteurs pour conclure ?", "En somme, en définitive, bref, en conclusion, finalement."],
];

const LIVRE_QA = [
  ["Qui a écrit Un jihad de l’amour, et avec qui ?", "Mohamed El Bachiri, avec David Van Reybrouck (propos recueillis et organisés), 2017."],
  ["Que s’est-il passé le 22 mars 2016 ?", "Des attentats à l’aéroport de Zaventem et au métro Maelbeek, à Bruxelles ; Loubna Lafquiri, l’épouse de l’auteur, est tuée dans le métro."],
  ["Quel était le métier de l’auteur ?", "Conducteur de métro à Bruxelles."],
  ["Pourquoi l’auteur est-il à la fois victime et « suspect » aux yeux de certains ?", "Il a perdu sa femme, mais il est musulman et vient de Molenbeek, commune stigmatisée après les attentats."],
  ["Quel est le genre du livre ?", "Un essai-témoignage, en fragments courts mêlant récit, poésie et argumentation."],
  ["Dans quelle langue le livre est-il d’abord paru ?", "En néerlandais (Een jihad van liefde, 2017) ; textes français d’origine traduits puis retravaillés."],
  ["Quels sont les huit mouvements du livre ?", "Ouverture ; choc et deuil ; origines ; Loubna ; réponse à l’attentat ; appartenances ; manifeste ; appel final."],
  ["Thème du livre ?", SCHEMA_LIVRE.theme],
  ["Thèse du livre ?", SCHEMA_LIVRE.these],
  ...SCHEMA_LIVRE.args.map((a, i) => ["Argument " + (i + 1) + " du livre ?", a.arg]),
  ...SCHEMA_LIVRE.args.map((a, i) => ["Donne deux exemples de l’argument « " + a.court + " ».", a.ex.slice(0, 2).join(" ")]),
  ["Que signifie « axe vertical » et « axe horizontal » chez l’auteur ?", "Vertical : le lien avec Dieu, intemporel. Horizontal : les règles de la vie en société, liées au contexte du VIIe siècle."],
  ["Quelles trois valeurs fondent l’humanité selon l’auteur ?", "Le caractère sacré de la vie, le libre arbitre et la fraternité."],
  ["Que répond l’auteur à ses fils qui réclament vengeance ?", "Que se venger, c’est commettre la même faute que les assassins et se mettre à leur niveau ; qu’ils valent mieux que cela."],
  ["Quelle est la fonction des récits et des poèmes à Loubna ?", "Une autre fonction que l’argumentation : émouvoir (pathos), rendre hommage et rendre l’auteur crédible (éthos)."],
  ["Que dit la comparaison des traductions du mot jihad ?", "Néerlandais « inspanning » = effort ; anglais « struggle » = lutte. Pour le résumé : « un effort sur soi contre la haine »."],
];

export function buildDecks() {
  const voc = th => GLOSSAIRE.filter(x => th.includes(x.theme)).map(x => ({ id: "g-" + x.id, kind: "voc", front: x.terme, back: x.def, ex: x.ex }));
  const qa = (pref, list) => list.map(([f, b], i) => ({ id: pref + i, kind: "qa", front: f, back: b }));
  const args = THEMES.flatMap(t => [
    { id: "th-" + t.id + "-p", kind: "qa", front: "« " + t.sujets[0] + " » Donne trois arguments pour (oui).", back: t.pour.map(a => "• " + a[0]).join(" ") },
    { id: "th-" + t.id + "-c", kind: "qa", front: "« " + t.sujets[0] + " » Donne trois arguments contre (non).", back: t.contre.map(a => "• " + a[0]).join(" ") },
  ]);
  return [
    { id: "voc-livre", kind: "voc", t: "Vocabulaire du livre", cards: voc(["livre", "valeurs"]) },
    { id: "voc-methode", kind: "voc", t: "Vocabulaire de la méthode", cards: voc(["methode", "resume", "lettres"]) },
    { id: "voc-langue", kind: "voc", t: "Verbes introducteurs (définitions)", cards: voc(["langue"]) },
    { id: "qa-methode", kind: "qa", t: "Notions : schéma et résumé", cards: qa("qm", NOTIONS_METHODE) },
    { id: "qa-verbes", kind: "qa", t: "Verbes et connecteurs à utiliser", cards: qa("qv", VERBES) },
    { id: "qa-livre", kind: "qa", t: "Le livre : contexte, thèse, arguments", cards: qa("ql", LIVRE_QA) },
    { id: "qa-themes", kind: "qa", t: "Bibliothèque d’arguments (sujets fréquents)", cards: args },
  ];
}
