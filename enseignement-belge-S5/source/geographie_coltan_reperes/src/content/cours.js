// Cours découpé en pages courtes (segmentation), texte + visuel côte à côte (contiguïté),
// termes du glossaire signalés [[...]], une question de récupération à la fin de chaque leçon.
// Visuel : { map: scene, props } ou { diagram: id }.

export const COURS = [
  {
    id: "A", titre: "Le coltan en République démocratique du Congo",
    sous: "Chapitre 1 · Les ressources, moteurs du développement et défis globaux · Thème 3",
    lecons: [
      {
        id: "a1", titre: "Le coltan, un minerai stratégique", resume: "Ce qu’est le coltan, où on le trouve et à quoi il sert.",
        pages: [
          {
            titre: "Qu’est-ce que le coltan ?",
            blocs: [
              "Le [[coltan]] est un [[minerai]] de couleur noire ou brun-rouge. Il est formé de deux minéraux : la colombite et la tantalite.",
              "On en extrait deux métaux : le [[niobium]] et le [[tantale]]. Le tantale résiste très bien à la [[corrosion]], c’est-à-dire à la dégradation d’un matériau par le milieu qui l’entoure.",
              "On utilise le tantale pour fabriquer des [[condensateur|condensateurs]] : de petits composants qui accumulent de l’énergie électrique. Il y en a dans nos téléphones portables, nos ordinateurs et nos consoles.",
            ],
            visuel: { diagram: "chaine_coltan" },
            retenir: ["Coltan = colombite + tantalite → niobium et tantale.", "Le tantale sert aux condensateurs de l’électronique (téléphones, ordinateurs)."],
          },
          {
            titre: "Où trouve-t-on le coltan ?",
            blocs: [
              "Le coltan se trouve en quantités commerciales en Afrique centrale, surtout en République démocratique du Congo (RDC), dans la région du **Kivu**.",
              "Le Kivu détient entre **60 et 80 %** des [[réserves]] mondiales de coltan. Il existe aussi des réserves en Australie, au Brésil, au Canada, en Espagne, au Venezuela et en Chine.",
              "Le coltan est donc un [[minerai stratégique]] : il est indispensable à l’industrie électronique et il est concentré dans une petite région du monde.",
            ],
            visuel: { map: "rdc_ressources", props: { only: ["zones", "mines", "villes"] } },
            retenir: ["Le Kivu (est de la RDC) possède 60 à 80 % des réserves mondiales de coltan.", "Une ressource rare, concentrée et indispensable est un enjeu stratégique."],
          },
        ],
        check: { q: "Pourquoi dit-on que le coltan est un minerai stratégique ?", o: ["Parce qu’il est très facile à extraire.", "Parce qu’il est indispensable à l’électronique et concentré dans peu de régions.", "Parce qu’on le trouve dans tous les pays d’Afrique.", "Parce qu’il sert à fabriquer du carburant."], a: 1, e: "Le tantale du coltan est indispensable aux condensateurs, et l’essentiel des réserves se trouve au Kivu : sa possession est donc un enjeu." },
      },
      {
        id: "a2", titre: "Situer et localiser la RDC, le Kivu et Goma", resume: "Méthode « situer / localiser » appliquée à la RDC et à Goma.",
        pages: [
          {
            titre: "Situer : où par rapport aux grands repères ?",
            blocs: [
              "[[Situer]] un lieu, c’est dire où il se trouve par rapport à de grands repères, à petite [[échelle]] : le continent, l’[[hémisphère]], l’[[équateur]], les océans, les pays voisins.",
              "La RDC se situe en **Afrique centrale**. Elle est traversée par l’équateur : le nord du pays est dans l’hémisphère Nord, le sud dans l’hémisphère Sud.",
              "C’est le deuxième plus grand pays d’Afrique. Elle a neuf voisins et un accès très étroit à l’océan Atlantique, à l’ouest.",
            ],
            visuel: { map: "afrique", props: { mode: "show" } },
            retenir: ["Situer = répondre à « Où ? » avec de grands repères (petite échelle).", "La RDC : Afrique centrale, traversée par l’équateur, ouverture étroite sur l’Atlantique."],
          },
          {
            titre: "Les voisins et les grands repères de la RDC",
            blocs: [
              "Les neuf voisins de la RDC sont : le Congo (Brazzaville), la Centrafrique, le Soudan du Sud, l’Ouganda, le Rwanda, le Burundi, la Tanzanie, la Zambie et l’Angola.",
              "La capitale, **Kinshasa**, est à l’ouest, sur le fleuve Congo, juste en face de Brazzaville. Les grandes villes secondaires sont Lubumbashi (sud-est), Mbuji-Mayi (centre-sud), Kisangani (nord-est) et Goma (est).",
              "À l’est, une longue chaîne de lacs marque la frontière : lac Albert, lac Édouard, lac Kivu et lac Tanganyika.",
            ],
            visuel: { map: "rdc_situation", props: { names: ["villes", "lacs"] } },
            retenir: ["Capitale : Kinshasa. Villes secondaires : Lubumbashi, Mbuji-Mayi, Kisangani, Goma.", "À l’est : lacs Albert, Édouard, Kivu, Tanganyika ; voisins Ouganda, Rwanda, Burundi."],
          },
          {
            titre: "Localiser : la position précise de Goma",
            blocs: [
              "[[Localiser]] un lieu, c’est donner sa position précise, à grande échelle : ses [[coordonnées géographiques]], sa province, les lieux tout proches.",
              "**Goma** est le chef-lieu de la province du **Nord-Kivu**, dans l’est de la RDC. Ses coordonnées sont environ 1° 41′ de [[latitude]] Sud et 29° 13′ de [[longitude]] Est.",
              "Goma est construite sur la rive nord du **lac Kivu**, à la frontière du **Rwanda** (en face de la ville rwandaise de Gisenyi), au pied du [[volcan]] actif **Nyiragongo**, à environ 1500 m d’[[altitude]].",
            ],
            visuel: { diagram: "situer_localiser" },
            retenir: ["Localiser = position précise (coordonnées, province, lieux proches).", "Goma : Nord-Kivu, rive nord du lac Kivu, frontière rwandaise, pied du Nyiragongo, 1500 m."],
          },
        ],
        check: { q: "Laquelle de ces phrases LOCALISE Goma (et ne se contente pas de la situer) ?", o: ["Goma est en Afrique.", "Goma est dans l’hémisphère Sud.", "Goma est sur la rive nord du lac Kivu, à la frontière rwandaise.", "Goma est sur le continent africain, près de l’équateur."], a: 2, e: "Localiser, c’est donner une position précise à grande échelle (lac Kivu, frontière, coordonnées). Les autres phrases situent Goma à petite échelle." },
      },
      {
        id: "a3", titre: "Un pays très riche en ressources… mais pauvre", resume: "Les ressources de la RDC et le paradoxe de la « malédiction des ressources ».",
        pages: [
          {
            titre: "Un « scandale géologique »",
            blocs: [
              "Le [[sous-sol]] de la RDC est l’un des plus riches du monde. On parle même de « [[scandale géologique]] ».",
              "On y trouve des ressources minières (diamants, or, coltan, cuivre et [[cobalt]], étain, manganèse, plomb et zinc) et des ressources énergétiques (charbon, uranium, pétrole).",
              "Deux grandes zones se distinguent : la **région [[stannifère]]** à l’est (étain et coltan, du Kivu au nord du Katanga) et la **ceinture [[cuprifère]]** au sud-est (cuivre et cobalt, de Kolwezi à Lubumbashi).",
            ],
            visuel: { map: "rdc_ressources", props: {} },
            retenir: ["Région stannifère (est) : étain et coltan.", "Ceinture cuprifère (Katanga) : cuivre et cobalt.", "Ailleurs : diamants (Kasaï), or (Ituri, Sud-Kivu), pétrole (côte)."],
          },
          {
            titre: "La malédiction des ressources",
            blocs: [
              "Ces dernières années, de nouveaux acteurs (groupes chinois, intermédiaires émiratis…) ont investi plusieurs milliards de dollars dans les mines congolaises.",
              "Pourtant, cette richesse ne profite pas à la population : **plus de 70 % des Congolais vivent avec moins de 2 dollars par jour**.",
              "On parle de [[malédiction des ressources]] : un pays très riche en ressources reste pauvre et instable, car ces richesses attirent la corruption, le pillage et les conflits pour les contrôler.",
            ],
            visuel: { diagram: "malediction" },
            retenir: ["Paradoxe : sous-sol très riche, population très pauvre.", "Les richesses attirent convoitises, corruption et conflits : c’est la malédiction des ressources."],
          },
        ],
        check: { q: "Qu’appelle-t-on la « malédiction des ressources » ?", o: ["Le fait qu’un pays n’ait aucune ressource.", "Le paradoxe d’un pays riche en ressources dont la population reste pauvre et qui connaît des conflits.", "La disparition rapide des ressources renouvelables.", "Une catastrophe naturelle dans une mine."], a: 1 , e: "Le paradoxe : abondance de richesses naturelles, mais pauvreté, corruption et conflits pour leur contrôle." },
      },
      {
        id: "a4", titre: "Les minerais au cœur des conflits", resume: "Comment le coltan finance la guerre à l’est de la RDC.",
        pages: [
          {
            titre: "Une guerre parmi les plus meurtrières",
            blocs: [
              "Le coltan est au cœur de la guerre en RDC, l’un des conflits les plus meurtriers depuis la Seconde Guerre mondiale, avec **plus de 6 millions de morts**.",
              "En 2015, un rapport d’experts présenté au [[ONU|Conseil de sécurité de l’ONU]] dénonce les grandes quantités de minerai extraites illégalement, transportées en [[contrebande]] avec l’accord de [[milices]] armées, au profit de sociétés régionales et internationales.",
              "L’armée rwandaise aurait ainsi retiré 250 millions de dollars de ce trafic entre 1998 et 2000. L’Ouganda, le Rwanda et le Burundi ont été mis en cause par l’ONU, mais ils ont nié leur implication.",
            ],
            visuel: { map: "rdc_conflits", props: { only: ["provinces", "violences", "villes"] } },
            retenir: ["Plus de 6 millions de morts : un des conflits les plus meurtriers depuis 1945.", "Extraction illégale + contrebande + milices + pays voisins + entreprises."],
          },
          {
            titre: "Des « minerais de sang » et un racket organisé",
            blocs: [
              "On appelle « [[minerais de sang]] » les minerais dont la vente finance des groupes armés. Les [[3T|minerais des conflits]] sont l’étain, le tantale (coltan), le tungstène et l’or.",
              "De nombreuses milices organisent un véritable [[racket]] : elles contrôlent des mines, imposent des taxes aux [[creuseurs]] et aux transporteurs, et font passer les minerais en contrebande.",
              "Exemple : depuis avril 2024, les rebelles du **M23** contrôlent la zone minière de **Rubaya** (Nord-Kivu). Elle leur rapporterait environ 300 000 dollars par mois, ce qui finance leurs [[exactions]].",
            ],
            visuel: { diagram: "racket" },
            retenir: ["Minerais de sang : leur commerce finance la guerre.", "Rubaya : mine de coltan contrôlée par le M23 depuis avril 2024 (≈ 300 000 $ par mois)."],
          },
          {
            titre: "Où se concentrent les violences ?",
            blocs: [
              "La carte des décès liés aux violences en 2023 montre une forte concentration **à l’est du pays** : dans l’Ituri, le Nord-Kivu (autour de Beni et de Goma) et le Sud-Kivu.",
              "Ce sont aussi les régions des mines d’or, d’étain et de coltan, à la frontière de l’Ouganda, du Rwanda et du Burundi. La présence des minerais, la faiblesse de l’État et les frontières proches favorisent les trafics.",
              "D’autres foyers de violence existent, par exemple à l’ouest près de Kinshasa, mais ils sont moins nombreux.",
            ],
            visuel: { map: "rdc_conflits", props: { names: ["villes"] } },
            retenir: ["Les violences se concentrent à l’est (Ituri, Nord-Kivu, Sud-Kivu), là où se trouvent les mines et les frontières."],
          },
        ],
        check: { q: "Quels sont les « 3T » ?", o: ["Tantale, titane, tungstène", "Étain (tin), tantale, tungstène", "Tantale, tourmaline, thorium", "Étain, titane, tantale"], a: 1, e: "Les 3T = tin (étain), tantale, tungstène. Avec l’or, ce sont les minerais des conflits." },
      },
      {
        id: "a5", titre: "Les groupes armés de l’est de la RDC", resume: "CODECO, ADF, FDLR, M23 et Maï-Maï Kata Katanga.",
        pages: [
          {
            titre: "Cinq groupes armés à connaître",
            blocs: [
              "**CODECO** (Coopérative pour le développement du Congo) : née en 1970 comme coopérative agricole, devenue un mouvement armé en Ituri. Elle prétend défendre les Lendu contre les Hema ; ses attaques ont fait des milliers de morts.",
              "**ADF** (Forces démocratiques alliées) : fondées en Ouganda à la fin des années 1990, actives en RDC (Beni, Ituri). Elles veulent établir un État islamique dans la région ; elles ont tué des milliers de civils.",
              "**FDLR** (Forces démocratiques de libération du Rwanda) : présentes depuis 2000, surtout composées de Hutu rwandais, dont d’anciens militaires du régime rwandais renversé en 1994. Elles veulent renverser le gouvernement du Rwanda.",
              "**M23** (Mouvement du 23 mars) : fondé par d’anciens soldats de l’armée congolaise après la rupture de l’accord de paix du 23 mars 2009. Composé surtout de Tutsi, il est soutenu par le Rwanda selon les experts de l’ONU.",
              "**Maï-Maï Kata Katanga** : groupe qui lutte pour l’indépendance du Katanga, la province la plus riche du pays ; il tire l’essentiel de ses revenus de mines d’or.",
            ],
            visuel: { map: "rdc_conflits", props: { names: ["groupes"] } },
            retenir: ["Ituri : CODECO, ADF · Nord-Kivu : ADF, M23, FDLR · Katanga : Maï-Maï Kata Katanga.", "Tous se financent en partie grâce aux minerais (racket, contrebande)."],
          },
          {
            titre: "Actualité : Goma depuis 2025",
            blocs: [
              "Fin janvier 2025, après une offensive éclair, l’alliance **AFC/M23**, soutenue par le Rwanda selon l’ONU et les États-Unis, a pris le contrôle de **Goma**, puis de **Bukavu** en février.",
              "Le 27 juin 2025, la RDC et le Rwanda ont signé à Washington un accord de paix (cessez-le-feu, retrait des troupes étrangères, coopération économique), puis d’autres textes ont suivi, notamment des négociations avec le M23 à Doha.",
              "Mais à la mi-2026, les combats continuent sur le terrain : la paix existe sur le papier, beaucoup moins dans la réalité. Les minerais restent un enjeu central de ces négociations.",
            ],
            visuel: { map: "rdc_conflits", props: { only: ["provinces", "groupes", "villes"], names: ["villes"] } },
            retenir: ["Janvier 2025 : Goma prise par l’AFC/M23 ; accord de Washington le 27 juin 2025.", "Mi-2026 : accords signés, mais violences persistantes."],
            note: "Situation vérifiée en novembre 2026 (ONU Info, RFI, La Libre, AllAfrica). Elle peut évoluer : vérifie l’actualité.",
          },
        ],
        check: { q: "Quel groupe armé contrôle la mine de coltan de Rubaya depuis 2024 ?", o: ["La CODECO", "Les ADF", "Le M23", "Les Maï-Maï Kata Katanga"], a: 2, e: "Le M23 (alliance AFC/M23) contrôle Rubaya, au Nord-Kivu, depuis avril 2024." },
      },
      {
        id: "a6", titre: "Le milieu physique de la RDC", resume: "Relief, végétation, climat, paludisme et densités.",
        pages: [
          {
            titre: "Le relief : une cuvette entourée de hauteurs",
            blocs: [
              "Au centre, la **[[cuvette centrale]]** : une vaste plaine basse (300 à 500 m), souvent marécageuse, traversée par le fleuve Congo et couverte de forêt dense.",
              "Autour, des **[[plateaux]] et collines** légèrement plus hauts (500 à 1000 m), notamment au Kasaï et au Katanga.",
              "À l’est, des **montagnes** : le [[rift|Rift Albertin]], les monts Rwenzori, les Virunga (volcans) ; au sud-est, les **hauts plateaux du Haut-Katanga** (plus de 1500 m). Deux volcans actifs menacent la population : le **Nyiragongo** et le **Nyamuragira**.",
            ],
            visuel: { map: "rdc_milieu", props: { theme: "relief", names: ["volcans"] } },
            retenir: ["Cuvette centrale (300-500 m) → plateaux (500-1000 m) → montagnes de l’est et hauts plateaux du Katanga.", "Volcans actifs près de Goma : Nyiragongo et Nyamuragira."],
          },
          {
            titre: "Le climat et la végétation",
            blocs: [
              "Au centre, autour de l’équateur, le [[climat équatorial]] : chaud, avec 11 à 12 mois de pluie par an. La végétation est la **[[forêt équatoriale]]**.",
              "Vers le sud (et l’extrême nord), le [[climat tropical]] : une [[saison sèche]] apparaît (5 à 9 mois de pluie seulement). La forêt laisse la place à la **savane boisée**, puis à la **savane herbeuse** au Katanga.",
              "À l’est, en altitude, le [[climat des montagnes]] est plus frais : on y trouve une **végétation de montagne**.",
            ],
            visuel: { map: "rdc_milieu", props: { theme: "climat" } },
            retenir: ["Climat équatorial → forêt équatoriale ; climat tropical → savanes ; climat des montagnes → végétation de montagne.", "Le climat explique la végétation."],
          },
          {
            titre: "Paludisme et densités de population",
            blocs: [
              "Le [[paludisme]] est transmis par un moustique qui aime la chaleur et l’humidité. Dans la cuvette centrale, il se transmet **toute l’année** ; en altitude, à l’est, beaucoup moins (il fait plus frais).",
              "La population n’est pas répartie de façon égale. Les **fortes densités** se trouvent autour de Kinshasa et surtout à l’**est**, dans la région des Grands Lacs.",
              "Pourquoi l’est attire-t-il les habitants ? Des [[atouts]] : sols volcaniques fertiles, climat d’altitude plus frais et plus sain (moins de paludisme), lacs (eau, pêche, transport), minerais. Mais aussi des [[contraintes]] : volcans, relief accidenté et conflits.",
            ],
            visuel: { map: "rdc_milieu", props: { theme: "sante" } },
            retenir: ["Paludisme toute l’année dans la cuvette chaude et humide ; peu en altitude.", "L’est est densément peuplé (atouts : sols volcaniques, climat frais) malgré les contraintes."],
          },
        ],
        check: { q: "Pourquoi le paludisme se transmet-il moins autour de Goma que dans la cuvette centrale ?", o: ["Parce que Goma est au bord de la mer.", "Parce qu’à 1500 m d’altitude il fait plus frais, ce qui gêne le moustique.", "Parce qu’il n’y a pas de lac à Goma.", "Parce que Goma est dans le désert."], a: 1, e: "La température baisse avec l’altitude : le moustique vecteur s’y développe moins bien." },
      },
      {
        id: "a7", titre: "Goma : un tableau de données géographiques", resume: "Activité 3 du dossier : lire plusieurs cartes pour caractériser un lieu.",
        pages: [
          {
            titre: "Lire plusieurs cartes pour décrire un lieu",
            blocs: [
              "Pour caractériser un lieu, on croise plusieurs [[cartes thématiques]] : ressources, relief, végétation, climat, santé, densité, température.",
              "Méthode : 1. repère le lieu sur chaque carte ; 2. lis la légende ; 3. note l’information qui correspond à l’emplacement ; 4. reste prudent si le lieu est à la limite de deux zones (écris « environ »).",
            ],
            table: {
              head: ["Question (carte du dossier)", "Réponse pour Goma"],
              rows: [
                ["Région stannifère ou cuprifère ? (carte 1)", "Région **stannifère** (riche en étain et en coltan)."],
                ["Proximité avec un lac ? Lequel ? (carte 4)", "Oui : sur la rive nord du **lac Kivu**."],
                ["Altitude ?", "Environ **1500 m**."],
                ["Type de végétation ? (carte 6)", "**Végétation de montagne**."],
                ["Type de climat ? (carte 7)", "**Climat des montagnes** (à la limite du climat équatorial)."],
                ["Nombre de mois de pluie par an ? (carte 7)", "Environ **10 mois** (lecture approximative)."],
                ["Mois de transmission du paludisme ? (carte 8)", "**Peu** : de 0 à environ 2 mois (l’altitude limite le moustique)."],
                ["Densité de population ? (carte 9)", "**Forte** : plus de 70 hab./km²."],
                ["Température moyenne annuelle ? (carte 10)", "Environ **20 °C** (plus frais que la cuvette, grâce à l’altitude)."],
              ],
            },
            visuel: { map: "rdc_milieu", props: { theme: "vegetation" } },
            retenir: ["Goma : stannifère, lac Kivu, 1500 m, végétation et climat de montagne, ≈ 10 mois de pluie, peu de paludisme, forte densité, ≈ 20 °C."],
            note: "Les valeurs de pluie, de paludisme et de température sont des lectures de carte : ton professeur peut accepter une fourchette.",
          },
        ],
        check: { q: "D’après le tableau, quelle caractéristique explique à la fois la température plus douce et le faible paludisme à Goma ?", o: ["La proximité du Rwanda", "L’altitude (environ 1500 m)", "La région stannifère", "Le lac Tanganyika"], a: 1, e: "L’altitude fait baisser la température, ce qui gêne aussi le moustique du paludisme." },
      },
      {
        id: "a8", titre: "Enjeux et problématiques : la synthèse", resume: "Activité 1 : un schéma des acteurs, des causes et des conséquences.",
        pages: [
          {
            titre: "Le schéma des enjeux du coltan",
            blocs: [
              "Une [[ressource]] devient un [[enjeu]] quand plusieurs [[acteurs]] veulent la contrôler. Autour du coltan, on trouve : l’État congolais (faible à l’est), les groupes armés, les pays voisins, les négociants et les [[multinationales]], les creuseurs et les consommateurs du monde entier.",
              "Conséquences : violences et millions de morts, [[déplacés internes]] et réfugiés, travail des enfants dans les mines artisanales, pauvreté, contrebande et menace sur l’écosystème forestier.",
              "Réponses : la [[traçabilité]] des minerais. Aux États-Unis, une loi de 2010 (Dodd-Frank) oblige les entreprises à vérifier l’origine du tantale, de l’étain, du tungstène et de l’or ; dans l’UE, un règlement du même type s’applique depuis 2021.",
            ],
            visuel: { diagram: "enjeux" },
            retenir: ["Ressource convoitée + État faible + frontières proches = conflits.", "Réponse principale : la traçabilité de la chaîne d’approvisionnement."],
          },
          {
            titre: "Le coltan, la mondialisation et nous",
            blocs: [
              "La [[chaîne d’approvisionnement]] du coltan relie l’est de la RDC au reste du monde : mine → négociants (souvent via le Rwanda) → fonderies, surtout en Asie → fabricants de composants → marques d’électronique → consommateurs.",
              "Les iPhone d’Apple, les Kindle d’Amazon ou les ordinateurs HP sont-ils encore fabriqués en nourrissant des conflits ? Le doute reste permis. General Electric, Microsoft, HP ou Intel ont publié l’origine de leurs minerais sensibles.",
              "En 2024, la RDC a accusé Apple d’utiliser des « minerais de sang ». Ce [[flux]] est un bon exemple de [[mondialisation]] : un geste quotidien en Europe est lié à une mine du Kivu.",
            ],
            visuel: { diagram: "chaine_coltan" },
            retenir: ["Le coltan illustre la mondialisation : flux de la mine du Kivu au consommateur européen.", "Les entreprises sont poussées à prouver l’origine de leurs minerais."],
          },
        ],
        check: { q: "Quelle est la réponse principale pour éviter d’acheter des minerais qui financent la guerre ?", o: ["Interdire les téléphones portables", "La traçabilité de la chaîne d’approvisionnement", "Fermer toutes les mines d’Afrique", "Augmenter le prix du coltan"], a: 1, e: "La traçabilité permet de vérifier l’origine du minerai à chaque étape (lois Dodd-Frank aux États-Unis, règlement européen depuis 2021)." },
      },
      {
        id: "a9", titre: "Le croquis de synthèse", resume: "Activité 4 : réaliser un croquis schématique avec ses 5 éléments.",
        pages: [
          {
            titre: "Les cinq informations d’une carte",
            blocs: [
              "Toute représentation cartographique contient cinq informations : le **titre**, la **légende**, l’**orientation** (rose des vents), l’**échelle** et la **source**.",
              "Le [[titre]] contient trois informations : le **sujet**, la **date** et le **lieu**. Exemple : « Les minerais, sources de conflits en RDC en 2023 ».",
              "Pour un [[croquis]] schématique, l’échelle n’est pas nécessaire. La source à indiquer : « Cours de géographie EBC – S5 – 2026-27 ».",
            ],
            visuel: { diagram: "elements_carte" },
            retenir: ["Titre (sujet + date + lieu), légende conforme, orientation, échelle (sauf croquis schématique), source."],
          },
          {
            titre: "Choisir le bon figuré",
            blocs: [
              "Chaque élément du croquis est représenté par un figuré dont l’[[implantation]] dépend de sa forme dans la réalité : un **point** pour un lieu (une ville), une **ligne** pour une limite ou un trajet (l’équateur, une frontière), une **surface** pour un espace (la ceinture cuprifère).",
              "Éléments demandés : les frontières de la RDC, l’équateur, la capitale Kinshasa, quatre villes secondaires (Lubumbashi, Mbuji-Mayi, Kisangani, Goma), la région stannifère et la ceinture cuprifère, les zones de violences en 2023 et la zone où le paludisme se transmet toute l’année.",
              "Une [[légende]] conforme reprend exactement les mêmes figurés que le croquis et les classe par thème.",
            ],
            visuel: { builder: "croquis" },
            retenir: ["Point = lieu ; ligne = limite ou trajet ; surface = espace.", "La légende reprend exactement les figurés du croquis."],
          },
        ],
        check: { q: "Quel figuré utilises-tu pour la ceinture cuprifère sur ton croquis ?", o: ["Un point", "Une ligne", "Une surface (zonal)", "Une flèche"], a: 2, e: "La ceinture cuprifère est un espace : on la représente par une surface colorée ou hachurée." },
      },
    ],
  },
  {
    id: "B", titre: "Les repères spatiaux à connaître en S5",
    sous: "Fiches Cartes 1 à 14 · Monde, Europe, Belgique, Paris",
    lecons: [
      {
        id: "b1", titre: "Les grands repères du monde", resume: "Continents, océans, lignes remarquables (Carte 1).",
        pages: [
          {
            titre: "Les six continents",
            blocs: [
              "Dans le modèle à six [[continents]], on distingue : l’**Amérique**, l’**Europe**, l’**Afrique**, l’**Asie**, l’**Océanie** et l’**Antarctique**.",
              "L’Europe et l’Asie forment un seul bloc de terres (l’Eurasie). La limite conventionnelle passe par les monts Oural.",
              "Astuce : mémorise-les en partant de la Belgique vers l’ouest (Amérique), le sud (Afrique), l’est (Asie), puis l’Océanie et l’Antarctique.",
            ],
            visuel: { map: "monde_continents", props: { names: ["continents"], only: ["oceans", "continents"] } },
            retenir: ["6 continents : Amérique, Europe, Afrique, Asie, Océanie, Antarctique."],
          },
          {
            titre: "Les océans",
            blocs: [
              "La carte du dossier nomme cinq océans : l’océan **Pacifique** (le plus grand), l’océan **Atlantique**, l’océan **Indien**, l’océan **Arctique** (autour du pôle Nord) et l’océan **Antarctique** ou Austral (autour de l’Antarctique).",
              "Le titre de la fiche annonce « 6 océans » : certains manuels coupent un océan en deux (par exemple Atlantique Nord et Atlantique Sud). Vérifie avec ton professeur la liste qu’il attend.",
              "La Belgique borde la mer du Nord, une mer de l’océan Atlantique.",
            ],
            visuel: { map: "monde_continents", props: { names: ["oceans"], only: ["oceans", "continents"] } },
            retenir: ["Pacifique, Atlantique, Indien, Arctique, Antarctique (Austral)."],
          },
          {
            titre: "Les lignes remarquables",
            blocs: [
              "L’**[[équateur]]** (0°) partage la Terre en **hémisphère Nord** et **hémisphère Sud**.",
              "Les **[[tropiques]]** sont à environ 23° : le tropique du **Cancer** au nord, le tropique du **Capricorne** au sud. Les **[[cercles polaires]]** sont à environ 66° : arctique au nord, antarctique au sud. Les **pôles** sont à 90°.",
              "Le **[[méridien de Greenwich]]** (0° de longitude) sert de référence pour mesurer la longitude, vers l’est ou vers l’ouest.",
            ],
            visuel: { map: "monde_continents", props: { names: ["lignes", "poles"] } },
            retenir: ["Équateur 0° · Tropiques 23° N et S · Cercles polaires 66° N et S · Pôles 90° · Greenwich 0°."],
          },
        ],
        check: { q: "À quelle latitude se trouve le tropique du Capricorne ?", o: ["23° Nord", "23° Sud", "66° Sud", "0°"], a: 1, e: "Capricorne = tropique de l’hémisphère Sud, à environ 23° S (pense à « Capri-Sud »)." },
      },
      {
        id: "b2", titre: "La répartition de la population mondiale", resume: "7 foyers de population et 12 espaces peu peuplés (Carte 2).",
        pages: [
          {
            titre: "Les espaces peuplés",
            blocs: [
              "La population mondiale est très inégalement répartie. Du plus densément peuplé au moins densément peuplé, les grands [[foyers de population]] sont :",
              "1. l’Asie de l’Est (Chine) ; 2. l’Asie du Sud (Inde, Pakistan) ; 3. l’Indonésie ; 4. l’Europe occidentale et centrale ; 5. l’Afrique de l’Est (région des Grands Lacs) ; 6. l’Afrique de l’Ouest (golfe de Guinée) ; 7. le Nord-Est des États-Unis.",
              "Ces espaces ont des [[atouts]] : plaines et deltas fertiles, climat favorable, eau abondante, peuplement ancien, villes et activités.",
            ],
            visuel: { map: "monde_population", props: { names: false } },
            retenir: ["Ordre à connaître : Asie de l’Est, Asie du Sud, Indonésie, Europe, Grands Lacs, golfe de Guinée, Nord-Est des États-Unis."],
          },
          {
            titre: "Les espaces vides ou peu peuplés",
            blocs: [
              "Les [[espaces vides]] correspondent à de fortes [[contraintes]] naturelles : le froid, l’aridité, l’altitude ou la forêt dense.",
              "Froid : le Grand Nord (au nord du 60e parallèle) et l’Antarctique. Aridité : le Sahara, le désert de Gobi, le désert australien, la péninsule arabique. Altitude : l’Himalaya, les Rocheuses et l’Ouest américain, les Andes et la Patagonie.",
              "Forêt dense : l’Amazonie, la forêt équatoriale du bassin du Congo, Bornéo et les forêts d’Asie du Sud-Est.",
            ],
            visuel: { map: "monde_population", props: {} },
            retenir: ["12 espaces vides : Grand Nord, Antarctique, Sahara, Amazonie, Gobi, Himalaya, désert australien, Rocheuses, bassin du Congo, Andes-Patagonie, péninsule arabique, Bornéo.", "Contraintes : froid, aridité, altitude, forêt dense."],
          },
        ],
        check: { q: "Quelle contrainte explique le faible peuplement du bassin du Congo ?", o: ["Le froid", "L’aridité", "La forêt dense (équatoriale)", "L’altitude"], a: 2, e: "La forêt équatoriale dense, chaude et humide, est difficile à défricher et à habiter." },
      },
      {
        id: "b3", titre: "Les zones climatiques du monde", resume: "Climats froids, tempérés, chauds et montagnard (Carte 7).",
        pages: [
          {
            titre: "Trois grandes zones",
            blocs: [
              "La température dépend d’abord de la [[latitude]] : plus on s’éloigne de l’équateur, plus il fait froid. On distingue donc des [[zones climatiques]] en bandes.",
              "La **zone chaude** (intertropicale) entoure l’équateur, à peu près entre les tropiques. Les **zones tempérées** sont aux latitudes moyennes. Les **zones froides** sont au-delà des cercles polaires.",
              "La température dépend aussi de l’[[altitude]] (elle baisse en montagne) et de la [[continentalité]] (loin de la mer, les hivers sont plus froids et les étés plus chauds).",
            ],
            visuel: { diagram: "zonation" },
            retenir: ["Latitude → zones chaude, tempérées, froides.", "Altitude et continentalité modifient le climat."],
          },
          {
            titre: "Les climats et leurs caractéristiques",
            blocs: [
              "**Climats chauds** : [[climat équatorial]] (chaleur et pluies toute l’année), [[climat tropical]] (une saison sèche et une saison des pluies), [[climat désertique]] (chaleur et pluies très faibles).",
              "**Climats tempérés** : [[climat océanique]] (étés frais, hivers doux, pluies fréquentes), [[climat continental]] (étés chauds, hivers froids, pluies faibles), [[climat méditerranéen]] (étés chauds et secs, hivers doux, pluies d’automne).",
              "**Climat froid** ([[climat polaire|polaire]]) : froid toute l’année. **[[Climat montagnard]]** : plus froid et plus humide que les plaines voisines.",
            ],
            visuel: { map: "monde_climats", props: {} },
            retenir: ["Chauds : équatorial, tropical, désertique · Tempérés : océanique, continental, méditerranéen · Froid : polaire · + montagnard."],
          },
        ],
        check: { q: "Quel climat a des étés chauds et secs et des hivers doux ?", o: ["Océanique", "Continental", "Méditerranéen", "Équatorial"], a: 2, e: "C’est le climat méditerranéen : étés chauds et secs, pluies surtout en automne." },
      },
      {
        id: "b4", titre: "Les biomes du monde", resume: "Les paysages naturels et leur lien avec le climat (Carte 8 et pyramide).",
        pages: [
          {
            titre: "Le climat dessine les paysages",
            blocs: [
              "Un [[biome]] est un grand ensemble naturel (végétation, animaux, sols) qui dépend surtout du climat : de la température et de l’humidité.",
              "La pyramide des biomes résume ce lien : de bas en haut, il fait de plus en plus froid ; de gauche à droite, de plus en plus sec.",
              "Tropical : [[forêt tropicale humide]] → [[savane]] → [[désert]]. Tempéré : [[forêt tempérée]] → prairie tempérée → désert. Subarctique : [[taïga]]. Arctique : [[toundra]].",
            ],
            visuel: { diagram: "pyramide" },
            retenir: ["Plus froid → taïga puis toundra.", "Plus sec → savane / prairie puis désert."],
          },
          {
            titre: "Où trouve-t-on chaque biome ?",
            blocs: [
              "**Forêt tropicale humide** : Amazonie, bassin du Congo, Indonésie. **Savane** : Afrique de l’Est, Sahel, centre du Brésil. **Désert** : Sahara, Arabie, Australie, Gobi.",
              "**[[Prairie]] (grassland)** : Grandes Plaines d’Amérique du Nord, steppes d’Asie centrale, pampa argentine. **Forêt tempérée** : Europe de l’Ouest, est des États-Unis, Chine de l’Est.",
              "**Taïga** : Sibérie, Canada, Scandinavie. **Toundra** : nord du Canada et de la Sibérie. **Glace** : Groenland et Antarctique.",
            ],
            visuel: { map: "monde_biomes", props: {} },
            retenir: ["Associe chaque biome à un climat et à deux exemples de lieux."],
          },
        ],
        check: { q: "Quel biome trouve-t-on sous un climat continental froid, en Sibérie ?", o: ["La savane", "La taïga", "La garrigue", "La forêt tropicale"], a: 1, e: "La taïga : grande forêt de conifères des régions continentales froides." },
      },
      {
        id: "b5", titre: "L’Europe et l’Union européenne", resume: "Les États membres, les candidats et les voisins (Carte 5).",
        pages: [
          {
            titre: "Les 27 États membres",
            blocs: [
              "L’[[Union européenne]] compte **27 États membres** : Allemagne, Autriche, Belgique, Bulgarie, Chypre, Croatie, Danemark, Espagne, Estonie, Finlande, France, Grèce, Hongrie, Irlande, Italie, Lettonie, Lituanie, Luxembourg, Malte, Pays-Bas, Pologne, Portugal, Roumanie, Slovaquie, Slovénie, Suède et Tchéquie.",
              "Le **Royaume-Uni** est un ancien membre : il a quitté l’UE en 2020 (le [[Brexit]]). La Norvège, la Suisse et l’Islande sont des pays européens qui ne sont pas membres.",
              "Pour mémoriser, procède par grandes régions : Europe du Nord, de l’Ouest, centrale, du Sud, puis les îles (Chypre, Malte).",
            ],
            visuel: { map: "europe_ue", props: {} },
            retenir: ["27 membres ; Royaume-Uni : ancien membre (2020) ; Norvège, Suisse, Islande : hors UE."],
          },
          {
            titre: "Les pays candidats",
            blocs: [
              "Plusieurs pays sont officiellement candidats et ont entamé le processus de négociation (pour certains, l’ouverture des chapitres de négociation est encore en attente) : la **Turquie**, le **Monténégro**, la **Serbie**, l’**Albanie**, la **Macédoine du Nord**, l’**Ukraine**, la **Moldavie** et la **Bosnie-Herzégovine**.",
              "La **Géorgie** est candidate reconnue, mais le processus est gelé. Le **Kosovo** a déposé sa candidature en 2022.",
              "La carte du dossier montre la situation au 1er juillet 2025 : ces statuts peuvent évoluer.",
            ],
            visuel: { map: "europe_ue", props: {} },
            retenir: ["Candidats en négociation : Turquie, Monténégro, Serbie, Albanie, Macédoine du Nord, Ukraine, Moldavie, Bosnie-Herzégovine."],
          },
        ],
        check: { q: "Quel pays a quitté l’Union européenne en 2020 ?", o: ["La Norvège", "La Suisse", "Le Royaume-Uni", "L’Irlande"], a: 2, e: "Le Royaume-Uni est sorti de l’UE le 31 janvier 2020 (Brexit)." },
      },
      {
        id: "b6", titre: "La population européenne et belge", resume: "Les 15 aires urbaines européennes, les 7 aires urbaines belges (Cartes 3 et 4).",
        pages: [
          {
            titre: "Les 15 aires urbaines européennes",
            blocs: [
              "Une [[aire urbaine]] regroupe une ville, ses banlieues et les communes dont beaucoup d’habitants travaillent dans la ville.",
              "Les 15 principales aires urbaines européennes (2017) sont : **Moscou, Londres, Paris, Madrid, Barcelone, Milan, Berlin, Saint-Pétersbourg, Rome, Naples, Athènes, Kiev, Lisbonne, Manchester et Birmingham**.",
              "Autour de la Belgique, quatre aires urbaines périphériques comptent aussi : **Lille, Maastricht, Aix-la-Chapelle et Luxembourg**.",
            ],
            visuel: { map: "europe_villes", props: { names: true } },
            retenir: ["15 aires urbaines : retiens-les par pays (Royaume-Uni 3, Espagne 2, Italie 3, Russie 2, France, Allemagne, Grèce, Ukraine, Portugal)."],
          },
          {
            titre: "Les 7 aires urbaines belges et le sillon Sambre-et-Meuse",
            blocs: [
              "Les 7 principales aires urbaines belges sont : **Bruxelles, Anvers, Gand, Charleroi, Liège, Bruges et Namur**.",
              "Le nord du pays (Flandre, axe Anvers-Bruxelles) est très densément peuplé. Le sud-est (Ardenne) l’est beaucoup moins : relief plus élevé, forêts, climat plus rude.",
              "Charleroi, Namur et Liège s’alignent le long du **[[sillon Sambre-et-Meuse]]**, une vallée qui fut le grand axe industriel wallon (charbon et sidérurgie).",
            ],
            visuel: { map: "belgique_population", props: { names: true } },
            retenir: ["Bruxelles, Anvers, Gand, Charleroi, Liège, Bruges, Namur.", "Sillon Sambre-et-Meuse : Charleroi – Namur – Liège."],
          },
        ],
        check: { q: "Laquelle de ces villes n’est PAS une des 7 aires urbaines belges du cours ?", o: ["Namur", "Bruges", "Mons", "Gand"], a: 2, e: "Les 7 : Bruxelles, Anvers, Gand, Charleroi, Liège, Bruges, Namur. Mons n’en fait pas partie." },
      },
      {
        id: "b7", titre: "La Belgique : un État fédéral", resume: "Régions, Communautés, frontière linguistique, provinces (Carte 6).",
        pages: [
          {
            titre: "Trois Régions",
            blocs: [
              "La Belgique est un [[État fédéral]] : le pouvoir est partagé entre l’autorité fédérale et des entités fédérées, les Régions et les Communautés.",
              "Les trois **[[Régions]]** s’occupent de ce qui est lié au **territoire** (économie, emploi, environnement, transports…) : la **Région flamande**, la **Région wallonne** et la **Région de Bruxelles-Capitale**.",
              "La **[[frontière linguistique]]**, fixée en 1962-1963, sépare le nord néerlandophone du sud francophone. Bruxelles est une Région [[bilingue]], enclavée en Flandre.",
            ],
            visuel: { map: "belgique_regions", props: { names: ["villes"] } },
            retenir: ["3 Régions (territoire) : flamande, wallonne, Bruxelles-Capitale.", "Frontière linguistique : 1962-1963."],
          },
          {
            titre: "Trois Communautés et dix provinces",
            blocs: [
              "Les trois **[[Communautés]]** s’occupent de ce qui est lié aux **personnes** (enseignement, culture, langue) : la **Communauté flamande**, la **Communauté française** (appelée Fédération Wallonie-Bruxelles) et la **Communauté germanophone** (à l’est de la province de Liège, autour d’Eupen et de Saint-Vith).",
              "À Bruxelles, les Communautés flamande et française sont toutes les deux compétentes.",
              "La Belgique compte aussi **dix [[provinces]]** : cinq flamandes (Flandre-Occidentale, Flandre-Orientale, Anvers, Limbourg, Brabant flamand) et cinq wallonnes (Hainaut, Brabant wallon, Namur, Liège, Luxembourg).",
            ],
            visuel: { map: "belgique_communautes", props: {} },
            retenir: ["3 Communautés (personnes) : flamande, française, germanophone.", "10 provinces : 5 flamandes + 5 wallonnes ; Bruxelles n’en fait pas partie."],
          },
        ],
        check: { q: "Quelle entité fédérée organise ton école si tu étudies en français à Namur ?", o: ["La Région wallonne", "La Communauté française (Fédération Wallonie-Bruxelles)", "La province de Namur", "La Communauté germanophone"], a: 1, e: "L’enseignement est lié aux personnes : c’est une compétence des Communautés." },
      },
      {
        id: "b8", titre: "Climats et biomes d’Europe", resume: "Cartes 9 et 10 : océanique, continental, méditerranéen… taïga, garrigue, maquis.",
        pages: [
          {
            titre: "Les climats européens",
            blocs: [
              "À l’ouest, près de l’Atlantique : le [[climat océanique]] (Irlande, Royaume-Uni, France de l’Ouest, Belgique, Pays-Bas).",
              "Vers l’est, loin de la mer : le [[climat continental]] (Pologne, Ukraine, Russie, Scandinavie intérieure). Au sud : le [[climat méditerranéen]] autour de la Méditerranée, et un climat tempéré chaud à l’intérieur (Espagne, sud-ouest de la France).",
              "Dans les montagnes (Alpes, Pyrénées, Carpates, Balkans), le [[climat montagnard]]. Tout au nord, en Laponie, un climat froid. Au sud de la Méditerranée commence le domaine aride.",
            ],
            visuel: { map: "europe_climats", props: { names: true } },
            retenir: ["Ouest océanique, est continental, sud méditerranéen, montagnes montagnard, nord froid."],
          },
          {
            titre: "Les biomes européens",
            blocs: [
              "La **[[forêt tempérée]]** de feuillus et de conifères couvre une grande partie de l’Europe. Les [[feuillus]] perdent leurs feuilles en hiver ; les [[conifères]] gardent leurs aiguilles.",
              "Au nord, la **[[taïga]]** (forêt de conifères, sol acide appelé [[podzol]]) puis la **[[toundra]]** (mousses, lichens, sol gelé en permanence : le [[permafrost]]).",
              "Autour de la Méditerranée, la forêt méditerranéenne : la **[[garrigue]]** (végétation basse sur sol calcaire sec) et le **[[maquis]]** (végétation plus dense et plus haute, arbustes épineux). À l’est, la **[[steppe]]**.",
            ],
            visuel: { map: "europe_biomes", props: { names: true } },
            retenir: ["Taïga et toundra au nord, forêt tempérée au centre, garrigue et maquis au sud, steppe au sud-est."],
          },
        ],
        check: { q: "Quelle différence entre la garrigue et le maquis ?", o: ["La garrigue est basse et clairsemée, le maquis dense et plus haut.", "La garrigue pousse en Laponie.", "Le maquis est une forêt de conifères.", "Il n’y a aucune différence."], a: 0, e: "Garrigue : végétation basse, clairsemée, sur calcaire sec. Maquis : plus fermé, plus dense et plus haut." },
      },
      {
        id: "b9", titre: "Les paysages naturels de Belgique", resume: "Carte 11 : des dunes à la Lorraine belge.",
        pages: [
          {
            titre: "Du nord au sud",
            blocs: [
              "Au bord de la mer : les **[[dunes]]** puis les **[[polders]]**, terres basses gagnées sur la mer et protégées par des digues. Ensuite la **Flandre**, plaine fertile et très peuplée. Au nord-est, la **Campine**, sablonneuse, boisée et peu fertile.",
              "Au centre : la **Région des Collines**, puis les plateaux du **Pays hennuyer et brabançon** (agriculture riche, villes industrielles comme Mons et Charleroi), **Bruxelles** dans une cuvette, la **Hesbaye** très fertile ([[limon]]) et le **Pays de Herve** ([[bocage]], herbages et vergers).",
              "Au sud du sillon Sambre-et-Meuse : le **Condroz** (crêtes et vallées), la **Famenne** (dépression), la **Fagne** (zone humide), l’**Ardenne** (moyenne montagne boisée, peu peuplée) et la **Lorraine belge** au sud.",
            ],
            visuel: { map: "belgique_naturelle", props: { names: ["regions"] } },
            retenir: ["Nord : dunes, polders, Flandre, Campine · Centre : Collines, Pays hennuyer et brabançon, Hesbaye, Herve · Sud : Condroz, Famenne, Fagne, Ardenne, Lorraine belge."],
          },
        ],
        check: { q: "Quelle région naturelle est connue pour son sol très fertile et ses grandes cultures ?", o: ["La Campine", "La Hesbaye", "L’Ardenne", "La Fagne"], a: 1, e: "La Hesbaye, au sol limoneux, est l’une des régions agricoles les plus fertiles." },
      },
      {
        id: "b10", titre: "L’orohydrographie de l’Europe et de la Belgique", resume: "Cartes 12 et 13 : montagnes, plaines, fleuves et rivières.",
        pages: [
          {
            titre: "Reliefs et fleuves d’Europe",
            blocs: [
              "Les grandes **chaînes de montagnes** : les Alpes, les Pyrénées, les Carpates, les Apennins, les Alpes dinariques, les Balkans, le Massif scandinave, le Caucase et l’Oural (limite entre l’Europe et l’Asie).",
              "Les grandes **plaines** : la grande plaine d’Europe du Nord (germano-polonaise et russe) et la plaine hongroise.",
              "Les grands **[[fleuves]]** : le Rhin, le Rhône, le Danube, la Volga (le plus long d’Europe), la Seine, la Loire, l’Elbe, l’Oder, la Vistule, le Pô, le Tage, l’Èbre, le Dniepr. Les mers : mer du Nord, Manche, mer Baltique, Méditerranée, mer Noire.",
            ],
            visuel: { map: "europe_relief", props: { names: ["reliefs"] } },
            retenir: ["Montagnes au sud (Alpes, Pyrénées, Carpates…), grandes plaines au nord et à l’est.", "Fleuves : Rhin, Rhône, Danube, Volga…"],
          },
          {
            titre: "Reliefs et cours d’eau de Belgique",
            blocs: [
              "Le relief belge monte du nord-ouest vers le sud-est : **Basse Belgique** (moins de 100 m), **Moyenne Belgique** (100 à 200 m), **Haute Belgique** (plus de 200 m) au sud du sillon Sambre-et-Meuse.",
              "Le point culminant est le **Signal de Botrange** (694 m), sur le plateau des Hautes Fagnes. Autres repères : le bas-plateau de Campine, les collines de Flandre, le plateau de Herve, le plateau des Tailles et le haut-plateau d’Ardenne.",
              "Les deux grands fleuves sont l’**Escaut** (avec la Lys, la Dendre, la Senne, la Dyle) et la **Meuse** (avec la Sambre, l’Ourthe, la Vesdre, l’Amblève, la Lesse, la Semois). L’**Yser** se jette directement dans la mer du Nord.",
            ],
            visuel: { map: "belgique_relief", props: { names: ["rivieres"] } },
            retenir: ["Basse, Moyenne, Haute Belgique ; Botrange 694 m.", "Escaut et Meuse ; la Sambre rejoint la Meuse à Namur ; l’Yser se jette dans la mer du Nord."],
          },
        ],
        check: { q: "Dans quelle ville la Sambre se jette-t-elle dans la Meuse ?", o: ["Liège", "Charleroi", "Namur", "Dinant"], a: 2, e: "La Sambre rejoint la Meuse à Namur, au cœur du sillon Sambre-et-Meuse." },
      },
      {
        id: "b11", titre: "Paris : les fonctions d’une grande ville", resume: "Carte 14 : fonctions politiques, économiques, culturelles et de transport.",
        pages: [
          {
            titre: "Quatre grandes fonctions",
            blocs: [
              "**[[Fonction urbaine|Fonctions]] politiques** : Paris est la capitale de la France. On y trouve l’Élysée (présidence), Matignon (Premier ministre), l’Assemblée nationale, le Sénat, le ministère de l’Économie (Bercy), le quartier des ministères et celui des [[ambassades]].",
              "**Fonctions économiques** : la Bourse, l’OCDE et surtout **La Défense**, le grand [[quartier d’affaires]] à l’ouest, relié au centre par l’axe des affaires.",
              "**Fonctions culturelles** : la Sorbonne, le Collège de France, l’UNESCO, les opéras Garnier et Bastille, et des monuments et musées de renommée internationale (Louvre, tour Eiffel, Notre-Dame, Arc de Triomphe, Sacré-Cœur, Centre Pompidou).",
              "**Transports et communication** : Paris est très bien reliée à la France et au monde : six grandes gares, le boulevard périphérique, les autoroutes et deux aéroports internationaux (Roissy-Charles-de-Gaulle et Orly).",
            ],
            visuel: { map: "paris", props: { names: true } },
            retenir: ["Fonctions : politique, économique, culturelle, transport. Paris est une métropole mondiale."],
          },
        ],
        check: { q: "La Défense illustre quelle fonction de Paris ?", o: ["Politique", "Économique", "Culturelle", "Résidentielle"], a: 1, e: "La Défense est le principal quartier d’affaires (sièges d’entreprises, banques) : fonction économique." },
      },
    ],
  },
];

export const ALL_LESSONS = COURS.flatMap(p => p.lecons.map(l => ({ ...l, part: p.id })));
