import React, {FC} from 'react';
import styles from './styles.module.scss';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {addOne} from '../../../../entity/card';
import {Field, Form, Formik} from 'formik';
import {UniqueIdGenerator} from '../../../../shared/lib/generateUniqueId/generateUniqueId';
import clsx from 'clsx';

enum FieldsNames {
  FrontSideTitle = 1,
  FrontSideDescription,
  FrontSideHint,
  BackSideTitle,
  BackSideDescription,
  BackSideHint,
}

type ValuesType = {
  [key in FieldsNames]: string;
}

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
        [FieldsNames.FrontSideTitle]: '',
        [FieldsNames.FrontSideDescription]: '',
        [FieldsNames.FrontSideHint]: '',
        [FieldsNames.BackSideTitle]: '',
        [FieldsNames.BackSideDescription]: '',
        [FieldsNames.BackSideHint]: '',
      }}
      onSubmit={(values: ValuesType, control) => {
        console.log('wgl onSubmit', values, control);
        dispatch(addOne({
          id: UniqueIdGenerator.generateSimpleUniqueId(),
          createdAt: Date.now(),
          sideOne: {
            title: values[FieldsNames.FrontSideTitle],
            description: values[FieldsNames.FrontSideDescription],
            hints: values[FieldsNames.FrontSideHint] ? [values[FieldsNames.FrontSideHint]] : [],
          },
          sideTwo: {
            title: values[FieldsNames.BackSideTitle],
            description: values[FieldsNames.BackSideDescription],
            hints: values[FieldsNames.BackSideHint] ? [values[FieldsNames.BackSideHint]] : [],
          },
        }));

        control.resetForm();
        control.setSubmitting(false);
      }}
    >
      {({errors}) => (
        <Form className={styles.cardEditor}>
          <fieldset className={styles.sideEditor}>
            <legend>Front side</legend>

            <label>
              Title:
              <Field
                name={FieldsNames.FrontSideTitle}
                validate={titleValidator}
                className={clsx(errors[FieldsNames.FrontSideTitle] && styles.fieldError)}
              />
            </label>

            <label>Description: <Field name={FieldsNames.FrontSideDescription} as={'textarea'} /></label>
            <label>Hint: <Field name={FieldsNames.FrontSideHint} /></label>
          </fieldset>

          <fieldset className={styles.sideEditor}>
            <legend>Back side</legend>

            <label>
              Title:
              <Field
                name={FieldsNames.BackSideTitle}
                validate={titleValidator}
                className={clsx(errors[FieldsNames.BackSideTitle] && styles.fieldError)}
              />
            </label>

            <label>Description: <Field name={FieldsNames.BackSideDescription} as={'textarea'} /></label>
            <label>Hint: <Field name={FieldsNames.BackSideHint} /></label>
          </fieldset>
          <button type={'submit'}>Create card</button>
        </Form>
      )}
    </Formik>
  );
};
