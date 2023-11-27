import React, {FC} from 'react';
import {CardsList} from '../../../../features/listCards';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';

export const Home: FC = () => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Cards List</h1>
        <Link to={'/create-cards'}>Create new cards</Link>
      </header>
      <CardsList/>
    </div>
  );
};
