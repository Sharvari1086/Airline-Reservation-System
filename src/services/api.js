import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

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

export const authService = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
};

export const flightService = {
  searchFlights: (params) => api.get('/flights', { params }),
  getFlightById: (id) => api.get(`/flights/${id}`),
  getFlightByNumber: (number) => api.get(`/flights/number/${number}`),
  getDestinations: () => api.get('/flights/destinations')
};

export const bookingService = {
  createBooking: (data) => api.post('/bookings', data),
  getMyBookings: () => api.get('/bookings'),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getBookingByPNR: (pnr) => api.get(`/bookings/pnr/${pnr}`),
  cancelBooking: (id, reason) => api.put(`/bookings/${id}/cancel`, { reason }),
  confirmPayment: (id, paymentMethod) => api.put(`/bookings/${id}/payment`, { paymentMethod })
};

export const adminService = {
  addFlight: (data) => api.post('/admin/flights', data),
  updateFlight: (id, data) => api.put(`/admin/flights/${id}`, data),
  deleteFlight: (id) => api.delete(`/admin/flights/${id}`),
  getAllUsers: () => api.get('/admin/users'),
  getAllBookings: () => api.get('/admin/bookings'),
  getReports: () => api.get('/admin/reports')
};

export default api;