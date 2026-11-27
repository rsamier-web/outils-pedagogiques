// « Comprendre le livre » : leçons courtes. Visuels spécifiques :
// { fiche } ; { mouvements } ; { fragments: [n° de mouvements] } ; { traductions: [indices] } ;
// { arg: "A1" } ; { schema: "livre" } ; { resume: "court" | "long" } ; { pieges } ; { diagram: id }

export const LIVRE_COURS = [
  {
    id: "l1", titre: "Le livre et son contexte", resume: "Qui parle, quand, pourquoi, et à qui ?",
    pages: [
      {
        titre: "Fiche d’identité",
        blocs: [
          "Un jihad de l’amour est un livre court (une centaine de pages) paru en 2017. Son auteur, Mohamed El Bachiri, est un Bruxellois de Molenbeek, fils d’immigrés marocains, ancien conducteur de métro.",
          "Le livre réunit des textes qu’il a écrits après la mort de sa femme et des propos recueillis lors d’un long entretien par l’écrivain flamand David Van Reybrouck, qui a organisé l’ensemble.",
          "C’est un [[essai]]-[[témoignage]] : l’auteur raconte sa vie, mais surtout il défend des idées. C’est pour cela qu’on peut en faire un schéma argumentatif et un résumé.",
        ],
        visuel: { fiche: true },
        retenir: ["Mohamed El Bachiri, avec David Van Reybrouck, 2017.", "Un essai-témoignage : récit + idées défendues."],
      },
      {
        titre: "Le contexte : le 22 mars 2016",
        blocs: [
          "Le 22 mars 2016, des [[attentat|attentats]] frappent Bruxelles : à l’aéroport de Zaventem et dans une rame de métro, à la station Maelbeek. Loubna Lafquiri, l’épouse de l’auteur et la mère de leurs trois fils, meurt dans le métro.",
          "Plusieurs terroristes impliqués dans les attentats de Paris et de Bruxelles avaient grandi à [[Molenbeek]]. La commune est alors montrée du doigt dans le monde entier, et ses habitants subissent des [[amalgame|amalgames]].",
          "Fin 2016, à la télévision flamande, Mohamed El Bachiri, à la fois victime et musulman de Molenbeek, appelle à un « jihad de l’amour ». Sa prise de parole est très largement partagée ; le livre la prolonge.",
        ],
        visuel: { diagram: "contexte" },
        retenir: ["22 mars 2016 : attentats de Bruxelles ; Loubna meurt à Maelbeek.", "L’auteur est à la fois victime et suspect aux yeux de certains : le livre répond à ce paradoxe."],
      },
      {
        titre: "Qui parle, et à qui ?",
        blocs: [
          "Le « je » du livre est celui de Mohamed El Bachiri. Mais il ne s’adresse pas toujours à la même personne : c’est une question d’[[énonciation]].",
          "Il parle **à Loubna** dans les textes lyriques, **à ses fils** quand il refuse la vengeance, **aux auteurs des attentats** dans le fragment « Les auteurs », **aux jeunes de Molenbeek** et aux musulmans d’Europe, et enfin **à tous les lecteurs**.",
          "Pour ton résumé, tu remplaces tous ces « je » par la 3e personne : « El Bachiri s’adresse aux jeunes et leur demande… ».",
        ],
        visuel: { diagram: "destinataires" },
        retenir: ["Un seul « je », plusieurs destinataires : Loubna, ses fils, les terroristes, les jeunes, tous les lecteurs."],
      },
    ],
    check: { q: "Pourquoi peut-on faire le schéma argumentatif de ce livre, alors que c’est un témoignage ?", o: ["Parce que c’est un roman", "Parce qu’en plus de raconter, l’auteur défend une thèse avec des arguments", "Parce qu’il ne contient aucun récit", "Parce qu’il a été écrit par un journaliste"], a: 1, e: "C’est un essai-témoignage : à côté des récits et des poèmes, l’auteur défend une thèse (répondre à la haine par l’amour) avec des arguments." },
  },
  {
    id: "l2", titre: "La structure du livre", resume: "Huit mouvements, une cinquantaine de fragments.",
    pages: [
      {
        titre: "Huit grands mouvements",
        blocs: [
          "Le livre est fait de fragments courts, chacun avec un titre. Certains ne font qu’une phrase ! C’est une [[écriture fragmentaire]].",
          "On peut les regrouper en huit mouvements, du choc de l’attentat jusqu’à l’appel final. Lis le résumé de chaque mouvement à droite.",
          "Les titres des fragments sont ici traduits des éditions néerlandaise et anglaise : vérifie-les dans ton exemplaire français et note les pages.",
        ],
        visuel: { mouvements: true },
        retenir: ["Du deuil (début) à l’appel (fin), en passant par les origines, Loubna, le refus de la vengeance, les appartenances et le manifeste."],
      },
      {
        titre: "Mouvements 1 à 3 : la lettre, le deuil, les origines",
        blocs: [
          "Le début du livre est surtout **narratif** et **lyrique** : la mort de Loubna, les nuits sans sommeil, l’enfance à Molenbeek.",
          "Mais des fragments **argumentatifs** apparaissent déjà : « Le Coran », « Réflexion », « Compassion ». L’auteur y explique comment il lit sa religion.",
          "Pour chaque fragment, demande-toi : raconte-t-il, exprime-t-il une émotion, ou défend-il une idée ?",
        ],
        visuel: { fragments: [1, 2, 3] },
        retenir: ["Début surtout narratif et lyrique, avec déjà des passages argumentatifs sur la foi et la raison."],
      },
      {
        titre: "Mouvements 4 et 5 : Loubna, et la réponse à l’attentat",
        blocs: [
          "Le mouvement 4 raconte l’histoire d’amour avec Loubna et lui rend hommage : il a une fonction **lyrique**.",
          "Le mouvement 5 est le **cœur argumentatif** du refus de la vengeance : ce que l’auteur dit à ses fils, le poème « Vengeance », la peine de mort, la phrase adressée aux terroristes.",
        ],
        visuel: { fragments: [4, 5] },
        retenir: ["Mouvement 5 : le refus de la vengeance, argument central (A1)."],
      },
      {
        titre: "Mouvements 6 à 8 : appartenances, manifeste, appel",
        blocs: [
          "Le mouvement 6 défend Molenbeek et la double appartenance belge et marocaine.",
          "Le mouvement 7 est un véritable **manifeste** : l’auteur y expose ses principes (humanité, sens du jihad, raison, séparation de la religion et de l’État).",
          "Le mouvement 8 termine par des poèmes et un appel : l’amour comme réponse à la haine.",
        ],
        visuel: { fragments: [6, 7, 8] },
        retenir: ["Mouvement 7 : le manifeste ; c’est là que la thèse est la plus explicite."],
      },
    ],
    check: { q: "Dans quel mouvement l’auteur expose-t-il le plus clairement ses principes (humanité, sens du jihad, raison) ?", o: ["Mouvement 2 : le choc et le deuil", "Mouvement 4 : Loubna", "Mouvement 7 : le manifeste", "Mouvement 8 : l’appel"], a: 2, e: "Les fragments « Jihad », « Humanité », « Politique », « Honnêteté », « Séparation… » forment un manifeste." },
  },
  {
    id: "l3", titre: "Le mot au cœur du livre : jihad", resume: "Pourquoi ce titre choque, et ce qu’il veut dire.",
    pages: [
      {
        titre: "Un titre qui surprend",
        blocs: [
          "Pour beaucoup de lecteurs, le mot « jihad » évoque la guerre et le terrorisme. L’associer à « amour » surprend : cela ressemble à un [[oxymore]].",
          "Mais l’auteur ne joue pas seulement avec les mots. Il **reprend** le mot à ceux qui l’ont détourné et lui rend son **sens premier** : c’est une [[réappropriation]].",
          "Le livre s’ouvre d’ailleurs sur une définition de dictionnaire qui distingue deux sens : le « grand jihad », effort de chacun contre ses passions, et le « petit jihad », combat pour défendre l’islam.",
        ],
        visuel: { diagram: "jihad" },
        retenir: ["Jihad = d’abord un effort sur soi (grand jihad).", "Le titre est une réappropriation : reprendre le mot aux terroristes."],
      },
      {
        titre: "Être un « jihadiste de l’amour »",
        blocs: [
          "Dans le fragment « Jihad », l’auteur se dit plus « jihadiste » que le plus grand guerrier, car résister à la haine demande un immense effort.",
          "Il décrit le vrai jihadiste : quelqu’un qui ne se met pas en colère, qui cherche le savoir, qui va vers les autres même quand ils sont fermés, et qui garde le sourire.",
          "Cet argument (A2) est essentiel : il donne son sens au titre et à la thèse. Dans ton résumé, explique-le avec des mots simples : « un effort sur soi contre la haine ».",
        ],
        visuel: { arg: "A2" },
        retenir: ["« Jihad de l’amour » = un effort sur soi pour refuser la haine et aller vers l’autre."],
      },
    ],
    check: { q: "Que fait l’auteur avec le mot « jihad » ?", o: ["Il l’évite", "Il lui rend son sens premier d’effort sur soi", "Il l’utilise pour menacer", "Il le remplace par un autre mot"], a: 1, e: "Il se réapproprie le mot et lui rend son sens premier : l’effort contre ses propres passions." },
  },
  {
    id: "l4", titre: "Ce que révèlent les traductions", resume: "Comparer l’édition néerlandaise et l’édition anglaise.",
    pages: [
      {
        titre: "Un livre en plusieurs langues",
        blocs: [
          "Cette application a été préparée à partir de deux éditions du livre : l’édition **néerlandaise**, parue en premier, et l’édition **anglaise**, traduite du néerlandais. Comparer les deux éclaire le sens.",
          "Leçon principale : d’une langue à l’autre, **les mots changent, les idées restent**. C’est exactement le principe du résumé : garder les idées, pas les mots.",
          "Ouvre chaque comparaison à droite.",
        ],
        visuel: { traductions: [0, 1, 2] },
        retenir: ["Les mots changent d’une traduction à l’autre, les idées restent : c’est ce qu’on garde dans un résumé."],
      },
      {
        titre: "D’autres nuances",
        blocs: [
          "Quand deux versions ne disent pas exactement la même chose, cherche ce qu’elles ont **en commun** : c’est le noyau de l’idée, celui que tu dois reformuler.",
          "En classe et à l’examen, cite toujours l’**édition française** que tu as lue, et vérifie les pages.",
        ],
        visuel: { traductions: [3, 4, 5, 6] },
        retenir: ["Le noyau commun aux traductions = l’idée à résumer."],
      },
    ],
    check: { q: "En néerlandais, le jihad est expliqué par « inspanning ». Que signifie ce mot ?", o: ["La guerre", "L’effort", "La prière", "La vengeance"], a: 1, e: "« Inspanning » veut dire « effort ». L’anglais dit « struggle » (lutte) : la nuance est plus guerrière." },
  },
  {
    id: "l5", titre: "L’argumentation du livre", resume: "Thème, thèse et les cinq arguments, avec leurs développements et leurs exemples.",
    pages: [
      {
        titre: "Le thème et la thèse",
        blocs: [
          "**Thème** : la réponse à apporter à la haine et à la violence terroriste.",
          "**Thèse** : face à la haine, il faut répondre par l’amour, c’est-à-dire mener un « jihad de l’amour » : un effort sur soi pour refuser la vengeance et reconnaître l’humanité de chacun.",
          "La thèse est explicite dans les fragments « Jihad », « Le cœur » et « Ce livre », et reprise dans les poèmes de la fin. L’auteur s’appuie sur **cinq arguments**, développés dans les pages suivantes.",
        ],
        visuel: { schema: "livre" },
        retenir: ["Thème : répondre à la haine.", "Thèse : répondre par l’amour, un effort sur soi (jihad de l’amour)."],
      },
      { titre: "Argument 1 : la vengeance reproduit le mal", blocs: ["Premier argument : se venger, c’est commettre la même faute que les assassins. La haine d’un camp nourrit celle de l’autre.", "Ce que l’auteur répond à ses fils en colère en est l’exemple le plus fort. Le fragment sur le conflit israélo-palestinien montre la même logique à grande échelle."], visuel: { arg: "A1" }, retenir: ["A1 : la vengeance reproduit le mal (ex. : ses fils, le poème « Vengeance », la peine de mort)."] },
      { titre: "Argument 2 : le vrai sens du jihad", blocs: ["Deuxième argument : le jihad est d’abord un effort contre soi-même, pas une guerre. Les terroristes ont détourné le mot.", "C’est cet argument qui donne son titre au livre."], visuel: { arg: "A2" }, retenir: ["A2 : jihad = effort sur soi (ex. : la définition du dictionnaire, les paroles du Prophète sur la colère)."] },
      { titre: "Argument 3 : une foi éclairée par la raison", blocs: ["Troisième argument : lue avec la raison et replacée dans son contexte, la religion mène à l’amour.", "L’auteur distingue l’axe vertical (le lien à Dieu) et l’axe horizontal (les règles d’une époque). Il refuse tous les fondamentalismes."], visuel: { arg: "A3" }, retenir: ["A3 : une foi raisonnée (ex. : le Prophète à La Mecque et à Médine, la question sur Mère Teresa)."] },
      { titre: "Argument 4 : tous frères en humanité", blocs: ["Quatrième argument : notre humanité commune passe avant ce qui nous divise.", "Trois valeurs la fondent : le caractère sacré de la vie, le libre arbitre et la fraternité."], visuel: { arg: "A4" }, retenir: ["A4 : la fraternité humaine (ex. : l’école catholique, Damas, Averroès, les prières du monde entier)."] },
      { titre: "Argument 5 : la diversité et l’éducation", blocs: ["Cinquième argument : la diversité est une richesse, et l’éducation permet de vivre ensemble, au lieu du repli ou des préjugés.", "Une communauté doit être « une porte, pas une forteresse »."], visuel: { arg: "A5" }, retenir: ["A5 : diversité et éducation (ex. : « sale Marocain », le Molenbeek des médias, la belgitude)."] },
    ],
    check: { q: "« Les musulmans de Damas autorisés à prier dans une église » : quel argument cet exemple illustre-t-il ?", o: ["A1 : la vengeance reproduit le mal", "A2 : le vrai sens du jihad", "A4 : tous frères en humanité", "A5 : la diversité et l’éducation"], a: 2, e: "L’exemple montre que des croyants différents peuvent se reconnaître comme frères : c’est l’argument de l’humanité commune (A4)." },
  },
  {
    id: "l6", titre: "Le résumé du livre", resume: "Ce qu’on garde, ce qu’on laisse, et deux résumés modèles.",
    pages: [
      { titre: "Ce qu’il ne faut pas mettre", blocs: ["Le livre est riche en émotions et en anecdotes. C’est précisément ce qui rend son résumé difficile : on a envie de tout raconter.", "Relis la liste des pièges à droite avant de rédiger."], visuel: { pieges: true }, retenir: ["Pas de récit détaillé, pas de poèmes, pas d’avis, pas tous les exemples."] },
      { titre: "Un résumé modèle court", blocs: ["Voici un résumé d’environ 150 mots. Observe : l’introduction (source, contexte en une phrase, thème, thèse), puis un connecteur et un argument par phrase.", "Il ne contient aucun exemple : tout est généralisé."], visuel: { resume: "court" }, retenir: ["Intro + un argument par phrase, reliés par des connecteurs."] },
      { titre: "Un résumé modèle plus développé", blocs: ["Avec 250 mots, on peut garder l’explication principale de chaque argument.", "Compare-le au résumé court : qu’a-t-on ajouté ? Des explications, jamais des anecdotes."], visuel: { resume: "long" }, retenir: ["Plus de mots = plus d’explications, pas plus d’exemples."] },
    ],
    check: { q: "Dans un résumé de 150 mots, faut-il raconter comment l’auteur a appris la mort de sa femme ?", o: ["Oui, en détail, car c’est émouvant", "Non : une phrase de contexte suffit, le reste est consacré aux arguments", "Oui, à la place de la thèse", "Seulement à la fin"], a: 1, e: "Le récit a une autre fonction. On le mentionne en une phrase (« dont l’épouse a été tuée… ») pour présenter l’auteur." },
  },
];
