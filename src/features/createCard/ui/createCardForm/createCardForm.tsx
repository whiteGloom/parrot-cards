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
  if (!value) {
    return 'Required field';
  }

  return undefined;
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
        console.log('wgl onSubmit', values, control);
        dispatch(addOne({
          id: UniqueIdGenerator.generateSimpleUniqueId(),
          createdAt: Date.now(),
          frontSide: {
            title: values.frontSide.title,
            description: values.frontSide.description,
            hints: values.frontSide.hints.filter((hint) => hint.length),
          },
          backSide: {
            title: values.backSide.title,
            description: values.backSide.description,
            hints: values.backSide.hints.filter((hint) => hint.length),
          },
        }));

        control.resetForm();
        control.setSubmitting(false);
      }}
    >
      {({values, errors}) => (
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
                    {values.frontSide.hints.length && values.frontSide.hints.map((_value, index) => {
                      return (
                        <label key={index}>Hint {index + 1}: <Field name={`frontSide.hints[${index}]`}/></label>
                      );
                    })}

                    {values.frontSide.hints[values.frontSide.hints.length - 1].length ? (
                      <button onClick={() => helpers.insert(values.frontSide.hints.length, '')}>Add hint</button>
                    ) : undefined}
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
                    {values.backSide.hints.length && values.backSide.hints.map((_value, index) => {
                      return (
                        <label key={index}>Hint {index + 1}: <Field name={`backSide.hints[${index}]`}/></label>
                      );
                    })}

                    {values.backSide.hints[values.backSide.hints.length - 1].length ? (
                      <button onClick={() => helpers.insert(values.backSide.hints.length, '')}>Add hint</button>
                    ) : undefined}
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
