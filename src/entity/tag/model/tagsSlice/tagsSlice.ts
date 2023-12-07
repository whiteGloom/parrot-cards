import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ITag} from '../../types/tag';
import {AppState} from '../../../../shared/types/appState';

const tagsEntityAdapter = createEntityAdapter<ITag>({
  selectId: model => model.id,
  sortComparer: (tagA, tagB) => tagA.createdAt - tagB.createdAt,
});

const testTags: Record<string, ITag> = {
  1: {id: '1', title: 'Tag one', createdAt: Date.now(), connectedCardsIds: []},
  2: {id: '2', title: 'Tag two', createdAt: Date.now(), connectedCardsIds: []},
};


export const tagsSlice = createSlice({
  name: 'tags',
  initialState: tagsEntityAdapter.getInitialState({ids: Object.keys(testTags), entities: testTags}),
  reducers: {
    addOneTag(state, action: PayloadAction<ITag>) {
      tagsEntityAdapter.addOne(state, action.payload);
    },
  },
});

const tagsAdaptorSelectors = tagsEntityAdapter.getSelectors<AppState>(state => state.tags);


export const selectAllTags = () => (state: AppState) => tagsAdaptorSelectors.selectAll(state);

export const tagsSliceReducer = tagsSlice.reducer;

export const {addOneTag} = tagsSlice.actions;