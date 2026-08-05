// Recupere et cache les emotes globales + de la chaine depuis BTTV, 7TV et
// FFZ (sans avoir besoin de cles API : ce sont des endpoints publics). Les
// emotes Twitch "officielles" (celles hebergees directement par Twitch, ex.
// emotes d'abonnes) ne sont pas incluses ici car elles necessitent un compte
// developpeur Twitch (Client ID + Secret) pour l'API Helix -- a ajouter plus
// tard si besoin.

const TWITCH_CHANNEL_NAME = (process.env.TWITCH_CHANNEL_NAME || 'vulvyqueen').toLowerCase();
let twitchUserId = process.env.TWITCH_CHANNEL_ID || null;

async function resolveTwitchUserId() {
  if (twitchUserId) return twitchUserId;
  try {
    const res = await fetch(`https://decapi.me/twitch/id/${TWITCH_CHANNEL_NAME}`);
    const id = (await res.text()).trim();
    if (/^\d+$/.test(id)) {
      twitchUserId = id;
    } else {
      console.error('Impossible de resoudre l\'ID Twitch (reponse inattendue):', id);
    }
  } catch (e) {
    console.error('Impossible de resoudre l\'ID Twitch:', e.message);
  }
  return twitchUserId;
}

async function safeJson(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    console.error(`Erreur fetch ${url}:`, e.message);
    return null;
  }
}

async function fetchBTTV(userId) {
  const map = {};

  const global = await safeJson('https://api.betterttv.net/3/cached/emotes/global');
  for (const e of global || []) {
    map[e.code] = `https://cdn.betterttv.net/emote/${e.id}/2x`;
  }

  if (userId) {
    const chan = await safeJson(`https://api.betterttv.net/3/cached/users/twitch/${userId}`);
    if (chan) {
      const all = [...(chan.channelEmotes || []), ...(chan.sharedEmotes || [])];
      for (const e of all) {
        map[e.code] = `https://cdn.betterttv.net/emote/${e.id}/2x`;
      }
    }
  }

  return map;
}

function best7tvFile(emote) {
  const files = emote?.data?.host?.files;
  if (!files || !files.length) return null;
  // On prend un format image classique (evite avif quand possible pour la
  // compatibilite du navigateur source OBS).
  const pngFiles = files.filter((f) => f.name.endsWith('.png') || f.name.endsWith('.webp'));
  const file = pngFiles[pngFiles.length - 1] || files[files.length - 1];
  const base = emote.data.host.url.startsWith('http') ? emote.data.host.url : `https:${emote.data.host.url}`;
  return `${base}/${file.name}`;
}

async function fetch7TV(userId) {
  const map = {};

  const global = await safeJson('https://7tv.io/v3/emote-sets/global');
  for (const e of global?.emotes || []) {
    const url = best7tvFile(e);
    if (url) map[e.name] = url;
  }

  if (userId) {
    const chan = await safeJson(`https://7tv.io/v3/users/twitch/${userId}`);
    for (const e of chan?.emote_set?.emotes || []) {
      const url = best7tvFile(e);
      if (url) map[e.name] = url;
    }
  }

  return map;
}

function bestFFZUrl(emoticon) {
  const urls = emoticon?.urls;
  if (!urls) return null;
  const raw = urls['4'] || urls['2'] || urls['1'];
  if (!raw) return null;
  return raw.startsWith('http') ? raw : `https:${raw}`;
}

async function fetchFFZ(channelName) {
  const map = {};

  const global = await safeJson('https://api.frankerfacez.com/v1/set/global');
  if (global) {
    for (const setId of global.default_sets || []) {
      const set = global.sets?.[setId];
      for (const e of set?.emoticons || []) {
        const url = bestFFZUrl(e);
        if (url) map[e.name] = url;
      }
    }
  }

  const room = await safeJson(`https://api.frankerfacez.com/v1/room/${channelName}`);
  if (room) {
    const setId = room.room?.set;
    const set = room.sets?.[setId];
    for (const e of set?.emoticons || []) {
      const url = bestFFZUrl(e);
      if (url) map[e.name] = url;
    }
  }

  return map;
}

let cachedEmotes = {};

async function refreshEmotes() {
  try {
    const userId = await resolveTwitchUserId();
    const [ffz, bttv, seventv] = await Promise.all([
      fetchFFZ(TWITCH_CHANNEL_NAME),
      fetchBTTV(userId),
      fetch7TV(userId),
    ]);
    // Priorite en cas de nom en double : 7TV > BTTV > FFZ (7TV est la plus
    // utilisee par la communaute actuellement).
    cachedEmotes = { ...ffz, ...bttv, ...seventv };
    console.log(`Emotes chargees : ${Object.keys(cachedEmotes).length}`);
  } catch (e) {
    console.error('Erreur lors du rafraichissement des emotes:', e.message);
  }
}

function getEmotes() {
  return cachedEmotes;
}

module.exports = { refreshEmotes, getEmotes };
