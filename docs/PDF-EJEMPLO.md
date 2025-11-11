# 📄 Ejemplo de PDF Generado

## Vista Previa del PDF de Cotización

Cuando creas una cotización usando el endpoint `POST /api/cotizaciones`, el sistema genera automáticamente un PDF profesional con el siguiente contenido:

---

### 🎨 Diseño del PDF

```
╔══════════════════════════════════════════════════════════════════╗
║                                                                  ║
║              COTIZACIÓN DE VEHÍCULO                              ║
║         CAR - Sistema de Gestión de Vehículos                    ║
║                                                                  ║
║══════════════════════════════════════════════════════════════════║
║                                                                  ║
║  COTIZACIÓN #: 6          FECHA: 15 de enero de 2024, 10:30    ║
║  ESTADO: Pendiente                                               ║
║                                                                  ║
║──────────────────────────────────────────────────────────────────║
║                                                                  ║
║  DATOS DEL CLIENTE                                               ║
║  ════════════════                                                ║
║                                                                  ║
║  Nombre:   Carlos Gómez              Cédula:   001-1234567-8    ║
║  Teléfono: 809-555-1234              Correo:   carlosgomez@...  ║
║  Dirección: Av. Bolívar #45, Santo Domingo                      ║
║                                                                  ║
║──────────────────────────────────────────────────────────────────║
║                                                                  ║
║  DATOS DEL VEHÍCULO                                              ║
║  ═══════════════════                                             ║
║                                                                  ║
║  Marca:        Hyundai          Tipo:           Jeepeta         ║
║  Modelo:       Tucson           Transmisión:    Automática      ║
║  Año:          2020             Combustible:    Gasolina        ║
║  Color:        Gris             Kilometraje:    35,000 km       ║
║                                                                  ║
║──────────────────────────────────────────────────────────────────║
║                                                                  ║
║  DETALLES DE PRECIO                                              ║
║  ═══════════════════                                             ║
║                                                                  ║
║  Precio del Vehículo:                          RD$ 1,850,000.00 ║
║  Precio Ofrecido:                              RD$ 1,800,000.00 ║
║  Descuento:                       RD$ 50,000.00 (2.70%)         ║
║                                                                  ║
║──────────────────────────────────────────────────────────────────║
║                                                                  ║
║  OBSERVACIONES                                                   ║
║  ══════════════                                                  ║
║                                                                  ║
║  Cliente desea financiamiento a 12 meses con inicial del 30%.   ║
║  Se incluirá seguro completo en el financiamiento.               ║
║                                                                  ║
║──────────────────────────────────────────────────────────────────║
║                                                                  ║
║                                                                  ║
║     Esta cotización tiene una validez de 15 días a partir        ║
║            de la fecha de emisión.                               ║
║       Para más información, contacte a nuestro equipo            ║
║                    de ventas.                                    ║
║                                                                  ║
║         © 2024 CAR - Sistema de Gestión de Vehículos            ║
║                                                                  ║
╚══════════════════════════════════════════════════════════════════╝
```

---

## 🎨 Características del PDF

### Colores y Diseño

