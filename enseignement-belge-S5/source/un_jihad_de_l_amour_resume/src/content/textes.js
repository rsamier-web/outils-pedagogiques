// Textes argumentatifs d'entraînement, écrits pour cette application (auteurs fictifs).
// Chaque phrase porte son rôle dans l'argumentation :
// amorce (autre fonction : accroche, contexte, anecdote), these, arg, expl, ex, contre (contre-argument ou concession),
// refut (réfutation), concl. Cela sert à la fois à afficher le texte, à corriger les exercices de repérage
// et à vérifier le schéma.

export const ROLES = {
  amorce: { t: "Autre fonction", c: "var(--c-autre)", d: "Accroche, contexte, anecdote, citation : la phrase ne défend pas directement la thèse." },
  these: { t: "Thèse", c: "var(--c-these)", d: "L'opinion que l'auteur défend." },
  arg: { t: "Argument", c: "var(--c-arg)", d: "Une raison qui soutient la thèse." },
  expl: { t: "Explication", c: "var(--c-expl)", d: "Le développement de l'argument : il précise, justifie, montre comment." },
  ex: { t: "Exemple", c: "var(--c-ex)", d: "Un cas concret qui illustre l'argument." },
  contre: { t: "Contre-argument", c: "var(--c-contre)", d: "Une idée opposée, que l'auteur cite ou concède (certes…, on objecte que…)." },
  refut: { t: "Réfutation", c: "var(--c-refut)", d: "La réponse de l'auteur au contre-argument." },
  concl: { t: "Conclusion", c: "var(--c-concl)", d: "Le bilan ou l'ouverture : la thèse est souvent reformulée." },
};
export const ROLE_ORDER = ["these", "arg", "expl", "ex", "contre", "refut", "amorce", "concl"];

