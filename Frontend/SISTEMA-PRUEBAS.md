# 🚗 CAR API Tester - Sistema de Pruebas Frontend

Sistema completo de pruebas para la API de gestión de vehículos CAR. Este frontend permite probar todos los endpoints disponibles en el backend de forma visual e interactiva.

## 🎯 Características

### Endpoints Disponibles

#### 🧑‍💼 Clientes
- ✅ `GET /api/clientes` - Obtener todos los clientes
- ✅ `GET /api/clientes/:id` - Obtener cliente por ID
- ✅ `POST /api/clientes` - Crear nuevo cliente

#### 🚗 Vehículos
- ✅ `GET /api/vehiculos` - Obtener todos los vehículos
- ✅ `GET /api/vehiculos/disponibles` - Obtener vehículos disponibles
- ✅ `GET /api/vehiculos/:id` - Obtener vehículo por ID

#### 📊 Cotizaciones
- ✅ `GET /api/cotizaciones` - Obtener todas las cotizaciones
- ✅ `GET /api/cotizaciones/:id` - Obtener cotización por ID
- ✅ `POST /api/cotizaciones` - Crear cotización (genera PDF automáticamente)
- ✅ `GET /api/cotizaciones/:id/pdf` - Descargar PDF de cotización

#### 💰 Ventas
- ✅ `GET /api/ventas` - Obtener todas las ventas
- ✅ `GET /api/ventas/:id` - Obtener venta por ID

#### 💳 Pagos
- ✅ `GET /api/pagos` - Obtener todos los pagos
- ✅ `GET /api/pagos/venta/:id_venta` - Obtener pagos por venta

## 🚀 Cómo Usar

### Prerequisitos

1. **Backend corriendo**: Asegúrate de que el servidor backend esté corriendo en `http://localhost:3000`
   ```bash
   cd Backend
   npm install
   npm start
   ```

2. **Base de datos configurada**: Verifica que la base de datos MySQL esté configurada correctamente

### Instalación

1. Navega al directorio del frontend:
   ```bash
   cd Frontend
   ```

2. Instala las dependencias:
   ```bash
   npm install
   ```

3. Inicia el servidor de desarrollo:
   ```bash
   npm run dev
   ```

4. Abre tu navegador en la URL que muestra Vite (normalmente `http://localhost:5173`)

## 📋 Guía de Uso

### Panel Principal

Al abrir la aplicación verás:
- **Estado de la API**: Indicador visual que muestra si el backend está online/offline
- **Pestañas**: Una pestaña para cada tipo de endpoint (Clientes, Vehículos, Cotizaciones, Ventas, Pagos)

### Crear un Nuevo Cliente

1. Ve a la pestaña **Clientes**
2. Busca la sección **POST /api/clientes**
3. Completa el formulario:
   - Nombre (requerido)
   - Apellido (requerido)
   - Email (requerido)
   - Teléfono (requerido)
   - Dirección (opcional)
   - Ciudad (opcional)
4. Haz clic en **Crear Cliente**
5. Verás la respuesta del servidor y la tabla se actualizará automáticamente

### Consultar Vehículos

1. Ve a la pestaña **Vehículos**
2. Opciones disponibles:
   - **Obtener Todos los Vehículos**: Lista completa
   - **Obtener Vehículos Disponibles**: Solo los disponibles para venta
   - **Buscar por ID**: Ingresa un ID específico

### Crear una Cotización

1. Ve a la pestaña **Cotizaciones**
2. Busca la sección **POST /api/cotizaciones**
3. Completa el formulario:
   - Selecciona un cliente
   - Selecciona un vehículo (el precio se autocompletará)
   - Ingresa el enganche
   - Define el plazo en meses
   - Establece la tasa de interés
4. Haz clic en **Crear Cotización y Generar PDF**
5. El sistema creará la cotización y generará el PDF automáticamente

### Descargar PDF de Cotización

1. Ve a la pestaña **Cotizaciones**
2. Busca la sección **GET /api/cotizaciones/:id/pdf**
3. Ingresa el ID de la cotización
4. Haz clic en **Descargar PDF**
5. El archivo se descargará automáticamente

## 🎨 Características de la Interfaz

- **Diseño Responsivo**: Funciona en desktop, tablet y móvil
- **Indicador de Estado**: Muestra si la API está online/offline
- **Visualización de Respuestas**: Todas las respuestas del servidor se muestran en formato JSON
- **Tablas Interactivas**: Visualiza los datos en tablas ordenadas
- **Validación de Formularios**: Campos requeridos marcados
- **Mensajes de Error**: Notificaciones claras cuando algo falla
- **Loading States**: Indicadores visuales durante las peticiones

## 🔧 Estructura del Proyecto

```
Frontend/src/
├── components/
│   ├── APITester.tsx         # Componente principal
│   ├── ClientesTab.tsx       # Pestaña de clientes
│   ├── VehiculosTab.tsx      # Pestaña de vehículos
│   ├── CotizacionesTab.tsx   # Pestaña de cotizaciones
│   ├── VentasTab.tsx         # Pestaña de ventas
│   └── PagosTab.tsx          # Pestaña de pagos
├── services/
│   └── apiService.ts         # Servicio centralizado de API
├── App.tsx                   # Componente raíz
├── App.css                   # Estilos principales
└── index.css                 # Estilos base
```

## 🛠️ Tecnologías Utilizadas

- **React 19** - Framework de UI
- **TypeScript** - Tipado estático
- **Vite** - Build tool y dev server
- **Fetch API** - Peticiones HTTP

## 📝 Notas Importantes

1. **CORS**: El backend debe tener CORS habilitado para `http://localhost:5173` (o el puerto que uses)
2. **Puerto del Backend**: El sistema espera que el backend esté en `http://localhost:3000`
3. **Datos de Prueba**: Asegúrate de tener datos en la base de datos para probar las consultas

## 🐛 Solución de Problemas

### La API aparece como Offline
- Verifica que el backend esté corriendo en el puerto 3000
- Revisa la consola del backend para errores
- Comprueba que la base de datos esté conectada

### No puedo crear clientes
- Verifica que todos los campos requeridos estén completos
- Revisa la consola del navegador para errores
- Comprueba que el email sea válido

### El PDF no se descarga
- Asegúrate de que la cotización existe
- Verifica que el ID sea correcto
- Revisa que el backend tenga permisos de escritura en la carpeta de PDFs

## 📞 Soporte

Para más información sobre los endpoints y estructura de datos, consulta la documentación del backend en:
- `Backend/docs/ESTRUCTURA.md`
- `Backend/docs/EJEMPLOS.md`

---

**Desarrollado para el sistema CAR - Gestión de Vehículos** 🚗✨
