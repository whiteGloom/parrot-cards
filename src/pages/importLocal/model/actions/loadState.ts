import {createAsyncThunk} from '@reduxjs/toolkit';
import {ICard, setAllCards} from '../../../../entity/card';
import {ITag, setAllTags} from '../../../../entity/tag';
import {AppState} from '../../../../shared/lib/store/appState';

export type StateObjectType = {
  cards: ICard[],
  tags: ITag[],
}

export const loadState = createAsyncThunk<void, StateObjectType, {state: AppState}>(
  'loadState',
  function (data, thunkAPI) {
    thunkAPI.dispatch(setAllCards(data.cards));
    thunkAPI.dispatch(setAllTags(data.tags));
  }
);
