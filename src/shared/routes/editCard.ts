import {generateFullPath} from '../lib/generateFullPath';

export const EditCardScheme = '/edit-card/:cardId';

export type EditCardParameters = {
  cardId: string;
};

export function createEditCardPagePath(params: EditCardParameters) {
  return generateFullPath({
    routeData: {
      scheme: EditCardScheme,
      placeholders: {
        cardId: params.cardId,
      },
    },
  });
}
