const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    throw new Error('Missing GMAIL_USER or GMAIL_APP_PASSWORD');
  }

  return nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD
    }
  });
}

function getLatestNewsletterFile() {
  const outputDir = path.join(__dirname, '../output');
  const files = fs.readdirSync(outputDir)
    .filter((f) => /^newsletter-\d{4}-\d{2}\.html$/.test(f))
    .sort((a, b) => b.localeCompare(a));

  if (!files.length) {
    throw new Error('No newsletter-YYYY-MM.html found in newsletter/output');
  }

  return files[0];
}

function personalizeNewsletter(html, name, email, siteUrl) {
  const firstName = (name || '').split(' ')[0] || 'amic';
  const unsubscribeUrl = `${siteUrl}/.netlify/functions/unsubscribe?email=${encodeURIComponent(email)}`;

  return html
    .replace(/\{\{NAME\}\}/g, firstName)
    .replace(/\{\{UNSUBSCRIBE_URL\}\}/g, unsubscribeUrl);
}

async function main() {
  const targetEmail = process.argv[2];
  const targetName = process.argv[3] || 'amic';
  const siteUrl = process.env.SITE_URL || 'https://www.frolesti.cat';

  if (!targetEmail) {
    console.error('Usage: node newsletter/scripts/send-single.js <email> [name]');
    process.exit(1);
  }

  const transporter = createTransporter();
  const latestFile = getLatestNewsletterFile();
  const htmlPath = path.join(__dirname, '../output', latestFile);
  const htmlTemplate = fs.readFileSync(htmlPath, 'utf8');
  const personalizedHtml = personalizeNewsletter(htmlTemplate, targetName, targetEmail, siteUrl);

  await transporter.sendMail({
    from: `"frolesti — Butlleti" <${process.env.GMAIL_USER}>`,
    to: targetEmail,
    subject: '🗞️ Benvingut/da! Et compartim l’ultim butlleti',
    html: personalizedHtml,
    text: `Gracies per subscriure't! Llegeix l'ultim butlleti a ${siteUrl}/newsletter/output/`
  });

  console.log(`✅ Welcome newsletter sent to ${targetEmail} using ${latestFile}`);
}

if (require.main === module) {
  main().catch((err) => {
    console.error('❌ send-single failed:', err.message);
    process.exit(1);
  });
}
