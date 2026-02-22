// Botón volver arriba
const toTop = document.getElementById('toTop');

window.addEventListener('scroll', () => {
  if (window.scrollY > 300) {
    toTop.style.display = 'block';
  } else {
    toTop.style.display = 'none';
  }

  // Animación fade-in
  const faders = document.querySelectorAll('.fade-in');
  faders.forEach(fader => {
    const rect = fader.getBoundingClientRect();
    if (rect.top < window.innerHeight - 50) {
      fader.classList.add('visible');
    }
  });
});

toTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});