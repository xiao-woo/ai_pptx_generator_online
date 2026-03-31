import { create } from 'zustand';
import { Outline, OutlineSection } from '../types';

interface OutlineStore {
  outline: Outline | null;
  setOutline: (outline: Outline) => void;
  updateSection: (sectionId: string, updates: Partial<OutlineSection>) => void;
  addSection: (section: OutlineSection) => void;
  removeSection: (sectionId: string) => void;
  reorderSections: (sections: OutlineSection[]) => void;
  clearOutline: () => void;
}

export const useOutlineStore = create<OutlineStore>((set) => ({
  outline: null,
  setOutline: (outline) => set({ outline }),
  updateSection: (sectionId, updates) =>
    set((state) => ({
      outline: state.outline
        ? {
            ...state.outline,
            sections: state.outline.sections.map((section) =>
              section.id === sectionId ? { ...section, ...updates } : section
            ),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  addSection: (section) =>
    set((state) => ({
      outline: state.outline
        ? {
            ...state.outline,
            sections: [...state.outline.sections, section],
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  removeSection: (sectionId) =>
    set((state) => ({
      outline: state.outline
        ? {
            ...state.outline,
            sections: state.outline.sections.filter((s) => s.id !== sectionId),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  reorderSections: (sections) =>
    set((state) => ({
      outline: state.outline
        ? {
            ...state.outline,
            sections: sections.sort((a, b) => a.order - b.order),
            updatedAt: new Date().toISOString(),
          }
        : null,
    })),
  clearOutline: () => set({ outline: null }),
}));