import React from "react";
import { useApp, T, Box, Icon, Progress } from "../ui.jsx";
import { load } from "../store.js";
import { METHODE } from "../content/methode.js";
import { LIVRE_COURS } from "../content/livrecours.js";
import { FAMILLES } from "../content/exercices.js";
import { dueCount } from "./Flash.jsx";
import { Diagram } from "../diagrams.jsx";

export default function Home() {
  const { go } = useApp();
  const seen = load("seen", {});
  const L = [...METHODE, ...LIVRE_COURS];
  const nSeen = L.filter(l => seen[l.id]).length;
  const exs = load("exs", {});
  const nEx = FAMILLES.flatMap(f => f.items).length;
  const nOk = Object.values(exs).filter(v => v === "ok").length;
  const due = dueCount();
  const nextM = METHODE.find(l => !seen[l.id]);
  const nextL = LIVRE_COURS.find(l => !seen[l.id]);
  return <>
    <div className="card">
      <h1>Un jihad de l’amour · Schéma et résumé</h1>
      <T>Cette application prépare aux deux productions de l’examen de français de 5e secondaire : **le schéma argumentatif et le résumé du livre** Un jihad de l’amour de Mohamed El Bachiri, puis **le même exercice sur un texte argumentatif inconnu**. Elle suit les fiches de méthode des pages 78 (schéma) et 86 (résumé) du cours.</T>
      <div className="grid3">
        <div className="stat"><b>{nSeen}/{L.length}</b><span>leçons parcourues</span></div>
        <div className="stat"><b>{nOk}/{nEx}</b><span>exercices réussis</span></div>
        <div className="stat"><b>{due}</b><span>cartes mémoire à revoir aujourd’hui</span></div>
      </div>
      <Progress value={(nSeen / L.length + nOk / nEx) / 2} />
      <div className="row">
        {nextM ? <button className="btn primary" onClick={() => go("methode", nextM.id)}><Icon n="book" />Méthode : {nextM.titre}</button> : nextL ? <button className="btn primary" onClick={() => go("livre", nextL.id)}><Icon n="book" />Le livre : {nextL.titre}</button> : <button className="btn primary" onClick={() => go("atelier")}><Icon n="feather" />Aller aux ateliers</button>}
        {due > 0 && <button className="btn" onClick={() => go("memo")}><Icon n="cards" />Réviser mes {due} cartes</button>}
      </div>
    </div>

    <div className="grid2">
      <div className="card">
        <h2>Ce que tu dois savoir faire</h2>
        <Box kind="retenir" label="Pour le livre">
          <T>Identifier le **thème**, la **thèse**, les **arguments** et leur **développement**, ainsi que les **exemples** mobilisés par Mohamed El Bachiri ; en faire le schéma, puis le résumé.</T>
        </Box>
        <Box kind="info" label="Pour un texte inconnu">
          <T>Appliquer la même méthode, seul et en temps limité, sur un texte argumentatif que tu n’as jamais vu.</T>
        </Box>
        <Box kind="attention" label="Les deux chemins">
          <T>Passer d’un texte à son schéma, et inversement d’un schéma à un texte argumentatif.</T>
        </Box>
      </div>
      <div className="card">
        <h2>Le parcours conseillé</h2>
        <ol className="clean">
          <T as="li">**La méthode** : lis les leçons courtes (un visuel à côté de chaque texte).</T>
          <T as="li">**Comprendre le livre** : contexte, structure, traductions, puis l’argumentation complète.</T>
          <T as="li">**Les cartes mémoire, chaque jour** (10 minutes) : vocabulaire, notions, arguments du livre et de la bibliothèque.</T>
          <T as="li">**Les exercices** : du plus guidé au plus autonome. Lis toujours l’exemple résolu d’abord.</T>
          <T as="li">**Les ateliers** : remplis les trames pour le livre et pour un texte inconnu, puis demande un retour à une IA.</T>
          <T as="li">**Un examen blanc**, chronométré, corrigé avec le barème.</T>
        </ol>
      </div>
    </div>

    <div className="card">
      <h2>La méthode en un coup d’œil</h2>
      <Diagram id="procedure" />
      <div className="row"><button className="btn" onClick={() => go("methode", "m3")}><Icon n="book" />La méthode du schéma</button><button className="btn" onClick={() => go("methode", "m4")}><Icon n="book" />La méthode du résumé</button><button className="btn" onClick={() => go("biblio")}><Icon n="lib" />La bibliothèque d’arguments</button></div>
    </div>

    <div className="card">
      <h2>Pourquoi cette application est construite ainsi</h2>
      <T>Elle s’appuie sur la **théorie de la charge cognitive** : les leçons sont découpées en pages courtes, chaque exercice commence par un exemple résolu, puis l’aide diminue peu à peu ; et sur la **théorie de l’apprentissage multimédia** : le texte et son schéma sont toujours côte à côte, les couleurs des rôles sont les mêmes partout, et la synthèse vocale permet d’écouter en lisant.</T>
      <T>La répétition espacée (cartes mémoire) et les quiz font travailler la mémoire à long terme : plus tu connais d’arguments, plus tu les reconnais vite dans un texte.</T>
    </div>
  </>;
}
