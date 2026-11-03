-- ★ CONSULTAS SIMPLES

-- 1. Lista el nombre de todos los empleados que hay en la tabla empleado.
SELECT nombre FROM empleado;

-- 2. Lista los nombres y los sueldos de todos los empleados de la tabla empleado.
SELECT nombre, sueldo FROM empleado;

-- 3.Lista todas las columnas de la tabla empleado.
SELECT * FROM empleado;

-- 4. Lista el nombre + apellido de todos los empleados, su fecha de nacimiento y su fecha de contrato.
SELECT (nombre || ' ' || apellido) AS empleado, fecha_nacimiento, fecha_contrato FROM empleado;

-- 5. Lista el nombre de los empleados, su apellido, el sexo e hijos.
SELECT nombre, apellido, sexo, hijos FROM empleado;

-- 6. Utiliza los siguientes alias para las columnas: nombre del empleado, apellido del empleado, sexo, número de hijos.
SELECT nombre AS "nombre del empleado", apellido AS "apellido del empleado", sexo AS "sexo", hijos AS "número de hijos" FROM empleado;

-- 7. Lista los nombres + apellidos y el sueldo de todos los empleados de la tabla empleado, mostrando los apellidos en mayúsculas (función upper, operador de concatenación ||).
SELECT nombre || ' ' || UPPER(apellido) AS empleado, sueldo FROM empleado;

-- 8. Lista los nombres + apellidos y estado civil de todos los empleados de la tabla empleado, mostrando el estado civil en minúscula (función lower, operador de concatenación ||).
SELECT nombre || ' ' || apellido AS empleado, LOWER(estado_civil::text) AS "estado_civil" FROM empleado;

-- 9. Lista los nombres + apellidos de todos los empleados y calcula las iniciales de los mismos (primera letra del nombre y primera letra del apellido seguidas de punto. Ejemplo: Marcos Rodríguez sería M.R.). (función left, operador de concatenación ||)
SELECT LEFT(nombre, 1) || '.' || LEFT(apellido, 1) AS empleado FROM empleado;

-- 10. Lista los nombres + apellidos de todos los empleados y calcula su edad a partir de la fecha de nacimiento.
SELECT nombre || ' ' || apellido AS empleado, EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::int AS edad FROM empleado;

-- 11. Lista los nombres + apellidos de todos los empleados y calcula su antigüedad a partir de la fecha del contrato. (función age)
SELECT nombre || ' ' || apellido AS empleado, EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_contrato))::int AS edad FROM empleado;

-- 12. Lista sin repetir el código de los cargos (fk_cargo) de la tabla empleado.
SELECT DISTINCT fk_cargo FROM empleado;

-- 13. Lista la tabla empleado ordenada de forma ascendente por apellido y nombre.
SELECT (nombre || ' ' || apellido) AS empleado FROM empleado ORDER BY apellido ASC, nombre ASC;

-- 14. Lista la tabla empleado ordenada de forma descendente por sueldos.
SELECT sueldo FROM empleado ORDER BY sueldo DESC;

-- 15. Lista los empleados ordenados en primer lugar por el estado civil de forma ascendente y en segundo lugar el sueldo de forma descendente.
SELECT estado_civil || '   ' || sueldo AS resalt FROM empleado ORDER BY estado_civil ASC, sueldo DESC;
------------------------------------------------------------------------------------
SELECT estado_civil, sueldo FROM empleado ORDER BY estado_civil ASC, sueldo DESC; 

-- 16. Devuelve una lista con las 3 primeras filas de la tabla cargo.
SELECT * FROM cargo LIMIT 3;

-- 17. Devuelve una lista con 2 filas a partir de la cuarta fila de la tabla departamento. La cuarta fila también se debe incluir en la respuesta.
SELECT * FROM departamento LIMIT 2 OFFSET 3;

-- 18. Lista el nombre + apellido y el sueldo del empleado que gane menos sueldo.
SELECT (nombre || ' ' || apellido) AS empleado, sueldo FROM empleado ORDER BY sueldo ASC LIMIT 1;

