-- ============================================
-- AGREGAR CAMPO EQUIPAMIENTO A VEHÍCULOS
-- ============================================
-- 
-- Este script agrega el campo equipamiento a la tabla vehiculos
-- y actualiza los vehículos existentes con equipamiento de ejemplo
--
-- INSTRUCCIONES:
--   1. Abre MySQL Workbench
--   2. Conecta a tu servidor MySQL
--   3. Copia y pega todo este contenido
--   4. Ejecuta (Ctrl + Shift + Enter)
--
-- ============================================

USE CAR;

-- ============================================
-- 1. AGREGAR CAMPO EQUIPAMIENTO
-- ============================================

SET @dbname = 'CAR';
SET @tablename = 'vehiculos';
SET @columnname = 'equipamiento';

SET @preparedStatement = (SELECT IF(
  (SELECT COUNT(*) FROM INFORMATION_SCHEMA.COLUMNS
   WHERE (table_name = @tablename)
   AND (table_schema = @dbname)
   AND (column_name = @columnname)) > 0,
  "SELECT 'El campo equipamiento ya existe' as MENSAJE",
  CONCAT("ALTER TABLE ", @tablename, " ADD COLUMN ", @columnname, " TEXT AFTER traccion")
));

PREPARE alterIfNotExists FROM @preparedStatement;
EXECUTE alterIfNotExists;
DEALLOCATE PREPARE alterIfNotExists;

-- ============================================
-- 2. ACTUALIZAR VEHÍCULOS CON EQUIPAMIENTO
-- ============================================

-- Desactivar temporalmente el modo seguro
SET SQL_SAFE_UPDATES = 0;

UPDATE vehiculos 
SET equipamiento = CASE
    WHEN tipo = 'Jeepeta' THEN 'Alarma, Bolsa de aire (chofer), Bolsa de aire (laterales), Bolsa de aire (pasajero), Bolsa de aire (traseras), Frenos ABS, Seguros eléctricos, Sensores de parqueo, Aire acondicionado digital, Android Auto, Apple CarPlay, Asientos eléctricos, Asientos en piel, Baúl eléctrico, Bluetooth, Cámara de reversa, Cruise control, Guía hidráulico, Guía multifunción, Limpia vidrios traseros, Llave inteligente, Pintura de fábrica, Radio Multimedia, Retrovisores eléctricos, Vidrios eléctricos, Aros de magnesio, Tracción 4x4, Turbo'
    WHEN tipo = 'Sedán' THEN 'Alarma, Bolsa de aire (chofer), Bolsa de aire (pasajero), Frenos ABS, Seguros eléctricos, Aire acondicionado digital, Android Auto, Apple CarPlay, Bluetooth, Calefacción, Cámara de reversa, Cruise control, Guía hidráulico, Guía multifunción, Llave inteligente, Pintura de fábrica, Radio AM/FM, Radio Multimedia, Retrovisores eléctricos, Teléfono, Vidrios eléctricos, Aros de fábrica, Tracción delantera'
    WHEN tipo = 'Camión' THEN 'Alarma, Bolsa de aire (chofer), Frenos ABS, Aire acondicionado digital, Bluetooth, Cámara de reversa, Guía hidráulico, Llave inteligente, Pintura de fábrica, Radio AM/FM, Retrovisores eléctricos, Vidrios eléctricos, Aros de fábrica, Tracción trasera'
    ELSE 'Alarma, Bolsa de aire (chofer), Bolsa de aire (pasajero), Frenos ABS, Seguros eléctricos, Aire acondicionado digital, Bluetooth, Guía hidráulico, Llave inteligente, Pintura de fábrica, Radio AM/FM, Retrovisores eléctricos, Vidrios eléctricos, Aros de fábrica'
END
WHERE equipamiento IS NULL OR equipamiento = '';

-- Reactivar el modo seguro
SET SQL_SAFE_UPDATES = 1;

-- ============================================
-- 3. ACTUALIZAR VISTA
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
-- 4. VERIFICACIÓN
-- ============================================

SELECT '✅ Campo equipamiento agregado exitosamente' as MENSAJE;

SELECT 'VEHÍCULOS CON EQUIPAMIENTO:' as '';
SELECT id_vehiculo, marca, modelo, tipo,
       SUBSTRING(equipamiento, 1, 60) as equipamiento_preview 
FROM vehiculos 
LIMIT 10;

SELECT CONCAT('Total de vehículos actualizados: ', COUNT(*)) as RESULTADO
FROM vehiculos 
WHERE equipamiento IS NOT NULL AND equipamiento != '';

-- ============================================
-- FIN DEL SCRIPT
-- ============================================
