import {useDispatch} from 'react-redux';
import {AppDispatch} from './appDispatch';

export const useAppDispatch: () => AppDispatch = useDispatch;