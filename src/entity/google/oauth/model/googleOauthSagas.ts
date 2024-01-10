import {Task, eventChannel, TakeableChannel} from 'redux-saga';
import {fork, cancel, delay, put, takeEvery, call} from 'redux-saga/effects';
import {clearTokenData, ITokenData, setTokenData} from './googleOauthSlice';
import {PayloadAction} from '@reduxjs/toolkit';

let expirationTimerTask: Task | undefined = undefined;

type LocallyStoredCredentialsSchemaType = ITokenData | null;

type LocallyStoredDataUpdateEventType = {
  newValue: LocallyStoredCredentialsSchemaType,
  oldValue: LocallyStoredCredentialsSchemaType,
};

function * startTokenExpirationTimer(duration: number) {
  yield delay(duration);
  yield put(clearTokenData());
}

function * handleCredentialsUpdate(action: PayloadAction<ITokenData>) {
  if (expirationTimerTask && !expirationTimerTask.isCancelled()) {
    yield cancel(expirationTimerTask);
    expirationTimerTask = undefined;
  }

  const encodedData = JSON.stringify(action.payload);
  if (encodedData !== localStorage.getItem('googleOauthCredentials')) {
    localStorage.setItem('googleOauthCredentials', encodedData);
  }

  expirationTimerTask = (yield fork(startTokenExpirationTimer, action.payload.expiresAt - Date.now())) as Task;
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
      if (e.key !== 'googleOauthCredentials' || e.newValue === e.oldValue) {
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

function * handleLocallyStoredCredentialsUpdate(updateData: LocallyStoredDataUpdateEventType) {
  if (!updateData.newValue) {
    yield put(clearTokenData());
  } else {
    yield put(setTokenData(updateData.newValue));
  }
}

export function * watchers() {
  yield takeEvery(setTokenData.type, handleCredentialsUpdate);
  yield takeEvery(clearTokenData.type, handleCredentialsClearing);

  const locallyStoredCredentialsChannel = (yield call(locallyStoredCredentialsEmitter)) as TakeableChannel<LocallyStoredDataUpdateEventType>;
  yield takeEvery(locallyStoredCredentialsChannel, handleLocallyStoredCredentialsUpdate);
}