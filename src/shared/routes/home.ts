import {generateFullPath} from '../lib/generateFullPath';

export const HomeScheme = '/';

export function createHomePagePath() {
  return generateFullPath({routeData: {scheme: HomeScheme}});
}
