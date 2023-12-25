import React, {FC} from 'react';
import {useNavigate} from 'react-router-dom';

type ExpectedSuccessParamsFromAuth = {
  access_token: string,
  expires_in: string,
  scope: string,
  state: string,
  token_type: string,
};

type ExpectedErrorParamsFromAuth = {
  error: string,
}

function isSuccessParams(params: Record<string, string>): params is ExpectedSuccessParamsFromAuth {
  const expectedKeys: (keyof ExpectedSuccessParamsFromAuth)[] = [
    'access_token',
    'expires_in',
    'scope',
    'state',
    'token_type',
  ];

  return Object.keys(params).every((key) => expectedKeys.includes(key as keyof ExpectedSuccessParamsFromAuth));
}

function isErrorParams(params: Record<string, string>): params is ExpectedErrorParamsFromAuth {
  const expectedKeys: (keyof ExpectedErrorParamsFromAuth)[] = ['error'];

  return Object.keys(params).every((key) => expectedKeys.includes(key as keyof ExpectedErrorParamsFromAuth));
}

export const GoogleOauthPage: FC = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    const params = window.location.hash.slice(1).split('&').reduce((reducer, paramsString) => {
      const [key, value] = paramsString.split('=');
      reducer[key] = value;
      return reducer;
    }, {} as Record<string, string>);

    if (isSuccessParams(params)) {
      console.log('wgl GoogleOauthPage.success params', params, `Authorization=${params.token_type} ${params.access_token}; Max-Age=${params.expires_in}; SameSite=None; Secure`);
    }

    if (isErrorParams(params)) {
      console.log('Authorization error', params.error);
    }

    navigate('/', {replace: true});
  }, [navigate]);

  return (
    <div>Loading...</div>
  );
};
