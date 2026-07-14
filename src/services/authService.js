import axiosInstance from './axiosInstance.js';

export const authService = {
  signup: async (name, email, password) => {
    return await axiosInstance.post('/auth/signup', { name, email, password });
  },

  login: async (email, password) => {
    return await axiosInstance.post('/auth/login', { email, password });
  },

  logout: async () => {
    return await axiosInstance.post('/auth/logout');
  },

  refresh: async () => {
    return await axiosInstance.post('/auth/refresh');
  },
};
