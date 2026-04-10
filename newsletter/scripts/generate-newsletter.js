const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuració dels repositoris a monitoritzar
const REPOS = [
  'AixetaOrg/language-redirector-extension',
  'AixetaOrg/aixeta',
  'frolesti/portafolis',
  'frolesti/stremio-addon-catalan-subtitles',
  'frolesti/alerta-desnona',
  'DouglasNeuroInformatics/OpenDataCapture',
];

// Obtenir la data d'ara fa 30 dies
function getLastMonthDate() {
  const date = new Date();
  date.setDate(date.getDate() - 30);
  return date.toISOString();
}

// Funció per fer crides a la GitHub API
function githubApiCall(path) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.github.com',
      path: path,
      headers: {
        'User-Agent': 'Newsletter-Bot',
        'Authorization': `token ${process.env.GITHUB_TOKEN}`,
        'Accept': 'application/vnd.github.v3+json'
      }
    };

    https.get(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        try {
          resolve(JSON.parse(data));
        } catch (error) {
          reject(error);
        }
      });
    }).on('error', reject);
  });
}

// Obtenir commits d'un repositori
async function getRepoCommits(repo) {
  const since = getLastMonthDate();
  return await githubApiCall(`/repos/${repo}/commits?since=${since}&per_page=100`);
}

// Obtenir releases d'un repositori
async function getRepoReleases(repo) {
  return await githubApiCall(`/repos/${repo}/releases?per_page=10`);
}

// Obtenir issues tancades
async function getClosedIssues(repo) {
  const since = getLastMonthDate();
  return await githubApiCall(`/repos/${repo}/issues?state=closed&since=${since}&per_page=100`);
}

// Processar l'activitat d'un repositori
async function getRepoActivity(repo) {
  try {
    console.log(`📦 Obtenint activitat de ${repo}...`);
    
    const [commits, releases, issues] = await Promise.all([
      getRepoCommits(repo),
      getRepoReleases(repo),
      getClosedIssues(repo)
    ]);

    // Filtrar releases de l'últim mes
    const lastMonth = new Date(getLastMonthDate());
    const recentReleases = releases.filter(r => 
      new Date(r.published_at) > lastMonth
    );

    return {
      name: repo.split('/')[1],
      fullName: repo,
      commits: commits.length || 0,
      releases: recentReleases.length || 0,
      issuesClosed: issues.length || 0,
      latestRelease: recentReleases[0] || null,
      topCommits: commits.slice(0, 5).map(c => ({
        message: c.commit.message.split('\n')[0],
        author: c.commit.author.name,
        date: c.commit.author.date
      }))
    };
  } catch (error) {
    console.error(`❌ Error obtenint dades de ${repo}:`, error.message);
    return {
      name: repo.split('/')[1],
      fullName: repo,
      commits: 0,
      releases: 0,
      issuesClosed: 0,
      error: true
    };
  }
}

