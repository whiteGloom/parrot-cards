import React, {FC} from 'react';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';
import {useAppDispatch} from '../../../../shared/lib/store/useAppDispatch';
import {Field, FieldArray, Form, Formik, FormikHelpers} from 'formik';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {addOneTag, selectAllTags} from '../../../../entity/tag';
import {createCard} from '../../../../features/card/createCard';
import {createTag} from '../../../../features/tag/createTag';

enum GroupNames {
  FrontSide='frontSide',
  BackSide='backSide',
}

type ValuesType = {
  [GroupNames.FrontSide]: {
    title: string;
    description: string;
    hints: string[];
  };
  [GroupNames.BackSide]: {
    title: string;
    description: string;
    hints: string[];
  };
  tags: string[];
  newTagTitle: string,
};

function titleValidator(value: string): string | undefined {
  if (!value.trim()) {
    return 'Title is required field for both sides of Card';
  }

  return undefined;
}

function tagTitleValidator(value: string): string | undefined {
  if (!value.trim()) {
    return 'Title is required for Tag';
  }

  return undefined;
}

function prepareDataFromSideFields(sideFields: ValuesType['frontSide']) {
  return {
    title: sideFields.title.trim(),
    description: sideFields.description.trim(),
    hints: sideFields.hints.reduce((acc: string[], hint) => {
      const valueTrimmed = hint.trim();

      if (valueTrimmed.length) {
        acc.push(valueTrimmed);
      }

      return acc;
    }, []),
  };
}

const emptyInitialValues: ValuesType = {
  frontSide: {
    title: '',
    description: '',
    hints: [''],
  },
  backSide: {
    title: '',
    description: '',
    hints: [''],
  },
  tags: [],
  newTagTitle: '',
};

export const CreateCards: FC = () => {
  const dispatch = useAppDispatch();
  const firstFieldRef = React.useRef<HTMLInputElement>();
  const newTagTitleInputRef = React.useRef<HTMLInputElement>();

  const tags = useSelector(selectAllTags());

  async function createNewTag(values: ValuesType, formControl: FormikHelpers<ValuesType>) {
    formControl.setSubmitting(true);

    const title = values.newTagTitle.trim();

    await dispatch(createTag({
      title: values.newTagTitle.trim(),
      connectedCardsIds: [],
    }));

    await formControl.setFieldValue('newTagTitle', '');
    if (!values.tags.includes(title)) {
      await formControl.setFieldValue('tags', [...values.tags, title]);
    }

    newTagTitleInputRef.current?.focus();

    formControl.setSubmitting(false);
  }

  return (
    <div className={styles.wrapper}>
      <header className={styles.header}>
        <Link to={'/'}>⬅️</Link>
        <h1>Create Cards</h1>
      </header>

      <Formik
        validateOnChange={false}
        validateOnBlur={false}
        initialValues={emptyInitialValues}
        onSubmit={async (values: ValuesType, control) => {
          console.log('CreateCardForm onSubmit', values); // TODO REMOVE

          await dispatch(createCard({
            frontSide: prepareDataFromSideFields(values[GroupNames.FrontSide]),
            backSide: prepareDataFromSideFields(values[GroupNames.BackSide]),
            tagsIds: values.tags,
          }));

          control.resetForm();
          firstFieldRef.current?.focus();

          control.setSubmitting(false);
        }}
        validate={(a) => {
          console.log('wgl', a);
        }}
      >
        {(formState) => (
          <Form className={styles.cardEditor}>
            <div className={styles.sidesWrapper}>
              {[{groupName: GroupNames.FrontSide, title: 'Front side'}, {groupName: GroupNames.BackSide, title: 'Back side'}]
                .map((sideGroupParams, groupIndex) => {
                  const groupName = sideGroupParams.groupName;

                  return (
                    <fieldset className={styles.sideEditor} key={groupName}>
                      <legend>{sideGroupParams.title}</legend>

                      <label>
                        {'Title: '}
                        <Field
                          name={`${groupName}.title`}
                          validate={titleValidator}
                          autoFocus={!groupIndex}
                          innerRef={!groupIndex ? firstFieldRef : undefined}
                          className={clsx(formState.errors[groupName]?.title && styles.fieldError)}
                        />
                      </label>

                      <label>Description: <Field name={`${groupName}.description`} as={'textarea'} /></label>

                      <FieldArray
                        name={`${groupName}.hints`}
                        render={(helpers) => {
                          return (
                            <>
                              {formState.values[groupName].hints.map((_value, index) => {
                                return (
                                  <label key={index}>
                                    {`Hint ${index + 1}: `}
                                    <Field
                                      name={`${groupName}.hints[${index}]`}
                                      onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                                        await formState.setFieldValue(`${groupName}.hints[${index}]`, event.target.value);

                                        if (event.target.value && formState.values[groupName].hints.length - 1 === index) {
                                          helpers.push('');
                                        }
                                      }}
                                    />
                                  </label>
                                );
                              })}
                            </>
                          );
                        }}
                      />
                    </fieldset>
                  );
                })
              }
            </div>

            <button type={'submit'} disabled={formState.isSubmitting || formState.isValidating}>Create card</button>

            <fieldset>
              <legend>Add tags</legend>
              <ul style={{listStyle: 'none'}}>
                {tags.map((tag) => (
                  <li key={tag.id}>
                    <label>
                      <Field type={'checkbox'} name={'tags'} value={tag.id} />
                      {tag.title}
                    </label>
                  </li>
                ))}

                <div>
                  <label>
                    {'New tag: '}
                    <Field
                      name={'newTagTitle'}
                      onKeyDown={(event: KeyboardEvent) => {
                        if (event.key === 'Enter') {
                          event.preventDefault();

                          if (!tagTitleValidator(formState.values.newTagTitle)) {
                            createNewTag(formState.values, formState).catch(null);
                          }
                        }
                      }}
                      innerRef={newTagTitleInputRef}
                      placeholder={'Enter title of new tag'}
                    />
                  </label>

                  <button
                    type={'button'}
                    disabled={!!tagTitleValidator(formState.values.newTagTitle) || formState.isSubmitting}
                    onClick={() => {createNewTag(formState.values, formState).catch(null);}}
                  >
                    Create new Tag
                  </button>
                </div>
              </ul>
            </fieldset>
          </Form>
        )}
      </Formik>
    </div>
  );
};
