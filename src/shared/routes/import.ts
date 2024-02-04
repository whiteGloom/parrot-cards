import {generateFullPath} from '../lib/generateFullPath';

export const ImportPath = '/import';

export function createImportPagePath() {
  return generateFullPath({routeData: {scheme: ImportPath}});
}
