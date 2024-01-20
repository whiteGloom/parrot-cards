import {AppState} from '../../../../shared/lib/store/appState';
import {tagsAdaptorSelectors} from '../slice/tagsSlice';
import {useSelector} from 'react-redux';

export function makeSelectAllTags() {
  return (state: AppState) => tagsAdaptorSelectors.selectAll(state);
}

export function useSelectAllTags() {
  return useSelector(makeSelectAllTags());
}
