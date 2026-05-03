// netlify/functions/reviews-admin.js
// Endpoint privat per moderar comentaris (pending/approve/reject/delete)

const https = require('https');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type, X-Admin-Key',
  'Access-Control-Allow-Methods': 'GET, PATCH, OPTIONS',
  'Content-Type': 'application/json'
};

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${process.env.GH_PAT}`,
        'User-Agent': 'frolesti-reviews-admin',
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

function getAdminKeyFromEvent(event) {
  const headerValue =
    event.headers?.['x-admin-key'] ||
    event.headers?.['X-Admin-Key'] ||
    event.headers?.['x-admin-Key'];
  return sanitize(headerValue);
}

function getReviewStatus(review) {
  if (review?.status) return review.status;
  if (review?.approved === true) return 'approved';
  if (review?.approved === false) return 'pending';
  return 'approved';
}

function serializeForWrite(reviews) {
  return JSON.stringify(reviews.slice(0, 400), null, 2);
}

exports.handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS };
  }

  const gistId = process.env.REVIEWS_GIST_ID || process.env.GIST_ID;
  const ghPat = process.env.GH_PAT;
  const adminKey = sanitize(process.env.REVIEWS_ADMIN_KEY || '');

  if (!gistId || !ghPat) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'server_config',
        message: 'Configuracio incompleta (GH_PAT i REVIEWS_GIST_ID o GIST_ID).'
      })
    };
  }

  if (!adminKey) {
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        error: 'admin_not_configured',
        message: 'Falta configurar REVIEWS_ADMIN_KEY a Netlify.'
      })
    };
  }

  const providedAdminKey = getAdminKeyFromEvent(event);
  if (!providedAdminKey || providedAdminKey !== adminKey) {
    return {
      statusCode: 401,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'unauthorized', message: 'Clau admin incorrecta.' })
    };
  }

  const getRes = await ghRequest('GET', `/gists/${gistId}`);
  if (getRes.status !== 200) {
    return {
      statusCode: 502,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'gist_read_error', message: 'No s\'ha pogut llegir reviews.json.' })
    };
  }

  const raw = getRes.data.files?.['reviews.json']?.content || '[]';
  const reviews = parseReviews(raw);

  if (event.httpMethod === 'GET') {
    const pending = reviews.filter((r) => getReviewStatus(r) === 'pending');
    const approved = reviews.filter((r) => getReviewStatus(r) === 'approved').length;
    const rejected = reviews.filter((r) => getReviewStatus(r) === 'rejected').length;

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        ok: true,
        counters: {
          pending: pending.length,
          approved,
          rejected,
          total: reviews.length
        },
        pending
      })
    };
  }

  if (event.httpMethod === 'PATCH') {
    let body = {};
    try { body = JSON.parse(event.body || '{}'); } catch {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'invalid_json', message: 'Cos JSON invalid.' })
      };
    }

    const reviewId = Number(body.id);
    const action = sanitize(body.action).toLowerCase();

    if (!Number.isFinite(reviewId)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'invalid_id', message: 'Has d\'enviar un id numeric valid.' })
      };
    }

    if (!['approve', 'reject', 'delete'].includes(action)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'invalid_action', message: 'Action valida: approve, reject o delete.' })
      };
    }

    const idx = reviews.findIndex((r) => Number(r.id) === reviewId);
    if (idx === -1) {
      return {
        statusCode: 404,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'not_found', message: 'No existeix cap comentari amb aquest id.' })
      };
    }

    let updatedReviews = reviews;
    if (action === 'delete') {
      updatedReviews = reviews.filter((r) => Number(r.id) !== reviewId);
    } else {
      const approved = action === 'approve';
      updatedReviews = [...reviews];
      updatedReviews[idx] = {
        ...updatedReviews[idx],
        approved,
        status: approved ? 'approved' : 'rejected',
        moderatedAt: new Date().toISOString()
      };
    }

    const patchRes = await ghRequest('PATCH', `/gists/${gistId}`, {
      files: { 'reviews.json': { content: serializeForWrite(updatedReviews) } }
    });

    if (patchRes.status !== 200) {
      return {
        statusCode: 502,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'gist_write_error', message: 'No s\'han pogut guardar els canvis.' })
      };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ ok: true, id: reviewId, action })
    };
  }

  return {
    statusCode: 405,
    headers: CORS_HEADERS,
    body: JSON.stringify({ error: 'method_not_allowed' })
  };
};
