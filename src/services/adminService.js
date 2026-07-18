import axiosInstance from './axiosInstance';

export const adminService = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get('/admin/stats');
    return response.data;
  },
  getUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/admin/users?page=${page}&limit=${limit}`);
    return response.data;
  },
  getOrganizations: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/admin/organizations?page=${page}&limit=${limit}`);
    return response.data;
  },
  getThemes: async () => {
    const response = await axiosInstance.get('/admin/themes');
    return response.data;
  },
  createTheme: async (data) => {
    const response = await axiosInstance.post('/admin/themes', data);
    return response.data;
  },
  updateTheme: async (id, data) => {
    const response = await axiosInstance.put(`/admin/themes/${id}`, data);
    return response.data;
  },
  deleteTheme: async (id) => {
    const response = await axiosInstance.delete(`/admin/themes/${id}`);
    return response.data;
  },
  updateUserStatus: async (userId, data) => {
    const response = await axiosInstance.put(`/admin/users/${userId}`, data);
    return response.data;
  },
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response.data;
  },
  getAdvancedAnalytics: async () => {
    const response = await axiosInstance.get('/admin/analytics/timeseries');
    return response.data;
  },
  getTransactions: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(`/admin/transactions?page=${page}&limit=${limit}`);
    return response.data;
  },
  getSettings: async () => {
    const response = await axiosInstance.get('/admin/settings');
    return response.data;
  },
  updateSettings: async (data) => {
    const response = await axiosInstance.put('/admin/settings', data);
    return response.data;
  },
  getAnnouncements: async () => {
    const response = await axiosInstance.get('/admin/announcements');
    return response.data;
  },
  createAnnouncement: async (data) => {
    const response = await axiosInstance.post('/admin/announcements', data);
    return response.data;
  },
  // ─── Card Templates ────────────────────────────────────────────────────────
  getCardTemplates: async () => {
    const response = await axiosInstance.get('/admin/card-templates');
    return response.data;
  },
  createCardTemplate: async (data) => {
    const response = await axiosInstance.post('/admin/card-templates', data);
    return response.data;
  },
  updateCardTemplate: async (id, data) => {
    const response = await axiosInstance.put(`/admin/card-templates/${id}`, data);
    return response.data;
  },
  deleteCardTemplate: async (id) => {
    const response = await axiosInstance.delete(`/admin/card-templates/${id}`);
    return response.data;
  },
};
