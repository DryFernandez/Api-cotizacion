# 📂 Estructura del Proyecto CAR-COTI

```
CAR-COTI/
│
├── 📄 .env                          # Variables de entorno (CREAR desde .env.example)
├── 📄 .env.example                  # Plantilla de variables de entorno
├── 📄 .gitignore                    # Archivos ignorados por Git
├── 📄 package.json                  # Dependencias y scripts
├── 📄 README.md                     # Documentación principal
├── 📄 QUICKSTART.md                 # Guía de inicio rápido
│
├── 📁 src/                          # Código fuente de la aplicación
│   │
│   ├── 📄 server.js                 # Punto de entrada del servidor
│   │
│   ├── 📁 config/                   # Configuraciones
│   │   └── 📄 database.js           # Conexión a MySQL
│   │
│   ├── 📁 controllers/              # Lógica de negocio
│   │   ├── 📄 clientesController.js
│   │   ├── 📄 vehiculosController.js
│   │   ├── 📄 cotizacionesController.js  ⭐ (Genera PDFs)
│   │   ├── 📄 ventasController.js
│   │   └── 📄 pagosController.js
│   │
│   ├── 📁 routes/                   # Definición de rutas
│   │   ├── 📄 clientes.js
│   │   ├── 📄 vehiculos.js
│   │   ├── 📄 cotizaciones.js       ⭐ (POST para crear cotización + PDF)
│   │   ├── 📄 ventas.js
│   │   └── 📄 pagos.js
│   │
│   ├── 📁 services/                 # Servicios auxiliares
│   │   └── 📄 pdfService.js         ⭐ (Generación de PDFs con PDFKit)
│   │
│   ├── 📁 middleware/               # Middlewares personalizados
│   │   └── 📄 validators.js         # Validaciones
│   │
│   └── 📁 utils/                    # Utilidades (vacío por ahora)
│
└── 📁 docs/                         # Documentación
    ├── 📄 database.sql              # Script de creación de BD
    ├── 📄 INSTALACION.md            # Guía de instalación
    ├── 📄 EJEMPLOS.md               # Ejemplos de uso
    └── 📄 PDF-EJEMPLO.md            # Información del PDF
```

---

## 🔑 Archivos Clave

### ⭐ Más Importantes

| Archivo | Descripción | Prioridad |
|---------|-------------|-----------|
| `src/server.js` | Punto de entrada, inicia el servidor | 🔴 CRÍTICO |
| `src/services/pdfService.js` | **Genera PDFs profesionales** | 🔴 CRÍTICO |
| `src/controllers/cotizacionesController.js` | **Crea cotizaciones y genera PDFs** | 🔴 CRÍTICO |
| `src/config/database.js` | Conexión a MySQL | 🔴 CRÍTICO |
| `.env` | Credenciales de BD | 🔴 CRÍTICO |
| `docs/database.sql` | Script de BD | 🟡 IMPORTANTE |

---

## 📊 Base de Datos

### Tablas Creadas

```
CAR (Base de Datos)
├── clientes          (Información de clientes)
├── vehiculos         (Catálogo de vehículos)
├── cotizaciones      (Cotizaciones generadas) ⭐
├── ventas            (Ventas realizadas)
└── pagos             (Pagos de ventas)
```

### Relaciones

```
clientes ──┐
           ├── cotizaciones ──┐
vehiculos ─┘                  ├── ventas ── pagos
                              │
                              └── (genera PDF)
```

---

## 🚀 Flujo de la Aplicación

### Crear Cotización con PDF

```
1. Cliente hace POST /api/cotizaciones
   ↓
2. cotizacionesController.createCotizacion()
   ↓
3. Valida datos (id_cliente, id_vehiculo, precio_ofrecido)
   ↓
4. Verifica que cliente y vehículo existen en BD
   ↓
5. Inserta cotización en tabla 'cotizaciones'
   ↓
6. Obtiene datos completos con JOINs
   ↓
7. Llama a pdfService.generarPDFCotizacion()
   ↓
8. PDFKit genera PDF en memoria
   ↓
9. Convierte buffer a base64
   ↓
10. Retorna JSON con cotización y PDF
```

