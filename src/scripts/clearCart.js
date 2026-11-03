// src/scripts/clearCart.js

// Находим наш контейнер на странице
const statusContainer = document.getElementById('payment-status-container');

// Считываем статус успеха, который передал сервер Astro
const isSuccess = statusContainer?.getAttribute('data-success') === 'true';

// Очищаем корзину только если оплата действительно прошла успешно
if (isSuccess) {
  localStorage.removeItem('carrito');
  window.dispatchEvent(new Event('cart-updated')); // Обнуляем React-шарик
  console.log("Cesta vaciada con éxito tras el pago exitoso.");
}
