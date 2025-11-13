const express = require('express');
const router = express.Router();
const ventasController = require('../controllers/ventasController');

// GET - Obtener todas las ventas
router.get('/', ventasController.getAllVentas);

// GET - Obtener venta por ID
router.get('/:id', ventasController.getVentaById);

module.exports = router;
