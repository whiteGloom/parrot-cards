import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { Button, ButtonTheme } from '../widgets/button';
import { CardPreview } from '../widgets/cards/card-preview.tsx';
import { useCardsStore } from '../stores/cardsStore.ts';

export const Route = createFileRoute('/home')({
  component: Home,
});

function Home() {
  const navigate = useNavigate();
  const cardsStore = useCardsStore();

  return (
    <div className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300">
      <div className="flex flex-col gap-4 min-w-3xl">
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <h1 className="text-2xl text-purple-800">Parrot Cards</h1>
          <div className="flex gap-2">
            <Button>
              Create new cards
            </Button>
            <Button
              onClick={() => {
                navigate({ to: '/' }).catch(null);
              }}
              theme={ButtonTheme.secondary}
            >
              Import more cards
            </Button>
          </div>
        </div>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <h2 className="text-xl text-purple-800">Loaded cards:</h2>
          {cardsStore.cardsIds.map(cardId => (
            <CardPreview card={cardsStore.cards[cardId]} key={cardId} />
          ))}
          {cardsStore.cardsIds.length === 0 && (
            <p className="text-gray-600">No cards loaded</p>
          )}
        </div>
      </div>
    </div>
  );
}
