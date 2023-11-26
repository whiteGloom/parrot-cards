export interface ICardSide {
  title: string;
  description: string;
  hints: string[];
}

export interface ICard {
  id: string;
  createdAt: number;
  sideOne: ICardSide;
  sideTwo: ICardSide;
}