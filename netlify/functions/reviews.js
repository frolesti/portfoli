// netlify/functions/reviews.js
// GET  → retorna tots els comentaris del Gist REVIEWS_GIST_ID
// POST → afegeix un comentari nou

const https = require('https');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Content-Type': 'application/json'
};

const MAX_MESSAGE_LENGTH = 1000;
const MAX_NAME_LENGTH = 80;

// ── helpers ──────────────────────────────────────────────

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${process.env.GH_PAT}`,
        'User-Agent': 'frolesti-reviews',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try { resolve({ status: res.statusCode, data: JSON.parse(data) }); }
        catch { resolve({ status: res.statusCode, data }); }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function sanitize(str) {
  return String(str || '').replace(/[<>"'`]/g, '').trim();
}

// ── handler ──────────────────────────────────────────────

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS };
  }

  const gistId = process.env.REVIEWS_GIST_ID;
  if (!gistId || !process.env.GH_PAT) {
    return { statusCode: 500, headers: CORS_HEADERS, body: JSON.stringify({ error: 'server_config' }) };
  }

  // ── GET: retorna comentaris ──────────────────────────────
  if (event.httpMethod === 'GET') {
    const res = await ghRequest('GET', `/gists/${gistId}`);
    if (res.status !== 200) {
      return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'gist_read_error' }) };
    }

    const raw = res.data.files?.['reviews.json']?.content || '[]';
    let reviews = [];
    try { reviews = JSON.parse(raw); } catch { reviews = []; }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(reviews)
    };
  }

  // ── POST: afegeix comentari ──────────────────────────────
  if (event.httpMethod === 'POST') {
    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch {
      return { statusCode: 400, headers: CORS_HEADERS, body: JSON.stringify({ error: 'invalid_json' }) };
    }

    const name    = sanitize(body.name || 'Anònim').slice(0, MAX_NAME_LENGTH) || 'Anònim';
    const message = sanitize(body.message || '').slice(0, MAX_MESSAGE_LENGTH);
    const project = sanitize(body.project || '').slice(0, 80);
    const rating  = Math.min(5, Math.max(1, parseInt(body.rating, 10) || 5));

    if (!message || message.length < 5) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'invalid_input', message: 'El missatge és massa curt.' })
      };
    }

    // Llegim l'estat actual
    const getRes = await ghRequest('GET', `/gists/${gistId}`);
    if (getRes.status !== 200) {
      return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'gist_read_error' }) };
    }

    const sha  = getRes.data.files?.['reviews.json'] ? undefined : undefined; // not needed for gist
    const raw  = getRes.data.files?.['reviews.json']?.content || '[]';
    let reviews = [];
    try { reviews = JSON.parse(raw); } catch { reviews = []; }

    reviews.unshift({
      id: Date.now(),
      name,
      project,
      rating,
      message,
      date: new Date().toISOString()
    });

    // Guardem (màxim 200 entrades)
    reviews = reviews.slice(0, 200);

    const patchRes = await ghRequest('PATCH', `/gists/${gistId}`, {
      files: { 'reviews.json': { content: JSON.stringify(reviews, null, 2) } }
    });

    if (patchRes.status !== 200) {
      return { statusCode: 502, headers: CORS_HEADERS, body: JSON.stringify({ error: 'gist_write_error' }) };
    }

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true })
    };
  }

  return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'method_not_allowed' }) };
};
