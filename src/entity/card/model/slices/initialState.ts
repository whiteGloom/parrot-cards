import {ICard} from '../../types/Card';

export const cards: ICard[] = [
  {
    createdAt: 1703337625000,
    id: '44dc7f34-8f57-42f0-9065-c3a14abc77d5',
    frontSide: {
      title: 'Parrot',
      description: 'Parrot was sitting on captain\'s shoulder',
      hints: [
        'Is able to speak',
        'Bird',
      ],
    },
    backSide: {
      title: 'Попугай',
      description: 'Попугай сидел на плече капитана',
      hints: [],
    },
    tagsIds: [
      'df37225d5eb',
      'f37225d5eb4',
      '37225d5eb47',
    ],
  },
  {
    createdAt: 1703338029159,
    id: '6a3d7754-7b95-498d-91f0-adab23ebd10f',
    frontSide: {
      title: 'Fox',
      description: 'There is a cartoon named "The Fox and the Hound"',
      hints: [
        'What does the fox say',
        'Mammal',
      ],
    },
    backSide: {
      title: 'Лиса',
      description: '',
      hints: [],
    },
    tagsIds: [
      '37225d5eb47',
      'f37225d5eb4',
      '7225d5eb47e',
    ],
  },
];

export const initialState = {
  ids: cards.map(card => card.id),
  entities: cards.reduce((acc, card) => {
    acc[card.id] = card;

    return acc;
  }, {} as Record<string, ICard>),
};
