import type { Card } from '../../stores/cardsStore.ts';
import { Edit, Trash } from 'lucide-react';
import { Button, ButtonTheme } from '../button';

export function CardPreview(props: { card: Card }) {
  const { card } = props;
  return (
    <div className="flex flex-col gap-2">
      <div className="flex">
        <div className="flex flex-col gap-2">
          <p>{card.targetLanguageSide.title}</p>
          <hr className="border-gray-200" />
          <p>{card.knownLanguageSide.title}</p>
        </div>
        <div className="grow" />
        <div className="flex items-start gap-2">
          <Button theme={ButtonTheme.secondary} hint="Edit the card">
            <Edit />
          </Button>
          <Button theme={ButtonTheme.warning} hint="Delete the card permanently">
            <Trash />
          </Button>
        </div>
      </div>
      <p>{card.tags.map(tag => `#${tag}`).join('')}</p>
    </div>
  );
}
