import {createAsyncThunk} from '@reduxjs/toolkit';
import {removeOne} from '../../../../../../entity/card';
import {AppState} from '../../../../../../shared/lib/store/appState';
import {disconnectTagsFromCard} from '../../../../../../entity/tag';
import {useAppDispatch} from '../../../../../../shared/lib/store/useAppDispatch';

export const deleteCardThunk = createAsyncThunk<void, {cardId: string}, {state: AppState}>(
  'deleteCard',
  function(data, thunkAPI) {
    thunkAPI.dispatch(disconnectTagsFromCard({
      tagsIds: thunkAPI.getState().tags.ids,
      cardId: data.cardId,
    }));

    thunkAPI.dispatch(removeOne(data.cardId));
  }
);

export function useDeleteCardThunk() {
  const dispatch = useAppDispatch();

  return (data: {cardId: string}) => dispatch(deleteCardThunk(data));
}
