const express = require('express');
const cors = require('cors');
require('dotenv').config();

const { testConnection } = require('./config/database');

// Importar rutas
const clientesRoutes = require('./routes/clientes');
const vehiculosRoutes = require('./routes/vehiculos');
const cotizacionesRoutes = require('./routes/cotizaciones');
const ventasRoutes = require('./routes/ventas');
const pagosRoutes = require('./routes/pagos');

// Crear aplicación Express
const app = express();

// ===== MIDDLEWARES =====
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Middleware para logging de requests
app.use((req, res, next) => {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${req.method} ${req.path}`);
  next();
});

// ===== RUTAS =====

// Ruta de bienvenida
app.get('/', (req, res) => {
  res.json({
    message: '🚗 Bienvenido a CAR - API de Gestión de Vehículos',
    version: '1.0.0',
    endpoints: {
      clientes: '/api/clientes',
      vehiculos: '/api/vehiculos',
      cotizaciones: '/api/cotizaciones',
      ventas: '/api/ventas',
      pagos: '/api/pagos'
    },
    documentation: '/api/docs'
  });
});

// Endpoint de health check
app.get('/health', async (req, res) => {
  const dbStatus = await testConnection();
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus ? 'Connected' : 'Disconnected'
  });
});

// Rutas de la API
app.use('/api/clientes', clientesRoutes);
app.use('/api/vehiculos', vehiculosRoutes);
app.use('/api/cotizaciones', cotizacionesRoutes);
app.use('/api/ventas', ventasRoutes);
app.use('/api/pagos', pagosRoutes);

// ===== MANEJO DE ERRORES =====

// Ruta no encontrada
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Ruta no encontrada',
    path: req.path
  });
});

// Manejo de errores global
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || 'Error interno del servidor',
    error: process.env.NODE_ENV === 'development' ? err : {}
  });
});

// ===== INICIAR SERVIDOR =====
const PORT = process.env.PORT || 3000;

const startServer = async () => {
  try {
    // Verificar conexión a la base de datos
    console.log('🔄 Verificando conexión a la base de datos...');
    const dbConnected = await testConnection();
    
    if (!dbConnected) {
      console.error('❌ No se pudo conectar a la base de datos. Verifica tu configuración en .env');
      process.exit(1);
    }
    
    // Iniciar servidor
    app.listen(PORT, () => {
      console.log('');
      console.log('═══════════════════════════════════════════════════════════');
      console.log('🚀 Servidor corriendo exitosamente');
      console.log(`📡 Puerto: ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📚 API Base: http://localhost:${PORT}/api`);
      console.log(`💚 Health Check: http://localhost:${PORT}/health`);
      console.log('═══════════════════════════════════════════════════════════');
      console.log('');
      console.log('📋 Endpoints disponibles:');
      console.log(`   GET    /api/clientes`);
      console.log(`   GET    /api/vehiculos`);
      console.log(`   GET    /api/cotizaciones`);
      console.log(`   POST   /api/cotizaciones (genera PDF)`);
      console.log(`   GET    /api/ventas`);
      console.log(`   GET    /api/pagos`);
      console.log('');
      console.log('✨ Presiona Ctrl+C para detener el servidor');
      console.log('');
    });
    
  } catch (error) {
    console.error('❌ Error al iniciar el servidor:', error);
    process.exit(1);
  }
};

// Manejo de cierre graceful
process.on('SIGTERM', () => {
  console.log('');
  console.log('⚠️  SIGTERM recibido. Cerrando servidor...');
  process.exit(0);
});

process.on('SIGINT', () => {
  console.log('');
  console.log('⚠️  SIGINT recibido. Cerrando servidor...');
  process.exit(0);
});

// Iniciar servidor
startServer();

module.exports = app;
