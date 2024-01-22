import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {setTagTitle} from '../slice/tagsSlice';

export function useSetTagTitle() {
  const dispatch = useAppDispatch();

  return (params: {tagId: string, newTitle: string}) => dispatch(setTagTitle(params));
}

export {setTagTitle} from '../slice/tagsSlice';
