import React, {FC} from 'react';
import styles from './styles.module.scss';
import {ICard} from '../../../../entity/card';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {Link} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {selectTagsByIds} from '../../../../entity/tag/model/selectors/selectTagsById';
import {deleteCard} from '../../../card/deleteCard';

export interface CardProps {
  cardData: ICard;
}

export const Card: FC<CardProps> = (props) => {
  const dispatch = useAppDispatch();
  const tags = useSelector(selectTagsByIds(props.cardData.tagsIds));

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
