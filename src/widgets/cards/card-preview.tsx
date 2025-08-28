import { Edit, Trash, X } from 'lucide-react';
import { Button, ButtonTheme } from '../buttons';
import type { Card } from '../../entities/cards.ts';
import { useTagsStore } from '../../stores/tagsStore.ts';
import { hueColorConfigToColorString } from '../../utils/color.ts';
import { useState } from 'react';
import { useCardsStore } from '../../stores/cardsStore.ts';

export function CardPreview(props: { card: Card, isSelected: boolean, onSelectedChange?: (isSelected: boolean) => void }) {
  const [isDeleting, setIsDeleting] = useState(false);
  const tagsStore = useTagsStore();
  const cardsStore = useCardsStore();

  const { card } = props;

  return (
    <div className="flex items-start border border-gray-200 rounded bg-white shadow p-2 gap-2">
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
          <div className="flex items-center gap-2">
            {!isDeleting && (
              <>
                <Button theme={ButtonTheme.secondary} hint="Edit the card">
                  <Edit />
                </Button>
                <Button
                  theme={ButtonTheme.warning}
                  onClick={() => { setIsDeleting(true); }}
                  hint="Delete the card permanently"
                >
                  <Trash />
                </Button>
              </>
            )}
            {isDeleting && (
              <>
                <p>Are you sure?</p>
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
        </div>
        <p className="flex gap-2">
          {card.tags.map((tagId) => {
            const tag = tagsStore.tags[tagId];

            return (
              <span
                key={tag.id}
                style={{ color: hueColorConfigToColorString(tag.color) }}
              >
                #
                {tag.title}
              </span>
            );
          })}
        </p>
      </div>
    </div>
  );
}
