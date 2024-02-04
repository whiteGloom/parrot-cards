import {createAsyncThunk} from '@reduxjs/toolkit';
import {addOne, ICard} from '../../../../../entity/card';
import {UniqueIdGenerator} from '../../../../../shared/lib/UniqueIdGenerator/UniqueIdGenerator';
import {connectTagsWithCard} from '../../../../../entity/tag';
import {useAppDispatch} from '../../../../../shared/lib/store/useAppDispatch';
import {AppState} from '../../../../../shared/lib/store/appState';

type CreateCardParamsType = {
  frontSide: {
    title: string,
    description?: string,
    hints?: string[],
  };
  backSide: {
    title: string,
    description?: string,
    hints?: string[],
  };
  tagsIds?: string[];
  id?: string;
  createdAt?: number;
}

export const createCardThunk = createAsyncThunk<ICard, CreateCardParamsType, {state: AppState}>(
  'createCard',
  function(data, thunkApi) {
    const id = data.id || UniqueIdGenerator.generateUUID();

    thunkApi.dispatch(addOne({
      id,
      createdAt: data.createdAt || Date.now(),
      tagsIds: data.tagsIds || [],
      frontSide: {
        title: data.frontSide.title,
        description: data.backSide.description || '',
        hints: data.frontSide.hints || [],
      },
      backSide: {
        title: data.backSide.title,
        description: data.backSide.description || '',
        hints: data.backSide.hints || [],
      },
    }));

    if (data.tagsIds?.length) {
      thunkApi.dispatch(connectTagsWithCard({tagsIds: data.tagsIds, cardId: id}));
    }

    return thunkApi.getState().cards.entities[id];
  }
);

export function useCreateCardThunk() {
  const dispatch = useAppDispatch();

  return (params: CreateCardParamsType) => dispatch(createCardThunk(params));
}
