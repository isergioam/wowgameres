const fs = require('fs');
const ROOT = '.';
const GA = `
  <!-- Google Analytics 4 -->
  <script async src="https://www.googletagmanager.com/gtag/js?id=G-ZD2R9CWXLH"><\/script>
  <script>
    window.dataLayer = window.dataLayer || [];
    function gtag(){dataLayer.push(arguments);}
    gtag('js', new Date());
    gtag('config', 'G-ZD2R9CWXLH');
  <\/script>`;

const files = fs.readdirSync(ROOT).filter(f =>
  f.endsWith('.html') && !['index.html','header.html','footer.html','profesiones.html'].includes(f)
);
let u = 0, s = 0;
files.forEach(f => {
  let c = fs.readFileSync(f, 'utf8');
  if (c.includes('gtag')) { s++; return; }
  c = c.replace('</head>', GA + '\n</head>');
  fs.writeFileSync(f, c, 'utf8');
  console.log('✅ ' + f);
  u++;
});
console.log(`\n📊 ${u} actualizadas, ${s} saltadas`);
