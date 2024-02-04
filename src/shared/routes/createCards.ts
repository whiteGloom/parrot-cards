import {generateFullPath} from '../lib/generateFullPath';

export const CreateCardsScheme = '/create-cards';

export function createCreateCardsPagePath() {
  return generateFullPath({routeData: {scheme: CreateCardsScheme}});
}
