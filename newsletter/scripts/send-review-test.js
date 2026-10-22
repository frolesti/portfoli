const nodemailer = require('nodemailer');

async function main() {
  const email = process.env.GMAIL_USER;
  const password = process.env.GMAIL_APP_PASSWORD;
  if (!email || !password) throw new Error('Falta configurar el compte de correu de prova.');
  const site = 'https://www.frolesti.cat';
  const invite = site + '/review.html?client=prova-interna&token=prova-interna-20261022';
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: { user: email, pass: password }
  });
  const result = await transporter.sendMail({
    from: { name: 'frolesti', address: email },
    to: email,
    subject: '[PROVA] Invitació per deixar una ressenya · frolesti',
    text: [
      'Hola!',
      '',
      'Aquest correu és una prova interna del circuit de ressenyes. Només s’envia al mateix compte remitent, no als clients ni als subscriptors.',
      '',
      'Obre el formulari, escriu un nom i un comentari de prova, previsualitza’l i envia’l:',
      invite,
      '',
      'La prova quedarà pendent de moderació i no es podrà publicar al web.',
      '',
      'Gestor de ressenyes i previsualització:',
      site + '/admin/comentaris',
      '',
      'Per moderar cal tenir configurada la clau d’administració. Un cop dins, trobaràs l’enviament a Pendents o Proves internes i el podràs esborrar.',
      '',
      'No és una invitació real a valorar cap client.',
      '',
      'frolesti'
    ].join('\n')
  });
  if (!result.accepted?.length || result.rejected?.length) throw new Error('El servidor de correu no ha acceptat la prova.');
  console.log('Correu de prova acceptat pel servidor de correu. No s’ha contactat cap client ni subscriptor.');
}

if (require.main === module) {
  main().catch(() => {
    console.error('No s’ha pogut enviar el correu de prova. Revisa la configuració de Gmail.');
    process.exitCode = 1;
  });
}