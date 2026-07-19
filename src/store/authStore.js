import { create } from "zustand";

export const useAuthStore = create((set) => ({
  accessToken: null,
  user: null,
  isAuthenticated: false,
  isCheckingAuth: true, // Initially true on page load

  setAuth: (token, user) =>
    set({
      accessToken: token,
      user: user,
      isAuthenticated: !!token,
      isCheckingAuth: false,
    }),

  clearAuth: () =>
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isCheckingAuth: false,
    }),

  setCheckingAuth: (status) => set({ isCheckingAuth: status }),

  updateUser: (updatedFields) =>
    set((state) => ({
      user: state.user ? { ...state.user, ...updatedFields } : null,
    })),
}));
