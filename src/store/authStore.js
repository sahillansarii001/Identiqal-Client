import { create } from 'zustand';

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,

  setAuth: (token, user) => set({
    accessToken: token,
    user: user,
    isAuthenticated: !!token,
  }),

  clearAuth: () => set({
    accessToken: null,
    user: null,
    isAuthenticated: false,
  }),

  updateUser: (updatedFields) => set((state) => ({
    user: state.user ? { ...state.user, ...updatedFields } : null,
  })),
}));
