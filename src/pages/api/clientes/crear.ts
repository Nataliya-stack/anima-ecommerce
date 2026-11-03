// src/pages/api/clientes/crear.ts
import type { APIRoute } from 'astro';
import pool from '../../../lib/db';
import { supabase } from '@/lib/supabase';

export const POST: APIRoute = async ({ request, cookies, redirect }) => {
  const formData = await request.formData();
  
  const nombre = formData.get('nombre')?.toString() || '';
  const apellido1 = formData.get('apellido1')?.toString() || '';
  const apellido2 = formData.get('apellido2')?.toString() || null;
  const telefono = formData.get('telefono')?.toString() || '';
  const enviarBrevo = formData.get('enviar-brevo')?.toString() === 'true';

  // 1. Проверяем активную сессию пользователя по Cookies
  const accessToken = cookies.get('sb-access-token');
  const refreshToken = cookies.get('sb-refresh-token');

  if (!accessToken || !refreshToken) {
    return new Response('No autorizado', { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.setSession({
    access_token: accessToken.value,
    refresh_token: refreshToken.value,
  });

  if (authError || !user) {
    return new Response('Sesión inválida', { status: 401 });
  }

  // 2. УМНЫЙ SQL-ЗАПРОС: ПРОВЕРЯЕМ КОНФЛИКТ ПО EMAIL ДЛЯ СКЛЕЙКИ ПРОФИЛЕЙ
  const textQuery = `
    INSERT INTO clientes (pk_cliente, email, nombres_cliente, apellido1_cliente, apellido2_cliente, telefono_movil, tipo, rol)
    VALUES ($1, $2, $3, $4, $5, $6, 'particular', 'cliente')
    ON CONFLICT (email) DO UPDATE 
    SET pk_cliente = EXCLUDED.pk_cliente,
        nombres_cliente = EXCLUDED.nombres_cliente, 
        apellido1_cliente = EXCLUDED.apellido1_cliente,
        apellido2_cliente = EXCLUDED.apellido2_cliente,
        telefono_movil = EXCLUDED.telefono_movil;
  `;
  
  const values = [user.id, user.email, nombre, apellido1, apellido2, telefono];

  try {
    await pool.query(textQuery, values);
  } catch (err: any) {
    console.error('Error de SQL в эндпоинте создания клиента:', err.message);
    return new Response(`Error en Base de Datos: ${err.message}`, { status: 500 });
  }

  if (enviarBrevo && user.email) {
    const nombreCompleto = apellido2 ? `${nombre} ${apellido1} ${apellido2}` : `${nombre} ${apellido1}`;
    await enviarABrevo(user.email, nombreCompleto, telefono);
  }

  return redirect('/login');
};

async function enviarABrevo(email: string, nombreCompleto: string, telefono: string) {
  const BREVO_API_KEY = import.meta.env.BREVO_API_KEY;
  if (!BREVO_API_KEY) return;

  try {
    await fetch('https://api.brevo.com/v3/contacts', {
      method: 'POST',
      headers: {
        'accept': 'application/json',
        'content-type': 'application/json',
        'api-key': BREVO_API_KEY,
      },
      body: JSON.stringify({
        email: email,
        attributes: { NOMBRE: nombreCompleto, TELEFONO: telefono },
        updateEnabled: true,
      }),
    });
  } catch (error) {
    console.error('Error Brevo:', error);
  }
}
