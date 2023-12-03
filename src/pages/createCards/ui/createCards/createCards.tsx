import React, {FC} from 'react';
import {addOne, CardForm} from '../../../../entity/card';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {UniqueIdGenerator} from '../../../../shared/lib/generateUniqueId/generateUniqueId';

export const CreateCards: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to={'/'}>⬅️</Link>
        <h1>Create Cards</h1>
      </header>

      <CardForm
        submitTitle={'Create card'}
        resetOnSubmit={true}
        onSubmit={(values) => {
          dispatch(addOne({
            id: UniqueIdGenerator.generateSimpleUniqueId(),
            createdAt: Date.now(),
            frontSide: values.frontSide,
            backSide: values.backSide,
          }));
        }}
      />
    </div>
  );
};
