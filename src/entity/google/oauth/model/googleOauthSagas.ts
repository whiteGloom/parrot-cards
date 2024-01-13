import {Task, eventChannel, TakeableChannel} from 'redux-saga';
import {fork, cancel, delay, put, takeEvery, call} from 'redux-saga/effects';
import {clearTokenData, ITokenData, setTokenData} from './googleOauthSlice';
import {PayloadAction} from '@reduxjs/toolkit';
import {REQUEST_PRELOAD_GOOGLE_OAUTH} from './actionTypes';

let expirationTimerTask: Task | undefined = undefined;

type LocallyStoredDataUpdateEventType = {
  newValue: string | null,
  oldValue: string | null,
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
        newValue: e.newValue,
        oldValue: e.oldValue,
      });
    };

    window.addEventListener('storage', handler);

    return () => {
      window.removeEventListener('storage', handler);
    };
  });
}

function * handleLocallyStoredCredentialsUpdate(updateData: LocallyStoredDataUpdateEventType) {
  try {
    const newData = updateData.newValue ? JSON.parse(updateData.newValue) as ITokenData | '' : null;

    if (!newData) {
      yield put(clearTokenData());
    } else {
      yield put(setTokenData(newData));
    }
  } catch (err) {
    localStorage.removeItem('googleOauthCredentials');
    yield put(clearTokenData());
  }
}

function * handlePreloadRequest() {
  try {
    const tokenDataRaw = localStorage.getItem('googleOauthCredentials');

    if (tokenDataRaw) {
      const tokenData = JSON.parse(tokenDataRaw) as ITokenData;

      if (tokenData.expiresAt > Date.now()) {
        yield put(setTokenData(tokenData));
      } else {
        localStorage.removeItem('googleOauthCredentials');
      }
    }
  } catch (_err) {
    localStorage.removeItem('googleOauthCredentials');
  }
}

export function * watchers() {
  yield takeEvery(setTokenData.type, handleCredentialsUpdate);
  yield takeEvery(clearTokenData.type, handleCredentialsClearing);
  yield takeEvery(REQUEST_PRELOAD_GOOGLE_OAUTH, handlePreloadRequest);

  const locallyStoredCredentialsChannel = (yield call(locallyStoredCredentialsEmitter)) as TakeableChannel<LocallyStoredDataUpdateEventType>;
  yield takeEvery(locallyStoredCredentialsChannel, handleLocallyStoredCredentialsUpdate);
}