import {generateFullPath} from '../lib/generateFullPath';

export const ExportScheme = '/export';

export function createExportPagePath() {
  return generateFullPath({routeData: {scheme: ExportScheme}});
}
