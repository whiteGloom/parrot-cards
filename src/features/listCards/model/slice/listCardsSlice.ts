import {createSlice} from '@reduxjs/toolkit';


export enum SortingType {
  ALPHABET_ASC = 1,
  ALPHABET_DES,
}

export const listCardsSlice = createSlice({
  name: 'listCards',
  initialState: {
    filters: {
      tags: [],
    },
    sorting: SortingType.ALPHABET_ASC,
  },
  reducers: {

  },
});

export const listCardsReducer = listCardsSlice.reducer;