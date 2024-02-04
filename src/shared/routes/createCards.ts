import {generateFullPath} from '../lib/generateFullPath';

export const CreateCardsPath = '/create-cards';

export function createCreateCardsPagePath() {
  return generateFullPath({routeData: {scheme: CreateCardsPath}});
}
