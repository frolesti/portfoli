document.addEventListener('DOMContentLoaded', () => {
  const CLIENTS = {
    'prova-interna': {
      name: 'Prova interna',
      token: 'prova-interna-20261022',
      accent: '#2a7a6e',
      bg1: '#edf7f4',
      bg2: '#edf1f7'
    },
    'alta-medical-services': {
      name: 'ALTA medical services',
      token: 'alta-7c5d2f41b9',
      accent: '#7f7be8',
      bg1: '#f2f0ff',
      bg2: '#ecebff'
    },
    aesso: {
      name: 'AESSO (Asociación Española de Sombreado Solar)',
      token: 'aesso-3d9a8c7e21',
      accent: '#25b2aa',
      bg1: '#eaf9f7',
      bg2: '#e9f7ff'
    },
    'configura-cat': {
      name: 'Configura.cat',
      token: 'configura-4f2a6d81ce',
      accent: '#6f57d2',
      bg1: '#f0ecff',
      bg2: '#f4efff'
    },
    'alianca-digital-cat': {
      name: 'Aliança per la presència digital del català',
      token: 'alianca-8b1c5d3e74',
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
  const companyIdInput = document.getElementById('rv-company-id');
  const companyNameInput = document.getElementById('rv-company-name');
  const clientTokenInput = document.getElementById('rv-client-token');
  const projectInput = document.getElementById('rv-project');

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

  const isTest = clientId === 'prova-interna';
  if (title) title.textContent = isTest ? 'Prova interna de ressenya' : 'La teva experiència amb frolesti';
  if (lead) lead.textContent = isTest ? 'Aquest enviament és una prova interna. No és una opinió de cap client i no es publicarà.' : 'Comparteix com ha anat la col·laboració: què ha funcionat bé i què podríem millorar. En enviar-la, el teu nom, el projecte i la teva opinió es publicaran al web.';
  if (context) {
    context.innerHTML = `
      <div class="client-review-note">
        <div class="client-review-brand">
          <strong>${client.name}</strong>
          <span>${isTest ? 'Prova interna, exclosa de la publicació.' : 'La ressenya quedarà vinculada automàticament a aquest client.'}</span>
        </div>
      </div>
    `;
  }

  if (companyIdInput) companyIdInput.value = clientId;
  if (companyNameInput) companyNameInput.value = client.name;
  if (clientTokenInput) clientTokenInput.value = token;

  const projects = window.REVIEW_PROJECTS[clientId] || [];
  const requestedProject = projects.find((project) => project.id === params.get('project'));
  if (params.get('project') && !requestedProject) {
    setError('El projecte d’aquest enllaç no correspon al client. Demana un enllaç corregit.');
    form.hidden = true;
    return;
  }
  const initialProject = requestedProject?.id || (projects.length === 1 ? projects[0].id : '');
  projectInput.value = initialProject;
  const linkedProject = projects.find((project) => project.id === initialProject);
  if (linkedProject && context) {
    const projectName = document.createElement('span');
    projectName.textContent = linkedProject.name;
    context.querySelector('.client-review-brand').appendChild(projectName);
  }

  const receiptKey = 'client-review-sent:' + JSON.stringify([clientId, token, initialProject]);
  let submitted = false;
  let sending = false;

  function showConfirmation() {
    submitted = true;
    form.hidden = true;
    form.querySelector('[type="submit"]').disabled = true;
    if (lead) lead.hidden = true;
    setStatus(status, 'S\'ha enviat correctament!', 'ok');
  }

  try {
    if (localStorage.getItem(receiptKey) === 'sent') showConfirmation();
  } catch {}
  if (!submitted) form.hidden = false;

  window.addEventListener('storage', (event) => {
    if (event.key === receiptKey && event.newValue === 'sent') showConfirmation();
  });

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (submitted || sending) return;
    sending = true;
    const fd = new FormData(form);

    const payload = {
      name: fd.get('name') || '',
      message: fd.get('message') || '',
      companyId: fd.get('companyId') || '',
      companyName: fd.get('companyName') || '',
      clientToken: fd.get('clientToken') || '',
      projectId: fd.get('projectId') || ''
    };

    const submitBtn = form.querySelector('[type="submit"]');
    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviant...';
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
      try { localStorage.setItem(receiptKey, 'sent'); } catch {}
      showConfirmation();
    } catch (err) {
      setStatus(status, err?.message || 'Ara mateix no s\'ha pogut enviar. Torna-ho a provar en un moment.', 'error');
    } finally {
      sending = false;
      submitBtn.textContent = 'Enviar comentari';
      submitBtn.disabled = submitted;
    }
  });
});