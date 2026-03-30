/**
 * Script para añadir meta tags SEO faltantes a todas las guías de profesiones.
 * Añade: meta description, favicon, canonical, y preload hints.
 * 
 * USO: node scripts/fix-meta-tags.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const BASE_URL = 'https://wowgameres.com';

// Mapa de profesiones a nombres en español
const profNames = {
  'alquimia': 'Alquimia',
  'encantamiento': 'Encantamiento',
  'herreria': 'Herrería',
  'ingenieria': 'Ingeniería',
  'inscripcion': 'Inscripción',
  'joyeria': 'Joyería',
  'peleteria': 'Peletería',
  'sastreria': 'Sastrería'
};

// Mapa de expansiones a nombres legibles
const expNames = {
  'vanilla': 'Vanilla (Classic)',
  'tbc': 'The Burning Crusade',
  'wotlk': 'Wrath of the Lich King',
  'cata': 'Cataclismo',
  'mop': 'Mists of Pandaria',
  'wod': 'Warlords of Draenor',
  'legion': 'Legión',
  'bfa': 'Battle for Azeroth',
  'sl': 'Shadowlands',
  'df': 'Dragonflight',
  'tww': 'The War Within',
  'midnight': 'Midnight'
};

// Buscar todos los HTML de guías (patrón: profesion-expansion.html)
const files = fs.readdirSync(ROOT).filter(f => {
  if (!f.endsWith('.html')) return false;
  if (['index.html', 'header.html', 'footer.html', 'profesiones.html', 'alchemy_scrape.html'].includes(f)) return false;
  return f.includes('-');
});

let updated = 0;
let skipped = 0;

files.forEach(file => {
  const filePath = path.join(ROOT, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Extraer profesión y expansión del nombre de archivo
  const match = file.replace('.html', '').match(/^(.+)-(.+)$/);
  if (!match) {
    console.log(`⚠️  Saltando ${file} (no coincide con el patrón)`);
    skipped++;
    return;
  }

  const [, prof, exp] = match;
  const profName = profNames[prof] || prof;
  const expName = expNames[exp] || exp;

  let modified = false;

  // 1. Añadir meta description si no existe
  if (!content.includes('meta name="description"')) {
    const description = `Guía de nivelación de ${profName} en ${expName} de World of Warcraft. Todos los materiales y recetas paso a paso.`;
    const metaTag = `  <meta name="description" content="${description}">\n`;
    content = content.replace('</head>', metaTag + '</head>');
    modified = true;
  }

  // 2. Añadir favicon si no existe
  if (!content.includes('rel="icon"')) {
    const faviconTag = `  <link rel="icon" href="./images/favicon.ico">\n`;
    content = content.replace('</head>', faviconTag + '</head>');
    modified = true;
  }

  // 3. Añadir canonical si no existe
  if (!content.includes('rel="canonical"')) {
    const canonicalTag = `  <link rel="canonical" href="${BASE_URL}/${file}">\n`;
    content = content.replace('</head>', canonicalTag + '</head>');
    modified = true;
  }

  // 4. Añadir preload hints para header/footer si no existen
  if (!content.includes('rel="preload"')) {
    const preloadTags = `  <link rel="preload" href="./header.html" as="fetch" crossorigin>\n  <link rel="preload" href="./footer.html" as="fetch" crossorigin>\n`;
    content = content.replace('</head>', preloadTags + '</head>');
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file} — meta description, favicon, canonical, preload añadidos`);
    updated++;
  } else {
    console.log(`⏭️  ${file} — ya tiene todos los tags`);
    skipped++;
  }
});

console.log(`\n📊 Resultado: ${updated} archivos actualizados, ${skipped} saltados.`);
