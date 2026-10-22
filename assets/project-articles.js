(function attachProjectArticles(global) {
  const projects = {
    'projecte-extensions': {
      tag: 'Extensions de navegador',
      title: "Extensions de canvi d'idioma",
      lead: 'Obre els webs en català, euskera o gallec automàticament, quan hi ha una versió disponible en la teva llengua.',
      status: 'Extensions per a Chromium i Firefox; altres empaquetats disponibles al projecte.',
      features: [
        { title: 'Detecció', desc: 'Metadades alternate hreflang i regles específiques de webs multilingües.' },
        { title: 'Canvi automàtic', desc: 'Navegació a la variant detectada i interruptor per desactivar l’extensió.' },
        { title: 'Tres llengües', desc: 'Català, euskera i gallec des d’una base de codi compartida.' }
      ],
      stack: ['JavaScript', 'WebExtensions API', 'Internacionalització', 'PowerShell'],
      architecture: ['Configuració de variants i compilació compartides.', 'Detecció al navegador, sense un servei propi de decisió de llengua.'],
      privacy: ['La detecció es fa sobre la pàgina visitada al navegador.'],
      limits: ['La cobertura depèn de les metadades i les regles de cada web.', 'Empaquetar per a un navegador no acredita publicació a la seva botiga.', 'Les traduccions a l’euskera i al gallec poden contenir errors.'],
      links: [{ label: 'Codi i variants', url: 'https://github.com/frolesti/language-redirector-extension' }]
    },
    'projecte-sepe': {
      tag: 'Automatització de consultes', title: 'Bot Cita SEPE',
      lead: 'Consulta la disponibilitat de cita al SEPE sense haver de repetir la cerca manualment i rep avisos per correu.',
      status: 'Eina web dependent del servei de cita prèvia del SEPE.',
      features: [
        { title: 'Filtres', desc: 'Document, codi postal, tràmit i modalitat de cita.' },
        { title: 'Consultes periòdiques', desc: 'Sessions HTTP per comprovar disponibilitat.' },
        { title: 'Avisos', desc: 'Correu electrònic quan el servei SMTP està configurat.' }
      ],
      stack: ['Python', 'Flask', 'requests', 'Gunicorn', 'SMTP', 'Docker', 'supervisord'],
      architecture: ['Web i procés de treball separats sota supervisord.', 'El motor HTTP actual substitueix l’automatització amb Selenium del codi anterior.'],
      privacy: ['La cerca necessita dades personals, inclosos document i contacte.', 'Les dades es processen al servei del bot i a les consultes al SEPE; no és una eina exclusivament local.'],
      limits: ['No garanteix disponibilitat ni reserva de cites.', 'Canvis als endpoints, CAPTCHA o controls anti-bot poden interrompre la cerca.', 'Els avisos requereixen configuració i disponibilitat del correu.'],
      links: [{ label: 'Obrir el bot', url: 'https://cita-sepe.duckdns.org/' }]
    },
    'projecte-alerta': {
      tag: 'Dades públiques i habitatge', title: 'Alerta Desnona',
      lead: 'Situa en un mapa les publicacions del BOE sobre subhastes i habitatge, amb filtres i avisos de novetats.',
      status: 'Projecte pilot amb integració mòbil Capacitor. Demo anterior no disponible en la revisió; codi públic consultable.',
      features: [
        { title: 'Mapa', desc: 'Leaflet amb agrupació de punts, filtres territorials i detall dels registres.' },
        { title: 'Dades', desc: 'Captura, normalització d’adreces i geocodificació de publicacions oficials.' },
        { title: 'Avisos', desc: 'Web Push, Firebase Cloud Messaging i correu, segons plataforma i configuració.' },
        { title: 'Idiomes', desc: 'Català, castellà, gallec i euskera.' }
      ],
      stack: ['React 19', 'TypeScript', 'Vite', 'Leaflet', 'Express', 'SQLite / better-sqlite3', 'node-cron', 'Web Push', 'Firebase Cloud Messaging', 'Capacitor', 'Nodemailer', 'API compatible amb OpenAI', 'Photon'],
      architecture: ['Client React i API Express amb SQLite.', 'Tasques programades per actualitzar dades i distribuir avisos.', 'Normalització amb un proveïdor de model configurable i geocodificació amb Photon.'],
      privacy: ['Les publicacions oficials també poden contenir dades personals que cal minimitzar.', 'Les subscripcions requereixen contacte o identificadors de notificació.'],
      limits: ['Una subhasta judicial no equival a un desnonament confirmat.', 'La ubicació pot ser aproximada: cal consultar el document oficial.', 'Les actualitzacions són periòdiques, no una garantia de dades en temps real.', 'Capacitor no acredita publicació a les botigues mòbils.'],
      links: [{ label: 'Codi i documentació', url: 'https://github.com/frolesti/alerta-desnona' }]
    },
    'projecte-stremio': {
      tag: 'Complement audiovisual', title: 'Stremio en Català',
      lead: 'Catàleg de pel·lícules i sèries amb referències de disponibilitat en català dins de Stremio.',
      status: 'Complement web per a Stremio.',
      features: [
        { title: 'Catàleg', desc: 'Metadades i recursos compatibles amb l’SDK de Stremio.' },
        { title: 'Metadades', desc: 'Integració amb TMDB i dades del catàleg del complement.' },
        { title: 'Instal·lació', desc: 'Manifest accessible per afegir el complement a Stremio.' }
      ],
      stack: ['Node.js', 'Express', 'stremio-addon-sdk', 'TMDB API', 'Axios', 'Vercel'],
      architecture: ['Aplicació Express exportada com a funció a Vercel.', 'Memòria cau de CDN per a respostes de catàleg i endpoint de comprovació del servei.'],
      privacy: ['Les consultes passen pel servei del complement i pels proveïdors de metadades utilitzats.'],
      limits: ['No garanteix un catàleg exhaustiu ni disponibilitat actualitzada a totes les plataformes.', 'No substitueix subscripcions ni drets d’accés audiovisuals.', 'El catàleg estàtic s’actualitza amb els desplegaments.'],
      links: [{ label: 'Instal·lar el complement', url: 'https://stremio-en-catala.vercel.app/' }]
    },
    'projecte-odc': {
      tag: 'Plataforma clínica de codi obert', title: 'Open Data Capture',
      lead: 'Adaptem la recollida i el seguiment de dades clíniques a les necessitats d’Alta Health Services.',
      role: 'Adaptació sobre el projecte de Douglas Neuroinformatics Platform; no autoria de la plataforma original.',
      status: 'Col·laboració en curs; demo pública independent de l’entorn clínic.',
      features: [
        { title: 'Instruments', desc: 'Formularis i tasques interactives per a recollida de dades clíniques.' },
        { title: 'Administració', desc: 'Avaluacions presencials i assignacions remotes a través d’un gateway.' },
        { title: 'Explotació', desc: 'Visualització i exportació de dades sota demanda.' },
        { title: 'Adaptació al client', desc: 'Formularis, validacions, seguiments i presentació de dades per a Alta Health Services.' }
      ],
      stack: ['TypeScript', 'React', 'Node.js', 'Docker Compose', 'WebAssembly', 'JWT', 'API REST'],
      architecture: ['Aplicació web, API i gateway per a assignacions remotes.', 'Construcció d’instruments al navegador amb WebAssembly i runtime d’instruments.', 'Projecte original sota llicència Apache-2.0.'],
      privacy: ['Autenticació JWT i permisos granulars al projecte original.', 'La demo utilitza dades simulades, no dades de l’estudi.', 'No es publiquen configuracions internes ni informació clínica.'],
      limits: ['Les capacitats generals no acrediten la configuració concreta de cada desplegament.', 'La fitxa no declara una certificació clínica o normativa.'],
      links: [{ label: 'Web i documentació', url: 'https://opendatacapture.org/' }, { label: 'Demo amb dades simulades', url: 'https://demo.opendatacapture.org/' }, { label: 'Projecte original', url: 'https://github.com/DouglasNeuroInformatics/OpenDataCapture' }]
    },
    'projecte-aesso': {
      tag: 'Calculadora web i connector WordPress', title: 'Calculadora de protecció solar per a AESSO',
      lead: 'Ajuda les empreses associades a AESSO a calcular la protecció solar d’un vidre i generar un informe del resultat.',
      status: 'Integrada al web d’AESSO amb control d’accés.',
      features: [
        { title: 'Càlcul', desc: 'Paràmetres del vidre i de la protecció solar i aplicació de les fórmules implementades.' },
        { title: 'Accés d’associats', desc: 'Validació a Brevo per llista o atribut d’empresa associada.' },
        { title: 'Informe', desc: 'Vista d’impressió per desar el resultat com a PDF.' },
        { title: 'Integració', desc: 'Shortcode i configuració al panell de WordPress.' }
      ],
      stack: ['HTML', 'CSS', 'JavaScript', 'PHP', 'WordPress', 'API REST', 'Brevo API', 'HMAC', '@media print'],
      architecture: ['Classes separades per a Brevo, REST, shortcode i administració.', 'Endpoint /wp-json/aesso/v1/validate i cookie HMAC amb vigència de set dies.', 'Informe mitjançant impressió del navegador, sense conversió externa a PDF.'],
      privacy: ['El correu es contrasta amb el CRM de l’entitat.', 'La signatura de la cookie controla l’accés; no xifra les dades.'],
      limits: ['L’abast és EN ISO 52022-1; no s’anuncia el mètode avançat EN ISO 52022-3.', 'L’exemple documentat retorna g_tot = 0,10; no és una certificació general.', 'Cal seleccionar la destinació PDF al diàleg d’impressió.'],
      links: [{ label: 'Obrir la calculadora', url: 'https://aes-so.org/recursos/calculadora-del-factor-solar/' }]
    },
    'projecte-bars': {
      tag: 'Aplicació mòbil i web', title: 'troBar',
      lead: 'Locals on veure partits del FC Barcelona, amb mapa, fitxes de locals i informació de partits.',
      status: 'En desenvolupament; sense confirmació de publicació a les botigues.',
      features: [
        { title: 'Mapa i ubicació', desc: 'Localització de locals i consulta de la seva fitxa.' },
        { title: 'Partits', desc: 'Informació de partits i eines d’actualització de dades.' },
        { title: 'Multiplataforma', desc: 'Base React Native per a Android, iOS i web amb integracions d’autenticació.' }
      ],
      stack: ['React Native', 'React 19', 'Expo', 'TypeScript', 'React Navigation', 'Firebase', 'Firestore', 'Google Maps', 'expo-location', 'Expo Notifications'],
      architecture: ['Scripts i configuracions Expo per plataforma.', 'Dades i autenticació amb Firebase; migracions i validació de Firestore.', 'Google Maps a la versió web.'],
      privacy: ['La geolocalització necessita permís.', 'Els comptes i les dades depenen dels serveis Firebase configurats.'],
      limits: ['Els scripts de compilació i enviament no acrediten publicació a App Store o Google Play.', 'La disponibilitat de partits i locals depèn de les dades del servei.'],
      links: []
    },
    'projecte-aparador': {
      tag: 'Plataforma fotogràfica', title: 'Aparador',
      lead: 'Comparteix un àlbum amb un codi, deixa descarregar les fotos originals i rep donatius opcionals.',
      images: [
        { src: 'assets/img/projects/aparador-album-1.png', alt: 'Aparador: vista de la galeria d’un àlbum.' },
        { src: 'assets/img/projects/aparador-album-2.png', alt: 'Aparador: segona captura de l’àlbum.' }
      ],
      status: 'Versió pilot web en evolució.',
      features: [
        { title: 'Àlbums', desc: 'Compartició per codi d’accés, visor i descàrrega original.' },
        { title: 'Gestió', desc: 'Panell d’àlbums, càrrega i processament d’imatges.' },
        { title: 'Donatius', desc: 'Pagaments opcionals amb Stripe.' },
        { title: 'Cerca semàntica', desc: 'Cerca per text amb embeddings CLIP quan el servei està activat.' },
        { title: 'Cerca facial', desc: 'Detecció YuNet i embeddings SFace, subjectes a activació i consentiment configurats.' },
        { title: 'Idiomes', desc: 'Internacionalització amb next-intl.' }
      ],
      stack: ['Next.js 16', 'React 19', 'TypeScript', 'Tailwind CSS 4', 'Supabase / PostgreSQL', 'pgvector', 'Cloudflare R2', 'Stripe', 'Sharp', 'next-intl', 'Python / FastAPI', 'CLIP', 'OpenCV YuNet / SFace'],
      architecture: ['Next.js App Router amb autenticació Supabase.', 'Objectes fotogràfics a R2 mitjançant l’API compatible amb S3.', 'Processament amb Sharp i enllaços signats.', 'Servei FastAPI; vectors de 512 dimensions per a CLIP i de 128 per a cares, amb índexs HNSW a pgvector.'],
      privacy: ['El codi d’àlbum és un mecanisme de compartició, no una comprovació d’identitat.', 'Comptes, imatges i pagaments impliquen proveïdors externs.', 'La cerca facial té registres d’activació i consentiment; les dades biomètriques requereixen tractament específic.'],
      limits: ['El cost depèn de volums, transferència i condicions dels proveïdors.', 'Les funcions experimentals no s’anuncien com a disponibles a tots els desplegaments.'],
      links: [{ label: 'Obrir la versió pilot', url: 'https://aparador.vercel.app/' }]
    },
    'projecte-base-skills': {
      tag: 'Plantilla de desenvolupament assistit', title: 'Base Skills Repo',
      lead: 'Una base per treballar amb GitHub Copilot amb les regles, el context i els fluxos de cada projecte ben organitzats.',
      status: 'Repositori plantilla.',
      features: [
        { title: 'Context per capes', desc: 'Instruccions globals breus i regles per llenguatge o carpeta.' },
        { title: 'Bootstrap', desc: 'Selecció dels paquets rellevants al projecte.' },
        { title: 'Flux de treball', desc: 'Prompts per planificar, revisar, provar i preparar canvis.' }
      ],
      stack: ['GitHub Copilot', 'Markdown', 'Instruccions per glob', 'Skills', 'Prompts', 'Agents'],
      architecture: ['Plantilla agnòstica al stack, sense runtime d’aplicació propi.', 'Coneixement especialitzat carregat segons tasca i abast dels fitxers.'],
      privacy: ['El tractament del context depèn del producte d’assistència i de la seva configuració.'],
      limits: ['Reduir context és un objectiu, no una mesura garantida d’estalvi.', 'Les instruccions dels agents no substitueixen permisos ni revisió de codi.'],
      links: [{ label: 'Repositori i documentació', url: 'https://github.com/frolesti/base-skills' }]
    },
    'projecte-inspecciona': {
      tag: 'Extensió de navegador', title: 'Inspecciona — corrector per al català',
      lead: 'Revisió mentre s’escriu, amb correccions contextuals, sinònims, definicions i autocompletar.',
      status: 'Codi revisat: 2.1.0; la botiga pot tenir un ritme d’actualització diferent.',
      features: [
        { title: 'Revisió automàtica', desc: 'Després d’una pausa de 480 ms i novament després d’aplicar una correcció.' },
        { title: 'Correccions', desc: 'Obertura per clic i alternatives sobre les incidències.' },
        { title: 'Recursos lèxics', desc: 'Sinònims per accepció, definicions atribuïdes i formes flexionades compatibles.' },
        { title: 'Integració', desc: 'Inputs, textareas i contingut editable; opcions de revisió i variants.' }
      ],
      stack: ['JavaScript', 'WebExtensions API', 'Manifest V3', 'Service worker', 'Docker Compose', 'LanguageTool', 'Serveis de Softcatalà', 'Flask', 'Whoosh'],
      architecture: ['Content scripts d’interfície i service worker per a consultes.', 'La build distribuïda consulta serveis propis de corrector, sinònims i diccionari.', 'Diccionari de Viccionari amb índex Whoosh i atribució CC BY-SA 4.0.'],
      privacy: ['La revisió automàtica envia text al servei de correcció després de la pausa d’escriptura.', 'Les consultes lèxiques també necessiten connexió; no es presenta com a correcció íntegrament local.', 'El servei de diccionari documenta el seguiment de consultes desactivat.'],
      limits: ['Depèn de la disponibilitat del backend.', 'Les formes flexionades no cobreixen totes les irregularitats.', 'Els empaquetats no acrediten publicació a totes les botigues.'],
      links: [{ label: 'Inspecciona a Chrome Web Store', url: 'https://chromewebstore.google.com/detail/inspecciona/hldpogfjccnfnjljahaeaieoankmiicg' }]
    }
  };

  Object.values(projects).forEach((project) => {
    project.reviewed = '21 d’octubre de 2026';
  });
  global.PROJECT_ARTICLES = projects;
})(window);