import {createSlice, PayloadAction} from '@reduxjs/toolkit';

export interface ITokenData {
  accessToken: string,
  expiresIn: number,
}

export interface ISliceSchema {
  tokenData: ITokenData | undefined,
  isAuthorized: boolean,
}

const initialState: ISliceSchema = {
  tokenData: undefined,
  isAuthorized: false,
};

export const googleOauthSlice = createSlice({
  name: 'googleOauth',
  initialState,
  reducers: {
    setTokenData(state, action: PayloadAction<ITokenData>): void {
      state.tokenData = action.payload;
      state.isAuthorized = true;
    },
    clearTokenData(state): void {
      state.tokenData = undefined;
      state.isAuthorized = false;
    },
  },
});

export const googleOauthSliceReducer = googleOauthSlice.reducer;

export const {setTokenData, clearTokenData} = googleOauthSlice.actions;