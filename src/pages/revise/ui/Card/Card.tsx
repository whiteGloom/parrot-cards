import React, {FC} from 'react';
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
    <article className={'flex flex-col gap-3 p-3 items-center bg-white border rounded shadow min-w-full md:min-w-[500px]'}>
      <div
        className={'flex flex-col gap-3 items-center w-full'}
        onClick={() => {setFrontSideVisible((value) => !value);}}
      >
        <p className={'text-gray-800 uppercase'}>{isFrontSideVisible ? 'Front side' : 'Back side'}</p>
        <p className={'text-3xl cursor-pointer'}>{currentSide.title}</p>

        {currentSide.description.length ? (
          <p>{currentSide.description}</p>
        ) : undefined}
      </div>

      <ul className={'flex flex-col gap-2 w-full'}>
        {currentSide.hints.length ? currentSide.hints.map((hint) => (
          <li key={hint}>
            <Hint title={hint}/>
          </li>
        )) : undefined}
      </ul>
    </article>
  );
};
