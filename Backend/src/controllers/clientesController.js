const { pool } = require('../config/database');

// Obtener todos los clientes
const getAllClientes = async (req, res) => {
  try {
    const [rows] = await pool.query('SELECT * FROM clientes ORDER BY fecha_registro DESC');
    res.status(200).json({
      success: true,
      data: rows,
      count: rows.length
    });
  } catch (error) {
    console.error('Error al obtener clientes:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener los clientes',
      error: error.message
    });
  }
};

// Obtener cliente por ID
const getClienteById = async (req, res) => {
  try {
    const { id } = req.params;
    const [rows] = await pool.query('SELECT * FROM clientes WHERE id_cliente = ?', [id]);
    
    if (rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Cliente no encontrado'
      });
    }
    
    res.status(200).json({
      success: true,
      data: rows[0]
    });
  } catch (error) {
    console.error('Error al obtener cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el cliente',
      error: error.message
    });
  }
};

// Crear nuevo cliente
const createCliente = async (req, res) => {
  try {
    const { nombre, cedula, telefono, correo, direccion } = req.body;
    
    // Validaciones básicas
    if (!nombre) {
      return res.status(400).json({
        success: false,
        message: 'El nombre es requerido'
      });
    }
    
    const [result] = await pool.query(
      'INSERT INTO clientes (nombre, cedula, telefono, correo, direccion) VALUES (?, ?, ?, ?, ?)',
      [nombre, cedula, telefono, correo, direccion]
    );
    
    res.status(201).json({
      success: true,
      message: 'Cliente creado exitosamente',
      data: {
        id_cliente: result.insertId,
        nombre,
        cedula,
        telefono,
        correo,
        direccion
      }
    });
  } catch (error) {
    console.error('Error al crear cliente:', error);
    res.status(500).json({
      success: false,
      message: 'Error al crear el cliente',
      error: error.message
    });
  }
};

module.exports = {
  getAllClientes,
  getClienteById,
  createCliente
};
