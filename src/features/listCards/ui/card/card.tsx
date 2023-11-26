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
      <p>{flip ? 'Back side' : 'Front side'}</p>
      <p>Title: {currentSideData.title}</p>

      {currentSideData.description.length ? (
        <p className={styles.description}>Description: {currentSideData.description}</p>
      ) : undefined}

      {currentSideData.hints.length ? (
        <p>Hints: {currentSideData.hints.join(', ')}</p>
      ) : undefined}
    </div>
  );
};
