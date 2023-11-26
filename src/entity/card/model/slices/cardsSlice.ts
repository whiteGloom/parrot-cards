import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/types/appState';
import {ICard} from '../../types/card';

const cardsEntityAdapter = createEntityAdapter<ICard>({
  selectId: (model) => model.createdAt,
});

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: cardsEntityAdapter.getInitialState(),
  reducers: {
    addOne(state, action: PayloadAction<ICard>) {
      cardsEntityAdapter.addOne(state, action.payload);
    },
  },
});

export const cardsSelectors = cardsEntityAdapter.getSelectors<AppState>(state => state.cards);

export const cardsSliceReducer = cardsSlice.reducer;

export const {addOne} = cardsSlice.actions;