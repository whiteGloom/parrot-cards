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
import {LabeledCheckbox} from '../../../../shared/ui/inputs/labeledCheckbox/LabeledCheckbox';

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
      <header className={'border p-3 flex flex-col gap-3 rounded bg-[#F7F7F7]'}>
        <h1 className={'text-3xl font-bold'}>Cards List</h1>

        <nav className={'flex gap-3'}>
          <LinkButton theme={LinkButtonDefaultTypes.Accent} to={'/create-cards'}>Create new cards</LinkButton>

          <ButtonDefault disabled className={'flex gap-0.5 items-center'}>
            <ArrowDownToLine className={'h-5'}/> Import
          </ButtonDefault>

          <LinkButton to={'/export'} className={'flex gap-0.5 items-center'}>
            <ArrowUpFromLine className={'h-5'}/> Export
          </LinkButton>
        </nav>
      </header>

      <div className={'flex flex-col p-3 gap-7 border rounded bg-[#F7F7F7]'}>
        <Formik
          initialValues={{tags: selectedTags}}
          onSubmit={(values: ValuesType, control) => {
            searchParams.set('tags', values.tags.length ? values.tags.join(',') : '');
            setSearchParams(searchParams);

            control.setSubmitting(false);
          }}
        >
          <Form className={'flex flex-col gap-3 '}>
            <fieldset className={'flex flex-col shadow-inner border gap-1 p-3 rounded bg-white max-h-64 overflow-scroll'} draggable>
              <legend className={'font-semibold'}>Filter by tags</legend>

              <ul className={'flex flex-col gap-1'}>
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <LabeledCheckbox key={tag.id} name={'tags'} title={tag.title} value={tag.id} style={{color: tag.color}}/>
                  </li>
                ))}
              </ul>
            </fieldset>

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
      </div>
    </MainLayout>
  );
};
