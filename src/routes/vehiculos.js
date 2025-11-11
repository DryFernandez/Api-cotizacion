const express = require('express');
const router = express.Router();
const vehiculosController = require('../controllers/vehiculosController');

// GET - Obtener todos los vehículos
router.get('/', vehiculosController.getAllVehiculos);

// GET - Obtener vehículos disponibles
router.get('/disponibles', vehiculosController.getVehiculosDisponibles);

// GET - Obtener vehículo por ID
router.get('/:id', vehiculosController.getVehiculoById);

module.exports = router;
