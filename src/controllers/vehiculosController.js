const { pool } = require('../config/database');

// Obtener todos los vehículos
const getAllVehiculos = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM vehiculos ORDER BY fecha_ingreso DESC');
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener vehículos:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los vehículos',
      error: error.message
    });
  }
};

// Obtener vehículo por ID
const getVehiculoById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM vehiculos WHERE id_vehiculo = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Vehículo no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener vehículo:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el vehículo',
      error: error.message
    });
  }
};

// Obtener vehículos disponibles
const getVehiculosDisponibles = async (req, res) => {
  try {
    const [rows] = await pool.query(
      "SELECT * FROM vehiculos WHERE estado = 'Disponible' ORDER BY fecha_ingreso DESC"
    );
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener vehículos disponibles:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los vehículos disponibles',
      error: error.message
    });
  }
};

module.exports = {
  getAllVehiculos,
  getVehiculoById,
  getVehiculosDisponibles
};
