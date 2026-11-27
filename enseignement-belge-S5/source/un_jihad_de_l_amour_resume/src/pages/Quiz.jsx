import React, { useState, useEffect } from "react";
import { useApp, T, Icon, shuffle, Progress } from "../ui.jsx";
import { QUIZ, QUIZ_THEMES } from "../content/quiz.js";
import { usePersist } from "../store.js";

function Run({ qs, label, onEnd, k }) {
  const [i, setI] = useState(0);
  const [ans, setAns] = useState(null);
  const [score, setScore] = useState(0);
  const [errors, setErrors] = useState([]);
  const [best, setBest] = usePersist("quizBest", {});
  const [order] = useState(() => qs.map(q => shuffle(q.o.map((o, j) => j))));
  const q = qs[i];
  const done = i >= qs.length;
  useEffect(() => { if (done) setBest(b => ({ ...b, [k]: Math.max(b[k] || 0, Math.round(100 * score / qs.length)) })); }, [done]);
  if (done) return <div className="stack">
    <div className="card"><h2>Résultat : {score} / {qs.length}</h2><Progress value={score / qs.length} />
      <T>{score === qs.length ? "Parfait ! Refais ce quiz dans quelques jours pour vérifier que tu t’en souviens." : score >= qs.length * .7 ? "Bien joué. Relis les explications des erreurs ci-dessous." : "Relis la leçon correspondante, puis recommence le quiz dans un moment."}</T>
      <div className="row"><button className="btn primary" onClick={onEnd}>Autre quiz</button></div></div>
    {errors.length > 0 && <div className="card"><h3>À retravailler</h3>{errors.map((e, j) => <div key={j} className="feedback info"><b>{e.q}</b><br />Bonne réponse : {e.o[e.a]}<br /><span className="muted">{e.e}</span></div>)}</div>}
  </div>;
  const choose = j => { if (ans != null) return; setAns(j); if (j === q.a) setScore(s => s + 1); else setErrors(e => [...e, q]); };
  return <div className="stack">
    <div className="row between"><span className="small muted">{label} · question {i + 1} / {qs.length} · score {score}</span><button className="btn small" onClick={onEnd}>Quitter</button></div>
    <Progress value={i / qs.length} />
    <div className="card">
      <T as="h2">{q.q}</T>
      <div className="opts">{order[i].map((j, n) => <button key={j} className={"opt" + (ans != null ? (j === q.a ? " good" : j === ans ? " bad" : "") : "")} disabled={ans != null} onClick={() => choose(j)}><span className="k">{"ABCD"[n]}</span><span>{q.o[j]}</span></button>)}</div>
      {ans != null && <div className={"feedback " + (ans === q.a ? "ok" : "ko")} role="status"><b>{ans === q.a ? "Exact ! " : "Non. "}</b><T as="span">{q.e}</T></div>}
      {ans != null && <button className="btn primary" style={{ alignSelf: "flex-start" }} onClick={() => { setI(x => x + 1); setAns(null); }} autoFocus>{i + 1 < qs.length ? "Question suivante" : "Voir le résultat"}<Icon n="right" /></button>}
    </div>
  </div>;
}

export default function Quiz() {
  const [run, setRun] = useState(null);
  const [best] = usePersist("quizBest", {});
  const [n, setN] = useState(15);
  if (run) return <Run {...run} onEnd={() => setRun(null)} />;
  const start = (th) => {
    if (th === "mix") setRun({ k: "mix", label: "Quiz mélangé", qs: shuffle(QUIZ).slice(0, n) });
    else setRun({ k: th, label: QUIZ_THEMES.find(t => t.id === th).t, qs: shuffle(QUIZ.filter(q => q.th === th)) });
  };
  return <>
    <div className="card">
      <h1>Quiz</h1>
      <T>Chaque réponse est suivie d’une explication. Commence par les quiz par thème après chaque leçon, puis fais le quiz mélangé : alterner les thèmes aide à mieux retenir et à reconnaître le type de question.</T>
      <div className="row"><button className="btn primary" onClick={() => start("mix")}><Icon n="shuffle" />Quiz mélangé</button>
        <label className="row small">Nombre de questions <select value={n} onChange={e => setN(+e.target.value)}>{[10, 15, 20, 30, 50].map(x => <option key={x}>{x}</option>)}</select></label>
        {best.mix != null && <span className="tag ok">Meilleur score : {best.mix} %</span>}</div>
    </div>
    <div className="toc">{QUIZ_THEMES.map(t => { const c = QUIZ.filter(q => q.th === t.id).length; return <button key={t.id} onClick={() => start(t.id)}><b>{t.t}</b><span>{c} questions{best[t.id] != null ? " · meilleur score " + best[t.id] + " %" : ""}</span></button>; })}</div>
  </>;
}
