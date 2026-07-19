import axiosInstance from "./axiosInstance.js";

export const analyticsService = {
  logEvent: async (cardId, type, metadata = {}) => {
    return await axiosInstance.post("/analytics/events", {
      cardId,
      type,
      metadata,
    });
  },

  getAnalytics: async (cardId) => {
    return await axiosInstance.get(`/cards/${cardId}/analytics`);
  },
};
