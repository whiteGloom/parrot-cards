import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';

export interface UnsavedChangesStoreFields {
  hasUnsavedChanges: boolean
}

export interface UnsavedChangesStoreActions {
  markAsUnsaved: () => void
  markAsSaved: () => void
}

export type UnsavedChangesStoreState = UnsavedChangesStoreFields & UnsavedChangesStoreActions;

export const createUnsavedChangesStore = () => {
  return createStore<UnsavedChangesStoreState>()(
    immer((set): UnsavedChangesStoreState => {
      return {
        hasUnsavedChanges: false,
        markAsUnsaved: () => {
          set({
            hasUnsavedChanges: true,
          });
        },
        markAsSaved: () => {
          set({
            hasUnsavedChanges: false,
          });
        },
      };
    }));
};

export type UnsavedChangesStore = ReturnType<typeof createUnsavedChangesStore>;

export const UnsavedChangesStoreContext = createContext<UnsavedChangesStore | null>(null);

export const useUnsavedChangesStore = () => {
  const storeFromContext = useContext(UnsavedChangesStoreContext);
  return useStore(storeFromContext!);
};
