import {cardsSelectors} from '../slices/cardsSlice';
import {AppState} from '../../../../shared/lib/store/appState';

export const selectAllCards = () => (state: AppState) => cardsSelectors.selectAll(state);