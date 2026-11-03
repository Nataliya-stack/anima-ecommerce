// src/pages/api/auth/callback.ts
import type { APIRoute } from 'astro';
import { supabase } from '@/lib/supabase';

export const GET: APIRoute = async ({ url, cookies, redirect }) => {
  // 1. Извлекаем проверочный код (authCode), который Google прислал в адресную строку
  const authCode = url.searchParams.get('code');

  if (!authCode) {
    return new Response('No auth code provided', { status: 400 });
  }

  // 2. Отправляем этот код в Supabase в обмен на настоящую сессию пользователя
  const { data, error } = await supabase.auth.exchangeCodeForSession(authCode);

  if (error) {
    return new Response(error.message, { status: 500 });
  }

  // 3. Достаем из сессии токены доступа
  const { access_token, refresh_token } = data.session;

  // 4. Записываем токены в безопасные Cookies браузера (httpOnly защищает их от кражи хакерами)
  cookies.set('sb-access-token', access_token, { path: '/', httpOnly: true, secure: true });
  cookies.set('sb-refresh-token', refresh_token, { path: '/', httpOnly: true, secure: true });

  // 5. Возвращаем пользователя на главную страницу — теперь он официально авторизован!
  return redirect('/');
};
