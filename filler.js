// Contenu de remplissage affiche dans le bandeau quand il n'y a ni message
// chat/points de chaine ni TTS en attente (moments creux du stream).
//
// Choix volontaire : ce contenu est ecrit a la main plutot que scrape sur
// un site tiers. Deux raisons : (1) eviter de republier du texte protege
// par le droit d'auteur (les horoscopes de sites pro sont du contenu
// editorial), et (2) fiabilite -- pas de dependance a une API externe qui
// pourrait tomber en panne ou etre limitee en plein live. L'horoscope
// "tourne" quand meme chaque semaine (le variant affiche change selon le
// numero de semaine ISO), et on peut facilement enrichir les listes plus
// tard si Vulvy veut plus de variete.
//
// Les fun facts piraterie/jeux video ci-dessous sont tous verifies (dates,
// noms, chiffres) plutot qu'inventes -- sources : Royal Museums Greenwich
// (histoire de la piraterie), Wikipedia "Early history of video games",
// Super Mario Wiki, et recoupements multiples pour Nintendo/Tetris/Pac-Man.

const FUN_FACTS = [
  "le miel ne perime jamais : des pots vieux de plus de 3000 ans ont ete retrouves encore comestibles dans des tombes egyptiennes.",
  "les poulpes ont trois coeurs et le sang bleu.",
  "un jour sur Venus dure plus longtemps qu'une annee sur Venus.",
  "la banane est techniquement une baie, mais la fraise n'en est pas une.",
  "le coeur d'une crevette se trouve dans sa tete.",
  "la tour Eiffel peut grandir d'environ 15 cm l'ete a cause de la dilatation du metal.",
  "les escargots peuvent hiberner jusqu'a trois ans d'affilee.",
  "il y a plus d'arbres sur Terre que d'etoiles dans notre galaxie.",
  "les flamants roses naissent gris, leur couleur vient de leur alimentation.",
  "un eclair est environ cinq fois plus chaud que la surface du soleil.",
  "les loutres de mer se tiennent la main pour ne pas deriver pendant leur sommeil.",
  "le premier email de l'histoire a ete envoye en 1971.",
  "les pieuvres peuvent gouter avec leurs bras.",
  "un groupe de flamants s'appelle une \"flamboyance\".",
  "chaque dauphin a un sifflement unique qui lui sert un peu de prenom.",
  "le mont Everest grandit d'environ 4 mm chaque annee.",
  "les huitres peuvent changer de sexe plusieurs fois dans leur vie.",
  "le cerveau humain utilise a lui seul environ 20% de l'energie du corps.",
  "les etoiles de mer n'ont pas de cerveau du tout.",
  "un escargot a environ 14000 dents, reparties sur une petite langue rappeuse.",
  "les girafes n'ont que sept vertebres cervicales, exactement comme les humains.",
  "le Canada possede plus de lacs que tout le reste du monde reuni.",
  "les abeilles peuvent reconnaitre des visages humains.",
  "un nuage moyen pese environ 500 tonnes.",
  "les koalas ont des empreintes digitales presque identiques a celles des humains.",
  "le son ne se propage pas du tout dans le vide spatial.",
  "les crocodiles ne peuvent pas tirer la langue.",
  "il existe plus de facons de melanger un jeu de 52 cartes que d'atomes sur Terre.",
  "les pieuvres possedent neuf cerveaux : un central et un par tentacule.",
  "le miel est le seul aliment qui ne moisit et ne perime jamais s'il est bien conserve.",
  "les tigres ont la peau rayee, pas seulement le pelage.",
  "un jour terrestre s'allonge d'environ 1,7 milliseconde par siecle.",
  "les kangourous ne peuvent pas marcher en arriere.",
  "les manchots empereurs peuvent plonger a plus de 500 metres de profondeur.",
];

