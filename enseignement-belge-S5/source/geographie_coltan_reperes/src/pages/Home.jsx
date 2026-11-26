import React from "react";
import { useApp, T, Box, Icon, Progress } from "../ui.jsx";
import { load } from "../store.js";
import { ALL_LESSONS } from "../content/cours.js";
import { dueCount } from "./Flash.jsx";
import MapView from "../MapView.jsx";

export default function Home() {
  const { go } = useApp();
  const seen = load("seen", {});
  const nSeen = ALL_LESSONS.filter(l => seen[l.id]).length;
  const quiz = load("quizBest", {});
  const due = dueCount();
  const next = ALL_LESSONS.find(l => !seen[l.id]);
  return <>
    <div className="card">
      <h1>Géographie S5 · Le coltan en RDC et les repères spatiaux</h1>
      <T>Cette application t’aide à **comprendre**, **mémoriser** et **utiliser** les notions du chapitre 1 (thème 3 : le coltan en République démocratique du Congo) et les repères spatiaux à connaître en 5e secondaire.</T>
      <div className="grid3">
        <div className="stat"><b>{nSeen}/{ALL_LESSONS.length}</b><span>leçons parcourues</span></div>
        <div className="stat"><b>{due}</b><span>cartes mémoire à revoir aujourd’hui</span></div>
        <div className="stat"><b>{Object.keys(quiz).length}</b><span>quiz réussis au moins une fois</span></div>
      </div>
      <Progress value={nSeen / ALL_LESSONS.length} />
      <div className="row">
        {next ? <button className="btn primary" onClick={() => go("cours", next.id)}><Icon n="book" />{nSeen ? "Continuer : " : "Commencer : "}{next.titre}</button> : <button className="btn primary" onClick={() => go("evaluations")}><Icon n="doc" />Tout est lu : passe aux évaluations</button>}
        {due > 0 && <button className="btn" onClick={() => go("memo")}><Icon n="cards" />Réviser mes {due} cartes</button>}
      </div>
    </div>

    <div className="grid2">
      <div className="card">
        <h2>Comment bien apprendre avec cette application</h2>
        <ol className="clean">
          <T as="li">**Lis une leçon courte** : le texte et la carte sont côte à côte. Clique sur les mots soulignés pour voir leur définition.</T>
          <T as="li">**Réponds à la question de fin de leçon** sans regarder : c’est en cherchant dans ta mémoire que tu retiens le mieux.</T>
          <T as="li">**Fais tes cartes mémoire chaque jour** (10 minutes suffisent) : l’application te repropose les cartes juste avant que tu les oublies.</T>
          <T as="li">**Entraîne-toi sur les cartes interactives et les quiz**, en mélangeant les thèmes.</T>
          <T as="li">**Fais les exercices** : lis d’abord l’exercice résolu, puis essaie seul avant de regarder la correction.</T>
          <T as="li">**Termine par une évaluation corrigée** dans les conditions d’un vrai contrôle.</T>
        </ol>
      </div>
      <div className="card">
        <h2>Ce que tu dois savoir faire</h2>
        <Box kind="retenir" label="Connaître">
          <T>Les définitions (coltan, minerais de sang, malédiction des ressources, situer, localiser…) et les repères spatiaux des fiches Cartes 1 à 14.</T>
        </Box>
        <Box kind="info" label="Appliquer">
          <T>Situer et localiser un lieu, lire et mettre en relation des cartes, compléter un tableau de données, classer des atouts et des contraintes, réaliser un croquis avec une légende conforme.</T>
        </Box>
        <Box kind="attention" label="Transférer">
          <T>Réutiliser ces notions sur une situation nouvelle (le cobalt, l’or, le lithium, une autre ville…) et argumenter.</T>
        </Box>
      </div>
    </div>

    <div className="card">
      <h2>Aperçu : les ressources de la RDC</h2>
      <MapView id="rdc_ressources" mode="explore" height="420px" />
      <div className="row"><button className="btn" onClick={() => go("atlas")}><Icon n="map" />Toutes les cartes interactives</button></div>
    </div>
  </>;
}
