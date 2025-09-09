import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';

export interface FileToLoadRecords {
  fileName: string
  fileId: string
}

export interface GoogleDriveStoreFields {
  itemsCount: number
  fileToLoadRecords: Record<string, FileToLoadRecords>
}

export interface GoogleDriveStoreActions {
  addFileToLoad: (fileToLoad: FileToLoadRecords) => void
  removeFileToLoad: (fileId: string) => void
}

export type GoogleDriveStoreState = GoogleDriveStoreFields & GoogleDriveStoreActions;

export interface GoogleDriveStoredData {
  filesIdsToLoad: FileToLoadRecords[]
}

function loadStoredData(): GoogleDriveStoredData {
  const savedData = localStorage.getItem('googleDriveSettings');
  const defaultData: GoogleDriveStoredData = {
    filesIdsToLoad: [],
  };

  if (!savedData) {
    return defaultData;
  }

  try {
    return JSON.parse(savedData);
  }
  catch (e) {
    return defaultData;
  }
}

function convertFilesToSaveToStorageFormat(filesMap: GoogleDriveStoreFields['fileToLoadRecords']) {
  const filesIdsToLoad: FileToLoadRecords[] = [];
  for (const fileId in filesMap) {
    const fileToLoad = filesMap[fileId];
    filesIdsToLoad.push({
      fileName: fileToLoad.fileName,
      fileId: fileToLoad.fileId,
    });
  }
  return filesIdsToLoad;
}

export const createGoogleDriveStore = () => {
  return createStore<GoogleDriveStoreState>()(
    immer((set): GoogleDriveStoreState => {
      const savedData = loadStoredData();

      return {
        fileToLoadRecords: savedData.filesIdsToLoad.reduce(
          (acc, value) => {
            acc[value.fileId] = value;
            return acc;
          }, {} as Record<string, FileToLoadRecords>,
        ),
        itemsCount: savedData.filesIdsToLoad.length,
        addFileToLoad: (fileToLoad) => {
          set((state) => {
            if (!state.fileToLoadRecords[fileToLoad.fileId]) {
              state.fileToLoadRecords[fileToLoad.fileId] = fileToLoad;
              state.itemsCount++;
              localStorage.setItem('googleDriveSettings', JSON.stringify({
                filesIdsToLoad: convertFilesToSaveToStorageFormat(state.fileToLoadRecords),
              }));
            }
          });
        },
        removeFileToLoad: (fileId) => {
          set((state) => {
            delete state.fileToLoadRecords[fileId];
            state.itemsCount--;
            localStorage.setItem('googleDriveSettings', JSON.stringify({
              filesIdsToLoad: convertFilesToSaveToStorageFormat(state.fileToLoadRecords),
            }));
          });
        },
      };
    }));
};

export type GoogleDriveStore = ReturnType<typeof createGoogleDriveStore>;

export const GoogleDriveStoreContext = createContext<GoogleDriveStore | null>(null);

export const useGoogleDriveStore = () => {
  const storeFromContext = useContext(GoogleDriveStoreContext);
  return useStore(storeFromContext!);
};
