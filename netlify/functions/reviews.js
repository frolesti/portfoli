// netlify/functions/reviews.js
// GET  -> retorna nomes comentaris aprovats
// POST -> afegeix un comentari pendent de moderacio

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

function parseReviews(rawContent) {
  try {
    const parsed = JSON.parse(rawContent || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function isPubliclyVisible(review) {
  if (!review || typeof review !== 'object') return false;

  if (review.status === 'pending' || review.status === 'rejected') return false;
  if (review.approved === false) return false;

  return true;
}

// ── handler ──────────────────────────────────────────────

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS };
  }

  const gistId = process.env.REVIEWS_GIST_ID || process.env.GIST_ID;
  if (!gistId || !process.env.GH_PAT) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'server_config',
        message: 'Configuracio del servidor incompleta (GH_PAT i REVIEWS_GIST_ID o GIST_ID).'
      })
    };
  }

  // ── GET: retorna nomes comentaris aprovats ───────────────
  if (event.httpMethod === 'GET') {
    const res = await ghRequest('GET', `/gists/${gistId}`);
    if (res.status !== 200) {
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'gist_read_error',
          message: 'No s\'han pogut carregar els comentaris (error llegint el Gist).'
        })
      };
    }

    const raw = res.data.files?.['reviews.json']?.content || '[]';
    const reviews = parseReviews(raw).filter(isPubliclyVisible);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify(reviews)
    };
  }

  // ── POST: afegeix comentari pendent ──────────────────────
  if (event.httpMethod === 'POST') {
    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'invalid_json', message: 'Cos de petició invàlid (JSON mal format).' })
      };
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
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'gist_read_error',
          message: 'No s\'ha pogut llegir el Gist abans de publicar.'
        })
      };
    }

    const raw  = getRes.data.files?.['reviews.json']?.content || '[]';
    let reviews = parseReviews(raw);

    reviews.unshift({
      id: Date.now(),
      name,
      project,
      rating,
      message,
      date: new Date().toISOString(),
      approved: false,
      status: 'pending',
      moderatedAt: null
    });

    // Guardem (màxim 200 entrades)
    reviews = reviews.slice(0, 200);

    const patchRes = await ghRequest('PATCH', `/gists/${gistId}`, {
      files: { 'reviews.json': { content: JSON.stringify(reviews, null, 2) } }
    });

    if (patchRes.status !== 200) {
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({
          error: 'gist_write_error',
          message: 'No s\'ha pogut guardar el comentari al Gist (revisa permisos del token).'
        })
      };
    }

    return {
      statusCode: 201,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, pending: true, message: 'Comentari rebut. El revisaré abans de publicar-lo.' })
    };
  }

  return { statusCode: 405, headers: CORS_HEADERS, body: JSON.stringify({ error: 'method_not_allowed' }) };
};
