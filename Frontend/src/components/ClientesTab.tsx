import { useState } from 'react';
import { clientesAPI } from '../services/apiService';
import type { Cliente } from '../services/apiService';

export default function ClientesTab() {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [clienteId, setClienteId] = useState('');
  const [nuevoCliente, setNuevoCliente] = useState<Cliente>({
    nombre: '',
    apellido: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: '',
  });
  const [response, setResponse] = useState<any>(null);

  const handleGetAll = async () => {
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await clientesAPI.getAll();
      setClientes(data);
      setResponse({ success: true, count: data.length, data });
    } catch (err: any) {
      setError(err.message);
      setResponse({ success: false, error: err.message });
    } finally {
      setLoading(false);
    }
  };

  const handleGetById = async () => {
    if (!clienteId) {
      setError('Ingrese un ID de cliente');
      return;
    }
    setLoading(true);
    setError('');
    setResponse(null);
    try {
      const data = await clientesAPI.getById(Number(clienteId));
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
      const data = await clientesAPI.create(nuevoCliente);
      setResponse({ success: true, message: 'Cliente creado exitosamente', data });
      // Limpiar formulario
      setNuevoCliente({
        nombre: '',
        apellido: '',
        email: '',
        telefono: '',
        direccion: '',
        ciudad: '',
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

  return (
    <div className="tab-content">
      <h2>🧑‍💼 Gestión de Clientes</h2>

      <div className="api-section">
        <h3>📋 GET /api/clientes</h3>
        <p>Obtener todos los clientes</p>
        <button onClick={handleGetAll} disabled={loading}>
          {loading ? 'Cargando...' : 'Obtener Todos los Clientes'}
        </button>
      </div>

      <div className="api-section">
        <h3>🔍 GET /api/clientes/:id</h3>
        <p>Obtener cliente por ID</p>
        <div className="input-group">
          <input
            type="number"
            placeholder="ID del cliente"
            value={clienteId}
            onChange={(e) => setClienteId(e.target.value)}
          />
          <button onClick={handleGetById} disabled={loading}>
            Buscar
          </button>
        </div>
      </div>

      <div className="api-section">
        <h3>➕ POST /api/clientes</h3>
        <p>Crear nuevo cliente</p>
        <form onSubmit={handleCreate} className="form-grid">
          <input
            type="text"
            placeholder="Nombre *"
            required
            value={nuevoCliente.nombre}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, nombre: e.target.value })}
          />
          <input
            type="text"
            placeholder="Apellido *"
            required
            value={nuevoCliente.apellido}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, apellido: e.target.value })}
          />
          <input
            type="email"
            placeholder="Email *"
            required
            value={nuevoCliente.email}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, email: e.target.value })}
          />
          <input
            type="tel"
            placeholder="Teléfono *"
            required
            value={nuevoCliente.telefono}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, telefono: e.target.value })}
          />
          <input
            type="text"
            placeholder="Dirección"
            value={nuevoCliente.direccion}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, direccion: e.target.value })}
          />
          <input
            type="text"
            placeholder="Ciudad"
            value={nuevoCliente.ciudad}
            onChange={(e) => setNuevoCliente({ ...nuevoCliente, ciudad: e.target.value })}
          />
          <button type="submit" disabled={loading} className="btn-primary">
            Crear Cliente
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

      {clientes.length > 0 && (
        <div className="data-table">
          <h3>👥 Clientes ({clientes.length})</h3>
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Nombre</th>
                <th>Email</th>
                <th>Teléfono</th>
                <th>Ciudad</th>
              </tr>
            </thead>
            <tbody>
              {clientes.map((cliente) => (
                <tr key={cliente.id_cliente}>
                  <td>{cliente.id_cliente}</td>
                  <td>{cliente.nombre} {cliente.apellido}</td>
                  <td>{cliente.email}</td>
                  <td>{cliente.telefono}</td>
                  <td>{cliente.ciudad || '-'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
