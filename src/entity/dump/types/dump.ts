type Card = {
  id: string;
  createdAt: number;
  frontSide: {
    title: string;
    description: string;
    hints: string[];
  }
  backSide: {
    title: string;
    description: string;
    hints: string[];
  },
  tagsIds: string[];
}

type Tag = {
  id: string;
  title: string;
  createdAt: number;
  connectedCardsIds: string[];
  color: string,
}

export interface IDumpActual {
  version: 1;
  cards: Card[];
  tags: Tag[];
}

export interface IDumpUnknown {
  version: number;
}
