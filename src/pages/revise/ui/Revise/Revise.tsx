import React, {FC} from 'react';
import styles from './styles.module.scss';
import {Link, useLocation, useParams, useSearchParams} from 'react-router-dom';
import {Card} from '../Card/Card';
import {useSelector} from 'react-redux';
import {selectCardsIdsByFilters} from '../../model/selectors/selectCardsIdsByFilters';

export const Revise: FC = () => {
  const [searchParams] = useSearchParams();

  const cardsIds = useSelector(selectCardsIdsByFilters({tagsIds: searchParams.get('tags')?.split(',').filter(t => t.length) || []}));
  const location = useLocation();

  const cardId = useParams().cardId;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <Link to={'/'}>⬅️</Link>
        <h1>Edit card</h1>
      </header>

      {cardId ? (
        <Card cardId={cardId} key={cardId}/>
      ) : 'Card not found'}

      <Link to={`/revise/${cardsIds[Math.round(Math.random() * (cardsIds.length - 1))]}${location.search}`}>Next Card</Link>
    </div>
  );
};
