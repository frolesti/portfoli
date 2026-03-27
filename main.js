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

    function updateCarousel() {
      const perView = getCardsPerView();
      const totalPages = getTotalPages();
      currentPage = Math.min(currentPage, totalPages - 1);

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

      // Buttons
      if (prevBtn) prevBtn.disabled = currentPage === 0;
      if (nextBtn) nextBtn.disabled = currentPage >= totalPages - 1;

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

    if (prevBtn) prevBtn.addEventListener('click', () => { currentPage = Math.max(0, currentPage - 1); updateCarousel(); });
    if (nextBtn) nextBtn.addEventListener('click', () => { currentPage = Math.min(getTotalPages() - 1, currentPage + 1); updateCarousel(); });

    // Touch/swipe support
    let touchStartX = 0;
    let touchEndX = 0;
    track.addEventListener('touchstart', e => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
    track.addEventListener('touchend', e => {
      touchEndX = e.changedTouches[0].screenX;
      const diff = touchStartX - touchEndX;
      if (Math.abs(diff) > 50) {
        if (diff > 0) { currentPage = Math.min(getTotalPages() - 1, currentPage + 1); }
        else { currentPage = Math.max(0, currentPage - 1); }
        updateCarousel();
      }
    }, { passive: true });

    updateCarousel();
    window.addEventListener('resize', () => { updateCarousel(); });
  }

  // ---------- SCROLL REVEAL ----------
  const revealElements = document.querySelectorAll(
    '.featured, .project-detail, .about-grid, .cta-banner, .contact-grid, .section-header, .aixeta-banner-content'
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

  // Translations — EU (euskera) and GL (galego)
  const translations = {
    eu: {
      // Nav
      'Projectes': 'Proiektuak',
      'Sobre mi': 'Niri buruz',
      "Contacta'm": 'Jarri harremanetan',
      // Hero
      'Desenvolupador autònom · SaaS · Software social': 'Garatzaile autonomoa · SaaS · Software soziala',
      'Creo eines digitals': 'Tresna digitalak sortzen ditut',
      'que marquen la diferència': 'aldea markatzen dutenak',
      // Hero description (simplified key approach)
      // Section headers
      'Els meus projectes': 'Nire proiektuak',
      'Software amb propòsit': 'Helburudun softwarea',
      'Tens un projecte amb vocació social?': 'Gizarte-bokaziodun proiektua duzu?',
      "Dona'm suport a l'Aixeta": 'Eman laguntza Aixetan',
      "Contacta'm": 'Jarri harremanetan',
      // Buttons
      'Veure projectes': 'Ikusi proiektuak',
      'Parlem?': 'Hitz egingo dugu?',
      "Contacta'm": 'Jarri harremanetan',
      'Enviar missatge': 'Mezua bidali',
      // Featured cards
      'Extensions de navegador': 'Nabigatzaile-luzapenak',
      "Canvi d'idioma": 'Hizkuntza aldaketa',
      "Porta el català, l'euskera i el gallec al teu navegador amb un sol clic.": 'Eraman katalana, euskara eta galegoa zure nabigatzailera klik bakar batez.',
      'Automatització': 'Automatizazioa',
      'Bot del SEPE': 'SEPEren bot-a',
      "Bot que automatitza les gestions amb el Servei Públic d'Ocupació Estatal.": "Estatuko Enplegu Zerbitzu Publikoarekin kudeaketak automatizatzen dituen bot-a.",
      'App mòbil': 'Mugikorrerako aplikazioa',
      "Troba bars on veure els partits del Barça a prop teu, visquis on visquis.": "Aurkitu Barçaren partidak ikusteko tabernak zure inguruan, non bizi zaren berdin.",
      // Projects section
      "Sempre estic treballant en alguna cosa nova. Aquí tens els projectes als quals he dedicat més energia i il·lusió.": "Beti ari naiz zerbait berrian lanean. Hemen dituzu energia eta ilusioz bete ditudan proiektuak.",
      // About section
      'Vocació social': 'Gizarte-bokazioa',
      'Cada projecte busca resoldre un problema real.': 'Proiektu bakoitzak benetako arazo bat konpontzea bilatzen du.',
      'Autonomia': 'Autonomia',
      "Gestió integral del projecte, des de la idea fins al desplegament.": "Proiektuaren kudeaketa integrala, ideia hedapeneraino.",
      'Producte SaaS': 'SaaS produktua',
      'Especialitzat en software com a servei escalable.': 'Zerbitzu eskalagarri gisa softwarean espezializatua.',
      // Footer
      'Inici': 'Hasiera',
      'Contacte': 'Kontaktua',
      // Form
      'Nom': 'Izena',
      'Correu electrònic': 'Posta elektronikoa',
      'Missatge': 'Mezua',
      'El teu nom': 'Zure izena',
      'hola@exemple.cat': 'kaixo@adibidea.eus',
      "Explica'm la teva idea o projecte...": 'Kontatu zure ideia edo proiektua...',
    },
    gl: {
      // Nav
      'Projectes': 'Proxectos',
      'Sobre mi': 'Sobre min',
      "Contacta'm": 'Contacta comigo',
      // Hero
      'Desenvolupador autònom · SaaS · Software social': 'Desenvolvedor autónomo · SaaS · Software social',
      'Creo eines digitals': 'Creo ferramentas dixitais',
      'que marquen la diferència': 'que marcan a diferenza',
      // Section headers
      'Els meus projectes': 'Os meus proxectos',
      'Software amb propòsit': 'Software con propósito',
      'Tens un projecte amb vocació social?': 'Tes un proxecto con vocación social?',
      "Dona'm suport a l'Aixeta": 'Dáme apoio na Aixeta',
      "Contacta'm": 'Contacta comigo',
      // Buttons
      'Veure projectes': 'Ver proxectos',
      'Parlem?': 'Falamos?',
      'Enviar missatge': 'Enviar mensaxe',
      // Featured cards
      'Extensions de navegador': 'Extensións de navegador',
      "Canvi d'idioma": 'Cambio de idioma',
      "Porta el català, l'euskera i el gallec al teu navegador amb un sol clic.": 'Leva o catalán, o éuscaro e o galego ao teu navegador cun só clic.',
      'Automatització': 'Automatización',
      'Bot del SEPE': 'Bot do SEPE',
      "Bot que automatitza les gestions amb el Servei Públic d'Ocupació Estatal.": "Bot que automatiza as xestións co Servizo Público de Emprego Estatal.",
      'App mòbil': 'App móbil',
      "Troba bars on veure els partits del Barça a prop teu, visquis on visquis.": "Atopa bares onde ver os partidos do Barça preto de ti, vivas onde vivas.",
      // Projects section
      "Sempre estic treballant en alguna cosa nova. Aquí tens els projectes als quals he dedicat més energia i il·lusió.": "Sempre estou traballando en algo novo. Aquí tes os proxectos aos que lle dediquei máis enerxía e ilusión.",
      // About section
      'Vocació social': 'Vocación social',
      'Cada projecte busca resoldre un problema real.': 'Cada proxecto busca resolver un problema real.',
      'Autonomia': 'Autonomía',
      "Gestió integral del projecte, des de la idea fins al desplegament.": "Xestión integral do proxecto, dende a idea ata o despregamento.",
      'Producte SaaS': 'Produto SaaS',
      'Especialitzat en software com a servei escalable.': 'Especializado en software como servizo escalable.',
      // Footer
      'Inici': 'Inicio',
      'Contacte': 'Contacto',
      // Form
      'Nom': 'Nome',
      'Correu electrònic': 'Correo electrónico',
      'Missatge': 'Mensaxe',
      'El teu nom': 'O teu nome',
      'hola@exemple.cat': 'ola@exemplo.gal',
      "Explica'm la teva idea o projecte...": 'Cóntame a túa idea ou proxecto...',
    }
  };

  // Store original CA text for restoration
  const originalTexts = new Map();

  function collectOriginalTexts() {
    // Collect all translatable elements
    const selectors = [
      '.nav-links a:not(.nav-cta)', '.nav-cta',
      '.hero-tag', '.hero-accent',
      '.hero-actions .btn',
      '.fc-label', '.featured-card h3', '.featured-card p',
      '.section-header h2', '.section-subtitle',
      '.about-text h2',
      '.value-item strong', '.value-item p',
      '.cta-banner h2',
      '.aixeta-banner-text h2',
      '.contact-text h2',
      '.footer-links a',
      '.form-group label',
      '.contact-form .btn'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        if (!originalTexts.has(el)) {
          originalTexts.set(el, el.textContent.trim());
        }
      });
    });
    // Placeholders
    document.querySelectorAll('.form-group input, .form-group textarea').forEach(el => {
      if (!originalTexts.has(el)) {
        originalTexts.set(el, el.placeholder);
      }
    });
    // The h1 first text node
    const h1 = document.querySelector('.hero h1');
    if (h1 && !originalTexts.has(h1)) {
      originalTexts.set(h1, h1.childNodes[0].textContent.trim());
    }
  }

  function translatePage(lang) {
    if (lang === currentLang) return;
    currentLang = lang;
    const dict = lang === 'ca' ? null : translations[lang];

    // Update html lang attribute
    document.documentElement.lang = lang;

    // Show/hide disclaimer
    if (disclaimer) {
      disclaimer.classList.toggle('visible', lang !== 'ca');
    }

    if (!dict) {
      // Restore originals
      originalTexts.forEach((text, el) => {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = text;
        } else if (el === document.querySelector('.hero h1')) {
          el.childNodes[0].textContent = text + '\n';
        } else {
          el.textContent = text;
        }
      });
      return;
    }

    // Apply translations
    originalTexts.forEach((originalText, el) => {
      const translated = dict[originalText];
      if (translated) {
        if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
          el.placeholder = translated;
        } else if (el === document.querySelector('.hero h1')) {
          el.childNodes[0].textContent = translated + '\n';
        } else {
          el.textContent = translated;
        }
      }
    });
  }

  if (langs.length) {
    collectOriginalTexts();

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
      // Restore to current language selection visually
      langs.forEach(l => l.classList.remove('active'));
      const activeLang = container.querySelector(`[data-lang="${currentLang}"]`);
      if (activeLang) activeLang.classList.add('active');
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
