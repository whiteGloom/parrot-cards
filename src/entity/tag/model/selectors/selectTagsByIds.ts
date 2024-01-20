import {createSelector} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {useSelector} from 'react-redux';
import {useRef} from 'react';

export function makeSelectTagsByIds() {
  return createSelector(
    (state: AppState) => state.tags.entities,
    (_state: AppState, ids: string[]) => ids,
    (tags, ids) => ids.map((id) => tags[id])
  );
}

export function useSelectTagsByIds(ids: string[]) {
  const selector = useRef(makeSelectTagsByIds()).current;

  return useSelector((state: AppState) => selector(state, ids));
}
