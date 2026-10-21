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

  function section(parent, title, className) {
    const node = element('section', null, className);
    node.appendChild(element('h3', title));
    parent.appendChild(node);
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

    const tabs = element('div', null, 'project-dialog-tabs');
    tabs.setAttribute('role', 'tablist');
    tabs.setAttribute('aria-label', 'Contingut del projecte');
    const panels = ['Projecte', 'Detalls tècnics'].map((label, index) => {
      const tab = element('button', label);
      tab.type = 'button';
      tab.id = 'projectDialogTab' + index;
      tab.setAttribute('role', 'tab');
      tab.setAttribute('aria-controls', 'projectDialogPanel' + index);
      tabs.appendChild(tab);
      const panel = element('div', null, 'project-dialog-panel');
      panel.id = 'projectDialogPanel' + index;
      panel.setAttribute('role', 'tabpanel');
      panel.setAttribute('aria-labelledby', tab.id);
      panel.tabIndex = 0;
      return panel;
    });
    const selectTab = (index) => {
      Array.from(tabs.children).forEach((tab, position) => {
        tab.setAttribute('aria-selected', String(position === index));
        tab.tabIndex = position === index ? 0 : -1;
        panels[position].hidden = position !== index;
      });
      dialog.scrollTop = 0;
    };
    Array.from(tabs.children).forEach((tab, index) => {
      tab.addEventListener('click', () => selectTab(index));
      tab.addEventListener('keydown', (event) => {
        if (!['ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) return;
        event.preventDefault();
        const next = event.key === 'Home' ? 0 : event.key === 'End' ? 1 : 1 - index;
        selectTab(next);
        tabs.children[next].focus({ preventScroll: true });
      });
    });
    content.append(tabs, ...panels);
    selectTab(0);
    const [overview, technical] = panels;
    overview.classList.add('project-dialog-overview');

    const media = element('figure', null, 'project-dialog-media');
    if (item.images?.length) {
      const image = element('img', null, 'project-dialog-screenshot');
      image.src = item.images[0].src;
      image.alt = item.images[0].alt;
      image.decoding = 'async';
      const caption = element('figcaption', item.images[0].alt);
      const thumbnails = element('div', null, 'project-dialog-thumbnails');
      thumbnails.setAttribute('role', 'group');
      thumbnails.setAttribute('aria-label', 'Captures del projecte');
      item.images.forEach((capture, index) => {
        const button = element('button');
        button.type = 'button';
        button.setAttribute('aria-label', capture.alt);
        button.setAttribute('aria-pressed', String(index === 0));
        const thumbnail = element('img');
        thumbnail.src = capture.src;
        thumbnail.alt = '';
        button.appendChild(thumbnail);
        button.addEventListener('click', () => {
          image.src = capture.src;
          image.alt = capture.alt;
          caption.textContent = capture.alt;
          Array.from(thumbnails.children).forEach((control) => control.setAttribute('aria-pressed', String(control === button)));
        });
        thumbnails.appendChild(button);
      });
      media.append(image, caption, thumbnails);
    } else {
      const source = document.getElementById(projectId)?.querySelector('.project-visual');
      if (source) {
        const visual = source.cloneNode(true);
        visual.classList.remove('is-clickable');
        for (const node of [visual, ...visual.querySelectorAll('*')]) {
          for (const attribute of ['id', 'tabindex', 'role', 'aria-controls', 'aria-haspopup', 'title', 'data-i18n']) node.removeAttribute(attribute);
        }
        visual.inert = true;
        visual.setAttribute('aria-hidden', 'true');
        media.append(visual, element('figcaption', projectId === 'projecte-odc' ? 'Maqueta il·lustrativa amb dades simulades.' : 'Representació il·lustrativa del projecte.'));
      }
    }
    overview.appendChild(media);

    const context = element('div', null, 'project-dialog-context');
    context.append(element('span', 'Estat del projecte'), element('p', item.status));
    overview.appendChild(context);

    if (item.links?.length) {
      const links = element('nav', null, 'project-dialog-links');
      links.setAttribute('aria-label', 'Enllaços del projecte');
      item.links.forEach((link, index) => {
        const anchor = element('a', link.label, 'btn btn-small ' + (index === 0 ? 'btn-primary' : 'btn-outline'));
        anchor.href = link.url;
        anchor.target = '_blank';
        anchor.rel = 'noopener noreferrer';
        links.appendChild(anchor);
      });
      overview.appendChild(links);
    }

    const features = section(overview, 'Què permet fer?', 'project-dialog-capabilities');
    const featureGrid = element('div', null, 'project-dialog-features');
    item.features.forEach((feature, index) => {
      const featureBlock = element('div');
      featureBlock.append(element('span', String(index + 1).padStart(2, '0'), 'project-dialog-number'), element('h4', feature.title), element('p', feature.desc));
      featureGrid.appendChild(featureBlock);
    });
    features.appendChild(featureGrid);
    if (item.role) {
      const contribution = section(overview, 'La meva participació', 'project-dialog-contribution');
      contribution.appendChild(element('p', item.role));
    }

    const stack = section(technical, 'Tecnologies i integracions', 'project-dialog-stack');
    const technologies = element('ul', null, 'project-tech');
    item.stack.forEach((tech) => technologies.appendChild(element('li', tech)));
    stack.appendChild(technologies);

    for (const [heading, values] of [['Arquitectura i desplegament', item.architecture], ['Dades i privacitat', item.privacy], ['Abast i limitacions', item.limits]]) {
      const details = element('details', null, 'project-dialog-details');
      details.open = heading === 'Arquitectura i desplegament';
      details.appendChild(element('summary', heading));
      const body = element('div', null, 'project-dialog-facts');
      values.forEach((value) => body.appendChild(element('p', value)));
      details.appendChild(body);
      technical.appendChild(details);
    }
    technical.appendChild(element('p', 'Fitxa revisada el ' + item.reviewed, 'project-dialog-reviewed'));

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