// src/pages/api/crear-checkout.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase'; // Проверьте этот путь до вашего файла supabase.ts
import Stripe from 'stripe';

const stripe = new Stripe(import.meta.env.STRIPE_SECRET_KEY);

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    // 1. Проверяем сессию пользователя прямо на сервере из cookies
    const accessToken = cookies.get('sb-access-token');
    const refreshToken = cookies.get('sb-refresh-token');

    let userId = null;

    if (accessToken && refreshToken) {
      const { data } = await supabase.auth.setSession({
        access_token: accessToken.value,
        refresh_token: refreshToken.value,
      });
      if (data.user) {
        userId = data.user.id;
      }
    }

    // 2. Если пользователь не авторизован, отклоняем запрос
    if (!userId) {
      return new Response(JSON.stringify({ error: 'No autorizado. Debes iniciar sesión para comprar.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 3. Читаем продукты, которые прислал клиентский скрипт корзины
    const body = await request.json();
    const items = body.items;

    if (!items || items.length === 0) {
      return new Response(JSON.stringify({ error: 'El carrito está vacío' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // 🌟 ФИНАЛЬНЫЙ РУБЕЖ ЗАЩИТЫ: Проверяем сток в базе данных прямо перед оплатой
    for (const item of items) {
      const { data: dbProduct } = await supabase
        .from('products')
        .select('stock, nombre_producto')
        .eq('pk_producto', item.id)
        .single();

      if (dbProduct && item.cantidad > dbProduct.stock) {
        return new Response(JSON.stringify({ 
          error: `Lo sentimos, solo quedan ${dbProduct.stock} unidades de "${dbProduct.nombre_producto}". Пожалуйста, уменьшите количество в корзине.` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 4. Мапим продукты для Stripe (Исправлено строго под ваши ключи: id, nombre, precio)
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.nombre, // У вас поле называется nombre
        },
        unit_amount: Math.round(parseFloat(item.precio) * 100), // Stripe принимает в центах
      },
      quantity: item.cantidad || 1,
    }));

    // 5. Создаем сессию Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      // Перенаправление в случае успеха на страницу /exito
      success_url: `${new URL(request.url).origin}/exito?session_id={CHECKOUT_SESSION_ID}`,
      // Исправлено: перенаправление при отмене на вашу реальную страницу /cart вместо /carrito
      cancel_url: `${new URL(request.url).origin}/cart`,
      metadata: {
        userId: userId, // Передаем ID пользователя в скрытые метаданные Stripe
      },
    });

    return new Response(JSON.stringify({ url: session.url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });

  } catch (error: any) {
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
