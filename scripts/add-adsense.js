/**
 * Añade Google AdSense a todas las páginas del sitio.
 * 
 * Cambios:
 * 1. Script de AdSense en el <head>
 * 2. Banner publicitario entre el header y el contenido principal
 * 
 * USO: node scripts/add-adsense.js
 */

const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const PUB_ID = 'ca-pub-9393134927059057';

const ADSENSE_SCRIPT = `\n  <!-- Google AdSense -->\n  <script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${PUB_ID}"\n    crossorigin="anonymous"></script>`;

const AD_BLOCK_TOP = `\n  <!-- Google AdSense - Banner superior -->\n  <div class="ad-container">\n    <ins class="adsbygoogle"\n      style="display:block"\n      data-ad-client="${PUB_ID}"\n      data-ad-format="auto"\n      data-full-width-responsive="true"></ins>\n    <script>(adsbygoogle = window.adsbygoogle || []).push({});</script>\n  </div>\n`;

// Buscar archivos HTML (excluir los que ya tienen AdSense o no son páginas)
const files = fs.readdirSync(ROOT).filter(f => {
  if (!f.endsWith('.html')) return false;
  if (['index.html', 'header.html', 'footer.html', 'profesiones.html'].includes(f)) return false;
  return true;
});

let updated = 0;
let skipped = 0;

files.forEach(file => {
  const filePath = path.join(ROOT, file);
  let content = fs.readFileSync(filePath, 'utf8');

  // Saltar si ya tiene AdSense
  if (content.includes('adsbygoogle')) {
    console.log(`⏭️  ${file} — ya tiene AdSense`);
    skipped++;
    return;
  }

  let modified = false;

  // 1. Añadir script de AdSense al <head>
  if (!content.includes('pagead2.googlesyndication.com')) {
    content = content.replace('</head>', ADSENSE_SCRIPT + '\n</head>');
    modified = true;
  }

  // 2. Añadir banner superior después del div#wg-header
  if (!content.includes('ad-container')) {
    content = content.replace(
      '<div id="wg-header"></div>',
      '<div id="wg-header"></div>' + AD_BLOCK_TOP
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`✅ ${file}`);
    updated++;
  } else {
    skipped++;
  }
});

console.log(`\n📊 ${updated} páginas actualizadas, ${skipped} saltadas.`);
console.log(`\n💡 Recuerda: Los anuncios no aparecerán hasta que Google apruebe tu sitio.`);
console.log(`   Puedes verificar la integración en: AdSense > Sitios > wowgameres.com`);
