// Analyse du livre « Un jihad de l'amour » (Mohamed El Bachiri, avec David Van Reybrouck, 2017).
// Analyse faite à partir des éditions néerlandaise (Een jihad van liefde, De Bezige Bij) et anglaise
// (A Jihad for Love, Head of Zeus). L'application ne reproduit pas le texte du livre :
// tout est reformulé. Les titres des fragments sont traduits librement et peuvent différer
// légèrement dans l'édition française (JC Lattès).

export const REF_LIVRE = {
  titre: "Un jihad de l’amour",
  auteur: "Mohamed El Bachiri",
  avec: "avec David Van Reybrouck (propos recueillis et mis en forme)",
  editeur: "JC Lattès",
  annee: "2017",
  genre: "essai-témoignage",
};

// ---------- Le schéma argumentatif de référence ----------
export const SCHEMA_LIVRE = {
  theme: "La réponse à apporter à la haine et à la violence terroriste.",
  these: "Face à la haine, il faut répondre par l’amour : mener un « jihad de l’amour », c’est-à-dire un effort sur soi pour refuser la vengeance et reconnaître l’humanité de chacun.",
  args: [
    {
      id: "A1", court: "La vengeance reproduit le mal",
      arg: "Répondre à la violence par la violence ne fait que reproduire le mal.",
      expl: [
        "Se venger, c’est commettre la même faute que les assassins et « se mettre à leur niveau ».",
        "On ne répare pas une injustice par une autre injustice : la colère, même légitime, ne justifie jamais une atrocité.",
        "La haine d’un camp nourrit l’extrémisme de l’autre : rien n’est résolu et ce sont les populations qui paient.",
      ],
      ex: [
        "Ses fils, furieux, réclament vengeance : il leur répond qu’ils valent mieux que cela.",
        "Le poème « Vengeance » : un frère veut lever une armée, l’autre lâche quatre colombes vers les quatre coins du monde.",
        "Le conflit israélo-palestinien, où chaque violence alimente la violence d’en face.",
        "La peine de mort, qu’il décrit comme un crime commis avec l’accord de la société.",
      ],
      fragments: ["Fraternité", "Vengeance", "La peine de mort", "Les auteurs", "Politique"],
    },
    {
      id: "A2", court: "Le vrai sens du mot jihad",
      arg: "Le mot « jihad » désigne d’abord un effort sur soi-même, et non une guerre : les terroristes l’ont détourné.",
      expl: [
        "Dans son sens premier, le jihad est l’effort que chacun mène contre ses propres passions et sa colère.",
        "Le véritable « jihadiste » ne s’emporte pas : il cherche le savoir, va vers l’autre et reconnaît son humanité.",
        "Mener un jihad de l’amour, c’est donc résister à la haine, ce qui demande plus de courage que la violence.",
      ],
      ex: [
        "La définition du dictionnaire placée en tête du livre : le « grand jihad » contre ses passions, le « petit jihad » de défense.",
        "Les paroles du Prophète « Ne te mets pas en colère » et son conseil de s’asseoir, puis de s’allonger pour calmer sa colère.",
        "Sa propre formule : il se dit « jihadiste de l’amour » et préférerait mourir plutôt que haïr.",
      ],
      fragments: ["Épigraphe", "Jihad", "Le cœur"],
    },
    {
      id: "A3", court: "Une foi éclairée par la raison",
      arg: "Une foi lue avec la raison et replacée dans son contexte historique mène à l’amour, pas à la violence.",
      expl: [
        "Le Coran a un axe vertical (le lien avec Dieu, valable pour toujours) et un axe horizontal (des règles liées au VIIe siècle).",
        "Les passages guerriers sont des paroles historiques : ils ne peuvent jamais servir à faire du mal à quelqu’un.",
        "La raison et l’esprit critique sont un don de Dieu ; il n’y a rien de spirituel dans un meurtre ou une guerre.",
        "L’islam a de nombreux visages : il rejette tous les fondamentalismes, y compris une laïcité qui exclut les croyants.",
      ],
      ex: [
        "Le Prophète, mystique à La Mecque, devenu chef politique malgré lui à Médine.",
        "Sa question d’enfant : pourquoi Mère Teresa n’irait-elle pas au paradis ?",
        "Bagdad au Xe siècle, où les savants étudiaient les pensées grecque, indienne et perse.",
        "La polygamie et le voile : selon lui, il faut d’abord être honnête et laisser les femmes décider.",
        "Les fidèles qui prient au bord de l’autoroute pour être vus : la religion ne doit pas être un étendard.",
      ],
      fragments: ["Le Coran", "Réflexion", "L’histoire", "Honnêteté", "Séparation de la religion et de l’État", "La prière"],
    },
    {
      id: "A4", court: "Tous frères en humanité",
      arg: "Tous les êtres humains sont frères : l’humanité commune passe avant ce qui nous sépare.",
      expl: [
        "Il se définit comme un être humain d’abord, un musulman ensuite.",
        "Être humain implique trois valeurs : le caractère sacré de toute vie, le libre arbitre et la fraternité.",
        "En allant au bout de sa propre religion, on rencontre celle des autres ; même l’auteur d’un attentat reste un frère « qui a pris le mauvais chemin ».",
        "On peut perdre sa culture, sa foi ou son pays, mais pas son humanité.",
      ],
      ex: [
        "L’affection reçue des enseignants de son école catholique.",
        "Le verset du Coran selon lequel Dieu a fait des peuples et des tribus « pour qu’ils se connaissent ».",
        "Les musulmans de Damas autorisés à prier dans une église ; Raphaël peignant le philosophe musulman Averroès au Vatican.",
        "Les prières venues du monde entier, « au nom de tous les dieux », après la mort de Loubna.",
        "Partager un repas avec quelqu’un qui ne pense pas comme soi.",
      ],
      fragments: ["Mon école", "Compassion", "Fraternité", "Appartenance", "Humanité", "Le Maroc"],
    },
    {
      id: "A5", court: "La diversité et l’éducation",
      arg: "La diversité est une richesse : c’est l’éducation, et non le repli ou les préjugés, qui permet de vivre ensemble.",
      expl: [
        "Une communauté doit être « une porte et non une forteresse » : ni assimilation totale, ni repli sur soi.",
        "La diversité doit devenir la norme dès l’enfance ; la sagesse commence par la curiosité et la connaissance de l’histoire.",
        "Il faut apprendre aux jeunes à exprimer leurs émotions, notamment par l’art et la poésie.",
        "Les préjugés et les images caricaturales des médias enferment les personnes dans une étiquette.",
      ],
      ex: [
        "À six ans, un voisin le traite de « sale Marocain ».",
        "Le Molenbeek des médias, présenté comme Kaboul, face au Molenbeek solidaire qu’il connaît.",
        "La Belgique, « pays bâtard » et carrefour, et l’humour de la « belgitude ».",
        "Le Maroc, sa tradition de tolérance, et Loubna citée par le roi comme exemple d’intégration réussie.",
        "Ceux qui interdisent la musique, l’art et la poésie privent les êtres humains du plus beau d’eux-mêmes.",
      ],
      fragments: ["Confiance en soi", "Curiosité", "Molenbeek", "Le Maroc", "Deux pays", "L’éducation"],
    },
  ],
  conclusion: "Le livre se termine par un appel lyrique : l’amour est la seule réponse à la haine, et l’auteur, conducteur de métro, parle pour tous ces musulmans ordinaires qu’on n’entend jamais.",
  autres: [
    "Le récit du 22 mars 2016 et du deuil (la nuit, les médicaments, les enfants) : il émeut et montre d’où l’auteur parle.",
    "Les souvenirs d’enfance, de jeunesse et la vie avec Loubna : ils construisent la crédibilité de l’auteur (son éthos).",
    "Les textes lyriques et les poèmes adressés à Loubna : hommage et expression de la douleur.",
  ],
};

