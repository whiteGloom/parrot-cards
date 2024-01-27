import {useAppDispatch} from '../../../../../shared/lib/store/useAppDispatch';
import {setTagTitle} from '../../../../../entity/tag/model/slice/tagsSlice';

export function useRenameTag() {
  const dispatch = useAppDispatch();

  return (params: {tagId: string, newTitle: string}) => dispatch(setTagTitle(params));
}
