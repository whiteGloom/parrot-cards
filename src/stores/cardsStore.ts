import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';
import type { Card, CardDraft } from '../entities/cards.ts';

export interface CardsStoreFields {
  cards: Record<string, Card>
  cardsIds: string[]
}

export interface CardsStoreActions {
  removeCards: (ids: string[]) => void
  createCard: (card: CardDraft) => Card
  addCards: (cards: Card[]) => void
  updateCard: (id: string, updatedCard: Partial<CardDraft>) => void
}

export interface CardsStoreState extends CardsStoreFields, CardsStoreActions {
}

export function createCardsStore() {
  return createStore<CardsStoreState>()(
    immer((set): CardsStoreState => {
      return {
        cards: {},
        cardsIds: [],
        createCard: (card: CardDraft) => {
          const newCard: Card = {
            id: crypto.randomUUID(),
            knownLanguageSide: card.knownLanguageSide,
            targetLanguageSide: card.targetLanguageSide,
            tags: card.tags,
            createdAt: Date.now(),
            updatedAt: Date.now(),
          };

          set((state) => {
            state.cards[newCard.id] = newCard;
            state.cardsIds.push(newCard.id);
          });

          return newCard;
        },
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

            state.cardsIds.sort((a, b) => {
              return state.cards[a].updatedAt - state.cards[b].updatedAt;
            });
          });
        },
        updateCard: (id: string, updatedCard: Partial<Card>) => {
          set((state) => {
            if (state.cards[id]) {
              state.cards[id] = {
                ...state.cards[id],
                ...updatedCard,
                updatedAt: Date.now(),
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
  return useStore(cardsStoreFromContext!);
};
