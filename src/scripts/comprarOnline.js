// src/scripts/comprar-online.js

// =========================================================================
// ЛОГИКА 1: ГЛАВНЫЙ ПОЛНОЭКРАННЫЙ СЛАЙДЕР (НА ГЛАВНОМ БАННЕРЕ)
// =========================================================================
function initMainSlider() {
  const container = document.getElementById('comprar-slider');
  const btnPrev = document.getElementById('prev-slide');
  const btnNext = document.getElementById('next-slide');

  if (!container || !btnPrev || !btnNext) return;

  const getStep = () => container.clientWidth;

  const handleNext = (e) => {
    e.preventDefault();
    const step = getStep();
    if (container.scrollLeft + step >= container.scrollWidth - 10) {
      container.scrollTo({ left: 0, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: step, behavior: 'smooth' });
    }
  };

  const handlePrev = (e) => {
    e.preventDefault();
    const step = getStep();
    if (container.scrollLeft <= 10) {
      container.scrollTo({ left: container.scrollWidth, behavior: 'smooth' });
    } else {
      container.scrollBy({ left: -step, behavior: 'smooth' });
    }
  };

  btnNext.removeEventListener('click', handleNext);
  btnNext.addEventListener('click', handleNext);

  btnPrev.removeEventListener('click', handlePrev);
  btnPrev.addEventListener('click', handlePrev);
}

// src/scripts/comprarOnline.js

let currentAmbientIndex = 0;

function initAmbientSection() {
  const imgEl = document.getElementById('ambient-img');
  const skuEl = document.getElementById('ambient-sku');
  const titleEl = document.getElementById('ambient-title');
  const priceEl = document.getElementById('ambient-price');
  
  const btnPrev = document.getElementById('ambient-prev');
  const btnNext = document.getElementById('ambient-next');
  
  // Находим все хотспоты-точки на картинке интерьера
  const spots = document.querySelectorAll('.ambient-spot');

  if (!imgEl || !skuEl || !titleEl || !priceEl || !btnPrev || !btnNext || !spots.length) return;

  function updateAmbientProduct(index) {
    // Вместо локального массива берём хотспот по индексу и считываем его data-атрибуты, которые Astro заполнил из db.json!
    const activeSpot = spots[index];
    if (!activeSpot) return;

    const sku = activeSpot.getAttribute('data-sku') || '';
    const title = activeSpot.getAttribute('data-title') || '';
    const price = activeSpot.getAttribute('data-price') || '';
    const imgKey = activeSpot.getAttribute('data-imgkey') || '';
    
    // Обновляем текстовые плашки описания товара рядом с картинкой
    skuEl.textContent = sku;
    titleEl.textContent = title;
    priceEl.textContent = price;
    
    // Меняем картинку прибора
    const newSrc = imgEl.getAttribute(`data-${imgKey}`);
    if (newSrc) imgEl.src = newSrc;

    // Включаем или выключаем пульсирующий маркер (.spot-pulse) на карте
    spots.forEach((spot, i) => {
      const pulse = spot.querySelector('.spot-pulse');
      const dot = spot.querySelector('.spot-dot');
      
      if (i === index) {
        if (pulse) pulse.classList.remove('hidden');
        if (dot) dot.classList.add('hidden');
      } else {
        if (pulse) pulse.classList.add('hidden');
        if (dot) dot.classList.remove('hidden');
      }
    });
  }

  const goNext = (e) => {
    e.preventDefault();
    currentAmbientIndex = (currentAmbientIndex + 1) % spots.length;
    updateAmbientProduct(currentAmbientIndex);
  };

  const goPrev = (e) => {
    e.preventDefault();
    currentAmbientIndex = (currentAmbientIndex - 1 + spots.length) % spots.length;
    updateAmbientProduct(currentAmbientIndex);
  };

  // Клик по самим точкам на фотографии интерьера
  spots.forEach(spot => {
    spot.onclick = (e) => {
      e.preventDefault();
      const idx = parseInt(spot.getAttribute('data-index') || "0");
      currentAmbientIndex = idx;
      updateAmbientProduct(currentAmbientIndex);
    };
  });

  btnNext.removeEventListener('click', goNext);
  btnNext.addEventListener('click', goNext);

  btnPrev.removeEventListener('click', goPrev);
  btnPrev.addEventListener('click', goPrev);
}

// =========================================================================
// ЕДИНАЯ ТОЧКА ИНИЦИАЛИЗАЦИИ ДЛЯ СТРАНИЦЫ В ASTRO
// =========================================================================
function initPageScripts() {
  initMainSlider();
  initAmbientSection();
}

