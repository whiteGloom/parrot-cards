import {generateFullPath} from '../lib/generateFullPath';

export const ExportPath = '/export';

export function createExportPagePath() {
  return generateFullPath({routeData: {scheme: ExportPath}});
}
