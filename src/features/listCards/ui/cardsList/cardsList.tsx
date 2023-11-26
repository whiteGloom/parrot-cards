import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {cardsSelectors} from '../../../../entity/card/model/slices/cardsSlice';
import {Card} from '../card/card';
import styles from './styles.module.scss';

export const CardsList: FC = () => {
  const cards = useSelector(cardsSelectors.selectAll);

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
