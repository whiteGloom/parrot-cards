import { Check, Edit, Pencil, Trash, X } from 'lucide-react';
import { Button, ButtonSize, ButtonTheme } from '../buttons';
import { useTagsStore } from '../../stores/tags-store.ts';
import { hueColorConfigToColorString } from '../../utils/color.ts';
import { useState } from 'react';
import { useCardsStore } from '../../stores/cards-store.ts';
import { useNavigate } from '@tanstack/react-router';
import { AddTagToCardsDropdown } from '../dropdowns/add-tag-to-cards.tsx';
import { InputWrapped } from '../input/input-wrapped.tsx';

export function CardPreview(props: { cardId: string, isSelected: boolean, onSelectedChange?: (isSelected: boolean) => void, isEditable?: boolean }) {
  const navigate = useNavigate();

  const [isEditing, setIsEditing] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const tagsStore = useTagsStore();
  const cardsStore = useCardsStore();

  const { cardId, isEditable = true } = props;
  const card = cardsStore.cards[cardId];

  const [newTargetTitle, setNewTargetTitle] = useState(card.targetLanguageSide.title);
  const [newKnownTitle, setNewKnownTitle] = useState(card.knownLanguageSide.title);

  if (isEditing) {
    return (
      <div className="flex items-start  border border-gray-200 rounded bg-white shadow p-2 gap-4 even:bg-violet-50">
        <div className="flex flex-col grow gap-2">
          <InputWrapped
            label="Target language"
            name="targetLanguage"
            value={newTargetTitle}
            onChange={(e) => {
              setNewTargetTitle(e.target.value);
            }}
          />
          <hr className="border-gray-200" />
          <InputWrapped
            label="Known language"
            name="knowLanguage"
            value={newKnownTitle}
            onChange={(e) => {
              setNewKnownTitle(e.target.value);
            }}
          />
        </div>
        <div className="flex self-center gap-2">
          <Button theme={ButtonTheme.warning} onClick={() => setIsEditing(false)}>
            <X />
          </Button>
          <Button
            disabled={!newTargetTitle.trim() || !newKnownTitle.trim()}
            onClick={() => {
              const trimmedTargetTitle = newTargetTitle.trim();
              const trimmedKnownTitle = newKnownTitle.trim();

              if (!trimmedTargetTitle || !trimmedKnownTitle) {
                return;
              }

              cardsStore.updateCard(cardId, {
                targetLanguageSide: {
                  ...card.targetLanguageSide,
                  title: trimmedTargetTitle,
                },
                knownLanguageSide: {
                  ...card.knownLanguageSide,
                  title: trimmedKnownTitle,
                },
              });

              setIsEditing(false);
            }}
          >
            <Check />
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-start border border-gray-200 rounded bg-white shadow p-2 gap-2 even:bg-violet-50">
      <input
        type="checkbox"
        onChange={() => { props.onSelectedChange?.(!props.isSelected); }}
        checked={props.isSelected}
        style={{ cursor: 'pointer' }}
      />
      <div className="flex flex-col grow gap-2">
        <div className="flex gap-2">
          <div className="flex flex-col gap-1">
            <p>{card.targetLanguageSide.title}</p>
            <hr className="border-gray-200" />
            <p>{card.knownLanguageSide.title}</p>
          </div>
          <div className="grow" />
          {isEditable && (
            <div className="flex items-center gap-2">
              {!isDeleting && (
                <>
                  <Button
                    theme={ButtonTheme.secondary}
                    onClick={() => {
                      navigate({ to: '/edit-card/' + card.id }).catch(null);
                    }}
                    hint="Edit the card"
                  >
                    <Edit />
                  </Button>
                  <Button
                    theme={ButtonTheme.secondary}
                    onClick={() => {
                      setNewTargetTitle(card.targetLanguageSide.title);
                      setNewKnownTitle(card.knownLanguageSide.title);

                      setIsEditing(true);
                    }}
                    hint="Fast edit the card"
                  >
                    <Pencil />
                  </Button>
                  <Button
                    theme={ButtonTheme.warning}
                    onClick={() => {
                      setIsDeleting(true);
                    }}
                    hint="Delete the card"
                  >
                    <Trash />
                  </Button>
                </>
              )}
              {isDeleting && (
                <>
                  <p className="text-red-600">Delete the card?</p>
                  <Button
                    theme={ButtonTheme.warning}
                    onClick={() => {
                      cardsStore.removeCards([card.id]);
                    }}
                    hint="Cancel deleting"
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
            </div>
          )}
        </div>
        <div className="flex flex-wrap gap-2 items-center">
          <AddTagToCardsDropdown cardsIds={new Set([card.id])} smallButton={true} />
          {card.tags.map((tagId) => {
            const tag = tagsStore.tags[tagId];

            return (
              <span
                className="group/tag inline-flex items-center gap-1"
                key={tag.id}
                style={{ color: hueColorConfigToColorString(tag.color) }}
              >
                {`#${tag.title}`}
                <Button
                  className="hidden touch:inline-flex group-hover/tag:inline-flex opacity-70"
                  size={ButtonSize.extraSmall}
                  theme={ButtonTheme.transparentWarning}
                  onClick={() => {
                    const result = window.confirm(`Unlink tag "${tag.title}"?`);

                    if (result) {
                      cardsStore.updateCard(cardId, {
                        tags: card.tags.filter(tagId => tagId !== tag.id),
                      });
                    }
                  }}
                  contentBuilder={params => (
                    <Trash
                      size={16}
                      color={params.textColor}
                    />
                  )}
                />
              </span>
            );
          })}
        </div>
      </div>
    </div>
  );
}
