const PDFDocument = require('pdfkit');
const path = require('path');
const fs = require('fs');

/**
 * Genera un PDF simple de cotización (fondo blanco, sin diseño)
 * @param {Object} cotizacion - Datos completos de la cotización
 * @returns {Promise<Buffer>} - Buffer del PDF generado
 */
const generarPDFCotizacion = (cotizacion) => {
  return new Promise((resolve, reject) => {
    try {
      // Crear documento PDF
      const doc = new PDFDocument({
        size: 'LETTER',
        margins: {
          top: 50,
          bottom: 50,
          left: 50,
          right: 50
        }
      });
      
      // Buffer para almacenar el PDF
      const chunks = [];
      
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);
      
      // ===== ENCABEZADO CON INFO DE EMPRESA Y LOGO =====
      const startY = 50;
      
      // Información de la empresa (izquierda)
      doc
        .font('Helvetica-Bold')
        .fontSize(9)
        .fillColor('#000000')
        .text('AUTOSPOT', 50, startY);
      
      doc
        .fontSize(7)
        .font('Helvetica')
        .text('AUTO SPOT CLC, SRL', 50, startY + 14);
      
      doc
        .fontSize(7)
        .text('Dirección: Calle Jacinto Mañon No 25, Paraiso', 50, startY + 26);
      
      doc
        .fontSize(7)
        .text('Teléfono: 809-255-8888', 50, startY + 38);
      
      doc
        .fontSize(7)
        .font('Helvetica-Bold')
        .text('RNC: ', 50, startY + 50, { continued: true })
        .font('Helvetica')
        .text('130798087');
      
      // Logo (más grande, más arriba y más a la izquierda)
      const logoPath = path.join(__dirname, '..', '..', '..', 'Frontend', 'src', 'assets', 'logo.jpeg');
      if (fs.existsSync(logoPath)) {
        try {
          doc.image(logoPath, 380, 30, { width: 200, fit: [200, 160] });
        } catch (error) {
          console.warn('No se pudo cargar el logo:', error.message);
        }
      }
      
      // ===== INFORMACIÓN DE LA COTIZACIÓN =====
      const infoY = startY + 85;
      
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('Fecha: ', 50, infoY, { continued: true })
        .font('Helvetica')
        .text(formatearFechaCorta(cotizacion.fecha_cotizacion));
      
      // Espacio después de Fecha
      doc
        .font('Helvetica-Bold')
        .text('Atención: ', 50, infoY + 24, { continued: true })
        .font('Helvetica')
        .text('A QUIEN PUEDA INTERESAR');
      
      const clienteDocumento = cotizacion.cliente_documento || cotizacion.cliente_cedula || 'N/A';
      const clienteTexto = `${cotizacion.cliente_nombre || 'N/A'} / ${clienteDocumento}`;
      
      doc
        .font('Helvetica-Bold')
        .text('Cliente: ', 50, infoY + 38, { continued: true })
        .font('Helvetica')
        .text(clienteTexto);
      
      // Espacio después de Cliente
      const vehiculoLinea = `${cotizacion.marca || ''} ${cotizacion.modelo || ''} ${cotizacion.anio || ''}`.trim().toUpperCase();
      
      doc
        .fontSize(10)
        .font('Helvetica-Bold')
        .text(vehiculoLinea, 50, infoY + 58);
      
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('Chasis: ', 50, infoY + 72, { continued: true })
        .font('Helvetica')
        .text(cotizacion.chasis || 'N/A');
      
      doc
        .font('Helvetica-Bold')
        .text('Motor: ', 50, infoY + 86, { continued: true })
        .font('Helvetica')
        .text(cotizacion.motor || 'N/A');
      
      doc
        .font('Helvetica-Bold')
        .text('Transmisión: ', 50, infoY + 100, { continued: true })
        .font('Helvetica')
        .text(cotizacion.transmision || 'N/A');
      
      doc
        .font('Helvetica-Bold')
        .text('Color: ', 50, infoY + 114, { continued: true })
        .font('Helvetica')
        .text(cotizacion.color || 'N/A');
      
      // ===== EQUIPAMIENTO =====
      let equipamientoY = infoY + 140;
      
      if (cotizacion.equipamiento) {
        doc
          .fontSize(8)
          .font('Helvetica-Bold')
          .text('EQUIPAMIENTO', 50, equipamientoY);
        
        equipamientoY += 14;
        
        // Convertir equipamiento de string separado por comas a array
        const equipamientoItems = cotizacion.equipamiento.split(',').map(item => item.trim()).filter(item => item);
        
        // Organizar en columnas de máximo 18 items
        const itemsPerColumn = 18;
        const numColumns = Math.ceil(equipamientoItems.length / itemsPerColumn);
        const columnWidth = 180;
        
        for (let col = 0; col < numColumns; col++) {
          const startIdx = col * itemsPerColumn;
          const endIdx = Math.min(startIdx + itemsPerColumn, equipamientoItems.length);
          const columnItems = equipamientoItems.slice(startIdx, endIdx);
          const xPos = 50 + (col * columnWidth);
          
          let yPos = equipamientoY;
          columnItems.forEach(item => {
            doc
              .fontSize(7)
              .font('Helvetica')
              .text(`• ${item}`, xPos, yPos);
            yPos += 10;
          });
        }
        
        equipamientoY += (Math.min(itemsPerColumn, equipamientoItems.length) * 10) + 10;
      }
      
      // ===== INFORMACIÓN DE APROBACIÓN Y PRECIOS =====
      const footerStartY = equipamientoY + 80;
      
      // Precios y detalles a la derecha
      const rightColumnX = 300;
      let currentY = footerStartY;
      
      // Calcular precio en USD (asumiendo tasa de cambio)
      const tasaCambio = 65.67;
      const precioUSD = (cotizacion.precio_ofrecido / tasaCambio).toFixed(2);
      const precioRD = formatearPrecio(cotizacion.precio_ofrecido);
      
      // PRECIO* con alineación
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('PRECIO*:', rightColumnX, currentY);
      
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(`US$ ${formatearPrecio(precioUSD)}`, rightColumnX + 140, currentY, { align: 'right', width: 120 });
      
      currentY += 14;
      
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(`RD$ ${precioRD}`, rightColumnX + 140, currentY, { align: 'right', width: 120 });
      
      currentY += 20;
      
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('PLACA Y ENDOSO:', rightColumnX, currentY);
      
      doc
        .fontSize(8)
        .font('Helvetica')
        .text('US$ 140.00', rightColumnX + 140, currentY, { align: 'right', width: 120 });
      
      currentY += 14;
      
      doc
        .fontSize(7)
        .font('Helvetica-Oblique')
        .text('*Precio sujeto a variación de las tasas cambiarias.', rightColumnX, currentY, { width: 260 });
      
      currentY += 12;
      
      doc
        .fontSize(6)
        .font('Helvetica-BoldOblique')
        .text('TASA DE CAMBIO: ', rightColumnX, currentY, { continued: true })
        .text(`${tasaCambio}`);
      
      currentY += 14;
      
      // Guardar la posición Y de Garantía para alinear la línea de APROBADO POR
      const garantiaY = currentY;
      
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .text('Garantía: ', rightColumnX, garantiaY, { continued: true });
      
      // Guardar la posición X donde empieza el texto subrayado
      const xInicioSubrayado = doc.x;
      
      // Texto completo subrayado en la misma línea
      const textoSubrayado = '5 AÑOS O 100,000 KMS (LO QUE OCURRA PRIMERO)';
      
      doc
        .fontSize(8)
        .font('Helvetica')
        .text(textoSubrayado, { continued: false });
      
      // Calcular el ancho del texto completo para la línea
      const anchoTextoSubrayado = doc.widthOfString(textoSubrayado);
      
      // Ambas líneas subrayadas al mismo nivel (debajo del texto)
      const subrayaY = garantiaY + 9;
      
      // Subrayado del texto de garantía
      doc
        .moveTo(xInicioSubrayado, subrayaY)
        .lineTo(xInicioSubrayado + anchoTextoSubrayado, subrayaY)
        .stroke('#000000');
      
      // Línea de firma "APROBADO POR" al mismo nivel que el subrayado de garantía
      doc
        .moveTo(70, subrayaY)
        .lineTo(270, subrayaY)
        .stroke('#000000');
      
      doc
        .fontSize(8)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text('APROBADO POR', 70, subrayaY + 5, { align: 'center', width: 200 });
      
      // Información del vendedor en la parte inferior izquierda de la misma página
      // Calculamos la posición basándonos en la altura de la página menos margen
      const pageHeight = 792; // Altura de página LETTER en puntos
      const bottomMargin = 50;
      const vendorY = pageHeight - bottomMargin;
      
      const vNombre = cotizacion.vendedor_nombre || cotizacion.vendedor_nombre_completo || 'Marlene Taveras';
      const vCargo = cotizacion.vendedor_cargo || cotizacion.cargo || 'Asesor de Ventas';
      const vTelefono = cotizacion.vendedor_telefono || cotizacion.telefono || '809-255-8888';
      
      doc
        .fontSize(6)
        .font('Helvetica-Bold')
        .fillColor('#000000')
        .text(`${vNombre} | ${vCargo} | ${vTelefono}`, 50, vendorY, { align: 'left', lineBreak: false });
      
      // Finalizar el documento
      doc.end();
      
    } catch (error) {
      reject(error);
    }
  });
};

// ===== FUNCIONES AUXILIARES =====

/**
 * Formatea una fecha a formato legible
 */
function formatearFecha(fecha) {
  const date = new Date(fecha);
  const opciones = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  };
  return date.toLocaleDateString('es-DO', opciones);
}

/**
 * Formatea una fecha a formato corto (d/m/yyyy)
 */
function formatearFechaCorta(fecha) {
  const date = new Date(fecha);
  const dia = date.getDate();
  const mes = date.getMonth() + 1;
  const anio = date.getFullYear();
  return `${dia}/${mes}/${anio}`;
}

/**
 * Formatea un número con separadores de miles
 */
function formatearNumero(numero) {
  if (!numero) return '0';
  return numero.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

/**
 * Formatea un precio con 2 decimales y separadores
 */
function formatearPrecio(precio) {
  if (!precio) return '0.00';
  return parseFloat(precio).toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
}

module.exports = {
  generarPDFCotizacion
};
