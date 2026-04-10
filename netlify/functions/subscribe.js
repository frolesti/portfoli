// netlify/functions/subscribe.js
// Gestiona subscripcions al butlletí. Emmagatzema a un GitHub Gist privat.

const https = require('https');

const CORS_HEADERS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Content-Type': 'application/json'
};

// ── helpers ──────────────────────────────────────────────

function ghRequest(method, path, body) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${process.env.GH_PAT}`,
        'User-Agent': 'frolesti-newsletter',
        'Accept': 'application/vnd.github+json',
        'Content-Type': 'application/json'
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: JSON.parse(data) });
        } catch {
          resolve({ status: res.statusCode, data });
        }
      });
    });

    req.on('error', reject);
    if (body) req.write(JSON.stringify(body));
    req.end();
  });
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ── handler ──────────────────────────────────────────────

exports.handler = async (event) => {
  // CORS preflight
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: CORS_HEADERS };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  try {
    const { name, email } = JSON.parse(event.body || '{}');

    // Validació
    if (!name || !email || !isValidEmail(email)) {
      return {
        statusCode: 400,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'invalid_input', message: 'Nom i email vàlid obligatoris.' })
      };
    }

    const gistId = process.env.GIST_ID;
    if (!gistId || !process.env.GH_PAT) {
      throw new Error('Missing GIST_ID or GH_PAT env vars');
    }

    // 1. Llegir subscriptors actuals del Gist
    const gist = await ghRequest('GET', `/gists/${gistId}`);
    if (gist.status !== 200) {
      throw new Error(`Gist read failed (${gist.status})`);
    }

    const fileContent = gist.data.files['subscribers.json']?.content;
    const subscribers = fileContent ? JSON.parse(fileContent) : [];

    // 2. Comprovar duplicats
    if (subscribers.some((s) => s.email.toLowerCase() === email.toLowerCase())) {
      return {
        statusCode: 409,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'already_subscribed', message: 'Ja estàs subscrit al butlletí!' })
      };
    }

    // 3. Afegir nou subscriptor
    subscribers.push({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      subscriptionDate: new Date().toISOString().split('T')[0]
    });

    // 4. Actualitzar el Gist
    const update = await ghRequest('PATCH', `/gists/${gistId}`, {
      files: {
        'subscribers.json': {
          content: JSON.stringify(subscribers, null, 2)
        }
      }
    });

    if (update.status !== 200) {
      throw new Error(`Gist update failed (${update.status})`);
    }

    console.log(`✅ Nou subscriptor: ${name} (${email}). Total: ${subscribers.length}`);

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({ success: true, message: 'Subscripció confirmada!' })
    };

  } catch (err) {
    console.error('Subscribe error:', err);
    return {
      statusCode: 500,
      headers: CORS_HEADERS,
      body: JSON.stringify({ error: 'server_error', message: 'Error intern. Torna-ho a provar.' })
    };
  }
};