// ---------- Les fragments du livre (ordre de l'édition néerlandaise) ----------
// f : fonction dominante — recit, lyrique, argu, mixte ; a : argument(s) concerné(s) ; m : mouvement
export const MOUVEMENTS = [
  { id: 1, t: "Ouverture : une définition et une lettre", d: "La définition du mot « jihad » et une lettre d’amour à Loubna posent les deux fils du livre : le sens d’un mot et le deuil." },
  { id: 2, t: "Le choc et le deuil", d: "Le jour de l’attentat, l’écriture la nuit sur son téléphone, l’insomnie, les médicaments : un homme qui se dit « mort » mais reste là pour ses enfants." },
  { id: 3, t: "D’où il parle : origines, foi, esprit critique", d: "Fils d’immigrés marocains, il grandit à Molenbeek, fréquente une école catholique et apprend à questionner sa religion avec la raison." },
  { id: 4, t: "Loubna, une histoire d’amour", d: "La rencontre, la vie de couple, le mariage, les naissances, puis un portrait-hommage de Loubna." },
  { id: 5, t: "Répondre à l’attentat : ni haine ni vengeance", d: "Ce qu’il dit à ses fils, le refus de la vengeance et de la peine de mort, sa réponse aux auteurs des attentats." },
  { id: 6, t: "Appartenances : Molenbeek, le Maroc, la Belgique", d: "Il défend Molenbeek contre sa caricature, raconte l’enterrement au Maroc, la rencontre avec le roi, et son attachement à ses deux pays." },
  { id: 7, t: "Le manifeste : humanité, jihad, raison", d: "Il expose ses principes : appartenance à l’humanité, éducation, sens véritable du jihad, valeurs humanistes, honnêteté, séparation de la religion et de l’État." },
  { id: 8, t: "Clôture : l’appel", d: "Des poèmes sur l’amour et une dernière strophe : il parle au nom de tous les musulmans ordinaires qu’on n’entend jamais." },
];

