import React, {FC} from 'react';
import styles from './styles.module.scss';
import {ICard} from '../../../../entity/card';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {removeOne} from '../../../../entity/card';
import {Link, useNavigate} from 'react-router-dom';

export interface CardProps {
  cardData: ICard;
}

export const Card: FC<CardProps> = (props) => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <p>{props.cardData.frontSide.title}</p>
        <hr/>
        <p>{props.cardData.backSide.title}</p>
      </div>
      <div className={styles.controls}>
        <Link to={`/edit-card/${props.cardData.id}`}>Edit</Link>
        <button
          onClick={() => {
            dispatch(removeOne(props.cardData.id));
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
