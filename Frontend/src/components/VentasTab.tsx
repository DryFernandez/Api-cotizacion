import { useState } from 'react';
import { ventasAPI } from '../services/apiService';
import type { Venta } from '../services/apiService';

export default function VentasTab() {
  const [ventas, setVentas] = useState<Venta[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ventaId, setVentaId] = useState('');
  const [response, setResponse] = useState<any>(null);

  const handleGetAll = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await ventasAPI.getAll();
      setVentas(data);
      setResponse({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if (!ventaId) {
      setError('Ingrese un ID de venta');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await ventasAPI.getById(Number(ventaId));
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
      <h2>💰 Gestión de Ventas</h2>

      <div className="api-section">
        <h3>📋 GET /api/ventas</h3>
        <p>Obtener todas las ventas</p>
        <button onClick={handleGetAll} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Todas las Ventas'}
        </button>
      </div>

      <div className="api-section">
        <h3>🔍 GET /api/ventas/:id</h3>
        <p>Obtener venta por ID</p>
        <div className="input-group">
          <input
            type="number"
            placeholder="ID de la venta"
            value={ventaId}
            onChange={(e) => setVentaId(e.target.value)}
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

      {ventas.length > 0 && (
        <div className="data-table">
          <h3>🛒 Ventas ({ventas.length})</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Vehículo</th>
                <th>Cotización</th>
                <th>Precio Venta</th>
                <th>Enganche</th>
                <th>Saldo Financiado</th>
                <th>Fecha</th>
                <th>Estado</th>
              </tr>
            </thead>
            <tbody>
              {ventas.map((venta) => (
                <tr key={venta.id_venta}>
                  <td>{venta.id_venta}</td>
                  <td>Cliente #{venta.id_cliente}</td>
                  <td>Vehículo #{venta.id_vehiculo}</td>
                  <td>{venta.id_cotizacion ? `#${venta.id_cotizacion}` : '-'}</td>
                  <td>${venta.precio_venta?.toLocaleString()}</td>
                  <td>${venta.enganche?.toLocaleString()}</td>
                  <td>${venta.saldo_financiado?.toLocaleString()}</td>
                  <td>{venta.fecha_venta ? new Date(venta.fecha_venta).toLocaleDateString() : '-'}</td>
                  <td>
                    <span className={`badge ${venta.estado === 'completada' ? 'badge-success' : 'badge-warning'}`}>
                      {venta.estado}
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
