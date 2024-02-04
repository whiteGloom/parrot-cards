import {generateFullPath} from '../lib/generateFullPath';

export const ExportLocalScheme = '/export-local';

export function createExportLocalPagePath() {
  return generateFullPath({routeData: {scheme: ExportLocalScheme}});
}
