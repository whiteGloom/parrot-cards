import React from 'react';
import './styles/index.scss';
import {ReduxStoreProvider} from './providers/store';
import {AppRouterProvider} from './providers/router/router';
import {useAppDispatch} from '../shared/lib/store/useAppDispatch';
import {REQUEST_PRELOAD_GOOGLE_OAUTH} from '../entity/google/oauth';

function App() {
  const dispatch = useAppDispatch();

  React.useEffect(() => {
    window.onload = () => {
      window.gapi.load('picker', () => {
        console.log('wgl picker loaded');
      });
    };

    dispatch({type: REQUEST_PRELOAD_GOOGLE_OAUTH});
  });

  return (
    <div className="app">
      <AppRouterProvider/>
    </div>
  );
}

function Wrapper() {
  return (
    <ReduxStoreProvider>
      <App/>
    </ReduxStoreProvider>
  );
}

export default Wrapper;
