import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, ButtonTheme } from '../widgets/buttons';
import { CardPreview } from '../widgets/cards/card-preview.tsx';
import { CardsStoreContext, useCardsStore } from '../stores/cardsStore.ts';
import {
  Brain, BrainCircuit,
  Download,
  Plus, Square,
  SquareCheck,
  Trash,
  X,
} from 'lucide-react';
import { TagsStoreContext, useTagsStore } from '../stores/tagsStore.ts';
import { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { type DropdownImperativeControls } from '../widgets/dropdowns';
import { TagPreview } from '../widgets/tags/selectable-tag.tsx';
import { ExportDropdown } from '../widgets/dropdowns/export.tsx';
import { useExplicitRevisesStore } from '../stores/explicitRevises.ts';
import { PageContentWrapper } from '../widgets/wrappers/page-content-wrapper.tsx';
import { AddTagToCardsDropdown } from '../widgets/dropdowns/add-tag-to-cards.tsx';
import { RemoveTagFromCardsDropdown } from '../widgets/dropdowns/remove-tag-from-cards.tsx';

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
            <ExportDropdown />
          </div>
        </div>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <h2 className="text-xl text-purple-800">Loaded tags:</h2>
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
          ))}
          {!filteredCardsIds.length && (
            <p className="text-gray-600">No cards loaded</p>
          )}
        </div>
      </>
    </PageContentWrapper>
  );
}