// Запуск при первой загрузке страницы
initPageScripts();

// Запуск при SPA-переходах между вкладками в Astro
document.addEventListener('astro:page-load', initPageScripts);

function initCalculator() {
  const selectEl = document.getElementById('renove-product-select');
  const extraFields = document.getElementById('extra-fields');
  const calculateBtn = document.getElementById('calculate-btn');
  const formEl = document.getElementById('renove-form');
  const resultBox = document.getElementById('result-box');
  
  // Поля для валидации
  const refInput = document.getElementById('product-ref');
  const brandInput = document.getElementById('product-brand');
  const statusInput = document.getElementById('product-status');
  const statusButtons = document.querySelectorAll('.status-btn');

  if (!selectEl || !extraFields || !calculateBtn) return;

  // Функция проверки: заполнена ли вся анкета полностью?
  function checkFormValidation() {
    const isProductSelected = selectEl.value !== "";
    const isRefFilled = refInput && refInput.value.trim() !== "";
    const isBrandFilled = brandInput && brandInput.value.trim() !== "";
    const isStatusSelected = statusInput && statusInput.value !== "";

    // Кнопка становится активной (черной) ТОЛЬКО если заполнены абсолютно ВСЕ поля
    if (isProductSelected && isRefFilled && isBrandFilled && isStatusSelected) {
      calculateBtn.removeAttribute('disabled');
      calculateBtn.classList.remove('bg-neutral-300', 'cursor-not-allowed', 'text-neutral-400');
      calculateBtn.classList.add('bg-black', 'text-white', 'cursor-pointer', 'hover:bg-neutral-800');
    } else {
      // Иначе кнопка всегда остается серой и заблокированной
      calculateBtn.setAttribute('disabled', 'true');
      calculateBtn.classList.remove('bg-black', 'text-white', 'cursor-pointer', 'hover:bg-neutral-800');
      calculateBtn.classList.add('bg-neutral-300', 'cursor-not-allowed', 'text-neutral-400');
    }
  }

  // АВТОМАТИЧЕСКОЕ РАСКРЫТИЕ: Выбрали товар — строчки сразу выезжают вниз
  selectEl.addEventListener('change', () => {
    if (selectEl.value !== "") {
      extraFields.classList.remove('hidden');
      setTimeout(() => {
        extraFields.classList.remove('opacity-0', 'translate-y-2');
      }, 50);
      checkFormValidation();
    }
  });

  // Следим за вводом текста в поля Референции и Бренда
  if (refInput) refInput.addEventListener('input', checkFormValidation);
  if (brandInput) brandInput.addEventListener('input', checkFormValidation);

  // Логика кнопок состояния (Funciona / No funciona)
  statusButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      statusButtons.forEach(b => b.classList.remove('border-neutral-900', 'bg-neutral-950', 'text-white'));
      statusButtons.forEach(b => b.classList.add('border-slate-200', 'bg-white', 'text-neutral-700'));

      btn.classList.remove('border-slate-200', 'bg-white', 'text-neutral-700');
      btn.classList.add('border-neutral-900', 'bg-neutral-950', 'text-white');

      if (statusInput) statusInput.value = btn.getAttribute('data-status');
      
      // Проверяем форму после клика на статус
      checkFormValidation();
    });
  });

  // Замените финальный расчет в самом низу вашего файла comprarOnline.js
if (formEl) {
  formEl.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const producto = selectEl.value;
    const estado = statusInput.value;
    let descuentoText = "-20%"; // По умолчанию по правилам Smeg

    // Если вы хотите сделать кастомные условия:
    if (estado === 'works') {
      descuentoText = "-25%"; // Повышенная скидка за работающий прибор
    } else if (estado === 'broken') {
      descuentoText = "-15%"; // Пониженная за сломанный
    }

    if (resultBox) {
      // Подставляем вычисленный текст в плашку результата
      resultBox.innerHTML = `¡Validación completada! Este producto aplica para un <strong>${descuentoText} de descuento</strong>.`;
      resultBox.classList.remove('hidden');
      resultBox.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  });
}
}

// Безопасный запуск без повторного объявления функций
const runAllPageScripts = () => {
  if (typeof initMainSlider === 'function') initMainSlider();
  if (typeof initAmbientSection === 'function') initAmbientSection();
  if (typeof initCalculator === 'function') initCalculator();
};

// Запуск для обычной загрузки и для SPA-переходов Astro
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', runAllPageScripts);
} else {
  runAllPageScripts();
}
document.addEventListener('astro:page-load', runAllPageScripts);
