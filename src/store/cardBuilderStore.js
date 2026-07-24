import { create } from 'zustand';

const MAX_HISTORY = 50;

export const useCardBuilderStore = create((set, get) => ({
  cardId: null,
  slug: '',
  title: '',
  sections: [],
  seo: { metaTitle: '', metaDescription: '', ogImageUrl: '' },
  activeSectionId: null,

  // ─── QR CODE ─────────────────────────────────────────────────────────────
  showQRCode: false,
  qrType: 'generated',
  qrImage: '',
  qrTitle: '',
  qrDescription: '',
  qrSettings: { bgColor: '#ffffff', borderRadius: 16, shadow: true, border: true, padding: 16, width: 200 },


  // ─── COVER IMAGE ─────────────────────────────────────────────────────────
  imageUrl: '',
  isVideo: false,
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

  // ─── AVATAR ───────────────────────────────────────────────────────────────
  avatarUrl: '',
  avatarShape: 'circle',
  avatarScale: 100,
  avatarPositionX: 0,
  avatarPositionY: 0,
  avatarRotation: 0,
  avatarFlipH: false,
  avatarFlipV: false,
  avatarBorderWidth: 3,
  avatarBorderColor: '#ffffff',
  avatarShadow: true,
  avatarGlow: false,
  avatarBackground: 'transparent',
  avatarOpacity: 100,
  avatarPosition: 'center',
  avatarLayer: 'above-header',

  // ─── UI STATE ─────────────────────────────────────────────────────────────
  isWorkspaceOpen: false,
  _workspaceBackup: null,
  isCoverEditorOpen: false,
  isAvatarEditorOpen: false,
  isDirty: false,
  saveStatus: 'saved',
  lastSavedAt: null,
  isBlockPickerOpen: false,
  previewDevice: 'smartphone',
  activeTab: 'links',
  displayPreset: null,
  colorTheme: null,
  footerPreset: null,
  wizardCompleted: false,
  wizardStep: 0,
  past: [],
  future: [],

  setCard: (cardData) => {
    const card = cardData.card || cardData;
    const resolvedDisplayPreset = cardData.displayPreset || card.displayPreset || (typeof card.displayPresetId === 'object' ? card.displayPresetId : card.displayPresetId) || null;
    const resolvedColorTheme = cardData.colorTheme || card.colorTheme || (typeof card.colorThemeId === 'object' ? card.colorThemeId : card.colorThemeId) || null;
    const resolvedFooterPreset = cardData.footerPreset || card.footerPreset || (typeof card.footerPresetId === 'object' ? card.footerPresetId : card.footerPresetId) || null;

    set({
      cardId: card._id,
      wizardCompleted: card.wizardCompleted !== undefined 
        ? card.wizardCompleted 
        : ((card.sections && card.sections.length > 0) || !!card.displayPresetId || !!card.colorThemeId),
      wizardStep: 0,
      slug: card.slug,
      title: card.title,
      isPublished: card.isPublished !== undefined ? card.isPublished : true,
      sections: card.sections || [],
      seo: card.seo || { metaTitle: '', metaDescription: '', ogImageUrl: '' },
      activeSectionId: card.sections?.[0]?.sectionId || null,
      displayPreset: resolvedDisplayPreset,
      colorTheme: resolvedColorTheme,
      footerPreset: resolvedFooterPreset,
      imageUrl: card.imageUrl || '',
      isVideo: card.isVideo || false,
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
      avatarUrl: card.avatarUrl || '',
      avatarShape: card.avatarShape || 'circle',
      avatarScale: card.avatarScale || 100,
      avatarPositionX: card.avatarPositionX || 0,
      avatarPositionY: card.avatarPositionY || 0,
      avatarRotation: card.avatarRotation || 0,
      avatarFlipH: card.avatarFlipH || false,
      avatarFlipV: card.avatarFlipV || false,
      avatarBorderWidth: card.avatarBorderWidth !== undefined ? card.avatarBorderWidth : 3,
      avatarBorderColor: card.avatarBorderColor || '#ffffff',
      avatarShadow: card.avatarShadow !== undefined ? card.avatarShadow : true,
      avatarGlow: card.avatarGlow || false,
      avatarBackground: card.avatarBackground || 'transparent',
      avatarOpacity: card.avatarOpacity !== undefined ? card.avatarOpacity : 100,
      avatarPosition: card.avatarPosition || 'center',
      avatarLayer: card.avatarLayer || 'above-header',
      
      showQRCode: card.showQRCode || false,
      qrType: card.qrType || 'generated',
      qrImage: card.qrImage || '',
      qrTitle: card.qrTitle || '',
      qrDescription: card.qrDescription || '',
      qrSettings: card.qrSettings || { bgColor: '#ffffff', borderRadius: 16, shadow: true, border: true, padding: 16, width: 200 },
      
      isDirty: false,
      saveStatus: 'saved',
      past: [],
      future: [],
    });
  },

  _saveToHistory: () => {
    const s = get();
    const snap = {
      sections: JSON.parse(JSON.stringify(s.sections)),
      seo: JSON.parse(JSON.stringify(s.seo)),
      displayPreset: s.displayPreset ? JSON.parse(JSON.stringify(s.displayPreset)) : null,
      colorTheme: s.colorTheme ? JSON.parse(JSON.stringify(s.colorTheme)) : null,
      footerPreset: s.footerPreset ? JSON.parse(JSON.stringify(s.footerPreset)) : null,
      imageUrl: s.imageUrl, isVideo: s.isVideo, imageScale: s.imageScale, imagePositionX: s.imagePositionX,
      imagePositionY: s.imagePositionY, imageOpacity: s.imageOpacity, overlayType: s.overlayType,
      imageRotation: s.imageRotation, imagePlacement: s.imagePlacement, containerStyle: s.containerStyle,
      containerSize: s.containerSize, containerBorder: s.containerBorder, containerShadow: s.containerShadow,
      containerPadding: s.containerPadding, imageFit: s.imageFit, imageBlur: s.imageBlur,
      imageBrightness: s.imageBrightness, imageContrast: s.imageContrast, imageSaturation: s.imageSaturation,
      avatarUrl: s.avatarUrl, avatarShape: s.avatarShape, avatarScale: s.avatarScale,
      avatarPositionX: s.avatarPositionX, avatarPositionY: s.avatarPositionY,
      avatarRotation: s.avatarRotation, avatarFlipH: s.avatarFlipH, avatarFlipV: s.avatarFlipV,
      avatarBorderWidth: s.avatarBorderWidth, avatarBorderColor: s.avatarBorderColor,
      avatarShadow: s.avatarShadow, avatarGlow: s.avatarGlow,
      avatarBackground: s.avatarBackground, avatarOpacity: s.avatarOpacity,
      avatarPosition: s.avatarPosition, avatarLayer: s.avatarLayer,
      showQRCode: s.showQRCode, qrType: s.qrType, qrImage: s.qrImage, 
      qrTitle: s.qrTitle, qrDescription: s.qrDescription, qrSettings: s.qrSettings,
    };
    const newPast = [...s.past, snap];
    if (newPast.length > MAX_HISTORY) newPast.shift();
    set({ past: newPast, future: [], isDirty: true });
  },

  setSections: (sections) => { get()._saveToHistory(); set({ sections }); },
  addSection: (section) => {
    get()._saveToHistory();
    set((state) => ({ sections: [...state.sections, section], activeSectionId: section.sectionId }));
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
        activeSectionId: state.activeSectionId === sectionId
          ? (newSections[0]?.sectionId || null)
          : state.activeSectionId,
      };
    });
  },
  setActiveSection: (sectionId) => set({ activeSectionId: sectionId }),
  setSeo: (seo) => { get()._saveToHistory(); set({ seo: { ...seo } }); },
  setSaveStatus: (status) => set({
    saveStatus: status,
    ...(status === 'saved' ? { isDirty: false, lastSavedAt: Date.now() } : {}),
  }),
  setPreviewDevice: (device) => set({ previewDevice: device }),
  setActiveTab: (tab) => set({ activeTab: tab }),
  setBlockPickerOpen: (isOpen) => set({ isBlockPickerOpen: isOpen }),
  setDesignPreset: (type, preset) => { get()._saveToHistory(); set({ [type]: preset, isDirty: true }); },

  // Wizard actions
  setWizardStep: (step) => set({ wizardStep: step }),
  nextWizardStep: () => set((state) => ({ wizardStep: Math.min(state.wizardStep + 1, 6) })),
  prevWizardStep: () => set((state) => ({ wizardStep: Math.max(state.wizardStep - 1, 0) })),
  completeWizard: () => {
    const s = get();
    set({ wizardCompleted: true, isDirty: true });
    if (s.cardId) {
      import('../services/cardService.js').then(({ cardService }) => {
        cardService.updateCard(s.cardId, { wizardCompleted: true }).catch(() => {});
      });
    }
  },
  resetWizard: () => set({ wizardCompleted: false, wizardStep: 0 }),

  // Cover
  updateHeaderImage: (data) => { get()._saveToHistory(); set({ ...data, isDirty: true }); },
  updateHeaderImageRealTime: (data) => set({ ...data, isDirty: true }),
  openCoverEditor: () => {
    const s = get();
    set({
      isCoverEditorOpen: true,
      _workspaceBackup: {
        imageUrl: s.imageUrl, isVideo: s.isVideo, imageScale: s.imageScale, imagePositionX: s.imagePositionX,
        imagePositionY: s.imagePositionY, imageOpacity: s.imageOpacity, overlayType: s.overlayType,
        imageRotation: s.imageRotation, imagePlacement: s.imagePlacement, containerStyle: s.containerStyle,
        containerSize: s.containerSize, containerBorder: s.containerBorder, containerShadow: s.containerShadow,
        containerPadding: s.containerPadding, imageFit: s.imageFit, imageBlur: s.imageBlur,
        imageBrightness: s.imageBrightness, imageContrast: s.imageContrast, imageSaturation: s.imageSaturation,
      },
    });
  },
  closeCoverEditor: () => set({ isCoverEditorOpen: false, _workspaceBackup: null }),
  // Legacy aliases
  openWorkspace: () => get().openCoverEditor(),
  closeWorkspace: () => set({ isWorkspaceOpen: false, isCoverEditorOpen: false, _workspaceBackup: null }),
  discardWorkspaceChanges: () => {
    const backup = get()._workspaceBackup;
    if (backup) set({ ...backup, isWorkspaceOpen: false, isCoverEditorOpen: false, _workspaceBackup: null });
    else set({ isWorkspaceOpen: false, isCoverEditorOpen: false });
  },

  // Avatar
  updateAvatar: (data) => { get()._saveToHistory(); set({ ...data, isDirty: true }); },
  updateAvatarRealTime: (data) => set({ ...data, isDirty: true }),
  openAvatarEditor: () => set({ isAvatarEditorOpen: true }),
  closeAvatarEditor: () => set({ isAvatarEditorOpen: false }),

  // QR Code
  updateQrCode: (data) => {
    get()._saveToHistory();
    set((state) => {
      let newSections = state.sections;
      
      // If toggling on for the first time, make sure there's a block in sections array for drag/drop
      if (data.showQRCode === true && !state.sections.find(s => s.type === 'qrcode')) {
        const order = state.sections.length > 0 ? Math.max(...state.sections.map(s => s.order || 0)) + 1 : 1;
        newSections = [...state.sections, { type: 'qrcode', sectionId: 'qrcode', isVisible: true, order }];
      }
      
      return { ...data, sections: newSections, isDirty: true };
    });
  },
  updateQrCodeRealTime: (data) => set({ ...data, isDirty: true }),

  undo: () => set((state) => {
    if (state.past.length === 0) return state;
    const previous = state.past[state.past.length - 1];
    const newPast = state.past.slice(0, state.past.length - 1);
    const cur = {
      sections: state.sections, seo: state.seo,
      displayPreset: state.displayPreset, colorTheme: state.colorTheme, footerPreset: state.footerPreset,
      imageUrl: state.imageUrl, isVideo: state.isVideo, imageScale: state.imageScale, imagePositionX: state.imagePositionX,
      imagePositionY: state.imagePositionY, imageOpacity: state.imageOpacity, overlayType: state.overlayType,
      imageRotation: state.imageRotation, imagePlacement: state.imagePlacement,
      containerStyle: state.containerStyle, containerSize: state.containerSize,
      containerBorder: state.containerBorder, containerShadow: state.containerShadow,
      containerPadding: state.containerPadding, imageFit: state.imageFit, imageBlur: state.imageBlur,
      imageBrightness: state.imageBrightness, imageContrast: state.imageContrast, imageSaturation: state.imageSaturation,
      avatarUrl: state.avatarUrl, avatarShape: state.avatarShape, avatarScale: state.avatarScale,
      avatarPositionX: state.avatarPositionX, avatarPositionY: state.avatarPositionY,
      avatarRotation: state.avatarRotation, avatarFlipH: state.avatarFlipH, avatarFlipV: state.avatarFlipV,
      avatarBorderWidth: state.avatarBorderWidth, avatarBorderColor: state.avatarBorderColor,
      avatarShadow: state.avatarShadow, avatarGlow: state.avatarGlow,
      avatarBackground: state.avatarBackground, avatarOpacity: state.avatarOpacity,
      avatarPosition: state.avatarPosition, avatarLayer: state.avatarLayer,
      showQRCode: state.showQRCode, qrType: state.qrType, qrImage: state.qrImage,
      qrTitle: state.qrTitle, qrDescription: state.qrDescription, qrSettings: state.qrSettings,
    };
    return { past: newPast, future: [cur, ...state.future], ...previous, isDirty: true };
  }),

  redo: () => set((state) => {
    if (state.future.length === 0) return state;
    const next = state.future[0];
    const newFuture = state.future.slice(1);
    const cur = {
      sections: state.sections, seo: state.seo,
      displayPreset: state.displayPreset, colorTheme: state.colorTheme, footerPreset: state.footerPreset,
      imageUrl: state.imageUrl, isVideo: state.isVideo, imageScale: state.imageScale, imagePositionX: state.imagePositionX,
      imagePositionY: state.imagePositionY, imageOpacity: state.imageOpacity, overlayType: state.overlayType,
      imageRotation: state.imageRotation, imagePlacement: state.imagePlacement,
      containerStyle: state.containerStyle, containerSize: state.containerSize,
      containerBorder: state.containerBorder, containerShadow: state.containerShadow,
      containerPadding: state.containerPadding, imageFit: state.imageFit, imageBlur: state.imageBlur,
      imageBrightness: state.imageBrightness, imageContrast: state.imageContrast, imageSaturation: state.imageSaturation,
      avatarUrl: state.avatarUrl, avatarShape: state.avatarShape, avatarScale: state.avatarScale,
      avatarPositionX: state.avatarPositionX, avatarPositionY: state.avatarPositionY,
      avatarRotation: state.avatarRotation, avatarFlipH: state.avatarFlipH, avatarFlipV: state.avatarFlipV,
      avatarBorderWidth: state.avatarBorderWidth, avatarBorderColor: state.avatarBorderColor,
      avatarShadow: state.avatarShadow, avatarGlow: state.avatarGlow,
      avatarBackground: state.avatarBackground, avatarOpacity: state.avatarOpacity,
      avatarPosition: state.avatarPosition, avatarLayer: state.avatarLayer,
      showQRCode: state.showQRCode, qrType: state.qrType, qrImage: state.qrImage,
      qrTitle: state.qrTitle, qrDescription: state.qrDescription, qrSettings: state.qrSettings,
    };
    return { past: [...state.past, cur], future: newFuture, ...next, isDirty: true };
  }),

  resetBuilder: () => set({
    cardId: null, slug: '', title: '', sections: [],
    seo: { metaTitle: '', metaDescription: '', ogImageUrl: '' },
    activeSectionId: null, activeTab: 'links',
    displayPreset: null, colorTheme: null, footerPreset: null,
    imageUrl: '', isVideo: false, imageScale: 100, imagePositionX: 0, imagePositionY: 0, imageOpacity: 80,
    overlayType: 'None', imageRotation: 0, imagePlacement: 'Inside Header', containerStyle: 'None',
    containerSize: 100, containerBorder: false, containerShadow: false, containerPadding: 0,
    imageFit: 'Cover', imageBlur: 0, imageBrightness: 100, imageContrast: 100, imageSaturation: 100,
    avatarUrl: '', avatarShape: 'circle', avatarScale: 100, avatarPositionX: 0, avatarPositionY: 0,
    avatarRotation: 0, avatarFlipH: false, avatarFlipV: false, avatarBorderWidth: 3,
    avatarBorderColor: '#ffffff', avatarShadow: true, avatarGlow: false,
    avatarBackground: 'transparent', avatarOpacity: 100,
    avatarPosition: 'center', avatarLayer: 'above-header',
    showQRCode: false, qrType: 'generated', qrImage: '', qrTitle: '', qrDescription: '', 
    qrSettings: { bgColor: '#ffffff', borderRadius: 16, shadow: true, border: true, padding: 16, width: 200 },
    isWorkspaceOpen: false, isCoverEditorOpen: false, isAvatarEditorOpen: false, _workspaceBackup: null,
    isDirty: false, past: [], future: [],
  }),
}));
