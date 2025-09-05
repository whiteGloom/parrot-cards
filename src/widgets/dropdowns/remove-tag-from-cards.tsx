import { type RefObject, useMemo } from 'react';
import { Dropdown, type DropdownImperativeControls } from './index.tsx';
import { Button, ButtonTheme } from '../buttons';
import { Eraser } from 'lucide-react';
import { useCardsStore } from '../../stores/cardsStore.ts';
import { useTagsStore } from '../../stores/tagsStore.ts';

export function RemoveTagFromCardsDropdown(props: {
  cardsIds: Set<string>
  refToSet?: RefObject<DropdownImperativeControls | null>
}) {
  return (
    <Dropdown
      ref={props.refToSet}
      buildButton={buttonProps => (
        <Button theme={ButtonTheme.secondary} onClick={buttonProps.toggleOpened}>
          <>
            <Eraser />
            <span className="ml-1 hidden md:flex">Remove tag</span>
          </>
        </Button>
      )}
      buildContent={(contentProps) => {
        return (
          <RemoveTagDropdownContent cardsIds={props.cardsIds} closeDropdown={contentProps.close} />
        );
      }}
    />
  );
}

function RemoveTagDropdownContent(props: {
  closeDropdown: () => void
  cardsIds: Set<string>
}) {
  const { cardsIds } = props;
  const cardsStoreState = useCardsStore();
  const tagsStoreState = useTagsStore();

  const tagsOfCards = useMemo(() => {
    const set = new Set<string>();
    for (const cardId of cardsIds) {
      const card = cardsStoreState.cards[cardId];
      for (const tagId of card.tags) {
        set.add(tagId);
      }
    }

    return Array.from(set);
  }, [cardsIds, cardsStoreState.cards]);

  return (
    <div className="flex flex-col gap-2 p-2 shadow-xl/30 bg-white rounded border border-gray-200 max-h-60 overflow-y-auto">
      {tagsOfCards.map((tagId) => {
        const tag = tagsStoreState.tags[tagId];
        return (
          <Button
            theme={ButtonTheme.secondary}
            key={tag.id}
            onClick={() => {
              props.closeDropdown();

              props.cardsIds.forEach((cardId) => {
                cardsStoreState.updateCard(cardId, {
                  tags: cardsStoreState.cards[cardId].tags.filter(tagId => tagId !== tag.id),
                });
              });
            }}
          >
            {tag.title}
          </Button>
        );
      })}
    </div>
  );
}