export const TEXTES = [
  {
    id: "t1", niveau: 1, domaine: "ecole", titre: "Ranger son téléphone pour mieux apprendre",
    auteur: "Laure Martin", source: "chronique d’une enseignante (auteur fictif), 2025",
    paras: [
      [["amorce", "Dans beaucoup d’écoles, la place du téléphone portable fait débat."], ["these", "Selon moi, il devrait être interdit pendant les cours."]],
      [["arg", "D’abord, le téléphone empêche les élèves de se concentrer."], ["expl", "Chaque notification attire l’attention, et il faut ensuite plusieurs minutes pour se remettre au travail."], ["ex", "Par exemple, un élève qui reçoit trois messages pendant un exercice de mathématiques perd le fil de son raisonnement à chaque fois."]],
      [["arg", "Ensuite, l’interdiction protège les élèves du cyberharcèlement."], ["expl", "Sans téléphone en classe, il devient impossible de filmer un camarade à son insu ou de l’humilier sur un groupe de discussion pendant les cours."], ["ex", "Une photo prise en cachette au cours de sport peut ainsi circuler dans toute l’école en quelques minutes."]],
      [["concl", "En somme, ranger son téléphone n’est pas une punition : c’est une manière de mieux apprendre et de mieux se respecter."]],
    ],
    schema: {
      theme: "Le téléphone portable à l’école.",
      these: "Le téléphone portable devrait être interdit pendant les cours.",
      args: [
        { arg: "Il empêche de se concentrer.", expl: ["Chaque notification détourne l’attention et il faut du temps pour se remettre au travail."], ex: ["L’élève qui reçoit trois messages pendant un exercice de mathématiques."] },
        { arg: "L’interdiction protège du cyberharcèlement.", expl: ["Sans téléphone, on ne peut ni filmer ni humilier un camarade pendant les cours."], ex: ["La photo prise en cachette au cours de sport, partagée dans toute l’école."] },
      ],
    },
    resume: { max: 50, texte: ["Dans sa chronique, Laure Martin soutient que le téléphone portable devrait être interdit pendant les cours. D’une part, il nuit à la concentration, car chaque notification détourne l’attention. D’autre part, son interdiction protège les élèves du cyberharcèlement."] },
  },
  {
    id: "t2", niveau: 1, domaine: "animaux", titre: "Des zoos pour protéger",
    auteur: "Hugo Lambert", source: "carte blanche d’un biologiste (auteur fictif), 2024",
    paras: [
      [["amorce", "Chaque année, des millions de visiteurs se pressent devant les enclos des zoos."], ["contre", "Certes, un animal en captivité ne vit pas comme dans la nature, et certains zoos d’autrefois offraient des conditions indignes."], ["these", "Pourtant, les zoos modernes restent utiles, à condition d’être d’abord des lieux de protection."]],
      [["arg", "Premièrement, ils participent à la sauvegarde des espèces menacées."], ["expl", "Grâce à des programmes d’élevage coordonnés entre établissements, ils maintiennent des populations en bonne santé et peuvent parfois réintroduire des animaux dans leur milieu naturel."], ["ex", "C’est ainsi que l’oryx d’Arabie, presque disparu à l’état sauvage, a retrouvé le désert grâce à des animaux nés en captivité."]],
      [["arg", "Deuxièmement, les zoos sensibilisent le public."], ["expl", "Voir un animal en vrai crée une émotion qu’aucun documentaire ne remplace, et cette émotion donne envie de protéger la nature."], ["ex", "Beaucoup de parcs proposent d’ailleurs des ateliers où les enfants découvrent les menaces qui pèsent sur la forêt tropicale."]],
      [["arg", "Enfin, ils financent la protection sur le terrain."], ["expl", "Une partie du prix des billets soutient des projets dans les pays où vivent ces espèces."]],
      [["concl", "Plutôt que de fermer les zoos, il faut donc exiger qu’ils deviennent de véritables arches de protection."]],
    ],
    schema: {
      theme: "L’utilité des zoos.",
      these: "Les zoos modernes restent utiles s’ils sont d’abord des lieux de protection.",
      contre: "Concession : la captivité n’est pas la vie sauvage et certains zoos anciens étaient indignes.",
      args: [
        { arg: "Ils sauvent des espèces menacées.", expl: ["Programmes d’élevage coordonnés, réintroductions."], ex: ["L’oryx d’Arabie réintroduit dans le désert."] },
        { arg: "Ils sensibilisent le public.", expl: ["Voir un animal en vrai crée une émotion qui donne envie de protéger la nature."], ex: ["Les ateliers pour enfants sur la forêt tropicale."] },
        { arg: "Ils financent la protection sur le terrain.", expl: ["Une partie du prix des billets soutient des projets locaux."], ex: [] },
      ],
    },
    resume: { max: 70, texte: ["Dans une carte blanche, le biologiste Hugo Lambert reconnaît que la captivité n’est pas la vie sauvage, mais il estime que les zoos modernes restent utiles s’ils se consacrent à la protection des animaux. En effet, ils sauvent des espèces menacées grâce à l’élevage et aux réintroductions. De plus, ils sensibilisent le public à la nature. Enfin, ils financent des projets de protection sur le terrain."] },
  },
  {
    id: "t3", niveau: 2, domaine: "citoyennete", titre: "Voter à seize ans",
    auteur: "Samira Haddad", source: "éditorial d’un magazine pour adolescents (auteur fictif), 2025",
    paras: [
      [["amorce", "En Belgique, les jeunes de seize et dix-sept ans ont pu voter pour la première fois aux élections européennes de 2024."], ["these", "Il faudrait aller plus loin et leur accorder le droit de vote à toutes les élections."]],
      [["arg", "La première raison est que les décisions politiques concernent directement les jeunes."], ["expl", "Climat, enseignement, logement, emploi : ce sont eux qui vivront le plus longtemps avec les conséquences des choix faits aujourd’hui."], ["ex", "Les grandes marches pour le climat ont d’ailleurs montré que de nombreux adolescents se passionnent pour ces questions."]],
      [["arg", "La seconde raison est que voter tôt crée une habitude."], ["expl", "À seize ans, on vit souvent encore chez ses parents et on fréquente l’école : c’est le moment idéal pour apprendre à s’informer et à voter, avec l’aide des enseignants."], ["ex", "Un cours de citoyenneté peut, par exemple, comparer les programmes des partis juste avant le scrutin."]],
      [["contre", "On objecte souvent que les jeunes seraient trop influençables."], ["refut", "Mais les adultes aussi subissent des influences, et personne ne songe pour autant à leur retirer le droit de vote."]],
      [["concl", "Faire confiance aux jeunes, c’est préparer des citoyens plus engagés."]],
    ],
    schema: {
      theme: "Le droit de vote des jeunes de seize ans.",
      these: "Il faut accorder le droit de vote à seize ans à toutes les élections.",
      contre: "Contre-argument : les jeunes seraient trop influençables. Réfutation : les adultes aussi sont influencés et gardent le droit de vote.",
      args: [
        { arg: "Les décisions politiques concernent directement les jeunes.", expl: ["Ils vivront le plus longtemps avec les conséquences des choix actuels (climat, école, logement, emploi)."], ex: ["Les marches des jeunes pour le climat."] },
        { arg: "Voter tôt crée une habitude.", expl: ["À seize ans, on est encore à l’école et entouré : moment idéal pour apprendre à s’informer."], ex: ["Comparer les programmes des partis au cours de citoyenneté."] },
      ],
    },
    resume: { max: 80, texte: ["Dans un éditorial, Samira Haddad plaide pour que les jeunes de seize ans puissent voter à toutes les élections. D’abord, elle souligne que les décisions politiques les concernent directement, puisqu’ils vivront longtemps avec leurs conséquences. Ensuite, elle affirme que voter tôt crée une habitude, encouragée par l’école. Enfin, elle réfute l’idée que les jeunes seraient trop influençables : les adultes le sont aussi."] },
  },
  {
    id: "t4", niveau: 2, domaine: "consommation", titre: "La mode jetable nous coûte cher",
    auteur: "Thomas Delvaux", source: "chronique d’un journaliste (auteur fictif), 2025",
    paras: [
      [["amorce", "Samedi, Inès a acheté cinq t-shirts pour le prix d’une pizza."], ["amorce", "Trois semaines plus tard, deux d’entre eux sont déjà déformés et finissent au fond d’une armoire."], ["amorce", "Cette scène banale résume le succès de la « fast fashion », ces collections bon marché renouvelées sans cesse."], ["these", "Ce modèle, qui semble avantageux, est en réalité un piège qu’il faut refuser."]],
      [["arg", "Il abîme d’abord la planète."], ["expl", "Produire des vêtements en masse consomme énormément d’eau, d’énergie et de produits chimiques, puis les vêtements usés s’entassent dans des décharges."], ["ex", "Selon plusieurs estimations, la fabrication d’un seul jean peut demander plusieurs milliers de litres d’eau."]],
      [["arg", "Il repose ensuite sur l’exploitation de travailleurs."], ["expl", "Pour vendre à prix cassés, les marques font fabriquer leurs vêtements là où les salaires sont les plus bas et où la sécurité est souvent négligée."], ["ex", "En 2013, l’effondrement du Rana Plaza, un immeuble d’ateliers textiles au Bangladesh, a fait plus de mille morts."]],
      [["arg", "Enfin, l’économie promise est une illusion."], ["expl", "Un vêtement qui se déforme après trois lavages doit être remplacé : au bout du compte, on dépense souvent davantage qu’avec une pièce solide."]],
      [["contre", "On dira que la mode à petit prix permet aux familles modestes de s’habiller."], ["refut", "C’est vrai, mais la seconde main et les vêtements durables reviennent souvent moins cher à l’usage."]],
      [["concl", "Avant d’acheter, posons-nous donc une question simple : ce vêtement, le porterai-je au moins trente fois ?"]],
    ],
    schema: {
      theme: "La mode jetable (fast fashion).",
      these: "La mode jetable, qui semble avantageuse, est un piège qu’il faut refuser.",
      contre: "Contre-argument : elle permet aux familles modestes de s’habiller. Réfutation : la seconde main et les vêtements durables coûtent souvent moins cher à l’usage.",
      args: [
        { arg: "Elle abîme la planète.", expl: ["Production massive : eau, énergie, produits chimiques, déchets."], ex: ["Plusieurs milliers de litres d’eau pour un jean."] },
        { arg: "Elle exploite des travailleurs.", expl: ["Fabrication là où les salaires sont bas et la sécurité négligée."], ex: ["L’effondrement du Rana Plaza (2013)."] },
        { arg: "L’économie promise est une illusion.", expl: ["Les vêtements fragiles doivent être remplacés : on dépense plus."], ex: [] },
      ],
      autres: ["L’anecdote d’Inès et de ses cinq t-shirts (accroche).", "La question finale au lecteur (ouverture)."],
    },
    resume: { max: 100, texte: ["Dans sa chronique, Thomas Delvaux soutient que la mode jetable, apparemment avantageuse, est un piège à refuser. Premièrement, elle nuit à l’environnement, car sa production massive gaspille l’eau et l’énergie et génère des déchets. Deuxièmement, elle repose sur l’exploitation de travailleurs mal payés et mal protégés. Troisièmement, l’économie promise est illusoire, puisque des vêtements fragiles doivent vite être remplacés. Le journaliste admet que ces vêtements aident les familles modestes, mais il rappelle que la seconde main et les pièces durables reviennent moins cher à l’usage."] },
  },
  {
    id: "t5", niveau: 3, domaine: "expression", titre: "Rire de tout, mais pas n’importe comment",
    auteur: "Clara Renard", source: "billet d’humeur (auteur fictif), 2024",
    paras: [
      [["amorce", "« On peut rire de tout, mais pas avec n’importe qui », disait l’humoriste Pierre Desproges."], ["amorce", "La formule est célèbre, mais elle laisse une question ouverte : l’humour a-t-il des limites ?"], ["these", "Je crois qu’on peut rire de tout, à condition que le rire ne serve pas à écraser les plus faibles."]],
      [["arg", "L’humour est d’abord une liberté précieuse, car il permet de critiquer les puissants."], ["expl", "En faisant rire d’un dirigeant, le caricaturiste montre ses défauts plus efficacement qu’un long discours, et le rend moins intimidant."], ["ex", "Ce n’est pas un hasard si, dans les dictatures, les caricaturistes sont parmi les premiers emprisonnés."]],
      [["arg", "Le rire aide aussi à supporter le malheur."], ["expl", "Rire d’une épreuve, c’est reprendre un peu de pouvoir sur elle et se sentir moins seul."], ["ex", "Bien des malades et des soignants racontent que l’humour les a aidés à traverser les moments les plus durs."]],
      [["contre", "Certains en concluent que tout doit être permis, au nom de la liberté."], ["refut", "Pourtant, une blague qui vise une personne pour ce qu’elle est (sa couleur de peau, son handicap, sa religion) ne critique aucun pouvoir : elle humilie quelqu’un qui en a déjà peu."], ["ex", "Dans une cour de récréation, la moquerie répétée sur l’accent d’un élève n’a rien de drôle pour lui ; c’est du harcèlement."]],
      [["arg", "La limite n’est donc pas le sujet, mais la cible."], ["expl", "Rire d’une situation, d’une idée ou d’un abus de pouvoir libère ; rire pour rabaisser quelqu’un enferme."]],
      [["concl", "Avant de lancer une blague, il suffit peut-être de se demander : de qui est-ce que je ris, et qui en souffrira ?"]],
    ],
    schema: {
      theme: "Les limites de l’humour.",
      these: "On peut rire de tout, à condition que le rire ne serve pas à écraser les plus faibles.",
      contre: "Contre-argument : tout devrait être permis au nom de la liberté. Réfutation : la blague qui vise une personne pour ce qu’elle est humilie sans critiquer aucun pouvoir (ex. : moquerie sur l’accent = harcèlement).",
      args: [
        { arg: "L’humour permet de critiquer les puissants.", expl: ["La caricature montre les défauts d’un dirigeant et le rend moins intimidant."], ex: ["Les caricaturistes emprisonnés dans les dictatures."] },
        { arg: "Le rire aide à supporter le malheur.", expl: ["Rire d’une épreuve, c’est reprendre du pouvoir sur elle."], ex: ["Les malades et les soignants que l’humour aide."] },
        { arg: "La limite n’est pas le sujet mais la cible.", expl: ["Rire d’une situation libère ; rire pour rabaisser quelqu’un enferme."], ex: [] },
      ],
      autres: ["La citation de Pierre Desproges (accroche).", "La question finale au lecteur."],
    },
    resume: { max: 110, texte: ["Dans un billet d’humeur, Clara Renard se demande si l’humour a des limites. Elle soutient qu’on peut rire de tout, pourvu que le rire n’écrase pas les plus faibles. D’abord, l’humour est une liberté précieuse, car il permet de critiquer les puissants. Ensuite, il aide à supporter les épreuves. Toutefois, elle refuse l’idée que tout serait permis : une plaisanterie qui vise quelqu’un pour ce qu’il est ne critique aucun pouvoir, elle humilie. Elle conclut que la limite de l’humour ne tient pas au sujet, mais à sa cible."] },
  },
  {
    id: "t6", niveau: 3, domaine: "numerique", titre: "L’intelligence artificielle à l’école : apprendre plutôt qu’interdire",
    auteur: "Nicolas Verbeke", source: "opinion d’un directeur d’école (auteur fictif), 2025",
    paras: [
      [["amorce", "Depuis que les assistants d’intelligence artificielle (IA) rédigent des textes en quelques secondes, beaucoup d’enseignants s’inquiètent."], ["contre", "Leur crainte est compréhensible : un élève peut faire écrire son devoir par une machine sans rien apprendre."], ["these", "Interdire l’IA serait pourtant une erreur ; l’école doit au contraire apprendre aux élèves à s’en servir avec esprit critique."]],
      [["arg", "D’abord, l’IA fait déjà partie du monde dans lequel les jeunes vivront et travailleront."], ["expl", "L’ignorer à l’école, c’est laisser chacun l’utiliser seul, sans règles et sans recul."], ["ex", "Les traducteurs automatiques et les correcteurs d’orthographe, longtemps vus comme des tricheries, sont aujourd’hui des outils ordinaires."]],
      [["arg", "Ensuite, bien utilisée, l’IA peut aider à apprendre."], ["expl", "Elle peut réexpliquer une notion autrement, proposer des exercices supplémentaires ou commenter un brouillon, à condition que l’élève fasse lui-même le travail."], ["ex", "Un élève qui ne comprend pas une règle de grammaire peut lui demander trois exemples de plus, puis vérifier avec son cours."]],
      [["arg", "Surtout, l’IA se trompe, et c’est précisément pour cela qu’il faut l’enseigner."], ["expl", "Elle produit des phrases très sûres d’elles, même quand elles sont fausses : seul un utilisateur formé peut repérer l’erreur."], ["ex", "Il lui arrive par exemple d’inventer une source ou une citation qui n’existe pas."]],
      [["refut", "Quant au risque de tricherie, il oblige surtout à repenser les évaluations : travail en classe, brouillons à rendre, oral où l’élève explique sa démarche."]],
      [["concl", "L’IA ne remplacera pas l’effort d’apprendre ; à l’école de faire en sorte qu’elle le soutienne au lieu de l’éviter."]],
    ],
    schema: {
      theme: "La place de l’intelligence artificielle à l’école.",
      these: "Il ne faut pas interdire l’IA à l’école, mais apprendre aux élèves à l’utiliser avec esprit critique.",
      contre: "Contre-argument : l’IA permet de tricher sans rien apprendre. Réfutation : il faut repenser les évaluations (travail en classe, brouillons, oral).",
      args: [
        { arg: "L’IA fait déjà partie du monde des jeunes.", expl: ["L’ignorer, c’est laisser chacun l’utiliser seul, sans règles."], ex: ["Traducteurs et correcteurs, autrefois vus comme tricheries, devenus ordinaires."] },
        { arg: "Bien utilisée, elle aide à apprendre.", expl: ["Réexpliquer, proposer des exercices, commenter un brouillon, si l’élève fait le travail."], ex: ["Demander trois exemples de plus d’une règle de grammaire."] },
        { arg: "Elle se trompe, donc il faut l’enseigner.", expl: ["Elle affirme des choses fausses avec assurance : il faut un utilisateur formé."], ex: ["Elle peut inventer une source ou une citation."] },
      ],
    },
    resume: { max: 120, texte: ["Dans un texte d’opinion, Nicolas Verbeke admet que l’intelligence artificielle facilite la tricherie, mais il estime que l’école doit enseigner son usage critique plutôt que l’interdire. Premièrement, l’IA fait déjà partie du monde des jeunes : l’ignorer reviendrait à les laisser l’utiliser sans règles. Deuxièmement, bien employée, elle peut soutenir l’apprentissage, à condition que l’élève fournisse lui-même l’effort. Troisièmement, comme elle commet des erreurs présentées avec assurance, seuls des utilisateurs formés peuvent les repérer. Selon lui, le risque de fraude impose surtout de transformer les évaluations."] },
  },
  {
    id: "t7", niveau: 3, domaine: "justice", titre: "Punir sans se venger",
    auteur: "Élise Moreau", source: "tribune d’une juriste (auteur fictif), 2025",
    paras: [
      [["amorce", "Après un crime terrible, la colère est légitime ; il arrive même qu’on entende réclamer « œil pour œil, dent pour dent »."], ["these", "Pourtant, si la justice doit sanctionner les crimes, elle ne doit jamais devenir une vengeance."]],
      [["arg", "La vengeance, d’abord, n’a pas de fin."], ["expl", "Chaque représailles appelle une nouvelle représailles, si bien que la violence se transmet d’une génération à l’autre."], ["ex", "Les vendettas, ces guerres entre familles qui ont duré des décennies, en sont l’illustration."]],
      [["arg", "La justice, au contraire, protège aussi les victimes."], ["expl", "Le procès établit publiquement la vérité, désigne les responsables et donne aux victimes une place pour être entendues."], ["ex", "Lors du procès des attentats de Bruxelles, en 2022 et 2023, de nombreuses victimes et proches sont venus témoigner devant la cour d’assises."]],
      [["arg", "Enfin, une peine juste doit aussi préparer l’avenir."], ["expl", "Punir n’a de sens que si cela protège la société et, quand c’est possible, permet au coupable de comprendre le mal qu’il a fait."], ["ex", "En Belgique, des médiations permettent ainsi à des victimes qui le souhaitent de rencontrer l’auteur des faits, accompagnées par des professionnels."]],
      [["contre", "Certains estiment qu’une peine extrême, comme la peine de mort, découragerait les criminels."], ["refut", "Rien ne montre pourtant que les pays qui l’appliquent connaissent moins de crimes graves ; et une erreur judiciaire y devient irréparable."]],
      [["concl", "Refuser la vengeance n’est pas une faiblesse : c’est ce qui distingue une société de droit de la loi du plus fort."]],
    ],
    schema: {
      theme: "La différence entre justice et vengeance.",
      these: "La justice doit sanctionner les crimes, mais ne doit jamais devenir une vengeance.",
      contre: "Contre-argument : une peine extrême (la peine de mort) dissuaderait les criminels. Réfutation : rien ne le prouve, et une erreur judiciaire devient irréparable.",
      args: [
        { arg: "La vengeance n’a pas de fin.", expl: ["Chaque représailles en appelle une autre ; la violence se transmet."], ex: ["Les vendettas entre familles."] },
        { arg: "La justice protège aussi les victimes.", expl: ["Le procès établit la vérité, désigne les responsables, écoute les victimes."], ex: ["Les témoignages au procès des attentats de Bruxelles (2022-2023)."] },
        { arg: "Une peine juste prépare l’avenir.", expl: ["Protéger la société et faire comprendre au coupable le mal commis."], ex: ["Les médiations entre victimes et auteurs en Belgique."] },
      ],
    },
    resume: { max: 120, texte: ["Dans une tribune, la juriste Élise Moreau soutient que la justice doit punir les crimes sans jamais se transformer en vengeance. D’abord, la vengeance n’a pas de fin, car chaque représailles en provoque une autre. Ensuite, la justice protège aussi les victimes : le procès établit la vérité et leur permet d’être entendues. Enfin, une peine juste doit préparer l’avenir en protégeant la société et en amenant le coupable à prendre conscience de ses actes. L’auteure réfute enfin l’idée que la peine de mort dissuaderait les criminels, en rappelant qu’une erreur judiciaire serait alors irréparable."] },
  },
];

export const textOf = t => t.paras.map(p => p.map(s => s[1]).join(" ")).join("\n\n");
export const countWords = s => (String(s || "").replace(/[’']/g, " ").match(/[A-Za-zÀ-ÖØ-öø-ÿœŒæÆ0-9]+(?:-[A-Za-zÀ-ÖØ-öø-ÿœŒ]+)*/g) || []).length;
export const textWords = t => countWords(textOf(t));
