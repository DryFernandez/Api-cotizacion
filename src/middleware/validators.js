/**
 * Middleware de validación para el endpoint de crear cotización
 */
const validarCotizacion = (req, res, next) => {
  const { id_cliente, id_vehiculo, precio_ofrecido } = req.body;
  const errores = [];

  // Validar campos requeridos
  if (!id_cliente) {
    errores.push('El campo id_cliente es requerido');
  }

  if (!id_vehiculo) {
    errores.push('El campo id_vehiculo es requerido');
  }

  if (!precio_ofrecido) {
    errores.push('El campo precio_ofrecido es requerido');
  }

  // Validar tipos de datos
  if (id_cliente && (isNaN(id_cliente) || id_cliente <= 0)) {
    errores.push('id_cliente debe ser un número positivo');
  }

  if (id_vehiculo && (isNaN(id_vehiculo) || id_vehiculo <= 0)) {
    errores.push('id_vehiculo debe ser un número positivo');
  }

  if (precio_ofrecido && (isNaN(precio_ofrecido) || precio_ofrecido <= 0)) {
    errores.push('precio_ofrecido debe ser un número positivo');
  }

  // Si hay errores, retornar respuesta de error
  if (errores.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errores
    });
  }

  // Si todo está bien, continuar
  next();
};

/**
 * Middleware de validación para el endpoint de crear cliente
 */
const validarCliente = (req, res, next) => {
  const { nombre } = req.body;
  const errores = [];

  // Validar campos requeridos
  if (!nombre || nombre.trim() === '') {
    errores.push('El campo nombre es requerido');
  }

  // Validar longitud del nombre
  if (nombre && nombre.length > 100) {
    errores.push('El nombre no puede exceder 100 caracteres');
  }

  // Si hay errores, retornar respuesta de error
  if (errores.length > 0) {
    return res.status(400).json({
      success: false,
      message: 'Errores de validación',
      errores
    });
  }

  // Si todo está bien, continuar
  next();
};

module.exports = {
  validarCotizacion,
  validarCliente
};
