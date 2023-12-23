import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {ICard} from '../../types/card';
import {initialCards} from './initialCards';

const cardsEntityAdapter = createEntityAdapter<ICard>({
  selectId: (model) => model.id,
  sortComparer: (cardA, cardB) => cardA.createdAt - cardB.createdAt,
});

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: cardsEntityAdapter.getInitialState({ids: Object.keys(initialCards), entities: initialCards}),
  reducers: {
    addOne(state, action: PayloadAction<ICard>) {
      cardsEntityAdapter.addOne(state, action.payload);
    },
    removeOne(state, action: PayloadAction<ICard['id']>) {
      cardsEntityAdapter.removeOne(state, action.payload);
    },
    updateOne(state, action: PayloadAction<{changes: Partial<ICard>, id: ICard['id']}>) {
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