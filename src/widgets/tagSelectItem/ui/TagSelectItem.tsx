import React, {FC, useState} from 'react';
import {useSelectTagById, useSetTagTitle} from '../../../entity/tag';
import {Field} from 'formik';
import {ButtonDefault, ButtonDefaultTypes} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {Edit, Save, Trash2, XCircle} from 'lucide-react';
import {useDeleteTag} from '../../../features/tag/deleteTag';

export type TagSelectItemPropsType = {
  tagId: string;
  name: string;
};

export const TagSelectItem: FC<TagSelectItemPropsType> = (props) => {
  const tag = useSelectTagById(props.tagId);

  const deleteTag = useDeleteTag();
  const setTagTitle = useSetTagTitle();

  const [isDeleteConfirmation, setDeleteConfirmation] = useState(false);
  const [isEditMode, setEditMode] = useState(false);
  const [editValue, setEditValue] = useState(tag?.title || '');

  if (!tag) {
    return <div className={'flex p-2 border shadow rounded'}>Tag with id: {props.tagId} does not exist!</div>;
  }

  return (
    <div className={'group/tagSelect flex flex-row border rounded items-center py-2 px-3 gap-2 min-h-[3.5rem]'}>
      {!isEditMode && (
        <label className={'flex gap-2 flex-grow cursor-pointer'} style={{color: tag.color}}>
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
                if (editValue !== tag.title) setTagTitle({tagId: tag.id, newTitle: editValue});
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
        ><XCircle/></ButtonDefault>

        <ButtonDefault
          theme={ButtonDefaultTypes.Accent}
          onClick={() => {
            setEditMode(false);
            if (editValue !== tag.title) setTagTitle({tagId: tag.id, newTitle: editValue});
          }}
        ><Save/></ButtonDefault>
      </div>}

      {isDeleteConfirmation && <div className={'flex gap-2 items-center'}>
        <p>Are you sure?</p>

        <ButtonDefault
          theme={ButtonDefaultTypes.Warning}
          onClick={() => {
            deleteTag({tagId: props.tagId}).catch(null);
          }}
        ><Trash2/></ButtonDefault>

        <ButtonDefault
          theme={ButtonDefaultTypes.Accent}
          onClick={() => {
            setDeleteConfirmation(false);
          }}
        ><XCircle/></ButtonDefault>
      </div>}

      {!isDeleteConfirmation && !isEditMode && <div className={'flex supports-hover:hidden gap-2 items-center group-hover/tagSelect:flex'}>
        <ButtonDefault onClick={() => {
          setEditMode(true);
        }}><Edit/></ButtonDefault>

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
