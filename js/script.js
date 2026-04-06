// Aplicar el tema al body lo antes posible para evitar parpadeos
if (localStorage.getItem('theme') === 'dark') {
  document.body.classList.add('dark-mode');
}

// Función para cargar HTML externo
function loadHTML(id, filename) {
  return fetch(filename)
    .then(response => response.text())
    .then(data => {
      let element = document.getElementById(id);
      if (element) {
        element.innerHTML = data;
      }
    }).catch(err => console.error("Error loading HTML:", err));
}

// Cargar header y footer al cargar la página y luego inicializar la app
Promise.all([
  loadHTML('wg-header', './header.html'),
  loadHTML('wg-footer', './footer.html')
]).then(() => {
  initApp();
});

function initApp() {
  // Año actual en el Copyright
  let yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }

  /* 🌙 MODO OSCURO */
  const toggle = document.getElementById('darkModeToggle');
  let imagen = document.getElementById("logo");

  // Ajustar la imagen de acuerdo al tema cargado
  if (document.body.classList.contains('dark-mode')) {
    if (imagen) imagen.src = "./images/WOWGamerES_Logo_black.webp";
  } else {
    if (imagen) imagen.src = "./images/WOWGamerES_Logo_white.webp";
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        if (imagen) imagen.src = "./images/WOWGamerES_Logo_black.webp";
      } else {
        localStorage.setItem('theme', 'light');
        if (imagen) imagen.src = "./images/WOWGamerES_Logo_white.webp";
      }
    });
  }



  /* Carga dinámica de Profesiones por Expansión */
  const expansionCards = document.querySelectorAll('.card-expansion');
  const profesionesTitle = document.getElementById('profesiones');
  // La sección de contenido es el siguiente hermano <section> después del H1
  const profesionesContent = profesionesTitle ? profesionesTitle.nextElementSibling : null;

  if (expansionCards.length > 0 && profesionesTitle && profesionesContent) {
    expansionCards.forEach(card => {
      card.style.cursor = 'pointer';

      card.addEventListener('click', () => {
        // Encontrar el slug y el nombre
        const i18nAttr = card.getAttribute('data-i18n');
        let slug = '';
        if (i18nAttr && i18nAttr.startsWith('exp_')) {
          slug = i18nAttr.replace('exp_', '');
        } else {
          slug = card.textContent.trim().toLowerCase().replace(/\s+/g, '-');
        }

        window.currentExpansionName = card.textContent.trim();

        fetch('./profesiones.html')
          .then(res => {
            if (!res.ok) throw new Error("Error loading profesiones.html");
            return res.text();
          })
          .then(html => {
            // Modificar href: para usar la nueva arquitectura basada en datos
            let newHtml = html.replace(/href="\.\/([a-zA-Z]+)\.html"/g, `href="./guia.html?p=$1&e=${slug}"`);

            // Reemplazar el nombre de la expansión en el título
            newHtml = newHtml.replace('(nombre_expansión)', `(${window.currentExpansionName})`);

            // Parsear el HTML del template
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHtml;

            // Actualizar el texto del H1
            const templateTitle = tempDiv.querySelector('#profesiones');
            if (templateTitle) {
              profesionesTitle.textContent = templateTitle.textContent;
            }

            // Extraer las tarjetas de profesiones e insertarlas en la sección
            const templateCards = tempDiv.querySelector('.profesiones');
            if (templateCards) {
              profesionesContent.innerHTML = templateCards.outerHTML;
            }

            // Hacer scroll
            window.scrollTo({ top: 0, behavior: 'smooth' });
          })
          .catch(err => console.error("Error al cargar profesiones: ", err));
      });
    });
  }


  if (typeof initLevelingSlider === 'function') {
    initLevelingSlider();
  }
}

