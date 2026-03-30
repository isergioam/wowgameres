/**
 * Desactiva los scripts de GA4 y AdSense para que no se ejecuten
 * hasta que el usuario acepte las cookies.
 * 
 * Cambia type="" a type="text/plain" y añade data-cookie-consent
 * para que el banner de cookies los pueda activar.
 * 
 * USO: node scripts/disable-tracking-until-consent.js
 */

const fs = require('fs');
const path = require('path');
const ROOT = path.join(__dirname, '..');

const files = fs.readdirSync(ROOT).filter(f =>
  f.endsWith('.html') && !['header.html', 'footer.html', 'profesiones.html'].includes(f)
);

let updated = 0;

files.forEach(file => {
  const filePath = path.join(ROOT, file);
  let content = fs.readFileSync(filePath, 'utf8');
  let modified = false;

  // GA4: cambiar script de carga a text/plain con data-cookie-consent
  if (content.includes('googletagmanager.com/gtag') && !content.includes('data-cookie-consent="analytics"')) {
    content = content.replace(
      /<script async src="https:\/\/www\.googletagmanager\.com\/gtag\/js\?id=G-ZD2R9CWXLH"><\/script>/,
      '<script async src="https://www.googletagmanager.com/gtag/js?id=G-ZD2R9CWXLH" type="text/plain" data-cookie-consent="analytics"></script>'
    );
    // GA4 config script
    content = content.replace(
      /(<script>)\s*\n\s*(window\.dataLayer = window\.dataLayer \|\| \[\];)\s*\n\s*(function gtag\(\)\{dataLayer\.push\(arguments\);\})\s*\n\s*(gtag\('js', new Date\(\)\);)\s*\n\s*(gtag\('config', 'G-ZD2R9CWXLH'\);)\s*\n\s*(<\/script>)/,
      '<script type="text/plain" data-cookie-consent="analytics">\n    window.dataLayer = window.dataLayer || [];\n    function gtag(){dataLayer.push(arguments);}\n    gtag(\'js\', new Date());\n    gtag(\'config\', \'G-ZD2R9CWXLH\');\n  </script>'
    );
    modified = true;
  }

  // AdSense: cambiar script de carga a text/plain
  if (content.includes('pagead2.googlesyndication.com') && !content.includes('data-cookie-consent="ads"')) {
    content = content.replace(
      /<script async src="https:\/\/pagead2\.googlesyndication\.com\/pagead\/js\/adsbygoogle\.js\?client=ca-pub-9393134927059057"\s*\n?\s*crossorigin="anonymous"><\/script>/,
      '<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9393134927059057"\n    crossorigin="anonymous" type="text/plain" data-cookie-consent="ads"></script>'
    );
    modified = true;
  }

  // AdSense inline push: cambiar a text/plain  
  if (content.includes('adsbygoogle = window.adsbygoogle') && !content.includes('data-cookie-consent="ads-push"')) {
    content = content.replace(
      /<script>\(adsbygoogle = window\.adsbygoogle \|\| \[\]\)\.push\(\{\}\);<\/script>/g,
      '<script type="text/plain" data-cookie-consent="ads-push">(adsbygoogle = window.adsbygoogle || []).push({});</script>'
    );
    modified = true;
  }

  if (modified) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log('✅ ' + file);
    updated++;
  }
});

console.log('\n📊 ' + updated + ' archivos actualizados.');
console.log('Los scripts de tracking no se ejecutarán hasta que el usuario acepte las cookies.');
