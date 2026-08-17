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

const HOROSCOPE_VARIANTS = {
  Belier: [
    "cette semaine, ton energie de feu attire les bonnes occasions : fonce, mais laisse les autres suivre le rythme.",
    "un imprevu te bouscule mais tu retombes toujours sur tes pattes, comme d'habitude.",
    "bonne semaine pour lancer un projet impulsif -- ton instinct a raison plus souvent que tu ne le penses.",
    "un peu d'impatience cette semaine : respire avant de repondre, ca t'evitera un clash inutile.",
  ],
  Taureau: [
    "semaine stable et confortable : profite du cocon que tu t'es construit, tu l'as bien merite.",
    "ta patience va payer, meme si les resultats mettent un peu plus de temps que prevu.",
    "envie de nouveaute cette semaine ? laisse-toi tenter, ca ne va pas casser tes habitudes.",
    "un petit coup de fatigue passager : accorde-toi une vraie pause sans culpabiliser.",
  ],
  Gemeaux: [
    "ton cerveau tourne a mille a l'heure cette semaine, essaie de finir une chose avant d'en commencer une autre.",
    "belle semaine pour les discussions et les rencontres, ta repartie fait mouche.",
    "un peu de dispersion en vue : une petite liste de priorites te sauvera la mise.",
    "tu vas recevoir une nouvelle qui te donne envie de tout changer -- prends le temps d'y reflechir.",
  ],
  Cancer: [
    "semaine cocooning : entoure-toi des gens qui te font du bien et laisse le reste de cote.",
    "ta sensibilite est une force cette semaine, ne la vois pas comme un defaut.",
    "un souvenir du passe refait surface, avec plus de douceur que prevu.",
    "prends soin de toi avant de prendre soin des autres, pour une fois.",
  ],
  Lion: [
    "les projecteurs sont sur toi cette semaine, profites-en pour briller sans en faire trop.",
    "ta generosite impressionne ton entourage -- garde un peu d'energie pour toi aussi.",
    "petit ego a gerer cette semaine : ecouter vaut parfois mieux que convaincre.",
    "une bonne nouvelle professionnelle pourrait bien illuminer ta semaine.",
  ],
  Vierge: [
    "ton sens du detail fait des merveilles cette semaine, mais n'oublie pas de voir l'ensemble aussi.",
    "tu vas enfin cocher cette tache qui traine sur ta liste depuis des semaines.",
    "un peu de lacher-prise te ferait le plus grand bien cette semaine.",
    "quelqu'un a besoin de tes conseils tres organises -- tu es dans ton element.",
  ],
  Balance: [
    "semaine placee sous le signe de l'harmonie : les tensions autour de toi s'apaisent.",
    "une decision a prendre te fait hesiter, mais ton instinct sait deja ce qu'il veut.",
    "ton charme social ouvre des portes cette semaine, ose demander ce que tu veux.",
    "besoin d'equilibre entre boulot et detente : accorde-toi les deux sans culpabiliser.",
  ],
  Scorpion: [
    "ton intensite habituelle attire l'attention cette semaine, dans le bon sens du terme.",
    "un secret ou une info confidentielle pourrait bien atterrir entre tes mains.",
    "semaine parfaite pour couper les ponts avec ce qui ne te sert plus.",
    "ta determination impressionne, meme si tu prefererais rester discret dessus.",
  ],
  Sagittaire: [
    "envie d'aventure cette semaine : meme une petite sortie improvisee te fera un bien fou.",
    "ton optimisme est contagieux, ton entourage en a bien besoin en ce moment.",
    "une opportunite inattendue se presente -- dis oui avant de trop reflechir.",
    "petit besoin de liberte cette semaine, ne te laisse pas trop enfermer dans une routine.",
  ],
  Capricorne: [
    "tes efforts recents commencent enfin a payer, meme si personne ne le voit encore.",
    "semaine studieuse et productive : ton serieux impressionne, comme toujours.",
    "un petit coup de mou est normal, meme les plus disciplines ont droit a une pause.",
    "une responsabilite de plus tombe sur tes epaules -- tu geres ca les yeux fermes.",
  ],
  Verseau: [
    "une idee originale que tu gardais pour toi merite d'etre partagee cette semaine.",
    "ton independance est mise a l'epreuve, mais tu restes fidele a toi-meme.",
    "semaine sociale et connectee : tes amis ont besoin de ton regard different sur les choses.",
    "un projet un peu fou prend enfin forme -- fais confiance a ton originalite.",
  ],
  Poissons: [
    "ton imagination tourne a plein regime cette semaine, canalise-la dans un projet creatif.",
    "tu captes les emotions des autres plus que d'habitude -- pense a te proteger un peu aussi.",
    "un reve ou une intuition pourrait bien te guider vers une bonne decision.",
    "besoin de te reconnecter a toi-meme cette semaine, meme quelques minutes par jour suffisent.",
  ],
};

// Rappel incitant a utiliser les points de chaine pour une dedicace qui
// passera dans le bandeau.
const CHANNEL_POINTS_PROMO =
  "Envie de passer a l'ecran ? Utilise tes points de chaine pour une dedicace qui s'affichera juste ici !";

// Promo ZEvent (10e et derniere edition, 4-6 septembre 2026). Variant
// "zevent" -> l'overlay l'affiche en vert aux couleurs de l'evenement au
// lieu du style par defaut.
const ZEVENT_PROMO = [
  {
    text: "Le ZEvent revient du 4 au 6 septembre 2026 pour sa 10e et derniere edition : viens participer et faire grimper la cagnotte !",
    variant: 'zevent',
  },
  {
    text: "Plus que quelques semaines avant le ZEvent (4-6 septembre 2026) : la toute derniere edition du marathon caritatif, on vous attend !",
    variant: 'zevent',
  },
];

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

// Melange facts et horoscopes (un horoscope tous les 3 facts environ) pour
// varier le contenu affiche dans le bandeau pendant les moments creux.
// Chaque item est normalise en { text, variant } -- variant "default" pour
// tout le contenu habituel, "zevent" pour la promo ZEvent (affichee en vert
// cote overlay).
function getFillerItems() {
  const horoscopes = getWeeklyHoroscopes();
  const facts = FUN_FACTS.map((f) => ({ text: `Le saviez-vous ? ${f}`, variant: 'default' }));
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

  // On glisse le rappel points de chaine / dedicace et la promo ZEvent
  // regulierement dans la rotation plutot qu'une seule fois, pour qu'ils
  // aient une chance de repasser plusieurs fois par heure.
  const withPromo = [];
  let z = 0;
  items.forEach((item, i) => {
    withPromo.push(item);
    if ((i + 1) % 6 === 0) {
      withPromo.push({ text: CHANNEL_POINTS_PROMO, variant: 'default' });
    }
    if ((i + 1) % 5 === 0) {
      withPromo.push(ZEVENT_PROMO[z % ZEVENT_PROMO.length]);
      z += 1;
    }
  });
  if (!withPromo.some((it) => it.text === CHANNEL_POINTS_PROMO)) {
    withPromo.push({ text: CHANNEL_POINTS_PROMO, variant: 'default' });
  }
  if (z === 0) {
    withPromo.push(ZEVENT_PROMO[0]);
  }
  return withPromo;
}

module.exports = { getFillerItems };

