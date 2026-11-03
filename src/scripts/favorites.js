// src/scripts/favorites.js
import { supabase } from '../lib/supabase';

function initWishlist() {
  // 1. Инициализация кнопок-сердечек (на странице товара или в каталоге)
  const buttons = document.querySelectorAll('.wishlist-btn');
  
  buttons.forEach(btn => {
    const productId = String(btn.getAttribute('data-id') || '').trim();
    const icon = btn.querySelector('.wishlist-icon');
    
    if (!productId || !icon) return;
    
    let wishlist = JSON.parse(localStorage.getItem('anima_wishlist') || '[]').map(String);
    
    // Проверяем, есть ли товар в избранном при загрузке
    if (wishlist.includes(productId)) {
      icon.setAttribute('fill', 'currentColor');
      btn.classList.add('text-red-600');
    } else {
      icon.setAttribute('fill', 'none');
      btn.classList.remove('text-red-600');
    }

    // Обработчик клика по сердечку
    btn.onclick = (e) => {
      e.preventDefault();
      e.stopPropagation();
      
      let currentWishlist = JSON.parse(localStorage.getItem('anima_wishlist') || '[]').map(String);
      
      if (currentWishlist.includes(productId)) {
        currentWishlist = currentWishlist.filter(id => id !== productId);
        icon.setAttribute('fill', 'none');
        btn.classList.remove('text-red-600');
      } else {
        currentWishlist.push(productId);
        icon.setAttribute('fill', 'currentColor');
        btn.classList.add('text-red-600');
      }
      
      localStorage.setItem('anima_wishlist', JSON.stringify(currentWishlist));
    };
  });

  // 2. Рендеринг карточек на странице /favorites (если мы находимся на ней)
  const container = document.getElementById('favorites-container');
  const emptyState = document.getElementById('favorites-empty');

  if (container && emptyState) {
    renderFavoritesList(container, emptyState);
  }
}

async function renderFavoritesList(container, emptyState) {
  const wishlist = JSON.parse(localStorage.getItem('anima_wishlist') || '[]').map(String);

  if (wishlist.length === 0) {
    container.classList.add('hidden');
    container.classList.remove('grid');
    emptyState.classList.remove('hidden');
    return;
  }

  try {
    const numericIds = wishlist.map(id => Number(id)).filter(id => !isNaN(id));

    const { data: products, error } = await supabase
      .from('products')
      .select('*')
      .in('pk_producto', numericIds);

    if (error) throw error;

    if (!products || products.length === 0) {
      container.classList.add('hidden');
      container.classList.remove('grid');
      emptyState.classList.remove('hidden');
      return;
    }

    emptyState.classList.add('hidden');
    container.classList.remove('hidden');
    container.classList.add('grid');

    let htmlContent = '';

    products.forEach(product => {
      htmlContent += `
        <div class="bg-white border border-neutral-100 rounded-3xl p-6 flex flex-col justify-between space-y-4 relative shadow-xs">
          
          <!-- Кнопка удаления из избранного -->
          <button 
            data-id="${product.pk_producto}"
            class="btn-remove-favorite absolute top-6 right-6 text-red-600 hover:text-neutral-400 transition-colors cursor-pointer p-2"
            aria-label="Quitar de favoritos"
          >
            <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
              <path d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
            </svg>
          </button>

          <!-- Картинка -->
          <a href="/product/${product.pk_producto}" class="aspect-square bg-neutral-50 rounded-2xl p-6 flex items-center justify-center overflow-hidden">
            <img src="${product.url_imagen}" alt="${product.nombre_producto}" class="max-h-full max-w-full object-contain mix-blend-multiply" />
          </a>

          <!-- Название и цена -->
          <div class="space-y-2 text-left">
            <h3 class="text-lg font-bold text-neutral-900 tracking-tight leading-snug">
              ${product.nombre_producto}
            </h3>
            <p class="text-sm font-mono font-bold text-neutral-900">
              ${Number(product.precio).toFixed(2)} €
            </p>
          </div>

          <!-- Ссылка на товар -->
          <a 
            href="/product/${product.pk_producto}" 
            class="w-full bg-black text-white text-center text-xs uppercase font-bold tracking-widest py-3 px-6 rounded-full hover:bg-neutral-800 transition-colors block"
          >
            Ver producto
          </a>

        </div>
      `;
    });

    container.innerHTML = htmlContent;

    // Обработка удаления прямо со страницы избранного
    container.querySelectorAll('.btn-remove-favorite').forEach(btn => {
      btn.onclick = (e) => {
        const idToRemove = String(e.currentTarget.getAttribute('data-id'));
        let current = JSON.parse(localStorage.getItem('anima_wishlist') || '[]').map(String);
        current = current.filter(id => id !== idToRemove);
        localStorage.setItem('anima_wishlist', JSON.stringify(current));
        renderFavoritesList(container, emptyState);
      };
    });

  } catch (err) {
    console.error('Error al cargar favoritos:', err);
  }
}

document.addEventListener('DOMContentLoaded', initWishlist);
document.addEventListener('astro:page-load', initWishlist);