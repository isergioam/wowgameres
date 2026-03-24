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
    if (imagen) imagen.src = "./images/WOWGamerES_Logo_black.png";
  } else {
    if (imagen) imagen.src = "./images/WOWGamerES_Logo_white.png";
  }

  if (toggle) {
    toggle.addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');

      if (document.body.classList.contains('dark-mode')) {
        localStorage.setItem('theme', 'dark');
        if (imagen) imagen.src = "./images/WOWGamerES_Logo_black.png";
      } else {
        localStorage.setItem('theme', 'light');
        if (imagen) imagen.src = "./images/WOWGamerES_Logo_white.png";
      }
    });
  }

  /* Menú móvil (Hamburger) */
  const mobileMenu = document.getElementById('mobile-menu');
  const navList = document.querySelector('.main-nav ul');

  if (mobileMenu && navList) {
    mobileMenu.addEventListener('click', () => {
      navList.classList.toggle('nav-active');
    });
  }

  /* Carga dinámica de Profesiones por Expansión */
  const expansionCards = document.querySelectorAll('.card-expansion');
  const profesionesSection = document.getElementById('profesiones');

  if (expansionCards.length > 0 && profesionesSection) {
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
            // Modificar href: href="./alquimia.html" -> href="./alquimia-[slug].html"
            let newHtml = html.replace(/href="\.\/([a-zA-Z]+)\.html"/g, `href="./$1-${slug}.html"`);
            
            // Reemplazar DOM de forma robusta
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = newHtml;
            const newContent = tempDiv.querySelector('#profesiones');
            
            if (newContent) {
              profesionesSection.innerHTML = newContent.innerHTML;
            } else {
              profesionesSection.innerHTML = newHtml;
            }
            
            // Re-aplicar traducciones al nuevo bloque
            if (typeof setLanguage === 'function') {
              setLanguage(localStorage.getItem('language') || 'es');
            }
            
            // Hacer scroll hacia la sección
            profesionesSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
          })
          .catch(err => console.error("Error al cargar profesiones: ", err));
      });
    });
  }

  initTranslations();
  if (typeof initLevelingSlider === 'function') {
    initLevelingSlider();
  }
}

