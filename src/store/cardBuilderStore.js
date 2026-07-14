import { create } from 'zustand';

export const useCardBuilderStore = create((set) => ({
  cardId: null,
  slug: '',
  title: '',
  sections: [],
  seo: { metaTitle: '', metaDescription: '', ogImageUrl: '' },
  activeSectionId: null,
  isDirty: false,

  setCard: (card) => set({
    cardId: card._id,
    slug: card.slug,
    title: card.title,
    sections: card.sections || [],
    seo: card.seo || { metaTitle: '', metaDescription: '', ogImageUrl: '' },
    activeSectionId: card.sections?.[0]?.sectionId || null,
    isDirty: false,
  }),

  setSections: (sections) => set({
    sections,
    isDirty: true,
  }),

  addSection: (section) => set((state) => {
    const newSections = [...state.sections, section];
    return {
      sections: newSections,
      activeSectionId: section.sectionId,
      isDirty: true,
    };
  }),

  updateSection: (sectionId, updatedData) => set((state) => {
    const newSections = state.sections.map((sec) =>
      sec.sectionId === sectionId ? { ...sec, data: { ...sec.data, ...updatedData } } : sec
    );
    return {
      sections: newSections,
      isDirty: true,
    };
  }),

  toggleSectionVisibility: (sectionId) => set((state) => {
    const newSections = state.sections.map((sec) =>
      sec.sectionId === sectionId ? { ...sec, isVisible: !sec.isVisible } : sec
    );
    return {
      sections: newSections,
      isDirty: true,
    };
  }),

  removeSection: (sectionId) => set((state) => {
    const newSections = state.sections.filter((sec) => sec.sectionId !== sectionId);
    return {
      sections: newSections,
      activeSectionId: state.activeSectionId === sectionId ? (newSections[0]?.sectionId || null) : state.activeSectionId,
      isDirty: true,
    };
  }),

  setActiveSection: (sectionId) => set({
    activeSectionId: sectionId,
  }),

  setSeo: (seo) => set({
    seo: { ...seo },
    isDirty: true,
  }),

  resetBuilder: () => set({
    cardId: null,
    slug: '',
    title: '',
    sections: [],
    seo: { metaTitle: '', metaDescription: '', ogImageUrl: '' },
    activeSectionId: null,
    isDirty: false,
  }),
}));
