import React from "react";
import { T } from "./ui.jsx";
import { MOUVEMENTS } from "./content/livre.js";

const Box = ({ c, t, children, sub }) => <div className={"dg-box " + (c || "")}>{t && <b>{t}</b>}{sub && <small>{sub}</small>}{children}</div>;
const Arrow = ({ t, down }) => <div className={"dg-arrow" + (down ? " down" : "")} aria-hidden="true"><span>{t}</span></div>;

const D = {
  "theme-these": () => <div className="dg">
    <div className="dg-row"><Box c="c-theme" t="Thème" sub="De quoi parle le texte ?">« Le téléphone portable à l’école »</Box><Arrow t="que pense l’auteur ?" /><Box c="c-these" t="Thèse" sub="Quelle opinion défend-il ?">« Il devrait être interdit pendant les cours. »</Box></div>
    <div className="dg-row"><Box c="c-theme" t="Même thème…">« Le téléphone portable à l’école »</Box><Arrow t="autre auteur" /><Box c="c-contre" t="…thèse opposée">« Il faut apprendre à bien l’utiliser plutôt que l’interdire. »</Box></div>
    <p className="dg-cap">Le thème est neutre. La thèse prend position : deux auteurs peuvent défendre des thèses opposées sur le même thème.</p>
  </div>,
  "connecteurs": () => <div className="dg dg-table">
    {[["c-arg", "Nouvel argument", "d’abord, ensuite, de plus, en outre, par ailleurs, enfin"], ["c-expl", "Explication", "en effet, car, puisque, c’est-à-dire"], ["c-ex", "Exemple", "par exemple, ainsi, notamment, comme le montre"], ["c-contre", "Contre-argument / concession", "certes, il est vrai que, on objecte que, certains pensent"], ["c-refut", "Réfutation / opposition", "mais, pourtant, cependant, toutefois, en revanche"], ["c-concl", "Conclusion / conséquence", "en somme, en définitive, bref, donc, c’est pourquoi"]].map(([c, t, l]) =>
      <div key={t} className={"dg-line " + c}><b>{t}</b><span>{l}</span></div>)}
  </div>,
  "arg-ou-ex": () => <div className="dg">
    <div className="dg-row"><Box c="c-arg" t="Argument" sub="général · « pourquoi ? »">La mode jetable exploite des travailleurs.</Box><Box c="c-ex" t="Exemple" sub="particulier · date, lieu, chiffre">L’effondrement du Rana Plaza en 2013 au Bangladesh.</Box></div>
    <div className="dg-row"><Box c="c-ex" t="Je pars de l’exemple…">Raphaël peint Averroès au Vatican.</Box><Arrow t="Qu’est-ce que cela prouve ?" /><Box c="c-arg" t="…je trouve l’argument">Des croyants différents peuvent se reconnaître comme frères.</Box></div>
    <p className="dg-cap">Test : « Par exemple, … » fonctionne devant un exemple ; « parce que … » fonctionne devant un argument.</p>
  </div>,
  "types-arguments": () => <div className="dg dg-table">
    {[["Logique", "cause → conséquence", "Les notifications distraient, donc on apprend moins."], ["De valeur", "morale, justice, liberté", "La vengeance est injuste."], ["D’autorité", "un expert, un texte reconnu", "Le Prophète disait : « Ne te mets pas en colère. »"], ["D’expérience", "un vécu", "À six ans, on m’a traité de « sale Marocain »."], ["Par analogie", "une comparaison", "Imaginez que le Christ soit devenu chef d’un peuple…"]].map(([t, d, e]) =>
      <div key={t} className="dg-line c-arg"><b>{t}</b><span><i>{d}</i> · {e}</span></div>)}
  </div>,
  "procedure": () => <div className="dg dg-steps">
    {[["1", "Lire et comprendre", "c-theme"], ["2", "Repérer le thème et la thèse", "c-these"], ["3", "Repérer les parties qui ont une autre fonction", "c-autre"], ["4", "Repérer les arguments et les exemples", "c-arg"], ["5", "Tracer le schéma : hiérarchiser, reformuler", "c-expl"], ["6", "Rédiger le résumé", "c-concl"]].map(([n, t, c], i, a) =>
      <React.Fragment key={n}><div className={"dg-step " + c}><span className="dg-n">{n}</span><span>{t}</span></div>{i < a.length - 1 && <div className="dg-arrow down" aria-hidden="true"><span /></div>}</React.Fragment>)}
    <p className="dg-cap">Fiche « méthodologie du schéma », page 78 de ton cours.</p>
  </div>,
  "enonciation": () => <div className="dg">
    <div className="dg-row"><Box c="c-autre" t="Dans le texte source" sub="l’auteur parle en son nom">« <u>Je</u> refuse la haine. <u>Je</u> suis un jihadiste de l’amour. »</Box><Arrow t="changer d’énonciateur" /><Box c="c-these" t="Dans ton résumé" sub="3e personne + verbe précis">« <u>El Bachiri</u> refuse la haine et <u>se présente comme</u> un « jihadiste de l’amour ». »</Box></div>
    <div className="dg-row"><Box c="c-contre" t="À éviter">« Mohamed dit que… », « Il dit que… »</Box><Box c="c-ex" t="À préférer">« Mohamed El Bachiri affirme… », « L’auteur dénonce… », « Selon lui, … »</Box></div>
  </div>,
  "verbes": () => <div className="dg dg-table">
    {[["Affirmer", "affirmer, soutenir, défendre l’idée que, être convaincu que"], ["Expliquer", "expliquer, montrer, rappeler, souligner, préciser"], ["Critiquer", "dénoncer, critiquer, déplorer, regretter, condamner"], ["Concéder", "admettre, reconnaître, concéder"], ["Réfuter", "réfuter, rejeter, contester, s’opposer à"], ["Proposer, appeler", "plaider pour, appeler à, inviter à, proposer, préconiser"], ["Conclure", "conclure, en déduire, estimer finalement que"]].map(([t, l]) =>
      <div key={t} className="dg-line c-expl"><b>{t}</b><span>{l}</span></div>)}
    <p className="dg-cap">Le verbe dit ce que fait l’auteur : c’est déjà une information pour ton lecteur.</p>
  </div>,
  "schema-vers-resume": () => <div className="dg dg-map">
    <div className="dg-col"><b className="dg-coltitle">Le schéma</b><Box c="c-theme" t="A. Thème" /><Box c="c-these" t="B. Thèse" /><Box c="c-arg" t="C. Argument 1 + D. explication" /><Box c="c-arg" t="C. Argument 2 + D. explication" /><Box c="c-arg" t="C. Argument 3 + D. explication" /><Box c="c-ex" t="E. Exemples" /></div>
    <div className="dg-col"><b className="dg-coltitle">Le résumé</b><Box c="c-these" t="Introduction" sub="source + thème + thèse" /><Box c="c-arg" t="§ 1 : D’abord, …" /><Box c="c-arg" t="§ 2 : Ensuite, …" /><Box c="c-arg" t="§ 3 : Enfin, …" /><Box c="c-autre" t="(exemples supprimés)" sub="sauf s’ils sont indispensables" /></div>
  </div>,
  "criteres": () => <div className="dg dg-cards">
    {[["Pertinence", "L’essentiel est gardé, l’accessoire supprimé.", "c-arg"], ["Fidélité", "Pas de contresens, pas d’ajout, pas d’avis.", "c-these"], ["Intelligibilité", "Compréhensible sans le texte source. Anaphores claires.", "c-expl"], ["Recevabilité", "Consigne respectée : nombre de mots, destinataire, 3e personne.", "c-ex"], ["Langue", "Orthographe, syntaxe, ponctuation, connecteurs justes.", "c-concl"]].map(([t, d, c]) => <Box key={t} c={c} t={t}><span className="small">{d}</span></Box>)}
  </div>,
  "mouvements": () => <div className="dg dg-steps">
    {MOUVEMENTS.map((m, i) => <React.Fragment key={m.id}><div className={"dg-step " + (m.id === 5 || m.id === 7 ? "c-arg" : m.id === 2 || m.id === 4 || m.id === 8 ? "c-autre" : "c-theme")}><span className="dg-n">{m.id}</span><span>{m.t}</span></div>{i < MOUVEMENTS.length - 1 && <div className="dg-arrow down" aria-hidden="true"><span /></div>}</React.Fragment>)}
    <p className="dg-cap">En orange, les mouvements surtout narratifs ou lyriques ; en bleu, les plus argumentatifs.</p>
  </div>,
  "fonctions-livre": () => <div className="dg">
    <div className="dg-row">
      <Box c="c-autre" t="Récit" sub="le 22 mars, l’enfance, la rencontre">Fonction : montrer d’où il parle (éthos)</Box>
      <Box c="c-autre" t="Lyrisme" sub="les poèmes, la lettre à Loubna">Fonction : émouvoir, rendre hommage (pathos)</Box>
      <Box c="c-arg" t="Argumentation" sub="Fraternité, Jihad, Humanité…">Fonction : convaincre → le schéma</Box>
    </div>
    <div className="dg-row"><Box c="c-these" t="Dans le résumé">Récit et lyrisme : une phrase de présentation de l’auteur. Argumentation : tout le reste.</Box></div>
  </div>,
  "plan-texte": () => <div className="dg dg-steps">
    {[["Introduction", "accroche → thème → thèse (→ annonce du plan)", "c-these"], ["Paragraphe 1", "argument → explication → exemple → lien", "c-arg"], ["Paragraphe 2", "argument → explication → exemple → lien", "c-arg"], ["Contre-argument", "certes… → pourtant… (réfutation)", "c-contre"], ["Conclusion", "thèse reformulée → ouverture", "c-concl"]].map(([t, d, c], i, a) =>
      <React.Fragment key={t}><div className={"dg-step " + c}><span><b>{t}</b> : {d}</span></div>{i < a.length - 1 && <div className="dg-arrow down" aria-hidden="true"><span /></div>}</React.Fragment>)}
  </div>,
  "contexte": () => <div className="dg dg-time">
    {[["13 nov. 2015", "Attentats de Paris. Plusieurs auteurs ont des liens avec Molenbeek."], ["22 mars 2016", "Attentats de Bruxelles (aéroport de Zaventem, métro Maelbeek). Loubna Lafquiri est tuée dans le métro.", true], ["Fin 2016", "À la télévision flamande, Mohamed El Bachiri appelle à un « jihad de l’amour » : la vidéo est massivement partagée."], ["Févr. 2017", "Long entretien avec David Van Reybrouck à Anderlecht et Molenbeek."], ["2017", "Parution du livre en néerlandais, puis en français et en anglais.", true]].map(([d, t, k]) =>
      <div key={d} className={"dg-ev" + (k ? " key" : "")}><span className="dg-date">{d}</span><T as="span">{t}</T></div>)}
  </div>,
  "destinataires": () => <div className="dg dg-star">
    <div className="dg-center"><Box c="c-these" t="« Je »" sub="Mohamed El Bachiri" /></div>
    <div className="dg-around">{[["Loubna", "lettre, poèmes : hommage"], ["Ses fils", "refus de la vengeance"], ["Les auteurs des attentats", "« nous n’avons pas la même religion »"], ["Les jeunes de Molenbeek", "« va aux quatre coins du monde »"], ["Les musulmans d’Europe", "une foi humaniste"], ["Tous les lecteurs", "l’appel à l’amour"]].map(([t, s]) => <Box key={t} c="c-autre" t={t} sub={s} />)}</div>
  </div>,
  "jihad": () => <div className="dg">
    <div className="dg-row"><Box c="c-theme" t="Jihad" sub="mot arabe : « effort »" /></div>
    <div className="dg-row"><Box c="c-these" t="Grand jihad (sens premier)" sub="l’effort contre ses passions, sa colère">→ le « jihad de l’amour » de l’auteur</Box><Box c="c-contre" t="Petit jihad" sub="combat pour défendre l’islam">→ sens détourné par les terroristes pour justifier la violence</Box></div>
    <p className="dg-cap">Titre = réappropriation : l’auteur reprend le mot et lui rend son sens premier.</p>
  </div>,
};

export function Diagram({ id }) {
  const C = D[id];
  return C ? <figure className="diagram">{C()}</figure> : null;
}