export const FRAGMENTS = [
  { t: "Épigraphe : définition du mot « jihad »", en: "—", nl: "—", m: 1, f: "argu", a: ["A2"], d: "Un article de dictionnaire distingue l’effort contre ses passions (grand jihad) et la défense de l’islam (petit jihad)." },
  { t: "Lettre à Loubna", en: "(sans titre)", nl: "(zonder titel)", m: 1, f: "lyrique", a: [], d: "Il dit à sa femme disparue que rien n’a plus de goût et se demande quoi dire aux enfants." },
  { t: "Ce jour-là", en: "That day", nl: "Die dag", m: 2, f: "recit", a: [], d: "Récit très bref : il est en congé, elle prend le métro, il comprend tout en voyant qu’elle n’est plus connectée après 9 h 10." },
  { t: "Le soir", en: "The evening", nl: "’s Avonds", m: 2, f: "lyrique", a: [], d: "Il écrit des textes sur son téléphone : écrire sur l’amour le rapproche de Loubna." },
  { t: "La nuit", en: "The night", nl: "’s Nachts", m: 2, f: "recit", a: [], d: "La nuit, sous médicaments, il descend l’escalier pour donner le biberon au plus jeune de ses trois fils." },
  { t: "Ma voix", en: "My voice", nl: "Mijn stem", m: 2, f: "lyrique", a: [], d: "Il se dit « un mort qui donne une leçon de vie », vivant seulement pour ses enfants." },
  { t: "Mes parents", en: "My parents", nl: "Mijn ouders", m: 3, f: "recit", a: [], d: "Né en 1980, sixième de huit enfants, il retrace l’immigration de ses parents depuis le Rif et Oujda." },
  { t: "La langue", en: "Language", nl: "Taal", m: 3, f: "recit", a: [], d: "Le français est sa langue maternelle ; ses parents parlaient tamazight entre eux." },
  { t: "La foi", en: "Faith", nl: "Geloof", m: 3, f: "mixte", a: ["A3"], d: "Musulman par naissance puis par conviction ; il a appris le Coran par cœur sans le comprendre, mais le trouve d’une grande poésie." },
  { t: "Mon école", en: "My school", nl: "Mijn school", m: 3, f: "recit", a: ["A4"], d: "Il fréquente une école primaire catholique et se sent proche des chrétiens." },
  { t: "Compassion", en: "Compassion", nl: "Mededogen", m: 3, f: "argu", a: ["A4"], d: "Il invite les musulmans à témoigner aux autres croyants et aux athées la même bienveillance que celle qu’il a reçue." },
  { t: "Le Coran", en: "The Koran", nl: "De Koran", m: 3, f: "argu", a: ["A3"], d: "Axe vertical et axe horizontal : les passages guerriers sont historiques et ne doivent jamais servir à nuire." },
  { t: "Réflexion", en: "Reflection", nl: "Reflectie", m: 3, f: "argu", a: ["A3"], d: "Enfant, il ne comprenait pas que Mère Teresa soit exclue du paradis ; réfléchir est un don de Dieu." },
  { t: "Curiosité", en: "Curiosity", nl: "Nieuwsgierigheid", m: 3, f: "argu", a: ["A5"], d: "La sagesse commence par la curiosité ; l’avenir commence par l’histoire." },
  { t: "L’histoire", en: "History", nl: "Geschiedenis", m: 3, f: "argu", a: ["A3"], d: "L’islam a de nombreux visages ; il admire Luther, qui a osé poser des questions." },
  { t: "Confiance en soi", en: "Self-confidence", nl: "Zelfvertrouwen", m: 3, f: "mixte", a: ["A5"], d: "Traité de « sale Marocain » à six ans, il n’a pas su répondre : l’école ne lui avait pas appris que la Belgique avait fait venir les immigrés." },
  { t: "Voyager", en: "Travel", nl: "Reizen", m: 3, f: "recit", a: [], d: "Il quitte l’école sans diplôme à dix-huit ans et trie le courrier de nuit à l’aéroport." },
  { t: "La rencontre", en: "Meeting", nl: "Ontmoeting", m: 4, f: "recit", a: [], d: "Loubna entre dans le magasin de téléphones où il travaille." },
  { t: "La relation", en: "Relationship", nl: "Relatie", m: 4, f: "recit", a: [], d: "Fiançailles, mariage civil en 2004, installation à Schaerbeek." },
  { t: "Vivre ensemble", en: "Living together", nl: "Samenwonen", m: 4, f: "mixte", a: [], d: "Il apprend à vivre à deux ; l’amour, comme la foi, se travaille." },
  { t: "Le mariage", en: "Marriage", nl: "Huwelijk", m: 4, f: "lyrique", a: [], d: "Loubna est son amie, pas son trophée : « j’aime, donc je suis »." },
  { t: "La naissance", en: "Birth", nl: "Geboorte", m: 4, f: "lyrique", a: [], d: "Les plus beaux moments de sa vie, devenus douloureux à évoquer." },
  { t: "À propos des attentats", en: "About the attacks", nl: "Over de aanslagen", m: 5, f: "argu", a: ["A1"], d: "Une seule phrase : le terroriste « le laisse froid ». Il refuse de lui donner de l’importance." },
  { t: "Bonté", en: "Goodness", nl: "Goedheid", m: 4, f: "lyrique", a: [], d: "Portrait-hommage de Loubna, professeure de sport engagée, généreuse et opposée à la violence." },
  { t: "Les enfants", en: "The children", nl: "De kinderen", m: 5, f: "recit", a: [], d: "Ce qu’il a dit à ses fils : maman est au ciel." },
  { t: "Fraternité", en: "Brotherhood", nl: "Broederschap", m: 5, f: "argu", a: ["A1", "A4"], d: "« Nous sommes tous frères », même celui qui a commis le pire ; se venger, c’est se mettre à son niveau." },
  { t: "Vengeance", en: "Vengeance", nl: "Wraak", m: 5, f: "argu", a: ["A1"], d: "Poème : un père capitaine et ses trois fils débattent ; l’un veut une armée, l’autre envoie quatre colombes." },
  { t: "La peine de mort", en: "The death penalty", nl: "De doodstraf", m: 5, f: "argu", a: ["A1"], d: "La peine de mort est un crime commis avec l’accord de la société." },
  { t: "Le cœur", en: "The heart", nl: "Het hart", m: 5, f: "argu", a: ["A2"], d: "Rien ne justifie la haine ; l’amour est une ressource inépuisable." },
  { t: "Les auteurs", en: "The wrongdoers", nl: "De daders", m: 5, f: "argu", a: ["A1", "A3"], d: "Il s’adresse au terroriste : si tuer des innocents est pour toi une justice, nous n’avons pas la même religion." },
  { t: "Molenbeek", en: "Molenbeek", nl: "Molenbeek", m: 6, f: "argu", a: ["A5"], d: "Le Molenbeek des médias fait plus peur que le vrai ; après la mort de Loubna, il y a trouvé une grande solidarité." },
  { t: "Le Maroc", en: "Morocco", nl: "Marokko", m: 6, f: "mixte", a: ["A4", "A5"], d: "Loubna est enterrée à Salé ; le roi Philippe la cite comme exemple d’intégration ; le Maroc, terre de tolérance." },
  { t: "Deux pays", en: "Two countries", nl: "Twee landen", m: 6, f: "mixte", a: ["A5"], d: "Il aime la « belgitude » et la qualité de vie marocaine." },
  { t: "Profondeurs", en: "Depths", nl: "Diepten", m: 6, f: "lyrique", a: [], d: "Le doute, le brouillard, la nécessité de rester debout pour ses enfants." },
  { t: "Beauté", en: "Beauty", nl: "Schoonheid", m: 6, f: "lyrique", a: [], d: "Une phrase : la vie n’a plus le même goût, mais le coucher de soleil reste beau." },
  { t: "L’essentiel", en: "The essence", nl: "De essentie", m: 6, f: "mixte", a: [], d: "L’essentiel n’est pas leur histoire d’amour, mais le message de paix que la mort de Loubna laisse." },
  { t: "Appartenance", en: "Belonging", nl: "Verbondenheid", m: 7, f: "argu", a: ["A4"], d: "Aller au bout de sa religion, c’est y trouver celle des autres ; le cosmopolitisme ne remplace pas la culture locale." },
  { t: "L’éducation", en: "Education", nl: "Onderwijs", m: 7, f: "argu", a: ["A5"], d: "Une communauté est une porte, pas une forteresse ; l’art et la poésie apprennent aux jeunes à exprimer leurs émotions." },
  { t: "Jihad", en: "Jihad", nl: "Jihad", m: 7, f: "argu", a: ["A2"], d: "Il se proclame « jihadiste de l’amour » et explique le sens premier du mot : l’effort sur soi." },
  { t: "Ce livre", en: "This book", nl: "Dit boek", m: 7, f: "mixte", a: [], d: "Le livre est un poème, un hommage à Loubna, une réponse à l’humanité et non à la folie." },
  { t: "Humanité", en: "Humanity", nl: "Menselijkheid", m: 7, f: "argu", a: ["A4"], d: "Humain d’abord, musulman ensuite : caractère sacré de la vie, libre arbitre, fraternité." },
  { t: "Politique", en: "Politics", nl: "Politiek", m: 7, f: "argu", a: ["A1", "A4"], d: "Il se met à la place des Palestiniens et des Israéliens : chaque mort est un mort de trop." },
  { t: "Honnêteté", en: "Honesty", nl: "Eerlijkheid", m: 7, f: "argu", a: ["A3"], d: "Polygamie et voile : être honnête et respecter le choix des femmes." },
  { t: "Séparation de la religion et de l’État", en: "Separation of religion and state", nl: "Scheiding van kerk en staat", m: 7, f: "argu", a: ["A3"], d: "Il défend la séparation, mais refuse une laïcité qui exclut les croyants : c’est aussi un fondamentalisme." },
  { t: "La prière", en: "Prayer", nl: "Gebed", m: 7, f: "argu", a: ["A3"], d: "La religion ne doit pas être un étendard ; la prière reste pour lui un moment de calme." },
  { t: "À la nuit (poème)", en: "At night", nl: "In de nacht", m: 8, f: "lyrique", a: ["A4"], d: "Une voix intérieure appelle à aimer son prochain, même mauvais." },
  { t: "L’amour (poème)", en: "Love", nl: "Liefde", m: 8, f: "lyrique", a: ["A4"], d: "Une litanie : l’amour ne peut mener à la haine ; « si tu es Amour, je partage ta religion »." },
  { t: "Strophe finale", en: "Final strophe", nl: "Slotstrofe", m: 8, f: "mixte", a: [], d: "Sans le drame, on ne l’aurait jamais entendu : il était un musulman comme tant d’autres qu’on n’entend jamais." },
];

