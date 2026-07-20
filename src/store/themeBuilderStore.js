import { create } from "zustand";

export const useThemeBuilderStore = create((set) => ({
  themeId: null,
  colors: {
    primary: "#000000",
    secondary: "#6c757d",
    background: "#ffffff",
    text: "#212529",
    accent: "#0d6efd",
  },
  font: {
    heading: "Inter",
    body: "Inter",
  },
  layoutStyle: "minimal",
  buttonStyle: "rounded",
  isLockedByOrg: false,
  isDirty: false,

  setTheme: (theme) =>
    set({
      themeId: theme._id,
      colors: theme.colors || {
        primary: "#000000",
        secondary: "#6c757d",
        background: "#ffffff",
        text: "#212529",
        accent: "#0d6efd",
      },
      font: theme.font || { heading: "Inter", body: "Inter" },
      layoutStyle: theme.layoutStyle || "minimal",
      buttonStyle: theme.buttonStyle || "rounded",
      isLockedByOrg: theme.isLockedByOrg || false,
      isDirty: false,
    }),

  updateColors: (colors) =>
    set((state) => ({
      colors: { ...state.colors, ...colors },
      isDirty: true,
    })),

  updateFont: (font) =>
    set((state) => ({
      font: { ...state.font, ...font },
      isDirty: true,
    })),

  setLayoutStyle: (layoutStyle) =>
    set({
      layoutStyle,
      isDirty: true,
    }),

  setButtonStyle: (buttonStyle) =>
    set({
      buttonStyle,
      isDirty: true,
    }),

  setIsLockedByOrg: (isLockedByOrg) =>
    set({
      isLockedByOrg,
      isDirty: true,
    }),

  resetTheme: () =>
    set({
      themeId: null,
      colors: {
        primary: "#000000",
        secondary: "#6c757d",
        background: "#ffffff",
        text: "#212529",
        accent: "#0d6efd",
      },
      font: { heading: "Inter", body: "Inter" },
      layoutStyle: "minimal",
      buttonStyle: "rounded",
      isLockedByOrg: false,
      isDirty: false,
    }),
}));