-- 19. Lista el nombre + apellido y la fecha de nacimiento del empleado de mayor edad.
SELECT (nombre || ' ' || apellido) AS empleado, fecha_nacimiento FROM empleado ORDER BY fecha_nacimiento ASC LIMIT 1;

-- 20. Lista el nombre de todos los empleados cuyo fk_departamento es igual a 2.
SELECT nombre FROM empleado WHERE fk_departamento = 2;

-- 21. Lista nombre + apellido de los empleados que tienen un sueldo menor o igual a 15.000€.
SELECT (nombre || ' ' || apellido) AS empleado FROM empleado WHERE sueldo <= 15000;

-- 22. Lista nombre + apellido de los empleados que tienen un sueldo mayor o igual a 40.000€.
SELECT (nombre || ' ' || apellido) AS empleado FROM empleado WHERE sueldo >= 40000;

-- 23. Lista nombre + apellido de los empleados que no tienen un sueldo mayor o igual a 14.000€.
SELECT (nombre || ' ' || apellido) AS empleado FROM empleado WHERE sueldo <= 14000;
----------------------------------------------------------------------------------------------
SELECT (nombre || ' ' || apellido) AS empleado FROM empleado WHERE NOT sueldo >= 14000;

-- 24. Lista todos los empleados que tengan un sueldo entre 18.000€ y 25.000€. Sin utilizar el operador BETWEEN.
SELECT * FROM empleado WHERE sueldo >=18000 AND sueldo <=25000; 

-- 25. Lista todos los empleados que tengan un sueldo entre 16.000€ y 20.000€. Utilizando el operador BETWEEN.
SELECT * FROM empleado WHERE sueldo BETWEEN 16000 AND 20000; 

-- 26. Lista los empleados que tengan un sueldo mayor que 15.000€ y que el fk_departamento sea igual a 6.
SELECT * FROM empleado WHERE sueldo > 15000 AND fk_departamento = 6;

-- 27. Lista los empleados donde el fk_cargo sea 1,3 o 5. Sin utilizar el operador IN.
SELECT * FROM empleado WHERE fk_cargo = 1 OR fk_cargo = 3 OR fk_cargo = 5;

-- 28. Lista todos los empleados donde el fk_cargo sea 1, 3 o 5. Utilizando el el operador IN.
SELECT * FROM empleado WHERE fk_cargo IN (1, 3, 5);

-- 29. Lista el nombre + apellido de los empleados y su mes de nacimiento.
SELECT (nombre || ' ' || apellido) AS empleado, EXTRACT(MONTH FROM fecha_nacimiento)::int AS mes_nacimiento FROM empleado;

-- 30. Lista los empleados cuyo nombre empiece por la letra S.
SELECT * FROM empleado WHERE nombre LIKE 'S%';

-- 31. Lista los empleados cuyo nombre termine por la vocal e
SELECT * FROM empleado WHERE nombre LIKE '%a';

-- 32. Lista los cargos que contengan el carácter r.
SELECT cargo FROM cargo WHERE cargo LIKE '%r%';

-- 33. Devuelve una lista de todos los empleados que contienen la cadena ana en el nombre.
SELECT * FROM empleado WHERE nombre LIKE '%ana%';
------------------------------------------------------------
SELECT * FROM empleado WHERE nombre LIKE '%Ana%';
------------------------------------------------------------
SELECT * FROM empleado WHERE nombre ILIKE '%ana%';

-- 34. Haz una lista de todos los empleados que contienen la cadena ez en el apellido y tienen un sueldo inferior a 21.500€.
SELECT * FROM empleado WHERE apellido LIKE '%ez%' AND sueldo <21500;
--------------------------------------------------------------------------
SELECT * FROM empleado WHERE apellido ILIKE '%ez%' AND sueldo <21500;

-- 35. Lista los apellidos cuya longitud sea igual a 4 caracteres.
SELECT apellido FROM empleado WHERE LENGTH(apellido) = 4;

