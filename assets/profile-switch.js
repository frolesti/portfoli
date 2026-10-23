(() => {
  const profileKey = 'frolesti-profile';
  const validProfiles = ['social', 'professional'];

  let switcher = document.querySelector('.profile-switch--blog');
  const navLinks = document.querySelector('#navbar .nav-links');
  if (!switcher && navLinks) {
    switcher = document.createElement('div');
    switcher.className = 'nav-profile-switch profile-switch--blog';
    switcher.setAttribute('role', 'group');
    switcher.setAttribute('aria-label', 'Perfil');
    switcher.innerHTML = '<button type="button" class="profile-option" data-profile-option="social" aria-pressed="false">Social</button><button type="button" class="profile-option" data-profile-option="professional" aria-pressed="true">Professional</button>';
  }
  if (switcher && navLinks && switcher.parentElement !== navLinks) navLinks.prepend(switcher);

  const navbar = document.getElementById('navbar');
  if (navbar && navLinks) {
    if (!navLinks.querySelector('a[href="https://frolesti.aixeta.cat/"]')) {
      const aixeta = document.createElement('a');
      aixeta.href = 'https://frolesti.aixeta.cat/';
      aixeta.target = '_blank';
      aixeta.rel = 'noopener';
      aixeta.textContent = 'Aixeta';
      navLinks.insertBefore(aixeta, navLinks.querySelector('.nav-cta'));
    }

    const updateScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 40);
    updateScroll();
    window.addEventListener('scroll', updateScroll, { passive: true });

    let toggle = navbar.querySelector('.nav-toggle');
    if (!toggle) {
      toggle = document.createElement('button');
      toggle.className = 'nav-toggle';
      toggle.type = 'button';
      toggle.setAttribute('aria-label', 'Menú');
      toggle.setAttribute('aria-controls', 'mobileMenu');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.innerHTML = '<span></span><span></span><span></span>';
      navbar.append(toggle);
    }

    let mobileMenu = document.getElementById('mobileMenu');
    if (!mobileMenu) {
      mobileMenu = document.createElement('div');
      mobileMenu.className = 'mobile-menu';
      mobileMenu.id = 'mobileMenu';
      navLinks.querySelectorAll('a').forEach((link) => mobileMenu.append(link.cloneNode(true)));
      const mobileSwitcher = switcher?.cloneNode(true);
      if (mobileSwitcher) {
        mobileSwitcher.className = 'mobile-profile-switch';
        mobileMenu.append(mobileSwitcher);
      }
      navbar.after(mobileMenu);
    }

    toggle.addEventListener('click', () => {
      const isOpen = mobileMenu.classList.toggle('open');
      toggle.classList.toggle('active', isOpen);
      toggle.setAttribute('aria-expanded', String(isOpen));
    });
    mobileMenu.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      toggle.classList.remove('active');
      toggle.setAttribute('aria-expanded', 'false');
    }));
  }

  function applyProfile(profile) {
    if (!validProfiles.includes(profile)) return;
    document.documentElement.setAttribute('data-profile', profile);
    document.body.setAttribute('data-profile', profile);
    document.querySelectorAll('[data-profile-option]').forEach((button) => {
      const selected = button.dataset.profileOption === profile;
      button.setAttribute('aria-pressed', String(selected));
      button.title = selected ? `${button.textContent}: perfil seleccionat` : `Canviar a ${button.textContent}`;
    });
  }

  let profile = 'professional';
  try {
    const stored = localStorage.getItem(profileKey);
    if (validProfiles.includes(stored)) profile = stored;
  } catch {}

  applyProfile(profile);
  document.querySelectorAll('[data-profile-option]').forEach((button) => {
    button.addEventListener('click', () => {
      const selected = button.dataset.profileOption;
      if (!validProfiles.includes(selected)) return;
      try { localStorage.setItem(profileKey, selected); } catch {}
      applyProfile(selected);
      const mobileMenu = button.closest('#mobileMenu');
      if (mobileMenu) {
        mobileMenu.classList.remove('open');
        const toggle = document.querySelector('#navbar .nav-toggle');
        toggle?.classList.remove('active');
        toggle?.setAttribute('aria-expanded', 'false');
      }
    });
  });
})();