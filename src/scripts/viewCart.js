import { supabase } from '../lib/supabase'; // Относительный путь для избежания ошибок Vite

let cartContainer, summaryItemsList, cartEmpty, cartSubtotal, cartTotal, btnCheckout, authWarning;

function initCartPage() {
  cartContainer = document.getElementById('cart-container');
  summaryItemsList = document.getElementById('summary-items-list');
  cartEmpty = document.getElementById('cart-empty');
  cartSubtotal = document.getElementById('cart-subtotal');
  cartTotal = document.getElementById('cart-total');
  btnCheckout = document.getElementById('btn-checkout');
  authWarning = document.getElementById('auth-warning');

  if (!cartContainer || !btnCheckout) return;

  renderCartItems();
}

async function renderCartItems() {
  const rawCarrito = JSON.parse(localStorage.getItem('carrito') || '[]');

  // Группируем одинаковые товары по ID
  const aggregatedCarrito = [];
  rawCarrito.forEach(item => {
    const existing = aggregatedCarrito.find(x => x.id === item.id);
    if (existing) {
      existing.cantidad += item.cantidad;
    } else {
      aggregatedCarrito.push({ ...item });
    }
  });

  if (aggregatedCarrito.length === 0) {
    cartContainer.innerHTML = '';
    if (summaryItemsList) summaryItemsList.innerHTML = '';
    cartEmpty.classList.remove('hidden');
    btnCheckout.disabled = true;
    btnCheckout.classList.add('opacity-50', 'cursor-not-allowed');
    updateTotals(0);
    return;
  }

  // Запрашиваем актуальный stock из Supabase для всех товаров в корзине
  const itemIds = aggregatedCarrito.map(item => item.id);
  let stockMap = {};

  try {
    const { data: dbProducts, error } = await supabase
      .from('products')
      .select('pk_producto, stock')
      .in('pk_producto', itemIds);

    if (!error && dbProducts) {
      dbProducts.forEach(p => {
        stockMap[p.pk_producto] = p.stock;
      });
    }
  } catch (err) {
    console.error('Error al consultar stock en Supabase:', err);
  }

  cartEmpty.classList.add('hidden');

  let htmlContent = '';
  let summaryHtmlContent = '';
  let subtotalSum = 0;
  let hasOutOfStockItems = false;

  aggregatedCarrito.forEach((item) => {
    // Получаем реальный остаток со склада (если запрос не прошел, берем запасной вариант)
    const realStock = stockMap[item.id] !== undefined ? stockMap[item.id] : 99;
    const isOutOfStock = realStock <= 0;
    const isExceedingStock = item.cantidad > realStock;

    if (isOutOfStock || isExceedingStock) {
      hasOutOfStockItems = true;
    }

    const itemTotal = item.precio * item.cantidad;
    subtotalSum += itemTotal;

    // 1. КРУПНАЯ карточка товара
    htmlContent += `
      <div class="flex flex-col sm:flex-row items-center justify-between p-5 sm:p-8 bg-white border ${isOutOfStock ? 'border-red-300 bg-red-50/20' : 'border-neutral-100'} rounded-3xl shadow-xs gap-6 w-full">
        
        <!-- Левый блок: Картинка и Название -->
        <div class="flex flex-col sm:flex-row items-center gap-4 sm:gap-8 w-full sm:w-auto text-center sm:text-left">
          <div class="w-48 h-48 sm:w-64 sm:h-64 lg:w-80 lg:h-80 bg-neutral-50 rounded-2xl overflow-hidden p-4 flex items-center justify-center border border-neutral-100 shrink-0 mx-auto sm:mx-0">
            <img src="${item.imagen}" alt="${item.nombre}" class="max-h-full max-w-full object-contain mix-blend-multiply" />
          </div>
          <div class="space-y-2 flex-1">
            <h4 class="text-lg sm:text-xl lg:text-3xl font-bold text-neutral-900 tracking-tight leading-tight">${item.nombre}</h4>
            <p class="text-sm sm:text-base text-neutral-400 font-light">Precio unitario: ${item.precio.toFixed(2)} €</p>
            
            ${isOutOfStock ? `
              <span class="inline-block px-3 py-1 bg-red-100 text-red-700 text-xs font-bold uppercase rounded-full">
                Sin stock disponible
              </span>
            ` : isExceedingStock ? `
              <span class="inline-block px-3 py-1 bg-amber-100 text-amber-800 text-xs font-bold uppercase rounded-full">
                Stock máximo: ${realStock} ud.
              </span>
            ` : ''}
          </div>
        </div>

        <!-- Правый блок: Кнопки количество, Цена и Удаление -->
        <div class="flex flex-row items-center justify-between sm:justify-end w-full sm:w-auto gap-4 sm:gap-8 lg:gap-12 pt-4 sm:pt-0 border-t border-neutral-100 sm:border-none">
          
          <div class="flex items-center border border-neutral-200 rounded-2xl overflow-hidden bg-white shadow-2xs">
            <button data-id="${item.id}" class="btn-cart-minus px-3 py-1.5 sm:px-4 sm:py-2.5 hover:bg-neutral-200 transition-colors font-mono font-bold cursor-pointer text-lg sm:text-xl">-</button>
            <span class="px-4 py-1.5 sm:px-6 sm:py-2.5 text-sm sm:text-base font-black bg-white border-x border-neutral-200 min-w-10 sm:min-w-14 text-center">${item.cantidad}</span>
            <button data-id="${item.id}" data-stock="${realStock}" class="btn-cart-plus px-3 py-1.5 sm:px-4 sm:py-2.5 hover:bg-neutral-200 transition-colors font-mono font-bold cursor-pointer text-lg sm:text-xl ${item.cantidad >= realStock ? 'opacity-40 cursor-not-allowed' : ''}">+</button>
          </div>
          
          <span class="font-mono font-bold text-xl sm:text-2xl lg:text-3xl text-neutral-900 shrink-0 text-right flex-1 sm:flex-none sm:min-w-35 pr-2 sm:pr-0">
            ${itemTotal.toFixed(2)} €
          </span>
          
          <button data-id="${item.id}" class="btn-delete-item text-neutral-300 hover:text-red-500 transition-colors cursor-pointer shrink-0 p-2" aria-label="Eliminar">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-6 h-6">
              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
            </svg>
          </button>
        </div>        
      </div>
    `;

    // 2. МИНИ-СТРОЧКА В ЧЕКЕ
    summaryHtmlContent += `
      <div class="flex items-center justify-between text-lg text-neutral-600 font-light bg-white border border-neutral-100 p-2.5 rounded-xl shadow-2xs">
        <div class="flex items-center gap-3 truncate">
          <div class="w-15 h-15 bg-neutral-50 rounded-lg p-1 flex items-center justify-center border border-neutral-100 shrink-0">
            <img src="${item.imagen}" alt="${item.nombre}" class="max-h-full max-w-full object-contain mix-blend-multiply" />
          </div>
          <span class="truncate pr-2 font-medium">${item.nombre} <b class="text-neutral-400 font-normal">x${item.cantidad}</b></span>
        </div>
        <span class="font-mono text-neutral-900 font-bold shrink-0">${itemTotal.toFixed(2)} €</span>
      </div>
    `;
  });

  cartContainer.innerHTML = htmlContent;
  if (summaryItemsList) summaryItemsList.innerHTML = summaryHtmlContent;
  
  updateTotals(subtotalSum);

  // Блокируем кнопку оплаты, если в корзине есть отсутствующие товары
  if (hasOutOfStockItems) {
    btnCheckout.disabled = true;
    btnCheckout.classList.add('opacity-50', 'cursor-not-allowed');
  } else {
    btnCheckout.disabled = false;
    btnCheckout.classList.remove('opacity-50', 'cursor-not-allowed');
  }

  // Привязываем события
  document.querySelectorAll('.btn-cart-minus').forEach(btn => btn.addEventListener('click', handleQuantityMinus));
  document.querySelectorAll('.btn-cart-plus').forEach(btn => btn.addEventListener('click', handleQuantityPlus));
  document.querySelectorAll('.btn-delete-item').forEach(btn => btn.addEventListener('click', handleDeleteItem));
  
  btnCheckout.addEventListener('click', handleCheckoutClick);
}

