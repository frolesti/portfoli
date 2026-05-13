// Envia el butlletí actual a un únic correu de prova.
// Ús:
//   $env:GMAIL_USER="..."; $env:GMAIL_APP_PASSWORD="..."; node newsletter/scripts/send-test.js frolesti4@gmail.com
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

async function main() {
  const target = process.argv[2] || 'frolesti4@gmail.com';

  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Falten GMAIL_USER i/o GMAIL_APP_PASSWORD a l\'entorn.');
    process.exit(1);
  }

  const date = new Date();
  const monthName = date.toLocaleDateString('ca-ES', { month: 'long' });
  const year = date.getFullYear();
  const filename = `newsletter-${monthName}-${year}.html`;
  const htmlPath = path.join(__dirname, `../output/${filename}`);

  if (!fs.existsSync(htmlPath)) {
    console.error(`❌ No trobo ${filename}. Executa primer: node newsletter/scripts/generate-newsletter.js`);
    process.exit(1);
  }

  let html = fs.readFileSync(htmlPath, 'utf8');
  const unsubscribeUrl = `https://frolesti-saas.netlify.app/.netlify/functions/unsubscribe?email=${encodeURIComponent(target)}`;
  html = html.replace('{{NAME}}', 'farmaciola').replace('{{UNSUBSCRIBE_URL}}', unsubscribeUrl);

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: process.env.GMAIL_USER, pass: process.env.GMAIL_APP_PASSWORD }
  });

  const monthYear = date.toLocaleDateString('ca-ES', { month: 'long', year: 'numeric' });
  await transporter.sendMail({
    from: `"frolesti — Butlletí (PROVA)" <${process.env.GMAIL_USER}>`,
    to: target,
    subject: `🧪 [PROVA] Butlletí - ${monthYear}`,
    html,
    text: 'Aquest butlletí requereix un client de correu amb suport HTML.'
  });

  console.log(`✅ Correu de prova enviat a ${target}`);
  console.log(`🔗 Enllaç de baixa inclòs: ${unsubscribeUrl}`);
}

main().catch(err => { console.error('❌', err.message); process.exit(1); });
