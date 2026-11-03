// src/pages/api/soporte.ts
import type { APIRoute } from 'astro';
import pool from '@/lib/db';

export const POST: APIRoute = async ({ request, redirect }) => {
  try {
    const formData = await request.formData();
    
    const nombre = formData.get('nombre')?.toString() || '';
    const apellidos = formData.get('apellidos')?.toString() || '';
    const direccion = formData.get('direccion')?.toString() || '';
    const poblacion = formData.get('poblacion')?.toString() || '';
    const codigo_postal = formData.get('codigo_postal')?.toString() || '';
    const provincia = formData.get('provincia')?.toString() || '';
    const email = formData.get('email')?.toString() || '';
    const telefono = formData.get('telefono')?.toString() || '';
    const modelo = formData.get('modelo')?.toString() || '';
    const numero_serie = formData.get('numero_serie')?.toString() || '';
    const fecha_compra = formData.get('fecha_compra')?.toString() || '';
    const mensaje = formData.get('mensaje')?.toString() || '';

    // 1. Безопасная запись заявки в Supabase через нативный PostgreSQL
    const textQuery = `
      INSERT INTO solicitudes_soporte (
        nombre, apellidos, direccion, poblacion, codigo_postal, 
        provincia, email, telefono, modelo, numero_serie, fecha_compra, mensaje
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);
    `;
    
    const values = [
      nombre, apellidos, direccion, poblacion, codigo_postal, 
      provincia, email, telefono, modelo, numero_serie, fecha_compra, mensaje
    ];

    await pool.query(textQuery, values);

    // 2. Отправка полноценного email-письма администратору через Brevo SMTP
    await notificarPorEmail(email, {
      nombre, apellidos, direccion, poblacion, codigo_postal,
      provincia, telefono, modelo, numero_serie, fecha_compra, mensaje
    });

    // После успешной отправки возвращаем пользователя на страницу с параметром успеха
    return redirect('/asistencia-tecnica?success=true');

  } catch (err: any) {
    console.error('Error en soporte API:', err.message);
    return new Response(`Error procesando la solicitud: ${err.message}`, { status: 500 });
  }
};

// Функция отправки письма через официальный транзакционный шлюз Brevo
async function notificarPorEmail(clientEmail: string, data: any) {
  const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return;

  await fetch('https://brevo.com', {
    method: 'POST',
    headers: {
      'accept': 'application/json',
      'content-type': 'application/json',
      'api-key': BREVO_API_KEY,
    },
    body: JSON.stringify({
      sender: { name: "ÁNIMA Soporte", email: "no-reply@anima-store.com" },
      to: [{ email: "nataliya.yanovic@gmail.com", name: "Administrador ÁNIMA" }], // Сюда прилетит готовое письмо
      subject: `Nueva solicitud de Asistencia Técnica - ${data.modelo}`,
      htmlContent: `
        <h3>Nueva solicitud de soporte técnico recibida:</h3>
        <p><strong>Cliente:</strong> ${data.nombre} ${data.apellidos}</p>
        <p><strong>Email:</strong> ${clientEmail}</p>
        <p><strong>Teléfono:</strong> ${data.telefono}</p>
        <p><strong>Dirección:</strong> ${data.direccion}, ${data.poblacion} (${data.codigo_postal}), ${data.provincia}</p>
        <hr/>
        <p><strong>Electrodoméstico:</strong> ${data.modelo}</p>
        <p><strong>Número de Serie:</strong> ${data.numero_serie}</p>
        <p><strong>Fecha de Compra:</strong> ${data.fecha_compra}</p>
        <hr/>
        <p><strong>Mensaje del cliente:</strong></p>
        <p>${data.mensaje}</p>
      `
    }),
  });
}
