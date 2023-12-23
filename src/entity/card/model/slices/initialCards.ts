import {ICard} from '../../types/card';

export const initialCards: Record<string, ICard> = {
  '44dc7f34-8f57-42f0-9065-c3a14abc77d5': {
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
      'Bird',
      'Animal',
      'Noun',
    ],
  },
  '6a3d7754-7b95-498d-91f0-adab23ebd10f': {
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
      'Noun',
      'Animal',
      'Mammal',
    ],
  },
};