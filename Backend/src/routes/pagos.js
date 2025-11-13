const express = require('express');
const router = express.Router();
const pagosController = require('../controllers/pagosController');

// GET - Obtener todos los pagos
router.get('/', pagosController.getAllPagos);

// GET - Obtener pagos por venta
router.get('/venta/:id_venta', pagosController.getPagosByVenta);

module.exports = router;
