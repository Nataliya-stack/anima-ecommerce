// src/lib/productos.ts
import pool from './db'; // Подключаем наш пул соединений PostgreSQL

/**
 * Функция для получения товаров, отфильтрованных по категории через чистый SQL
 * @param fkCategoria — ЧИСЛОВОЙ идентификатор категории (например: 1, 2, 3...)
 */
export async function obtenerProductosPorCategoria(fkCategoria: number) { // ИЗМЕНЕНО: тип number вместо string
  try {
    // ИЗМЕНЕНО: убран LIMIT 10 и добавлена сортировка по ID, чтобы выводить все 50 товаров по порядку
    const resultado = await pool.query(
      'SELECT * FROM products WHERE fk_categoria = $1 ORDER BY pk_producto ASC',
      [fkCategoria]
    );
    return resultado.rows; 
  } catch (error: any) {
    console.error("Error de SQL al obtener productos:", error.message);
    return []; 
  }
}

/**
 * Функция для получения подробной информации об ОДНОМ конкретном товаре по его ID
 * @param pkProducto — ЧИСЛОВОЙ ID товара (например: 1, 2, 17...)
 */
export async function obtenerProductoPorId(pkProducto: number) { // ИЗМЕНЕНО: тип number вместо string
  try {
    const resultado = await pool.query(
      'SELECT * FROM products WHERE pk_producto = $1',
      [pkProducto]
    );
    
    // Если товар найден, возвращаем первую строку из массива результатов, иначе null
    return resultado.rows.length > 0 ? resultado.rows[0] : null;
    
  } catch (error: any) {
    console.error("Error de SQL al obtener producto por ID:", error.message);
    return null;
  }
}

 
export async function obtenerProductosOutlet() {
  try {
    const resultado = await pool.query(
      'SELECT * FROM products WHERE descuento > 0 ORDER BY pk_producto ASC'
    );
    return resultado.rows;
  } catch (error: any) {
    console.error("Error de SQL al obtener productos de Outlet:", error.message);
    return [];
  }
}
