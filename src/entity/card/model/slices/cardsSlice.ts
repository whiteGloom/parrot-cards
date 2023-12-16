import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {ICard} from '../../types/card';

const cardsEntityAdapter = createEntityAdapter<ICard>({
  selectId: (model) => model.id,
  sortComparer: (cardA, cardB) => cardA.createdAt - cardB.createdAt,
});

const mockCards: Record<string, ICard> = {
  'cardOneId': {
    id: 'cardOneId',
    tagsIds: ['Tag one'],
    createdAt: +new Date('7.8.2022'),
    frontSide: {title: 'First card', hints: [], description: ''},
    backSide: {title: 'Первая карточка', hints: [], description: ''},
  },
  'cardTwoId': {
    id: 'cardTwoId',
    tagsIds: ['Tag two'],
    createdAt: +new Date('12.14.2023'),
    frontSide: {title: 'Second card', hints: [], description: ''},
    backSide: {title: 'Вторая карточка', hints: [], description: ''},
  },
  'cardThirdId': {
    id: 'cardThirdId',
    tagsIds: ['Tag one', 'Tag two'],
    createdAt: +new Date('12.15.2023'),
    frontSide: {title: 'Third card', hints: [], description: ''},
    backSide: {title: 'Третья карточка', hints: [], description: ''},
  },
};

export const cardsSlice = createSlice({
  name: 'cards',
  initialState: cardsEntityAdapter.getInitialState({ids: Object.keys(mockCards), entities: mockCards}),
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
  },
});

export const cardsSelectors = cardsEntityAdapter.getSelectors<AppState>(state => state.cards);

export const cardsSliceReducer = cardsSlice.reducer;

export const {addOne, removeOne, updateOne} = cardsSlice.actions;