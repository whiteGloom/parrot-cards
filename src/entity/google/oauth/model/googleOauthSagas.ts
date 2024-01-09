import {Task, eventChannel, TakeableChannel} from 'redux-saga';
import {fork, cancel, delay, put, takeEvery, call} from 'redux-saga/effects';
import {clearTokenData, ITokenData, setTokenData} from './googleOauthSlice';
import {PayloadAction} from '@reduxjs/toolkit';

let expirationTimerTask: Task | undefined = undefined;

type LocallyStoredCredentialsSchemaType = {
  expiresIn: number,
  accessToken: string,
} | null;

type locallyStoredDataUpdateEventType = {
  newValue: LocallyStoredCredentialsSchemaType,
  oldValue: LocallyStoredCredentialsSchemaType,
};

function * startTokenExpirationTimer(duration: number) {
  yield delay(duration);
  yield put({type: clearTokenData.type});
}

function * handleCredentialsUpdate(action: PayloadAction<ITokenData>) {
  if (expirationTimerTask && !expirationTimerTask.isCancelled()) {
    yield cancel(expirationTimerTask);
    expirationTimerTask = undefined;
  }

  localStorage.setItem('googleOauthCredentials', JSON.stringify(action.payload));

  expirationTimerTask = (yield fork(startTokenExpirationTimer, (+action.payload.expiresIn) * 1000)) as Task;
}

function * handleCredentialsClearing() {
  localStorage.removeItem('googleOauthCredentials');

  if (expirationTimerTask && !expirationTimerTask.isCancelled()) {
    yield cancel(expirationTimerTask);
    expirationTimerTask = undefined;
  }
}

function locallyStoredCredentialsEmitter() {
  return eventChannel(emitter => {
    const handler = (e: StorageEvent) => {
      if (e.key !== 'googleOauthCredentials') {
        return;
      }

      if (e.newValue === e.oldValue) {
        return;
      }

      emitter({
        newValue: e.newValue ? JSON.parse(e.newValue) as LocallyStoredCredentialsSchemaType : null,
        oldValue: e.oldValue ? JSON.parse(e.oldValue) as LocallyStoredCredentialsSchemaType : null,
      });
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  });
}

function * handleLocallyStoredCredentialsUpdate(updateData: locallyStoredDataUpdateEventType) {
  if (updateData.newValue === null) {
    yield put({type: clearTokenData.type});
  } else {
    yield put(setTokenData(updateData.newValue));
  }
}

export function * watchers() {
  yield takeEvery(setTokenData.type, handleCredentialsUpdate);
  yield takeEvery(clearTokenData.type, handleCredentialsClearing);

  const locallyStoredCredentialsChannel = (yield call(locallyStoredCredentialsEmitter)) as TakeableChannel<locallyStoredDataUpdateEventType>;
  yield takeEvery(locallyStoredCredentialsChannel, handleLocallyStoredCredentialsUpdate);
}