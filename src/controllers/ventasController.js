const { pool } = require('../config/database');

// Obtener todas las ventas
const getAllVentas = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        v.*,
        cl.nombre as cliente_nombre,
        cl.cedula as cliente_cedula,
        ve.marca,
        ve.modelo,
        ve.anio,
        ve.color
      FROM ventas v
      INNER JOIN clientes cl ON v.id_cliente = cl.id_cliente
      INNER JOIN vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      ORDER BY v.fecha_venta DESC
    `);
    
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener ventas:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener las ventas',
      error: error.message
    });
  }
};

// Obtener venta por ID
const getVentaById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(`
      SELECT 
        v.*,
        cl.nombre as cliente_nombre,
        cl.cedula as cliente_cedula,
        cl.telefono as cliente_telefono,
        cl.correo as cliente_correo,
        ve.marca,
        ve.modelo,
        ve.anio,
        ve.color,
        ve.tipo,
        ve.transmision,
        ve.combustible
      FROM ventas v
      INNER JOIN clientes cl ON v.id_cliente = cl.id_cliente
      INNER JOIN vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      WHERE v.id_venta = ?
    `, [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Venta no encontrada'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener venta:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener la venta',
      error: error.message
    });
  }
};

module.exports = {
  getAllVentas,
  getVentaById
};
