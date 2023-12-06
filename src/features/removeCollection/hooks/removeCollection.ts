import {removeContentItemFromAllById} from '../../../entity/collection';
import {removeOne} from '../../../entity/collection';
import {AppDispatch} from '../../../shared/types/appDispatch';

export const removeCollection = (id: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(removeContentItemFromAllById(id));
    dispatch(removeOne(id));
  };
};