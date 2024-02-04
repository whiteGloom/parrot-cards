import {generateFullPath} from '../lib/generateFullPath';

export const ImportScheme = '/import';

export function createImportPagePath() {
  return generateFullPath({routeData: {scheme: ImportScheme}});
}
