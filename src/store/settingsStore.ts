import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { TrelloConfig } from '../types';

interface SettingsState {
  darkMode: boolean;
  trelloEnabled: boolean;
  trelloConfig: TrelloConfig | null;
  isConfigured: boolean;
  toggleDarkMode: () => void;
  toggleTrello: () => void;
  setTrelloConfig: (config: TrelloConfig | null) => void;
}

export const useSettingsStore = create<SettingsState>()(
  persist(
    (set) => ({
      darkMode: false,
      trelloEnabled: false,
      trelloConfig: null,
      isConfigured: false,
      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),
      toggleTrello: () => set((state) => ({ trelloEnabled: !state.trelloEnabled })),
      setTrelloConfig: (config) => set({ 
        trelloConfig: config,
        isConfigured: !!config?.apiKey && !!config?.token && !!config?.boardId && !!config?.listId
      }),
    }),
    {
      name: 'settings-storage',
    }
  )
);