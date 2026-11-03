// src/scripts/retro-slider.js

/**
 * Универсальный инициализатор слайдеров с эффектом плавного затухания 
 * @param {string} slideClass - Класс элементов слайда (например, '.slide-fade')
 * @param {string} prevId - ID кнопки "Назад" (например, 'retro-prev')
 * @param {string} nextId - ID кнопки "Вперед" (например, 'retro-next')
 */
function createSlider(slideClass, prevId, nextId) {
  const slides = document.querySelectorAll(slideClass);
  const prevBtn = document.getElementById(prevId);
  const nextBtn = document.getElementById(nextId);
  
  if (!slides.length || !prevBtn || !nextBtn) return;

  let currentSlide = 0;

  function showSlide(index) {
    slides.forEach((slide, i) => {
      if (i === index) {
        slide.classList.remove('opacity-0', 'pointer-events-none', 'z-0');
        slide.classList.add('opacity-100', 'z-10');
      } else {
        slide.classList.remove('opacity-100', 'z-10');
        slide.classList.add('opacity-0', 'pointer-events-none', 'z-0');
      }
    });
  }

  nextBtn.onclick = () => {
    currentSlide = (currentSlide + 1) % slides.length;
    showSlide(currentSlide);
  };

  prevBtn.onclick = () => {
    currentSlide = (currentSlide - 1 + slides.length) % slides.length;
    showSlide(currentSlide);
  };
}

// Обновленная функция, которая теперь умеет обслуживать любое видео по его ID
function setupYoutubeInstantHide(wrapperSelector, shieldId, iframeId) {
  const wrapper = document.querySelector(wrapperSelector);
  const shield = document.getElementById(shieldId);
  const iframe = document.getElementById(iframeId);

  if (!wrapper || !shield || !iframe) return;

  wrapper.addEventListener('mouseenter', () => {
    shield.style.pointerEvents = 'none';
    iframe.style.pointerEvents = 'auto';
  });

  wrapper.addEventListener('mouseleave', () => {
    shield.style.pointerEvents = 'auto';
    iframe.style.pointerEvents = 'none';
    
    if (document.activeElement === iframe) {
      window.focus();
    }
  });
}

// Главная функция запуска всех скриптов страницы
function initAllPageScripts() {
  // 1. Главный верхний баннер
  createSlider('.slide-fade', 'retro-prev', 'retro-next');

  // 2. Верхний слайдер категорий (Frigoríficos)
  createSlider('.product-category-slide', 'prod-prev', 'prod-next');

  // 3. Нижний слайдер мелкой техники (Tostadoras, Hervidores)
  createSlider('.small-appliance-slide', 'small-prev', 'small-next');

  // 4. Мгновенное скрытие для ПЕРВОГО видео
  setupYoutubeInstantHide('.video-responsive-wrapper:not(#second-video-wrapper)', 'mouse-shield', 'smeg-yt-player');

  // 5. Мгновенное скрытие для ВТОРОГО видео
  setupYoutubeInstantHide('#second-video-wrapper', 'mouse-shield-second', 'smeg-yt-player-second');
}

// Запуск
initAllPageScripts();
document.addEventListener('astro:after-swap', initAllPageScripts);
