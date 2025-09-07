import { z } from 'zod';
import { type Card, CardZod } from '../../../entities/cards.ts';
import { type Tag, TagZod } from '../../../entities/tags.ts';

export type FileVersion_1 = {
  version: 1
  content: {
    cards: Card[]
    tags: Tag[]
  }
};

export const FileVersion_1_zod = z.object({
  version: z.literal(1),
  content: z.object({
    cards: z.array(CardZod),
    tags: z.array(TagZod),
  }),
});
