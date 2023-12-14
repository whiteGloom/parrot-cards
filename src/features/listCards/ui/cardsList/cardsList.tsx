import React, {FC} from 'react';
import {Card} from '../card/card';
import styles from './styles.module.scss';
import {ICard} from '../../../../entity/card';

export type CardsListProps = {
  cards: ICard[];
}

export const CardsList: FC<CardsListProps> = ({cards}) => {
  return (
    <ul className={styles.listCards}>
      {!cards.length ? (
        'No cards available yet'
      ) : undefined}

      {cards.map((card) => (
        <li key={card.id}>
          <Card cardData={card}/>
        </li>
      ))}
    </ul>
  );
};