---

## 📦 Dependencias (package.json)

### Producción
```json
{
  "express": "^4.18.2",        // Framework web
  "mysql2": "^3.6.5",          // Cliente MySQL
  "dotenv": "^16.3.1",         // Variables de entorno
  "pdfkit": "^0.13.0",         // Generación de PDFs ⭐
  "cors": "^2.8.5",            // CORS
  "express-validator": "^7.0.1" // Validaciones
}
```

### Desarrollo
```json
{
  "nodemon": "^3.0.2"          // Auto-reinicio
}
```

---

## 🎯 Scripts NPM

```bash
npm start       # Inicia servidor en producción
npm run dev     # Inicia con nodemon (desarrollo)
```

---

## 🔐 Variables de Entorno (.env)

```env
PORT=3000              # Puerto del servidor
NODE_ENV=development   # Entorno (development/production)

DB_HOST=localhost      # Host de MySQL
DB_USER=root          # Usuario de MySQL
DB_PASSWORD=          # Contraseña (CONFIGURA ESTO) ⚠️
DB_NAME=CAR           # Nombre de la base de datos
DB_PORT=3306          # Puerto de MySQL
```

---

## 🛣️ Rutas de la API

### Base: `http://localhost:3000/api`

```
GET    /clientes                    # Listar clientes
POST   /clientes                    # Crear cliente
GET    /clientes/:id                # Cliente por ID

GET    /vehiculos                   # Listar vehículos
GET    /vehiculos/disponibles       # Vehículos disponibles
GET    /vehiculos/:id               # Vehículo por ID

GET    /cotizaciones                # Listar cotizaciones
POST   /cotizaciones                # Crear cotización + PDF ⭐
GET    /cotizaciones/:id            # Cotización por ID
GET    /cotizaciones/:id/pdf        # Descargar PDF ⭐

GET    /ventas                      # Listar ventas
GET    /ventas/:id                  # Venta por ID

GET    /pagos                       # Listar pagos
GET    /pagos/venta/:id_venta       # Pagos por venta
```

---

## 🎨 Tecnologías Utilizadas

```
Backend Framework:  Express.js
Base de Datos:      MySQL
PDF Generation:     PDFKit ⭐
Environment Vars:   dotenv
CORS:              cors middleware
Validation:        express-validator
```

---

## 📈 Próximos Pasos (Opcional)

- [ ] Autenticación con JWT
- [ ] Upload de imágenes de vehículos
- [ ] Envío de PDFs por email
- [ ] Dashboard de estadísticas
- [ ] Paginación en endpoints GET
- [ ] Filtros avanzados de búsqueda
- [ ] Documentación con Swagger
- [ ] Tests automatizados
- [ ] Deploy en producción

---

## 🔧 Comandos Útiles

```bash
# Instalación inicial
npm install

# Iniciar servidor
npm start              # Producción
npm run dev            # Desarrollo con auto-reinicio

# Base de datos
mysql -u root -p < docs/database.sql    # Crear BD

# Git
git init
git add .
git commit -m "Initial commit"

# Limpiar caché
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

---

## 📞 Health Check

```bash
# Verificar que el servidor está corriendo
curl http://localhost:3000/health

# Respuesta esperada:
{
  "status": "OK",
  "timestamp": "2024-01-15T10:30:00.000Z",
  "database": "Connected"
}
```

---

## ✅ Checklist de Instalación

- [ ] Node.js instalado (v14+)
- [ ] MySQL instalado y corriendo
- [ ] Clonar/descargar proyecto
- [ ] `npm install`
- [ ] Ejecutar `docs/database.sql` en MySQL
- [ ] Configurar `.env` con credenciales
- [ ] `npm run dev`
- [ ] Probar `http://localhost:3000`
- [ ] Probar endpoint de cotizaciones

---

**¡Todo listo para desarrollar! 🚀**
