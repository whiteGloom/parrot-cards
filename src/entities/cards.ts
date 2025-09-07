import { z } from 'zod';

export interface CardSide {
  title: string
  description: string
  hints: string[]
}

export const CardSideZod = z.object({
  title: z.string(),
  description: z.string(),
  hints: z.array(z.string()),
});

export interface Card {
  id: string
  knownLanguageSide: CardSide
  targetLanguageSide: CardSide
  tags: string[]
  createdAt: number
  updatedAt: number
}

export const CardZod = z.object({
  id: z.string(),
  knownLanguageSide: CardSideZod,
  targetLanguageSide: CardSideZod,
});

export interface CardDraft {
  knownLanguageSide: CardSide
  targetLanguageSide: CardSide
  tags: string[]
}

export const CardDraftZod = z.object({
  knownLanguageSide: CardSideZod,
  targetLanguageSide: CardSideZod,
  tags: z.array(z.string()),
});
