import React, {FC} from 'react';
import styles from './styles.module.scss';
import {ICard} from '../../../../entity/card';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {Link} from 'react-router-dom';
import {removeCard} from '../../../../features/removeCard';

export interface CardProps {
  cardData: ICard;
}

export const CardItem: FC<CardProps> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.card}>
      <div className={styles.cardInfo}>
        <p>{props.cardData.frontSide.title}</p>
        <hr/>
        <p>{props.cardData.backSide.title}</p>
      </div>
      <div className={styles.cardControls}>
        <Link to={`/edit-card/${props.cardData.id}`}>Edit</Link>
        <button
          onClick={() => {
            dispatch(removeCard(props.cardData.id));
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
