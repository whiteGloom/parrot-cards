import { createFileRoute, redirect } from '@tanstack/react-router';
import { useExplicitRevisesStore } from '../stores/explicitRevises.ts';
import { useMemo, useState } from 'react';
import { useCardsStore } from '../stores/cardsStore.ts';
import { Button, ButtonTheme } from '../widgets/buttons';

export type ReviseSearchParams = {
  tags?: string[]
  explicitReviseId?: string
};

export const Route = createFileRoute('/revise')({
  component: Revise,
  /// The validateSearch param is used actually
  validateSearch: (searchParams): ReviseSearchParams => {
    return searchParams as ReviseSearchParams;
  },
  beforeLoad: async ({ context, search }) => {
    if (search.explicitReviseId) {
      if (!context.explicitRevisesStore.getState().revises[search.explicitReviseId]) {
        throw redirect({ to: '/' });
      }
    }
  },
});

function Revise() {
  const explicitRevisesStoreState = useExplicitRevisesStore();
  const cardsStoreState = useCardsStore();

  const searchParams = Route.useSearch();

  const filteredCardsIds = useMemo(() => {
    if (searchParams.explicitReviseId) {
      return explicitRevisesStoreState.revises[searchParams.explicitReviseId];
    }

    if (searchParams.tags?.length) {
      const tagsSet = new Set(searchParams.tags);

      return cardsStoreState.cardsIds.filter((cardId) => {
        const card = cardsStoreState.cards[cardId];

        return card.tags.some(tagInCard => tagsSet.has(tagInCard));
      });
    }

    return cardsStoreState.cardsIds;
  }, [cardsStoreState.cards,
    cardsStoreState.cardsIds,
    explicitRevisesStoreState.revises,
    searchParams.explicitReviseId,
    searchParams.tags,
  ]);

  const [currentCardIndex, setCurrentCardIndex] = useState(-1);
  const [visibleCardSide, setVisibleCardSide] = useState<'target' | 'known'>('target');
  const [isCardFlipped, setIsCardFlipped] = useState(false);
  const [rememberedCards, setRememberedCards] = useState<Set<string>>(new Set());

  if (!filteredCardsIds.length) {
    return (
      <div
        className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300 p-3"
      >
        <div className="flex flex-col gap-4 md:min-w-3xl min-w-full">
          <div
            className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
          >
            <p className="text-center text-2xl">
              No cards found
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (currentCardIndex < 0) {
    return (
      <div
        className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300 p-3"
      >
        <div className="flex flex-col gap-4 md:min-w-3xl min-w-full">
          <div
            className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
          >
            <p className="text-center text-2xl">
              Revise cards
            </p>
            <p className="text-xl">Settings</p>
            <p>Visible card side:</p>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="revise-mode"
                id="revise-mode-1"
                checked={visibleCardSide === 'target'}
                value="target"
                onChange={() => { setVisibleCardSide('target'); }}
              />
              Target language
            </label>
            <label className="flex items-center gap-2">
              <input
                type="radio"
                name="revise-mode"
                id="revise-mode-1"
                checked={visibleCardSide === 'known'}
                value="known"
                onChange={() => { setVisibleCardSide('known'); }}
              />
              Known language
            </label>
            <Button
              onClick={() => {
                setCurrentCardIndex(currentCardIndex + 1);
              }}
            >
              Start
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (currentCardIndex === filteredCardsIds.length) {
    return (
      <div
        className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300 p-3"
      >
        <div className="flex flex-col gap-4 md:min-w-3xl min-w-full">
          <div
            className="flex flex-col bg-gray-50 p-4 gap-2 justify-center border border-gray-200 rounded"
          >
            <p className="text-center text-2xl">
              Remembered cards:
            </p>
            {Array.from(rememberedCards).map(cardId => (
              <p key={cardId}>
                {cardsStoreState.cards[cardId].knownLanguageSide.title}
                {' — '}
                {cardsStoreState.cards[cardId].targetLanguageSide.title}

              </p>
            ))}
            <p className="text-center text-2xl">
              Forgotten cards:
            </p>
            {Array.from(filteredCardsIds.filter(cardId => !rememberedCards.has(cardId))).map(cardId => (
              <p key={cardId}>
                {cardsStoreState.cards[cardId].knownLanguageSide.title}
                {' — '}
                {cardsStoreState.cards[cardId].targetLanguageSide.title}
              </p>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const cardId = filteredCardsIds[currentCardIndex];

  return (
    <div
      className="flex flex-col min-h-full justify-center items-center bg-gradient-to-tr from-purple-300 to-blue-300 p-3"
    >
      <div className="flex flex-col gap-4 md:min-w-3xl min-w-full">
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <Card
            key={cardId}
            cardId={cardId}
            defaultSide={visibleCardSide}
            onFlip={() => {
              setIsCardFlipped(true);
            }}
          />
          {isCardFlipped && (
            <>
              <Button
                onClick={() => {
                  setCurrentCardIndex(currentCardIndex + 1);
                  setRememberedCards(new Set([...rememberedCards, cardId]));
                  setIsCardFlipped(false);
                }}
              >
                I remember it
              </Button>
              <Button
                theme={ButtonTheme.warning}
                onClick={() => {
                  setCurrentCardIndex(currentCardIndex + 1);
                  setIsCardFlipped(false);
                }}
              >
                I do not remember it
              </Button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function Card(props: { cardId: string, defaultSide?: 'target' | 'known', onFlip?: () => void }) {
  const cardsStoreState = useCardsStore();
  const card = cardsStoreState.cards[props.cardId];
  const [isKnownSideVisible, setIsKnownSideVisible] = useState(props.defaultSide === 'known');

  if (!card) {
    return (
      <div>
        Card not found
      </div>
    );
  }

  const currentSide = isKnownSideVisible ? 'known' : 'target';
  const currentSideData = isKnownSideVisible ? card.knownLanguageSide : card.targetLanguageSide;
  const isFlipped = currentSide != props.defaultSide;

  return (
    <div
      onClick={() => {
        if (!isFlipped) {
          setIsKnownSideVisible(!isKnownSideVisible);
          props.onFlip?.();
        }
      }}
      className="flex flex-col gap-2 p-4 border border-gray-200 rounded shadow-md cursor-pointer"
    >
      <p className="text-center text-2xl">{currentSideData.title}</p>
      {currentSideData.description && <p className="text-center">{currentSideData.description}</p>}
      {currentSideData.hints.map(hint => (
        <Hint key={`${hint}-${isFlipped}`} text={hint} isVisibleByDefault={isFlipped} />
      ))}
    </div>
  );
}

function Hint(props: { text: string, isVisibleByDefault: boolean }) {
  const [isHintVisible, setIsHintVisible] = useState(props.isVisibleByDefault);

  return (
    <span
      onClick={(event) => {
        event.stopPropagation();
        setIsHintVisible(true);
      }}
      className="cursor-pointer p-1 border border-gray-200 rounded shadow text-center"
      style={{ color: isHintVisible ? 'black' : 'gray' }}
    >
      {isHintVisible ? props.text : '** **** *** ****'}
    </span>
  );
}
