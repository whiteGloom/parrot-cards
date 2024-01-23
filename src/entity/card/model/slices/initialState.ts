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
      '9994ad29-1fa4-4343-9f00-83cf0c777413',
      'b562b953-0c88-4b5f-b076-f473568ac673',
      'c9612ba9-713c-4843-b78b-d68862c9cc3d',
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
      'c9612ba9-713c-4843-b78b-d68862c9cc3d',
      'b562b953-0c88-4b5f-b076-f473568ac673',
      '52f37712-b1bf-48f8-892e-56db1c23cc43',
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
