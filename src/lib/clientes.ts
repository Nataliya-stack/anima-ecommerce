// src/lib/clientes.ts
import pool from './db';

/**
 * Находит профиль клиента в базе данных PostgreSQL по его UUID
 * @param pkCliente — Строка UUID клиента
 */
export async function obtenerDatosCliente(pkCliente: string) {
  try {
    // Делаем прямой запрос к вашей таблице клиентов через пул pg
    const resultado = await pool.query(
      'SELECT * FROM clientes WHERE pk_cliente = $1',
      [pkCliente]
    );
    
    // Если клиент найден в базе, возвращаем объект с его данными (первую строку), иначе null
    return resultado.rows.length > 0 ? resultado.rows[0] : null;
    
  } catch (error: any) {
    console.error("Error de SQL al obtener datos del cliente:", error.message);
    return null; 
  }
}
/**
 * Находит профиль клиента в базе данных PostgreSQL по его email
 * @param email — Строка электронной почты (например: dayvip12369@gmail.com)
 */
export async function obtenerClientePorEmail(email: string) {
  try {
    const resultado = await pool.query(
      'SELECT * FROM clientes WHERE email = $1',
      [email]
    );
    
    return resultado.rows.length > 0 ? resultado.rows[0] : null;
  } catch (error: any) {
    console.error("Error de SQL al obtener cliente por Email:", error.message);
    return null;
  }
}
