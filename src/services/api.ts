const API_BASE_URL = import.meta.env.VITE_API_URL 
  ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '')}/api`
  : 'http://localhost:5000/api';

export interface HealthResponse {
  status: string;
  timestamp: string;
  database: {
    provider: string;
    connected: boolean;
    readyState: number;
    dbName: string;
  };
}

export const checkBackendHealth = async (): Promise<HealthResponse | null> => {
  try {
    const res = await fetch(`${API_BASE_URL}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(4000)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const fetchDashboardFromBackend = async () => {
  try {
    const res = await fetch(`${API_BASE_URL}/dashboard`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(6000)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const saveTransactionToBackend = async (data: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/transactions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const deleteTransactionFromBackend = async (id: string) => {
  try {
    const res = await fetch(`${API_BASE_URL}/transactions/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const saveLoanPaymentToBackend = async (data: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/loans`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const saveTaskToBackend = async (data: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const saveFitnessLogToBackend = async (data: any) => {
  try {
    const res = await fetch(`${API_BASE_URL}/fitness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};
