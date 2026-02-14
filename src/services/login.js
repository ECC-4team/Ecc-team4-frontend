import api from './api';

export const signupUser = (userData) => {
  return api.post('/users/signup', userData);
};

export const loginUser = (credentials) => {
  return api.post('/users/login', credentials, { withCredentials: true });
};

export const logoutUser = () => {
  return api.post('/users/logout', {}, { withCredentials: true });
};
