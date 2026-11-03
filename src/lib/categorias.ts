// src/lib/categorias.ts
import pool from './db';

export interface Categoria {
  pk_categoria: number;       
  nom_categoria: string;
  descripcion_categoria?: string; 
}

let categoriasCache: Categoria[] | null = null;

export async function getCategorias(): Promise<Categoria[]> {
  if (categoriasCache !== null) {
    return categoriasCache;
  }

  try {
    const { rows } = await pool.query<Categoria>(
      'SELECT pk_categoria, nom_categoria FROM categories ORDER BY pk_categoria ASC'
    );

    categoriasCache = rows;
    return categoriasCache;
  } catch (error) {
    console.error("Error consultando categorías en Supabase:", error);
    categoriasCache = [];
    return categoriasCache;
  }
}
