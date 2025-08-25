import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';

export interface CardSide {
  title: string
  description: string
  hints: string[]
}

export interface Card {
  id: string
  knownLanguageSide: CardSide
  targetLanguageSide: CardSide
  tags: string[]
}

export interface CadsStoreState {
  cards: Record<string, Card>
  cardsIds: string[]
}

export interface CardsStoreActions {
  removeCards: (ids: string[]) => void
  addCards: (cards: Card[]) => void
  updateCard: (id: string, updatedCard: Partial<Card>) => void
}

export interface CardsStoreState extends CadsStoreState, CardsStoreActions {
}

export function createCardsStore() {
  return createStore<CardsStoreState>()(
    immer((set): CardsStoreState => {
      return {
        cards: {},
        cardsIds: [],
        removeCards: (ids: string[]) => {
          set((state) => {
            for (const id of ids) {
              delete state.cards[id];
            }

            const newIds = [];
            for (const id of state.cardsIds) {
              if (!ids.includes(id)) {
                newIds.push(id);
              }
            }

            state.cardsIds = newIds;
          });
        },
        addCards: (cards: Card[]) => {
          set((state) => {
            for (const card of cards) {
              if (!state.cards[card.id]) {
                state.cards[card.id] = card;
                state.cardsIds.push(card.id);
              }
            }
          });
        },
        updateCard: (id: string, updatedCard: Partial<Card>) => {
          set((state) => {
            if (state.cards[id]) {
              state.cards[id] = {
                ...state.cards[id],
                ...updatedCard,
              };
            }
          });
        },
      };
    }),
  );
}

export type CardsStore = ReturnType<typeof createCardsStore>;

export const CardsStoreContext = createContext<CardsStore | null>(null);

export const useCardsStore = () => {
  const cardsStoreFromContext = useContext(CardsStoreContext);

  if (!cardsStoreFromContext) {
    throw new Error('useCardsStore must be used within a CardsStoreProvider');
  }

  return useStore(cardsStoreFromContext);
};
