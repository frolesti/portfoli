/* ================================================
  FROLESTI — main.js
  Nav scroll · Mobile menu · Scroll reveal · Form
  ================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---------- PROFILE (social / professional) ----------
  // Es mostra una pantalla d'entrada la primera visita per triar perfil.
  // Es recorda a localStorage i es pot canviar des de la nav.
  const PROFILE_KEY = 'frolesti-profile';
  const PROFILE_LABELS = { social: 'Social', professional: 'Professional' };
  const profileSplash = document.getElementById('profileSplash');
  const profileSwitchValue = document.getElementById('profileSwitchValue');
  const profileSwitchBtn = document.getElementById('profileSwitchBtn');
  const profileSwitchBtnMobile = document.getElementById('profileSwitchBtnMobile');
  const PROJECT_RETURN_KEY = 'portfolio-return-state';

  const profileCopyTargets = {
    heroTag: document.getElementById('heroTag'),
    heroDescription: document.getElementById('heroDescription'),
    projectsSubtitle: document.getElementById('projectsSubtitle'),
    newsletterBandTitle: document.getElementById('newsletterBandTitle'),
    newsletterBandDesc: document.getElementById('newsletterBandDesc'),
    nlPopupTitle: document.getElementById('nlPopupTitle'),
    nlPopupDesc: document.getElementById('nlPopupDesc'),
    aboutTitle: document.getElementById('aboutTitle'),
    aboutP1: document.getElementById('aboutP1'),
    aboutP2: document.getElementById('aboutP2'),
    aboutValues: document.getElementById('aboutValues'),
    aboutQuote: document.querySelector('.about-quote'),
    aboutSkills: document.querySelector('.skills-cloud'),
  };

  const profileCopy = {
    professional: {
      heroTag: 'Desenvolupador freelance · SaaS · Producte digital',
      heroDescription: "Ajudo a empreses i entitats a convertir necessitats de negoci en <strong>productes digitals pràctics</strong>. Dissenyo i desenvolupo solucions SaaS (Software as a Service), automatitzacions i eines internes personalitzades enfocades a <strong>l'anàlisi de dades, l'optimització de processos i la millora de l'experiència d'usuari</strong>.",
      projectsSubtitle: 'Aquests són els projectes orientats a negoci: es tracta de productes validats, que ja estan en producció per clients reals i que testifiquen la nostra implicació i la nostra manera de fer.',
      newsletterTitle: 'Butlletí mensual',
      newsletterDesc: 'Rep cada mes les novetats dels meus projectes.',
      aboutTitle: 'Producte digital amb impacte real en el negoci',
      aboutP1: "Sóc desenvolupador freelance especialitzat en <strong>SaaS, automatitzacions, integracions, plugins i eines internes a mida</strong>. Treballo amb equips petits que necessiten anar ràpid: dissenyo, construeixo i desplego solucions <strong>end-to-end</strong>, des del primer prototip fins al manteniment en producció.",
      aboutP2: "Penso en termes de <strong>negoci</strong>: cada decisió tècnica busca reduir costos operatius, alliberar hores a l'equip o obrir nous canals d'ingressos.",
      aboutQuote: '«La millor tecnologia és la que converteix objectius de negoci en resultats mesurables.»',
      aboutSkills: ['TypeScript', 'Node.js', 'React', 'Next.js', 'PostgreSQL', 'Docker', 'AWS', 'Supabase', 'CI/CD', 'APIs REST', 'Arquitectura SaaS', 'Integracions'],
      aboutValues: [
        { icon: '◆', title: 'End-to-end', desc: 'Producte, codi, infraestructura i manteniment, sense haver de coordinar diversos proveïdors.' },
        { icon: '◆', title: 'Orientat a resultats', desc: 'Cada projecte es justifica en hores estalviades, ingressos generats o riscos reduïts.' },
        { icon: '◆', title: 'Cost operatiu baix', desc: 'Arquitectures pensades per oferir experiència premium sense factures impossibles de mantenir.' }
      ],
    },
    social: {
      heroTag: 'Desenvolupador autònom · Software social · Llengua i drets digitals',
      heroDescription: "Creo i comparteixo eines digitals amb <strong>vocació social</strong> per fer tecnologia més accessible, útil i arrelada al territori. Aquest espai és sobretot d'<strong>exposició de projectes</strong> amb impacte en comunitat, llengua i drets digitals.",
      projectsSubtitle: "Projectes socials i oberts que neixen de necessitats reals de la comunitat: experiments, prototips i eines que volen aportar valor públic.",
      newsletterTitle: 'Butlletí mensual',
      newsletterDesc: 'Rep cada mes les novetats dels meus projectes.',
      aboutTitle: 'Software amb propòsit',
      aboutP1: "Crec que la tecnologia ha de servir per <strong>millorar la vida de totes les persones</strong> i no només de les que s'ho poden permetre. És per això que dedico bona part del meu temps a construir eines que tenen sentit per a la meva comunitat: <strong>eines per protegir la llengua, els drets digitals i que puguin garantir l'accés a serveis públics</strong>.",
      aboutP2: "Treballo com a desenvolupador autònom, prioritzant projectes <strong>de codi obert</strong>, sostenibles i amb impacte mesurable més enllà del compte de resultats. Quan una idea pot fer fàcil el que avui és difícil per a molta gent, val la pena dedicar-hi temps.",
      aboutQuote: '«La millor tecnologia és la que fa la vida més fàcil a qui més ho necessita.»',
      aboutSkills: ['JavaScript', 'TypeScript', 'Python', 'React', 'Node.js', 'React Native', 'Firebase', 'Open source', 'Accessibilitat', 'Dades públiques', 'APIs REST', 'Docker'],
      aboutValues: [
        { icon: '◆', title: 'Vocació social', desc: 'Llengua, drets digitals i accés a serveis públics com a eixos del que faig.' },
        { icon: '◆', title: 'Autonomia', desc: 'Eines independents, fàcils de fer servir i gratuïtes.' },
        { icon: '◆', title: 'Productes sòlids', desc: 'Es tracta de projectes autocontinguts, mantinguts periòdicament i amb un impacte mesurable.' }
      ],
    }
  };

  function readProfile() {
    try { return localStorage.getItem(PROFILE_KEY); } catch { return null; }
  }
  function writeProfile(value) {
    try { localStorage.setItem(PROFILE_KEY, value); } catch {}
  }
  function getActiveProfile() {
    const currentBody = document.body.getAttribute('data-profile');
    if (currentBody === 'social' || currentBody === 'professional') return currentBody;
    const currentHtml = document.documentElement.getAttribute('data-profile');
    return (currentHtml === 'social' || currentHtml === 'professional') ? currentHtml : 'professional';
  }
  function applyProfileCopy(profile) {
    const copy = profileCopy[profile];
    if (!copy) return;
    if (profileCopyTargets.heroTag) profileCopyTargets.heroTag.textContent = copy.heroTag;
    if (profileCopyTargets.heroDescription) profileCopyTargets.heroDescription.innerHTML = copy.heroDescription;
    if (profileCopyTargets.projectsSubtitle) profileCopyTargets.projectsSubtitle.textContent = copy.projectsSubtitle;
    if (profileCopyTargets.newsletterBandTitle) profileCopyTargets.newsletterBandTitle.textContent = copy.newsletterTitle;
    if (profileCopyTargets.newsletterBandDesc) profileCopyTargets.newsletterBandDesc.textContent = copy.newsletterDesc;
    if (profileCopyTargets.nlPopupTitle) profileCopyTargets.nlPopupTitle.textContent = copy.newsletterTitle;
    if (profileCopyTargets.nlPopupDesc) profileCopyTargets.nlPopupDesc.textContent = copy.newsletterDesc;
    if (profileCopyTargets.aboutTitle) profileCopyTargets.aboutTitle.textContent = copy.aboutTitle;
    if (profileCopyTargets.aboutP1) profileCopyTargets.aboutP1.innerHTML = copy.aboutP1;
    if (profileCopyTargets.aboutP2) profileCopyTargets.aboutP2.innerHTML = copy.aboutP2;
    if (profileCopyTargets.aboutQuote && copy.aboutQuote) {
      profileCopyTargets.aboutQuote.textContent = copy.aboutQuote;
    }
    if (profileCopyTargets.aboutSkills && Array.isArray(copy.aboutSkills)) {
      profileCopyTargets.aboutSkills.innerHTML = copy.aboutSkills
        .map((skill) => '<span>' + skill + '</span>')
        .join('');
    }
    if (profileCopyTargets.aboutValues && Array.isArray(copy.aboutValues)) {
      profileCopyTargets.aboutValues.innerHTML = copy.aboutValues
        .map((v) => (
          '<div class="value-item">' +
            '<span class="value-icon">' + (v.icon || '◆') + '</span>' +
            '<div>' +
              '<strong>' + v.title + '</strong>' +
              '<p>' + v.desc + '</p>' +
            '</div>' +
          '</div>'
        ))
        .join('');
    }
  }
  function applyProfile(profile) {
    if (profile !== 'social' && profile !== 'professional') return;
    document.documentElement.setAttribute('data-profile', profile);
    document.body.setAttribute('data-profile', profile);
    if (profileSwitchValue) profileSwitchValue.textContent = PROFILE_LABELS[profile];
    if (profileSwitchBtn) {
      profileSwitchBtn.title = profile === 'professional' ? 'Canviar a perfil social' : 'Canviar a perfil professional';
    }
    applyProfileCopy(profile);
  }
  function hideSplash() {
    if (!profileSplash) return;
    profileSplash.classList.remove('is-visible');
    setTimeout(() => { profileSplash.hidden = true; }, 400);
  }
  function showSplash() {
    if (!profileSplash) return;
    profileSplash.hidden = false;
    requestAnimationFrame(() => profileSplash.classList.add('is-visible'));
  }

  const storedProfile = readProfile();
  if (storedProfile === 'social' || storedProfile === 'professional') {
    applyProfile(storedProfile);
  } else {
    // Perfil per defecte: professional. El modal només es mostra a la primera visita.
    applyProfile('professional');
    showSplash();
  }

  if (profileSplash) {
    profileSplash.querySelectorAll('[data-profile-choice]').forEach((btn) => {
      btn.addEventListener('click', () => {
        const choice = btn.getAttribute('data-profile-choice');
        if (choice !== 'social' && choice !== 'professional') return;
        writeProfile(choice);
        applyProfile(choice);
        hideSplash();
        if (typeof trackGoatEvent === 'function') {
          trackGoatEvent('profile-selected-' + choice, 'Profile selected ' + choice);
        }
      });
    });
  }

  const triggerSwitch = () => {
    const nextProfile = getActiveProfile() === 'professional' ? 'social' : 'professional';
    writeProfile(nextProfile);
    applyProfile(nextProfile);
    if (typeof trackGoatEvent === 'function') {
      trackGoatEvent('profile-toggled-' + nextProfile, 'Profile toggled ' + nextProfile);
    }
  };
  profileSwitchBtn?.addEventListener('click', triggerSwitch);
  profileSwitchBtnMobile?.addEventListener('click', () => {
    // Close mobile menu first
    document.getElementById('mobileMenu')?.classList.remove('open');
    document.querySelector('.nav-toggle')?.classList.remove('active');
    triggerSwitch();
  });

  function saveProjectReturnState(projectId) {
    try {
      const state = {
        projectId,
        scrollY: window.scrollY,
        profile: getActiveProfile(),
        ts: Date.now(),
      };
      sessionStorage.setItem(PROJECT_RETURN_KEY, JSON.stringify(state));
    } catch {
      // ignore storage failures
    }
  }

  function makeProjectVisualsClickable() {
    const visuals = document.querySelectorAll('.project-detail[id] .project-visual');
    if (!visuals.length) return;

    visuals.forEach((visual) => {
      const article = visual.closest('.project-detail[id]');
      const projectId = article?.id;
      if (!projectId) return;
      if (!visual) return;
      if (visual.classList.contains('is-clickable')) return;

      visual.classList.add('is-clickable');
      visual.setAttribute('role', 'link');
      visual.setAttribute('tabindex', '0');
      const url = 'producte.html?project=' + encodeURIComponent(projectId);
      visual.setAttribute('aria-label', "Veure article complet del projecte");

      const go = () => {
        saveProjectReturnState(projectId);
        window.location.href = url;
      };

      visual.addEventListener('click', (ev) => {
        // Permet seguir enllaços interns del mockup (per exemple, ext-links-grid)
        // o interactuar amb demos com el selector d'idioma.
        if (ev.target.closest('a, button, .lang-switcher-demo, .browser-icon-links')) return;
        ev.preventDefault();
        go();
      });

      visual.addEventListener('keydown', (ev) => {
        if (ev.key === 'Enter' || ev.key === ' ') {
          ev.preventDefault();
          go();
        }
      });
    });
  }

  function restoreProjectReturnStateIfNeeded() {
    const params = new URLSearchParams(window.location.search);
    if (params.get('restore') !== '1') return;

    try {
      const raw = sessionStorage.getItem(PROJECT_RETURN_KEY);
      if (!raw) return;

      const state = JSON.parse(raw);
      if (!state || typeof state.scrollY !== 'number') return;

      if (state.profile === 'social' || state.profile === 'professional') {
        applyProfile(state.profile);
      }

      requestAnimationFrame(() => {
        window.scrollTo({ top: state.scrollY, left: 0, behavior: 'auto' });

        const target = state.projectId ? document.getElementById(state.projectId) : null;
        if (target) {
          target.classList.add('is-return-target');
          setTimeout(() => target.classList.remove('is-return-target'), 1800);
        }
      });
    } catch {
      // ignore malformed payload
    }
  }

  makeProjectVisualsClickable();
  restoreProjectReturnStateIfNeeded();

  // ---------- AIXETA DONATION POPUP ----------
  (function initAixetaPopup() {
    const backdrop = document.getElementById('aixetaPopupBackdrop');
    const popup    = document.getElementById('aixetaPopup');
    const closeBtn = document.getElementById('aixetaPopupClose');
    const banner   = document.getElementById('aixetaBanner');
    if (!backdrop || !popup || !banner) return;

    const STORAGE_KEY = 'aixeta-popup-dismissed';
    let shown = false;

    function showPopup() {
      if (shown) return;
      try { if (sessionStorage.getItem(STORAGE_KEY)) return; } catch {}
      shown = true;
      backdrop.hidden = false;
      requestAnimationFrame(() => backdrop.classList.add('is-visible'));
      document.body.style.overflow = 'hidden';
    }

    function hidePopup() {
      backdrop.classList.remove('is-visible');
      setTimeout(() => { backdrop.hidden = true; }, 350);
      document.body.style.overflow = '';
      try { sessionStorage.setItem(STORAGE_KEY, '1'); } catch {}
    }

    closeBtn.addEventListener('click', hidePopup);
    backdrop.addEventListener('click', (e) => {
      if (e.target === backdrop) hidePopup();
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !backdrop.hidden) hidePopup();
    });

    const observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting) {
        setTimeout(showPopup, 600);
        observer.disconnect();
      }
    }, { threshold: 0.3 });

    observer.observe(banner);
  })();

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

  // ---------- ANALYTICS CONSENT / GA4 ----------
  const analyticsBanner = document.getElementById('analyticsBanner');
  const analyticsAcceptBtn = document.getElementById('analyticsAcceptBtn');
  const analyticsRejectBtn = document.getElementById('analyticsRejectBtn');
  const gaMeasurementId = window.GA_MEASUREMENT_ID || '';
  const analyticsStorageKey = 'frolesti-analytics-consent';
  let analyticsLoaded = false;
  let newsletterPopupOpen = false;
  let analyticsHideTimer = null;

  function readAnalyticsConsent() {
    try {
      return localStorage.getItem(analyticsStorageKey);
    } catch {
      return null;
    }
  }

  function writeAnalyticsConsent(value) {
    try {
      localStorage.setItem(analyticsStorageKey, value);
    } catch {
      /* ignore storage failures */
    }
  }

  function canTrackAnalytics() {
    return readAnalyticsConsent() === 'granted' && typeof window.gtag === 'function';
  }

  function loadGoogleAnalytics() {
    if (analyticsLoaded || !gaMeasurementId) return;
    analyticsLoaded = true;

    window.dataLayer = window.dataLayer || [];
    window.gtag = window.gtag || function gtag() {
      window.dataLayer.push(arguments);
    };

    const script = document.createElement('script');
    script.async = true;
    script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(gaMeasurementId)}`;
    document.head.appendChild(script);

    window.gtag('js', new Date());
    window.gtag('config', gaMeasurementId, {
      anonymize_ip: true,
      allow_google_signals: false,
      allow_ad_personalization_signals: false,
      send_page_view: true,
    });
  }

  function setAnalyticsConsent(value) {
    writeAnalyticsConsent(value);

    if (value === 'granted') {
      loadGoogleAnalytics();
      trackGoogleEvent('consent_update', { analytics_storage: 'granted' });
    }

    if (analyticsBanner) {
      analyticsBanner.classList.remove('is-visible');
      if (analyticsHideTimer) clearTimeout(analyticsHideTimer);
      analyticsHideTimer = setTimeout(() => {
        analyticsBanner.hidden = true;
      }, 260);
    }
  }

  function showAnalyticsBanner() {
    const consent = readAnalyticsConsent();
    if (!analyticsBanner || consent === 'granted' || consent === 'denied' || newsletterPopupOpen) return;

    analyticsBanner.hidden = false;
    requestAnimationFrame(() => {
      analyticsBanner.classList.add('is-visible');
    });
  }

  function hideAnalyticsBanner() {
    if (!analyticsBanner) return;

    analyticsBanner.classList.remove('is-visible');
    if (analyticsHideTimer) clearTimeout(analyticsHideTimer);
    analyticsHideTimer = setTimeout(() => {
      analyticsBanner.hidden = true;
    }, 260);
  }

  function syncAnalyticsBanner() {
    const consent = readAnalyticsConsent();
    if (consent === 'granted' || consent === 'denied' || newsletterPopupOpen) {
      hideAnalyticsBanner();
      return;
    }

    showAnalyticsBanner();
  }

  function trackGoogleEvent(eventName, params = {}) {
    if (!canTrackAnalytics()) return;
    window.gtag('event', eventName, params);
  }

  const storedConsent = readAnalyticsConsent();
  if (storedConsent === 'granted') {
    loadGoogleAnalytics();
  } else if (analyticsBanner) {
    syncAnalyticsBanner();
  }

  analyticsAcceptBtn?.addEventListener('click', () => setAnalyticsConsent('granted'));
  analyticsRejectBtn?.addEventListener('click', () => setAnalyticsConsent('denied'));

  // ---------- SCROLL REVEAL ----------
  const revealElements = document.querySelectorAll(
    '.project-detail, .about-grid, .footer-aixeta, .contact-unified, .sidebar-card, .section-header'
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
  const terminalMockups = document.querySelectorAll('.terminal-mockup');
  if (terminalMockups.length) {
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
    terminalMockups.forEach((mockup) => termObserver.observe(mockup));
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
      'nav.testimonis': 'Testigantzak',
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
      'fc.aparador.label': 'Argazki-biltegia',
      'fc.aparador.desc': 'Argazkilarientzako album pribatuak, sarbide kodearekin, jatorrizko deskargekin eta aukerako dohaintzekin.',
      'fc.inspecciona.label': 'Nabigatzaile-luzapena',
      'fc.inspecciona.desc': 'Katalanezko zuzentzaile ortografikoa, gramatikala eta tipografikoa zure nabigatzailean.',
      'fc.skills.label': 'IA ingeniaritzako txantiloia',
      'fc.skills.title': 'Base Skills Repo',
      'fc.skills.desc': 'Copilot optimizatuarekin biltegiak abiatzeko gaitasun, agindu eta agentez osatutako oinarri berrerabilgarria.',
      // Projects section
      'proj.title': 'Nire proiektuak',
      'proj.subtitle': 'Beti ari naiz zerbait berrian lanean. Hemen dituzu energia eta ilusioz bete ditudan proiektuak.',
      // Project: Extensions
      'proj.ext.title': 'Hizkuntza aldaketarako luzapenak',
      'proj.ext.desc1': 'Hiru luzapen — <strong>En català, si us plau</strong>, <strong>Euskaraz, mesedez</strong> eta <strong>En galego, por favor</strong> — nabigatzailea bisitatzen ari garen web orriaren hizkuntza gutxitu hauetako bat duen bertsiora birbideratzeko aukera ematen dutenak klik bakar batez. Katalanez, euskaraz eta galegoz hitz egiten dutenentzat pentsatua, Interneten beren hizkuntzan erabat nabigatu nahi dutenentzat.',
      'proj.ext.note': '<strong>Chrome</strong>, <strong>Brave</strong>, <strong>Ecosia</strong> (eta beste Chromium nabigatzaileetan), <strong>Firefox</strong> eta <strong>Edge</strong> nabigatzaileetan erabilgarri. Laster <strong>Safari</strong> eta nabigatzaile gehiagotan.',
      // Project: Inspecciona
      'proj.inspecciona.title': 'Inspecciona — katalanerako zuzentzailea',
      'proj.inspecciona.desc1': 'Luzapen bat <strong>katalanez</strong> idatzitako edozein testu eremu zuzentzeko nabigatzailean. <strong>Softcatalà</strong>ren APIa erabiltzen du akats ortografikoak, gramatikalak eta tipografikoak detektatzeko, eta sinonimoen bilaketa eta autoosatzea ere eskaintzen ditu.',
      'proj.inspecciona.note': '<strong>Chrome</strong>, <strong>Brave</strong>, <strong>Ecosia</strong> eta beste Chromium nabigatzaileetan eskuragarri. Laster <strong>Firefox</strong>, <strong>Edge</strong> eta <strong>Safari</strong> nabigatzaileetan.',
      // Project: SEPE
      'proj.sepe.desc': 'Bot batek <strong>Estatuko Enplegu Zerbitzu Publikoarekin (SEPE)</strong> kudeaketa aspergarrienak automatizatzen ditu. Burokrazia digital opaku eta motel batean nabigatu behar duten milaka pertsonen frustrazioak sortua. Tresna honek prozesuak errazten ditu eta denbora eta buruhausteak aurrezten ditu.',
      'proj.sepe.btn': 'Ikusi proiektua',
      'proj.sepe.t1': 'Saioa hasitzen...',
      'proj.sepe.t2': 'Hitzordu erabilgarriak kontsultatzen...',
      'proj.sepe.t3': 'Hitzordua erreservatua: 2026/03/24, 10:30',
      // Project: troBar
      'proj.bars.desc': '<strong>troBar</strong>-ek laguntzen dizu <strong>FC Barcelona</strong>ren partidak ikusteko tabernak aurkitzen zure inguruan, non bizi zaren berdin. Barçari jarraitzea hobe delako laguntzarekin, giro onarekin eta garagardo on batekin. Zuzeneko partiduen informazioa, mapa interaktiboa eta kokapenaren araberako iragazkiak biltzen ditu.',
      'proj.bars.btn': 'Landing page',
      'proj.bars.search': 'Non ikusi nahi duzu partida?',
      'proj.bars.match': 'Hurrengo partida · lr., apirilak 4, 21:00',
      'proj.bars.nav1': 'Partidak',
      'proj.bars.nav2': 'Mapa',
      'proj.bars.nav3': 'Profila',
      // Project: Aparador
      'proj.aparador.desc': '<strong>Aparador</strong> web plataforma bat da, <strong>argazkilariek</strong> beren albumak beren <strong>ikusleekin</strong> sarbide-kodeen bidez partekatu ahal izateko sortua. Ikusleek eroso nabigatu dezakete, argazkiak galerian ikusi eta jatorrizko bereizmenean deskargatu.',
      'proj.aparador.note': 'Stripe bidezko aukerako dohaintzak, albumak eta argazki igoerak kudeatzeko dashboard bat, eta kostuak baxu mantentzeko arkitektura arina biltzen ditu.',
      'proj.aparador.btn': 'Laster…',
      // Project: Base Skills Repo
      'proj.skills.title': 'Base Skills Repo',
      'proj.skills.desc1': '<strong>Base Skills Repo</strong> hasierako biltegi bat da proiektuak <strong>GitHub Copilot</strong> ondo konfiguratuta abiatzeko. Ezagutza geruzetan antolatzen du (jarraibideak, gaitasunak, aginduak, txat-moduak eta repo memoria), agenteak zeregin bakoitzean dagokion testuingurua bakarrik karga dezan.',
      'proj.skills.note': '<strong>Hasierako abioko</strong> mekanismoa dakar: oinarri teknologikoa detektatzen du edo galdetzen du, pakete egokiak aktibatzen ditu eta repoa prest uzten du zehaztasun handiagoz eta token kostu txikiagoarekin lan egiteko.',
      'proj.skills.btn': 'GitHub',
      'proj.skills.t1': 'Oinarri teknologikoa eta lehentasunak detektatzen...',
      'proj.skills.t2': 'Jarraibide, gaitasun eta agindu garrantzitsuak aktibatzen...',
      'proj.skills.t3': 'Repo prest: testuinguru doitua eta token kostu murriztua.',
      // Project: Stremio
      'fc.stremio.label': 'Streaming gehigarria',
      'fc.stremio.title': 'Stremio Katalanez',
      'fc.stremio.desc': 'Katalanezko filmen eta serieen katalogoa streaming plataforma guztietan.',
      'proj.stremio.title': 'Stremio Katalanez',
      'proj.stremio.desc': '<strong>Stremio</strong>rako gehigarria, streaming plataforma nagusietan <strong>katalanez eskuragarri dauden film eta serieen</strong> katalogo osoa eskaintzen duena: 3Cat, Filmin, Netflix, Prime Video, Disney+, Max, Movistar+ eta gehiago. Ikus-entzunezko edukiaz bere hizkuntzan gozatu nahi duen ororentzat pentsatua.',
      'proj.stremio.btn': 'Gehigarria instalatu',
      // Project: Alerta Desnona
      'fc.alerta.label': 'Gizarte-justizia',
      'fc.alerta.title': 'Alerta Desnona',
      'fc.alerta.desc': 'Iberiar Penintsulako kaleratze-alertei buruzko mapa interaktiboa.',
      'proj.alerta.title': 'Alerta Desnona',
      'proj.alerta.desc': '<strong>Kaleratze-alerten</strong> aplikazioa Iberiar Penintsulari buruz. BOEn argitaratutako enkante eta kaleratzeak denbora errealean erakusten dituen <strong>mapa interaktibo</strong> batekin, herritarrek eta etxebizitza-plataformek egoera hauen aurrean antolatu eta jarduteko aukera emanez.',
      'proj.alerta.note': 'Push jakinarazpenak, posta elektronikoz alertak eta eremu geografikoaren araberako iragazki-sistema bat biltzen ditu.',
      'proj.alerta.btn': 'Beta ikusi',
      // Project: Open Data Capture
      'fc.odc.label': 'Plataforma klinikoa',
      'fc.odc.desc': 'Kode irekiko plataforma datu klinikoen etengabeko bilketarako.',
      'proj.odc.desc': '<strong>Kode irekiko</strong> web plataforma <strong>datu klinikoen</strong> etengabeko bilketarako diseinatua. Tresna klinikoak urrunetik eta presentzialki administratzeko aukera ematen du, tresnak sortzeko sistema malgua, datuen bistaratzea eta eskariaren araberako esportazioa barne.',
      'proj.odc.note': '<strong>Douglas Neuroinformatics Platform</strong>eko proiektu baterako ekarpena. Eleaniztuna, lehenespenez segurua JWT autentifikazioarekin eta baimen granularrekin.',
      'proj.odc.btn': 'Proiektuaren weba',
      'proj.aesso.tag': 'Lankide diren enpresentzako web tresna',
      'proj.aesso.title': 'AESSOrako eguzki-faktore osoaren kalkulagailua',
      'proj.aesso.desc': 'AESSOren <strong>Espainiako Eguzki Babesaren Elkartea</strong>ko enpresei eguzki-babeseko sistema baten errendimendua segundotan kalkulatzeko aukera ematen dien tresna bat sortu dut. Oinarrizko datuak sartzen dituzte, emaitza berehala ikusten dute eta partekatzeko prest dagoen PDF txostena deskargatu dezakete.',
      'proj.aesso.note': 'Tresna AESSOren webgunean integratuta dago eta kide diren enpresek bakarrik erabil dezakete. Horrela, prozesua sinplea, azkarra eta segurua da, kalkulu-orrien edo eskuzko kalkuluen beharrik gabe.',
      'proj.aesso.visual.title': 'Eguzki-babesaren kalkulagailua',
      'proj.aesso.visual.step1': 'Beiraren datuak',
      'proj.aesso.visual.step2': 'Eguzki-babesaren datuak',
      'proj.aesso.visual.step3': 'Azken txostena',
      'proj.aesso.visual.done': 'osatuta',
      'proj.aesso.visual.ready': 'prest',
      'proj.aesso.visual.resultLabel': 'Azken emaitza',
      'proj.aesso.visual.resultTag': '✓ esportatzeko prest',
      'proj.aesso.visual.btn1': 'PDF txostena deskargatu',
      'proj.aesso.visual.btn2': 'Datuak editatu',
      'proj.aesso.btn': 'Ikusi kalkulagailua',
      // Newsletter
      'newsletter.title': 'Hileko buletina',
      'newsletter.desc.short': 'Jaso hilero nire proiektuen berritasunak. Spamik gabe, posta bat bakarrik.',
      'newsletter.btn': 'Harpidetu',
      'newsletter.name.ph': 'Zure izena',
      'newsletter.email.ph': 'kaixo@adibidea.eus',
      // Share
      'share.title': 'Partekatu orri hau',
      'share.desc.short': 'Proiektu hauek norbaiti lagun diezaioketela uste baduzu, zabaldu mesedez.',
      'share.native': 'Partekatu mugikorretik',
      'share.linkedin': 'LinkedIn',
      'share.x': 'X',
      'share.whatsapp': 'WhatsApp',
      'share.telegram': 'Telegram',
      'share.copy': 'Esteka kopiatu',
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
      'footer.newsletter': 'Buletina',
      'footer.privacy': 'Webgune honek Google Analytics erabiltzen du consentimentuz, esperientzia hobetzeko.',
    },
    gl: {
      // Nav
      'nav.projectes': 'Proxectos',
      'nav.sobre': 'Sobre min',
      'nav.testimonis': 'Testemuños',
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
      'fc.aparador.label': 'Repositorio fotográfico',
      'fc.aparador.desc': 'Álbums privados para fotógrafos con acceso por código, descarga orixinal e donativos opcionais.',
      'fc.inspecciona.label': 'Extensión de navegador',
      'fc.inspecciona.desc': 'Corrector ortográfico, gramatical e tipográfico para o catalán no teu navegador.',
      'fc.skills.label': 'Plantilla de enxeñaría con IA',
      'fc.skills.title': 'Base Skills Repo',
      'fc.skills.desc': 'Base reutilizable con capacidades, ordes e axentes para iniciar repositorios con Copilot optimizado.',
      // Projects section
      'proj.title': 'Os meus proxectos',
      'proj.subtitle': 'Sempre estou traballando en algo novo. Aquí tes os proxectos aos que lle dediquei máis enerxía e ilusión.',
      // Project: Extensions
      'proj.ext.title': 'Extensións de cambio de idioma',
      'proj.ext.desc1': 'Tres extensións — <strong>En català, si us plau</strong>, <strong>Euskaraz, mesedez</strong> e <strong>En galego, por favor</strong> — que permiten redirixir o navegador á versión da páxina web que esteamos visitando que conteña algunha destas linguas minorizadas cun só clic. Pensadas para falantes de catalán, éuscaro e galego que queren navegar por Internet plenamente na súa lingua.',
      'proj.ext.note': 'Dispoñibles para <strong>Chrome</strong>, <strong>Brave</strong>, <strong>Ecosia</strong> (e outros navegadores Chromium), <strong>Firefox</strong> e <strong>Edge</strong>. Proximamente para <strong>Safari</strong> e máis navegadores.',
      // Project: Inspecciona
      'proj.inspecciona.title': 'Inspecciona — corrector para o catalán',
      'proj.inspecciona.desc1': 'Unha extensión para corrixir calquera campo de texto en <strong>catalán</strong> no navegador. Utiliza a API de <strong>Softcatalà</strong> para detectar erros ortográficos, gramaticais e tipográficos, e tamén incúe busca de sinónimos e autocompletar.',
      'proj.inspecciona.note': 'Dispoñible para <strong>Chrome</strong>, <strong>Brave</strong>, <strong>Ecosia</strong> e outros navegadores Chromium. Proximamente para <strong>Firefox</strong>, <strong>Edge</strong> e <strong>Safari</strong>.',
      // Project: SEPE
      'proj.sepe.desc': 'Un bot que automatiza as xestións máis tediosas co <strong>Servizo Público de Emprego Estatal (SEPE)</strong>. Nacido da frustración compartida por miles de persoas que teñen que navegar por unha burocracia dixital opaca e lenta. Esta ferramenta facilita procesos e aforra tempo e dores de cabeza.',
      'proj.sepe.btn': 'Ver proxecto',
      'proj.sepe.t1': 'Iniciando sesión...',
      'proj.sepe.t2': 'Consultando citas dispoñibles...',
      'proj.sepe.t3': 'Cita reservada: 24/03/2026, 10:30h',
      // Project: troBar
      'proj.bars.desc': '<strong>troBar</strong> axúdache a atopar bares onde ver os partidos do <strong>FC Barcelona</strong> preto de ti, vivas onde vivas. Porque seguir o Barça é mellor en compaña, cun bo ambiente e unha boa cervexa. Inclúe info de partidos en tempo real, mapa interactivo e filtros por ubicación.',
      'proj.bars.btn': 'Landing page',
      'proj.bars.search': 'Onde queres ver o partido?',
      'proj.bars.match': 'Próximo partido · sáb., 4 de abr., 21:00',
      'proj.bars.nav1': 'Partidos',
      'proj.bars.nav2': 'Mapa',
      'proj.bars.nav3': 'Perfil',
      // Project: Aparador
      'proj.aparador.desc': '<strong>Aparador</strong> é unha plataforma web pensada para que os <strong>fotógrafos</strong> poidan compartir álbums co seu <strong>público</strong> mediante <strong>códigos de acceso</strong>. O público pode navegar con comodidade, ver as fotos en galería e descargalas na súa resolución orixinal.',
      'proj.aparador.note': 'Inclúe donativos opcionais vía Stripe, un panel para xestionar álbums e subidas de fotos, e unha arquitectura lixeira para manter os custos baixos.',
      'proj.aparador.btn': 'Proximamente…',
      // Project: Base Skills Repo
      'proj.skills.title': 'Base Skills Repo',
      'proj.skills.desc1': '<strong>Base Skills Repo</strong> é un repositorio base para iniciar proxectos con <strong>GitHub Copilot</strong> ben configurado desde o primeiro día. Organiza o coñecemento por capas (instrucións, capacidades, ordes, modos de conversa e memoria de repo) para que o axente cargue só o contexto relevante en cada tarefa.',
      'proj.skills.note': 'Inclúe un mecanismo de <strong>arranque inicial</strong> que detecta a base tecnolóxica ou a pregunta, activa os paquetes axeitados e deixa o repo preparado para traballar con máis precisión e menor custo de tokens.',
      'proj.skills.btn': 'GitHub',
      'proj.skills.t1': 'Detectando base tecnolóxica e preferencias...',
      'proj.skills.t2': 'Activando instrucións, capacidades e ordes relevantes...',
      'proj.skills.t3': 'Repo listo: contexto afinado e custo de tokens reducido.',
      // Project: Stremio
      'fc.stremio.label': 'Complemento de streaming',
      'fc.stremio.title': 'Stremio en Catalán',
      'fc.stremio.desc': 'Catálogo de películas e series en catalán en tódalas plataformas de streaming.',
      'proj.stremio.title': 'Stremio en Catalán',
      'proj.stremio.desc': 'Un complemento para <strong>Stremio</strong> que ofrece un catálogo completo de <strong>películas e series dispoñibles en catalán</strong> nas principais plataformas de streaming: 3Cat, Filmin, Netflix, Prime Video, Disney+, Max, Movistar+ e máis. Pensado para todos os que queiran gozar de contido audiovisual na súa lingua.',
      'proj.stremio.btn': 'Instalar complemento',
      // Project: Alerta Desnona
      'fc.alerta.label': 'Xustiza social',
      'fc.alerta.title': 'Alerta Desnona',
      'fc.alerta.desc': 'Mapa interactivo de alertas de desafiuzamentos na Península Ibérica.',
      'proj.alerta.title': 'Alerta Desnona',
      'proj.alerta.desc': 'Unha aplicación de <strong>alertas de desafiuzamentos</strong> na Península Ibérica. Cun <strong>mapa interactivo</strong> que amosa en tempo real as póxas e desafiuzamentos publicados no BOE, permitindo á cidadanía e ás plataformas de vivenda organizarse e actuar ante estas situacións.',
      'proj.alerta.note': 'Inclúe notificacións push, alertas por correo electrónico e un sistema de filtraxe por zona xeográfica.',
      'proj.alerta.btn': 'Ver beta',
      // Project: Open Data Capture
      'fc.odc.label': 'Plataforma clínica',
      'fc.odc.desc': 'Plataforma de código aberto para a recollida continua de datos clínicos.',
      'proj.odc.desc': 'Plataforma web de <strong>código aberto</strong> deseñada para a recollida continua de <strong>datos clínicos</strong>. Permite administrar instrumentos clínicos de forma remota e presencial, cun sistema flexible de creación de instrumentos, visualización de datos e exportación baixo demanda.',
      'proj.odc.note': 'Contribución a un proxecto do <strong>Douglas Neuroinformatics Platform</strong>. Multilingue, seguro por defecto con autenticación JWT e permisos granulares.',
      'proj.odc.btn': 'Web do proxecto',
      'proj.aesso.tag': 'Ferramenta web para empresas asociadas',
      'proj.aesso.title': 'Calculadora do factor solar total para AESSO',
      'proj.aesso.desc': 'Crei unha ferramenta para que as empresas da <strong>Asociación Española da Protección Solar</strong> poidan calcular o rendemento dun sistema de protección solar en poucos segundos. Introducen os datos básicos, ven o resultado de inmediato e poden descargar un informe en PDF listo para compartir.',
      'proj.aesso.note': 'A ferramenta está integrada na web de AESSO e só poden acceder a ela as empresas asociadas. Así teñen un proceso sinxelo, rápido e seguro, sen depender de follas de cálculo nin de cálculos manuais.',
      'proj.aesso.visual.title': 'Calculadora de protección solar',
      'proj.aesso.visual.step1': 'Datos do vidro',
      'proj.aesso.visual.step2': 'Datos da protección solar',
      'proj.aesso.visual.step3': 'Informe final',
      'proj.aesso.visual.done': 'completado',
      'proj.aesso.visual.ready': 'preparado',
      'proj.aesso.visual.resultLabel': 'Resultado final',
      'proj.aesso.visual.resultTag': '✓ listo para exportar',
      'proj.aesso.visual.btn1': 'Descargar informe PDF',
      'proj.aesso.visual.btn2': 'Editar datos',
      'proj.aesso.btn': 'Ver calculadora',
      // Newsletter
      'newsletter.title': 'Boletín mensual',
      'newsletter.desc.short': 'Recibe cada mes as novidades dos meus proxectos. Sen spam, só un correo.',
      'newsletter.btn': 'Subscríbeme',
      'newsletter.name.ph': 'O teu nome',
      'newsletter.email.ph': 'ola@exemplo.gal',
      // Share
      'share.title': 'Comparte esta páxina',
      'share.desc.short': 'Se cres que estes proxectos poden axudar a alguén, difúndeos.',
      'share.native': 'Compartir dende o móbil',
      'share.linkedin': 'LinkedIn',
      'share.x': 'X',
      'share.whatsapp': 'WhatsApp',
      'share.telegram': 'Telegram',
      'share.copy': 'Copiar ligazón',
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
      'footer.newsletter': 'Boletín',
      'footer.privacy': 'Esta páxina utiliza Google Analytics con consentimento para mellorar a experiencia.',
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
      applyProfile(getActiveProfile());
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

    // Manté només estat visual de perfil (cards, accent i etiqueta).
    applyProfile(getActiveProfile());
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

  function trackGoatEvent(path, title) {
    trackGoogleEvent('site_interaction', {
      interaction_type: path,
      interaction_label: title,
      page_path: window.location.pathname + window.location.search,
      page_location: window.location.href,
    });
  }

  function buildLinkEventName(anchor) {
    const href = anchor.getAttribute('href') || '';
    if (!href || href.startsWith('javascript:')) return null;

    if (href.startsWith('#')) {
      const anchorId = href.replace(/^#/, '').replace(/[^a-zA-Z0-9-_]/g, '') || 'top';
      return `link-ancla-${anchorId}`;
    }

    try {
      const url = new URL(anchor.href, window.location.origin);

      if (url.origin === window.location.origin) {
        const internalPath = (url.pathname === '/' ? 'home' : url.pathname.replace(/^\//, '').replace(/\//g, '-')) || 'home';
        return `link-intern-${internalPath}`;
      }

      const host = url.hostname.replace(/^www\./, '').replace(/\./g, '-');
      const pathPart = (url.pathname === '/' ? 'home' : url.pathname.replace(/^\//, '').replace(/\//g, '-')) || 'home';
      return `link-sortida-${host}-${pathPart}`;
    } catch (_) {
      return null;
    }
  }

  document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href]');
    if (!anchor) return;
    if (anchor.dataset.goatcounterClick) return;

    const eventPath = buildLinkEventName(anchor);
    if (!eventPath) return;

    trackGoatEvent(eventPath, `Click: ${anchor.textContent.trim() || anchor.href}`);
  });

  // ---------- SHARE BUTTON ----------
  const shareTitle = 'frolesti — Desenvolupament de Software Social';
  const shareText = 'Projectes de software amb vocació social. Fes-hi una ullada:';
  const shareUrl = window.location.origin + window.location.pathname;


  const shareBtn = document.getElementById('shareBtn');
  const sharePopover = document.getElementById('sharePopover');
  const popoverCopyBtn = document.getElementById('popoverCopyBtn');

  if (shareBtn && sharePopover) {
    const encodedUrl = encodeURIComponent(shareUrl);
    const encodedText = encodeURIComponent(`${shareText} ${shareUrl}`);
    const encodedTitle = encodeURIComponent(shareTitle);

    sharePopover.querySelectorAll('[data-share-platform]').forEach((link) => {
      const p = link.dataset.sharePlatform;
      if (p === 'linkedin') link.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`;
      if (p === 'x') link.href = `https://x.com/intent/tweet?text=${encodedText}`;
      if (p === 'whatsapp') link.href = `https://wa.me/?text=${encodedText}`;
      if (p === 'telegram') link.href = `https://t.me/share/url?url=${encodedUrl}&text=${encodedTitle}`;
      link.target = '_blank';
      link.rel = 'noopener noreferrer';
    });

    shareBtn.addEventListener('click', async (e) => {
      e.stopPropagation();

      if (navigator.share) {
        try {
          await navigator.share({ title: shareTitle, text: shareText, url: shareUrl });
          trackGoatEvent('share-native', 'Native share');
        } catch (_) { /* canceled */ }
        return;
      }

      const isOpen = !sharePopover.hidden;
      sharePopover.hidden = isOpen;
    });

    document.addEventListener('click', (e) => {
      if (!sharePopover.hidden && !shareBtn.parentElement.contains(e.target)) {
        sharePopover.hidden = true;
      }
    });

    if (popoverCopyBtn) {
      popoverCopyBtn.addEventListener('click', async () => {
        try {
          await navigator.clipboard.writeText(shareUrl);
          popoverCopyBtn.textContent = 'Copiat ✓';
          trackGoatEvent('share-copy-link', 'Copy share link');
        } catch (_) {
          popoverCopyBtn.textContent = 'Error';
        }
        setTimeout(() => { popoverCopyBtn.textContent = 'Copiar enllaç'; }, 2000);
        sharePopover.hidden = true;
      });
    }
  }

  // ---------- REVIEWS ----------
  const reviewsList    = document.getElementById('reviewsList');
  const reviewsLoading = document.getElementById('reviewsLoading');
  const reviewForm     = document.getElementById('reviewForm');
  const reviewStatus   = document.getElementById('reviewFormStatus');
  const starBtns       = document.querySelectorAll('.star-rating .star');
  const ratingInput    = document.getElementById('rv-rating');

  async function safeJson(res) {
    try {
      return await res.json();
    } catch {
      return {};
    }
  }

  function starsHtml(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleDateString('ca-ES', { year: 'numeric', month: 'short', day: 'numeric' });
    } catch { return ''; }
  }

  function renderReviews(reviews) {
    if (!reviewsList) return;
    reviewsList.innerHTML = '';
    if (!reviews.length) return;
    reviews.forEach((r) => {
      const card = document.createElement('div');
      card.className = 'review-card';
      card.innerHTML = `
        <div class="review-card-header">
          <div>
            <p class="review-author">${r.name || 'Anònim'}</p>
          </div>
          <span class="review-stars" title="${r.rating} de 5">${starsHtml(r.rating)}</span>
        </div>
        <p class="review-message">${r.message}</p>
        <p class="review-date">${formatDate(r.date)}</p>
      `;
      reviewsList.appendChild(card);
    });
  }

  async function loadReviews() {
    try {
      const res = await fetch('/.netlify/functions/reviews');
      const data = await safeJson(res);
      if (!res.ok) {
        console.warn('No s\'han pogut carregar els comentaris:', data?.message || data?.error || res.status);
        return;
      }
      renderReviews(data);
    } catch (err) {
      console.warn('Error carregant comentaris:', err?.message || err);
    }
  }

  if (reviewsList) loadReviews();

  // Star rating UI
  let selectedRating = 0;
  const reviewSubmitBtn = reviewForm?.querySelector('[type="submit"]');
  const updateSubmitState = () => {
    if (reviewSubmitBtn) reviewSubmitBtn.disabled = selectedRating < 1;
  };
  updateSubmitState();
  starBtns.forEach((btn) => {
    btn.addEventListener('mouseover', () => {
      const v = parseInt(btn.dataset.value, 10);
      starBtns.forEach((b) => b.classList.toggle('hover', parseInt(b.dataset.value, 10) <= v));
    });
    btn.addEventListener('mouseout', () => {
      starBtns.forEach((b) => b.classList.remove('hover'));
    });
    btn.addEventListener('click', () => {
      selectedRating = parseInt(btn.dataset.value, 10);
      if (ratingInput) ratingInput.value = selectedRating;
      starBtns.forEach((b) => b.classList.toggle('active', parseInt(b.dataset.value, 10) <= selectedRating));
      updateSubmitState();
    });
  });

  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const fd = new FormData(reviewForm);
      const rating = parseInt(fd.get('rating') || '0', 10);
      if (!rating || rating < 1) return;
      const payload = {
        name:    fd.get('name') || '',
        rating:  rating,
        message: fd.get('message') || ''
      };

      const submitBtn = reviewForm.querySelector('[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.textContent = 'Publicant…';
      if (reviewStatus) { reviewStatus.hidden = true; reviewStatus.className = 'review-form-status'; }

      try {
        const res = await fetch('/.netlify/functions/reviews', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        const data = await safeJson(res);

        if (res.ok) {
          reviewForm.reset();
          selectedRating = 0;
          if (ratingInput) ratingInput.value = 0;
          starBtns.forEach((b) => b.classList.remove('active'));
          if (reviewStatus) {
            reviewStatus.textContent = data.message || 'Comentari rebut. El revisaré abans de publicar-lo.';
            reviewStatus.className = 'review-form-status ok';
            reviewStatus.hidden = false;
          }
          trackGoatEvent('review-submit-success', 'Review submitted');
          await loadReviews();
        } else {
          throw new Error(data.message || 'No s\'ha pogut publicar el comentari.');
        }
      } catch (err) {
        if (reviewStatus) {
          reviewStatus.textContent = err?.message || 'No s\'ha pogut publicar el comentari. Torna-ho a intentar.';
          reviewStatus.className = 'review-form-status error';
          reviewStatus.hidden = false;
        }
        trackGoatEvent('review-submit-error', 'Review submit error');
      } finally {
        submitBtn.textContent = 'Publicar comentari';
        updateSubmitState();
      }
    });
  }

  // ---------- NEWSLETTER FORM (Netlify Function → GitHub Gist) ----------
  const nlForm = document.getElementById('newsletterForm');
  if (nlForm) {
    nlForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      const btn = nlForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const name = nlForm.querySelector('#nl-name').value.trim();
      const email = nlForm.querySelector('#nl-email').value.trim();
      if (!name || !email) return;      trackGoatEvent('newsletter-submit-attempt', 'Newsletter submit attempt');

      btn.textContent = 'Enviant...';
      btn.disabled = true;

      try {
        const res = await fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });

        const data = await res.json();

        if (res.ok && data.success) {
          btn.textContent = 'Subscrit correctament ✓';
          btn.style.background = 'var(--accent-2)';
          btn.style.color = '#fff';
          trackGoatEvent('newsletter-subscribe-success', 'Newsletter subscribed');
          nlForm.reset();
        } else if (data.error === 'already_subscribed') {
          btn.textContent = 'Ja estàs subscrit!';
          btn.style.background = 'var(--accent-2)';
          btn.style.color = '#fff';
          trackGoatEvent('newsletter-subscribe-duplicate', 'Newsletter duplicate');
        } else {
          btn.textContent = 'Error. Torna-ho a provar.';
          btn.style.background = '#c0392b';
          btn.style.color = '#fff';
          trackGoatEvent('newsletter-subscribe-error', 'Newsletter subscribe error');
        }
      } catch (err) {
        btn.textContent = 'Error de connexió.';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
        trackGoatEvent('newsletter-subscribe-network-error', 'Newsletter network error');
      }

      btn.disabled = false;
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.color = '';
      }, 4000);
    });
  }

  // ---------- NEWSLETTER POPUP (first visit, on scroll) ----------
  const nlPopupBackdrop = document.getElementById('nlPopupBackdrop');
  const nlPopup = document.getElementById('nlPopup');
  if (nlPopupBackdrop && nlPopup) {
    const STORAGE_KEY = 'nl-popup-seen';
    const closeBtn = document.getElementById('nlPopupClose');
    const popupForm = document.getElementById('nlPopupForm');

    const markSeen = () => {
      try { localStorage.setItem(STORAGE_KEY, '1'); } catch (e) {}
    };
    const hidePopup = () => {
      newsletterPopupOpen = false;
      nlPopupBackdrop.classList.remove('is-visible');
      setTimeout(() => { nlPopupBackdrop.hidden = true; }, 300);
      markSeen();
      syncAnalyticsBanner();
    };
    const showPopup = () => {
      newsletterPopupOpen = true;
      hideAnalyticsBanner();
      nlPopupBackdrop.hidden = false;
      requestAnimationFrame(() => nlPopupBackdrop.classList.add('is-visible'));
      trackGoatEvent('newsletter-popup-shown', 'Newsletter popup shown');
    };

    let alreadySeen = false;
    try { alreadySeen = localStorage.getItem(STORAGE_KEY) === '1'; } catch (e) {}

    if (!alreadySeen) {
      const onScroll = () => {
        if (window.scrollY > 300) {
          window.removeEventListener('scroll', onScroll);
          showPopup();
        }
      };
      window.addEventListener('scroll', onScroll, { passive: true });
    }

    closeBtn?.addEventListener('click', () => {
      trackGoatEvent('newsletter-popup-dismissed', 'Newsletter popup dismissed');
      hidePopup();
    });
    nlPopupBackdrop.addEventListener('click', (e) => {
      if (e.target === nlPopupBackdrop) {
        trackGoatEvent('newsletter-popup-dismissed', 'Newsletter popup dismissed');
        hidePopup();
      }
    });
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && !nlPopupBackdrop.hidden) hidePopup();
    });

    popupForm?.addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn = popupForm.querySelector('button[type="submit"]');
      const originalText = btn.textContent;
      const name = popupForm.querySelector('input[name="name"]').value.trim();
      const email = popupForm.querySelector('input[name="email"]').value.trim();
      if (!name || !email) return;

      trackGoatEvent('newsletter-popup-submit-attempt', 'Newsletter popup submit');
      btn.textContent = 'Enviant...';
      btn.disabled = true;

      try {
        const res = await fetch('/.netlify/functions/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email })
        });
        const data = await res.json();

        if (res.ok && data.success) {
          btn.textContent = 'Subscrit ✓';
          btn.style.background = 'var(--accent-2)';
          btn.style.color = '#fff';
          trackGoatEvent('newsletter-popup-success', 'Newsletter popup subscribed');
          popupForm.reset();
          setTimeout(hidePopup, 1800);
        } else if (data.error === 'already_subscribed') {
          btn.textContent = 'Ja estàs subscrit!';
          btn.style.background = 'var(--accent-2)';
          btn.style.color = '#fff';
          trackGoatEvent('newsletter-popup-duplicate', 'Newsletter popup duplicate');
          setTimeout(hidePopup, 1800);
        } else {
          btn.textContent = 'Error. Torna-ho a provar.';
          btn.style.background = '#c0392b';
          btn.style.color = '#fff';
          trackGoatEvent('newsletter-popup-error', 'Newsletter popup error');
        }
      } catch (err) {
        btn.textContent = 'Error de connexió.';
        btn.style.background = '#c0392b';
        btn.style.color = '#fff';
        trackGoatEvent('newsletter-popup-network-error', 'Newsletter popup network error');
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
