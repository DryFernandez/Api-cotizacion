import { useState, useEffect } from 'react';
import { cotizacionesAPI, clientesAPI, vehiculosAPI } from '../services/apiService';
import type { Cotizacion, Cliente, Vehiculo } from '../services/apiService';

export default function CotizacionesTab() {
  const [cotizaciones, setCotizaciones] = useState<Cotizacion[]>([]);
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [cotizacionId, setCotizacionId] = useState('');
  const [nuevaCotizacion, setNuevaCotizacion] = useState<Cotizacion>({
    id_cliente: 0,
    id_vehiculo: 0,
    precio_ofrecido: 0,
    observaciones: '',
  });
  const [response, setResponse] = useState<any>(null);

  useEffect(() => {
    // Cargar clientes y vehículos al montar el componente
    const loadData = async () => {
      try {
        const [clientesData, vehiculosData] = await Promise.all([
          clientesAPI.getAll(),
          vehiculosAPI.getAll(),
        ]);
        setClientes(clientesData);
        setVehiculos(vehiculosData);
      } catch (err) {
        console.error('Error al cargar datos:', err);
      }
    };
    loadData();
  }, []);

  const handleGetAll = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await cotizacionesAPI.getAll();
      setCotizaciones(data);
      setResponse({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if (!cotizacionId) {
      setError('Ingrese un ID de cotización');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await cotizacionesAPI.getById(Number(cotizacionId));
      setResponse({ success: true, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await cotizacionesAPI.create(nuevaCotizacion);
      setResponse({ success: true, message: 'Cotización creada exitosamente (PDF generado)', data });
      // Limpiar formulario
      setNuevaCotizacion({
        id_cliente: 0,
        id_vehiculo: 0,
        precio_ofrecido: 0,
        observaciones: '',
      });
      // Actualizar lista
      handleGetAll();
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!cotizacionId) {
      setError('Ingrese un ID de cotización');
      return;
    }
    setLoading(true);
    setError('');
    try {
      await cotizacionesAPI.downloadPDF(Number(cotizacionId));
      setResponse({ success: true, message: 'PDF descargado exitosamente' });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleVehiculoChange = (vehiculoId: number) => {
    const vehiculo = vehiculos.find(v => v.id_vehiculo === vehiculoId);
    if (vehiculo) {
      setNuevaCotizacion({
        ...nuevaCotizacion,
        id_vehiculo: vehiculoId,
        precio_ofrecido: vehiculo.precio,
      });
    }
  };

  return (
    <div className="tab-content">
      <h2>📊 Gestión de Cotizaciones</h2>

      <div className="api-section">
        <h3>📋 GET /api/cotizaciones</h3>
        <p>Obtener todas las cotizaciones</p>
        <button onClick={handleGetAll} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Todas las Cotizaciones'}
        </button>
      </div>

      <div className="api-section">
        <h3>🔍 GET /api/cotizaciones/:id</h3>
        <p>Obtener cotización por ID</p>
        <div className="input-group">
          <input
            type="number"
            placeholder="ID de la cotización"
            value={cotizacionId}
            onChange={(e) => setCotizacionId(e.target.value)}
          />
          <button onClick={handleGetById} disabled={loading}>
            Buscar
          </button>
        </div>
      </div>

      <div className="api-section">
        <h3>📄 GET /api/cotizaciones/:id/pdf</h3>
        <p>Descargar PDF de cotización</p>
        <div className="input-group">
          <input
            type="number"
            placeholder="ID de la cotización"
            value={cotizacionId}
            onChange={(e) => setCotizacionId(e.target.value)}
          />
          <button onClick={handleDownloadPDF} disabled={loading}>
            Descargar PDF
          </button>
        </div>
      </div>

      <div className="api-section">
        <h3>➕ POST /api/cotizaciones</h3>
        <p>Crear nueva cotización (genera PDF automáticamente)</p>
        <form onSubmit={handleCreate} className="form-grid">
          <select
            required
            value={nuevaCotizacion.id_cliente}
            onChange={(e) => setNuevaCotizacion({ ...nuevaCotizacion, id_cliente: Number(e.target.value) })}
          >
            <option value={0}>Seleccionar Cliente *</option>
            {clientes.map((cliente) => (
              <option key={cliente.id_cliente} value={cliente.id_cliente}>
                {cliente.nombre} {cliente.apellido}
              </option>
            ))}
          </select>
          
          <select
            required
            value={nuevaCotizacion.id_vehiculo}
            onChange={(e) => handleVehiculoChange(Number(e.target.value))}
          >
            <option value={0}>Seleccionar Vehículo *</option>
            {vehiculos.map((vehiculo) => (
              <option key={vehiculo.id_vehiculo} value={vehiculo.id_vehiculo}>
                {vehiculo.marca} {vehiculo.modelo} {vehiculo.anio} - ${vehiculo.precio.toLocaleString()}
              </option>
            ))}
          </select>

          <input
            type="number"
            placeholder="Precio Ofrecido *"
            required
            value={nuevaCotizacion.precio_ofrecido || ''}
            onChange={(e) => setNuevaCotizacion({ ...nuevaCotizacion, precio_ofrecido: Number(e.target.value) })}
          />

          <input
            type="text"
            placeholder="Observaciones (opcional)"
            value={nuevaCotizacion.observaciones}
            onChange={(e) => setNuevaCotizacion({ ...nuevaCotizacion, observaciones: e.target.value })}
            style={{ gridColumn: '1 / -1' }}
          />

          <button type="submit" disabled={loading} className="btn-primary">
            Crear Cotización y Generar PDF
          </button>
        </form>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {response && (
        <div className="response-section">
          <h3>📤 Respuesta del Servidor</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {cotizaciones.length > 0 && (
        <div className="data-table">
          <h3>📋 Cotizaciones ({cotizaciones.length})</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Precio Ofrecido</th>
                <th>Observaciones</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {cotizaciones.map((cotizacion) => (
                <tr key={cotizacion.id_cotizacion}>
                  <td>{cotizacion.id_cotizacion}</td>
                  <td>Cliente #{cotizacion.id_cliente}</td>
                  <td>Vehículo #{cotizacion.id_vehiculo}</td>
                  <td>${cotizacion.precio_ofrecido?.toLocaleString()}</td>
                  <td>{cotizacion.observaciones || '-'}</td>
                  <td>{cotizacion.fecha_cotizacion ? new Date(cotizacion.fecha_cotizacion).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge ${cotizacion.estado === 'Pendiente' ? 'badge-warning' : 'badge-success'}`}>
                      {cotizacion.estado}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
