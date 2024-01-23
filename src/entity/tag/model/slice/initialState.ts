import {ITag} from '../../types/Tag';

export const initialTags: ITag[] = [
  {
    id: '9994ad29-1fa4-4343-9f00-83cf0c777413',
    createdAt: 1703337593421,
    title: 'Bird',
    color: 'hsl(248, 100%, 16%)',
    connectedCardsIds: [
      '44dc7f34-8f57-42f0-9065-c3a14abc77d5',
    ],
  },
  {
    id: 'b562b953-0c88-4b5f-b076-f473568ac673',
    createdAt: 1703337596579,
    title: 'Animal',
    color: 'hsl(41, 100%, 16%)',
    connectedCardsIds: [
      '44dc7f34-8f57-42f0-9065-c3a14abc77d5',
      '6a3d7754-7b95-498d-91f0-adab23ebd10f',
    ],
  },
  {
    id: 'c9612ba9-713c-4843-b78b-d68862c9cc3d',
    createdAt: 1703337608690,
    title: 'Noun',
    color: 'hsl(120, 100%, 16%)',
    connectedCardsIds: [
      '44dc7f34-8f57-42f0-9065-c3a14abc77d5',
      '6a3d7754-7b95-498d-91f0-adab23ebd10f',
    ],
  },
  {
    id: '52f37712-b1bf-48f8-892e-56db1c23cc43',
    createdAt: 1703337955121,
    title: 'Mammal',
    color: 'hsl(292, 100%, 16%)',
    connectedCardsIds: [
      '6a3d7754-7b95-498d-91f0-adab23ebd10f',
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
