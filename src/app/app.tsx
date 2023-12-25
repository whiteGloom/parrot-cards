import React from 'react';
import './styles/index.scss';
import {ReduxStoreProvider} from './providers/store';
import {AppRouterProvider} from './providers/router/router';

function App() {
  React.useEffect(() => {
    window.onload = () => {
      window.gapi.load('picker', () => {
        console.log('wgl picker loaded');
      });
    };
  });

  return (
    <ReduxStoreProvider>
      <div className="app">
        <AppRouterProvider/>
      </div>
    </ReduxStoreProvider>
  );
}

export default App;
