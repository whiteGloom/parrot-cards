import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';
import { uid } from 'uid';

export interface ExplicitRevisesFields {
  revises: Record<string, string[]>
}

export interface ExplicitRevisesActions {
  addRevise: (cardsIds: string[]) => string
  findExistingRevise: (cardsIds: string[]) => string | undefined
}

export type ExplicitRevisesStoreState = ExplicitRevisesFields & ExplicitRevisesActions;

export function createExplicitRevisesStore() {
  return createStore<ExplicitRevisesStoreState>()(immer((set, getState): ExplicitRevisesStoreState => {
    return {
      revises: {},
      addRevise: (cardsIds: string[]) => {
        const id = uid();

        set((state) => {
          state.revises[id] = cardsIds;
        });

        return id;
      },
      findExistingRevise: (cardsIds: string[]) => {
        const state = getState();
        const keys = Object.keys(state.revises);
        const sortedCardsIds = [...cardsIds].sort().join(',');

        for (const key of keys) {
          const sortedReviseCardsIds = [...state.revises[key]].sort().join(',');
          if (sortedReviseCardsIds === sortedCardsIds) {
            return key;
          }
        }

        return undefined;
      },
    };
  }));
}

export type ExplicitRevisesStore = ReturnType<typeof createExplicitRevisesStore>;

export const ExplicitRevisesStoreContext = createContext<ExplicitRevisesStore | null>(null);

export const useExplicitRevisesStore = () => {
  const storeFromContext = useContext(ExplicitRevisesStoreContext)!;
  return useStore(storeFromContext);
};
