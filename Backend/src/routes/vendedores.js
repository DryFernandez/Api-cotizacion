const express = require('express');
const router = express.Router();
const vendedoresController = require('../controllers/vendedoresController');

// GET - Obtener todos los vendedores activos
router.get('/', vendedoresController.getAllVendedores);

// GET - Obtener vendedor por ID
router.get('/:id', vendedoresController.getVendedorById);

module.exports = router;
