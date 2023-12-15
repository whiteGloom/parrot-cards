import {ICard} from '../../types/card';
import {AppState} from '../../../../shared/lib/store/appState';
import {cardsSelectors} from '../slices/cardsSlice';

export const selectCardById = (id: ICard['id']) => (state: AppState) => cardsSelectors.selectById(state, id);