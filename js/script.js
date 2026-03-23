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

  // Botón volver arriba
  /*
  const toTop = document.getElementById('toTop');

  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      toTop.style.display = 'block';
    } else {
      toTop.style.display = 'none';
    }

    // Animación fade-in
    document.querySelectorAll('.fade-in').forEach(fader => {
      const rect = fader.getBoundingClientRect();
      if (rect.top < window.innerHeight - 50) {
        fader.classList.add('visible');
      }
    });
  });

  if (toTop) {
    toTop.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
  */

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

  /* Menú móvil */
  document.querySelectorAll('.main-nav > ul > li > a').forEach(link => {
    link.addEventListener('click', function (e) {
      const submenu = this.nextElementSibling;
      if (submenu && submenu.classList.contains('submenu')) {
        e.preventDefault(); // evitar cerrar página
        submenu.style.display = submenu.style.display === 'block' ? 'none' : 'block';
      }
    });
  });
}
