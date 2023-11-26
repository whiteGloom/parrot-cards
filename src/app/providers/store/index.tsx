import React, {FC, PropsWithChildren} from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {cardsSliceReducer} from '../../../entity/card';

export const store = configureStore({
  reducer: {
    cards: cardsSliceReducer,
  },
});

export const ReduxStoreProvider: FC<PropsWithChildren> = (props) => {
  return (
    <Provider store={store}>{props.children}</Provider>
  );
};

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;