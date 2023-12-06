import {removeContentItemFromAllById} from '../../../entity/collection';
import {removeOne} from '../../../entity/card';
import {AppDispatch} from '../../../shared/types/appDispatch';

export const removeCard = (id: string) => {
  return (dispatch: AppDispatch) => {
    dispatch(removeContentItemFromAllById(id));
    dispatch(removeOne(id));
  };
};