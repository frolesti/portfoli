(function attachProjectArticles(global) {
  // Els visuals venen de project-visuals.js (única font de veritat).
  // project-visuals.js s'ha de carregar abans d'aquest fitxer.
  function vis(id) {
    var pv = global.PROJECT_VISUALS;
    if (!pv || !pv[id]) return '';
    return '<div class="project-visual ' + pv[id].cls + '">' + pv[id].html + '</div>';
  }

  var PROJECT_ARTICLES = {

    'projecte-extensions': {
      tag: 'Extensions de navegador',
      title: "Extensions de canvi d'idioma",
      profile: 'social',
      lead: "Conjunt d'extensions que detecten automàticament la versió en català, euskera o gallec d'una pàgina i t'hi redirigeixen sense fricció.",
      visualHtml: vis('projecte-extensions'),
      articleHtml:
        "<p>Moltes webs multilingües ofereixen versió en català, euskera o gallec, però el navegador acostuma a obrir sempre una llengua majoritària per defecte. En el dia a dia, això ens força a repetir els mateixos passos una vegada i una altra per tal de canviar l'idioma.</p>" +
        "<p>L'objectiu d'aquesta extensió és garantir que l'usuari pugui mantenir la seva llengua a internet, navegant de manera </p>" +
        "<p>L'extensió detecta etiquetes <strong>alternate hreflang</strong>, patrons d'URL coneguts i estructures específiques de webs complexes per identificar quina és la versió correcta segons la llengua configurada.</p>" +
        "<p>Quan existeix alternativa vàlida, hi redirigeix de forma transparent. Quan no existeix, no interfereix i deixa la pàgina tal com està. D'aquesta manera no penalitza l'experiència ni genera falses redireccions.</p>" +
        "<p>El resultat pràctic és una navegació coherent en la llengua de l'usuari i una reducció clara de passos repetitius.</p>" +
        "<ol><li>Es parteix d'un únic codi base que es compila en tres variants (català, euskera i gallec).</li><li>Quan visites una URL, el procés en segon pla consulta hreflang i regles de domini conegudes.</li><li>Si troba una alternativa vàlida, redirigeix abans que la pàgina es mostri del tot.</li><li>Inclou heurístiques per evitar confusions habituals, com identificar malament <code>/ca</code> de Canadà com si fos català.</li></ol>" +
        "<p>El manteniment es fa amb flux de compilació automatitzat i publicació separada per navegador. L'arquitectura se sosté sobre <strong>WebExtensions API</strong> i Manifest V3, sense recollida de dades personals.</p>",
      features: [
        { title: 'Multillengua de sèrie', desc: 'Català, euskera i gallec des d’un únic nucli de codi.' },
        { title: 'Compatibilitat ampla', desc: 'Funciona en diversos navegadors amb manteniment centralitzat.' },
        { title: 'Privacitat per defecte', desc: 'No recull dades de navegació i opera localment.' },
        { title: 'Regles robustes', desc: 'Combina hreflang i heurístiques per minimitzar errors.' }
      ],
      stack: ['JavaScript', 'WebExtensions API', 'Manifest V3', 'Flux de compilació PowerShell', 'Internacionalització', 'Chrome / Firefox / Edge'],
      links: [
        { label: 'En català, si us plau (Chrome)', url: 'https://chromewebstore.google.com/detail/en-catal%C3%A0-si-us-plau/fljkmgniiajdaefnomebclfbpfdgjplc', variant: 'primary' },
        { label: 'Euskaraz, mesedez (Chrome)', url: 'https://chromewebstore.google.com/detail/euskaraz-mesedez/kniinbeidggpjlfnmobaomcfnflochlc', variant: 'outline' },
        { label: 'En galego, por favor (Chrome)', url: 'https://chromewebstore.google.com/detail/en-galego-por-favor/cbgecchlojjjkhjfahebknmpiodmlnll', variant: 'outline' }
      ]
    },

    'projecte-sepe': {
      tag: 'Automatització',
      title: 'Bot del SEPE',
      profile: 'social',
      lead: "Eina automatitzada que cerca cites prèvies al SEPE de manera contínua, amb panell local, filtres i avisos quan apareix una cita compatible.",
      visualHtml: vis('projecte-sepe'),
      articleHtml:
        "<p>Demanar cita al <strong>Servei Públic d'Ocupació Estatal</strong> és, per a molta gent, un procés lent i frustrant: finestres d'hores molt petites, disponibilitat irregular i necessitat de revisar la mateixa pantalla repetidament.</p>" +
        "<p>El projecte neix per estalviar aquest desgast. No substitueix l'usuari en la decisió final, però sí que elimina la part mecànica de comprovació constant.</p>" +
        "<p>Disposa d'un panell local senzill on introdueixes DNI, codi postal i correu electrònic. A partir d'aquí, l'eina consulta el sistema oficial de cita prèvia, filtra per modalitat <strong>presencial o telefònica</strong> i avisa quan detecta una opció vàlida.</p>" +
        "<p>Si la configuració de correu està activa, l'avís arriba automàticament. Això permet reaccionar de seguida quan apareixen franges amb disponibilitat real.</p>" +
        "<p>La solució funciona amb Python i Selenium dins d'un contenidor Docker. S'organitza en dos processos coordinats (<strong>web + treballador</strong>) gestionats amb supervisord. Per simplicitat i privacitat, l'estat principal es manté en memòria i no requereix base de dades per operar.</p>" +
        "<p>L'impacte real no és tècnic: és temps recuperat. La persona deixa de recarregar pàgines durant hores i només actua quan hi ha una oportunitat real de cita.</p>",
      features: [
        { title: 'Panell local', desc: 'Configuració simple des de localhost, sense passos innecessaris.' },
        { title: 'Filtrat útil', desc: 'Distingeix entre cita presencial i telefònica segons el cas.' },
        { title: 'Avisos immediats', desc: 'Notifica quan apareix una cita vàlida.' },
        { title: 'Preparat per producció', desc: 'Compatible amb contenidors i desplegament automatitzat.' }
      ],
      stack: ['Python', 'Flask', 'Selenium', 'Docker', 'supervisord', 'GitHub Actions'],
      links: [
        { label: 'Veure projecte en directe', url: 'https://cita-sepe.duckdns.org/', variant: 'primary' }
      ]
    },

    'projecte-bars': {
      tag: 'Aplicació mòbil i web',
      title: 'troBar',
      profile: 'professional',
      lead: "Aplicació per trobar locals on veure partits, amb mapa, context del pròxim encontre i filtres. Base preparada per evolucionar com a producte de negoci.",
      visualHtml: vis('projecte-bars'),
      articleHtml:
        "<p>troBar resol una necessitat quotidiana i molt clara de l'aficionat: <strong>on veure el partit avui, a prop i amb bon ambient</strong>. Uneix informació de partits amb un mapa local i filtres per equip o competició.</p>" +
        "<p>La proposta no és només informar, sinó ajudar a decidir ràpid en el moment en què la persona vol sortir de casa.</p>" +
        "<p>Inclou visualització cartogràfica, fitxa de partit proper, filtres rellevants i detall de local amb horaris i ruta. L'autenticació amb Firebase permet personalització progressiva i obre la porta a funcionalitats de fidelització.</p>" +
        "<p>Per als locals, ser visible just quan l'usuari decideix on anar té valor comercial directe. A partir d'aquí es pot construir model de subscripció per presències destacades, acords de patrocini en partits clau o campanyes amb marques.</p>" +
        "<p>El plantejament inicial té molt bon encaix a Barcelona, però la lògica és reproduïble a altres ciutats i esports.</p>",
      features: [
        { title: 'Multiplataforma', desc: 'Una base de codi per iOS, Android i web.' },
        { title: 'Mapa orientat a decisió', desc: 'Dissenyat per triar ràpid on anar.' },
        { title: 'Filtres rellevants', desc: 'Partit, equip i ubicació en pocs tocs.' },
        { title: 'Escalable', desc: 'Preparat per créixer en funcionalitats i mercats.' }
      ],
      stack: ['React Native', 'Expo', 'TypeScript', 'React Navigation', 'Firebase', 'Firestore', 'Google Maps API'],
      links: []
    },

    'projecte-stremio': {
      tag: 'Complement audiovisual',
      title: 'Stremio en Català',
      profile: 'social',
      lead: "Complement per a Stremio amb catàleg curat de cinema i sèries disponibles en català a diferents plataformes.",
      visualHtml: vis('projecte-stremio'),
      articleHtml:
        "<p>El contingut en català existeix, però sovint està dispers entre plataformes i catàlegs poc homogenis. A la pràctica, trobar què es pot veure en català implica cercar en molts llocs i perdre temps.</p>" +
        "<p>El projecte resol aquesta fragmentació i converteix la descoberta de contingut en una experiència més directa.</p>" +
        "<p>Ofereix un catàleg específic en català dins de Stremio, amb metadades útils (sinopsi, any, popularitat i imatge). Així l'usuari no ha de sortir de l'entorn habitual per trobar contingut en la seva llengua.</p>" +
        "<p>Desenvolupat amb Node.js i l'SDK oficial de Stremio, amb organització modular per gestors de catàleg, metadades i reproducció. Aquesta separació simplifica afegir noves fonts sense afectar la resta del sistema.</p>" +
        "<p>Més enllà de la part tècnica, el valor principal és cultural: facilita accedir a contingut en català de manera normalitzada i redueix la sensació de dispersió de l'oferta audiovisual.</p>",
      features: [
        { title: 'Catàleg curat', desc: 'Selecció en català amb criteri i coherència.' },
        { title: 'Integració natural', desc: 'Funciona dins l’experiència habitual de Stremio.' },
        { title: 'Arquitectura modular', desc: 'Fàcil d’ampliar amb noves fonts.' },
        { title: 'Cost operatiu baix', desc: 'Desplegament lleuger i manteniment sostenible.' }
      ],
      stack: ['Node.js', 'Express', 'stremio-addon-sdk', 'TMDB API', 'Axios', 'Vercel'],
      links: [
        { label: 'Instal·lar complement', url: 'https://stremio-en-catala.vercel.app/', variant: 'primary' }
      ]
    },

    'projecte-alerta': {
      tag: 'Justícia social',
      title: 'Alerta Desnona',
      profile: 'social',
      lead: "Plataforma ciutadana de seguiment de desnonaments i subhastes judicials amb mapa, avisos i resum periòdic.",
      visualHtml: vis('projecte-alerta'),
      articleHtml:
        "<p>Les dades de desnonaments publicades oficialment són públiques, però difícils d'entendre i d'aprofitar per a l'acció comunitària. Alerta Desnona transforma aquesta informació en un format consultable, territorial i accionable.</p>" +
        "<p>La finalitat és facilitar organització ciutadana i resposta coordinada amb millor anticipació.</p>" +
        "<p>Inclou mapa interactiu amb agrupació de casos, fitxa detallada per cada procediment, estadístiques territorials i filtres per zona. És multillengua i instal·lable com a aplicació web progressiva.</p>" +
        "<p>Els avisos es distribueixen per notificacions web, notificacions natives i correu electrònic resumit.</p>" +
        "<ol><li>Extracció periòdica de casos publicats.</li><li>Normalització d'adreces i camps rellevants.</li><li>Geocodificació per representar cada punt al mapa.</li><li>Actualització diària amb automatització de processos i entorns separats.</li></ol>",
      features: [
        { title: 'Mapa operatiu', desc: 'Visualitza molts casos sense saturació.' },
        { title: 'Avisos multicanal', desc: 'Notificacions web, natives i resum per correu.' },
        { title: 'Multillengua', desc: 'Català, castellà, gallec i euskera.' },
        { title: 'Actualització contínua', desc: 'Processament diari automatitzat.' }
      ],
      stack: ['React 19', 'TypeScript', 'Vite', 'Express', 'SQLite', 'Leaflet', 'Capacitor', 'Firebase Cloud Messaging', 'Railway'],
      links: [
        { label: 'Veure versió pilot', url: 'https://alerta-desnona-production.up.railway.app/', variant: 'primary' }
      ]
    },

    'projecte-odc': {
      tag: 'Plataforma clínica',
      title: 'Open Data Capture',
      profile: 'professional',
      lead: "Plataforma de codi obert per a recollida contínua de dades clíniques, administració d'instruments i explotació segura de resultats.",
      visualHtml: vis('projecte-odc'),
      articleHtml:
        "<p>Open Data Capture és una iniciativa del Douglas Neuroinformatics Platform per simplificar la captura de dades en recerca clínica i seguiment de pacients.</p>" +
        "<p>La contribució principal en aquest projecte ha estat de producte i interfície: facilitar la creació d'instruments, l'administració remota o presencial i la sortida de dades en formats útils.</p>" +
        "<p>Permet definir instruments de forma flexible, gestionar sessions de resposta, visualitzar dades i exportar resultats sota demanda. La seguretat s'aplica per defecte amb autenticació i permisos granulars.</p>" +
        "<p>La naturalesa de codi obert evita bloqueig de proveïdor i permet evolució a mida en entorns exigents.</p>",
      features: [
        { title: 'Codi obert', desc: 'Auditable, extensible i sense dependència tancada.' },
        { title: 'Seguretat integrada', desc: 'Permisos granulars i autenticació robusta.' },
        { title: 'Operació flexible', desc: 'Administració remota i presencial.' },
        { title: 'Desplegament propi', desc: 'Adaptable a infraestructura privada.' }
      ],
      stack: ['TypeScript', 'React', 'Node.js', 'Docker', 'WebAssembly', 'JWT', 'REST API'],
      links: [
        { label: 'Web del projecte', url: 'https://opendatacapture.org', variant: 'primary' },
        { label: 'Mostra funcional', url: 'https://demo.opendatacapture.org', variant: 'outline' },
        { label: 'Repositori GitHub', url: 'https://github.com/DouglasNeuroInformatics/OpenDataCapture', variant: 'outline' }
      ]
    },

    'projecte-aparador': {
      tag: 'Producte SaaS',
      title: 'Aparador',
      profile: 'professional',
      lead: "Plataforma per a fotògrafs: àlbums compartits per codi, descàrrega en qualitat original, donatius opcionals i panell de control professional.",
      visualHtml: vis('projecte-aparador'),
      articleHtml:
        "<p>Molts fotògrafs acaben lliurant material per canals dispersos (enviaments temporals, carpetes genèriques o serveis sense identitat pròpia). El resultat és una experiència poc professional per al client i poc eficient per al professional.</p>" +
        "<p>Aparador transforma aquesta entrega en una experiència ordenada i amb marca pròpia: cada àlbum s'obre amb un codi curt, la navegació és fluida i la descàrrega es fa en qualitat original amb enllaços signats.</p>" +
        "<p>A més, incorpora donatiu opcional per facilitar un model de monetització no invasiu i sostenible.</p>" +
        "<p>El panell de control concentra les tasques clau: crear àlbums, pujar lots de fotos, generar derivades de visualització, consultar estat i compartir codis.</p>",
      features: [
        { title: 'Accés per codi', desc: 'Compartició simple i controlada per cada àlbum.' },
        { title: 'Galeria fluida', desc: 'Navegació ràpida i visor ampliat de fotografies.' },
        { title: 'Qualitat original', desc: 'Descàrrega segura del fitxer complet.' },
        { title: 'Monetització opcional', desc: 'Donatius sense fricció per al client final.' }
      ],
      stack: ['Next.js 16', 'TypeScript', 'Tailwind CSS 4', 'Supabase', 'Cloudflare R2', 'Stripe', 'Sharp', 'Vercel'],
      links: [
        { label: 'Prova pilot', url: 'https://aparador.vercel.app/', variant: 'primary' }
      ]
    },

    'projecte-aesso': {
      tag: 'Eina tècnica i connector WordPress',
      title: 'Calculadora g_tot per a AESSO',
      profile: 'professional',
      lead: "Calculadora del factor solar total g_tot segons EN ISO 52022-1: prototip web i connector WordPress amb control d'accés i informe en PDF.",
      visualHtml: vis('projecte-aesso'),
      articleHtml:
        "<p>L'Associació Espanyola de la Protecció Solar necessitava una eina tècnica integrada al seu web per calcular <strong>g<sub>tot</sub></strong> segons norma, amb resultat fiable i documentable.</p>" +
        "<p>A més, l'accés havia d'estar restringit a empreses associades sense desplegar un sistema d'usuaris nou des de zero.</p>" +
        "<p>S'ha lliurat un prototip web autocontingut i un connector instal·lable a WordPress amb codi curt <code>[aesso_calculadora]</code>. La part matemàtica implementa les fórmules exigides per la norma i prepara impressió directa a PDF.</p>" +
        "<p>El càlcul s'ha contrastat amb valors de referència i retorna <strong>g<sub>tot</sub> = 0,10</strong> en l'exemple validat.</p>" +
        "<table class='product-table'><tbody><tr><td>τ<sub>e</sub></td><td>0,05</td></tr><tr><td>ρ<sub>e</sub></td><td>0,21</td></tr><tr><td>α<sub>e</sub></td><td>0,74</td></tr><tr><td>U<sub>g</sub></td><td>1,2 W/m²·K</td></tr><tr><td>g</td><td>0,59</td></tr><tr><td><strong>g<sub>tot</sub></strong></td><td><strong>0,10</strong></td></tr></tbody></table>",
      features: [
        { title: 'Prototip i connector', desc: 'Lliurament en dues vies per validar i operar.' },
        { title: 'Norma implementada', desc: 'Càlcul verificat segons EN ISO 52022-1.' },
        { title: 'Accés controlat', desc: 'Validació amb CRM existent i cookie signada.' },
        { title: 'Informe integrat', desc: 'Exportació a PDF sense serveis externs.' }
      ],
      stack: ['HTML / CSS / JavaScript', 'WordPress', 'PHP', 'API REST', 'Brevo API', 'Cookies HMAC', '@media print'],
      links: []
    },

    'projecte-base-skills': {
      tag: "Plantilla d'enginyeria assistida",
      title: 'Base Skills Repo',
      profile: 'social',
      lead: "Repositori plantilla per treballar amb GitHub Copilot amb més precisió i menys consum de context, fins i tot en equips no experts en IA.",
      visualHtml: vis('projecte-base-skills'),
      articleHtml:
        "<p>Quan tota la guia d'un projecte es concentra en un únic fitxer immens, cada interacció amb l'agent es torna cara i menys precisa. Aquesta plantilla proposa distribuir coneixement en capes per carregar només el que toca en cada tasca.</p>" +
        "<p>La proposta combina instruccions globals curtes, regles per tipus de fitxer, habilitats sota demanda, modes de conversa especialitzats i memòria de repositori.</p>" +
        "<p>Quan s'inicia un projecte nou, la plantilla detecta artefactes tècnics disponibles o pregunta el mínim necessari per activar paquets pertinents. La resta queda latent fins que sigui realment necessari.</p>" +
        "<p>No cal ser especialista en IA per aprofitar agents de desenvolupament amb qualitat. Amb un marc clar, l'equip pot treballar amb més seguretat, menys improvisació i millor traçabilitat de decisions.</p>",
      features: [
        { title: 'Context per capes', desc: 'Cada bloc de coneixement es carrega quan toca.' },
        { title: 'Arrencada adaptativa', desc: 'Activa només els paquets rellevants al stack real.' },
        { title: 'Agents segurs', desc: 'Modes de treball amb eines restringides per defecte.' },
        { title: 'Pensat per equips', desc: 'Aplicable a equips tècnics sense perfil especialista en IA.' }
      ],
      stack: ['GitHub Copilot', 'Disseny d’instruccions', 'Agents amb eines restringides', 'Memòria de repositori', 'Automatització de fluxos de treball'],
      links: [
        { label: 'Repositori GitHub', url: 'https://github.com/frolesti/base-skills', variant: 'primary' }
      ]
    }
  };

  global.PROJECT_ARTICLES = PROJECT_ARTICLES;
})(window);
