import React, {FC} from 'react';
import {CreateCardForm} from '../../../../features/createCard';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';

export const CreateCards: FC = () => {
  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to={'/'}>⬅️</Link>
        <h1>Create Cards</h1>
      </header>
      <CreateCardForm/>
    </div>
  );
};
