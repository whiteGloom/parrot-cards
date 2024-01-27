import {createSelector} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/lib/store/appState';
import {ICard} from '../../index';
import {useRef} from 'react';
import {useSelector} from 'react-redux';

export type FiltersType = {
  tagsIds: string[],
}

export function makeSelectCardsByFilters() {
  return createSelector(
    (_state: AppState, filters: FiltersType) => filters,
    (state: AppState) => state.tags.entities,
    (state: AppState) => state.cards.entities,
    (state: AppState) => state.cards.ids,
    (filters, tags, cards, cardsIds) => {
      let result: ICard[] = [];

      if (filters.tagsIds.length) {
        const cardsIdsToSelect = new Set<string>();

        filters.tagsIds.forEach(tagId => {
          if (!tags[tagId]) return;

          tags[tagId].connectedCardsIds.forEach((id) => cardsIdsToSelect.add(id));
        });

        cardsIdsToSelect.forEach(id => result.push(cards[id]));
      } else {
        result = cardsIds.map(id => cards[id]) as ICard[];
      }

      return result;
    }
  );
}

export function useSelectCardsByFilters(filters: FiltersType) {
  const selector = useRef(makeSelectCardsByFilters()).current;

  return useSelector((state: AppState) => selector(state, filters));
}
