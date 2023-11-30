import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/types/appState';
import {ICard} from '../../types/card';

const cardsEntityAdapter = createEntityAdapter<ICard>({
  selectId: (model) => model.id,
  sortComparer: (cardA, cardB) => cardA.createdAt - cardB.createdAt,
});

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: cardsEntityAdapter.getInitialState(),
  reducers: {
    addOne(state, action: PayloadAction<ICard>) {
      cardsEntityAdapter.addOne(state, action.payload);
    },
    removeOne(state, action: PayloadAction<ICard['id']>) {
      cardsEntityAdapter.removeOne(state, action.payload);
    },
    updateOne(state, action: PayloadAction<{changes: Partial<ICard>, id: ICard['id']}>) {
      cardsEntityAdapter.updateOne(state, {id: action.payload.id, changes: action.payload.changes});
    },
  },
});

export const cardsSelectors = cardsEntityAdapter.getSelectors<AppState>(state => state.cards);

export const selectCardById = (id: ICard['id']) => (state: AppState) => cardsSelectors.selectById(state, id);

export const cardsSliceReducer = cardsSlice.reducer;

export const {addOne, removeOne, updateOne} = cardsSlice.actions;