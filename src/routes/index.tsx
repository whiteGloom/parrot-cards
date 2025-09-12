import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, ButtonTheme } from '../widgets/buttons';
import { CardPreview } from '../widgets/cards/card-preview.tsx';
import { CardsStoreContext, useCardsStore } from '../stores/cards-store.ts';
import {
  Brain, BrainCircuit,
  Plus, Square,
  SquareCheck,
  Trash,
  X,
} from 'lucide-react';
import { TagsStoreContext, useTagsStore } from '../stores/tags-store.ts';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { TagPreview } from '../widgets/tags/selectable-tag.tsx';
import { ExportDropdown } from '../widgets/dropdowns/export.tsx';
import { useExplicitRevisesStore } from '../stores/explicit-revises.ts';
import { PageContentWrapper } from '../widgets/wrappers/page-content-wrapper.tsx';
import { AddTagToCardsDropdown } from '../widgets/dropdowns/add-tag-to-cards.tsx';
import { RemoveTagFromCardsDropdown } from '../widgets/dropdowns/remove-tag-from-cards.tsx';
import { Dropdown } from '../widgets/dropdowns';
import { InputWrapped } from '../widgets/input/input-wrapped.tsx';
import { ImportDataDropdown } from '../widgets/dropdowns/import.tsx';
import { inlineFor } from '../utils/inline-for.ts';

export const Route = createFileRoute('/')({
  component: Index,
});

function Index() {
  const navigate = useNavigate();
  const cardsStore = useContext(CardsStoreContext);
  const tagsStore = useContext(TagsStoreContext);
  const cardsStoreState = useCardsStore();
  const tagsStoreState = useTagsStore();
  const explicitRevisesStoreState = useExplicitRevisesStore();
  const [newTagTitle, setNewTagTitle] = useState('');

  const [tempSelectedTags, setTempSelectedTags] = useState<Set<string>>(new Set<string>());
  const [selectedTags, setSelectedTags] = useState<Set<string>>(new Set<string>());

  const [selectedCards, setSelectedCards] = useState<Set<string>>(new Set<string>());
  const [isDeletingSelectedCards, setIsDeletingSelectedCards] = useState(false);
  const oldSelectedCards = useRef<Set<string>>(selectedCards);

  if (oldSelectedCards.current !== selectedCards) {
    if (isDeletingSelectedCards) {
      setIsDeletingSelectedCards(false);
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

  const [showAllCards, setShowAllCards] = useState(false);

  const cardsCountToRender = showAllCards ? filteredCardsIds.length : Math.min(filteredCardsIds.length, 20);

  return (
    <PageContentWrapper>
      <>
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
            <ImportDataDropdown />
            <ExportDropdown />
          </div>
        </div>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <div className="flex justify-between items-center gap-2">
            <h2 className="text-xl text-purple-800">
              {'Loaded tags: '}
              {tagsStoreState.tagsIds.length}
            </h2>
            <Dropdown
              contentWrapperClassName="right-0"
              buildContent={(props) => {
                return (
                  <div className="flex flex-col gap-2 p-2 shadow-xl/30 bg-white rounded border border-gray-200 max-h-60 overflow-y-auto">
                    <InputWrapped
                      label="New tag"
                      name="newTagTitle"
                      isRequired={true}
                      value={newTagTitle}
                      autofocus={true}
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

                        tagsStoreState.maybeCreateTag({
                          title: tagTitle,
                        });

                        props.close();
                      }}
                    >
                      Create new tag
                    </Button>
                  </div>
                );
              }}
              buildButton={(props) => {
                return <Button onClick={props.toggleOpened}><Plus /></Button>;
              }}
            />
          </div>
          <div className="flex flex-col gap-2 overflow-y-auto max-h-60">
            {tagsStoreState.tagsIds.map(tagId => (
              <TagPreview
                tagId={tagId}
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
          <h2 className="text-xl text-purple-800">
            {'Result: '}
            {filteredCardsIds.length}
            {' cards'}
            {filteredCardsIds.length > cardsCountToRender ? ` (${cardsCountToRender} shown)` : ''}
          </h2>
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
              <Button
                theme={ButtonTheme.primary}
                onClick={() => {
                  navigate({
                    to: '/revise',
                    search: {
                      tags: Array.from(selectedTags),
                    },
                  }).catch(null);
                }}
                hint="Revise found cards"
              >
                <>
                  <Brain />
                  <span className="ml-1 hidden md:flex">Revise</span>
                </>
              </Button>
              {!!selectedCards.size && (
                <>
                  <Button
                    theme={ButtonTheme.primary}
                    onClick={() => {
                      const cardsToRevise = Array.from(selectedCards);
                      const existingReviseId = explicitRevisesStoreState.findExistingRevise(cardsToRevise);

                      const reviseId = existingReviseId || explicitRevisesStoreState.addRevise(cardsToRevise);

                      navigate({
                        to: '/revise',
                        search: {
                          explicitReviseId: reviseId,
                        },
                      }).catch(null);
                    }}
                    hint="Revise selected (selection is not stored between sessions)"
                  >
                    <>
                      <BrainCircuit />
                      <span className="ml-1 hidden md:flex">Revise selected</span>
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
                  />
                  <AddTagToCardsDropdown
                    cardsIds={selectedCards}
                  />
                </>
              )}
              {filteredCardsIds.length > 20 && (
                <Button
                  onClick={() => {
                    setShowAllCards(!showAllCards);
                  }}
                  hint={showAllCards ? 'Show less cards' : 'Show hidden cards'}
                >
                  {showAllCards ? 'Show less' : 'Show all'}
                </Button>
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
          {inlineFor(cardsCountToRender, (index) => {
            const cardId = filteredCardsIds[index];

            return (
              <CardPreview
                cardId={cardId}
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
            );
          })}
          {!filteredCardsIds.length && (
            <p className="text-gray-600">No cards loaded</p>
          )}
          {!showAllCards && filteredCardsIds.length > 20 && (
            <>
              <p className="text-gray-600">Some cards were hidden</p>
              <Button onClick={() => setShowAllCards(true)}>Show all</Button>
            </>
          )}
        </div>
      </>
    </PageContentWrapper>
  );
}
