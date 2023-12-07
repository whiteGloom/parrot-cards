import React, {FC, PropsWithChildren} from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {cardsSliceReducer} from '../../../entity/card';
import {tagsSliceReducer} from '../../../entity/tag';

export const store = configureStore({
  reducer: {
    cards: cardsSliceReducer,
    tags: tagsSliceReducer,
  },
});

export const ReduxStoreProvider: FC<PropsWithChildren> = (props) => {
  return (
    <Provider store={store}>{props.children}</Provider>
  );
};

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatchGlobal = typeof store.dispatch;