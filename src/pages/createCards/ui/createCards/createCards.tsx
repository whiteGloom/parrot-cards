import React, {FC} from 'react';
import {addOne} from '../../../../entity/card';
import {Link} from 'react-router-dom';
import styles from './styles.module.scss';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {UniqueIdGenerator} from '../../../../shared/lib/generateUniqueId/generateUniqueId';
import {Field, FieldArray, Form, Formik, FormikHelpers, FormikProvider, useFormik} from 'formik';
import clsx from 'clsx';
import {useSelector} from 'react-redux';
import {addOneTag, selectAllTags} from '../../../../entity/tag';
import {create} from 'node:domain';

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

function tagTitleValidator(value: string, touched: boolean): string | undefined {
  if (!value.trim() && touched) {
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
  const firstFieldRef = React.createRef<HTMLInputElement>();
  const tagsTitleFieldRef = React.createRef<HTMLInputElement>();
  const isTitleFieldFocused = React.useRef<boolean>(false);

  const tags = useSelector(selectAllTags());

  async function createTag(values: ValuesType, formControl: FormikHelpers<ValuesType>) {
    const id = UniqueIdGenerator.generateSimpleUniqueId();

    dispatch(addOneTag({
      id,
      createdAt: Date.now(),
      title: values.newTagTitle.trim(),
      connectedCardsIds: [],
    }));

    await formControl.setFieldValue('tags', [...values.tags, id]);
    await formControl.setFieldValue('newTagTitle', '');
    await formControl.setFieldTouched('newTagTitle', false);
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

          if (isTitleFieldFocused.current) {
            await createTag(values, control);
            control.setSubmitting(false);

            return;
          }

          dispatch(addOne({
            id: UniqueIdGenerator.generateSimpleUniqueId(),
            createdAt: Date.now(),
            frontSide: prepareDataFromSideFields(values[GroupNames.FrontSide]),
            backSide: prepareDataFromSideFields(values[GroupNames.BackSide]),
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
                    <legend>
                      <Field type={'checkbox'} name={'tags'} value={tag.id} />
                      {tag.title}
                    </legend>
                  </li>
                ))}

                <div>
                  <label>
                    {'New tag: '}
                    <Field
                      name={'newTagTitle'}
                      validate={(value: string) => tagTitleValidator(value, !!formState.touched.newTagTitle)}
                      innerRef={tagsTitleFieldRef}
                      placeholder={'Enter title of new tag'}
                    />
                  </label>
                  <button type={'button'} disabled={!!tagTitleValidator(formState.values.newTagTitle, true) || formState.isSubmitting} onClick={() => {
                    formState.setSubmitting(true);
                    createTag(formState.values, formState).then(() => formState.setSubmitting(false), null);
                  }}>Create new Tag</button>
                </div>
              </ul>
            </fieldset>
          </Form>
        )}
      </Formik>
    </div>
  );
};
