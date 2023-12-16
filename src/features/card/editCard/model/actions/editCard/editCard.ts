import {createAsyncThunk} from '@reduxjs/toolkit';
import {ICard, updateOne} from '../../../../../../entity/card/';
import {connectTagsWithCard, disconnectTagsFromCard} from '../../../../../../entity/tag';
import {AppState} from '../../../../../../shared/lib/store/appState';

type EditCardDataType = { id: string, changes: Pick<ICard, 'frontSide' | 'backSide' | 'tagsIds'> };

export const editCard = createAsyncThunk<void, EditCardDataType, {state: AppState}>(
  'editCard',
  function(data, thunkApi) {
    const card = thunkApi.getState().cards.entities[data.id];

    if (!card) return;

    const oldTagsIds = card.tagsIds;

    thunkApi.dispatch(updateOne({
      id: data.id,
      changes: data.changes,
    }));

    const tagsToRemove: string[] = [];
    const tagsToAdd: string[] = [];

    oldTagsIds.forEach((oldTag) => {
      if (!data.changes.tagsIds.includes(oldTag)) {
        tagsToRemove.push(oldTag);
      }
    });

    data.changes.tagsIds.forEach((newTag) => {
      if (!oldTagsIds.includes(newTag)) {
        tagsToAdd.push(newTag);
      }
    });

    thunkApi.dispatch(connectTagsWithCard({tagsIds: tagsToAdd, cardId: data.id}));
    thunkApi.dispatch(disconnectTagsFromCard({tagsIds: tagsToRemove, cardId: data.id}));
  }
);
