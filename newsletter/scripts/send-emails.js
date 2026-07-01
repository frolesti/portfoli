const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

// Carregar la llista de subscriptors
function loadSubscribers() {
  const subscribersPath = path.join(__dirname, 'subscribers.json');
  
  if (!fs.existsSync(subscribersPath)) {
    console.error('❌ Fitxer subscribers.json no trobat!');
    console.log('💡 Crea el fitxer scripts/subscribers.json amb la llista de subscriptors');
    process.exit(1);
  }

  return JSON.parse(fs.readFileSync(subscribersPath, 'utf8'));
}

// Configurar el transportador de Gmail
function createTransporter() {
  if (!process.env.GMAIL_USER || !process.env.GMAIL_APP_PASSWORD) {
    console.error('❌ Variables d\'entorn no configurades!');
    console.log('💡 Configura GMAIL_USER i GMAIL_APP_PASSWORD');
    process.exit(1);
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
  if (!fs.existsSync(outputDir)) {
    console.error('❌ Carpeta newsletter/output no trobada!');
    process.exit(1);
  }

  const files = fs.readdirSync(outputDir)
    .filter((f) => /^newsletter-\d{4}-\d{2}\.html$/.test(f))
    .sort((a, b) => b.localeCompare(a));

  if (!files.length) {
    console.error('❌ No s\'ha trobat cap newsletter generada!');
    console.log('💡 Executa primer: npm run blog:build');
    process.exit(1);
  }

  return files[0];
}

function monthLabelFromFile(filename) {
  const match = filename.match(/^newsletter-(\d{4})-(\d{2})\.html$/);
  if (!match) return filename;

  const year = match[1];
  const month = match[2];
  const labels = {
    '01': 'gener', '02': 'febrer', '03': 'marc', '04': 'abril',
    '05': 'maig', '06': 'juny', '07': 'juliol', '08': 'agost',
    '09': 'setembre', '10': 'octubre', '11': 'novembre', '12': 'desembre'
  };

  return `${labels[month] || month} ${year}`;
}

// Enviar email a un subscriptor
async function sendEmail(transporter, subscriber, htmlTemplate, subject) {
  try {
    // Personalitzar el nom del subscriptor
    const firstName = (subscriber.name || '').split(' ')[0] || 'farmaciola';
    const unsubscribeUrl = `https://frolesti-saas.netlify.app/.netlify/functions/unsubscribe?email=${encodeURIComponent(subscriber.email)}`;
    const personalizedHtml = htmlTemplate
      .replace('{{NAME}}', firstName)
      .replace('{{UNSUBSCRIBE_URL}}', unsubscribeUrl);

    await transporter.sendMail({
      from: `"frolesti — Butlletí" <${process.env.GMAIL_USER}>`,
      to: subscriber.email,
      subject: subject,
      html: personalizedHtml,
      // Text pla com a alternativa
      text: 'Aquest butlletí requereix un client de correu amb suport HTML.'
    });
    
    console.log(`✅ Enviat a ${subscriber.name} (${subscriber.email})`);
    return true;
  } catch (error) {
    console.error(`❌ Error enviant a ${subscriber.email}:`, error.message);
    return false;
  }
}

// Funció principal
async function main() {
  try {
    console.log('📧 Iniciant enviament de butlletins...\n');

    // Carregar subscriptors
    const subscribers = loadSubscribers();
    console.log(`📋 ${subscribers.length} subscriptors carregats\n`);

    // Llegir l'ultima newsletter generada (format newsletter-YYYY-MM.html)
    const filename = getLatestNewsletterFile();
    const htmlPath = path.join(__dirname, `../output/${filename}`);
    
    if (!fs.existsSync(htmlPath)) {
      console.error('❌ Butlletí no trobat!');
      console.log(`💡 Executa primer: npm run blog:build`);
      console.log(`🔍 Buscant: ${filename}`);
      process.exit(1);
    }

    const html = fs.readFileSync(htmlPath, 'utf8');

    // Crear subject a partir del fitxer seleccionat
    const subject = `🗞️ Butlleti - ${monthLabelFromFile(filename)}`;

    // Configurar transporter
    const transporter = createTransporter();

    // Enviar a cada subscriptor amb un petit retard entre enviaments
    let sent = 0;
    let failed = 0;

    for (const subscriber of subscribers) {
      const success = await sendEmail(transporter, subscriber, html, subject);
      
      if (success) {
        sent++;
      } else {
        failed++;
      }

      // Petit retard per evitar límits de Gmail (500/dia)
      await new Promise(resolve => setTimeout(resolve, 1000));
    }

    console.log(`\n📊 Resum d'enviament:`);
    console.log(`  ✅ Enviats: ${sent}`);
    console.log(`  ❌ Errors: ${failed}`);
    console.log(`  📧 Total: ${subscribers.length}`);

  } catch (error) {
    console.error('❌ Error enviant emails:', error);
    process.exit(1);
  }
}

// Executar si es crida directament
if (require.main === module) {
  main();
}

module.exports = { main, sendEmail };
