document.addEventListener('DOMContentLoaded', () => {
  const API_URL = '/.netlify/functions/reviews-admin';
  const STORAGE_KEY = 'reviews_admin_key';

  const authPanel = document.getElementById('authPanel');
  const dashboard = document.getElementById('dashboard');
  const authForm = document.getElementById('authForm');
  const authStatus = document.getElementById('authStatus');
  const dashboardStatus = document.getElementById('dashboardStatus');
  const pendingList = document.getElementById('pendingList');
  const stats = document.getElementById('stats');
  const refreshBtn = document.getElementById('refreshBtn');
  const logoutBtn = document.getElementById('logoutBtn');

  let adminKey = sessionStorage.getItem(STORAGE_KEY) || '';

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

  function starsHtml(n) {
    const value = Math.min(5, Math.max(1, Number(n) || 0));
    return '★'.repeat(value) + '☆'.repeat(5 - value);
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
      pendingList.innerHTML = '<div class="empty">No hi ha comentaris pendents ara mateix.</div>';
      return;
    }

    pendingList.innerHTML = items.map((review) => `
      <article class="review-card" data-id="${Number(review.id)}">
        <div class="review-top">
          <strong>${review.name || 'Anonim'}</strong>
          <span class="review-meta">${starsHtml(review.rating)} · ${formatDate(review.date)}</span>
        </div>
        <p class="review-message">${review.message || ''}</p>
        <div class="review-actions">
          <button type="button" class="btn btn-ok" data-action="approve">Aprovar</button>
          <button type="button" class="btn btn-warn" data-action="reject">Rebutjar</button>
          <button type="button" class="btn btn-danger" data-action="delete">Esborrar</button>
        </div>
      </article>
    `).join('');
  }

  async function refreshDashboard() {
    setStatus(dashboardStatus, '', '');
    const data = await apiCall('GET');
    renderStats(data.counters);
    renderPending(data.pending);
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
});
