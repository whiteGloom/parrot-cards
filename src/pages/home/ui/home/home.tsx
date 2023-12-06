import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';
import {useSelector} from 'react-redux';
import {selectAllCards} from '../../../../entity/card';
import {selectAllCollections} from '../../../../entity/collection';
import {CardItem} from './card';
import {CollectionItem} from './collection';

export const Home: FC = () => {
  const cards = useSelector(selectAllCards());
  const collections = useSelector(selectAllCollections());

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>List</h1>
        <Link to={'/create-cards'}>Create new cards</Link>
        <Link to={'/create-collection'}>Create new collection</Link>
      </header>
      {collections.length || cards.length ? (
        <ul className={styles.list}>
          {collections.map((collection) => (
            <li key={collection.id}>
              <CollectionItem collectionData={collection}/>
            </li>
          ))}
          {cards.map((card) => (
            <li key={card.id}>
              <CardItem cardData={card}/>
            </li>
          ))}
        </ul>
      ) : (
        <p>No cards available yet</p>
      )}
    </div>
  );
};
