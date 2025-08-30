import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, ButtonTheme } from '../widgets/buttons';
import { CardPreview } from '../widgets/cards/card-preview.tsx';
import { CardsStoreContext, useCardsStore } from '../stores/cardsStore.ts';
import {
  Brain,
  Download,
  Eraser,
  Plus, Square,
  SquareCheck,
  TagIcon,
  Trash,
  Upload,
  X,
} from 'lucide-react';
import { TagsStoreContext, useTagsStore } from '../stores/tagsStore.ts';
import type { Tag } from '../entities/tags.ts';
import { hueColorConfigToColorString } from '../utils/color.ts';
import { type RefObject, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Dropdown, type DropdownImperativeControls } from '../widgets/dropdowns';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const cardsStore = useContext(CardsStoreContext);
  const tagsStore = useContext(TagsStoreContext);
  const cardsStoreState = useCardsStore();
  const tagsStoreState = useTagsStore();

  const removeTagsDropdownRef = useRef<DropdownImperativeControls | null>(null);

  const [tempSelectedTags, setTempSelectedTags] = useState<Set<string>>(new Set<string>());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set<string>());

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set<string>());
  const [isDeletingSelectedCards, setIsDeletingSelectedCards] = useState(false);
  const oldSelectedCards = useRef<Set<string>>(selectedCards);

  if (oldSelectedCards.current !== selectedCards) {
    if (isDeletingSelectedCards) {
      setIsDeletingSelectedCards(false);
    }

    if (removeTagsDropdownRef.current?.isOpened) {
      removeTagsDropdownRef.current.setIsOpened(false);
    }

    oldSelectedCards.current = selectedCards;
  }

  const filteredCardsIds = useMemo(() => {
    if (!selectedTags.size) {
      return cardsStoreState.cardsIds;
    }

    return cardsStoreState.cardsIds.filter((cardId) => {
      const card = cardsStoreState.cards[cardId];

      return card.tags.some(tagInCard => selectedTags.has(tagInCard));
    });
  }, [selectedTags, cardsStoreState.cardsIds, cardsStoreState.cards]);

  useEffect(() => {
    cardsStore?.subscribe((state, prevState) => {
      if (state.cardsIds !== prevState.cardsIds) {
        setSelectedCards(new Set(Array.from(selectedCards).filter(cardId => state.cardsIds.includes(cardId))));
      }
    });

    tagsStore?.subscribe((state, prevState) => {
      if (state.tagsIds !== prevState.tagsIds) {
        setSelectedTags(new Set(Array.from(selectedTags).filter(tagId => state.tagsIds.includes(tagId))));
      }
    });
  }, [cardsStore, selectedCards, selectedTags, tagsStore]);

  return (
    <div
      className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300 p-3"
    >
      <div className="flex flex-col gap-4 md:min-w-3xl min-w-full">
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <h1 className="text-2xl text-purple-800">Parrot Cards</h1>
          <div className="flex gap-2">
            <Button
              hint="Create new cards"
              onClick={() => {
                navigate({ to: '/create-new-cards' }).catch(null);
              }}
            >
              <Plus />
              <span className="ml-1 hidden md:flex">Create new cards</span>
            </Button>
            <div className="grow" />
            <Button
              onClick={() => {
                navigate({ to: '/import' }).catch(null);
              }}
              hint="Import cards"
              theme={ButtonTheme.secondary}
            >
              <>
                <Download />
                <span className="ml-1 hidden md:flex">Import</span>
              </>
            </Button>
            <Button
              onClick={() => {
                navigate({ to: '/' }).catch(null);
              }}
              hint="Export cards"
              theme={ButtonTheme.primary}
            >
              <>
                <Upload />
                <span className="ml-1 hidden md:flex">Export</span>
              </>
            </Button>
          </div>
        </div>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <h2 className="text-xl text-purple-800">Loaded tags:</h2>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-60">
            {tagsStoreState.tagsIds.map(tagId => (
              <TagPreview
                tag={tagsStoreState.tags[tagId]}
                key={tagId}
                isSelected={tempSelectedTags.has(tagId)}
                onSelectedChange={(isSelected) => {
                  if (isSelected) {
                    setTempSelectedTags(new Set([...tempSelectedTags, tagId]));
                  }
                  else {
                    const newValues = [];
                    for (const otherTagId of tempSelectedTags) {
                      if (otherTagId !== tagId) {
                        newValues.push(otherTagId);
                      }
                    }
                    setTempSelectedTags(new Set(newValues));
                  }
                }}
              />
            ))}
            {!tagsStoreState.tagsIds.length && (
              <p className="text-gray-600">No tags loaded</p>
            )}
          </div>
          <Button onClick={() => {
            setSelectedCards(new Set());
            setSelectedTags(new Set(tempSelectedTags));
          }}
          >
            Apply filter
          </Button>
        </div>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <h2 className="text-xl text-purple-800">Result:</h2>
          {!isDeletingSelectedCards && !!filteredCardsIds.length && (
            <div className="flex items-center gap-2">
              <Button
                hint="Select all cards"
                onClick={() => {
                  if (selectedCards.size == filteredCardsIds.length) {
                    setSelectedCards(new Set());
                  }
                  else {
                    setSelectedCards(new Set(cardsStoreState.cardsIds));
                  }
                }}
                theme={ButtonTheme.secondary}
              >
                {selectedCards.size == filteredCardsIds.length ? <SquareCheck /> : <Square />}
              </Button>
              {!!selectedCards.size && (
                <>
                  <Button theme={ButtonTheme.primary}>
                    <>
                      <Brain />
                      <span className="ml-1 hidden md:flex">Revise</span>
                    </>
                  </Button>
                  <Button
                    onClick={() => {
                      setIsDeletingSelectedCards(true);
                    }}
                    theme={ButtonTheme.warning}
                  >
                    <>
                      <Trash />
                      <span className="ml-1 hidden md:flex">Delete</span>
                    </>
                  </Button>
                  <RemoveTagFromCardsDropdown
                    cardsIds={selectedCards}
                    refToSet={removeTagsDropdownRef}
                  />
                  <AddTagToCardsDropdown
                    cardsIds={selectedCards}
                    refToSet={removeTagsDropdownRef}
                  />
                </>
              )}
            </div>
          )}
          {isDeletingSelectedCards && (
            <div className="flex items-center gap-2">
              <Button
                theme={ButtonTheme.primary}
                onClick={() => {
                  setIsDeletingSelectedCards(false);
                }}
              >
                <X />
              </Button>
              <Button
                theme={ButtonTheme.warning}
                onClick={() => {
                  cardsStoreState.removeCards(Array.from(selectedCards));
                }}
              >
                <Trash />
              </Button>
              <p>Delete selected cards?</p>
            </div>
          )}
          {filteredCardsIds.map(cardId => (
            <CardPreview
              card={cardsStoreState.cards[cardId]}
              key={cardId}
              isSelected={selectedCards.has(cardId)}
              onSelectedChange={(isSelected) => {
                if (isSelected) {
                  setSelectedCards(new Set([...selectedCards, cardId]));
                }
                else {
                  const newValues = [];
                  for (const otherCardId of selectedCards) {
                    if (otherCardId !== cardId) {
                      newValues.push(otherCardId);
                    }
                  }
                  setSelectedCards(new Set(newValues));
                }
              }}
            />
          ))}
          {!filteredCardsIds.length && (
            <p className="text-gray-600">No cards loaded</p>
          )}
        </div>
      </div>
    </div>
  );
}

