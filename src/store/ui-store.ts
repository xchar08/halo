import { create } from 'zustand';

interface UIState {
  sidebarOpen: boolean;
  activePanel: 'research' | 'graph' | 'editor';
  toggleSidebar: () => void;
  setActivePanel: (panel: 'research' | 'graph' | 'editor') => void;
}

/**
 * Global UI Store (Zustand).
 * Manages layout state and active views.
 */
export const useUIStore = create<UIState>((set) => ({
  sidebarOpen: true,
  activePanel: 'graph',
  toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
  setActivePanel: (panel) => set({ activePanel: panel }),
}));
