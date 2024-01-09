import React, {FC, PropsWithChildren} from 'react';
import {Provider} from 'react-redux';
import {configureStore} from '@reduxjs/toolkit';
import {cardsSliceReducer} from '../../../entity/card';
import {tagsSliceReducer} from '../../../entity/tag';
import createSagaMiddleware from 'redux-saga';
import {all} from 'redux-saga/effects';
import {googleOauthSliceReducer, watchers} from '../../../entity/google/oauth';

const sagaMiddleware = createSagaMiddleware();

export const store = configureStore({
  reducer: {
    cards: cardsSliceReducer,
    tags: tagsSliceReducer,
    googleOauth: googleOauthSliceReducer,
  },
  middleware: (getDefaultMiddleware) => getDefaultMiddleware()
    .concat(sagaMiddleware),
});

function * rootSaga() {
  yield all([
    watchers(),
  ]);
}

sagaMiddleware.run(rootSaga);

export const ReduxStoreProvider: FC<PropsWithChildren> = (props) => {
  return (
    <Provider store={store}>{props.children}</Provider>
  );
};

export type RootState = ReturnType<typeof store.getState>;

export type AppDispatchGlobal = typeof store.dispatch;