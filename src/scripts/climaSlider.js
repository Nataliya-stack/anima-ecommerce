// src/scripts/climaSlider.js

let currentIndex = 0;

const titleEl = document.getElementById('slider-title');
const descEl = document.getElementById('slider-description');
const linkEl = document.getElementById('slider-link');
const textContainer = document.getElementById('slider-text-container');

const prevBtn = document.getElementById('prev-slide-btn');
const nextBtn = document.getElementById('next-slide-btn');

function updateSlider(nextIndex) {
  if (nextIndex === currentIndex) return;

  // Находим картинку, к которой мы переключаемся
  const nextImg = document.getElementById(`slide-img-${nextIndex}`);
  if (!nextImg) return;

  // Считываем новые текстовые данные прямо из data-атрибутов картинки Astro!
  const nextTitle = nextImg.getAttribute('data-title') || '';
  const nextDesc = nextImg.getAttribute('data-description') || '';
  const nextLink = nextImg.getAttribute('data-link') || '#';

  // Плавное скрытие текста
  if (textContainer) {
    textContainer.classList.add('opacity-0', 'translate-x-[-10px]');
  }

  // Переключение классов анимации на картинках
  const currentImg = document.getElementById(`slide-img-${currentIndex}`);

  if (currentImg) {
    currentImg.classList.remove('opacity-100', 'scale-100', 'z-10');
    currentImg.classList.add('opacity-0', 'scale-105', 'z-0');
  }

  nextImg.classList.remove('opacity-0', 'scale-105', 'z-0');
  nextImg.classList.add('opacity-100', 'scale-100', 'z-10');

  currentIndex = nextIndex;

  // Подмена текста в момент, пока он невидим
  setTimeout(() => {
    if (titleEl) titleEl.textContent = nextTitle;
    if (descEl) descEl.textContent = nextDesc;
    if (linkEl) linkEl.setAttribute('href', nextLink);

    // Возвращаем текст на место
    if (textContainer) {
      textContainer.classList.remove('opacity-0', 'translate-x-[-10px]');
    }
  }, 200);
}

// Получаем общее количество слайдов на основе реально отрендеренных картинок
const totalSlides = document.querySelectorAll('[id^="slide-img-"]').length;

if (prevBtn && nextBtn && totalSlides > 0) {
  prevBtn.addEventListener('click', () => {
    let index = currentIndex - 1;
    if (index < 0) index = totalSlides - 1;
    updateSlider(index);
  });

  nextBtn.addEventListener('click', () => {
    let index = currentIndex + 1;
    if (index >= totalSlides) index = 0;
    updateSlider(index);
  });
}