- **Encabezado**: Azul oscuro (#2c3e50)
- **Estado Pendiente**: Naranja (#f39c12)
- **Estado Aprobada**: Verde (#27ae60)
- **Estado Rechazada**: Rojo (#e74c3c)
- **Precio Ofrecido**: Azul (#2980b9)
- **Descuento**: Verde (#27ae60)

### Secciones

1. **Encabezado**
   - Título principal: "COTIZACIÓN DE VEHÍCULO"
   - Subtítulo: "CAR - Sistema de Gestión de Vehículos"
   - Línea divisoria azul

2. **Información de la Cotización**
   - Número de cotización
   - Fecha y hora de emisión
   - Estado (Pendiente/Aprobada/Rechazada)

3. **Datos del Cliente**
   - Nombre completo
   - Cédula de identidad
   - Teléfono de contacto
   - Correo electrónico
   - Dirección completa

4. **Datos del Vehículo**
   - Marca y modelo
   - Año de fabricación
   - Color
   - Tipo de vehículo
   - Tipo de transmisión
   - Tipo de combustible
   - Kilometraje

5. **Detalles de Precio**
   - Precio original del vehículo
   - Precio ofrecido por el cliente
   - Descuento calculado (en pesos y porcentaje)

6. **Observaciones**
   - Notas adicionales del vendedor
   - Condiciones especiales
   - Solicitudes del cliente

7. **Pie de Página**
   - Validez de la cotización
   - Información de contacto
   - Copyright

---

## 📏 Especificaciones Técnicas

- **Tamaño**: Letter (8.5" x 11")
- **Márgenes**: 50 puntos en todos los lados
- **Fuentes**:
  - Títulos: Helvetica-Bold
  - Texto normal: Helvetica
  - Texto cursiva: Helvetica-Oblique
- **Tamaños de fuente**:
  - Título principal: 24pt
  - Secciones: 14pt
  - Texto normal: 10-11pt
  - Pie de página: 8-9pt

---

## 💾 Formatos de Entrega

### 1. Base64 (en respuesta JSON)

Al crear una cotización, recibes el PDF en formato base64:

```json
{
  "success": true,
  "data": {
    "id_cotizacion": 6,
    "pdf": {
      "base64": "JVBERi0xLjMKJf////8KOCAwIG9iag...",
      "nombre_archivo": "cotizacion_6_1699725600000.pdf"
    }
  }
}
```

### 2. Descarga Directa

Usando el endpoint `/api/cotizaciones/:id/pdf`:

- **Content-Type**: application/pdf
- **Content-Disposition**: attachment; filename=cotizacion_6.pdf
- **Formato**: Archivo PDF binario listo para descargar

---

## 🔄 Ejemplo de Uso en el Frontend

### HTML + JavaScript (Descarga Automática)

```html
<!DOCTYPE html>
<html>
<head>
    <title>Generar Cotización</title>
</head>
<body>
    <button onclick="generarCotizacion()">Generar Cotización PDF</button>
    
    <script>
        async function generarCotizacion() {
            const response = await fetch('http://localhost:3000/api/cotizaciones', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    id_cliente: 1,
                    id_vehiculo: 2,
                    precio_ofrecido: 1800000,
                    observaciones: 'Cliente desea financiamiento'
                })
            });
            
            const data = await response.json();
            
            // Descargar PDF
            const link = document.createElement('a');
            link.href = `data:application/pdf;base64,${data.data.pdf.base64}`;
            link.download = data.data.pdf.nombre_archivo;
            link.click();
            
            alert('PDF generado y descargado exitosamente!');
        }
    </script>
</body>
</html>
```

### React (Visualización en Iframe)

```jsx
import React, { useState } from 'react';

function CotizacionPDF() {
    const [pdfBase64, setPdfBase64] = useState('');

    const generarCotizacion = async () => {
        const response = await fetch('http://localhost:3000/api/cotizaciones', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                id_cliente: 1,
                id_vehiculo: 2,
                precio_ofrecido: 1800000,
                observaciones: 'Cliente desea financiamiento'
            })
        });
        
        const data = await response.json();
        setPdfBase64(data.data.pdf.base64);
    };

    return (
        <div>
            <button onClick={generarCotizacion}>
                Generar Cotización PDF
            </button>
            
            {pdfBase64 && (
                <iframe
                    src={`data:application/pdf;base64,${pdfBase64}`}
                    width="100%"
                    height="600px"
                    title="Cotización PDF"
                />
            )}
        </div>
    );
}

export default CotizacionPDF;
```

---

## 📱 Vista Móvil

El PDF es responsive y se adapta bien a diferentes dispositivos:

- ✅ Visualizable en navegadores móviles
- ✅ Descargable en smartphones
- ✅ Compatible con lectores de PDF nativos
- ✅ Texto seleccionable y copiable
- ✅ Imprimible con calidad profesional

---

## 🖨️ Calidad de Impresión

El PDF está optimizado para impresión:

- **Resolución**: Vector-based (escalable sin pérdida)
- **Tamaño de archivo**: ~15-30 KB (muy ligero)
- **Compatibilidad**: PDF 1.3 (compatible con todos los lectores)
- **Impresión**: Tamaño carta (Letter) estándar

---

## 🎯 Casos de Uso

### 1. Envío por Correo Electrónico

```javascript
// Ejemplo con Nodemailer (a implementar)
const nodemailer = require('nodemailer');

async function enviarCotizacionPorCorreo(cotizacion, pdfBase64) {
    const transporter = nodemailer.createTransport({...});
    
    await transporter.sendMail({
        to: cotizacion.cliente_correo,
        subject: `Cotización #${cotizacion.id_cotizacion}`,
        text: 'Adjunto encontrará su cotización',
        attachments: [{
            filename: `cotizacion_${cotizacion.id_cotizacion}.pdf`,
            content: pdfBase64,
            encoding: 'base64'
        }]
    });
}
```

### 2. Almacenamiento en Servidor

```javascript
const fs = require('fs').promises;

async function guardarPDF(pdfBuffer, id_cotizacion) {
    const filename = `cotizacion_${id_cotizacion}.pdf`;
    await fs.writeFile(`./pdfs/${filename}`, pdfBuffer);
    return filename;
}
```

### 3. Subida a Cloud Storage

```javascript
// Ejemplo con AWS S3 (a implementar)
const AWS = require('aws-sdk');

async function subirPDFaS3(pdfBuffer, id_cotizacion) {
    const s3 = new AWS.S3();
    
    await s3.putObject({
        Bucket: 'cotizaciones',
        Key: `cotizacion_${id_cotizacion}.pdf`,
        Body: pdfBuffer,
        ContentType: 'application/pdf'
    }).promise();
}
```

---

**¡El PDF se ve profesional y está listo para enviar a tus clientes! 🎉**
