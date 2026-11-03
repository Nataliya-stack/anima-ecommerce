
let btnMenos, btnMas, cantidadDisplay, btnAddCesta;
let cantidadActual = 1;

function initProductCard() {
  btnMenos = document.getElementById('btn-menos');
  btnMas = document.getElementById('btn-mas');
  cantidadDisplay = document.getElementById('cantidad-display');
  btnAddCesta = document.getElementById('btn-add-cesta');

  if (!cantidadDisplay || !btnAddCesta) return;

  cantidadActual = 1;
  cantidadDisplay.textContent = cantidadActual;
  btnMenos.addEventListener('click', handleMinusClick);
  btnMas.addEventListener('click', handlePlusClick);
  btnAddCesta.addEventListener('click', addToLocalStorage);
}

function handleMinusClick() {
  if (cantidadActual > 1) {
    cantidadActual--;
    cantidadDisplay.textContent = cantidadActual;
  }
}

function handlePlusClick() {
  // Считываем максимальный складской остаток из атрибута
  const maxStock = parseInt(btnAddCesta.getAttribute('data-stock') || '99', 10);

  if (cantidadActual < maxStock) {
    cantidadActual++;
    cantidadDisplay.textContent = cantidadActual;
  } else {
    // Если пытаются выбрать больше, чем есть на складе — вызываем модальное окно
    showStockModal();
  }
}

function addToLocalStorage() {
  const id = btnAddCesta.getAttribute('data-id');
  const nombre = btnAddCesta.getAttribute('data-nombre');
  const precio = parseFloat(btnAddCesta.getAttribute('data-precio') || '0');
  const imagen = btnAddCesta.getAttribute('data-imagen');
  const maxStock = parseInt(btnAddCesta.getAttribute('data-stock') || '99', 10);

  let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  const productIndex = carrito.findIndex(item => item.id === id);

  let currentQuantityInCart = productIndex !== -1 ? carrito[productIndex].cantidad : 0;

  // Проверка: не превысит ли добавление лимит склада
  if (currentQuantityInCart + cantidadActual > maxStock) {
    showStockModal();
    return;
  }

  if (productIndex !== -1) {
    carrito[productIndex].cantidad += cantidadActual;
  } else {
    carrito.push({ id, nombre, precio, imagen, cantidad: cantidadActual });
  }

  localStorage.setItem('carrito', JSON.stringify(carrito));
  import('./updateCartCount.js').then(module => {
    module.updateHeaderCartCount();
  });

  const originalText = btnAddCesta.textContent;
  const originalBg = btnAddCesta.style.backgroundColor;
  
  btnAddCesta.textContent = "¡Añadido con éxito!";
  btnAddCesta.style.backgroundColor = "#10b981"; 
  
  setTimeout(() => {
    btnAddCesta.textContent = originalText;
    btnAddCesta.style.backgroundColor = "black";
  }, 2000);
}

function showStockModal() {
  const modal = document.getElementById('stock-modal');
  const closeModalBtn = document.getElementById('close-stock-modal');

  if (modal) {
    modal.showModal();
    if (closeModalBtn) {
      closeModalBtn.onclick = () => modal.close();
    }
  }
}

document.addEventListener('DOMContentLoaded', initProductCard);
document.addEventListener('astro:page-load', initProductCard);