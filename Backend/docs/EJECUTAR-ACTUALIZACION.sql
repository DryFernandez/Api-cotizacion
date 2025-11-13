-- ============================================
-- INSTRUCCIONES DE EJECUCIÓN
-- ============================================
-- 
-- Opción 1: MySQL Workbench
--   1. Abre MySQL Workbench
--   2. Conecta a tu servidor MySQL
--   3. Copia y pega todo este contenido
--   4. Ejecuta (Ctrl + Shift + Enter)
--
-- Opción 2: Línea de comandos
--   mysql -u root -p CAR
--   Luego copia y pega este contenido
--
-- Opción 3: phpMyAdmin
--   1. Selecciona la base de datos CAR
--   2. Ve a la pestaña SQL
--   3. Pega este contenido
--   4. Ejecuta
--
-- ============================================

USE CAR;

-- ============================================
-- 1. CREAR TABLA DE VENDEDORES
-- ============================================

CREATE TABLE IF NOT EXISTS vendedores (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    cargo VARCHAR(100) DEFAULT 'Vendedor',
    telefono VARCHAR(20),
    email VARCHAR(100),
    firma_url VARCHAR(255),
    sello_url VARCHAR(255),
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. AGREGAR CAMPOS A TABLA CLIENTES
-- ============================================

-- Verificar y agregar tipo_cliente
SET @dbname = 'CAR';
SET @tablename = 'clientes';
SET @columnname = 'tipo_cliente';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " ENUM('Individual', 'Empresa') DEFAULT 'Individual' AFTER nombre")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verificar y agregar rnc
SET @columnname = 'rnc';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(20) AFTER cedula")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- Verificar y agregar nombre_empresa
SET @columnname = 'nombre_empresa';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(200) AFTER tipo_cliente")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- 3. AGREGAR CAMPOS A TABLA VEHICULOS
-- ============================================

SET @tablename = 'vehiculos';

-- chasis
SET @columnname = 'chasis';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(50) AFTER modelo")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- motor
SET @columnname = 'motor';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(50) AFTER chasis")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- pasajeros
SET @columnname = 'pasajeros';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " INT DEFAULT 5 AFTER motor")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- puertas
SET @columnname = 'puertas';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " INT DEFAULT 4 AFTER pasajeros")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- traccion
SET @columnname = 'traccion';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(20) AFTER puertas")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- equipamiento
SET @columnname = 'equipamiento';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT AFTER traccion")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- 4. AGREGAR CAMPOS A TABLA COTIZACIONES
-- ============================================

SET @tablename = 'cotizaciones';

-- id_vendedor
SET @columnname = 'id_vendedor';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " INT AFTER id_vehiculo")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- tipo_cotizacion
SET @columnname = 'tipo_cotizacion';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " ENUM('Con Chasis', 'Sin Chasis') DEFAULT 'Sin Chasis' AFTER estado")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- nombre_solicitante
SET @columnname = 'nombre_solicitante';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(150) AFTER id_cliente")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- documento_solicitante
SET @columnname = 'documento_solicitante';
SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'Column exists'",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " VARCHAR(50) AFTER nombre_solicitante")
));
PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- 5. INSERTAR DATOS DE EJEMPLO - VENDEDORES
-- ============================================

INSERT INTO vendedores (nombre_completo, cargo, telefono, email, firma_url, sello_url) 
SELECT * FROM (
    SELECT 'Juan Carlos Méndez' as nombre_completo, 'Gerente de Ventas' as cargo, '809-555-1001' as telefono, 'jmendez@car.com' as email, '/firmas/juan_mendez.png' as firma_url, '/sellos/gerente.png' as sello_url
    UNION ALL
    SELECT 'María Rodríguez Santos', 'Asesora Comercial', '809-555-1002', 'mrodriguez@car.com', '/firmas/maria_rodriguez.png', '/sellos/vendedor.png'
    UNION ALL
    SELECT 'Roberto Fernández', 'Vendedor Senior', '809-555-1003', 'rfernandez@car.com', '/firmas/roberto_fernandez.png', '/sellos/vendedor.png'
    UNION ALL
    SELECT 'Ana Lucía Pérez', 'Asesora de Ventas', '809-555-1004', 'aperez@car.com', '/firmas/ana_perez.png', '/sellos/vendedor.png'
    UNION ALL
    SELECT 'Carlos Alberto Gómez', 'Ejecutivo de Ventas', '809-555-1005', 'cgomez@car.com', '/firmas/carlos_gomez.png', '/sellos/vendedor.png'
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM vendedores WHERE email = tmp.email
) LIMIT 5;

-- ============================================
-- 6. ACTUALIZAR CLIENTES EXISTENTES
-- ============================================

-- Desactivar temporalmente el modo seguro
SET SQL_SAFE_UPDATES = 0;

UPDATE clientes 
SET tipo_cliente = 'Individual' 
WHERE tipo_cliente IS NULL OR tipo_cliente = '';

-- Reactivar el modo seguro
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- 7. INSERTAR CLIENTES EMPRESARIALES DE EJEMPLO
-- ============================================

