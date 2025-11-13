# 🚗 CAR - API de Gestión de Cotizaciones y Ventas de Vehículos

API RESTful desarrollada en Node.js con Express para la gestión de cotizaciones y ventas de vehículos. Incluye generación automática de PDFs profesionales para cotizaciones.

## 📋 Características

- ✅ Gestión completa de clientes
- ✅ Catálogo de vehículos con estados (Disponible, Vendido, Reservado)
- ✅ Sistema de cotizaciones con estados (Pendiente, Aprobada, Rechazada)
- ✅ Control de ventas y métodos de pago
- ✅ Seguimiento de pagos por venta
- ✅ **Generación automática de PDFs profesionales** para cotizaciones
- ✅ Validaciones y manejo de errores
- ✅ Arquitectura escalable con separación de responsabilidades

## 🛠️ Tecnologías Utilizadas

- **Node.js** - Entorno de ejecución
- **Express** - Framework web
- **MySQL2** - Cliente de base de datos
- **PDFKit** - Generación de PDFs
- **dotenv** - Gestión de variables de entorno
- **CORS** - Habilitación de CORS

## 📁 Estructura del Proyecto

```
CAR-COTI/
├── src/
│   ├── config/
│   │   └── database.js          # Configuración de MySQL
│   ├── controllers/
│   │   ├── clientesController.js
│   │   ├── vehiculosController.js
│   │   ├── cotizacionesController.js
│   │   ├── ventasController.js
│   │   └── pagosController.js
│   ├── routes/
│   │   ├── clientes.js
│   │   ├── vehiculos.js
│   │   ├── cotizaciones.js
│   │   ├── ventas.js
│   │   └── pagos.js
│   ├── services/
│   │   └── pdfService.js        # Servicio de generación de PDFs
│   ├── middleware/
│   └── server.js                # Punto de entrada
├── .env.example
├── .gitignore
├── package.json
└── README.md
```

## 🚀 Instalación y Configuración

### 1. Clonar o descargar el proyecto

```bash
cd CAR-COTI
```

### 2. Instalar dependencias

```bash
npm install
```

### 3. Configurar variables de entorno

Copia el archivo `.env.example` a `.env`:

```bash
cp .env.example .env
```

Edita el archivo `.env` con tus credenciales de MySQL:

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=CAR
DB_PORT=3306
```

### 4. Crear la base de datos

Ejecuta el siguiente script SQL en tu servidor MySQL:

```sql
CREATE DATABASE CAR;
USE CAR;

CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    cedula VARCHAR(20),
    telefono VARCHAR(20),
    correo VARCHAR(100),
    direccion VARCHAR(150),
    fecha_registro DATETIME DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE vehiculos (
    id_vehiculo INT AUTO_INCREMENT PRIMARY KEY,
    marca VARCHAR(50) NOT NULL,
    modelo VARCHAR(50) NOT NULL,
    anio YEAR NOT NULL,
    color VARCHAR(30),
    tipo VARCHAR(30),
    transmision VARCHAR(20),
    combustible VARCHAR(20),
    kilometraje INT,
    precio DECIMAL(12,2),
    estado ENUM('Disponible', 'Vendido', 'Reservado') DEFAULT 'Disponible',
    fecha_ingreso DATETIME DEFAULT CURRENT_TIMESTAMP
);

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

CREATE TABLE pagos (
    id_pago INT AUTO_INCREMENT PRIMARY KEY,
    id_venta INT NOT NULL,
    fecha_pago DATETIME DEFAULT CURRENT_TIMESTAMP,
    monto DECIMAL(12,2) NOT NULL,
    metodo_pago ENUM('Efectivo', 'Transferencia', 'Tarjeta'),
    referencia VARCHAR(100),
    FOREIGN KEY (id_venta) REFERENCES ventas(id_venta)
);
```

Inserta los datos de ejemplo (ver archivo SQL completo en la documentación).

### 5. Iniciar el servidor

**Modo desarrollo (con auto-reinicio):**
```bash
npm run dev
```

**Modo producción:**
```bash
npm start
```

El servidor estará disponible en `http://localhost:3000`

## 📡 Endpoints de la API

### Base URL
```
http://localhost:3000/api
```

### 👥 Clientes

- **GET** `/api/clientes` - Obtener todos los clientes
- **GET** `/api/clientes/:id` - Obtener cliente por ID
- **POST** `/api/clientes` - Crear nuevo cliente

**Ejemplo POST /api/clientes:**
```json
{
  "nombre": "Juan Pérez",
  "cedula": "001-1234567-8",
  "telefono": "809-555-1234",
  "correo": "juan@example.com",
  "direccion": "Calle Principal #123"
}
```

### 🚗 Vehículos

- **GET** `/api/vehiculos` - Obtener todos los vehículos
- **GET** `/api/vehiculos/disponibles` - Obtener vehículos disponibles
- **GET** `/api/vehiculos/:id` - Obtener vehículo por ID

