(function initProjectDialog() {
  const dialog = document.createElement('dialog');
  dialog.className = 'project-dialog';
  dialog.id = 'projectDialog';
  dialog.lang = 'ca';
  dialog.setAttribute('aria-labelledby', 'projectDialogTitle');
  dialog.innerHTML = '<header class="project-dialog-header"><span>Fitxa de projecte</span><button type="button" class="project-dialog-close" aria-label="Tanca la fitxa" title="Tanca la fitxa" autofocus>&times;</button></header><div class="project-dialog-content"></div>';
  document.body.appendChild(dialog);

  const content = dialog.querySelector('.project-dialog-content');
  let previousFocus;
  let previousOverflow;

  function element(tag, text, className) {
    const node = document.createElement(tag);
    if (text) node.textContent = text;
    if (className) node.className = className;
    return node;
  }

  function section(title) {
    const node = element('section');
    node.appendChild(element('h3', title));
    content.appendChild(node);
    return node;
  }

  window.openProjectDialog = function (projectId) {
    const item = window.PROJECT_ARTICLES?.[projectId];
    if (!item || dialog.open) return;
    previousFocus = document.activeElement;
    content.replaceChildren();
    content.appendChild(element('p', item.tag, 'project-dialog-tag'));
    const title = element('h2', item.title);
    title.id = 'projectDialogTitle';
    content.appendChild(title);
    content.appendChild(element('p', item.lead, 'project-dialog-lead'));

    const summary = element('dl', null, 'project-dialog-summary');
    for (const [label, value] of [['Estat', item.status], ['Participació', item.role], ['Revisió de la fitxa', item.reviewed]]) {
      if (!value) continue;
      const row = element('div');
      row.append(element('dt', label), element('dd', value));
      summary.appendChild(row);
    }
    content.appendChild(summary);

    if (item.articleHtml) {
      const body = element('div', null, 'project-dialog-article');
      body.innerHTML = item.articleHtml;
      content.appendChild(body);
    }

    if (item.features?.length) {
      const features = section('Funcionalitats');
      const list = element('dl', null, 'project-dialog-features');
      item.features.forEach((feature) => {
        list.append(element('dt', feature.title), element('dd', feature.desc));
      });
      features.appendChild(list);
    }

    if (item.stack?.length) {
      const stack = section('Tecnologies i integracions');
      const list = element('ul', null, 'project-tech');
      item.stack.forEach((tech) => list.appendChild(element('li', tech)));
      stack.appendChild(list);
    }

    for (const [title, values] of [['Arquitectura i desplegament', item.architecture], ['Dades i privacitat', item.privacy], ['Abast i limitacions', item.limits]]) {
      if (!values?.length) continue;
      const list = element('ul', null, 'project-dialog-list');
      values.forEach((value) => list.appendChild(element('li', value)));
      section(title).appendChild(list);
    }

    if (item.images?.length) {
      const gallery = section('Captures del projecte');
      item.images.forEach((src) => {
        const image = element('img');
        image.src = src;
        image.alt = item.title;
        image.loading = 'lazy';
        gallery.appendChild(image);
      });
    }

    if (item.links?.length) {
      const links = section('Enllaços del projecte');
      const list = element('ul', null, 'project-dialog-list');
      item.links.forEach((link) => {
        const anchor = element('a', link.label);
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        const row = element('li');
        row.appendChild(anchor);
        list.appendChild(row);
      });
      links.appendChild(list);
    }

    previousOverflow = document.documentElement.style.overflow;
    document.documentElement.style.overflow = 'hidden';
    dialog.showModal();
    dialog.scrollTop = 0;
  };

  dialog.querySelector('.project-dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', (event) => {
    if (event.target !== dialog) return;
    const bounds = dialog.getBoundingClientRect();
    if (event.clientX < bounds.left || event.clientX > bounds.right || event.clientY < bounds.top || event.clientY > bounds.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.documentElement.style.overflow = previousOverflow;
    previousFocus?.focus({ preventScroll: true });
  });

  document.querySelectorAll('.project-detail[id]').forEach((article) => {
    if (!window.PROJECT_ARTICLES?.[article.id]) return;
    const button = element('button', 'Fitxa tècnica', 'btn btn-small btn-outline');
    button.type = 'button';
    button.setAttribute('aria-haspopup', 'dialog');
    button.setAttribute('aria-controls', dialog.id);
    button.setAttribute('aria-label', 'Fitxa tècnica: ' + window.PROJECT_ARTICLES[article.id].title);
    button.addEventListener('click', () => window.openProjectDialog(article.id));
    const links = article.querySelector('.project-links');
    if (links) links.appendChild(button);
    else article.querySelector('.project-info')?.appendChild(button);
  });
})();