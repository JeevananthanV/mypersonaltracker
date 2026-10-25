const CUSTOM_API_KEY = 'jeeva_custom_api_url';

export const getApiBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    const custom = localStorage.getItem(CUSTOM_API_KEY);
    if (custom && custom.trim()) {
      return `${custom.trim().replace(/\/$/, '').replace(/\/api\/?$/, '')}/api`;
    }
  }
  return import.meta.env.VITE_API_URL 
    ? `${import.meta.env.VITE_API_URL.replace(/\/$/, '').replace(/\/api\/?$/, '')}/api`
    : 'http://localhost:5000/api';
};

export const getCustomApiUrl = (): string => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem(CUSTOM_API_KEY) || '';
  }
  return '';
};

export const setCustomApiUrl = (url: string): void => {
  if (typeof window !== 'undefined') {
    if (url && url.trim()) {
      localStorage.setItem(CUSTOM_API_KEY, url.trim().replace(/\/$/, '').replace(/\/api\/?$/, ''));
    } else {
      localStorage.removeItem(CUSTOM_API_KEY);
    }
  }
};

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

export const checkBackendHealth = async (overrideUrl?: string): Promise<HealthResponse | null> => {
  const base = overrideUrl 
    ? `${overrideUrl.trim().replace(/\/$/, '').replace(/\/api\/?$/, '')}/api`
    : getApiBaseUrl();
  try {
    const res = await fetch(`${base}/health`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      signal: AbortSignal.timeout(5000)
    });
    if (!res.ok) return null;
    return await res.json();
  } catch (e) {
    return null;
  }
};

export const fetchDashboardFromBackend = async () => {
  try {
    const res = await fetch(`${getApiBaseUrl()}/dashboard`, {
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
    const res = await fetch(`${getApiBaseUrl()}/transactions`, {
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
    const res = await fetch(`${getApiBaseUrl()}/transactions/${id}`, {
      method: 'DELETE'
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};

export const saveLoanPaymentToBackend = async (data: any) => {
  try {
    const res = await fetch(`${getApiBaseUrl()}/loans`, {
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
    const res = await fetch(`${getApiBaseUrl()}/tasks`, {
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
    const res = await fetch(`${getApiBaseUrl()}/fitness`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.ok;
  } catch (e) {
    return false;
  }
};
