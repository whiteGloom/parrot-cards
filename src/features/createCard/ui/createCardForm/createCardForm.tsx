import React, {FC} from 'react';
import styles from './styles.module.scss';
import {useAppDispatch} from '../../../../shared/hooks/useAppDispatch';
import {addOne} from '../../../../entity/card';
import {Field, Form, Formik} from 'formik';
import {v4 as UUIDGenerator} from 'uuid';

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

export const CreateCardForm: FC = () => {
  const dispatch = useAppDispatch();

  return (
    <Formik
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
          id: UUIDGenerator(),
          createdAt: Date.now(),
          sideOne: {
            title: values[FieldsNames.FrontSideTitle],
            description: values[FieldsNames.FrontSideDescription],
            hints: [values[FieldsNames.FrontSideHint]],
          },
          sideTwo: {
            title: values[FieldsNames.BackSideTitle],
            description: values[FieldsNames.BackSideDescription],
            hints: [values[FieldsNames.BackSideHint]],
          },
        }));

        control.setSubmitting(false);
      }}
    >
      <Form className={styles.cardEditor}>
        <fieldset className={styles.sideEditor}>
          <legend>Front side</legend>
          <label>Title: <Field name={FieldsNames.FrontSideTitle} /></label>
          <label>Description: <Field name={FieldsNames.FrontSideDescription} /></label>
          <label>Hint: <Field name={FieldsNames.FrontSideHint} /></label>
        </fieldset>

        <fieldset className={styles.sideEditor}>
          <legend>Back side</legend>
          <label>Title: <Field name={FieldsNames.BackSideTitle} /></label>
          <label>Description: <Field name={FieldsNames.BackSideDescription} /></label>
          <label>Hint: <Field name={FieldsNames.BackSideHint} /></label>
        </fieldset>
        <button type={'submit'}>Create card</button>
      </Form>
    </Formik>
  );
};
