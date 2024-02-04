import {generateFullPath} from '../lib/generateFullPath';

export const GoogleOauthPath = '/google-oauth';

export function createGoogleOauthPagePath() {
  return generateFullPath({routeData: {scheme: GoogleOauthPath}});
}
