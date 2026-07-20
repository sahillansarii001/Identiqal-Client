import { create } from 'zustand';

// Helper to keep max 50 history states
const MAX_HISTORY = 50;

export const useCardBuilderStore = create((set, get) => ({
  // Current State
  cardId: null,
  slug: '',
  title: '',
  sections: [],
  seo: { metaTitle: '', metaDescription: '', ogImageUrl: '' },
  activeSectionId: null,

  // UI State
  isDirty: false,
  saveStatus: 'saved', // 'saved', 'saving', 'error'
  lastSavedAt: null,
  isBlockPickerOpen: false,
  previewDevice: 'smartphone', // 'desktop', 'tablet', 'smartphone'
  displayPreset: null,
  colorTheme: null,
  footerPreset: null,

  // History State
  past: [],
  future: [],

  // Set initial card data without history
  setCard: (cardData) => {
    // We expect the backend to send { card, displayPreset, colorTheme, footerPreset }
    // Or just a card object if it's the raw card
    const card = cardData.card || cardData;
    
    set({
      cardId: card._id,
      slug: card.slug,
      title: card.title,
      sections: card.sections || [],
      seo: card.seo || { metaTitle: '', metaDescription: '', ogImageUrl: '' },
      activeSectionId: card.sections?.[0]?.sectionId || null,
      displayPreset: cardData.displayPreset || null,
      colorTheme: cardData.colorTheme || null,
      footerPreset: cardData.footerPreset || null,
      isDirty: false,
      saveStatus: 'saved',
      past: [],
      future: [],
    });
  },

  // Internal helper to save state to history
  _saveToHistory: () => {
    const { sections, seo, displayPreset, colorTheme, footerPreset, past } = get();
    const newPast = [...past, { 
      sections: JSON.parse(JSON.stringify(sections)), 
      seo: JSON.parse(JSON.stringify(seo)),
      displayPreset: displayPreset ? JSON.parse(JSON.stringify(displayPreset)) : null,
      colorTheme: colorTheme ? JSON.parse(JSON.stringify(colorTheme)) : null,
      footerPreset: footerPreset ? JSON.parse(JSON.stringify(footerPreset)) : null,
    }];
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
        sec.sectionId === sectionId ? { ...sec, data: { ...sec.data, ...updatedData } } : sec
      ),
    }));
  },

  updateSectionRealTime: (sectionId, updatedData) => {
    set((state) => ({
      isDirty: true,
      sections: state.sections.map((sec) =>
        sec.sectionId === sectionId ? { ...sec, data: { ...sec.data, ...updatedData } } : sec
      ),
    }));
  },

  toggleSectionVisibility: (sectionId) => {
    get()._saveToHistory();
    set((state) => ({
      sections: state.sections.map((sec) =>
        sec.sectionId === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
      ),
    }));
  },

  removeSection: (sectionId) => {
    get()._saveToHistory();
    set((state) => {
      const newSections = state.sections.filter((sec) => sec.sectionId !== sectionId);
      return {
        sections: newSections,
        activeSectionId: state.activeSectionId === sectionId ? (newSections[0]?.sectionId || null) : state.activeSectionId,
      };
    });
  },

  setActiveSection: (sectionId) => set({
    activeSectionId: sectionId,
  }),

  setSeo: (seo) => {
    get()._saveToHistory();
    set({ seo: { ...seo } });
  },

  setSaveStatus: (status) => set({
    saveStatus: status,
    ...(status === 'saved' ? { isDirty: false, lastSavedAt: Date.now() } : {})
  }),

  setPreviewDevice: (device) => set({ previewDevice: device }),
  setBlockPickerOpen: (isOpen) => set({ isBlockPickerOpen: isOpen }),
  
  setDesignPreset: (type, preset) => {
    get()._saveToHistory();
    set({ [type]: preset, isDirty: true });
  },

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    
    return {
      past: newPast,
      future: [{ 
        sections: state.sections, 
        seo: state.seo, 
        displayPreset: state.displayPreset,
        colorTheme: state.colorTheme,
        footerPreset: state.footerPreset 
      }, ...state.future],
      sections: previous.sections,
      seo: previous.seo,
      displayPreset: previous.displayPreset,
      colorTheme: previous.colorTheme,
      footerPreset: previous.footerPreset,
      isDirty: true,
    };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    
    return {
      past: [...state.past, { 
        sections: state.sections, 
        seo: state.seo, 
        displayPreset: state.displayPreset,
        colorTheme: state.colorTheme,
        footerPreset: state.footerPreset 
      }],
      future: newFuture,
      sections: next.sections,
      seo: next.seo,
      displayPreset: next.displayPreset,
      colorTheme: next.colorTheme,
      footerPreset: next.footerPreset,
      isDirty: true,
    };
  }),

  resetBuilder: () => set({
    cardId: null,
    slug: '',
    title: '',
    sections: [],
    seo: { metaTitle: '', metaDescription: '', ogImageUrl: '' },
    activeSectionId: null,
    displayPreset: null,
    colorTheme: null,
    footerPreset: null,
    isDirty: false,
    past: [],
    future: [],
  }),
}));
