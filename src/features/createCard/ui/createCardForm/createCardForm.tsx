import React, {FC} from 'react';
import styles from './styles.module.scss';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {addOne} from '../../../../entity/card';
import {Field, FieldArray, Form, Formik} from 'formik';
import {UniqueIdGenerator} from '../../../../shared/lib/generateUniqueId/generateUniqueId';
import clsx from 'clsx';

enum GroupNames {
  FrontSide='frontSide',
  BackSide='backSide',
}

type ValuesType = {
  [GroupNames.FrontSide]: {
    title: string;
    description: string;
    hints: string[];
  },
  [GroupNames.BackSide]: {
    title: string;
    description: string;
    hints: string[];
  }
};

function titleValidator(value: string): string | undefined {
  if (!value.trim()) {
    return 'Title is required field for both sides of Card';
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

export const CreateCardForm: FC = () => {
  const firstFieldRef = React.createRef<HTMLInputElement>();
  const dispatch = useAppDispatch();

  return (
    <Formik
      validateOnChange={false}
      validateOnBlur={false}
      initialValues={{
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
      }}
      onSubmit={(values: ValuesType, control) => {
        console.log('CreateCardForm onSubmit', values); // TODO REMOVE

        dispatch(addOne({
          id: UniqueIdGenerator.generateSimpleUniqueId(),
          createdAt: Date.now(),
          frontSide: prepareDataFromSideFields(values.frontSide),
          backSide: prepareDataFromSideFields(values.backSide),
        }));

        control.resetForm();
        control.setSubmitting(false);

        firstFieldRef.current?.focus();
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
        </Form>
      )}
    </Formik>
  );
};
