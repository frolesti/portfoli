(function attachProjectArticles(global) {
  const projects = {
    'projecte-extensions': {
      tag: 'Extensions de navegador',
      title: "Extensions de canvi d'idioma",
      lead: 'En català, si us plau; Euskaraz, mesedez; i En galego, por favor: tres variants per prioritzar la llengua de navegació.',
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
      lead: 'Eina web per configurar cerques de disponibilitat de cita prèvia i reduir les comprovacions manuals.',
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
      lead: 'Consulta ciutadana de publicacions del BOE relacionades amb subhastes i procediments d’habitatge, amb mapa i avisos.',
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
      lead: 'Adaptació d’Open Data Capture a l’estudi ORION, en col·laboració amb Alta Health Services.',
      role: 'Adaptació sobre el projecte de Douglas Neuroinformatics Platform; no autoria de la plataforma original.',
      status: 'Col·laboració en curs; demo pública independent de l’entorn clínic.',
      features: [
        { title: 'Instruments', desc: 'Formularis i tasques interactives per a recollida de dades clíniques.' },
        { title: 'Administració', desc: 'Avaluacions presencials i assignacions remotes a través d’un gateway.' },
        { title: 'Explotació', desc: 'Visualització i exportació de dades sota demanda.' },
        { title: 'ORION', desc: 'Adaptacions de formularis, validacions, seguiments i presentació de dades.' }
      ],
      stack: ['TypeScript', 'React', 'Node.js', 'Docker Compose', 'WebAssembly', 'JWT', 'API REST'],
      architecture: ['Aplicació web, API i gateway per a assignacions remotes.', 'Construcció d’instruments al navegador amb WebAssembly i runtime d’instruments.', 'Projecte original sota llicència Apache-2.0.'],
      privacy: ['Autenticació JWT i permisos granulars al projecte original.', 'La demo utilitza dades simulades, no dades de l’estudi.', 'No es publiquen configuracions internes ni informació clínica.'],
      limits: ['Les capacitats generals no acrediten la configuració concreta de cada desplegament.', 'La fitxa no declara una certificació clínica o normativa.'],
      links: [{ label: 'Web i documentació', url: 'https://opendatacapture.org/' }, { label: 'Demo amb dades simulades', url: 'https://demo.opendatacapture.org/' }, { label: 'Projecte original', url: 'https://github.com/DouglasNeuroInformatics/OpenDataCapture' }]
    },
    'projecte-aesso': {
      tag: 'Calculadora web i connector WordPress', title: 'Calculadora de protecció solar per a AESSO',
      lead: 'Càlcul del factor solar total g_tot segons EN ISO 52022-1, integrat a WordPress amb accés per a empreses associades.',
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
      lead: 'Àlbums per codi, galeria, descàrregues originals i panell professional amb donatius opcionals.',
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
      lead: 'Organització del context de GitHub Copilot en instruccions, skills, prompts, agents i memòria.',
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
    },
    'projecte-cookie-guard': {
      tag: 'Privadesa · Extensió de navegador', title: 'CookieBlocker',
      lead: 'Automatització del rebuig de cookies opcionals als avisos compatibles i revisió d’observacions locals.',
      status: 'Desenvolupament 0.1.0; anteriorment Cookie Guard.',
      features: [
        { title: 'Rebuig', desc: 'AutoConsent amb regles DOM, fluxos de categories opcionals i alternativa textual conservadora.' },
        { title: 'Control per web', desc: 'Excepcions, pausa reversible i reintent.' },
        { title: 'Observacions', desc: 'Registre opcional, revisió manual, notes i exportació de dossier o JSON.' },
        { title: 'Neteja', desc: 'Eliminació periòdica fora de la llista de confiança, desactivada per defecte.' }
      ],
      stack: ['TypeScript', 'WXT', 'WebExtensions', 'AutoConsent 16.57.0', 'Driver.js', 'Node.js test runner', 'jsdom'],
      architecture: ['Regles locals empaquetades, sense codi remot.', 'Builds Chromium i Firefox i empaquetat Safari que requereix eines Apple.'],
      privacy: ['Observacions voluntàries i locals, sense registre compartit ni reclamacions automàtiques.', 'La neteja de cookies pot tancar sessions i fer reaparèixer avisos.'],
      limits: ['Rebutjar un avís no equival a bloquejar trànsit.', 'No implementa encara bloqueig preventiu de xarxa ni auditoria posterior al rebuig.', 'Els registres no certifiquen infraccions ni venda de dades.', 'La cobertura depèn de regles compatibles i límits del navegador.'],
      links: [{ label: 'Repositori del projecte', url: 'https://github.com/frolesti/cookie-guard' }]
    },
    'projecte-spirit': {
      tag: 'Maquinari obert · Projecte comunitari', title: 'SPIRIT — smartphone obert i reparable',
      lead: 'Iniciativa comunitària amb components disponibles i documentació oberta, orientada al control, la reparabilitat i la privadesa.',
      role: 'Seguiment i exploració de contribucions; no s’atribueix el disseny del maquinari.',
      status: 'Projecte comunitari en desenvolupament.',
      features: [
        { title: 'Disseny obert', desc: 'Documentació d’electrònica, mecànica i sistema operatiu.' },
        { title: 'Reparabilitat', desc: 'Exploració d’una arquitectura amb components accessibles.' },
        { title: 'Comunitat', desc: 'Guia i canals de discussió de contribucions.' }
      ],
      stack: ['KiCad', 'Disseny mecànic', 'Raspberry Pi Compute Module', 'Documentació oberta'],
      architecture: ['Repositori amb esquemes EDA, mecànica i recursos de components.', 'Especificacions d’electrònica i sistema operatiu a la wiki original.'],
      privacy: ['La privadesa és un objectiu de disseny, no una garantia acreditada de producte final.'],
      limits: ['No es presenta com un dispositiu acabat, certificat o comercialitzat.', 'Components, costos i especificacions poden canviar.'],
      links: [{ label: 'Projecte original', url: 'https://github.com/SPIRIT-org/SPIRIT' }, { label: 'Especificacions tècniques', url: 'https://github.com/SPIRIT-org/SPIRIT/wiki/Overview-technical-specs' }]
    },
    'projecte-ai-blocker': {
      tag: 'Control de contingut generat amb IA', title: 'AI-Blocker',
      lead: 'Extensió per reduir respostes d’IA als cercadors, amb filtres opcionals i classificació local d’imatges experimental.',
      status: 'Desenvolupament 0.1.0; classificació visual experimental i voluntària.',
      features: [
        { title: 'Google', desc: 'Mode web udm=14 amb declarativeNetRequest o content script segons navegador i domini.' },
        { title: 'Altres cercadors', desc: 'Ocultació de blocs de resposta amb selectors compatibles.' },
        { title: 'Filtre opcional', desc: 'Llista de dominis OnlyHuman per ocultar resultats, desactivada per defecte.' },
        { title: 'Classificació local', desc: 'Experiment Chromium amb Transformers.js i ONNX; avís de possible IA sense ocultació automàtica.' }
      ],
      stack: ['TypeScript', 'React', 'WXT', 'WebExtensions', 'declarativeNetRequest', 'i18next', 'Transformers.js', 'ONNX Runtime Web', 'WebAssembly', 'Web Worker'],
      architecture: ['Popup i opcions React; regles i estat gestionats per l’extensió.', 'Document offscreen i worker compartit Chromium amb model empaquetat.', 'Llista opcional descarregada de GitHub i conservada en memòria cau.'],
      privacy: ['No envia imatges a serveis d’inferència, però pot tornar-les a descarregar del servidor original.', 'El classificador demana permisos addicionals i està desactivat per defecte.', 'Descarregar la llista externa exposa metadades de connexió al proveïdor.'],
      limits: ['Ocultar respostes no demostra que el servidor no les hagi generat.', 'Els indicadors d’aigua, energia i CO₂ són estimacions, no estalvi mesurat.', 'No és SynthID ni prova de procedència; les taxes d’error en un corpus representatiu són desconegudes.', 'L’experiment visual no funciona a Firefox; els selectors poden quedar obsolets.'],
      links: []
    }
  };

  Object.values(projects).forEach((project) => {
    project.reviewed = '21 d’octubre de 2026';
  });
  global.PROJECT_ARTICLES = projects;
})(window);