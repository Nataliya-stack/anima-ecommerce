// src/lib/email.ts
import { supabase } from './supabase'; // Чтобы подтянуть названия товаров для письма

interface EnviarEmailParams {
  emailCliente: string;
  nombreCliente: string;
  idFactura: number;
  total: number;
  items: Array<{ fk_producto: number; cantidad: number; precio_unitario: number }>; // Добавили массив товаров
}

/**
 * Отправляет официальное письмо-чек о покупке с детализацией товаров через API Brevo.
 */
export async function enviarCorreoConfirmacion({ emailCliente, nombreCliente, idFactura, total, items }: EnviarEmailParams) {
  const apiKey = import.meta.env.BREVO_API_KEY;

  if (!apiKey) {
    console.error("[⚠️ ОШИБКА BREVO]: BREVO_API_KEY no está configurado en .env");
    return;
  }

  try {
    // 1. Собираем строчки товаров в формате HTML
    let filasProductosHtml = '';
    
    for (const item of items) {
      // Ищем красивое название товара в Supabase по его ID
      const { data: dbProduct } = await supabase
        .from('products')
        .select('nombre_producto')
        .eq('pk_producto', item.fk_producto)
        .single();
        
      const nombreProducto = dbProduct ? dbProduct.nombre_producto : `Producto #${item.fk_producto}`;
      const subtotalLinea = item.precio_unitario * item.cantidad;

      filasProductosHtml += `
        <tr style="border-b: 1px solid #eee; font-size: 13px; font-weight: 300;">
          <td style="padding: 10px 0; color: #333;">${nombreProducto} <span style="color: #999; font-size: 11px;">x${item.cantidad}</span></td>
          <td style="padding: 10px 0; text-align: right; font-family: monospace; color: #000;">${subtotalLinea.toFixed(2)} €</td>
        </tr>
      `;
    }

    // 2. Делаем вызов fetch к официальному API Brevo
    const response = await fetch('https://api.brevo.com/v3/smtp/email', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'api-key': apiKey,
        'content-type': 'application/json'
      },
      body: JSON.stringify({
        sender: { 
          name: "ÁNIMA Concept Store", 
          email: "contact@nataliyadev.com" 
        },
        to: [
          { email: emailCliente, name: nombreCliente }
        ],
        subject: `¡Muchas gracias por tu compra! — Pedido №${idFactura}`,
        htmlContent: `
          <div style="font-family: sans-serif; max-width: 500px; margin: 0 auto; padding: 40px; border: 1px solid #e5e5e5; color: #000; background-color: #fff;">
            <h1 style="font-size: 24px; font-weight: 300; text-transform: uppercase; letter-spacing: 0.2em; text-align: center; margin-bottom: 30px;">ÁNIMA</h1>
            <p style="font-size: 14px; font-weight: 300; line-height: 1.6; color: #555;">
              Hola, <strong>${nombreCliente}</strong>.<br><br>
              Queremos informarte que tu pago ha sido procesado correctamente. Tu factura oficial ha sido registrada con el número de pedido **№${idFactura}**.
            </p>
            
            <!-- 📦 ТАБЛИЦА С КУПЛЕННЫМИ ТОВАРАМИ -->
            <table style="w-full; border-collapse: collapse; margin: 25px 0;">
              <thead>
                <tr style="border-b: 2px solid #000; font-size: 11px; text-transform: uppercase; letter-spacing: 0.1em; color: #777; text-align: left;">
                  <th style="padding-bottom: 8px;">Concepto</th>
                  <th style="padding-bottom: 8px; text-align: right;">Importe</th>
                </tr>
              </thead>
              <tbody>
                ${filasProductosHtml}
              </tbody>
            </table>

            <div style="margin: 30px 0; padding: 20px; background-color: #f9f9f9; flex; justify-content: space-between; align-items: center;">
              <span style="font-size: 11px; text-transform: uppercase; letter-spacing: 0.15em; color: #888; text-align: left; display: inline-block;">Total Facturado (con IVA 21%)</span>
              <span style="font-size: 20px; font-weight: bold; font-family: monospace; float: right; display: inline-block;">${total.toFixed(2)} €</span>
              <div style="clear: both;"></div>
            </div>
            
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 40px; text-transform: uppercase; letter-spacing: 0.1em;">
              Gracias por confiar en ÁNIMA Concept Store.
            </p>
          </div>
        `
      })
    });

    if (!response.ok) {
      const errorData = await response.json();
      console.error("[🛑 ОШИБКА ОТ СЕРВЕРА BREVO]:", JSON.stringify(errorData));
      throw new Error(errorData.message || "Error al conectar con la API de Brevo");
    }

    console.log(`[Brevo] Email de confirmación enviado con éxito al pedido №${idFactura}`);

  } catch (error: any) {
    console.error("[⚠️ КРИТИЧЕСКАЯ ОШИБКА В ТЕРМИНАЛЕ Astro]:", error.message);
  }
}
