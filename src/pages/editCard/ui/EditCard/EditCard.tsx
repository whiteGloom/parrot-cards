import React, {FC} from 'react';
import styles from './styles.module.scss';
import {Link, useLoaderData} from 'react-router-dom';
import {CardForm, updateOne} from '../../../../entity/card';
import {selectCardById} from '../../../../entity/card/model/slices/cardsSlice';
import {useSelector} from 'react-redux';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';

export const EditCard: FC = () => {
  // @ts-expect-error error
  const data: {cardId: string} = useLoaderData();
  const cardData = useSelector(selectCardById(data.cardId));
  const dispatch = useAppDispatch();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to={'/'}>⬅️</Link>
        <h1>Edit card</h1>
      </header>

      {!cardData ? (
        <div>Invalid card data</div>
      ) : (
        <CardForm
          submitTitle={'Save changes'}
          initialValues={{
            frontSide: cardData.frontSide,
            backSide: cardData.backSide,
          }}
          onSubmit={(values) => {
            dispatch(updateOne({id: cardData.id, changes: values}));
          }}
        />
      )}
    </div>
  );
};
