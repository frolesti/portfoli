document.addEventListener('DOMContentLoaded', () => {
  const CLIENTS = {
    'alta-medical-services': {
      name: 'ALTA medical services',
      token: 'alta-7c5d2f41b9'
    },
    aesso: {
      name: 'AESSO',
      token: 'aesso-3d9a8c7e21'
    },
    'configura-cat': {
      name: 'Configura.cat',
      token: 'configura-4f2a6d81ce'
    },
    'alianca-digital-cat': {
      name: 'Aliança per la presència digital del català',
      token: 'alianca-8b1c5d3e74'
    }
  };

  const title = document.getElementById('clientReviewTitle');
  const lead = document.getElementById('clientReviewLead');
  const context = document.getElementById('clientReviewContext');
  const errorBox = document.getElementById('clientReviewError');
  const form = document.getElementById('clientReviewForm');
  const note = document.getElementById('clientReviewNote');
  const status = document.getElementById('clientReviewStatus');
  const starBtns = document.querySelectorAll('.star-rating .star');
  const ratingInput = document.getElementById('rv-rating');
  const companyIdInput = document.getElementById('rv-company-id');
  const companyNameInput = document.getElementById('rv-company-name');
  const clientTokenInput = document.getElementById('rv-client-token');
  const nameInput = document.getElementById('rv-name');

  function starsHtml(n) {
    return '★'.repeat(n) + '☆'.repeat(5 - n);
  }

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
    setError('Aquest enllaç no és vàlid o ha caducat. Demana un enllaç nou a Frolesti.');
    if (form) form.hidden = true;
    if (title) title.textContent = 'Enllaç no vàlid';
    if (lead) lead.textContent = 'No puc mostrar el formulari perquè l’enllaç no correspon a cap client autoritzat.';
    return;
  }

  if (title) title.textContent = `Deixa la teva ressenya com a representant de ${client.name}`;
  if (lead) lead.textContent = `Aquest formulari és privat i està associat a ${client.name}. Quan l’enviïs, la ressenya apareixerà sota el seu client corresponent.`;
  if (context) {
    context.innerHTML = `
      <div class="client-review-note">
        <div class="client-review-brand">
          <strong>${client.name}</strong>
          <span>${starsHtml(5)} avaluació privada</span>
        </div>
        <p>Estàs enviant una ressenya en nom de l'empresa. Si no ets la persona correcta, tanca aquesta pàgina i demana un altre enllaç.</p>
      </div>
    `;
  }

  if (companyIdInput) companyIdInput.value = clientId;
  if (companyNameInput) companyNameInput.value = client.name;
  if (clientTokenInput) clientTokenInput.value = token;
  if (note) {
    note.textContent = `Aquesta ressenya s'associarà a ${client.name}.`;
    note.hidden = false;
    note.classList.add('review-form-context');
  }
  if (form) form.hidden = false;

  let selectedRating = 0;
  const updateSubmitState = () => {
    const submitBtn = form?.querySelector('[type="submit"]');
    if (submitBtn) submitBtn.disabled = selectedRating < 1;
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

  form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(form);
    const rating = parseInt(fd.get('rating') || '0', 10);
    if (!rating || rating < 1) return;

    const payload = {
      name: fd.get('name') || '',
      rating,
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
      selectedRating = 0;
      if (ratingInput) ratingInput.value = 0;
      starBtns.forEach((b) => b.classList.remove('active'));
      setStatus(status, data.message || 'Ressenya rebuda. La revisaré abans de publicar-la.', 'ok');
    } catch (err) {
      setStatus(status, err?.message || 'No s\'ha pogut publicar la ressenya. Torna-ho a intentar.', 'error');
    } finally {
      submitBtn.textContent = 'Publicar ressenya';
      updateSubmitState();
    }
  });
});