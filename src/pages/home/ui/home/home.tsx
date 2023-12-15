import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';
import {useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import {selectAllTags} from '../../../../entity/tag';
import {Card} from '../cardListItem/card';
import {selectCardsByFilters} from '../../model/selectors/selectCardsByFilters';

type ValuesType = {
  tags: string[],
};

export const Home: FC = () => {
  const tags = useSelector(selectAllTags());

  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const cards = useSelector(selectCardsByFilters({tagsIds: selectedTags}));

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Cards List</h1>
        <Link to={'/create-cards'}>Create new cards</Link>
      </header>

      <Formik
        initialValues={{tags: [], smartFilter: ''}}
        onSubmit={(values: ValuesType, control) => {
          setSelectedTags(values.tags);

          control.setSubmitting(false);
        }}
      >
        <Form>
          <fieldset style={{display: 'flex', flexDirection: 'column'}}>
            <legend>Filter by tags</legend>

            {tags.map((tag) => (
              <label key={tag.id}><Field type={'checkbox'} name={'tags'} value={tag.id}/>{tag.title}</label>
            ))}
          </fieldset>

          <button type={'submit'}>Apply filters</button>
        </Form>
      </Formik>

      <ul className={styles.listCards}>
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
  );
};
