// Colapsables
const collapsibles = document.querySelectorAll(".collapsible");
collapsibles.forEach(btn => {
  btn.addEventListener("click", function() {
    this.classList.toggle("active");
    const content = this.nextElementSibling;
    if(content.style.display === "block"){
      content.style.display = "none";
    } else {
      content.style.display = "block";
    }
  });
});

// Botón volver arriba
const toTop = document.getElementById("toTop");
window.onscroll = () => {
  if(window.scrollY > 300) toTop.style.display = "block";
  else toTop.style.display = "none";
};
toTop.onclick = () => { window.scrollTo({top:0, behavior:'smooth'}); };

/* 🌙 MODO OSCURO */
const toggle = document.getElementById('darkModeToggle');

toggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');

  if (document.body.classList.contains('dark-mode')) {
    localStorage.setItem('theme', 'dark');
  } else {
    localStorage.setItem('theme', 'light');
  }
});

/* Guardar preferencia */
window.addEventListener('DOMContentLoaded', () => {
  if (localStorage.getItem('theme') === 'dark') {
    document.body.classList.add('dark-mode');
  }
});