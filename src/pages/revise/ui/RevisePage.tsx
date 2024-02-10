import React, {FC} from 'react';
import {Navigate, useParams, useSearchParams} from 'react-router-dom';
import {useSelectCardsIdsByFilters} from '../../../entity/card';
import {LayoutMain} from '../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {LinkButton, LinkButtonDefaultTypes} from '../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowLeft} from 'lucide-react';
import {CardReviseItem} from '../../../widgets/card/cardReviseItem';
import {usePageTitle} from '../../../shared/lib/usePageTitle';
import {createHomePagePath} from '../../../shared/routes/home';
import {createRevisePagePath} from '../../../shared/routes/revise';
import {ButtonDefault, ButtonDefaultTypes} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';

export const RevisePage: FC = () => {
  usePageTitle('Revise cards');

  const [searchParams] = useSearchParams();

  const tagsIds = searchParams.get('tags')?.split(',').filter(t => t.length) || [];

  const cardsIds = useSelectCardsIdsByFilters({tagsIds});

  const cardId = useParams().cardId;
  const cardIndex = cardId ? cardsIds.indexOf(cardId) : -1;
  const nextCardIndex = cardIndex + 1 < cardsIds.length ? cardIndex + 1 : 0;

  if (!cardId) {
    return (
      <Navigate to={createHomePagePath()}/>
    );
  }

  return (
    <LayoutMain>
      <header className={'flex gap-3 p-3 bg-gray-50 rounded border'}>
        <LinkButton to={createHomePagePath()}><ArrowLeft/></LinkButton>
        <h1 className={'text-3xl font-bold'}>Revise</h1>
      </header>

      <section className={'flex flex-col p-3 gap-3 border rounded bg-gray-50'}>
        <div className={'flex flex-col gap-3 items-center'}>
          <p className={'font-bold text-xl'}>{cardIndex + 1} of {cardsIds.length}</p>

          <div className={'flex gap-3'}>
            {cardIndex
              ? <LinkButton
                to={createRevisePagePath({cardId: cardsIds[cardIndex - 1], tags: tagsIds.join(',')})}
                theme={LinkButtonDefaultTypes.Accent}
              >Previous Card</LinkButton>
              : <ButtonDefault disabled theme={ButtonDefaultTypes.Accent}>Previous Card</ButtonDefault>
            }

            {nextCardIndex !== cardIndex
              ? <LinkButton
                to={createRevisePagePath({cardId: cardsIds[nextCardIndex], tags: tagsIds.join(',')})}
                theme={LinkButtonDefaultTypes.Accent}
              >{!nextCardIndex ? 'Again' : 'Next Card'}</LinkButton>
              : <ButtonDefault disabled theme={ButtonDefaultTypes.Accent}>Next Card</ButtonDefault>
            }
          </div>

          {cardsIds.includes(cardId) ? (
            <CardReviseItem cardId={cardId} key={cardId}/>
          ) : <div className={'bg-white p-3 border shadow rounded font-bold'}>Card no found!</div>}
        </div>
      </section>
    </LayoutMain>
  );
};