INSERT INTO clientes (tipo_cliente, nombre_empresa, nombre, rnc, telefono, correo, direccion) 
SELECT * FROM (
    SELECT 'Empresa' as tipo_cliente, 'Transportes del Caribe S.R.L.' as nombre_empresa, 'Pedro Martínez' as nombre, '131-12345-6' as rnc, '809-555-2001' as telefono, 'info@transportescaribe.com' as correo, 'Zona Industrial Herrera' as direccion
    UNION ALL
    SELECT 'Empresa', 'Distribuidora Nacional S.A.', 'Laura Sánchez', '101-54321-9', '809-555-2002', 'ventas@distribuidoranacional.com', 'Autopista Duarte KM 7'
    UNION ALL
    SELECT 'Empresa', 'Construcciones Modernas EIRL', 'Miguel Ángel Castro', '430-98765-4', '809-555-2003', 'contacto@construccionesmodernas.com', 'Los Jardines Metropolitanos'
) AS tmp
WHERE NOT EXISTS (
    SELECT 1 FROM clientes WHERE correo = tmp.correo
) LIMIT 3;

-- ============================================
-- 8. ACTUALIZAR VEHÍCULOS CON INFORMACIÓN ADICIONAL
-- ============================================

-- Desactivar temporalmente el modo seguro
SET SQL_SAFE_UPDATES = 0;

UPDATE vehiculos 
SET 
    chasis = CONCAT('VIN', LPAD(id_vehiculo, 13, '0')),
    motor = CONCAT(marca, '-', modelo, '-2.0L'),
    pasajeros = CASE 
        WHEN tipo = 'Jeepeta' THEN 7
        WHEN tipo = 'Camión' THEN 3
        ELSE 5
    END,
    puertas = CASE 
        WHEN tipo = 'Jeepeta' THEN 5
        WHEN tipo = 'Camión' THEN 2
        ELSE 4
    END,
    traccion = CASE 
        WHEN tipo = 'Jeepeta' THEN '4x4'
        ELSE '4x2'
    END,
    equipamiento = CASE
        WHEN tipo = 'Jeepeta' THEN 'Alarma, Bolsa de aire (chofer), Bolsa de aire (laterales), Bolsa de aire (pasajero), Bolsa de aire (traseras), Frenos ABS, Seguros eléctricos, Sensores de parqueo, Aire acondicionado digital, Android Auto, Apple CarPlay, Asientos eléctricos, Asientos en piel, Baúl eléctrico, Bluetooth, Cámara de reversa, Cruise control, Guía hidráulico, Guía multifunción, Limpia vidrios traseros, Llave inteligente, Pintura de fábrica, Radio Multimedia, Retrovisores eléctricos, Vidrios eléctricos, Aros de magnesio, Tracción 4x4, Turbo'
        WHEN tipo = 'Sedán' THEN 'Alarma, Bolsa de aire (chofer), Bolsa de aire (pasajero), Frenos ABS, Seguros eléctricos, Aire acondicionado digital, Android Auto, Apple CarPlay, Bluetooth, Calefacción, Cámara de reversa, Cruise control, Guía hidráulico, Guía multifunción, Llave inteligente, Pintura de fábrica, Radio AM/FM, Radio Multimedia, Retrovisores eléctricos, Teléfono, Vidrios eléctricos, Aros de fábrica, Tracción delantera'
        WHEN tipo = 'Camión' THEN 'Alarma, Bolsa de aire (chofer), Frenos ABS, Aire acondicionado digital, Bluetooth, Cámara de reversa, Guía hidráulico, Llave inteligente, Pintura de fábrica, Radio AM/FM, Retrovisores eléctricos, Vidrios eléctricos, Aros de fábrica, Tracción trasera'
        ELSE 'Alarma, Bolsa de aire (chofer), Bolsa de aire (pasajero), Frenos ABS, Seguros eléctricos, Aire acondicionado digital, Bluetooth, Guía hidráulico, Llave inteligente, Pintura de fábrica, Radio AM/FM, Retrovisores eléctricos, Vidrios eléctricos, Aros de fábrica'
    END
WHERE chasis IS NULL OR chasis = '';

-- Reactivar el modo seguro
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- 9. ACTUALIZAR COTIZACIONES EXISTENTES
-- ============================================

-- Desactivar temporalmente el modo seguro
SET SQL_SAFE_UPDATES = 0;

UPDATE cotizaciones 
SET id_vendedor = 1 
WHERE id_vendedor IS NULL;

-- Reactivar el modo seguro
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- 10. CREAR VISTA DE COTIZACIONES COMPLETAS
-- ============================================

