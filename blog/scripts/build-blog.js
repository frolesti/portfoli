#!/usr/bin/env node
/* blog/scripts/build-blog.js
 *
 * Font única (blog/content/posts/*.json) -> genera:
 *   - blog/<slug>.html             (pàgina de l'entrada, estil portfoli)
 *   - blog/index.html              (índex amb hero + targetes auto)
 *   - blog/posts.json              (manifest llegit pel client per popular home + índex)
 *   - newsletter/output/newsletter-<YYYY>-<MM>.html  (estil diari, agrupant per mes)
 *
 * Ús:
 *   npm run blog:build
 */
'use strict';

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..', '..');
const POSTS_DIR = path.join(ROOT, 'blog', 'content', 'posts');
const BLOG_OUT = path.join(ROOT, 'blog');
const NL_OUT = path.join(ROOT, 'newsletter', 'output');
const NL_TPL = path.join(ROOT, 'newsletter', 'templates', 'newsletter-template.html');
const NL_MONTHLY_CONTENT = path.join(ROOT, 'newsletter', 'content', 'monthly-content.json');

const SITE_URL = 'https://www.frolesti.cat';
const DEFAULT_OG = '/assets/img/seo/og-preview.png';

const MONTH_LABELS = {
  '01': 'Gener', '02': 'Febrer', '03': 'Març', '04': 'Abril',
  '05': 'Maig', '06': 'Juny', '07': 'Juliol', '08': 'Agost',
  '09': 'Setembre', '10': 'Octubre', '11': 'Novembre', '12': 'Desembre'
};

