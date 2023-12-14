import {createSelector} from '@reduxjs/toolkit';
import {AppState} from '../../../../shared/types/appState';
import {ICard} from '../../../../entity/card/types/card';

export function selectCardsByTags(ids: string[]) {
  const selector = createSelector(
    (_state: AppState, tagsIds: string[]) => tagsIds,
    (state: AppState) => state.tags.entities,
    (state: AppState) => state.cards.entities,
    (tagsIds, tags, cards) => {
      console.log('wgl selectCardsByTags.', cards, ids);
      const cardsIdsToSelect = new Set<string>();

      tagsIds.forEach(tagId => {
        if (!tags[tagId]) return;

        tags[tagId].connectedCardsIds.forEach((id) => cardsIdsToSelect.add(id));
      });

      const result: ICard[] = [];

      cardsIdsToSelect.forEach(id => result.push(cards[id]));

      console.log('wgl selectCardsByTags.', cardsIdsToSelect, result);
      return result;
    }
  );

  return (state: AppState) => selector(state, ids);
}