### 📋 Cotizaciones

- **GET** `/api/cotizaciones` - Obtener todas las cotizaciones
- **GET** `/api/cotizaciones/:id` - Obtener cotización por ID
- **POST** `/api/cotizaciones` - **Crear cotización y generar PDF**
- **GET** `/api/cotizaciones/:id/pdf` - Descargar PDF de cotización

**Ejemplo POST /api/cotizaciones:**
```json
{
  "id_cliente": 1,
  "id_vehiculo": 2,
  "precio_ofrecido": 1800000.00,
  "observaciones": "Cliente desea financiamiento"
}
```

**Respuesta exitosa:**
```json
{
  "success": true,
  "message": "Cotización creada exitosamente",
  "data": {
    "id_cotizacion": 6,
    "cotizacion": {
      "id_cotizacion": 6,
      "cliente_nombre": "Carlos Gómez",
      "marca": "Hyundai",
      "modelo": "Tucson",
      ...
    },
    "pdf": {
      "base64": "JVBERi0xLjMKJf////8KOCAwIG9iag...",
      "nombre_archivo": "cotizacion_6_1699725600000.pdf"
    }
  }
}
```

### 💰 Ventas

- **GET** `/api/ventas` - Obtener todas las ventas
- **GET** `/api/ventas/:id` - Obtener venta por ID

### 💳 Pagos

- **GET** `/api/pagos` - Obtener todos los pagos
- **GET** `/api/pagos/venta/:id_venta` - Obtener pagos por venta

## 📄 Generación de PDF

El sistema genera automáticamente un PDF profesional cuando se crea una cotización. El PDF incluye:

- ✅ Encabezado con número de cotización y fecha
- ✅ Estado de la cotización (Pendiente/Aprobada/Rechazada)
- ✅ Información completa del cliente
- ✅ Detalles del vehículo
- ✅ Comparativa de precios con descuento calculado
- ✅ Observaciones
- ✅ Diseño profesional con colores y formato

### Opciones para obtener el PDF:

1. **Base64 en la respuesta JSON** (al crear cotización):
   - El PDF se devuelve en formato base64
   - Ideal para aplicaciones frontend que manejan PDFs en el navegador

2. **Descarga directa**:
   ```
   GET /api/cotizaciones/:id/pdf
   ```
   - Descarga el PDF directamente
   - Ideal para descargas desde el navegador

## 🧪 Pruebas con Postman/Thunder Client

### Ejemplo: Crear cotización con PDF

```http
POST http://localhost:3000/api/cotizaciones
Content-Type: application/json

{
  "id_cliente": 1,
  "id_vehiculo": 1,
  "precio_ofrecido": 1400000.00,
  "observaciones": "Cliente solicita financiamiento a 12 meses"
}
```

### Ejemplo: Descargar PDF

```http
GET http://localhost:3000/api/cotizaciones/1/pdf
```

## 🔒 Validaciones

La API incluye validaciones para:

- Campos requeridos en las solicitudes
- Existencia de clientes y vehículos antes de crear cotizaciones
- Formato de datos
- Manejo de errores de base de datos

## 📊 Respuestas de la API

### Respuesta exitosa:
```json
{
  "success": true,
  "data": {...},
  "count": 10
}
```

### Respuesta de error:
```json
{
  "success": false,
  "message": "Descripción del error",
  "error": "Detalles técnicos (solo en desarrollo)"
}
```

## 🐛 Solución de Problemas

### Error de conexión a MySQL:
```
❌ Error al conectar con la base de datos
```
**Solución:** Verifica las credenciales en el archivo `.env`

### Puerto en uso:
```
Error: listen EADDRINUSE: address already in use :::3000
```
**Solución:** Cambia el puerto en `.env` o detén el proceso que usa el puerto 3000

### Error al generar PDF:
**Solución:** Asegúrate de que la cotización existe y tiene todos los datos necesarios

## 📝 Notas Importantes

- Asegúrate de que MySQL esté corriendo antes de iniciar la API
- Los PDFs se generan en memoria, no se guardan en disco por defecto
- La API usa CORS, por lo que puede ser consumida desde cualquier dominio
- En producción, considera agregar autenticación y autorización

## 🔄 Próximas Mejoras

- [ ] Autenticación con JWT
- [ ] Paginación en endpoints GET
- [ ] Filtros y búsqueda avanzada
- [ ] Endpoints para actualizar y eliminar registros
- [ ] Envío de PDFs por correo electrónico
- [ ] Dashboard de estadísticas
- [ ] Documentación con Swagger

## 📞 Soporte

Para reportar problemas o sugerencias, crea un issue en el repositorio.

## 📄 Licencia

ISC

---

**Desarrollado con ❤️ para la gestión eficiente de vehículos**
