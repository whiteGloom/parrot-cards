export {tagsSliceReducer} from './model/slice/tagsSlice';

export {
  addOneTag,
  connectTagsWithCard,
  disconnectTagsFromCard,
  setAllTags,
  removeOne,
} from './model/slice/tagsSlice';

export {selectAllTags, useSelectAllTags} from './model/selectors/selectAllTags';

export {makeSelectTagsByIds, useSelectTagsByIds} from './model/selectors/selectTagsByIds';

export {makeSelectTagById, useSelectTagById} from './model/selectors/selectTagById';

export {setTagTitle, useSetTagTitle} from './model/actions/setTagTitle';

export type {ITag} from './types/Tag';
