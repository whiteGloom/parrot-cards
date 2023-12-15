import {createSelector} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';

export function selectTagsByIds(ids: string[]) {
  const selector = createSelector(
    (state: AppState) => state.tags.entities,
    (_state: AppState, ids: string[]) => ids,
    (tags, ids) => ids.map((id) => tags[id])
  );

  return (state: AppState) => selector(state, ids);
}
