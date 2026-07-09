document.addEventListener('DOMContentLoaded', () => {
  const CLIENTS = {
    'alta-medical-services': {
      name: 'ALTA medical services',
      token: 'alta-7c5d2f41b9',
      logo: 'assets/img/clients/alta-medical-services.png',
      accent: '#7f7be8',
      bg1: '#f2f0ff',
      bg2: '#ecebff'
    },
    aesso: {
      name: 'AESSO',
      token: 'aesso-3d9a8c7e21',
      logo: 'assets/img/clients/aesso.png',
      accent: '#25b2aa',
      bg1: '#eaf9f7',
      bg2: '#e9f7ff'
    },
    'configura-cat': {
      name: 'Configura.cat',
      token: 'configura-4f2a6d81ce',
      logo: 'assets/img/clients/configura.png',
      accent: '#6f57d2',
      bg1: '#f0ecff',
      bg2: '#f4efff'
    },
    'alianca-digital-cat': {
      name: 'Aliança per la presència digital del català',
      token: 'alianca-8b1c5d3e74',
      logo: 'assets/img/clients/aliança.png',
      accent: '#e18a21',
      bg1: '#fff5e8',
      bg2: '#fff0de'
    }
  };

  const title = document.getElementById('clientReviewTitle');
  const lead = document.getElementById('clientReviewLead');
  const context = document.getElementById('clientReviewContext');
  const errorBox = document.getElementById('clientReviewError');
  const form = document.getElementById('clientReviewForm');
  const status = document.getElementById('clientReviewStatus');
  const nameInput = document.getElementById('rv-name');
  const companyIdInput = document.getElementById('rv-company-id');
  const companyNameInput = document.getElementById('rv-company-name');
  const clientTokenInput = document.getElementById('rv-client-token');

  function setStatus(node, text, kind) {
    if (!node) return;
    if (!text) {
      node.hidden = true;
      node.className = 'review-form-status';
      node.textContent = '';
      return;
    }
    node.hidden = false;
    node.className = `review-form-status ${kind || ''}`.trim();
    node.textContent = text;
  }

  function setError(text) {
    if (!errorBox) return;
    if (!text) {
      errorBox.hidden = true;
      errorBox.textContent = '';
      return;
    }
    errorBox.hidden = false;
    errorBox.textContent = text;
  }

  function safeJson(res) {
    return res.json().catch(() => ({}));
  }

  const params = new URLSearchParams(window.location.search);
  const clientId = params.get('client') || '';
  const token = params.get('token') || '';
  const client = clientId ? CLIENTS[clientId] : null;
  const matches = !!client && token === client.token;

  if (!matches) {
    setError('Aquest enllaç no és vàlid. Demana que se\'t regeneri un enllaç nou i de seguida te\'l reenvio.');
    if (form) form.hidden = true;
    if (title) title.textContent = 'Enllaç no vàlid';
    if (lead) lead.textContent = 'No puc obrir el formulari perquè aquest enllaç no està associat a cap client actiu.';
    return;
  }

  document.documentElement.style.setProperty('--client-accent', client.accent || '#2a7a6e');
  document.documentElement.style.setProperty('--client-bg-1', client.bg1 || '#eef4f1');
  document.documentElement.style.setProperty('--client-bg-2', client.bg2 || '#efe7f4');

  if (title) title.textContent = `Introdueix el teu comentari sobre la feina que ha fet frolesti per a ${client.name}`;
  if (lead) lead.textContent = 'Aquest comentari ha de reflexar la teva experiència real amb el servei rebut i perquè recomanaries a frolesti a altres empreses o projectes.';
  if (context) {
    context.innerHTML = `
      <div class="client-review-note">
        <div class="client-review-logo-wrap">
          <img class="client-review-logo" src="${client.logo}" alt="${client.name}">
        </div>
        <div class="client-review-brand">
          <strong>${client.name}</strong>
          <span>El teu comentari quedarà vinculat automàticament dins de l'apartat de Clients de la <a href="/#clients">pàgina web</a>.</span>
        </div>
      </div>
    `;
  }

  if (companyIdInput) companyIdInput.value = clientId;
  if (companyNameInput) companyNameInput.value = client.name;
  if (clientTokenInput) clientTokenInput.value = token;
  if (form) form.hidden = false;

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);

    const payload = {
      name: fd.get('name') || '',
      message: fd.get('message') || '',
      companyId: fd.get('companyId') || '',
      companyName: fd.get('companyName') || '',
      clientToken: fd.get('clientToken') || ''
    };

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Publicant...';
    setStatus(status, '', '');

    try {
      const res = await fetch('/.netlify/functions/reviews', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await safeJson(res);

      if (!res.ok) {
        throw new Error(data.message || 'No s\'ha pogut publicar la ressenya.');
      }

      form.reset();
      if (companyIdInput) companyIdInput.value = clientId;
      if (companyNameInput) companyNameInput.value = client.name;
      if (clientTokenInput) clientTokenInput.value = token;
      if (nameInput) nameInput.value = '';
      setStatus(status, data.message || 'Comentari rebut. Gràcies!', 'ok');
    } catch (err) {
      setStatus(status, err?.message || 'Ara mateix no s\'ha pogut enviar. Torna-ho a provar en un moment.', 'error');
    } finally {
      submitBtn.textContent = 'Enviar comentari';
      submitBtn.disabled = false;
    }
  });
});