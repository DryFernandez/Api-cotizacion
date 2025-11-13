const express = require('express');
const router = express.Router();
const clientesController = require('../controllers/clientesController');

// GET - Obtener todos los clientes
router.get('/', clientesController.getAllClientes);

// GET - Obtener cliente por ID
router.get('/:id', clientesController.getClienteById);

// POST - Crear nuevo cliente
router.post('/', clientesController.createCliente);

module.exports = router;