export const FONCTIONS = {
  recit: ["Récit", "Raconter des faits vécus (narratif)"],
  lyrique: ["Lyrique", "Exprimer des émotions, rendre hommage (lyrique, élégiaque)"],
  argu: ["Argumentatif", "Défendre une idée, convaincre"],
  mixte: ["Mixte", "Un récit ou une émotion qui sert aussi à argumenter"],
};

// ---------- Ce que révèle la comparaison des traductions ----------
export const TRADUCTIONS = [
  { t: "Un livre traduit… d’une traduction",
    d: "D’après la postface, le livre réunit des textes écrits par Mohamed El Bachiri après les attentats et des propos recueillis par David Van Reybrouck lors d’un long entretien, les 2 et 3 février 2017, à Anderlecht et à Molenbeek. Les textes, d’abord en français, ont été traduits en néerlandais puis retravaillés : l’édition néerlandaise (mars 2017) est la première parue. La version anglaise est traduite du néerlandais.",
    lecon: "Le sens global (les idées) reste stable d’une langue à l’autre ; les mots exacts, eux, changent. C’est exactement ce que fait un résumé : garder les idées, pas les mots." },
  { t: "« Jihad » : effort ou lutte ?",
    d: "En néerlandais, le mot jihad est expliqué par « inspanning », qui signifie « effort ». En anglais, il devient « struggle », qui signifie plutôt « lutte, combat ». Le dictionnaire cité en ouverture donne les deux sens : effort et lutte.",
    lecon: "La nuance compte : « effort sur soi » insiste sur le travail intérieur, « lutte » garde une idée de combat. Pour ton résumé, la formulation la plus fidèle à la thèse est « un effort sur soi-même contre la haine »." },
  { t: "Le détail de 9 h 10",
    d: "En néerlandais, il comprend le drame en voyant que Loubna n’a plus été connectée après 9 h 10. La phrase anglaise est ambiguë et peut faire croire à un métro de 9 h 10.",
    lecon: "Un détail de récit peut se brouiller d’une traduction à l’autre. Bonne nouvelle : ce genre de détail n’a de toute façon pas sa place dans un résumé argumentatif." },
  { t: "« Les auteurs » ou « les malfaiteurs » ?",
    d: "Le fragment s’intitule « De daders » en néerlandais (les auteurs des faits) et « The wrongdoers » en anglais (ceux qui font le mal). En néerlandais, il dit qu’il adresserait sa phrase « à lui », un terroriste précis ; en anglais, « à eux ».",
    lecon: "Le néerlandais rend l’adresse plus personnelle : il parle d’homme à homme à celui qui a tué. Cela renforce l’argument de la fraternité : même l’assassin reste quelqu’un à qui l’on parle." },
  { t: "Molenbeek : « pas seulement » ou « pas directement » en Syrie ?",
    d: "Aux jeunes qui veulent quitter Molenbeek, la version néerlandaise dit en substance : ne va pas uniquement en Syrie, va aux quatre coins du monde. La version anglaise dit plutôt : ne va pas directement en Syrie.",
    lecon: "Le message reste le même (voyager pour découvrir et admirer, pas pour détruire), mais la nuance diffère. Un résumé fidèle retient l’idée commune aux deux versions." },
  { t: "La haine « inutile » ou « impossible » ?",
    d: "Dans le fragment « Le cœur », la version néerlandaise affirme que rien ne justifie la haine et que rien ne mènera à la haine ; l’anglaise, que rien ne rend la haine nécessaire.",
    lecon: "Les deux traductions défendent la même thèse : la haine n’a aucune justification. Quand deux versions divergent, cherche ce qu’elles ont en commun : c’est le noyau de l’idée." },
  { t: "Une identité en trois mots",
    d: "La quatrième de couverture néerlandaise présente l’auteur comme « Belge marocain, musulman et Molenbeekois ». En français, on retrouve la formule « belgo-marocain, musulman et molenbeekois ».",
    lecon: "Ces trois appartenances correspondent chacune à un préjugé que le livre démonte : c’est le point de départ de l’argument sur la diversité (A5)." },
];

