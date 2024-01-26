import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppState} from '../../../../../shared/lib/store/appState';
import {disconnectCardsFromTag} from '../../../../../entity/card';
import {removeOne} from '../../../../../entity/tag';
import {useAppDispatch} from '../../../../../shared/lib/store/useAppDispatch';

type DeleteTagDataType = {
  tagId: string;
}

export const deleteTag = createAsyncThunk<void, DeleteTagDataType, {state: AppState}>(
  'deleteTag',
  function(data, thunkAPI) {
    thunkAPI.dispatch(disconnectCardsFromTag({
      cardsIds: thunkAPI.getState().cards.ids,
      tagId: data.tagId,
    }));

    thunkAPI.dispatch(removeOne({
      tagId: data.tagId,
    }));
  }
);

export function useDeleteTag() {
  const dispatch = useAppDispatch();

  return (data: DeleteTagDataType) => dispatch(deleteTag(data));
}
