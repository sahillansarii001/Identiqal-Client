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
  imageUrl: '',
  imageScale: 100,
  imagePositionX: 0,
  imagePositionY: 0,
  imageOpacity: 80,
  overlayType: 'None',
  imageRotation: 0,
  imagePlacement: 'Inside Header',
  containerStyle: 'None',
  containerSize: 100,
  containerBorder: false,
  containerShadow: false,
  containerPadding: 0,
  imageFit: 'Cover',
  imageBlur: 0,
  imageBrightness: 100,
  imageContrast: 100,
  imageSaturation: 100,
  isWorkspaceOpen: false,
  _workspaceBackup: null,

  // UI State
  isDirty: false,
  saveStatus: 'saved', // 'saved', 'saving', 'error'
  lastSavedAt: null,
  isBlockPickerOpen: false,
  previewDevice: 'smartphone', // 'desktop', 'tablet', 'smartphone'
  activeTab: 'links', // 'links', 'appearance'
  displayPreset: null,
  colorTheme: null,
  footerPreset: null,

  // History State
  past: [],
  future: [],

  // Set initial card data without history
  setCard: (cardData) => {
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
      imageUrl: card.imageUrl || '',
      imageScale: card.imageScale || 100,
      imagePositionX: card.imagePositionX || 0,
      imagePositionY: card.imagePositionY || 0,
      imageOpacity: card.imageOpacity !== undefined ? card.imageOpacity : 80,
      overlayType: card.overlayType || 'None',
      imageRotation: card.imageRotation || 0,
      imagePlacement: card.imagePlacement || 'Inside Header',
      containerStyle: card.containerStyle || 'None',
      containerSize: card.containerSize || 100,
      containerBorder: card.containerBorder || false,
      containerShadow: card.containerShadow || false,
      containerPadding: card.containerPadding || 0,
      imageFit: card.imageFit || 'Cover',
      imageBlur: card.imageBlur || 0,
      imageBrightness: card.imageBrightness || 100,
      imageContrast: card.imageContrast || 100,
      imageSaturation: card.imageSaturation || 100,
      isDirty: false,
      saveStatus: 'saved',
      past: [],
      future: [],
    });
  },

  // Internal helper to save state to history
  _saveToHistory: () => {
    const { 
      sections, seo, displayPreset, colorTheme, footerPreset, 
      imageUrl, imageScale, imagePositionX, imagePositionY, imageOpacity, overlayType, 
      imageRotation, imagePlacement, containerStyle, containerSize, containerBorder,
      containerShadow, containerPadding, imageFit, imageBlur, imageBrightness, imageContrast,
      imageSaturation, past 
    } = get();
    const newPast = [...past, { 
      sections: JSON.parse(JSON.stringify(sections)), 
      seo: JSON.parse(JSON.stringify(seo)),
      displayPreset: displayPreset ? JSON.parse(JSON.stringify(displayPreset)) : null,
      colorTheme: colorTheme ? JSON.parse(JSON.stringify(colorTheme)) : null,
      footerPreset: footerPreset ? JSON.parse(JSON.stringify(footerPreset)) : null,
      imageUrl,
      imageScale,
      imagePositionX,
      imagePositionY,
      imageOpacity,
      overlayType,
      imageRotation,
      imagePlacement,
      containerStyle,
      containerSize,
      containerBorder,
      containerShadow,
      containerPadding,
      imageFit,
      imageBlur,
      imageBrightness,
      imageContrast,
      imageSaturation,
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
  setActiveTab: (tab) => set({ activeTab: tab }),
  setBlockPickerOpen: (isOpen) => set({ isBlockPickerOpen: isOpen }),
  
  setDesignPreset: (type, preset) => {
    get()._saveToHistory();
    set({ [type]: preset, isDirty: true });
  },

  updateHeaderImage: (data) => {
    get()._saveToHistory();
    set({ ...data, isDirty: true });
  },

  updateHeaderImageRealTime: (data) => {
    set({ ...data, isDirty: true });
  },

  openWorkspace: () => {
    const state = get();
    set({
      isWorkspaceOpen: true,
      _workspaceBackup: {
        imageUrl: state.imageUrl,
        imageScale: state.imageScale,
        imagePositionX: state.imagePositionX,
        imagePositionY: state.imagePositionY,
        imageOpacity: state.imageOpacity,
        overlayType: state.overlayType,
        imageRotation: state.imageRotation || 0,
        imagePlacement: state.imagePlacement || 'Inside Header',
        containerStyle: state.containerStyle || 'None',
        containerSize: state.containerSize || 100,
        containerBorder: state.containerBorder || false,
        containerShadow: state.containerShadow || false,
        containerPadding: state.containerPadding || 0,
        imageFit: state.imageFit || 'Cover',
        imageBlur: state.imageBlur || 0,
        imageBrightness: state.imageBrightness || 100,
        imageContrast: state.imageContrast || 100,
        imageSaturation: state.imageSaturation || 100,
      }
    });
  },

  closeWorkspace: () => set({ isWorkspaceOpen: false, _workspaceBackup: null }),

  discardWorkspaceChanges: () => {
    const backup = get()._workspaceBackup;
    if (backup) {
      set({
        ...backup,
        isWorkspaceOpen: false,
        _workspaceBackup: null,
      });
    } else {
      set({ isWorkspaceOpen: false });
    }
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
        footerPreset: state.footerPreset,
        imageUrl: state.imageUrl,
        imageScale: state.imageScale,
        imagePositionX: state.imagePositionX,
        imagePositionY: state.imagePositionY,
        imageOpacity: state.imageOpacity,
        overlayType: state.overlayType,
        imageRotation: state.imageRotation,
        imagePlacement: state.imagePlacement,
        containerStyle: state.containerStyle,
        containerSize: state.containerSize,
        containerBorder: state.containerBorder,
        containerShadow: state.containerShadow,
        containerPadding: state.containerPadding,
        imageFit: state.imageFit,
        imageBlur: state.imageBlur,
        imageBrightness: state.imageBrightness,
        imageContrast: state.imageContrast,
        imageSaturation: state.imageSaturation,
      }, ...state.future],
      sections: previous.sections,
      seo: previous.seo,
      displayPreset: previous.displayPreset,
      colorTheme: previous.colorTheme,
      footerPreset: previous.footerPreset,
      imageUrl: previous.imageUrl,
      imageScale: previous.imageScale,
      imagePositionX: previous.imagePositionX,
      imagePositionY: previous.imagePositionY,
      imageOpacity: previous.imageOpacity,
      overlayType: previous.overlayType,
      imageRotation: previous.imageRotation,
      imagePlacement: previous.imagePlacement,
      containerStyle: previous.containerStyle,
      containerSize: previous.containerSize,
      containerBorder: previous.containerBorder,
      containerShadow: previous.containerShadow,
      containerPadding: previous.containerPadding,
      imageFit: previous.imageFit,
      imageBlur: previous.imageBlur,
      imageBrightness: previous.imageBrightness,
      imageContrast: previous.imageContrast,
      imageSaturation: previous.imageSaturation,
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
        footerPreset: state.footerPreset,
        imageUrl: state.imageUrl,
        imageScale: state.imageScale,
        imagePositionX: state.imagePositionX,
        imagePositionY: state.imagePositionY,
        imageOpacity: state.imageOpacity,
        overlayType: state.overlayType,
        imageRotation: state.imageRotation,
        imagePlacement: state.imagePlacement,
        containerStyle: state.containerStyle,
        containerSize: state.containerSize,
        containerBorder: state.containerBorder,
        containerShadow: state.containerShadow,
        containerPadding: state.containerPadding,
        imageFit: state.imageFit,
        imageBlur: state.imageBlur,
        imageBrightness: state.imageBrightness,
        imageContrast: state.imageContrast,
        imageSaturation: state.imageSaturation,
      }],
      future: newFuture,
      sections: next.sections,
      seo: next.seo,
      displayPreset: next.displayPreset,
      colorTheme: next.colorTheme,
      footerPreset: next.footerPreset,
      imageUrl: next.imageUrl,
      imageScale: next.imageScale,
      imagePositionX: next.imagePositionX,
      imagePositionY: next.imagePositionY,
      imageOpacity: next.imageOpacity,
      overlayType: next.overlayType,
      imageRotation: next.imageRotation,
      imagePlacement: next.imagePlacement,
      containerStyle: next.containerStyle,
      containerSize: next.containerSize,
      containerBorder: next.containerBorder,
      containerShadow: next.containerShadow,
      containerPadding: next.containerPadding,
      imageFit: next.imageFit,
      imageBlur: next.imageBlur,
      imageBrightness: next.imageBrightness,
      imageContrast: next.imageContrast,
      imageSaturation: next.imageSaturation,
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
    activeTab: 'links',
    displayPreset: null,
    colorTheme: null,
    footerPreset: null,
    imageUrl: '',
    imageScale: 100,
    imagePositionX: 0,
    imagePositionY: 0,
    imageOpacity: 80,
    overlayType: 'None',
    imageRotation: 0,
    imagePlacement: 'Inside Header',
    containerStyle: 'None',
    containerSize: 100,
    containerBorder: false,
    containerShadow: false,
    containerPadding: 0,
    imageFit: 'Cover',
    imageBlur: 0,
    imageBrightness: 100,
    imageContrast: 100,
    imageSaturation: 100,
    isWorkspaceOpen: false,
    _workspaceBackup: null,
    isDirty: false,
    past: [],
    future: [],
  }),
}));
