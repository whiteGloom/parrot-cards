import { createFileRoute, redirect } from '@tanstack/react-router';
import { useExplicitRevisesStore } from '../stores/explicitRevises.ts';
import { useMemo } from 'react';
import { useCardsStore } from '../stores/cardsStore.ts';

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

  if (!filteredCardsIds.length) {
    return <div>No cards found</div>;
  }

  return (
    <div>
      {filteredCardsIds.map(cardId => (
        <div
          key={cardId}
        >
          {cardsStoreState.cards[cardId].knownLanguageSide.title}
        </div>
      ))}
    </div>
  );
}
