import React, {FC} from 'react';
import {Link, useSearchParams} from 'react-router-dom';
import styles from './styles.module.scss';
import {useSelector} from 'react-redux';
import {Field, Form, Formik} from 'formik';
import {selectAllTags} from '../../../../entity/tag';
import {Card} from '../cardListItem/card';
import {selectCardsByFilters} from '../../model/selectors/selectCardsByFilters';
import {dumpState} from '../../model/actions/dumpState';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {saveToFileSystem} from '../../model/actions/saveToFileSystem';
import {loadFileFromFileSystem} from '../../model/actions/loadFileFromFileSystem';
import {loadState, StateObjectType} from '../../model/actions/loadState';

type ValuesType = {
  tags: string[],
};

export const Home: FC = () => {
  const tags = useSelector(selectAllTags());
  const dispatch = useAppDispatch();
  const [fileToLoad, setFileToLoad] = React.useState<File | undefined>(undefined);

  const [searchParams, setSearchParams] = useSearchParams();

  const selectedTags = React.useMemo(() => {
    return searchParams.get('tags')?.split(',').filter(t => t.length) || [];
  }, [searchParams]);

  const cards = useSelector(selectCardsByFilters({tagsIds: selectedTags}));

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <h1>Cards List</h1>
        <Link to={'/create-cards'}>Create new cards</Link>

        <button
          onClick={() => {
            dispatch(dumpState()).then((s) => {
              saveToFileSystem(JSON.stringify(s.payload), `pcd-${new Date().toLocaleDateString()}.json`, 'application/json');
            }, null);
          }}
        >
          Save to local file
        </button>

        <input
          type={'file'}
          onChange={(e) => {
            setFileToLoad(e.target.files?.[0] || undefined);
          }}
        />
        <button
          disabled={!fileToLoad}
          onClick={() => {
            loadFileFromFileSystem(fileToLoad as File)
              .then(result => dispatch(loadState(JSON.parse(result) as StateObjectType)))
              .catch((err) => console.log('Load from file failed. Reason: ', err));
          }}
        >
          Load cards
        </button>
      </header>

      <Formik
        initialValues={{tags: selectedTags}}
        onSubmit={(values: ValuesType, control) => {
          searchParams.set('tags', values.tags.length ? values.tags.join(',') : '');
          setSearchParams(searchParams);

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
