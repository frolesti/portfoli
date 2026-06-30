/* assets/blog-loader.js
 * Llegeix /blog/posts.json i pinta automàticament:
 *   - Targetes a la home (#blogCards)
 *   - Llistat al blog (#blogList)
 *
 * Així no cal tocar HTML quan es publica una entrada nova.
 */
(function () {
  function escapeAttr(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/"/g, '&quot;');
  }

  function resolveAssetPath(assetPath, basePath) {
    if (!assetPath) return '';
    if (/^(https?:)?\/\//i.test(assetPath) || assetPath.indexOf('data:') === 0 || assetPath.indexOf('./') === 0 || assetPath.indexOf('../') === 0 || assetPath.indexOf('/') === 0) {
      return assetPath;
    }
    if (assetPath.indexOf('assets/') === 0) {
      return (basePath === '../' ? '../' : '') + assetPath;
    }
    return assetPath;
  }

  function coverInlineStyle(cover, basePath) {
    if (!cover || !cover.image) return '';
    return ' style="background-image:linear-gradient(180deg, rgba(10,10,10,0.34), rgba(10,10,10,0.58)),url(' + escapeAttr(resolveAssetPath(cover.image, basePath)) + ');background-size:cover;background-position:center;"';
  }

  function formatDate(iso) {
    try {
      var d = new Date(iso + 'T00:00:00');
      return d.toLocaleDateString('ca-ES', { day: 'numeric', month: 'long', year: 'numeric' });
    } catch (e) {
      return iso;
    }
  }

  function paletteClass(p) {
    var v = (p && p.palette) || 'terracota';
    return 'cover-' + v;
  }

  function buildCard(post, basePath) {
    var cover = post.cover || {};
    var url = (basePath || '') + post.slug + '.html';
    var eyebrow = cover.eyebrow || post.kicker || '';
    var headline = cover.subtitle || '';
    var safeSummary = escapeHtml(stripHtml(post.summary || ''));
    var coverClass = 'blog-card__cover ' + paletteClass(cover) + (cover.image ? ' has-image' : '');
    var assetBase = basePath === '' ? '../' : '';
    return (
      '<a class="blog-card" href="' + url + '" data-goatcounter-click="blog-card-' + post.slug + '">' +
        '<div class="' + coverClass + '"' + coverInlineStyle(cover, assetBase) + '>' +
          '<div class="blog-card__cover-text">' +
            '<div class="blog-card__cover-eyebrow">' + escapeHtml(eyebrow) + '</div>' +
            (headline ? '<div class="blog-card__cover-headline">' + escapeHtml(headline) + '</div>' : '') +
          '</div>' +
        '</div>' +
        '<div class="blog-card__body">' +
          '<div class="blog-card__meta">' +
            '<span class="blog-card__kicker">' + escapeHtml(post.kicker || '') + '</span>' +
            '<span class="blog-card__date">' + formatDate(post.date) + '</span>' +
          '</div>' +
          '<h3 class="blog-card__title">' + escapeHtml(post.title) + '</h3>' +
          '<p class="blog-card__summary">' + safeSummary + '</p>' +
          '<span class="blog-card__more">Llegir →</span>' +
        '</div>' +
      '</a>'
    );
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function stripHtml(str) {
    return String(str == null ? '' : str)
      .replace(/<[^>]*>/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  function sortByDateDesc(a, b) {
    return (b.date || '').localeCompare(a.date || '');
  }

  function renderInto(targetId, posts, limit, basePath) {
    var el = document.getElementById(targetId);
    if (!el) return;
    var list = posts.slice().sort(sortByDateDesc);
    if (typeof limit === 'number') list = list.slice(0, limit);
    if (!list.length) {
      el.innerHTML = '<div class="blog-empty">Encara no hi ha entrades publicades.</div>';
      return;
    }
    el.innerHTML = list.map(function (post) { return buildCard(post, basePath); }).join('');
  }

  function fetchManifest(candidates) {
    var chain = Promise.reject();
    candidates.forEach(function (candidate) {
      chain = chain.catch(function () {
        return fetch(candidate, { cache: 'no-cache' }).then(function (r) {
          if (!r.ok) throw new Error('Manifest not found');
          return r.json();
        });
      });
    });
    return chain;
  }

  function init() {
    var cardsHome = document.getElementById('blogCards');
    var listFull = document.getElementById('blogList');
    if (!cardsHome && !listFull) return;

    var manifestCandidates = listFull
      ? ['posts.json', './posts.json', '/blog/posts.json']
      : ['blog/posts.json', './blog/posts.json', '/blog/posts.json'];

    fetchManifest(manifestCandidates)
      .then(function (data) {
        var posts = (data && data.posts) || [];
        if (cardsHome) renderInto('blogCards', posts, 3, 'blog/');
        if (listFull) renderInto('blogList', posts, undefined, '');
      })
      .catch(function () {
        if (cardsHome) cardsHome.innerHTML = '';
        if (listFull) listFull.innerHTML = '<div class="blog-empty">No s\'ha pogut carregar el blog.</div>';
      });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
