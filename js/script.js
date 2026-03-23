// Función para cargar HTML externo
function loadHTML(id, filename) {
  fetch(filename)
    .then(response => response.text())
    .then(data => {
      document.getElementById(id).innerHTML = data;
    });
}

// Cargar header y footer al cargar la página
loadHTML('wg-header', './header.html');
loadHTML('wg-footer', './footer.html');

// Año actual en el Copyright
document.getElementById("year").textContent = new Date().getFullYear();

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

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});
*/

/* 🌙 MODO OSCURO */
const toggle = document.getElementById('darkModeToggle');

toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  let imagen = document.getElementById("logo");

  if (imagen.src.includes("WOWGamerES_Logo.png")) {
    imagen.src = "./images/WOWGamerES_Logo_white.png";
  } else {
    imagen.src = "./images/WOWGamerES_Logo.png";
  }

  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
    imagen.src = "./images/WOWGamerES_Logo_black.png";
  } else {
    localStorage.setItem('theme', 'light');
    imagen.src = "./images/WOWGamerES_Logo_white.png";
  }
});

/* Guardar preferencia */
window.addEventListener('DOMContentLoaded', () => {
  let imagen = document.getElementById("logo");
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
    imagen.src = "./images/WOWGamerES_Logo_black.png";
  }
});

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