-- 36. Lista el nombre y el sueldo de todos los empleados que tengan un sueldo mayor o igual a 18.000€. Ordena el resultado en primer lugar por el sueldo (en orden descendente) y en segundo lugar por el apellido (en orden ascendente).
SELECT nombre FROM empleado WHERE sueldo >= 18000 ORDER BY sueldo DESC, apellido ASC;

-- ★ CONSULTAS MULTITABLA

-- 1. Lista el nombre y apellido de los empleados, su sueldo y el nombre del departamento donde trabaja.
SELECT pk_departamento, departamento, pk_empleado, nombre, apellido, sueldo, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento;
-------------------------------------------------------------------
SELECT pk_departamento, departamento, pk_empleado, (nombre || ' ' || apellido) AS empleado, sueldo, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento;
---------------------------------------------------------------------
SELECT (nombre || ' ' || apellido) AS empleado, sueldo, departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento;

-- 2. Lista el nombre y apellido de los empleados, su fecha de contrato y el nombre del cargo. Ordena el resultado por la fecha de contrato.
SELECT pk_cargo, cargo, pk_empleado, (nombre  || ' ' || apellido) AS empleado, fecha_contrato, fk_cargo
FROM cargo INNER JOIN empleado
ON pk_cargo = fk_cargo
ORDER BY fecha_contrato;

--3. Lista el código del empleado, su nombre y apellido, el código del departameto y el nombre del departamento de los empleados que ganen más de 2000€.
SELECT pk_departamento, departamento, pk_empleado, (nombre  || ' ' || apellido) AS empleado, fk_departamento, sueldo
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento
WHERE sueldo >2000;

--4. Indica el nombre, apellido y nombre del cargo del empleado más joven.
SELECT pk_cargo, cargo, pk_empleado, (nombre  || ' ' || apellido) AS empleado, fecha_nacimiento, fk_cargo
FROM cargo INNER JOIN empleado  
ON pk_cargo = fk_cargo
ORDER BY fecha_nacimiento DESC LIMIT 1;

--5. Indica el nombre, apellido y nombre del departamento de los empleados que tengan hijos.
SELECT pk_departamento, departamento, (nombre  || ' ' || apellido) AS empleado, hijos, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento
WHERE hijos >0 ;

--6. Lista todos los datos de los empleados de Contabilidad.
SELECT pk_departamento, departamento, pk_empleado, empleado.*, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento
WHERE departamento ILIKE '%Contabilidad%';

--7. Lista el nombre y apellido del empleado, el nombre del cargo y el del departamento de los empleados solteros sin hijos
SELECT pk_departamento, departamento, pk_cargo, cargo, (nombre  || ' ' || apellido) AS empleado, estado_civil, hijos, fk_departamento, fk_cargo
FROM empleado 
INNER JOIN departamento ON pk_departamento = fk_departamento
INNER JOIN cargo ON pk_cargo = fk_cargo
WHERE estado_civil ILIKE '%soltero%' AND hijos = 0;
-----------------------------------------------------------
SELECT pk_departamento, departamento, pk_cargo, cargo, (nombre  || ' ' || apellido) AS empleado, estado_civil, hijos, fk_departamento, fk_cargo
FROM departamento
INNER JOIN empleado ON pk_departamento = fk_departamento
INNER JOIN cargo ON pk_cargo = fk_cargo
WHERE estado_civil::text ILIKE '%soltero%' AND hijos = 0;

--8. Lista los empleados de los departamentos de Compras y Ventas sin utilizar el operador IN.
SELECT pk_departamento, departamento, pk_empleado, empleado.*, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento
WHERE departamento ILIKE '%Compras%' OR departamento ILIKE '%Ventas%';
----------------------------------------------------------------
SELECT pk_departamento, departamento, pk_empleado, (nombre  || ' ' || apellido) AS empleado, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento
WHERE departamento ILIKE '%Compras%' OR departamento ILIKE '%Ventas%';

