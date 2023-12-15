import {createAsyncThunk} from '@reduxjs/toolkit';
import {ICard, removeOne} from '../../../../../../entity/card';
import {AppState} from '../../../../../../shared/lib/store/appState';
import {disconnectTagsFromCard} from '../../../../../../entity/tag';

export const deleteCard = createAsyncThunk<void, {cardId: ICard['id']}, { state: AppState }>(
  'deleteCard',
  function(data, thunkAPI) {
    thunkAPI.dispatch(disconnectTagsFromCard({
      tagsIds: thunkAPI.getState().tags.ids,
      cardId: data.cardId,
    }));

    thunkAPI.dispatch(removeOne(data.cardId));
  }
);
