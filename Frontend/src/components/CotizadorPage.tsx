import { useState, useEffect } from 'react';
import './CotizadorPage.css';

interface Vehiculo {
  id_vehiculo: number;
  marca: string;
  modelo: string;
  anio: number;
  color: string;
  chasis?: string;
  precio: number;
  tipo: string;
  transmision?: string;
  combustible?: string;
  motor?: string;
  pasajeros?: number;
  puertas?: number;
  traccion?: string;
}

interface Vendedor {
  id_vendedor: number;
  nombre_completo: string;
  cargo: string;
  telefono: string;
  email: string;
  firma_url?: string;
  sello_url?: string;
}

interface CotizacionFormData {
  // Paso 1
  tipo_cliente: 'Individual' | 'Empresa';
  // Paso 2 y 3
  nombre_cliente: string;
  nombre_empresa: string;
  documento: string;
  telefono: string;
  email: string;
  direccion: string;
  // Paso 4
  id_vehiculo: number;
  // Paso 5
  id_vendedor: number;
  tipo_cotizacion: 'Con Chasis' | 'Sin Chasis';
  precio_ofrecido: number;
  observaciones: string;
}

export default function CotizadorPage() {
  const [paso, setPaso] = useState(1);
  const [vehiculos, setVehiculos] = useState<Vehiculo[]>([]);
  const [vendedores, setVendedores] = useState<Vendedor[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [pdfData, setPdfData] = useState<any>(null);

  const [formData, setFormData] = useState<CotizacionFormData>({
    tipo_cliente: 'Individual',
    nombre_cliente: '',
    nombre_empresa: '',
    documento: '',
    telefono: '',
    email: '',
    direccion: '',
    id_vehiculo: 0,
    id_vendedor: 0,
    tipo_cotizacion: 'Sin Chasis',
    precio_ofrecido: 0,
    observaciones: '',
  });

  useEffect(() => {
    cargarDatos();
  }, []);

  const cargarDatos = async () => {
    try {
      const [vehiculosRes, vendedoresRes] = await Promise.all([
        fetch('http://localhost:3000/api/vehiculos'),
        fetch('http://localhost:3000/api/vendedores'),
      ]);

      const vehiculosData = await vehiculosRes.json();
      const vendedoresData = await vendedoresRes.json();

      setVehiculos(vehiculosData.data || []);
      setVendedores(vendedoresData.data || []);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar los datos iniciales');
    }
  };

  const handleVehiculoChange = (id: number) => {
    const vehiculo = vehiculos.find((v) => v.id_vehiculo === id);
    if (vehiculo) {
      setFormData({
        ...formData,
        id_vehiculo: id,
        precio_ofrecido: vehiculo.precio,
      });
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    setSuccess(false);

    try {
      const response = await fetch('http://localhost:3000/api/cotizaciones', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Error al crear cotización');
      }

      setSuccess(true);
      setPdfData(data.data);
      
      // Scroll al top
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const descargarPDF = () => {
    if (!pdfData || !pdfData.pdf) return;

    const byteCharacters = atob(pdfData.pdf.base64);
    const byteNumbers = new Array(byteCharacters.length);
    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = pdfData.pdf.nombre_archivo;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  };

  const reiniciarFormulario = () => {
    setFormData({
      tipo_cliente: 'Individual',
      nombre_cliente: '',
      nombre_empresa: '',
      documento: '',
      telefono: '',
      email: '',
      direccion: '',
      id_vehiculo: 0,
      id_vendedor: 0,
      tipo_cotizacion: 'Sin Chasis',
      precio_ofrecido: 0,
      observaciones: '',
    });
    setPaso(1);
    setSuccess(false);
    setPdfData(null);
    setError('');
  };

  const vehiculoSeleccionado = vehiculos.find((v) => v.id_vehiculo === formData.id_vehiculo);
  const vendedorSeleccionado = vendedores.find((v) => v.id_vendedor === formData.id_vendedor);

  return (
    <div className="cotizador-page">
      <div className="cotizador-header">
        <h1>🚗 Sistema de Cotizaciones CAR</h1>
        <p>Crea cotizaciones profesionales en 5 simples pasos</p>
      </div>

      {success && (
        <div className="success-box">
          <h2>✅ ¡Cotización Creada Exitosamente!</h2>
          <p>ID de Cotización: #{pdfData?.id_cotizacion}</p>
          <div className="success-actions">
            <button onClick={descargarPDF} className="btn-download">
              📄 Descargar PDF
            </button>
            <button onClick={reiniciarFormulario} className="btn-new">
              ➕ Nueva Cotización
            </button>
          </div>
        </div>
      )}

      {error && (
        <div className="error-box">
          ❌ {error}
        </div>
      )}

      {!success && (
        <>
          <div className="progress-bar">
            {[1, 2, 3, 4, 5].map((num) => (
              <div
                key={num}
                className={`progress-step ${paso >= num ? 'active' : ''} ${paso === num ? 'current' : ''}`}
              >
                <div className="step-number">{num}</div>
                <div className="step-label">
                  {num === 1 && 'Tipo'}
                  {num === 2 && 'Cliente'}
                  {num === 3 && 'Documento'}
                  {num === 4 && 'Vehículo'}
                  {num === 5 && 'Vendedor'}
                </div>
              </div>
            ))}
          </div>

          <div className="cotizador-form">
            {/* PASO 1: Tipo de Cliente */}
            {paso === 1 && (
              <div className="form-paso">
                <h2>Paso 1: Tipo de Cliente</h2>
                <p>¿La cotización es para una empresa o para un individuo?</p>

                <div className="tipo-cliente-options">
                  <div
                    className={`tipo-option ${formData.tipo_cliente === 'Individual' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, tipo_cliente: 'Individual' })}
                  >
                    <div className="tipo-icon">👤</div>
                    <h3>Individual</h3>
                    <p>Persona física</p>
                  </div>

                  <div
                    className={`tipo-option ${formData.tipo_cliente === 'Empresa' ? 'selected' : ''}`}
                    onClick={() => setFormData({ ...formData, tipo_cliente: 'Empresa' })}
                  >
                    <div className="tipo-icon">🏢</div>
                    <h3>Empresa</h3>
                    <p>Persona jurídica</p>
                  </div>
                </div>

                <button onClick={() => setPaso(2)} className="btn-next">
                  Continuar →
                </button>
              </div>
            )}

            {/* PASO 2: Datos del Cliente */}
            {paso === 2 && (
              <div className="form-paso">
                <h2>Paso 2: Datos del {formData.tipo_cliente === 'Empresa' ? 'Empresa' : 'Cliente'}</h2>

                <div className="form-grid">
                  {formData.tipo_cliente === 'Empresa' && (
                    <input
                      type="text"
                      placeholder="Nombre de la Empresa *"
                      required
                      value={formData.nombre_empresa}
                      onChange={(e) => setFormData({ ...formData, nombre_empresa: e.target.value })}
                      className="full-width"
                    />
                  )}

                  <input
                    type="text"
                    placeholder={formData.tipo_cliente === 'Empresa' ? 'Nombre del Representante *' : 'Nombre Completo *'}
                    required
                    value={formData.nombre_cliente}
                    onChange={(e) => setFormData({ ...formData, nombre_cliente: e.target.value })}
                    className="full-width"
                  />

                  <input
                    type="tel"
                    placeholder="Teléfono *"
                    required
                    value={formData.telefono}
                    onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                  />

                  <input
                    type="email"
                    placeholder="Correo Electrónico *"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />

                  <input
                    type="text"
                    placeholder="Dirección"
                    value={formData.direccion}
                    onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                    className="full-width"
                  />
                </div>

                <div className="form-actions">
                  <button onClick={() => setPaso(1)} className="btn-back">
                    ← Atrás
                  </button>
                  <button 
                    onClick={() => setPaso(3)} 
                    className="btn-next"
                    disabled={!formData.nombre_cliente || !formData.telefono || !formData.email}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 3: Documento */}
            {paso === 3 && (
              <div className="form-paso">
                <h2>Paso 3: {formData.tipo_cliente === 'Empresa' ? 'RNC' : 'Cédula'}</h2>
                <p>Ingresa el {formData.tipo_cliente === 'Empresa' ? 'RNC de la empresa' : 'número de cédula'}</p>

                <div className="documento-input">
                  <input
                    type="text"
                    placeholder={formData.tipo_cliente === 'Empresa' ? 'Ej: 131-12345-6' : 'Ej: 001-1234567-8'}
                    value={formData.documento}
                    onChange={(e) => setFormData({ ...formData, documento: e.target.value })}
                    className="documento-field"
                  />
                </div>

                <div className="form-actions">
                  <button onClick={() => setPaso(2)} className="btn-back">
                    ← Atrás
                  </button>
                  <button 
                    onClick={() => setPaso(4)} 
                    className="btn-next"
                    disabled={!formData.documento}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 4: Vehículo */}
            {paso === 4 && (
              <div className="form-paso">
                <h2>Paso 4: Seleccionar Vehículo</h2>
                <p>Elige el vehículo a cotizar</p>

                <div className="vehiculos-grid">
                  {vehiculos.map((vehiculo) => (
                    <div
                      key={vehiculo.id_vehiculo}
                      className={`vehiculo-card ${formData.id_vehiculo === vehiculo.id_vehiculo ? 'selected' : ''}`}
                      onClick={() => handleVehiculoChange(vehiculo.id_vehiculo)}
                    >
                      <div className="vehiculo-header">
                        <h3>{vehiculo.marca} {vehiculo.modelo}</h3>
                        <span className="vehiculo-year">{vehiculo.anio}</span>
                      </div>
                      <div className="vehiculo-details">
                        <p>🎨 Color: {vehiculo.color}</p>
                        <p>⚙️ Transmisión: {vehiculo.transmision}</p>
                        <p>⛽ Combustible: {vehiculo.combustible}</p>
                        {vehiculo.chasis && <p>🔢 Chasis: {vehiculo.chasis}</p>}
                      </div>
                      <div className="vehiculo-price">
                        ${vehiculo.precio.toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>

                {vehiculoSeleccionado && (
                  <div className="seleccion-summary">
                    <h3>✓ Vehículo Seleccionado</h3>
                    <p>{vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo} {vehiculoSeleccionado.anio}</p>
                    
                    <div className="tipo-cotizacion">
                      <label>Tipo de Cotización:</label>
                      <div className="radio-group">
                        <label className={formData.tipo_cotizacion === 'Sin Chasis' ? 'selected' : ''}>
                          <input
                            type="radio"
                            name="tipo_cotizacion"
                            value="Sin Chasis"
                            checked={formData.tipo_cotizacion === 'Sin Chasis'}
                            onChange={(e) => setFormData({ ...formData, tipo_cotizacion: e.target.value as any })}
                          />
                          Sin Chasis
                        </label>
                        <label className={formData.tipo_cotizacion === 'Con Chasis' ? 'selected' : ''}>
                          <input
                            type="radio"
                            name="tipo_cotizacion"
                            value="Con Chasis"
                            checked={formData.tipo_cotizacion === 'Con Chasis'}
                            onChange={(e) => setFormData({ ...formData, tipo_cotizacion: e.target.value as any })}
                          />
                          Con Chasis
                        </label>
                      </div>
                    </div>

                    <div className="precio-ofrecido">
                      <label>Precio Ofrecido:</label>
                      <input
                        type="number"
                        value={formData.precio_ofrecido}
                        onChange={(e) => setFormData({ ...formData, precio_ofrecido: Number(e.target.value) })}
                      />
                    </div>
                  </div>
                )}

                <div className="form-actions">
                  <button onClick={() => setPaso(3)} className="btn-back">
                    ← Atrás
                  </button>
                  <button 
                    onClick={() => setPaso(5)} 
                    className="btn-next"
                    disabled={!formData.id_vehiculo}
                  >
                    Continuar →
                  </button>
                </div>
              </div>
            )}

            {/* PASO 5: Vendedor */}
            {paso === 5 && (
              <div className="form-paso">
                <h2>Paso 5: Vendedor Asignado</h2>
                <p>Selecciona el vendedor que atenderá esta cotización</p>

                <div className="vendedores-grid">
                  {vendedores.map((vendedor) => (
                    <div
                      key={vendedor.id_vendedor}
                      className={`vendedor-card ${formData.id_vendedor === vendedor.id_vendedor ? 'selected' : ''}`}
                      onClick={() => setFormData({ ...formData, id_vendedor: vendedor.id_vendedor })}
                    >
                      <div className="vendedor-avatar">👤</div>
                      <h3>{vendedor.nombre_completo}</h3>
                      <p className="vendedor-cargo">{vendedor.cargo}</p>
                      <p className="vendedor-contacto">
                        📞 {vendedor.telefono}<br />
                        📧 {vendedor.email}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="observaciones-section">
                  <label>Observaciones Adicionales:</label>
                  <textarea
                    placeholder="Agrega notas o comentarios sobre esta cotización..."
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    rows={4}
                  />
                </div>

                <div className="form-actions">
                  <button onClick={() => setPaso(4)} className="btn-back">
                    ← Atrás
                  </button>
                  <button 
                    onClick={handleSubmit} 
                    className="btn-submit"
                    disabled={loading || !formData.id_vendedor}
                  >
                    {loading ? 'Generando...' : '🎯 Generar Cotización'}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Resumen flotante */}
          {paso > 1 && (
            <div className="resumen-flotante">
              <h3>📋 Resumen</h3>
              <div className="resumen-item">
                <strong>Tipo:</strong> {formData.tipo_cliente}
              </div>
              {formData.nombre_cliente && (
                <div className="resumen-item">
                  <strong>{formData.tipo_cliente === 'Empresa' ? 'Empresa' : 'Cliente'}:</strong> 
                  {formData.tipo_cliente === 'Empresa' ? formData.nombre_empresa : formData.nombre_cliente}
                </div>
              )}
              {formData.documento && (
                <div className="resumen-item">
                  <strong>{formData.tipo_cliente === 'Empresa' ? 'RNC' : 'Cédula'}:</strong> {formData.documento}
                </div>
              )}
              {vehiculoSeleccionado && (
                <div className="resumen-item">
                  <strong>Vehículo:</strong> {vehiculoSeleccionado.marca} {vehiculoSeleccionado.modelo}
                </div>
              )}
              {vendedorSeleccionado && (
                <div className="resumen-item">
                  <strong>Vendedor:</strong> {vendedorSeleccionado.nombre_completo}
                </div>
              )}
            </div>
          )}
        </>
      )}
    </div>
  );
}
