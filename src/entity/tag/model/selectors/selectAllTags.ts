import {AppState} from '../../../../shared/lib/store/appState';
import {tagsAdaptorSelectors} from '../tagsSlice/tagsSlice';

export const selectAllTags = () => (state: AppState) => tagsAdaptorSelectors.selectAll(state);