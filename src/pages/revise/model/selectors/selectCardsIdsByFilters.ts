import {createSelector} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';

type FiltersType = {
  tagsIds: string[],
}

export function selectCardsIdsByFilters(filters: FiltersType) {
  const selector = createSelector(
    (_state: AppState, filters: FiltersType) => filters,
    (state: AppState) => state.tags.entities,
    (state: AppState) => state.cards.ids,
    (filters, tags, cardsIds) => {
      if (filters.tagsIds.length) {
        const cardsIdsToSelect = new Set<string>();

        filters.tagsIds.forEach(tagId => {
          if (!tags[tagId]) return;

          tags[tagId].connectedCardsIds.forEach((id) => cardsIdsToSelect.add(id));
        });

        return Array.from(cardsIdsToSelect);
      } else {
        return cardsIds;
      }
    }
  );

  return (state: AppState) => selector(state, filters);
}