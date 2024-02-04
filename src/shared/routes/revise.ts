import {generateFullPath} from '../lib/generateFullPath';

export const RevisePath = '/revise/:cardId';

export type ReviseParameters = {
  cardId: string,
  tags?: string,
};

export function createRevisePagePath(params: ReviseParameters) {
  return generateFullPath({
    routeData: {
      scheme: RevisePath,
      placeholders: {
        cardId: params.cardId,
      },
      search: {
        tags: params.tags,
      },
    },
  });
}
