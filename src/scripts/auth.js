// src/scripts/auth.js
import { supabase } from '../lib/supabase';

// 1. Клик по кнопке Google
const loginBtn = document.getElementById('login-btn');
loginBtn?.addEventListener('click', async () => {
  await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/login`,
    },
  });
});

// 2. Отслеживание состояния сессии
supabase.auth.onAuthStateChange(async (event, session) => {
  if (session) {
    const maxAge = 60 * 60 * 24 * 7; // 7 дней
    document.cookie = `sb-access-token=${session.access_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `sb-refresh-token=${session.refresh_token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    
    // Если кнопка входа еще есть на странице (т.е. сервер Astro еще не успел отрисовать кабинет)
    if (document.getElementById('login-btn')) {
      const urlParams = new URLSearchParams(window.location.search);
      const redirectTarget = urlParams.get('redirect');
      
      if (redirectTarget) {
        // Если летели с покупки/корзины — возвращаем в корзину
        window.location.href = redirectTarget;
      } else {
        // Перезагружаем /login, чтобы сервер Astro с рабочей кукой сразу вывел "¡HOLA!" и "MIS PEDIDOS"!
        window.location.href = '/login';
      }
    }
  } else if (event === 'SIGNED_OUT') {
    // Очищаем куки в браузере при выходе
    document.cookie = 'sb-access-token=; path=/; max-age=0; path=/';
    document.cookie = 'sb-refresh-token=; path=/; max-age=0; path=/';
  }
});

// 3. Страховка для формы выхода (Cerrar Sesión)
const signoutForm = document.querySelector('form[action="/api/auth/signout"]');
signoutForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  await supabase.auth.signOut();
  signoutForm.submit();
});

// 4. Проверка активного пользователя в консоли
async function checkUser() {
  const { data: { user } } = await supabase.auth.getUser();
  if (user) {
    console.log('ID del usuario activo en cliente:', user.id);
  }
}
checkUser();