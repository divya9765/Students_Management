import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Add a request interceptor to add the JWT token to headers
API.interceptors.request.use((req) => {
  const user = JSON.parse(localStorage.getItem('user'));
  if (user && user.token) {
    req.headers.Authorization = `Bearer ${user.token}`;
  }
  return req;
});

export const authService = {
  login: (userData) => API.post('/users/login', userData),
  register: (userData) => API.post('/users', userData),
};

export const studentService = {
  getAll: (params) => API.get('/students', { params }),
  getStats: () => API.get('/students/stats'),
  create: (formData) => API.post('/students', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  update: (id, formData) => API.put(`/students/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  }),
  delete: (id) => API.delete(`/students/${id}`),
};

export default API;