function initLevelingSlider() {
  const slider = document.getElementById('levelSlider');
  const display = document.getElementById('currentLevelDisplay');
  const materialsBody = document.getElementById('materialsBody');

  const sortByNameBtn = document.getElementById('sortByName');
  const sortByQtyBtn = document.getElementById('sortByQty');
  const sortIndName = document.getElementById('sortIndicatorName');
  const sortIndQty = document.getElementById('sortIndicatorQty');

  let currentSort = 'name'; // 'name' or 'qty'
  let nameAsc = true;
  let qtyAsc = false; // Cantidades mayores primero por defecto

  if (!slider || !materialsBody) return;

  // Evitar duplicar listeners si se llama varias veces (ej: en carga dinámica)
  if (slider.getAttribute('data-initialized') === 'true') {
    // Si ya tiene listeners, solo ejecutamos el update
    updateLeveling();
    return;
  }
  slider.setAttribute('data-initialized', 'true');

  if (sortByNameBtn) {
    sortByNameBtn.addEventListener('click', () => {
      if (currentSort === 'name') nameAsc = !nameAsc;
      else { currentSort = 'name'; nameAsc = true; }
      updateLeveling();
    });
  }

  if (sortByQtyBtn) {
    sortByQtyBtn.addEventListener('click', () => {
      if (currentSort === 'qty') qtyAsc = !qtyAsc;
      else { currentSort = 'qty'; qtyAsc = false; }
      updateLeveling();
    });
  }

  function updateLeveling() {
    const steps = document.querySelectorAll('.custom-step');
    const currentLevel = parseInt(slider.value);
    if (display) display.textContent = currentLevel;

    const totalMats = {};

    steps.forEach(step => {
      const max = parseInt(step.getAttribute('data-max'));
      const isAlt = step.getAttribute('data-alt') === 'true';

      if (currentLevel >= max) {
        step.style.display = 'none';
      } else {
        step.style.display = 'block';

        // Sumar materiales si no es ruta alternativa
        if (!isAlt) {
          const matsStr = step.getAttribute('data-mats');
          if (matsStr) {
            try {
              const mats = JSON.parse(matsStr);
              for (const [mat, qty] of Object.entries(mats)) {
                totalMats[mat] = (totalMats[mat] || 0) + qty;
              }
            } catch (e) { console.error("Error parsing materials JSON", e); }
          }
        }
      }
    });

    materialsBody.innerHTML = '';

    if (Object.keys(totalMats).length === 0) {
      materialsBody.innerHTML = '<tr><td colspan="2" style="text-align:center; padding: 10px;">¡Ya has alcanzado el nivel máximo de esta guía!</td></tr>';
      if (sortIndName) sortIndName.textContent = '↕';
      if (sortIndQty) sortIndQty.textContent = '↕';
      return;
    }

    // Convertir a array para ordenar
    let matsArray = Object.entries(totalMats).map(([name, qty]) => ({ name, qty }));

    matsArray.sort((a, b) => {
      if (currentSort === 'name') {
        const res = a.name.localeCompare(b.name);
        return nameAsc ? res : -res;
      } else {
        const res = a.qty - b.qty;
        return qtyAsc ? res : -res;
      }
    });

    if (sortIndName) sortIndName.textContent = currentSort === 'name' ? (nameAsc ? '▼' : '▲') : '↕';
    if (sortIndQty) sortIndQty.textContent = currentSort === 'qty' ? (qtyAsc ? '▼' : '▲') : '↕';

    matsArray.forEach(item => {
      const tr = document.createElement('tr');
      tr.style.borderBottom = '1px solid #e0d4ff';

      const tdMat = document.createElement('td');
      tdMat.style.padding = '5px';
      tdMat.textContent = item.name;

      const tdQty = document.createElement('td');
      tdQty.style.padding = '5px';
      tdQty.textContent = item.qty;

      tr.appendChild(tdMat);
      tr.appendChild(tdQty);
      materialsBody.appendChild(tr);
    });
  }

  slider.addEventListener('input', updateLeveling);
  // Llamada inicial
  updateLeveling();

  // Toggle de la tabla de materiales
  const matToggleBtn = document.getElementById('materialsToggle');
  const matContentDiv = document.getElementById('materialsContent');
  if (matToggleBtn && matContentDiv) {
    matToggleBtn.addEventListener('click', () => {
      matToggleBtn.classList.toggle('collapsed');
      if (matContentDiv.style.display === 'none') {
        matContentDiv.style.display = 'block';
      } else {
        matContentDiv.style.display = 'none';
      }
    });
  }

  // Toggle de las recetas
  const recToggleBtn = document.getElementById('recipesToggle');
  const recContentDiv = document.getElementById('recipesContent');
  if (recToggleBtn && recContentDiv) {
    recToggleBtn.addEventListener('click', () => {
      recToggleBtn.classList.toggle('collapsed');
      if (recContentDiv.style.display === 'none') {
        recContentDiv.style.display = 'block';
      } else {
        recContentDiv.style.display = 'none';
      }
    });
  }
}