--9. Lista los empleados de los departamentos de Compras y Ventas utilizando el operador IN.
SELECT pk_departamento, departamento, pk_empleado, empleado.*, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento
WHERE departamento IN ('Compras', 'Ventas');
----------------------------------------------------------------
SELECT pk_departamento, departamento, pk_empleado, (nombre  || ' ' || apellido) AS empleado, fk_departamento
FROM departamento INNER JOIN empleado
ON pk_departamento = fk_departamento
WHERE departamento IN ('Compras', 'Ventas');

--10. Lista el nombre y apellido del empleado, el nombre del cargo y del departamento de aquellas personas que tienen más de 20 años en la empresa. Ordena el resultado en primer lugar por el departamento (en orden ascendente) y en segundo lugar por el tiempo trabajado (en orden descendente)
SELECT pk_departamento, departamento, pk_cargo, cargo, pk_empleado, (nombre  || ' ' || apellido) AS empleado, fecha_contrato, fk_departamento, fk_cargo
FROM empleado
INNER JOIN departamento ON pk_departamento = fk_departamento
INNER JOIN cargo ON pk_cargo = fk_cargo
WHERE EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_contrato))::int >20 ORDER BY departamento ASC, fecha_contrato DESC ;

--11. Lista nombre y apellido, edad, nombre del cargo, nombre del departamento de los empleados Solteros, Divorciados o Viudos que tengan más de un hijo.
SELECT pk_departamento, departamento, pk_cargo, cargo, (nombre  || ' ' || apellido) AS empleado, EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::int AS edad, estado_civil, hijos, fk_departamento, fk_cargo
FROM empleado
INNER JOIN departamento ON pk_departamento = fk_departamento
INNER JOIN cargo ON pk_cargo = fk_cargo
WHERE (estado_civil::text ILIKE '%Soltero%' OR estado_civil::text ILIKE '%Divorciado%' OR estado_civil::text ILIKE '%Viudo%') AND hijos > 1;
-----------------------------------------------------------------------------------------------------------------------------------------
SELECT pk_departamento, departamento, pk_cargo, cargo, (nombre || ' ' || apellido) AS empleado, EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::int AS edad, estado_civil, hijos, fk_departamento, fk_cargo
FROM empleado
INNER JOIN departamento ON pk_departamento = fk_departamento
INNER JOIN cargo ON pk_cargo = fk_cargo
WHERE estado_civil::text IN ('Soltero', 'Divorciado', 'Viudo') AND hijos > 1;

--12. Lista todos departamentos registrados que existen en la base de datos, junto con el código, nombre y apellido del empleado que tiene cada uno de ellos. El listado deberá mostrar también aquellos departamentos que no tienen empleados asociados.
SELECT pk_departamento, departamento, pk_empleado, nombre, apellido, fk_departamento
FROM departamento LEFT JOIN empleado
ON pk_departamento = fk_departamento;

--13. Lista todos cargos registrados que existen en la base de datos, junto con el nombre y apellido del empleado, la edad y estado civil que tiene cada empleado. El listado deberá mostrar también aquellos cargos que no tienen empleados asociados.
SELECT pk_cargo, cargo, nombre, apellido, EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::int AS edad, estado_civil
FROM cargo LEFT JOIN empleado
ON pk_cargo = fk_cargo;

--14. Lista los departamentos sin empleados asociados.
SELECT pk_cargo, cargo, nombre, apellido, EXTRACT(YEAR FROM AGE(CURRENT_DATE, fecha_nacimiento))::int AS edad, estado_civil
FROM cargo LEFT JOIN empleado
ON pk_cargo = fk_cargo
WHERE pk_empleado IS NULL;

-- 15. ¿Se puede asignar a un empleado un cargo que no esté registrado en la tabla de cargos? Justifica tu respuesta.
-- RESPUESTA: No, no se puede. 
-- JUSTIFICACIÓN: La columna fk_cargo de la tabla empleado tiene una restricción de clave foránea (FOREIGN KEY) 
-- que hace referencia a pk_cargo en la tabla cargo. Por lo tanto, el sistema de base de datos (PostgreSQL) 
-- garantiza la integridad referencial y bloqueará cualquier intento de insertar un cargo inexistente.

