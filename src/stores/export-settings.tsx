import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';

export interface ExportSettingsStoreFields {
  filename: string
}

export interface ExportSettingsStoreActions {
  setFilename: (filename: string) => void
}

export type ExportSettingsStoreState = ExportSettingsStoreFields & ExportSettingsStoreActions;

type SavedExportSettings = {
  filename: string
};

function loadSavedSettings(): SavedExportSettings {
  const defaultData: ExportSettingsStoreFields = {
    filename: 'flashcards.json',
  };

  try {
    const savedRawData = localStorage.getItem('exportSettings');
    if (!savedRawData) {
      return defaultData;
    }

    return JSON.parse(savedRawData) as SavedExportSettings;
  }
  catch (e) {
    console.log('Failed to load saved Export settings');
    return defaultData;
  }
}

export const createExportSettingsStore = () => {
  const savedValues = loadSavedSettings();
  return createStore<ExportSettingsStoreState>()(
    immer((set): ExportSettingsStoreState => {
      return {
        filename: savedValues.filename,
        setFilename: (filename: string) => {
          localStorage.setItem('exportSettings', JSON.stringify({
            filename,
          }));

          set({
            filename,
          });
        },
      };
    }));
};

export type ExportSettingsStore = ReturnType<typeof createExportSettingsStore>;

export const ExportSettingsStoreContext = createContext<ExportSettingsStore | null>(null);

export const useExportSettingsStore = () => {
  const storeFromContext = useContext(ExportSettingsStoreContext);
  return useStore(storeFromContext!);
};
