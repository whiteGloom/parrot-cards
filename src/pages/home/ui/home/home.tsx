import React, {FC} from 'react';
import {useSearchParams} from 'react-router-dom';
import {useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import {selectAllTags} from '../../../../entity/tag';
import {Card} from '../cardListItem/card';
import {selectCardsByFilters} from '../../model/selectors/selectCardsByFilters';
import {MainLayout} from '../../../../shared/ui/layouts/main/MainLayout';
import {ButtonDefault} from '../../../../shared/ui/buttons/default/ButtonDefault';
import {LinkButton} from '../../../../shared/ui/links/button/LinkButton';
import {ArrowDownToLine, ArrowUpFromLine} from 'lucide-react';

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
      <header className={'border p-3 flex flex-col gap-3 rounded bg-[#F7F7F7] '}>
        <div className={'flex justify-between items-end'}>
          <h1 className={'text-3xl font-bold'}>Cards List</h1>
        </div>

        <nav className={'flex gap-3'}>
          <LinkButton to={'/create-cards'}>Create new cards</LinkButton>

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
            <fieldset className={'flex flex-col shadow p-3 rounded bg-white max-h-64 overflow-scroll'}>
              <legend className={'font-semibold'}>Filter by tags</legend>

              {tags.map((tag) => (
                <label key={tag.id} style={{color: tag.color}} className={'flex gap-1'}>
                  <Field type={'checkbox'} name={'tags'} value={tag.id}/>
                  {tag.title}
                </label>
              ))}
            </fieldset>

            <ButtonDefault type={'submit'}>Apply filters</ButtonDefault>
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
