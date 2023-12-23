import React, {FC} from 'react';
import styles from './styles.module.scss';
import {useSelector} from 'react-redux';
import {selectCardById} from '../../../../entity/card';
import {Hint} from '../Hint/Hint';

export type CardPropsType = {
  cardId: string;
}

export const Card: FC<CardPropsType> = (props) => {
  const cardData = useSelector(selectCardById(props.cardId));

  const [isFrontSideVisible, setFrontSideVisible] = React.useState(true);

  if (!cardData) {
    return <div>No card with id {props.cardId}</div>;
  }

  const currentSide = isFrontSideVisible ? cardData.frontSide : cardData.backSide;

  return (
    <div className={styles.card} onClick={() => {setFrontSideVisible((value) => !value);}}>
      <p className={styles.sideTitle}>{isFrontSideVisible ? 'FRONT SIDE' : 'BACK SIDE'}</p>
      <p className={styles.title}>{currentSide.title}</p>

      {currentSide.description.length ? (
        <p className={styles.description}>{currentSide.description}</p>
      ) : undefined}

      {currentSide.hints.length ? currentSide.hints.map((hint) => (
        <Hint title={hint} key={hint}/>
      )) : undefined}
    </div>
  );
};
