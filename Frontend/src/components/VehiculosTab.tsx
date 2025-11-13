import { useState } from 'react';
import { vehiculosAPI } from '../services/apiService';
import type { Vehiculo } from '../services/apiService';

export default function VehiculosTab() {
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [vehiculoId, setVehiculoId] = useState('');
  const [response, setResponse] = useState<any>(null);

  const handleGetAll = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await vehiculosAPI.getAll();
      setVehiculos(data);
      setResponse({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetDisponibles = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await vehiculosAPI.getDisponibles();
      setVehiculos(data);
      setResponse({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if (!vehiculoId) {
      setError('Ingrese un ID de vehículo');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await vehiculosAPI.getById(Number(vehiculoId));
      setResponse({ success: true, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <h2>🚗 Gestión de Vehículos</h2>

      <div className="api-section">
        <h3>📋 GET /api/vehiculos</h3>
        <p>Obtener todos los vehículos</p>
        <button onClick={handleGetAll} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Todos los Vehículos'}
        </button>
      </div>

      <div className="api-section">
        <h3>✅ GET /api/vehiculos/disponibles</h3>
        <p>Obtener vehículos disponibles</p>
        <button onClick={handleGetDisponibles} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Vehículos Disponibles'}
        </button>
      </div>

      <div className="api-section">
        <h3>🔍 GET /api/vehiculos/:id</h3>
        <p>Obtener vehículo por ID</p>
        <div className="input-group">
          <input
            type="number"
            placeholder="ID del vehículo"
            value={vehiculoId}
            onChange={(e) => setVehiculoId(e.target.value)}
          />
          <button onClick={handleGetById} disabled={loading}>
            Buscar
          </button>
        </div>
      </div>

      {error && <div className="error-message">❌ {error}</div>}

      {response && (
        <div className="response-section">
          <h3>📤 Respuesta del Servidor</h3>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {vehiculos.length > 0 && (
        <div className="data-table">
          <h3>🚙 Vehículos ({vehiculos.length})</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Marca</th>
                <th>Modelo</th>
                <th>Año</th>
                <th>Precio</th>
                <th>Tipo</th>
                <th>Color</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {vehiculos.map((vehiculo) => (
                <tr key={vehiculo.id_vehiculo}>
                  <td>{vehiculo.id_vehiculo}</td>
                  <td>{vehiculo.marca}</td>
                  <td>{vehiculo.modelo}</td>
                  <td>{vehiculo.anio}</td>
                  <td>${vehiculo.precio.toLocaleString()}</td>
                  <td>{vehiculo.tipo}</td>
                  <td>{vehiculo.color || '-'}</td>
                  <td>
                    <span className={`badge ${vehiculo.estado === 'disponible' ? 'badge-success' : 'badge-secondary'}`}>
                      {vehiculo.estado}
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
