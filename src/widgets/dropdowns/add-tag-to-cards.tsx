import { type RefObject, useMemo, useRef, useState } from 'react';
import { Dropdown, type DropdownImperativeControls } from './index.tsx';
import { Button, ButtonTheme } from '../buttons';
import { TagIcon } from 'lucide-react';
import { useCardsStore } from '../../stores/cards-store.ts';
import { useTagsStore } from '../../stores/tags-store.ts';
import { InputWrapped } from '../input/input-wrapped.tsx';

export function AddTagToCardsDropdown(props: {
  cardsIds: Set<string>
  refToSet?: RefObject<DropdownImperativeControls | null>
}) {
  return (
    <Dropdown
      ref={props.refToSet}
      buildButton={buttonProps => (
        <Button theme={ButtonTheme.secondary} onClick={buttonProps.toggleOpened}>
          <>
            <TagIcon />
            <span className="ml-1 hidden md:flex">Add tag</span>
          </>
        </Button>
      )}
      buildContent={(contentProps) => {
        return (
          <AddTagToCardsDropdownContent cardsIds={props.cardsIds} closeDropdown={contentProps.close} />
        );
      }}
    />
  );
}

function AddTagToCardsDropdownContent(props: {
  closeDropdown: () => void
  cardsIds: Set<string>
}) {
  const { cardsIds } = props;
  const oldCardsIds = useRef(cardsIds);

  const [newTagTitle, setNewTagTitle] = useState('');

  const cardsStoreState = useCardsStore();
  const tagsStoreState = useTagsStore();

  const missingTagsOfCards = useMemo(() => {
    const cardsCount = cardsIds.size;
    const tagsToAdd = new Set<string>();
    const seenTags = new Map<string, number>();

    for (const cardId of cardsIds) {
      const card = cardsStoreState.cards[cardId];
      for (const tagId of card.tags) {
        seenTags.set(tagId, (seenTags.get(tagId) || 0) + 1);
      }
    }

    for (const tagId of tagsStoreState.tagsIds) {
      if (seenTags.get(tagId) !== cardsCount) {
        tagsToAdd.add(tagId);
      }
    }

    return Array.from(tagsToAdd);
  }, [cardsIds, cardsStoreState.cards, tagsStoreState.tagsIds]);

  function onTagSelected(tagId: string) {
    props.closeDropdown();

    props.cardsIds.forEach((cardId) => {
      const card = cardsStoreState.cards[cardId];

      if (card.tags.includes(tagId)) {
        return;
      }

      cardsStoreState.updateCard(cardId, {
        tags: [...cardsStoreState.cards[cardId].tags, tagId],
      });
    });
  }

  if (oldCardsIds.current !== cardsIds) {
    props.closeDropdown();
  }

  return (
    <div className="flex flex-col gap-2 p-2 shadow-xl/30 bg-white rounded border border-gray-200 max-h-60 overflow-y-auto">
      {missingTagsOfCards.map((tagId) => {
        const tag = tagsStoreState.tags[tagId];
        return (
          <Button
            theme={ButtonTheme.secondary}
            key={tag.id}
            onClick={() => {
              onTagSelected(tagId);
            }}
          >
            {tag.title}
          </Button>
        );
      })}
      <InputWrapped
        label="New tag"
        name="newTagTitle"
        isRequired={true}
        value={newTagTitle}
        onChange={(value) => {
          setNewTagTitle(value.target.value);
        }}
      />
      <Button
        theme={ButtonTheme.primary}
        disabled={!newTagTitle.trim()}
        onClick={() => {
          const tagTitle = newTagTitle.trim();

          if (!tagTitle) {
            return;
          }

          setNewTagTitle('');

          const tag = tagsStoreState.maybeCreateTag({
            title: tagTitle,
          });

          onTagSelected(tag.id);
        }}
      >
        Create new tag
      </Button>
    </div>
  );
}
