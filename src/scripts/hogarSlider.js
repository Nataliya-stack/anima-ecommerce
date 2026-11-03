
// 1. Переменные для нижнего бесконечного слайдера матовых холодильников
let slidesHogar = [];
let btnHogarPrev, btnHogarNext;
let currentHogarIndex = 0;

// 2. Переменные для верхнего слайдера "Fabs vestidos" 50/50 (УНИКАЛЬНЫЕ ИМЕНА)
let slidesVestidos = [];
let btnVestidosPrev, btnVestidosNext;
let currentVestidosIndex = 0;

/**
 * Главная функция инициализации всех слайдеров на странице Дома
 */
function initAllHogarSliders() {
  // --- НАСТРОЙКА НИЖНЕГО СЛАЙДЕРА МАТОВЫХ ХОЛОДИЛЬНИКОВ ---
  slidesHogar = document.querySelectorAll('.hogar-slide');
  btnHogarPrev = document.getElementById('btn-hogar-prev');
  btnHogarNext = document.getElementById('btn-hogar-next');

  if (slidesHogar.length > 0 && btnHogarPrev && btnHogarNext) {
    currentHogarIndex = 0;
    updateHogarSlidesPosition();
    
    // Удаляем старые слушатели перед добавлением новых, чтобы избежать дублирования в Astro
    btnHogarNext.removeEventListener('click', handleHogarNext);
    btnHogarPrev.removeEventListener('click', handleHogarPrev);
    
    btnHogarNext.addEventListener('click', handleHogarNext);
    btnHogarPrev.addEventListener('click', handleHogarPrev);
  }

  // --- НАСТРОЙКА ВЕРХНЕГО СЛАЙДЕРА 50/50 (РАБОТАЕТ НЕЗАВИСИМО) ---
  slidesVestidos = document.querySelectorAll('.vestidos-slide');
  btnVestidosPrev = document.getElementById('btn-vestidos-prev');
  btnVestidosNext = document.getElementById('btn-vestidos-next');

  if (slidesVestidos.length > 0 && btnVestidosPrev && btnVestidosNext) {
    currentVestidosIndex = 0;
    
    btnVestidosNext.removeEventListener('click', handleVestidosNext);
    btnVestidosPrev.removeEventListener('click', handleVestidosPrev);
    
    btnVestidosNext.addEventListener('click', handleVestidosNext);
    btnVestidosPrev.addEventListener('click', handleVestidosPrev);
  }
}

// ========================================================
// 1. ЛОГИКА ДЛЯ НИЖНЕГО МАТОВОГО СЛАЙДЕРА (БЕСШОВНЫЙ СДВИГ)
// ========================================================
function updateHogarSlidesPosition() {
  const total = slidesHogar.length;
  slidesHogar.forEach((slide, index) => {
    slide.style.transition = 'none';
    let offset = index - currentHogarIndex;
    if (offset < -1) offset += total;
    if (offset > total - 2) offset -= total;

    if (offset === 0) {
      slide.style.transform = 'translateX(0) scale(1)';
      slide.style.opacity = '1';
      slide.style.zIndex = '20';
    } else if (offset === 1) {
      slide.style.transform = 'translateX(calc(100% + 16px)) scale(1)';
      slide.style.opacity = '1';
      slide.style.zIndex = '10';
    } else if (offset === -1) {
      slide.style.transform = 'translateX(calc(-100% - 16px)) scale(1)';
      slide.style.opacity = '1';
      slide.style.zIndex = '10';
    } else {
      slide.style.transform = 'translateX(200%) scale(0.9)';
      slide.style.opacity = '0';
      slide.style.zIndex = '0';
    }
  });

  setTimeout(() => {
    slidesHogar.forEach((slide, index) => {
      let offset = index - currentHogarIndex;
      if (offset < -1) offset += total;
      if (offset > total - 2) offset -= total;
      if (offset === 0 || offset === 1 || offset === -1) {
        slide.style.transition = 'transform 0.7s ease-in-out, opacity 0.7s ease-in-out';
      }
    });
  }, 20);
}

function handleHogarNext() {
  currentHogarIndex = (currentHogarIndex + 1) % slidesHogar.length;
  updateHogarSlidesPosition();
}

function handleHogarPrev() {
  currentHogarIndex = (currentHogarIndex - 1 + slidesHogar.length) % slidesHogar.length;
  updateHogarSlidesPosition();
}

// ========================================================
// 2. ЛОГИКА ДЛЯ ВЕРХНЕГО СЛАЙДЕРА 50/50 (ПЛАВНОЕ ПРОЯВЛЕНИЕ ОРАСIТY)
// ========================================================
function handleVestidosNext() {
  const oldSlide = slidesVestidos[currentVestidosIndex];
  oldSlide.classList.remove('opacity-100', 'z-10');
  oldSlide.classList.add('opacity-0', 'z-0');

  // Двигаем индекс строго вперед по кругу
  currentVestidosIndex = (currentVestidosIndex + 1) % slidesVestidos.length;

  const newSlide = slidesVestidos[currentVestidosIndex];
  newSlide.classList.remove('opacity-0', 'z-0');
  newSlide.classList.add('opacity-100', 'z-10');
}

// Исправлено: функция теперь привязана ко второй левой стрелке
function handleVestidosPrev() {
  const oldSlide = slidesVestidos[currentVestidosIndex];
  oldSlide.classList.remove('opacity-100', 'z-10');
  oldSlide.classList.add('opacity-0', 'z-0');

  // Двигаем индекс назад по кругу
  currentVestidosIndex = (currentVestidosIndex - 1 + slidesVestidos.length) % slidesVestidos.length;

  const newSlide = slidesVestidos[currentVestidosIndex];
  newSlide.classList.remove('opacity-0', 'z-0');
  newSlide.classList.add('opacity-100', 'z-10');
}

document.addEventListener('DOMContentLoaded', initAllHogarSliders);
document.addEventListener('astro:page-load', initAllHogarSliders);
