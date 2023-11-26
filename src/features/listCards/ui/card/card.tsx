import React, {FC} from 'react';
import styles from './styles.module.scss';
import {ICard} from '../../../../entity/card';

export interface CardProps {
  cardModel: ICard;
}

export const Card: FC<CardProps> = (props) => {
  const [flip, setFlip] = React.useState(false);

  const currentSideData = flip ? props.cardModel.sideTwo : props.cardModel.sideOne;

  return (
    <div className={styles.card} onClick={() => {setFlip((flip) => !flip);}}>
      <p>Title: {currentSideData.title}</p>
      <p>Description: {currentSideData.description}</p>
      <p>Hint: {currentSideData.hints.join(', ')}</p>
    </div>
  );
};
