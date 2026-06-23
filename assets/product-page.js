(function initProductPage() {
  var data = window.PROJECT_ARTICLES || {};
  var params = new URLSearchParams(window.location.search);
  var projectId = params.get('project');

  var tagEl = document.getElementById('productTag');
  var titleEl = document.getElementById('productTitle');
  var leadEl = document.getElementById('productLead');
  var ctaRowEl = document.getElementById('productCtaRow');
  var visualEl = document.getElementById('productVisual');
  var sectionsEl = document.getElementById('productSections');
  var featuresSectionEl = document.getElementById('productFeaturesSection');
  var featuresEl = document.getElementById('productFeatures');
  var stackSectionEl = document.getElementById('productStackSection');
  var stackEl = document.getElementById('productStack');
  var imagesSectionEl = document.getElementById('productImagesSection');
  var imagesEl = document.getElementById('productImages');
  var visitBtnEl = document.getElementById('productVisitBtn');
  var backTop = document.getElementById('backToPortfolio');
  var backBottom = document.getElementById('backToPortfolioBottom');

  var article = projectId ? data[projectId] : null;

  function setProfile(profile) {
    var value = profile === 'social' ? 'social' : 'professional';
    document.documentElement.setAttribute('data-profile', value);
    document.body.setAttribute('data-profile', value);
  }

  function renderLinks(container, links) {
    container.innerHTML = '';
    if (!links || !links.length) {
      container.hidden = true;
      return false;
    }
    container.hidden = false;
    links.forEach(function (link) {
      var a = document.createElement('a');
      a.href = link.url;
      a.target = '_blank';
      a.rel = 'noopener noreferrer';
      a.textContent = link.label;
      a.className = 'btn ' + (link.variant === 'outline' ? 'btn-outline' : 'btn-primary');
      container.appendChild(a);
    });
    return true;
  }

  function animateTerminalMockups() {
    var terminalMockups = document.querySelectorAll('.terminal-mockup');
    if (!terminalMockups.length) return;

    if (!('IntersectionObserver' in window)) {
      terminalMockups.forEach(function (mockup) {
        mockup.classList.add('animated');
      });
      return;
    }

    var termObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('animated');
          termObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });

    terminalMockups.forEach(function (mockup) {
      termObserver.observe(mockup);
    });
  }

  function renderMissing() {
    document.title = 'Projecte no trobat · frolesti';
    tagEl.textContent = '';
    titleEl.textContent = 'Projecte no trobat';
    leadEl.textContent = 'No he pogut carregar la fitxa. Pots tornar al portfoli i triar-ne una altra.';
    ctaRowEl.innerHTML = '';
    visualEl.innerHTML = '';
    sectionsEl.innerHTML = '';
    featuresSectionEl.hidden = true;
    stackSectionEl.hidden = true;
    imagesSectionEl.hidden = true;
    if (visitBtnEl) visitBtnEl.hidden = true;
  }

  function renderArticle(item) {
    document.title = item.title + ' · frolesti';
    setProfile(item.profile);

    if (item.tag) {
      tagEl.textContent = item.tag;
      tagEl.hidden = false;
    } else {
      tagEl.hidden = true;
    }
    titleEl.textContent = item.title;
    leadEl.textContent = item.lead || '';

    renderLinks(ctaRowEl, item.links);

    if (item.visualHtml) {
      visualEl.innerHTML = item.visualHtml;
      visualEl.hidden = false;
    } else {
      visualEl.hidden = true;
    }

    sectionsEl.innerHTML = '';
    var articleHtml = item.articleHtml || '';
    if (articleHtml) {
      var flow = document.createElement('section');
      flow.className = 'product-section product-section-flow';

      var body = document.createElement('div');
      body.className = 'product-section-body';
      body.innerHTML = articleHtml;
      flow.appendChild(body);
      sectionsEl.appendChild(flow);
    }

    featuresEl.innerHTML = '';
    if (item.features && item.features.length) {
      item.features.forEach(function (feature) {
        var card = document.createElement('article');
        card.className = 'product-feature-card';
        var icon = document.createElement('span');
        icon.className = 'product-feature-icon';
        icon.textContent = feature.icon || '◆';
        card.appendChild(icon);
        var title = document.createElement('h3');
        title.textContent = feature.title;
        card.appendChild(title);
        var desc = document.createElement('p');
        desc.textContent = feature.desc;
        card.appendChild(desc);
        featuresEl.appendChild(card);
      });
      featuresSectionEl.hidden = false;
    } else {
      featuresSectionEl.hidden = true;
    }

    stackEl.innerHTML = '';
    if (item.stack && item.stack.length) {
      item.stack.forEach(function (tech) {
        var li = document.createElement('li');
        li.textContent = tech;
        stackEl.appendChild(li);
      });
      stackSectionEl.hidden = false;
    } else {
      stackSectionEl.hidden = true;
    }

    imagesEl.innerHTML = '';
    if (item.images && item.images.length) {
      item.images.forEach(function (src) {
        var fig = document.createElement('figure');
        fig.className = 'product-image';
        var img = document.createElement('img');
        img.src = src;
        img.alt = item.title;
        img.loading = 'lazy';
        fig.appendChild(img);
        imagesEl.appendChild(fig);
      });
      imagesSectionEl.hidden = false;
    } else {
      imagesSectionEl.hidden = true;
    }

    if (item.links && item.links.length) {
      var primary = null;
      for (var i = 0; i < item.links.length; i++) {
        if (item.links[i].variant !== 'outline' && item.links[i].url) {
          primary = item.links[i];
          break;
        }
      }
      if (!primary) {
        primary = item.links.find(function (l) { return !!l.url; }) || null;
      }
      if (primary && visitBtnEl) {
        visitBtnEl.href = primary.url;
        visitBtnEl.hidden = false;
      } else if (visitBtnEl) {
        visitBtnEl.hidden = true;
      }
    } else if (visitBtnEl) {
      visitBtnEl.hidden = true;
    }
  }

  function goBack(e) {
    if (e) e.preventDefault();
    var fallback = 'index.html#' + encodeURIComponent(projectId || 'projectes');
    try {
      var raw = sessionStorage.getItem('portfolio-return-state');
      if (!raw) {
        window.location.href = fallback;
        return;
      }
      var state = JSON.parse(raw);
      var targetId = state.projectId || projectId || 'projectes';
      window.location.href = 'index.html?restore=1#' + encodeURIComponent(targetId);
    } catch (err) {
      window.location.href = fallback;
    }
  }

  if (backTop) backTop.addEventListener('click', goBack);
  if (backBottom) backBottom.addEventListener('click', goBack);

  if (!article) {
    renderMissing();
    return;
  }

  renderArticle(article);
  requestAnimationFrame(animateTerminalMockups);
})();
