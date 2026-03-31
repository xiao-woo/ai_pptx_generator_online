import { create } from 'zustand';
import { PPT, Template } from '../types';

interface PPTStore {
  ppt: PPT | null;
  selectedTemplate: Template | null;
  setPPT: (ppt: PPT) => void;
  setSelectedTemplate: (template: Template) => void;
  clearPPT: () => void;
}

export const usePPTStore = create<PPTStore>((set) => ({
  ppt: null,
  selectedTemplate: null,
  setPPT: (ppt) => set({ ppt }),
  setSelectedTemplate: (template) => set({ selectedTemplate: template }),
  clearPPT: () => set({ ppt: null, selectedTemplate: null }),
}));