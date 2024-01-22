import {AppState} from '../../../../shared/lib/store/appState';
import {useSelector} from 'react-redux';
import {tagsAdaptorSelectors} from '../slice/tagsSlice';

export function makeSelectTagById(id: string) {
  return (state: AppState) => tagsAdaptorSelectors.selectById(state, id);
}

export function useSelectTagById(id: string) {
  return useSelector(makeSelectTagById(id));
}
