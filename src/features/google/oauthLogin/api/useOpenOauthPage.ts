import {OauthParamsType, openOauthPageThunk} from './openOauthPageThunk';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';

export function useOpenOauthPage() {
  const dispatch = useAppDispatch();

  return (params: OauthParamsType) => dispatch(openOauthPageThunk(params));
}