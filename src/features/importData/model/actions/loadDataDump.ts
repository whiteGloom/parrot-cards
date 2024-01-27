import {createAsyncThunk} from '@reduxjs/toolkit';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {AppState} from '../../../../shared/lib/store/appState';
import {migrateDump} from '../migrations/migrations';
import {setAllCards} from '../../../../entity/card';
import {setAllTags} from '../../../../entity/tag';
import {IDumpUnknown} from '../../../../entity/dump/types/dump';

type LoadDataDumpPayloadType = {
  dump: IDumpUnknown;
}

export const loadDataDumpThunk = createAsyncThunk<void, LoadDataDumpPayloadType, {state: AppState}>(
  'loadDataDump',
  (data, thunkAPI) => {
    const actualizedDump = migrateDump(data.dump);

    thunkAPI.dispatch(setAllCards(actualizedDump.cards));
    thunkAPI.dispatch(setAllTags(actualizedDump.tags));
  }
);

export function useLoadDataDumpThunk() {
  const dispatch = useAppDispatch();

  return (params: LoadDataDumpPayloadType) => dispatch(loadDataDumpThunk(params));
}
