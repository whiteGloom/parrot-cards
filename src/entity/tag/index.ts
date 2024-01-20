export {tagsSliceReducer} from './model/slice/tagsSlice';

export {
  addOneTag,
  connectTagsWithCard,
  disconnectTagsFromCard,
  setAllTags,
} from './model/slice/tagsSlice';

export {makeSelectAllTags, useSelectAllTags} from './model/selectors/selectAllTags';

export {makeSelectTagsByIds, useSelectTagsByIds} from './model/selectors/selectTagsByIds';

export type {ITag} from './types/Tag';