// Faits verifies sur l'age d'or de la piraterie (annees 1680-1720), source
// principale : Royal Museums Greenwich.
const PIRACY_FACTS = [
  "l'age d'or de la piraterie n'a dure qu'environ 40 ans, des annees 1680 aux annees 1720.",
  "le pirate Bartholomew Roberts, alias \"Black Bart\", a capture plus de 400 navires durant sa carriere.",
  "Barbe Noire, de son vrai nom Edward Teach, sevissait dans les Caraibes et sur la cote est de l'Amerique du Nord au debut des annees 1700.",
  "Madagascar servait de base majeure aux pirates actifs dans l'ocean Indien.",
  "le \"capitaine Charles Johnson\" a publie en 1724 \"A General History of the Pyrates\", la source la plus citee sur les pirates de l'epoque.",
  "le pirate \"Calico\" Jack Rackham a ete execute a Port Royal, en Jamaique, en 1724.",
  "Bartholomew Roberts est mort au combat le 10 fevrier 1722, quand son navire a ete intercepte par la Royal Navy.",
  "la Jamaique a ete prise aux Espagnols par les Anglais en 1655, ce qui a favorise l'expansion des colonies anglaises dans les Caraibes.",
  "en temps de guerre, des \"lettres de marque\" autorisaient legalement certains marins a attaquer des navires ennemis : la frontiere entre corsaire et pirate tenait surtout a un bout de papier.",
  "c'est une repression navale de plus en plus severe dans les annees 1720 qui a mis fin a l'age d'or de la piraterie.",
];

// Faits verifies sur des femmes pirates, sources : Royal Museums Greenwich
// (Anne Bonny / Mary Read, Grace O'Malley) et World History Encyclopedia
// (Zheng Yi Sao / Ching Shih).
const WOMEN_PIRACY_FACTS = [
  "Anne Bonny est nee pres de Cork, en Irlande, vers 1698, fille illegitime d'un avocat et d'une domestique.",
  "Mary Read a ete elevee comme un garcon par sa mere depuis l'enfance, pour pouvoir toucher un heritage reserve a un fils.",
  "Anne Bonny et Mary Read se sont rencontrees a Nassau, aux Bahamas, au sein de l'equipage du capitaine \"Calico\" Jack Rackham.",
  "en aout 1720, Anne Bonny, Mary Read et l'equipage de Rackham ont vole le navire \"William\" dans le port de Nassau avant d'ecumer les Caraibes.",
  "capturees au large de Negril, en Jamaique, en aout 1720, Anne Bonny et Mary Read ont toutes les deux echappe a la pendaison en se declarant enceintes.",
  "Mary Read est morte de fievre en prison en avril 1721, avant d'avoir pu etre jugee a nouveau.",
  "Ching Shih (Zheng Yi Sao), veuve d'un chef pirate chinois, a dirige de 1807 a 1810 une flotte qui a compte jusqu'a 800 navires et plus de 70 000 hommes, l'une des plus grandes flottes pirates de l'histoire.",
  "en juillet 1808, la flotte de Ching Shih a inflige une lourde defaite a une flotte imperiale chinoise pres de Canton, au terme d'un combat de 16 heures.",
  "en 1810, Ching Shih a negocie elle-meme sa reddition face a l'empire chinois et a obtenu une amnistie totale, se retirant avec sa fortune -- une fin de carriere rarissime chez les pirates.",
  "la reine des mers irlandaise Grace O'Malley a rencontre en personne la reine Elisabeth Ire d'Angleterre au palais de Greenwich en septembre 1593, une entrevue confirmee par des documents d'archives anglais.",
];

