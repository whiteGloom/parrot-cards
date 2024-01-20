import {AppState} from '../../../../shared/lib/store/appState';
import {cardsSelectors} from '../slices/cardsSlice';
import {useSelector} from 'react-redux';

export function makeSelectCardById(id: string) {
  return (state: AppState) => cardsSelectors.selectById(state, id);
}

export function useSelectCardById(id: string) {
  return useSelector(makeSelectCardById(id));
}