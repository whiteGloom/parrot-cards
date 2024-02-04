import {generateFullPath} from '../lib/generateFullPath';

export const ExportLocalPath = '/export-local';

export function createExportLocalPagePath() {
  return generateFullPath({routeData: {scheme: ExportLocalPath}});
}