function handleQuantityMinus(event) {
  const id = event.currentTarget.getAttribute('data-id');
  let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const index = carrito.findIndex(item => item.id === id);
  if (index !== -1) {
    if (carrito[index].cantidad > 1) {
      carrito[index].cantidad--;
    } else {
      carrito = carrito.filter(item => item.id !== id);
    }
    localStorage.setItem('carrito', JSON.stringify(carrito));
    syncHeaderBadge();
    renderCartItems();
  }
}

async function handleQuantityPlus(event) {
  const btn = event.currentTarget;
  const id = btn.getAttribute('data-id');
  const realStockAttr = parseInt(btn.getAttribute('data-stock') || '99', 10);
  
  let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const index = carrito.findIndex(item => item.id === id);
  
  if (index !== -1) {
    if (carrito[index].cantidad >= realStockAttr) {
      showStockModal();
      return;
    }

    carrito[index].cantidad++;
    localStorage.setItem('carrito', JSON.stringify(carrito));
    syncHeaderBadge();
    renderCartItems();
  }
}

function handleDeleteItem(event) {
  const idToDelete = event.currentTarget.getAttribute('data-id');
  let carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  carrito = carrito.filter(item => item.id !== idToDelete);
  localStorage.setItem('carrito', JSON.stringify(carrito));
  syncHeaderBadge();
  renderCartItems(); 
}

