# 📚 Ejemplos de Uso de la API

## Índice
1. [Configuración Inicial](#configuración-inicial)
2. [Ejemplos con cURL](#ejemplos-con-curl)
3. [Ejemplos con JavaScript/Fetch](#ejemplos-con-javascriptfetch)
4. [Manejo del PDF](#manejo-del-pdf)
5. [Casos de Uso Comunes](#casos-de-uso-comunes)

---

## Configuración Inicial

**Base URL de la API:**
```
http://localhost:3000/api
```

---

## Ejemplos con cURL

### 1. Obtener todos los clientes
```bash
curl http://localhost:3000/api/clientes
```

### 2. Obtener un cliente específico
```bash
curl http://localhost:3000/api/clientes/1
```

### 3. Crear un nuevo cliente
```bash
curl -X POST http://localhost:3000/api/clientes \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Roberto Gómez",
    "cedula": "001-9876543-2",
    "telefono": "809-555-9999",
    "correo": "roberto@example.com",
    "direccion": "Calle Principal #456"
  }'
```

### 4. Obtener vehículos disponibles
```bash
curl http://localhost:3000/api/vehiculos/disponibles
```

### 5. Crear cotización y generar PDF
```bash
curl -X POST http://localhost:3000/api/cotizaciones \
  -H "Content-Type: application/json" \
  -d '{
    "id_cliente": 1,
    "id_vehiculo": 2,
    "precio_ofrecido": 1800000.00,
    "observaciones": "Cliente desea financiamiento a 24 meses"
  }'
```

### 6. Descargar PDF de cotización
```bash
curl http://localhost:3000/api/cotizaciones/1/pdf \
  --output cotizacion_1.pdf
```

### 7. Obtener todas las ventas
```bash
curl http://localhost:3000/api/ventas
```

### 8. Obtener pagos de una venta específica
```bash
curl http://localhost:3000/api/pagos/venta/1
```

---

## Ejemplos con JavaScript/Fetch

### 1. Obtener todos los clientes
```javascript
async function obtenerClientes() {
  try {
    const response = await fetch('http://localhost:3000/api/clientes');
    const data = await response.json();
    
    if (data.success) {
      console.log('Clientes:', data.data);
      console.log('Total:', data.count);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

obtenerClientes();
```

### 2. Crear nuevo cliente
```javascript
async function crearCliente() {
  const nuevoCliente = {
    nombre: "Ana López",
    cedula: "002-1234567-9",
    telefono: "829-555-1234",
    correo: "ana.lopez@example.com",
    direccion: "Av. Winston Churchill #789"
  };

  try {
    const response = await fetch('http://localhost:3000/api/clientes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevoCliente)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Cliente creado:', data.data);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

crearCliente();
```

### 3. Obtener vehículos disponibles
```javascript
async function obtenerVehiculosDisponibles() {
  try {
    const response = await fetch('http://localhost:3000/api/vehiculos/disponibles');
    const data = await response.json();
    
    if (data.success) {
      data.data.forEach(vehiculo => {
        console.log(`${vehiculo.marca} ${vehiculo.modelo} ${vehiculo.anio} - RD$ ${vehiculo.precio}`);
      });
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

obtenerVehiculosDisponibles();
```

### 4. Crear cotización con PDF
```javascript
async function crearCotizacion() {
  const nuevaCotizacion = {
    id_cliente: 1,
    id_vehiculo: 2,
    precio_ofrecido: 1750000.00,
    observaciones: "Cliente solicita financiamiento a 12 meses con inicial del 30%"
  };

  try {
    const response = await fetch('http://localhost:3000/api/cotizaciones', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(nuevaCotizacion)
    });
    
    const data = await response.json();
    
    if (data.success) {
      console.log('Cotización creada:', data.data.id_cotizacion);
      console.log('PDF generado:', data.data.pdf.nombre_archivo);
      
      // El PDF está en base64, puedes descargarlo:
      descargarPDFDesdeBase64(data.data.pdf.base64, data.data.pdf.nombre_archivo);
    }
  } catch (error) {
    console.error('Error:', error);
  }
}

crearCotizacion();
```

---

## Manejo del PDF

### Opción 1: Descargar PDF desde base64 (frontend)

```javascript
function descargarPDFDesdeBase64(base64, nombreArchivo) {
  // Convertir base64 a blob
  const byteCharacters = atob(base64);
  const byteNumbers = new Array(byteCharacters.length);
  
  for (let i = 0; i < byteCharacters.length; i++) {
    byteNumbers[i] = byteCharacters.charCodeAt(i);
  }
  
  const byteArray = new Uint8Array(byteNumbers);
  const blob = new Blob([byteArray], { type: 'application/pdf' });
  
  // Crear enlace de descarga
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = nombreArchivo;
  link.click();
  
  // Limpiar
  window.URL.revokeObjectURL(url);
}
```

### Opción 2: Mostrar PDF en iframe (frontend)

```javascript
function mostrarPDFEnIframe(base64) {
  const iframe = document.getElementById('pdf-viewer');
  iframe.src = `data:application/pdf;base64,${base64}`;
}
```

```html
<iframe id="pdf-viewer" width="100%" height="600px"></iframe>
```

### Opción 3: Descargar PDF directamente

```javascript
async function descargarPDF(idCotizacion) {
  try {
    const response = await fetch(`http://localhost:3000/api/cotizaciones/${idCotizacion}/pdf`);
    const blob = await response.blob();
    
    // Crear enlace de descarga
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `cotizacion_${idCotizacion}.pdf`;
    link.click();
    
    // Limpiar
    window.URL.revokeObjectURL(url);
  } catch (error) {
    console.error('Error al descargar PDF:', error);
  }
}

// Uso
descargarPDF(1);
```

---

## Casos de Uso Comunes

### Caso 1: Proceso completo de cotización

```javascript
async function procesoCotizacion() {
  // 1. Obtener vehículos disponibles
  const vehiculosResponse = await fetch('http://localhost:3000/api/vehiculos/disponibles');
  const vehiculos = await vehiculosResponse.json();
  
  console.log('Vehículos disponibles:', vehiculos.data);
  
  // 2. Obtener información del cliente
  const clienteResponse = await fetch('http://localhost:3000/api/clientes/1');
  const cliente = await clienteResponse.json();
  
  console.log('Cliente:', cliente.data);
  
  // 3. Crear cotización
  const cotizacion = {
    id_cliente: 1,
    id_vehiculo: 2,
    precio_ofrecido: 1800000.00,
    observaciones: "Cliente prefiere pago en efectivo"
  };
  
  const cotizacionResponse = await fetch('http://localhost:3000/api/cotizaciones', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(cotizacion)
  });
  
  const result = await cotizacionResponse.json();
  
  if (result.success) {
    console.log('✅ Cotización creada exitosamente');
    console.log('ID:', result.data.id_cotizacion);
    console.log('PDF disponible');
    
    // Descargar PDF
    descargarPDFDesdeBase64(
      result.data.pdf.base64, 
      result.data.pdf.nombre_archivo
    );
  }
}

procesoCotizacion();
```

### Caso 2: Listar cotizaciones pendientes

```javascript
async function cotizacionesPendientes() {
  const response = await fetch('http://localhost:3000/api/cotizaciones');
  const data = await response.json();
  
  if (data.success) {
    const pendientes = data.data.filter(c => c.estado === 'Pendiente');
    
    console.log(`Cotizaciones pendientes: ${pendientes.length}`);
    pendientes.forEach(cot => {
      console.log(`
        ID: ${cot.id_cotizacion}
        Cliente: ${cot.cliente_nombre}
        Vehículo: ${cot.marca} ${cot.modelo}
        Precio ofrecido: RD$ ${cot.precio_ofrecido}
      `);
    });
  }
}

cotizacionesPendientes();
```

### Caso 3: Estadísticas de ventas

```javascript
async function estadisticasVentas() {
  const response = await fetch('http://localhost:3000/api/ventas');
  const data = await response.json();
  
  if (data.success) {
    const ventas = data.data;
    
    // Total de ventas
    const totalVentas = ventas.reduce((sum, v) => sum + parseFloat(v.precio_final), 0);
    
    // Ventas por método de pago
    const porMetodo = ventas.reduce((acc, v) => {
      acc[v.metodo_pago] = (acc[v.metodo_pago] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Estadísticas de Ventas:');
    console.log(`Total de ventas: ${ventas.length}`);
    console.log(`Monto total: RD$ ${totalVentas.toFixed(2)}`);
    console.log('Por método de pago:', porMetodo);
  }
}

estadisticasVentas();
```

### Caso 4: Buscar vehículo específico

```javascript
async function buscarVehiculo(marca, modelo) {
  const response = await fetch('http://localhost:3000/api/vehiculos');
  const data = await response.json();
  
  if (data.success) {
    const encontrado = data.data.find(
      v => v.marca.toLowerCase() === marca.toLowerCase() && 
           v.modelo.toLowerCase() === modelo.toLowerCase()
    );
    
    if (encontrado) {
      console.log('Vehículo encontrado:', encontrado);
      return encontrado;
    } else {
      console.log('Vehículo no encontrado');
      return null;
    }
  }
}

// Uso
buscarVehiculo('Toyota', 'Corolla');
```

---

## Ejemplo de Aplicación React Completa

```jsx
import React, { useState, useEffect } from 'react';

function CotizacionForm() {
  const [clientes, setClientes] = useState([]);
  const [vehiculos, setVehiculos] = useState([]);
  const [formData, setFormData] = useState({
    id_cliente: '',
    id_vehiculo: '',
    precio_ofrecido: '',
    observaciones: ''
  });

  useEffect(() => {
    // Cargar clientes y vehículos
    fetch('http://localhost:3000/api/clientes')
      .then(res => res.json())
      .then(data => setClientes(data.data));
    
    fetch('http://localhost:3000/api/vehiculos/disponibles')
      .then(res => res.json())
      .then(data => setVehiculos(data.data));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const response = await fetch('http://localhost:3000/api/cotizaciones', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('Cotización creada exitosamente');
      
      // Descargar PDF
      const link = document.createElement('a');
      link.href = `data:application/pdf;base64,${result.data.pdf.base64}`;
      link.download = result.data.pdf.nombre_archivo;
      link.click();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <select onChange={(e) => setFormData({...formData, id_cliente: e.target.value})}>
        <option value="">Seleccione cliente</option>
        {clientes.map(c => (
          <option key={c.id_cliente} value={c.id_cliente}>{c.nombre}</option>
        ))}
      </select>

      <select onChange={(e) => setFormData({...formData, id_vehiculo: e.target.value})}>
        <option value="">Seleccione vehículo</option>
        {vehiculos.map(v => (
          <option key={v.id_vehiculo} value={v.id_vehiculo}>
            {v.marca} {v.modelo} - RD$ {v.precio}
          </option>
        ))}
      </select>

      <input 
        type="number" 
        placeholder="Precio ofrecido"
        onChange={(e) => setFormData({...formData, precio_ofrecido: e.target.value})}
      />

      <textarea 
        placeholder="Observaciones"
        onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
      />

      <button type="submit">Crear Cotización y Generar PDF</button>
    </form>
  );
}

export default CotizacionForm;
```

---

## Testing con Postman

### Colección de Postman

Puedes importar esta colección en Postman:

```json
{
  "info": {
    "name": "CAR API",
    "schema": "https://schema.getpostman.com/json/collection/v2.1.0/collection.json"
  },
  "item": [
    {
      "name": "Obtener Clientes",
      "request": {
        "method": "GET",
        "url": "http://localhost:3000/api/clientes"
      }
    },
    {
      "name": "Crear Cotización",
      "request": {
        "method": "POST",
        "url": "http://localhost:3000/api/cotizaciones",
        "header": [
          {
            "key": "Content-Type",
            "value": "application/json"
          }
        ],
        "body": {
          "mode": "raw",
          "raw": "{\n  \"id_cliente\": 1,\n  \"id_vehiculo\": 2,\n  \"precio_ofrecido\": 1800000,\n  \"observaciones\": \"Prueba\"\n}"
        }
      }
    }
  ]
}
```

---

**¡Listo para usar! 🚀**
