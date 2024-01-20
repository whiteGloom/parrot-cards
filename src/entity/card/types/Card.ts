export interface ICardSide {
  title: string;
  description: string;
  hints: string[];
}

export interface ICard {
  id: string;
  createdAt: number;
  frontSide: ICardSide;
  backSide: ICardSide;
  tagsIds: string[];
}