const PDFDocument = require('pdfkit');

/**
 * Genera un PDF profesional de cotización
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
      
      // ===== ENCABEZADO =====
      doc
        .fontSize(24)
        .fillColor('#2c3e50')
        .font('Helvetica-Bold')
        .text('COTIZACIÓN DE VEHÍCULO', { align: 'center' });
      
      doc
        .moveDown(0.5)
        .fontSize(10)
        .fillColor('#7f8c8d')
        .font('Helvetica')
        .text('CAR - Sistema de Gestión de Vehículos', { align: 'center' });
      
      // Línea divisoria
      doc
        .moveDown(1)
        .strokeColor('#3498db')
        .lineWidth(2)
        .moveTo(50, doc.y)
        .lineTo(562, doc.y)
        .stroke();
      
      doc.moveDown(1.5);
      
      // ===== INFORMACIÓN DE LA COTIZACIÓN =====
      const yPosInfo = doc.y;
      
      doc
        .fontSize(10)
        .fillColor('#34495e')
        .font('Helvetica-Bold')
        .text('COTIZACIÓN #:', 50, yPosInfo);
      
      doc
        .font('Helvetica')
        .text(cotizacion.id_cotizacion, 150, yPosInfo);
      
      doc
        .font('Helvetica-Bold')
        .text('FECHA:', 300, yPosInfo);
      
      doc
        .font('Helvetica')
        .text(formatearFecha(cotizacion.fecha_cotizacion), 360, yPosInfo);
      
      doc.moveDown(0.5);
      
      doc
        .font('Helvetica-Bold')
        .text('ESTADO:', 50, doc.y);
      
      const estadoColor = cotizacion.estado === 'Aprobada' ? '#27ae60' : 
                         cotizacion.estado === 'Rechazada' ? '#e74c3c' : '#f39c12';
      
      doc
        .fillColor(estadoColor)
        .font('Helvetica-Bold')
        .text(cotizacion.estado, 150, doc.y - 12);
      
      doc.fillColor('#34495e');
      doc.moveDown(2);
      
      // ===== INFORMACIÓN DEL CLIENTE =====
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('DATOS DEL CLIENTE');
      
      doc
        .moveDown(0.5)
        .strokeColor('#bdc3c7')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(562, doc.y)
        .stroke();
      
      doc.moveDown(0.8);
      
      const clienteY = doc.y;
      
      doc
        .fontSize(10)
        .fillColor('#34495e')
        .font('Helvetica-Bold')
        .text('Nombre:', 50, clienteY);
      
      doc
        .font('Helvetica')
        .text(cotizacion.cliente_nombre, 120, clienteY, { width: 200 });
      
      doc
        .font('Helvetica-Bold')
        .text('Cédula:', 320, clienteY);
      
      doc
        .font('Helvetica')
        .text(cotizacion.cliente_cedula || 'N/A', 380, clienteY);
      
      doc.moveDown(0.8);
      
      doc
        .font('Helvetica-Bold')
        .text('Teléfono:', 50, doc.y);
      
      doc
        .font('Helvetica')
        .text(cotizacion.cliente_telefono || 'N/A', 120, doc.y - 12);
      
      doc
        .font('Helvetica-Bold')
        .text('Correo:', 320, doc.y);
      
      doc
        .font('Helvetica')
        .text(cotizacion.cliente_correo || 'N/A', 380, doc.y - 12, { width: 180 });
      
      doc.moveDown(0.8);
      
      doc
        .font('Helvetica-Bold')
        .text('Dirección:', 50, doc.y);
      
      doc
        .font('Helvetica')
        .text(cotizacion.cliente_direccion || 'N/A', 120, doc.y - 12, { width: 440 });
      
      doc.moveDown(2);
      
      // ===== INFORMACIÓN DEL VEHÍCULO =====
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('DATOS DEL VEHÍCULO');
      
      doc
        .moveDown(0.5)
        .strokeColor('#bdc3c7')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(562, doc.y)
        .stroke();
      
      doc.moveDown(0.8);
      
      // Tabla de características del vehículo
      const vehiculoData = [
        ['Marca:', cotizacion.marca],
        ['Modelo:', cotizacion.modelo],
        ['Año:', cotizacion.anio],
        ['Color:', cotizacion.color],
        ['Tipo:', cotizacion.tipo],
        ['Transmisión:', cotizacion.transmision],
        ['Combustible:', cotizacion.combustible],
        ['Kilometraje:', formatearNumero(cotizacion.kilometraje) + ' km']
      ];
      
      let currentY = doc.y;
      const leftColumn = 50;
      const rightColumn = 300;
      
      vehiculoData.forEach((item, index) => {
        if (index % 2 === 0 && index > 0) {
          currentY += 20;
        }
        
        const x = index % 2 === 0 ? leftColumn : rightColumn;
        
        doc
          .fontSize(10)
          .font('Helvetica-Bold')
          .text(item[0], x, currentY);
        
        doc
          .font('Helvetica')
          .text(item[1], x + 80, currentY);
      });
      
      doc.y = currentY + 30;
      
      // ===== INFORMACIÓN DE PRECIOS =====
      doc
        .fontSize(14)
        .font('Helvetica-Bold')
        .fillColor('#2c3e50')
        .text('DETALLES DE PRECIO');
      
      doc
        .moveDown(0.5)
        .strokeColor('#bdc3c7')
        .lineWidth(1)
        .moveTo(50, doc.y)
        .lineTo(562, doc.y)
        .stroke();
      
      doc.moveDown(1);
      
      // Tabla de precios
      const preciosY = doc.y;
      
      doc
        .fontSize(11)
        .font('Helvetica-Bold')
        .text('Precio del Vehículo:', 50, preciosY);
      
      doc
        .font('Helvetica')
        .text('RD$ ' + formatearPrecio(cotizacion.precio_vehiculo), 400, preciosY, { align: 'right' });
      
      doc.moveDown(0.8);
      
      doc
        .font('Helvetica-Bold')
        .fillColor('#2980b9')
        .text('Precio Ofrecido:', 50, doc.y);
      
      doc
        .font('Helvetica-Bold')
        .fillColor('#2980b9')
        .text('RD$ ' + formatearPrecio(cotizacion.precio_ofrecido), 400, doc.y - 12, { align: 'right' });
      
      doc.fillColor('#34495e');
      
      const diferencia = cotizacion.precio_vehiculo - cotizacion.precio_ofrecido;
      const descuento = ((diferencia / cotizacion.precio_vehiculo) * 100).toFixed(2);
      
      doc.moveDown(0.8);
      
      doc
        .font('Helvetica')
        .fillColor('#27ae60')
        .text('Descuento:', 50, doc.y);
      
      doc
        .text(`RD$ ${formatearPrecio(diferencia)} (${descuento}%)`, 400, doc.y - 12, { align: 'right' });
      
      doc.fillColor('#34495e');
      doc.moveDown(2);
      
      // ===== OBSERVACIONES =====
      if (cotizacion.observaciones) {
        doc
          .fontSize(12)
          .font('Helvetica-Bold')
          .fillColor('#2c3e50')
          .text('OBSERVACIONES');
        
        doc
          .moveDown(0.5)
          .strokeColor('#bdc3c7')
          .lineWidth(1)
          .moveTo(50, doc.y)
          .lineTo(562, doc.y)
          .stroke();
        
        doc.moveDown(0.8);
        
        doc
          .fontSize(10)
          .font('Helvetica')
          .fillColor('#34495e')
          .text(cotizacion.observaciones, { width: 512, align: 'justify' });
        
        doc.moveDown(2);
      }
      
      // ===== PIE DE PÁGINA =====
      doc
        .moveDown(3)
        .fontSize(8)
        .fillColor('#95a5a6')
        .font('Helvetica-Oblique')
        .text(
          'Esta cotización tiene una validez de 15 días a partir de la fecha de emisión.',
          50,
          doc.page.height - 100,
          { align: 'center', width: 512 }
        );
      
      doc
        .fontSize(8)
        .text(
          'Para más información, contacte a nuestro equipo de ventas.',
          { align: 'center', width: 512 }
        );
      
      doc
        .moveDown(0.5)
        .fontSize(9)
        .fillColor('#7f8c8d')
        .font('Helvetica-Bold')
        .text(
          '© ' + new Date().getFullYear() + ' CAR - Sistema de Gestión de Vehículos',
          { align: 'center', width: 512 }
        );
      
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
