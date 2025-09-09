import { useTagsStore } from '../../stores/tags-store.ts';
import { hueColorConfigToColorString } from '../../utils/color.ts';
import { Button, ButtonTheme } from '../buttons';
import { Check, Edit, Trash, X } from 'lucide-react';
import { useState } from 'react';

export function TagPreview(props: {
  tagId: string
  isSelected: boolean
  onSelectedChange?: (isSelected: boolean) => void
}) {
  const tagsStore = useTagsStore();
  const tag = tagsStore.tags[props.tagId];

  const [isDeleting, setIsDeleting] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newTitle, setNewTitle] = useState(tag?.title || '');

  if (!tag) {
    return (
      <div className="flex items-center border border-gray-300 shadow rounded p-2 gap-2 text-red-600">
        Tag not found
      </div>
    );
  }

  const isSaveNewTitleAvailable = !!newTitle.trim().length;

  return (
    <div className="group/button flex items-center border border-gray-300 shadow rounded p-2 gap-2">
      <label
        className="flex grow gap-2 cursor-pointer pt-2 pb-2"
        style={{ color: hueColorConfigToColorString(tag.color) }}
      >
        <input
          type="checkbox"
          onChange={() => {
            props.onSelectedChange?.(!props.isSelected);
          }}
          className="cursor-pointer"
          checked={props.isSelected}
        />
        {!isEditing && <span>{tag.title}</span>}
        {isEditing && (
          <input
            onChange={(e) => {
              setNewTitle(e.target.value);
            }}
            autoFocus={true}
            value={newTitle}
            className="border p-1 rounded border-gray-400 shadow bg-white w-0 grow"
          />
        )}
      </label>
      {!isDeleting && !isEditing && (
        <>
          <Button
            theme={ButtonTheme.secondary}
            className="hidden group-hover/button:flex"
            onClick={() => {
              setIsEditing(true);
            }}
            hint="Edit the tag"
          >
            <Edit />
          </Button>
          <Button
            theme={ButtonTheme.warning}
            className="hidden group-hover/button:flex"
            onClick={() => {
              setIsDeleting(true);
            }}
            hint="Delete the tag"
          >
            <Trash />
          </Button>
        </>
      )}
      {isDeleting && (
        <>
          <p className="text-red-600">Delete the tag?</p>
          <Button
            theme={ButtonTheme.warning}
            onClick={() => {
              tagsStore.removeTags([tag.id]);
            }}
            hint="Confirm deleting"
          >
            <Trash />
          </Button>
          <Button
            theme={ButtonTheme.primary}
            onClick={() => {
              setIsDeleting(false);
            }}
            hint="Cancel deleting"
          >
            <X />
          </Button>
        </>
      )}
      {isEditing && (
        <>
          <Button
            theme={ButtonTheme.primary}
            onClick={() => {
              const trimmedTitle = newTitle.trim();

              tagsStore.updateTag(tag.id, {
                title: trimmedTitle,
              });

              setNewTitle(trimmedTitle);
              setIsEditing(false);
            }}
            disabled={!isSaveNewTitleAvailable}
            hint="Save changes"
          >
            <Check />
          </Button>
          <Button
            theme={ButtonTheme.secondary}
            onClick={() => {
              setNewTitle(tag.title);
              setIsEditing(false);
            }}
            hint="Discard changes"
          >
            <X />
          </Button>
        </>
      )}
    </div>
  );
}
