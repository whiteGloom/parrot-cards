import React, {FC} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Form, Formik} from 'formik';
import {selectAllTags} from '../../../../entity/tag';
import {Card} from '../cardListItem/card';
import {selectCardsByFilters} from '../../model/selectors/selectCardsByFilters';
import {MainLayout} from '../../../../shared/ui/layouts/main/MainLayout';
import {ButtonDefault, ButtonDefaultTypes} from '../../../../shared/ui/buttons/default/ButtonDefault';
import {LinkButton, LinkButtonDefaultTypes} from '../../../../shared/ui/links/button/LinkButton';
import {ArrowDownToLine, ArrowUpFromLine} from 'lucide-react';
import {LabeledCheckbox} from '../../../../shared/ui/inputs/LabeledCheckbox/LabeledCheckbox';
import {Fieldset} from '../../../../shared/ui/Fieldset/Fieldset';

type ValuesType = {
  tags: string[],
};

export const Home: FC = () => {
  const tags = useSelector(selectAllTags());

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTags = React.useMemo(() => {
    return searchParams.get('tags')?.split(',').filter(t => t.length) || [];
  }, [searchParams]);

  const cards = useSelector(selectCardsByFilters({tagsIds: selectedTags}));

  return (
    <MainLayout>
      <header className={'border p-3 flex flex-col gap-3 rounded bg-gray-50'}>
        <h1 className={'text-3xl font-bold'}>Cards List</h1>

        <nav className={'flex gap-3'}>
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
            <Fieldset className={'max-h-64 overflow-scroll'} legend={'Filter by tags'}>
              <ul className={'flex flex-col gap-1'}>
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <LabeledCheckbox key={tag.id} name={'tags'} value={tag.id} style={{color: tag.color}}>
                      {tag.title}
                    </LabeledCheckbox>
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
    </MainLayout>
  );
};
