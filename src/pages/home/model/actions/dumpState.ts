import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {ICard} from '../../../../entity/card';
import {ITag} from '../../../../entity/tag';

export const dumpState = createAsyncThunk<{cards: ICard[], tags: ITag[]}, undefined, { state: AppState }>(
  'dumpState',
  function (_params , thunkApi) {
    const state = thunkApi.getState();

    return {
      cards: Object.values(state.cards.entities) as ICard[],
      tags: Object.values(state.tags.entities) as ITag[],
    };
  }
);