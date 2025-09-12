import {
  type FileVersion_1,
  FileVersion_1_zod,
} from './versions/1.ts';
import { type CardsStore } from '../../stores/cards-store.ts';
import type { TagsStore } from '../../stores/tags-store.ts';
import type { Card } from '../../entities/cards.ts';
import type { Tag } from '../../entities/tags.ts';

type VersionContainer = {
  version: number
};

function parseSavedFile(fileContent: string): FileVersion_1 {
  const parsed: VersionContainer = JSON.parse(fileContent);

  if (parsed.version !== 1) {
    throw new Error('Unsupported file version');
  }

  FileVersion_1_zod.parse(parsed);

  return parsed as FileVersion_1;
}

export async function parseAndImportSavedFile(params: { cardsStore: CardsStore, tagsStore: TagsStore, fileContent: string }) {
  const { cardsStore, tagsStore, fileContent } = params;

  const fileData = parseSavedFile(fileContent);

  const cards: Card[] = [];

  for (const card of fileData.content.cards) {
    cards.push({
      id: card.id,
      tags: card.tags || [],
      targetLanguageSide: {
        title: card.targetLanguageSide.title,
        description: card.targetLanguageSide.description || '',
        hints: card.targetLanguageSide.hints || [],
      },
      knownLanguageSide: {
        title: card.knownLanguageSide.title,
        description: card.knownLanguageSide.description || '',
        hints: card.knownLanguageSide.hints || [],
      },
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
    });
  }

  const tags: Tag[] = [];

  for (const tag of fileData.content.tags) {
    tags.push({
      id: tag.id,
      title: tag.title,
      createdAt: tag.createdAt,
      updatedAt: tag.updatedAt,
      color: {
        angle: tag.color[0],
        saturation: tag.color[1],
        lightness: tag.color[2],
        alpha: tag.color[3] || 100,
      },
    });
  }

  cardsStore.getState().addCards(cards);
  tagsStore.getState().addTags(tags);
}

export async function prepareForExport(params: { cardsStore: CardsStore, tagsStore: TagsStore }) {
  const { cardsStore, tagsStore } = params;

  const fileData: FileVersion_1 = {
    version: 1,
    content: {
      cards: cardsStore.getState().cardsIds.map((id) => {
        const card = cardsStore.getState().cards[id];
        return {
          id: card.id,
          updatedAt: card.updatedAt,
          createdAt: card.createdAt,
          tags: card.tags.length ? card.tags : undefined,
          targetLanguageSide: {
            title: card.targetLanguageSide.title,
            description: card.targetLanguageSide.description.length ? card.targetLanguageSide.description : undefined,
            hints: card.targetLanguageSide.hints.length ? card.targetLanguageSide.hints : undefined,
          },
          knownLanguageSide: {
            title: card.knownLanguageSide.title,
            description: card.knownLanguageSide.description.length ? card.knownLanguageSide.description : undefined,
            hints: card.knownLanguageSide.hints.length ? card.knownLanguageSide.hints : undefined,
          },
        };
      }),
      tags: tagsStore.getState().tagsIds.map((id) => {
        const tag = tagsStore.getState().tags[id];
        return {
          id: tag.id,
          title: tag.title,
          updatedAt: tag.updatedAt,
          createdAt: tag.createdAt,
          color: [tag.color.angle, tag.color.saturation, tag.color.lightness, tag.color.alpha || 100],
        };
      }),
    },
  };

  return JSON.stringify(fileData);
}
