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
  if (langs.length) {
    langs.forEach(lang => {
      lang.addEventListener('mouseenter', () => {
        langs.forEach(l => l.classList.remove('active'));
        lang.classList.add('active');
      });
    });
    const container = document.querySelector('.lang-switcher-demo');
    container.addEventListener('mouseleave', () => {
      langs.forEach(l => l.classList.remove('active'));
      langs[0].classList.add('active');
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
