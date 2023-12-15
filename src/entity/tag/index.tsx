export {tagsSliceReducer} from './model/tagsSlice/tagsSlice';

export {
  addOneTag,
  connectTagsWithCard,
  disconnectTagsFromCard,
} from './model/tagsSlice/tagsSlice';

export {selectAllTags} from './model/selectors/selectAllTags';

export {selectTagsByIds} from './model/selectors/selectTagsById';

export type {ITag} from './types/tag';