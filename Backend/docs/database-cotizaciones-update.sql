-- ============================================
-- ACTUALIZACIÓN DE BASE DE DATOS CAR
-- Sistema Mejorado de Cotizaciones
-- ============================================

USE CAR;

-- ============================================
-- NUEVAS TABLAS
-- ============================================

-- Tabla de vendedores/team
CREATE TABLE IF NOT EXISTS vendedores (
    id_vendedor INT AUTO_INCREMENT PRIMARY KEY,
    nombre_completo VARCHAR(150) NOT NULL,
    cargo VARCHAR(100) DEFAULT 'Vendedor',
    telefono VARCHAR(20),
    email VARCHAR(100),
    firma_url VARCHAR(255), -- Ruta a imagen de firma
    sello_url VARCHAR(255),  -- Ruta a imagen de sello
    activo BOOLEAN DEFAULT TRUE,
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- MODIFICAR TABLA DE CLIENTES
-- ============================================

-- Agregar campo tipo_cliente si no existe
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS tipo_cliente ENUM('Individual', 'Empresa') DEFAULT 'Individual' AFTER nombre;

-- Agregar campo RNC para empresas
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS rnc VARCHAR(20) AFTER cedula;

-- Agregar campo nombre_empresa
ALTER TABLE clientes 
ADD COLUMN IF NOT EXISTS nombre_empresa VARCHAR(200) AFTER tipo_cliente;

-- ============================================
-- MODIFICAR TABLA DE VEHÍCULOS
-- ============================================

-- Agregar campo chasis
ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS chasis VARCHAR(50) AFTER modelo;

-- Agregar más características
ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS motor VARCHAR(50) AFTER chasis;

ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS pasajeros INT DEFAULT 5 AFTER motor;

ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS puertas INT DEFAULT 4 AFTER pasajeros;

ALTER TABLE vehiculos 
ADD COLUMN IF NOT EXISTS traccion VARCHAR(20) AFTER puertas;

-- ============================================
-- MODIFICAR TABLA DE COTIZACIONES
-- ============================================

-- Agregar campo id_vendedor
ALTER TABLE cotizaciones 
ADD COLUMN IF NOT EXISTS id_vendedor INT AFTER id_vehiculo;

-- Agregar campo tipo_cotizacion
ALTER TABLE cotizaciones 
ADD COLUMN IF NOT EXISTS tipo_cotizacion ENUM('Con Chasis', 'Sin Chasis') DEFAULT 'Sin Chasis' AFTER estado;

-- Agregar campo nombre_solicitante (puede diferir del cliente)
ALTER TABLE cotizaciones 
ADD COLUMN IF NOT EXISTS nombre_solicitante VARCHAR(150) AFTER id_cliente;

-- Agregar campo documento_solicitante
ALTER TABLE cotizaciones 
ADD COLUMN IF NOT EXISTS documento_solicitante VARCHAR(50) AFTER nombre_solicitante;

-- Agregar relación con vendedor
ALTER TABLE cotizaciones 
ADD CONSTRAINT fk_vendedor 
FOREIGN KEY (id_vendedor) REFERENCES vendedores(id_vendedor) 
ON DELETE SET NULL;

-- ============================================
-- DATOS DE EJEMPLO - VENDEDORES
-- ============================================

INSERT INTO vendedores (nombre_completo, cargo, telefono, email, firma_url, sello_url) VALUES
('Juan Carlos Méndez', 'Gerente de Ventas', '809-555-1001', 'jmendez@car.com', '/firmas/juan_mendez.png', '/sellos/gerente.png'),
('María Rodríguez Santos', 'Asesora Comercial', '809-555-1002', 'mrodriguez@car.com', '/firmas/maria_rodriguez.png', '/sellos/vendedor.png'),
('Roberto Fernández', 'Vendedor Senior', '809-555-1003', 'rfernandez@car.com', '/firmas/roberto_fernandez.png', '/sellos/vendedor.png'),
('Ana Lucía Pérez', 'Asesora de Ventas', '809-555-1004', 'aperez@car.com', '/firmas/ana_perez.png', '/sellos/vendedor.png'),
('Carlos Alberto Gómez', 'Ejecutivo de Ventas', '809-555-1005', 'cgomez@car.com', '/firmas/carlos_gomez.png', '/sellos/vendedor.png');

-- ============================================
-- ACTUALIZAR DATOS EXISTENTES
-- ============================================

-- Actualizar clientes existentes con valores por defecto
UPDATE clientes SET tipo_cliente = 'Individual' WHERE tipo_cliente IS NULL;

-- Agregar algunos clientes empresariales de ejemplo
INSERT INTO clientes (tipo_cliente, nombre_empresa, nombre, rnc, telefono, correo, direccion) VALUES
('Empresa', 'Transportes del Caribe S.R.L.', 'Pedro Martínez', '131-12345-6', '809-555-2001', 'info@transportescaribe.com', 'Zona Industrial Herrera'),
('Empresa', 'Distribuidora Nacional S.A.', 'Laura Sánchez', '101-54321-9', '809-555-2002', 'ventas@distribuidoranacional.com', 'Autopista Duarte KM 7'),
('Empresa', 'Construcciones Modernas EIRL', 'Miguel Ángel Castro', '430-98765-4', '809-555-2003', 'contacto@construccionesmodernas.com', 'Los Jardines Metropolitanos');

-- Actualizar vehículos con información adicional
UPDATE vehiculos SET 
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
    END
WHERE chasis IS NULL;

-- Actualizar cotizaciones existentes con vendedor por defecto
UPDATE cotizaciones SET id_vendedor = 1 WHERE id_vendedor IS NULL;

-- ============================================
-- VISTAS ÚTILES
-- ============================================

-- Vista completa de cotizaciones con toda la información
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
    -- Información del solicitante (si difiere)
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
-- PROCEDIMIENTO ALMACENADO PARA CREAR COTIZACIÓN
-- ============================================

DELIMITER //

CREATE PROCEDURE IF NOT EXISTS sp_crear_cotizacion(
    IN p_tipo_cliente VARCHAR(20),
    IN p_nombre_empresa VARCHAR(200),
    IN p_nombre_cliente VARCHAR(150),
    IN p_documento VARCHAR(50),
    IN p_telefono VARCHAR(20),
    IN p_email VARCHAR(100),
    IN p_direccion VARCHAR(150),
    IN p_id_vehiculo INT,
    IN p_id_vendedor INT,
    IN p_tipo_cotizacion VARCHAR(20),
    IN p_precio_ofrecido DECIMAL(12,2),
    IN p_observaciones TEXT,
    OUT p_id_cotizacion INT,
    OUT p_id_cliente INT
)
BEGIN
    DECLARE v_cliente_existe INT DEFAULT 0;
    
    -- Verificar si el cliente ya existe
    IF p_tipo_cliente = 'Empresa' THEN
        SELECT id_cliente INTO v_cliente_existe 
        FROM clientes 
        WHERE rnc = p_documento 
        LIMIT 1;
    ELSE
        SELECT id_cliente INTO v_cliente_existe 
        FROM clientes 
        WHERE cedula = p_documento 
        LIMIT 1;
    END IF;
    
    -- Si el cliente no existe, crearlo
    IF v_cliente_existe IS NULL OR v_cliente_existe = 0 THEN
        IF p_tipo_cliente = 'Empresa' THEN
            INSERT INTO clientes (tipo_cliente, nombre_empresa, nombre, rnc, telefono, correo, direccion)
            VALUES (p_tipo_cliente, p_nombre_empresa, p_nombre_cliente, p_documento, p_telefono, p_email, p_direccion);
        ELSE
            INSERT INTO clientes (tipo_cliente, nombre, cedula, telefono, correo, direccion)
            VALUES (p_tipo_cliente, p_nombre_cliente, p_documento, p_telefono, p_email, p_direccion);
        END IF;
        SET p_id_cliente = LAST_INSERT_ID();
    ELSE
        SET p_id_cliente = v_cliente_existe;
    END IF;
    
    -- Crear la cotización
    INSERT INTO cotizaciones (
        id_cliente, 
        id_vehiculo, 
        id_vendedor, 
        tipo_cotizacion,
        precio_ofrecido, 
        estado, 
        observaciones
    )
    VALUES (
        p_id_cliente,
        p_id_vehiculo,
        p_id_vendedor,
        p_tipo_cotizacion,
        p_precio_ofrecido,
        'Pendiente',
        p_observaciones
    );
    
    SET p_id_cotizacion = LAST_INSERT_ID();
END //

DELIMITER ;

-- ============================================
-- ÍNDICES PARA MEJORAR RENDIMIENTO
-- ============================================

CREATE INDEX IF NOT EXISTS idx_clientes_tipo ON clientes(tipo_cliente);
CREATE INDEX IF NOT EXISTS idx_clientes_cedula ON clientes(cedula);
CREATE INDEX IF NOT EXISTS idx_clientes_rnc ON clientes(rnc);
CREATE INDEX IF NOT EXISTS idx_vehiculos_chasis ON vehiculos(chasis);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_tipo ON cotizaciones(tipo_cotizacion);
CREATE INDEX IF NOT EXISTS idx_cotizaciones_estado ON cotizaciones(estado);
CREATE INDEX IF NOT EXISTS idx_vendedores_activo ON vendedores(activo);

-- ============================================
-- FIN DE LA ACTUALIZACIÓN
-- ============================================

SELECT 'Base de datos actualizada exitosamente' as mensaje;
SELECT 'Nuevas tablas: vendedores' as info;
SELECT 'Campos agregados a clientes: tipo_cliente, rnc, nombre_empresa' as info;
SELECT 'Campos agregados a vehiculos: chasis, motor, pasajeros, puertas, traccion' as info;
SELECT 'Campos agregados a cotizaciones: id_vendedor, tipo_cotizacion, nombre_solicitante, documento_solicitante' as info;
