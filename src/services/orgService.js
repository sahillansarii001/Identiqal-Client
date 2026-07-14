import axiosInstance from './axiosInstance.js';

export const orgService = {
  createOrg: async (name, logoUrl) => {
    return await axiosInstance.post('/organizations', { name, logoUrl });
  },

  inviteMember: async (orgId, email, role) => {
    return await axiosInstance.post(`/organizations/${orgId}/invite`, { email, role });
  },
};
