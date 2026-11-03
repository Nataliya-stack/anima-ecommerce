// src/pages/api/auth/signout.ts
import type { APIRoute } from 'astro';

export const POST: APIRoute = async ({ cookies, redirect }) => {
  // Полностью удаляем токены авторизации из Cookies браузера
  cookies.delete('sb-access-token', { path: '/' });
  cookies.delete('sb-refresh-token', { path: '/' });

  // Перенаправляем пользователя на главную страницу уже как гостя
  return redirect('/');
};
