# 🔄 Actualización de Base de Datos - Sistema de Cotizaciones

## 📋 Instrucciones de Instalación

### Paso 1: Ejecutar el Script SQL

Conecta a MySQL y ejecuta el siguiente comando:

```bash
mysql -u root -p CAR < Backend/docs/database-cotizaciones-update.sql
```

O si prefieres desde el cliente de MySQL:

```sql
SOURCE Backend/docs/database-cotizaciones-update.sql;
```

### Paso 2: Verificar las Actualizaciones

Verifica que las nuevas tablas y campos se hayan creado correctamente:

```sql
USE CAR;

-- Verificar tabla de vendedores
DESCRIBE vendedores;

-- Verificar nuevos campos en clientes
DESCRIBE clientes;

-- Verificar nuevos campos en vehículos
DESCRIBE vehiculos;

-- Verificar nuevos campos en cotizaciones
DESCRIBE cotizaciones;

-- Ver vista creada
SELECT * FROM vista_cotizaciones_completas LIMIT 5;
```

## 📊 Nuevas Estructuras

### Tabla: `vendedores`
- id_vendedor (PK)
- nombre_completo
- cargo
- telefono
- email
- firma_url
- sello_url
- activo
- fecha_registro

### Clientes - Campos Agregados:
- tipo_cliente (Individual/Empresa)
- rnc (para empresas)
- nombre_empresa (para empresas)

### Vehículos - Campos Agregados:
- chasis
- motor
- pasajeros
- puertas
- traccion

### Cotizaciones - Campos Agregados:
- id_vendedor (FK a vendedores)
- tipo_cotizacion (Con Chasis/Sin Chasis)
- nombre_solicitante
- documento_solicitante

## 🎯 Datos de Prueba Incluidos

El script incluye:
- ✅ 5 vendedores de ejemplo
- ✅ 3 clientes empresariales
- ✅ Actualización de vehículos existentes con nuevos campos
- ✅ Asignación de vendedor a cotizaciones existentes

## 🚀 Después de Ejecutar el Script

1. **Reinicia el servidor Backend**:
   ```bash
   cd Backend
   npm start
   ```

2. **Inicia el Frontend**:
   ```bash
   cd Frontend
   npm run dev
   ```

3. **Accede al Sistema**:
   - Abre: http://localhost:5173
   - Verás el nuevo formulario de cotizaciones paso a paso

## ✅ Validación

Para validar que todo funciona correctamente:

```sql
-- Ver todos los vendedores
SELECT * FROM vendedores;

-- Ver la vista de cotizaciones completas
SELECT * FROM vista_cotizaciones_completas;

-- Probar el procedimiento almacenado
CALL sp_crear_cotizacion(
    'Individual',
    NULL,
    'Test Usuario',
    '001-9999999-9',
    '809-555-9999',
    'test@example.com',
    'Test Address',
    1,  -- id_vehiculo
    1,  -- id_vendedor
    'Sin Chasis',
    1000000.00,
    'Test cotización',
    @id_cotizacion,
    @id_cliente
);

SELECT @id_cotizacion, @id_cliente;
```

## 🔧 Solución de Problemas

### Error: "Table already exists"
No hay problema, el script usa `IF NOT EXISTS` y `IF NOT EXISTS` para evitar duplicados.

### Error: "Column already exists"
El script usa `ADD COLUMN IF NOT EXISTS`, por lo que es seguro ejecutarlo múltiples veces.

### Los datos de prueba no se insertan
Si los IDs ya existen, puedes eliminar esa sección del script o modificar los IDs.

## 📝 Notas Importantes

- ✅ Es seguro ejecutar el script múltiples veces
- ✅ Los datos existentes no se perderán
- ✅ Solo se agregan nuevas tablas y campos
- ✅ Las relaciones (FK) se crean de forma segura

---

**¡Listo para empezar a crear cotizaciones profesionales!** 🎉
