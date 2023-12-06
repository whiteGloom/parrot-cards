import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/types/appState';

export interface ICollection {
  id: string;
  description: string;
  createdAt: number;
  title: string;
  content: {type: string, id: string}[];
}

const collectionsEntityAdapter = createEntityAdapter<ICollection>({
  selectId: model => model.id,
  sortComparer: (modelA, modelB) => modelA.createdAt - modelB.createdAt,
});

export const collectionsSlice = createSlice({
  name: 'collections',
  initialState: collectionsEntityAdapter.getInitialState(),
  reducers: {
    addOne(state, action: PayloadAction<ICollection>) {
      collectionsEntityAdapter.addOne(state, action);
    },
    removeOne(state, action: PayloadAction<ICollection['id']>) {
      collectionsEntityAdapter.removeOne(state, action);
    },
    removeContentItemFromAllById(state, action: PayloadAction<string>) {
      // TODO Filtering of content
    },
  },
});

const collectionsSelectors = collectionsEntityAdapter.getSelectors<AppState>(state => state.collections);

export const selectAllCollections = () => (state: AppState) => collectionsSelectors.selectAll(state);

export const {reducer: collectionsSliceReducer} = collectionsSlice;

export const {
  addOne,
  removeOne,
  removeContentItemFromAllById,
} = collectionsSlice.actions;