function escapeHtml(str) {
  return String(str == null ? '' : str)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeAttr(str) { return escapeHtml(str); }

function stripHtml(str) {
  return String(str == null ? '' : str).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
}

function resolveAssetPath(assetPath, pageDepth = 1) {
  if (!assetPath) return '';
  if (/^(https?:)?\/\//i.test(assetPath) || assetPath.startsWith('data:') || assetPath.startsWith('../') || assetPath.startsWith('./') || assetPath.startsWith('/')) {
    return assetPath;
  }
  if (assetPath.startsWith('assets/')) {
    return '../'.repeat(pageDepth) + assetPath;
  }
  return assetPath;
}

function toYouTubeEmbedUrl(url) {
  if (!url) return '';
  if (url.includes('youtube-nocookie.com/embed/') || url.includes('youtube.com/embed/')) {
    return url;
  }
  const short = url.match(/youtu\.be\/([A-Za-z0-9_-]{6,})/);
  if (short && short[1]) {
    return `https://www.youtube-nocookie.com/embed/${short[1]}`;
  }
  const watch = url.match(/[?&]v=([A-Za-z0-9_-]{6,})/);
  if (watch && watch[1]) {
    return `https://www.youtube-nocookie.com/embed/${watch[1]}`;
  }
  return url;
}

function coverInlineStyle(cover) {
  if (!cover || !cover.image) return '';
  const image = escapeAttr(resolveAssetPath(cover.image, 1));
  return ` style="background-image:linear-gradient(180deg, rgba(10,10,10,0.34), rgba(10,10,10,0.58)),url(${image});background-size:cover;background-position:center;"`;
}

function formatLongDate(iso) {
  if (!iso) return '';
  const [y, m, d] = iso.split('-');
  return `${parseInt(d, 10)} de ${MONTH_LABELS[m].toLowerCase()} del ${y}`;
}

function readPosts() {
  if (!fs.existsSync(POSTS_DIR)) return [];
  return fs.readdirSync(POSTS_DIR)
    .filter(f => f.endsWith('.json'))
    .map(f => {
      const raw = fs.readFileSync(path.join(POSTS_DIR, f), 'utf8');
      return JSON.parse(raw);
    })
    .sort((a, b) => (b.date || '').localeCompare(a.date || ''));
}

function readMonthlyContent() {
  if (!fs.existsSync(NL_MONTHLY_CONTENT)) return {};
  try {
    return JSON.parse(fs.readFileSync(NL_MONTHLY_CONTENT, 'utf8'));
  } catch {
    return {};
  }
}

/* ---------------- BLOG POST PAGE ---------------- */

function renderBodyBlock(block) {
  switch (block.type) {
    case 'h2':
      return `<h2>${escapeHtml(block.text)}</h2>`;
    case 'p':
      return `<p>${block.text}</p>`;
    case 'ul':
      return `<ul>${block.items.map(it => `<li>${it}</li>`).join('')}</ul>`;
    case 'note':
      return `<aside class="post-note">${block.text}</aside>`;
    case 'quote':
      return `<blockquote>${block.text}</blockquote>`;
    case 'image':
      return `<figure><img src="${escapeAttr(resolveAssetPath(block.src, 1))}" alt="${escapeAttr(block.alt || '')}"/>${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`;
    case 'video': {
      const src = toYouTubeEmbedUrl(block.url || block.src || '');
      if (!src) return '';
      return `<figure class="post-video"><div class="post-video__wrap"><iframe src="${escapeAttr(src)}" title="${escapeAttr(block.title || 'Vídeo')}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>${block.caption ? `<figcaption>${escapeHtml(block.caption)}</figcaption>` : ''}</figure>`;
    }
    case 'cta':
      return `<p><a class="post-cta" href="${escapeAttr(block.url)}" target="_blank" rel="noopener">${escapeHtml(block.text)} →</a></p>`;
    default:
      return '';
  }
}

function renderPostPage(post, allPosts) {
  const cover = post.cover || {};
  const palette = cover.palette || 'terracota';
  const eyebrow = cover.eyebrow || post.kicker || '';
  const subtitle = cover.subtitle || '';
  const tagsHtml = (post.tags && post.tags.length)
    ? `<div class="post-tags">${post.tags.map(t => `<span>${escapeHtml(t)}</span>`).join('')}</div>` : '';

  const bodyHtml = (post.body || []).map(renderBodyBlock).join('\n');

  const canonical = `${SITE_URL}/blog/${post.slug}.html`;
  const metaSummary = stripHtml(post.summary || '');
  const ogImage = post.ogImage ? post.ogImage : `${SITE_URL}${DEFAULT_OG}`;

  // Related posts: pick up to 2 other posts in same month (or most recent)
  const related = allPosts
    .filter(p => p.slug !== post.slug)
    .slice(0, 2);

  const relatedCardsHtml = related.length
    ? `<section class="post-related">
         <h3>Llegeix també</h3>
         <div class="blog-grid">
           ${related.map(p => renderCardMarkup(p, '')).join('')}
         </div>
       </section>` : '';

  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(post.title)} · frolesti</title>
  <meta name="description" content="${escapeAttr(metaSummary)}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:type" content="article">
  <meta property="og:title" content="${escapeAttr(post.title)}">
  <meta property="og:description" content="${escapeAttr(metaSummary)}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${ogImage}">
  <meta property="og:locale" content="ca_ES">
  <meta property="article:published_time" content="${post.date}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(post.title)}">
  <meta name="twitter:description" content="${escapeAttr(metaSummary)}">
  <meta name="twitter:image" content="${ogImage}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="icon" href="../assets/img/seo/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/styles.css">
  <link rel="stylesheet" href="../assets/blog.css">
</head>
<body>
  <nav id="navbar" class="scrolled">
    <a href="../index.html" class="nav-logo">frolesti</a>
    <div class="nav-links">
      <a href="../index.html#projectes">Projectes</a>
      <a href="index.html">Bloc</a>
      <a href="../index.html#sobre">Sobre mi</a>
      <a href="../index.html#contacte" class="nav-cta">Contacta'm</a>
    </div>
  </nav>

  <main class="post-shell">
    <div class="container">
      <a class="post-back" href="index.html">← Tornar al bloc</a>

      <div class="post-cover cover-${palette}${cover.image ? ' has-image' : ''}"${coverInlineStyle(cover)}>
        <div class="post-cover__content">
          <div class="post-cover__eyebrow">${escapeHtml(eyebrow)}</div>
          <div class="post-cover__title">${escapeHtml(post.title)}</div>
          ${subtitle ? `<div class="post-cover__subtitle">${escapeHtml(subtitle)}</div>` : ''}
        </div>
      </div>

      <article>
        <div class="post-meta">
          <span class="post-meta__kicker">${escapeHtml(post.kicker || '')}</span>
          <span class="post-meta__dot">·</span>
          <span>${formatLongDate(post.date)}</span>
        </div>

        <p class="post-lede">${post.lede || ''}</p>

        <div class="post-body">
          ${bodyHtml}
        </div>

        ${tagsHtml}

        <div class="post-share">
          <span>Comparteix:</span>
          <a href="https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(canonical)}" target="_blank" rel="noopener">LinkedIn</a>
          <a href="https://x.com/intent/tweet?text=${encodeURIComponent(post.title)}&url=${encodeURIComponent(canonical)}" target="_blank" rel="noopener">X</a>
          <a href="https://wa.me/?text=${encodeURIComponent(post.title + ' ' + canonical)}" target="_blank" rel="noopener">WhatsApp</a>
        </div>
      </article>

      ${relatedCardsHtml}
    </div>
  </main>
</body>
</html>
`;
}

function renderCardMarkup(post, basePath = '') {
  const cover = post.cover || {};
  const palette = cover.palette || 'terracota';
  const eyebrow = cover.eyebrow || post.kicker || '';
  const headline = cover.subtitle || '';
  const safeSummary = escapeHtml(stripHtml(post.summary || ''));
  return `<a class="blog-card" href="${basePath}${post.slug}.html">
    <div class="blog-card__cover cover-${palette}${cover.image ? ' has-image' : ''}"${coverInlineStyle(cover)}>
      <div class="blog-card__cover-text">
        <div class="blog-card__cover-eyebrow">${escapeHtml(eyebrow)}</div>
        ${headline ? `<div class="blog-card__cover-headline">${escapeHtml(headline)}</div>` : ''}
      </div>
    </div>
    <div class="blog-card__body">
      <div class="blog-card__meta">
        <span class="blog-card__kicker">${escapeHtml(post.kicker || '')}</span>
        <span class="blog-card__date">${formatLongDate(post.date)}</span>
      </div>
      <h3 class="blog-card__title">${escapeHtml(post.title)}</h3>
      <p class="blog-card__summary">${safeSummary}</p>
      <span class="blog-card__more">Llegir →</span>
    </div>
  </a>`;
}

/* ---------------- BLOG INDEX ---------------- */

function renderBlogIndex(posts) {
  const featured = posts[0];
  const featuredSummary = featured ? stripHtml(featured.lede || featured.summary || '') : '';
  const featuredDesc = featuredSummary || 'Entrades del bloc de frolesti: novetats dels projectes, decisions de producte i actualitat del mes.';
  const featuredImage = (featured && featured.cover && featured.cover.image)
    ? `${SITE_URL}/${String(featured.cover.image).replace(/^\/+/, '')}`
    : `${SITE_URL}${DEFAULT_OG}`;
  const ogTitle = featured
    ? `${featured.title} · Bloc frolesti`
    : 'Bloc · frolesti';
  const featuredArt = featured ? `
    <div class="blog-hero__art cover-${(featured.cover && featured.cover.palette) || 'terracota'}${(featured.cover && featured.cover.image) ? ' has-image' : ''}"${coverInlineStyle(featured.cover || {})}>
      <div class="blog-hero__art-content">
        <div class="blog-hero__art-eyebrow">${escapeHtml((featured.cover && featured.cover.eyebrow) || featured.kicker || '')}</div>
        <div class="blog-hero__art-headline">${escapeHtml(featured.title)}</div>
      </div>
    </div>` : '';

  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Bloc · frolesti</title>
  <meta name="description" content="${escapeAttr(featuredDesc)}">
  <link rel="canonical" href="${SITE_URL}/blog/">
  <meta property="og:type" content="website">
  <meta property="og:title" content="${escapeAttr(ogTitle)}">
  <meta property="og:description" content="${escapeAttr(featuredDesc)}">
  <meta property="og:url" content="${SITE_URL}/blog/">
  <meta property="og:image" content="${escapeAttr(featuredImage)}">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${escapeAttr(ogTitle)}">
  <meta name="twitter:description" content="${escapeAttr(featuredDesc)}">
  <meta name="twitter:image" content="${escapeAttr(featuredImage)}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;0,9..144,600;1,9..144,400;1,9..144,600&family=Inter:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
  <link rel="icon" href="../assets/img/seo/favicon.svg" type="image/svg+xml">
  <link rel="stylesheet" href="../assets/styles.css">
  <link rel="stylesheet" href="../assets/blog.css">
</head>
<body>
  <nav id="navbar" class="scrolled">
    <a href="../index.html" class="nav-logo">frolesti</a>
    <div class="nav-links">
      <a href="../index.html#projectes">Projectes</a>
      <a href="index.html">Bloc</a>
      <a href="../index.html#sobre">Sobre mi</a>
      <a href="../index.html#contacte" class="nav-cta">Contacta'm</a>
    </div>
  </nav>

  <main class="blog-shell">
    <div class="container">
      <header class="blog-hero">
        <div class="blog-hero__text">
          <div class="blog-hero__eyebrow">Bloc de notes</div>
          <h1 class="blog-hero__title">Totes les notícies</h1>
          <p class="blog-hero__lead">Apunts sobre el que estic construïnt, experiències curioses, casos d'èxit i idees de projectes nous. Tot el que vols saber, quan ho vols saber.</p>
        </div>
        ${featuredArt}
      </header>

      <section id="blogList" class="blog-grid" aria-label="Totes les entrades del bloc"></section>
    </div>
  </main>

  <script src="../assets/blog-loader.js?v=${Date.now()}"></script>
</body>
</html>
`;
}

