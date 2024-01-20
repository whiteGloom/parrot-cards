import {cardsSelectors} from '../slices/cardsSlice';
import {AppState} from '../../../../shared/lib/store/appState';
import {useSelector} from 'react-redux';

export function makeSelectAllCards() {
  return (state: AppState) => cardsSelectors.selectAll(state);
}

export function useSelectAllCards() {
  return useSelector(makeSelectAllCards());
}