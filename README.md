# 🚗 CAR - Sistema Completo de Gestión de Vehículos

Sistema completo con Backend API y Frontend para pruebas de todos los endpoints.

## 🚀 Inicio Rápido

### 1️⃣ Configurar Backend

```bash
cd Backend
npm install
```

Configura el archivo `.env` con tus credenciales de MySQL:
```env
PORT=3000
NODE_ENV=development
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_password
DB_NAME=CAR
DB_PORT=3306
```

Crea la base de datos ejecutando el script SQL en `Backend/docs/database.sql`

### 2️⃣ Configurar Frontend

```bash
cd Frontend
npm install
```

### 3️⃣ Ejecutar el Sistema

**Terminal 1 - Backend:**
```bash
cd Backend
npm start
```
El backend estará disponible en: `http://localhost:3000`

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```
El frontend estará disponible en: `http://localhost:5173`

## 📚 Documentación

### Backend
- `Backend/EMPIEZA-AQUI.md` - Guía inicial
- `Backend/QUICKSTART.md` - Inicio rápido
- `Backend/docs/ESTRUCTURA.md` - Estructura del proyecto
- `Backend/docs/EJEMPLOS.md` - Ejemplos de uso
- `Backend/docs/INSTALACION.md` - Instalación detallada

### Frontend
- `Frontend/SISTEMA-PRUEBAS.md` - Guía completa del sistema de pruebas
- `Frontend/README.md` - Información general

## 🎯 Funcionalidades

### Backend API
- ✅ CRUD de Clientes
- ✅ Consulta de Vehículos
- ✅ Creación de Cotizaciones con generación de PDF
- ✅ Gestión de Ventas
- ✅ Registro de Pagos

### Frontend (Sistema de Pruebas)
- ✅ Interfaz visual para todos los endpoints
- ✅ Creación de clientes desde formularios
- ✅ Consulta de vehículos disponibles
- ✅ Generación de cotizaciones
- ✅ Descarga de PDFs de cotizaciones
- ✅ Visualización de ventas y pagos
- ✅ Indicador de estado de la API
- ✅ Respuestas del servidor en tiempo real

## 🛠️ Tecnologías

### Backend
- Node.js + Express
- MySQL
- PDFKit (generación de PDFs)

### Frontend
- React 19
- TypeScript
- Vite

## 📝 Endpoints Disponibles

### Clientes
- `GET /api/clientes` - Listar todos
- `GET /api/clientes/:id` - Obtener por ID
- `POST /api/clientes` - Crear nuevo

### Vehículos
- `GET /api/vehiculos` - Listar todos
- `GET /api/vehiculos/disponibles` - Listar disponibles
- `GET /api/vehiculos/:id` - Obtener por ID

### Cotizaciones
- `GET /api/cotizaciones` - Listar todas
- `GET /api/cotizaciones/:id` - Obtener por ID
- `POST /api/cotizaciones` - Crear nueva (genera PDF)
- `GET /api/cotizaciones/:id/pdf` - Descargar PDF

### Ventas
- `GET /api/ventas` - Listar todas
- `GET /api/ventas/:id` - Obtener por ID

### Pagos
- `GET /api/pagos` - Listar todos
- `GET /api/pagos/venta/:id_venta` - Obtener por venta

## 🎨 Capturas de Pantalla

El frontend incluye:
- 📊 Dashboard con pestañas para cada módulo
- 🟢 Indicador de estado de la API
- 📝 Formularios validados para crear registros
- 📋 Tablas interactivas con los datos
- 📄 Descarga directa de PDFs
- 🎯 Visualización de respuestas del servidor

## 🔧 Desarrollo

### Estructura del Proyecto
```
api-cotizacion/
├── Backend/
│   ├── src/
│   │   ├── config/         # Configuración de BD
│   │   ├── controllers/    # Lógica de negocio
│   │   ├── routes/         # Rutas de la API
│   │   ├── services/       # Servicios (PDF, etc)
│   │   └── middleware/     # Validadores
│   ├── docs/              # Documentación
│   └── package.json
│
└── Frontend/
    ├── src/
    │   ├── components/     # Componentes React
    │   ├── services/       # Cliente API
    │   └── App.tsx
    └── package.json
```

## 🐛 Solución de Problemas

### Backend no inicia
- Verifica las credenciales de MySQL en `.env`
- Asegúrate de que MySQL esté corriendo
- Ejecuta el script de base de datos

### Frontend no se conecta
- Verifica que el backend esté corriendo en puerto 3000
- Revisa la consola del navegador para errores CORS
- Comprueba que ambos servicios estén activos

### PDFs no se generan
- Verifica permisos de escritura en la carpeta del backend
- Revisa los logs del backend
- Asegúrate de que PDFKit esté instalado

## 📞 Contacto y Soporte

Para más información, consulta la documentación en las carpetas `docs/` de cada módulo.

---

**Sistema CAR - Gestión Integral de Vehículos** 🚗✨