/* ===================== */
/* 🍪 BANNER DE COOKIES  */
/* ===================== */

(function initCookieConsent() {
  const CONSENT_KEY = 'cookie_consent';
  const consent = localStorage.getItem(CONSENT_KEY);

  // Si ya aceptó, activar scripts inmediatamente
  if (consent === 'accepted') {
    activateTrackingScripts();
    return;
  }

  // Si ya rechazó, no hacer nada (no mostrar banner)
  if (consent === 'rejected') {
    return;
  }

  // Primera visita: mostrar banner
  showCookieBanner();

  function showCookieBanner() {
    const banner = document.createElement('div');
    banner.id = 'cookieConsent';
    banner.className = 'cookie-banner';
    banner.innerHTML = `
      <div class="cookie-content">
        <div class="cookie-text">
          <span class="cookie-icon">🍪</span>
          <p>Utilizamos cookies de <strong>Google Analytics</strong> y <strong>Google AdSense</strong> para analizar el tráfico y mostrar anuncios relevantes. 
          Puedes aceptar o rechazar su uso. <a href="./aviso-legal.html">Más información</a></p>
        </div>
        <div class="cookie-buttons">
          <button id="cookieReject" class="cookie-btn cookie-btn-reject">Rechazar</button>
          <button id="cookieAccept" class="cookie-btn cookie-btn-accept">Aceptar</button>
        </div>
      </div>
    `;
    document.body.appendChild(banner);

    // Forzar reflow para que la animación funcione
    requestAnimationFrame(() => {
      banner.classList.add('cookie-banner-visible');
    });

    document.getElementById('cookieAccept').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'accepted');
      activateTrackingScripts();
      closeBanner(banner);
    });

    document.getElementById('cookieReject').addEventListener('click', () => {
      localStorage.setItem(CONSENT_KEY, 'rejected');
      closeBanner(banner);
    });
  }

  function closeBanner(banner) {
    banner.classList.remove('cookie-banner-visible');
    banner.classList.add('cookie-banner-hidden');
    setTimeout(() => banner.remove(), 400);
  }

  function activateTrackingScripts() {
    // Activar todos los scripts bloqueados con data-cookie-consent
    const blockedScripts = document.querySelectorAll('script[type="text/plain"][data-cookie-consent]');

    blockedScripts.forEach(blocked => {
      const newScript = document.createElement('script');

      // Copiar atributos (excepto type y data-cookie-consent)
      for (const attr of blocked.attributes) {
        if (attr.name === 'type' || attr.name === 'data-cookie-consent') continue;
        newScript.setAttribute(attr.name, attr.value);
      }

      // Copiar contenido inline si existe
      if (blocked.textContent.trim()) {
        newScript.textContent = blocked.textContent;
      }

      // Insertar y eliminar el viejo
      blocked.parentNode.insertBefore(newScript, blocked);
      blocked.remove();
    });
  }
})();
