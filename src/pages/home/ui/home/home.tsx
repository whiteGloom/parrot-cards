import React, {FC} from 'react';
import {useSearchParams} from 'react-router-dom';
import {Form, Formik} from 'formik';
import {useSelectAllTags} from '../../../../entity/tag';
import {Card} from '../cardListItem/card';
import {useSelectCardsByFilters} from '../../model/selectors/selectCardsByFilters';
import {LayoutMain} from '../../../../shared/ui/layouts/LayoutMain/LayoutMain';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/ButtonDefault/ButtonDefault';
import {LinkButton, LinkButtonDefaultTypes} from '../../../../shared/ui/links/LinkButton/LinkButton';
import {ArrowDownToLine, ArrowUpFromLine} from 'lucide-react';
import {Fieldset} from '../../../../shared/ui/fields/Fieldset/Fieldset';
import {TagSelectItem} from '../../../../widgets/tagSelectItem';

type ValuesType = {
  tags: string[],
};

export const Home: FC = () => {
  const tags = useSelectAllTags();

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTags = React.useMemo(() => {
    return searchParams.get('tags')?.split(',').filter(t => t.length) || [];
  }, [searchParams]);

  const cards = useSelectCardsByFilters(
    React.useMemo(() => ({tagsIds: selectedTags}), [selectedTags])
  );

  return (
    <LayoutMain>
      <header className={'border p-3 flex flex-col gap-3 rounded bg-gray-50'}>
        <h1 className={'text-3xl font-bold'}>Cards List</h1>

        <nav className={'flex gap-3 overflow-x-auto'}>
          <LinkButton theme={LinkButtonDefaultTypes.Accent} to={'/create-cards'}>Create new cards</LinkButton>

          <LinkButton to={'/import'} className={'flex gap-0.5 items-center'}>
            <ArrowDownToLine className={'h-5'}/> Import
          </LinkButton>

          <LinkButton to={'/export'} className={'flex gap-0.5 items-center'}>
            <ArrowUpFromLine className={'h-5'}/> Export
          </LinkButton>
        </nav>
      </header>

      <section className={'flex flex-col p-3 gap-7 border rounded bg-gray-50'}>
        <Formik
          initialValues={{tags: selectedTags}}
          onSubmit={(values: ValuesType, control) => {
            searchParams.set('tags', values.tags.length ? values.tags.join(',') : '');
            setSearchParams(searchParams);

            control.setSubmitting(false);
          }}
        >
          <Form className={'flex flex-col gap-3 '}>
            <Fieldset className={'max-h-64 overflow-auto'} legend={'Filter by tags'}>
              <ul className={'flex flex-col gap-1'}>
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <TagSelectItem tagId={tag.id} name={'tags'}/>
                  </li>
                ))}
              </ul>
            </Fieldset>

            <ButtonDefault theme={ButtonDefaultTypes.Accent} type={'submit'}>Apply filters</ButtonDefault>
          </Form>
        </Formik>

        <ul className={'flex flex-col gap-3'}>
          {!cards.length ? (
            'No cards available yet'
          ) : undefined}

          {cards.map((card) => (
            <li key={card.id}>
              <Card cardData={card}/>
            </li>
          ))}
        </ul>
      </section>
    </LayoutMain>
  );
};
