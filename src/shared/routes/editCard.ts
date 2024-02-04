import {generateFullPath} from '../lib/generateFullPath';

export const EditCardPath = '/edit-card/:cardId';

export type EditCardParameters = {
  cardId: string;
};

export function createEditCardPagePath(params: EditCardParameters) {
  return generateFullPath({
    routeData: {
      scheme: EditCardPath,
      placeholders: {
        cardId: params.cardId,
      },
    },
  });
}
