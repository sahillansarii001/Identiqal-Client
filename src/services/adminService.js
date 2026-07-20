import axiosInstance from "./axiosInstance";

export const adminService = {
  getDashboardStats: async () => {
    const response = await axiosInstance.get("/admin/stats");
    return response;
  },
  getUsers: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin/users?page=${page}&limit=${limit}`,
    );
    return response;
  },
  createUser: async (data) => {
    const response = await axiosInstance.post("/admin/users", data);
    return response;
  },
  getOrganizations: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin/organizations?page=${page}&limit=${limit}`,
    );
    return response;
  },
  getThemes: async () => {
    const response = await axiosInstance.get("/admin/themes");
    return response;
  },
  createTheme: async (data) => {
    const response = await axiosInstance.post("/admin/themes", data);
    return response;
  },
  updateTheme: async (id, data) => {
    const response = await axiosInstance.put(`/admin/themes/${id}`, data);
    return response;
  },
  deleteTheme: async (id) => {
    const response = await axiosInstance.delete(`/admin/themes/${id}`);
    return response;
  },
  seedDemoThemes: async () => {
    const response = await axiosInstance.post("/admin/themes/seed");
    return response;
  },
  updateUserStatus: async (userId, data) => {
    const response = await axiosInstance.put(`/admin/users/${userId}`, data);
    return response;
  },
  deleteUser: async (userId) => {
    const response = await axiosInstance.delete(`/admin/users/${userId}`);
    return response;
  },
  changeUserPassword: async (userId, data) => {
    const response = await axiosInstance.put(
      `/admin/users/${userId}/password`,
      data,
    );
    return response;
  },
  getAdvancedAnalytics: async () => {
    const response = await axiosInstance.get("/admin/analytics/timeseries");
    return response;
  },
  getTransactions: async (page = 1, limit = 10) => {
    const response = await axiosInstance.get(
      `/admin/transactions?page=${page}&limit=${limit}`,
    );
    return response;
  },
  getSettings: async () => {
    const response = await axiosInstance.get("/admin/settings");
    return response;
  },
  updateSettings: async (data) => {
    const response = await axiosInstance.put("/admin/settings", data);
    return response;
  },
  getAnnouncements: async () => {
    const response = await axiosInstance.get("/admin/announcements");
    return response;
  },
  createAnnouncement: async (data) => {
    const response = await axiosInstance.post("/admin/announcements", data);
    return response;
  },
  // ─── Card Templates ────────────────────────────────────────────────────────
  getCardTemplates: async () => {
    const response = await axiosInstance.get("/admin/card-templates");
    return response;
  },
  createCardTemplate: async (data) => {
    const response = await axiosInstance.post("/admin/card-templates", data);
    return response;
  },
  updateCardTemplate: async (id, data) => {
    const response = await axiosInstance.put(
      `/admin/card-templates/${id}`,
      data,
    );
    return response;
  },
  deleteCardTemplate: async (id) => {
    const response = await axiosInstance.delete(`/admin/card-templates/${id}`);
    return response;
  },
  seedCardTemplates: async () => {
    const response = await axiosInstance.post("/admin/templates/seed");
    return response;
  },
};
