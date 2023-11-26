import React, {FC} from 'react';
import {useSelector} from 'react-redux';
import {cardsSelectors} from '../../../../entity/card/model/slices/cardsSlice';
import {Card} from '../card/card';
import styles from './styles.module.scss';

export const CardsList: FC = () => {
  const cards = useSelector(cardsSelectors.selectAll);

  return (
    <ul className={styles.listCards}>
      {cards.map((cards) => {
        return (
          <li key={cards.id}>
            <Card cardModel={cards}/>
          </li>
        );
      })}
    </ul>
  );
};
