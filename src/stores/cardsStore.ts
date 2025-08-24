import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';

interface CardSide {
  title: string
  description: string
  hints: string[]
}

interface Card {
  id: string
  knownLanguageSide: CardSide
  targetLanguageSide: CardSide
  tags: string[]
}

export interface CadsStoreState {
  cards: Record<string, Card>
  ids: string[]
}

export interface CardsStoreActions {
  removeCards: (ids: string[]) => void
  addCards: (cards: Card[]) => void
  updateCard: (id: string, updatedCard: Partial<Card>) => void
}

export interface GoogleOauthStoreContent extends CadsStoreState, CardsStoreActions {
}

const cardsStore = createStore<GoogleOauthStoreContent>()(
  immer((set): GoogleOauthStoreContent => {
    return {
      cards: {},
      ids: [],
      removeCards: (ids: string[]) => {
        set((state) => {
          for (const id of ids) {
            delete state.cards[id];
          }

          const newIds = [];
          for (const id of state.ids) {
            if (!ids.includes(id)) {
              newIds.push(id);
            }
          }

          state.ids = newIds;
        });
      },
      addCards: (cards: Card[]) => {
        set((state) => {
          for (const card of cards) {
            if (!state.cards[card.id]) {
              state.cards[card.id] = card;
              state.ids.push(card.id);
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

export const useCardsStore = () => useStore(cardsStore);
