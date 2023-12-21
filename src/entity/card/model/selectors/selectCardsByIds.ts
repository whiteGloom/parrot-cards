import {ICard} from '../../types/card';
import {AppState} from '../../../../shared/lib/store/appState';
import {createSelector} from '@reduxjs/toolkit';

export function selectCardsByIds(ids: ICard['id'][]) {
  const selector = createSelector(
    (_state: AppState, ids: ICard['id'][]) => ids,
    (state: AppState) => state.cards.entities,
    (ids, cards) => {
      return ids.map(id => cards[id]);
    }
  );

  return (state: AppState) => selector(state, ids);
}