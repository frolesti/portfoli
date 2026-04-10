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

// Enviar email a un subscriptor
async function sendEmail(transporter, subscriber, htmlTemplate, subject) {
  try {
    await transporter.sendMail({
      from: `"frolesti — Butlletí" <${process.env.GMAIL_USER}>`,
      to: subscriber.email,
      subject: subject,
      html: htmlTemplate,
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

    // Llegir l'HTML generat del mes actual
    const date = new Date();
    const monthName = date.toLocaleDateString('ca-ES', { month: 'long' });
    const year = date.getFullYear();
    const filename = `newsletter-${monthName}-${year}.html`;
    const htmlPath = path.join(__dirname, `../output/${filename}`);
    
    if (!fs.existsSync(htmlPath)) {
      console.error('❌ Butlletí no trobat!');
      console.log(`💡 Executa primer: npm run generate`);
      console.log(`🔍 Buscant: ${filename}`);
      process.exit(1);
    }

    const html = fs.readFileSync(htmlPath, 'utf8');

    // Crear subject amb la data actual
    const monthYear = date.toLocaleDateString('ca-ES', { 
      month: 'long', 
      year: 'numeric' 
    });
    const subject = `🗞️ Butlletí - ${monthYear}`;

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
