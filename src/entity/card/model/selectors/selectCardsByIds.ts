import {AppState} from '../../../../shared/lib/store/appState';
import {createSelector} from '@reduxjs/toolkit';
import {useRef} from 'react';
import {useSelector} from 'react-redux';

export function makeSelectCardsByIds() {
  return createSelector(
    (_state: AppState, ids: string[]) => ids,
    (state: AppState) => state.cards.entities,
    (ids, cards) => {
      return ids.map(id => cards[id]);
    }
  );
}

export function useSelectCardsByIds(ids: string[]) {
  const selector = useRef(makeSelectCardsByIds()).current;

  return useSelector((state: AppState) => selector(state, ids));
}
