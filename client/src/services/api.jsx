import axios from 'axios';
import toast from 'react-hot-toast';

// Create axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const { response } = error;
    
    if (response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      toast.error('Session expired. Please login again.');
    } else if (response?.status === 403) {
      toast.error('Access denied. Insufficient permissions.');
    } else if (response?.status === 404) {
      toast.error('Resource not found.');
    } else if (response?.status === 500) {
      toast.error('Server error. Please try again later.');
    } else if (response?.data?.message) {
      toast.error(response.data.message);
    } else {
      toast.error('An unexpected error occurred.');
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (userData) => api.post('/auth/register', userData),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (userData) => api.put('/auth/profile', userData),
  changePassword: (passwordData) => api.put('/auth/change-password', passwordData),
};

// Dashboard API
export const dashboardAPI = {
  getMetrics: (filters = {}) => api.get('/dashboard/metrics', { params: filters }),
  getNetMovement: (filters = {}) => api.get('/dashboard/net-movement', { params: filters }),
};

// Assets API
export const assetsAPI = {
  getAll: (filters = {}) => api.get('/assets', { params: filters }),
  getById: (id) => api.get(`/assets/${id}`),
  create: (assetData) => api.post('/assets/create', assetData),
  update: (id, assetData) => api.put(`/assets/${id}`, assetData),
  delete: (id) => api.delete(`/assets/${id}`),
  getByType: (type, filters = {}) => api.get(`/assets/type/${type}`, { params: filters }),
  getAvailable: (filters = {}) => api.get('/assets/available', { params: filters }),
  getAssigned: (filters = {}) => api.get('/assets/assigned', { params: filters }),
};

// Purchases API
export const purchasesAPI = {
  getAll: (filters = {}) => api.get('/purchases', { params: filters }),
  getById: (id) => api.get(`/purchases/${id}`),
  create: (purchaseData) => api.post('/purchases/create', purchaseData),
  update: (id, purchaseData) => api.put(`/purchases/${id}`, purchaseData),
  delete: (id) => api.delete(`/purchases/${id}`),
  approve: (id) => api.put(`/purchases/${id}/approve`),
  markDelivered: (id) => api.put(`/purchases/${id}/delivered`),
  getStatistics: (filters = {}) => api.get('/purchases/statistics', { params: filters }),
};

// Transfers API
export const transfersAPI = {
  getAll: (filters = {}) => api.get('/transfers', { params: filters }),
  getById: (id) => api.get(`/transfers/${id}`),
  create: (transferData) => api.post('/transfers/create', transferData),
  update: (id, transferData) => api.put(`/transfers/${id}`, transferData),
  delete: (id) => api.delete(`/transfers/${id}`),
  approve: (id) => api.put(`/transfers/${id}/approve`),
  complete: (id) => api.put(`/transfers/${id}/complete`),
  cancel: (id) => api.put(`/transfers/${id}/cancel`),
  getStatistics: (filters = {}) => api.get('/transfers/statistics', { params: filters }),
};

// Assignments API
export const assignmentsAPI = {
  getAll: (filters = {}) => api.get('/assignments', { params: filters }),
  getById: (id) => api.get(`/assignments/${id}`),
  create: (assignmentData) => api.post('/assignments/create', assignmentData),
  update: (id, assignmentData) => api.put(`/assignments/${id}`, assignmentData),
  delete: (id) => api.delete(`/assignments/${id}`),
};

// Expenditures API
export const expendituresAPI = {
  getAll: (filters = {}) => api.get('/expenditures', { params: filters }),
  getById: (id) => api.get(`/expenditures/${id}`),
  create: (expenditureData) => api.post('/expenditures/create', expenditureData),
  update: (id, expenditureData) => api.put(`/expenditures/${id}`, expenditureData),
  delete: (id) => api.delete(`/expenditures/${id}`),
  getStatistics: (filters = {}) => api.get('/expenditures/statistics', { params: filters }),
};

// Bases API
export const basesAPI = {
  getAll: (filters = {}) => api.get('/bases', { params: filters }),
  getById: (id) => api.get(`/bases/${id}`),
  create: (baseData) => api.post('/bases', baseData),
  update: (id, baseData) => api.put(`/bases/${id}`, baseData),
  delete: (id) => api.delete(`/bases/${id}`),
  getActive: () => api.get('/bases/active'),
  getNearby: (coordinates, maxDistance) => api.get('/bases/nearby', { 
    params: { coordinates, maxDistance } 
  }),
};

// Users API
export const usersAPI = {
  getAll: (filters = {}) => api.get('/users', { params: filters }),
  getById: (id) => api.get(`/users/${id}`),
  create: (userData) => api.post('/users', userData),
  update: (id, userData) => api.put(`/users/${id}`, userData),
  delete: (id) => api.delete(`/users/${id}`),
  getByRole: (role, filters = {}) => api.get(`/users/role/${role}`, { params: filters }),
  getByBase: (baseId, filters = {}) => api.get(`/users/base/${baseId}`, { params: filters }),
};

// Audit Logs API
export const auditLogsAPI = {
  getAll: (filters = {}) => api.get('/audit-logs', { params: filters }),
  getById: (id) => api.get(`/audit-logs/${id}`),
  getByUser: (userId, filters = {}) => api.get(`/audit-logs/user/${userId}`, { params: filters }),
  getByBase: (baseId, filters = {}) => api.get(`/audit-logs/base/${baseId}`, { params: filters }),
  getStatistics: (filters = {}) => api.get('/audit-logs/statistics', { params: filters }),
  getActionDistribution: (filters = {}) => api.get('/audit-logs/action-distribution', { params: filters }),
};

// File Upload API
export const uploadAPI = {
  uploadFile: (file, onProgress) => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          onProgress(percentCompleted);
        }
      },
    });
  },
};

// Utility functions
export const apiUtils = {
  // Format date for API requests
  formatDate: (date) => {
    if (!date) return null;
    return new Date(date).toISOString();
  },

  // Parse API response dates
  parseDates: (data) => {
    if (Array.isArray(data)) {
      return data.map(item => apiUtils.parseDates(item));
    }
    
    if (data && typeof data === 'object') {
      const parsed = {};
      for (const [key, value] of Object.entries(data)) {
        if (key.includes('Date') || key.includes('date') || key === 'createdAt' || key === 'updatedAt') {
          parsed[key] = value ? new Date(value) : null;
        } else if (typeof value === 'object') {
          parsed[key] = apiUtils.parseDates(value);
        } else {
          parsed[key] = value;
        }
      }
      return parsed;
    }
    
    return data;
  },

  // Build query string from filters
  buildQueryString: (filters) => {
    const params = new URLSearchParams();
    
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== null && value !== undefined && value !== '') {
        if (Array.isArray(value)) {
          value.forEach(item => params.append(key, item));
        } else {
          params.append(key, value);
        }
      }
    });
    
    return params.toString();
  },

  // Handle API errors
  handleError: (error, customMessage = null) => {
    const message = customMessage || 
                   error.response?.data?.message || 
                   error.message || 
                   'An error occurred';
    
    toast.error(message);
    return { success: false, error: message };
  },

  // Handle API success
  handleSuccess: (message = 'Operation completed successfully') => {
    toast.success(message);
    return { success: true };
  },
};

export default api; 