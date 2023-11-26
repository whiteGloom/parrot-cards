import React, {FC} from 'react';
import styles from './styles.module.scss';
import {ICard} from '../../../../entity/card';
import {Hint} from '../hint/hint';

export interface CardProps {
  cardData: ICard;
}

export const Card: FC<CardProps> = (props) => {
  const [flip, setFlip] = React.useState(false);

  const currentSideData = flip ? props.cardData.backSide : props.cardData.frontSide;

  return (
    <div className={styles.card} onClick={() => {setFlip((flip) => !flip);}}>
      <p>{flip ? 'BACK SIDE' : 'FRONT SIDE'}</p>
      <p>Title: {currentSideData.title}</p>

      {currentSideData.description.length ? (
        <p className={styles.description}>Description: {currentSideData.description}</p>
      ) : undefined}

      {currentSideData.hints.length ? currentSideData.hints.map((hint) => {
        return (
          <div style={{display: 'flex'}} key={hint}>
            {'Hint: '}
            <Hint title={hint}/>
          </div>
        );
      }) : undefined}
    </div>
  );
};
