// src/lib/facturas.ts
import pool from './db';

interface DetalleItem {
  fk_producto: number;
  cantidad: number;
  precio_unitario: number;
}

export async function crearFactura(
  fkCliente: string, 
  items: DetalleItem[], 
  stripePaymentIntentId: string, 
  totalFactura: number
) {
  const client = await pool.connect();
  
  try {
    // Включаем режим транзакции для безопасности баланса
    await client.query('BEGIN');

    // 1. ЗАПРОС ДЛЯ ВАШЕЙ ТАБЛИЦЫ facturas:
    // Передаем статус 'pagado' строго маленькими буквами по вашему CHECK constraint
    const queryFactura = `
      INSERT INTO facturas (fk_cliente, stripe_payment_intent_id, iva, estado_pago, total_factura, fecha_compra) 
      VALUES ($1, $2, $3, $4, $5, NOW()) 
      RETURNING pk_factura
    `;
    
    const resFactura = await client.query(queryFactura, [
      fkCliente, 
      stripePaymentIntentId, 
      21.00, 
      'pagado', // ИСПРАВЛЕНО: строго маленькими буквами по вашему ТЗ
      totalFactura
    ]);
    const nuevoIdFactura = resFactura.rows[0].pk_factura;

    // 2. ЗАПРОС ДЛЯ ВАШЕЙ ТАБЛИЦЫ detalle_factura:
    // ИСПРАВЛЕНО: убрали поле precio_total, так как у вас оно GENERATED ALWAYS AS и база считает его сама!
    const queryDetalle = `
      INSERT INTO detalle_factura (fk_factura, fk_producto, cantidad, precio_unitario, descuento, iva) 
      VALUES ($1, $2, $3, $4, $5, $6)
    `;

    // 3. ЗАПРОС ДЛЯ ОБНОВЛЕНИЯ СТОКА В ТАБЛИЦЕ products
    const queryActualizarStock = `
      UPDATE products 
      SET stock = GREATEST(0, stock - $1) 
      WHERE pk_producto = $2
    `;

    for (const item of items) {
      // Записываем строку в детализацию чека без ручного ввода общей стоимости строки
      await client.query(queryDetalle, [
        nuevoIdFactura,
        item.fk_producto,
        item.cantidad,
        item.precio_unitario,
        0.00, // descuento по умолчанию
        21.00  // iva по умолчанию
      ]);

      // Списываем со склада в этой же транзакции
      await client.query(queryActualizarStock, [
        item.cantidad,
        item.fk_producto
      ]);
    }

    // Фиксируем транзакцию: теперь все правила CHECK и ограничения полностью соблюдены!
    await client.query('COMMIT');
    
    return { success: true, facturaId: nuevoIdFactura };

  } catch (error: any) {
    // В случае любой ошибки отменяем все изменения остатков и чеков
    await client.query('ROLLBACK'); 
    console.error("Error de SQL al crear la factura:", error.message);
    return { success: false, error: error.message };
  } finally {
    client.release();
  }
}

/**
 * ПОЛУЧЕНИЕ СЧЕТА (CRUD: Read) — 🌟 ПОЛНОСТЬЮ ВОССТАНОВЛЕНА НА МЕСТО
 * Извлекает шапку чека, данные покупателя и список всех товаров одним запросом через JOIN.
 */
export async function obtenerFactura(pkFactura: number) {
  try {
    const query = `
      SELECT 
        f.pk_factura,
        f.fecha_compra,
        c.nombres_cliente,
        c.apellido1_cliente,
        c.email,
        df.cantidad,
        df.precio_unitario,
        df.precio_total as total_linea,
        p.nombre_producto,
        p.url_imagen
      FROM facturas f
      JOIN clientes c ON f.fk_cliente = c.pk_cliente
      JOIN detalle_factura df ON f.pk_factura = df.fk_factura
      JOIN products p ON df.fk_producto = p.pk_producto
      WHERE f.pk_factura = $1
    `;

    const resultado = await pool.query(query, [pkFactura]);
    return resultado.rows.length > 0 ? resultado.rows : null;

  } catch (error: any) {
    console.error("Error de SQL al obtener la factura:", error.message);
    return null;
  }
}