// Faits verifies sur l'histoire du jeu video, sources : Wikipedia "Early
// history of video games", Super Mario Wiki, et recoupements multiples.
const GAMING_FACTS = [
  "le tout premier jeu video jamais brevete est un dispositif a tube cathodique, brevete des 1947 par Thomas T. Goldsmith Jr. et Estle Ray Mann.",
  "\"Bertie the Brain\", un jeu de morpion cree par Josef Kates, a ete presente au public des 1950 lors de l'Exposition nationale canadienne.",
  "\"Tennis for Two\", cree en 1958 par William Higinbotham et affiche sur un oscilloscope, est considere comme le premier jeu video pense uniquement pour le divertissement.",
  "\"Spacewar!\", cree en 1962, a ete l'un des tout premiers jeux video a circuler en dehors d'un seul laboratoire de recherche.",
  "la Magnavox Odyssey, sortie en 1972, est la toute premiere console de jeu video pour la maison : plus de 100 000 exemplaires vendus des sa premiere annee.",
  "le jeu d'arcade Pong, sorti en 1972, s'est vendu a plus de 8000 bornes.",
  "Mario s'appelait a l'origine \"Jumpman\" dans Donkey Kong (1981), et son metier n'etait pas plombier mais charpentier.",
  "Nintendo a ete fondee en 1889, a l'origine pour fabriquer des cartes a jouer japonaises traditionnelles (hanafuda), bien avant les jeux video.",
  "Tetris a ete cree en 1984 par le chercheur sovietique Alexey Pajitnov, alors qu'il travaillait a l'Academie des sciences d'URSS, et s'est diffuse dans le bloc de l'Est via des disquettes copiees a la main.",
  "Pac-Man s'appelait a l'origine \"Puck-Man\" au Japon : le nom a ete change pour la sortie americaine, notamment par crainte que des vandales transforment facilement le \"P\" en \"F\" sur les bornes d'arcade.",
  "le personnage de Mario a ete concu avec une salopette rouge et une chemise bleue pour que ses bras restent visibles malgre les limites techniques de la borne d'arcade de l'epoque.",
];

const HOROSCOPE_SIGNS = [
  { name: 'Belier', emoji: '♈' },
  { name: 'Taureau', emoji: '♉' },
  { name: 'Gemeaux', emoji: '♊' },
  { name: 'Cancer', emoji: '♋' },
  { name: 'Lion', emoji: '♌' },
  { name: 'Vierge', emoji: '♍' },
  { name: 'Balance', emoji: '♎' },
  { name: 'Scorpion', emoji: '♏' },
  { name: 'Sagittaire', emoji: '♐' },
  { name: 'Capricorne', emoji: '♑' },
  { name: 'Verseau', emoji: '♒' },
  { name: 'Poissons', emoji: '♓' },
];

