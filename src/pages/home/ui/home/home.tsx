import React, {FC} from 'react';
import {CardsList} from '../../../../features/listCards';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';
import {useSelector} from 'react-redux';
import {cardsSelectors} from '../../../../entity/card/model/slices/cardsSlice';
import {Field, Form, Formik} from 'formik';
import {selectCardsByTags} from '../../../../entity/card';
import {selectAllTags} from '../../../../entity/tag';

export const Home: FC = () => {
  const tags = useSelector(selectAllTags());

  const [selectedTags, setSelectedTags] = React.useState<string[]>([]);

  const allCards = useSelector(cardsSelectors.selectAll);
  const cardsBySelector = useSelector(selectCardsByTags(selectedTags));

  const cards = selectedTags.length ? cardsBySelector : allCards;

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Cards List</h1>
        <Link to={'/create-cards'}>Create new cards</Link>
      </header>
      <Formik
        initialValues={{tags: []}}
        onSubmit={(values: {tags: string[]}, control) => {
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
      <CardsList cards={cards}/>
    </div>
  );
};
