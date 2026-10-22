(function () {
  window.isLocalReviewPreview = location.protocol === 'file:' && new URLSearchParams(location.search).get('preview') === 'reviews';
  window.initLocalReviewPreview = function () {
    if (!window.isLocalReviewPreview) return false;
    document.documentElement.style.scrollBehavior = 'auto';
    document.documentElement.classList.add('is-local-review-preview');
    const storageKey = 'reviews-local-preview-v1';
    let saved = {};
    try { saved = JSON.parse(sessionStorage.getItem(storageKey) || '{}') || {}; } catch {}
    const section = document.getElementById('clients');
    const container = document.createElement('form');
    container.className = 'local-review-preview';
    container.setAttribute('aria-label', 'Simulació local de ressenyes');
    const notice = document.createElement('p');
    notice.className = 'local-review-notice';
    notice.textContent = 'SIMULACIÓ LOCAL · Ressenya de prova, no atribuïda als clients ni publicada.';
    const projectLabel = document.createElement('label');
    projectLabel.htmlFor = 'localReviewProject';
    projectLabel.textContent = 'Projecte';
    const select = document.createElement('select');
    select.id = 'localReviewProject';
    const choices = [];
    for (const [clientId, projects] of Object.entries(window.REVIEW_PROJECTS)) {
      const client = section.querySelector('.client-logo-card[data-client-id="' + clientId + '"]');
      if (!client) continue;
      for (const project of projects) {
        const option = document.createElement('option');
        option.value = project.id;
        option.textContent = project.name + ' · ' + client.querySelector('.client-logo-name').textContent;
        select.appendChild(option);
        choices.push({ ...project, clientId, companyName: client.querySelector('.client-logo-name').textContent });
      }
    }
    const editor = document.createElement('details');
    const summary = document.createElement('summary');
    summary.textContent = 'Edita la ressenya de prova';
    const nameLabel = document.createElement('label');
    nameLabel.htmlFor = 'localReviewName';
    nameLabel.textContent = 'Nom';
    const name = document.createElement('input');
    name.id = 'localReviewName';
    name.value = typeof saved.name === 'string' ? saved.name : 'Froilán Olesti Casas';
    const messageLabel = document.createElement('label');
    messageLabel.htmlFor = 'localReviewMessage';
    messageLabel.textContent = 'Ressenya';
    const message = document.createElement('textarea');
    message.id = 'localReviewMessage';
    message.rows = 3;
    message.value = typeof saved.message === 'string' ? saved.message : 'Molt content de la feina, professional i atractiu jeje';
    editor.append(summary, nameLabel, name, messageLabel, message);
    container.append(notice, projectLabel, select, editor);
    section.querySelector('.client-testimonials').before(container);
    const host = document.createElement('div');
    host.dataset.localReviewPreview = 'review';
    select.value = choices.some((project) => project.id === saved.projectId) ? saved.projectId : choices[0].id;
    function render() {
      const project = choices.find((item) => item.id === select.value);
      host.replaceChildren(window.createClientReviewCard({
        name: name.value,
        message: message.value,
        companyName: project.companyName,
        projectName: project.name,
        date: '2026-10-22T09:02:01.192Z'
      }));
      section.querySelector('[data-client-reviews="' + project.clientId + '"]').appendChild(host);
      section.querySelector('.client-testimonials').hidden = false;
      try { sessionStorage.setItem(storageKey, JSON.stringify({ projectId: project.id, name: name.value, message: message.value })); } catch {}
    }
    container.addEventListener('submit', (event) => event.preventDefault());
    container.addEventListener('input', render);
    select.addEventListener('change', render);
    render();
    return true;
  };
})();