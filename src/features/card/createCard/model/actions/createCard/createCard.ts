import {createAsyncThunk} from '@reduxjs/toolkit';
import {addOne, ICard} from '../../../../../../entity/card/';
import {UniqueIdGenerator} from '../../../../../../shared/lib/generateUniqueId/generateUniqueId';
import {connectTagsWithCard} from '../../../../../../entity/tag';

export const createCard = createAsyncThunk(
  'createCard',
  function(data: Pick<ICard, 'frontSide' | 'backSide' | 'tagsIds'>, thunkApi) {
    const id = UniqueIdGenerator.generateSimpleUniqueId();

    thunkApi.dispatch(addOne({
      createdAt: Date.now(),
      id,
      ...data,
    }));

    thunkApi.dispatch(connectTagsWithCard({tagsIds: data.tagsIds, cardId: id}));
  }
);
