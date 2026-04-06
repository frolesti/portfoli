const https = require('https');
const fs = require('fs');
const path = require('path');

// Configuració dels repositoris a monitoritzar
const REPOS = [
  'AixetaOrg/language-redirector-extension',
  'AixetaOrg/aixeta',
  'frolesti/portfoli',
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
function generateNewsletterHTML(reposData, tier = 'Hola Món') {
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
    console.log('ℹ️  No s\'ha trobat contingut manual per aquest mes');
  }

  // Generar el contingut dels projectes
  let projectsContent = '';
  
  reposData.forEach(repo => {
    if (repo.error) return;
    
    const repoSlug = repo.fullName.split('/')[1];
    const manual = manualContent[repoSlug];
    
    // Prioritzar contingut manual
    if (manual && manual.updates && manual.updates.length > 0) {
      projectsContent += `
      <div class="project">
        <h2>📦 ${manual.title || repo.name}</h2>
        <ul>
          ${manual.updates.map(update => `<li>${update}</li>`).join('\n          ')}
        </ul>
      </div>
    `;
      return;
    }
    
    // Si hi ha release recent amb notes, usar-les
    if (repo.releases > 0 && repo.latestRelease && repo.latestRelease.body) {
      const releaseNotes = repo.latestRelease.body.split('\n')
        .filter(line => line.trim())
        .slice(0, 5)
        .map(line => line.replace(/^[-*]\s*/, ''));
      
      if (releaseNotes.length > 0) {
        projectsContent += `
      <div class="project">
        <h2>📦 ${repo.name}</h2>
        <p><strong>🚀 Nova versió ${repo.latestRelease.tag_name}</strong></p>
        <ul>
          ${releaseNotes.map(note => `<li>${note}</li>`).join('\n          ')}
        </ul>
      </div>
    `;
        return;
      }
    }
    
    // Si només hi ha release sense notes
    if (repo.releases > 0 && repo.latestRelease) {
      projectsContent += `
      <div class="project">
        <h2>📦 ${repo.name}</h2>
        <p>🚀 Nova versió <strong>${repo.latestRelease.tag_name}</strong> publicada${repo.latestRelease.name ? `: ${repo.latestRelease.name}` : '!'}</p>
      </div>
    `;
    }
  });

  // Si no hi ha activitat, afegir missatge
  if (!projectsContent) {
    projectsContent = `
      <div class="project">
        <p>Aquest mes ha estat tranquil, sense grans actualitzacions. Estem treballant en millores que veureu aviat! 🚀</p>
      </div>
    `;
  }

  // Determinar icona segons tier
  let tierIcon = '👋'; // Per defecte Hola Món
  if (tier.toLowerCase().includes('ninot') || tier.toLowerCase().includes('proves')) {
    tierIcon = '🧪';
  }

  // Reemplaçar les variables a la plantilla
  const html = template
    .replaceAll('{{MONTH_YEAR}}', monthYear)
    .replaceAll('{{PROJECTS_CONTENT}}', projectsContent)
    .replaceAll('{{TIER}}', tier)
    .replaceAll('{{TIER_ICON}}', tierIcon)
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
  <title>Històric de Butlletins</title>
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 40px auto; padding: 20px; }
    h1 { color: #667eea; }
    .newsletter-list { list-style: none; padding: 0; }
    .newsletter-item { background: #f9f9ff; margin: 10px 0; padding: 15px 20px; border-radius: 8px; border-left: 4px solid #667eea; }
    .newsletter-item a { color: #667eea; text-decoration: none; font-weight: 600; }
    .newsletter-item a:hover { text-decoration: underline; }
    .date { color: #666; font-size: 14px; }
  </style>
</head>
<body>
  <h1>📰 Històric de Butlletins</h1>
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
