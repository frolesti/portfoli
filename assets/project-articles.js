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
        "<h3>Context operatiu</h3>" +
        "<p>Moltes webs multilingues tenen versió en català, euskera o gallec, però l'entrada per defecte acostuma a ser una llengua majoritària. Això obliga l'usuari a repetir sempre la mateixa microtasca: detectar selector, canviar idioma i tornar al punt on era.</p>" +
        "<p>El projecte resol aquest cost invisible de navegació i converteix la llengua preferida en comportament per defecte.</p>" +
        "<h3>Arquitectura de detecció</h3>" +
        "<p>La lògica combina senyals estàndard (<strong>alternate hreflang</strong>) amb patrons de domini i rutes conegudes. El flux té tres capes: descoberta, validació i redirecció.</p>" +
        "<dl><dt>Descoberta</dt><dd>Llegeix metadades i variants d'URL publicades per la mateixa web.</dd><dt>Validació</dt><dd>Comprova que la variant detectada correspon realment a la llengua configurada.</dd><dt>Redirecció</dt><dd>Només s'aplica quan la correspondència és robusta; en cas contrari, no intervé.</dd></dl>" +
        "<h4>Criteris de robustesa</h4>" +
        "<ol><li>Evita falsos positius en codis ambigus com <code>/ca</code> (català vs Canadà).</li><li>Respecta webs sense estructura multilingue clara.</li><li>No degrada rendiment: opera en punts de decisió curts i evita recàrregues innecessàries.</li></ol>" +
        "<p class='article-note'><strong>Garantia d'experiència:</strong> si no hi ha evidència suficient, l'extensió no toca la pàgina. El principi base és preservar el context de navegació de l'usuari.</p>" +
        "<h3>Operació i manteniment</h3>" +
        "<p>Es parteix d'un únic codi base i es publiquen tres variants (català, euskera i gallec). El pipeline de compilació i publicació separa configuració, metadades i regles de domini, cosa que simplifica actualitzacions i auditories.</p>" +
        "<p>Resultat: navegació coherent en la llengua de l'usuari, menys fricció diària i zero recollida de dades personals.</p>",
      features: [
        { title: 'Multillengua de sèrie', desc: 'Català, euskera i gallec des d’un únic nucli de codi.' },
        { title: 'Compatibilitat ampla', desc: 'Funciona en diversos navegadors amb manteniment centralitzat.' },
        { title: 'Privacitat per defecte', desc: 'No recull dades de navegació i opera localment.' },
        { title: 'Regles robustes', desc: 'Combina hreflang i heurístiques per minimitzar errors.' }
      ],
      stack: ['JavaScript', 'WebExtensions API', 'Manifest V3', 'Flux de compilació PowerShell', 'Internacionalització', 'Chrome / Firefox / Edge'],
      links: []
    },

    'projecte-sepe': {
      tag: 'Automatització',
      title: 'Bot del SEPE',
      profile: 'social',
      lead: "Eina automatitzada que cerca cites prèvies al SEPE de manera contínua, amb panell local, filtres i avisos quan apareix una cita compatible.",
      visualHtml: vis('projecte-sepe'),
      articleHtml:
        "<h3>Problema real que resol</h3>" +
        "<p>Demanar cita al <strong>SEPE</strong> té una fricció molt alta: finestres curtes, disponibilitat irregular i necessitat de comprovar la mateixa pantalla repetidament. El projecte neix per automatitzar aquesta part mecànica, no per substituir la decisió de la persona.</p>" +
        "<h3>Disseny funcional</h3>" +
        "<p>L'usuari configura DNI, codi postal, contacte i tipus de cita. A partir d'aquí, el sistema executa consultes periòdiques, filtra resultats no útils i genera avis quan detecta coincidències vàlides.</p>" +
        "<dl><dt>Entrada</dt><dd>Dades mínimes de context per delimitar la cerca.</dd><dt>Motor de comprovació</dt><dd>Consultes cícliques amb intervals controlats per evitar comportament agressiu.</dd><dt>Sortida</dt><dd>Avís immediat per correu i visualització d'estat al panell.</dd></dl>" +
        "<h4>Arquitectura d'execució</h4>" +
        "<p>La solució es desplega en contenidor i separa dos processos: <strong>web</strong> (panell i configuració) i <strong>worker</strong> (automatització Selenium). Aquesta separació facilita monitoratge, reinici selectiu i escalat progressiu.</p>" +
        "<p class='article-note'><strong>Principi d'operació segura:</strong> intervals, retries i validacions de resultat per evitar soroll i falses alarmes.</p>" +
        "<h3>Impacte mesurable</h3>" +
        "<p>El guany principal és temps: la persona deixa de fer recàrregues manuals constants i passa a actuar només quan hi ha una opció real de cita.</p>",
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
        "<h3>Hipòtesi de producte</h3>" +
        "<p>troBar parteix d'una pregunta concreta: <strong>on puc veure el partit avui, a prop, sense perdre temps?</strong> El producte combina context esportiu i context geogràfic en una sola pantalla de decisió.</p>" +
        "<blockquote>La clau no és mostrar molts bars; és ordenar opcions útils en el moment de triar.</blockquote>" +
        "<h3>Disseny de l'experiència</h3>" +
        "<p>El flux està pensat en tres passes: veure quin partit interessa, descobrir locals propers i obrir ruta. Aquesta seqüència redueix fricció i evita salts entre apps.</p>" +
        "<dl><dt>Capa de partit</dt><dd>Context temporal del pròxim encontre i estat de la jornada.</dd><dt>Capa de mapa</dt><dd>Pinning i priorització de locals segons proximitat i filtre actiu.</dd><dt>Capa de conversió</dt><dd>Fitxa final amb horaris, ubicació i acció de navegació.</dd></dl>" +
        "<h4>Base tècnica i escalabilitat</h4>" +
        "<p>React Native permet una base compartida per iOS, Android i web. Firebase cobreix autenticació i persistència inicial, i deixa oberta l'evolució cap a recomanació personalitzada i mecàniques de fidelització.</p>" +
        "<p class='article-note'><strong>Visió de negoci:</strong> el valor per als locals és aparèixer exactament quan l'usuari està a punt de decidir on anar.</p>",
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
        "<h3>Problema de descoberta</h3>" +
        "<p>El contingut en català existeix, però està fragmentat entre plataformes i catàlegs amb criteris diferents. Per a l'usuari final, això es tradueix en una cerca lenta i poc fiable.</p>" +
        "<h3>Model de catàleg</h3>" +
        "<p>El complement crea una capa unificada dins de Stremio: metadades consistents, filtre lingüístic i fonts heterogènies sota una mateixa experiència d'ús.</p>" +
        "<dl><dt>Ingesta</dt><dd>Recull referències de contingut des de fonts compatibles.</dd><dt>Normalització</dt><dd>Unifica camps clau: títol, any, sinopsi, imatge i disponibilitat.</dd><dt>Publicació</dt><dd>Exposa el catàleg en format consumible per l'SDK de Stremio.</dd></dl>" +
        "<h4>Manteniment evolutiu</h4>" +
        "<p>L'arquitectura modular separa connectors de font, capa de metadades i lògica de presentació. Això facilita incorporar noves plataformes sense reescriure el sistema.</p>" +
        "<p class='article-note'><strong>Impacte:</strong> el valor no és només tècnic; és cultural i d'accessibilitat lingüística.</p>",
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
        "<h3>Objectiu públic</h3>" +
        "<p>Les dades oficials de desnonaments són públiques, però sovint inaccessibles per al treball comunitari. Alerta Desnona converteix aquesta informació en una eina territorial i accionable.</p>" +
        "<h3>Pipeline de dades</h3>" +
        "<ol><li><strong>Extracció:</strong> captura periòdica de registres publicats.</li><li><strong>Normalització:</strong> neteja de camps, unificació de formats i deduplicació.</li><li><strong>Geocodificació:</strong> conversió d'adreces a coordenades amb control de qualitat.</li><li><strong>Publicació:</strong> actualització de mapa, fitxes i estadístiques.</li></ol>" +
        "<h4>Sistema d'alertes</h4>" +
        "<p>La distribució combina notificacions web, notificacions natives i resum per correu. Cada canal cobreix un tipus de necessitat diferent: immediatesa, seguiment mòbil i monitoratge periòdic.</p>" +
        "<dl><dt>Mapa</dt><dd>Vista agregada per evitar saturació en zones d'alta densitat.</dd><dt>Fitxa de cas</dt><dd>Detall mínim per interpretar urgència i context.</dd><dt>Filtres</dt><dd>Segmentació per territori i tipus de procediment.</dd></dl>",
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
        "<h3>Entorn i necessitat</h3>" +
        "<p>Open Data Capture s'utilitza en context clínic i de recerca, on la qualitat de dada i la traçabilitat són tan importants com la velocitat de treball. El repte no és només recollir respostes: és fer-ho amb criteri, seguretat i interoperabilitat.</p>" +
        "<h3>Model funcional</h3>" +
        "<dl><dt>Definició d'instruments</dt><dd>Creació de formularis clínics flexibles amb estructura versionada.</dd><dt>Administració</dt><dd>Execució remota o presencial amb control de sessió i estat.</dd><dt>Explotació</dt><dd>Visualització i exportació en formats consumibles per anàlisi.</dd></dl>" +
        "<h4>Criteris de governança de dades</h4>" +
        "<p>La plataforma aplica permisos granulars, autenticació robusta i separació clara de rols. Aquest disseny minimitza errors operatius i facilita compliment normatiu en entorns sensibles.</p>" +
        "<p class='article-note'><strong>Avantatge estratègic:</strong> en ser codi obert, els equips eviten lock-in i poden adaptar el sistema a protocols propis.</p>",
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
        "<h3>Problema de distribució</h3>" +
        "<p>Molts professionals de fotografia entreguen material amb eines genèriques i fluxos dispersos. Això penalitza imatge de marca, control de qualitat i eficiència de gestió.</p>" +
        "<h3>Arquitectura de servei</h3>" +
        "<p>Aparador separa clarament dos espais: experiència de client (accés per codi i galeria) i operativa professional (panell de control).</p>" +
        "<dl><dt>Publicació</dt><dd>Pujada de lots, processament de derivades i indexació d'actius.</dd><dt>Consum</dt><dd>Navegació fluida i descàrrega en qualitat original amb URL signada.</dd><dt>Negoci</dt><dd>Donatiu opcional i base per a funcionalitats premium.</dd></dl>" +
        "<h4>Escalabilitat i costos</h4>" +
        "<p>L'emmagatzematge d'objectes i la generació de miniatures permeten separar pes de fitxers i experiència de visualització. Això redueix costos operatius i manté rendiment en col·leccions grans.</p>",
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
        "<h3>Objectiu de la solució</h3>" +
        "<p>AESSO necessitava una calculadora fiable per obtenir el <strong>g<sub>tot</sub></strong> d'un sistema de protecció solar segons norma. La clau era combinar precisió tècnica amb una experiència d'ús clara per a personal no desenvolupador.</p>" +
        "<h3>Implementació aplicada</h3>" +
        "<p>Es va lliurar un prototip web i un connector WordPress instal·lable amb codi curt <code>[aesso_calculadora]</code>. Això permet publicar la calculadora dins del web corporatiu sense desplegaments complexos.</p>" +
        "<dl><dt>Accés</dt><dd>Validació d'empreses associades amb sessió signada.</dd><dt>Càlcul</dt><dd>Execució de fórmules normatives amb control de valors d'entrada.</dd><dt>Sortida</dt><dd>Resultat i informe PDF imprimible per arxiu tècnic.</dd></dl>" +
        "<h4>Validació numèrica</h4>" +
        "<p>El càlcul es va contrastar amb casos de referència i retorna <strong>g<sub>tot</sub> = 0,10</strong> en l'escenari validat. La traçabilitat de dades queda reflectida a la taula de resultat.</p>" +
        "<table class='product-table'><tbody><tr><td>τ<sub>e</sub></td><td>0,05</td></tr><tr><td>ρ<sub>e</sub></td><td>0,21</td></tr><tr><td>α<sub>e</sub></td><td>0,74</td></tr><tr><td>U<sub>g</sub></td><td>1,2 W/m²·K</td></tr><tr><td>g</td><td>0,59</td></tr><tr><td><strong>g<sub>tot</sub></strong></td><td><strong>0,10</strong></td></tr></tbody></table>",
      features: [
        { title: 'Prototip i connector', desc: 'Lliurament en dues vies per validar i operar.' },
        { title: 'Norma implementada', desc: 'Càlcul verificat segons EN ISO 52022-1.' },
        { title: 'Accés controlat', desc: 'Validació amb CRM existent i cookie signada.' },
        { title: 'Informe integrat', desc: 'Exportació a PDF sense serveis externs.' }
      ],
      stack: ['HTML / CSS / JavaScript', 'WordPress', 'PHP', 'API REST', 'Brevo API', 'Cookies HMAC', '@media print'],
      links: [
        { label: 'Veure calculadora en directe', url: 'https://aes-so.org/recursos/calculadora-del-factor-solar/', variant: 'primary' }
      ]
    },

    'projecte-base-skills': {
      tag: "Plantilla d'enginyeria assistida",
      title: 'Base Skills Repo',
      profile: 'social',
      lead: "Repositori plantilla per treballar amb GitHub Copilot amb més precisió i menys consum de context, fins i tot en equips no experts en IA.",
      visualHtml: vis('projecte-base-skills'),
      articleHtml:
        "<h3>Problema de context en desenvolupament assistit</h3>" +
        "<p>Quan tota la guia d'un projecte viu en un sol fitxer llarg, cada interacció amb l'agent consumeix context de manera poc eficient i baixa la qualitat de resposta.</p>" +
        "<h3>Patró de capes</h3>" +
        "<dl><dt>Instruccions base</dt><dd>Normes globals estables i de baix soroll.</dd><dt>Regles específiques</dt><dd>Comportament per llenguatge, carpeta o tipus de fitxer.</dd><dt>Skills sota demanda</dt><dd>Coneixement especialitzat que només es carrega quan cal.</dd><dt>Memòria de repo</dt><dd>Fets validats i decisions persistents entre sessions.</dd></dl>" +
        "<h4>Impacte en equips</h4>" +
        "<p>La plantilla redueix improvisació, millora consistència de canvis i facilita revisió tècnica perquè les decisions queden documentades en el flux de treball.</p>" +
        "<p class='article-note'><strong>Objectiu pràctic:</strong> més precisió de resposta amb menys cost de context i menys dependència de coneixement tàcit.</p>",
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
