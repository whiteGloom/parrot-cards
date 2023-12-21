import React, {FC} from 'react';
import styles from './styles.module.scss';
import {ICard} from '../../../../entity/card';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {Link, useLocation} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectTagsByIds} from '../../../../entity/tag';
import {deleteCard} from '../../../../features/card/deleteCard';

export interface CardProps {
  cardData: ICard;
}

export const Card: FC<CardProps> = (props) => {
  const dispatch = useAppDispatch();
  const tags = useSelector(selectTagsByIds(props.cardData.tagsIds));
  const location = useLocation();

  return (
    <div className={styles.card}>
      <div className={styles.info}>
        <p>{props.cardData.frontSide.title}</p>
        <hr/>
        <p>{props.cardData.backSide.title}</p>
      </div>
      <ul>
        {tags.map(tag => <li key={tag.id}>{tag.title}</li>)}
      </ul>
      <div className={styles.controls}>
        <Link to={`/revise/${props.cardData.id}${location.search}`}>Revise</Link>
        <Link to={`/edit-card/${props.cardData.id}`}>Edit</Link>
        <button
          onClick={() => {
            dispatch(deleteCard({cardId: props.cardData.id})).catch(null);
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};
