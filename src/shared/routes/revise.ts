import {generateFullPath} from '../lib/generateFullPath';

export const ReviseScheme = '/revise/:cardId';

export type ReviseParameters = {
  cardId: string,
  tags?: string,
};

export function createRevisePagePath(params: ReviseParameters) {
  return generateFullPath({
    routeData: {
      scheme: ReviseScheme,
      placeholders: {
        cardId: params.cardId,
      },
      search: {
        tags: params.tags,
      },
    },
  });
}
