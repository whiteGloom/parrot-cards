import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {ICard} from '../../../../entity/card';
import {ITag} from '../../../../entity/tag';
import {useRef} from 'react';
import {IDumpActual} from '../../../../entity/dump';

export const dumpDataThunk = createAsyncThunk<IDumpActual, void, {state: AppState}>(
  'dumpState',
  (_params, thunkApi) => {
    const state = thunkApi.getState();

    return {
      cards: Object.values(state.cards.entities) as ICard[],
      tags: Object.values(state.tags.entities) as ITag[],
      version: 1,
    };
  }
);

export function useDumpDataThunk() {
  const dispatch = useAppDispatch();

  return useRef(() => dispatch(dumpDataThunk())).current;
}