-- ★ CONSULTAS AGRUPADAS


--1. Calcula el número total de empleados que hay en la tabla empleado.
SELECT COUNT(*) AS empleado 
FROM empleado;

--2. Calcula el número total de departamentos que hay en la tabla departamento.
SELECT COUNT(*) AS departamento 
FROM departamento;

--3. Calcula la media de sueldo de todos los empleados.
SELECT AVG(sueldo) AS media_sueldo 
FROM empleado;
------------------------------------------------
SELECT ROUND(AVG(sueldo), 2) AS media_sueldo 
FROM empleado;

--4. Indica quién es el empleado más joven.
SELECT nombre, apellido, fecha_nacimiento
FROM empleado
WHERE fecha_nacimiento = (SELECT MAX(fecha_nacimiento) FROM empleado);
-------------------------------------------------
SELECT (nombre || ' ' || apellido) AS empleado, fecha_nacimiento
FROM empleado
WHERE fecha_nacimiento = (SELECT MAX(fecha_nacimiento) FROM empleado);

--5. Indica quién es el empleado menos joven.
SELECT nombre, apellido, fecha_nacimiento
FROM empleado
WHERE fecha_nacimiento = (SELECT MIN(fecha_nacimiento) FROM empleado);
-------------------------------------------------
SELECT (nombre || ' ' || apellido) AS empleado, fecha_nacimiento
FROM empleado
WHERE fecha_nacimiento = (SELECT MIN(fecha_nacimiento) FROM empleado);

--6. Calcula el número total de empleados por estado civil.
SELECT estado_civil, COUNT(*) AS empleado
FROM empleado
GROUP BY estado_civil;

--7. Muestra el número de empleados que han ingresado cada año a la empresa
SELECT EXTRACT(YEAR FROM fecha_contrato) AS fecha_contrato, COUNT(*) AS empleado
FROM empleado
GROUP BY EXTRACT(YEAR FROM fecha_contrato)
ORDER BY fecha_contrato ASC;

--8. Lista el nombre y el precio del producto más caro.
--SELECT nombre_producto, precio_producto
--FROM producto
--WHERE precio_producto = (SELECT MAX(precio_producto) FROM producto);

--9. Calcula la suma de los salarios de los empleados por departamento.
SELECT fk_departamento, SUM(sueldo) AS salario
FROM empleado
GROUP BY fk_departamento;

--10. Calcula la suma de los salarios de los empleados por sexo.
SELECT sexo, SUM(sueldo) AS salario
FROM empleado
GROUP BY sexo;

--11. Calcula el número de empleados que son Asistentes.
SELECT COUNT(*) AS asistente
FROM empleado
WHERE fk_cargo = 2;

--12. Calcula la media de hijos de los empleados por sexo y estado civil
SELECT sexo, estado_civil, ROUND(AVG(hijos), 2) AS media_hijos
FROM empleado
GROUP BY sexo, estado_civil;

--13. Calcula el sueldo más bajo de los Analistas.
SELECT MIN(sueldo) AS sueldo_min_analista
FROM empleado
WHERE fk_cargo = 1;

--14. Calcula el sueldo más alto de los Analistas.
SELECT MAX(sueldo) AS sueldo_max_analista
FROM empleado
WHERE fk_cargo = 1;

--15. Muestra el sueldo máximo, sueldo mínimo, sueldo promedio y el número total de empleados por cargo.
SELECT 
    fk_cargo, 
    MAX(sueldo) AS sueldo_maximo, 
    MIN(sueldo) AS sueldo_minimo, 
    ROUND(AVG(sueldo), 2) AS sueldo_promedio, 
    COUNT(*) AS total_empleados
FROM empleado
GROUP BY fk_cargo;

--16. Muestra el sueldo máximo, sueldo mínimo, sueldo promedio y el número total de empleados por departamento, ordenando de forma descendente por el sueldo promedio.
SELECT 
    fk_departamento, 
    MAX(sueldo) AS sueldo_maximo, 
    MIN(sueldo) AS sueldo_minimo, 
    ROUND(AVG(sueldo), 2) AS sueldo_promedio, 
    COUNT(*) AS total_empleados
