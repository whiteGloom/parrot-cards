import React, {FC, useState} from 'react';
import {useSelectTagById} from '../../../entity/tag';
import {Field} from 'formik';
import {ButtonDefault, ButtonDefaultTypes} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {X, Check, PencilLine, Trash2} from 'lucide-react';
import {useDeleteTag} from '../../../features/tag/deleteTag';
import {useRenameTag} from '../../../features/tag/renameTag';

export type TagSelectItemPropsType = {
  tagId: string;
  name: string;
};

export const TagSelectItem: FC<TagSelectItemPropsType> = (props) => {
  const tag = useSelectTagById(props.tagId);

  const dispatchDeleteTag = useDeleteTag();
  const dispatchRenameTag = useRenameTag();

  const [isDeleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(tag?.title || '');

  if (!tag) {
    return <div className={'flex p-2 border shadow rounded'}>Tag with id: {props.tagId} does not exist!</div>;
  }

  return (
    <div className={'group/tagSelect flex flex-col md:flex-row md:items-center border rounded py-1 px-2 gap-2 min-h-[3rem]'}>
      {!isEditMode && (
        <label className={'flex gap-2 flex-grow cursor-pointer items-center font-semibold p-1'} style={{color: tag.color}}>
          <Field type={'checkbox'} name={props.name} value={props.tagId} className={'cursor-pointer'}/>
          {tag.title}
        </label>
      )}

      {isEditMode && (
        <div className={'flex gap-2 flex-grow'}>
          <Field type={'checkbox'} name={props.name} value={props.tagId} className={'cursor-pointer'}/>

          <input
            className={'py-1 px-2 shadow-inner border rounded flex-grow min-w-0'}
            size={1}
            autoFocus
            value={editValue}
            placeholder={'Enter new title for the tag'}
            onChange={(event) => {
              setEditValue(event.target.value);
            }}
            onKeyDown={(event) => {
              if (event.key === 'Enter') {
                event.preventDefault();
                setEditMode(false);
                if (editValue !== tag.title) dispatchRenameTag({tagId: tag.id, newTitle: editValue});
              }

              if (event.key === 'Escape') {
                event.preventDefault();
                setEditMode(false);
                setEditValue(tag.title);
              }
            }}
          />
        </div>
      )}

      {isEditMode && <div className={'flex gap-2 items-center'}>
        <ButtonDefault
          onClick={() => {
            setEditMode(false);
            setEditValue(tag.title);
          }}
        ><X/></ButtonDefault>

        <ButtonDefault
          theme={ButtonDefaultTypes.Accent}
          onClick={() => {
            setEditMode(false);
            if (editValue !== tag.title) dispatchRenameTag({tagId: tag.id, newTitle: editValue});
          }}
        ><Check/></ButtonDefault>
      </div>}

      {isDeleteConfirmation && <div className={'flex gap-2 items-center'}>
        <p>Are you sure?</p>

        <ButtonDefault
          theme={ButtonDefaultTypes.Warning}
          onClick={() => {
            dispatchDeleteTag({tagId: props.tagId}).catch(null);
          }}
        ><Trash2/></ButtonDefault>

        <ButtonDefault
          theme={ButtonDefaultTypes.Accent}
          onClick={() => {
            setDeleteConfirmation(false);
          }}
        ><X/></ButtonDefault>
      </div>}

      {!isDeleteConfirmation && !isEditMode && <div className={'flex md:only-fine:hidden gap-2 items-center group-hover/tagSelect:flex'}>
        <ButtonDefault onClick={() => {
          setEditMode(true);
        }}><PencilLine/></ButtonDefault>

        <ButtonDefault
          theme={ButtonDefaultTypes.Warning}
          onClick={() => {
            setDeleteConfirmation(true);
          }}
        ><Trash2/></ButtonDefault>
      </div>}
    </div>
  );
};
