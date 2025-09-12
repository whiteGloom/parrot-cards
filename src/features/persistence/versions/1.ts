import { z } from 'zod';

export type SerializedCardSide = {
  title: string
  description?: string
  hints?: string[]
};

const SerializedCardSideZod = z.object({
  title: z.string(),
  description: z.string().optional(),
  hints: z.array(z.string()).optional(),
});

export type SerializedCard = {
  id: string
  knownLanguageSide: SerializedCardSide
  targetLanguageSide: SerializedCardSide
  tags?: string[]
  createdAt: number
  updatedAt: number
};

export const SerializedCardZod = z.object({
  id: z.string(),
  knownLanguageSide: SerializedCardSideZod,
  targetLanguageSide: SerializedCardSideZod,
  tags: z.array(z.string()).optional(),
  createdAt: z.number(),
  updatedAt: z.number(),
});

type SerializedHueColorConfig = [
  /// Angle
  number,
  /// Saturation
  number,
  /// Lightness
  number,
  /// Alpha
  number | undefined,
];

const SerializedHueColorConfig_zod = z.tuple([
  z.number(), z.number(), z.number(), z.number().optional().nullable(),
]);

type SerializedTag = {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  color: SerializedHueColorConfig
};

export const SerializedTagZod = z.object({
  id: z.string(),
  title: z.string(),
  color: SerializedHueColorConfig_zod,
});

export type FileVersion_1 = {
  version: 1
  content: {
    cards: SerializedCard[]
    tags: SerializedTag[]
  }
};

export const FileVersion_1_zod = z.object({
  version: z.literal(1),
  content: z.object({
    cards: z.array(SerializedCardZod),
    tags: z.array(SerializedTagZod),
  }),
});
