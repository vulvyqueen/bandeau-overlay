require('dotenv').config();

const express = require('express');
const http = require('http');
const path = require('path');
const crypto = require('crypto');
const { WebSocketServer, WebSocket } = require('ws');
const { refreshEmotes, getEmotes } = require('./emotes');
const { getFillerItems } = require('./filler');

const app = express();
app.use(express.json());

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: '/ws' });

const AUTH_TOKEN = process.env.AUTH_TOKEN || 'change-me';
const MAX_TEXT_LENGTH = 300;

function broadcast(payload) {
  const data = JSON.stringify(payload);
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(data);
    }
  });
}

// Racine + /overlay.html -> renvoie directement l'overlay (pratique pour le
// Browser Source OBS et pour "reveiller" le service avant un live sur les
// hebergeurs gratuits). Fichier servi explicitement (pas de dossier statique
// complet) pour ne pas exposer le reste du code source via HTTP.
app.get(['/', '/overlay.html'], (req, res) => {
  res.sendFile(path.join(__dirname, 'overlay.html'));
});

// Petit log utile pour verifier que le relais tourne bien pendant un live
app.get('/health', (req, res) => {
  res.json({ ok: true, clientsConnected: wss.clients.size, uptimeSec: Math.round(process.uptime()) });
});

// Liste des emotes (Twitch global via BTTV/7TV/FFZ + emotes de la chaine),
// utilisee par l'overlay pour afficher des images au lieu du texte brut.
app.get('/emotes', (req, res) => {
  res.json(getEmotes());
});

// Contenu de remplissage (fun facts + mini horoscope hebdo) affiche par
// l'overlay pendant les moments creux, quand il n'y a ni message chat/points
// de chaine ni TTS en attente.
app.get('/filler', (req, res) => {
  res.json({ items: getFillerItems() });
});

// Point d'entree appele par Mix It Up (action "Web Request") pour chaque
// commande mod, redemption de points, ou lecture TTS.
app.post('/message', (req, res) => {
  const token = req.header('X-Auth-Token') || req.body.token;
  if (!AUTH_TOKEN || token !== AUTH_TOKEN) {
    return res.status(401).json({ error: 'unauthorized' });
  }

  const { text, type = 'chat', author = '' } = req.body || {};

  if (!text || typeof text !== 'string' || !text.trim()) {
    return res.status(400).json({ error: 'text is required' });
  }
  if (text.length > MAX_TEXT_LENGTH) {
    return res.status(400).json({ error: `text too long (max ${MAX_TEXT_LENGTH} chars)` });
  }
  if (!['chat', 'tts'].includes(type)) {
    return res.status(400).json({ error: 'type must be "chat" or "tts"' });
  }

  const message = {
    id: crypto.randomUUID(),
    text: text.trim(),
    type,
    author: String(author || '').trim().slice(0, 40),
    ts: Date.now(),
  };

  broadcast(message);
  res.json({ ok: true, id: message.id });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Bandeau server listening on port ${PORT}`);
});

// Chargement des emotes au demarrage, puis rafraichi toutes les 30 min
// (nouvelles emotes d'abonnes, changements cote BTTV/7TV/FFZ, etc.)
refreshEmotes();
setInterval(refreshEmotes, 30 * 60 * 1000);
