import { createFileRoute, redirect, useNavigate } from '@tanstack/react-router';
import { useExplicitRevisesStore } from '../stores/explicitRevises.ts';
import { useMemo, useRef, useState } from 'react';
import { useCardsStore } from '../stores/cardsStore.ts';
import { Button, ButtonTheme } from '../widgets/buttons';
import { PageContentWrapper } from '../widgets/wrappers/page-content-wrapper.tsx';
import { ArrowRight } from 'lucide-react';
import clsx from 'clsx';

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
  const navigate = useNavigate();

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
  const [defaultVisibleCardSide, setDefaultVisibleCardSide] = useState<'target' | 'known'>('target');
  const [rememberedCardsSet, setRememberedCardsSet] = useState<Set<string>>(new Set());

  if (!filteredCardsIds.length) {
    return (
      <PageContentWrapper>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <p className="text-center text-3xl">
            Revise cards
          </p>
          <p className="text-center text-2xl text-red-600">
            No cards found!
          </p>
        </div>
        <Button
          theme={ButtonTheme.primary}
          onClick={() => {
            navigate({ to: '/' }).catch(null);
          }}
        >
          Go Home
        </Button>
      </PageContentWrapper>
    );
  }

  if (currentCardIndex < 0) {
    return (
      <PageContentWrapper>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
        >
          <p className="text-center text-3xl">
            Revise cards
          </p>
          <p className="text-xl">Settings</p>
          <p>Visible card side:</p>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="revise-mode"
              id="revise-mode-1"
              checked={defaultVisibleCardSide === 'target'}
              value="target"
              onChange={() => { setDefaultVisibleCardSide('target'); }}
            />
            Target language
          </label>
          <label className="flex items-center gap-2">
            <input
              type="radio"
              name="revise-mode"
              id="revise-mode-1"
              checked={defaultVisibleCardSide === 'known'}
              value="known"
              onChange={() => { setDefaultVisibleCardSide('known'); }}
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
      </PageContentWrapper>
    );
  }

  if (currentCardIndex === filteredCardsIds.length) {
    const rememberedCards = Array.from(rememberedCardsSet);
    const forgottenCards = Array.from(filteredCardsIds.filter(cardId => !rememberedCardsSet.has(cardId)));
    return (
      <PageContentWrapper>
        <div
          className="flex flex-col bg-gray-50 p-4 gap-2 justify-center border border-gray-200 rounded"
        >
          <p className="text-center text-3xl">
            Revise results
          </p>
          <div className="flex gap-3">
            <Button
              className="grow"
              onClick={() => {
                setCurrentCardIndex(-1);
                setDefaultVisibleCardSide('target');
                setRememberedCardsSet(new Set());
              }}
            >
              Restart
            </Button>
            <Button
              className="grow"
              theme={ButtonTheme.secondary}
              onClick={() => {
                navigate({ to: '/' }).catch(null);
              }}
            >
              Go Home
            </Button>
          </div>
          {!!rememberedCards.length && (
            <>
              <p className="text-center text-2xl">
                {'Remembered cards: '}
                {rememberedCards.length}
              </p>
              <details>
                <summary>Show cards</summary>
                {rememberedCards.map(cardId => (
                  <p key={cardId}>
                    {cardsStoreState.cards[cardId].knownLanguageSide.title}
                    {' — '}
                    {cardsStoreState.cards[cardId].targetLanguageSide.title}

                  </p>
                ))}
              </details>
            </>
          )}
          {!!forgottenCards.length && (
            <>
              <p className="text-center text-2xl">
                {'Forgotten cards: '}
                {forgottenCards.length}
              </p>
              <details>
                <summary>Show cards</summary>
                {forgottenCards.map(cardId => (
                  <p key={cardId}>
                    {cardsStoreState.cards[cardId].knownLanguageSide.title}
                    {' — '}
                    {cardsStoreState.cards[cardId].targetLanguageSide.title}
                  </p>
                ))}
              </details>
            </>
          )}
        </div>
      </PageContentWrapper>
    );
  }

  const cardId = filteredCardsIds[currentCardIndex];

  return (
    <PageContentWrapper>
      <div
        className="flex flex-col bg-gray-50 p-4 gap-4 justify-center border border-gray-200 rounded"
      >
        <p className="text-center text-3xl">
          Revise cards
        </p>
        <p className="text-center">
          {'Card '}
          {currentCardIndex + 1}
          {' of '}
          {filteredCardsIds.length}
        </p>
        <div className="flex gap-2 items-stretch">
          <Card
            key={`${cardId}-1`}
            cardId={cardId}
            side={defaultVisibleCardSide}
            isVisible={true}
            className="grow basis-0 shrink-0"
          />
          <ArrowRight className="self-center" />
          <Card
            key={`${cardId}-2`}
            cardId={cardId}
            side={defaultVisibleCardSide === 'known' ? 'target' : 'known'}
            isVisible={false}
            className="grow basis-0 shrink-0"
          />
        </div>
        <div className="flex gap-2">
          <Button
            className="grow basis-0"
            theme={ButtonTheme.warning}
            onClick={() => {
              setCurrentCardIndex(currentCardIndex + 1);
            }}
          >
            I do not remember it
          </Button>
          <Button
            className="grow basis-0"
            onClick={() => {
              setCurrentCardIndex(currentCardIndex + 1);
              setRememberedCardsSet(new Set([...rememberedCardsSet, cardId]));
            }}
          >
            I remember it
          </Button>
        </div>
      </div>
    </PageContentWrapper>
  );
}

