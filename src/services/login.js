import api from './api';

export const signupUser = (data) => api.post('/users/signup', data);
export const loginUser = (data) => api.post('/users/login', data);

export const logoutUser = () => api.post('/users/logout');