/* ---------------- NEWSLETTER (newspaper style) ---------------- */

function renderNewsletterForMonth(monthKey, posts) {
  const tpl = fs.readFileSync(NL_TPL, 'utf8');
  const monthlyContent = readMonthlyContent();
  const monthPosts = posts.filter(p => p.month === monthKey);
  if (!monthPosts.length) return null;

  const [year, mm] = monthKey.split('-');
  const monthLabel = `${MONTH_LABELS[mm]} del ${year}`;

  function toAbsoluteAssetUrl(assetPath) {
    if (!assetPath) return '';
    if (/^(https?:)?\/\//i.test(assetPath)) return assetPath;
    const normalized = assetPath.replace(/^\/+/, '');
    return `${SITE_URL}/${normalized}`;
  }

  function getPostImage(p) {
    if (p.cover && p.cover.image) return toAbsoluteAssetUrl(p.cover.image);
    return '';
  }

  function renderColumn(p) {
    const imageUrl = getPostImage(p);
    const ledeHtml = p.lede || p.summary || '';
    return `
        <div class="column">
          <div class="kicker">${escapeHtml(p.kicker || '')}</div>
          <h3>${escapeHtml(p.title)}</h3>
          ${imageUrl ? `<img src="${escapeAttr(imageUrl)}" alt="${escapeAttr(p.title)}" class="newsletter-column-image">` : ''}
          ${ledeHtml ? `<p>${ledeHtml}</p>` : ''}
          <p style="margin-top:10px;font-size:12px;"><a href="${SITE_URL}/blog/${p.slug}.html" style="color:#c75530;">Ves a l'article</a></p>
        </div>`;
  }

  function renderMonthlyChronicle() {
    const monthData = monthlyContent[monthKey] || {};
    const chronicle = monthData._chronicle || monthData._monthlyComment || '';
    if (!chronicle) return '';
    return `<div class="monthly-chronicle"><div class="kicker">Cronica del mes</div><p>${chronicle}</p></div>`;
  }

  // Pair all posts into rows of 2 columns with equal prominence
  let columnsHtml = '';
  for (let i = 0; i < monthPosts.length; i += 2) {
    const left = monthPosts[i];
    const right = monthPosts[i + 1];
    columnsHtml += `\n      <div class="columns">${renderColumn(left)}${right ? renderColumn(right) : '<div class="column" aria-hidden="true"></div>'}</div>`;
  }

  let html = tpl
    .replace(/\{\{MONTH_YEAR\}\}/g, monthLabel)
    .replace(/\{\{YEAR\}\}/g, year)
    .replace(/\{\{FEATURED_CONTENT\}\}/g, '')
    .replace(/\{\{MONTHLY_CHRONICLE\}\}/g, renderMonthlyChronicle())
    .replace(/\{\{COLUMNS_CONTENT\}\}/g, columnsHtml || '');

  const newsletterUrl = `${SITE_URL}/newsletter/output/newsletter-${monthKey}.html`;
  const shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(newsletterUrl)}`;
  html = html
    .replace(/\{\{NEWSLETTER_URL\}\}/g, newsletterUrl)
    .replace(/\{\{SHARE_URL\}\}/g, shareUrl);

  return { html, monthLabel, year, mm };
}

/* ---------------- NEWSLETTER INDEX ---------------- */

function renderNewsletterIndex() {
  if (!fs.existsSync(NL_OUT)) return null;
  const files = fs.readdirSync(NL_OUT)
    .filter(f => /^newsletter-\d{4}-\d{2}\.html$/.test(f))
    .sort((a, b) => b.localeCompare(a));

  const items = files.map(f => {
    const m = f.match(/^newsletter-(\d{4})-(\d{2})\.html$/);
    const y = m[1], mm = m[2];
    const label = `${MONTH_LABELS[mm]} del ${y}`;
    return `<li class="newsletter-item"><a href="${f}">${label}</a></li>`;
  }).join('\n    ');

  return `<!DOCTYPE html>
<html lang="ca">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Històric de Butlletins — frolesti</title>
  <style>
    body { font-family: Georgia, 'Times New Roman', serif; max-width: 640px; margin: 40px auto; padding: 20px; color: #1a1a1a; background: #f2f0eb; }
    h1 { font-size: 32px; font-weight: 700; letter-spacing: -.3px; border-bottom: 4px double #1a1a1a; padding-bottom: 12px; margin-bottom: 24px; }
    .newsletter-list { list-style: none; padding: 0; }
    .newsletter-item { margin: 0; padding: 14px 0; border-bottom: 1px dotted #ccc; }
    .newsletter-item a { color: #1a1a1a; text-decoration: none; font-size: 18px; font-weight: 600; }
    .newsletter-item a:hover { color: #c75530; }
  </style>
</head>
<body>
  <h1>Històric de Butlletins</h1>
  <ul class="newsletter-list">
    ${items}
  </ul>
</body>
</html>`;
}

/* ---------------- BUILD ---------------- */

function build() {
  const posts = readPosts();
  if (!posts.length) {
    console.log('No hi ha entrades a', POSTS_DIR);
    return;
  }

  // 1. Per-post pages
  posts.forEach(post => {
    const html = renderPostPage(post, posts);
    fs.writeFileSync(path.join(BLOG_OUT, post.slug + '.html'), html, 'utf8');
    console.log('✓ Pàgina:', post.slug + '.html');
  });

  // 2. Blog index
  fs.writeFileSync(path.join(BLOG_OUT, 'index.html'), renderBlogIndex(posts), 'utf8');
  console.log('✓ Índex: blog/index.html');

  // 3. Manifest
  const manifest = {
    generatedAt: new Date().toISOString(),
    generatedFrom: 'blog/content/posts/*.json',
    isGeneratedFile: true,
    posts: posts.map(p => ({
      slug: p.slug,
      date: p.date,
      month: p.month,
      kicker: p.kicker,
      title: p.title,
      summary: p.summary,
      cover: p.cover,
      tags: p.tags || []
    }))
  };
  fs.writeFileSync(path.join(BLOG_OUT, 'posts.json'), JSON.stringify(manifest, null, 2), 'utf8');
  console.log('✓ Manifest: blog/posts.json');

  // 4. Newsletters per month present in posts
  const months = Array.from(new Set(posts.map(p => p.month))).filter(Boolean);
  if (!fs.existsSync(NL_OUT)) fs.mkdirSync(NL_OUT, { recursive: true });
  months.forEach(monthKey => {
    const result = renderNewsletterForMonth(monthKey, posts);
    if (!result) return;
    const file = `newsletter-${monthKey}.html`;
    fs.writeFileSync(path.join(NL_OUT, file), result.html, 'utf8');
    console.log('✓ Newsletter:', file);
  });

  // 5. Newsletter index
  const nlIndex = renderNewsletterIndex();
  if (nlIndex) {
    fs.writeFileSync(path.join(NL_OUT, 'index.html'), nlIndex, 'utf8');
    console.log('✓ Newsletter index: newsletter/output/index.html');
  }

  console.log('\nFet. ' + posts.length + ' entrades processades.');
}

build();
