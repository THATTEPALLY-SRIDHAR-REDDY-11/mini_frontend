import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://mini-p-orq5.onrender.com';

const api = axios.create({
  baseURL: API_BASE_URL
});

export const userApi = {
  create: (payload) => api.post('/users', payload),
  list: () => api.get('/users')
};

export const donationApi = {
  create: (payload) => api.post('/donations', payload),
  list: () => api.get('/donations')
};

export const pickupApi = {
  create: (payload) => api.post('/pickup', payload),
  list: () => api.get('/pickup'),
  assign: (pickupId, driverId) => api.put(`/pickup/assign/${pickupId}?driverId=${driverId}`),
  collect: (pickupId) => api.put(`/pickup/collect/${pickupId}`),
  byDriver: (driverId) => api.get(`/pickup/driver/${driverId}`)
};

export const driverApi = {
  create: (payload) => api.post('/drivers', payload),
  list: () => api.get('/drivers')
};

export default api;
