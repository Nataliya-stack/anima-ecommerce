// src/scripts/distribuidores.js

function initDistributorsPage() {
  // 1. ЛОГИКА ФИЛЬТРА "FILTROS"
  const filterToggle = document.getElementById('filter-toggle');
  const filterContent = document.getElementById('filter-content');
  const filterPlus = document.getElementById('filter-plus');

  if (filterToggle && filterContent && filterPlus) {
    filterToggle.onclick = () => {
      const isActive = filterContent.classList.contains('active');
      
      if (isActive) {
        filterContent.style.height = '0px';
        filterContent.classList.remove('active');
        filterContent.style.opacity = '0';
        filterPlus.style.transform = 'rotate(0deg)';
      } else {
        // Автоматическая высота для фильтра
        filterContent.style.height = filterContent.scrollHeight + 'px';
        filterContent.classList.add('active');
        filterContent.style.opacity = '1';
        filterPlus.style.transform = 'rotate(45deg)';
      }
    };
  }

  // 2. ЛОГИКА АККОРДЕОНОВ МАГАЗИНОВ (АВТОМАТИЧЕСКАЯ ВЫСОТА)
  const items = document.querySelectorAll('.shop-accordion-item');
  const mapFrame = document.getElementById('map-frame');

  if (!items.length) return;

  items.forEach((item) => {
    const trigger = item.querySelector('.shop-trigger');
    const content = item.querySelector('.shop-content');
    const plus = item.querySelector('.shop-plus');

    if (!trigger || !content || !plus) return;

    trigger.onclick = () => {
      const isOpen = content.classList.contains('is-open');

      // Закрываем все остальные открытые карточки перед открытием новой
      document.querySelectorAll('.shop-content.is-open').forEach((openContent) => {
        const htmlContent = openContent;
        htmlContent.style.height = '0px';
        htmlContent.style.opacity = '0';
        htmlContent.classList.remove('is-open');
        
        const parent = htmlContent.closest('.shop-accordion-item');
        if (parent) {
          const parentPlus = parent.querySelector('.shop-plus');
          if (parentPlus) {
            parentPlus.style.transform = 'rotate(0deg)';
            parentPlus.textContent = '+';
          }
        }
      });

      if (!isOpen) {
        //Вместо жестких 140px берем честную высоту контента через scrollHeight
        content.style.height = content.scrollHeight + 'px'; 
        content.style.opacity = '1';
        content.classList.add('is-open');
        plus.style.transform = 'rotate(180deg)';
        plus.textContent = '—';

        // ЛОГИКА КАРТЫ: При клике обновляем src фрейма Google Maps по координатам
        const lat = item.getAttribute('data-lat');
        const lng = item.getAttribute('data-lng');
        console.log("Координаты магазина:", lat, lng);
        
        if (mapFrame && lat && lng) {
          mapFrame.setAttribute('src', `https://maps.google.com/maps?q=${lat},${lng}&z=15&ie=UTF8&iwloc=&output=embed`);
        }
      }
    };
  });
}

// Перезапуск скрипта при переходах между страницами в Astro
initDistributorsPage();
document.addEventListener('astro:after-swap', initDistributorsPage);
