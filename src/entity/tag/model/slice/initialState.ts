import {ITag} from '../../types/Tag';

export const initialTags: ITag[] = [
  {
    id: 'df37225d5eb',
    createdAt: 1703337593421,
    title: 'Bird',
    color: 'hsl(248, 100%, 16%)',
    connectedCardsIds: [
      'c30db12cb0f988a0',
    ],
  },
  {
    id: 'f37225d5eb4',
    createdAt: 1703337596579,
    title: 'Animal',
    color: 'hsl(41, 100%, 16%)',
    connectedCardsIds: [
      'c30db12cb0f988a0',
      '30db12cb0f988a0c',
    ],
  },
  {
    id: '37225d5eb47',
    createdAt: 1703337608690,
    title: 'Noun',
    color: 'hsl(120, 100%, 16%)',
    connectedCardsIds: [
      'c30db12cb0f988a0',
      '30db12cb0f988a0c',
    ],
  },
  {
    id: '7225d5eb47e',
    createdAt: 1703337955121,
    title: 'Mammal',
    color: 'hsl(292, 100%, 16%)',
    connectedCardsIds: [
      '30db12cb0f988a0c',
    ],
  },
];

export const initialState = {
  ids: initialTags.map(tag => tag.id),
  entities: initialTags.reduce((acc, tag) => {
    acc[tag.id] = tag;
    return acc;
  }, {} as Record<string, ITag>),
};
