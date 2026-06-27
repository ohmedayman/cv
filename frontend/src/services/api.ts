import axios from 'axios';

const API_BASE = '/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle 401 responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// ─── Auth ───────────────────────────────────────────────────
export const authAPI = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }),
  register: (data: any) => api.post('/auth/register', data),
  getProfile: () => api.get('/auth/profile'),
  logout: () => api.post('/auth/logout'),
};

// ─── Calls ──────────────────────────────────────────────────
export const callsAPI = {
  getAll: (params?: any) => api.get('/calls', { params }),
  getLive: () => api.get('/calls/live'),
  getById: (id: string) => api.get(`/calls/${id}`),
  updateNotes: (id: string, notes: string) =>
    api.patch(`/calls/${id}/notes`, { notes }),
  rate: (id: string, rating: number) =>
    api.patch(`/calls/${id}/rate`, { rating }),
  getStats: () => api.get('/calls/stats/summary'),
};

// ─── Customers ──────────────────────────────────────────────
export const customersAPI = {
  getAll: (params?: any) => api.get('/customers', { params }),
  lookup: (phone: string) => api.get(`/customers/lookup/${phone}`),
  getById: (id: string) => api.get(`/customers/${id}`),
  create: (data: any) => api.post('/customers', data),
  update: (id: string, data: any) => api.put(`/customers/${id}`, data),
  delete: (id: string) => api.delete(`/customers/${id}`),
};

// ─── Agents ─────────────────────────────────────────────────
export const agentsAPI = {
  getAll: () => api.get('/agents'),
  getStats: (id: string) => api.get(`/agents/${id}/stats`),
  updateStatus: (id: string, status: string) =>
    api.patch(`/agents/${id}/status`, { status }),
  getDashboard: () => api.get('/agents/dashboard/summary'),
};

// ─── Recordings ─────────────────────────────────────────────
export const recordingsAPI = {
  getAll: (params?: any) => api.get('/recordings', { params }),
  getStreamUrl: (id: string) => `${API_BASE}/recordings/${id}/stream`,
  delete: (id: string) => api.delete(`/recordings/${id}`),
};

// ─── Queues ─────────────────────────────────────────────────
export const queuesAPI = {
  getAll: () => api.get('/queues'),
  create: (data: any) => api.post('/queues', data),
  getMembers: (id: string) => api.get(`/queues/${id}/members`),
};

export default api;
