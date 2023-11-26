import React from 'react';
import './styles/index.scss';
import {CreateCardForm} from '../features/createCard';
import {ReduxStoreProvider} from './providers/store';
import {CardsList} from '../features/listCards';

function App() {
  return (
    <ReduxStoreProvider>
      <div className="app">
        <CreateCardForm/>
        <CardsList/>
      </div>
    </ReduxStoreProvider>
  );
}

export default App;
