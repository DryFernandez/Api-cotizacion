const { pool } = require('../config/database');

// Obtener todos los pagos
const getAllPagos = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        p.*,
        v.id_cliente,
        v.id_vehiculo,
        v.precio_final,
        cl.nombre as cliente_nombre,
        ve.marca,
        ve.modelo
      FROM pagos p
      INNER JOIN ventas v ON p.id_venta = v.id_venta
      INNER JOIN clientes cl ON v.id_cliente = cl.id_cliente
      INNER JOIN vehiculos ve ON v.id_vehiculo = ve.id_vehiculo
      ORDER BY p.fecha_pago DESC
    `);
    
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos',
      error: error.message
    });
  }
};

// Obtener pagos por venta
const getPagosByVenta = async (req, res) => {
  try {
    const { id_venta } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM pagos WHERE id_venta = ? ORDER BY fecha_pago DESC',
      [id_venta]
    );
    
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener pagos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los pagos',
      error: error.message
    });
  }
};

module.exports = {
  getAllPagos,
  getPagosByVenta
};
