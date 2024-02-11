import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {disconnectCardsFromTag} from '../../../../entity/card';
import {disconnectTagsFromCard} from '../../../../entity/tag';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';

export type UnlinkCardAndTagParamsType = {
  tagId: string;
  cardId: string;
}

export const unlinkCardAndTagThunk = createAsyncThunk<void, UnlinkCardAndTagParamsType, {state: AppState}>(
  'unlinkCardAndTag',
  (params, thunkAPI) => {
    thunkAPI.dispatch(disconnectCardsFromTag({
      tagId: params.tagId,
      cardsIds: [params.cardId],
    }));

    thunkAPI.dispatch(disconnectTagsFromCard({
      cardId: params.cardId,
      tagsIds: [params.tagId],
    }));
  }
);

export function useUnlinkCardAndTagThunk() {
  const dispatch = useAppDispatch();

  return (data: UnlinkCardAndTagParamsType) => dispatch(unlinkCardAndTagThunk(data));
}