CREATE OR REPLACE VIEW vista_cotizaciones_completas AS
SELECT 
    c.id_cotizacion,
    c.fecha_cotizacion,
    c.tipo_cotizacion,
    c.estado,
    -- Información del cliente
    cl.tipo_cliente,
    CASE 
        WHEN cl.tipo_cliente = 'Empresa' THEN cl.nombre_empresa
        ELSE cl.nombre
    END as cliente_nombre,
    COALESCE(cl.rnc, cl.cedula) as cliente_documento,
    cl.telefono as cliente_telefono,
    cl.correo as cliente_email,
    cl.direccion as cliente_direccion,
    -- Información del solicitante
    c.nombre_solicitante,
    c.documento_solicitante,
    -- Información del vehículo
    v.marca,
    v.modelo,
    v.anio,
    v.color,
    v.chasis,
    v.motor,
    v.tipo as tipo_vehiculo,
    v.transmision,
    v.combustible,
    v.kilometraje,
    v.pasajeros,
    v.puertas,
    v.traccion,
    v.equipamiento,
    v.precio as precio_vehiculo,
    -- Información de la cotización
    c.precio_ofrecido,
    (v.precio - c.precio_ofrecido) as descuento,
    c.observaciones,
    -- Información del vendedor
    vd.nombre_completo as vendedor_nombre,
    vd.cargo as vendedor_cargo,
    vd.telefono as vendedor_telefono,
    vd.email as vendedor_email,
    vd.firma_url as vendedor_firma,
    vd.sello_url as vendedor_sello
FROM cotizaciones c
INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
INNER JOIN vehiculos v ON c.id_vehiculo = v.id_vehiculo
LEFT JOIN vendedores vd ON c.id_vendedor = vd.id_vendedor
ORDER BY c.fecha_cotizacion DESC;

-- ============================================
-- 11. CREAR ÍNDICES
-- ============================================

-- Crear índices si no existen (compatible con versiones antiguas de MySQL)
SET @exist_idx1 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = 'CAR' AND table_name = 'clientes' AND index_name = 'idx_clientes_tipo');
SET @sqlstmt := IF(@exist_idx1 = 0, 'CREATE INDEX idx_clientes_tipo ON clientes(tipo_cliente)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_idx2 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = 'CAR' AND table_name = 'clientes' AND index_name = 'idx_clientes_cedula');
SET @sqlstmt := IF(@exist_idx2 = 0, 'CREATE INDEX idx_clientes_cedula ON clientes(cedula)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_idx3 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = 'CAR' AND table_name = 'clientes' AND index_name = 'idx_clientes_rnc');
SET @sqlstmt := IF(@exist_idx3 = 0, 'CREATE INDEX idx_clientes_rnc ON clientes(rnc)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_idx4 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = 'CAR' AND table_name = 'vehiculos' AND index_name = 'idx_vehiculos_chasis');
SET @sqlstmt := IF(@exist_idx4 = 0, 'CREATE INDEX idx_vehiculos_chasis ON vehiculos(chasis)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_idx5 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = 'CAR' AND table_name = 'cotizaciones' AND index_name = 'idx_cotizaciones_tipo');
SET @sqlstmt := IF(@exist_idx5 = 0, 'CREATE INDEX idx_cotizaciones_tipo ON cotizaciones(tipo_cotizacion)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_idx6 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = 'CAR' AND table_name = 'cotizaciones' AND index_name = 'idx_cotizaciones_estado');
SET @sqlstmt := IF(@exist_idx6 = 0, 'CREATE INDEX idx_cotizaciones_estado ON cotizaciones(estado)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @exist_idx7 := (SELECT COUNT(*) FROM INFORMATION_SCHEMA.STATISTICS WHERE table_schema = 'CAR' AND table_name = 'vendedores' AND index_name = 'idx_vendedores_activo');
SET @sqlstmt := IF(@exist_idx7 = 0, 'CREATE INDEX idx_vendedores_activo ON vendedores(activo)', 'SELECT "Index already exists"');
PREPARE stmt FROM @sqlstmt;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- ============================================
-- 12. VERIFICACIÓN FINAL
-- ============================================

SELECT '✅ Base de datos actualizada exitosamente' as MENSAJE;
SELECT '📊 Nuevas tablas creadas: vendedores' as INFO;
SELECT '📝 Campos agregados a clientes: tipo_cliente, rnc, nombre_empresa' as INFO;
SELECT '🚗 Campos agregados a vehiculos: chasis, motor, pasajeros, puertas, traccion, equipamiento' as INFO;
SELECT '📋 Campos agregados a cotizaciones: id_vendedor, tipo_cotizacion, nombre_solicitante, documento_solicitante' as INFO;

-- Mostrar resultados
SELECT 'VENDEDORES CREADOS:' as '';
SELECT * FROM vendedores;

SELECT 'CLIENTES EMPRESARIALES:' as '';
SELECT id_cliente, tipo_cliente, nombre_empresa, nombre, rnc FROM clientes WHERE tipo_cliente = 'Empresa';

SELECT 'VEHÍCULOS ACTUALIZADOS:' as '';
SELECT id_vehiculo, marca, modelo, chasis, motor, pasajeros, puertas, traccion, 
       SUBSTRING(equipamiento, 1, 50) as equipamiento_preview 
FROM vehiculos LIMIT 5;

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
