import {generateFullPath} from '../lib/generateFullPath';

export const HomePath = '/';

export function createHomePagePath() {
  return generateFullPath({routeData: {scheme: HomePath}});
}
