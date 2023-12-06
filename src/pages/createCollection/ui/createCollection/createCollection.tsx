import React, {FC} from 'react';
import styles from './styles.module.scss';
import {Link} from 'react-router-dom';
import {Field, Formik, Form} from 'formik';
import {useSelector} from 'react-redux';
import {addOne as addOneCollection, ICollection, selectAllCollections} from '../../../../entity/collection';
import {selectAllCards} from '../../../../entity/card';
import {UniqueIdGenerator} from '../../../../shared/lib/generateUniqueId/generateUniqueId';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';


export type ValuesType = {
  title: string,
  description: string,
  collections: string[],
  cards: string[],
}

function titleValidator(value: string): string | undefined {
  if (!value.trim().length) {
    return 'Title is required';
  }

  return undefined;
}

export const CreateCollection: FC = () => {
  const collections = useSelector(selectAllCollections());
  const cards = useSelector(selectAllCards());
  const dispatch = useAppDispatch();
  const firstFieldRef = React.createRef<HTMLInputElement>();

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to={'/'}>⬅️</Link>
        <h1>Create collection</h1>
      </header>
      <Formik
        initialValues={{
          title: '',
          description: '',
          collections: [],
          cards: [],
        }}
        onSubmit={(values: ValuesType, control) => {
          console.log('wgl values of collection creation form', values);

          const content: ICollection['content'] = [];

          values.collections.reduce((acc, collectionId) => {
            acc.push({id: collectionId, type: 'collection'});

            return acc;
          }, content);

          values.cards.reduce((acc, cardId) => {
            acc.push({id: cardId, type: 'collection'});

            return acc;
          }, content);

          dispatch(addOneCollection({
            title: values.title.trim(),
            description: values.description.trim(),
            createdAt: Date.now(),
            id: UniqueIdGenerator.generateSimpleUniqueId(),
            content,
          }));

          control.resetForm();
          firstFieldRef.current?.focus();

          control.setSubmitting(false);
        }}
      >
        {(formState) => {
          return (
            <Form className={styles.form}>
              <label>{'Title: '}<Field name={'title'} validate={titleValidator} innerRef={firstFieldRef}/></label>
              <label>{'Description: '}<Field name={'description'}/></label>
              <button type={'submit'} disabled={formState.isSubmitting || formState.isValidating}>Save</button>

              <fieldset style={{height: 600, width: '100%', overflow: 'auto', border: '1px solid black', padding: 10, gap: 10, display: 'flex', flexDirection: 'column'}}>
                {cards.length || collections.length ? (
                  <>
                    <legend>Add content to collection</legend>
                    {collections.map((collection) => {
                      return (
                        <div key={collection.id} style={{background: 'lightblue'}}>
                          <label>
                            <Field type={'checkbox'} name={'collections'} value={collection.id}/>
                            {`Collection: ${collection.title}`}
                          </label>
                        </div>
                      );
                    })}
                    {cards.map((card) => {
                      return (
                        <div key={card.id} style={{background: 'orange'}}>
                          <label>
                            <Field type={'checkbox'} name={'cards'} value={card.id}/> Card
                            <p>{card.frontSide.title}</p>
                            <p>{card.backSide.title}</p>
                          </label>
                        </div>
                      );
                    })}
                  </>
                ) : (
                  <p>No content to add</p>
                )}
              </fieldset>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
};
