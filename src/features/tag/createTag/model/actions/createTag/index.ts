import {createAsyncThunk} from '@reduxjs/toolkit';
import {addOneTag} from '../../../../../../entity/tag';
import {UniqueIdGenerator} from '../../../../../../shared/lib/UniqueIdGenerator/UniqueIdGenerator';

type CreateTagParamsType = {
  title: string;
  connectedCardsIds: string[];
  id?: string;
  createdAt?: number;
  color?: string,
}

export const createTag = createAsyncThunk(
  'createCard',
  function(data: CreateTagParamsType, thunkApi) {
    thunkApi.dispatch(addOneTag({
      id: data.id || UniqueIdGenerator.generateSimpleUniqueId(),
      title: data.title,
      createdAt: data.createdAt || Date.now(),
      color: data.color || `hsl(${Math.round(Math.random() * 360)}, 100%, 16%)`,
      connectedCardsIds: data.connectedCardsIds,
    }));
  }
);
