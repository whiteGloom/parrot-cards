import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import {OauthLoginButton} from '../../../features/google/oauthLogin';
import {OpenType} from '../../../features/google/oauthLogin/api/openOauthPageThunk';

type ExpectedSuccessParamsFromAuth = {
  access_token: string,
  expires_in: string,
  scope: string,
  state: string,
  token_type: string,
};

type ExpectedErrorParamsFromAuth = {
  error: string,
  state?: string,
}

type StateExpectedParams = {
  scopes?: string[],
}

function isSuccessParams(params: Record<string, string>): params is ExpectedSuccessParamsFromAuth {
  const expectedKeys: (keyof ExpectedSuccessParamsFromAuth)[] = [
    'access_token',
    'expires_in',
    'scope',
    'token_type',
  ];

  const paramsKeys = Object.keys(params);

  return expectedKeys.every((key) => paramsKeys.includes(key));
}

function isErrorParams(params: Record<string, string>): params is ExpectedErrorParamsFromAuth {
  const expectedKeys: (keyof ExpectedErrorParamsFromAuth)[] = ['error'];
  const paramsKeys = Object.keys(params);

  return expectedKeys.every((key) => paramsKeys.includes(key));
}

function parseState(stateString: string): StateExpectedParams {
  try {
    return JSON.parse(decodeURI(stateString)) as StateExpectedParams;
  } catch (err) {
    return {};
  }
}

function SuccessView() {
  return (
    <div>
      <p>You successfully authenticated. You can close this page or continue here</p>
      <Link to={'/'}>Go home</Link>
    </div>
  );
}

function ErrorView(props: {params: ExpectedErrorParamsFromAuth}) {
  const state = parseState(props.params.state || '');

  return (
    <div>
      <p>Authentication failed with error.</p>

      {state.scopes
        ? <p>You can close this page, retry authentication or go home</p>
        : <p>You can close this page or go home</p>
      }

      <p>The error: {props.params.error}</p>

      <Link to={'/'}>Go home</Link>
      {state.scopes ? (
        <OauthLoginButton scopes={state.scopes} openType={OpenType.INLINE}>Retry</OauthLoginButton>
      ) : undefined}
    </div>
  );
}

export const GoogleOauthPage: FC = () => {
  const params = React.useMemo(() => {
    return window.location.hash
      .slice(1).split('&')
      .reduce((reducer, paramsString) => {
        const [key, value] = paramsString.split('=');
        reducer[key] = value;

        return reducer;
      }, {} as Record<string, string>);
  }, []);

  if (isSuccessParams(params)) {
    return <SuccessView/>;
  }

  if (isErrorParams(params)) {
    return <ErrorView params={params}/>;
  }

  return (
    <div>
      <p>Wrong URL of the page.</p>
      <Link to={'/'}>Go home</Link>
    </div>
  );
};
