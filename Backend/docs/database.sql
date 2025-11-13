-- ============================================
-- BASE DE DATOS CAR
-- Sistema de Gestión de Vehículos
-- ============================================

-- Crear base de datos
CREATE DATABASE IF NOT EXISTS CAR;
USE CAR;

-- ============================================
-- TABLAS
-- ============================================

-- Tabla de clientes
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(150),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de vehículos
CREATE TABLE vehiculos (
    id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio YEAR NOT NULL,
    color VARCHAR(30),
    tipo VARCHAR(30), -- ej. Automóvil, Jeepeta, Camión
    transmision VARCHAR(20), -- Manual o Automática
    combustible VARCHAR(20),
    kilometraje INT,
    precio DECIMAL(12,2),
    estado ENUM('Disponible', 'Vendido', 'Reservado') DEFAULT 'Disponible',
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tabla de cotizaciones
CREATE TABLE cotizaciones (
    id_cotizacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_cotizacion DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_ofrecido DECIMAL(12,2),
    estado ENUM('Pendiente', 'Aprobada', 'Rechazada') DEFAULT 'Pendiente',
    observaciones TEXT,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);

-- Tabla de ventas
CREATE TABLE ventas (
    id_venta INT AUTO_INCREMENT PRIMARY KEY,
    id_cotizacion INT NOT NULL,
    id_cliente INT NOT NULL,
    id_vehiculo INT NOT NULL,
    fecha_venta DATETIME DEFAULT CURRENT_TIMESTAMP,
    precio_final DECIMAL(12,2),
    metodo_pago ENUM('Efectivo', 'Transferencia', 'Financiamiento'),
    observaciones TEXT,
    FOREIGN KEY (id_cotizacion) REFERENCES cotizaciones(id_cotizacion),
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_vehiculo) REFERENCES vehiculos(id_vehiculo)
);

-- Tabla de pagos
CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(12,2) NOT NULL,
    metodo_pago ENUM('Efectivo', 'Transferencia', 'Tarjeta'),
    referencia VARCHAR(100),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta)
);

-- ============================================
-- DATOS DE EJEMPLO
-- ============================================

-- Insertar clientes
INSERT INTO clientes (nombre, cedula, telefono, correo, direccion) VALUES
('Carlos Gómez', '001-1234567-8', '8095551234', 'carlosgomez@gmail.com', 'Av. Bolívar #45, Santo Domingo'),
('María Fernández', '002-8765432-1', '8295555678', 'mariafdez@hotmail.com', 'Calle Duarte #12, Santiago'),
('Luis Rodríguez', '031-2233445-0', '8495559012', 'luisrodriguez@yahoo.com', 'Av. 27 de Febrero, Santo Domingo'),
('Ana Martínez', '041-3344556-9', '8095552233', 'ana.mtz@gmail.com', 'Calle Las Flores #9, San Cristóbal'),
('José Pérez', '051-4455667-2', '8295557788', 'joseperez@hotmail.com', 'Carretera Mella #120, Santo Domingo Este');

-- Insertar vehículos
INSERT INTO vehiculos (marca, modelo, anio, color, tipo, transmision, combustible, kilometraje, precio, estado) VALUES
('Toyota', 'Corolla', 2021, 'Blanco', 'Automóvil', 'Automática', 'Gasolina', 25000, 1450000.00, 'Disponible'),
('Hyundai', 'Tucson', 2020, 'Gris', 'Jeepeta', 'Automática', 'Gasolina', 35000, 1850000.00, 'Disponible'),
('Kia', 'Rio', 2019, 'Rojo', 'Automóvil', 'Manual', 'Gasolina', 40000, 975000.00, 'Disponible'),
('Honda', 'CR-V', 2022, 'Negro', 'Jeepeta', 'Automática', 'Gasolina', 15000, 2300000.00, 'Disponible'),
('Nissan', 'Sentra', 2021, 'Azul', 'Automóvil', 'Automática', 'Gasolina', 20000, 1320000.00, 'Disponible');

-- Insertar cotizaciones
INSERT INTO cotizaciones (id_cliente, id_vehiculo, precio_ofrecido, estado, observaciones) VALUES
(1, 1, 1400000.00, 'Pendiente', 'Cliente desea financiamiento a 12 meses'),
(2, 2, 1800000.00, 'Aprobada', 'Cliente acordó entrega en 7 días'),
(3, 3, 950000.00, 'Rechazada', 'Oferta por debajo del precio base'),
(4, 4, 2250000.00, 'Aprobada', 'Cliente realizará pago completo'),
(5, 5, 1300000.00, 'Pendiente', 'Cliente pidió incluir seguro en la cotización');

-- Insertar ventas
INSERT INTO ventas (id_cotizacion, id_cliente, id_vehiculo, precio_final, metodo_pago, observaciones) VALUES
(2, 2, 2, 1820000.00, 'Transferencia', 'Venta cerrada con entrega inmediata'),
(4, 4, 4, 2250000.00, 'Efectivo', 'Pago completo en caja'),
(1, 1, 1, 1400000.00, 'Financiamiento', 'Financiamiento aprobado por banco'),
(5, 5, 5, 1310000.00, 'Financiamiento', 'Aprobado con inicial del 20%'),
(3, 3, 3, 950000.00, 'Efectivo', 'Cliente pagó en su totalidad');

-- Insertar pagos
INSERT INTO pagos (id_venta, monto, metodo_pago, referencia) VALUES
(1, 600000.00, 'Transferencia', 'REF-TRX-1001'),
(1, 1220000.00, 'Transferencia', 'REF-TRX-1002'),
(3, 400000.00, 'Efectivo', 'PAGO-INI-001'),
(3, 1000000.00, 'Transferencia', 'CUOTA-001'),
(5, 1310000.00, 'Tarjeta', 'POS-00321');

-- ============================================
-- CONSULTAS ÚTILES
-- ============================================

-- Ver todas las cotizaciones con información completa
SELECT 
    c.id_cotizacion,
    c.fecha_cotizacion,
    c.estado,
    cl.nombre as cliente,
    CONCAT(v.marca, ' ', v.modelo, ' ', v.anio) as vehiculo,
    v.precio as precio_vehiculo,
    c.precio_ofrecido,
    (v.precio - c.precio_ofrecido) as descuento
FROM cotizaciones c
INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
INNER JOIN vehiculos v ON c.id_vehiculo = v.id_vehiculo
ORDER BY c.fecha_cotizacion DESC;

-- Ver todas las ventas con totales
SELECT 
    v.id_venta,
    v.fecha_venta,
    cl.nombre as cliente,
    CONCAT(ve.marca, ' ', ve.modelo) as vehiculo,
    v.precio_final,
    v.metodo_pago,
    COALESCE(SUM(p.monto), 0) as total_pagado,
    (v.precio_final - COALESCE(SUM(p.monto), 0)) as saldo_pendiente
FROM ventas v
INNER JOIN clientes cl ON v.id_cliente = cl.id_cliente
INNER JOIN vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
LEFT JOIN pagos p ON v.id_venta = p.id_venta
GROUP BY v.id_venta
ORDER BY v.fecha_venta DESC;

-- Vehículos más cotizados
SELECT 
    v.id_vehiculo,
    CONCAT(v.marca, ' ', v.modelo, ' ', v.anio) as vehiculo,
    v.precio,
    v.estado,
    COUNT(c.id_cotizacion) as total_cotizaciones
FROM vehiculos v
LEFT JOIN cotizaciones c ON v.id_vehiculo = c.id_vehiculo
GROUP BY v.id_vehiculo
ORDER BY total_cotizaciones DESC;