function generateFakeTitle() {
  const length = Math.floor(Math.random() * 12) + 3;
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
    if (i != i - 1 && Math.random() < 0.1) {
      result += ' ';
    }
  }
  return result;
}

function Card(props: {
  cardId: string
  side?: 'target' | 'known'
  isVisible: boolean
  onReveal?: () => void
  className?: string
}) {
  const cardsStoreState = useCardsStore();
  const card = cardsStoreState.cards[props.cardId];
  const [isVisible, setIsVisible] = useState(props.isVisible);

  const fakeTitle = useRef(generateFakeTitle());
  const fakeDescription = useRef(generateFakeTitle());

  if (!card) {
    return (
      <div>
        Card not found
      </div>
    );
  }

  const cardSideData = props.side == 'known' ? card.knownLanguageSide : card.targetLanguageSide;

  return (
    <div
      onClick={() => {
        if (!isVisible) {
          setIsVisible(true);
          props.onReveal?.();
        }
      }}
      className={clsx([
        'flex flex-col gap-2 p-4 border border-gray-200 rounded shadow-md',
        !props.isVisible && 'cursor-pointer',
        props.className])}
    >
      <p className="text-center uppercase text-sm text-gray-600">{props.side == 'known' ? 'Known language' : 'Target language'}</p>
      <p className={clsx(['text-center text-2xl', !isVisible && 'blur-sm'])}>{isVisible ? cardSideData.title : fakeTitle.current}</p>
      {cardSideData.description && <p className={clsx(['text-center', !isVisible && 'blur-sm'])}>{isVisible ? cardSideData.description : fakeDescription.current}</p>}
      {props.isVisible && !!cardSideData.hints.length && (
        <>
          <p className="text-center text-gray-600">Hints:</p>
          {cardSideData.hints.map(hint => (
            <Hint key={hint} text={hint} isVisibleByDefault={false} />
          ))}
        </>
      )}
    </div>
  );
}

function Hint(props: { text: string, isVisibleByDefault: boolean }) {
  const [isHintVisible, setIsHintVisible] = useState(props.isVisibleByDefault);
  const fakeTitle = useRef(generateFakeTitle());

  return (
    <p
      className={clsx(['p-1 border border-gray-200 rounded  text-center overflow-hidden', !isHintVisible && 'cursor-pointer'])}
      onClick={(event) => {
        event.stopPropagation();
        setIsHintVisible(true);
      }}
    >
      <span
        className={clsx([!isHintVisible && 'blur-sm'])}
        style={{ color: isHintVisible ? 'black' : 'gray' }}
      >
        {isHintVisible ? props.text : fakeTitle.current}
      </span>
    </p>
  );
}
