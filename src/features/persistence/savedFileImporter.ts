import type { FileVersion_1 } from './versions/1.ts';
import type { CardsStore } from '../../stores/cardsStore.ts';

type VersionContainer = {
  version: number
};

function parseSavedFile(fileContent: string): FileVersion_1 {
  const parsed: VersionContainer = JSON.parse(fileContent);

  if (parsed.version !== 1) {
    throw new Error('Unsupported file version');
  }

  return parsed as FileVersion_1;
}

export async function parseAndImportSavedFile(cardsStore: CardsStore, fileContent: string) {
  const fileData = parseSavedFile(fileContent);
  cardsStore.getState().addCards(fileData.content.cards);
}