// Choix assume : uniquement du positif, et meme ultra-positif -- le bandeau
// tourne en boucle pendant tout le live, devant des gens qui viennent
// passer un bon moment. Variantes entierement renouvelees (6 par signe au
// lieu de 4) pour plus de fraicheur et moins de repetition d'une semaine
// sur l'autre.
const HOROSCOPE_VARIANTS = {
  Belier: [
    "cette semaine tu rayonnes d'energie, absolument rien ne peut t'arreter.",
    "un coup d'audace que tu tentes va payer plus que tu ne l'esperais.",
    "tout ce que tu demarres cette semaine part sur des chapeaux de roues.",
    "une excellente nouvelle tombe pile au bon moment pour toi.",
    "ta motivation est contagieuse, elle entraine tout le monde autour de toi.",
    "tu decroches une victoire que tu attendais depuis un moment, savoure-la a fond.",
  ],
  Taureau: [
    "semaine en or : tout ce que tu construis patiemment se met enfin en place.",
    "ton calme legendaire va faire toute la difference cette semaine.",
    "un petit plaisir tout simple illumine completement ta semaine.",
    "on reconnait enfin tous tes efforts, et c'est amplement merite.",
    "une stabilite tres agreable s'installe autour de toi.",
    "tu recoltes exactement ce que tu as seme, et c'est une belle recolte.",
  ],
  Gemeaux: [
    "tes idees fusent dans tous les sens et elles sont excellentes.",
    "une rencontre ou une discussion va t'ouvrir une porte inattendue.",
    "ta curiosite naturelle te mene droit vers une tres bonne surprise.",
    "tu fais rire et briller tout le monde autour de toi cette semaine.",
    "un projet auquel tu penses depuis un moment prend enfin forme.",
    "ta vivacite d'esprit impressionne exactement qui il fallait.",
  ],
  Cancer: [
    "ta douceur cette semaine attire plein de belles choses vers toi.",
    "les personnes que tu aimes se rapprochent encore plus de toi.",
    "ton intuition est en feu, fais-lui confiance les yeux fermes.",
    "un vrai moment cocon et reconfortant t'attend, tu l'as bien merite.",
    "quelqu'un pense tres fort a toi et te le montre cette semaine.",
    "ta sensibilite devient une vraie force, et ca se voit.",
  ],
  Lion: [
    "tu rayonnes litteralement cette semaine, impossible de ne pas te remarquer.",
    "un compliment sincere et merite va te faire un bien fou.",
    "ta generosite declenche une tres belle surprise en retour.",
    "c'est le moment ideal pour montrer tout ce dont tu es capable.",
    "on t'admire cette semaine, et tu le sais au fond de toi.",
    "une occasion en or de briller se presente, fonce sans hesiter.",
  ],
  Vierge: [
    "tout se remet parfaitement en ordre cette semaine, quel soulagement.",
    "ton sens du detail sauve la situation, comme toujours.",
    "un projet minutieusement prepare demarre enfin, et tres fort.",
    "on te remercie sincerement pour ton serieux : savoure ce moment.",
    "ta rigueur porte enfin tous ses fruits.",
    "une amelioration nette et concrete arrive dans ta vie cette semaine.",
  ],
  Balance: [
    "harmonie totale cette semaine : tout semble se placer tout seul.",
    "ton sens de l'equilibre apaise une situation tendue, et ca se remarque.",
    "ton charme naturel ouvre une porte, il ne tient qu'a toi de la pousser.",
    "une tres belle rencontre ou des retrouvailles illuminent ta semaine.",
    "tu inspires confiance a tout le monde autour de toi cette semaine.",
    "la justesse de tes choix impressionne, et a raison.",
  ],
  Scorpion: [
    "ton intensite attire exactement les bonnes personnes cette semaine.",
    "tu vois clair la ou tout le monde hesite, et ca va enormement payer.",
    "un changement amorce depuis un moment porte enfin ses fruits.",
    "ta determination impressionne et t'ouvre des portes inattendues.",
    "un secret ou une verite se revele enfin en ta faveur.",
    "ta force tranquille rassure et inspire ceux qui t'entourent.",
  ],
  Sagittaire: [
    "l'aventure te tend grand les bras cette semaine : fonce sans hesiter.",
    "ton optimisme est contagieux, il fait un bien fou a tout le monde.",
    "une opportunite inattendue tombe exactement au bon moment.",
    "tu decouvres quelque chose de nouveau qui va totalement te passionner.",
    "ta bonne humeur attire des occasions en or.",
    "un voyage, meme tout petit, t'apporte une bouffee d'air pur.",
  ],
  Capricorne: [
    "tes efforts sont enfin reconnus a leur juste valeur.",
    "semaine solide : tout ce que tu poses maintenant va durer longtemps.",
    "une excellente nouvelle vient recompenser ta constance.",
    "on te confie quelque chose d'important, et c'est tres bon signe.",
    "ta perseverance impressionne meme les plus sceptiques.",
    "un objectif que tu vises depuis longtemps se rapproche enfin.",
  ],
  Verseau: [
    "ton originalite fait totalement mouche cette semaine, assume-la a fond.",
    "une idee un peu folle se revele etre excellente, lance-toi sans crainte.",
    "tes amis ont besoin de ton regard unique, et ils te le diront.",
    "tu crees quelque chose que personne d'autre n'aurait imagine.",
    "ta liberte d'esprit inspire plus de monde que tu ne le penses.",
    "une surprise inattendue et tres agreable pointe le bout de son nez.",
  ],
  Poissons: [
    "ton imagination est au sommet, c'est le moment ideal pour creer.",
    "une intuition tres forte te guide vers une excellente decision.",
    "la douceur et la serenite reviennent pleinement dans ta semaine.",
    "quelqu'un va te montrer a quel point tu comptes vraiment pour lui.",
    "ta sensibilite artistique est en pleine effervescence cette semaine.",
    "un reve ou un projet cher a ton coeur avance enfin.",
  ],
};

