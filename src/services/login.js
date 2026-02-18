import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`; 
  }
  return config;
});

export const signupUser = (data) => api.post('/users/signup', data);
export const loginUser = (data) => api.post('/users/login', data);

export const logoutUser = () => api.post('/users/logout');