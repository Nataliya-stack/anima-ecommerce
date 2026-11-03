-- ========================================================
-- TABLA: categories
-- ========================================================

-- 1. Crear la estructura con clave primaria numérica (SERIAL)
CREATE TABLE categories (
  pk_categoria SERIAL PRIMARY KEY,
  nom_categoria VARCHAR(100) NOT NULL,
  descripcion_categoria TEXT,
  fecha_creacion TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inserción de registros fila por fila (DML)
INSERT INTO categories (pk_categoria, nom_categoria, descripcion_categoria) VALUES (1, 'Cocina y Cocción', 'Electrodomésticos premium para la preparación térmica de alimentos y lavado de vajilla.');
INSERT INTO categories (pk_categoria, nom_categoria, descripcion_categoria) VALUES (2, 'Pequeños Electrodomésticos', 'Pequeños aparatos de cocina funcionales y de diseño para el día a día.');
INSERT INTO categories (pk_categoria, nom_categoria, descripcion_categoria) VALUES (3, 'Cuidado del Hogar y Lavandería', 'Grandes y pequeños aparatos para la conservación de alimentos y el cuidado de la ropa.');
INSERT INTO categories (pk_categoria, nom_categoria, descripcion_categoria) VALUES (4, 'Clima, Confort y Limpieza', 'Dispositivos inteligentes para la climatización, purificación y limpieza inteligente del hogar.');
INSERT INTO categories (pk_categoria, nom_categoria, descripcion_categoria) VALUES (5, 'Imagen, Sonido y Domótica', 'Sistemas de entretenimiento premium, audio de alta fidelidad y control del hogar conectado.');

-- ========================================================
-- TABLA: products
-- ========================================================

-- 1. Crear la estructura con clave primaria numérica (SERIAL) y restricciones
CREATE TABLE products (
  pk_producto SERIAL PRIMARY KEY,                      -- ID único del producto
  fk_categoria INT NOT NULL,                           -- ID de la categoría (Relación)
  nombre_producto VARCHAR(150) NOT NULL,               -- Nombre comercial del producto
  url_imagen TEXT NOT NULL,                            -- Imagen principal
  url_imagenes_all TEXT[],                             -- Array de imágenes secundarias
  descripcion_producto TEXT,                           -- Descripción de marketing
  precio NUMERIC(10,2) NOT NULL,                       -- Precio en euros
  iva NUMERIC(4,2) DEFAULT 21.00,                      -- IVA aplicado (21% por defecto)
  descuento NUMERIC(4,2) DEFAULT 0.00,                 -- Porcentaje de descuento
  stock INT DEFAULT 15,                                -- Unidades disponibles
  punto_reposicion INT DEFAULT 3,                      -- Stock mínimo para pedido de reposición
  type VARCHAR(20) CHECK (type IN ('gran', 'pequeno')), -- Tipo de electrodoméstico
  subcategoria_id VARCHAR(50),                         -- Identificador de subcategoría
  is_trend BOOLEAN DEFAULT FALSE,                      -- Destacado en tendencias
  eficiencia_energetica VARCHAR(10) DEFAULT 'A',       -- Clasificación energética
  material_acabado VARCHAR(100) DEFAULT 'Acero',       -- Material o acabado estético
  tipo_instalacion VARCHAR(100) DEFAULT 'Encastrable', -- Tipo de montaje o instalación
  dimensiones VARCHAR(100),                            -- Medidas del aparato
  potencia VARCHAR(50),                                -- Potencia de consumo
  fecha_creacion TIMESTAMPTZ DEFAULT NOW(),
  fecha_baja TIMESTAMPTZ DEFAULT NULL
);

-- 2. Añadir la relación de clave foránea (Foreign Key)
ALTER TABLE products
ADD CONSTRAINT categories_products
FOREIGN KEY (fk_categoria) REFERENCES categories(pk_categoria)
ON UPDATE CASCADE
ON DELETE CASCADE;

-- 3. Inserción de registros fila por fila (DML)
INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(1, 1, 'placas', 'gran', 'Placa de Inducción Flexible ÁNIMA Touch', 549.00, 'Placa de inducción de 4 zonas con puente flexible para recipientes grandes y control táctil deslizante.', '/images/products/p1-1.jpg', ARRAY['/images/products/p1-2.jpg', '/images/products/p1-3.jpg', '/images/products/p1-4.jpg', '/images/products/p1-5.jpg'], 21.00, 0.00, 12, 3, 'A+++', 'Cristal negro', 'Encastrable', '59.0 x 52.0 x 5.1 cm', '7400W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(2, 1, 'hornos', 'gran', 'Horno Pirolítico Encastrable ÁNIMA Elite', 899.00, 'Horno multifunción avanzado con acabado en acero inoxidable cepillado y sistema de autolimpieza pirolítica.', '/images/products/p2-1.jpg', ARRAY['/images/products/p2-2.jpg', '/images/products/p2-3.jpg', '/images/products/p2-4.jpg', '/images/products/p2-5.jpg'], 21.00, 10.00, 8, 2, 'A+', 'Acero cepillado y cristal', 'Encastrable', '59.5 x 59.5 x 54.8 cm', '3650W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(3, 1, 'campanas', 'gran', 'Campana Extractora Decorativa ÁNIMA T-Shape', 380.00, 'Extractora de pared con motor inverter silencioso, alta capacidad de succión y luces LED regulables.', '/images/products/p3-1.jpg', ARRAY['/images/products/p3-2.jpg', '/images/products/p3-3.jpg', '/images/products/p3-4.jpg', '/images/products/p3-5.jpg'], 21.00, 0.00, 15, 4, 'A++', 'Acero inoxidable', 'Pared', '90.0 x 50.0 x 65.0 cm', '275W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(4, 1, 'microondas', 'gran', 'Microondas Encastrable ÁNIMA Grill+', 299.00, 'Microondas integrado con función grill, menús automáticos y cavidad interior de acero inoxidable.', '/images/products/p4-1.jpg', ARRAY['/images/products/p4-2.jpg', '/images/products/p4-3.jpg', '/images/products/p4-4.jpg', '/images/products/p4-5.jpg'], 21.00, 0.00, 20, 5, 'A', 'Cristal negro', 'Encastrable', '59.5 x 38.2 x 40.0 cm', '900W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(5, 1, 'multicookers', 'pequeno', 'Multicooker Inteligente ÁNIMA Chef', 189.00, 'Olla programable multifunción con control preciso de temperatura y 12 programas automáticos.', '/images/products/p5-1.jpg', ARRAY['/images/products/p5-2.jpg', '/images/products/p5-3.jpg', '/images/products/p5-4.jpg', '/images/products/p5-5.jpg'], 21.00, 5.00, 25, 6, 'A', 'Acero y plástico mate', 'Sobremesa', '38.0 x 28.0 x 25.0 cm', '1200W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(6, 1, 'lavavajillas', 'gran', 'Lavavajillas Integrable Total ÁNIMA Silence', 649.00, 'Lavavajillas totalmente oculto con tercera bandeja para cubiertos y proyección de luz informativa en el suelo.', '/images/products/p6-1.jpg', ARRAY['/images/products/p6-2.jpg', '/images/products/p6-3.jpg', '/images/products/p6-4.jpg', '/images/products/p6-5.jpg'], 21.00, 0.00, 10, 2, 'A+++', 'Panelable / Inox', 'Integrable total', '59.8 x 81.5 x 55.0 cm', '1900W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(7, 1, 'grills', 'pequeno', 'Grill Encastrable Salamandra ÁNIMA', 415.00, 'Grill profesional de cocina con altura regulable superior para gratinados perfectos y acabados de alta cocina.', '/images/products/p7-1.jpg', ARRAY['/images/products/p7-2.jpg', '/images/products/p7-3.jpg', '/images/products/p7-4.jpg', '/images/products/p7-5.jpg'], 21.00, 0.00, 6, 1, 'B', 'Acero inoxidable', 'Encastrable / Pared', '60.0 x 45.0 x 50.0 cm', '2000W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(8, 1, 'calentadores', 'gran', 'Cajón Calentador de Platos ÁNIMA', 270.00, 'Módulo integrable para mantener la vajilla, tazas y los platos preparados a la temperatura ideal de servicio.', '/images/products/p8-1.jpg', ARRAY['/images/products/p8-2.jpg', '/images/products/p8-3.jpg', '/images/products/p8-4.jpg', '/images/products/p8-5.jpg'], 21.00, 0.00, 14, 3, 'A', 'Acero cepillado', 'Encastrable', '59.5 x 14.0 x 54.0 cm', '400W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(9, 1, 'mini-hornos', 'pequeno', 'Mini Horno de Sobremesa ÁNIMA Compact', 149.00, 'Horno compacto de alto rendimiento ideal para encimeras, con tecnología de convección rápida y grill.', '/images/products/p9-1.jpg', ARRAY['/images/products/p9-2.jpg', '/images/products/p9-3.jpg', '/images/products/p9-4.jpg', '/images/products/p9-5.jpg'], 21.00, 0.00, 18, 4, 'A', 'Negro mate', 'Sobremesa', '50.0 x 40.0 x 35.0 cm', '1500W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(10, 1, 'abatidores', 'gran', 'Abatidor de Temperatura ÁNIMA BlastChill', 1250.00, 'Aparato de refrigeración y congelación ultra rápida para conservar al instante todas las propiedades de los alimentos.', '/images/products/p10-1.jpg', ARRAY['/images/products/p10-2.jpg', '/images/products/p10-3.jpg', '/images/products/p10-4.jpg', '/images/products/p10-5.jpg'], 21.00, 0.00, 4, 1, 'A++', 'Acero inoxidable', 'Encastrable', '59.5 x 45.5 x 55.0 cm', '1000W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(11, 2, 'cafeteras', 'pequeno', 'Cafetera Superautomática Café Élite', 620.00, 'Máquina de café con molinillo cerámico integrado, pantalla táctil intuitiva y espumador automático de leche.', '/images/products/p11-1.jpg', ARRAY['/images/products/p11-2.jpg', '/images/products/p11-3.jpg', '/images/products/p11-4.jpg', '/images/products/p11-5.jpg'], 21.00, 0.00, 22, 5, 'A', 'Acero e Inox', 'Sobremesa', '24.0 x 37.0 x 43.0 cm', '1450W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(12, 2, 'freidoras', 'pequeno', 'Freidora de Aire Digital ÁNIMA AirFryer', 119.00, 'Circulación de aire caliente a 360 grados de alta velocidad, panel digital táctil y cubeta antiadherente de gran capacidad.', '/images/products/p12-1.jpg', ARRAY['/images/products/p12-2.jpg', '/images/products/p12-3.jpg', '/images/products/p12-4.jpg', '/images/products/p12-5.jpg'], 21.00, 15.00, 40, 10, 'A+++', 'Negro y cromo', 'Sobremesa', '30.0 x 32.0 x 30.0 cm', '1700W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(13, 2, 'grills', 'pequeno', 'Grill Contacto Eléctrico ÁNIMA MasterGrill', 169.00, 'Grill eléctrico de alta potencia con placas desmontables aptas para lavavajillas y apertura total plana de 180 grados.', '/images/products/p13-1.jpg', ARRAY['/images/products/p13-2.jpg', '/images/products/p13-3.jpg', '/images/products/p13-4.jpg', '/images/products/p13-5.jpg'], 21.00, 0.00, 15, 3, 'A', 'Acero inoxidable', 'Sobremesa', '36.0 x 34.0 x 16.0 cm', '2000W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(14, 2, 'panificadoras', 'pequeno', 'Panificadora Automática ÁNIMA Bakery', 135.00, 'Máquina para la preparation automatizada de pan casero con dispensador de frutos secos y 15 programas esenciales.', '/images/products/p14-1.jpg', ARRAY['/images/products/p14-2.jpg', '/images/products/p14-3.jpg', '/images/products/p14-4.jpg', '/images/products/p14-5.jpg'], 21.00, 0.00, 11, 2, 'A', 'Acero inoxidable', 'Sobremesa', '41.0 x 27.0 x 30.0 cm', '650W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(15, 2, 'grills', 'pequeno', 'Multi-Baker 3 en 1 ÁNIMA', 129.00, 'Dispositivo universal de placas antiadherentes intercambiables de alta calidad para gofrera, sandwichera y minigrill.', '/images/products/p15-1.jpg', ARRAY['/images/products/p15-2.jpg', '/images/products/p15-3.jpg', '/images/products/p15-4.jpg', '/images/products/p15-5.jpg'], 21.00, 0.00, 30, 8, 'A', 'Plata y acero', 'Sobremesa', '26.0 x 24.0 x 11.0 cm', '900W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(16, 2, 'batidoras', 'pequeno', 'Batidora de Mano 3 en 1 ÁNIMA MixPro', 79.00, 'Batidora de inmersión de alta resistencia fabricada en acero inoxidable con accesorios de picadora y varillas.', '/images/products/p16-1.jpg', ARRAY['/images/products/p16-2.jpg', '/images/products/p16-3.jpg', '/images/products/p16-4.jpg', '/images/products/p16-5.jpg'], 21.00, 0.00, 45, 12, 'A', 'Acero y negro', 'Manual', '6.5 x 6.5 x 40.0 cm', '1000W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(17, 2, 'tostadoras', 'pequeno', 'Tostadora Premium de Doble Ranura ÁNIMA Toast', 59.00, 'Tostadora minimalista de ranura extra ancha, cuerpo completo de acero inoxidable y 7 niveles electrónicos de tostado.', '/images/products/p17-1.jpg', ARRAY['/images/products/p17-2.jpg', '/images/products/p17-3.jpg', '/images/products/p17-4.jpg', '/images/products/p17-5.jpg'], 21.00, 0.00, 50, 15, 'A', 'Acero pulido', 'Sobremesa', '29.0 x 18.0 x 19.0 cm', '850W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(18, 2, 'hervidores', 'pequeno', 'Hervidor de Agua con Filtro ÁNIMA Kettle', 49.00, 'Hervidor ultra rápido de acero inoxidable con control preciso de temperatura integrado y apagado automático.', '/images/products/p18-1.jpg', ARRAY['/images/products/p18-2.jpg', '/images/products/p18-3.jpg', '/images/products/p18-4.jpg', '/images/products/p18-5.jpg'], 21.00, 0.00, 35, 8, 'A+++', 'Acero pulido', 'Sobremesa', '22.0 x 15.0 x 24.0 cm', '2200W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(19, 2, 'licuadoras', 'pequeno', 'Licuadora de Prensado en Frío ÁNIMA Juice', 159.00, 'Extractor de jugos lento a bajas revoluciones que conserva intactas todas las vitaminas de frutas y verduras.', '/images/products/p19-1.jpg', ARRAY['/images/products/p19-2.jpg', '/images/products/p19-3.jpg', '/images/products/p19-4.jpg', '/images/products/p19-5.jpg'], 21.00, 0.00, 14, 3, 'A', 'Gris antracita', 'Sobremesa', '25.0 x 18.0 x 45.0 cm', '200W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(20, 2, 'robots-cocina', 'pequeno', 'Robot de Cocina Multifunción ÁNIMA Gourmet', 699.00, 'Estación de cocina inteligente y conectada que corta, amasa, cocina al vapor y cuenta con báscula integrada de precisión.', '/images/products/p20-1.jpg', ARRAY['/images/products/p20-2.jpg', '/images/products/p20-3.jpg', '/images/products/p20-4.jpg', '/images/products/p20-5.jpg'], 21.00, 10.00, 9, 2, 'A++', 'Blanco y acero', 'Sobremesa', '32.0 x 30.0 x 38.0 cm', '1500W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(21, 3, 'frigorificos', 'gran', 'Frigorífico French-Door ÁNIMA Absolute', 1850.00, 'Frigorífico de cuatro puertas de gran capacidad con tecnología No Frost Total, motor inverter y cajones húmedos.', '/images/products/p21-1.jpg', ARRAY['/images/products/p21-2.jpg', '/images/products/p21-3.jpg', '/images/products/p21-4.jpg', '/images/products/p21-5.jpg'], 21.00, 0.00, 5, 1, 'A+++', 'Acero inoxidable', 'Libre instalación', '91.2 x 72.3 x 178.5 cm', '450W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(22, 3, 'lavadoras', 'gran', 'Lavadora de Carga Frontal ÁNIMA Pro', 749.00, 'Lavadora inteligente de 9kg con motor silencioso Direct Drive, tecnología de autodosificación y lavado a vapor.', '/images/products/p22-1.jpg', ARRAY['/images/products/p22-2.jpg', '/images/products/p22-3.jpg', '/images/products/p22-4.jpg', '/images/products/p22-5.jpg'], 21.00, 0.00, 11, 2, 'A', 'Acero cepillado', 'Libre instalación', '60.0 x 56.5 x 85.0 cm', '2000W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(23, 3, 'secadoras', 'gran', 'Secadora de Bomba de Calor ÁNIMA EcoDry', 799.00, 'Secadora de máxima eficiencia con sensores de humedad avanzados que protegen los tejidos y minimizan las arrugas.', '/images/products/p23-1.jpg', ARRAY['/images/products/p23-2.jpg', '/images/products/p23-3.jpg', '/images/products/p23-4.jpg', '/images/products/p23-5.jpg'], 21.00, 5.00, 7, 2, 'A+++', 'Acero cepillado', 'Libre instalación', '60.0 x 60.0 x 85.0 cm', '900W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(24, 3, 'congeladores', 'gran', 'Congelador Vertical No Frost ÁNIMA Freeze', 680.00, 'Armario congelador independiente con cajones transparentes de gran formato y función de congelación rápida inteligente.', '/images/products/p24-1.jpg', ARRAY['/images/products/p24-2.jpg', '/images/products/p24-3.jpg', '/images/products/p24-4.jpg', '/images/products/p24-5.jpg'], 21.00, 0.00, 8, 2, 'A++', 'Acero inoxidable', 'Libre instalación', '59.5 x 65.0 x 185.0 cm', '250W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(25, 3, 'vinotecas', 'gran', 'Vinoteca Premium Encastrable ÁNIMA Sommelier', 599.00, 'Armario climatizado para vinos con dos zonas de temperatura independientes, baldas de madera y protección contra rayos UV.', '/images/products/p25-1.jpg', ARRAY['/images/products/p25-2.jpg', '/images/products/p25-3.jpg', '/images/products/p25-4.jpg', '/images/products/p25-5.jpg'], 21.00, 0.00, 12, 3, 'G', 'Cristal negro y madera', 'Encastrable', '59.5 x 45.5 x 56.0 cm', '120W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(26, 3, 'planchado', 'pequeno', 'Plancha de Vapor Ergonómica ÁNIMA Glide', 85.00, 'Plancha de mano premium con suela de cerámica multidireccional, golpe de vapor potente y doble sistema antical.', '/images/products/p26-1.jpg', ARRAY['/images/products/p26-2.jpg', '/images/products/p26-3.jpg', '/images/products/p26-4.jpg', '/images/products/p26-5.jpg'], 21.00, 0.00, 40, 10, 'A', 'Azul zafiro', 'Sobremesa', '30.0 x 13.0 x 15.0 cm', '2600W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(27, 3, 'planchado', 'gran', 'Sistema de Planchado Activo ÁNIMA IronPro', 450.00, 'Centro de planchado profesional de alta presión combinado con tabla activa con funciones de soplado y aspiración.', '/images/products/p27-1.jpg', ARRAY['/images/products/p27-2.jpg', '/images/products/p27-3.jpg', '/images/products/p27-4.jpg', '/images/products/p27-5.jpg'], 21.00, 0.00, 6, 1, 'A', 'Plata y negro', 'Libre instalación', '115.0 x 40.0 x 95.0 cm', '2200W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(28, 3, 'armarios-vapor', 'gran', 'Armario de Vapor Inteligente ÁNIMA Care', 1499.00, 'Sistema de armario avanzado que desodoriza, refresca, higieniza y elimina las arrugas de prendas delicadas mediante vapor.', '/images/products/p28-1.jpg', ARRAY['/images/products/p28-2.jpg', '/images/products/p28-3.jpg', '/images/products/p28-4.jpg', '/images/products/p28-5.jpg'], 21.00, 0.00, 3, 1, 'A+', 'Espejo oscuro', 'Libre instalación', '44.5 x 58.5 x 185.0 cm', '1700W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(29, 3, 'planchado', 'pequeno', 'Máquina de Coser Electrónica ÁNIMA Stitch', 249.00, 'Máquina de coser digital con pantalla LCD informativa, 40 patrones de puntadas preestablecidas y enhebrador asistido.', '/images/products/p29-1.jpg', ARRAY['/images/products/p29-2.jpg', '/images/products/p29-3.jpg', '/images/products/p29-4.jpg', '/images/products/p29-5.jpg'], 21.00, 0.00, 20, 4, 'A', 'Blanco minimalista', 'Sobremesa', '41.0 x 19.0 x 30.0 cm', '70W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(30, 3, 'shaving', 'pequeno', 'Quitapelusas Premium ÁNIMA FabricCare', 35.00, 'Dispositivo inalámbrico recargable de alta velocidad para eliminar pelusas sin dañar tejidos de punto.', '/images/products/p30-1.jpg', ARRAY['/images/products/p30-2.jpg', '/images/products/p30-3.jpg', '/images/products/p30-4.jpg', '/images/products/p30-5.jpg'], 21.00, 0.00, 60, 15, 'A', 'Gris y blanco', 'Manual', '12.0 x 8.0 x 6.0 cm', '5W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(31, 4, 'aspiradores', 'pequeno', 'Aspirador Vertical Sin Cable ÁNIMA Cyclone', 310.00, 'Aparato escoba inalámbrico superligero con motor digital ciclónico, cepillo motorizado LED y filtrado HEPA H13.', '/images/products/p31-1.jpg', ARRAY['/images/products/p31-2.jpg', '/images/products/p31-3.jpg', '/images/products/p31-4.jpg', '/images/products/p31-5.jpg'], 21.00, 0.00, 25, 5, 'A+++', 'Gris satinado', 'Fijación pared', '25.0 x 22.0 x 115.0 cm', '450W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(32, 4, 'aspiradores', 'pequeno', 'Robot Aspirador Inteligente ÁNIMA NaviBot', 450.00, 'Robot autónomo de limpieza con navegación láser LIDAR, estación de vaciado automático de residuos y mopa activa.', '/images/products/p32-1.jpg', ARRAY['/images/products/p32-2.jpg', '/images/products/p32-3.jpg', '/images/products/p32-4.jpg', '/images/products/p32-5.jpg'], 21.00, 0.00, 18, 4, 'A+++', 'Negro piano', 'Suelo / Base', '35.0 x 35.0 x 9.8 cm', '50W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(33, 4, 'aspiradores', 'pequeno', 'Aspirador de Vapor Multisuperficie ÁNIMA Steam', 229.00, 'Limpiador vertical híbrido 2 en 1 que combina la aspiración ciclónica y la desinfección total de suelos mediante vapor.', '/images/products/p33-1.jpg', ARRAY['/images/products/p33-2.jpg', '/images/products/p33-3.jpg', '/images/products/p33-4.jpg', '/images/products/p33-5.jpg'], 21.00, 10.00, 14, 3, 'A+', 'Negro y turquesa', 'Sobremesa', '28.0 x 25.0 x 110.0 cm', '1600W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(34, 4, 'aire-acondicionado', 'gran', 'Aire Acondicionado Split ÁNIMA Inverter', 649.00, 'Sistema fijo de climatización de pared con bomba de calor de alta eficiencia, WiFi y control inteligente de flujo.', '/images/products/p34-1.jpg', ARRAY['/images/products/p34-2.jpg', '/images/products/p34-3.jpg', '/images/products/p34-4.jpg', '/images/products/p34-5.jpg'], 21.00, 0.00, 20, 5, 'A+++', 'Blanco mate', 'Pared', '85.0 x 20.0 x 29.0 cm', '1050W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(35, 4, 'aire-acondicionado', 'gran', 'Aire Acondicionado Portátil ÁNIMA Mobile', 329.00, 'Climatizador portátil de alta capacidad con ruedas multidireccionales, deshumidificador integrado y modo noche silencioso.', '/images/products/p35-1.jpg', ARRAY['/images/products/p35-2.jpg', '/images/products/p35-3.jpg', '/images/products/p35-4.jpg', '/images/products/p35-5.jpg'], 21.00, 0.00, 15, 3, 'A+', 'Blanco brillante', 'Portátil', '45.0 x 35.0 x 75.0 cm', '1200W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(36, 4, 'purificadores', 'pequeno', 'Purificador y Humidificador ÁNIMA PureAir', 249.00, 'Purificador inteligente con sensores de calidad de aire en tiempo real, filtros de carbón activo True HEPA y modo purificación 360.', '/images/products/p36-1.jpg', ARRAY['/images/products/p36-2.jpg', '/images/products/p36-3.jpg', '/images/products/p36-4.jpg', '/images/products/p36-5.jpg'], 21.00, 0.00, 22, 4, 'A+++', 'Plástico ABS mate', 'Sobremesa / Suelo', '24.0 x 24.0 x 50.0 cm', '45W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(37, 4, 'deshumidificadores', 'pequeno', 'Deshumidificador Compacto ÁNIMA DryHome', 179.00, 'Controla la humedad ambiental de forma eficiente en estancias de hasta 30m2, ideal para prevenir condensaciones.', '/images/products/p37-1.jpg', ARRAY['/images/products/p37-2.jpg', '/images/products/p37-3.jpg', '/images/products/p37-4.jpg', '/images/products/p37-5.jpg'], 21.00, 0.00, 14, 3, 'A', 'Blanco y gris', 'Portátil', '35.0 x 22.0 x 55.0 cm', '280W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(38, 4, 'calefaccion', 'pequeno', 'Emisor Térmico Inteligente ÁNIMA Convector', 145.00, 'Radiador eléctrico de bajo consumo con paneles internos de aluminio de rápida respuesta y control programable vía App.', '/images/products/p38-1.jpg', ARRAY['/images/products/p38-2.jpg', '/images/products/p38-3.jpg', '/images/products/p38-4.jpg', '/images/products/p38-5.jpg'], 21.00, 0.00, 19, 4, 'A', 'Aluminio blanco', 'Suelo / Pared', '60.0 x 10.0 x 45.0 cm', '1500W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(39, 4, 'ventiladores', 'pequeno', 'Ventilador de Torre Sin Aspas ÁNIMA BladeFree', 120.00, 'Ventilador de design escultórico sin aspas, flujo de aire continuo ultra suave, oscilación automática y mando a distancia.', '/images/products/p39-1.jpg', ARRAY['/images/products/p39-2.jpg', '/images/products/p39-3.jpg', '/images/products/p39-4.jpg', '/images/products/p39-5.jpg'], 21.00, 0.00, 25, 5, 'A++', 'Plata metalizado', 'Suelo', '20.0 x 20.0 x 105.0 cm', '60W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(40, 4, 'limpiacristales', 'pequeno', 'Robot Limpiacristales ÁNIMA WinBot', 215.00, 'Dispositivo inteligente con potente ventosa de succión magnética que limpia ventanas, mamparas y azulejos de forma autónoma.', '/images/products/p40-1.jpg', ARRAY['/images/products/p40-2.jpg', '/images/products/p40-3.jpg', '/images/products/p40-4.jpg', '/images/products/p40-5.jpg'], 21.00, 10.00, 8, 2, 'A', 'Gris oscuro', 'Vertical', '24.0 x 24.0 x 8.5 cm', '75W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(41, 5, 'televisiones', 'gran', 'Smart TV QLED 4K ÁNIMA Vision X', 1299.00, 'Televisor premium de 65 pulgadas con panel QLED ultradelgado sin marcos, colores Quantum Dot realistas y modo Galería de arte.', '/images/products/p41-1.jpg', ARRAY['/images/products/p41-2.jpg', '/images/products/p41-3.jpg', '/images/products/p41-4.jpg', '/images/products/p41-5.jpg'], 21.00, 0.00, 10, 2, 'G', 'Aluminio cepillado', 'Suelo / Pared', '144.6 x 2.5 x 82.9 cm', '140W', true);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(42, 5, 'televisiones', 'gran', 'Televisor OLED 4K Master Cinema', 1999.00, 'Televisor de gama alta con píxeles autoiluminados, negros puros perfectos, procesador con IA y sonido Dolby Atmos envolvente.', '/images/products/p42-1.jpg', ARRAY['/images/products/p42-2.jpg', '/images/products/p42-3.jpg', '/images/products/p42-4.jpg', '/images/products/p42-5.jpg'], 21.00, 0.00, 6, 1, 'F', 'Cristal y titanio', 'Suelo / Pared', '122.2 x 1.9 x 70.3 cm', '110W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(43, 5, 'barras-sonido', 'pequeno', 'Barra de Sonido Inalámbrica ÁNIMA SoundBar Pro', 349.00, 'Sistema de audio compacto de 3.1 canales con subwoofer inalámbrico independiente y optimización acústica automática de sala.', '/images/products/p43-1.jpg', ARRAY['/images/products/p43-2.jpg', '/images/products/p43-3.jpg', '/images/products/p43-4.jpg', '/images/products/p43-5.jpg'], 21.00, 0.00, 18, 4, 'A', 'Rejilla metálica negra', 'Mesa / Pared', '95.0 x 8.0 x 6.0 cm', '360W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(44, 5, 'barras-sonido', 'pequeno', 'Home Cinema Premium AudioSphere', 799.00, 'Conjunto completo de altavoces de diseño satélite minimalista con conectividad inalámbrica Dolby Digital 5.1.', '/images/products/p44-1.jpg', ARRAY['/images/products/p44-2.jpg', '/images/products/p44-3.jpg', '/images/products/p44-4.jpg', '/images/products/p44-5.jpg'], 21.00, 5.00, 5, 1, 'A', 'Aluminio y tela acústica', 'Salón', '40.0 x 30.0 x 30.0 cm', '500W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(45, 5, 'proyectores', 'pequeno', 'Proyector Láser Corto Alcance ÁNIMA LaserCine', 1450.00, 'Proyector inteligente de tiro ultra corto capaz de proyectar un cine en casa de 100 pulgadas a pocos centímetros de la pared.', '/images/products/p45-1.jpg', ARRAY['/images/products/p45-2.jpg', '/images/products/p45-3.jpg', '/images/products/p45-4.jpg', '/images/products/p45-5.jpg'], 21.00, 0.00, 4, 1, 'A', 'Blanco texturizado', 'Mesa', '53.0 x 34.0 x 13.0 cm', '350W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(46, 5, 'proyectores', 'pequeno', 'Mini Proyector Portátil ÁNIMA PocketCast', 289.00, 'Proyector compacto con batería integrada y corrección trapezoidal automática, ideal para exteriores y streaming inalámbrico.', '/images/products/p46-1.jpg', ARRAY['/images/products/p46-2.jpg', '/images/products/p46-3.jpg', '/images/products/p46-4.jpg', '/images/products/p46-5.jpg'], 21.00, 0.00, 12, 3, 'A', 'Negro mate', 'Portátil', '11.0 x 10.4 x 16.0 cm', '65W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(47, 5, 'altavoces', 'pequeno', 'Altavoz Inteligente Multiroom ÁNIMA SoundOne', 159.00, 'Altavoz premium con control por voz integrado, sonido en alta fidelidad de 360 grados y emparejamiento estéreo por WiFi.', '/images/products/p47-1.jpg', ARRAY['/images/products/p47-2.jpg', '/images/products/p47-3.jpg', '/images/products/p47-4.jpg', '/images/products/p47-5.jpg'], 21.00, 0.00, 24, 6, 'A', 'Tejido gris oscuro', 'Sobremesa', '14.0 x 14.0 x 20.0 cm', '40W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(48, 5, 'altavoces', 'pequeno', 'Estación de Audio Nocturno ÁNIMA Aura', 95.00, 'Despertador digital premium con altavoz Bluetooth de alta fidelidad, base de carga inalámbrica rápida Qi y luz LED ambiental.', '/images/products/p48-1.jpg', ARRAY['/images/products/p48-2.jpg', '/images/products/p48-3.jpg', '/images/products/p48-4.jpg', '/images/products/p48-5.jpg'], 21.00, 0.00, 30, 8, 'A', 'Madera y tela blanca', 'Mesita de noche', '16.0 x 16.0 x 8.0 cm', '25W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(49, 5, 'domotica', 'pequeno', 'Centro de Control Domótico ÁNIMA SmartHub', 120.00, 'Pantalla domótica táctil para empotrar en pared que centraliza y gestiona la climatización, luces y cámaras de seguridad.', '/images/products/p49-1.jpg', ARRAY['/images/products/p49-2.jpg', '/images/products/p49-3.jpg', '/images/products/p49-4.jpg', '/images/products/p49-5.jpg'], 21.00, 0.00, 15, 3, 'A', 'Cristal y aluminium', 'Encastrable pared', '21.0 x 1.2 x 14.0 cm', '15W', false);

INSERT INTO products (pk_producto, fk_categoria, subcategoria_id, type, nombre_producto, precio, descripcion_producto, url_imagen, url_imagenes_all, iva, descuento, stock, punto_reposicion, eficiencia_energetica, material_acabado, tipo_instalacion, dimensiones, potencia, is_trend) VALUES 
(50, 5, 'marcos-digitales', 'pequeno', 'Marco de Fotos Digital ÁNIMA Gallery', 115.00, 'Pantalla IPS de alta resolución para la visualización dinámica de fotografías, con conexión remota y marcos intercambiables.', '/images/products/p50-1.jpg', ARRAY['/images/products/p50-2.jpg', '/images/products/p50-3.jpg', '/images/products/p50-4.jpg', '/images/products/p50-5.jpg'], 21.00, 0.00, 18, 4, 'A', 'Madera de nogal', 'Mesa / Pared', '28.0 x 3.5 x 20.0 cm', '12W', false);

-- ========================================================
-- TABLA: clientes
-- ========================================================

-- 1. Crear la estructura de la tabla Clientes según los requerimientos del TZ
CREATE TABLE clientes (
  pk_cliente UUID PRIMARY KEY,
  email TEXT NOT NULL,
  tipo VARCHAR(20),                               -- empresa/autónomo/particular
  razon_social VARCHAR(150),                      -- razón social en caso de ser autónomo
  nombres_cliente VARCHAR(100) NOT NULL,
  apellido1_cliente VARCHAR(100) NOT NULL,
  apellido2_cliente VARCHAR(100),
  telefono_movil VARCHAR(20),
  rol VARCHAR(20) DEFAULT 'cliente',              -- cliente/administrador
  fecha_registro TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Inserción de registros fila por fila respetando el orden estricto de las 10 columnas
INSERT INTO clientes VALUES ('c1a01111-b222-3333-4444-d55555555551', 'dayvip12369@gmail.com', 'particular', NULL, 'David', 'Campos', NULL, '+34611223344', 'cliente', NOW());
INSERT INTO clientes VALUES ('c2b02222-c333-4444-5555-e66666666662', 'tchambanyamicyrille@gmail.com', 'particular', NULL, 'Cyrille', 'Nyami', 'Tchamba', '+34622334455', 'cliente', NOW());
INSERT INTO clientes VALUES ('c3c03333-d444-5555-6666-f77777777773', 'ygcgit108@gmail.com', 'particular', NULL, 'Yordano', 'Gil', 'Contreras', '+34633445566', 'cliente', NOW());
INSERT INTO clientes VALUES ('c4d04444-e555-6666-7777-a88888888884', 'cristianrengiforen@gmail.com', 'particular', NULL, 'Cristian', 'Rengifo', NULL, '+34644556677', 'cliente', NOW());
INSERT INTO clientes VALUES ('c5e05555-f666-7777-8888-b99999999995', 'munozguille029@gmail.com', 'autónomo', NULL, 'Guillermo', 'Muñoz', 'Gámez', '+34655667788', 'cliente', NOW());
INSERT INTO clientes VALUES ('c6f06666-a777-8888-9999-c00000000006', 'ayaarifi9@gmail.com', 'particular', NULL, 'Aya', 'El Oudari', NULL, '+34666778899', 'cliente', NOW());
INSERT INTO clientes VALUES ('c7a07777-b888-9999-0000-d11111111117', 'zakhbat.mohammed1@gmail.com', 'particular', NULL, 'Mohammed', 'Zakhbat', NULL, '+34677889900', 'cliente', NOW());
INSERT INTO clientes VALUES ('c8b08888-c999-0000-1111-e22222222228', 'jenniferprat79@gmail.com', 'particular', NULL, 'Jenifer', 'Gonzalez', NULL, '+34688990011', 'cliente', NOW());
INSERT INTO clientes VALUES ('c9c09999-d000-1111-2222-f33333333339', 'yolandafontanillasyuste@gmail.com', 'empresa', 'Fontanillas S.L.', 'Yolanda', 'Fontanillas', 'Yuste', '+34699001122', 'administrador', NOW());
INSERT INTO clientes VALUES ('c10d0a10-e111-2222-3333-a44444444440', '1moussijoelle@gmail.com', 'particular', NULL, 'Joelle', 'Moussi', 'Fako', '+34612345678', 'cliente', NOW());
INSERT INTO clientes VALUES ('c11e0b11-f222-3333-4444-b55555555551', 'naomiquitosalazar474@gmail.com', 'particular', NULL, 'Naomi', 'Quito', 'Salazar', '+34623456789', 'cliente', NOW());
INSERT INTO clientes VALUES ('c12f0c12-a333-4444-5555-c66666666662', '11m11axi@gmail.com', 'particular', NULL, 'Maximiliam', 'Dostmann', NULL, '+34634567890', 'cliente', NOW());
INSERT INTO clientes VALUES ('c13a0d13-b444-5555-6666-d77777777773', 'nataliya.yanovic@gmail.com', 'particular', NULL, 'Natalia', 'Yanovic', NULL, '+34645678901', 'cliente', NOW());
INSERT INTO clientes VALUES ('c14b0e14-c555-6666-7777-e88888888884', 'pblcddinbox@gmail.com', 'particular', NULL, 'Usuario', 'Principal', NULL, '+34656789012', 'cliente', NOW());

-- ========================================================
-- TABLA: facturas
-- ========================================================

-- 1. Crear la estructura de la tabla Facturas (Pedidos integrados con Stripe)
CREATE TABLE facturas (
  pk_factura SERIAL PRIMARY KEY,
  fk_cliente UUID,
  fecha_compra TIMESTAMPTZ DEFAULT NOW(),
  stripe_payment_intent_id TEXT NOT NULL UNIQUE,
  iva NUMERIC(4,2) DEFAULT 21.00,
  estado_pago VARCHAR(20) DEFAULT 'pendiente',
  total_factura NUMERIC(10,2) NOT NULL DEFAULT 0.00
);

-- 2. Añadir relaciones de clave foránea (Foreign Keys)
ALTER TABLE facturas
ADD CONSTRAINT clientes_facturas
FOREIGN KEY (fk_cliente) REFERENCES clientes(pk_cliente)
ON UPDATE CASCADE
ON DELETE SET NULL; -- Si el perfil del cliente se elimina, el pedido permanece para contabilidad

-- 3. Añadir restricciones de control (Check Constraints)
ALTER TABLE facturas 
ADD CONSTRAINT estados_pago CHECK (estado_pago IN ('pendiente', 'pagado', 'fallido'));


-- ========================================================
-- TABLA: detalle_factura
-- ========================================================

-- 1. Crear la estructura de la tabla Detalle de Factura con clave primaria compuesta
CREATE TABLE detalle_factura (
  fk_factura INT NOT NULL,
  fk_producto INT NOT NULL,
  cantidad INT NOT NULL DEFAULT 1,
  precio_unitario NUMERIC(10,2) NOT NULL,
  descuento NUMERIC(10,2) DEFAULT 0.00,
  iva NUMERIC(4,2),
  precio_total NUMERIC(10,2) GENERATED ALWAYS AS (cantidad * precio_unitario) STORED,
  PRIMARY KEY (fk_factura, fk_producto)
);

-- 2. Añadir relaciones de clave foránea (Foreign Keys)
-- Relación con la tabla de facturas
ALTER TABLE detalle_factura
ADD CONSTRAINT facturas_detalles
FOREIGN KEY (fk_factura) REFERENCES facturas(pk_factura)
ON UPDATE CASCADE
ON DELETE CASCADE;

-- Relación con la tabla de productos (Ambos campos de tipo INT)
ALTER TABLE detalle_factura
ADD CONSTRAINT productos_detalles
FOREIGN KEY (fk_producto) REFERENCES products(pk_producto)
ON UPDATE CASCADE
ON DELETE RESTRICT;

-- 3. Añadir restricciones de control (Check Constraints)
ALTER TABLE detalle_factura 
ADD CONSTRAINT cantidad_positiva CHECK (cantidad > 0);
