import {createAsyncThunk} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {ENV_GOOGLE_OAUTH_KEY} from '../../../../shared/lib/enironmentVariables';

export enum OpenType {
  INLINE = 1,
  BLANK ,
}

export type OauthParamsType = {
  scopes: string[],
  openType?: OpenType,
}

export const openOauthPageThunk = createAsyncThunk<void, OauthParamsType, {state: AppState}>(
  'oauthLogin',
  function (params) {
    const url = new URL('https://accounts.google.com/o/oauth2/v2/auth');

    const searchParams = {
      client_id: ENV_GOOGLE_OAUTH_KEY,
      redirect_uri: `${window.location.origin}/google-oauth`,
      response_type: 'token',
      scope: params.scopes.join(' '),
      include_granted_scopes: 'true',
      state: JSON.stringify({scopes: params.scopes}),
    };

    for (const p in searchParams) {
      url.searchParams.set(p, searchParams[p as keyof typeof searchParams]);
    }

    switch (params.openType) {
      case OpenType.INLINE:
        window.location.href = url.toString();
        break;
      case OpenType.BLANK:
      default:
        window.open(url.toString(), '_blank');
        break;
    }
  }
);
