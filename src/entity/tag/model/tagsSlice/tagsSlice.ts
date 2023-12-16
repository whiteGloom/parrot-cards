import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ITag} from '../../types/tag';
import {AppState} from '../../../../shared/lib/store/appState';

const tagsEntityAdapter = createEntityAdapter<ITag>({
  selectId: model => model.id,
  sortComparer: (tagA, tagB) => tagA.createdAt - tagB.createdAt,
});

const mockTags: Record<string, ITag> = {
  'Tag one': {id: 'Tag one', title: 'Tag one', createdAt: Date.now(), connectedCardsIds: ['cardOneId', 'cardThirdId']},
  'Tag two': {id: 'Tag two', title: 'Tag two', createdAt: Date.now(), connectedCardsIds: ['cardTwoId', 'cardThirdId']},
};

export const tagsSlice = createSlice({
  name: 'tags',
  initialState: tagsEntityAdapter.getInitialState({ids: Object.keys(mockTags), entities: mockTags}),
  reducers: {
    addOneTag(state, action: PayloadAction<ITag>) {
      tagsEntityAdapter.addOne(state, action.payload);
    },
    connectTagsWithCard(state, action: PayloadAction<{tagsIds: ITag['id'][], cardId: string}>) {
      const {tagsIds, cardId} = action.payload;

      tagsIds.forEach((tagId) => {
        const tag = state.entities[tagId];

        if (!tag.connectedCardsIds.includes(cardId)) {
          tag.connectedCardsIds.push(cardId);
        }
      });
    },
    disconnectTagsFromCard(state, action: PayloadAction<{tagsIds: ITag['id'][], cardId: string}>) {
      const {tagsIds, cardId} = action.payload;

      tagsIds.forEach((tagId) => {
        const tag = state.entities[tagId];

        if (tag) {
          tag.connectedCardsIds = tag?.connectedCardsIds.filter(id => id !== cardId);
        }
      });
    },
  },
});

export const tagsAdaptorSelectors = tagsEntityAdapter.getSelectors<AppState>(state => state.tags);

export const tagsSliceReducer = tagsSlice.reducer;

export const {addOneTag, connectTagsWithCard, disconnectTagsFromCard} = tagsSlice.actions;