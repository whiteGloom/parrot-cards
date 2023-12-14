import {createAsyncThunk} from '@reduxjs/toolkit';
import {addOneTag, ITag} from '../../../../../../entity/tag';

export const createTag = createAsyncThunk(
  'createCard',
  function(data: Pick<ITag, 'title' | 'connectedCardsIds'>, thunkApi) {
    thunkApi.dispatch(addOneTag({
      id: data.title,
      createdAt: Date.now(),
      ...data,
    }));
  }
);
