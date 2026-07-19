import axiosInstance from "./axiosInstance.js";

export const leadService = {
  submitLead: async (cardId, leadData) => {
    return await axiosInstance.post(`/cards/${cardId}/leads`, leadData);
  },

  getLeads: async (cardId) => {
    return await axiosInstance.get(`/cards/${cardId}/leads`);
  },
};