// Rappel incitant a utiliser les points de chaine pour une dedicace qui
// passera dans le bandeau.
const CHANNEL_POINTS_PROMO =
  "Envie de passer a l'ecran ? Utilise tes points de chaine pour une dedicace qui s'affichera juste ici !";

// Numero de semaine ISO (1-53), utilise pour faire "tourner" l'horoscope
// chaque semaine sans dependre d'une source externe.
function isoWeekNumber(date = new Date()) {
  const d = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate()));
  const dayNum = d.getUTCDay() || 7;
  d.setUTCDate(d.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(d.getUTCFullYear(), 0, 1));
  return Math.ceil(((d - yearStart) / 86400000 + 1) / 7);
}

function getWeeklyHoroscopes() {
  const week = isoWeekNumber();
  return HOROSCOPE_SIGNS.map((sign) => {
    const variants = HOROSCOPE_VARIANTS[sign.name];
    const text = variants[week % variants.length];
    return `${sign.emoji} ${sign.name} : ${text}`;
  });
}

// Melange aleatoire (Fisher-Yates) : sans ca, les facts les plus recents
// (piraterie/jeux video/femmes pirates, ajoutes en fin de tableau) ne
// passeraient qu'apres une bonne dizaine de minutes de rotation des
// anciens facts generaux. En melangeant, les nouveautes ont une chance de
// sortir des le debut du live, pas seulement en fin de rotation.
function shuffle(array) {
  const a = array.slice();
  for (let i = a.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Melange facts (generaux + piraterie + jeux video + femmes pirates,
// ordre aleatoire a chaque rechargement) et horoscopes (un horoscope
// tous les 3 facts environ) pour varier le contenu affiche dans le
// bandeau pendant les moments creux. Chaque item est normalise en
// { text, variant } -- variant "default" pour tout le contenu.
function getFillerItems() {
  const horoscopes = getWeeklyHoroscopes();
  const allFacts = shuffle([...FUN_FACTS, ...PIRACY_FACTS, ...WOMEN_PIRACY_FACTS, ...GAMING_FACTS]);
  const facts = allFacts.map((f) => ({ text: `Le saviez-vous ? ${f}`, variant: 'default' }));
  const items = [];
  let h = 0;
  facts.forEach((fact, i) => {
    items.push(fact);
    if ((i + 1) % 3 === 0 && h < horoscopes.length) {
      items.push({ text: horoscopes[h], variant: 'default' });
      h += 1;
    }
  });
  while (h < horoscopes.length) {
    items.push({ text: horoscopes[h], variant: 'default' });
    h += 1;
  }

  // On glisse le rappel points de chaine / dedicace regulierement dans la
  // rotation plutot qu'une seule fois, pour qu'il ait une chance de
  // repasser plusieurs fois par heure.
  const withPromo = [];
  items.forEach((item, i) => {
    withPromo.push(item);
    if ((i + 1) % 6 === 0) {
      withPromo.push({ text: CHANNEL_POINTS_PROMO, variant: 'default' });
    }
  });
  if (!withPromo.some((it) => it.text === CHANNEL_POINTS_PROMO)) {
    withPromo.push({ text: CHANNEL_POINTS_PROMO, variant: 'default' });
  }
  return withPromo;
}

module.exports = { getFillerItems };
