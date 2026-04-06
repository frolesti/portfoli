const { generateNewsletterHTML } = require('./generate-newsletter');
const fs = require('fs');
const path = require('path');

// Dades de prova
const testData = [
  {
    name: 'language-redirector-extension',
    fullName: 'username/language-redirector-extension',
    commits: 15,
    releases: 1,
    issuesClosed: 3,
    latestRelease: {
      tag_name: 'v2.1.0',
      name: 'Suport per Firefox amb exclusió de dominis'
    },
    topCommits: [
      { message: 'Afegir funcionalitat d\'exclusió de dominis', author: 'Developer', date: '2026-01-25' },
      { message: 'Corregir error en la detecció d\'idioma', author: 'Developer', date: '2026-01-20' },
      { message: 'Actualitzar documentació', author: 'Developer', date: '2026-01-18' }
    ]
  },
  {
    name: 'aixeta',
    fullName: 'username/aixeta',
    commits: 8,
    releases: 0,
    issuesClosed: 2,
    latestRelease: null,
    topCommits: [
      { message: 'Millorar rendiment de la pàgina principal', author: 'Developer', date: '2026-01-22' },
      { message: 'Afegir suport per subscripcions mensuals', author: 'Developer', date: '2026-01-15' }
    ]
  }
];

// Generar HTML de prova
const html = generateNewsletterHTML(testData, 'Hola Món');

// Guardar en un fitxer de prova
const outputPath = path.join(__dirname, '../output');
if (!fs.existsSync(outputPath)) {
  fs.mkdirSync(outputPath);
}

fs.writeFileSync(path.join(outputPath, 'test-newsletter.html'), html);

console.log('✅ Butlletí de prova generat!');
console.log('📄 Obre el fitxer output/test-newsletter.html en un navegador per veure\'l');
