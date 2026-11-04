// src/pages/api/crear-checkout.ts
import type { APIRoute } from 'astro';
import { supabase } from '../../lib/supabase';
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
      // 1. Извлекаем ID (проверяем варианты ключей id и pk_producto) и приводим к числу
      const rawId = item.id ?? item.pk_producto;
      const productId = Number(rawId);

      if (!productId || isNaN(productId)) {
        console.error("Некорректный ID товара в корзине:", item);
        return new Response(JSON.stringify({ 
          error: `El ID del producto no es válido.` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 2. Делаем запрос к базе данных Supabase
      const { data: dbProduct, error: dbError } = await supabase
        .from('products')
        .select('stock, nombre_producto')
        .eq('pk_producto', productId)
        .single();

      if (dbError || !dbProduct) {
        console.error(`Товар с pk_producto = ${productId} не найден:`, dbError);
        return new Response(JSON.stringify({ 
          error: `El producto no fue encontrado en el catálogo.` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }

      // 3. Сравниваем количества, приводя обе стороны к Числу (Number)
      const stockDisponible = Number(dbProduct.stock ?? 0);
      const cantidadSolicitada = Number(item.cantidad ?? item.quantity ?? 1);

      if (cantidadSolicitada > stockDisponible) {
        return new Response(JSON.stringify({ 
          error: `Lo sentimos, solo quedan ${stockDisponible} unidades de "${dbProduct.nombre_producto}". Por favor, reduce la cantidad en la cesta.` 
        }), {
          status: 400,
          headers: { 'Content-Type': 'application/json' },
        });
      }
    }

    // 4. Мапим продукты для Stripe
    const lineItems = items.map((item: any) => ({
      price_data: {
        currency: 'eur',
        product_data: {
          name: item.nombre,
        },
        unit_amount: Math.round(parseFloat(item.precio) * 100), // Stripe принимает в центах
      },
      quantity: Number(item.cantidad ?? item.quantity ?? 1),
    }));

    // 5. Создаем сессию Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      line_items: lineItems,
      mode: 'payment',
      success_url: `${new URL(request.url).origin}/exito?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${new URL(request.url).origin}/cart`,
      metadata: {
        userId: userId,
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