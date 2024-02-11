import React, {FC} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {useSelectAllTags} from '../../../entity/tag';
import {CardListItem} from '../../../widgets/card/cardListItem';
import {useSelectCardsIdsByFilters} from '../../../entity/card';
import {LayoutMain} from '../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {ButtonDefault} from '../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {LinkButton, LinkButtonDefaultTypes} from '../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowDownToLine, ArrowUpFromLine} from 'lucide-react';
import {Fieldset} from '../../../shared/ui/fields/Fieldset/Fieldset';
import {TagSelectItem} from '../../../widgets/tagSelectItem';
import {usePageTitle} from '../../../shared/lib/usePageTitle';
import {createRevisePagePath} from '../../../shared/routes/revise';
import {createCreateCardsPagePath} from '../../../shared/routes/createCards';
import {createImportPagePath} from '../../../shared/routes/import';
import {createExportPagePath} from '../../../shared/routes/export';

type ValuesType = {
  tags: string[],
};

export const HomePage: FC = () => {
  usePageTitle('Home');

  const tags = useSelectAllTags();

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTags = React.useMemo(() => {
    return searchParams.get('tags')?.split(',').filter(t => t.length) || [];
  }, [searchParams]);

  const cardsIds = useSelectCardsIdsByFilters(
    React.useMemo(() => ({tagsIds: selectedTags}), [selectedTags])
  );

  return (
    <LayoutMain>
      <header className={'border p-3 flex flex-col gap-3 rounded bg-gray-50'}>
        <h1 className={'text-3xl font-bold'}>Cards List</h1>

        <nav className={'flex gap-3 overflow-x-auto'}>
          <LinkButton theme={LinkButtonDefaultTypes.Accent} to={createCreateCardsPagePath()}>Create new cards</LinkButton>

          <LinkButton to={createImportPagePath()}>
            <ArrowDownToLine className={'h-5'}/> Import
          </LinkButton>

          <LinkButton to={createExportPagePath()}>
            <ArrowUpFromLine className={'h-5'}/> Export
          </LinkButton>
        </nav>
      </header>

      <section className={'flex flex-col p-3 gap-3 border rounded bg-gray-50'}>
        <Formik
          initialValues={{tags: selectedTags}}
          onSubmit={(values: ValuesType, control) => {
            if (values.tags.length) {
              searchParams.set('tags', values.tags.join(','));
            } else {
              searchParams.delete('tags');
            }

            setSearchParams(searchParams);

            control.setSubmitting(false);
          }}
        >
          <Form className={'flex flex-col gap-3 '}>
            <h2 className={'text-xl font-bold'}>Filters</h2>

            <Fieldset className={'max-h-64 overflow-auto'} legend={'Tags'}>
              <ul className={'flex flex-col gap-1'}>
                {!tags.length && 'No tags available yet'}

                {tags.map((tag) => (
                  <li key={tag.id}>
                    <TagSelectItem tagId={tag.id} name={'tags'}/>
                  </li>
                ))}
              </ul>
            </Fieldset>

            <ButtonDefault type={'submit'} className={'self-start'}>Apply filters</ButtonDefault>
          </Form>
        </Formik>
      </section>

      <section className={'flex flex-col p-3 gap-3 border rounded bg-gray-50'}>
        <h2 className={'text-xl font-bold'}>Result: {cardsIds.length} items</h2>

        {!!cardsIds.length && (
          <LinkButton
            theme={LinkButtonDefaultTypes.Accent}
            to={createRevisePagePath({cardId: cardsIds[0], tags: selectedTags.join(',')})}
            className={'flex gap-0.5 justify-center self-start'}
          >Revise from start</LinkButton>
        )}

        <ul className={'flex flex-col gap-3'}>
          {!cardsIds.length && 'No cards available yet'}

          {cardsIds.map((cardId) => (
            <li key={cardId}>
              <CardListItem
                cardId={cardId}
                filters={{tags: selectedTags}}
              />
            </li>
          ))}
        </ul>
      </section>
    </LayoutMain>
  );
};
