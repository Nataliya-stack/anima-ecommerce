// src/scripts/contacto.js

function initContactoPage() {
  const fileInput = document.getElementById('file-input');
  const fileNameDisplay = document.getElementById('file-name-display');

  if (!fileInput || !fileNameDisplay) return;

  // Отслеживаем момент, когда пользователь выбрал файл на компьютере
  fileInput.onchange = () => {
    if (fileInput.files && fileInput.files.length > 0) {
      // Считываем имя выбранного файла
      const name = fileInput.files[0].name;
      // Выводим его на экран под текстом ограничений
      fileNameDisplay.textContent = `Archivo seleccionado: ${name}`;
    } else {
      // Если окно закрыли, но ничего не выбрали — очищаем строчку
      fileNameDisplay.textContent = '';
    }
  };
}

// Запускаем при первой загрузке и настраиваем поддержку Astro View Transitions
initContactoPage();
document.addEventListener('astro:after-swap', initContactoPage);
