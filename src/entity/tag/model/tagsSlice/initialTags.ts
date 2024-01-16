import {ITag} from '../../types/tag';

export const initialTags: Record<string, ITag> = {
  Bird: {
    id: 'Bird',
    createdAt: 1703337593421,
    title: 'Bird',
    color: 'hsl(248, 100%, 16%)',
    connectedCardsIds: [
      '44dc7f34-8f57-42f0-9065-c3a14abc77d5',
    ],
  },
  Animal: {
    id: 'Animal',
    createdAt: 1703337596579,
    title: 'Animal',
    color: 'hsl(18, 100%, 16%)',
    connectedCardsIds: [
      '44dc7f34-8f57-42f0-9065-c3a14abc77d5',
      '6a3d7754-7b95-498d-91f0-adab23ebd10f',
    ],
  },
  Noun: {
    id: 'Noun',
    createdAt: 1703337608690,
    title: 'Noun',
    color: 'hsl(120, 100%, 16%)',
    connectedCardsIds: [
      '44dc7f34-8f57-42f0-9065-c3a14abc77d5',
      '6a3d7754-7b95-498d-91f0-adab23ebd10f',
    ],
  },
  Mammal: {
    id: 'Mammal',
    createdAt: 1703337955121,
    title: 'Mammal',
    color: 'hsl(340, 100%, 16%)',
    connectedCardsIds: [
      '6a3d7754-7b95-498d-91f0-adab23ebd10f',
    ],
  },
};