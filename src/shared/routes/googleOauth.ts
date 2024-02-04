import {generateFullPath} from '../lib/generateFullPath';

export const GoogleOauthScheme = '/google-oauth';

export function createGoogleOauthPagePath() {
  return generateFullPath({routeData: {scheme: GoogleOauthScheme}});
}
