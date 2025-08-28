import { z } from 'zod';
import { type HueColorConfig, HueColorConfig_zod } from '../utils/color.ts';

export interface Tag {
  id: string
  title: string
  createdAt: number
  updatedAt: number
  color: HueColorConfig
}

export const TagZod = z.object({
  id: z.string(),
  title: z.string(),
});

export interface TagDraft {
  title: string
  color?: HueColorConfig
}

export const TagDraftZod = z.object({
  title: z.string(),
  color: z.optional(HueColorConfig_zod),
});
