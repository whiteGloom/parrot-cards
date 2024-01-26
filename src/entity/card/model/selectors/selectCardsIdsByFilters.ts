import {createSelector} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {useRef} from 'react';
import {useSelector} from 'react-redux';

type FiltersType = {
  tagsIds: string[],
}

export function makeSelectCardsIdsByFilters() {
  return createSelector(
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
}

export function useSelectCardsIdsByFilters(filters: FiltersType) {
  const selector = useRef(makeSelectCardsIdsByFilters()).current;

  return useSelector((state: AppState) => selector(state, filters));
}