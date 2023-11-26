import React, {FC} from 'react';
import styles from './styles.module.scss';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {addOne} from '../../../../entity/card';
import {Field, FieldArray, Form, Formik} from 'formik';
import {UniqueIdGenerator} from '../../../../shared/lib/generateUniqueId/generateUniqueId';
import clsx from 'clsx';

type ValuesType = {
  frontSide: {
    title: string;
    description: string;
    hints: string[];
  },
  backSide: {
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
        console.log('wgl onSubmit', values, control); // TODO REMOVE

        dispatch(addOne({
          id: UniqueIdGenerator.generateSimpleUniqueId(),
          createdAt: Date.now(),
          frontSide: prepareDataFromSideFields(values.frontSide),
          backSide: prepareDataFromSideFields(values.backSide),
        }));

        control.resetForm();
        control.setSubmitting(false);
      }}
    >
      {({values, setFieldValue, errors}) => (
        <Form className={styles.cardEditor}>
          <fieldset className={styles.sideEditor}>
            <legend>Front side</legend>

            <label>
              Title:
              <Field
                name={'frontSide.title'}
                validate={titleValidator}
                className={clsx(errors.frontSide?.title && styles.fieldError)}
              />
            </label>

            <label>Description: <Field name={'frontSide.description'} as={'textarea'} /></label>

            <FieldArray
              name={'frontSide.hints'}
              render={(helpers) => {
                return (
                  <>
                    {values.frontSide.hints.map((_value, index) => {
                      return (
                        <label key={index}>
                          {`Hint ${index + 1}: `}
                          <Field
                            name={`frontSide.hints[${index}]`}
                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                              await setFieldValue(`frontSide.hints[${index}]`, event.target.value);

                              if (event.target.value && values.frontSide.hints.length - 1 === index) {
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

          <fieldset className={styles.sideEditor}>
            <legend>Back side</legend>

            <label>
              Title:
              <Field
                name={'backSide.title'}
                validate={titleValidator}
                className={clsx(errors.backSide?.title && styles.fieldError)}
              />
            </label>

            <label>Description: <Field name={'backSide.description'} as={'textarea'} /></label>

            <FieldArray
              name={'backSide.hints'}
              render={(helpers) => {
                return (
                  <>
                    {values.backSide.hints.map((_value, index) => {
                      return (
                        <label key={index}>
                          {`Hint ${index + 1}: `}
                          <Field
                            name={`backSide.hints[${index}]`}
                            onChange={async (event: React.ChangeEvent<HTMLInputElement>) => {
                              await setFieldValue(`backSide.hints[${index}]`, event.target.value);

                              if (event.target.value && values.backSide.hints.length - 1 === index) {
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

          <button type={'submit'}>Create card</button>
        </Form>
      )}
    </Formik>
  );
};