// ---------- Fiche d'identité et contexte ----------
export const FICHE = [
  ["Titre", "Un jihad de l’amour (titre original : Een jihad van liefde ; en anglais : A Jihad for Love)"],
  ["Auteur", "Mohamed El Bachiri, né en 1980, Bruxellois d’origine marocaine, ancien conducteur de métro, père de trois garçons"],
  ["Mise en forme", "David Van Reybrouck, écrivain flamand, a recueilli ses propos et organisé les textes"],
  ["Parution", "2017 : d’abord en néerlandais (De Bezige Bij), puis en français (JC Lattès) et en anglais"],
  ["Genre", "Un essai-témoignage : des fragments courts qui mêlent récit, poésie et argumentation"],
  ["Contexte", "Le 22 mars 2016, des attentats frappent l’aéroport de Bruxelles et la station de métro Maelbeek. Loubna Lafquiri, l’épouse de l’auteur, meurt dans le métro."],
  ["Origine du livre", "Fin 2016, à la télévision flamande, Mohamed El Bachiri appelle à un « jihad de l’amour ». Sa prise de parole est massivement partagée ; le livre la prolonge."],
  ["Destinataires", "Tous les lecteurs, et en particulier les jeunes musulmans d’Europe, qu’il invite à une lecture humaniste de l’islam"],
];

