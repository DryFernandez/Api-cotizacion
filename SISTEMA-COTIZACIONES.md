# 🚗 Sistema de Cotizaciones CAR - Guía Completa

## 🎯 Descripción

Sistema profesional de cotizaciones de vehículos con proceso guiado paso a paso. Incluye generación automática de PDFs y gestión completa de clientes empresariales e individuales.

## ✨ Características Principales

### 📋 Proceso de 5 Pasos

1. **Tipo de Cliente**: Selección entre Individual o Empresa
2. **Datos del Cliente**: Información de contacto (nombre, teléfono, email, dirección)
3. **Documento**: Cédula (Individual) o RNC (Empresa)
4. **Vehículo a Cotizar**: Selección visual con detalles completos
5. **Vendedor Asignado**: Team que prepara la cotización

### 🎨 Interfaz Moderna

- ✅ Diseño paso a paso con barra de progreso visual
- ✅ Cards interactivos para vehículos y vendedores
- ✅ Resumen flotante de la información ingresada
- ✅ Validación en tiempo real
- ✅ Animaciones suaves y transiciones
- ✅ Totalmente responsivo (desktop, tablet, móvil)

### 💼 Dos Tipos de Cliente

#### Individual (Persona Física)
- Nombre completo
- Cédula
- Teléfono, email, dirección

#### Empresa (Persona Jurídica)
- Nombre de la empresa
- RNC (Registro Nacional de Contribuyentes)
- Nombre del representante
- Teléfono, email, dirección

### 📄 Dos Tipos de Cotización

1. **Sin Chasis**: Cotización estándar
2. **Con Chasis**: Incluye número de chasis en el documento

### 🚙 Información Completa del Vehículo

- Marca, Modelo, Año
- Color
- Número de Chasis
- Motor
- Tipo de vehículo
- Transmisión
- Combustible
- Kilometraje
- Número de pasajeros
- Número de puertas
- Tracción (4x2, 4x4, etc.)

### 👥 Gestión de Vendedores

- Nombre completo
- Cargo
- Teléfono y email
- Firma digital (URL)
- Sello digital (URL)
- Estado activo/inactivo

## 🚀 Cómo Usar

### Inicio Rápido

1. **Actualizar Base de Datos**:
   ```bash
   mysql -u root -p CAR < Backend/docs/database-cotizaciones-update.sql
   ```

2. **Iniciar Backend**:
   ```bash
   cd Backend
   npm start
   ```

3. **Iniciar Frontend**:
   ```bash
   cd Frontend
   npm run dev
   ```

4. **Acceder al Sistema**:
   - Abrir navegador en `http://localhost:5173`

### Crear una Cotización

#### Paso 1: Tipo de Cliente
- Selecciona entre "Individual" o "Empresa"
- La interfaz se adaptará según tu selección

#### Paso 2: Datos del Cliente
- **Si es Individual**: Ingresa nombre, teléfono, email
- **Si es Empresa**: Ingresa nombre de empresa, representante, contacto

#### Paso 3: Documento de Identidad
- **Individual**: Número de cédula (formato: 001-1234567-8)
- **Empresa**: RNC (formato: 131-12345-6)

#### Paso 4: Seleccionar Vehículo
- Visualiza todos los vehículos disponibles en formato de cards
- Haz clic en el vehículo deseado
- Selecciona tipo de cotización (Con/Sin Chasis)
- Ajusta el precio ofrecido si es necesario

#### Paso 5: Vendedor
- Selecciona al vendedor que atenderá esta cotización
- Agrega observaciones adicionales si es necesario
- Haz clic en "Generar Cotización"

#### Resultado
- ✅ Cotización creada exitosamente
- ✅ PDF generado automáticamente
- ✅ Opción para descargar el PDF
- ✅ Crear nueva cotización

## 🗄️ Estructura de Datos

### Nueva Tabla: vendedores
```sql
CREATE TABLE vendedores (
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
```

### Campos Nuevos en clientes
```sql
tipo_cliente ENUM('Individual', 'Empresa') DEFAULT 'Individual'
rnc VARCHAR(20)
nombre_empresa VARCHAR(200)
```

### Campos Nuevos en vehiculos
```sql
chasis VARCHAR(50)
motor VARCHAR(50)
pasajeros INT DEFAULT 5
puertas INT DEFAULT 4
traccion VARCHAR(20)
```

### Campos Nuevos en cotizaciones
```sql
id_vendedor INT
tipo_cotizacion ENUM('Con Chasis', 'Sin Chasis') DEFAULT 'Sin Chasis'
nombre_solicitante VARCHAR(150)
documento_solicitante VARCHAR(50)
```

## 🎨 Componentes del Frontend

### `CotizadorPage.tsx`
Componente principal con:
- Gestión de 5 pasos
- Validación de formularios
- Integración con API
- Generación y descarga de PDF

### `CotizadorPage.css`
Estilos completos con:
- Barra de progreso animada
- Cards interactivos
- Resumen flotante
- Diseño responsivo

