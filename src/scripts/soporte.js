// src/scripts/soporte.js

function setupFilePreview(inputId, textId, defaultText) {
  const fileInput = document.getElementById(inputId);
  const infoText = document.getElementById(textId);

  fileInput?.addEventListener('change', () => {
    if (fileInput.files && fileInput.files.length > 0) {
      // Когда файл выбран, заменяем серую подсказку на живое имя файла
      const fileName = fileInput.files[0].name;
      if (infoText) {
        infoText.innerHTML = `<span class="text-black font-semibold tracking-wide text-xs uppercase">📄 Файл прикреплен: ${fileName}</span>`;
      }
    } else {
      // Если выбор отменили, возвращаем стандартное описание расширений
      if (infoText) infoText.textContent = defaultText;
    }
  });
}

function initFilePreviews() {
  setupFilePreview(
    'file-invoice', 
    'invoice-info-text', 
    'Extensiones aceptadas (máximo 2 Mb): .jpg, .jpeg, .pdf, .png'
  );
  setupFilePreview(
    'file-serial', 
    'serial-info-text', 
    'Extensiones aceptadas (máximo 2 Mb): .jpg, .jpeg, .pdf, .png'
  );
  initSupportSlider(); 
}

// Запускаем инициализацию при полной загрузке DOM и при переходах страниц в Astro
document.addEventListener('DOMContentLoaded', initFilePreviews);
document.addEventListener('astro:page-load', initFilePreviews);

let supportSlides = [];
let btnSupportPrev, btnSupportNext;
let currentSupportIndex = 0;

function initSupportSlider() {
  supportSlides = document.querySelectorAll('.support-slide');
  btnSupportPrev = document.getElementById('slide-prev');
  btnSupportNext = document.getElementById('slide-next');

  if (supportSlides.length > 0 && btnSupportPrev && btnSupportNext) {
    currentSupportIndex = 0;
    updateSupportSlidesPosition();
    
    // Сброс и назначение слушателей строго по вашему стандарту Astro
    btnSupportNext.removeEventListener('click', handleSupportNext);
    btnSupportPrev.removeEventListener('click', handleSupportPrev);
    
    btnSupportNext.addEventListener('click', handleSupportNext);
    btnSupportPrev.addEventListener('click', handleSupportPrev);
  }
}

function updateSupportSlidesPosition() {
  const total = supportSlides.length;
  
  supportSlides.forEach((slide, index) => {
    // Вычисляем относительное смещение карточки от текущего индекса
    let offset = index - currentSupportIndex;
    
    // Зацикливаем смещение по кругу в обе стороны
    if (offset < 0) offset += total;

    // Константы для шага (33.333% ширины + 32px отступа между карточками)
    if (offset === 0) {
      slide.style.transform = 'translateX(0)';
      slide.style.opacity = '1';
      slide.style.visibility = 'visible';
    } else if (offset === 1) {
      slide.style.transform = 'translateX(calc(100% + 32px))';
      slide.style.opacity = '1';
      slide.style.visibility = 'visible';
    } else if (offset === 2) {
      slide.style.transform = 'translateX(calc(200% + 64px))';
      slide.style.opacity = '1';
      slide.style.visibility = 'visible';
    } else if (offset === total - 1) {
      // Эта карточка стоит сразу слева за краем экрана и готова плавно выехать при нажатии влево!
      slide.style.transform = 'translateX(calc(-100% - 32px))';
      slide.style.opacity = '0';
      slide.style.visibility = 'visible';
    } else {
      // Все остальные скрытые карточки ждут своей очереди справа
      slide.style.transform = 'translateX(300%)';
      slide.style.opacity = '0';
      slide.style.visibility = 'hidden';
    }
    
    // Добавляем благородную плавную анимацию перемещения
    slide.style.transition = 'transform 0.6s cubic-bezier(0.25, 1, 0.5, 1), opacity 0.6s ease';
  });
}

function handleSupportNext() {
  // Шагаем по одной картинке вперед по кругу
  currentSupportIndex = (currentSupportIndex + 1) % supportSlides.length;
  updateSupportSlidesPosition();
}

function handleSupportPrev() {
  // Шагаем по одной картинке назад по кругу: 6-я карточка красиво появится именно с левого края!
  currentSupportIndex = (currentSupportIndex - 1 + supportSlides.length) % supportSlides.length;
  updateSupportSlidesPosition();
}