function updateTotals(totalSum) {
  cartSubtotal.textContent = `${totalSum.toFixed(2)} €`;
  cartTotal.textContent = `${totalSum.toFixed(2)} €`;
}

function syncHeaderBadge() {
  import('./updateCartCount.js').then(module => {
    module.updateHeaderCartCount();
  });
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

async function handleCheckoutClick() {
  const isUserLoggedIn = btnCheckout.getAttribute('data-authenticated') === 'true'; 

  if (!isUserLoggedIn) {
    authWarning.classList.remove('hidden');
    authWarning.scrollIntoView({ behavior: 'smooth', block: 'center' });
    return;
  }

  try {
    const rawCarrito = JSON.parse(localStorage.getItem('carrito') || '[]');

    if (rawCarrito.length === 0) {
      alert("Tu cesta está vacía.");
      return;
    }

    // Проверка остатков перед перенаправлением на оплату
    const itemIds = rawCarrito.map(i => i.id);
    const { data: dbProducts } = await supabase
      .from('products')
      .select('pk_producto, stock')
      .in('pk_producto', itemIds);

    if (dbProducts) {
      for (const item of rawCarrito) {
        const prod = dbProducts.find(p => Number(p.pk_producto) === Number(item.id));
        if (!prod || prod.stock < item.cantidad) {
          showStockModal();
          renderCartItems();
          return;
        }
      }
    }

    btnCheckout.textContent = "Redirigiendo a Stripe...";
    btnCheckout.setAttribute("disabled", "true");
    btnCheckout.classList.add('opacity-50', 'cursor-not-allowed');

    const response = await fetch("/api/crear-checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ items: rawCarrito }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Error al crear la sesión de pago");
    }

    if (data.url) {
      window.location.href = data.url;
    } else {
      throw new Error("No se recibió la URL de pago de Stripe.");
    }

  } catch (error) {
    console.error("Error en el pago:", error);
    alert("Hubo un error al procesar el pago: " + error.message);
    
    btnCheckout.textContent = "Proceder al pago";
    btnCheckout.removeAttribute("disabled");
    btnCheckout.classList.remove('opacity-50', 'cursor-not-allowed');
  }
}

document.addEventListener('DOMContentLoaded', initCartPage);
document.addEventListener('astro:page-load', initCartPage);