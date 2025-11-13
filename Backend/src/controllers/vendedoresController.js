const { pool } = require('../config/database');

// Obtener todos los vendedores activos
const getAllVendedores = async (req, res) => {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id_vendedor,
        nombre_completo,
        cargo,
        telefono,
        email,
        firma_url,
        sello_url,
        activo
      FROM vendedores
      WHERE activo = TRUE
      ORDER BY nombre_completo
    `);
    
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener vendedores:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los vendedores',
      error: error.message
    });
  }
};

// Obtener vendedor por ID
const getVendedorById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query(
      'SELECT * FROM vendedores WHERE id_vendedor = ?',
      [id]
    );
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vendedor no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener vendedor:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el vendedor',
      error: error.message
    });
  }
};

module.exports = {
  getAllVendedores,
  getVendedorById
};
