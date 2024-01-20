import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {ICard} from '../../types/Card';
import {initialState} from './initialState';

const cardsEntityAdapter = createEntityAdapter<ICard>({
  selectId: (model) => model.id,
  sortComparer: (cardA, cardB) => cardA.createdAt - cardB.createdAt,
});

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: cardsEntityAdapter.getInitialState(initialState),
  reducers: {
    addOne(state, action: PayloadAction<ICard>) {
      cardsEntityAdapter.addOne(state, action.payload);
    },
    removeOne(state, action: PayloadAction<string>) {
      cardsEntityAdapter.removeOne(state, action.payload);
    },
    updateOne(state, action: PayloadAction<{changes: Partial<ICard>, id: string}>) {
      cardsEntityAdapter.updateOne(state, action.payload);
    },
    setAllCards(state, action: PayloadAction<ICard[]>) {
      cardsEntityAdapter.setAll(state, action.payload);
    },
  },
});

export const cardsSelectors = cardsEntityAdapter.getSelectors<AppState>(state => state.cards);

export const cardsSliceReducer = cardsSlice.reducer;

export const {
  addOne,
  removeOne,
  updateOne,
  setAllCards,
} = cardsSlice.actions;