// Generar el contingut HTML
function generateNewsletterHTML(reposData) {
  const template = fs.readFileSync(
    path.join(__dirname, '../templates/newsletter-template.html'),
    'utf8'
  );

  // Data actual
  const date = new Date();
  let monthYear = date.toLocaleDateString('ca-ES', { 
    month: 'long', 
    year: 'numeric' 
  });
  // Capitalitzar la primera lletra
  monthYear = monthYear.charAt(0).toUpperCase() + monthYear.slice(1);

  // Carregar contingut manual si existeix
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const monthKey = `${year}-${month}`;
  
  let manualContent = {};
  try {
    const contentPath = path.join(__dirname, '../content/monthly-content.json');
    if (fs.existsSync(contentPath)) {
      const allContent = JSON.parse(fs.readFileSync(contentPath, 'utf8'));
      manualContent = allContent[monthKey] || {};
    }
  } catch (error) {
    console.log('No s\'ha trobat contingut manual per aquest mes');
  }

  // Determinar quin és el projecte destacat
  const featuredSlug = manualContent['_featured'] || null;

  // Generar article destacat
  let featuredContent = '';
  // Generar columnes secundàries
  const secondaryProjects = [];

  reposData.forEach(repo => {
    if (repo.error) return;

    const repoSlug = repo.fullName.split('/')[1];
    const manual = manualContent[repoSlug];

    // Projecte destacat
    if (repoSlug === featuredSlug && manual) {
      const kicker = manual.kicker || 'Destacat';
      const lede = manual.lede || '';
      featuredContent = `
      <div class="featured-article">
        <div class="kicker">${kicker}</div>
        <h2>${manual.title || repo.name}</h2>
        ${lede ? `<p class="lede">${lede}</p>` : ''}
        <ul>
          ${manual.updates.map(u => `<li>${u}</li>`).join('\n          ')}
        </ul>
        ${manual.cta_url ? `<a href="${manual.cta_url}" class="featured-cta" target="_blank" rel="noopener">${manual.cta_text || 'Veure projecte'}</a>` : ''}
      </div>`;
      return;
    }

    // Projectes secundaris (contingut manual)
    if (manual && manual.updates && manual.updates.length > 0) {
      secondaryProjects.push({
        title: manual.title || repo.name,
        kicker: manual.kicker || null,
        updates: manual.updates
      });
      return;
    }

    // Projectes secundaris (auto des de GitHub)
    if (repo.releases > 0 && repo.latestRelease) {
      const updates = [];
      if (repo.latestRelease.body) {
        const notes = repo.latestRelease.body.split('\n')
          .filter(l => l.trim())
          .slice(0, 3)
          .map(l => l.replace(/^[-*]\s*/, ''));
        updates.push(...notes);
      } else {
        updates.push(`Nova versió <strong>${repo.latestRelease.tag_name}</strong> publicada`);
      }
      secondaryProjects.push({
        title: repo.name,
        kicker: null,
        updates
      });
    }
  });

  // Si no hi ha destacat, agafar el primer projecte secundari
  if (!featuredContent && secondaryProjects.length > 0) {
    const first = secondaryProjects.shift();
    featuredContent = `
      <div class="featured-article">
        <div class="kicker">${first.kicker || 'Actualització'}</div>
        <h2>${first.title}</h2>
        <ul>
          ${first.updates.map(u => `<li>${u}</li>`).join('\n          ')}
        </ul>
      </div>`;
  }

  // Si no hi ha res, missatge neutre
  if (!featuredContent) {
    featuredContent = `
      <div class="featured-article">
        <div class="kicker">Actualitat</div>
        <h2>Un mes tranquil</h2>
        <p class="lede">Aquest mes hem estat treballant entre bastidors. Aviat compartirem novetats.</p>
      </div>`;
  }

  // Generar columnes (agrupar de 2 en 2)
  let columnsContent = '';
  for (let i = 0; i < secondaryProjects.length; i += 2) {
    const left = secondaryProjects[i];
    const right = secondaryProjects[i + 1];
    columnsContent += `<div class="columns">`;
    columnsContent += `
        <div class="column">
          ${left.kicker ? `<div class="kicker">${left.kicker}</div>` : '<div class="kicker">Projecte</div>'}
          <h3>${left.title}</h3>
          <ul>
            ${left.updates.map(u => `<li>${u}</li>`).join('\n            ')}
          </ul>
        </div>`;
    if (right) {
      columnsContent += `
        <div class="column">
          ${right.kicker ? `<div class="kicker">${right.kicker}</div>` : '<div class="kicker">Projecte</div>'}
          <h3>${right.title}</h3>
          <ul>
            ${right.updates.map(u => `<li>${u}</li>`).join('\n            ')}
          </ul>
        </div>`;
    } else {
      // Columna buida per mantenir layout
      columnsContent += `<div class="column"></div>`;
    }
    columnsContent += `</div>`;
  }

  // Reemplaçar les variables a la plantilla
  const html = template
    .replaceAll('{{MONTH_YEAR}}', monthYear)
    .replaceAll('{{FEATURED_CONTENT}}', featuredContent)
    .replaceAll('{{COLUMNS_CONTENT}}', columnsContent)
    .replaceAll('{{YEAR}}', date.getFullYear());

  return html;
}

// Crear índex històric de butlletins
function updateHistoryIndex(outputPath) {
  const files = fs.readdirSync(outputPath)
    .filter(f => f.startsWith('newsletter-') && f.endsWith('.html') && f !== 'newsletter-template.html')
    .sort()
    .reverse();

  const indexHtml = `<!DOCTYPE html>
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
    ${files.map(f => {
      const date = f.replace('newsletter-', '').replace('.html', '');
      const formatted = new Date(date).toLocaleDateString('ca-ES', { year: 'numeric', month: 'long', day: 'numeric' });
      return `<li class="newsletter-item"><a href="${f}">${formatted}</a></li>`;
    }).join('\n    ')}
  </ul>
</body>
</html>`;

  fs.writeFileSync(path.join(outputPath, 'index.html'), indexHtml);
}

// Funció principal
async function main() {
  try {
    console.log('🚀 Generant butlletí...\n');

    // Obtenir activitat de tots els repositoris
    const reposData = await Promise.all(
      REPOS.map(repo => getRepoActivity(repo))
    );

    // Generar HTML
    const html = generateNewsletterHTML(reposData);

    // Guardar l'HTML generat
    const outputPath = path.join(__dirname, '../output');
    if (!fs.existsSync(outputPath)) {
      fs.mkdirSync(outputPath);
    }

    const date = new Date();
    const monthName = date.toLocaleDateString('ca-ES', { month: 'long' });
    const year = date.getFullYear();
    const filename = `newsletter-${monthName}-${year}.html`;
    
    fs.writeFileSync(path.join(outputPath, filename), html);

    // Actualitzar índex històric
    updateHistoryIndex(outputPath);

    console.log(`\n✅ Butlletí generat correctament!`);
    console.log(`📄 Fitxer: output/${filename}`);
    
    // Mostrar resum
    console.log('\n📊 Resum d\'activitat:');
    reposData.forEach(repo => {
      if (!repo.error) {
        console.log(`  • ${repo.name}: ${repo.commits} commits, ${repo.releases} releases, ${repo.issuesClosed} issues`);
      }
    });

  } catch (error) {
    console.error('❌ Error generant el butlletí:', error);
    process.exit(1);
  }
}

// Executar si es crida directament
if (require.main === module) {
  main();
}

module.exports = { main, getRepoActivity, generateNewsletterHTML };