FROM empleado
GROUP BY fk_departamento
ORDER BY sueldo_promedio DESC;

--17. Muestra la edad máxima, edad mínima, edad promedio y el número total de empleados de los departamentos que tienen una edad promedio superior a los 45 años.
SELECT 
    fk_departamento,
    MAX(EXTRACT(YEAR FROM AGE(NOW(), fecha_nacimiento))) AS edad_maxima,
    MIN(EXTRACT(YEAR FROM AGE(NOW(), fecha_nacimiento))) AS edad_minima,
    ROUND(AVG(EXTRACT(YEAR FROM AGE(NOW(), fecha_nacimiento))), 2) AS edad_promedio,
    COUNT(*) AS total_empleados
FROM empleado
GROUP BY fk_departamento
HAVING AVG(EXTRACT(YEAR FROM AGE(NOW(), fecha_nacimiento))) > 45;

--18. Calcula el número de empleados que tienen un sueldo mayor o igual a 1800€.
SELECT COUNT(*) AS total_empleados
FROM empleado
WHERE sueldo >= 1800;

--19. Calcula el número de empleados que tienen una edad menor o igual a 28 años.
SELECT COUNT(*) AS total_empleados
FROM empleado
WHERE EXTRACT(YEAR FROM AGE(NOW(), fecha_nacimiento)) <= 28;

--20. Lista los nombres de los departamentos cuyos empleados tienen una edad promedio mayor o igual a 35 años.
SELECT d.departamento
FROM empleado e
INNER JOIN departamento d ON e.fk_departamento = d.pk_departamento
GROUP BY d.departamento
HAVING AVG(EXTRACT(YEAR FROM AGE(NOW(), e.fecha_nacimiento))) >= 35;

--21. Devuelve un listado con los nombres de los cargos que tienen 5 o más empleados.
SELECT c.cargo
FROM empleado e
INNER JOIN cargo c ON e.fk_cargo = c.pk_cargo
GROUP BY c.cargo
HAVING COUNT(*) >= 5;

--22. Devuelve un listado con los nombres de los departamentos donde el promedio de edad sea superior 40 años.
SELECT d.departamento
FROM empleado e
INNER JOIN departamento d ON e.fk_departamento = d.pk_departamento
GROUP BY d.departamento
HAVING AVG(EXTRACT(YEAR FROM AGE(NOW(), e.fecha_nacimiento))) > 40;

--23. Muestra el número total de empleados que tiene cada departamento. El listado también debe incluir los departamentos que no tienen ningún empleado. El resultado mostrará dos columnas, una con el nombre del departamento y otra con el número de empleados que tiene. Ordena el resultado descendentemente por el número de empleados.
SELECT d.departamento, COUNT(e.pk_empleado) AS total_empleados
FROM departamento d
LEFT JOIN empleado e ON d.pk_departamento = e.fk_departamento
GROUP BY d.departamento
ORDER BY total_empleados DESC;

--24. Explica las diferencias entre las cláusulas WHERE y HAVING, y cuándo utilizar cada una de ellas.
--Cláusula WHERE:
--Cuándo se utiliza: Se aplica antes de que los datos sean agrupados o procesados por funciones de agregación.
--Función: Filtra filas individuales directamente desde las tablas físicas basándose en condiciones sencillas (por ejemplo, WHERE sueldo >= 1800). 
--No puedes utilizar con COUNT(), AVG() o SUM().
--Cláusula HAVING:
--Cuándo se utiliza: Se aplica después de realizar la agrupación de datos con GROUP BY.
--Función: Filtra los grupos resultantes creados por la consulta basándose en el resultado de funciones de agregación 
--(por ejemplo, HAVING COUNT(*) >= 5 o HAVING AVG(edad) > 40).Resumen: WHERE filtra registros individuales; HAVING filtra grupos de registros previamente procesados.