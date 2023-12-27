import React, {FC, PropsWithChildren} from 'react';
import {useOpenOauthPage} from '../../api/useOpenOauthPage';
import {OpenType} from '../../api/openOauthPageThunk';

export type OauthLoginButtonPropsType = PropsWithChildren & {
  scopes: string[],
  openType?: OpenType,
}

export const OauthLoginButton: FC<OauthLoginButtonPropsType> = (props ) => {
  const openOauthPage = useOpenOauthPage();

  return (
    <button
      onClick={() => {
        openOauthPage({scopes: props.scopes, openType: props.openType}).catch(null);
      }}
    >
      {props.children}
    </button>
  );
};
