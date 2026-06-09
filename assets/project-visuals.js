// project-visuals.js — ÚNICA FONT DE VERITAT per als mockups CSS dels projectes.
// Tant index.html (via main.js) com producte.html (via product-page.js)
// llegeixen d'aquí. Cap visual no s'escriu a cap altra banda.
(function (global) {
  global.PROJECT_VISUALS = {

    'projecte-extensions': {
      cls: 'pv-extensions',
      html: `
        <div class="browser-mockup">
          <div class="browser-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="browser-content">
            <div class="lang-switcher-demo">
              <span class="lang active" data-lang="ca">CA</span>
              <span class="lang" data-lang="eu">EU</span>
              <span class="lang" data-lang="gl">GL</span>
            </div>
            <p class="lang-disclaimer">⚠ Les traduccions a l'euskera i al gallec han estat generades per IA i poden contenir errors.</p>
          </div>
        </div>
        <div class="ext-links-grid">
          <div class="ext-row">
            <p class="ext-links-label"><img src="assets/img/extensions/ext-catala.png" alt="En català" class="ext-icon"> En català, si us plau</p>
            <div class="browser-icon-links" aria-label="Navegadors disponibles per a En català, si us plau">
              <a href="https://chromewebstore.google.com/detail/en-catal%C3%A0-si-us-plau/fljkmgniiajdaefnomebclfbpfdgjplc" target="_blank" rel="noopener" class="browser-link" data-tooltip="Chrome / Brave / Ecosia" aria-label="Chrome / Brave / Ecosia" data-goatcounter-click="ext-catala-chrome"><img src="assets/img/extensions/browser-chrome.png" alt="" aria-hidden="true"></a>
              <a href="https://addons.mozilla.org/en-US/firefox/addon/en-catal%C3%A0-sisplau/" target="_blank" rel="noopener" class="browser-link" data-tooltip="Firefox" aria-label="Firefox" data-goatcounter-click="ext-catala-firefox"><img src="assets/img/extensions/browser-firefox.png" alt="" aria-hidden="true"></a>
              <span class="browser-link is-disabled" data-tooltip="Edge (pròximament)" aria-label="Edge (pròximament)"><img src="assets/img/extensions/browser-edge.png" alt="" aria-hidden="true"></span>
              <span class="browser-link is-disabled" data-tooltip="Safari (pròximament)" aria-label="Safari (pròximament)"><img src="assets/img/extensions/browser-safari.png" alt="" aria-hidden="true"></span>
            </div>
          </div>
          <div class="ext-row">
            <p class="ext-links-label"><img src="assets/img/extensions/ext-euskara.png" alt="Euskaraz" class="ext-icon ext-icon-eu"> Euskaraz, mesedez</p>
            <div class="browser-icon-links" aria-label="Navegadors disponibles per a Euskaraz, mesedez">
              <a href="https://chromewebstore.google.com/detail/euskaraz-mesedez/kniinbeidggpjlfnmobaomcfnflochlc" target="_blank" rel="noopener" class="browser-link" data-tooltip="Chrome / Brave / Ecosia" aria-label="Chrome / Brave / Ecosia"><img src="assets/img/extensions/browser-chrome.png" alt="" aria-hidden="true"></a>
              <span class="browser-link is-disabled" data-tooltip="Firefox (pròximament)" aria-label="Firefox (pròximament)"><img src="assets/img/extensions/browser-firefox.png" alt="" aria-hidden="true"></span>
              <span class="browser-link is-disabled" data-tooltip="Edge (pròximament)" aria-label="Edge (pròximament)"><img src="assets/img/extensions/browser-edge.png" alt="" aria-hidden="true"></span>
              <span class="browser-link is-disabled" data-tooltip="Safari (pròximament)" aria-label="Safari (pròximament)"><img src="assets/img/extensions/browser-safari.png" alt="" aria-hidden="true"></span>
            </div>
          </div>
          <div class="ext-row">
            <p class="ext-links-label"><img src="assets/img/extensions/ext-galego.png" alt="En galego" class="ext-icon"> En galego, por favor</p>
            <div class="browser-icon-links" aria-label="Navegadors disponibles per a En galego, por favor">
              <a href="https://chromewebstore.google.com/detail/en-galego-por-favor/cbgecchlojjjkhjfahebknmpiodmlnll" target="_blank" rel="noopener" class="browser-link" data-tooltip="Chrome / Brave / Ecosia" aria-label="Chrome / Brave / Ecosia"><img src="assets/img/extensions/browser-chrome.png" alt="" aria-hidden="true"></a>
              <span class="browser-link is-disabled" data-tooltip="Firefox (pròximament)" aria-label="Firefox (pròximament)"><img src="assets/img/extensions/browser-firefox.png" alt="" aria-hidden="true"></span>
              <span class="browser-link is-disabled" data-tooltip="Edge (pròximament)" aria-label="Edge (pròximament)"><img src="assets/img/extensions/browser-edge.png" alt="" aria-hidden="true"></span>
              <span class="browser-link is-disabled" data-tooltip="Safari (pròximament)" aria-label="Safari (pròximament)"><img src="assets/img/extensions/browser-safari.png" alt="" aria-hidden="true"></span>
            </div>
          </div>
        </div>`
    },

    'projecte-sepe': {
      cls: 'pv-sepe',
      html: `
        <div class="terminal-mockup">
          <div class="terminal-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="terminal-title">sepe-bot</span>
          </div>
          <div class="terminal-content">
            <p class="term-line" style="--line-index:0"><span class="t-green">$</span> python sepe_bot.py</p>
            <p class="term-line" style="--line-index:1"><span class="t-dim">→</span> <span data-i18n="proj.sepe.t1">Iniciant sessió...</span></p>
            <p class="term-line" style="--line-index:2"><span class="t-dim">→</span> <span data-i18n="proj.sepe.t2">Consultant cites disponibles...</span></p>
            <p class="term-line" style="--line-index:3"><span class="t-green">✓</span> <span data-i18n="proj.sepe.t3">Cita reservada: 24/03/2026, 10:30h</span></p>
            <p class="term-line t-cursor" style="--line-index:4">█</p>
          </div>
        </div>`
    },

    'projecte-bars': {
      cls: 'pv-bars',
      html: `
        <div class="phone-mockup trobar-phone">
          <div class="phone-notch"></div>
          <div class="phone-content">
            <div class="trobar-search">
              <span class="trobar-search-icon">🔍</span>
              <span data-i18n="proj.bars.search">On vols veure el partit?</span>
              <span class="trobar-filter-icon">⚙</span>
            </div>
            <div class="trobar-match">
              <p class="trobar-match-label" data-i18n="proj.bars.match">Proper partit · ds., 4 d'abr., 21:00</p>
              <div class="trobar-match-teams">
                <span class="trobar-team">ATM</span>
                <span class="trobar-vs">vs</span>
                <span class="trobar-team trobar-barca">FCB</span>
              </div>
            </div>
            <div class="trobar-map">
              <div class="trobar-pin" style="top:18%;left:42%">📍</div>
              <div class="trobar-pin" style="top:30%;left:55%">📍</div>
              <div class="trobar-pin" style="top:25%;left:38%">📍</div>
              <div class="trobar-pin" style="top:45%;left:30%">📍</div>
              <div class="trobar-pin" style="top:40%;left:62%">📍</div>
              <div class="trobar-pin" style="top:55%;left:48%">📍</div>
              <div class="trobar-pin" style="top:65%;left:25%">📍</div>
              <div class="trobar-pin" style="top:35%;left:70%">📍</div>
              <div class="trobar-dot"></div>
            </div>
            <div class="trobar-nav">
              <div class="trobar-nav-item">📅<span data-i18n="proj.bars.nav1">Partits</span></div>
              <div class="trobar-nav-item active"><span class="trobar-nav-pin">📍</span><span data-i18n="proj.bars.nav2">Mapa</span></div>
              <div class="trobar-nav-item">👤<span data-i18n="proj.bars.nav3">Perfil</span></div>
            </div>
          </div>
        </div>`
    },

    'projecte-stremio': {
      cls: 'pv-stremio',
      html: `
        <div class="streaming-mockup">
          <div class="streaming-bar">
            <span class="streaming-logo">▶ Stremio</span>
            <span class="streaming-lang">CA</span>
          </div>
          <div class="streaming-content">
            <div class="streaming-title">En Català</div>
            <div class="streaming-grid">
              <div class="streaming-card sc-1"></div>
              <div class="streaming-card sc-2"></div>
              <div class="streaming-card sc-3"></div>
              <div class="streaming-card sc-4"></div>
              <div class="streaming-card sc-5"></div>
              <div class="streaming-card sc-6"></div>
            </div>
            <div class="streaming-platforms">
              <span>3Cat</span>
              <span>Filmin</span>
              <span>Netflix</span>
              <span>Disney+</span>
              <span>Max</span>
            </div>
          </div>
        </div>`
    },

    'projecte-alerta': {
      cls: 'pv-alerta',
      html: `
        <div class="map-mockup">
          <div class="browser-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="map-content">
            <div class="map-surface">
              <div class="map-alert-pin" style="top:22%;left:65%"><span class="map-pin-dot urgent"></span></div>
              <div class="map-alert-pin" style="top:35%;left:45%"><span class="map-pin-dot"></span></div>
              <div class="map-alert-pin" style="top:30%;left:72%"><span class="map-pin-dot urgent"></span></div>
              <div class="map-alert-pin" style="top:50%;left:38%"><span class="map-pin-dot"></span></div>
              <div class="map-alert-pin" style="top:45%;left:58%"><span class="map-pin-dot urgent"></span></div>
              <div class="map-alert-pin" style="top:60%;left:52%"><span class="map-pin-dot"></span></div>
              <div class="map-alert-pin" style="top:68%;left:30%"><span class="map-pin-dot"></span></div>
            </div>
            <div class="map-legend">
              <span class="map-legend-item"><span class="map-pin-dot urgent small"></span> Urgent</span>
              <span class="map-legend-item"><span class="map-pin-dot small"></span> Programat</span>
            </div>
          </div>
        </div>`
    },

    'projecte-odc': {
      cls: 'pv-odc',
      html: `
        <div class="odc-mockup">
          <div class="browser-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="odc-content">
            <div class="odc-sidebar">
              <div class="odc-nav-item active">📋 Instruments</div>
              <div class="odc-nav-item">👥 Subjects</div>
              <div class="odc-nav-item">📊 Data</div>
              <div class="odc-nav-item">⚙ Settings</div>
            </div>
            <div class="odc-main">
              <div class="odc-form-field"></div>
              <div class="odc-form-field short"></div>
              <div class="odc-form-field"></div>
              <div class="odc-form-btn"></div>
            </div>
          </div>
        </div>`
    },

    'projecte-aparador': {
      cls: 'pv-aparador',
      html: `
        <div class="aparador-mockup">
          <div class="browser-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
          </div>
          <div class="aparador-content">
            <div class="aparador-topbar">
              <span class="aparador-brand">📷 Aparador</span>
              <span class="aparador-login">Inicia sessió</span>
            </div>
            <div class="aparador-landing">
              <span class="aparador-badge">📷 Repositori de fotos per a fotògrafs</span>
              <h4 class="aparador-title">Les teves fotos,<br><span class="aparador-gradient">a un clic</span></h4>
              <p class="aparador-subtitle">Comparteix àlbums en alta qualitat amb un simple codi.</p>
              <div class="aparador-input-field" aria-hidden="true">
                <span class="aparador-input-icon">🔑</span>
                <span class="aparador-input-text">Introdueix el codi de l'àlbum</span>
              </div>
            </div>
          </div>
        </div>`
    },

    'projecte-aesso': {
      cls: 'pv-aesso',
      html: `
        <div class="browser-mockup">
          <div class="browser-bar">
            <span class="dot red"></span>
            <span class="dot yellow"></span>
            <span class="dot green"></span>
            <span class="terminal-title">aesso · calculadora g_tot</span>
          </div>
          <div class="aesso-mockup" aria-hidden="true">
            <div class="aesso-title">Calculadora de protecció solar</div>
            <div class="aesso-simple-list">
              <div class="aesso-simple-item">
                <span>Dades del vidre</span>
                <span class="aesso-simple-tag">completat</span>
              </div>
              <div class="aesso-simple-item">
                <span>Dades de la protecció solar</span>
                <span class="aesso-simple-tag">completat</span>
              </div>
              <div class="aesso-simple-item">
                <span>Informe final</span>
                <span class="aesso-simple-tag">preparat</span>
              </div>
            </div>
            <div class="aesso-result">
              <span class="aesso-result-label">Resultat final</span>
              <span class="aesso-result-value">0,10</span>
              <span class="aesso-result-tag">✓ llest per exportar</span>
            </div>
            <div class="aesso-actions">
              <span class="aesso-btn aesso-btn-primary">Descarregar informe PDF</span>
              <span class="aesso-btn aesso-btn-outline">Editar dades</span>
            </div>
          </div>
        </div>`
    },

    'projecte-base-skills': {
      cls: 'pv-base-skills',
      html: `
        <div class="bs-card" aria-label="Simulació terminal: escrius la sinopsi i els agents creen el repositori">
          <div class="bs-card-head">
            <span class="bs-dot"></span>
            <span class="bs-card-title">base-skills · sessió assistida</span>
          </div>
          <div class="bs-terminal" aria-hidden="true">
            <p class="bs-line bs-l1"><span class="bs-prompt">$</span> Quin projecte vols crear?</p>
            <p class="bs-line bs-l2"><span class="bs-prompt">&gt;</span> Plataforma de cites mèdiques amb registre, calendari i panell admin</p>
            <p class="bs-line bs-l3"><span class="bs-agent">[planner]</span> proposa stack: Next.js + PostgreSQL + Auth.js</p>
            <p class="bs-line bs-l4"><span class="bs-agent">[scaffolder]</span> crea estructura inicial del repositori...</p>
            <p class="bs-line bs-l5"><span class="bs-tree">├─</span> app/, components/, db/, tests/</p>
            <p class="bs-line bs-l6"><span class="bs-tree">└─</span> README.md amb instruccions d'arrencada</p>
            <p class="bs-line bs-l7"><span class="bs-ok">✓</span> Repositori creat i llest per continuar</p>
          </div>
        </div>`
    }

  };
})(window);
