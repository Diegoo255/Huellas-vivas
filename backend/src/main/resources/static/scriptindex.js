
// --- Animación de imagen principal ---
window.addEventListener('load', () => {
  const mainImg = document.getElementById('mainImage');
  setTimeout(() => {
    mainImg.classList.add('visible');
  }, 200);
});

// --- Carrusel de imágenes ---
const carouselImages = document.querySelectorAll('.carousel img');
let currentIndex = 0;

function changeImage() {
  carouselImages[currentIndex].classList.remove('active');
  currentIndex = (currentIndex + 1) % carouselImages.length;
  carouselImages[currentIndex].classList.add('active');
}

// Cambia cada 4 segundos
setInterval(changeImage, 4000);

// --- Activa la primera imagen al cargar ---
window.addEventListener('load', () => {
  carouselImages[0].classList.add('active');
});