## 📡 Endpoints de API

### Vendedores
```
GET    /api/vendedores
GET    /api/vendedores/:id
```

### Cotizaciones (Actualizado)
```
POST   /api/cotizaciones
```

**Body de la Petición:**
```json
{
  "tipo_cliente": "Individual | Empresa",
  "nombre_empresa": "string (solo para empresas)",
  "nombre_cliente": "string",
  "documento": "string (cédula o RNC)",
  "telefono": "string",
  "email": "string",
  "direccion": "string",
  "id_vehiculo": number,
  "id_vendedor": number,
  "tipo_cotizacion": "Con Chasis | Sin Chasis",
  "precio_ofrecido": number,
  "observaciones": "string"
}
```

**Respuesta:**
```json
{
  "success": true,
  "message": "Cotización creada exitosamente",
  "data": {
    "id_cotizacion": 123,
    "id_cliente": 45,
    "cotizacion": { ... },
    "pdf": {
      "base64": "...",
      "nombre_archivo": "cotizacion_123_1699999999999.pdf"
    }
  }
}
```

## 🎯 Vista de Base de Datos

### vista_cotizaciones_completas
Vista SQL que combina toda la información:
- Datos del cliente (individual o empresa)
- Información completa del vehículo
- Datos del vendedor (con firma y sello)
- Tipo de cotización
- Precios y descuentos

```sql
SELECT * FROM vista_cotizaciones_completas;
```

## 📝 Procedimiento Almacenado

### sp_crear_cotizacion
Procedimiento que:
1. Verifica si el cliente existe
2. Crea el cliente si no existe
3. Crea la cotización
4. Retorna IDs generados

```sql
CALL sp_crear_cotizacion(
    p_tipo_cliente,
    p_nombre_empresa,
    p_nombre_cliente,
    p_documento,
    p_telefono,
    p_email,
    p_direccion,
    p_id_vehiculo,
    p_id_vendedor,
    p_tipo_cotizacion,
    p_precio_ofrecido,
    p_observaciones,
    @id_cotizacion,
    @id_cliente
);
```

## 🎨 Personalización

### Agregar Firma y Sello del Vendedor

1. Guarda las imágenes en una carpeta pública (ej: `public/firmas/`, `public/sellos/`)
2. Actualiza la base de datos:

```sql
UPDATE vendedores 
SET firma_url = '/firmas/juan_mendez.png',
    sello_url = '/sellos/gerente.png'
WHERE id_vendedor = 1;
```

### Modificar Campos del Vehículo

Edita el archivo `database-cotizaciones-update.sql` antes de ejecutarlo para agregar/quitar campos.

## 🔒 Validaciones

### Frontend
- ✅ Campos requeridos marcados
- ✅ Validación de email
- ✅ Formato de teléfono
- ✅ Validación por paso
- ✅ Deshabilitación de botón "Continuar" si faltan datos

### Backend
- ✅ Verificación de datos requeridos
- ✅ Validación de vehículo existente
- ✅ Validación de vendedor activo
- ✅ Creación/actualización automática de clientes
- ✅ Manejo de errores robusto

## 📊 Reportes y Consultas Útiles

### Cotizaciones por Vendedor
```sql
SELECT 
    v.nombre_completo,
    COUNT(c.id_cotizacion) as total_cotizaciones,
    SUM(c.precio_ofrecido) as valor_total
FROM vendedores v
LEFT JOIN cotizaciones c ON v.id_vendedor = c.id_vendedor
GROUP BY v.id_vendedor;
```

### Vehículos Más Cotizados
```sql
SELECT 
    CONCAT(v.marca, ' ', v.modelo) as vehiculo,
    COUNT(c.id_cotizacion) as veces_cotizado
FROM vehiculos v
LEFT JOIN cotizaciones c ON v.id_vehiculo = c.id_vehiculo
GROUP BY v.id_vehiculo
ORDER BY veces_cotizado DESC;
```

### Clientes Empresariales
```sql
SELECT 
    nombre_empresa,
    nombre as representante,
    rnc,
    telefono,
    correo
FROM clientes
WHERE tipo_cliente = 'Empresa';
```

## 🚀 Próximas Mejoras

- [ ] Subida de firma y sello desde el frontend
- [ ] Historial de cotizaciones por cliente
- [ ] Envío de PDF por email automático
- [ ] Plantillas de PDF personalizables
- [ ] Dashboard de estadísticas
- [ ] Exportar cotizaciones a Excel
- [ ] Sistema de seguimiento de cotizaciones
- [ ] Notificaciones push

## 📞 Soporte

Para dudas o problemas:
1. Revisa la documentación en `Backend/docs/`
2. Consulta los ejemplos en `Backend/docs/EJEMPLOS.md`
3. Verifica los logs del backend
4. Inspecciona la consola del navegador (F12)

---

**Sistema de Cotizaciones CAR** - Profesional, Completo y Fácil de Usar 🎯✨
