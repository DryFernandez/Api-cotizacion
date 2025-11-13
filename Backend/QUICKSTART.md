# 🚀 INICIO RÁPIDO

## ⚡ Configuración en 5 Pasos

### 1️⃣ Instalar Dependencias
```bash
npm install
```

### 2️⃣ Configurar Base de Datos
```bash
# Ejecutar script SQL en MySQL
mysql -u root -p < docs/database.sql
```

### 3️⃣ Configurar Variables de Entorno
```bash
# Copiar archivo de ejemplo
cp .env.example .env

# Editar .env con tus credenciales de MySQL
```

### 4️⃣ Iniciar Servidor
```bash
# Modo desarrollo
npm run dev

# Modo producción
npm start
```

### 5️⃣ Probar la API
```bash
# Abrir en el navegador
http://localhost:3000
```

---

## 📝 Ejemplo Rápido: Crear Cotización con PDF

### Con cURL:
```bash
curl -X POST http://localhost:3000/api/cotizaciones \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "id_vehiculo": 2,
    "precio_ofrecido": 1800000,
    "observaciones": "Cliente desea financiamiento"
  }'
```

### Con JavaScript:
```javascript
fetch('http://localhost:3000/api/cotizaciones', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    id_cliente: 1,
    id_vehiculo: 2,
    precio_ofrecido: 1800000,
    observaciones: 'Cliente desea financiamiento'
  })
})
.then(res => res.json())
.then(data => {
  console.log('Cotización creada:', data.data.id_cotizacion);
  console.log('PDF generado en base64:', data.data.pdf.base64);
});
```

---

## 📡 Endpoints Principales

| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/clientes` | Listar clientes |
| GET | `/api/vehiculos` | Listar vehículos |
| GET | `/api/vehiculos/disponibles` | Vehículos disponibles |
| **POST** | **`/api/cotizaciones`** | **Crear cotización + PDF** |
| GET | `/api/cotizaciones/:id/pdf` | Descargar PDF |
| GET | `/api/ventas` | Listar ventas |
| GET | `/api/pagos` | Listar pagos |

---

## 🎯 Lo Más Importante

### Endpoint Principal: Crear Cotización con PDF

**Request:**
```json
POST /api/cotizaciones
Content-Type: application/json

{
  "id_cliente": 1,
  "id_vehiculo": 2,
  "precio_ofrecido": 1800000.00,
  "observaciones": "Notas adicionales (opcional)"
}
```

**Response:**
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
      "precio_ofrecido": 1800000.00,
      ...
    },
    "pdf": {
      "base64": "JVBERi0xLjMKJf////8...",
      "nombre_archivo": "cotizacion_6_1699725600000.pdf"
    }
  }
}
```

---

## 🔧 Configuración del .env

```env
PORT=3000
NODE_ENV=development

DB_HOST=localhost
DB_USER=root
DB_PASSWORD=tu_contraseña
DB_NAME=CAR
DB_PORT=3306
```

---

## 📚 Documentación Completa

- 📖 **README.md** - Documentación completa
- 🔧 **docs/INSTALACION.md** - Guía de instalación detallada
- 💡 **docs/EJEMPLOS.md** - Ejemplos de uso y código
- 📄 **docs/PDF-EJEMPLO.md** - Información sobre el PDF generado
- 💾 **docs/database.sql** - Script de base de datos

---

## ⚠️ Solución Rápida de Problemas

### Puerto ocupado
```bash
# Cambiar puerto en .env
PORT=3001
```

### Error de conexión MySQL
```bash
# Verificar que MySQL está corriendo
# Windows:
net start MySQL80

# Linux/Mac:
sudo service mysql start
```

### Dependencias faltantes
```bash
npm install
```

---

## ✨ Características Destacadas

✅ **Generación automática de PDFs profesionales**
✅ **Base de datos MySQL completamente configurada**
✅ **Validaciones y manejo de errores**
✅ **Arquitectura escalable y organizada**
✅ **Documentación completa y ejemplos**
✅ **CORS habilitado para frontend**
✅ **Health check endpoint**

---

## 🎨 Tecnologías

- **Node.js** + **Express** - Backend framework
- **MySQL2** - Base de datos
- **PDFKit** - Generación de PDFs
- **dotenv** - Variables de entorno
- **CORS** - Cross-Origin Resource Sharing

---

**¡Listo para usar! 🚀**

Para más información, consulta el **README.md** principal.
