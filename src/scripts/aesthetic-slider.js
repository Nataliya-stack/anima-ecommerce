// src/scripts/aesthetic-slider.js

function initAestheticSlider() {
  const container = document.querySelector('main'); // Берем главный контейнер слайдера
  const slides = document.querySelectorAll('.aesthetic-slide');
  const upBtn = document.getElementById('slide-up-btn');
  const downBtn = document.getElementById('slide-down-btn');
  const counter = document.getElementById('slide-counter');

  if (!slides.length || !upBtn || !downBtn || !counter || !container) return;

  let currentIdx = 0;
  const totalSlides = slides.length;
  let isAnimating = false; // Защита от слишком быстрой прокрутки колесика

  function changeSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
      }
    });

    // Обновляем текстовый счетчик страниц
    counter.textContent = `${index + 1}/${totalSlides}`;
  }

  // Функции для переключения
  function nextSlide() {
    currentIdx = (currentIdx + 1) % totalSlides;
    changeSlide(currentIdx);
  }

  function prevSlide() {
    currentIdx = (currentIdx - 1 + totalSlides) % totalSlides;
    changeSlide(currentIdx);
  }

  // Клик по стрелкам на экране
  downBtn.onclick = nextSlide;
  upBtn.onclick = prevSlide;

  // ЛОГИКА ПРОКРУТКИ КОЛЕСИКОМ МЫШКИ (WHEEL)
  container.addEventListener('wheel', (e) => {
    // Отменяем стандартный скролл страницы браузером вниз
    e.preventDefault();

    // Если прошлый слайд еще плавно переключается, игнорируем новые кручения мыши
    if (isAnimating) return;

    isAnimating = true;

    if (e.deltaY > 0) {
      // Крутим колесико ВНИЗ -> следующий слайд
      nextSlide();
    } else if (e.deltaY < 0) {
      // Крутим колесико ВВЕРХ -> предыдущий слайд
      prevSlide();
    }

    // Ставим задержку в 800мс (чуть меньше duration-1000 анимации), 
    // чтобы слайды не пролетали со свистом при быстром скролле
    setTimeout(() => {
      isAnimating = false;
    }, 800);
  }, { passive: false }); // passive: false обязателен, чтобы e.preventDefault() сработал
}

// Запуск и поддержка переходов Astro View Transitions
initAestheticSlider();
document.addEventListener('astro:after-swap', initAestheticSlider);
