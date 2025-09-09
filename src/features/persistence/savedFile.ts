import { type FileVersion_1, FileVersion_1_zod } from './versions/1.ts';
import { type CardsStore } from '../../stores/cards-store.ts';
import type { TagsStore } from '../../stores/tags-store.ts';

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
  cardsStore.getState().addCards(fileData.content.cards);
  tagsStore.getState().addTags(fileData.content.tags);
}

export async function prepareForExport(params: { cardsStore: CardsStore, tagsStore: TagsStore }) {
  const { cardsStore, tagsStore } = params;

  const fileData: FileVersion_1 = {
    version: 1,
    content: {
      cards: cardsStore.getState().cardsIds.map(id => cardsStore.getState().cards[id]),
      tags: tagsStore.getState().tagsIds.map(id => tagsStore.getState().tags[id]),
    },
  };

  return JSON.stringify(fileData);
}
