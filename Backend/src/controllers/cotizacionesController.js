const { pool } = require('../config/database');
const pdfService = require('../services/pdfService');

// Obtener todas las cotizaciones
const getAllCotizaciones = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        cl.nombre as cliente_nombre,
        cl.cedula as cliente_cedula,
        cl.telefono as cliente_telefono,
        cl.correo as cliente_correo,
        v.marca,
        v.modelo,
        v.anio,
        v.color,
        v.precio as precio_vehiculo
      FROM cotizaciones c
      INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
      INNER JOIN vehiculos v ON c.id_vehiculo = v.id_vehiculo
      ORDER BY c.fecha_cotizacion DESC
    `);
    
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener cotizaciones:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las cotizaciones',
      error: error.message
    });
  }
};

// Obtener cotización por ID
const getCotizacionById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        c.*,
        cl.nombre as cliente_nombre,
        cl.cedula as cliente_cedula,
        cl.telefono as cliente_telefono,
        cl.correo as cliente_correo,
        cl.direccion as cliente_direccion,
        v.marca,
        v.modelo,
        v.anio,
        v.color,
        v.tipo,
        v.transmision,
        v.combustible,
        v.kilometraje,
        v.precio as precio_vehiculo
      FROM cotizaciones c
      INNER JOIN clientes cl ON c.id_cliente = cl.id_cliente
      INNER JOIN vehiculos v ON c.id_vehiculo = v.id_vehiculo
      WHERE c.id_cotizacion = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la cotización',
      error: error.message
    });
  }
};

// Crear nueva cotización y generar PDF
const createCotizacion = async (req, res) => {
  try {
    const { 
      tipo_cliente,
      nombre_empresa,
      nombre_cliente,
      documento,
      telefono,
      email,
      direccion,
      id_vehiculo,
      id_vendedor,
      tipo_cotizacion,
      precio_ofrecido,
      observaciones
    } = req.body;
    
    // Validaciones básicas
    if (!nombre_cliente || !documento || !id_vehiculo || !id_vendedor || !precio_ofrecido) {
      return res.status(400).json({
        success: false,
        message: 'Faltan datos requeridos: nombre_cliente, documento, id_vehiculo, id_vendedor, precio_ofrecido'
      });
    }
    
    // Verificar si el cliente ya existe
    let id_cliente;
    let clienteQuery;
    
    if (tipo_cliente === 'Empresa') {
      [clienteQuery] = await pool.query(
        'SELECT id_cliente FROM clientes WHERE rnc = ?',
        [documento]
      );
    } else {
      [clienteQuery] = await pool.query(
        'SELECT id_cliente FROM clientes WHERE cedula = ?',
        [documento]
      );
    }
    
    // Si el cliente no existe, crearlo
    if (clienteQuery.length === 0) {
      let insertQuery;
      if (tipo_cliente === 'Empresa') {
        [insertQuery] = await pool.query(
          `INSERT INTO clientes (tipo_cliente, nombre_empresa, nombre, rnc, telefono, correo, direccion) 
           VALUES (?, ?, ?, ?, ?, ?, ?)`,
          [tipo_cliente, nombre_empresa, nombre_cliente, documento, telefono, email, direccion]
        );
      } else {
        [insertQuery] = await pool.query(
          `INSERT INTO clientes (tipo_cliente, nombre, cedula, telefono, correo, direccion) 
           VALUES (?, ?, ?, ?, ?, ?)`,
          [tipo_cliente || 'Individual', nombre_cliente, documento, telefono, email, direccion]
        );
      }
      id_cliente = insertQuery.insertId;
    } else {
      id_cliente = clienteQuery[0].id_cliente;
    }
    
    // Verificar que el vehículo existe
    const [vehiculo] = await pool.query(
      'SELECT * FROM vehiculos WHERE id_vehiculo = ?',
      [id_vehiculo]
    );
    
    if (vehiculo.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }
    
    // Verificar que el vendedor existe
    const [vendedor] = await pool.query(
      'SELECT * FROM vendedores WHERE id_vendedor = ?',
      [id_vendedor]
    );
    
    if (vendedor.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }
    
    // Insertar la cotización
    const [result] = await pool.query(
      `INSERT INTO cotizaciones (
        id_cliente, 
        id_vehiculo, 
        id_vendedor,
        tipo_cotizacion,
        precio_ofrecido, 
        observaciones, 
        estado
      ) VALUES (?, ?, ?, ?, ?, ?, 'Pendiente')`,
      [
        id_cliente, 
        id_vehiculo, 
        id_vendedor,
        tipo_cotizacion || 'Sin Chasis',
        precio_ofrecido, 
        observaciones || null
      ]
    );
    
    const id_cotizacion = result.insertId;
    
    // Obtener los datos completos de la cotización usando la vista
    const [cotizacionCompleta] = await pool.query(
      'SELECT * FROM vista_cotizaciones_completas WHERE id_cotizacion = ?',
      [id_cotizacion]
    );
    
    // Generar el PDF
    const pdfBuffer = await pdfService.generarPDFCotizacion(cotizacionCompleta[0]);
    
    // Convertir el buffer a base64
    const pdfBase64 = pdfBuffer.toString('base64');
    
    res.status(201).json({
      success: true,
      message: 'Cotización creada exitosamente',
      data: {
        id_cotizacion,
        id_cliente,
        cotizacion: cotizacionCompleta[0],
        pdf: {
          base64: pdfBase64,
          nombre_archivo: `cotizacion_${id_cotizacion}_${Date.now()}.pdf`
        }
      }
    });
  } catch (error) {
    console.error('Error al crear cotización:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear la cotización',
      error: error.message
    });
  }
};

// Descargar PDF de cotización
const descargarPDFCotizacion = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Obtener los datos completos desde la vista para incluir vendedor y nuevos campos
    const [rows] = await pool.query(
      'SELECT * FROM vista_cotizaciones_completas WHERE id_cotizacion = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cotización no encontrada'
      });
    }
    
  // Generar el PDF
  const pdfBuffer = await pdfService.generarPDFCotizacion(rows[0]);
    
    // Configurar headers para descarga
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename=cotizacion_${id}.pdf`);
    res.setHeader('Content-Length', pdfBuffer.length);
    
    res.send(pdfBuffer);
  } catch (error) {
    console.error('Error al descargar PDF:', error);
    res.status(500).json({
      success: false,
      message: 'Error al generar el PDF',
      error: error.message
    });
  }
};

module.exports = {
  getAllCotizaciones,
  getCotizacionById,
  createCotizacion,
  descargarPDFCotizacion
};
