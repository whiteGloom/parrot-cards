import React, {FC, useState} from 'react';
import {ICard} from '../../../../entity/card';
import {useSelectTagsByIds} from '../../../../entity/tag';
import {useDeleteCardThunk} from '../../../../features/card/deleteCard';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {LinkButton} from '../../../../shared/ui/links/LinkButton/LinkButton';
import {PencilLine, Trash2, X} from 'lucide-react';
import {createEditCardPagePath} from '../../../../shared/routes/editCard';
import {createRevisePagePath} from '../../../../shared/routes/revise';
import {useUnlinkCardAndTagThunk} from '../../../../features/tag/unlinkCardAndTag';

export interface CardProps {
  cardData: ICard;
  filters?: {
    tags?: string[];
  };
}

export const CardListItem: FC<CardProps> = (props) => {
  const tags = useSelectTagsByIds(props.cardData.tagsIds);

  const deleteCard = useDeleteCardThunk();
  const dispatchUnlinkTag = useUnlinkCardAndTagThunk();

  const [isDeleteConfirmation, setDeleteConfirmation] = useState(false);

  return (
    <div className={'bg-white rounded p-3 flex shadow flex-col gap-3'}>
      <div className={'flex gap-3 flex-col md:flex-row md:justify-between'}>
        <div className={'flex flex-col gap-1'}>
          <p className={'font-semibold'}>{props.cardData.frontSide.title}</p>

          <div className={'w-full border-t-2 border-dashed border-[#e5e7eb]'}/>

          <p className={'font-semibold'}>{props.cardData.backSide.title}</p>
        </div>

        {!isDeleteConfirmation && <div className={'flex gap-2 items-center flex-wrap'}>
          <LinkButton
            to={createRevisePagePath({
              cardId: props.cardData.id,
              ...(props.filters?.tags && {tags: props.filters?.tags?.join(',')}),
            })}
          >Revise</LinkButton>

          <LinkButton
            to={createEditCardPagePath({cardId: props.cardData.id})}
          ><PencilLine/></LinkButton>

          <ButtonDefault
            theme={ButtonDefaultTypes.Warning}
            onClick={() => {
              setDeleteConfirmation(true);
            }}
          ><Trash2/></ButtonDefault>
        </div>}

        {isDeleteConfirmation && <div className={'flex gap-2 items-center flex-wrap'}>
          <p>Are you sure?</p>

          <ButtonDefault
            theme={ButtonDefaultTypes.Warning}
            onClick={() => {
              deleteCard({cardId: props.cardData.id}).catch(null);
            }}
          ><Trash2/></ButtonDefault>

          <ButtonDefault
            theme={ButtonDefaultTypes.Accent}
            onClick={() => {
              setDeleteConfirmation(false);
            }}
          ><X/></ButtonDefault>
        </div>}
      </div>

      <ul className={'flex gap-x-3 gap-y-0.5 flex-wrap'}>
        {tags.map(tag => {
          return (
            <li key={tag.id} style={{color: tag.color}}>
              <button
                className={'hover:line-through'}
                onClick={() => {
                  dispatchUnlinkTag({
                    cardId: props.cardData.id,
                    tagId: tag.id,
                  }).catch(null);
                }}
              >#{tag.title}</button>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
