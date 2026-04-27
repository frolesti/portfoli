// netlify/functions/unsubscribe.js
// GET /.netlify/functions/unsubscribe?email=xxx
// Elimina l'email del Gist de subscriptors i retorna una pàgina de confirmació.

const https = require('https');

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

function htmlPage(title, heading, message, color) {
  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — frolesti</title>
  <style>
    *{margin:0;padding:0;box-sizing:border-box}
    body{font-family:Georgia,'Times New Roman',serif;background:#f2f0eb;color:#1a1a1a;min-height:100vh;display:flex;align-items:center;justify-content:center;padding:40px 20px}
    .card{background:#fff;border:1px solid #d4d0c8;max-width:480px;width:100%;padding:48px 40px;text-align:center}
    .logo{font-size:28px;font-weight:700;letter-spacing:-.5px;margin-bottom:32px}
    .icon{font-size:40px;margin-bottom:16px;color:${color}}
    h1{font-size:22px;font-weight:700;margin-bottom:12px}
    p{font-size:15px;line-height:1.65;color:#666;margin-bottom:20px}
    a{color:#c75530;text-decoration:none;border-bottom:1px solid #c75530}
  </style>
</head>
<body>
  <div class="card">
    <div class="logo">frolesti</div>
    <div class="icon">${heading}</div>
    <h1>${title}</h1>
    <p>${message}</p>
    <p><a href="https://frolesti-saas.netlify.app">Tornar al portafolis</a></p>
  </div>
</body>
</html>`;
}

exports.handler = async (event) => {
  const email = (event.queryStringParameters || {}).email || '';

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return {
      statusCode: 400,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage(
        'Enllaç invàlid',
        '⚠️',
        'L\'enllaç de baixa no és vàlid. Si creus que és un error, respon a qualsevol butlletí i t\'ajudarem.',
        '#e8a000'
      )
    };
  }

  const gistId = process.env.GIST_ID;
  if (!gistId || !process.env.GH_PAT) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage('Error intern', '❌', 'No s\'ha pogut processar la sol·licitud. Torna-ho a intentar més tard.', '#c75530')
    };
  }

  try {
    // 1. Llegir subscriptors actuals
    const gist = await ghRequest('GET', `/gists/${gistId}`);
    if (gist.status !== 200) throw new Error(`Gist read failed (${gist.status})`);

    const fileContent = gist.data.files['subscribers.json']?.content;
    const subscribers = fileContent ? JSON.parse(fileContent) : [];

    const normalizedEmail = email.toLowerCase().trim();
    const existed = subscribers.some(s => s.email.toLowerCase() === normalizedEmail);

    if (!existed) {
      // Ja no estava — resposta amigable igualment
      return {
        statusCode: 200,
        headers: { 'Content-Type': 'text/html; charset=utf-8' },
        body: htmlPage(
          'Ja estaves donat de baixa',
          '✅',
          'Aquest correu ja no apareix a la llista del butlletí. No rebràs més missatges.',
          '#2e7d32'
        )
      };
    }

    // 2. Eliminar subscriptor
    const updated = subscribers.filter(s => s.email.toLowerCase() !== normalizedEmail);

    const patch = await ghRequest('PATCH', `/gists/${gistId}`, {
      files: {
        'subscribers.json': {
          content: JSON.stringify(updated, null, 2)
        }
      }
    });

    if (patch.status !== 200) throw new Error(`Gist update failed (${patch.status})`);

    console.log(`✅ Baixa processada: ${email}. Subscriptors restants: ${updated.length}`);

    return {
      statusCode: 200,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage(
        'Baixa confirmada',
        '👋',
        'T\'hem eliminat de la llista del butlletí. No rebràs més correus de frolesti. Gràcies per haver-hi estat!',
        '#2e7d32'
      )
    };

  } catch (err) {
    console.error('Unsubscribe error:', err);
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/html; charset=utf-8' },
      body: htmlPage('Error intern', '❌', 'No s\'ha pogut processar la sol·licitud. Torna-ho a intentar més tard.', '#c75530')
    };
  }
};
