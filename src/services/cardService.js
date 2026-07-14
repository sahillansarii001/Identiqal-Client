import axiosInstance from './axiosInstance.js';

export const cardService = {
  getCards: async () => {
    return await axiosInstance.get('/cards');
  },

  createCard: async (slug, title) => {
    return await axiosInstance.post('/cards', { slug, title });
  },

  updateCard: async (cardId, cardData) => {
    return await axiosInstance.put(`/cards/${cardId}`, cardData);
  },

  publishCard: async (cardId, isPublished) => {
    return await axiosInstance.put(`/cards/${cardId}/publish`, { isPublished });
  },

  deleteCard: async (cardId) => {
    return await axiosInstance.delete(`/cards/${cardId}`);
  },

  getPublicCard: async (slug) => {
    // Calling endpoint directly
    return await axiosInstance.get(`/public/cards/${slug}`);
  },

  saveTheme: async (themeData) => {
    return await axiosInstance.post('/themes', themeData);
  },

  getTheme: async () => {
    return await axiosInstance.get('/themes');
  },
};
