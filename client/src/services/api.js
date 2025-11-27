import axios from 'axios';

const API_URL = 'https://tms-bj16.onrender.com/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  getProfile: () => api.get('/auth/profile')
};

export const userAPI = {
  getAll: () => api.get('/users'),
  getEmployees: () => api.get('/users/employees'),
  create: (data) => api.post('/users', data),
  update: (id, data) => api.put(`/users/${id}`, data),
  delete: (id) => api.delete(`/users/${id}`)
};

export const taskAPI = {
  getAll: () => api.get('/tasks'),
  getMyTasks: () => api.get('/tasks/my-tasks'),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`)
};

export const taskUpdateAPI = {
  add: (data) => {
    const config = data instanceof FormData 
      ? { headers: { 'Content-Type': 'multipart/form-data' } }
      : {};
    return api.post('/task-updates', data, config);
  },
  getByTask: (taskId) => api.get(`/task-updates/${taskId}`)
};

export const courierAPI = {
  getAll: (params) => api.get('/couriers', { params }),
  create: (data) => api.post('/couriers', data),
  update: (id, data) => api.put(`/couriers/${id}`, data),
  delete: (id) => api.delete(`/couriers/${id}`)
};

export const dashboardAPI = {
  getAdminStats: () => api.get('/dashboard/admin'),
  getEmployeeStats: () => api.get('/dashboard/employee')
};

export default api;
