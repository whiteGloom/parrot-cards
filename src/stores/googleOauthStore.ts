import { createStore, useStore } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { createContext, useContext } from 'react';

interface UnauthorizedState {
  state: 'unauthorized'
}

interface AuthorizationInProgressState {
  state: 'inProgress'
}

interface AuthorizedState {
  state: 'authorized'
  tokenInfo: TokenInfo
}

interface AuthorizationErrorState {
  state: 'error'
  errorInfo: TokenReceivingError
}

export type AuthorizationInfo
  = UnauthorizedState
    | AuthorizationInProgressState
    | AuthorizedState
    | AuthorizationErrorState;

export interface TokenInfo {
  accessToken: string
  expiresAt: number
}

export interface TokenReceivingError {
  error: string
}

export interface OauthSettings {
  clientId?: string
  keepMeLoggedIn: boolean
}

export interface GoogleOauthStoreState {
  oauthSettings?: OauthSettings
  oauthClient?: ReturnType<typeof window.google.accounts.oauth2.initTokenClient>
  authorizationData: AuthorizationInfo
}

export interface GoogleOauthStoreActions {
  setOauthSettings: (settings: OauthSettings) => void
  authorize: () => Promise<void>
  expireToken: () => void
  prolongateToken: () => void
}

export interface GoogleOauthStoreContent extends GoogleOauthStoreState, GoogleOauthStoreActions {
}

const defaultOauthSettings: Readonly<OauthSettings> = Object.freeze({
  clientId: undefined,
  keepMeLoggedIn: true,
});

function loadSavedSettings() {
  let savedOauthSettings: Partial<OauthSettings> | undefined;
  try {
    const savedValue = localStorage.getItem('app-identities');
    if (savedValue) {
      savedOauthSettings = JSON.parse(savedValue);
    }
  }
  catch (error) {
    console.error('Failed to load saved OAuth settings', error);
  }

  return {
    ...defaultOauthSettings,
    ...savedOauthSettings,
  };
}

export function createGoogleOauthStore() {
  const googleOauthStore = createStore<GoogleOauthStoreContent>()(
    immer((set, getState): GoogleOauthStoreContent => {
      function createTokenClient(clientId: string) {
        return window.google.accounts.oauth2.initTokenClient({
          client_id: clientId,
          scope: 'https://www.googleapis.com/auth/drive',
          callback: (response) => {
            if (getState().oauthSettings?.clientId !== oauthSettings.clientId) {
              return;
            }

            if (response.error) {
              set({
                authorizationData: {
                  state: 'error', errorInfo: { error: response.error! },
                },
              });

              return;
            }

            set({
              authorizationData: {
                state: 'authorized', tokenInfo: {
                  accessToken: response.access_token,
                  expiresAt: +response.expires_in * 1000 + Date.now(),
                },
              },
            });
          },
        });
      }

      const oauthSettings = loadSavedSettings();

      return {
        oauthSettings,
        authorizationData: { state: 'unauthorized' },
        oauthClient: oauthSettings.clientId ? createTokenClient(oauthSettings.clientId) : undefined,
        setOauthSettings: (oauthSettings: OauthSettings) => {
          set({
            oauthSettings: oauthSettings,
            oauthClient: createTokenClient(oauthSettings.clientId!),
          });
        },
        prolongateToken() {
          if (getState().authorizationData.state === 'authorized') {
            googleOauthStore.getState().oauthClient?.requestAccessToken();
          }
        },
        authorize() {
          return new Promise<void>((resolve, reject) => {
            if (getState().authorizationData.state === 'authorized') {
              return resolve();
            }

            if (getState().authorizationData.state !== 'inProgress') {
              googleOauthStore.getState().oauthClient?.requestAccessToken();

              set({
                authorizationData: { state: 'inProgress' },
              });
            }

            const unsubscribe = googleOauthStore.subscribe((state, oldState) => {
              if (state.authorizationData === oldState.authorizationData) {
                return;
              }

              unsubscribe();

              if (state.authorizationData.state === 'authorized') {
                resolve();
              }
              else if (state.authorizationData.state === 'error') {
                reject(state.authorizationData.errorInfo);
              }
            });
          });
        },
        expireToken() {
          set({
            authorizationData: { state: 'unauthorized' },
          });
        },
      };
    }),
  );

  let tokenExpirationWaiterId: number | undefined;

  googleOauthStore.subscribe((state, prevState) => {
    if (state.oauthSettings !== prevState.oauthSettings) {
      localStorage.setItem('app-identities', JSON.stringify(state.oauthSettings));
    }

    const maybeClearTokenExpirationWaiter = () => {
      if (tokenExpirationWaiterId) {
        clearTimeout(tokenExpirationWaiterId);
        tokenExpirationWaiterId = undefined;
      }
    };

    if (state.oauthSettings?.clientId !== prevState.oauthSettings?.clientId) {
      maybeClearTokenExpirationWaiter();
    }

    if (state.authorizationData !== prevState.authorizationData) {
      maybeClearTokenExpirationWaiter();

      if (state.authorizationData.state === 'authorized') {
        const expiresIn = state.authorizationData.tokenInfo.expiresAt - Date.now();
        if (expiresIn > 0) {
          tokenExpirationWaiterId = window.setTimeout(() => {
            if (state.oauthSettings?.keepMeLoggedIn) {
              googleOauthStore.getState().prolongateToken();
            }

            googleOauthStore.getState().expireToken();
            maybeClearTokenExpirationWaiter();
          }, expiresIn - 1000 * 60);
        }
      }
    }
  });

  return googleOauthStore;
}

export type GoogleOauthStore = ReturnType<typeof createGoogleOauthStore>;

export const GoogleOauthStoreContext = createContext<GoogleOauthStore | null>(null);

export const useGoogleOauthStore = () => {
  const storeFromContext = useContext(GoogleOauthStoreContext);
  return useStore(storeFromContext!);
};
