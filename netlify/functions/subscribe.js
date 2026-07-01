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

function ghRequest(method, path, body, tokenOverride) {
  return new Promise((resolve, reject) => {
    const token = tokenOverride || process.env.GH_PAT;
    const options = {
      hostname: 'api.github.com',
      path,
      method,
      headers: {
        'Authorization': `Bearer ${token}`,
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

async function dispatchWelcomeEmailWorkflow(name, email) {
  const token = process.env.GH_ACTIONS_TOKEN || process.env.GH_PAT;
  const repo = process.env.GH_REPO || 'frolesti/portfoli';
  const workflowId = process.env.GH_WELCOME_WORKFLOW_ID || 'send-latest-to-subscriber.yml';
  const ref = process.env.GH_WELCOME_WORKFLOW_REF || 'main';

  if (!token) {
    return { dispatched: false, reason: 'missing_actions_token' };
  }

  const [owner, repoName] = repo.split('/');
  if (!owner || !repoName) {
    return { dispatched: false, reason: 'invalid_repo' };
  }

  const dispatch = await ghRequest(
    'POST',
    `/repos/${owner}/${repoName}/actions/workflows/${workflowId}/dispatches`,
    {
      ref,
      inputs: {
        name: name.trim(),
        email: email.trim().toLowerCase()
      }
    },
    token
  );

  if (dispatch.status !== 204) {
    return {
      dispatched: false,
      reason: 'dispatch_failed',
      status: dispatch.status,
      details: dispatch.data
    };
  }

  return { dispatched: true, workflowId, repo };
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

    // 2. Comprovar duplicats per email (llista única)
    const emailLower = email.toLowerCase();
    const isDuplicate = subscribers.some((s) => s.email.toLowerCase() === emailLower);
    if (isDuplicate) {
      return {
        statusCode: 409,
        headers: CORS_HEADERS,
        body: JSON.stringify({ error: 'already_subscribed', message: 'Ja estàs subscrit al butlletí!' })
      };
    }

    // 3. Afegir nou subscriptor
    subscribers.push({
      name: name.trim(),
      email: emailLower.trim(),
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

    let welcomeResult = { dispatched: false, reason: 'not_attempted' };
    try {
      welcomeResult = await dispatchWelcomeEmailWorkflow(name.trim(), emailLower.trim());
      if (welcomeResult.dispatched) {
        console.log(`🚀 Workflow de benvinguda llançat per a ${emailLower}`);
      } else {
        console.warn(`⚠️ Alta correcta pero sense dispatch de workflow (${welcomeResult.reason})`);
      }
    } catch (workflowErr) {
      console.error('⚠️ Alta correcta pero error disparant workflow de benvinguda:', workflowErr.message);
      welcomeResult = { dispatched: false, reason: 'dispatch_exception' };
    }

    return {
      statusCode: 200,
      headers: CORS_HEADERS,
      body: JSON.stringify({
        success: true,
        message: 'Subscripcio confirmada!',
        welcomeEmailDispatch: welcomeResult
      })
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