function initLevelingSlider() {
  const slider = document.getElementById('levelSlider');
  const display = document.getElementById('currentLevelDisplay');
  const materialsBody = document.getElementById('materialsBody');
  const steps = document.querySelectorAll('.custom-step');

  const sortByNameBtn = document.getElementById('sortByName');
  const sortByQtyBtn = document.getElementById('sortByQty');
  const sortIndName = document.getElementById('sortIndicatorName');
  const sortIndQty = document.getElementById('sortIndicatorQty');

  let currentSort = 'name'; // 'name' or 'qty'
  let nameAsc = true;
  let qtyAsc = false; // Cantidades mayores primero por defecto

  if (!slider || !materialsBody) return;

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

/* 🌍 SISTEMA DE TRADUCCIÓN */
const translations = {
  es: {
    nav_home: "Inicio",
    nav_professions: "Profesiones",
    nav_expansions: "Expansiones",
    prof_alchemy: "Alquimia",
    prof_enchanting: "Encantamiento",
    prof_blacksmithing: "Herrería",
    prof_engineering: "Ingeniería",
    prof_inscription: "Inscripción",
    prof_jewelcrafting: "Joyería",
    prof_leatherworking: "Peletería",
    prof_tailoring: "Sastrería",
    exp_vanilla: "Vanilla",
    exp_tbc: "Terrallende",
    exp_wotlk: "Rasganorte",
    exp_cata: "Cataclismo",
    exp_mop: "Pandaria",
    exp_wod: "Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "Explora por Expansión",
    title_professions: "Guías por Profesión (Actual)",
    page_title: "WOWGamerES – Guías y Profesiones de WoW",
    legal_notice: "Aviso Legal"
  },
  en: {
    nav_home: "Home",
    nav_professions: "Professions",
    nav_expansions: "Expansions",
    prof_alchemy: "Alchemy",
    prof_enchanting: "Enchanting",
    prof_blacksmithing: "Blacksmithing",
    prof_engineering: "Engineering",
    prof_inscription: "Inscription",
    prof_jewelcrafting: "Jewelcrafting",
    prof_leatherworking: "Leatherworking",
    prof_tailoring: "Tailoring",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "Explore by Expansion",
    title_professions: "Profession Guides (Current)",
    page_title: "WOWGamerES – WoW Guides and Professions",
    legal_notice: "Legal Notice"
  },
  fr: {
    nav_home: "Accueil",
    nav_professions: "Professions",
    nav_expansions: "Extensions",
    prof_alchemy: "Alchimie",
    prof_enchanting: "Enchantement",
    prof_blacksmithing: "Forge",
    prof_engineering: "Ingénierie",
    prof_inscription: "Calligraphie",
    prof_jewelcrafting: "Joaillerie",
    prof_leatherworking: "Travail du cuir",
    prof_tailoring: "Couture",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "Explorer par Extension",
    title_professions: "Guides de Professions (Actuel)",
    page_title: "WOWGamerES – Guides et Professions WoW",
    legal_notice: "Mentions Légales"
  },
  de: {
    nav_home: "Startseite",
    nav_professions: "Berufe",
    nav_expansions: "Erweiterungen",
    prof_alchemy: "Alchemie",
    prof_enchanting: "Verzauberkunst",
    prof_blacksmithing: "Schmiedekunst",
    prof_engineering: "Ingenieurskunst",
    prof_inscription: "Inschriftenkunde",
    prof_jewelcrafting: "Juwelierskunst",
    prof_leatherworking: "Lederverarbeitung",
    prof_tailoring: "Schneiderei",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "Erkunden nach Erweiterung",
    title_professions: "Berufsguides (Aktuell)",
    page_title: "WOWGamerES – WoW Guides und Berufe",
    legal_notice: "Impressum"
  },
  pt: {
    nav_home: "Início",
    nav_professions: "Profissões",
    nav_expansions: "Expansões",
    prof_alchemy: "Alquimia",
    prof_enchanting: "Encantamento",
    prof_blacksmithing: "Ferraria",
    prof_engineering: "Engenharia",
    prof_inscription: "Escrivania",
    prof_jewelcrafting: "Joalheria",
    prof_leatherworking: "Couraria",
    prof_tailoring: "Alfaiataria",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "Explorar por Expansão",
    title_professions: "Guias de Profissão (Atual)",
    page_title: "WOWGamerES – Guias e Profissões do WoW",
    legal_notice: "Aviso Legal"
  },
  it: {
    nav_home: "Home",
    nav_professions: "Professioni",
    nav_expansions: "Espansioni",
    prof_alchemy: "Alchimia",
    prof_enchanting: "Incantamento",
    prof_blacksmithing: "Forgiatura",
    prof_engineering: "Ingegneria",
    prof_inscription: "Runografia",
    prof_jewelcrafting: "Oreficeria",
    prof_leatherworking: "Conciatura",
    prof_tailoring: "Sartoria",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "Esplora per Espansione",
    title_professions: "Guide alle Professioni (Attuale)",
    page_title: "WOWGamerES – Guide e Professioni WoW",
    legal_notice: "Note Legali"
  },
  ru: {
    nav_home: "Главная",
    nav_professions: "Профессии",
    nav_expansions: "Дополнения",
    prof_alchemy: "Алхимия",
    prof_enchanting: "Наложение чар",
    prof_blacksmithing: "Кузнечное дело",
    prof_engineering: "Инженерное дело",
    prof_inscription: "Начертание",
    prof_jewelcrafting: "Ювелирное дело",
    prof_leatherworking: "Кожевничество",
    prof_tailoring: "Портняжное дело",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "Дополнения",
    title_professions: "Гайды по профессиям (Актуально)",
    page_title: "WOWGamerES – Гайды и Профессии WoW",
    legal_notice: "Юридическая информация"
  },
  zh: {
    nav_home: "首页",
    nav_professions: "专业",
    nav_expansions: "资料片",
    prof_alchemy: "炼金术",
    prof_enchanting: "附魔",
    prof_blacksmithing: "锻造",
    prof_engineering: "工程学",
    prof_inscription: "铭文",
    prof_jewelcrafting: "珠宝加工",
    prof_leatherworking: "制皮",
    prof_tailoring: "裁缝",
    exp_vanilla: "经典旧世",
    exp_tbc: "燃烧的远征",
    exp_wotlk: "巫妖王之怒",
    exp_cata: "大地的裂变",
    exp_mop: "熊猫人之谜",
    exp_wod: "德拉诺之王",
    exp_legion: "军团再临",
    exp_bfa: "争霸艾泽拉斯",
    exp_sl: "暗影国度",
    exp_df: "巨龙时代",
    exp_tww: "地心之战",
    exp_midnight: "Midnight",
    title_explore: "按资料片探索",
    title_professions: "专业指南 (当前)",
    page_title: "WOWGamerES – 魔兽世界指南和专业",
    legal_notice: "法律声明"
  },
  ja: {
    nav_home: "ホーム",
    nav_professions: "専門分野",
    nav_expansions: "拡張パック",
    prof_alchemy: "錬金術",
    prof_enchanting: "付呪",
    prof_blacksmithing: "鍛冶",
    prof_engineering: "エンジニアリング",
    prof_inscription: "銘文",
    prof_jewelcrafting: "宝石採掘",
    prof_leatherworking: "革細工",
    prof_tailoring: "裁縫",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "拡張パック別検索",
    title_professions: "専門ガイド (最新)",
    page_title: "WOWGamerES – WoWガイドと専門",
    legal_notice: "法的通知"
  },
  ar: {
    nav_home: "الرئيسية",
    nav_professions: "المهن",
    nav_expansions: "التوسعات",
    prof_alchemy: "الكيمياء",
    prof_enchanting: "السحر",
    prof_blacksmithing: "الحدادة",
    prof_engineering: "الهندسة",
    prof_inscription: "النقش",
    prof_jewelcrafting: "صياغة المجوهرات",
    prof_leatherworking: "أعمال الجلود",
    prof_tailoring: "الخياطة",
    exp_vanilla: "Vanilla",
    exp_tbc: "The Burning Crusade",
    exp_wotlk: "Wrath of the Lich King",
    exp_cata: "Cataclysm",
    exp_mop: "Mists of Pandaria",
    exp_wod: "Warlords of Draenor",
    exp_legion: "Legion",
    exp_bfa: "Battle for Azeroth",
    exp_sl: "Shadowlands",
    exp_df: "Dragonflight",
    exp_tww: "The War Within",
    exp_midnight: "Midnight",
    title_explore: "استكشف حسب التوسعة",
    title_professions: "أدلة المهن (الحالية)",
    page_title: "WOWGamerES - أدلة ومهن WoW",
    legal_notice: "إشعار قانوني"
  }
};

function setLanguage(lang) {
  localStorage.setItem('language', lang);

  if (translations[lang].page_title) {
    document.title = translations[lang].page_title;
  }

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang][key]) {
      let text = translations[lang][key];
      // Sobreescribir dinámicamente el título si se ha seleccionado una expansión
      if (key === 'title_professions' && window.currentExpansionName) {
        text = text.replace(/\(.*\)/, `(${window.currentExpansionName})`);
      }
      el.textContent = text;
    }
  });
}

function initTranslations() {
  const langSelector = document.getElementById('languageSelector');
  if (!langSelector) return;

  const currentLang = localStorage.getItem('language') || 'es';
  langSelector.value = currentLang;
  setLanguage(currentLang);

  langSelector.addEventListener('change', (e) => {
    setLanguage(e.target.value);
  });
}
