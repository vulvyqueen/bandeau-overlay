// Recupere et cache les emotes globales + de la chaine depuis BTTV, 7TV,
// FFZ et Twitch lui-meme (emotes globales + emotes d'abonnes de la chaine),
// sans jamais toucher au token de Vulvy elle-meme : on utilise un "app
// access token" obtenu via le Client ID / Client Secret de l'appli Twitch
// dediee (TWITCH_CLIENT_ID / TWITCH_CLIENT_SECRET, cf. dev.twitch.tv).

const TWITCH_CHANNEL_NAME = (process.env.TWITCH_CHANNEL_NAME || 'vulvyqueen').toLowerCase();
let twitchUserId = process.env.TWITCH_CHANNEL_ID || null;

const TWITCH_CLIENT_ID = process.env.TWITCH_CLIENT_ID || null;
const TWITCH_CLIENT_SECRET = process.env.TWITCH_CLIENT_SECRET || null;
let twitchAppToken = null;
let twitchAppTokenExpiresAt = 0; // timestamp ms

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

// Recupere (et cache) un "app access token" Twitch via le flux
// client_credentials. Ce token n'est lie a aucun compte viewer/mod, il sert
// juste a interroger l'API Helix (emotes globales + emotes de la chaine).
async function getTwitchAppToken() {
  if (!TWITCH_CLIENT_ID || !TWITCH_CLIENT_SECRET) return null;
  if (twitchAppToken && Date.now() < twitchAppTokenExpiresAt - 5 * 60 * 1000) {
    return twitchAppToken;
  }
  try {
    const params = new URLSearchParams({
      client_id: TWITCH_CLIENT_ID,
      client_secret: TWITCH_CLIENT_SECRET,
      grant_type: 'client_credentials',
    });
    const res = await fetch(`https://id.twitch.tv/oauth2/token?${params.toString()}`, { method: 'POST' });
    if (!res.ok) {
      console.error('Erreur obtention token Twitch:', res.status, await res.text());
      return null;
    }
    const data = await res.json();
    twitchAppToken = data.access_token;
    twitchAppTokenExpiresAt = Date.now() + (data.expires_in || 0) * 1000;
    return twitchAppToken;
  } catch (e) {
    console.error('Erreur obtention token Twitch:', e.message);
    return null;
  }
}

// Construit l'URL d'une emote Twitch native a partir du "template" renvoye
// par Helix (ex: https://static-cdn.jtvnw.net/emoticons/v2/{{id}}/{{format}}/{{theme_mode}}/{{scale}}).
// IMPORTANT : le champ "images" pratique renvoye par Helix pointe TOUJOURS
// vers la version statique, meme quand l'emote est animee -- Twitch ne
// documente pas ca clairement. Pour avoir l'animation il faut reconstruire
// l'URL soi-meme avec format=animated quand l'emote le supporte (champ
// "format": ["static","animated"]).
function twitchNativeUrl(template, emote) {
  if (!template) return bestTwitchNativeFallback(emote);
  const format = emote.format?.includes('animated') ? 'animated' : 'static';
  const theme = emote.theme_mode?.includes('dark') ? 'dark' : (emote.theme_mode?.[0] || 'light');
  const scale = emote.scale?.includes('3.0') ? '3.0' : (emote.scale?.[emote.scale.length - 1] || '1.0');
  return template
    .replace('{{id}}', emote.id)
    .replace('{{format}}', format)
    .replace('{{theme_mode}}', theme)
    .replace('{{scale}}', scale);
}

// Filet de securite si jamais Helix ne renvoie pas de template (ne devrait
// pas arriver) : on retombe sur la version statique fournie directement.
function bestTwitchNativeFallback(emote) {
  const images = emote?.images;
  if (!images) return null;
  return images.url_4x || images.url_2x || images.url_1x || null;
}

async function fetchTwitchNative(userId) {
  const map = {};
  const token = await getTwitchAppToken();
  if (!token) return map;

  const headers = { 'Client-Id': TWITCH_CLIENT_ID, Authorization: `Bearer ${token}` };

  try {
    const globalRes = await fetch('https://api.twitch.tv/helix/chat/emotes/global', { headers });
    if (globalRes.ok) {
      const { data, template } = await globalRes.json();
      for (const e of data || []) {
        const url = twitchNativeUrl(template, e);
        if (url) map[e.name] = url;
      }
    } else {
      console.error('Erreur emotes Twitch globales:', globalRes.status, await globalRes.text());
    }
  } catch (e) {
    console.error('Erreur emotes Twitch globales:', e.message);
  }

  if (userId) {
    try {
      const chanRes = await fetch(`https://api.twitch.tv/helix/chat/emotes?broadcaster_id=${userId}`, { headers });
      if (chanRes.ok) {
        const { data, template } = await chanRes.json();
        for (const e of data || []) {
          const url = twitchNativeUrl(template, e);
          if (url) map[e.name] = url;
        }
      } else {
        console.error('Erreur emotes Twitch de la chaine:', chanRes.status, await chanRes.text());
      }
    } catch (e) {
      console.error('Erreur emotes Twitch de la chaine:', e.message);
    }
  }

  return map;
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
  // .png est TOUJOURS statique (meme pour une emote animee) -- il ne faut
  // le prendre qu'en dernier recours. .webp et .gif conservent l'animation
  // quand la source en a une, donc on les priorise. On evite .avif (moins
  // bien supporte par le navigateur source d'OBS).
  const byExt = (ext) => files.filter((f) => f.name.endsWith(ext));
  const pick = byExt('.webp').length
    ? byExt('.webp')
    : byExt('.gif').length
      ? byExt('.gif')
      : byExt('.avif').length
        ? byExt('.avif')
        : byExt('.png').length
          ? byExt('.png')
          : files;
  const file = pick[pick.length - 1];
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
    const [ffz, bttv, seventv, twitchNative] = await Promise.all([
      fetchFFZ(TWITCH_CHANNEL_NAME),
      fetchBTTV(userId),
      fetch7TV(userId),
      fetchTwitchNative(userId),
    ]);
    // Priorite en cas de nom en double : Twitch natif > 7TV > BTTV > FFZ
    // (les emotes Twitch officielles -- notamment les emotes d'abonnes --
    // sont la source la plus fiable pour un nom donne).
    cachedEmotes = { ...ffz, ...bttv, ...seventv, ...twitchNative };
    console.log(`Emotes chargees : ${Object.keys(cachedEmotes).length}`);
  } catch (e) {
    console.error('Erreur lors du rafraichissement des emotes:', e.message);
  }
}

function getEmotes() {
  return cachedEmotes;
}

module.exports = { refreshEmotes, getEmotes };
