// src/scripts/menu.js
function initMenu() {
  const menuCompleto = document.getElementById('menu-pantalla-completa');
  const btnPC = document.getElementById('boton-menu-derecha');
  const btnMovil = document.getElementById('boton-menu-movil');

  if (!menuCompleto) return;

  function toggleMenu(e) {
    if (e) e.preventDefault();
    
    // Определяем, на какую именно кнопку нажали (на ПК или на мобильном)
    const currentBtn = e.currentTarget;
    const isHidden = menuCompleto.classList.contains('hidden');
    
    if (isHidden) {
      // Открываем меню
      menuCompleto.classList.remove('hidden');
      menuCompleto.classList.add('flex');
      document.body.classList.add('overflow-hidden');
      
      // Добавляем класс активности НА КНОПКУ, чтобы полоски превратились в крестик
      if (currentBtn) currentBtn.classList.add('menu-activo');
    } else {
      // Закрываем меню
      menuCompleto.classList.add('hidden');
      menuCompleto.classList.remove('flex');
      document.body.classList.remove('overflow-hidden');
      
      // Удаляем класс активности, возвращая бургер из 3-х полосок
      if (btnPC) btnPC.classList.remove('menu-activo');
      if (btnMovil) btnMovil.classList.remove('menu-activo');
    }
  }

  // Привязываем события напрямую к кнопкам с очисткой старых слушателей
  if (btnPC) {
    btnPC.removeEventListener('click', toggleMenu);
    btnPC.addEventListener('click', toggleMenu);
  }
  
  if (btnMovil) {
    btnMovil.removeEventListener('click', toggleMenu);
    btnMovil.addEventListener('click', toggleMenu);
  }
}

// Запуск при первой загрузке страницы
initMenu();

// Запуск при программных переходах в Astro
document.addEventListener('astro:page-load', initMenu);
