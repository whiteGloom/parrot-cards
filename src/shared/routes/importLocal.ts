import {generateFullPath} from '../lib/generateFullPath';

export const ImportLocalScheme = '/import-local';

export function createImportLocalPagePath() {
  return generateFullPath({routeData: {scheme: ImportLocalScheme}});
}
