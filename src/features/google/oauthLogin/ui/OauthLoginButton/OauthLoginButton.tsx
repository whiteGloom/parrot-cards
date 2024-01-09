import React, {FC, PropsWithChildren} from 'react';
import {useOpenOauthPage} from '../../api/useOpenOauthPage';
import {OpenType} from '../../api/openOauthPageThunk';
import {AppState} from '../../../../../shared/lib/store/appState';
import {useSelector} from 'react-redux';

export type OauthLoginButtonPropsType = PropsWithChildren & {
  scopes: string[],
  openType?: OpenType,
}

export const OauthLoginButton: FC<OauthLoginButtonPropsType> = (props ) => {
  const openOauthPage = useOpenOauthPage();
  const isAuthorized = useSelector((state: AppState) => state.googleOauth.isAuthorized);

  return (
    <button
      onClick={() => {
        openOauthPage({scopes: props.scopes, openType: props.openType}).catch(null);
      }}
      disabled={isAuthorized}
    >
      {props.children}
    </button>
  );
};
