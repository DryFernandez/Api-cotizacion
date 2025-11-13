import { useState } from 'react';
import { pagosAPI } from '../services/apiService';
import type { Pago } from '../services/apiService';

export default function PagosTab() {
  const [pagos, setPagos] = useState<Pago[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [ventaId, setVentaId] = useState('');
  const [response, setResponse] = useState<any>(null);

  const handleGetAll = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await pagosAPI.getAll();
      setPagos(data);
      setResponse({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetByVenta = async () => {
    if (!ventaId) {
      setError('Ingrese un ID de venta');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await pagosAPI.getByVenta(Number(ventaId));
      setPagos(data);
      setResponse({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="tab-content">
      <h2>💳 Gestión de Pagos</h2>

      <div className="api-section">
        <h3>📋 GET /api/pagos</h3>
        <p>Obtener todos los pagos</p>
        <button onClick={handleGetAll} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Todos los Pagos'}
        </button>
      </div>

      <div className="api-section">
        <h3>🔍 GET /api/pagos/venta/:id_venta</h3>
        <p>Obtener pagos por venta</p>
        <div className="input-group">
          <input
            type="number"
            placeholder="ID de la venta"
            value={ventaId}
            onChange={(e) => setVentaId(e.target.value)}
          />
          <button onClick={handleGetByVenta} disabled={loading}>
            Buscar Pagos
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

      {pagos.length > 0 && (
        <div className="data-table">
          <h3>💵 Pagos ({pagos.length})</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>ID Venta</th>
                <th>Número Pago</th>
                <th>Monto</th>
                <th>Fecha</th>
                <th>Método</th>
                <th>Referencia</th>
              </tr>
            </thead>
            <tbody>
              {pagos.map((pago) => (
                <tr key={pago.id_pago}>
                  <td>{pago.id_pago}</td>
                  <td>{pago.id_venta}</td>
                  <td>{pago.numero_pago}</td>
                  <td>${pago.monto_pago?.toLocaleString()}</td>
                  <td>{pago.fecha_pago ? new Date(pago.fecha_pago).toLocaleDateString() : '-'}</td>
                  <td>{pago.metodo_pago || '-'}</td>
                  <td>{pago.referencia || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