function TagPreview(props: {
  tag: Tag
  isSelected: boolean
  onSelectedChange?: (isSelected: boolean) => void
}) {
  const { tag } = props;

  return (
    <div className="flex border border-gray-300 shadow rounded p-2 gap-2">
      <label
        className="flex gap-2 cursor-pointer"
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
        {tag.title}
      </label>
    </div>
  );
}

function RemoveTagFromCardsDropdown(props: {
  refToSet: RefObject<DropdownImperativeControls | null>
  cardsIds: Set<string>
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

function AddTagToCardsDropdown(props: {
  refToSet: RefObject<DropdownImperativeControls | null>
  cardsIds: Set<string>
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

  return (
    <div className="flex flex-col gap-2 p-2 shadow-xl/30 bg-white rounded border border-gray-200 max-h-60 overflow-y-auto">
      {missingTagsOfCards.map((tagId) => {
        const tag = tagsStoreState.tags[tagId];
        return (
          <Button
            theme={ButtonTheme.secondary}
            key={tag.id}
            onClick={() => {
              props.closeDropdown();

              props.cardsIds.forEach((cardId) => {
                const card = cardsStoreState.cards[cardId];

                if (card.tags.includes(tag.id)) {
                  return;
                }

                cardsStoreState.updateCard(cardId, {
                  tags: [...cardsStoreState.cards[cardId].tags, tag.id],
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
