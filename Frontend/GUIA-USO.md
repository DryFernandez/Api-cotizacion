# 🎯 Guía de Uso - Sistema de Pruebas CAR API

## 🚀 Inicio Rápido (3 Pasos)

### Paso 1: Iniciar el Backend
```bash
cd Backend
npm start
```
✅ Espera ver el mensaje: "🚀 Servidor corriendo exitosamente"

### Paso 2: Iniciar el Frontend
```bash
cd Frontend
npm run dev
```
✅ Abre tu navegador en `http://localhost:5173`

### Paso 3: ¡Empieza a probar!
La interfaz está lista para usar 🎉

---

## 📖 Tutorial de Uso

### 🟢 Verificar que la API esté Online

Cuando abras el frontend, verás en la parte superior derecha:
- **✅ API Online** (verde) = Todo está listo
- **❌ API Offline** (rojo) = El backend no está corriendo

### 🧑‍💼 Crear un Cliente Nuevo

1. Haz clic en la pestaña **🧑‍💼 Clientes**
2. Desplázate hasta **➕ POST /api/clientes**
3. Completa el formulario:
   ```
   Nombre: Juan
   Apellido: Pérez
   Email: juan.perez@email.com
   Teléfono: 555-1234
   Dirección: Calle Principal 123
   Ciudad: Ciudad de México
   ```
4. Haz clic en **Crear Cliente**
5. ¡Listo! Verás el nuevo cliente en la tabla

### 🚗 Consultar Vehículos

1. Haz clic en la pestaña **🚗 Vehículos**
2. Haz clic en **Obtener Todos los Vehículos**
3. Verás una tabla con todos los vehículos disponibles

**Opciones adicionales:**
- **Obtener Vehículos Disponibles**: Solo muestra vehículos en stock
- **Buscar por ID**: Ingresa un número para buscar un vehículo específico

### 📊 Crear una Cotización (¡Incluye PDF!)

1. Haz clic en la pestaña **📊 Cotizaciones**
2. Desplázate hasta **➕ POST /api/cotizaciones**
3. Completa el formulario:
   ```
   Cliente: Selecciona de la lista
   Vehículo: Selecciona de la lista (el precio se autocompleta)
   Enganche: 50000
   Plazo (meses): 24
   Tasa de Interés: 12.5
   ```
4. Haz clic en **Crear Cotización y Generar PDF**
5. El sistema:
   - ✅ Crea la cotización
   - ✅ Calcula pagos mensuales
   - ✅ Genera el PDF automáticamente
   - ✅ Te muestra toda la información

### 📄 Descargar PDF de una Cotización

1. En la pestaña **📊 Cotizaciones**
2. Busca la sección **📄 GET /api/cotizaciones/:id/pdf**
3. Ingresa el ID de la cotización (lo ves en la tabla)
4. Haz clic en **Descargar PDF**
5. El archivo se descarga automáticamente

### 💰 Ver Ventas Realizadas

1. Haz clic en la pestaña **💰 Ventas**
2. Haz clic en **Obtener Todas las Ventas**
3. Verás todas las ventas con detalles completos

### 💳 Consultar Pagos

1. Haz clic en la pestaña **💳 Pagos**
2. Opciones:
   - **Obtener Todos los Pagos**: Lista completa
   - **Buscar por Venta**: Ingresa el ID de una venta para ver sus pagos

---

## 🎨 Características de la Interfaz

### 📤 Respuesta del Servidor
Cada vez que hagas una petición, verás la respuesta completa del servidor en formato JSON. Esto incluye:
- Datos retornados
- Mensajes de éxito o error
- Códigos de estado

### 📊 Tablas Interactivas
- Las tablas se actualizan automáticamente después de crear registros
- Muestran toda la información de manera organizada
- Incluyen badges de estado (disponible, vendido, etc.)

### 🎯 Validación de Formularios
- Los campos marcados con * son obligatorios
- El sistema valida emails y números telefónicos
- Los mensajes de error son claros y específicos

---

## 💡 Ejemplos de Uso Común

### Flujo Completo: De Cliente a Cotización

```
1. Crear Cliente
   └─> Ir a Clientes → Crear nuevo
   
2. Ver Vehículos Disponibles
   └─> Ir a Vehículos → Obtener Disponibles
   
3. Crear Cotización
   └─> Ir a Cotizaciones → Seleccionar cliente y vehículo
   
4. Descargar PDF
   └─> Usar el ID de la cotización creada
```

### Consultar Todo el Sistema

```
1. Clientes → Obtener Todos
2. Vehículos → Obtener Todos
3. Cotizaciones → Obtener Todas
4. Ventas → Obtener Todas
5. Pagos → Obtener Todos
```

---

## ❓ Preguntas Frecuentes

### ¿Por qué aparece "API Offline"?
El backend no está corriendo. Abre una terminal y ejecuta:
```bash
cd Backend
npm start
```

### ¿Puedo crear vehículos desde el frontend?
Actualmente no, solo se pueden consultar. Los vehículos se crean directamente en la base de datos.

### ¿Dónde se guardan los PDFs?
En el servidor backend, en la carpeta `pdfs/`. También se descargan automáticamente al navegador.

### ¿Cómo sé qué ID usar para buscar?
Después de crear un registro, verás su ID en la respuesta del servidor y en las tablas.

### ¿Puedo probar en móvil?
¡Sí! La interfaz es completamente responsiva y funciona en cualquier dispositivo.

---

## 🎯 Trucos y Tips

1. **Usa el botón "Actualizar" del header** para verificar el estado de la API en cualquier momento

2. **Revisa siempre la "Respuesta del Servidor"** para ver detalles de la operación

3. **Las tablas se actualizan automáticamente** después de crear registros

4. **Los selectores de cliente y vehículo** se cargan automáticamente al abrir la pestaña de cotizaciones

5. **El precio del vehículo se autocompleta** cuando seleccionas uno en el formulario de cotización

---

## 🆘 Solución de Problemas Rápida

| Problema | Solución |
|----------|----------|
| API Offline | Inicia el backend: `cd Backend && npm start` |
| No aparecen clientes/vehículos | Verifica que haya datos en la BD |
| Error al crear cliente | Revisa que el email sea único |
| PDF no descarga | Verifica que la cotización exista |
| Formulario no se envía | Completa todos los campos requeridos (*) |

---

**¡Listo para empezar! 🚀** 

Si tienes problemas, revisa los logs en la consola del navegador (F12) y en la terminal del backend.
