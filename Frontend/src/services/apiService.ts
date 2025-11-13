const API_BASE_URL = 'http://localhost:3000/api';

// Tipos de datos
export interface Cliente {
  id_cliente?: number;
  nombre: string;
  apellido: string;
  email: string;
  telefono: string;
  direccion?: string;
  ciudad?: string;
  created_at?: string;
}

export interface Vehiculo {
  id_vehiculo?: number;
  marca: string;
  modelo: string;
  anio: number;
  precio: number;
  tipo: string;
  color?: string;
  kilometraje?: number;
  transmision?: string;
  combustible?: string;
  estado?: string;
  descripcion?: string;
  imagen_url?: string;
  created_at?: string;
}

export interface Cotizacion {
  id_cotizacion?: number;
  id_cliente: number;
  id_vehiculo: number;
  precio_ofrecido: number;
  observaciones?: string;
  estado?: string;
  fecha_cotizacion?: string;
}

export interface Venta {
  id_venta?: number;
  id_cliente: number;
  id_vehiculo: number;
  id_cotizacion?: number;
  precio_venta: number;
  enganche: number;
  saldo_financiado: number;
  fecha_venta?: string;
  estado?: string;
}

export interface Pago {
  id_pago?: number;
  id_venta: number;
  numero_pago: number;
  monto_pago: number;
  fecha_pago?: string;
  metodo_pago?: string;
  referencia?: string;
}

// Funciones para Clientes
export const clientesAPI = {
  getAll: async (): Promise<Cliente[]> => {
    const response = await fetch(`${API_BASE_URL}/clientes`);
    if (!response.ok) throw new Error('Error al obtener clientes');
    const data = await response.json();
    return data.data || [];
  },

  getById: async (id: number): Promise<Cliente> => {
    const response = await fetch(`${API_BASE_URL}/clientes/${id}`);
    if (!response.ok) throw new Error('Error al obtener cliente');
    const data = await response.json();
    return data.data;
  },

  create: async (cliente: Cliente): Promise<Cliente> => {
    const response = await fetch(`${API_BASE_URL}/clientes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cliente),
    });
    if (!response.ok) throw new Error('Error al crear cliente');
    const data = await response.json();
    return data.data;
  },
};

// Funciones para Vehículos
export const vehiculosAPI = {
  getAll: async (): Promise<Vehiculo[]> => {
    const response = await fetch(`${API_BASE_URL}/vehiculos`);
    if (!response.ok) throw new Error('Error al obtener vehículos');
    const data = await response.json();
    return data.data || [];
  },

  getDisponibles: async (): Promise<Vehiculo[]> => {
    const response = await fetch(`${API_BASE_URL}/vehiculos/disponibles`);
    if (!response.ok) throw new Error('Error al obtener vehículos disponibles');
    const data = await response.json();
    return data.data || [];
  },

  getById: async (id: number): Promise<Vehiculo> => {
    const response = await fetch(`${API_BASE_URL}/vehiculos/${id}`);
    if (!response.ok) throw new Error('Error al obtener vehículo');
    const data = await response.json();
    return data.data;
  },
};

// Funciones para Cotizaciones
export const cotizacionesAPI = {
  getAll: async (): Promise<Cotizacion[]> => {
    const response = await fetch(`${API_BASE_URL}/cotizaciones`);
    if (!response.ok) throw new Error('Error al obtener cotizaciones');
    const data = await response.json();
    return data.data || [];
  },

  getById: async (id: number): Promise<Cotizacion> => {
    const response = await fetch(`${API_BASE_URL}/cotizaciones/${id}`);
    if (!response.ok) throw new Error('Error al obtener cotización');
    const data = await response.json();
    return data.data;
  },

  create: async (cotizacion: Cotizacion): Promise<Cotizacion> => {
    const response = await fetch(`${API_BASE_URL}/cotizaciones`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(cotizacion),
    });
    if (!response.ok) throw new Error('Error al crear cotización');
    const data = await response.json();
    return data.data;
  },

  downloadPDF: async (id: number): Promise<void> => {
    const response = await fetch(`${API_BASE_URL}/cotizaciones/${id}/pdf`);
    if (!response.ok) throw new Error('Error al descargar PDF');
    
    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `cotizacion_${id}.pdf`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  },
};

// Funciones para Ventas
export const ventasAPI = {
  getAll: async (): Promise<Venta[]> => {
    const response = await fetch(`${API_BASE_URL}/ventas`);
    if (!response.ok) throw new Error('Error al obtener ventas');
    const data = await response.json();
    return data.data || [];
  },

  getById: async (id: number): Promise<Venta> => {
    const response = await fetch(`${API_BASE_URL}/ventas/${id}`);
    if (!response.ok) throw new Error('Error al obtener venta');
    const data = await response.json();
    return data.data;
  },
};

// Funciones para Pagos
export const pagosAPI = {
  getAll: async (): Promise<Pago[]> => {
    const response = await fetch(`${API_BASE_URL}/pagos`);
    if (!response.ok) throw new Error('Error al obtener pagos');
    const data = await response.json();
    return data.data || [];
  },

  getByVenta: async (idVenta: number): Promise<Pago[]> => {
    const response = await fetch(`${API_BASE_URL}/pagos/venta/${idVenta}`);
    if (!response.ok) throw new Error('Error al obtener pagos de la venta');
    const data = await response.json();
    return data.data || [];
  },
};

// Health check
export const healthCheck = async () => {
  try {
    const response = await fetch('http://localhost:3000/health');
    if (!response.ok) throw new Error('API no disponible');
    return await response.json();
  } catch (error) {
    throw new Error('No se puede conectar con la API');
  }
};
