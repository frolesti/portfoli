document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/.netlify/functions/reviews-admin';
  const STORAGE_KEY = 'reviews_admin_key';
  const CLIENTS = {
    'prova-interna': {
      name: 'Prova interna',
      token: 'prova-interna-20261022',
      accent: '#2a7a6e'
    },
    'alta-medical-services': {
      name: 'ALTA medical services',
      token: 'alta-7c5d2f41b9',
      accent: '#7f7be8'
    },
    aesso: {
      name: 'AESSO (Asociación Española de Sombreado Solar)',
      token: 'aesso-3d9a8c7e21',
      accent: '#25b2aa'
    },
    'configura-cat': {
      name: 'Configura.cat',
      token: 'configura-4f2a6d81ce',
      accent: '#6f57d2'
    },
    'alianca-digital-cat': {
      name: 'Aliança per la presència digital del català',
      token: 'alianca-8b1c5d3e74',
      accent: '#e18a21'
    }
  };

  const authPanel = document.getElementById('authPanel');
  const dashboard = document.getElementById('dashboard');
  const authForm = document.getElementById('authForm');
  const authStatus = document.getElementById('authStatus');
  const dashboardStatus = document.getElementById('dashboardStatus');
  const pendingList = document.getElementById('pendingList');
  const stats = document.getElementById('stats');
  const refreshBtn = document.getElementById('refreshBtn');
  const logoutBtn = document.getElementById('logoutBtn');
  const inviteCards = document.querySelectorAll('.invite-card');

  let adminKey = sessionStorage.getItem(STORAGE_KEY) || '';
  let reviews = [];
  let previewReview;
  const preview = document.getElementById('reviewPreview');
  const previewClient = document.getElementById('previewClient');
  const previewFrame = document.getElementById('previewFrame');
  const reviewFilter = document.getElementById('reviewFilter');

  function node(tag, text, className) {
    const result = document.createElement(tag);
    if (text) result.textContent = text;
    if (className) result.className = className;
    return result;
  }

  Object.entries(CLIENTS).forEach(([id, client]) => {
    const option = node('option', client.name);
    option.value = id;
    previewClient.appendChild(option);
  });

  function renderPreview() {
    const clientId = previewClient.value;
    const client = CLIENTS[clientId];
    previewFrame.onload = () => {
      const doc = previewFrame.contentDocument;
      if (!doc || !previewReview) return;
      const article = doc.createElement('article');
      article.className = 'client-logo-card';
      const sourceLogo = document.querySelector('.invite-card[data-client-id="' + clientId + '"] img');
      if (sourceLogo) {
        const logo = doc.createElement('img');
        logo.src = sourceLogo.src;
        logo.alt = client.name;
        article.appendChild(logo);
      }
      const name = doc.createElement('p');
      name.className = 'client-logo-name';
      name.textContent = client.name;
      const slot = doc.createElement('div');
      slot.className = 'client-reviews';
      slot.appendChild(window.createClientReviewCard(previewReview));
      article.append(name, slot);
      doc.body.appendChild(article);
    };
    const stylesheet = new URL('../assets/styles.css?v=20261022-reviews', window.location.href).href;
    previewFrame.srcdoc = '<!doctype html><html lang="ca" data-profile="professional"><head><meta name="viewport" content="width=device-width,initial-scale=1"><link rel="stylesheet" href="' + stylesheet + '"><link href="https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,400;9..144,600&family=Inter:wght@400;500;600&display=swap" rel="stylesheet"><style>body{margin:0;padding:24px}.client-logo-card{max-width:360px;margin:auto}.client-review-card{overflow-wrap:anywhere}</style></head><body data-profile="professional"></body></html>';
  }

  function openPreview(review) {
    previewReview = review || {
      name: 'Nom de la persona',
      message: 'Aquesta és una ressenya fictícia per comprovar com es veuran les opinions dels clients. No és una valoració real i no es publica.',
      date: new Date().toISOString(),
      companyId: 'aesso'
    };
    previewClient.value = CLIENTS[previewReview.companyId] ? previewReview.companyId : 'prova-interna';
    previewClient.disabled = !!review;
    document.getElementById('previewNotice').textContent = review ? 'Previsualització privada. Obrir-la no publica la ressenya.' : 'Exemple fictici · no es publica.';
    renderPreview();
    preview.showModal();
  }

  document.getElementById('demoPreviewBtn').addEventListener('click', () => openPreview());
  document.getElementById('closePreviewBtn').addEventListener('click', () => preview.close());
  previewClient.addEventListener('change', renderPreview);

  function setStatus(node, text, kind) {
    if (!node) return;
    if (!text) {
      node.hidden = true;
      node.className = 'status';
      node.textContent = '';
      return;
    }
    node.hidden = false;
    node.className = `status ${kind || ''}`.trim();
    node.textContent = text;
  }

  function formatDate(iso) {
    try {
      return new Date(iso).toLocaleString('ca-ES', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return '';
    }
  }

  function buildInviteUrl(clientId) {
    const client = CLIENTS[clientId];
    if (!client) return '';
    const url = new URL('../review.html', window.location.href);
    url.searchParams.set('client', clientId);
    url.searchParams.set('token', client.token);
    return url.toString();
  }

  function syncInviteCards() {
    inviteCards.forEach((card) => {
      const clientId = card.getAttribute('data-client-id');
      const client = clientId ? CLIENTS[clientId] : null;
      const inviteUrl = buildInviteUrl(clientId || '');
      const urlNode = card.querySelector('[data-invite-url]');
      const copyBtn = card.querySelector('[data-copy-invite]');
      const openBtn = card.querySelector('[data-open-invite]');

      if (client?.accent) {
        card.style.setProperty('--client-accent', client.accent);
      }

      if (urlNode) urlNode.textContent = inviteUrl;
      if (openBtn) {
        openBtn.href = inviteUrl || '#';
        openBtn.hidden = !inviteUrl;
      }

      copyBtn?.addEventListener('click', async () => {
        if (!inviteUrl) return;
        try {
          await navigator.clipboard.writeText(inviteUrl);
          const original = copyBtn.textContent;
          copyBtn.textContent = 'Copiat';
          setTimeout(() => { copyBtn.textContent = original; }, 1500);
        } catch {
          const fallback = window.prompt('Copia aquest enllaç:', inviteUrl);
          if (fallback === null) return;
        }
      });
      const previewButton = node('button', 'Previsualitza', 'btn');
      previewButton.type = 'button';
      previewButton.addEventListener('click', () => openPreview({
        name: 'Exemple fictici',
        message: 'Text d’exemple per veure la presentació de la ressenya. No és una opinió real ni es publica.',
        date: new Date().toISOString(),
        companyId: clientId
      }));
      card.querySelector('.invite-actions').appendChild(previewButton);
    });
  }

  async function apiCall(method, body) {
    const headers = {
      'Content-Type': 'application/json',
      'X-Admin-Key': adminKey
    };

    const res = await fetch(API_URL, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined
    });

    let data = {};
    try {
      data = await res.json();
    } catch {
      data = {};
    }

    if (!res.ok) {
      const message = data.message || `Error ${res.status}`;
      const err = new Error(message);
      err.status = res.status;
      throw err;
    }

    return data;
  }

  function showLogin() {
    authPanel.hidden = false;
    dashboard.hidden = true;
  }

  function showDashboard() {
    authPanel.hidden = true;
    dashboard.hidden = false;
  }

  function renderStats(counters) {
    if (!stats) return;
    const entries = [
      ['Pendents', counters?.pending ?? 0],
      ['Aprovats', counters?.approved ?? 0],
      ['Rebutjats', counters?.rejected ?? 0],
      ['Total', counters?.total ?? 0]
    ];

    stats.innerHTML = entries
      .map(([label, value]) => (
        `<article class="stat"><span class="stat-label">${label}</span><span class="stat-value">${value}</span></article>`
      ))
      .join('');
  }

  function renderPending(items) {
    if (!pendingList) return;

    if (!items || items.length === 0) {
      pendingList.replaceChildren(node('div', 'No hi ha ressenyes en aquesta vista.', 'empty'));
      return;
    }

    pendingList.replaceChildren(...items.map((review) => {
      const card = node('article', null, 'review-card');
      card.dataset.id = Number(review.id);
      const top = node('div', null, 'review-top');
      top.append(node('strong', review.name || 'Anònim'), node('span', formatDate(review.date), 'review-meta'));
      card.appendChild(top);
      if (review.companyName) card.appendChild(node('p', review.companyName, 'review-meta'));
      if (review.isTest || review.companyId === 'prova-interna') card.appendChild(node('p', 'Prova interna · no es publica', 'review-meta'));
      card.appendChild(node('p', review.message, 'review-message'));
      const actions = node('div', null, 'review-actions');
      for (const [action, label, style] of [['preview', 'Previsualitza', ''], ['approve', 'Aprovar', 'btn-ok'], ['reject', 'Rebutjar', 'btn-warn'], ['delete', 'Esborrar', 'btn-danger']]) {
        if (action === 'approve' && (review.isTest || review.companyId === 'prova-interna')) continue;
        const button = node('button', label, 'btn ' + style);
        button.type = 'button';
        button.dataset.action = action;
        actions.appendChild(button);
      }
      card.appendChild(actions);
      return card;
    }));
  }

  function filterReviews() {
    renderPending(reviews.filter((review) => {
      if (reviewFilter.value === 'test') return review.isTest || review.companyId === 'prova-interna';
      const status = review.status || (review.approved === false ? 'pending' : 'approved');
      return status === reviewFilter.value;
    }));
  }

  reviewFilter.addEventListener('change', filterReviews);

  async function refreshDashboard() {
    setStatus(dashboardStatus, '', '');
    const data = await apiCall('GET');
    renderStats(data.counters);
    reviews = data.reviews || data.pending || [];
    filterReviews();
  }

  async function handleModerationAction(reviewId, action, btn) {
    const originalText = btn.textContent;
    btn.disabled = true;
    btn.textContent = 'Processant...';

    try {
      await apiCall('PATCH', { id: reviewId, action });
      setStatus(dashboardStatus, 'Accio aplicada correctament.', 'ok');
      await refreshDashboard();
    } catch (err) {
      if (err.status === 401) {
        adminKey = '';
        sessionStorage.removeItem(STORAGE_KEY);
        showLogin();
        setStatus(authStatus, 'Sessio caducada o clau incorrecta. Torna a entrar.', 'error');
        return;
      }
      setStatus(dashboardStatus, err.message || 'No s ha pogut completar l accio.', 'error');
    } finally {
      btn.disabled = false;
      btn.textContent = originalText;
    }
  }

  authForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const keyInput = document.getElementById('adminKey');
    const candidate = String(keyInput?.value || '').trim();

    if (!candidate) {
      setStatus(authStatus, 'Has d introduir una clau.', 'error');
      return;
    }

    adminKey = candidate;
    sessionStorage.setItem(STORAGE_KEY, adminKey);

    try {
      await refreshDashboard();
      keyInput.value = '';
      setStatus(authStatus, '', '');
      showDashboard();
    } catch (err) {
      adminKey = '';
      sessionStorage.removeItem(STORAGE_KEY);
      showLogin();
      setStatus(authStatus, err.message || 'No s ha pogut validar la clau.', 'error');
    }
  });

  refreshBtn?.addEventListener('click', async () => {
    try {
      await refreshDashboard();
      setStatus(dashboardStatus, 'Dades actualitzades.', 'ok');
    } catch (err) {
      setStatus(dashboardStatus, err.message || 'No s ha pogut refrescar.', 'error');
    }
  });

  logoutBtn?.addEventListener('click', () => {
    adminKey = '';
    sessionStorage.removeItem(STORAGE_KEY);
    showLogin();
    setStatus(authStatus, 'Sessio tancada.', 'ok');
    setStatus(dashboardStatus, '', '');
  });

  pendingList?.addEventListener('click', async (e) => {
    const btn = e.target.closest('button[data-action]');
    if (!btn) return;

    const card = btn.closest('.review-card');
    if (!card) return;

    const id = Number(card.dataset.id);
    const action = btn.dataset.action;
    if (!Number.isFinite(id) || !action) return;

    if (action === 'preview') {
      const review = reviews.find((item) => Number(item.id) === id);
      if (review) openPreview(review);
      return;
    }

    if (action === 'delete') {
      const confirmed = window.confirm('Segur que vols esborrar aquest comentari?');
      if (!confirmed) return;
    }

    await handleModerationAction(id, action, btn);
  });

  if (adminKey) {
    refreshDashboard()
      .then(() => showDashboard())
      .catch(() => {
        adminKey = '';
        sessionStorage.removeItem(STORAGE_KEY);
        showLogin();
      });
  } else {
    showLogin();
  }

  syncInviteCards();
});
