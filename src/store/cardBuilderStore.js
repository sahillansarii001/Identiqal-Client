import { create } from "zustand";

// Helper to keep max 50 history states
const MAX_HISTORY = 50;

export const useCardBuilderStore = create((set, get) => ({
  // Current State
  cardId: null,
  slug: "",
  title: "",
  sections: [],
  seo: { metaTitle: "", metaDescription: "", ogImageUrl: "" },
  activeSectionId: null,

  // UI State
  activeTab: "links", // 'links', 'appearance'
  isDirty: false,
  saveStatus: "saved", // 'saved', 'saving', 'error'
  lastSavedAt: null,
  isBlockPickerOpen: false,
  previewDevice: "smartphone", // 'desktop', 'tablet', 'smartphone'
  themeConfig: {
    fontFamily: "Inter",
    primaryColor: "#8a2be2",
    backgroundColor: "#ffffff",
    darkMode: false,
    radius: "16px",
  },

  // History State
  past: [],
  future: [],

  // Set initial card data without history
  setCard: (card) =>
    set({
      cardId: card._id,
      slug: card.slug,
      title: card.title,
      sections: card.sections || [],
      seo: card.seo || { metaTitle: "", metaDescription: "", ogImageUrl: "" },
      activeSectionId: card.sections?.[0]?.sectionId || null,
      isDirty: false,
      saveStatus: "saved",
      past: [],
      future: [],
    }),

  // Internal helper to save state to history
  _saveToHistory: () => {
    const { sections, seo, themeConfig, past } = get();
    const newPast = [
      ...past,
      {
        sections: JSON.parse(JSON.stringify(sections)),
        seo: JSON.parse(JSON.stringify(seo)),
        themeConfig: JSON.parse(JSON.stringify(themeConfig)),
      },
    ];
    if (newPast.length > MAX_HISTORY) newPast.shift();
    set({ past: newPast, future: [], isDirty: true });
  },

  setSections: (sections) => {
    get()._saveToHistory();
    set({ sections });
  },

  addSection: (section) => {
    get()._saveToHistory();
    set((state) => ({
      sections: [...state.sections, section],
      activeSectionId: section.sectionId,
    }));
  },

  updateSection: (sectionId, updatedData) => {
    get()._saveToHistory();
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.sectionId === sectionId
          ? { ...sec, data: { ...sec.data, ...updatedData } }
          : sec,
      ),
    }));
  },

  // For real-time updates where we might not want to push to history immediately (e.g. dragging a slider)
  // We can add a debounced history push if needed, but for now we'll do standard update.
  updateSectionRealTime: (sectionId, updatedData) => {
    set((state) => ({
      isDirty: true,
      sections: state.sections.map((sec) =>
        sec.sectionId === sectionId
          ? { ...sec, data: { ...sec.data, ...updatedData } }
          : sec,
      ),
    }));
  },

  toggleSectionVisibility: (sectionId) => {
    get()._saveToHistory();
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.sectionId === sectionId
          ? { ...sec, isVisible: !sec.isVisible }
          : sec,
      ),
    }));
  },

  removeSection: (sectionId) => {
    get()._saveToHistory();
    set((state) => {
      const newSections = state.sections.filter(
        (sec) => sec.sectionId !== sectionId,
      );
      return {
        sections: newSections,
        activeSectionId:
          state.activeSectionId === sectionId
            ? newSections[0]?.sectionId || null
            : state.activeSectionId,
      };
    });
  },

  setActiveSection: (sectionId) =>
    set({
      activeSectionId: sectionId,
    }),

  setActiveTab: (tab) => set({ activeTab: tab }),

  setSeo: (seo) => {
    get()._saveToHistory();
    set({ seo: { ...seo } });
  },

  setSaveStatus: (status) =>
    set({
      saveStatus: status,
      ...(status === "saved"
        ? { isDirty: false, lastSavedAt: Date.now() }
        : {}),
    }),

  setPreviewDevice: (device) => set({ previewDevice: device }),
  setBlockPickerOpen: (isOpen) => set({ isBlockPickerOpen: isOpen }),

  updateThemeConfig: (config) => {
    get()._saveToHistory();
    set((state) => ({ themeConfig: { ...state.themeConfig, ...config } }));
  },

  undo: () =>
    set((state) => {
      if (state.past.length === 0) return state;

      const previous = state.past[state.past.length - 1];
      const newPast = state.past.slice(0, state.past.length - 1);

      return {
        past: newPast,
        future: [
          {
            sections: state.sections,
            seo: state.seo,
            themeConfig: state.themeConfig,
          },
          ...state.future,
        ],
        sections: previous.sections,
        seo: previous.seo,
        themeConfig: previous.themeConfig || state.themeConfig, // fallback if older history entry
        isDirty: true,
      };
    }),

  redo: () =>
    set((state) => {
      if (state.future.length === 0) return state;

      const next = state.future[0];
      const newFuture = state.future.slice(1);

      return {
        past: [
          ...state.past,
          {
            sections: state.sections,
            seo: state.seo,
            themeConfig: state.themeConfig,
          },
        ],
        future: newFuture,
        sections: next.sections,
        seo: next.seo,
        themeConfig: next.themeConfig || state.themeConfig, // fallback
        isDirty: true,
      };
    }),

  resetBuilder: () =>
    set({
      cardId: null,
      slug: "",
      title: "",
      sections: [],
      seo: { metaTitle: "", metaDescription: "", ogImageUrl: "" },
      activeSectionId: null,
      isDirty: false,
      past: [],
      future: [],
    }),
}));
