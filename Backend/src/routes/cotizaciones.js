const express = require('express');
const router = express.Router();
const cotizacionesController = require('../controllers/cotizacionesController');

// GET - Obtener todas las cotizaciones
router.get('/', cotizacionesController.getAllCotizaciones);

// GET - Obtener cotización por ID
router.get('/:id', cotizacionesController.getCotizacionById);

// POST - Crear nueva cotización y generar PDF
router.post('/', cotizacionesController.createCotizacion);

// GET - Descargar PDF de cotización
router.get('/:id/pdf', cotizacionesController.descargarPDFCotizacion);

module.exports = router;
