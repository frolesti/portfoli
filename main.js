/* ================================================
   FROLESTI — main.js
   Nav scroll · Mobile menu · Carousel · Scroll reveal · Form
   ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- NAVBAR SCROLL ----------
  const navbar = document.getElementById('navbar');
  const onScroll = () => {
    navbar.classList.toggle('scrolled', window.scrollY > 40);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ---------- MOBILE MENU ----------
  const toggle = document.querySelector('.nav-toggle');
  const mobileMenu = document.getElementById('mobileMenu');

  if (toggle && mobileMenu) {
    toggle.addEventListener('click', () => {
      mobileMenu.classList.toggle('open');
      toggle.classList.toggle('active');
    });

    // Close on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        mobileMenu.classList.remove('open');
        toggle.classList.remove('active');
      });
    });
  }

  // ---------- CAROUSEL ----------
  const track = document.querySelector('.carousel-track');
  const cards = track ? Array.from(track.children) : [];
  const prevBtn = document.querySelector('.carousel-prev');
  const nextBtn = document.querySelector('.carousel-next');
  const dotsContainer = document.getElementById('carouselDots');

  if (track && cards.length > 0) {
    let currentPage = 0;

    function getCardsPerView() {
      const w = window.innerWidth;
      if (w <= 640) return 1;
      if (w <= 900) return 2;
      return Math.min(3, cards.length);
    }

    function getTotalPages() {
      const perView = getCardsPerView();
      return Math.max(1, cards.length - perView + 1);
    }

    function wrapPage(page) {
      const totalPages = getTotalPages();
      if (totalPages <= 1) return 0;
      return ((page % totalPages) + totalPages) % totalPages;
    }

    function updateCarousel() {
      const perView = getCardsPerView();
      const totalPages = getTotalPages();
      currentPage = wrapPage(currentPage);

      // Calculate offset
      const gap = 20;
      const containerWidth = track.parentElement.offsetWidth;
      const cardWidth = (containerWidth - gap * (perView - 1)) / perView;

      // Set card widths
      cards.forEach(card => {
        card.style.minWidth = cardWidth + 'px';
        card.style.maxWidth = cardWidth + 'px';
      });

      const offset = currentPage * (cardWidth + gap);
      track.style.transform = `translateX(-${offset}px)`;

      // Buttons — always enabled for infinite carousel
      if (prevBtn) prevBtn.disabled = false;
      if (nextBtn) nextBtn.disabled = false;

      // Show/hide nav when not needed
      const showNav = cards.length > perView;
      if (prevBtn) prevBtn.style.display = showNav ? '' : 'none';
      if (nextBtn) nextBtn.style.display = showNav ? '' : 'none';
      if (dotsContainer) dotsContainer.style.display = showNav ? '' : 'none';

      // Dots
      if (dotsContainer) {
        dotsContainer.innerHTML = '';
        for (let i = 0; i < totalPages; i++) {
          const dot = document.createElement('button');
          dot.className = 'carousel-dot' + (i === currentPage ? ' active' : '');
          dot.setAttribute('aria-label', `Pàgina ${i + 1}`);
          dot.addEventListener('click', () => { currentPage = i; updateCarousel(); });
          dotsContainer.appendChild(dot);
        }
      }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => { currentPage = wrapPage(currentPage - 1); updateCarousel(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { currentPage = wrapPage(currentPage + 1); updateCarousel(); });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { currentPage = wrapPage(currentPage + 1); }
        else { currentPage = wrapPage(currentPage - 1); }
        updateCarousel();
      }
    }, { passive: true });

    updateCarousel();
    window.addEventListener('resize', () => { updateCarousel(); });
  }

  // ---------- SCROLL REVEAL ----------
  const revealElements = document.querySelectorAll(
    '.featured, .project-detail, .about-grid, .contact-unified, .sidebar-card, .section-header'
  );

  revealElements.forEach(el => el.classList.add('reveal'));

  const revealObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          revealObserver.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );

  revealElements.forEach(el => revealObserver.observe(el));

  // ---------- TERMINAL ANIMATION ----------
  const terminalMockup = document.querySelector('.terminal-mockup');
  if (terminalMockup) {
    const termObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            entry.target.classList.add('animated');
            termObserver.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.4 }
    );
    termObserver.observe(terminalMockup);
  }

  // ---------- SMOOTH ANCHOR SCROLL ----------
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth' });
      }
    });
  });

  // ---------- LANGUAGE SWITCHER DEMO ----------
  const langs = document.querySelectorAll('.lang-switcher-demo .lang');
  const disclaimer = document.querySelector('.lang-disclaimer');
  let currentLang = 'ca';

  // Complete translations — every data-i18n key and data-i18n-ph key
  const i18n = {
    eu: {
      // Nav
      'nav.projectes': 'Proiektuak',
      'nav.sobre': 'Niri buruz',
      'nav.contacta': 'Jarri harremanetan',
      // Hero
      'hero.tag': 'Garatzaile autonomoa · SaaS · Software soziala',
      'hero.title1': 'Tresna digitalak sortzen ditut',
      'hero.title2': 'aldea markatzen dutenak',
      'hero.desc': 'Kaixo, farmaziola! Nire izena <strong>Froilán Olesti i Casas</strong> da eta kode-garatzailea naiz, SaaS (Software as a Service) produktuetan eta <strong>gizarte-bokazioa</strong> duten tresna digitaletan espezializatua. Modu autonomoan lan egiten dut ideiak benetako arazoak konpontzen dituen software funtzionalean eraldatzeko.',
      'hero.btn1': 'Ikusi proiektuak',
      'hero.btn2': 'Hitz egingo dugu?',
      // Featured cards
      'fc.ext.label': 'Nabigatzaile-luzapenak',
      'fc.ext.title': 'Hizkuntza aldaketa',
      'fc.ext.desc': 'Eraman katalana, euskara eta galegoa zure nabigatzailera klik bakar batez.',
      'fc.sepe.label': 'Automatizazioa',
      'fc.sepe.title': 'SEPEren bot-a',
      'fc.sepe.desc': 'Estatuko Enplegu Zerbitzu Publikoarekin kudeaketak automatizatzen dituen bot-a.',
      'fc.bars.label': 'Mugikorrerako aplikazioa',
      'fc.bars.desc': 'Aurkitu Barçaren partidak ikusteko tabernak zure inguruan, non bizi zaren berdin.',
      // Projects section
      'proj.title': 'Nire proiektuak',
      'proj.subtitle': 'Beti ari naiz zerbait berrian lanean. Hemen dituzu energia eta ilusioz bete ditudan proiektuak.',
      // Project: Extensions
      'proj.ext.title': 'Hizkuntza aldaketarako luzapenak',
      'proj.ext.desc1': 'Hiru luzapen — <strong>En català, si us plau</strong>, <strong>Euskaraz, mesedez</strong> eta <strong>En galego, por favor</strong> — nabigatzailea bisitatzen ari garen web orriaren hizkuntza gutxitu hauetako bat duen bertsiora birbideratzeko aukera ematen dutenak klik bakar batez. Katalanez, euskaraz eta galegoz hitz egiten dutenentzat pentsatua, Interneten beren hizkuntzan erabat nabigatu nahi dutenentzat.',
      'proj.ext.note': '<strong>Chrome</strong>, <strong>Brave</strong>, <strong>Ecosia</strong> (eta beste Chromium nabigatzaileetan), <strong>Firefox</strong> eta <strong>Edge</strong> nabigatzaileetan erabilgarri. Laster <strong>Safari</strong> eta nabigatzaile gehiagotan.',
      // Project: SEPE
      'proj.sepe.desc': 'Bot batek <strong>Estatuko Enplegu Zerbitzu Publikoarekin (SEPE)</strong> kudeaketa aspergarrienak automatizatzen ditu. Burokrazia digital opaku eta motel batean nabigatu behar duten milaka pertsonen frustrazioak sortua. Tresna honek prozesuak errazten ditu eta denbora eta buruhausteak aurrezten ditu.',
      'proj.sepe.btn': 'Ikusi proiektua ↗',
      'proj.sepe.t1': 'Saioa hasitzen...',
      'proj.sepe.t2': 'Hitzordu erabilgarriak kontsultatzen...',
      'proj.sepe.t3': 'Hitzordua erreservatua: 2026/03/24, 10:30',
      // Project: troBar
      'proj.bars.desc': '<strong>troBar</strong>-ek laguntzen dizu <strong>FC Barcelona</strong>ren partidak ikusteko tabernak aurkitzen zure inguruan, non bizi zaren berdin. Barçari jarraitzea hobe delako laguntzarekin, giro onarekin eta garagardo on batekin. Zuzeneko partiduen informazioa, mapa interaktiboa eta kokapenaren araberako iragazkiak biltzen ditu.',
      'proj.bars.btn': 'Landing page ↗',
      'proj.bars.search': 'Non ikusi nahi duzu partida?',
      'proj.bars.match': 'Hurrengo partida · lr., apirilak 4, 21:00',
      'proj.bars.nav1': 'Partidak',
      'proj.bars.nav2': 'Mapa',
      'proj.bars.nav3': 'Profila',
      // Project: Stremio
      'fc.stremio.label': 'Streaming gehigarria',
      'fc.stremio.title': 'Stremio Katalanez',
      'fc.stremio.desc': 'Katalanezko filmen eta serieen katalogoa streaming plataforma guztietan.',
      'proj.stremio.title': 'Stremio Katalanez',
      'proj.stremio.desc': '<strong>Stremio</strong>rako gehigarria, streaming plataforma nagusietan <strong>katalanez eskuragarri dauden film eta serieen</strong> katalogo osoa eskaintzen duena: 3Cat, Filmin, Netflix, Prime Video, Disney+, Max, Movistar+ eta gehiago. Ikus-entzunezko edukiaz bere hizkuntzan gozatu nahi duen ororentzat pentsatua.',
      'proj.stremio.btn': 'Gehigarria instalatu ↗',
      // Project: Alerta Desnona
      'fc.alerta.label': 'Gizarte-justizia',
      'fc.alerta.title': 'Alerta Desnona',
      'fc.alerta.desc': 'Iberiar Penintsulako kaleratze-alertei buruzko mapa interaktiboa.',
      'proj.alerta.title': 'Alerta Desnona',
      'proj.alerta.desc': '<strong>Kaleratze-alerten</strong> aplikazioa Iberiar Penintsulari buruz. BOEn argitaratutako enkante eta kaleratzeak denbora errealean erakusten dituen <strong>mapa interaktibo</strong> batekin, herritarrek eta etxebizitza-plataformek egoera hauen aurrean antolatu eta jarduteko aukera emanez.',
      'proj.alerta.note': 'Push jakinarazpenak, posta elektronikoz alertak eta eremu geografikoaren araberako iragazki-sistema bat biltzen ditu.',
      // Project: Open Data Capture
      'fc.odc.label': 'Plataforma klinikoa',
      'fc.odc.desc': 'Kode irekiko plataforma datu klinikoen etengabeko bilketarako.',
      'proj.odc.desc': '<strong>Kode irekiko</strong> web plataforma <strong>datu klinikoen</strong> etengabeko bilketarako diseinatua. Tresna klinikoak urrunetik eta presentzialki administratzeko aukera ematen du, tresnak sortzeko sistema malgua, datuen bistaratzea eta eskariaren araberako esportazioa barne.',
      'proj.odc.note': '<strong>Douglas Neuroinformatics Platform</strong>eko proiektu baterako ekarpena. Eleaniztuna, lehenespenez segurua JWT autentifikazioarekin eta baimen granularrekin.',
      'proj.odc.btn': 'Proiektuaren weba ↗',
      // Newsletter
      'newsletter.title': 'Hileko buletina',
      'newsletter.desc.short': 'Jaso hilero nire proiektuen berritasunak. Spamik gabe, posta bat bakarrik.',
      'newsletter.btn': 'Harpidetu 📨',
      'newsletter.name.ph': 'Zure izena',
      'newsletter.email.ph': 'kaixo@adibidea.eus',
      // About
      'about.title': 'Helburudun softwarea',
      'about.p1': 'Uste dut teknologiak <strong>pertsonen bizitza hobetzeko</strong> balio behar duela. Horregatik nire denbora benetako arazoak konpontzen dituzten tresnak sortzen ematen dut — batez ere baztertutako edo ahulak diren komunitateei eragiten dietenak.',
      'about.p2': '<strong>Garatzaile autonomo</strong> gisa lan egiten dut, eta horrek nire balioekin lerrokatutako proiektuak aukeratzeko aukera ematen dit. Gizarte-eragina duen produktu digital baterako ideia baduzu, entzutea gustatuko litzaidake.',
      'about.v1.title': 'Gizarte-bokazioa',
      'about.v1.desc': 'Proiektu bakoitzak benetako arazo bat konpontzea bilatzen du.',
      'about.v2.title': 'Autonomia',
      'about.v2.desc': 'Proiektuaren kudeaketa integrala, ideiaren hasieratik hedapenera arte.',
      'about.v3.title': 'SaaS produktua',
      'about.v3.desc': 'Zerbitzu eskalagarri gisa softwarean espezializatua.',
      'about.quote': '«Teknologiarik onena gehien behar duenari bizitza errazten diona da.»',
      // Aixeta
      'aixeta.title.short': 'Eman laguntza',
      'aixeta.desc.short': 'Nire proiektuak gustuko badituzu, eman laguntza Aixetan. Tanta bakoitzak badu garrantzia!',
      // Contact
      'contact.title': 'Jarri harremanetan',
      'contact.desc': 'Proiekturen bat buruan duzu? Ideia baten inguruan hitz egin nahi duzu? Bete formularioa eta ahalik eta lasterren erantzungo dizut.',
      // Form
      'form.name': 'Izena',
      'form.email': 'Posta elektronikoa',
      'form.msg': 'Mezua',
      'form.submit': 'Mezua bidali',
      'form.name.ph': 'Zure izena',
      'form.email.ph': 'kaixo@adibidea.eus',
      'form.msg.ph': 'Kontatu zure ideia edo proiektua...',
      // Footer
      'footer.copy': 'Gizarte-bokaziodun software garapena',
      'footer.inici': 'Hasiera',
      'footer.contacte': 'Kontaktua',
    },
    gl: {
      // Nav
      'nav.projectes': 'Proxectos',
      'nav.sobre': 'Sobre min',
      'nav.contacta': 'Contacta comigo',
      // Hero
      'hero.tag': 'Desenvolvedor autónomo · SaaS · Software social',
      'hero.title1': 'Creo ferramentas dixitais',
      'hero.title2': 'que marcan a diferenza',
      'hero.desc': 'Ola, farmaciola! O meu nome é <strong>Froilán Olesti i Casas</strong> e son desenvolvedor de código especializado en produtos SaaS (Software as a Service) e ferramentas dixitais con <strong>vocación social</strong>. Traballo de forma autónoma para transformar ideas en software funcional que resolva problemas reais.',
      'hero.btn1': 'Ver proxectos',
      'hero.btn2': 'Falamos?',
      // Featured cards
      'fc.ext.label': 'Extensións de navegador',
      'fc.ext.title': 'Cambio de idioma',
      'fc.ext.desc': 'Leva o catalán, o éuscaro e o galego ao teu navegador cun só clic.',
      'fc.sepe.label': 'Automatización',
      'fc.sepe.title': 'Bot do SEPE',
      'fc.sepe.desc': 'Bot que automatiza as xestións co Servizo Público de Emprego Estatal.',
      'fc.bars.label': 'App móbil',
      'fc.bars.desc': 'Atopa bares onde ver os partidos do Barça preto de ti, vivas onde vivas.',
      // Projects section
      'proj.title': 'Os meus proxectos',
      'proj.subtitle': 'Sempre estou traballando en algo novo. Aquí tes os proxectos aos que lle dediquei máis enerxía e ilusión.',
      // Project: Extensions
      'proj.ext.title': 'Extensións de cambio de idioma',
      'proj.ext.desc1': 'Tres extensións — <strong>En català, si us plau</strong>, <strong>Euskaraz, mesedez</strong> e <strong>En galego, por favor</strong> — que permiten redirixir o navegador á versión da páxina web que esteamos visitando que conteña algunha destas linguas minorizadas cun só clic. Pensadas para falantes de catalán, éuscaro e galego que queren navegar por Internet plenamente na súa lingua.',
      'proj.ext.note': 'Dispoñibles para <strong>Chrome</strong>, <strong>Brave</strong>, <strong>Ecosia</strong> (e outros navegadores Chromium), <strong>Firefox</strong> e <strong>Edge</strong>. Proximamente para <strong>Safari</strong> e máis navegadores.',
      // Project: SEPE
      'proj.sepe.desc': 'Un bot que automatiza as xestións máis tediosas co <strong>Servizo Público de Emprego Estatal (SEPE)</strong>. Nacido da frustración compartida por miles de persoas que teñen que navegar por unha burocracia dixital opaca e lenta. Esta ferramenta facilita procesos e aforra tempo e dores de cabeza.',
      'proj.sepe.btn': 'Ver proxecto ↗',
      'proj.sepe.t1': 'Iniciando sesión...',
      'proj.sepe.t2': 'Consultando citas dispoñibles...',
      'proj.sepe.t3': 'Cita reservada: 24/03/2026, 10:30h',
      // Project: troBar
      'proj.bars.desc': '<strong>troBar</strong> axúdache a atopar bares onde ver os partidos do <strong>FC Barcelona</strong> preto de ti, vivas onde vivas. Porque seguir o Barça é mellor en compaña, cun bo ambiente e unha boa cervexa. Inclúe info de partidos en tempo real, mapa interactivo e filtros por ubicación.',
      'proj.bars.btn': 'Landing page ↗',
      'proj.bars.search': 'Onde queres ver o partido?',
      'proj.bars.match': 'Próximo partido · sáb., 4 de abr., 21:00',
      'proj.bars.nav1': 'Partidos',
      'proj.bars.nav2': 'Mapa',
      'proj.bars.nav3': 'Perfil',
      // Project: Stremio
      'fc.stremio.label': 'Complemento de streaming',
      'fc.stremio.title': 'Stremio en Catalán',
      'fc.stremio.desc': 'Catálogo de películas e series en catalán en tódalas plataformas de streaming.',
      'proj.stremio.title': 'Stremio en Catalán',
      'proj.stremio.desc': 'Un complemento para <strong>Stremio</strong> que ofrece un catálogo completo de <strong>películas e series dispoñibles en catalán</strong> nas principais plataformas de streaming: 3Cat, Filmin, Netflix, Prime Video, Disney+, Max, Movistar+ e máis. Pensado para todos os que queiran gozar de contido audiovisual na súa lingua.',
      'proj.stremio.btn': 'Instalar complemento ↗',
      // Project: Alerta Desnona
      'fc.alerta.label': 'Xustiza social',
      'fc.alerta.title': 'Alerta Desnona',
      'fc.alerta.desc': 'Mapa interactivo de alertas de desafiuzamentos na Península Ibérica.',
      'proj.alerta.title': 'Alerta Desnona',
      'proj.alerta.desc': 'Unha aplicación de <strong>alertas de desafiuzamentos</strong> na Península Ibérica. Cun <strong>mapa interactivo</strong> que amosa en tempo real as póxas e desafiuzamentos publicados no BOE, permitindo á cidadanía e ás plataformas de vivenda organizarse e actuar ante estas situacións.',
      'proj.alerta.note': 'Inclúe notificacións push, alertas por correo electrónico e un sistema de filtraxe por zona xeográfica.',
      // Project: Open Data Capture
      'fc.odc.label': 'Plataforma clínica',
      'fc.odc.desc': 'Plataforma de código aberto para a recollida continua de datos clínicos.',
      'proj.odc.desc': 'Plataforma web de <strong>código aberto</strong> deseñada para a recollida continua de <strong>datos clínicos</strong>. Permite administrar instrumentos clínicos de forma remota e presencial, cun sistema flexible de creación de instrumentos, visualización de datos e exportación baixo demanda.',
      'proj.odc.note': 'Contribución a un proxecto do <strong>Douglas Neuroinformatics Platform</strong>. Multilingue, seguro por defecto con autenticación JWT e permisos granulares.',
      'proj.odc.btn': 'Web do proxecto ↗',
      // Newsletter
      'newsletter.title': 'Boletín mensual',
      'newsletter.desc.short': 'Recibe cada mes as novidades dos meus proxectos. Sen spam, só un correo.',
      'newsletter.btn': 'Subscríbeme 📨',
      'newsletter.name.ph': 'O teu nome',
      'newsletter.email.ph': 'ola@exemplo.gal',
      // About
      'about.title': 'Software con propósito',
      'about.p1': 'Creo que a tecnoloxía debe servir para <strong>mellorar a vida das persoas</strong>. Por iso dedico o meu tempo a crear ferramentas que resolvan problemas reais — especialmente aqueles que afectan a comunidades desatendidas ou vulnerables.',
      'about.p2': 'Traballo como <strong>desenvolvedor autónomo</strong>, o que me permite escoller proxectos aliñados cos meus valores. Se tes unha idea para un produto dixital con impacto social, encantaríame escoitala.',
      'about.v1.title': 'Vocación social',
      'about.v1.desc': 'Cada proxecto busca resolver un problema real.',
      'about.v2.title': 'Autonomía',
      'about.v2.desc': 'Xestión integral do proxecto, dende a idea ata o despregamento.',
      'about.v3.title': 'Produto SaaS',
      'about.v3.desc': 'Especializado en software como servizo escalable.',
      'about.quote': '«A mellor tecnoloxía é a que lle fai a vida máis fácil a quen máis o necesita.»',
      // Aixeta
      'aixeta.title.short': 'Dáme apoio',
      'aixeta.desc.short': 'Se che gustan os meus proxectos, dáme apoio na Aixeta. Cada gota conta!',
      // Contact
      'contact.title': 'Contacta comigo',
      'contact.desc': 'Tes un proxecto en mente? Queres falar sobre unha idea? Enche o formulario e respondereiche canto antes.',
      // Form
      'form.name': 'Nome',
      'form.email': 'Correo electrónico',
      'form.msg': 'Mensaxe',
      'form.submit': 'Enviar mensaxe',
      'form.name.ph': 'O teu nome',
      'form.email.ph': 'ola@exemplo.gal',
      'form.msg.ph': 'Cóntame a túa idea ou proxecto...',
      // Footer
      'footer.copy': 'Desenvolvemento de software con vocación social',
      'footer.inici': 'Inicio',
      'footer.contacte': 'Contacto',
    }
  };

  // Store original innerHTML/placeholders for CA restoration
  const originals = new Map();

  function collectOriginals() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
      originals.set(el, el.innerHTML);
    });
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      originals.set('ph:' + el.getAttribute('data-i18n-ph'), el.placeholder);
    });
  }

  function translatePage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Show/hide disclaimer
    if (disclaimer) {
      disclaimer.classList.toggle('visible', lang !== 'ca');
    }

    if (lang === 'ca') {
      // Restore all originals
      document.querySelectorAll('[data-i18n]').forEach(el => {
        if (originals.has(el)) {
          el.innerHTML = originals.get(el);
        }
      });
      document.querySelectorAll('[data-i18n-ph]').forEach(el => {
        const key = 'ph:' + el.getAttribute('data-i18n-ph');
        if (originals.has(key)) {
          el.placeholder = originals.get(key);
        }
      });
      return;
    }

    const dict = i18n[lang];
    if (!dict) return;

    // Translate all data-i18n elements
    document.querySelectorAll('[data-i18n]').forEach(el => {
      const key = el.getAttribute('data-i18n');
      if (dict[key]) {
        el.innerHTML = dict[key];
      }
    });

    // Translate all placeholders
    document.querySelectorAll('[data-i18n-ph]').forEach(el => {
      const key = el.getAttribute('data-i18n-ph');
      if (dict[key]) {
        el.placeholder = dict[key];
      }
    });
  }

  if (langs.length) {
    collectOriginals();

    langs.forEach(lang => {
      lang.addEventListener('click', () => {
        langs.forEach(l => l.classList.remove('active'));
        lang.classList.add('active');
        translatePage(lang.dataset.lang);
      });

      lang.addEventListener('mouseenter', () => {
        langs.forEach(l => l.classList.remove('active'));
        lang.classList.add('active');
      });
    });

    const container = document.querySelector('.lang-switcher-demo');
    container.addEventListener('mouseleave', () => {
      langs.forEach(l => l.classList.remove('active'));
      const activeLang = container.querySelector(`[data-lang="${currentLang}"]`);
      if (activeLang) activeLang.classList.add('active');
    });
  }

  // ---------- NEWSLETTER FORM (Web3Forms) ----------
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = nlForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const name = nlForm.querySelector('#nl-name').value.trim();
      const email = nlForm.querySelector('#nl-email').value.trim();
      if (!name || !email) return;

      btn.textContent = 'Enviant...';
      btn.disabled = true;

      try {
        const formData = new FormData();
        formData.append('access_key', 'fa15478a-a76d-4a21-bfb8-3168d774d4da');
        formData.append('subject', 'Nova subscripció al Butlletí de frolesti');
        formData.append('from_name', 'Portfoli Frolesti — Newsletter');
        formData.append('name', name);
        formData.append('email', email);
        formData.append('message', `Nova subscripció al butlletí:\nNom: ${name}\nEmail: ${email}\nData: ${new Date().toISOString()}`);

        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (data.success) {
          btn.textContent = 'Subscrit correctament ✓';
          btn.style.background = 'var(--accent-2)';
          btn.style.color = '#fff';
          nlForm.reset();
        } else {
          btn.textContent = 'Error. Torna-ho a provar.';
          btn.style.background = '#c0392b';
          btn.style.color = '#fff';
        }
      } catch (err) {
        btn.textContent = 'Error de connexió.';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
      }

      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 4000);
    });
  }

  // ---------- CONTACT FORM (Web3Forms) ----------
  const form = document.getElementById('contactForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = form.querySelector('button[type="submit"]');
      const originalText = btn.textContent;

      // Validate
      const name = form.querySelector('#name').value.trim();
      const email = form.querySelector('#email').value.trim();
      const message = form.querySelector('#message').value.trim();
      if (!name || !email || !message) return;

      // Sending state
      btn.textContent = 'Enviant...';
      btn.disabled = true;

      try {
        const formData = new FormData(form);
        const res = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          body: formData
        });

        const data = await res.json();

        if (data.success) {
          btn.textContent = 'Missatge enviat correctament ✓';
          btn.style.background = 'var(--accent-2)';
          btn.style.color = '#fff';
          form.reset();
        } else {
          btn.textContent = 'Error en enviar. Torna-ho a provar.';
          btn.style.background = '#c0392b';
          btn.style.color = '#fff';
        }
      } catch (err) {
        btn.textContent = 'Error de connexió. Torna-ho a provar.';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
      }

      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 4000);
    });
  }

  // ---------- ACTIVE SECTION HIGHLIGHT ----------
  const sections = document.querySelectorAll('section[id], header[id]');
  const navAnchors = document.querySelectorAll('.nav-links a:not(.nav-cta)');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          navAnchors.forEach(a => {
            a.classList.toggle(
              'active-section',
              a.getAttribute('href') === `#${id}`
            );
          });
        }
      });
    },
    { threshold: 0.3 }
  );

  sections.forEach(section => sectionObserver.observe(section));

});