// ---------- Résumés modèles ----------
export const RESUMES_LIVRE = [
  {
    id: "court", titre: "Résumé modèle en 150 mots environ",
    paras: [
      "Dans son essai-témoignage Un jihad de l’amour (2017), Mohamed El Bachiri, dont l’épouse a été tuée lors de l’attentat du métro de Bruxelles en 2016, s’interroge sur la réponse à apporter à la haine terroriste. Il soutient qu’il faut lui opposer l’amour.",
      "D’abord, il affirme que la vengeance ne fait que reproduire le mal : répondre à la violence par la violence, c’est commettre la même faute que les assassins.",
      "Ensuite, il rappelle que le jihad désigne avant tout un effort sur soi contre ses passions, et non une guerre.",
      "Par ailleurs, il défend une foi éclairée par la raison, qui replace les textes religieux dans leur contexte et refuse tout fondamentalisme.",
      "De plus, il souligne que tous les êtres humains sont frères, au-delà de leurs croyances.",
      "Enfin, il estime que l’éducation et l’ouverture à la diversité, et non le repli, permettent de vivre ensemble.",
    ],
  },
  {
    id: "long", titre: "Résumé modèle en 250 mots environ",
    paras: [
      "Dans Un jihad de l’amour (2017), essai-témoignage mis en forme par David Van Reybrouck, Mohamed El Bachiri, Bruxellois musulman dont l’épouse Loubna a été tuée lors de l’attentat du métro Maelbeek en 2016, s’interroge sur la manière de répondre à la haine terroriste. Il défend l’idée qu’il faut mener un « jihad de l’amour », c’est-à-dire un effort sur soi pour refuser la haine.",
      "Tout d’abord, l’auteur affirme que la vengeance ne fait que prolonger le mal. Répondre à la violence par la violence reviendrait à commettre la même faute que les assassins, et la haine d’un camp nourrit toujours celle de l’autre. C’est pourquoi il rejette aussi la peine de mort.",
      "Ensuite, il rappelle que le mot « jihad » désigne d’abord un combat intérieur contre ses passions et sa colère. Les terroristes ont détourné ce sens : le véritable courage consiste à garder son calme et à aller vers l’autre.",
      "Par ailleurs, il plaide pour une foi éclairée par la raison. Selon lui, les règles et les passages guerriers des textes religieux doivent être replacés dans leur contexte historique et ne peuvent jamais justifier un meurtre. Il refuse tous les fondamentalismes.",
      "De plus, il soutient que l’humanité commune passe avant les différences : chaque vie est sacrée et tous les êtres humains sont frères.",
      "Enfin, il estime que la diversité est une richesse et que l’éducation, la curiosité et l’art, plutôt que le repli ou les préjugés, permettent de vivre ensemble.",
    ],
  },
];

// ---------- Ce qu'il ne faut PAS mettre dans le résumé du livre ----------
export const PIEGES_LIVRE = [
  "Raconter le jour de l’attentat en détail (l’heure, la couverture, l’escalier) : c’est du récit, pas un argument.",
  "Décrire Loubna (son sourire, son métier, leur rencontre) : c’est un hommage, pas un argument.",
  "Recopier les poèmes ou les phrases du livre : il faut reformuler.",
  "Donner ton avis (« Je trouve que Mohamed a raison ») : un résumé est neutre.",
  "Écrire « Mohamed dit que… » à chaque phrase : utilise son nom de famille (El Bachiri) et des verbes précis (affirme, soutient, dénonce…).",
  "Mettre tous les exemples (Mère Teresa, Luther, Averroès, Damas…) : garde les idées ; un exemple seulement s’il est indispensable pour comprendre.",
];
