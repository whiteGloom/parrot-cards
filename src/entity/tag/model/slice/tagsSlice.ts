import {createEntityAdapter, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ITag} from '../../types/Tag';
import {AppState} from '../../../../shared/lib/store/appState';
import {initialState} from './initialState';

const tagsEntityAdapter = createEntityAdapter<ITag>({
  selectId: model => model.id,
  sortComparer: (tagA, tagB) => tagA.createdAt - tagB.createdAt,
});

export const tagsSlice = createSlice({
  name: 'tags',
  initialState: tagsEntityAdapter.getInitialState(initialState),
  reducers: {
    addOneTag(state, action: PayloadAction<ITag>) {
      tagsEntityAdapter.addOne(state, action.payload);
    },
    removeOne(state, action: PayloadAction<{tagId: string}>) {
      tagsEntityAdapter.removeOne(state, action.payload.tagId);
    },
    connectTagsWithCard(state, action: PayloadAction<{tagsIds: string[], cardId: string}>) {
      const {tagsIds, cardId} = action.payload;

      tagsIds.forEach((tagId) => {
        const tag = state.entities[tagId];

        if (!tag.connectedCardsIds.includes(cardId)) {
          tag.connectedCardsIds.push(cardId);
        }
      });
    },
    disconnectTagsFromCard(state, action: PayloadAction<{tagsIds: string[], cardId: string}>) {
      const {tagsIds, cardId} = action.payload;

      tagsIds.forEach((tagId) => {
        const tag = state.entities[tagId];

        if (tag) {
          tag.connectedCardsIds = tag.connectedCardsIds.filter(id => id !== cardId);
        }
      });
    },
    setAllTags(state, action: PayloadAction<ITag[]>) {
      tagsEntityAdapter.setAll(state, action.payload);
    },
    setTagTitle(state, action: PayloadAction<{tagId: string, newTitle: string}>) {
      const tag = state.entities[action.payload.tagId];

      if (tag) {
        tag.title = action.payload.newTitle;
      }
    },
  },
});

export const tagsAdaptorSelectors = tagsEntityAdapter.getSelectors<AppState>(state => state.tags);

export const tagsSliceReducer = tagsSlice.reducer;

export const {
  addOneTag,
  connectTagsWithCard,
  disconnectTagsFromCard,
  setAllTags,
  removeOne,
  setTagTitle,
} = tagsSlice.actions;