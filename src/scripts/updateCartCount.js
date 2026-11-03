
export function updateHeaderCartCount() {
  // Просто отправляем сигнал для React-компонента, он сам всё пересчитает
  window.dispatchEvent(new Event('cart-updated'));
  
  // Оставляем ваш старый код для совместимости, если где-то на других страницах остались старые элементы
  const carrito = JSON.parse(localStorage.getItem('carrito') || '[]');
  const totalItems = carrito.reduce((sum, item) => sum + item.cantidad, 0);
  const countBadges = document.querySelectorAll('.cart-count'); // используем querySelectorAll для всех бейджей
  
  countBadges.forEach(badge => {
    badge.textContent = totalItems.toString();
  });
}

document.addEventListener('DOMContentLoaded', updateHeaderCartCount);
document.addEventListener('astro:page-load', updateHeaderCartCount);
