import {generateFullPath} from '../lib/generateFullPath';

export const ImportLocalPath = '/import-local';

export function createImportLocalPagePath() {
  return generateFullPath({routeData: {scheme: ImportLocalPath}});
}
