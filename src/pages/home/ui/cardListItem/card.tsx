import React, {FC} from 'react';
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
    <div className={'bg-white rounded p-3 flex shadow flex-col gap-1'}>
      <div className={'flex justify-between'}>
        <div className={'flex flex-col gap-1'}>
          <p className={'font-semibold'}>{props.cardData.frontSide.title}</p>

          <div className={'w-full border-t-2 border-dashed border-[#e5e7eb]'}/>

          <p className={'font-semibold'}>{props.cardData.backSide.title}</p>
        </div>

        <div className={'flex gap-3 items-center'}>
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

      <ul className={'flex gap-3'}>
        {tags.map(tag => {
          return (
            <li
              key={tag.id}
              style={{color: tag.color}}
            >
              {'#' + tag.title}
            </li>
          );
        })}
      </ul>
    </div>
  );
};
