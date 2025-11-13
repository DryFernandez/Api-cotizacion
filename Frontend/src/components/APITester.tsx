import { useState, useEffect } from 'react';
import ClientesTab from './ClientesTab';
import VehiculosTab from './VehiculosTab';
import CotizacionesTab from './CotizacionesTab';
import VentasTab from './VentasTab';
import PagosTab from './PagosTab';
import { healthCheck } from '../services/apiService';

type TabType = 'clientes' | 'vehiculos' | 'cotizaciones' | 'ventas' | 'pagos';

export default function APITester() {
  const [activeTab, setActiveTab] = useState<TabType>('clientes');
  const [apiStatus, setApiStatus] = useState<'checking' | 'online' | 'offline'>('checking');
  const [apiInfo, setApiInfo] = useState<any>(null);

  useEffect(() => {
    checkAPIStatus();
  }, []);

  const checkAPIStatus = async () => {
    setApiStatus('checking');
    try {
      const info = await healthCheck();
      setApiInfo(info);
      setApiStatus('online');
    } catch (error) {
      setApiStatus('offline');
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'clientes':
        return <ClientesTab />;
      case 'vehiculos':
        return <VehiculosTab />;
      case 'cotizaciones':
        return <CotizacionesTab />;
      case 'ventas':
        return <VentasTab />;
      case 'pagos':
        return <PagosTab />;
      default:
        return <ClientesTab />;
    }
  };

  return (
    <div className="api-tester">
      <header className="api-header">
        <div className="header-content">
          <h1>🚗 CAR API Tester</h1>
          <p>Sistema de pruebas para la API de gestión de vehículos</p>
        </div>
        <div className="api-status">
          <button onClick={checkAPIStatus} className="btn-refresh">
            🔄 Actualizar
          </button>
          <div className={`status-indicator ${apiStatus}`}>
            {apiStatus === 'checking' && '🔄 Verificando...'}
            {apiStatus === 'online' && '✅ API Online'}
            {apiStatus === 'offline' && '❌ API Offline'}
          </div>
          {apiInfo && (
            <div className="api-info">
              <small>
                Base URL: http://localhost:3000/api
                {apiInfo.database && ` | DB: ${apiInfo.database}`}
              </small>
            </div>
          )}
        </div>
      </header>

      <nav className="tabs-nav">
        <button
          className={`tab-button ${activeTab === 'clientes' ? 'active' : ''}`}
          onClick={() => setActiveTab('clientes')}
        >
          🧑‍💼 Clientes
        </button>
        <button
          className={`tab-button ${activeTab === 'vehiculos' ? 'active' : ''}`}
          onClick={() => setActiveTab('vehiculos')}
        >
          🚗 Vehículos
        </button>
        <button
          className={`tab-button ${activeTab === 'cotizaciones' ? 'active' : ''}`}
          onClick={() => setActiveTab('cotizaciones')}
        >
          📊 Cotizaciones
        </button>
        <button
          className={`tab-button ${activeTab === 'ventas' ? 'active' : ''}`}
          onClick={() => setActiveTab('ventas')}
        >
          💰 Ventas
        </button>
        <button
          className={`tab-button ${activeTab === 'pagos' ? 'active' : ''}`}
          onClick={() => setActiveTab('pagos')}
        >
          💳 Pagos
        </button>
      </nav>

      <main className="tab-container">
        {apiStatus === 'offline' && (
          <div className="alert alert-error">
            ⚠️ No se puede conectar con la API. Asegúrate de que el servidor backend esté corriendo en http://localhost:3000
          </div>
        )}
        {renderTabContent()}
      </main>

      <footer className="api-footer">
        <p>
          <strong>CAR API</strong> - Sistema de Gestión de Vehículos | 
          Endpoints disponibles: Clientes, Vehículos, Cotizaciones, Ventas, Pagos
        </p>
      </footer>
    </div>
  );
}
