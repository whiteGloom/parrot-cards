import {ICard} from '../../types/Card';

export const cards: ICard[] = [
  {
    createdAt: 1703337625000,
    id: 'c30db12cb0f988a0',
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
    id: '30db12cb0f988a0c',
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
