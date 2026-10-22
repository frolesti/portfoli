const nodemailer = require('nodemailer');

const SITE = 'https://www.frolesti.cat';
const invitations = [
  {
    to: 'secretaria@aes-so.org',
    subject: 'Ens deixeu una ressenya sobre la calculadora de protecci\u00f3 solar?',
    client: 'aesso',
    token: 'aesso-3d9a8c7e21',
    project: 'projecte-aesso',
    paragraphs: [
      'Hola,',
      'Us volia demanar si em podr\u00edeu dedicar un parell de minuts per deixar una breu ressenya sobre la calculadora de protecci\u00f3 solar que hem desenvolupat per a AESSO.',
      'Amb unes quantes l\u00ednies sobre com ha anat la col\u00b7laboraci\u00f3 i si l\'eina us resulta \u00fatil ja n\'hi ha prou. El vostre nom i la ressenya es mostraran al meu web, vinculats a AESSO i al projecte.'
    ]
  },
  {
    to: 'anna.munoz@altamedicalservices.com',
    subject: 'Em deixes una ressenya sobre la nostra col\u00b7laboraci\u00f3?',
    client: 'alta-medical-services',
    token: 'alta-7c5d2f41b9',
    project: 'projecte-odc',
    paragraphs: [
      'Hola, Anna,',
      'Et volia demanar si em podries dedicar un parell de minuts per deixar una breu ressenya sobre la nostra col\u00b7laboraci\u00f3 en l\'adaptaci\u00f3 d\'Open Data Capture.',
      'Amb unes quantes l\u00ednies sobre com ha anat treballar plegats i qu\u00e8 t\'ha resultat \u00fatil ja n\'hi ha prou. El teu nom i la ressenya es mostraran al meu web, vinculats a Alta i al projecte.'
    ]
  }
];

function buildMessages(sender) {
  return invitations.map((invitation) => {
    const url = new URL('/review.html', SITE);
    url.search = new URLSearchParams({ client: invitation.client, token: invitation.token, project: invitation.project });
    return {
      from: { name: 'frolesti', address: sender },
      to: invitation.to,
      subject: invitation.subject,
      text: [...invitation.paragraphs, 'Deixar la ressenya:\n' + url.href, 'Moltes gr\u00e0cies per la confian\u00e7a!', 'Froil\u00e1n \u00b7 frolesti'].join('\n\n')
    };
  });
}

async function verifyPublishedForm() {
  const responses = await Promise.all(['/review.html', '/assets/client-review.js', '/assets/review-projects.js', '/.netlify/functions/reviews'].map((path) => fetch(SITE + path)));
  if (responses.some((response) => !response.ok)) throw new Error('El formulari publicat no esta disponible. No s\'ha enviat res.');
  const [html, script, projects, reviews] = await Promise.all(responses.map((response) => response.text()));
  if (/clientReviewPreview|client-review-logo/.test(html + script) || !html.includes('review-projects.js') || !script.includes('projectId:') || !projects.includes('projecte-odc') || !Array.isArray(JSON.parse(reviews))) {
    throw new Error('El web encara no te el formulari aprovat. No s\'ha enviat res.');
  }
  const response = await fetch(SITE + '/.netlify/functions/reviews', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ companyId: invitations[0].client, clientToken: invitations[0].token, projectId: 'projecte-odc', message: '' })
  });
  const result = await response.json();
  if (response.status !== 400 || result.error !== 'invalid_project') throw new Error('La funcio de ressenyes encara no esta actualitzada. No s\'ha enviat res.');
}

async function main() {
  if (process.argv[2] !== '--send') throw new Error('Cal --send per enviar les dues invitacions aprovades.');
  const sender = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!sender || !password) throw new Error('Falta configurar Gmail.');
  await verifyPublishedForm();
  const transporter = nodemailer.createTransport({ service: 'gmail', auth: { user: sender, pass: password } });
  for (const message of buildMessages(sender)) {
    const result = await transporter.sendMail(message);
    if (!result.accepted?.includes(message.to) || result.rejected?.length) throw new Error('Enviament no confirmat per a ' + message.to + '. No repetir el lot automaticament.');
    console.log('Invitacio acceptada pel servidor de correu: ' + message.to + ' (' + result.messageId + ')');
  }
}

module.exports = { buildMessages };

if (require.main === module) {
  main().catch((error) => {
    console.error(error.message);
    process.exitCode = 1;
  });
}