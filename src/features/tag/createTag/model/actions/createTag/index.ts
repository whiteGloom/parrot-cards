import {createAsyncThunk} from '@reduxjs/toolkit';
import {addOneTag, ITag} from '../../../../../../entity/tag';
import {UniqueIdGenerator} from '../../../../../../shared/lib/UniqueIdGenerator/UniqueIdGenerator';
import {useAppDispatch} from '../../../../../../shared/lib/store/useAppDispatch';
import {AppState} from '../../../../../../shared/lib/store/appState';

type CreateTagParamsType = {
  title: string;
  connectedCardsIds: string[];
  id?: string;
  createdAt?: number;
  color?: string,
}

export const createTagThunk = createAsyncThunk<ITag, CreateTagParamsType, {state: AppState}>(
  'createCard',
  function(data, thunkApi) {
    const id = data.id || UniqueIdGenerator.generateSimpleUniqueId();

    thunkApi.dispatch(addOneTag({
      id,
      title: data.title,
      createdAt: data.createdAt || Date.now(),
      color: data.color || `hsl(${Math.round(Math.random() * 360)}, 100%, 16%)`,
      connectedCardsIds: data.connectedCardsIds,
    }));

    return thunkApi.getState().tags.entities[id];
  }
);

export function useCreateTagThunk() {
  const dispatch = useAppDispatch();

  return (data: CreateTagParamsType) => dispatch(createTagThunk(data));
}